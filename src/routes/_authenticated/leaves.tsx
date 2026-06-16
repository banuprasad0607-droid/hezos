import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { CalendarCheck, Plus, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/leaves")({
  component: LeavesPage,
});

interface Child { id: string; full_name: string; school_id: string }
interface LeaveRow {
  id: string;
  student_id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  review_note: string | null;
  created_at: string;
  students?: { full_name: string } | null;
}

function LeavesPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isStaff = roles.includes("admin") || roles.includes("teacher") || roles.includes("super_admin");
  const isParent = roles.includes("parent") && !isStaff;
  usePageTitle("Leave Requests");

  const [children, setChildren] = useState<Child[]>([]);
  const [leaves, setLeaves] = useState<LeaveRow[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", start_date: "", end_date: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    if (isParent && user) {
      const { data: kids } = await supabase
        .from("students").select("id, full_name, school_id").eq("parent_user_id", user.id);
      setChildren((kids ?? []) as Child[]);
      
      const kidsMap: Record<string, string> = {};
      (kids ?? []).forEach(k => {
        kidsMap[k.id] = k.full_name;
      });

      const { data } = await supabase
        .from("leave_requests")
        .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
        .eq("parent_user_id", user.id)
        .order("created_at", { ascending: false });
      
      const mapped = (data ?? []).map((l: any) => ({
        ...l,
        students: l.student_id ? { full_name: kidsMap[l.student_id] || "Student" } : null
      }));
      setLeaves(mapped as unknown as LeaveRow[]);
    } else if (isStaff && effectiveSchoolId) {
      const { data: schoolStudents } = await supabase
        .from("students")
        .select("id, full_name")
        .eq("school_id", effectiveSchoolId);

      const studentMap: Record<string, string> = {};
      (schoolStudents ?? []).forEach(s => {
        studentMap[s.id] = s.full_name;
      });

      const { data } = await supabase
        .from("leave_requests")
        .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
        .eq("school_id", effectiveSchoolId)
        .order("created_at", { ascending: false });
      
      const mapped = (data ?? []).map((l: any) => ({
        ...l,
        students: l.student_id ? { full_name: studentMap[l.student_id] || "Student" } : null
      }));
      setLeaves(mapped as unknown as LeaveRow[]);
    }
  }, [isParent, isStaff, user, effectiveSchoolId]);

  useEffect(() => { void load(); }, [load]);

  const submit = async () => {
    if (!user) return;
    const child = children.find((c) => c.id === form.student_id) ?? children[0];
    if (!child) return toast.error("No child linked to your account");
    if (!form.start_date || !form.end_date || !form.reason.trim()) return toast.error("Fill all fields");
    if (form.end_date < form.start_date) return toast.error("End date must be after start date");
    setSubmitting(true);
    const { error } = await supabase.from("leave_requests").insert({
      school_id: child.school_id,
      student_id: child.id,
      parent_user_id: user.id,
      start_date: form.start_date,
      end_date: form.end_date,
      reason: form.reason.trim(),
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Leave request submitted");
    setOpen(false);
    setForm({ student_id: "", start_date: "", end_date: "", reason: "" });
    void load();
  };

  const cancel = async (id: string) => {
    const { error } = await supabase.from("leave_requests").update({ status: "cancelled" }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cancelled");
    void load();
  };

  const review = async (id: string, status: "approved" | "rejected") => {
    if (!user) return;
    const { error } = await supabase
      .from("leave_requests")
      .update({ status, reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Leave ${status}`);
    void load();
  };

  if (tenantLoading) {


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
        title="Leave Requests"
        breadcrumb={isParent ? "Parent" : "Staff"}
        actions={
          isParent ? (
            <button onClick={() => { setForm((f) => ({ ...f, student_id: children[0]?.id ?? "" })); setOpen(true); }}
              className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1">
              <Plus className="size-4" /> Apply for leave
            </button>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto p-8">
        {leaves.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <CalendarCheck className="size-10 text-muted-foreground mx-auto" />
            <h3 className="font-semibold mt-3">No leave requests yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isParent ? "Apply for a leave when your child can't attend school." : "Parent leave requests will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaves.map((l) => (
              <div key={l.id} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{l.students?.full_name ?? "Student"}</p>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {l.start_date}{l.end_date !== l.start_date ? ` → ${l.end_date}` : ""}
                  </p>
                  <p className="text-sm mt-2 italic">"{l.reason}"</p>
                  {l.review_note && <p className="text-xs text-muted-foreground mt-1">Note: {l.review_note}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isParent && l.status === "pending" && (
                    <button onClick={() => cancel(l.id)} className="text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-md hover:bg-accent">
                      Cancel
                    </button>
                  )}
                  {isStaff && l.status === "pending" && (
                    <>
                      <button onClick={() => review(l.id, "approved")} className="text-xs font-medium bg-success-soft text-success px-3 py-1.5 rounded-md inline-flex items-center gap-1">
                        <Check className="size-3" /> Approve
                      </button>
                      <button onClick={() => review(l.id, "rejected")} className="text-xs font-medium bg-danger-soft text-danger px-3 py-1.5 rounded-md inline-flex items-center gap-1">
                        <X className="size-3" /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setOpen(false)}>
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg">Apply for leave</h3>
            <div className="space-y-3 mt-4">
              {children.length > 1 && (
                <label className="block text-sm">
                  <span className="text-muted-foreground">Child</span>
                  <select value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm">
                    {children.map((c) => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                  </select>
                </label>
              )}
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm">
                  <span className="text-muted-foreground">From</span>
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm" />
                </label>
                <label className="block text-sm">
                  <span className="text-muted-foreground">To</span>
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm" />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-muted-foreground">Reason</span>
                <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3}
                  placeholder="e.g. Fever, family function..."
                  className="mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm" />
              </label>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setOpen(false)} className="px-4 py-1.5 text-sm border border-border rounded-md">Cancel</button>
              <button onClick={submit} disabled={submitting}
                className="px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50">
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-warning-soft text-warning",
    approved: "bg-success-soft text-success",
    rejected: "bg-danger-soft text-danger",
    cancelled: "bg-accent text-accent-foreground",
  };
  return (
    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${styles[status] ?? "bg-accent"}`}>
      {status}
    </span>
  );
}
