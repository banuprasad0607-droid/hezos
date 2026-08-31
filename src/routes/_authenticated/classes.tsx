import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Plus,
  GraduationCap,
  Search,
  Trash,
  UserCheck,
  BookOpen,
  X,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/classes")({
  component: ClassesPage,
});

interface ClassRow {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  class_teacher_id: string | null;
  class_teacher_name?: string | null;
  student_count?: number;
}

interface TeacherOption {
  user_id: string;
  full_name: string;
  email: string | null;
}

interface SubjectItem {
  id: string;
  name: string;
  code: string | null;
}

interface ClassAllocation {
  id: string;
  subject_id: string;
  subject_name: string;
  teacher_id: string | null;
  teacher_name: string | null;
}

function ClassesPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const isSuper = (roles ?? []).includes("super_admin");
  const isAdmin = (roles ?? []).includes("admin") || isSuper;

  usePageTitle("Classes");

  // State
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [busy, setBusy] = useState(false);

  // Modals
  const [createOpen, setCreateOpen] = useState(false);
  const [editClass, setEditClass] = useState<ClassRow | null>(null);
  const [manageSubjectsClass, setManageSubjectsClass] = useState<ClassRow | null>(null);

  // Form State for Create/Edit
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [selectedClassTeacherId, setSelectedClassTeacherId] = useState<string>("");

  // Search & Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(9);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  // Load School Teachers for Dropdowns
  const loadTeachers = async () => {
    if (!effectiveSchoolId) return;
    try {
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher" as never);

      if (rolesData && rolesData.length > 0) {
        const uids = rolesData.map((r) => r.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", uids);

        setTeachers((profilesData ?? []) as TeacherOption[]);
      } else {
        setTeachers([]);
      }
    } catch {
      // Fallback
    }
  };

  const loadClasses = async () => {
    if (!effectiveSchoolId) return;
    setBusy(true);
    try {
      let query = (supabase as any)
        .from("classes")
        .select("id, name, grade, section, class_teacher_id", { count: "exact" })
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

      // Fetch teacher profiles for class_teacher_id lookup
      const teacherUserIds = ((data ?? []) as any[])
        .map((c) => c.class_teacher_id)
        .filter((id): id is string => Boolean(id));

      let teacherMap = new Map<string, string>();
      if (teacherUserIds.length > 0) {
        const { data: pData } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", teacherUserIds);

        if (pData) {
          teacherMap = new Map(pData.map((p) => [p.user_id, p.full_name]));
        }
      }

      const rows = await Promise.all(
        ((data ?? []) as any[]).map(async (c: any) => {
          const { count: studentCount } = await supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("class_id", c.id)
            .is("deleted_at", null);

          return {
            ...c,
            class_teacher_name: c.class_teacher_id ? teacherMap.get(c.class_teacher_id) || "Assigned Teacher" : null,
            student_count: studentCount ?? 0,
          };
        })
      );
      setClasses(rows);
    } catch (err: any) {
      toast.error(err.message || "Failed to load classes.");
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    void loadTeachers();
  }, [effectiveSchoolId]);

  useEffect(() => {
    void loadClasses();
  }, [effectiveSchoolId, debouncedQ, page]);

  // Create New Class (Admin Only)
  const submitCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Only school administrators can create classes.");
      return;
    }
    if (!effectiveSchoolId) return;
    setBusy(true);

    const { error } = await (supabase as any).from("classes").insert({
      school_id: effectiveSchoolId,
      name: name.trim(),
      grade: grade.trim() || null,
      section: section.trim() || null,
      class_teacher_id: selectedClassTeacherId || null,
    });

    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Created class "${name.trim()}"`);
    setCreateOpen(false);
    resetForm();
    void loadClasses();
  };

  // Update Class (Admin Only)
  const submitEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin || !editClass || !effectiveSchoolId) return;
    setBusy(true);

    const { error } = await (supabase as any)
      .from("classes")
      .update({
        name: name.trim(),
        grade: grade.trim() || null,
        section: section.trim() || null,
        class_teacher_id: selectedClassTeacherId || null,
      })
      .eq("id", editClass.id);

    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(`Updated class "${name.trim()}"`);
    setEditClass(null);
    resetForm();
    void loadClasses();
  };

  const handleSoftDelete = async (id: string, className: string) => {
    if (!isAdmin) {
      toast.error("Only school administrators can delete classes.");
      return;
    }
    if (!effectiveSchoolId) return;
    if (!confirm(`Move "${className}" to Recycle Bin?`)) return;

    try {
      const { error } = await (supabase as any)
        .from("classes")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);

      if (error) throw error;

      toast.success(`${className} moved to Recycle Bin.`);
      void loadClasses();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete class.");
    }
  };

  const openEditModal = (c: ClassRow) => {
    setEditClass(c);
    setName(c.name);
    setGrade(c.grade || "");
    setSection(c.section || "");
    setSelectedClassTeacherId(c.class_teacher_id || "");
  };

  const resetForm = () => {
    setName("");
    setGrade("");
    setSection("");
    setSelectedClassTeacherId("");
  };

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading class directory...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Class Management"
        breadcrumb={`${totalCount} active classes`}
        actions={
          <div className="flex gap-3 items-center">
            <div className="relative w-48 sm:w-64">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search class name..."
                className="w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-lg bg-card text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            {/* ONLY ADMIN / SUPER ADMIN CAN ADD CLASSES */}
            {isAdmin && (
              <button
                onClick={() => {
                  resetForm();
                  setCreateOpen(true);
                }}
                className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-sm inline-flex items-center gap-1.5 hover:opacity-90 cursor-pointer transition-opacity"
              >
                <Plus className="size-4" /> New Class
              </button>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-background text-foreground max-w-7xl mx-auto">
        {!isAdmin && (
          <div className="p-3 bg-muted/40 border border-border rounded-xl flex items-center justify-between text-xs text-muted-foreground">
            <span>Notice: Only School Administrators can create new classes and assign subjects or class teachers.</span>
            <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">View Mode</span>
          </div>
        )}

        {busy && classes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            Syncing class structures...
          </div>
        ) : classes.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-16 text-center text-card-foreground shadow-xs">
            <GraduationCap className="size-12 mx-auto text-muted-foreground" />
            <h3 className="font-semibold text-lg mt-3">
              {totalCount === 0 ? "No classes setup yet" : "No matching classes"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
              {isAdmin
                ? "Create your first class to assign class teachers, subjects, and manage student enrollments."
                : "No classes are registered for this school yet."}
            </p>
            {isAdmin && (
              <button
                onClick={() => {
                  resetForm();
                  setCreateOpen(true);
                }}
                className="mt-5 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <Plus className="size-4" /> Create First Class
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="bg-card border border-border rounded-2xl p-5 text-card-foreground shadow-xs hover:border-border/80 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-base">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-foreground">{c.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {[c.grade ? `Grade ${c.grade}` : null, c.section ? `Sec ${c.section}` : null]
                              .filter(Boolean)
                              .join(" · ") || "General"}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                        {c.student_count} Students
                      </span>
                    </div>

                    {/* Class Teacher Badge */}
                    <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border flex items-center gap-2.5">
                      <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <div className="overflow-hidden">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Class Teacher</p>
                        <p className="text-xs font-semibold truncate text-foreground">
                          {c.class_teacher_name || "No Class Teacher Assigned"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-5 text-xs">
                    {/* Manage Subjects Action Button */}
                    <button
                      onClick={() => setManageSubjectsClass(c)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg font-medium transition-colors border border-indigo-200 dark:border-indigo-800 cursor-pointer"
                    >
                      <BookOpen className="size-3.5" /> Subjects & Teachers
                    </button>

                    {/* Admin Actions: Edit / Delete */}
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors cursor-pointer"
                          title="Edit Class & Teacher"
                        >
                          <Edit3 className="size-4" />
                        </button>
                        <button
                          onClick={() => handleSoftDelete(c.id, c.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                          title="Delete Class"
                        >
                          <Trash className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl shadow-xs text-card-foreground">
              <p className="text-xs text-muted-foreground">
                Showing {totalCount > 0 ? page * pageSize + 1 : 0} to{" "}
                {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} classes
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-lg disabled:opacity-50 cursor-pointer hover:bg-muted transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={(page + 1) * pageSize >= totalCount}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-lg disabled:opacity-50 cursor-pointer hover:bg-muted transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE NEW CLASS MODAL (Admin Only) */}
      {createOpen && isAdmin && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setCreateOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitCreate}
            className="bg-card text-card-foreground rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-semibold text-lg">Create New Class</h2>
              <button type="button" onClick={() => setCreateOpen(false)} className="p-1 hover:bg-muted rounded-lg">
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Class Name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grade 7-B"
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Grade Level</label>
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Section</label>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  placeholder="e.g. B"
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            {/* CLASS TEACHER SELECTION FOR ADMIN */}
            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Assign Class Teacher</label>
              <select
                value={selectedClassTeacherId}
                onChange={(e) => setSelectedClassTeacherId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">-- No Class Teacher Assigned --</option>
                {teachers.map((t) => (
                  <option key={t.user_id} value={t.user_id}>
                    {t.full_name} ({t.email || "No Email"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setCreateOpen(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {busy ? "Creating…" : "Create Class"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT CLASS MODAL (Admin Only) */}
      {editClass && isAdmin && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setEditClass(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submitEdit}
            className="bg-card text-card-foreground rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl border border-border"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="font-semibold text-lg">Edit Class Details</h2>
              <button type="button" onClick={() => setEditClass(null)} className="p-1 hover:bg-muted rounded-lg">
                <X className="size-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Class Name *</label>
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Grade Level</label>
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground block mb-1">Section</label>
                <input
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground block mb-1">Class Teacher</label>
              <select
                value={selectedClassTeacherId}
                onChange={(e) => setSelectedClassTeacherId(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">-- No Class Teacher Assigned --</option>
                {teachers.map((t) => (
                  <option key={t.user_id} value={t.user_id}>
                    {t.full_name} ({t.email || "No Email"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-2 justify-end pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setEditClass(null)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {busy ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MANAGE SUBJECTS & TEACHERS FOR CLASS MODAL */}
      {manageSubjectsClass && (
        <ClassSubjectsManagerModal
          cls={manageSubjectsClass}
          effectiveSchoolId={effectiveSchoolId!}
          teachers={teachers}
          isAdmin={isAdmin}
          onClose={() => setManageSubjectsClass(null)}
        />
      )}
    </>
  );
}

function ClassSubjectsManagerModal({
  cls,
  effectiveSchoolId,
  teachers,
  isAdmin,
  onClose,
}: {
  cls: ClassRow;
  effectiveSchoolId: string;
  teachers: TeacherOption[];
  isAdmin: boolean;
  onClose: () => void;
}) {
  const [allocations, setAllocations] = useState<ClassAllocation[]>([]);
  const [subjectsList, setSubjectsList] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Subject Form
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    void loadData();
  }, [cls.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all available subjects for school
      const { data: subData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", effectiveSchoolId)
        .order("name");

      setSubjectsList((subData ?? []) as SubjectItem[]);

      // Load teacher_allocations for this class
      const { data: allocData } = await (supabase as any)
        .from("teacher_allocations")
        .select("id, subject_id, teacher_id")
        .eq("school_id", effectiveSchoolId)
        .eq("class_id", cls.id);

      if (allocData && allocData.length > 0) {
        const subMap = new Map((subData ?? []).map((s) => [s.id, s.name]));
        const teacherMap = new Map(teachers.map((t) => [t.user_id, t.full_name]));

        const list: ClassAllocation[] = allocData.map((a: any) => ({
          id: a.id,
          subject_id: a.subject_id,
          subject_name: subMap.get(a.subject_id) || "Subject",
          teacher_id: a.teacher_id,
          teacher_name: teacherMap.get(a.teacher_id) || "Unassigned",
        }));
        setAllocations(list);
      } else {
        setAllocations([]);
      }
    } catch (err: any) {
      toast.error("Failed to load class subjects: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubjectToClass = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return toast.error("Only admins can add subjects to classes.");
    setAdding(true);

    try {
      let targetSubjectId = selectedSubjectId;

      // If user typed a custom subject name
      if (!targetSubjectId && newSubjectName.trim()) {
        const { data: createdSub, error: subErr } = await supabase
          .from("subjects")
          .insert({
            school_id: effectiveSchoolId,
            name: newSubjectName.trim(),
          })
          .select("id")
          .single();

        if (subErr) throw subErr;
        targetSubjectId = createdSub.id;
      }

      if (!targetSubjectId) {
        toast.error("Please select or enter a subject name.");
        setAdding(false);
        return;
      }

      // Insert into teacher_allocations
      const { error: allocErr } = await (supabase as any).from("teacher_allocations").insert({
        school_id: effectiveSchoolId,
        class_id: cls.id,
        subject_id: targetSubjectId,
        teacher_id: selectedTeacherId || null,
        academic_year: new Date().getFullYear().toString(),
      });

      if (allocErr) throw allocErr;

      toast.success("Subject added to class!");
      setSelectedSubjectId("");
      setNewSubjectName("");
      setSelectedTeacherId("");
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to add subject");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAllocation = async (allocId: string) => {
    if (!isAdmin) return;
    if (!confirm("Remove this subject from class?")) return;

    try {
      const { error } = await (supabase as any)
        .from("teacher_allocations")
        .delete()
        .eq("id", allocId);

      if (error) throw error;
      toast.success("Subject removed from class.");
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove subject");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card text-card-foreground rounded-2xl p-6 w-full max-w-xl space-y-5 shadow-2xl border border-border"
      >
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <BookOpen className="size-5 text-indigo-600 dark:text-indigo-400" /> Subjects & Teachers — {cls.name}
            </h2>
            <p className="text-xs text-muted-foreground">Manage subject curriculum and teacher assignments for this class</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="size-4" />
          </button>
        </div>

        {/* Add Subject Form (Admin Only) */}
        {isAdmin && (
          <form onSubmit={handleAddSubjectToClass} className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Add Subject to Class</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1">Select Existing Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    if (e.target.value) setNewSubjectName("");
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">-- Choose Subject --</option>
                  {subjectsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">OR Add New Subject Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={newSubjectName}
                  disabled={Boolean(selectedSubjectId)}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1">Assign Subject Teacher (Optional)</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-border rounded-lg bg-background text-foreground"
              >
                <option value="">-- No Subject Teacher Assigned --</option>
                {teachers.map((t) => (
                  <option key={t.user_id} value={t.user_id}>
                    {t.full_name} ({t.email || "No Email"})
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={adding}
              className="w-full py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-lg shadow-xs hover:opacity-90 disabled:opacity-50 cursor-pointer"
            >
              {adding ? "Adding Subject…" : "+ Add Subject to Class"}
            </button>
          </form>
        )}

        {/* Existing Allocations List */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Class Curriculum ({allocations.length})</p>

          {loading ? (
            <div className="p-6 text-center text-xs text-muted-foreground">Loading curriculum…</div>
          ) : allocations.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground bg-muted/20 border border-dashed border-border rounded-xl">
              No subjects added to this class yet.
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto divide-y divide-border border border-border rounded-xl">
              {allocations.map((a) => (
                <div key={a.id} className="p-3 flex items-center justify-between hover:bg-muted/30 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-foreground">{a.subject_name}</p>
                    <p className="text-xs text-muted-foreground">Teacher: {a.teacher_name}</p>
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => handleRemoveAllocation(a.id)}
                      className="p-1 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                      title="Remove Subject"
                    >
                      <Trash className="size-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-border">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
