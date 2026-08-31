import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Shield, Plus, Trash2, UserCheck, BookOpen, GraduationCap, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher-allocations")({
  component: TeacherAllocationsPage,
});

type Teacher = {
  id: string; // profiles.id
  user_id: string; // auth.users.id
  full_name: string;
  email: string | null;
};

interface ClassWithTeacher {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  class_teacher_id: string | null;
  class_teacher_name?: string | null;
}

function TeacherAllocationsPage() {
  const { currentSchoolId: schoolId, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Teacher & Subject Allocations");

  const [activeTab, setActiveTab] = useState<"subject" | "class_teacher">("subject");

  const [isLoading, setIsLoading] = useState(true);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<ClassWithTeacher[]>([]);

  // Subject Allocation Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Class Teacher Assignment Form State
  const [ctClassId, setCtClassId] = useState("");
  const [ctTeacherId, setCtTeacherId] = useState("");
  const [ctSubmitting, setCtSubmitting] = useState(false);

  const isStaff =
    (roles ?? []).includes("super_admin") ||
    (roles ?? []).includes("admin") ||
    (roles ?? []).includes("principal");

  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      // 1. Fetch Subject Allocations
      const { data: allocData } = await (supabase as any)
        .from("teacher_allocations")
        .select(
          `
          id,
          academic_year,
          profiles:teacher_id ( full_name, email ),
          subjects:subject_id ( name, code ),
          classes:class_id ( name )
        `
        )
        .eq("school_id", schoolId);
      setAllocations(allocData || []);

      // 2. Fetch Teachers (Profiles with role teacher or Profiles belonging to school)
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "teacher" as never);

      let teacherUids = (rolesData || []).map((r) => r.user_id);

      let teacherList: Teacher[] = [];
      if (teacherUids.length > 0) {
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, user_id, full_name, email")
          .in("user_id", teacherUids);

        teacherList = (profilesData || []).map((p) => ({
          id: p.id,
          user_id: p.user_id,
          full_name: p.full_name || p.email || "Teacher",
          email: p.email,
        }));
      }

      if (teacherList.length === 0) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, user_id, full_name, email")
          .eq("school_id", schoolId);

        teacherList = (profs || []).map((p) => ({
          id: p.id,
          user_id: p.user_id,
          full_name: p.full_name || p.email || "Teacher",
          email: p.email,
        }));
      }

      setTeachers(teacherList);

      // 3. Fetch Subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);

      // 4. Fetch Classes with Class Teachers
      const { data: classesData } = await (supabase as any)
        .from("classes")
        .select("id, name, grade, section, class_teacher_id")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");

      const tMap = new Map(teacherList.map((t) => [t.user_id, t.full_name]));
      const formattedClasses: ClassWithTeacher[] = ((classesData || []) as any[]).map((c) => ({
        ...c,
        class_teacher_name: c.class_teacher_id
          ? tMap.get(c.class_teacher_id) || "Assigned Teacher"
          : null,
      }));

      setClasses(formattedClasses);
    } catch (err: any) {
      toast.error("Failed to load data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolId]);

  // Subject Allocation Submit
  const handleAllocateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !selectedTeacherId || !selectedSubjectId || !selectedClassId) {
      toast.error("Please select Teacher, Subject, and Class.");
      return;
    }

    const tObj = teachers.find((t) => t.id === selectedTeacherId || t.user_id === selectedTeacherId);
    const targetProfId = tObj ? tObj.id : selectedTeacherId;

    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any).from("teacher_allocations").insert({
        school_id: schoolId,
        teacher_id: targetProfId,
        subject_id: selectedSubjectId,
        class_id: selectedClassId,
        academic_year: academicYear,
      });

      if (error) throw error;

      toast.success("Subject teacher allocated successfully!");
      setSelectedSubjectId("");
      setSelectedClassId("");
      void loadData();
    } catch (err: any) {
      toast.error("Failed to create subject allocation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Class Teacher Assignment Submit
  const handleAssignClassTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !ctClassId || !ctTeacherId) {
      toast.error("Please select a Class and a Teacher.");
      return;
    }

    const tObj = teachers.find((t) => t.id === ctTeacherId || t.user_id === ctTeacherId);
    const targetUserId = tObj ? tObj.user_id : ctTeacherId;

    setCtSubmitting(true);
    try {
      const { error } = await (supabase as any)
        .from("classes")
        .update({ class_teacher_id: targetUserId })
        .eq("id", ctClassId)
        .eq("school_id", schoolId);

      if (error) throw error;

      toast.success("Class Teacher assigned successfully!");
      setCtClassId("");
      setCtTeacherId("");
      void loadData();
    } catch (err: any) {
      toast.error("Failed to assign class teacher: " + err.message);
    } finally {
      setCtSubmitting(false);
    }
  };

  const handleDeleteAllocation = async (id: string) => {
    if (!confirm("Are you sure you want to remove this subject allocation?")) return;
    try {
      const { error } = await (supabase as any).from("teacher_allocations").delete().eq("id", id);
      if (error) throw error;
      toast.success("Subject allocation removed.");
      setAllocations((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      toast.error("Failed to delete allocation: " + err.message);
    }
  };

  const handleUnassignClassTeacher = async (classId: string, className: string) => {
    if (!confirm(`Remove Class Teacher from "${className}"?`)) return;
    try {
      const { error } = await (supabase as any)
        .from("classes")
        .update({ class_teacher_id: null })
        .eq("id", classId);

      if (error) throw error;
      toast.success(`Removed Class Teacher from ${className}.`);
      void loadData();
    } catch (err: any) {
      toast.error("Failed to unassign class teacher: " + err.message);
    }
  };

  if (!isStaff) {
    if (tenantLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
            <p className="text-sm text-muted-foreground">Loading permissions...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-8 text-center text-muted-foreground">
        <Shield className="size-10 mx-auto text-rose-300 mb-2" />
        <p>You do not have permission to access Teacher Allocations.</p>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Teacher Allocations" breadcrumb="Subject & Class Teacher Management" />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground max-w-7xl mx-auto">
        {/* Allocation Mode Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab("subject")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "subject"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 hover:bg-muted text-muted-foreground"
            }`}
          >
            <BookOpen className="size-4" /> Subject Teacher Allocations
          </button>

          <button
            onClick={() => setActiveTab("class_teacher")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "class_teacher"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-muted/40 hover:bg-muted text-muted-foreground"
            }`}
          >
            <UserCheck className="size-4" /> Class Teacher Allocations
          </button>
        </div>

        {/* TAB 1: SUBJECT TEACHER ALLOCATIONS */}
        {activeTab === "subject" && (
          <div className="space-y-6">
            {/* New Subject Allocation Form */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <Plus className="size-4 text-indigo-600 dark:text-indigo-400" /> Allocate Subject Teacher
              </h3>
              <form onSubmit={handleAllocateSubject} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Teacher *
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Subject *
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  >
                    <option value="">-- Select Subject --</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} {s.code ? `(${s.code})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Class *
                  </label>
                  <select
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  >
                    <option value="">-- Select Class --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary text-primary-foreground font-semibold rounded-lg px-4 py-2 text-sm shadow-xs hover:opacity-90 disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {isSubmitting ? "Allocating…" : "Allocate Subject"}
                  </button>
                </div>
              </form>
            </div>

            {/* Subject Allocations List */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Active Subject Allocations</h3>
                <span className="text-xs text-muted-foreground">{allocations.length} total</span>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading allocations…</div>
              ) : allocations.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No subject allocations found. Select a teacher, subject, and class above to allocate.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-medium border-b border-border">
                      <tr>
                        <th className="text-left px-6 py-3.5">Teacher</th>
                        <th className="text-left px-6 py-3.5">Subject</th>
                        <th className="text-left px-6 py-3.5">Class</th>
                        <th className="text-left px-6 py-3.5">Academic Year</th>
                        <th className="text-right px-6 py-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {allocations.map((a) => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-foreground">
                            {a.profiles?.full_name || a.profiles?.email || "Unknown Teacher"}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-medium text-foreground">{a.subjects?.name || "—"}</span>
                            {a.subjects?.code && (
                              <span className="text-xs text-muted-foreground ml-1">({a.subjects.code})</span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium text-foreground">{a.classes?.name || "—"}</td>
                          <td className="px-6 py-4 text-xs font-mono text-muted-foreground">{a.academic_year}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteAllocation(a.id)}
                              className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer"
                              title="Remove Allocation"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CLASS TEACHER ALLOCATIONS */}
        {activeTab === "class_teacher" && (
          <div className="space-y-6">
            {/* Assign Class Teacher Form */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-xs space-y-4">
              <h3 className="font-semibold text-base flex items-center gap-2 text-foreground">
                <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400" /> Assign Class Teacher to Class
              </h3>
              <form onSubmit={handleAssignClassTeacher} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Select Class *
                  </label>
                  <select
                    value={ctClassId}
                    onChange={(e) => setCtClassId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.class_teacher_name ? `(Current: ${c.class_teacher_name})` : "(Unassigned)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">
                    Select Class Teacher *
                  </label>
                  <select
                    value={ctTeacherId}
                    onChange={(e) => setCtTeacherId(e.target.value)}
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-hidden"
                    required
                  >
                    <option value="">-- Choose Teacher --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.full_name} ({t.email || "No Email"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={ctSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg px-4 py-2 text-sm shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {ctSubmitting ? "Assigning…" : "Assign Class Teacher"}
                  </button>
                </div>
              </form>
            </div>

            {/* Class Teacher Assignments Roster */}
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Class Teacher Roster by Class</h3>
                <span className="text-xs text-muted-foreground">{classes.length} classes</span>
              </div>

              {isLoading ? (
                <div className="p-8 text-center text-sm text-muted-foreground">Loading classes…</div>
              ) : classes.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">
                  No classes registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/40 text-xs uppercase text-muted-foreground font-medium border-b border-border">
                      <tr>
                        <th className="text-left px-6 py-3.5">Class Name</th>
                        <th className="text-left px-6 py-3.5">Grade & Section</th>
                        <th className="text-left px-6 py-3.5">Assigned Class Teacher</th>
                        <th className="text-right px-6 py-3.5">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {classes.map((c) => (
                        <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-foreground">{c.name}</td>
                          <td className="px-6 py-4 text-xs text-muted-foreground">
                            {[c.grade ? `Grade ${c.grade}` : null, c.section ? `Sec ${c.section}` : null]
                              .filter(Boolean)
                              .join(" · ") || "—"}
                          </td>
                          <td className="px-6 py-4">
                            {c.class_teacher_name ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                <UserCheck className="size-3.5" /> {c.class_teacher_name}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground italic">No Teacher Assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {c.class_teacher_id && (
                              <button
                                onClick={() => handleUnassignClassTeacher(c.id, c.name)}
                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-md transition-colors cursor-pointer text-xs font-medium inline-flex items-center gap-1"
                              >
                                <Trash2 className="size-3.5" /> Remove
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
