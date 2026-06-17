import {
  a0 as W,
  X,
  M as c,
  x as e,
  P as H,
  S as K,
  d as Y,
  b as O,
  F as G,
  N as p,
} from "./index-DrqTZ7SR.js";
import { k as n } from "./vendor-charts-DECNlt_G.js";
import { e as J, a as U, b as Z } from "./export-helper-D-BWKL3x.js";
import { P as ee } from "./play-BlrNUM_S.js";
import { W as se } from "./wallet-CZbtwORR.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function ue() {
  const { currentSchoolId: o, user: w, roles: i, loading: v } = W(),
    d = i.includes("admin") || i.includes("super_admin");
  X("Payroll");
  const [u, x] = n.useState("overview"),
    [S, C] = n.useState([]),
    [b, N] = n.useState([]),
    [A, m] = n.useState([]),
    [T, j] = n.useState([]),
    [f, P] = n.useState(null),
    y = async () => {
      if (!o) return;
      const [{ data: a }, { data: k }, { data: D }] = await Promise.all([
          c.from("user_roles").select("user_id").eq("school_id", o).eq("role", "teacher"),
          c.from("teacher_salaries").select("*").eq("school_id", o),
          c
            .from("payroll_runs")
            .select("*")
            .eq("school_id", o)
            .order("created_at", { ascending: !1 }),
        ]),
        t = (a ?? []).map((l) => l.user_id);
      let r = [];
      if (t.length) {
        const { data: l } = await c
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", t);
        r = l ?? [];
      }
      (C(r), N(k ?? []), m(D ?? []), (D ?? []).length && !f && P(D[0].id));
    };
  (n.useEffect(() => {
    y();
  }, [o]),
    n.useEffect(() => {
      if (!f) {
        j([]);
        return;
      }
      c.from("payroll_items")
        .select("*")
        .eq("payroll_run_id", f)
        .eq("school_id", o)
        .then(({ data: a }) => j(a ?? []));
    }, [f]));
  const q = b.reduce(
      (a, k) => a + Number(k.base_salary) + Number(k.allowances) - Number(k.deductions),
      0,
    ),
    s = A[0],
    g = T.filter((a) => a.payroll_run_id === s?.id),
    _ = g.reduce((a, k) => a + Number(k.net_amount), 0),
    $ = g.filter((a) => a.status === "paid").reduce((a, k) => a + Number(k.net_amount), 0);
  return d
    ? v
      ? v
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
            e.jsx(H, {
              title: "Payroll",
              breadcrumb: "Finance",
              actions: e.jsx("div", {
                className: "flex bg-secondary rounded-md p-0.5 border border-border",
                children: ["overview", "salaries", "runs"].map((a) =>
                  e.jsx(
                    "button",
                    {
                      onClick: () => x(a),
                      className: `px-3 py-1 text-xs font-semibold rounded capitalize transition cursor-pointer ${u === a ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                      children: a,
                    },
                    a,
                  ),
                ),
              }),
            }),
            e.jsxs("div", {
              className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
              children: [
                u === "overview" &&
                  e.jsxs(e.Fragment, {
                    children: [
                      e.jsxs("div", {
                        className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                        children: [
                          e.jsx(M, { label: "Teachers", value: S.length, hint: "On payroll" }),
                          e.jsx(M, {
                            label: "Salary profiles",
                            value: b.length,
                            hint: `${S.length - b.length} missing`,
                          }),
                          e.jsx(M, {
                            label: "Monthly cost",
                            value: `₹${q.toFixed(0)}`,
                            hint: "Net of deductions",
                          }),
                          e.jsx(M, {
                            label: "Last run paid",
                            value: `₹${$.toFixed(0)}`,
                            hint: s ? `of ₹${_.toFixed(0)} (${s.period})` : "No runs yet",
                          }),
                        ],
                      }),
                      e.jsxs("section", {
                        className:
                          "bg-card border border-border rounded-xl p-5 text-card-foreground",
                        children: [
                          e.jsx("h3", {
                            className: "font-semibold mb-3",
                            children: "Quick actions",
                          }),
                          e.jsxs("div", {
                            className: "flex flex-wrap gap-2",
                            children: [
                              e.jsx("button", {
                                onClick: () => x("salaries"),
                                className:
                                  "px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer",
                                children: "Configure salaries",
                              }),
                              e.jsxs("button", {
                                onClick: () => x("runs"),
                                className:
                                  "px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer",
                                children: [e.jsx(ee, { className: "size-3" }), " Process payroll"],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                u === "salaries" && e.jsx(te, { schoolId: o, reloadParent: y }),
                u === "runs" &&
                  e.jsx(re, {
                    schoolId: o,
                    userId: w.id,
                    teachers: S,
                    salaries: b,
                    runs: A,
                    items: T,
                    activeRun: f,
                    setActiveRun: P,
                    reload: y,
                    reloadItems: () => {
                      f &&
                        c
                          .from("payroll_items")
                          .select("*")
                          .eq("payroll_run_id", f)
                          .eq("school_id", o)
                          .then(({ data: a }) => j(a ?? []));
                    },
                  }),
              ],
            }),
          ],
        })
    : e.jsx("div", {
        className: "p-8 text-sm text-muted-foreground bg-background text-foreground",
        children: "Admin only.",
      });
}
function M({ label: o, value: w, hint: i }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs",
    children: [
      e.jsx("p", {
        className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
        children: o,
      }),
      e.jsx("p", { className: "text-2xl font-bold mt-1", children: w }),
      i && e.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: i }),
    ],
  });
}
function te({ schoolId: o, reloadParent: w }) {
  const [i, v] = n.useState(null),
    [d, u] = n.useState({ base: "", allow: "", ded: "", bank: "", notes: "" }),
    [x, S] = n.useState([]),
    [C, b] = n.useState([]),
    [N, A] = n.useState(""),
    [m, T] = n.useState(""),
    [j, f] = n.useState(0),
    [P] = n.useState(10),
    [y, q] = n.useState(0),
    [s, g] = n.useState(!1);
  n.useEffect(() => {
    const t = setTimeout(() => {
      (T(N), f(0));
    }, 400);
    return () => clearTimeout(t);
  }, [N]);
  const _ = async () => {
    if (o) {
      g(!0);
      try {
        const r = (
          (await c.from("user_roles").select("user_id").eq("school_id", o).eq("role", "teacher"))
            .data ?? []
        ).map((h) => h.user_id);
        let l = c
          .from("profiles")
          .select("user_id, full_name, email", { count: "exact" })
          .eq("school_id", o)
          .in("user_id", r.length ? r : ["00000000-0000-0000-0000-000000000000"]);
        m.trim() && (l = l.ilike("full_name", `%${m.trim()}%`));
        const F = j * P,
          z = F + P - 1,
          { data: R, count: L, error: B } = await l.order("full_name").range(F, z);
        if (B) throw B;
        (S(R ?? []), q(L ?? 0));
        const E = (R ?? []).map((h) => h.user_id);
        if (E.length > 0) {
          const { data: h } = await c
            .from("teacher_salaries")
            .select("*")
            .eq("school_id", o)
            .in("teacher_id", E);
          b(h ?? []);
        } else b([]);
      } catch (t) {
        p.error(t.message || "Failed to load salaries.");
      } finally {
        g(!1);
      }
    }
  };
  n.useEffect(() => {
    _();
  }, [o, m, j]);
  const $ = () => {
      const t = Number(d.base || 0),
        r = Number(d.allow || 0),
        l = Number(d.ded || 0);
      return t + r - l;
    },
    a = (t) => {
      const r = C.find((l) => l.teacher_id === t);
      (u({
        base: r?.base_salary?.toString() ?? "",
        allow: r?.allowances?.toString() ?? "",
        ded: r?.deductions?.toString() ?? "",
        bank: r?.bank_account ?? "",
        notes: r?.notes ?? "",
      }),
        v(t));
    },
    k = async (t) => {
      if ((t.preventDefault(), !i)) return;
      const r = C.find((R) => R.teacher_id === i),
        l = {
          school_id: o,
          teacher_id: i,
          base_salary: Number(d.base || 0),
          allowances: Number(d.allow || 0),
          deductions: Number(d.ded || 0),
          bank_account: d.bank || null,
          notes: d.notes || null,
        },
        F = r
          ? c.from("teacher_salaries").update(l).eq("id", r.id).eq("school_id", o)
          : c.from("teacher_salaries").insert(l),
        { error: z } = await F;
      if (z) return p.error(z.message);
      (p.success("Salary saved"), v(null), await _(), await w());
    },
    D = async (t) => {
      p.loading("Preparing export...");
      try {
        const { data: r } = await c
            .from("user_roles")
            .select("user_id")
            .eq("school_id", o)
            .eq("role", "teacher"),
          l = (r ?? []).map((E) => E.user_id),
          { data: F } = await c
            .from("profiles")
            .select("user_id, full_name, email")
            .eq("school_id", o)
            .in("user_id", l.length ? l : ["00000000-0000-0000-0000-000000000000"])
            .order("full_name");
        if (!F || F.length === 0) {
          (p.dismiss(), p.error("No teachers to export."));
          return;
        }
        const { data: z } = await c.from("teacher_salaries").select("*").eq("school_id", o),
          R = [
            "Teacher Name",
            "Email",
            "Base Salary",
            "Allowances",
            "Deductions",
            "Net Salary",
            "Bank Account",
            "Notes",
          ],
          L = F.map((E) => {
            const h = (z ?? []).find((V) => V.teacher_id === E.user_id),
              Q =
                Number(h?.base_salary ?? 0) +
                Number(h?.allowances ?? 0) -
                Number(h?.deductions ?? 0);
            return [
              E.full_name || "—",
              E.email || "—",
              h?.base_salary ?? 0,
              h?.allowances ?? 0,
              h?.deductions ?? 0,
              Q,
              h?.bank_account || "—",
              h?.notes || "—",
            ];
          });
        p.dismiss();
        const B = "Teacher_Payroll_Profiles";
        (t === "csv"
          ? J(B, R, L)
          : t === "excel"
            ? U(B, R, L)
            : t === "pdf" && Z(B, "Teacher Payroll Profiles", R, L),
          p.success("Export started!"));
      } catch (r) {
        (p.dismiss(), p.error(r.message || "Export failed."));
      }
    };
  return e.jsxs("section", {
    className:
      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground space-y-4 p-5",
    children: [
      e.jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h3", {
                className: "font-semibold text-base text-foreground",
                children: "Teacher salary profiles",
              }),
              e.jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Set base salary, allowances and deductions per teacher.",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "flex gap-2 items-center flex-wrap",
            children: [
              e.jsxs("div", {
                className: "relative w-44",
                children: [
                  e.jsx(K, {
                    className:
                      "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                  }),
                  e.jsx("input", {
                    value: N,
                    onChange: (t) => A(t.target.value),
                    placeholder: "Search Teacher...",
                    className:
                      "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                  }),
                ],
              }),
              e.jsxs("div", {
                className:
                  "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                children: [
                  e.jsx("button", {
                    onClick: () => D("csv"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "CSV",
                  }),
                  e.jsx("button", {
                    onClick: () => D("excel"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "XLS",
                  }),
                  e.jsx("button", {
                    onClick: () => D("pdf"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground",
                    children: "PDF",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      s && x.length === 0
        ? e.jsx("div", {
            className: "text-center py-12 text-sm text-muted-foreground",
            children: "Loading salary profiles...",
          })
        : x.length === 0
          ? e.jsx("div", {
              className: "p-10 text-center text-sm text-muted-foreground",
              children: "No teachers found.",
            })
          : e.jsx("div", {
              className: "overflow-x-auto border border-border rounded-lg",
              children: e.jsxs("table", {
                className: "w-full text-left text-sm",
                children: [
                  e.jsx("thead", {
                    className:
                      "bg-secondary/40 text-xs text-muted-foreground border-b border-border",
                    children: e.jsxs("tr", {
                      children: [
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-foreground",
                          children: "Teacher",
                        }),
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Base",
                        }),
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Allowances",
                        }),
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Deductions",
                        }),
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Net",
                        }),
                        e.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Action",
                        }),
                      ],
                    }),
                  }),
                  e.jsx("tbody", {
                    className: "divide-y divide-border",
                    children: x.map((t) => {
                      const r = C.find((F) => F.teacher_id === t.user_id),
                        l = (
                          Number(r?.base_salary ?? 0) +
                          Number(r?.allowances ?? 0) -
                          Number(r?.deductions ?? 0)
                        ).toFixed(0);
                      return e.jsxs(
                        "tr",
                        {
                          className: "hover:bg-secondary/40",
                          children: [
                            e.jsxs("td", {
                              className: "px-6 py-3",
                              children: [
                                e.jsx("p", {
                                  className: "font-medium text-foreground",
                                  children: t.full_name || t.email,
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children: t.email,
                                }),
                              ],
                            }),
                            e.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-foreground",
                              children: ["₹", Number(r?.base_salary ?? 0).toFixed(0)],
                            }),
                            e.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-success",
                              children: ["+₹", Number(r?.allowances ?? 0).toFixed(0)],
                            }),
                            e.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-danger",
                              children: ["-₹", Number(r?.deductions ?? 0).toFixed(0)],
                            }),
                            e.jsxs("td", {
                              className:
                                "px-6 py-3 text-right font-mono font-semibold text-foreground",
                              children: ["₹", l],
                            }),
                            e.jsx("td", {
                              className: "px-6 py-3 text-right",
                              children: e.jsx("button", {
                                onClick: () => a(t.user_id),
                                className:
                                  "text-xs font-semibold text-brand hover:underline cursor-pointer",
                                children: r ? "Edit" : "Set",
                              }),
                            }),
                          ],
                        },
                        t.user_id,
                      );
                    }),
                  }),
                ],
              }),
            }),
      y > 0 &&
        e.jsxs("div", {
          className:
            "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
          children: [
            e.jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: [
                "Showing ",
                j * P + 1,
                " to ",
                Math.min((j + 1) * P, y),
                " of ",
                y,
                " teachers",
              ],
            }),
            e.jsxs("div", {
              className: "flex gap-2",
              children: [
                e.jsx("button", {
                  disabled: j === 0,
                  onClick: () => f((t) => t - 1),
                  className:
                    "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                  children: "Previous",
                }),
                e.jsx("button", {
                  disabled: (j + 1) * P >= y,
                  onClick: () => f((t) => t + 1),
                  className:
                    "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                  children: "Next",
                }),
              ],
            }),
          ],
        }),
      i &&
        e.jsx("div", {
          className:
            "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground",
          onClick: () => v(null),
          children: e.jsxs("form", {
            onClick: (t) => t.stopPropagation(),
            onSubmit: k,
            className:
              "bg-card rounded-xl p-6 w-full max-w-md space-y-3 shadow-lg text-card-foreground",
            children: [
              e.jsx("h2", {
                className: "font-semibold text-lg text-foreground",
                children: x.find((t) => t.user_id === i)?.full_name,
              }),
              e.jsx(I, {
                label: "Base salary",
                v: d.base,
                onChange: (t) => u((r) => ({ ...r, base: t })),
              }),
              e.jsx(I, {
                label: "Allowances",
                v: d.allow,
                onChange: (t) => u((r) => ({ ...r, allow: t })),
              }),
              e.jsx(I, {
                label: "Deductions",
                v: d.ded,
                onChange: (t) => u((r) => ({ ...r, ded: t })),
              }),
              e.jsxs("div", {
                className:
                  "bg-secondary/60 border border-border rounded-md p-3 flex items-center justify-between text-foreground",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsx("p", {
                        className:
                          "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
                        children: "Net salary (auto)",
                      }),
                      e.jsx("p", {
                        className: "text-[11px] text-muted-foreground",
                        children: "Base + Allowances − Deductions",
                      }),
                    ],
                  }),
                  e.jsxs("p", {
                    className: "text-xl font-bold font-mono",
                    children: ["₹", $().toFixed(0)],
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Bank account",
                  }),
                  e.jsx("input", {
                    value: d.bank,
                    onChange: (t) => u({ ...d, bank: t.target.value }),
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Notes",
                  }),
                  e.jsx("textarea", {
                    value: d.notes,
                    onChange: (t) => u({ ...d, notes: t.target.value }),
                    rows: 2,
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex justify-end gap-2 pt-2",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: () => v(null),
                    className:
                      "px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  e.jsx("button", {
                    type: "submit",
                    className:
                      "px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer",
                    children: "Save",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function I({ label: o, v: w, onChange: i }) {
  const [v, d] = n.useState(w),
    [u, x] = n.useState(null);
  n.useEffect(() => {
    (d(w), x(null));
  }, [w]);
  const S = (C) => {
    const b = C.target.value;
    if ((d(b), b === "")) {
      (x(null), i(""));
      return;
    }
    const N = Number(b);
    if (isNaN(N)) {
      x("Please enter a valid number");
      return;
    }
    if (N < 0) {
      x("Value cannot be negative");
      return;
    }
    (x(null), i(b));
  };
  return e.jsxs("div", {
    children: [
      e.jsx("label", { className: "text-sm font-medium text-foreground", children: o }),
      e.jsx("input", {
        type: "text",
        inputMode: "numeric",
        value: v,
        onChange: S,
        className: `mt-1 w-full px-3 py-2 text-sm font-mono border rounded-md bg-background text-foreground focus:outline-none ${u ? "border-danger" : "border-border"}`,
      }),
      u && e.jsx("p", { className: "mt-1 text-xs text-danger", children: u }),
    ],
  });
}
function re({
  schoolId: o,
  userId: w,
  teachers: i,
  salaries: v,
  runs: d,
  items: u,
  activeRun: x,
  setActiveRun: S,
  reload: C,
  reloadItems: b,
}) {
  const [N, A] = n.useState(() => new Date().toISOString().slice(0, 7)),
    [m, T] = n.useState(null),
    j = async () => {
      const s = v.filter((a) => Number(a.base_salary) > 0);
      if (s.length === 0) return p.error("Set salaries first");
      const { data: g, error: _ } = await c
        .from("payroll_runs")
        .insert({ school_id: o, period: N, status: "draft", created_by: w })
        .select()
        .single();
      if (_ || !g) return p.error(_?.message ?? "Failed");
      const $ = s.map((a) => ({
        payroll_run_id: g.id,
        school_id: o,
        teacher_id: a.teacher_id,
        base_salary: a.base_salary,
        allowances: a.allowances,
        deductions: a.deductions,
        net_amount: Number(a.base_salary) + Number(a.allowances) - Number(a.deductions),
        status: "pending",
      }));
      (await c.from("payroll_items").insert($),
        p.success(`Run created for ${N} · ${$.length} teachers`),
        await C(),
        S(g.id));
    },
    f = async (s, g) => {
      const { error: _ } = await c
        .from("payroll_items")
        .update({
          status: "paid",
          payment_method: g,
          paid_on: new Date().toISOString().slice(0, 10),
        })
        .eq("id", s)
        .eq("school_id", o);
      if (_) return p.error(_.message);
      b();
    },
    P = async (s) => {
      (await c
        .from("payroll_runs")
        .update({ status: "processed", processed_at: new Date().toISOString() })
        .eq("id", s)
        .eq("school_id", o),
        p.success("Run marked processed"),
        await C());
    },
    y = u,
    q = d.find((s) => s.id === x);
  return e.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-4 gap-6 text-card-foreground",
    children: [
      e.jsxs("aside", {
        className: "lg:col-span-1 space-y-3",
        children: [
          e.jsxs("div", {
            className: "bg-card border border-border rounded-xl p-4 space-y-3 text-card-foreground",
            children: [
              e.jsx("h4", {
                className: "font-semibold text-sm text-foreground",
                children: "New payroll run",
              }),
              e.jsx("input", {
                type: "month",
                value: N,
                onChange: (s) => A(s.target.value),
                className:
                  "w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
              }),
              e.jsxs("button", {
                onClick: j,
                className:
                  "w-full px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center gap-1 cursor-pointer",
                children: [e.jsx(Y, { className: "size-3" }), " Create run"],
              }),
            ],
          }),
          e.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl divide-y divide-border text-card-foreground",
            children: [
              e.jsx("div", {
                className:
                  "p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Past runs",
              }),
              d.length === 0
                ? e.jsx("p", {
                    className: "p-3 text-xs text-muted-foreground",
                    children: "None yet.",
                  })
                : d.map((s) =>
                    e.jsxs(
                      "button",
                      {
                        onClick: () => S(s.id),
                        className: `w-full text-left p-3 text-sm flex justify-between items-center hover:bg-secondary transition cursor-pointer text-foreground ${x === s.id ? "bg-secondary" : ""}`,
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("p", {
                                className: "font-medium text-foreground",
                                children: s.period,
                              }),
                              e.jsx("p", {
                                className:
                                  "text-[10px] uppercase tracking-wider text-muted-foreground",
                                children: s.status,
                              }),
                            ],
                          }),
                          s.status === "processed"
                            ? e.jsx(O, { className: "size-4 text-success" })
                            : e.jsx(se, { className: "size-4 text-muted-foreground" }),
                        ],
                      },
                      s.id,
                    ),
                  ),
            ],
          }),
        ],
      }),
      e.jsx("section", {
        className:
          "lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden text-card-foreground",
        children: q
          ? e.jsxs(e.Fragment, {
              children: [
                e.jsxs("div", {
                  className:
                    "p-4 border-b border-border flex justify-between items-center bg-secondary/10 text-foreground",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("h3", {
                          className: "font-semibold text-foreground",
                          children: q.period,
                        }),
                        e.jsxs("p", {
                          className: "text-xs text-muted-foreground",
                          children: [
                            y.length,
                            " teachers · ",
                            y.filter((s) => s.status === "paid").length,
                            " paid",
                          ],
                        }),
                      ],
                    }),
                    q.status !== "processed" &&
                      e.jsxs("button", {
                        onClick: () => P(q.id),
                        className:
                          "px-3 py-1.5 text-xs bg-success text-white rounded-md inline-flex items-center gap-1 cursor-pointer",
                        children: [e.jsx(O, { className: "size-3" }), " Mark run processed"],
                      }),
                  ],
                }),
                e.jsxs("table", {
                  className: "w-full text-left text-sm",
                  children: [
                    e.jsx("thead", {
                      className:
                        "bg-secondary/40 text-xs text-muted-foreground border-b border-border",
                      children: e.jsxs("tr", {
                        children: [
                          e.jsx("th", {
                            className: "px-6 py-3 font-medium text-foreground",
                            children: "Teacher",
                          }),
                          e.jsx("th", {
                            className: "px-6 py-3 font-medium text-right text-foreground",
                            children: "Net",
                          }),
                          e.jsx("th", {
                            className: "px-6 py-3 font-medium text-foreground",
                            children: "Status",
                          }),
                          e.jsx("th", {
                            className: "px-6 py-3 font-medium text-right text-foreground",
                            children: "Action",
                          }),
                        ],
                      }),
                    }),
                    e.jsx("tbody", {
                      className: "divide-y divide-border",
                      children: y.map((s) => {
                        const g = i.find((_) => _.user_id === s.teacher_id);
                        return e.jsxs(
                          "tr",
                          {
                            className: "hover:bg-secondary/10",
                            children: [
                              e.jsxs("td", {
                                className: "px-6 py-3",
                                children: [
                                  e.jsx("p", {
                                    className: "font-medium text-foreground",
                                    children: g?.full_name ?? "Teacher",
                                  }),
                                  e.jsxs("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                      "Base ₹",
                                      Number(s.base_salary).toFixed(0),
                                      " +₹",
                                      Number(s.allowances).toFixed(0),
                                      " -₹",
                                      Number(s.deductions).toFixed(0),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("td", {
                                className:
                                  "px-6 py-3 text-right font-mono font-semibold text-foreground",
                                children: ["₹", Number(s.net_amount).toFixed(0)],
                              }),
                              e.jsxs("td", {
                                className: "px-6 py-3",
                                children: [
                                  e.jsx("span", {
                                    className: `text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${s.status === "paid" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`,
                                    children: s.status,
                                  }),
                                  s.paid_on &&
                                    e.jsxs("span", {
                                      className: "ml-2 text-[10px] text-muted-foreground",
                                      children: [s.paid_on, " · ", s.payment_method],
                                    }),
                                ],
                              }),
                              e.jsx("td", {
                                className: "px-6 py-3 text-right",
                                children: e.jsxs("div", {
                                  className: "flex justify-end gap-2",
                                  children: [
                                    e.jsxs("button", {
                                      onClick: () => T(s),
                                      className:
                                        "text-xs font-semibold text-brand inline-flex items-center gap-1 hover:underline cursor-pointer",
                                      children: [e.jsx(G, { className: "size-3" }), " Slip"],
                                    }),
                                    s.status !== "paid" &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("button", {
                                            onClick: () => f(s.id, "bank"),
                                            className:
                                              "text-xs px-2 py-1 bg-primary text-primary-foreground rounded cursor-pointer",
                                            children: "Pay (Bank)",
                                          }),
                                          e.jsx("button", {
                                            onClick: () => f(s.id, "cash"),
                                            className:
                                              "text-xs px-2 py-1 border border-border rounded cursor-pointer text-foreground",
                                            children: "Cash",
                                          }),
                                        ],
                                      }),
                                  ],
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
              ],
            })
          : e.jsx("div", {
              className: "p-10 text-center text-sm text-muted-foreground",
              children: "Select or create a payroll run.",
            }),
      }),
      m &&
        e.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 print:bg-white",
          onClick: () => T(null),
          children: e.jsxs("div", {
            onClick: (s) => s.stopPropagation(),
            className:
              "bg-white text-black rounded-xl p-8 w-full max-w-md shadow-lg print:shadow-none",
            children: [
              e.jsxs("div", {
                className: "text-center border-b border-gray-300 pb-3 mb-3",
                children: [
                  e.jsx("h2", {
                    className: "font-bold text-lg text-black",
                    children: "SALARY SLIP",
                  }),
                  e.jsx("p", { className: "text-xs text-gray-600", children: q?.period }),
                ],
              }),
              e.jsx("p", {
                className: "font-semibold text-black",
                children: i.find((s) => s.user_id === m.teacher_id)?.full_name,
              }),
              e.jsx("p", {
                className: "text-xs text-gray-600 mb-3",
                children: i.find((s) => s.user_id === m.teacher_id)?.email,
              }),
              e.jsx("table", {
                className: "w-full text-sm text-black",
                children: e.jsxs("tbody", {
                  children: [
                    e.jsxs("tr", {
                      children: [
                        e.jsx("td", { className: "py-1", children: "Base salary" }),
                        e.jsxs("td", {
                          className: "text-right font-mono",
                          children: ["₹", Number(m.base_salary).toFixed(2)],
                        }),
                      ],
                    }),
                    e.jsxs("tr", {
                      children: [
                        e.jsx("td", { className: "py-1", children: "Allowances" }),
                        e.jsxs("td", {
                          className: "text-right font-mono text-green-700",
                          children: ["+₹", Number(m.allowances).toFixed(2)],
                        }),
                      ],
                    }),
                    e.jsxs("tr", {
                      children: [
                        e.jsx("td", { className: "py-1", children: "Deductions" }),
                        e.jsxs("td", {
                          className: "text-right font-mono text-red-700",
                          children: ["-₹", Number(m.deductions).toFixed(2)],
                        }),
                      ],
                    }),
                    e.jsxs("tr", {
                      className: "border-t border-gray-300 font-bold",
                      children: [
                        e.jsx("td", { className: "py-2", children: "Net pay" }),
                        e.jsxs("td", {
                          className: "text-right font-mono",
                          children: ["₹", Number(m.net_amount).toFixed(2)],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              m.status === "paid" &&
                e.jsxs("p", {
                  className: "text-xs text-center text-green-700 mt-3",
                  children: ["PAID on ", m.paid_on, " via ", m.payment_method],
                }),
              e.jsxs("div", {
                className: "flex gap-2 mt-4 print:hidden",
                children: [
                  e.jsx("button", {
                    onClick: () => window.print(),
                    className:
                      "flex-1 px-3 py-2 text-sm border border-gray-300 rounded text-black bg-white cursor-pointer",
                    children: "Print",
                  }),
                  e.jsx("button", {
                    onClick: () => T(null),
                    className:
                      "flex-1 px-3 py-2 text-sm bg-black text-white rounded cursor-pointer",
                    children: "Close",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { ue as component };
