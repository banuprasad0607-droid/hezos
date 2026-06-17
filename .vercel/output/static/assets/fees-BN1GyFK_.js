import {
  r as re,
  a0 as he,
  X as pe,
  x as e,
  P as ae,
  b as be,
  m as ge,
  C as je,
  M as N,
  N as u,
  d as ie,
  S as le,
  e as ce,
} from "./index-DrqTZ7SR.js";
import { k as n } from "./vendor-charts-DECNlt_G.js";
import { e as ve, a as Ne, b as ye } from "./export-helper-D-BWKL3x.js";
import { w as oe } from "./whatsapp-service-BVS3HosY.js";
import { F as ue } from "./file-text-DPnrzn5L.js";
import { X as _e } from "./x-DH-xwxwM.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const we = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
    ["path", { d: "M12 18V6", key: "zqpxq5" }],
  ],
  Se = re("circle-dollar-sign", we);
const Ce = [
    [
      "path",
      {
        d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",
        key: "zw3jo",
      },
    ],
    [
      "path",
      {
        d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",
        key: "1wduqc",
      },
    ],
    [
      "path",
      {
        d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",
        key: "kqbvx6",
      },
    ],
  ],
  ke = re("layers", Ce);
const qe = [
    [
      "path",
      {
        d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",
        key: "q3az6g",
      },
    ],
    ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8", key: "1h4pet" }],
    ["path", { d: "M12 17.5v-11", key: "1jc1ny" }],
  ],
  ne = re("receipt", qe);
