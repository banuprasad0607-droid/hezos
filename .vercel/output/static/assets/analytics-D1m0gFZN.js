import {
  a0 as G,
  X as U,
  M as c,
  x as e,
  P as W,
  o as X,
  G as F,
  m as H,
} from "./index-DrqTZ7SR.js";
import {
  k as l,
  h,
  e as Y,
  C as v,
  X as N,
  Y as S,
  T as m,
  d as $,
  f as J,
  P as Q,
  c as V,
  L as Z,
  b as K,
  B as T,
} from "./vendor-charts-DECNlt_G.js";
import { W as ee } from "./wallet-CZbtwORR.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const L = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];
function ce() {
  const { currentSchoolId: a, loading: r } = G();
  U("Analytics");
  const [d, M] = l.useState([]),
    [k, P] = l.useState([]),
    [f, D] = l.useState([]),
    [w, E] = l.useState([]),
    [o, q] = l.useState({ students: 0, teachers: 0, attRate: 0, collected: 0 });
  return (
    l.useEffect(() => {
      a &&
        (async () => {
          const A = new Date(Date.now() - 2592e6).toISOString().slice(0, 10),
            i = new Date(Date.now() - 180 * 864e5).toISOString().slice(0, 10),
            [{ data: x }, { data: C }, { data: _ }, { data: I }, { data: se }] = await Promise.all([
              c.from("attendance").select("date, status").eq("school_id", a).gte("date", A),
              c.from("fee_payments").select("amount, paid_on").eq("school_id", a).gte("paid_on", i),
              c.from("students").select("id, class_id, classes(name)").eq("school_id", a),
              c.from("user_roles").select("user_id").eq("school_id", a).eq("role", "teacher"),
              c.from("classes").select("id, name").eq("school_id", a),
            ]),
            g = new Map();
          (x ?? []).forEach((s) => {
            const t = g.get(s.date) ?? { p: 0, t: 0 };
            ((t.t += 1), s.status === "present" && (t.p += 1), g.set(s.date, t));
          });
          const O = Array.from(g.entries())
            .sort(([s], [t]) => s.localeCompare(t))
            .map(([s, t]) => ({
              date: s.slice(5),
              rate: Math.round((t.p / t.t) * 100),
              total: t.t,
            }));
          M(O);
          const n = { present: 0, absent: 0, late: 0, half_day: 0 };
          ((x ?? []).forEach((s) => {
            n[s.status] = (n[s.status] ?? 0) + 1;
          }),
            D(
              [
                { name: "Present", value: n.present },
                { name: "Absent", value: n.absent },
                { name: "Late", value: n.late },
                { name: "Half day", value: n.half_day },
              ].filter((s) => s.value > 0),
            ));
          const b = new Map();
          ((C ?? []).forEach((s) => {
            const t = s.paid_on.slice(0, 7);
            b.set(t, (b.get(t) ?? 0) + Number(s.amount));
          }),
            P(
              Array.from(b.entries())
                .sort(([s], [t]) => s.localeCompare(t))
                .map(([s, t]) => ({ month: s, collected: t })),
            ));
          const y = new Map();
          ((_ ?? []).forEach((s) => {
            const z = (Array.isArray(s.classes) ? s.classes[0] : s.classes)?.name ?? "Unassigned";
            y.set(z, (y.get(z) ?? 0) + 1);
          }),
            E(Array.from(y.entries()).map(([s, t]) => ({ name: s, students: t }))));
          const R = x?.length ?? 0,
            B = (x ?? []).filter((s) => s.status === "present").length;
          q({
            students: _?.length ?? 0,
            teachers: I?.length ?? 0,
            attRate: R ? Math.round((B / R) * 100) : 0,
            collected: (C ?? []).reduce((s, t) => s + Number(t.amount), 0),
          });
        })();
    }, [a]),
    r
      ? r
        ? e.jsx("div", {
            className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
            children: e.jsxs("div", {
              className: "text-center space-y-4",
              children: [
                e.jsx("div", {
                  className:
                    "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
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
                  className:
                    "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
                }),
                e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }),
              ],
            }),
          })
      : e.jsxs(e.Fragment, {
          children: [
            e.jsx(W, { title: "Analytics", breadcrumb: "Insights" }),
            e.jsxs("div", {
              className: "flex-1 overflow-y-auto p-8 space-y-6",
              children: [
                e.jsxs("div", {
                  className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                  children: [
                    e.jsx(u, {
                      icon: e.jsx(X, { className: "size-4" }),
                      label: "Students",
                      value: String(o.students),
                    }),
                    e.jsx(u, {
                      icon: e.jsx(F, { className: "size-4" }),
                      label: "Teachers",
                      value: String(o.teachers),
                    }),
                    e.jsx(u, {
                      icon: e.jsx(H, { className: "size-4" }),
                      label: "Attendance (30d)",
                      value: `${o.attRate}%`,
                    }),
                    e.jsx(u, {
                      icon: e.jsx(ee, { className: "size-4" }),
                      label: "Collected (180d)",
                      value: `₹${o.collected.toFixed(0)}`,
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                  children: [
                    e.jsx(j, {
                      title: "Attendance rate — last 30 days",
                      children:
                        d.length === 0
                          ? e.jsx(p, {})
                          : e.jsx(h, {
                              width: "100%",
                              height: 260,
                              children: e.jsxs(Y, {
                                data: d,
                                children: [
                                  e.jsx(v, {
                                    strokeDasharray: "3 3",
                                    stroke: "hsl(var(--border))",
                                  }),
                                  e.jsx(N, { dataKey: "date", tick: { fontSize: 11 } }),
                                  e.jsx(S, { domain: [0, 100], tick: { fontSize: 11 } }),
                                  e.jsx(m, {}),
                                  e.jsx($, {
                                    type: "monotone",
                                    dataKey: "rate",
                                    stroke: "hsl(var(--brand))",
                                    strokeWidth: 2,
                                    dot: !1,
                                  }),
                                ],
                              }),
                            }),
                    }),
                    e.jsx(j, {
                      title: "Attendance breakdown (30d)",
                      children:
                        f.length === 0
                          ? e.jsx(p, {})
                          : e.jsx(h, {
                              width: "100%",
                              height: 260,
                              children: e.jsxs(J, {
                                children: [
                                  e.jsx(Q, {
                                    data: f,
                                    dataKey: "value",
                                    nameKey: "name",
                                    cx: "50%",
                                    cy: "50%",
                                    outerRadius: 90,
                                    label: !0,
                                    children: f.map((A, i) =>
                                      e.jsx(V, { fill: L[i % L.length] }, i),
                                    ),
                                  }),
                                  e.jsx(Z, {}),
                                  e.jsx(m, {}),
                                ],
                              }),
                            }),
                    }),
                    e.jsx(j, {
                      title: "Revenue collected — last 6 months",
                      children:
                        k.length === 0
                          ? e.jsx(p, {})
                          : e.jsx(h, {
                              width: "100%",
                              height: 260,
                              children: e.jsxs(K, {
                                data: k,
                                children: [
                                  e.jsx(v, {
                                    strokeDasharray: "3 3",
                                    stroke: "hsl(var(--border))",
                                  }),
                                  e.jsx(N, { dataKey: "month", tick: { fontSize: 11 } }),
                                  e.jsx(S, { tick: { fontSize: 11 } }),
                                  e.jsx(m, {}),
                                  e.jsx(T, {
                                    dataKey: "collected",
                                    fill: "hsl(var(--brand))",
                                    radius: [4, 4, 0, 0],
                                  }),
                                ],
                              }),
                            }),
                    }),
                    e.jsx(j, {
                      title: "Class strength",
                      children:
                        w.length === 0
                          ? e.jsx(p, {})
                          : e.jsx(h, {
                              width: "100%",
                              height: 260,
                              children: e.jsxs(K, {
                                data: w,
                                layout: "vertical",
                                children: [
                                  e.jsx(v, {
                                    strokeDasharray: "3 3",
                                    stroke: "hsl(var(--border))",
                                  }),
                                  e.jsx(N, { type: "number", tick: { fontSize: 11 } }),
                                  e.jsx(S, {
                                    dataKey: "name",
                                    type: "category",
                                    tick: { fontSize: 11 },
                                    width: 100,
                                  }),
                                  e.jsx(m, {}),
                                  e.jsx(T, {
                                    dataKey: "students",
                                    fill: "#3b82f6",
                                    radius: [0, 4, 4, 0],
                                  }),
                                ],
                              }),
                            }),
                    }),
                  ],
                }),
              ],
            }),
          ],
        })
  );
}
function u({ icon: a, label: r, value: d }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-2 text-muted-foreground",
        children: [
          e.jsx("span", { children: a }),
          e.jsx("span", { className: "text-xs uppercase tracking-wider", children: r }),
        ],
      }),
      e.jsx("p", { className: "text-2xl font-bold mt-2", children: d }),
    ],
  });
}
function j({ title: a, children: r }) {
  return e.jsxs("section", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [e.jsx("h3", { className: "font-semibold mb-3", children: a }), r],
  });
}
function p() {
  return e.jsx("p", {
    className: "text-sm text-muted-foreground py-12 text-center",
    children: "Not enough data yet.",
  });
}
export { ce as component };
