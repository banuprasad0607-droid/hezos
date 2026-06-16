import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolName, usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { BookOpen, Shield, RefreshCw, CheckCircle2 } from "lucide-react";
import { whatsappService } from "@/lib/whatsapp-service";

export const Route = createFileRoute("/_authenticated/marks")({
  component: MarksManagementPage,
});

interface ClassRow {
  id: string;
  name: string;
  grade: string | null;
  section: string | null;
  class_teacher_id: string | null;
}

interface SubjectRow {
  id: string;
  name: string;
  code: string | null;
}

interface StudentRow {
  id: string;
  full_name: string;
  roll_number: string | null;
  class_id: string | null;
  photo_url: string | null;
}

interface ExamRow {
  id: string;
  class_id: string;
  name: string;
  type: string;
  academic_year: string;
  date: string;
}

interface ExamSubjectRow {
  id: string;
  exam_id: string;
  subject_id: string;
  max_marks: number;
  pass_marks: number;
}

interface AllocationRow {
  id: string;
  teacher_id: string;
  subject_id: string;
  class_id: string;
}

interface MarkEntry {
  id?: string;
  student_id: string;
  marks_obtained: number;
  grade: string;
  remarks: string;
  is_absent: boolean;
  is_medical_exempt: boolean;
  status: string;
}

function MarksManagementPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Marks Management");

  // Determine roles
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin");
  const isPrincipal = roles.includes("principal");
  const isStaff = isSuperAdmin || isAdmin || isPrincipal;

  // Core Data State
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [subjects, setSubjects] = useState<SubjectRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [exams, setExams] = useState<ExamRow[]>([]);
  const [examSubjects, setExamSubjects] = useState<ExamSubjectRow[]>([]);
  const [teacherAllocations, setTeacherAllocations] = useState<AllocationRow[]>([]);
  
  // Selection Filters
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("All");
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  // Mark entry states
  const [marks, setMarks] = useState<Record<string, MarkEntry>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const saveTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});

  // Grade Configuration
  const gradeThresholds = {
    "A+": 91,
    "A": 81,
    "B+": 71,
    "B": 61,
    "C+": 51,
    "C": 41,
    "D": 35,
  };

  const calculateGrade = (obtained: number, max: number, isAbsent: boolean, isMedical: boolean) => {
    if (isAbsent) return "F (Abs)";
    if (isMedical) return "EX (Med)";
    if (max <= 0) return "—";
    const pct = (obtained / max) * 100;
    if (pct >= gradeThresholds["A+"]) return "A+";
    if (pct >= gradeThresholds["A"]) return "A";
    if (pct >= gradeThresholds["B+"]) return "B+";
    if (pct >= gradeThresholds["B"]) return "B";
    if (pct >= gradeThresholds["C+"]) return "C+";
    if (pct >= gradeThresholds["C"]) return "C";
    if (pct >= gradeThresholds["D"]) return "D";
    return "F";
  };

  // Load Data
  const loadData = async () => {
    if (!schoolId || !user?.id) return;
    setIsLoading(true);
    try {
      // Fetch Allocations first to guide class/subject filtering
      // RLS ensures teachers only see their own allocations, staff see all.
      const { data: allocData } = await (supabase as any).from("teacher_allocations")
        .select("id, teacher_id, subject_id, class_id")
        .eq("school_id", schoolId);
      setTeacherAllocations(allocData || []);

      // Fetch Classes
      const { data: classesData } = await (supabase as any)
        .from("classes")
        .select("id, name, grade, section, class_teacher_id")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);

      // Fetch Subjects
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);

      // Fetch Exams
      const { data: examsData } = await (supabase as any)
        .from("exams")
        .select("id, class_id, name, type, academic_year, date")
        .eq("school_id", schoolId)
        .order("date", { ascending: false });
      setExams(examsData || []);

      // Fetch Exam Subjects
      const { data: examSubjectsData } = await (supabase as any).from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks, pass_marks")
        .eq("school_id", schoolId);
      setExamSubjects(examSubjectsData || []);

      // Fetch Students
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, full_name, roll_number, class_id, photo_url")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("full_name");
      setStudents(studentsData || []);

    } catch (err: any) {
      toast.error("Failed to load data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolId, user?.id]);

  // Dynamic filter lists based on Roles & Allocations
  const filteredClasses = useMemo(() => {
    let list = classes;
    if (selectedSection !== "All") {
      list = list.filter(c => c.section?.toLowerCase() === selectedSection.toLowerCase() || c.name.toLowerCase().includes(selectedSection.toLowerCase()));
    }

    if (!isStaff) {
      // Teacher can only see allocated classes OR classes they are the Class Teacher for
      const allocatedClassIds = teacherAllocations.map(sa => sa.class_id);
      list = list.filter(c => allocatedClassIds.includes(c.id) || c.class_teacher_id === user?.id);
    }
    return list;
  }, [classes, teacherAllocations, isStaff, user?.id, selectedSection]);

  useEffect(() => {
    if (filteredClasses.length > 0 && !filteredClasses.some(c => c.id === selectedClassId)) {
      setSelectedClassId(filteredClasses[0].id);
    } else if (filteredClasses.length === 0) {
      setSelectedClassId("");
    }
  }, [filteredClasses, selectedClassId]);

  const filteredExams = useMemo(() => {
    return exams.filter(e => e.class_id === selectedClassId);
  }, [exams, selectedClassId]);

  useEffect(() => {
    if (filteredExams.length > 0 && !filteredExams.some(e => e.id === selectedExamId)) {
      setSelectedExamId(filteredExams[0].id);
    } else if (filteredExams.length === 0) {
      setSelectedExamId("");
    }
  }, [filteredExams, selectedExamId]);

  const currentExamSubject = useMemo(() => {
    return examSubjects.find(es => es.exam_id === selectedExamId && es.subject_id === selectedSubjectId);
  }, [examSubjects, selectedExamId, selectedSubjectId]);

  const filteredSubjects = useMemo(() => {
    // Look up what subjects are actually mapped to this exam
    const activeExamSubjects = examSubjects.filter(es => es.exam_id === selectedExamId);
    let list = subjects.filter(s => activeExamSubjects.some(es => es.subject_id === s.id));

    if (!isStaff) {
      const cls = classes.find(c => c.id === selectedClassId);
      const isClassTeacher = cls?.class_teacher_id === user?.id;
      
      // If they are class teacher, they can view all subjects for the class
      // Otherwise restrict to allocated subjects
      if (!isClassTeacher) {
        const allocatedSubjectIds = teacherAllocations
          .filter(ta => ta.class_id === selectedClassId)
          .map(ta => ta.subject_id);
        list = list.filter(s => allocatedSubjectIds.includes(s.id));
      }
    }
    return list;
  }, [subjects, selectedExamId, examSubjects, isStaff, teacherAllocations, selectedClassId, classes, user?.id]);

  useEffect(() => {
    if (filteredSubjects.length > 0 && !filteredSubjects.some(s => s.id === selectedSubjectId)) {
      setSelectedSubjectId(filteredSubjects[0].id);
    } else if (filteredSubjects.length === 0) {
      setSelectedSubjectId("");
    }
  }, [filteredSubjects, selectedSubjectId]);

  // Fetch Marks
  useEffect(() => {
    if (!selectedExamId || !selectedClassId || !currentExamSubject) {
      setMarks({});
      return;
    }

    const fetchMarks = async () => {
      try {
        const classStudentIds = students.filter(s => s.class_id === selectedClassId).map(s => s.id);
        if (classStudentIds.length === 0) {
          setMarks({});
          return;
        }

        const { data } = await (supabase as any).from("mark_entries")
          .select("*")
          .eq("exam_id", selectedExamId)
          .eq("exam_subject_id", currentExamSubject.id)
          .in("student_id", classStudentIds);

        const mRecord: Record<string, MarkEntry> = {};
        
        // Initialize for all students
        classStudentIds.forEach(sid => {
          const match = (data || []).find((d: any) => d.student_id === sid);
          if (match) {
            mRecord[sid] = {
              id: match.id,
              student_id: match.student_id,
              marks_obtained: Number(match.marks_obtained || 0),
              grade: match.grade || "",
              remarks: match.remarks || "",
              is_absent: match.is_absent || false,
              is_medical_exempt: match.is_medical_exempt || false,
              status: match.status || "Draft"
            };
          } else {
             mRecord[sid] = {
              student_id: sid,
              marks_obtained: 0,
              grade: "F",
              remarks: "",
              is_absent: false,
              is_medical_exempt: false,
              status: "Draft"
            };
          }
        });
        setMarks(mRecord);
      } catch (err) {
        console.error("Error loading marks:", err);
      }
    };

    void fetchMarks();
  }, [selectedExamId, selectedClassId, currentExamSubject, students]);

  // Derive global status for the current subject
  const currentStatusArray = Object.values(marks).map(m => m.status);
  const overallStatus = currentStatusArray.length > 0 
    ? (currentStatusArray.every(s => s === currentStatusArray[0]) ? currentStatusArray[0] : "Mixed") 
    : "Draft";

  // Check editing permissions based on subject allocation & lock status
  const isAssignedSubjectTeacher = useMemo(() => {
    if (isStaff) return true;
    if (!selectedClassId || !selectedSubjectId) return false;

    return teacherAllocations.some(sa => 
      sa.class_id === selectedClassId && 
      sa.subject_id === selectedSubjectId && 
      sa.teacher_id === user?.id
    );
  }, [isStaff, selectedClassId, selectedSubjectId, teacherAllocations, user?.id]);

  const isClassTeacher = useMemo(() => {
    const cls = classes.find(c => c.id === selectedClassId);
    return cls?.class_teacher_id === user?.id;
  }, [classes, selectedClassId, user?.id]);

  const canEditMarks = useMemo(() => {
    // If not allocated subject teacher, they cannot edit. Period.
    if (!isAssignedSubjectTeacher && !isStaff) return false;
    
    // Admins/Principals can edit until locked
    if (isStaff) {
      return overallStatus !== "Locked" && overallStatus !== "Published";
    }

    // Teachers can only edit in Draft or Submitted
    return overallStatus === "Draft" || overallStatus === "Submitted" || overallStatus === "Mixed";
  }, [isAssignedSubjectTeacher, isStaff, overallStatus]);

  // Auto-save logic
  const handleMarkChange = (studentId: string, updates: Partial<MarkEntry>) => {
    if (!currentExamSubject || !canEditMarks) return;

    setMarks(prev => {
      const existing = prev[studentId];
      const maxMarks = currentExamSubject.max_marks;
      
      let newObtained = updates.marks_obtained ?? existing.marks_obtained;
      // Clamp values
      newObtained = Math.min(Math.max(newObtained, 0), maxMarks);
      
      const newAbsent = updates.is_absent ?? existing.is_absent;
      const newMedical = updates.is_medical_exempt ?? existing.is_medical_exempt;
      
      const newGrade = calculateGrade(newObtained, maxMarks, newAbsent, newMedical);

      const nextState = {
        ...existing,
        ...updates,
        marks_obtained: newObtained,
        grade: newGrade,
        is_absent: newAbsent,
        is_medical_exempt: newMedical
      };

      // Debounce saving to Supabase
      if (saveTimeoutRef.current[studentId]) {
        clearTimeout(saveTimeoutRef.current[studentId]);
      }

      saveTimeoutRef.current[studentId] = setTimeout(() => {
        saveSingleMark(studentId, nextState);
      }, 1000);

      return {
        ...prev,
        [studentId]: nextState
      };
    });
  };

  const saveSingleMark = async (studentId: string, entry: MarkEntry) => {
    if (!selectedExamId || !currentExamSubject || !schoolId) return;
    
    setIsSaving(true);
    try {
      const payload = {
        school_id: schoolId,
        exam_id: selectedExamId,
        exam_subject_id: currentExamSubject.id,
        student_id: studentId,
        marks_obtained: entry.marks_obtained,
        grade: entry.grade,
        remarks: entry.remarks,
        is_absent: entry.is_absent,
        is_medical_exempt: entry.is_medical_exempt,
        status: entry.status || 'Draft'
      };

      if (entry.id) {
        await (supabase as any).from("mark_entries").update(payload).eq("id", entry.id);
      } else {
        const { data, error } = await (supabase as any).from("mark_entries").insert(payload).select("id").single();
        if (error) throw error;
        if (data) {
          setMarks(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], id: data.id }
          }));
        }
      }
    } catch (err: any) {
      toast.error("Failed to auto-save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Bulk Status Update (Workflow)
  const handleUpdateExamStatus = async (newStatus: string) => {
    if (!selectedExamId || !currentExamSubject) return;
    setIsSaving(true);
    try {
      const studentIds = Object.keys(marks);
      if (studentIds.length === 0) return;

      // Force save any pending first
      const promises = studentIds.map(async (studentId) => {
        const entry = marks[studentId];
        const payload = {
          school_id: schoolId!,
          exam_id: selectedExamId,
          exam_subject_id: currentExamSubject.id,
          student_id: studentId,
          marks_obtained: entry.marks_obtained,
          grade: entry.grade,
          remarks: entry.remarks,
          is_absent: entry.is_absent,
          is_medical_exempt: entry.is_medical_exempt,
          status: newStatus
        };

        if (entry.id) {
          return (supabase as any).from("mark_entries").update(payload).eq("id", entry.id);
        } else {
          return (supabase as any).from("mark_entries").insert(payload);
        }
      });

      await Promise.all(promises);

      // Trigger WhatsApp results notification if published
      if (newStatus === "Published") {
        void (async () => {
          try {
            const templates = await whatsappService.getTemplates(schoolId!);
            const template = templates.find(t => t.name === "exam_result_notification");
            if (template) {
              const { data: studs } = await supabase
                .from("students")
                .select("id, full_name, parent_user_id, emergency_contact")
                .in("id", studentIds);

              for (const stud of (studs || [])) {
                const phone = stud.emergency_contact || "+91 90000 00000";
                const markEntry = marks[stud.id];
                if (markEntry) {
                  const maxMarks = currentExamSubject.max_marks || 100;
                  const pct = Math.round((markEntry.marks_obtained / maxMarks) * 100);
                  // Variables: ["student_name", "percentage"]
                  await whatsappService.sendTemplateMessage(
                    schoolId!,
                    phone,
                    template.id!,
                    [stud.full_name, String(pct)],
                    stud.id,
                    stud.parent_user_id
                  );
                }
              }
              toast.success("WhatsApp results alerts broadcasted to parents.");
            }
          } catch (err) {
            console.error("WhatsApp exam marks trigger failed:", err);
          }
        })();
      }

      // Re-fetch to get exact states
      toast.success(`Subject marks status updated to ${newStatus}`);
      void loadData();
    } catch (err: any) {
      toast.error("Status update failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading marks manager...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Marks Management"
        breadcrumb="Academics"
        actions={
          <div className="flex gap-2 text-xs font-semibold">
            <span className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${
              overallStatus === "Draft" ? "bg-slate-100 text-slate-700 border-slate-200" :
              overallStatus === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-200" :
              overallStatus === "Verified" ? "bg-purple-50 text-purple-700 border-purple-200" :
              overallStatus === "Approved" ? "bg-amber-50 text-amber-700 border-amber-200" :
              overallStatus === "Locked" ? "bg-rose-50 text-rose-800 border-rose-200" :
              "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}>
              <Shield className="size-3.5" /> Status: {overallStatus.toUpperCase()}
            </span>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        
        {/* Filters Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Class</span>
              <select 
                value={selectedClassId} 
                onChange={(e) => setSelectedClassId(e.target.value)} 
                className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                {filteredClasses.length === 0 && <option value="">No Allocated Classes</option>}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Section</span>
              <select 
                value={selectedSection} 
                onChange={(e) => setSelectedSection(e.target.value)} 
                className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                <option value="All">All Sections</option>
                <option value="a">Section A</option>
                <option value="b">Section B</option>
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Exam Term</span>
              <select 
                value={selectedExamId} 
                onChange={(e) => setSelectedExamId(e.target.value)} 
                className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                {filteredExams.length === 0 && <option value="">-- No Exams --</option>}
                {filteredExams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Subject</span>
              <select 
                value={selectedSubjectId} 
                onChange={(e) => setSelectedSubjectId(e.target.value)} 
                className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
              >
                 {filteredSubjects.length === 0 && <option value="">-- No Subjects --</option>}
                {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={loadData}
              className="p-1.5 border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg bg-card text-muted-foreground transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Lock workflow banner */}
        {selectedExamId && selectedSubjectId && (
          <div className="bg-slate-50 dark:bg-slate-800/10 p-5 rounded-2xl border border-border dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-slate-850 dark:text-slate-100 flex items-center gap-1.5">
                <Shield className="size-4 text-indigo-500" /> Marks Lock Workflow
              </h4>
              <p className="text-xs text-muted-foreground">
                Current Subject Status: <strong className="text-slate-800 dark:text-slate-200">{overallStatus}</strong>.
                {!canEditMarks && " Editing is strictly prohibited by RBAC rules because marks are locked or you lack allocation."}
                {canEditMarks && " You have edit privileges. Marks are auto-saved on change."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Teacher Subject Submission */}
              {isAssignedSubjectTeacher && (overallStatus === "Draft" || overallStatus === "Mixed") && (
                <button
                  onClick={() => handleUpdateExamStatus("Submitted")}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Submit Subject to Class Teacher
                </button>
              )}

              {/* Class Teacher actions */}
              {isClassTeacher && overallStatus === "Submitted" && (
                <>
                  <button
                    onClick={() => handleUpdateExamStatus("Verified")}
                    disabled={isSaving}
                    className="px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-purple-700 transition-all cursor-pointer"
                  >
                    Verify Subject Marks
                  </button>
                  <button
                    onClick={() => handleUpdateExamStatus("Draft")}
                    disabled={isSaving}
                    className="px-4 py-1.5 border border-red-200 bg-red-50 text-red-700 font-bold text-xs rounded-lg hover:bg-red-100 transition-all cursor-pointer"
                  >
                    Reject & Return to Draft
                  </button>
                </>
              )}

              {/* Admin/Principal actions */}
              {isStaff && overallStatus === "Verified" && (
                <button
                  onClick={() => handleUpdateExamStatus("Approved")}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-amber-600 transition-all cursor-pointer"
                >
                  Approve Marks
                </button>
              )}

              {isStaff && overallStatus === "Approved" && (
                <button
                  onClick={() => handleUpdateExamStatus("Locked")}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-rose-700 transition-all cursor-pointer"
                >
                  Lock Marks (Final)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Grid Entry table */}
        {selectedExamId && currentExamSubject ? (
          <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-850 dark:text-slate-100">Student Scores Grid</h3>
                <p className="text-xs text-muted-foreground">Class: {classes.find(c => c.id === selectedClassId)?.name} · Subject: {subjects.find(s => s.id === selectedSubjectId)?.name} · Max Score: {currentExamSubject?.max_marks} · Pass: {currentExamSubject?.pass_marks}</p>
              </div>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                {isSaving ? <span className="flex items-center gap-1"><RefreshCw className="size-3 animate-spin" /> Auto-saving...</span> : <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 className="size-3" /> Saved</span>}
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-slate-150 dark:border-slate-800 font-bold uppercase">
                    <th className="py-2.5 px-4 w-20">Roll No</th>
                    <th className="py-2.5 px-4">Student Name</th>
                    <th className="py-2.5 px-4 text-center w-28">Max Marks</th>
                    <th className="py-2.5 px-4 text-right w-36">Obtained</th>
                    <th className="py-2.5 px-4 text-center w-36">Flags</th>
                    <th className="py-2.5 px-4 text-center w-24">Grade</th>
                    <th className="py-2.5 px-4">Teacher Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.filter(s => s.class_id === selectedClassId).map((student) => {
                    const studentMark = marks[student.id];
                    if (!studentMark) return null;

                    return (
                      <tr key={student.id} className="border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-slate-500">#{student.roll_number || "—"}</td>
                        <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-100">
                          <div className="flex items-center gap-2">
                             <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0">
                              {student.photo_url ? (
                                <img src={student.photo_url} alt="" className="size-full object-cover" />
                              ) : (
                                student.full_name.slice(0, 1).toUpperCase()
                              )}
                            </div>
                            {student.full_name}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-slate-500">{currentExamSubject.max_marks}</td>
                        <td className="py-3 px-4 text-right">
                          <input
                            type="number"
                            min="0"
                            max={currentExamSubject.max_marks}
                            step="0.5"
                            value={studentMark.marks_obtained}
                            disabled={!canEditMarks || studentMark.is_absent || studentMark.is_medical_exempt}
                            onChange={(e) => handleMarkChange(student.id, { marks_obtained: Number(e.target.value) })}
                            className="w-24 px-2 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-right font-black focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={studentMark.is_absent}
                                disabled={!canEditMarks || studentMark.is_medical_exempt}
                                onChange={(e) => handleMarkChange(student.id, { is_absent: e.target.checked })}
                                className="rounded border-slate-300 text-rose-500 focus:ring-rose-500 disabled:opacity-50"
                              />
                              <span className="text-[10px] font-bold text-rose-600">ABS</span>
                            </label>
                            <label className="flex items-center gap-1 cursor-pointer">
                              <input 
                                type="checkbox" 
                                checked={studentMark.is_medical_exempt}
                                disabled={!canEditMarks || studentMark.is_absent}
                                onChange={(e) => handleMarkChange(student.id, { is_medical_exempt: e.target.checked })}
                                className="rounded border-slate-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50"
                              />
                              <span className="text-[10px] font-bold text-blue-600">MED</span>
                            </label>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded font-black text-[10px] ${
                            studentMark.grade.includes("F") ? "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400" :
                            studentMark.grade.includes("EX") ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" :
                            studentMark.grade.includes("A") ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-400" :
                            "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400"
                          }`}>
                            {studentMark.grade}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={studentMark.remarks}
                            disabled={!canEditMarks}
                            placeholder="Enter remarks..."
                            onChange={(e) => handleMarkChange(student.id, { remarks: e.target.value })}
                            className="w-full px-2.5 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all"
                          />
                        </td>
                      </tr>
                    );
                  })}

                  {students.filter(s => s.class_id === selectedClassId).length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground italic">No students enrolled in this class.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800">
            <BookOpen className="size-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Select class, exam term, and subject above to enter marks.</p>
          </div>
        )}

      </div>
    </>
  );
}
