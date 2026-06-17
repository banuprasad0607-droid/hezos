import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { ImageCropper } from "@/components/ImageCropper";
import { toast } from "sonner";
import {
  Plus,
  Users,
  Mail,
  Phone,
  ExternalLink,
  Camera,
  User,
  UserCheck,
  ShieldAlert,
  Download,
  Trash,
} from "lucide-react";
import { whatsappLink } from "@/lib/notify";
import { provisionStudent } from "@/lib/platform.functions";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-helper";
import { optimizeImage } from "@/lib/image-optimizer";

function KpiWidget({
  title,
  count,
  subtext,
  icon,
}: {
  title: string;
  count: number;
  subtext: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-xs">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-foreground">{count}</h3>
        <p className="text-[10px] text-muted-foreground">{subtext}</p>
      </div>
      <div className="size-10 bg-secondary rounded-lg flex items-center justify-center">{icon}</div>
    </div>
  );
}

export const Route = createFileRoute("/_authenticated/students")({
  component: StudentsPage,
});

interface Klass {
  id: string;
  name: string;
  grade?: string | null;
  section?: string | null;
}
interface Student {
  id: string;
  full_name: string;
  roll_number: string | null;
  admission_number: string | null;
  parent_email: string | null;
  parent_phone: string | null;
  parent_name: string | null;
  parent_user_id: string | null;
  class_id: string | null;
  photo_url: string | null;
  classes: { name: string } | null;
}

function StudentsPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const schoolId = effectiveSchoolId;

  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;

  usePageTitle("Students & Parents");
  const [classes, setClasses] = useState<Klass[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Search and Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [filterClassId, setFilterClassId] = useState<string>("all");

  // KPI States
  const [totalEnrolled, setTotalEnrolled] = useState(0);
  const [totalPhotos, setTotalPhotos] = useState(0);
  const [missingPhotos, setMissingPhotos] = useState(0);

  // Bulk operation states
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [bulkPhotoOpen, setBulkPhotoOpen] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvUploading, setCsvUploading] = useState(false);

  const [photoFiles, setPhotoFiles] = useState<FileList | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoProgress, setPhotoProgress] = useState({ current: 0, total: 0 });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  const loadKPIs = async () => {
    if (!effectiveSchoolId) return;
    // Total count query
    const { count } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null);

    setTotalEnrolled(count ?? 0);

    const { count: photoCount } = await supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .not("photo_url", "is", null);

    setTotalPhotos(photoCount ?? 0);
    setMissingPhotos((count ?? 0) - (photoCount ?? 0));
  };

  const load = async () => {
    if (!effectiveSchoolId) return;
    setBusy(true);
    try {
      let query = supabase
        .from("students")
        .select(
          "id, full_name, roll_number, admission_number, photo_url, parent_email, parent_phone, parent_name, parent_user_id, class_id, classes(name)",
          { count: "exact" },
        )
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null);

      if (debouncedQ.trim()) {
        query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
      }

      if (filterClassId === "_none") {
        query = query.is("class_id", null);
      } else if (filterClassId !== "all") {
        query = query.eq("class_id", filterClassId);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, count, error } = await query.order("full_name").range(start, end);

      if (error) throw error;

      setTotalCount(count ?? 0);
      setStudents(
        (
          (data ?? []) as unknown as Array<
            Student & { classes: { name: string } | { name: string }[] | null }
          >
        ).map((s) => ({
          ...s,
          classes: Array.isArray(s.classes) ? (s.classes[0] ?? null) : s.classes,
        })),
      );
    } catch (err: any) {
      toast.error(err.message || "Failed to load students.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
    void loadKPIs();
  }, [effectiveSchoolId, debouncedQ, page, filterClassId]);

  useEffect(() => {
    if (!effectiveSchoolId) return;
    supabase
      .from("classes")
      .select("id, name, grade, section")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("name")
      .then(({ data }) => {
        setClasses(data ?? []);
        if (data?.[0] && !classId) setClassId(data[0].id);
      });
  }, [effectiveSchoolId]);

  // Robust CSV parser handling quotes and commas
  const parseCSV = (text: string) => {
    const lines = [];
    let row = [""];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === "," && !inQuotes) {
        row.push("");
      } else if ((c === "\r" || c === "\n") && !inQuotes) {
        if (c === "\r" && next === "\n") {
          i++;
        }
        lines.push(row.map((cell) => cell.trim().replace(/^["']|["']$/g, "")));
        row = [""];
      } else {
        row[row.length - 1] += c;
      }
    }
    if (row.length > 1 || row[0] !== "") {
      lines.push(row.map((cell) => cell.trim().replace(/^["']|["']$/g, "")));
    }
    return lines;
  };

  const handleCSVImport = async (e: FormEvent) => {
    e.preventDefault();
    if (!csvFile || !effectiveSchoolId) return;
    setCsvUploading(true);

    try {
      const text = await csvFile.text();
      const rows = parseCSV(text);
      if (rows.length < 2) {
        throw new Error("CSV file must contain a header row and at least one student data row.");
      }

      const headerRow = rows[0];
      const dataRows = rows.slice(1);

      // Match headers
      const colMap: Record<string, number> = {};
      headerRow.forEach((h, idx) => {
        const name = h.toLowerCase().replace(/[^a-z0-9]/g, "");
        colMap[name] = idx;
      });

      const getVal = (row: string[], keys: string[]) => {
        for (const k of keys) {
          const idx = colMap[k];
          if (idx !== undefined && row[idx]) return row[idx];
        }
        return "";
      };

      const batchStudents = [];
      for (const row of dataRows) {
        if (row.length === 0 || (row.length === 1 && row[0] === "")) continue;

        const fullName = getVal(row, ["fullname", "name", "studentname", "student"]);
        if (!fullName) continue;

        const admissionNo = getVal(row, ["admissionnumber", "admissionno", "admission", "id"]);
        const rollNo = getVal(row, ["rollnumber", "rollno", "roll"]);
        const className = getVal(row, ["class", "classname", "section", "grade"]);
        const parentName = getVal(row, ["parentname", "parent", "fathername", "mothername"]);
        const parentEmail = getVal(row, ["parentemail", "email", "parentmail"]);
        const parentPhone = getVal(row, ["parentphone", "phone", "parentwhatsapp", "whatsapp"]);

        const cls = classes.find((c) => c.name.toLowerCase() === className.toLowerCase());
        const class_id = cls ? cls.id : classes[0]?.id || null;

        batchStudents.push({
          school_id: effectiveSchoolId,
          full_name: fullName,
          admission_number: admissionNo || `ADM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          roll_number: rollNo || null,
          class_id: class_id,
          parent_name: parentName || null,
          parent_email: parentEmail || null,
          parent_phone: parentPhone || null,
          photo_url: null,
        });
      }

      if (batchStudents.length === 0) {
        throw new Error(
          "No valid student rows found in the CSV. Make sure you have a 'name' or 'fullname' header column.",
        );
      }

      const { error } = await supabase.from("students").insert(batchStudents);
      if (error) throw error;

      toast.success(`Successfully imported ${batchStudents.length} students!`);
      setBulkImportOpen(false);
      setCsvFile(null);
      void load();
      void loadKPIs();
    } catch (err: any) {
      toast.error(err.message || "Failed to import CSV.");
    } finally {
      setCsvUploading(false);
    }
  };

  const handleBulkPhotoUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!photoFiles || photoFiles.length === 0 || !effectiveSchoolId) return;
    setPhotoUploading(true);
    setPhotoProgress({ current: 0, total: photoFiles.length });

    let successCount = 0;
    try {
      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i];
        setPhotoProgress((prev) => ({ ...prev, current: i + 1 }));

        const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        const queryTerm = nameWithoutExt.toLowerCase().trim();

        const match = students.find(
          (s) =>
            (s.admission_number && s.admission_number.toLowerCase().trim() === queryTerm) ||
            (s.roll_number && s.roll_number.toLowerCase().trim() === queryTerm) ||
            (s.full_name && s.full_name.toLowerCase().trim() === queryTerm),
        );

        if (!match) continue;

        // Resize and compress avatar before uploading
        const optimizedBlob = await optimizeImage(file, 400, 0.8, 200 * 1024);

        const path = `${effectiveSchoolId}/student/bulk-${match.id}-${Date.now()}.webp`;

        const { error: uploadErr } = await supabase.storage
          .from("student-photos")
          .upload(path, optimizedBlob, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadErr) continue;

        const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);

        const { error: dbErr } = await supabase
          .from("students")
          .update({ photo_url: pubUrl.publicUrl })
          .eq("id", match.id)
          .eq("school_id", effectiveSchoolId);

        if (dbErr) continue;

        successCount++;
      }

      toast.success(`Successfully uploaded and matched ${successCount} student photos!`);
      setBulkPhotoOpen(false);
      setPhotoFiles(null);
      void load();
      void loadKPIs();
    } catch (err: any) {
      toast.error(err.message || "Photo sync encountered errors.");
    } finally {
      setPhotoUploading(false);
    }
  };

  const [fullName, setFullName] = useState("");
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [classId, setClassId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [parentPassword, setParentPassword] = useState("");

  const provisionStudentFn = useServerFn(provisionStudent);

  // Auto-suggest next admission number when opening modal
  useEffect(() => {
    if (!open) return;
    if (admissionNumber) return;
    const year = new Date().getFullYear();
    const existing = students
      .map((s) => s.admission_number)
      .filter((a): a is string => !!a && a.startsWith(`${year}-`))
      .map((a) => parseInt(a.split("-")[1] ?? "0", 10))
      .filter((n) => !Number.isNaN(n));
    const next = (existing.length ? Math.max(...existing) : 0) + 1;
    setAdmissionNumber(`${year}-${String(next).padStart(4, "0")}`);
  }, [open]);

  const [cropTarget, setCropTarget] = useState<string | null>(null);
  const [croppedPhoto, setCroppedPhoto] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!schoolId || !classId) return;
    if (parentPassword && !parentEmail) {
      return toast.error("Enter parent email to create a parent login.");
    }
    if (parentPassword && parentPassword.length < 8) {
      return toast.error("Parent password must be at least 8 characters.");
    }
    setBusy(true);
    try {
      let finalPhotoUrl: string | null = null;
      if (croppedPhoto) {
        // Convert cropped base64 to Blob
        const byteString = atob(croppedPhoto.split(",")[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: "image/jpeg" });
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });

        // Optimize avatar client side
        const optimized = await optimizeImage(file, 300, 0.8, 150 * 1024);
        const path = `${schoolId}/student/admission-${Date.now()}.webp`;

        const { error: uploadErr } = await supabase.storage
          .from("student-photos")
          .upload(path, optimized, {
            contentType: "image/webp",
            cacheControl: "3600",
            upsert: true,
          });
        if (uploadErr) throw uploadErr;

        const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
        finalPhotoUrl = pubUrl.publicUrl;
      }

      const res = await provisionStudentFn({
        data: {
          student: {
            full_name: fullName,
            admission_number: admissionNumber || null,
            roll_number: rollNumber || null,
            class_id: classId,
            photo_url: finalPhotoUrl,
          },
          parent: {
            full_name: parentName || null,
            email: parentEmail || null,
            phone: parentPhone || null,
            password: parentPassword || null,
          },
        },
      });
      toast.success(
        res.parent_account_created
          ? "Student added & parent login created."
          : res.parent_user_id
            ? "Student added & linked to existing parent account."
            : "Student added.",
      );
      setOpen(false);
      setFullName("");
      setAdmissionNumber("");
      setRollNumber("");
      setParentName("");
      setParentEmail("");
      setParentPhone("");
      setParentPassword("");
      setCroppedPhoto(null);
      setCropTarget(null);
      void load();
      void loadKPIs();
    } catch (err: any) {
      toast.error(err instanceof Error ? err.message : "Could not add student");
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    if (!effectiveSchoolId) return;
    toast.info("Preparing data for export...");

    const { data, error } = await supabase
      .from("students")
      .select("admission_number, full_name, roll_number, parent_name, parent_email, parent_phone")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("full_name");

    if (error || !data) {
      return toast.error("Failed to load export data.");
    }

    const headers = [
      "Admission No",
      "Student Name",
      "Roll No",
      "Parent Name",
      "Parent Email",
      "Parent Phone",
    ];
    const rows = data.map((s) => [
      s.admission_number,
      s.full_name,
      s.roll_number,
      s.parent_name,
      s.parent_email,
      s.parent_phone,
    ]);

    if (format === "csv") exportToCSV("Student_Roster", headers, rows);
    else if (format === "excel") exportToExcel("Student_Roster", headers, rows);
    else if (format === "pdf")
      exportToPDF("Student_Roster", "Enrolled Students Directory", headers, rows);
    toast.success("Download started!");
  };

  const handleSoftDelete = async (id: string, name: string) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm(`Are you sure you want to delete ${name}? This will move them to the Recycle Bin.`)
    )
      return;

    try {
      const { error } = await (supabase as any)
        .from("students")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);

      if (error) throw error;

      toast.success(`${name} has been soft-deleted.`);
      void load();
      void loadKPIs();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete student.");
    }
  };

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
        title="Students & Parents"
        breadcrumb={`${totalEnrolled} enrolled`}
        actions={
          <>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, admission #, parent…"
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-card w-64 text-foreground outline-none"
            />
            <button
              onClick={() => setBulkImportOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer"
            >
              Import CSV
            </button>
            <button
              onClick={() => setBulkPhotoOpen(true)}
              className="px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer"
            >
              Upload Photos
            </button>
            <button
              onClick={() => setOpen(true)}
              disabled={classes.length === 0}
              className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="size-4" /> Add Student
            </button>
            <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-card text-card-foreground shrink-0 shadow-xs">
              <button
                onClick={() => handleExport("csv")}
                className="p-1.5 hover:bg-secondary transition-colors"
                title="Export CSV"
              >
                <Download className="size-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold"
                title="Export Excel"
              >
                XLS
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold"
                title="Export PDF"
              >
                PDF
              </button>
            </div>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KpiWidget
            title="Total Students"
            count={totalEnrolled}
            subtext="Enrolled active profiles"
            icon={<Users className="size-5 text-brand" />}
          />
          <KpiWidget
            title="Students with Photos"
            count={totalPhotos}
            subtext="Valid photos"
            icon={<UserCheck className="size-5 text-success" />}
          />
          <KpiWidget
            title="Missing Photos"
            count={missingPhotos}
            subtext="Requires upload"
            icon={<ShieldAlert className="size-5 text-danger" />}
          />
        </div>

        {classes.length > 0 && (
          <div className="mb-5">
            <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
              Filter by class
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setFilterClassId("all");
                  setPage(0);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                  filterClassId === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-border hover:bg-secondary"
                }`}
              >
                All <span className="opacity-70">({totalEnrolled})</span>
              </button>
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setFilterClassId(c.id);
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                    filterClassId === c.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-border hover:bg-secondary"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {busy && students.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Loading records from database...
          </div>
        ) : students.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground">
            <Users className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">
              {totalEnrolled === 0 ? "No students yet" : "No matches"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {classes.length === 0 ? "Create a class first." : "Add your first student."}
            </p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Admission #</th>
                  <th className="px-6 py-3 font-medium">Student</th>
                  <th className="px-6 py-3 font-medium">Class</th>
                  <th className="px-6 py-3 font-medium">Roll</th>
                  <th className="px-6 py-3 font-medium">Parent</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => {
                  const wa = whatsappLink(
                    s.parent_phone,
                    `Hello ${s.parent_name ?? ""}, this is regarding ${s.full_name}.`,
                  );
                  return (
                    <tr key={s.id} className="hover:bg-secondary/40 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-foreground">
                        {s.admission_number ?? "—"}
                      </td>
                      <td className="px-6 py-3 font-medium text-foreground">
                        <Link
                          to="/students/$studentId"
                          params={{ studentId: s.id }}
                          className="hover:text-brand flex items-center gap-3"
                        >
                          <div className="size-8 rounded-full border border-border bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0">
                            {s.photo_url ? (
                              <img
                                src={s.photo_url}
                                alt=""
                                className="size-full object-cover"
                                loading="lazy"
                              />
                            ) : (
                              <User className="size-4 text-slate-400" />
                            )}
                          </div>
                          <span>{s.full_name}</span>
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-muted-foreground">{s.classes?.name ?? "—"}</td>
                      <td className="px-6 py-3 text-muted-foreground">{s.roll_number ?? "—"}</td>
                      <td className="px-6 py-3">
                        <div className="space-y-0.5">
                          {s.parent_name && (
                            <p className="text-xs font-medium text-foreground">{s.parent_name}</p>
                          )}
                          {s.parent_email && (
                            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="size-3" /> {s.parent_email}
                              {s.parent_user_id ? (
                                <span className="ml-1 text-[10px] bg-success-soft text-success px-1.5 py-0.5 rounded font-semibold">
                                  Linked
                                </span>
                              ) : (
                                <span className="ml-1 text-[10px] bg-warning-soft text-warning px-1.5 py-0.5 rounded font-semibold">
                                  Pending
                                </span>
                              )}
                            </p>
                          )}
                          {s.parent_phone && (
                            <p className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="size-3" /> {s.parent_phone}
                            </p>
                          )}
                          {!s.parent_email && !s.parent_phone && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-3 items-center">
                          {wa && (
                            <a
                              href={wa}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-[#25D366] inline-flex items-center gap-1 hover:underline"
                              title="WhatsApp parent"
                            >
                              WhatsApp
                            </a>
                          )}
                          <Link
                            to="/students/$studentId"
                            params={{ studentId: s.id }}
                            className="text-xs font-medium text-brand inline-flex items-center gap-1 hover:underline"
                          >
                            Profile <ExternalLink className="size-3" />
                          </Link>
                          {isAdmin && (
                            <button
                              onClick={() => handleSoftDelete(s.id, s.full_name)}
                              className="text-xs font-medium text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                              title="Delete Student"
                            >
                              <Trash className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 bg-secondary/10 border-t border-border">
              <p className="text-xs text-muted-foreground">
                Showing {totalCount > 0 ? page * pageSize + 1 : 0} to{" "}
                {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} records
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary"
                >
                  Previous
                </button>
                <button
                  disabled={(page + 1) * pageSize >= totalCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-4">
          Parent's email auto-links to their school account on signup. Admission number is unique
          per school.
        </p>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-xl space-y-4 shadow-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="font-semibold text-lg">Add Student</h2>

            {/* Student Photo upload field */}
            <div className="flex flex-col gap-2 p-3 border border-border rounded-lg bg-secondary/20">
              <span className="text-xs font-semibold text-muted-foreground uppercase">
                Student Photo
              </span>
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-full border border-border bg-card overflow-hidden flex items-center justify-center relative shadow-sm shrink-0">
                  {croppedPhoto ? (
                    <img src={croppedPhoto} alt="Preview" className="size-full object-cover" />
                  ) : (
                    <User className="size-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-grow">
                  <label className="px-3 py-1.5 text-xs bg-primary text-primary-foreground font-semibold rounded-md cursor-pointer hover:opacity-90 inline-flex items-center gap-1">
                    <Camera className="size-3.5" /> Select Photo
                    <input
                      type="file"
                      accept="image/*"
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
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Supports JPG, PNG, WEBP. Will be cropped automatically.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-sm font-medium">Full name *</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Admission # *</label>
                <input
                  required
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Roll #</label>
                <input
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium">Class *</label>
                <select
                  required
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                >
                  {classes.map((c) => {
                    const suffix = [c.grade, c.section].filter(Boolean).join(" · ");
                    return (
                      <option key={c.id} value={c.id}>
                        {c.name}
                        {suffix ? ` — ${suffix}` : ""}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Parent / Guardian
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium">Parent name</label>
                  <input
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Parent email</label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Parent WhatsApp #</label>
                  <input
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+919876543210"
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Parent login password</label>
                  <input
                    type="text"
                    value={parentPassword}
                    onChange={(e) => setParentPassword(e.target.value)}
                    placeholder="Min 8 characters — leave blank to skip"
                    className="mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optional. If set together with parent email, a parent login is created so they
                    can sign in and view homework, attendance and remarks.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCroppedPhoto(null);
                  setCropTarget(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer"
              >
                {busy ? "Adding…" : "Add Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      {cropTarget && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-card p-6 rounded-xl w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-base mb-3 text-card-foreground">Crop Student Photo</h3>
            <ImageCropper
              imageSrc={cropTarget}
              onCrop={(cropped) => {
                setCroppedPhoto(cropped);
                setCropTarget(null);
              }}
              onCancel={() => setCropTarget(null)}
              circular
            />
          </div>
        </div>
      )}

      {/* MODAL: BULK CSV IMPORT */}
      {bulkImportOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setBulkImportOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCSVImport}
            className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg"
          >
            <h2 className="font-semibold text-lg">Bulk Student Import (CSV)</h2>
            <p className="text-xs text-muted-foreground">
              Import multiple students instantly. Your CSV should have columns like:{" "}
              <strong>
                name, admission_no, roll_no, class_name, parent_name, parent_email, parent_phone
              </strong>
              .
            </p>
            <div>
              <label className="text-sm font-medium text-foreground">Select CSV File *</label>
              <input
                type="file"
                accept=".csv"
                required
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                className="mt-1 w-full text-xs text-foreground"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setBulkImportOpen(false);
                  setCsvFile(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={csvUploading}
                className="px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer"
              >
                {csvUploading ? "Importing..." : "Run CSV Import"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: BULK PHOTO UPLOAD & SYNC */}
      {bulkPhotoOpen && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setBulkPhotoOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleBulkPhotoUpload}
            className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg"
          >
            <h2 className="font-semibold text-lg">Bulk Photo Sync Upload</h2>
            <p className="text-xs text-muted-foreground">
              Select multiple student photo files. The filename (e.g. <code>2026-0001.jpg</code> or{" "}
              <code>Aarav Sharma.png</code>) must match the student's **admission number**, **roll
              number**, or **full name** case-insensitively.
            </p>
            <div>
              <label className="text-sm font-medium text-foreground">Select Photo Files *</label>
              <input
                type="file"
                multiple
                accept="image/*"
                required
                onChange={(e) => setPhotoFiles(e.target.files)}
                className="mt-1 w-full text-xs text-foreground"
              />
            </div>
            {photoUploading && (
              <div className="space-y-2">
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-brand h-full transition-all duration-300"
                    style={{
                      width: `${Math.round((photoProgress.current / photoProgress.total) * 100)}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-center text-muted-foreground font-semibold">
                  Uploading {photoProgress.current} of {photoProgress.total} photos...
                </p>
              </div>
            )}
            <div className="flex gap-2 justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  setBulkPhotoOpen(false);
                  setPhotoFiles(null);
                }}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={photoUploading || !photoFiles}
                className="px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer"
              >
                {photoUploading ? "Uploading & Syncing..." : "Sync Photos"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
