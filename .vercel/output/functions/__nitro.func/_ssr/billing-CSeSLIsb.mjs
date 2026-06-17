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
import { c as clientExports } from "../_libs/react-dom.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import {
  af as ShieldCheck,
  x as CreditCard,
  r as CircleCheck,
  y as Download,
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
function InvoicePDFTemplate({ invoice, school, sub }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    style: {
      width: "800px",
      padding: "40px",
      backgroundColor: "#fff",
      color: "#000",
      fontFamily: "sans-serif",
    },
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "20px",
          marginBottom: "20px",
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                style: { fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" },
                children: "SCHOOL ERP CONNECT",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                style: { color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" },
                children: "Multi-Tenant SaaS Platform",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            style: { textAlign: "right" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                style: { fontSize: "24px", fontWeight: "bold", margin: 0, color: "#3b82f6" },
                children: "INVOICE",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: "4px 0", fontSize: "14px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Invoice #:" }),
                  " ",
                  invoice.invoice_number,
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: "0", fontSize: "14px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Date:" }),
                  " ",
                  new Date(invoice.created_at).toLocaleDateString(),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: "4px 0 0 0", fontSize: "14px" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Status:" }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                    style: {
                      color: invoice.status === "paid" ? "#10b981" : "#f59e0b",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    },
                    children: invoice.status,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: { display: "flex", justifyContent: "space-between", marginBottom: "40px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                style: {
                  fontSize: "16px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 8px 0",
                },
                children: "Billed To:",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                style: { margin: 0, fontWeight: "bold", fontSize: "18px" },
                children: school.name,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                style: { margin: "4px 0 0 0", color: "#334155", maxWidth: "250px" },
                children: school.address || "Address not provided",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            style: { textAlign: "right" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                style: {
                  fontSize: "16px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 8px 0",
                },
                children: "Subscription Details:",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: 0, fontWeight: "bold" },
                children: [sub.plan, " Plan"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: "4px 0 0 0", color: "#334155" },
                children: ["Billing Cycle: ", sub.billing_cycle],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                style: { margin: "4px 0 0 0", color: "#334155" },
                children: [
                  "Limits: ",
                  school.student_limit,
                  " Students, ",
                  school.teacher_limit,
                  " Teachers",
                ],
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
        style: { width: "100%", borderCollapse: "collapse", marginBottom: "40px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
              style: { backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                  style: { padding: "12px", textAlign: "left", color: "#475569" },
                  children: "Description",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                  style: { padding: "12px", textAlign: "right", color: "#475569" },
                  children: "Amount",
                }),
              ],
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
              style: { borderBottom: "1px solid #e2e8f0" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                  style: { padding: "16px 12px" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      style: { fontWeight: "bold", color: "#0f172a" },
                      children: ["School ERP Connect - ", sub.plan, " Plan"],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      style: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
                      children: [
                        "Period: ",
                        invoice.billing_period_start
                          ? new Date(invoice.billing_period_start).toLocaleDateString()
                          : "N/A",
                        " - ",
                        invoice.billing_period_end
                          ? new Date(invoice.billing_period_end).toLocaleDateString()
                          : "N/A",
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                  style: { padding: "16px 12px", textAlign: "right", fontWeight: "bold" },
                  children: ["$", Number(invoice.amount).toFixed(2)],
                }),
              ],
            }),
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        style: { display: "flex", justifyContent: "flex-end" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          style: { width: "300px" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e2e8f0",
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  style: { color: "#64748b" },
                  children: "Subtotal",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                  style: { fontWeight: "bold" },
                  children: ["$", Number(invoice.amount).toFixed(2)],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e2e8f0",
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  style: { color: "#64748b" },
                  children: "Tax (GST)",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                  style: { fontWeight: "bold" },
                  children: ["$", Number(invoice.gst_amount).toFixed(2)],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "2px solid #3b82f6",
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  style: { fontSize: "20px", fontWeight: "bold", color: "#0f172a" },
                  children: "Total Due",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                  style: { fontSize: "20px", fontWeight: "bold", color: "#3b82f6" },
                  children: ["$", Number(invoice.total_amount).toFixed(2)],
                }),
              ],
            }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: { marginTop: "60px", textAlign: "center", color: "#94a3b8", fontSize: "12px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            children: "Thank you for choosing School ERP Connect!",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            children:
              "If you have any questions about this invoice, please contact support@schoolconnect.com",
          }),
        ],
      }),
    ],
  });
}
function BillingPage() {
  const { currentSchoolId: schoolId, roles, loading: tenantLoading } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("Billing & Subscription");
  const [loading, setLoading] = reactExports.useState(true);
  const [school, setSchool] = reactExports.useState(null);
  const [sub, setSub] = reactExports.useState(null);
  const [invoices, setInvoices] = reactExports.useState([]);
  const [counts, setCounts] = reactExports.useState({
    students: 0,
    teachers: 0,
  });
  const [generatingPdf, setGeneratingPdf] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!schoolId || !isAdmin) return;
    loadData();
  }, [schoolId, isAdmin]);
  const loadData = async () => {
    setLoading(true);
    const [sc, sb, inv, st, tr] = await Promise.all([
      supabase
        .from("schools")
        .select("name, address, student_limit, teacher_limit")
        .eq("id", schoolId)
        .single(),
      supabase
        .from("subscriptions")
        .select("plan, status, monthly_amount, billing_cycle, current_period_end")
        .eq("school_id", schoolId)
        .single(),
      supabase.from("platform_invoices").select("*").eq("school_id", schoolId).order("created_at", {
        ascending: false,
      }),
      supabase
        .from("students")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", schoolId),
      supabase
        .from("user_roles")
        .select("user_id", {
          count: "exact",
          head: true,
        })
        .eq("school_id", schoolId)
        .eq("role", "teacher"),
    ]);
    if (sc.data) setSchool(sc.data);
    if (sb.data) setSub(sb.data);
    if (inv.data) setInvoices(inv.data);
    setCounts({
      students: st.count ?? 0,
      teachers: tr.count ?? 0,
    });
    setLoading(false);
  };
  const handleDownloadInvoice = async (invoice) => {
    try {
      setGeneratingPdf(invoice.id);
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      document.body.appendChild(container);
      const root = clientExports.createRoot(container);
      root.render(
        /* @__PURE__ */ jsxRuntimeExports.jsx(InvoicePDFTemplate, { invoice, school, sub }),
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const canvas = await safeHtml2Canvas(container.firstElementChild, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf_node_minExports.jsPDF("p", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoice_number}.pdf`);
      root.unmount();
      document.body.removeChild(container);
      toast.success("Invoice downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPdf(null);
    }
  };
  if (!isAdmin)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "p-8 text-center",
      children: "Unauthorized",
    });
  if (loading || !sub || !school)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "p-8 text-center",
      children: "Loading billing data...",
    });
  const stuPercent = Math.min(100, Math.round((counts.students / school.student_limit) * 100));
  const teaPercent = Math.min(100, Math.round((counts.teachers / school.teacher_limit) * 100));
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
        title: "Billing & Subscription",
        breadcrumb: "Admin",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-8 max-w-5xl mx-auto space-y-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl p-6 shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-start justify-between",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-2 mb-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {
                            className: "size-6 text-brand",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                            className: "text-xl font-bold capitalize",
                            children: [sub.plan, " Plan"],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: `text-xs px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${sub.status === "active" ? "bg-brand-soft text-brand" : "bg-warning/20 text-warning-dark"}`,
                            children: sub.status,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                        className: "text-muted-foreground text-sm",
                        children: [
                          "You are currently on the ",
                          sub.plan,
                          " tier billed ",
                          sub.billing_cycle,
                          ".",
                          sub.current_period_end &&
                            ` Your current billing period ends on ${new Date(sub.current_period_end).toLocaleDateString()}.`,
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "text-right",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-3xl font-bold",
                        children: ["$", sub.monthly_amount],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-xs text-muted-foreground uppercase tracking-wider",
                        children: [
                          "Per ",
                          sub.billing_cycle === "yearly"
                            ? "Year"
                            : sub.billing_cycle === "quarterly"
                              ? "Quarter"
                              : "Month",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "mt-8 grid grid-cols-2 gap-8",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex justify-between text-sm mb-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-medium",
                            children: "Students",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "text-muted-foreground",
                            children: [counts.students, " / ", school.student_limit],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "h-2 bg-muted rounded-full overflow-hidden",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-full bg-brand",
                          style: {
                            width: `${stuPercent}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex justify-between text-sm mb-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-medium",
                            children: "Teachers",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "text-muted-foreground",
                            children: [counts.teachers, " / ", school.teacher_limit],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "h-2 bg-muted rounded-full overflow-hidden",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-full bg-brand",
                          style: {
                            width: `${teaPercent}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "mt-8 flex gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    className:
                      "px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm",
                    children: "Upgrade Plan",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    className: "px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md",
                    children: "Update Payment Method",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
            className: "bg-card border border-border rounded-xl overflow-hidden shadow-sm",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "px-6 py-4 border-b border-border flex items-center justify-between",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                  className: "font-semibold flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, {
                      className: "size-4 text-muted-foreground",
                    }),
                    "Invoice History",
                  ],
                }),
              }),
              invoices.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "p-8 text-center text-sm text-muted-foreground",
                    children: "No invoices generated yet.",
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
                                className: "text-left px-6 py-3",
                                children: "Invoice #",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "text-left px-6 py-3",
                                children: "Date",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "text-left px-6 py-3",
                                children: "Amount",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "text-left px-6 py-3",
                                children: "Status",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "text-right px-6 py-3",
                                children: "Download",
                              }),
                            ],
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                          className: "divide-y divide-border",
                          children: invoices.map((inv) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "tr",
                              {
                                className: "hover:bg-muted/30",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 font-medium",
                                    children: inv.invoice_number,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-muted-foreground",
                                    children: new Date(inv.created_at).toLocaleDateString(),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                    className: "px-6 py-3",
                                    children: ["$", inv.total_amount.toFixed(2)],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                      className: `inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${inv.status === "paid" ? "bg-success/20 text-success-dark" : "bg-warning/20 text-warning-dark"}`,
                                      children: [
                                        inv.status === "paid" &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                                            className: "size-3",
                                          }),
                                        inv.status,
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                    className: "px-6 py-3 text-right",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                      onClick: () => handleDownloadInvoice(inv),
                                      disabled: generatingPdf === inv.id,
                                      className:
                                        "inline-flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 disabled:opacity-50",
                                      children:
                                        generatingPdf === inv.id
                                          ? "Generating..."
                                          : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              jsxRuntimeExports.Fragment,
                                              {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                                    className: "size-3",
                                                  }),
                                                  " PDF",
                                                ],
                                              },
                                            ),
                                    }),
                                  }),
                                ],
                              },
                              inv.id,
                            ),
                          ),
                        }),
                      ],
                    }),
                  }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { BillingPage as component };