function Qe() {
  const { currentSchoolId: r, currentSchool: a, roles: m, user: b, loading: h } = he(),
    q = m.includes("admin") || m.includes("super_admin");
  pe("Fees");
  const c = a?.name ?? "School",
    [g, I] = n.useState("overview"),
    [z, V] = n.useState([]),
    [E, Q] = n.useState([]),
    [R, O] = n.useState([]),
    [C, L] = n.useState([]),
    [M, o] = n.useState(!0),
    i = async () => {
      if (r) {
        o(!0);
        try {
          const [l, w, y, F] = await Promise.all([
            N.from("classes")
              .select("id, name")
              .eq("school_id", r)
              .is("deleted_at", null)
              .order("name"),
            N.from("students")
              .select("id, full_name, class_id, parent_user_id, emergency_contact")
              .eq("school_id", r)
              .is("deleted_at", null)
              .order("full_name"),
            N.from("fee_structures")
              .select("*")
              .eq("school_id", r)
              .order("created_at", { ascending: !1 }),
            N.from("fee_invoices")
              .select("amount_due, amount_paid, status, due_date")
              .eq("school_id", r)
              .is("deleted_at", null),
          ]);
          (V(l.data ?? []), Q(w.data ?? []), O(y.data ?? []), L(F.data ?? []));
        } catch (l) {
          u.error(l.message || "Failed to load fee configuration.");
        } finally {
          o(!1);
        }
      }
    };
  n.useEffect(() => {
    i();
  }, [r]);
  const P = n.useMemo(() => {
      const l = C.reduce((S, D) => S + Number(D.amount_due), 0),
        w = C.reduce((S, D) => S + Number(D.amount_paid), 0),
        y = l - w,
        F = C.filter(
          (S) => S.status !== "paid" && S.due_date && new Date(S.due_date) < new Date(),
        ).length;
      return { billed: l, collected: w, outstanding: y, overdue: F };
    }, [C]),
    $ = (l) => E.find((w) => w.id === l)?.full_name ?? "—",
    X = (l) => (l ? (z.find((w) => w.id === l)?.name ?? "—") : "All classes");
  return q
    ? e.jsxs(e.Fragment, {
        children: [
          e.jsx(ae, { title: "Fees", breadcrumb: "Finance" }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
            children: [
              e.jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                children: [
                  e.jsx(te, { icon: Se, label: "Billed", value: p(P.billed) }),
                  e.jsx(te, {
                    icon: be,
                    label: "Collected",
                    value: p(P.collected),
                    tone: "success",
                  }),
                  e.jsx(te, {
                    icon: ge,
                    label: "Outstanding",
                    value: p(P.outstanding),
                    tone: "brand",
                  }),
                  e.jsx(te, {
                    icon: je,
                    label: "Overdue invoices",
                    value: String(P.overdue),
                    tone: "danger",
                  }),
                ],
              }),
              e.jsx("div", {
                className: "border-b border-border flex gap-1 overflow-x-auto",
                children: ["overview", "structures", "invoices", "payments"].map((l) =>
                  e.jsx(
                    "button",
                    {
                      onClick: () => I(l),
                      className: `px-4 py-2 text-sm font-semibold border-b-2 -mb-px capitalize transition cursor-pointer ${g === l ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                      children: l,
                    },
                    l,
                  ),
                ),
              }),
              M
                ? e.jsx("div", {
                    className: "p-12 text-sm text-muted-foreground text-center",
                    children: "Syncing dashboard statistics...",
                  })
                : g === "overview"
                  ? e.jsx(Pe, { schoolId: r, studentName: $ })
                  : g === "structures"
                    ? e.jsx(Fe, { schoolId: r, classes: z, structures: R, onChanged: i })
                    : g === "invoices"
                      ? e.jsx(De, {
                          schoolId: r,
                          classes: z,
                          students: E,
                          structures: R,
                          studentName: $,
                          className: X,
                          onChanged: i,
                        })
                      : e.jsx(Te, {
                          schoolId: r,
                          userId: b.id,
                          studentName: $,
                          schoolName: c,
                          onChanged: i,
                        }),
            ],
          }),
        ],
      })
    : h
      ? h
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
            e.jsx(ae, { title: "Fees", breadcrumb: "Restricted" }),
            e.jsx("div", {
              className: "p-8 text-sm text-muted-foreground bg-background text-foreground",
              children: "Admin access required.",
            }),
          ],
        });
}
function Pe({ schoolId: r, studentName: a }) {
  const [m, b] = n.useState([]),
    [h, q] = n.useState([]);
  return (
    n.useEffect(() => {
      (async () => {
        const [g, I] = await Promise.all([
          N.from("fee_invoices")
            .select("*")
            .eq("school_id", r)
            .is("deleted_at", null)
            .order("created_at", { ascending: !1 })
            .limit(8),
          N.from("fee_payments")
            .select("*, fee_invoices(student_id)")
            .eq("school_id", r)
            .is("deleted_at", null)
            .order("created_at", { ascending: !1 })
            .limit(8),
        ]);
        (b(g.data ?? []), q(I.data ?? []));
      })();
    }, [r]),
    e.jsxs("div", {
      className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
      children: [
        e.jsx(de, {
          title: "Recent invoices",
          icon: ue,
          children:
            m.length === 0
              ? e.jsx(J, { text: "No invoices yet." })
              : e.jsx("ul", {
                  className: "divide-y divide-border",
                  children: m.map((c) =>
                    e.jsxs(
                      "li",
                      {
                        className:
                          "px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors",
                        children: [
                          e.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              e.jsx("p", {
                                className: "text-sm font-medium truncate text-foreground",
                                children: c.title,
                              }),
                              e.jsxs("p", {
                                className: "text-xs text-muted-foreground",
                                children: [a(c.student_id), " · ", c.period],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "text-right",
                            children: [
                              e.jsx("p", {
                                className: "text-sm font-semibold text-foreground",
                                children: p(Number(c.amount_due)),
                              }),
                              e.jsx(me, { status: c.status }),
                            ],
                          }),
                        ],
                      },
                      c.id,
                    ),
                  ),
                }),
        }),
        e.jsx(de, {
          title: "Recent payments",
          icon: ne,
          children:
            h.length === 0
              ? e.jsx(J, { text: "No payments yet." })
              : e.jsx("ul", {
                  className: "divide-y divide-border",
                  children: h.map((c) => {
                    const g = c.fee_invoices?.student_id || "";
                    return e.jsxs(
                      "li",
                      {
                        className:
                          "px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors",
                        children: [
                          e.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              e.jsx("p", {
                                className: "text-sm font-medium truncate text-foreground",
                                children: g ? a(g) : "—",
                              }),
                              e.jsxs("p", {
                                className: "text-xs text-muted-foreground",
                                children: [c.method.toUpperCase(), " · ", c.paid_on],
                              }),
                            ],
                          }),
                          e.jsxs("p", {
                            className: "text-sm font-semibold text-success",
                            children: ["+", p(Number(c.amount))],
                          }),
                        ],
                      },
                      c.id,
                    );
                  }),
                }),
        }),
      ],
    })
  );
}
function Fe({ schoolId: r, classes: a, structures: m, onChanged: b }) {
  const [h, q] = n.useState(""),
    [c, g] = n.useState("tuition"),
    [I, z] = n.useState(""),
    [V, E] = n.useState("monthly"),
    [Q, R] = n.useState(""),
    [O, C] = n.useState(!1),
    L = async (o) => {
      o.preventDefault();
      const i = Number(I);
      if (!h.trim() || !i) return;
      C(!0);
      const { error: P } = await N.from("fee_structures").insert({
        school_id: r,
        name: h.trim(),
        category: c,
        amount: i,
        frequency: V,
        class_id: Q || null,
      });
      if ((C(!1), P)) return u.error(P.message);
      (u.success("Fee structure added"), q(""), z(""), b());
    },
    M = async (o) => {
      if (!confirm("Delete this fee structure?")) return;
      const { error: i } = await N.from("fee_structures").delete().eq("id", o).eq("school_id", r);
      if (i) return u.error(i.message);
      (u.success("Deleted"), b());
    };
  return e.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6",
    children: [
      e.jsxs("form", {
        onSubmit: L,
        className:
          "bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              e.jsx(ke, { className: "size-4 text-brand" }),
              e.jsx("h2", {
                className: "text-sm font-semibold text-foreground",
                children: "New fee structure",
              }),
            ],
          }),
          e.jsx(A, {
            label: "Name",
            children: e.jsx("input", {
              value: h,
              onChange: (o) => q(o.target.value),
              placeholder: "Monthly Tuition",
              className: T,
              required: !0,
            }),
          }),
          e.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              e.jsx(A, {
                label: "Category",
                children: e.jsxs("select", {
                  value: c,
                  onChange: (o) => g(o.target.value),
                  className: T,
                  children: [
                    e.jsx("option", { value: "tuition", children: "Tuition" }),
                    e.jsx("option", { value: "transport", children: "Transport" }),
                    e.jsx("option", { value: "exam", children: "Exam" }),
                    e.jsx("option", { value: "other", children: "Other" }),
                  ],
                }),
              }),
              e.jsx(A, {
                label: "Frequency",
                children: e.jsxs("select", {
                  value: V,
                  onChange: (o) => E(o.target.value),
                  className: T,
                  children: [
                    e.jsx("option", { value: "monthly", children: "Monthly" }),
                    e.jsx("option", { value: "quarterly", children: "Quarterly" }),
                    e.jsx("option", { value: "yearly", children: "Yearly" }),
                    e.jsx("option", { value: "one_time", children: "One time" }),
                  ],
                }),
              }),
            ],
          }),
          e.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              e.jsx(A, {
                label: "Amount",
                children: e.jsx("input", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: I,
                  onChange: (o) => z(o.target.value),
                  className: T,
                  required: !0,
                }),
              }),
              e.jsx(A, {
                label: "Class (optional)",
                children: e.jsxs("select", {
                  value: Q,
                  onChange: (o) => R(o.target.value),
                  className: T,
                  children: [
                    e.jsx("option", { value: "", children: "All classes" }),
                    a.map((o) => e.jsx("option", { value: o.id, children: o.name }, o.id)),
                  ],
                }),
              }),
            ],
          }),
          e.jsxs("button", {
            disabled: O,
            className:
              "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [e.jsx(ie, { className: "size-4" }), O ? "Adding…" : "Add structure"],
          }),
        ],
      }),
      e.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          e.jsx("div", {
            className: "px-5 py-3 border-b border-border",
            children: e.jsx("h2", {
              className: "text-sm font-semibold text-foreground",
              children: "Fee structures",
            }),
          }),
          m.length === 0
            ? e.jsx(J, { text: "No fee structures yet." })
            : e.jsxs("table", {
                className: "w-full text-sm",
                children: [
                  e.jsx("thead", {
                    className: "bg-secondary/40 text-xs text-muted-foreground",
                    children: e.jsxs("tr", {
                      children: [
                        e.jsx(x, { children: "Name" }),
                        e.jsx(x, { children: "Class" }),
                        e.jsx(x, { children: "Category" }),
                        e.jsx(x, { children: "Frequency" }),
                        e.jsx(x, { className: "text-right", children: "Amount" }),
                        e.jsx(x, {}),
                      ],
                    }),
                  }),
                  e.jsx("tbody", {
                    children: m.map((o) =>
                      e.jsxs(
                        "tr",
                        {
                          className:
                            "border-t border-border hover:bg-secondary/20 transition-colors",
                          children: [
                            e.jsx(f, {
                              className: "font-medium text-foreground",
                              children: o.name,
                            }),
                            e.jsx(f, {
                              className: "text-muted-foreground",
                              children: o.class_id
                                ? (a.find((i) => i.id === o.class_id)?.name ?? "—")
                                : "All classes",
                            }),
                            e.jsx(f, {
                              className: "capitalize text-muted-foreground",
                              children: o.category,
                            }),
                            e.jsx(f, {
                              className: "capitalize text-muted-foreground",
                              children: o.frequency.replace("_", " "),
                            }),
                            e.jsx(f, {
                              className: "text-right font-semibold text-foreground",
                              children: p(Number(o.amount)),
                            }),
                            e.jsx(f, {
                              className: "text-right",
                              children: e.jsx("button", {
                                onClick: () => M(o.id),
                                className: "text-xs text-danger hover:underline cursor-pointer",
                                children: "Delete",
                              }),
                            }),
                          ],
                        },
                        o.id,
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
function De({
  schoolId: r,
  classes: a,
  students: m,
  structures: b,
  studentName: h,
  className: q,
  onChanged: c,
}) {
  const [g, I] = n.useState(""),
    [z, V] = n.useState(() => new Date().toISOString().slice(0, 7)),
    [E, Q] = n.useState(""),
    [R, O] = n.useState(""),
    [C, L] = n.useState(!1),
    [M, o] = n.useState("all"),
    [i, P] = n.useState(""),
    [$, X] = n.useState(""),
    [l, w] = n.useState(0),
    [y] = n.useState(10),
    [F, S] = n.useState(0),
    [D, se] = n.useState([]),
    [K, Y] = n.useState(!1);
  n.useEffect(() => {
    const s = setTimeout(() => {
      (X(i), w(0));
    }, 400);
    return () => clearTimeout(s);
  }, [i]);
  const W = async () => {
    if (r) {
      Y(!0);
      try {
        let s = N.from("fee_invoices")
          .select("*, students!inner(full_name, class_id)", { count: "exact" })
          .eq("school_id", r)
          .is("deleted_at", null);
        M !== "all" && (s = s.eq("status", M));
        const t = R;
        (t && (s = s.eq("students.class_id", t)),
          $.trim() && (s = s.ilike("students.full_name", `%${$.trim()}%`)));
        const d = l * y,
          j = d + y - 1,
          {
            data: k,
            count: v,
            error: _,
          } = await s.order("created_at", { ascending: !1 }).range(d, j);
        if (_) throw _;
        (se(
          (k ?? []).map((B) => ({
            ...B,
            students: Array.isArray(B.students) ? (B.students[0] ?? null) : B.students,
          })),
        ),
          S(v ?? 0));
      } catch (s) {
        u.error(s.message || "Failed to load invoices.");
      } finally {
        Y(!1);
      }
    }
  };
  n.useEffect(() => {
    W();
  }, [r, $, l, M, R]);
  const Z = async (s) => {
      s.preventDefault();
      const t = b.find((_) => _.id === g);
      if (!t) return u.error("Pick a fee structure");
      const d = R || t.class_id,
        j = m.filter((_) => (d ? _.class_id === d : !0));
      if (j.length === 0) return u.error("No students match");
      L(!0);
      const k = j.map((_) => ({
          school_id: r,
          student_id: _.id,
          fee_structure_id: t.id,
          title: t.name,
          period: z,
          amount_due: t.amount,
          amount_paid: 0,
          status: "pending",
          due_date: E || null,
        })),
        { error: v } = await N.from("fee_invoices").insert(k);
      if ((L(!1), v)) return u.error(v.message);
      (u.success(`Generated ${k.length} invoice${k.length === 1 ? "" : "s"}`),
        (async () => {
          try {
            const B = (await oe.getTemplates(r)).find((H) => H.name === "fee_due_reminder");
            if (B) {
              for (const H of j) {
                const xe = H.emergency_contact || "+91 90000 00000",
                  fe = `₹${t.amount}`;
                await oe.sendTemplateMessage(
                  r,
                  xe,
                  B.id,
                  [fe, H.full_name, E || "June 30, 2026", "http://localhost:8080/parent?pay=true"],
                  H.id,
                  H.parent_user_id,
                );
              }
              u.success("WhatsApp fee reminders dispatched to parents.");
            }
          } catch (_) {
            console.error("WhatsApp fee reminder broadcast failed:", _);
          }
        })(),
        W(),
        c());
    },
    ee = async (s) => {
      if (!confirm("Delete this invoice? This will move it to the Recycle Bin.")) return;
      const { error: t } = await N.from("fee_invoices")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", s)
        .eq("school_id", r);
      if (t) return u.error(t.message);
      (await N.from("fee_payments")
        .update({ deleted_at: new Date().toISOString() })
        .eq("invoice_id", s)
        .eq("school_id", r),
        u.success("Invoice moved to Recycle Bin."),
        W(),
        c());
    },
    G = async (s) => {
      u.info("Preparing data for download...");
      const { data: t, error: d } = await N.from("fee_invoices")
        .select("title, period, amount_due, amount_paid, status, due_date, students(full_name)")
        .eq("school_id", r)
        .is("deleted_at", null);
      if (d || !t) return u.error("Export query failed.");
      const j = ["Student", "Title", "Period", "Due Date", "Amount Due", "Amount Paid", "Status"],
        k = t.map((v) => [
          v.students?.full_name || "—",
          v.title,
          v.period,
          v.due_date || "—",
          v.amount_due,
          v.amount_paid,
          v.status,
        ]);
      (s === "csv"
        ? ve("Fee_Invoices", j, k)
        : s === "excel"
          ? Ne("Fee_Invoices", j, k)
          : s === "pdf" && ye("Fee_Invoices", "Fee Invoices Roster", j, k),
        u.success("Export started!"));
    };
  return e.jsxs("div", {
    className: "space-y-6",
    children: [
      e.jsxs("form", {
        onSubmit: Z,
        className:
          "bg-card border border-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end text-card-foreground shadow-xs",
        children: [
          e.jsx(A, {
            label: "Fee structure",
            children: e.jsxs("select", {
              value: g,
              onChange: (s) => I(s.target.value),
              className: T,
              required: !0,
              children: [
                e.jsx("option", { value: "", children: "— select —" }),
                b.map((s) =>
                  e.jsxs(
                    "option",
                    { value: s.id, children: [s.name, " (", p(Number(s.amount)), ")"] },
                    s.id,
                  ),
                ),
              ],
            }),
          }),
          e.jsx(A, {
            label: "Period",
            children: e.jsx("input", {
              type: "month",
              value: z,
              onChange: (s) => V(s.target.value),
              className: T,
              required: !0,
            }),
          }),
          e.jsx(A, {
            label: "Due date",
            children: e.jsx("input", {
              type: "date",
              value: E,
              onChange: (s) => Q(s.target.value),
              className: T,
            }),
          }),
          e.jsx(A, {
            label: "Class (override)",
            children: e.jsxs("select", {
              value: R,
              onChange: (s) => O(s.target.value),
              className: T,
              children: [
                e.jsx("option", { value: "", children: "From structure" }),
                a.map((s) => e.jsx("option", { value: s.id, children: s.name }, s.id)),
              ],
            }),
          }),
          e.jsxs("button", {
            disabled: C,
            className:
              "py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [e.jsx(ue, { className: "size-4" }), C ? "Generating…" : "Generate invoices"],
          }),
        ],
      }),
      e.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          e.jsxs("div", {
            className:
              "px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-secondary/10",
            children: [
              e.jsxs("h2", {
                className: "text-sm font-semibold text-foreground",
                children: ["Invoices (", F, ")"],
              }),
              e.jsxs("div", {
                className: "flex gap-2 items-center flex-wrap",
                children: [
                  e.jsxs("div", {
                    className: "relative w-44",
                    children: [
                      e.jsx(le, {
                        className:
                          "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                      }),
                      e.jsx("input", {
                        value: i,
                        onChange: (s) => P(s.target.value),
                        placeholder: "Search Student...",
                        className:
                          "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                      }),
                    ],
                  }),
                  e.jsxs("select", {
                    value: M,
                    onChange: (s) => {
                      (o(s.target.value), w(0));
                    },
                    className:
                      "text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground outline-none",
                    children: [
                      e.jsx("option", { value: "all", children: "All statuses" }),
                      e.jsx("option", { value: "pending", children: "Pending" }),
                      e.jsx("option", { value: "partial", children: "Partial" }),
                      e.jsx("option", { value: "paid", children: "Paid" }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                    children: [
                      e.jsx("button", {
                        onClick: () => G("csv"),
                        className:
                          "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors",
                        children: "CSV",
                      }),
                      e.jsx("button", {
                        onClick: () => G("excel"),
                        className:
                          "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors",
                        children: "XLS",
                      }),
                      e.jsx("button", {
                        onClick: () => G("pdf"),
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
          K && D.length === 0
            ? e.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading invoices...",
              })
            : D.length === 0
              ? e.jsx(J, { text: "No invoices match." })
              : e.jsx("div", {
                  className: "overflow-x-auto",
                  children: e.jsxs("table", {
                    className: "w-full text-sm",
                    children: [
                      e.jsx("thead", {
                        className: "bg-secondary/40 text-xs text-muted-foreground",
                        children: e.jsxs("tr", {
                          children: [
                            e.jsx(x, { children: "Student" }),
                            e.jsx(x, { children: "Title" }),
                            e.jsx(x, { children: "Period" }),
                            e.jsx(x, { children: "Due" }),
                            e.jsx(x, { className: "text-right", children: "Due amt" }),
                            e.jsx(x, { className: "text-right", children: "Paid" }),
                            e.jsx(x, { children: "Status" }),
                            e.jsx(x, {}),
                          ],
                        }),
                      }),
                      e.jsx("tbody", {
                        children: D.map((s) => {
                          const t = Number(s.amount_due) - Number(s.amount_paid),
                            d =
                              s.status !== "paid" &&
                              s.due_date &&
                              new Date(s.due_date) < new Date(),
                            j = s.students?.full_name || h(s.student_id);
                          return e.jsxs(
                            "tr",
                            {
                              className:
                                "border-t border-border hover:bg-secondary/20 transition-colors",
                              children: [
                                e.jsx(f, { className: "font-medium text-foreground", children: j }),
                                e.jsx(f, { className: "text-foreground", children: s.title }),
                                e.jsx(f, {
                                  className: "text-muted-foreground",
                                  children: s.period,
                                }),
                                e.jsx(f, {
                                  className: d
                                    ? "text-danger font-medium"
                                    : "text-muted-foreground",
                                  children: s.due_date ?? "—",
                                }),
                                e.jsx(f, {
                                  className: "text-right text-foreground",
                                  children: p(Number(s.amount_due)),
                                }),
                                e.jsxs(f, {
                                  className: "text-right text-foreground",
                                  children: [
                                    p(Number(s.amount_paid)),
                                    t > 0 &&
                                      e.jsxs("span", {
                                        className: "block text-[10px] text-muted-foreground",
                                        children: ["bal ", p(t)],
                                      }),
                                  ],
                                }),
                                e.jsx(f, { children: e.jsx(me, { status: s.status }) }),
                                e.jsx(f, {
                                  className: "text-right",
                                  children: e.jsx("button", {
                                    onClick: () => ee(s.id),
                                    className: "text-xs text-danger hover:underline cursor-pointer",
                                    children: "Delete",
                                  }),
                                }),
                              ],
                            },
                            s.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
          e.jsxs("div", {
            className:
              "flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground",
            children: [
              e.jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: [
                  "Showing ",
                  F > 0 ? l * y + 1 : 0,
                  " to ",
                  Math.min((l + 1) * y, F),
                  " of ",
                  F,
                  " invoices",
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-2",
                children: [
                  e.jsx("button", {
                    disabled: l === 0,
                    onClick: () => w((s) => s - 1),
                    className:
                      "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                    children: "Previous",
                  }),
                  e.jsx("button", {
                    disabled: (l + 1) * y >= F,
                    onClick: () => w((s) => s + 1),
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
function Te({ schoolId: r, userId: a, studentName: m, schoolName: b, onChanged: h }) {
  const [q, c] = n.useState(""),
    [g, I] = n.useState(""),
    [z, V] = n.useState("cash"),
    [E, Q] = n.useState(""),
    [R, O] = n.useState(!1),
    [C, L] = n.useState(null),
    [M, o] = n.useState([]),
    i = M.find((t) => t.id === q),
    P = i ? Number(i.amount_due) - Number(i.amount_paid) : 0,
    [$, X] = n.useState(""),
    [l, w] = n.useState(""),
    [y, F] = n.useState(0),
    [S] = n.useState(10),
    [D, se] = n.useState(0),
    [K, Y] = n.useState([]),
    [W, Z] = n.useState(!1);
  n.useEffect(() => {
    const t = setTimeout(() => {
      (w($), F(0));
    }, 400);
    return () => clearTimeout(t);
  }, [$]);
  const ee = async () => {
      const { data: t } = await N.from("fee_invoices")
        .select("*, students(full_name)")
        .eq("school_id", r)
        .is("deleted_at", null)
        .or("status.eq.pending,status.eq.partial");
      o(
        (t ?? []).map((d) => ({
          ...d,
          students: Array.isArray(d.students) ? (d.students[0] ?? null) : d.students,
        })),
      );
    },
    G = async () => {
      Z(!0);
      try {
        let t = N.from("fee_payments")
          .select("*, fee_invoices!inner(student_id, title, students!inner(full_name))", {
            count: "exact",
          })
          .eq("school_id", r)
          .is("deleted_at", null);
        l.trim() && (t = t.ilike("fee_invoices.students.full_name", `%${l.trim()}%`));
        const d = y * S,
          j = d + S - 1,
          {
            data: k,
            count: v,
            error: _,
          } = await t.order("created_at", { ascending: !1 }).range(d, j);
        if (_) throw _;
        (Y(k), se(v ?? 0));
      } catch (t) {
        u.error(t.message || "Failed to load payments.");
      } finally {
        Z(!1);
      }
    };
  n.useEffect(() => {
    (ee(), G());
  }, [r, l, y]);
  const s = async (t) => {
    if ((t.preventDefault(), !i)) return u.error("Pick an invoice");
    const d = Number(g);
    if (!d || d <= 0) return u.error("Enter a valid amount");
    if (d > P + 0.001) return u.error(`Amount exceeds balance of ${p(P)}`);
    O(!0);
    const { data: j, error: k } = await N.from("fee_payments")
      .insert({
        school_id: r,
        invoice_id: i.id,
        amount: d,
        method: z,
        reference: E.trim() || null,
        collected_by: a,
      })
      .select()
      .single();
    if (k) return (O(!1), u.error(k.message));
    const v = Number(i.amount_paid) + d,
      _ = v >= Number(i.amount_due) - 0.001 ? "paid" : "partial",
      { error: B } = await N.from("fee_invoices")
        .update({ amount_paid: v, status: _ })
        .eq("id", i.id);
    if ((O(!1), B)) return u.error(B.message);
    (u.success("Payment recorded"), I(""), Q(""), L(j), ee(), G(), h());
  };
  return e.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6",
    children: [
      e.jsxs("form", {
        onSubmit: s,
        className:
          "bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-2",
            children: [
              e.jsx(ne, { className: "size-4 text-brand" }),
              e.jsx("h2", {
                className: "text-sm font-semibold text-foreground",
                children: "Record payment",
              }),
            ],
          }),
          e.jsx(A, {
            label: "Invoice",
            children: e.jsxs("select", {
              value: q,
              onChange: (t) => {
                c(t.target.value);
                const d = M.find((j) => j.id === t.target.value);
                d && I(String(Number(d.amount_due) - Number(d.amount_paid)));
              },
              className: T,
              required: !0,
              children: [
                e.jsx("option", { value: "", children: "— select open invoice —" }),
                M.map((t) => {
                  const d = t.students?.full_name || m(t.student_id);
                  return e.jsxs(
                    "option",
                    {
                      value: t.id,
                      children: [
                        d,
                        " · ",
                        t.title,
                        " · bal",
                        " ",
                        p(Number(t.amount_due) - Number(t.amount_paid)),
                      ],
                    },
                    t.id,
                  );
                }),
              ],
            }),
          }),
          i &&
            e.jsxs("div", {
              className: "text-xs text-muted-foreground bg-secondary/35 rounded-md p-2",
              children: [
                "Due ",
                p(Number(i.amount_due)),
                " · Paid ",
                p(Number(i.amount_paid)),
                " ·",
                " ",
                e.jsxs("span", {
                  className: "font-semibold text-foreground",
                  children: ["Balance ", p(P)],
                }),
              ],
            }),
          e.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              e.jsx(A, {
                label: "Amount",
                children: e.jsx("input", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  value: g,
                  onChange: (t) => I(t.target.value),
                  className: T,
                  required: !0,
                }),
              }),
              e.jsx(A, {
                label: "Method",
                children: e.jsxs("select", {
                  value: z,
                  onChange: (t) => V(t.target.value),
                  className: T,
                  children: [
                    e.jsx("option", { value: "cash", children: "Cash" }),
                    e.jsx("option", { value: "upi", children: "UPI" }),
                    e.jsx("option", { value: "bank", children: "Bank" }),
                    e.jsx("option", { value: "card", children: "Card" }),
                    e.jsx("option", { value: "cheque", children: "Cheque" }),
                  ],
                }),
              }),
            ],
          }),
          e.jsx(A, {
            label: "Reference (optional)",
            children: e.jsx("input", {
              value: E,
              onChange: (t) => Q(t.target.value),
              placeholder: "Txn id / cheque #",
              className: T,
            }),
          }),
          e.jsxs("button", {
            disabled: R || !q,
            className:
              "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90",
            children: [e.jsx(ie, { className: "size-4" }), R ? "Saving…" : "Record payment"],
          }),
        ],
      }),
      e.jsxs("div", {
        className:
          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
        children: [
          e.jsxs("div", {
            className:
              "px-5 py-3 border-b border-border flex items-center justify-between bg-secondary/10 flex-wrap gap-2",
            children: [
              e.jsxs("h2", {
                className: "text-sm font-semibold text-foreground",
                children: ["Recent payments (", D, ")"],
              }),
              e.jsxs("div", {
                className: "relative w-44",
                children: [
                  e.jsx(le, {
                    className:
                      "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                  }),
                  e.jsx("input", {
                    value: $,
                    onChange: (t) => X(t.target.value),
                    placeholder: "Search Student...",
                    className:
                      "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                  }),
                ],
              }),
            ],
          }),
          W && K.length === 0
            ? e.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading payments...",
              })
            : K.length === 0
              ? e.jsx(J, { text: "No payments yet." })
              : e.jsx("div", {
                  className: "overflow-x-auto",
                  children: e.jsxs("table", {
                    className: "w-full text-sm",
                    children: [
                      e.jsx("thead", {
                        className: "bg-secondary/40 text-xs text-muted-foreground",
                        children: e.jsxs("tr", {
                          children: [
                            e.jsx(x, { children: "Date" }),
                            e.jsx(x, { children: "Student" }),
                            e.jsx(x, { children: "Method" }),
                            e.jsx(x, { children: "Reference" }),
                            e.jsx(x, { className: "text-right", children: "Amount" }),
                            e.jsx(x, {}),
                          ],
                        }),
                      }),
                      e.jsx("tbody", {
                        children: K.map((t) => {
                          const d =
                            t.fee_invoices?.students?.full_name ||
                            (t.fee_invoices ? m(t.fee_invoices.student_id) : "—");
                          return e.jsxs(
                            "tr",
                            {
                              className:
                                "border-t border-border hover:bg-secondary/20 transition-colors",
                              children: [
                                e.jsx(f, {
                                  className: "text-muted-foreground",
                                  children: t.paid_on,
                                }),
                                e.jsx(f, { className: "font-medium text-foreground", children: d }),
                                e.jsx(f, {
                                  className: "capitalize text-muted-foreground",
                                  children: t.method,
                                }),
                                e.jsx(f, {
                                  className: "text-muted-foreground",
                                  children: t.reference ?? "—",
                                }),
                                e.jsx(f, {
                                  className: "text-right font-semibold text-foreground",
                                  children: p(Number(t.amount)),
                                }),
                                e.jsx(f, {
                                  className: "text-right",
                                  children: e.jsxs("button", {
                                    onClick: () => L(t),
                                    className:
                                      "text-xs text-brand hover:underline inline-flex items-center gap-1 cursor-pointer",
                                    children: [e.jsx(ce, { className: "size-3" }), " Receipt"],
                                  }),
                                }),
                              ],
                            },
                            t.id,
                          );
                        }),
                      }),
                    ],
                  }),
                }),
          e.jsxs("div", {
            className:
              "flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground",
            children: [
              e.jsxs("p", {
                className: "text-xs text-muted-foreground",
                children: [
                  "Showing ",
                  D > 0 ? y * S + 1 : 0,
                  " to ",
                  Math.min((y + 1) * S, D),
                  " of ",
                  D,
                  " payments",
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-2",
                children: [
                  e.jsx("button", {
                    disabled: y === 0,
                    onClick: () => F((t) => t - 1),
                    className:
                      "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                    children: "Previous",
                  }),
                  e.jsx("button", {
                    disabled: (y + 1) * S >= D,
                    onClick: () => F((t) => t + 1),
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
      C &&
        e.jsx(Ae, {
          payment: C,
          invoice: C.fee_invoices,
          studentName: m,
          schoolName: b,
          onClose: () => L(null),
        }),
    ],
  });
}
function Ae({ payment: r, invoice: a, studentName: m, schoolName: b, onClose: h }) {
  const q = a?.students?.full_name || (a ? m(a.student_id) : "—");
  return e.jsx("div", {
    className:
      "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 print:bg-white print:p-0",
    children: e.jsxs("div", {
      className:
        "bg-card text-card-foreground rounded-xl w-full max-w-md shadow-xl print:shadow-none print:rounded-none",
      children: [
        e.jsxs("div", {
          className:
            "flex items-center justify-between px-5 py-3 border-b border-border print:hidden",
          children: [
            e.jsx("h3", { className: "font-semibold text-sm", children: "Payment receipt" }),
            e.jsx("button", {
              onClick: h,
              className: "text-muted-foreground hover:text-foreground cursor-pointer",
              children: e.jsx(_e, { className: "size-4" }),
            }),
          ],
        }),
        e.jsxs("div", {
          className: "p-6 space-y-3 text-sm",
          children: [
            e.jsxs("div", {
              className: "flex items-center justify-between",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("p", { className: "font-bold text-base text-foreground", children: b }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Official receipt",
                    }),
                  ],
                }),
                e.jsx(ne, { className: "size-6 text-brand" }),
              ],
            }),
            e.jsx("hr", { className: "border-border" }),
            e.jsx(U, { k: "Receipt #", v: r.id.slice(0, 8).toUpperCase() }),
            e.jsx(U, { k: "Date", v: r.paid_on }),
            a && e.jsx(U, { k: "Student", v: q }),
            a && e.jsx(U, { k: "Invoice", v: `${a.title} (${a.period})` }),
            e.jsx(U, { k: "Method", v: r.method.toUpperCase() }),
            r.reference && e.jsx(U, { k: "Reference", v: r.reference }),
            e.jsx("hr", { className: "border-border" }),
            e.jsx(U, { k: "Amount paid", v: p(Number(r.amount)), bold: !0 }),
            a &&
              e.jsxs(e.Fragment, {
                children: [
                  e.jsx(U, { k: "Total due", v: p(Number(a.amount_due)) }),
                  e.jsx(U, { k: "Balance", v: p(Number(a.amount_due) - Number(a.amount_paid)) }),
                ],
              }),
          ],
        }),
        e.jsxs("div", {
          className: "px-5 py-3 border-t border-border flex justify-end gap-2 print:hidden",
          children: [
            e.jsxs("button", {
              onClick: () => window.print(),
              className:
                "px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
              children: [e.jsx(ce, { className: "size-4" }), " Print"],
            }),
            e.jsx("button", {
              onClick: h,
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
const T =
  "w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";
function A({ label: r, children: a }) {
  return e.jsxs("label", {
    className: "block",
    children: [
      e.jsx("span", { className: "text-xs font-semibold block mb-1 text-foreground", children: r }),
      a,
    ],
  });
}
function de({ title: r, icon: a, children: m }) {
  return e.jsxs("div", {
    className:
      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
    children: [
      e.jsxs("div", {
        className: "px-5 py-3 border-b border-border flex items-center gap-2 bg-secondary/10",
        children: [
          e.jsx(a, { className: "size-4 text-brand" }),
          e.jsx("h2", { className: "text-sm font-semibold text-foreground", children: r }),
        ],
      }),
      m,
    ],
  });
}
function te({ icon: r, label: a, value: m, tone: b }) {
  const h =
    b === "success"
      ? "text-success"
      : b === "danger"
        ? "text-danger"
        : b === "brand"
          ? "text-brand"
          : "text-foreground";
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs",
    children: [
      e.jsxs("div", {
        className: "flex items-center justify-between",
        children: [
          e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: a }),
          e.jsx(r, { className: `size-4 ${h}` }),
        ],
      }),
      e.jsx("h3", { className: `text-2xl font-bold mt-2 ${h}`, children: m }),
    ],
  });
}
function me({ status: r }) {
  const a = {
    paid: "bg-success/15 text-success",
    partial: "bg-brand/15 text-brand",
    pending: "bg-secondary text-muted-foreground",
    overdue: "bg-danger/15 text-danger",
  };
  return e.jsx("span", {
    className: `text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${a[r] ?? "bg-secondary text-muted-foreground"}`,
    children: r,
  });
}
function J({ text: r }) {
  return e.jsx("div", { className: "p-8 text-sm text-muted-foreground text-center", children: r });
}
function x({ children: r, className: a = "" }) {
  return e.jsx("th", { className: `text-left font-semibold px-5 py-2 ${a}`, children: r });
}
function f({ children: r, className: a = "" }) {
  return e.jsx("td", { className: `px-5 py-2 ${a}`, children: r });
}
function U({ k: r, v: a, bold: m }) {
  return e.jsxs("div", {
    className: "flex items-center justify-between text-foreground",
    children: [
      e.jsx("span", { className: "text-muted-foreground", children: r }),
      e.jsx("span", {
        className: m ? "font-bold text-foreground" : "font-medium text-foreground",
        children: a,
      }),
    ],
  });
}
function p(r) {
  return new Intl.NumberFormat(void 0, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(r || 0);
}
export { Qe as component };
