import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Plus, MessageSquare, Search, Trash, Download } from "lucide-react";
import { WhatsAppBroadcast, type BroadcastRecipient } from "@/components/WhatsAppBroadcast";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-helper";

export const Route = createFileRoute("/_authenticated/remarks")({
  component: RemarksPage,
});

type Category = "academic" | "behaviour" | "appreciation" | "improvement" | "performance";
const CATEGORIES: { value: Category; label: string; tone: string }[] = [
  { value: "academic", label: "Academic", tone: "bg-brand-soft text-brand" },
  { value: "behaviour", label: "Behaviour", tone: "bg-warning-soft text-warning" },
  { value: "appreciation", label: "Appreciation", tone: "bg-success-soft text-success" },
  { value: "improvement", label: "Improvement", tone: "bg-danger-soft text-danger" },
  { value: "performance", label: "Performance", tone: "bg-accent text-accent-foreground" },
];

interface Student {
  id: string;
  full_name: string;
}
interface Remark {
  id: string;
  student_id: string;
  category: Category;
  content: string;
  created_at: string;
  visible_to_parent: boolean;
  students: { full_name: string; parent_name: string | null; parent_phone: string | null } | null;
}

function RemarksPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isSuper = (roles ?? []).includes("super_admin");
  const isAdmin = (roles ?? []).includes("admin") || isSuper;
  const isTeacher = (roles ?? []).includes("teacher");
  const canManage = isAdmin || isTeacher;

  usePageTitle("Student Remarks");
  const [students, setStudents] = useState<Student[]>([]);
  const [remarks, setRemarks] = useState<Remark[]>([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [studentId, setStudentId] = useState("");
  const [category, setCategory] = useState<Category>("appreciation");
  const [content, setContent] = useState("");

  // Search & Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  const load = async () => {
    if (!effectiveSchoolId) return;
    setFetching(true);
    try {
      let query = (supabase as any)
        .from("remarks")
        .select(
          "id, student_id, category, content, created_at, visible_to_parent, students!inner(full_name, parent_name, parent_phone)",
          { count: "exact" },
        )
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null);

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter as any);
      }

      if (debouncedQ.trim()) {
        query = query.ilike("students.full_name", `%${debouncedQ.trim()}%`);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      setRemarks(
        ((data ?? []) as any[]).map((r) => ({
          ...r,
          students: Array.isArray(r.students) ? (r.students[0] ?? null) : r.students,
        })) as Remark[],
      );
      setTotalCount(count ?? 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load remarks.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!effectiveSchoolId) return;
    supabase
      .from("students")
      .select("id, full_name")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("full_name")
      .then(({ data }) => {
        setStudents(data ?? []);
        if (data?.[0] && !studentId) setStudentId(data[0].id);
      });
  }, [effectiveSchoolId]);

  useEffect(() => {
    void load();
  }, [effectiveSchoolId, debouncedQ, categoryFilter, page]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user || !studentId) return;
    setBusy(true);
    const { error } = await (supabase as any).from("remarks").insert({
      school_id: effectiveSchoolId,
      student_id: studentId,
      teacher_id: user.id,
      category,
      content,
      visible_to_parent: true,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Remark added — parent will see it in tonight's digest.");
    setOpen(false);
    setContent("");
    void load();
  };

  const handleSoftDelete = async (id: string) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm("Are you sure you want to delete this remark? This will move it to the Recycle Bin.")
    )
      return;
    try {
      const { error } = await (supabase as any)
        .from("remarks")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);
      if (error) throw error;
      toast.success("Remark moved to Recycle Bin.");
      void load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete remark.");
    }
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    if (!effectiveSchoolId) return;
    toast.loading("Preparing export...");
    try {
      const { data, error } = await (supabase as any)
        .from("remarks")
        .select("category, content, created_at, students(full_name)")
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error || !data) throw error || new Error("No data");

      const headers = ["Student Name", "Category", "Remark Content", "Date Created"];
      const rows = data.map((r: any) => [
        r.students?.full_name || "—",
        r.category.toUpperCase(),
        r.content,
        new Date(r.created_at).toLocaleString(),
      ]);

      toast.dismiss();
      const fn = `Student_Remarks_Export`;
      if (format === "csv") exportToCSV(fn, headers, rows);
      else if (format === "excel") exportToExcel(fn, headers, rows);
      else if (format === "pdf") exportToPDF(fn, "Student Remarks Ledger", headers, rows);
      toast.success("Export started!");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
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
        title="Student Remarks"
        breadcrumb="Operations"
        actions={
          <div className="flex gap-2">
            {canManage && (
              <button
                onClick={() => setOpen(true)}
                disabled={students.length === 0}
                className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer"
              >
                <Plus className="size-4" /> Add Remark
              </button>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {/* Filters and Search */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-48">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Student..."
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-background text-foreground outline-none"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(0);
              }}
              className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-background">
            <button
              onClick={() => handleExport("csv")}
              className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground"
            >
              XLS
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground"
            >
              PDF
            </button>
          </div>
        </div>

        {fetching && remarks.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Loading remarks ledger...
          </div>
        ) : remarks.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <MessageSquare className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3 text-foreground">No remarks found</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {students.length === 0 ? "Add a student first." : "Start with an appreciation note."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-xl divide-y divide-border shadow-xs text-card-foreground">
              {remarks.map((r) => {
                const cat = CATEGORIES.find((c) => c.value === r.category);
                return (
                  <div
                    key={r.id}
                    className="p-5 flex gap-4 hover:bg-secondary/10 transition-colors"
                  >
                    <div
                      className={`size-10 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${cat?.tone}`}
                    >
                      {cat?.label.slice(0, 1)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-foreground">
                          {r.students?.full_name ?? "Student"}
                        </span>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${cat?.tone}`}
                        >
                          {cat?.label}
                        </span>
                        {r.visible_to_parent && (
                          <span className="text-[10px] text-muted-foreground">
                            · Visible to parent
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 italic">"{r.content}"</p>
                      <p className="text-[10px] text-muted-foreground mt-2">
                        {new Date(r.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <WhatsAppBroadcast
                        label="WhatsApp"
                        recipients={[
                          {
                            id: r.student_id,
                            name:
                              r.students?.parent_name ||
                              `${r.students?.full_name ?? "Student"}'s parent`,
                            phone: r.students?.parent_phone,
                            subtitle: r.students?.full_name,
                          } as BroadcastRecipient,
                        ]}
                        defaultMessage={`Hello, a new ${cat?.label.toLowerCase()} remark for ${r.students?.full_name ?? "your child"}:\n\n"${r.content}"\n\n— Class Teacher`}
                      />
                      {canManage && (
                        <button
                          onClick={() => handleSoftDelete(r.id)}
                          className="p-1 text-muted-foreground hover:text-danger rounded-md border border-border bg-card cursor-pointer"
                          title="Delete Remark"
                        >
                          <Trash className="size-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalCount > 0 && (
              <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground">
                <p className="text-xs text-muted-foreground">
                  Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of{" "}
                  {totalCount} remarks
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
            )}
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg text-card-foreground"
          >
            <h2 className="font-semibold text-lg text-foreground">New Remark</h2>
            <div>
              <label className="text-sm font-medium text-foreground">Student *</label>
              <select
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Category</label>
              <div className="mt-1 flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`px-3 py-1 text-xs font-semibold rounded cursor-pointer ${category === c.value ? c.tone : "bg-secondary text-muted-foreground hover:bg-accent"}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Remark *</label>
              <textarea
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                placeholder="Showed great improvement in fractions today."
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer"
              >
                {busy ? "Saving…" : "Add Remark"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
