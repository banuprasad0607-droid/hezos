import {
  r as A,
  V as U,
  Z as V,
  W as K,
  M as f,
  x as e,
  P as L,
  d as O,
  o as W,
  l as X,
  L as Y,
  N as j,
} from "./index-DrqTZ7SR.js";
import {
  k as c,
  h as Z,
  b as G,
  C as I,
  X as J,
  Y as Q,
  T as ee,
  B as te,
} from "./vendor-charts-DECNlt_G.js";
import { u as se, p as ae } from "./platform.functions-De0vHKEw.js";
import { B as re } from "./building-2-U_CRqHUZ.js";
import { P as le } from "./play-BlrNUM_S.js";
import { A as R } from "./arrow-right-rZebaCwW.js";
import { X as ne } from "./x-DH-xwxwM.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const oe = [
    [
      "path",
      {
        d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z",
        key: "3c2336",
      },
    ],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
    ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ],
  D = A("badge-dollar-sign", oe);
const ie = [
    ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54", key: "1djwo0" }],
    [
      "path",
      {
        d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17",
        key: "1tzkfa",
      },
    ],
    [
      "path",
      { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05", key: "14pb5j" },
    ],
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ],
  de = A("earth", ie);
const ce = [
    ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
    ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }],
  ],
  me = A("pause", ce);
