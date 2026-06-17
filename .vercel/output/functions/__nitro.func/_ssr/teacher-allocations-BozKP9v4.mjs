import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { ad as Shield, a3 as Plus, am as Trash2 } from "../_libs/lucide-react.mjs";
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
function TeacherAllocationsPage() {
  const { currentSchoolId: schoolId, roles, loading: tenantLoading } = useTenant();
  usePageTitle("Teacher Subject Allocations");
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [allocations, setAllocations] = reactExports.useState([]);
  const [teachers, setTeachers] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [classes, setClasses] = reactExports.useState([]);
  const [selectedTeacherId, setSelectedTeacherId] = reactExports.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = reactExports.useState("");
  const [selectedClassId, setSelectedClassId] = reactExports.useState("");
  const [academicYear, setAcademicYear] = reactExports.useState("2026-2027");
  const [isSubmitting, setIsSubmitting] = reactExports.useState(false);
  const isStaff =
    roles.includes("super_admin") || roles.includes("admin") || roles.includes("principal");
  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      const { data: allocData } = await supabase
        .from("teacher_allocations")
        .select(
          `
          id,
          academic_year,
          profiles:teacher_id ( full_name, email ),
          subjects:subject_id ( name, code ),
          classes:class_id ( name )
        `,
        )
        .eq("school_id", schoolId);
      setAllocations(allocData || []);
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", schoolId)
        .eq("role", "teacher");
      if (rolesData && rolesData.length > 0) {
        const teacherIds = rolesData.map((r) => r.user_id);
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", teacherIds);
        setTeachers(profilesData || []);
      }
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, name")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);
    } catch (err) {
      toast.error("Failed to load allocations: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadData();
  }, [schoolId]);
  const handleAllocate = async (e) => {
    e.preventDefault();
    if (!schoolId || !selectedTeacherId || !selectedSubjectId || !selectedClassId) {
      toast.error("Please select all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("teacher_allocations").insert({
        school_id: schoolId,
        teacher_id: selectedTeacherId,
        subject_id: selectedSubjectId,
        class_id: selectedClassId,
        academic_year: academicYear,
      });
      if (error) throw error;
      toast.success("Allocation created successfully");
      setSelectedSubjectId("");
      setSelectedClassId("");
      void loadData();
    } catch (err) {
      toast.error("Failed to create allocation: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this allocation?")) return;
    try {
      const { error } = await supabase.from("teacher_allocations").delete().eq("id", id);
      if (error) throw error;
      toast.success("Allocation removed");
      setAllocations((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("Failed to delete: " + err.message);
    }
  };
  if (!isStaff) {
    if (tenantLoading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading...",
            }),
          ],
        }),
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "p-8 text-center text-muted-foreground",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, {
          className: "size-10 mx-auto text-rose-300 mb-2",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          children: "You do not have permission to access Teacher Allocations.",
        }),
      ],
    });
  }
  if (tenantLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Teacher Subject Allocations",
        breadcrumb: "Academics",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-6 lg:p-8 space-y-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border dark:border-slate-800 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                className:
                  "font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                  " New Allocation",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                onSubmit: handleAllocate,
                className: "grid grid-cols-1 md:grid-cols-5 gap-4 items-end",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className:
                          "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                        children: "Teacher",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedTeacherId,
                        onChange: (e) => setSelectedTeacherId(e.target.value),
                        className:
                          "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                        required: true,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "",
                            children: "-- Select Teacher --",
                          }),
                          teachers.map((t) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: t.id, children: t.full_name },
                              t.id,
                            ),
                          ),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className:
                          "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                        children: "Subject",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedSubjectId,
                        onChange: (e) => setSelectedSubjectId(e.target.value),
                        className:
                          "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                        required: true,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "",
                            children: "-- Select Subject --",
                          }),
                          subjects.map((s) =>
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
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className:
                          "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                        children: "Class",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                        value: selectedClassId,
                        onChange: (e) => setSelectedClassId(e.target.value),
                        className:
                          "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                        required: true,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                            value: "",
                            children: "-- Select Class --",
                          }),
                          classes.map((c) =>
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
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className:
                          "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                        children: "Academic Year",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        type: "text",
                        value: academicYear,
                        onChange: (e) => setAcademicYear(e.target.value),
                        className:
                          "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                        required: true,
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: isSubmitting,
                    className:
                      "px-4 py-2 bg-brand text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-brand/90 transition-all disabled:opacity-50 h-[38px]",
                    children: "Allocate",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className:
              "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
              className: "w-full text-sm text-left",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                  className:
                    "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "py-3 px-6 font-semibold",
                        children: "Teacher",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "py-3 px-6 font-semibold",
                        children: "Subject",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "py-3 px-6 font-semibold",
                        children: "Class",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "py-3 px-6 font-semibold",
                        children: "Academic Year",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                        className: "py-3 px-6 font-semibold w-16 text-right",
                        children: "Actions",
                      }),
                    ],
                  }),
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                  className: "divide-y divide-border dark:divide-slate-800",
                  children: isLoading
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          colSpan: 5,
                          className: "p-6 text-center text-muted-foreground",
                          children: "Loading allocations...",
                        }),
                      })
                    : allocations.length === 0
                      ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                            colSpan: 5,
                            className: "p-6 text-center text-muted-foreground",
                            children: "No allocations found.",
                          }),
                        })
                      : allocations.map((a) =>
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "tr",
                            {
                              className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  className:
                                    "py-3 px-6 font-medium text-slate-800 dark:text-slate-200",
                                  children: a.profiles?.full_name || "Unknown Teacher",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  className: "py-3 px-6 text-slate-600 dark:text-slate-300",
                                  children: a.subjects?.name || "Unknown Subject",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  className:
                                    "py-3 px-6 font-bold text-slate-700 dark:text-slate-200",
                                  children: a.classes?.name || "Unknown Class",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  className: "py-3 px-6 text-slate-500",
                                  children: a.academic_year,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  className: "py-3 px-6 text-right",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                    onClick: () => handleDelete(a.id),
                                    className:
                                      "p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-md transition-colors",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                                      className: "size-4",
                                    }),
                                  }),
                                }),
                              ],
                            },
                            a.id,
                          ),
                        ),
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
export { TeacherAllocationsPage as component };
