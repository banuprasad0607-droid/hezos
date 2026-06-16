import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import { ReportCardGenerator } from "@/components/marks/ReportCardGenerator";
import { FileText, RefreshCw, Trophy, Download } from "lucide-react";
import { createPortal } from "react-dom";

export const Route = createFileRoute("/_authenticated/report-cards")({
  component: ReportCardsPage,
});

function ReportCardsPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Report Cards");

  const isStaff = roles.includes("super_admin") || roles.includes("admin") || roles.includes("principal");

  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  const [classes, setClasses] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [markEntries, setMarkEntries] = useState<any[]>([]);
  const [examSubjects, setExamSubjects] = useState<any[]>([]);
  const [teacherAllocations, setTeacherAllocations] = useState<any[]>([]);
  const [schoolData, setSchoolData] = useState<any>(null);

  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");

  const hiddenPdfRef = useRef<HTMLDivElement>(null);

  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      const { data: schoolRes } = await supabase.from("schools").select("*").eq("id", schoolId).single();
      setSchoolData(schoolRes);

      const { data: allocData } = await (supabase as any).from("teacher_allocations").select("*").eq("school_id", schoolId);
      setTeacherAllocations(allocData || []);

      const { data: classesData } = await supabase.from("classes").select("*").eq("school_id", schoolId).is("deleted_at", null).order("name");
      setClasses(classesData || []);

      const { data: examsData } = await supabase.from("exams").select("*").eq("school_id", schoolId).order("date", { ascending: false });
      setExams(examsData || []);

      const { data: examSubjData } = await (supabase as any).from("exam_subjects").select("*, subjects(name, code)").eq("school_id", schoolId);
      setExamSubjects(examSubjData || []);

    } catch (err: any) {
      toast.error("Error loading data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [schoolId]);

  // Load students and marks when class and exam are selected
  useEffect(() => {
    if (!selectedClassId || !selectedExamId || !schoolId) {
      setStudents([]);
      setMarkEntries([]);
      return;
    }

    const fetchDetails = async () => {
      try {
        const { data: studentsData } = await supabase
          .from("students")
          .select("*")
          .eq("school_id", schoolId)
          .eq("class_id", selectedClassId)
          .is("deleted_at", null);
        setStudents(studentsData || []);

        const studentIds = (studentsData || []).map(s => s.id);

        if (studentIds.length > 0) {
          const { data: marksData } = await (supabase as any)
            .from("mark_entries")
            .select("*")
            .eq("exam_id", selectedExamId)
            .in("student_id", studentIds);
          setMarkEntries(marksData || []);
        } else {
          setMarkEntries([]);
        }
      } catch (err) {
        console.error("Error loading details:", err);
      }
    };

    void fetchDetails();
  }, [selectedClassId, selectedExamId, schoolId]);

  const filteredClasses = classes.filter(c => {
    if (isStaff) return true;
    return teacherAllocations.some(ta => ta.class_id === c.id && ta.teacher_id === user?.id) || c.class_teacher_id === user?.id;
  });

  const activeExam = exams.find(e => e.id === selectedExamId);
  const activeClass = classes.find(c => c.id === selectedClassId);

  const getStudentReportData = (student: any) => {
    const studentMarks = markEntries.filter(m => m.student_id === student.id);
    const mappedMarks = studentMarks.map(m => {
      const exSubj = examSubjects.find(es => es.id === m.exam_subject_id);
      return {
        subject: exSubj?.subjects?.name || "Unknown Subject",
        max_marks: exSubj?.max_marks || 100,
        pass_marks: exSubj?.pass_marks || 35,
        obtained: Number(m.marks_obtained),
        grade: m.grade || "",
        remarks: m.remarks || "",
        is_absent: m.is_absent || false,
        is_medical_exempt: m.is_medical_exempt || false
      };
    });

    return {
      school: {
        name: schoolData?.name || "School Name",
        logo_url: schoolData?.logo_url,
        address: schoolData?.address,
        phone: schoolData?.phone
      },
      exam: {
        name: activeExam?.name || "Exam",
        academic_year: activeExam?.academic_year || "2026-2027"
      },
      student: {
        full_name: student.full_name,
        roll_number: student.roll_number,
        admission_number: student.admission_number,
        class_name: activeClass?.name || "",
        section: activeClass?.section || "",
        photo_url: student.photo_url,
        attendance_pct: 95 // Hardcoded for demo, would come from attendance table
      },
      marks: mappedMarks,
      overallRemarks: "Promoted to next class." // Could be fetched from a generic remarks table
    };
  };

  const exportSinglePDF = async (student: any) => {
    if (!hiddenPdfRef.current) return;
    setIsExporting(true);
    toast.info(`Generating PDF for ${student.full_name}...`);

    try {
      // 1. Give React time to render the portal (handled by a small delay)
      await new Promise(r => setTimeout(r, 150)); 
      
      const el = document.getElementById(`report-card-${student.id}`);
      if (!el) throw new Error("DOM element not found");

      const canvas = await safeHtml2Canvas(el, { scale: 2 });
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.full_name}_ReportCard.pdf`);
      toast.success("Downloaded successfully!");

    } catch (err: any) {
      toast.error("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  if (tenantLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading report cards...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Report Cards" breadcrumb="Academics" />

      <div className="p-6 lg:p-8 space-y-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Class</span>
            <select 
              value={selectedClassId} 
              onChange={(e) => setSelectedClassId(e.target.value)} 
              className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="">-- Select Class --</option>
              {filteredClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted-foreground uppercase">Exam Term</span>
            <select 
              value={selectedExamId} 
              onChange={(e) => setSelectedExamId(e.target.value)} 
              className="mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
            >
              <option value="">-- Select Exam --</option>
              {exams.filter(e => e.class_id === selectedClassId).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
        </div>

        {selectedClassId && selectedExamId ? (
          <div className="bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold">Students</h3>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800">
                <tr>
                  <th className="py-3 px-6 font-semibold">Roll No</th>
                  <th className="py-3 px-6 font-semibold">Name</th>
                  <th className="py-3 px-6 font-semibold text-center">Marks Entered</th>
                  <th className="py-3 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-slate-800">
                {students.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No students found.</td></tr>
                ) : (
                  students.map(student => {
                    const studentMarksCount = markEntries.filter(m => m.student_id === student.id).length;
                    
                    return (
                      <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                        <td className="py-3 px-6 text-slate-500 font-mono font-bold">#{student.roll_number || "—"}</td>
                        <td className="py-3 px-6 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                           <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0">
                            {student.photo_url ? (
                              <img src={student.photo_url} alt="" className="size-full object-cover" />
                            ) : (
                              <span className="text-[10px]">{student.full_name.charAt(0)}</span>
                            )}
                          </div>
                          {student.full_name}
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${studentMarksCount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                            {studentMarksCount} Subjects
                          </span>
                        </td>
                        <td className="py-3 px-6 text-right">
                           <button
                            disabled={isExporting || studentMarksCount === 0}
                            onClick={() => exportSinglePDF(student)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded shadow-sm hover:bg-brand/90 disabled:opacity-50 transition-all cursor-pointer"
                          >
                            <Download className="size-3" /> PDF
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800">
            <Trophy className="size-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold">Select class and exam term above to generate report cards.</p>
          </div>
        )}
      </div>

      {/* Hidden Portal for PDF Generation */}
      {selectedClassId && selectedExamId && createPortal(
        <div ref={hiddenPdfRef} className="absolute left-[-9999px] top-[-9999px] pointer-events-none opacity-0">
          {students.map(student => (
            <div key={student.id} id={`report-card-${student.id}`} className="bg-white">
              <ReportCardGenerator {...getStudentReportData(student)} />
            </div>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
