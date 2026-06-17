import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  a9 as Search,
  a3 as Plus,
  J as GraduationCap,
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
function ClassesPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;
  usePageTitle("Classes");
  const [classes, setClasses] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [name, setName] = reactExports.useState("");
  const [grade, setGrade] = reactExports.useState("");
  const [section, setSection] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(6);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
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
        .select("id, name, grade, section", {
          count: "exact",
        })
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
          const { count: studentCount } = await supabase
            .from("students")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("class_id", c.id)
            .is("deleted_at", null);
          return {
            ...c,
            student_count: studentCount ?? 0,
          };
        }),
      );
      setClasses(counts);
    } catch (err) {
      toast.error(err.message || "Failed to load classes.");
    } finally {
      setBusy(false);
    }
  };
  reactExports.useEffect(() => {
    void load();
  }, [effectiveSchoolId, debouncedQ, page]);
  const submit = async (e) => {
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
  const handleSoftDelete = async (id, className) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm(
        `Are you sure you want to delete ${className}? This will move the class to the Recycle Bin.`,
      )
    )
      return;
    try {
      const { error } = await supabase
        .from("classes")
        .update({
          deleted_at: /* @__PURE__ */ new Date().toISOString(),
        })
        .eq("id", id)
        .eq("school_id", effectiveSchoolId);
      if (error) throw error;
      toast.success(`${className} moved to Recycle Bin.`);
      void load();
    } catch (err) {
      toast.error(err.message || "Failed to delete class.");
    }
  };
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
            children: "Loading classes...",
          }),
        ],
      }),
    });
  }
  if (!effectiveSchoolId && !isSuper) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "max-w-md text-center p-6 bg-card rounded-2xl shadow-sm border border-border",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "font-semibold mb-2 text-foreground",
            children: "School information not found.",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "You are not associated with any school. Please contact the administrator.",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Classes",
        breadcrumb: `${totalCount} classes setup`,
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "flex gap-3 items-center",
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
                  placeholder: "Search classes...",
                  className:
                    "w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-card text-foreground outline-none",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: () => setOpen(true),
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 hover:opacity-90 cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                " New Class",
              ],
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children:
          busy && classes.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-muted-foreground text-sm",
                children: "Syncing class structures...",
              })
            : classes.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                      className: "size-10 mx-auto text-muted-foreground",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mt-3",
                      children: totalCount === 0 ? "No classes yet" : "No matches",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children: "Create your first class to start adding students.",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                      onClick: () => setOpen(true),
                      className:
                        "mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                        " New Class",
                      ],
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                      children: classes.map((c) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className:
                              "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs flex flex-col justify-between",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center justify-between",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                        className: "font-semibold text-lg",
                                        children: c.name,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                        className: "text-xs text-muted-foreground",
                                        children: [c.student_count, " students"],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-sm text-muted-foreground mt-1",
                                    children:
                                      [c.grade, c.section].filter(Boolean).join(" · ") || "—",
                                  }),
                                ],
                              }),
                              isAdmin &&
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "flex justify-end pt-4 border-t border-border mt-4",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () => handleSoftDelete(c.id, c.name),
                                    className:
                                      "text-xs font-semibold text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer",
                                    title: "Delete Class",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, {
                                        className: "size-3.5",
                                      }),
                                      " Delete",
                                    ],
                                  }),
                                }),
                            ],
                          },
                          c.id,
                        ),
                      ),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-xs text-muted-foreground",
                          children: [
                            "Showing ",
                            totalCount > 0 ? page * pageSize + 1 : 0,
                            " to ",
                            Math.min((page + 1) * pageSize, totalCount),
                            " of ",
                            totalCount,
                            " classes",
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
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: submit,
            className:
              "bg-card text-card-foreground rounded-xl p-6 w-full max-w-sm space-y-4 shadow-lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg",
                children: "New Class",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Class name *",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    required: true,
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    placeholder: "e.g. Class 7-B",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Grade",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: grade,
                        onChange: (e) => setGrade(e.target.value),
                        placeholder: "7",
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Section",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: section,
                        onChange: (e) => setSection(e.target.value),
                        placeholder: "B",
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                      }),
                    ],
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
                    children: busy ? "Creating…" : "Create",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { ClassesPage as component };
