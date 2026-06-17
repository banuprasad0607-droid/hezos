import {
  r as B,
  x as e,
  a0 as L,
  X as W,
  M as x,
  P as A,
  b as E,
  D as F,
  p as $,
  I as q,
  N,
} from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import { E as M } from "./vendor-pdf-BA8uJ8a4.js";
import { S as R } from "./shield-check-DxZCxexz.js";
import "./vendor-supabase-Bz3EdAMz.js";
const H = [
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
    ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }],
  ],
  G = B("credit-card", H);
function O({ invoice: t, school: r, sub: l }) {
  return e.jsxs("div", {
    style: {
      width: "800px",
      padding: "40px",
      backgroundColor: "#fff",
      color: "#000",
      fontFamily: "sans-serif",
    },
    children: [
      e.jsxs("div", {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "20px",
          marginBottom: "20px",
        },
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h1", {
                style: { fontSize: "28px", fontWeight: "bold", margin: 0, color: "#0f172a" },
                children: "SCHOOL ERP CONNECT",
              }),
              e.jsx("p", {
                style: { color: "#64748b", margin: "4px 0 0 0", fontSize: "14px" },
                children: "Multi-Tenant SaaS Platform",
              }),
            ],
          }),
          e.jsxs("div", {
            style: { textAlign: "right" },
            children: [
              e.jsx("h2", {
                style: { fontSize: "24px", fontWeight: "bold", margin: 0, color: "#3b82f6" },
                children: "INVOICE",
              }),
              e.jsxs("p", {
                style: { margin: "4px 0", fontSize: "14px" },
                children: [e.jsx("strong", { children: "Invoice #:" }), " ", t.invoice_number],
              }),
              e.jsxs("p", {
                style: { margin: "0", fontSize: "14px" },
                children: [
                  e.jsx("strong", { children: "Date:" }),
                  " ",
                  new Date(t.created_at).toLocaleDateString(),
                ],
              }),
              e.jsxs("p", {
                style: { margin: "4px 0 0 0", fontSize: "14px" },
                children: [
                  e.jsx("strong", { children: "Status:" }),
                  " ",
                  e.jsx("span", {
                    style: {
                      color: t.status === "paid" ? "#10b981" : "#f59e0b",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    },
                    children: t.status,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        style: { display: "flex", justifyContent: "space-between", marginBottom: "40px" },
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                style: {
                  fontSize: "16px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 8px 0",
                },
                children: "Billed To:",
              }),
              e.jsx("p", {
                style: { margin: 0, fontWeight: "bold", fontSize: "18px" },
                children: r.name,
              }),
              e.jsx("p", {
                style: { margin: "4px 0 0 0", color: "#334155", maxWidth: "250px" },
                children: r.address || "Address not provided",
              }),
            ],
          }),
          e.jsxs("div", {
            style: { textAlign: "right" },
            children: [
              e.jsx("h3", {
                style: {
                  fontSize: "16px",
                  color: "#64748b",
                  textTransform: "uppercase",
                  margin: "0 0 8px 0",
                },
                children: "Subscription Details:",
              }),
              e.jsxs("p", {
                style: { margin: 0, fontWeight: "bold" },
                children: [l.plan, " Plan"],
              }),
              e.jsxs("p", {
                style: { margin: "4px 0 0 0", color: "#334155" },
                children: ["Billing Cycle: ", l.billing_cycle],
              }),
              e.jsxs("p", {
                style: { margin: "4px 0 0 0", color: "#334155" },
                children: [
                  "Limits: ",
                  r.student_limit,
                  " Students, ",
                  r.teacher_limit,
                  " Teachers",
                ],
              }),
            ],
          }),
        ],
      }),
      e.jsxs("table", {
        style: { width: "100%", borderCollapse: "collapse", marginBottom: "40px" },
        children: [
          e.jsx("thead", {
            children: e.jsxs("tr", {
              style: { backgroundColor: "#f8fafc", borderBottom: "1px solid #cbd5e1" },
              children: [
                e.jsx("th", {
                  style: { padding: "12px", textAlign: "left", color: "#475569" },
                  children: "Description",
                }),
                e.jsx("th", {
                  style: { padding: "12px", textAlign: "right", color: "#475569" },
                  children: "Amount",
                }),
              ],
            }),
          }),
          e.jsx("tbody", {
            children: e.jsxs("tr", {
              style: { borderBottom: "1px solid #e2e8f0" },
              children: [
                e.jsxs("td", {
                  style: { padding: "16px 12px" },
                  children: [
                    e.jsxs("div", {
                      style: { fontWeight: "bold", color: "#0f172a" },
                      children: ["School ERP Connect - ", l.plan, " Plan"],
                    }),
                    e.jsxs("div", {
                      style: { fontSize: "12px", color: "#64748b", marginTop: "4px" },
                      children: [
                        "Period: ",
                        t.billing_period_start
                          ? new Date(t.billing_period_start).toLocaleDateString()
                          : "N/A",
                        " - ",
                        t.billing_period_end
                          ? new Date(t.billing_period_end).toLocaleDateString()
                          : "N/A",
                      ],
                    }),
                  ],
                }),
                e.jsxs("td", {
                  style: { padding: "16px 12px", textAlign: "right", fontWeight: "bold" },
                  children: ["$", Number(t.amount).toFixed(2)],
                }),
              ],
            }),
          }),
        ],
      }),
      e.jsx("div", {
        style: { display: "flex", justifyContent: "flex-end" },
        children: e.jsxs("div", {
          style: { width: "300px" },
          children: [
            e.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e2e8f0",
              },
              children: [
                e.jsx("span", { style: { color: "#64748b" }, children: "Subtotal" }),
                e.jsxs("span", {
                  style: { fontWeight: "bold" },
                  children: ["$", Number(t.amount).toFixed(2)],
                }),
              ],
            }),
            e.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #e2e8f0",
              },
              children: [
                e.jsx("span", { style: { color: "#64748b" }, children: "Tax (GST)" }),
                e.jsxs("span", {
                  style: { fontWeight: "bold" },
                  children: ["$", Number(t.gst_amount).toFixed(2)],
                }),
              ],
            }),
            e.jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "16px 0",
                borderBottom: "2px solid #3b82f6",
              },
              children: [
                e.jsx("span", {
                  style: { fontSize: "20px", fontWeight: "bold", color: "#0f172a" },
                  children: "Total Due",
                }),
                e.jsxs("span", {
                  style: { fontSize: "20px", fontWeight: "bold", color: "#3b82f6" },
                  children: ["$", Number(t.total_amount).toFixed(2)],
                }),
              ],
            }),
          ],
        }),
      }),
      e.jsxs("div", {
        style: { marginTop: "60px", textAlign: "center", color: "#94a3b8", fontSize: "12px" },
        children: [
          e.jsx("p", { children: "Thank you for choosing School ERP Connect!" }),
          e.jsx("p", {
            children:
              "If you have any questions about this invoice, please contact support@schoolconnect.com",
          }),
        ],
      }),
    ],
  });
}
function J() {
  const { currentSchoolId: t, roles: r, loading: l } = L(),
    p = r.includes("admin") || r.includes("super_admin");
  W("Billing & Subscription");
  const [v, f] = a.useState(!0),
    [d, w] = a.useState(null),
    [n, _] = a.useState(null),
    [g, S] = a.useState([]),
    [m, C] = a.useState({ students: 0, teachers: 0 }),
    [b, j] = a.useState(null);
  a.useEffect(() => {
    !t || !p || D();
  }, [t, p]);
  const D = async () => {
      f(!0);
      const [s, i, o, c, h] = await Promise.all([
        x
          .from("schools")
          .select("name, address, student_limit, teacher_limit")
          .eq("id", t)
          .single(),
        x
          .from("subscriptions")
          .select("plan, status, monthly_amount, billing_cycle, current_period_end")
          .eq("school_id", t)
          .single(),
        x
          .from("platform_invoices")
          .select("*")
          .eq("school_id", t)
          .order("created_at", { ascending: !1 }),
        x.from("students").select("id", { count: "exact", head: !0 }).eq("school_id", t),
        x
          .from("user_roles")
          .select("user_id", { count: "exact", head: !0 })
          .eq("school_id", t)
          .eq("role", "teacher"),
      ]);
      (s.data && w(s.data),
        i.data && _(i.data),
        o.data && S(o.data),
        C({ students: c.count ?? 0, teachers: h.count ?? 0 }),
        f(!1));
    },
    P = async (s) => {
      try {
        j(s.id);
        const i = document.createElement("div");
        ((i.style.position = "absolute"),
          (i.style.top = "-9999px"),
          (i.style.left = "-9999px"),
          document.body.appendChild(i));
        const o = $.createRoot(i);
        (o.render(e.jsx(O, { invoice: s, school: d, sub: n })),
          await new Promise((I) => setTimeout(I, 500)));
        const c = await q(i.firstElementChild, { scale: 2 }),
          h = c.toDataURL("image/png"),
          u = new M("p", "pt", "a4"),
          y = u.internal.pageSize.getWidth(),
          T = (c.height * y) / c.width;
        (u.addImage(h, "PNG", 0, 0, y, T),
          u.save(`Invoice_${s.invoice_number}.pdf`),
          o.unmount(),
          document.body.removeChild(i),
          N.success("Invoice downloaded!"));
      } catch {
        N.error("Failed to generate PDF");
      } finally {
        j(null);
      }
    };
  if (!p) return e.jsx("div", { className: "p-8 text-center", children: "Unauthorized" });
  if (v || !n || !d)
    return e.jsx("div", { className: "p-8 text-center", children: "Loading billing data..." });
  const z = Math.min(100, Math.round((m.students / d.student_limit) * 100)),
    k = Math.min(100, Math.round((m.teachers / d.teacher_limit) * 100));
  return l
    ? l
      ? e.jsx("div", {
          className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
          children: e.jsxs("div", {
            className: "text-center space-y-4",
            children: [
              e.jsx("div", {
                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
              }),
              e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }),
            ],
          }),
        })
      : e.jsx("div", {
          className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
          children: e.jsxs("div", {
            className: "text-center space-y-4",
            children: [
              e.jsx("div", {
                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
              }),
              e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }),
            ],
          }),
        })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx(A, { title: "Billing & Subscription", breadcrumb: "Admin" }),
          e.jsxs("div", {
            className: "p-8 max-w-5xl mx-auto space-y-8",
            children: [
              e.jsxs("section", {
                className: "bg-card border border-border rounded-xl p-6 shadow-sm",
                children: [
                  e.jsxs("div", {
                    className: "flex items-start justify-between",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2 mb-2",
                            children: [
                              e.jsx(R, { className: "size-6 text-brand" }),
                              e.jsxs("h2", {
                                className: "text-xl font-bold capitalize",
                                children: [n.plan, " Plan"],
                              }),
                              e.jsx("span", {
                                className: `text-xs px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${n.status === "active" ? "bg-brand-soft text-brand" : "bg-warning/20 text-warning-dark"}`,
                                children: n.status,
                              }),
                            ],
                          }),
                          e.jsxs("p", {
                            className: "text-muted-foreground text-sm",
                            children: [
                              "You are currently on the ",
                              n.plan,
                              " tier billed ",
                              n.billing_cycle,
                              ".",
                              n.current_period_end &&
                                ` Your current billing period ends on ${new Date(n.current_period_end).toLocaleDateString()}.`,
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "text-right",
                        children: [
                          e.jsxs("div", {
                            className: "text-3xl font-bold",
                            children: ["$", n.monthly_amount],
                          }),
                          e.jsxs("div", {
                            className: "text-xs text-muted-foreground uppercase tracking-wider",
                            children: [
                              "Per ",
                              n.billing_cycle === "yearly"
                                ? "Year"
                                : n.billing_cycle === "quarterly"
                                  ? "Quarter"
                                  : "Month",
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-8 grid grid-cols-2 gap-8",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsxs("div", {
                            className: "flex justify-between text-sm mb-1",
                            children: [
                              e.jsx("span", { className: "font-medium", children: "Students" }),
                              e.jsxs("span", {
                                className: "text-muted-foreground",
                                children: [m.students, " / ", d.student_limit],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "h-2 bg-muted rounded-full overflow-hidden",
                            children: e.jsx("div", {
                              className: "h-full bg-brand",
                              style: { width: `${z}%` },
                            }),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsxs("div", {
                            className: "flex justify-between text-sm mb-1",
                            children: [
                              e.jsx("span", { className: "font-medium", children: "Teachers" }),
                              e.jsxs("span", {
                                className: "text-muted-foreground",
                                children: [m.teachers, " / ", d.teacher_limit],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className: "h-2 bg-muted rounded-full overflow-hidden",
                            children: e.jsx("div", {
                              className: "h-full bg-brand",
                              style: { width: `${k}%` },
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "mt-8 flex gap-3",
                    children: [
                      e.jsx("button", {
                        className:
                          "px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm",
                        children: "Upgrade Plan",
                      }),
                      e.jsx("button", {
                        className:
                          "px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md",
                        children: "Update Payment Method",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("section", {
                className: "bg-card border border-border rounded-xl overflow-hidden shadow-sm",
                children: [
                  e.jsx("div", {
                    className: "px-6 py-4 border-b border-border flex items-center justify-between",
                    children: e.jsxs("h3", {
                      className: "font-semibold flex items-center gap-2",
                      children: [
                        e.jsx(G, { className: "size-4 text-muted-foreground" }),
                        "Invoice History",
                      ],
                    }),
                  }),
                  g.length === 0
                    ? e.jsx("div", {
                        className: "p-8 text-center text-sm text-muted-foreground",
                        children: "No invoices generated yet.",
                      })
                    : e.jsx("div", {
                        className: "overflow-x-auto",
                        children: e.jsxs("table", {
                          className: "w-full text-sm",
                          children: [
                            e.jsx("thead", {
                              className:
                                "bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground",
                              children: e.jsxs("tr", {
                                children: [
                                  e.jsx("th", {
                                    className: "text-left px-6 py-3",
                                    children: "Invoice #",
                                  }),
                                  e.jsx("th", {
                                    className: "text-left px-6 py-3",
                                    children: "Date",
                                  }),
                                  e.jsx("th", {
                                    className: "text-left px-6 py-3",
                                    children: "Amount",
                                  }),
                                  e.jsx("th", {
                                    className: "text-left px-6 py-3",
                                    children: "Status",
                                  }),
                                  e.jsx("th", {
                                    className: "text-right px-6 py-3",
                                    children: "Download",
                                  }),
                                ],
                              }),
                            }),
                            e.jsx("tbody", {
                              className: "divide-y divide-border",
                              children: g.map((s) =>
                                e.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-muted/30",
                                    children: [
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-medium",
                                        children: s.invoice_number,
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-muted-foreground",
                                        children: new Date(s.created_at).toLocaleDateString(),
                                      }),
                                      e.jsxs("td", {
                                        className: "px-6 py-3",
                                        children: ["$", s.total_amount.toFixed(2)],
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsxs("span", {
                                          className: `inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${s.status === "paid" ? "bg-success/20 text-success-dark" : "bg-warning/20 text-warning-dark"}`,
                                          children: [
                                            s.status === "paid" &&
                                              e.jsx(E, { className: "size-3" }),
                                            s.status,
                                          ],
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-right",
                                        children: e.jsx("button", {
                                          onClick: () => P(s),
                                          disabled: b === s.id,
                                          className:
                                            "inline-flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 disabled:opacity-50",
                                          children:
                                            b === s.id
                                              ? "Generating..."
                                              : e.jsxs(e.Fragment, {
                                                  children: [
                                                    e.jsx(F, { className: "size-3" }),
                                                    " PDF",
                                                  ],
                                                }),
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
            ],
          }),
        ],
      });
}
export { J as component };
