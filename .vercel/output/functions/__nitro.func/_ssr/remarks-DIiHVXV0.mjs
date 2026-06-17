import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { W as WhatsAppBroadcast } from "./WhatsAppBroadcast-C6eIuXsa.mjs";
import {
  e as exportToCSV,
  a as exportToExcel,
  b as exportToPDF,
} from "./export-helper-S9aO-V4l.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  a3 as Plus,
  a9 as Search,
  Y as MessageSquare,
  al as Trash,
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
import "./notify-BwRXED2l.mjs";
const CATEGORIES = [
  {
    value: "academic",
    label: "Academic",
    tone: "bg-brand-soft text-brand",
  },
  {
    value: "behaviour",
    label: "Behaviour",
    tone: "bg-warning-soft text-warning",
  },
  {
    value: "appreciation",
    label: "Appreciation",
    tone: "bg-success-soft text-success",
  },
  {
    value: "improvement",
    label: "Improvement",
    tone: "bg-danger-soft text-danger",
  },
  {
    value: "performance",
    label: "Performance",
    tone: "bg-accent text-accent-foreground",
  },
];
function RemarksPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;
  const isTeacher = roles.includes("teacher");
  const canManage = isAdmin || isTeacher;
  usePageTitle("Student Remarks");
  const [students, setStudents] = reactExports.useState([]);
  const [remarks, setRemarks] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [busy, setBusy] = reactExports.useState(false);
  const [studentId, setStudentId] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("appreciation");
  const [content, setContent] = reactExports.useState("");
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [categoryFilter, setCategoryFilter] = reactExports.useState("all");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(10);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [fetching, setFetching] = reactExports.useState(false);
  reactExports.useEffect(() => {
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
      let query = supabase
        .from("remarks")
        .select(
          "id, student_id, category, content, created_at, visible_to_parent, students!inner(full_name, parent_name, parent_phone)",
          {
            count: "exact",
          },
        )
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null);
      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }
      if (debouncedQ.trim()) {
        query = query.ilike("students.full_name", `%${debouncedQ.trim()}%`);
      }
      const start = page * pageSize;
      const end = start + pageSize - 1;
      const { data, count, error } = await query
        .order("created_at", {
          ascending: false,
        })
        .range(start, end);
      if (error) throw error;
      setRemarks(
        (data ?? []).map((r) => ({
          ...r,
          students: Array.isArray(r.students) ? (r.students[0] ?? null) : r.students,
        })),
      );
      setTotalCount(count ?? 0);
    } catch (err) {
      toast.error(err.message || "Failed to load remarks.");
    } finally {
      setFetching(false);
    }
  };
  reactExports.useEffect(() => {
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
  reactExports.useEffect(() => {
    void load();
  }, [effectiveSchoolId, debouncedQ, categoryFilter, page]);
  const submit = async (e) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user || !studentId) return;
    setBusy(true);
    const { error } = await supabase.from("remarks").insert({
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
  const handleSoftDelete = async (id) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm("Are you sure you want to delete this remark? This will move it to the Recycle Bin.")
    )
      return;
    try {
      const { error } = await supabase
        .from("remarks")
        .update({
          deleted_at: /* @__PURE__ */ new Date().toISOString(),
        })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);
      if (error) throw error;
      toast.success("Remark moved to Recycle Bin.");
      void load();
    } catch (err) {
      toast.error(err.message || "Failed to delete remark.");
    }
  };
  const handleExport = async (format) => {
    if (!effectiveSchoolId) return;
    toast.loading("Preparing export...");
    try {
      const { data, error } = await supabase
        .from("remarks")
        .select("category, content, created_at, students(full_name)")
        .eq("school_id", effectiveSchoolId)
        .is("deleted_at", null)
        .order("created_at", {
          ascending: false,
        });
      if (error || !data) throw error || new Error("No data");
      const headers = ["Student Name", "Category", "Remark Content", "Date Created"];
      const rows = data.map((r) => [
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
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };
  if (tenantLoading) {
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
        title: "Student Remarks",
        breadcrumb: "Operations",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex gap-2",
          children:
            canManage &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: () => setOpen(true),
              disabled: students.length === 0,
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                " Add Remark",
              ],
            }),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "relative w-48",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                        className:
                          "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: q,
                        onChange: (e) => setQ(e.target.value),
                        placeholder: "Search Student...",
                        className:
                          "w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-background text-foreground outline-none",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                    value: categoryFilter,
                    onChange: (e) => {
                      setCategoryFilter(e.target.value);
                      setPage(0);
                    },
                    className:
                      "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "all",
                        children: "All categories",
                      }),
                      CATEGORIES.map((c) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "option",
                          { value: c.value, children: c.label },
                          c.value,
                        ),
                      ),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("csv"),
                    className:
                      "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "CSV",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("excel"),
                    className:
                      "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "XLS",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("pdf"),
                    className:
                      "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground",
                    children: "PDF",
                  }),
                ],
              }),
            ],
          }),
          fetching && remarks.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading remarks ledger...",
              })
            : remarks.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, {
                      className: "size-10 mx-auto text-muted-foreground",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mt-3 text-foreground",
                      children: "No remarks found",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children:
                        students.length === 0
                          ? "Add a student first."
                          : "Start with an appreciation note.",
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "bg-card border border-border rounded-xl divide-y divide-border shadow-xs text-card-foreground",
                      children: remarks.map((r) => {
                        const cat = CATEGORIES.find((c) => c.value === r.category);
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "p-5 flex gap-4 hover:bg-secondary/10 transition-colors",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className: `size-10 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${cat?.tone}`,
                                children: cat?.label.slice(0, 1),
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "min-w-0 flex-1",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center gap-2 text-sm",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "font-semibold text-foreground",
                                        children: r.students?.full_name ?? "Student",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: `text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${cat?.tone}`,
                                        children: cat?.label,
                                      }),
                                      r.visible_to_parent &&
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: "text-[10px] text-muted-foreground",
                                          children: "· Visible to parent",
                                        }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                    className: "text-sm text-muted-foreground mt-1 italic",
                                    children: ['"', r.content, '"'],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-2",
                                    children: new Date(r.created_at).toLocaleString(),
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "shrink-0 flex items-center gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppBroadcast, {
                                    label: "WhatsApp",
                                    recipients: [
                                      {
                                        id: r.student_id,
                                        name:
                                          r.students?.parent_name ||
                                          `${r.students?.full_name ?? "Student"}'s parent`,
                                        phone: r.students?.parent_phone,
                                        subtitle: r.students?.full_name,
                                      },
                                    ],
                                    defaultMessage: `Hello, a new ${cat?.label.toLowerCase()} remark for ${r.students?.full_name ?? "your child"}:

"${r.content}"

— Class Teacher`,
                                  }),
                                  canManage &&
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                      onClick: () => handleSoftDelete(r.id),
                                      className:
                                        "p-1 text-muted-foreground hover:text-danger rounded-md border border-border bg-card cursor-pointer",
                                      title: "Delete Remark",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, {
                                        className: "size-3.5",
                                      }),
                                    }),
                                ],
                              }),
                            ],
                          },
                          r.id,
                        );
                      }),
                    }),
                    totalCount > 0 &&
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "text-xs text-muted-foreground",
                            children: [
                              "Showing ",
                              page * pageSize + 1,
                              " to ",
                              Math.min((page + 1) * pageSize, totalCount),
                              " of ",
                              totalCount,
                              " remarks",
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                disabled: page === 0,
                                onClick: () => setPage((p) => p - 1),
                                className:
                                  "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                                children: "Previous",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                disabled: (page + 1) * pageSize >= totalCount,
                                onClick: () => setPage((p) => p + 1),
                                className:
                                  "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                                children: "Next",
                              }),
                            ],
                          }),
                        ],
                      }),
                  ],
                }),
        ],
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: submit,
            className:
              "bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg text-card-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg text-foreground",
                children: "New Remark",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Student *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                    required: true,
                    value: studentId,
                    onChange: (e) => setStudentId(e.target.value),
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                    children: students.map((s) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "option",
                        { value: s.id, children: s.full_name },
                        s.id,
                      ),
                    ),
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Category",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "mt-1 flex flex-wrap gap-2",
                    children: CATEGORIES.map((c) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setCategory(c.value),
                          className: `px-3 py-1 text-xs font-semibold rounded cursor-pointer ${category === c.value ? c.tone : "bg-secondary text-muted-foreground hover:bg-accent"}`,
                          children: c.label,
                        },
                        c.value,
                      ),
                    ),
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Remark *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                    required: true,
                    value: content,
                    onChange: (e) => setContent(e.target.value),
                    rows: 4,
                    placeholder: "Showed great improvement in fractions today.",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 justify-end",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setOpen(false),
                    className:
                      "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    disabled: busy,
                    className:
                      "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer",
                    children: busy ? "Saving…" : "Add Remark",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { RemarksPage as component };
