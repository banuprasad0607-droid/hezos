import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  f as useTenant,
  c as usePageTitle,
  P as PageHeader,
  s as safeHtml2Canvas,
} from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
import { r as reactDomExports } from "../_libs/react-dom.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import { y as Download, ao as Trophy } from "../_libs/lucide-react.mjs";
import { f as format } from "../_libs/date-fns.mjs";
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
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
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
function ReportCardGenerator({ school, exam, student, marks, overallRemarks }) {
  const totalMax = marks.reduce((sum, m) => sum + m.max_marks, 0);
  const totalObtained = marks.reduce((sum, m) => {
    if (m.is_absent || m.is_medical_exempt) return sum;
    return sum + m.obtained;
  }, 0);
  const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  const getOverallGrade = (pct) => {
    if (pct >= 91) return "A+";
    if (pct >= 81) return "A";
    if (pct >= 71) return "B+";
    if (pct >= 61) return "B";
    if (pct >= 51) return "C+";
    if (pct >= 41) return "C";
    if (pct >= 35) return "D";
    return "F";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className:
      "bg-white w-[794px] min-h-[1123px] p-10 font-sans text-slate-800 mx-auto shadow-xl relative overflow-hidden",
    style: { boxSizing: "border-box" },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className:
          "absolute inset-4 border-[3px] border-double border-slate-800 pointer-events-none rounded-sm opacity-20",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className:
          "absolute inset-5 border border-slate-800 pointer-events-none rounded opacity-10",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className:
              "w-24 h-24 shrink-0 flex items-center justify-center bg-slate-50 rounded-lg overflow-hidden border border-slate-200",
            children: school.logo_url
              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                  src: school.logo_url,
                  alt: "Logo",
                  className: "w-full h-full object-contain p-2",
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "text-3xl font-black text-slate-300",
                  children: "Logo",
                }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex-1 text-center px-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-3xl font-black text-slate-900 tracking-tight uppercase",
                children: school.name,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm font-medium text-slate-600 mt-1 uppercase tracking-widest",
                children: school.address || "School Address Not Provided",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-xs text-slate-500 mt-0.5",
                children: ["Ph: ", school.phone || "N/A"],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 shrink-0" }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center mb-8 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
            className:
              "text-xl font-bold tracking-widest uppercase bg-slate-800 text-white inline-block px-6 py-1.5 rounded-full shadow-sm",
            children: "Report Card",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
            className: "text-sm font-bold text-slate-500 mt-2 uppercase tracking-widest",
            children: [exam.name, " • ", exam.academic_year],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex gap-6 mb-8 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className:
              "w-32 h-36 border-2 border-slate-200 rounded-lg overflow-hidden shrink-0 bg-slate-50 flex items-center justify-center",
            children: student.photo_url
              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                  src: student.photo_url,
                  alt: student.full_name,
                  className: "w-full h-full object-cover",
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "text-slate-300 font-bold text-xs uppercase tracking-widest text-center px-2",
                  children: "No Photo",
                }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex-1 grid grid-cols-2 gap-x-8 gap-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Student Name",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "font-bold text-lg",
                    children: student.full_name,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Class & Section",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className: "font-bold text-lg",
                    children: [student.class_name, " - ", student.section?.toUpperCase()],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Roll Number",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "font-semibold text-slate-700",
                    children: student.roll_number || "N/A",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "border-b border-slate-200 pb-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className:
                      "text-[10px] font-bold text-slate-400 uppercase tracking-wider block",
                    children: "Admission Number",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    className: "font-semibold text-slate-700",
                    children: student.admission_number || "N/A",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "mb-8 relative z-10",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
          className: "w-full border-collapse",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                className: "bg-slate-100 border-b-2 border-slate-800",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-left font-bold text-sm uppercase tracking-wider",
                    children: "Subject",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Max",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Pass",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Obtained",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-center font-bold text-sm uppercase tracking-wider",
                    children: "Grade",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                    className: "py-3 px-4 text-left font-bold text-sm uppercase tracking-wider",
                    children: "Remarks",
                  }),
                ],
              }),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
              children: marks.map((m, idx) =>
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "tr",
                  {
                    className: "border-b border-slate-200 even:bg-slate-50/50",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 font-bold text-slate-700",
                        children: m.subject,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 text-center font-medium text-slate-500",
                        children: m.max_marks,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 text-center font-medium text-slate-400",
                        children: m.pass_marks,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 text-center font-bold",
                        children: m.is_absent
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className: "text-rose-600 text-xs tracking-wider",
                              children: "ABS",
                            })
                          : m.is_medical_exempt
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "text-blue-600 text-xs tracking-wider",
                                children: "MED",
                              })
                            : m.obtained,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 text-center font-black",
                        children: m.grade,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                        className: "py-2.5 px-4 text-xs font-medium text-slate-600 italic",
                        children: m.remarks || "—",
                      }),
                    ],
                  },
                  idx,
                ),
              ),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tfoot", {
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                className: "border-t-[3px] border-slate-800 bg-slate-50",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                    className: "py-4 px-4 font-black uppercase text-right tracking-widest",
                    colSpan: 3,
                    children: "Grand Total:",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                    className: "py-4 px-4 text-center font-black text-xl",
                    children: [totalObtained, " / ", totalMax],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                    className: "py-4 px-4 text-center font-black text-xl text-brand",
                    children: [percentage.toFixed(1), "%"],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {}),
                ],
              }),
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid grid-cols-3 gap-6 mb-12 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Overall Grade",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-3xl font-black text-slate-800",
                children: getOverallGrade(percentage),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Attendance",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-3xl font-black text-slate-800",
                children: [student.attendance_pct ?? "—", "%"],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-slate-50 border border-slate-200 rounded-xl p-4 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1",
                children: "Result",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: `text-2xl font-black ${percentage >= 35 ? "text-emerald-600" : "text-rose-600"} mt-1 uppercase tracking-widest`,
                children: percentage >= 35 ? "Pass" : "Fail",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mb-12 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
            className:
              "font-bold text-sm uppercase tracking-widest text-slate-800 border-b border-slate-200 pb-2 mb-3",
            children: "Class Teacher Remarks",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className:
              "text-sm text-slate-600 italic bg-slate-50 p-4 rounded-lg border border-slate-100 min-h-[80px]",
            children: overallRemarks || "No remarks provided.",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mt-24 pt-8 border-t border-slate-200 flex justify-between px-10 relative z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "w-40 border-b border-slate-800 mb-2",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Class Teacher",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "w-40 border-b border-slate-800 mb-2",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Principal",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "w-40 border-b border-slate-800 mb-2",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                children: "Parent / Guardian",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "absolute bottom-6 left-0 right-0 text-center text-[9px] text-slate-400 font-medium tracking-widest uppercase",
        children: [
          "Generated on ",
          format(/* @__PURE__ */ new Date(), "MMM dd, yyyy"),
          " • Hezo School Connect",
        ],
      }),
    ],
  });
}
function ReportCardsPage() {
  const { currentSchoolId: schoolId, user, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Report Cards");
  const isStaff =
    roles.includes("super_admin") || roles.includes("admin") || roles.includes("principal");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isExporting, setIsExporting] = reactExports.useState(false);
  const [classes, setClasses] = reactExports.useState([]);
  const [exams, setExams] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [markEntries, setMarkEntries] = reactExports.useState([]);
  const [examSubjects, setExamSubjects] = reactExports.useState([]);
  const [teacherAllocations, setTeacherAllocations] = reactExports.useState([]);
  const [schoolData, setSchoolData] = reactExports.useState(null);
  const [selectedClassId, setSelectedClassId] = reactExports.useState("");
  const [selectedExamId, setSelectedExamId] = reactExports.useState("");
  const hiddenPdfRef = reactExports.useRef(null);
  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      const { data: schoolRes } = await supabase
        .from("schools")
        .select("*")
        .eq("id", schoolId)
        .single();
      setSchoolData(schoolRes);
      const { data: allocData } = await supabase
        .from("teacher_allocations")
        .select("*")
        .eq("school_id", schoolId);
      setTeacherAllocations(allocData || []);
      const { data: classesData } = await supabase
        .from("classes")
        .select("*")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);
      const { data: examsData } = await supabase
        .from("exams")
        .select("*")
        .eq("school_id", schoolId)
        .order("date", {
          ascending: false,
        });
      setExams(examsData || []);
      const { data: examSubjData } = await supabase
        .from("exam_subjects")
        .select("*, subjects(name, code)")
        .eq("school_id", schoolId);
      setExamSubjects(examSubjData || []);
    } catch (err) {
      toast.error("Error loading data: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, [schoolId]);
  reactExports.useEffect(() => {
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
        const studentIds = (studentsData || []).map((s) => s.id);
        if (studentIds.length > 0) {
          const { data: marksData } = await supabase
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
  const filteredClasses = classes.filter((c) => {
    if (isStaff) return true;
    return (
      teacherAllocations.some((ta) => ta.class_id === c.id && ta.teacher_id === user?.id) ||
      c.class_teacher_id === user?.id
    );
  });
  const activeExam = exams.find((e) => e.id === selectedExamId);
  const activeClass = classes.find((c) => c.id === selectedClassId);
  const getStudentReportData = (student) => {
    const studentMarks = markEntries.filter((m) => m.student_id === student.id);
    const mappedMarks = studentMarks.map((m) => {
      const exSubj = examSubjects.find((es) => es.id === m.exam_subject_id);
      return {
        subject: exSubj?.subjects?.name || "Unknown Subject",
        max_marks: exSubj?.max_marks || 100,
        pass_marks: exSubj?.pass_marks || 35,
        obtained: Number(m.marks_obtained),
        grade: m.grade || "",
        remarks: m.remarks || "",
        is_absent: m.is_absent || false,
        is_medical_exempt: m.is_medical_exempt || false,
      };
    });
    return {
      school: {
        name: schoolData?.name || "School Name",
        logo_url: schoolData?.logo_url,
        address: schoolData?.address,
        phone: schoolData?.phone,
      },
      exam: {
        name: activeExam?.name || "Exam",
        academic_year: activeExam?.academic_year || "2026-2027",
      },
      student: {
        full_name: student.full_name,
        roll_number: student.roll_number,
        admission_number: student.admission_number,
        class_name: activeClass?.name || "",
        section: activeClass?.section || "",
        photo_url: student.photo_url,
        attendance_pct: 95,
        // Hardcoded for demo, would come from attendance table
      },
      marks: mappedMarks,
      overallRemarks: "Promoted to next class.",
      // Could be fetched from a generic remarks table
    };
  };
  const exportSinglePDF = async (student) => {
    if (!hiddenPdfRef.current) return;
    setIsExporting(true);
    toast.info(`Generating PDF for ${student.full_name}...`);
    try {
      await new Promise((r) => setTimeout(r, 150));
      const el = document.getElementById(`report-card-${student.id}`);
      if (!el) throw new Error("DOM element not found");
      const canvas = await safeHtml2Canvas(el, {
        scale: 2,
      });
      const pdf = new jspdf_node_minExports.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${student.full_name}_ReportCard.pdf`);
      toast.success("Downloaded successfully!");
    } catch (err) {
      toast.error("Export failed: " + err.message);
    } finally {
      setIsExporting(false);
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
            children: "Loading report cards...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Report Cards",
        breadcrumb: "Academics",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-6 lg:p-8 space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4",
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "",
                        children: "-- Select Class --",
                      }),
                      filteredClasses.map((c) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "option",
                          { value: c.id, children: c.name },
                          c.id,
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
                    children: "Exam Term",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                    value: selectedExamId,
                    onChange: (e) => setSelectedExamId(e.target.value),
                    className:
                      "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "",
                        children: "-- Select Exam --",
                      }),
                      exams
                        .filter((e) => e.class_id === selectedClassId)
                        .map((e) =>
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
            ],
          }),
          selectedClassId && selectedExamId
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "p-4 border-b border-border dark:border-slate-800 flex justify-between items-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-bold",
                      children: "Students",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                    className: "w-full text-sm text-left",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                        className:
                          "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Roll No",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Name",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "py-3 px-6 font-semibold text-center",
                              children: "Marks Entered",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                              className: "py-3 px-6 font-semibold text-right",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                        className: "divide-y divide-border dark:divide-slate-800",
                        children:
                          students.length === 0
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  colSpan: 4,
                                  className: "p-6 text-center text-muted-foreground",
                                  children: "No students found.",
                                }),
                              })
                            : students.map((student) => {
                                const studentMarksCount = markEntries.filter(
                                  (m) => m.student_id === student.id,
                                ).length;
                                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                        className: "py-3 px-6 text-slate-500 font-mono font-bold",
                                        children: ["#", student.roll_number || "—"],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                        className:
                                          "py-3 px-6 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className:
                                              "size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shrink-0",
                                            children: student.photo_url
                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                  src: student.photo_url,
                                                  alt: "",
                                                  className: "size-full object-cover",
                                                })
                                              : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className: "text-[10px]",
                                                  children: student.full_name.charAt(0),
                                                }),
                                          }),
                                          student.full_name,
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-6 text-center",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          className: `px-2 py-0.5 rounded text-xs font-bold ${studentMarksCount > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
                                          children: [studentMarksCount, " Subjects"],
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className: "py-3 px-6 text-right",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                          disabled: isExporting || studentMarksCount === 0,
                                          onClick: () => exportSinglePDF(student),
                                          className:
                                            "inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand text-white text-xs font-bold rounded shadow-sm hover:bg-brand/90 disabled:opacity-50 transition-all cursor-pointer",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                              className: "size-3",
                                            }),
                                            " PDF",
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  student.id,
                                );
                              }),
                      }),
                    ],
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                    className: "size-10 mx-auto text-slate-300 mb-2",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "font-semibold",
                    children: "Select class and exam term above to generate report cards.",
                  }),
                ],
              }),
        ],
      }),
      selectedClassId &&
        selectedExamId &&
        reactDomExports.createPortal(
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            ref: hiddenPdfRef,
            className: "absolute left-[-9999px] top-[-9999px] pointer-events-none opacity-0",
            children: students.map((student) =>
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  id: `report-card-${student.id}`,
                  className: "bg-white",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(ReportCardGenerator, {
                    ...getStudentReportData(student),
                  }),
                },
                student.id,
              ),
            ),
          }),
          document.body,
        ),
    ],
  });
}
export { ReportCardsPage as component };
