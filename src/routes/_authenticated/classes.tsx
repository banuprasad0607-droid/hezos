import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Plus, GraduationCap, Search, Trash } from "lucide-react";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

interface ClassRow {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  student_count?: number;
}

function ClassesPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const isSuper = (roles ?? []).includes("super_admin");
  const isAdmin = (roles ?? []).includes("admin") || isSuper;

  usePageTitle("Classes");
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [busy, setBusy] = useState(false);

  // Search & Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(6); // Grid display works best with multiples of 3
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  const load = async () => {
    if (!effectiveSchoolId) return;
    setBusy(true);
    try {
      let query = supabase
        .from("classes")
        .select("id, name, grade, section", { count: "exact" })
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null);

      if (debouncedQ.trim()) {
        query = query.ilike("name", `%${debouncedQ.trim()}%`);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, count, error } = await query.order("name").range(start, end);

      if (error) throw error;
      setTotalCount(count ?? 0);

      const counts = await Promise.all(
        (data ?? []).map(async (c) => {
          // Exclude soft-deleted students inside class student count
          const { count: studentCount } = await supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("class_id", c.id)
            .is("deleted_at", null);
          return { ...c, student_count: studentCount ?? 0 };
        }),
      );
      setClasses(counts);
    } catch (err: any) {
      toast.error(err.message || "Failed to load classes.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void load();
  }, [effectiveSchoolId, debouncedQ, page]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId) return;
    setBusy(true);
    const { error } = await supabase.from("classes").insert({
      school_id: effectiveSchoolId,
      name,
      grade: grade || null,
      section: section || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Class created");
    setOpen(false);
    setName("");
    setGrade("");
    setSection("");
    void load();
  };

  const handleSoftDelete = async (id: string, className: string) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm(
        `Are you sure you want to delete ${className}? This will move the class to the Recycle Bin.`,
      )
    )
      return;

    try {
      const { error } = await (supabase as any)
        .from("classes")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);

      if (error) throw error;

      toast.success(`${className} moved to Recycle Bin.`);
      void load();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete class.");
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading classes...</p>
        </div>
      </div>
    );
  }

  if (!effectiveSchoolId && !isSuper) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="max-w-md text-center p-6 bg-card rounded-2xl shadow-sm border border-border">
          <p className="font-semibold mb-2 text-foreground">School information not found.</p>
          <p className="text-sm text-muted-foreground">
            You are not associated with any school. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Classes"
        breadcrumb={`${totalCount} classes setup`}
        actions={
          <div className="flex gap-3 items-center">
            <div className="relative w-48">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search classes..."
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-card text-foreground outline-none"
              />
            </div>
            <button
              onClick={() => setOpen(true)}
              className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 hover:opacity-90 cursor-pointer"
            >
              <Plus className="size-4" /> New Class
            </button>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {busy && classes.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground text-sm">
            Syncing class structures...
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground">
            <GraduationCap className="size-10 mx-auto text-muted-foreground" />
            <h3 className="font-semibold mt-3">
              {totalCount === 0 ? "No classes yet" : "No matches"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first class to start adding students.
            </p>
            <button
              onClick={() => setOpen(true)}
              className="mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="size-4" /> New Class
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">{c.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {c.student_count} students
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {[c.grade, c.section].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  {isAdmin && (
                    <div className="flex justify-end pt-4 border-t border-border mt-4">
                      <button
                        onClick={() => handleSoftDelete(c.id, c.name)}
                        className="text-xs font-semibold text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer"
                        title="Delete Class"
                      >
                        <Trash className="size-3.5" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground">
              <p className="text-xs text-muted-foreground">
                Showing {totalCount > 0 ? page * pageSize + 1 : 0} to{" "}
                {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} classes
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
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
          onClick={() => setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="bg-card text-card-foreground rounded-xl p-6 w-full max-w-sm space-y-4 shadow-lg"
          >
            <h2 className="font-semibold text-lg">New Class</h2>
            <div>
              <label className="text-sm font-medium text-foreground">Class name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Class 7-B"
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground">Grade</label>
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="7"
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Section</label>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="B"
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
                />
              </div>
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
                {busy ? "Creating…" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
