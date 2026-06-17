import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { u as useServerFn, p as provisionSchool } from "./platform.functions-CG6gbu1e.mjs";
import { u as useAuth, d as useSchoolContext, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  E as Earth,
  a3 as Plus,
  h as Building2,
  B as BadgeDollarSign,
  as as Users,
  $ as Pause,
  a2 as Play,
  a as ArrowRight,
  am as Trash2,
  au as X,
} from "../_libs/lucide-react.mjs";
import {
  R as ResponsiveContainer,
  b as BarChart,
  C as CartesianGrid,
  X as XAxis,
  Y as YAxis,
  T as Tooltip,
  B as Bar,
} from "../_libs/recharts.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
import "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function SuperAdminPage() {
  const { roles } = useAuth();
  const { enterSchool } = useSchoolContext();
  const navigate = useNavigate();
  const isSuper = roles.includes("super_admin");
  const [schools, setSchools] = reactExports.useState([]);
  const [subs, setSubs] = reactExports.useState([]);
  const [counts, setCounts] = reactExports.useState({
    students: 0,
    teachers: 0,
    trial: 0,
    expired: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = reactExports.useState(true);
  const [wizardOpen, setWizardOpen] = reactExports.useState(false);
  const [revenueData, setRevenueData] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!isSuper) return;
    void loadAll();
  }, [isSuper]);
  const loadAll = async () => {
    setLoading(true);
    const [s, sb, st, tr, paymentsRows] = await Promise.all([
      supabase.from("schools").select("*").order("created_at", {
        ascending: false,
      }),
      supabase
        .from("subscriptions")
        .select("school_id, monthly_amount, status, billing_cycle, trial_end"),
      supabase.from("students").select("id", {
        count: "exact",
        head: true,
      }),
      supabase
        .from("user_roles")
        .select("user_id", {
          count: "exact",
          head: true,
        })
        .eq("role", "teacher"),
      supabase
        .from("platform_payments")
        .select("amount, paid_at")
        .eq("status", "completed")
        .order("paid_at", {
          ascending: true,
        }),
    ]);
    const allSchools = s.data ?? [];
    const allSubs = sb.data ?? [];
    setSchools(allSchools);
    setSubs(allSubs);
    const revMap = /* @__PURE__ */ new Map();
    if (paymentsRows.data) {
      paymentsRows.data.forEach((p) => {
        const month = new Date(p.paid_at).toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        revMap.set(month, (revMap.get(month) ?? 0) + Number(p.amount));
      });
    }
    setRevenueData(
      Array.from(revMap.entries()).map(([month, amount]) => ({
        month,
        amount,
      })),
    );
    setCounts({
      students: st.count ?? 0,
      teachers: tr.count ?? 0,
      trial: allSubs.filter(
        (sub) =>
          sub.status === "trialing" ||
          (sub.trial_end && new Date(sub.trial_end) > /* @__PURE__ */ new Date()),
      ).length,
      expired: allSubs.filter((sub) => sub.status === "expired" || sub.status === "canceled")
        .length,
      pendingPayments: 0,
      // Will implement real pending payments via platform_invoices later
    });
    setLoading(false);
  };
  const setStatus = async (id, status) => {
    const { error } = await supabase
      .from("schools")
      .update({
        status,
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "active" ? "School activated" : "School suspended");
    void loadAll();
  };
  const removeSchool = async (id, name) => {
    if (!confirm(`Delete "${name}"? This permanently removes the school and all its data.`)) return;
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("School deleted");
    void loadAll();
  };
  if (!isSuper) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
          title: "Platform",
          breadcrumb: "Restricted",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "p-8",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, {
                className: "size-10 text-muted-foreground mx-auto",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "mt-3 font-semibold",
                children: "Super admin only",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-muted-foreground mt-1",
                children: "You need the platform owner role to view this page.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                onClick: () =>
                  navigate({
                    to: "/dashboard",
                  }),
                className: "mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md",
                children: "Back to dashboard",
              }),
            ],
          }),
        }),
      ],
    });
  }
  const active = schools.filter((s) => s.status === "active").length;
  const revenue = subs
    .filter((s) => s.status === "active")
    .reduce((a, b) => a + Number(b.monthly_amount), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Platform",
        breadcrumb: "Super Admin",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
          onClick: () => setWizardOpen(true),
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            " Add school",
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: Building2,
                label: "Total Schools",
                value: schools.length,
                sub: `${active} active`,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: BadgeDollarSign,
                label: "MRR (Monthly)",
                value: `$${revenue.toLocaleString()}`,
                tone: "brand",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: BadgeDollarSign,
                label: "Annual Revenue",
                value: `$${(revenue * 12).toLocaleString()}`,
                tone: "brand",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: Users,
                label: "Trial / Expired",
                value: `${counts.trial} / ${counts.expired}`,
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl p-5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "text-sm font-semibold mb-6",
                children: "Revenue Growth",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "h-64",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                  width: "100%",
                  height: "100%",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, {
                    data: revenueData,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                        strokeDasharray: "3 3",
                        vertical: false,
                        stroke: "#e2e8f0",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                        dataKey: "month",
                        axisLine: false,
                        tickLine: false,
                        tick: {
                          fontSize: 12,
                          fill: "#64748b",
                        },
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                        axisLine: false,
                        tickLine: false,
                        tick: {
                          fontSize: 12,
                          fill: "#64748b",
                        },
                        tickFormatter: (val) => `$${val}`,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {
                        cursor: {
                          fill: "#f1f5f9",
                        },
                        contentStyle: {
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        },
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                        dataKey: "amount",
                        fill: "#3b82f6",
                        radius: [4, 4, 0, 0],
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl overflow-hidden",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "px-5 py-3 border-b border-border flex items-center justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: "All schools",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [schools.length, " total"],
                  }),
                ],
              }),
              loading
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "p-8 text-sm text-muted-foreground",
                    children: "Loading…",
                  })
                : schools.length === 0
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "p-10 text-sm text-muted-foreground text-center",
                      children: 'No schools yet. Click "Add school" to provision the first tenant.',
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "overflow-x-auto",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                        className: "w-full text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                            className:
                              "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "School",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Code",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Plan",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Limits",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Status",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "text-right px-5 py-3",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                            className: "divide-y divide-border",
                            children: schools.map((s) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "tr",
                                {
                                  className: "hover:bg-muted/30",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-5 py-3 font-medium",
                                      children: s.name,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-5 py-3 text-muted-foreground",
                                      children: s.code || "—",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-5 py-3 capitalize",
                                      children: s.plan,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                      className: "px-5 py-3 text-muted-foreground text-xs",
                                      children: [
                                        s.student_limit,
                                        " students · ",
                                        s.teacher_limit,
                                        " teachers",
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-5 py-3",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${s.status === "active" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`,
                                        children: s.status,
                                      }),
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-5 py-3 text-right",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "inline-flex items-center gap-2",
                                        children: [
                                          s.status === "active"
                                            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                                onClick: () => setStatus(s.id, "suspended"),
                                                className:
                                                  "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, {
                                                    className: "size-3",
                                                  }),
                                                  " Suspend",
                                                ],
                                              })
                                            : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                                onClick: () => setStatus(s.id, "active"),
                                                className:
                                                  "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, {
                                                    className: "size-3",
                                                  }),
                                                  " Activate",
                                                ],
                                              }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                            onClick: () => {
                                              enterSchool({
                                                id: s.id,
                                                name: s.name,
                                                code: s.code,
                                                logo_url: s.logo_url ?? null,
                                                address: s.address ?? null,
                                                phone: s.phone ?? null,
                                                email: s.email ?? null,
                                                status: s.status,
                                              });
                                              void navigate({
                                                to: "/dashboard",
                                              });
                                            },
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-brand-soft hover:text-brand",
                                            title: "Enter School Dashboard",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, {
                                                className: "size-3",
                                              }),
                                              " Enter",
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () => removeSchool(s.id, s.name),
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-danger-soft hover:text-danger",
                                            title: "Delete School",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              Trash2,
                                              { className: "size-3" },
                                            ),
                                          }),
                                        ],
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
                    }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: [
              "Tip: switch into any school via",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                to: "/admin",
                className: "text-brand font-medium",
                children: "Admin Panel → Schools",
              }),
              " ",
              "(you'll need an admin role in that school).",
            ],
          }),
        ],
      }),
      wizardOpen &&
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreateSchoolWizard, {
          onClose: () => setWizardOpen(false),
          onCreated: () => {
            setWizardOpen(false);
            void loadAll();
          },
        }),
    ],
  });
}
function Kpi({ icon: Icon, label, value, sub, tone }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm font-medium text-muted-foreground",
            children: label,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, {
            className: "size-4 text-muted-foreground",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: `text-3xl font-bold mt-2 ${tone === "brand" ? "text-brand" : "text-foreground"}`,
        children: value,
      }),
      sub &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "text-xs text-muted-foreground mt-1",
          children: sub,
        }),
    ],
  });
}
function CreateSchoolWizard({ onClose, onCreated }) {
  const provision = useServerFn(provisionSchool);
  const [step, setStep] = reactExports.useState(1);
  const [submitting, setSubmitting] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    code: "",
    address: "",
    email: "",
    phone: "",
    logo_url: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    plan: "starter",
    billing_cycle: "monthly",
    student_limit: 500,
    teacher_limit: 50,
    monthly_amount: 0,
  });
  const set = (k, v) =>
    setForm((p) => ({
      ...p,
      [k]: v,
    }));
  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await provision({
        data: {
          school: {
            name: form.name.trim(),
            code: form.code.trim(),
            address: form.address || void 0,
            email: form.email || null,
            phone: form.phone || null,
            logo_url: form.logo_url || null,
            plan: form.plan,
            billing_cycle: form.billing_cycle,
            student_limit: Number(form.student_limit),
            teacher_limit: Number(form.teacher_limit),
            monthly_amount: Number(form.monthly_amount),
          },
          admin: {
            full_name: form.admin_name.trim(),
            email: form.admin_email.trim(),
            password: form.admin_password,
          },
        },
      });
      toast.success(`Created "${form.name}"`);
      onCreated();
    } catch (err) {
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String(err.message)
          : String(err);
      toast.error(msg || "Failed to create school");
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
      onSubmit: submit,
      className:
        "bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", {
          className: "px-6 py-4 border-b border-border flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                  className: "text-xs uppercase tracking-wider text-muted-foreground",
                  children: ["Step ", step, " of 3"],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                  className: "text-lg font-semibold",
                  children:
                    step === 1 ? "School details" : step === 2 ? "School admin" : "Plan & limits",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              type: "button",
              onClick: onClose,
              className: "p-1 hover:bg-muted rounded",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "p-6 space-y-4",
          children: [
            step === 1 &&
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "School name",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      required: true,
                      value: form.name,
                      onChange: (e) => set("name", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "School code",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      required: true,
                      value: form.code,
                      onChange: (e) => set("code", e.target.value.toUpperCase()),
                      placeholder: "HEZO-001",
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Address",
                    className: "col-span-2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      value: form.address,
                      onChange: (e) => set("address", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Email",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "email",
                      value: form.email,
                      onChange: (e) => set("email", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Phone",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      value: form.phone,
                      onChange: (e) => set("phone", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Logo URL",
                    className: "col-span-2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "url",
                      value: form.logo_url,
                      onChange: (e) => set("logo_url", e.target.value),
                      className: inputCls,
                    }),
                  }),
                ],
              }),
            step === 2 &&
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Admin name",
                    required: true,
                    className: "col-span-2",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      required: true,
                      value: form.admin_name,
                      onChange: (e) => set("admin_name", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Admin email",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      required: true,
                      type: "email",
                      value: form.admin_email,
                      onChange: (e) => set("admin_email", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Temporary password",
                    required: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      required: true,
                      type: "text",
                      minLength: 8,
                      value: form.admin_password,
                      onChange: (e) => set("admin_password", e.target.value),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "col-span-2 text-xs text-muted-foreground",
                    children:
                      "The admin will receive these credentials from you and can change the password after signing in.",
                  }),
                ],
              }),
            step === 3 &&
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-3 gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Plan",
                    className: "col-span-3",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "grid grid-cols-3 gap-2",
                      children: ["starter", "professional", "enterprise"].map((p) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => set("plan", p),
                            className: `px-3 py-3 rounded-lg border text-sm font-medium capitalize ${form.plan === p ? "border-brand bg-brand-soft text-brand" : "border-border hover:bg-muted"}`,
                            children: p,
                          },
                          p,
                        ),
                      ),
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Billing Cycle",
                    className: "col-span-3",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "grid grid-cols-3 gap-2",
                      children: ["monthly", "quarterly", "yearly"].map((b) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => set("billing_cycle", b),
                            className: `px-3 py-2 rounded-lg border text-sm font-medium capitalize ${form.billing_cycle === b ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`,
                            children: b,
                          },
                          b,
                        ),
                      ),
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Student limit",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "number",
                      min: 10,
                      value: form.student_limit,
                      onChange: (e) => set("student_limit", Number(e.target.value)),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Teacher limit",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "number",
                      min: 1,
                      value: form.teacher_limit,
                      onChange: (e) => set("teacher_limit", Number(e.target.value)),
                      className: inputCls,
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Field, {
                    label: "Base fee (USD)",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "number",
                      min: 0,
                      step: "0.01",
                      value: form.monthly_amount,
                      onChange: (e) => set("monthly_amount", Number(e.target.value)),
                      className: inputCls,
                    }),
                  }),
                ],
              }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", {
          className:
            "px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              type: "button",
              onClick: () => (step === 1 ? onClose() : setStep(step - 1)),
              className: "text-sm px-3 py-1.5 border border-border rounded-md hover:bg-muted",
              children: step === 1 ? "Cancel" : "Back",
            }),
            step < 3
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                  type: "button",
                  onClick: () => setStep(step + 1),
                  disabled:
                    (step === 1 && (!form.name.trim() || !form.code.trim())) ||
                    (step === 2 &&
                      (!form.admin_name.trim() ||
                        !form.admin_email.trim() ||
                        form.admin_password.length < 8)),
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50",
                  children: [
                    "Next ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  type: "submit",
                  disabled: submitting,
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                  children: submitting ? "Creating…" : "Create school",
                }),
          ],
        }),
      ],
    }),
  });
}
const inputCls =
  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring";
function Field({ label, required, children, className = "" }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
    className: `block ${className}`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
        className: "text-xs font-medium",
        children: [
          label,
          " ",
          required &&
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
              className: "text-danger",
              children: "*",
            }),
        ],
      }),
      children,
    ],
  });
}
export { SuperAdminPage as component };
