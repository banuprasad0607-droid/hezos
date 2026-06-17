import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import {
  e as exportToCSV,
  a as exportToExcel,
  b as exportToPDF,
} from "./export-helper-S9aO-V4l.mjs";
import { w as whatsappService } from "./whatsapp-service-rc8qIpIC.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  s as CircleDollarSign,
  r as CircleCheck,
  an as TrendingUp,
  q as CircleAlert,
  I as FileText,
  a5 as Receipt,
  R as Layers,
  a3 as Plus,
  a9 as Search,
  a4 as Printer,
  au as X,
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
function FeesPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    currentSchool,
    roles,
    user,
    loading: tenantLoading,
  } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("Fees");
  const displaySchoolName = currentSchool?.name ?? "School";
  const [tab, setTab] = reactExports.useState("overview");
  const [classes, setClasses] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [structures, setStructures] = reactExports.useState([]);
  const [kpiInvoices, setKpiInvoices] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const loadAll = async () => {
    if (!effectiveSchoolId) return;
    setLoading(true);
    try {
      const [c, s, fs, fi] = await Promise.all([
        supabase
          .from("classes")
          .select("id, name")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("name"),
        supabase
          .from("students")
          .select("id, full_name, class_id, parent_user_id, emergency_contact")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("full_name"),
        supabase
          .from("fee_structures")
          .select("*")
          .eq("school_id", effectiveSchoolId)
          .order("created_at", {
            ascending: false,
          }),
        supabase
          .from("fee_invoices")
          .select("amount_due, amount_paid, status, due_date")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null),
      ]);
      setClasses(c.data ?? []);
      setStudents(s.data ?? []);
      setStructures(fs.data ?? []);
      setKpiInvoices(fi.data ?? []);
    } catch (err) {
      toast.error(err.message || "Failed to load fee configuration.");
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    void loadAll();
  }, [effectiveSchoolId]);
  const kpis = reactExports.useMemo(() => {
    const billed = kpiInvoices.reduce((s, i) => s + Number(i.amount_due), 0);
    const collected = kpiInvoices.reduce((s, i) => s + Number(i.amount_paid), 0);
    const outstanding = billed - collected;
    const overdue = kpiInvoices.filter(
      (i) => i.status !== "paid" && i.due_date && new Date(i.due_date) < /* @__PURE__ */ new Date(),
    ).length;
    return {
      billed,
      collected,
      outstanding,
      overdue,
    };
  }, [kpiInvoices]);
  const studentName = (id) => students.find((s) => s.id === id)?.full_name ?? "—";
  const className = (id) => (id ? (classes.find((c) => c.id === id)?.name ?? "—") : "All classes");
  if (!isAdmin) {
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
          title: "Fees",
          breadcrumb: "Restricted",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "p-8 text-sm text-muted-foreground bg-background text-foreground",
          children: "Admin access required.",
        }),
      ],
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Fees", breadcrumb: "Finance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: CircleDollarSign,
                label: "Billed",
                value: fmt(kpis.billed),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: CircleCheck,
                label: "Collected",
                value: fmt(kpis.collected),
                tone: "success",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: TrendingUp,
                label: "Outstanding",
                value: fmt(kpis.outstanding),
                tone: "brand",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: CircleAlert,
                label: "Overdue invoices",
                value: String(kpis.overdue),
                tone: "danger",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "border-b border-border flex gap-1 overflow-x-auto",
            children: ["overview", "structures", "invoices", "payments"].map((t) =>
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setTab(t),
                  className: `px-4 py-2 text-sm font-semibold border-b-2 -mb-px capitalize transition cursor-pointer ${tab === t ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                  children: t,
                },
                t,
              ),
            ),
          }),
          loading
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "p-12 text-sm text-muted-foreground text-center",
                children: "Syncing dashboard statistics...",
              })
            : tab === "overview"
              ? /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, {
                  schoolId: effectiveSchoolId,
                  studentName,
                })
              : tab === "structures"
                ? /* @__PURE__ */ jsxRuntimeExports.jsx(StructuresTab, {
                    schoolId: effectiveSchoolId,
                    classes,
                    structures,
                    onChanged: loadAll,
                  })
                : tab === "invoices"
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx(InvoicesTab, {
                      schoolId: effectiveSchoolId,
                      classes,
                      students,
                      structures,
                      studentName,
                      className,
                      onChanged: loadAll,
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx(PaymentsTab, {
                      schoolId: effectiveSchoolId,
                      userId: user.id,
                      studentName,
                      schoolName: displaySchoolName,
                      onChanged: loadAll,
                    }),
        ],
      }),
    ],
  });
}
function OverviewTab({ schoolId, studentName }) {
  const [invoices, setInvoices] = reactExports.useState([]);
  const [payments, setPayments] = reactExports.useState([]);
  reactExports.useEffect(() => {
    const fetchOverview = async () => {
      const [fi, fp] = await Promise.all([
        supabase
          .from("fee_invoices")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null)
          .order("created_at", {
            ascending: false,
          })
          .limit(8),
        supabase
          .from("fee_payments")
          .select("*, fee_invoices(student_id)")
          .eq("school_id", schoolId)
          .is("deleted_at", null)
          .order("created_at", {
            ascending: false,
          })
          .limit(8),
      ]);
      setInvoices(fi.data ?? []);
      setPayments(fp.data ?? []);
    };
    void fetchOverview();
  }, [schoolId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
        title: "Recent invoices",
        icon: FileText,
        children:
          invoices.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No invoices yet." })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                className: "divide-y divide-border",
                children: invoices.map((i) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className:
                        "px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-sm font-medium truncate text-foreground",
                              children: i.title,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-xs text-muted-foreground",
                              children: [studentName(i.student_id), " · ", i.period],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "text-right",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-sm font-semibold text-foreground",
                              children: fmt(Number(i.amount_due)),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, {
                              status: i.status,
                            }),
                          ],
                        }),
                      ],
                    },
                    i.id,
                  ),
                ),
              }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
        title: "Recent payments",
        icon: Receipt,
        children:
          payments.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No payments yet." })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", {
                className: "divide-y divide-border",
                children: payments.map((p) => {
                  const studentId = p.fee_invoices?.student_id || "";
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "li",
                    {
                      className:
                        "px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-sm font-medium truncate text-foreground",
                              children: studentId ? studentName(studentId) : "—",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-xs text-muted-foreground",
                              children: [p.method.toUpperCase(), " · ", p.paid_on],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-sm font-semibold text-success",
                          children: ["+", fmt(Number(p.amount))],
                        }),
                      ],
                    },
                    p.id,
                  );
                }),
              }),
      }),
    ],
  });
}
function StructuresTab({ schoolId, classes, structures, onChanged }) {
  const [name, setName] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("tuition");
  const [amount, setAmount] = reactExports.useState("");
  const [frequency, setFrequency] = reactExports.useState("monthly");
  const [classId, setClassId] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!name.trim() || !amt) return;
    setSaving(true);
    const { error } = await supabase.from("fee_structures").insert({
      school_id: schoolId,
      name: name.trim(),
      category,
      amount: amt,
      frequency,
      class_id: classId || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Fee structure added");
    setName("");
    setAmount("");
    onChanged();
  };
  const remove = async (id) => {
    if (!confirm("Delete this fee structure?")) return;
    const { error } = await supabase
      .from("fee_structures")
      .delete()
      .eq("id", id)
      .eq("school_id", schoolId);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    onChanged();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
        onSubmit: submit,
        className:
          "bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { className: "size-4 text-brand" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-sm font-semibold text-foreground",
                children: "New fee structure",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Name",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
              value: name,
              onChange: (e) => setName(e.target.value),
              placeholder: "Monthly Tuition",
              className: inputCls,
              required: true,
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Category",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                  value: category,
                  onChange: (e) => setCategory(e.target.value),
                  className: inputCls,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "tuition",
                      children: "Tuition",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "transport",
                      children: "Transport",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "exam",
                      children: "Exam",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "other",
                      children: "Other",
                    }),
                  ],
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Frequency",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                  value: frequency,
                  onChange: (e) => setFrequency(e.target.value),
                  className: inputCls,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "monthly",
                      children: "Monthly",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "quarterly",
                      children: "Quarterly",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "yearly",
                      children: "Yearly",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "one_time",
                      children: "One time",
                    }),
                  ],
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Amount",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  className: inputCls,
                  required: true,
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Class (optional)",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                  value: classId,
                  onChange: (e) => setClassId(e.target.value),
                  className: inputCls,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "",
                      children: "All classes",
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
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
            disabled: saving,
            className:
              "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              saving ? "Adding…" : "Add structure",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "px-5 py-3 border-b border-border",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
              className: "text-sm font-semibold text-foreground",
              children: "Fee structures",
            }),
          }),
          structures.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No fee structures yet." })
            : /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                className: "w-full text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                    className: "bg-secondary/40 text-xs text-muted-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Name" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Class" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Category" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Frequency" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {
                          className: "text-right",
                          children: "Amount",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {}),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                    children: structures.map((s) =>
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          className:
                            "border-t border-border hover:bg-secondary/20 transition-colors",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "font-medium text-foreground",
                              children: s.name,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "text-muted-foreground",
                              children: s.class_id
                                ? (classes.find((c) => c.id === s.class_id)?.name ?? "—")
                                : "All classes",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "capitalize text-muted-foreground",
                              children: s.category,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "capitalize text-muted-foreground",
                              children: s.frequency.replace("_", " "),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "text-right font-semibold text-foreground",
                              children: fmt(Number(s.amount)),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                              className: "text-right",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                onClick: () => remove(s.id),
                                className: "text-xs text-danger hover:underline cursor-pointer",
                                children: "Delete",
                              }),
                            }),
                          ],
                        },
                        s.id,
                      ),
                    ),
                  }),
                ],
              }),
        ],
      }),
    ],
  });
}
function InvoicesTab({
  schoolId,
  classes,
  students,
  structures,
  studentName,
  className,
  onChanged,
}) {
  const [structureId, setStructureId] = reactExports.useState("");
  const [period, setPeriod] = reactExports.useState(() =>
    /* @__PURE__ */ new Date().toISOString().slice(0, 7),
  );
  const [dueDate, setDueDate] = reactExports.useState("");
  const [classFilter, setClassFilter] = reactExports.useState("");
  const [generating, setGenerating] = reactExports.useState(false);
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(10);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [localInvoices, setLocalInvoices] = reactExports.useState([]);
  const [fetching, setFetching] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);
  const fetchInvoices = async () => {
    if (!schoolId) return;
    setFetching(true);
    try {
      let query = supabase
        .from("fee_invoices")
        .select("*, students!inner(full_name, class_id)", {
          count: "exact",
        })
        .eq("school_id", schoolId)
        .is("deleted_at", null);
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      const targetClass = classFilter;
      if (targetClass) {
        query = query.eq("students.class_id", targetClass);
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
      setLocalInvoices(
        (data ?? []).map((i) => ({
          ...i,
          students: Array.isArray(i.students) ? (i.students[0] ?? null) : i.students,
        })),
      );
      setTotalCount(count ?? 0);
    } catch (err) {
      toast.error(err.message || "Failed to load invoices.");
    } finally {
      setFetching(false);
    }
  };
  reactExports.useEffect(() => {
    void fetchInvoices();
  }, [schoolId, debouncedQ, page, statusFilter, classFilter]);
  const generate = async (e) => {
    e.preventDefault();
    const struct = structures.find((s) => s.id === structureId);
    if (!struct) return toast.error("Pick a fee structure");
    const targetClassId = classFilter || struct.class_id;
    const eligible = students.filter((s) => (targetClassId ? s.class_id === targetClassId : true));
    if (eligible.length === 0) return toast.error("No students match");
    setGenerating(true);
    const rows = eligible.map((s) => ({
      school_id: schoolId,
      student_id: s.id,
      fee_structure_id: struct.id,
      title: struct.name,
      period,
      amount_due: struct.amount,
      amount_paid: 0,
      status: "pending",
      due_date: dueDate || null,
    }));
    const { error } = await supabase.from("fee_invoices").insert(rows);
    setGenerating(false);
    if (error) return toast.error(error.message);
    toast.success(`Generated ${rows.length} invoice${rows.length === 1 ? "" : "s"}`);
    void (async () => {
      try {
        const templates = await whatsappService.getTemplates(schoolId);
        const template = templates.find((t) => t.name === "fee_due_reminder");
        if (template) {
          for (const s of eligible) {
            const phone = s.emergency_contact || "+91 90000 00000";
            const amtStr = `₹${struct.amount}`;
            const payUrl = `http://localhost:8080/parent?pay=true`;
            await whatsappService.sendTemplateMessage(
              schoolId,
              phone,
              template.id,
              [amtStr, s.full_name, dueDate || "June 30, 2026", payUrl],
              s.id,
              s.parent_user_id,
            );
          }
          toast.success("WhatsApp fee reminders dispatched to parents.");
        }
      } catch (err) {
        console.error("WhatsApp fee reminder broadcast failed:", err);
      }
    })();
    void fetchInvoices();
    onChanged();
  };
  const remove = async (id) => {
    if (!confirm("Delete this invoice? This will move it to the Recycle Bin.")) return;
    const { error } = await supabase
      .from("fee_invoices")
      .update({
        deleted_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("id", id)
      .eq("school_id", schoolId);
    if (error) return toast.error(error.message);
    await supabase
      .from("fee_payments")
      .update({
        deleted_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("invoice_id", id)
      .eq("school_id", schoolId);
    toast.success("Invoice moved to Recycle Bin.");
    void fetchInvoices();
    onChanged();
  };
  const handleExport = async (format) => {
    toast.info("Preparing data for download...");
    const { data, error } = await supabase
      .from("fee_invoices")
      .select("title, period, amount_due, amount_paid, status, due_date, students(full_name)")
      .eq("school_id", schoolId)
      .is("deleted_at", null);
    if (error || !data) return toast.error("Export query failed.");
    const headers = [
      "Student",
      "Title",
      "Period",
      "Due Date",
      "Amount Due",
      "Amount Paid",
      "Status",
    ];
    const rows = data.map((i) => [
      i.students?.full_name || "—",
      i.title,
      i.period,
      i.due_date || "—",
      i.amount_due,
      i.amount_paid,
      i.status,
    ]);
    if (format === "csv") exportToCSV("Fee_Invoices", headers, rows);
    else if (format === "excel") exportToExcel("Fee_Invoices", headers, rows);
    else if (format === "pdf") exportToPDF("Fee_Invoices", "Fee Invoices Roster", headers, rows);
    toast.success("Export started!");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "space-y-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
        onSubmit: generate,
        className:
          "bg-card border border-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end text-card-foreground shadow-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Fee structure",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
              value: structureId,
              onChange: (e) => setStructureId(e.target.value),
              className: inputCls,
              required: true,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                  value: "",
                  children: "— select —",
                }),
                structures.map((s) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "option",
                    { value: s.id, children: [s.name, " (", fmt(Number(s.amount)), ")"] },
                    s.id,
                  ),
                ),
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Period",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
              type: "month",
              value: period,
              onChange: (e) => setPeriod(e.target.value),
              className: inputCls,
              required: true,
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Due date",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
              type: "date",
              value: dueDate,
              onChange: (e) => setDueDate(e.target.value),
              className: inputCls,
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Class (override)",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
              value: classFilter,
              onChange: (e) => setClassFilter(e.target.value),
              className: inputCls,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                  value: "",
                  children: "From structure",
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
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
            disabled: generating,
            className:
              "py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }),
              generating ? "Generating…" : "Generate invoices",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-secondary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                className: "text-sm font-semibold text-foreground",
                children: ["Invoices (", totalCount, ")"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 items-center flex-wrap",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "relative w-44",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                        className:
                          "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                        value: q,
                        onChange: (e) => setQ(e.target.value),
                        placeholder: "Search Student...",
                        className:
                          "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                    value: statusFilter,
                    onChange: (e) => {
                      setStatusFilter(e.target.value);
                      setPage(0);
                    },
                    className:
                      "text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground outline-none",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "all",
                        children: "All statuses",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "pending",
                        children: "Pending",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "partial",
                        children: "Partial",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                        value: "paid",
                        children: "Paid",
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
                          "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors",
                        children: "CSV",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => handleExport("excel"),
                        className:
                          "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors",
                        children: "XLS",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => handleExport("pdf"),
                        className:
                          "p-1 hover:bg-secondary text-[10px] font-bold px-2 transition-colors",
                        children: "PDF",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
          fetching && localInvoices.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading invoices...",
              })
            : localInvoices.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No invoices match." })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "overflow-x-auto",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                    className: "w-full text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                        className: "bg-secondary/40 text-xs text-muted-foreground",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Student" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Title" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Period" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Due" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {
                              className: "text-right",
                              children: "Due amt",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {
                              className: "text-right",
                              children: "Paid",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Status" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {}),
                          ],
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                        children: localInvoices.map((i) => {
                          const balance = Number(i.amount_due) - Number(i.amount_paid);
                          const overdue =
                            i.status !== "paid" &&
                            i.due_date &&
                            new Date(i.due_date) < /* @__PURE__ */ new Date();
                          const sName = i.students?.full_name || studentName(i.student_id);
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "tr",
                            {
                              className:
                                "border-t border-border hover:bg-secondary/20 transition-colors",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "font-medium text-foreground",
                                  children: sName,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-foreground",
                                  children: i.title,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-muted-foreground",
                                  children: i.period,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: overdue
                                    ? "text-danger font-medium"
                                    : "text-muted-foreground",
                                  children: i.due_date ?? "—",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-right text-foreground",
                                  children: fmt(Number(i.amount_due)),
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(Td, {
                                  className: "text-right text-foreground",
                                  children: [
                                    fmt(Number(i.amount_paid)),
                                    balance > 0 &&
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                        className: "block text-[10px] text-muted-foreground",
                                        children: ["bal ", fmt(balance)],
                                      }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, {
                                    status: i.status,
                                  }),
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-right",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                    onClick: () => remove(i.id),
                                    className: "text-xs text-danger hover:underline cursor-pointer",
                                    children: "Delete",
                                  }),
                                }),
                              ],
                            },
                            i.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground",
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
                  " invoices",
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
  });
}
function PaymentsTab({ schoolId, userId, studentName, schoolName, onChanged }) {
  const [invoiceId, setInvoiceId] = reactExports.useState("");
  const [amount, setAmount] = reactExports.useState("");
  const [method, setMethod] = reactExports.useState("cash");
  const [reference, setReference] = reactExports.useState("");
  const [saving, setSaving] = reactExports.useState(false);
  const [receipt, setReceipt] = reactExports.useState(null);
  const [openInvoices, setOpenInvoices] = reactExports.useState([]);
  const selected = openInvoices.find((i) => i.id === invoiceId);
  const balance = selected ? Number(selected.amount_due) - Number(selected.amount_paid) : 0;
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(10);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [localPayments, setLocalPayments] = reactExports.useState([]);
  const [fetching, setFetching] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);
  const loadOpenInvoices = async () => {
    const { data } = await supabase
      .from("fee_invoices")
      .select("*, students(full_name)")
      .eq("school_id", schoolId)
      .is("deleted_at", null)
      .or("status.eq.pending,status.eq.partial");
    setOpenInvoices(
      (data ?? []).map((i) => ({
        ...i,
        students: Array.isArray(i.students) ? (i.students[0] ?? null) : i.students,
      })),
    );
  };
  const fetchPayments = async () => {
    setFetching(true);
    try {
      let query = supabase
        .from("fee_payments")
        .select("*, fee_invoices!inner(student_id, title, students!inner(full_name))", {
          count: "exact",
        })
        .eq("school_id", schoolId)
        .is("deleted_at", null);
      if (debouncedQ.trim()) {
        query = query.ilike("fee_invoices.students.full_name", `%${debouncedQ.trim()}%`);
      }
      const start = page * pageSize;
      const end = start + pageSize - 1;
      const { data, count, error } = await query
        .order("created_at", {
          ascending: false,
        })
        .range(start, end);
      if (error) throw error;
      setLocalPayments(data);
      setTotalCount(count ?? 0);
    } catch (err) {
      toast.error(err.message || "Failed to load payments.");
    } finally {
      setFetching(false);
    }
  };
  reactExports.useEffect(() => {
    void loadOpenInvoices();
    void fetchPayments();
  }, [schoolId, debouncedQ, page]);
  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error("Pick an invoice");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > balance + 1e-3) return toast.error(`Amount exceeds balance of ${fmt(balance)}`);
    setSaving(true);
    const { data: payRow, error: payErr } = await supabase
      .from("fee_payments")
      .insert({
        school_id: schoolId,
        invoice_id: selected.id,
        amount: amt,
        method,
        reference: reference.trim() || null,
        collected_by: userId,
      })
      .select()
      .single();
    if (payErr) {
      setSaving(false);
      return toast.error(payErr.message);
    }
    const newPaid = Number(selected.amount_paid) + amt;
    const newStatus = newPaid >= Number(selected.amount_due) - 1e-3 ? "paid" : "partial";
    const { error: updErr } = await supabase
      .from("fee_invoices")
      .update({
        amount_paid: newPaid,
        status: newStatus,
      })
      .eq("id", selected.id);
    setSaving(false);
    if (updErr) return toast.error(updErr.message);
    toast.success("Payment recorded");
    setAmount("");
    setReference("");
    setReceipt(payRow);
    void loadOpenInvoices();
    void fetchPayments();
    onChanged();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
        onSubmit: submit,
        className:
          "bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-4 text-brand" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-sm font-semibold text-foreground",
                children: "Record payment",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Invoice",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
              value: invoiceId,
              onChange: (e) => {
                setInvoiceId(e.target.value);
                const inv = openInvoices.find((i) => i.id === e.target.value);
                if (inv) setAmount(String(Number(inv.amount_due) - Number(inv.amount_paid)));
              },
              className: inputCls,
              required: true,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                  value: "",
                  children: "— select open invoice —",
                }),
                openInvoices.map((i) => {
                  const studentNameVal = i.students?.full_name || studentName(i.student_id);
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "option",
                    {
                      value: i.id,
                      children: [
                        studentNameVal,
                        " · ",
                        i.title,
                        " · bal",
                        " ",
                        fmt(Number(i.amount_due) - Number(i.amount_paid)),
                      ],
                    },
                    i.id,
                  );
                }),
              ],
            }),
          }),
          selected &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "text-xs text-muted-foreground bg-secondary/35 rounded-md p-2",
              children: [
                "Due ",
                fmt(Number(selected.amount_due)),
                " · Paid ",
                fmt(Number(selected.amount_paid)),
                " ·",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                  className: "font-semibold text-foreground",
                  children: ["Balance ", fmt(balance)],
                }),
              ],
            }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Amount",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  className: inputCls,
                  required: true,
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                label: "Method",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                  value: method,
                  onChange: (e) => setMethod(e.target.value),
                  className: inputCls,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "cash",
                      children: "Cash",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "upi",
                      children: "UPI",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "bank",
                      children: "Bank",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "card",
                      children: "Card",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                      value: "cheque",
                      children: "Cheque",
                    }),
                  ],
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
            label: "Reference (optional)",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
              value: reference,
              onChange: (e) => setReference(e.target.value),
              placeholder: "Txn id / cheque #",
              className: inputCls,
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
            disabled: saving || !invoiceId,
            className:
              "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
              saving ? "Saving…" : "Record payment",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "px-5 py-3 border-b border-border flex items-center justify-between bg-secondary/10 flex-wrap gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                className: "text-sm font-semibold text-foreground",
                children: ["Recent payments (", totalCount, ")"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "relative w-44",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                    className:
                      "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    value: q,
                    onChange: (e) => setQ(e.target.value),
                    placeholder: "Search Student...",
                    className:
                      "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                  }),
                ],
              }),
            ],
          }),
          fetching && localPayments.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading payments...",
              })
            : localPayments.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { text: "No payments yet." })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "overflow-x-auto",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                    className: "w-full text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                        className: "bg-secondary/40 text-xs text-muted-foreground",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Date" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Student" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Method" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Reference" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {
                              className: "text-right",
                              children: "Amount",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Th, {}),
                          ],
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                        children: localPayments.map((p) => {
                          const sName =
                            p.fee_invoices?.students?.full_name ||
                            (p.fee_invoices ? studentName(p.fee_invoices.student_id) : "—");
                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "tr",
                            {
                              className:
                                "border-t border-border hover:bg-secondary/20 transition-colors",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-muted-foreground",
                                  children: p.paid_on,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "font-medium text-foreground",
                                  children: sName,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "capitalize text-muted-foreground",
                                  children: p.method,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-muted-foreground",
                                  children: p.reference ?? "—",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-right font-semibold text-foreground",
                                  children: fmt(Number(p.amount)),
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Td, {
                                  className: "text-right",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () => setReceipt(p),
                                    className:
                                      "text-xs text-brand hover:underline inline-flex items-center gap-1 cursor-pointer",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, {
                                        className: "size-3",
                                      }),
                                      " Receipt",
                                    ],
                                  }),
                                }),
                              ],
                            },
                            p.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground",
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
                  " payments",
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
      receipt &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(ReceiptModal, {
          payment: receipt,
          invoice: receipt.fee_invoices,
          studentName,
          schoolName,
          onClose: () => setReceipt(null),
        }),
    ],
  });
}
function ReceiptModal({ payment, invoice, studentName, schoolName, onClose }) {
  const sName = invoice?.students?.full_name || (invoice ? studentName(invoice.student_id) : "—");
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className:
      "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 print:bg-white print:p-0",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className:
        "bg-card text-card-foreground rounded-xl w-full max-w-md shadow-xl print:shadow-none print:rounded-none",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className:
            "flex items-center justify-between px-5 py-3 border-b border-border print:hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
              className: "font-semibold text-sm",
              children: "Payment receipt",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: onClose,
              className: "text-muted-foreground hover:text-foreground cursor-pointer",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "p-6 space-y-3 text-sm",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "font-bold text-base text-foreground",
                      children: schoolName,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Official receipt",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Receipt, { className: "size-6 text-brand" }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
              k: "Receipt #",
              v: payment.id.slice(0, 8).toUpperCase(),
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Date", v: payment.paid_on }),
            invoice && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Student", v: sName }),
            invoice &&
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
                k: "Invoice",
                v: `${invoice.title} (${invoice.period})`,
              }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
              k: "Method",
              v: payment.method.toUpperCase(),
            }),
            payment.reference &&
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { k: "Reference", v: payment.reference }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-border" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
              k: "Amount paid",
              v: fmt(Number(payment.amount)),
              bold: true,
            }),
            invoice &&
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
                    k: "Total due",
                    v: fmt(Number(invoice.amount_due)),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Row, {
                    k: "Balance",
                    v: fmt(Number(invoice.amount_due) - Number(invoice.amount_paid)),
                  }),
                ],
              }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "px-5 py-3 border-t border-border flex justify-end gap-2 print:hidden",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: () => window.print(),
              className:
                "px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-4" }),
                " Print",
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: onClose,
              className:
                "px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90",
              children: "Done",
            }),
          ],
        }),
      ],
    }),
  });
}
const inputCls =
  "w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
    className: "block",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: "text-xs font-semibold block mb-1 text-foreground",
        children: label,
      }),
      children,
    ],
  });
}
function Card({ title, icon: Icon, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className:
      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "px-5 py-3 border-b border-border flex items-center gap-2 bg-secondary/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 text-brand" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
            className: "text-sm font-semibold text-foreground",
            children: title,
          }),
        ],
      }),
      children,
    ],
  });
}
function Kpi({ icon: Icon, label, value, tone }) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "brand"
          ? "text-brand"
          : "text-foreground";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm font-medium text-muted-foreground",
            children: label,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: `size-4 ${toneCls}` }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: `text-2xl font-bold mt-2 ${toneCls}`,
        children: value,
      }),
    ],
  });
}
function StatusBadge({ status }) {
  const map = {
    paid: "bg-success/15 text-success",
    partial: "bg-brand/15 text-brand",
    pending: "bg-secondary text-muted-foreground",
    overdue: "bg-danger/15 text-danger",
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
    className: `text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${map[status] ?? "bg-secondary text-muted-foreground"}`,
    children: status,
  });
}
function Empty({ text }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "p-8 text-sm text-muted-foreground text-center",
    children: text,
  });
}
function Th({ children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
    className: `text-left font-semibold px-5 py-2 ${className}`,
    children,
  });
}
function Td({ children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
    className: `px-5 py-2 ${className}`,
    children,
  });
}
function Row({ k, v, bold }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "flex items-center justify-between text-foreground",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: "text-muted-foreground",
        children: k,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: bold ? "font-bold text-foreground" : "font-medium text-foreground",
        children: v,
      }),
    ],
  });
}
function fmt(n) {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);
}
export { FeesPage as component };