function ve() {
  const { roles: u } = U(),
    { enterSchool: p } = V(),
    x = K(),
    r = u.includes("super_admin"),
    [d, y] = c.useState([]),
    [N, s] = c.useState([]),
    [v, l] = c.useState({ students: 0, teachers: 0, trial: 0, expired: 0, pendingPayments: 0 }),
    [k, t] = c.useState(!0),
    [m, b] = c.useState(!1),
    [M, B] = c.useState([]);
  c.useEffect(() => {
    r && _();
  }, [r]);
  const _ = async () => {
      t(!0);
      const [a, h, g, F, P] = await Promise.all([
          f.from("schools").select("*").order("created_at", { ascending: !1 }),
          f
            .from("subscriptions")
            .select("school_id, monthly_amount, status, billing_cycle, trial_end"),
          f.from("students").select("id", { count: "exact", head: !0 }),
          f
            .from("user_roles")
            .select("user_id", { count: "exact", head: !0 })
            .eq("role", "teacher"),
          f
            .from("platform_payments")
            .select("amount, paid_at")
            .eq("status", "completed")
            .order("paid_at", { ascending: !0 }),
        ]),
        H = a.data ?? [],
        C = h.data ?? [];
      (y(H), s(C));
      const z = new Map();
      (P.data &&
        P.data.forEach((i) => {
          const S = new Date(i.paid_at).toLocaleString("default", {
            month: "short",
            year: "2-digit",
          });
          z.set(S, (z.get(S) ?? 0) + Number(i.amount));
        }),
        B(Array.from(z.entries()).map(([i, S]) => ({ month: i, amount: S }))),
        l({
          students: g.count ?? 0,
          teachers: F.count ?? 0,
          trial: C.filter(
            (i) => i.status === "trialing" || (i.trial_end && new Date(i.trial_end) > new Date()),
          ).length,
          expired: C.filter((i) => i.status === "expired" || i.status === "canceled").length,
          pendingPayments: 0,
        }),
        t(!1));
    },
    $ = async (a, h) => {
      const { error: g } = await f.from("schools").update({ status: h }).eq("id", a);
      if (g) return j.error(g.message);
      (j.success(h === "active" ? "School activated" : "School suspended"), _());
    },
    E = async (a, h) => {
      if (!confirm(`Delete "${h}"? This permanently removes the school and all its data.`)) return;
      const { error: g } = await f.from("schools").delete().eq("id", a);
      if (g) return j.error(g.message);
      (j.success("School deleted"), _());
    };
  if (!r)
    return e.jsxs(e.Fragment, {
      children: [
        e.jsx(L, { title: "Platform", breadcrumb: "Restricted" }),
        e.jsx("div", {
          className: "p-8",
          children: e.jsxs("div", {
            className: "max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center",
            children: [
              e.jsx(de, { className: "size-10 text-muted-foreground mx-auto" }),
              e.jsx("h2", { className: "mt-3 font-semibold", children: "Super admin only" }),
              e.jsx("p", {
                className: "text-sm text-muted-foreground mt-1",
                children: "You need the platform owner role to view this page.",
              }),
              e.jsx("button", {
                onClick: () => x({ to: "/dashboard" }),
                className: "mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md",
                children: "Back to dashboard",
              }),
            ],
          }),
        }),
      ],
    });
  const T = d.filter((a) => a.status === "active").length,
    q = N.filter((a) => a.status === "active").reduce((a, h) => a + Number(h.monthly_amount), 0);
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(L, {
        title: "Platform",
        breadcrumb: "Super Admin",
        actions: e.jsxs("button", {
          onClick: () => b(!0),
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1",
          children: [e.jsx(O, { className: "size-4" }), " Add school"],
        }),
      }),
      e.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children: [
          e.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4",
            children: [
              e.jsx(w, { icon: re, label: "Total Schools", value: d.length, sub: `${T} active` }),
              e.jsx(w, {
                icon: D,
                label: "MRR (Monthly)",
                value: `$${q.toLocaleString()}`,
                tone: "brand",
              }),
              e.jsx(w, {
                icon: D,
                label: "Annual Revenue",
                value: `$${(q * 12).toLocaleString()}`,
                tone: "brand",
              }),
              e.jsx(w, { icon: W, label: "Trial / Expired", value: `${v.trial} / ${v.expired}` }),
            ],
          }),
          e.jsxs("section", {
            className: "bg-card border border-border rounded-xl p-5",
            children: [
              e.jsx("h2", { className: "text-sm font-semibold mb-6", children: "Revenue Growth" }),
              e.jsx("div", {
                className: "h-64",
                children: e.jsx(Z, {
                  width: "100%",
                  height: "100%",
                  children: e.jsxs(G, {
                    data: M,
                    children: [
                      e.jsx(I, { strokeDasharray: "3 3", vertical: !1, stroke: "#e2e8f0" }),
                      e.jsx(J, {
                        dataKey: "month",
                        axisLine: !1,
                        tickLine: !1,
                        tick: { fontSize: 12, fill: "#64748b" },
                      }),
                      e.jsx(Q, {
                        axisLine: !1,
                        tickLine: !1,
                        tick: { fontSize: 12, fill: "#64748b" },
                        tickFormatter: (a) => `$${a}`,
                      }),
                      e.jsx(ee, {
                        cursor: { fill: "#f1f5f9" },
                        contentStyle: {
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        },
                      }),
                      e.jsx(te, { dataKey: "amount", fill: "#3b82f6", radius: [4, 4, 0, 0] }),
                    ],
                  }),
                }),
              }),
            ],
          }),
          e.jsxs("section", {
            className: "bg-card border border-border rounded-xl overflow-hidden",
            children: [
              e.jsxs("div", {
                className: "px-5 py-3 border-b border-border flex items-center justify-between",
                children: [
                  e.jsx("h2", { className: "text-sm font-semibold", children: "All schools" }),
                  e.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [d.length, " total"],
                  }),
                ],
              }),
              k
                ? e.jsx("div", {
                    className: "p-8 text-sm text-muted-foreground",
                    children: "Loading…",
                  })
                : d.length === 0
                  ? e.jsx("div", {
                      className: "p-10 text-sm text-muted-foreground text-center",
                      children: 'No schools yet. Click "Add school" to provision the first tenant.',
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
                                  className: "text-left px-5 py-3",
                                  children: "School",
                                }),
                                e.jsx("th", { className: "text-left px-5 py-3", children: "Code" }),
                                e.jsx("th", { className: "text-left px-5 py-3", children: "Plan" }),
                                e.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Limits",
                                }),
                                e.jsx("th", {
                                  className: "text-left px-5 py-3",
                                  children: "Status",
                                }),
                                e.jsx("th", {
                                  className: "text-right px-5 py-3",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          e.jsx("tbody", {
                            className: "divide-y divide-border",
                            children: d.map((a) =>
                              e.jsxs(
                                "tr",
                                {
                                  className: "hover:bg-muted/30",
                                  children: [
                                    e.jsx("td", {
                                      className: "px-5 py-3 font-medium",
                                      children: a.name,
                                    }),
                                    e.jsx("td", {
                                      className: "px-5 py-3 text-muted-foreground",
                                      children: a.code || "—",
                                    }),
                                    e.jsx("td", {
                                      className: "px-5 py-3 capitalize",
                                      children: a.plan,
                                    }),
                                    e.jsxs("td", {
                                      className: "px-5 py-3 text-muted-foreground text-xs",
                                      children: [
                                        a.student_limit,
                                        " students · ",
                                        a.teacher_limit,
                                        " teachers",
                                      ],
                                    }),
                                    e.jsx("td", {
                                      className: "px-5 py-3",
                                      children: e.jsx("span", {
                                        className: `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${a.status === "active" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`,
                                        children: a.status,
                                      }),
                                    }),
                                    e.jsx("td", {
                                      className: "px-5 py-3 text-right",
                                      children: e.jsxs("div", {
                                        className: "inline-flex items-center gap-2",
                                        children: [
                                          a.status === "active"
                                            ? e.jsxs("button", {
                                                onClick: () => $(a.id, "suspended"),
                                                className:
                                                  "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted",
                                                children: [
                                                  e.jsx(me, { className: "size-3" }),
                                                  " Suspend",
                                                ],
                                              })
                                            : e.jsxs("button", {
                                                onClick: () => $(a.id, "active"),
                                                className:
                                                  "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted",
                                                children: [
                                                  e.jsx(le, { className: "size-3" }),
                                                  " Activate",
                                                ],
                                              }),
                                          e.jsxs("button", {
                                            onClick: () => {
                                              (p({
                                                id: a.id,
                                                name: a.name,
                                                code: a.code,
                                                logo_url: a.logo_url ?? null,
                                                address: a.address ?? null,
                                                phone: a.phone ?? null,
                                                email: a.email ?? null,
                                                status: a.status,
                                              }),
                                                x({ to: "/dashboard" }));
                                            },
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-brand-soft hover:text-brand",
                                            title: "Enter School Dashboard",
                                            children: [e.jsx(R, { className: "size-3" }), " Enter"],
                                          }),
                                          e.jsx("button", {
                                            onClick: () => E(a.id, a.name),
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-danger-soft hover:text-danger",
                                            title: "Delete School",
                                            children: e.jsx(X, { className: "size-3" }),
                                          }),
                                        ],
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
          e.jsxs("p", {
            className: "text-xs text-muted-foreground",
            children: [
              "Tip: switch into any school via",
              " ",
              e.jsx(Y, {
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
      m &&
        e.jsx(ue, {
          onClose: () => b(!1),
          onCreated: () => {
            (b(!1), _());
          },
        }),
    ],
  });
}
function w({ icon: u, label: p, value: x, sub: r, tone: d }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      e.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: p }),
          e.jsx(u, { className: "size-4 text-muted-foreground" }),
        ],
      }),
      e.jsx("h3", {
        className: `text-3xl font-bold mt-2 ${d === "brand" ? "text-brand" : "text-foreground"}`,
        children: x,
      }),
      r && e.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: r }),
    ],
  });
}
function ue({ onClose: u, onCreated: p }) {
  const x = se(ae),
    [r, d] = c.useState(1),
    [y, N] = c.useState(!1),
    [s, v] = c.useState({
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
    }),
    l = (t, m) => v((b) => ({ ...b, [t]: m })),
    k = async (t) => {
      (t.preventDefault(), N(!0));
      try {
        (await x({
          data: {
            school: {
              name: s.name.trim(),
              code: s.code.trim(),
              address: s.address || void 0,
              email: s.email || null,
              phone: s.phone || null,
              logo_url: s.logo_url || null,
              plan: s.plan,
              billing_cycle: s.billing_cycle,
              student_limit: Number(s.student_limit),
              teacher_limit: Number(s.teacher_limit),
              monthly_amount: Number(s.monthly_amount),
            },
            admin: {
              full_name: s.admin_name.trim(),
              email: s.admin_email.trim(),
              password: s.admin_password,
            },
          },
        }),
          j.success(`Created "${s.name}"`),
          p());
      } catch (m) {
        const b =
          typeof m == "object" && m !== null && "message" in m ? String(m.message) : String(m);
        j.error(b || "Failed to create school");
      } finally {
        N(!1);
      }
    };
  return e.jsx("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
    children: e.jsxs("form", {
      onSubmit: k,
      className:
        "bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden",
      children: [
        e.jsxs("header", {
          className: "px-6 py-4 border-b border-border flex items-center justify-between",
          children: [
            e.jsxs("div", {
              children: [
                e.jsxs("p", {
                  className: "text-xs uppercase tracking-wider text-muted-foreground",
                  children: ["Step ", r, " of 3"],
                }),
                e.jsx("h2", {
                  className: "text-lg font-semibold",
                  children: r === 1 ? "School details" : r === 2 ? "School admin" : "Plan & limits",
                }),
              ],
            }),
            e.jsx("button", {
              type: "button",
              onClick: u,
              className: "p-1 hover:bg-muted rounded",
              children: e.jsx(ne, { className: "size-4" }),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "p-6 space-y-4",
          children: [
            r === 1 &&
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                  e.jsx(n, {
                    label: "School name",
                    required: !0,
                    children: e.jsx("input", {
                      required: !0,
                      value: s.name,
                      onChange: (t) => l("name", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "School code",
                    required: !0,
                    children: e.jsx("input", {
                      required: !0,
                      value: s.code,
                      onChange: (t) => l("code", t.target.value.toUpperCase()),
                      placeholder: "HEZO-001",
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Address",
                    className: "col-span-2",
                    children: e.jsx("input", {
                      value: s.address,
                      onChange: (t) => l("address", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Email",
                    children: e.jsx("input", {
                      type: "email",
                      value: s.email,
                      onChange: (t) => l("email", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Phone",
                    children: e.jsx("input", {
                      value: s.phone,
                      onChange: (t) => l("phone", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Logo URL",
                    className: "col-span-2",
                    children: e.jsx("input", {
                      type: "url",
                      value: s.logo_url,
                      onChange: (t) => l("logo_url", t.target.value),
                      className: o,
                    }),
                  }),
                ],
              }),
            r === 2 &&
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-4",
                children: [
                  e.jsx(n, {
                    label: "Admin name",
                    required: !0,
                    className: "col-span-2",
                    children: e.jsx("input", {
                      required: !0,
                      value: s.admin_name,
                      onChange: (t) => l("admin_name", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Admin email",
                    required: !0,
                    children: e.jsx("input", {
                      required: !0,
                      type: "email",
                      value: s.admin_email,
                      onChange: (t) => l("admin_email", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Temporary password",
                    required: !0,
                    children: e.jsx("input", {
                      required: !0,
                      type: "text",
                      minLength: 8,
                      value: s.admin_password,
                      onChange: (t) => l("admin_password", t.target.value),
                      className: o,
                    }),
                  }),
                  e.jsx("p", {
                    className: "col-span-2 text-xs text-muted-foreground",
                    children:
                      "The admin will receive these credentials from you and can change the password after signing in.",
                  }),
                ],
              }),
            r === 3 &&
              e.jsxs("div", {
                className: "grid grid-cols-3 gap-4",
                children: [
                  e.jsx(n, {
                    label: "Plan",
                    className: "col-span-3",
                    children: e.jsx("div", {
                      className: "grid grid-cols-3 gap-2",
                      children: ["starter", "professional", "enterprise"].map((t) =>
                        e.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => l("plan", t),
                            className: `px-3 py-3 rounded-lg border text-sm font-medium capitalize ${s.plan === t ? "border-brand bg-brand-soft text-brand" : "border-border hover:bg-muted"}`,
                            children: t,
                          },
                          t,
                        ),
                      ),
                    }),
                  }),
                  e.jsx(n, {
                    label: "Billing Cycle",
                    className: "col-span-3",
                    children: e.jsx("div", {
                      className: "grid grid-cols-3 gap-2",
                      children: ["monthly", "quarterly", "yearly"].map((t) =>
                        e.jsx(
                          "button",
                          {
                            type: "button",
                            onClick: () => l("billing_cycle", t),
                            className: `px-3 py-2 rounded-lg border text-sm font-medium capitalize ${s.billing_cycle === t ? "border-primary bg-primary/10 text-primary" : "border-border hover:bg-muted"}`,
                            children: t,
                          },
                          t,
                        ),
                      ),
                    }),
                  }),
                  e.jsx(n, {
                    label: "Student limit",
                    children: e.jsx("input", {
                      type: "number",
                      min: 10,
                      value: s.student_limit,
                      onChange: (t) => l("student_limit", Number(t.target.value)),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Teacher limit",
                    children: e.jsx("input", {
                      type: "number",
                      min: 1,
                      value: s.teacher_limit,
                      onChange: (t) => l("teacher_limit", Number(t.target.value)),
                      className: o,
                    }),
                  }),
                  e.jsx(n, {
                    label: "Base fee (USD)",
                    children: e.jsx("input", {
                      type: "number",
                      min: 0,
                      step: "0.01",
                      value: s.monthly_amount,
                      onChange: (t) => l("monthly_amount", Number(t.target.value)),
                      className: o,
                    }),
                  }),
                ],
              }),
          ],
        }),
        e.jsxs("footer", {
          className:
            "px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between",
          children: [
            e.jsx("button", {
              type: "button",
              onClick: () => (r === 1 ? u() : d(r - 1)),
              className: "text-sm px-3 py-1.5 border border-border rounded-md hover:bg-muted",
              children: r === 1 ? "Cancel" : "Back",
            }),
            r < 3
              ? e.jsxs("button", {
                  type: "button",
                  onClick: () => d(r + 1),
                  disabled:
                    (r === 1 && (!s.name.trim() || !s.code.trim())) ||
                    (r === 2 &&
                      (!s.admin_name.trim() ||
                        !s.admin_email.trim() ||
                        s.admin_password.length < 8)),
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50",
                  children: ["Next ", e.jsx(R, { className: "size-4" })],
                })
              : e.jsx("button", {
                  type: "submit",
                  disabled: y,
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                  children: y ? "Creating…" : "Create school",
                }),
          ],
        }),
      ],
    }),
  });
}
const o =
  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring";
function n({ label: u, required: p, children: x, className: r = "" }) {
  return e.jsxs("label", {
    className: `block ${r}`,
    children: [
      e.jsxs("span", {
        className: "text-xs font-medium",
        children: [u, " ", p && e.jsx("span", { className: "text-danger", children: "*" })],
      }),
      x,
    ],
  });
}
export { ve as component };
