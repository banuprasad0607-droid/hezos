import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { ImageCropper } from "@/components/ImageCropper";
import { usePageTitle } from "@/hooks/use-school-name";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Wallet,
  Phone,
  Mail,
  Camera,
  User,
} from "lucide-react";
import { whatsappLink } from "@/lib/notify";
import { useTenant } from "@/lib/tenant-context";

export const Route = createFileRoute("/_authenticated/students/$studentId")({
  component: StudentProfile,
});

interface StudentRow {
  id: string;
  full_name: string;
  admission_number: string | null;
  roll_number: string | null;
  photo_url: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  parent_name: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parent_user_id: string | null;
  class_id: string | null;
  school_id: string;
  classes: { name: string } | null;
}

function StudentProfile() {
  const { studentId } = Route.useParams();
  const { currentSchoolId: effectiveSchoolId, loading: tenantLoading } = useTenant();
  usePageTitle("Student Profile");
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [attendance, setAttendance] = useState<Array<{ date: string; status: string }>>([]);
  const [homework, setHomework] = useState<
    Array<{
      id: string;
      title: string;
      subject: string | null;
      due_date: string | null;
      created_at: string;
    }>
  >([]);
  const [remarks, setRemarks] = useState<
    Array<{ id: string; category: string; content: string; created_at: string }>
  >([]);
  const [invoices, setInvoices] = useState<
    Array<{
      id: string;
      title: string;
      period: string;
      amount_due: number;
      amount_paid: number;
      status: string;
      due_date: string | null;
    }>
  >([]);

  const [cropTarget, setCropTarget] = useState<string | null>(null);
  const [updatingPhoto, setUpdatingPhoto] = useState(false);

  const saveProfilePhoto = async (base64: string) => {
    if (!student) return;
    setCropTarget(null);
    setUpdatingPhoto(true);
    try {
      const byteString = atob(base64.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: "image/jpeg" });
      const path = `${student.school_id}/student/${studentId}-${Date.now()}.jpg`;

      const { error: uploadErr } = await supabase.storage
        .from("student-photos")
        .upload(path, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });
      if (uploadErr) throw uploadErr;

      const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
      const photoUrl = pubUrl.publicUrl;

      const { error: dbErr } = await supabase
        .from("students")
        .update({ photo_url: photoUrl })
        .eq("id", studentId)
        .eq("school_id", student.school_id);
      if (dbErr) throw dbErr;

      setStudent({ ...student, photo_url: photoUrl });
      toast.success("Student photo updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile photo.");
    } finally {
      setUpdatingPhoto(false);
    }
  };

  useEffect(() => {
    if (!effectiveSchoolId) return;
    (async () => {
      const { data } = await supabase
        .from("students")
        .select(
          "id, full_name, admission_number, roll_number, photo_url, date_of_birth, gender, address, parent_name, parent_email, parent_phone, parent_user_id, class_id, school_id, classes(name)",
        )
        .eq("id", studentId)
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null)
        .maybeSingle();
      if (!data) return;
      const norm = {
        ...data,
        classes: Array.isArray(data.classes) ? (data.classes[0] ?? null) : data.classes,
      } as StudentRow;
      setStudent(norm);

      const [att, rem, inv, hw] = await Promise.all([
        supabase
          .from("attendance")
          .select("date, status")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("date", { ascending: false })
          .limit(60),
        supabase
          .from("remarks")
          .select("id, category, content, created_at")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(30),
        supabase
          .from("fee_invoices")
          .select("id, title, period, amount_due, amount_paid, status, due_date")
          .eq("student_id", studentId)
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false }),
        norm.class_id
          ? supabase
              .from("homework")
              .select("id, title, subject, due_date, created_at")
              .eq("class_id", norm.class_id)
              .eq("school_id", effectiveSchoolId)
              .order("created_at", { ascending: false })
              .limit(20)
          : Promise.resolve({ data: [] }),
      ]);
      setAttendance(att.data ?? []);
      setRemarks(rem.data ?? []);
      setInvoices((inv.data ?? []) as typeof invoices);
      setHomework((hw.data ?? []) as typeof homework);
    })();
  }, [studentId, effectiveSchoolId]);

  if (!student) {
    if (tenantLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>

            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    return <div className="p-8 text-sm text-muted-foreground">Loading student profile…</div>;
  }

  const present = attendance.filter((a) => a.status === "present").length;
  const attRate = attendance.length ? Math.round((present / attendance.length) * 100) : 0;
  const totalDue = invoices.reduce((s, i) => s + Number(i.amount_due), 0);
  const totalPaid = invoices.reduce((s, i) => s + Number(i.amount_paid), 0);
  const outstanding = totalDue - totalPaid;
  const wa = whatsappLink(
    student.parent_phone,
    `Hello ${student.parent_name ?? ""}, this is regarding ${student.full_name}.`,
  );

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>

          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={student.full_name}
        breadcrumb={
          <Link to="/students" className="inline-flex items-center gap-1 hover:text-foreground">
            <ArrowLeft className="size-3" /> Students
          </Link>
        }
        actions={
          wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 text-sm font-medium bg-[#25D366] text-white rounded-md"
            >
              WhatsApp Parent
            </a>
          ) : null
        }
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Identity card */}
        <section className="bg-card border border-border rounded-xl p-6 flex items-center gap-6">
          <div className="relative group size-20 rounded-full bg-brand/20 text-brand flex items-center justify-center text-2xl font-bold overflow-hidden border border-border shrink-0">
            {student.photo_url ? (
              <img src={student.photo_url} alt="" className="size-full object-cover" />
            ) : (
              student.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            )}

            <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-white">
              <Camera className="size-5 mb-0.5" />
              <span className="text-[9px] uppercase font-bold tracking-wider">
                {updatingPhoto ? "Saving..." : "Update"}
              </span>
              <input
                type="file"
                accept="image/*"
                disabled={updatingPhoto}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => setCropTarget(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Field label="Admission #" value={student.admission_number ?? "—"} mono />
            <Field label="Class" value={student.classes?.name ?? "—"} />
            <Field label="Roll #" value={student.roll_number ?? "—"} />
            <Field label="DOB" value={student.date_of_birth ?? "—"} />
            <Field label="Gender" value={student.gender ?? "—"} />
            <Field label="Parent" value={student.parent_name ?? "—"} />
            <Field
              label="Contact"
              value={
                <div className="text-xs space-y-0.5">
                  {student.parent_email && (
                    <p className="inline-flex items-center gap-1">
                      <Mail className="size-3" />
                      {student.parent_email}
                    </p>
                  )}
                  {student.parent_phone && (
                    <p className="inline-flex items-center gap-1">
                      <Phone className="size-3" />
                      {student.parent_phone}
                    </p>
                  )}
                  {!student.parent_email && !student.parent_phone && "—"}
                </div>
              }
            />
            <Field label="Address" value={student.address ?? "—"} />
          </div>
        </section>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi
            icon={<CalendarCheck className="size-4" />}
            label="Attendance (60d)"
            value={`${attRate}%`}
            hint={`${present}/${attendance.length} present`}
          />
          <Kpi
            icon={<BookOpen className="size-4" />}
            label="Homework posted"
            value={String(homework.length)}
            hint="Last 20 items"
          />
          <Kpi
            icon={<MessageSquare className="size-4" />}
            label="Teacher remarks"
            value={String(remarks.length)}
            hint="Total"
          />
          <Kpi
            icon={<Wallet className="size-4" />}
            label="Outstanding"
            value={`₹${outstanding.toFixed(0)}`}
            hint={`Of ₹${totalDue.toFixed(0)} billed`}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance heatmap */}
          <Card title="Attendance — last 60 days">
            <div className="flex flex-wrap gap-1">
              {attendance
                .slice()
                .reverse()
                .map((a) => (
                  <div
                    key={a.date}
                    title={`${a.date} · ${a.status}`}
                    className={`size-5 rounded ${
                      a.status === "present"
                        ? "bg-success"
                        : a.status === "absent"
                          ? "bg-danger"
                          : a.status === "late"
                            ? "bg-warning"
                            : "bg-brand"
                    }`}
                  />
                ))}
              {attendance.length === 0 && (
                <p className="text-sm text-muted-foreground">No records.</p>
              )}
            </div>
          </Card>

          {/* Remarks timeline */}
          <Card title="Remarks timeline">
            {remarks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No remarks yet.</p>
            ) : (
              <div className="space-y-3">
                {remarks.slice(0, 8).map((r) => (
                  <div key={r.id} className="border-l-2 border-brand pl-3">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-brand">
                      {r.category}
                    </p>
                    <p className="text-sm italic mt-0.5">"{r.content}"</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Fees */}
          <Card title="Fee history">
            {invoices.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices.</p>
            ) : (
              <div className="space-y-2">
                {invoices.map((i) => (
                  <div
                    key={i.id}
                    className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{i.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {i.period} · Due {i.due_date ?? "—"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs">
                        ₹{Number(i.amount_paid).toFixed(0)} / ₹{Number(i.amount_due).toFixed(0)}
                      </p>
                      <span
                        className={`text-[10px] uppercase font-semibold ${
                          i.status === "paid"
                            ? "text-success"
                            : i.status === "partial"
                              ? "text-warning"
                              : "text-muted-foreground"
                        }`}
                      >
                        {i.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Homework feed */}
        <Card title="Recent class homework">
          {homework.length === 0 ? (
            <p className="text-sm text-muted-foreground">No homework posted.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {homework.map((h) => (
                <div key={h.id} className="border border-border rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                    {h.subject ?? "General"}
                  </p>
                  <p className="font-medium text-sm">{h.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due {h.due_date ?? "—"} · Posted {new Date(h.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {cropTarget && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-card p-6 rounded-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-3">Crop Profile Photo</h3>
            <ImageCropper
              imageSrc={cropTarget}
              onCrop={saveProfilePhoto}
              onCancel={() => setCropTarget(null)}
              circular
            />
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className={`text-sm font-medium mt-0.5 ${mono ? "font-mono" : ""}`}>{value}</div>
    </div>
  );
}

function Kpi({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}
