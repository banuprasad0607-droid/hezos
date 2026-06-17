import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { w as whatsappService } from "./whatsapp-service-rc8qIpIC.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  ad as Shield,
  a6 as RefreshCw,
  r as CircleCheck,
  f as BookOpen,
} from "../_libs/lucide-react.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "../_libs/zod.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
function MarksManagementPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Marks Management");
  const isSuperAdmin = roles.includes("super_admin");
  const isAdmin = roles.includes("admin");
  const isPrincipal = roles.includes("principal");
  const isStaff = isSuperAdmin || isAdmin || isPrincipal;
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [exams, setExams] = reactExports.useState([]);
  const [examSubjects, setExamSubjects] = reactExports.useState([]);
  const [teacherAllocations, setTeacherAllocations] = reactExports.useState([]);
  const [selectedClassId, setSelectedClassId] = reactExports.useState("");
  const [selectedSection, setSelectedSection] = reactExports.useState("All");
  const [selectedExamId, setSelectedExamId] = reactExports.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = reactExports.useState("");
  const [marks, setMarks] = reactExports.useState({});
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const saveTimeoutRef = reactExports.useRef({});
  const gradeThresholds = {
    "A+": 91,
    A: 81,
    "B+": 71,
    B: 61,
    "C+": 51,
    C: 41,
    D: 35,
  };
  const calculateGrade = (obtained, max, isAbsent, isMedical) => {
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
  const loadData = async () => {
    if (!schoolId || !user?.id) return;
    setIsLoading(true);
    try {
      const { data: allocData } = await supabase
        .from("teacher_allocations")
        .select("id, teacher_id, subject_id, class_id")
        .eq("school_id", schoolId);
      setTeacherAllocations(allocData || []);
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, name, grade, section, class_teacher_id")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);
      const { data: examsData } = await supabase
        .from("exams")
        .select("id, class_id, name, type, academic_year, date")
        .eq("school_id", schoolId)
        .order("date", {
          ascending: false,
        });
      setExams(examsData || []);
      const { data: examSubjectsData } = await supabase
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks, pass_marks")
        .eq("school_id", schoolId);
      setExamSubjects(examSubjectsData || []);
      const { data: studentsData } = await supabase
        .from("students")
        .select("id, full_name, roll_number, class_id, photo_url")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("full_name");
      setStudents(studentsData || []);
    } catch (err) {
      toast.error("Failed to load data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, [schoolId, user?.id]);
  const filteredClasses = reactExports.useMemo(() => {
    let list = classes;
    if (selectedSection !== "All") {
      list = list.filter(
        (c) =>
          c.section?.toLowerCase() === selectedSection.toLowerCase() ||
          c.name.toLowerCase().includes(selectedSection.toLowerCase()),
      );
    }
    if (!isStaff) {
      const allocatedClassIds = teacherAllocations.map((sa) => sa.class_id);
      list = list.filter(
        (c) => allocatedClassIds.includes(c.id) || c.class_teacher_id === user?.id,
      );
    }
    return list;
  }, [classes, teacherAllocations, isStaff, user?.id, selectedSection]);
  reactExports.useEffect(() => {
    if (filteredClasses.length > 0 && !filteredClasses.some((c) => c.id === selectedClassId)) {
      setSelectedClassId(filteredClasses[0].id);
    } else if (filteredClasses.length === 0) {
      setSelectedClassId("");
    }
  }, [filteredClasses, selectedClassId]);
  const filteredExams = reactExports.useMemo(() => {
    return exams.filter((e) => e.class_id === selectedClassId);
  }, [exams, selectedClassId]);
  reactExports.useEffect(() => {
    if (filteredExams.length > 0 && !filteredExams.some((e) => e.id === selectedExamId)) {
      setSelectedExamId(filteredExams[0].id);
    } else if (filteredExams.length === 0) {
      setSelectedExamId("");
    }
  }, [filteredExams, selectedExamId]);
  const currentExamSubject = reactExports.useMemo(() => {
    return examSubjects.find(
      (es) => es.exam_id === selectedExamId && es.subject_id === selectedSubjectId,
    );
  }, [examSubjects, selectedExamId, selectedSubjectId]);
  const filteredSubjects = reactExports.useMemo(() => {
    const activeExamSubjects = examSubjects.filter((es) => es.exam_id === selectedExamId);
    let list = subjects.filter((s) => activeExamSubjects.some((es) => es.subject_id === s.id));
    if (!isStaff) {
      const cls = classes.find((c) => c.id === selectedClassId);
      const isClassTeacher2 = cls?.class_teacher_id === user?.id;
      if (!isClassTeacher2) {
        const allocatedSubjectIds = teacherAllocations
          .filter((ta) => ta.class_id === selectedClassId)
          .map((ta) => ta.subject_id);
        list = list.filter((s) => allocatedSubjectIds.includes(s.id));
      }
    }
    return list;
  }, [
    subjects,
    selectedExamId,
    examSubjects,
    isStaff,
    teacherAllocations,
    selectedClassId,
    classes,
    user?.id,
  ]);
  reactExports.useEffect(() => {
    if (filteredSubjects.length > 0 && !filteredSubjects.some((s) => s.id === selectedSubjectId)) {
      setSelectedSubjectId(filteredSubjects[0].id);
    } else if (filteredSubjects.length === 0) {
      setSelectedSubjectId("");
    }
  }, [filteredSubjects, selectedSubjectId]);
  reactExports.useEffect(() => {
    if (!selectedExamId || !selectedClassId || !currentExamSubject) {
      setMarks({});
      return;
    }
    const fetchMarks = async () => {
      try {
        const classStudentIds = students
          .filter((s) => s.class_id === selectedClassId)
          .map((s) => s.id);
        if (classStudentIds.length === 0) {
          setMarks({});
          return;
        }
        const { data } = await supabase
          .from("mark_entries")
          .select("*")
          .eq("exam_id", selectedExamId)
          .eq("exam_subject_id", currentExamSubject.id)
          .in("student_id", classStudentIds);
        const mRecord = {};
        classStudentIds.forEach((sid) => {
          const match = (data || []).find((d) => d.student_id === sid);
          if (match) {
            mRecord[sid] = {
              id: match.id,
              student_id: match.student_id,
              marks_obtained: Number(match.marks_obtained || 0),
              grade: match.grade || "",
              remarks: match.remarks || "",
              is_absent: match.is_absent || false,
              is_medical_exempt: match.is_medical_exempt || false,
              status: match.status || "Draft",
            };
          } else {
            mRecord[sid] = {
              student_id: sid,
              marks_obtained: 0,
              grade: "F",
              remarks: "",
              is_absent: false,
              is_medical_exempt: false,
              status: "Draft",
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
  const currentStatusArray = Object.values(marks).map((m) => m.status);
  const overallStatus =
    currentStatusArray.length > 0
      ? currentStatusArray.every((s) => s === currentStatusArray[0])
        ? currentStatusArray[0]
        : "Mixed"
      : "Draft";
  const isAssignedSubjectTeacher = reactExports.useMemo(() => {
    if (isStaff) return true;
    if (!selectedClassId || !selectedSubjectId) return false;
    return teacherAllocations.some(
      (sa) =>
        sa.class_id === selectedClassId &&
        sa.subject_id === selectedSubjectId &&
        sa.teacher_id === user?.id,
    );
  }, [isStaff, selectedClassId, selectedSubjectId, teacherAllocations, user?.id]);
  const isClassTeacher = reactExports.useMemo(() => {
    const cls = classes.find((c) => c.id === selectedClassId);
    return cls?.class_teacher_id === user?.id;
  }, [classes, selectedClassId, user?.id]);
  const canEditMarks = reactExports.useMemo(() => {
    if (!isAssignedSubjectTeacher && !isStaff) return false;
    if (isStaff) {
      return overallStatus !== "Locked" && overallStatus !== "Published";
    }
    return overallStatus === "Draft" || overallStatus === "Submitted" || overallStatus === "Mixed";
  }, [isAssignedSubjectTeacher, isStaff, overallStatus]);
  const handleMarkChange = (studentId, updates) => {
    if (!currentExamSubject || !canEditMarks) return;
    setMarks((prev) => {
      const existing = prev[studentId];
      const maxMarks = currentExamSubject.max_marks;
      let newObtained = updates.marks_obtained ?? existing.marks_obtained;
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
        is_medical_exempt: newMedical,
      };
      if (saveTimeoutRef.current[studentId]) {
        clearTimeout(saveTimeoutRef.current[studentId]);
      }
      saveTimeoutRef.current[studentId] = setTimeout(() => {
        saveSingleMark(studentId, nextState);
      }, 1e3);
      return {
        ...prev,
        [studentId]: nextState,
      };
    });
  };
  const saveSingleMark = async (studentId, entry) => {
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
        status: entry.status || "Draft",
      };
      if (entry.id) {
        await supabase.from("mark_entries").update(payload).eq("id", entry.id);
      } else {
        const { data, error } = await supabase
          .from("mark_entries")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        if (data) {
          setMarks((prev) => ({
            ...prev,
            [studentId]: {
              ...prev[studentId],
              id: data.id,
            },
          }));
        }
      }
    } catch (err) {
      toast.error("Failed to auto-save: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };
  const handleUpdateExamStatus = async (newStatus) => {
    if (!selectedExamId || !currentExamSubject) return;
    setIsSaving(true);
    try {
      const studentIds = Object.keys(marks);
      if (studentIds.length === 0) return;
      const promises = studentIds.map(async (studentId) => {
        const entry = marks[studentId];
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
          status: newStatus,
        };
        if (entry.id) {
          return supabase.from("mark_entries").update(payload).eq("id", entry.id);
        } else {
          return supabase.from("mark_entries").insert(payload);
        }
      });
      await Promise.all(promises);
      if (newStatus === "Published") {
        void (async () => {
          try {
            const templates = await whatsappService.getTemplates(schoolId);
            const template = templates.find((t) => t.name === "exam_result_notification");
            if (template) {
              const { data: studs } = await supabase
                .from("students")
                .select("id, full_name, parent_user_id, emergency_contact")
                .in("id", studentIds);
              for (const stud of studs || []) {
                const phone = stud.emergency_contact || "+91 90000 00000";
                const markEntry = marks[stud.id];
                if (markEntry) {
                  const maxMarks = currentExamSubject.max_marks || 100;
                  const pct = Math.round((markEntry.marks_obtained / maxMarks) * 100);
                  await whatsappService.sendTemplateMessage(
                    schoolId,
                    phone,
                    template.id,
                    [stud.full_name, String(pct)],
                    stud.id,
                    stud.parent_user_id,
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
      toast.success(`Subject marks status updated to ${newStatus}`);
      void loadData();
    } catch (err) {
      toast.error("Status update failed: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };
  if (tenantLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className:
        "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading marks manager...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Marks Management",
        breadcrumb: "Academics",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex gap-2 text-xs font-semibold",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
            className: `px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${overallStatus === "Draft" ? "bg-slate-100 text-slate-700 border-slate-200" : overallStatus === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-200" : overallStatus === "Verified" ? "bg-purple-50 text-purple-700 border-purple-200" : overallStatus === "Approved" ? "bg-amber-50 text-amber-700 border-amber-200" : overallStatus === "Locked" ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-3.5" }),
              " Status: ",
              overallStatus.toUpperCase(),
            ],
          }),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-6 lg:p-8 space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Class",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedClassId,
                        onChange: (e) => setSelectedClassId(e.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          filteredClasses.map((c) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: c.id, children: c.name },
                              c.id,
                            ),
                          ),
                          filteredClasses.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "",
                              children: "No Allocated Classes",
                            }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Section",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedSection,
                        onChange: (e) => setSelectedSection(e.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "All",
                            children: "All Sections",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "a",
                            children: "Section A",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "b",
                            children: "Section B",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Exam Term",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedExamId,
                        onChange: (e) => setSelectedExamId(e.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          filteredExams.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "",
                              children: "-- No Exams --",
                            }),
                          filteredExams.map((e) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: e.id, children: e.name },
                              e.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex flex-col",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-[10px] font-bold text-muted-foreground uppercase",
                        children: "Subject",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedSubjectId,
                        onChange: (e) => setSelectedSubjectId(e.target.value),
                        className:
                          "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                        children: [
                          filteredSubjects.length === 0 &&
                            /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                              value: "",
                              children: "-- No Subjects --",
                            }),
                          filteredSubjects.map((s) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: s.id, children: s.name },
                              s.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "flex items-center gap-2",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: loadData,
                  className:
                    "p-1.5 border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg bg-card text-muted-foreground transition-all cursor-pointer",
                  title: "Refresh",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                    className: `size-4 ${isLoading ? "animate-spin" : ""}`,
                  }),
                }),
              }),
            ],
          }),
          selectedExamId &&
            selectedSubjectId &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "bg-slate-50 dark:bg-slate-800/10 p-5 rounded-2xl border border-border dark:border-slate-800 flex flex-wrap items-center justify-between gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-1",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", {
                      className:
                        "font-bold text-sm text-slate-850 dark:text-slate-100 flex items-center gap-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, {
                          className: "size-4 text-indigo-500",
                        }),
                        " Marks Lock Workflow",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                      className: "text-xs text-muted-foreground",
                      children: [
                        "Current Subject Status: ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                          className: "text-slate-800 dark:text-slate-200",
                          children: overallStatus,
                        }),
                        ".",
                        !canEditMarks &&
                          " Editing is strictly prohibited by RBAC rules because marks are locked or you lack allocation.",
                        canEditMarks &&
                          " You have edit privileges. Marks are auto-saved on change.",
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex flex-wrap gap-2",
                  children: [
                    isAssignedSubjectTeacher &&
                      (overallStatus === "Draft" || overallStatus === "Mixed") &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => handleUpdateExamStatus("Submitted"),
                        disabled: isSaving,
                        className:
                          "px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-blue-700 transition-all cursor-pointer",
                        children: "Submit Subject to Class Teacher",
                      }),
                    isClassTeacher &&
                      overallStatus === "Submitted" &&
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                            onClick: () => handleUpdateExamStatus("Verified"),
                            disabled: isSaving,
                            className:
                              "px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-purple-700 transition-all cursor-pointer",
                            children: "Verify Subject Marks",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                            onClick: () => handleUpdateExamStatus("Draft"),
                            disabled: isSaving,
                            className:
                              "px-4 py-1.5 border border-red-200 bg-red-50 text-red-700 font-bold text-xs rounded-lg hover:bg-red-100 transition-all cursor-pointer",
                            children: "Reject & Return to Draft",
                          }),
                        ],
                      }),
                    isStaff &&
                      overallStatus === "Verified" &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => handleUpdateExamStatus("Approved"),
                        disabled: isSaving,
                        className:
                          "px-4 py-1.5 bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-amber-600 transition-all cursor-pointer",
                        children: "Approve Marks",
                      }),
                    isStaff &&
                      overallStatus === "Approved" &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => handleUpdateExamStatus("Locked"),
                        disabled: isSaving,
                        className:
                          "px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-rose-700 transition-all cursor-pointer",
                        children: "Lock Marks (Final)",
                      }),
                  ],
                }),
              ],
            }),
          selectedExamId && currentExamSubject
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center justify-between",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                            className: "font-bold text-base text-slate-850 dark:text-slate-100",
                            children: "Student Scores Grid",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "text-xs text-muted-foreground",
                            children: [
                              "Class: ",
                              classes.find((c) => c.id === selectedClassId)?.name,
                              " · Subject: ",
                              subjects.find((s) => s.id === selectedSubjectId)?.name,
                              " · Max Score: ",
                              currentExamSubject?.max_marks,
                              " · Pass: ",
                              currentExamSubject?.pass_marks,
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
                        children: isSaving
                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                              className: "flex items-center gap-1",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                                  className: "size-3 animate-spin",
                                }),
                                " Auto-saving...",
                              ],
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                              className: "flex items-center gap-1 text-emerald-600",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                                  className: "size-3",
                                }),
                                " Saved",
                              ],
                            }),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                      className: "w-full text-xs text-left border-collapse",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                            className:
                              "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-slate-150 dark:border-slate-800 font-bold uppercase",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 w-20",
                                children: "Roll No",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4",
                                children: "Student Name",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center w-28",
                                children: "Max Marks",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-right w-36",
                                children: "Obtained",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center w-36",
                                children: "Flags",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center w-24",
                                children: "Grade",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4",
                                children: "Teacher Remarks",
                              }),
                            ],
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                          children: [
                            students
                              .filter((s) => s.class_id === selectedClassId)
                              .map((student) => {
                                const studentMark = marks[student.id];
                                if (!studentMark) return null;
                                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "tr",
                                  {
                                    className:
                                      "border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                        className: "py-3 px-4 font-mono font-bold text-slate-500",
                                        children: ["#", student.roll_number || "—"],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className:
                                          "py-3 px-4 font-bold text-slate-800 dark:text-slate-100",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0",
                                              children: student.photo_url
                                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                    src: student.photo_url,
                                                    alt: "",
                                                    className: "size-full object-cover",
                                                  })
                                                : student.full_name.slice(0, 1).toUpperCase(),
                                            }),
                                            student.full_name,
                                          ],
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className:
                                          "py-3 px-4 text-center font-semibold text-slate-500",
                                        children: currentExamSubject.max_marks,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-4 text-right",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                          type: "number",
                                          min: "0",
                                          max: currentExamSubject.max_marks,
                                          step: "0.5",
                                          value: studentMark.marks_obtained,
                                          disabled:
                                            !canEditMarks ||
                                            studentMark.is_absent ||
                                            studentMark.is_medical_exempt,
                                          onChange: (e) =>
                                            handleMarkChange(student.id, {
                                              marks_obtained: Number(e.target.value),
                                            }),
                                          className:
                                            "w-24 px-2 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-right font-black focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all",
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-4 text-center",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center justify-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                              className: "flex items-center gap-1 cursor-pointer",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                                  type: "checkbox",
                                                  checked: studentMark.is_absent,
                                                  disabled:
                                                    !canEditMarks || studentMark.is_medical_exempt,
                                                  onChange: (e) =>
                                                    handleMarkChange(student.id, {
                                                      is_absent: e.target.checked,
                                                    }),
                                                  className:
                                                    "rounded border-slate-300 text-rose-500 focus:ring-rose-500 disabled:opacity-50",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className: "text-[10px] font-bold text-rose-600",
                                                  children: "ABS",
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                              className: "flex items-center gap-1 cursor-pointer",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                                  type: "checkbox",
                                                  checked: studentMark.is_medical_exempt,
                                                  disabled: !canEditMarks || studentMark.is_absent,
                                                  onChange: (e) =>
                                                    handleMarkChange(student.id, {
                                                      is_medical_exempt: e.target.checked,
                                                    }),
                                                  className:
                                                    "rounded border-slate-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className: "text-[10px] font-bold text-blue-600",
                                                  children: "MED",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-4 text-center",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: `inline-block px-2.5 py-0.5 rounded font-black text-[10px] ${studentMark.grade.includes("F") ? "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400" : studentMark.grade.includes("EX") ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" : studentMark.grade.includes("A") ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-400" : "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400"}`,
                                          children: studentMark.grade,
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-4",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                          type: "text",
                                          value: studentMark.remarks,
                                          disabled: !canEditMarks,
                                          placeholder: "Enter remarks...",
                                          onChange: (e) =>
                                            handleMarkChange(student.id, {
                                              remarks: e.target.value,
                                            }),
                                          className:
                                            "w-full px-2.5 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all",
                                        }),
                                      }),
                                    ],
                                  },
                                  student.id,
                                );
                              }),
                            students.filter((s) => s.class_id === selectedClassId).length === 0 &&
                              /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  colSpan: 7,
                                  className: "py-8 text-center text-muted-foreground italic",
                                  children: "No students enrolled in this class.",
                                }),
                              }),
                          ],
                        }),
                      ],
                    }),
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
                    className: "size-10 mx-auto text-slate-300 mb-2",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "font-semibold",
                    children: "Select class, exam term, and subject above to enter marks.",
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
export { MarksManagementPage as component };
