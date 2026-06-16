import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Shield, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/teacher-allocations")({
  component: TeacherAllocationsPage,
});

function TeacherAllocationsPage() {
  const { currentSchoolId: schoolId, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Teacher Subject Allocations");

  const [isLoading, setIsLoading] = useState(true);
  const [allocations, setAllocations] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStaff = roles.includes("super_admin") || roles.includes("admin") || roles.includes("principal");

  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      // Fetch Allocations
      const { data: allocData } = await (supabase as any)
        .from("teacher_allocations")
        .select(`
          id,
          academic_year,
          profiles:teacher_id ( full_name, email ),
          subjects:subject_id ( name, code ),
          classes:class_id ( name )
        `)
        .eq("school_id", schoolId);
      setAllocations(allocData || []);

      // Fetch Teachers (Profiles with role teacher)
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", schoolId)
        .eq("role", "teacher");
      
      if (rolesData && rolesData.length > 0) {
        const teacherIds = rolesData.map(r => r.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", teacherIds);
        setTeachers(profilesData || []);
      }

      // Fetch Subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);

      // Fetch Classes
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, name")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);

    } catch (err: any) {
      toast.error("Failed to load allocations: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolId]);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId || !selectedTeacherId || !selectedSubjectId || !selectedClassId) {
      toast.error("Please select all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await (supabase as any).from("teacher_allocations").insert({
        school_id: schoolId,
        teacher_id: selectedTeacherId,
        subject_id: selectedSubjectId,
        class_id: selectedClassId,
        academic_year: academicYear
      });

      if (error) throw error;
      
      toast.success("Allocation created successfully");
      // Reset form slightly, maybe keep teacher selected
      setSelectedSubjectId("");
      setSelectedClassId("");
      void loadData();
    } catch (err: any) {
      toast.error("Failed to create allocation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this allocation?")) return;
    try {
      const { error } = await (supabase as any).from("teacher_allocations").delete().eq("id", id);
      if (error) throw error;
      toast.success("Allocation removed");
      setAllocations(prev => prev.filter(a => a.id !== id));
    } catch (err: any) {
      toast.error("Failed to delete: " + err.message);
    }
  };

  if (!isStaff) {
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

      <div className="p-8 text-center text-muted-foreground">
        <Shield className="size-10 mx-auto text-rose-300 mb-2" />
        <p>You do not have permission to access Teacher Allocations.</p>
      </div>
    );
  }

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
      <PageHeader title="Teacher Subject Allocations" breadcrumb="Academics" />

      <div className="p-6 lg:p-8 space-y-8">
        
        {/* Create Allocation Form */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Plus className="size-4" /> New Allocation
          </h3>
          <form onSubmit={handleAllocate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Teacher</label>
              <select 
                value={selectedTeacherId} 
                onChange={(e) => setSelectedTeacherId(e.target.value)} 
                className="w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                required
              >
                <option value="">-- Select Teacher --</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Subject</label>
              <select 
                value={selectedSubjectId} 
                onChange={(e) => setSelectedSubjectId(e.target.value)} 
                className="w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Class</label>
              <select 
                value={selectedClassId} 
                onChange={(e) => setSelectedClassId(e.target.value)} 
                className="w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                required
              >
                <option value="">-- Select Class --</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-1">Academic Year</label>
              <input 
                type="text" 
                value={academicYear} 
                onChange={(e) => setAcademicYear(e.target.value)} 
                className="w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-brand text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-brand/90 transition-all disabled:opacity-50 h-[38px]"
            >
              Allocate
            </button>
          </form>
        </div>

        {/* Allocations List */}
        <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800">
              <tr>
                <th className="py-3 px-6 font-semibold">Teacher</th>
                <th className="py-3 px-6 font-semibold">Subject</th>
                <th className="py-3 px-6 font-semibold">Class</th>
                <th className="py-3 px-6 font-semibold">Academic Year</th>
                <th className="py-3 px-6 font-semibold w-16 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border dark:divide-slate-800">
              {isLoading ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Loading allocations...</td></tr>
              ) : allocations.length === 0 ? (
                <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No allocations found.</td></tr>
              ) : (
                allocations.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {a.profiles?.full_name || "Unknown Teacher"}
                    </td>
                    <td className="py-3 px-6 text-slate-600 dark:text-slate-300">
                      {a.subjects?.name || "Unknown Subject"}
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-700 dark:text-slate-200">
                      {a.classes?.name || "Unknown Class"}
                    </td>
                    <td className="py-3 px-6 text-slate-500">
                      {a.academic_year}
                    </td>
                    <td className="py-3 px-6 text-right">
                      <button 
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-md transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </>
  );
}
