import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  am as Trash2,
  a7 as RotateCcw,
  C as Calendar,
  f as BookOpen,
  Y as MessageSquare,
  I as FileText,
  J as GraduationCap,
  as as Users,
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
function RecycleBinPage() {
  const { currentSchoolId: effectiveSchoolId, roles, loading: tenantLoading } = useTenant();
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;
  usePageTitle("Recycle Bin");
  const [items, setItems] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const loadDeletedItems = async () => {
    if (!effectiveSchoolId || !isAdmin) return;
    setLoading(true);
    try {
      const trashList = [];
      const { data: students } = await supabase
        .from("students")
        .select("id, full_name, admission_number, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (students ?? []).forEach((s) => {
        trashList.push({
          id: s.id,
          type: "student",
          name: s.full_name,
          subtext: `Admission No: ${s.admission_number || "—"}`,
          deleted_at: s.deleted_at,
        });
      });
      const { data: classes } = await supabase
        .from("classes")
        .select("id, name, grade, section, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (classes ?? []).forEach((c) => {
        trashList.push({
          id: c.id,
          type: "class",
          name: c.name,
          subtext: `Grade: ${c.grade || "—"} · Section: ${c.section || "—"}`,
          deleted_at: c.deleted_at,
        });
      });
      const { data: invoices } = await supabase
        .from("fee_invoices")
        .select("id, title, amount_due, due_date, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (invoices ?? []).forEach((i) => {
        trashList.push({
          id: i.id,
          type: "invoice",
          name: i.title,
          subtext: `Amount Due: ₹${i.amount_due} · Due: ${i.due_date}`,
          deleted_at: i.deleted_at,
        });
      });
      const { data: remarks } = await supabase
        .from("remarks")
        .select("id, category, content, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (remarks ?? []).forEach((r) => {
        trashList.push({
          id: r.id,
          type: "remark",
          name: `Remark Category: ${r.category}`,
          subtext: r.content.length > 50 ? `${r.content.slice(0, 50)}...` : r.content,
          deleted_at: r.deleted_at,
        });
      });
      const { data: exams } = await supabase
        .from("exams")
        .select("id, name, date, deleted_at")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (exams ?? []).forEach((e) => {
        trashList.push({
          id: e.id,
          type: "exam",
          name: e.name,
          subtext: `Exam Date: ${e.date || "—"}`,
          deleted_at: e.deleted_at,
        });
      });
      const { data: att } = await supabase
        .from("attendance")
        .select("id, date, status, deleted_at, students(full_name)")
        .eq("school_id", effectiveSchoolId)
        .not("deleted_at", "is", null);
      (att ?? []).forEach((a) => {
        trashList.push({
          id: a.id,
          type: "attendance",
          name: `Attendance record for ${a.students?.full_name || "Unknown Student"}`,
          subtext: `Date: ${a.date} · Status: ${a.status}`,
          deleted_at: a.deleted_at,
        });
      });
      trashList.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime());
      setItems(trashList);
    } catch (err) {
      toast.error(err.message || "Failed to load recycle bin records.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadDeletedItems();
  }, [effectiveSchoolId]);
  const handleRestore = async (item) => {
    if (!effectiveSchoolId) return;
    toast.loading("Restoring record...");
    try {
      let table = "";
      if (item.type === "student") table = "students";
      else if (item.type === "class") table = "classes";
      else if (item.type === "invoice") table = "fee_invoices";
      else if (item.type === "remark") table = "remarks";
      else if (item.type === "exam") table = "exams";
      else if (item.type === "attendance") table = "attendance";
      const { error } = await supabase
        .from(table)
        .update({
          deleted_at: null,
        })
        .eq("id", item.id)
        .eq("school_id", effectiveSchoolId);
      if (error) throw error;
      if (item.type === "invoice") {
        await supabase
          .from("fee_payments")
          .update({
            deleted_at: null,
          })
          .eq("invoice_id", item.id)
          .eq("school_id", effectiveSchoolId);
      } else if (item.type === "exam") {
        await supabase
          .from("mark_entries")
          .update({
            deleted_at: null,
          })
          .eq("exam_id", item.id)
          .eq("school_id", effectiveSchoolId);
      }
      toast.dismiss();
      toast.success(`${item.type.toUpperCase()} record restored successfully.`);
      void loadDeletedItems();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Failed to restore record.");
    }
  };
  const handleHardDelete = async (item) => {
    if (!effectiveSchoolId) return;
    if (
      !confirm(
        "Are you sure you want to permanently delete this record? This action CANNOT be undone.",
      )
    )
      return;
    toast.loading("Permanently deleting...");
    try {
      if (item.type === "invoice") {
        await supabase
          .from("fee_payments")
          .delete()
          .eq("invoice_id", item.id)
          .eq("school_id", effectiveSchoolId);
      } else if (item.type === "exam") {
        await supabase
          .from("mark_entries")
          .delete()
          .eq("exam_id", item.id)
          .eq("school_id", effectiveSchoolId);
      }
      let table = "";
      if (item.type === "student") table = "students";
      else if (item.type === "class") table = "classes";
      else if (item.type === "invoice") table = "fee_invoices";
      else if (item.type === "remark") table = "remarks";
      else if (item.type === "exam") table = "exams";
      else if (item.type === "attendance") table = "attendance";
      const { error } = await supabase
        .from(table)
        .delete()
        .eq("id", item.id)
        .eq("school_id", effectiveSchoolId);
      toast.dismiss();
      if (error) throw error;
      toast.success(`Record permanently purged.`);
      void loadDeletedItems();
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Failed to purge record.");
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
            children: "Loading recycle bin...",
          }),
        ],
      }),
    });
  }
  if (!isAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className:
        "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
      children: "Unauthorized access. Only school administrators can access the Recycle Bin.",
    });
  }
  const filteredItems = items.filter((item) => activeTab === "all" || item.type === activeTab);
  const getIcon = (type) => {
    switch (type) {
      case "student":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4 text-blue-500" });
      case "class":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
          className: "size-4 text-emerald-500",
        });
      case "invoice":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, {
          className: "size-4 text-amber-500",
        });
      case "remark":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, {
          className: "size-4 text-indigo-500",
        });
      case "exam":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
          className: "size-4 text-pink-500",
        });
      case "attendance":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
          className: "size-4 text-sky-500",
        });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Recycle Bin",
        breadcrumb: "Archived & soft-deleted records",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "flex gap-2 border-b border-border pb-px overflow-x-auto",
            children: ["all", "student", "class", "invoice", "remark", "exam", "attendance"].map(
              (tab) =>
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setActiveTab(tab),
                    className: `px-4 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                    children: tab.toUpperCase(),
                  },
                  tab,
                ),
            ),
          }),
          loading
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Scanning archives...",
              })
            : filteredItems.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                      className: "size-10 mx-auto text-muted-foreground",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mt-3",
                      children: "Recycle Bin Empty",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children: "No soft-deleted records matching this tab were found.",
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "divide-y divide-border",
                    children: filteredItems.map((item) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className:
                            "p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex items-center gap-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className:
                                    "size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0",
                                  children: getIcon(item.type),
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "font-semibold text-sm text-foreground",
                                      children: item.name,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-xs text-muted-foreground mt-0.5",
                                      children: item.subtext,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                      className: "text-[10px] text-muted-foreground mt-1",
                                      children: [
                                        "Deleted at: ",
                                        new Date(item.deleted_at).toLocaleString(),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                  onClick: () => handleRestore(item),
                                  className:
                                    "px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-emerald-600 cursor-pointer",
                                  title: "Restore Record",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, {
                                      className: "size-3.5",
                                    }),
                                    " Restore",
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                  onClick: () => handleHardDelete(item),
                                  className:
                                    "px-3 py-1.5 text-xs font-semibold bg-rose-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-rose-600 cursor-pointer",
                                  title: "Permanently Purge",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, {
                                      className: "size-3.5",
                                    }),
                                    " Purge",
                                  ],
                                }),
                              ],
                            }),
                          ],
                        },
                        item.id,
                      ),
                    ),
                  }),
                }),
        ],
      }),
    ],
  });
}
export { RecycleBinPage as component };
