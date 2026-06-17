import {
  a0 as K,
  X as Y,
  M as x,
  x as e,
  P as Z,
  d as ee,
  S as te,
  N as o,
} from "./index-DrqTZ7SR.js";
import { k as s } from "./vendor-charts-DECNlt_G.js";
import { W as re } from "./WhatsAppBroadcast-DN6Mi9QW.js";
import { e as se, a as ae, b as oe } from "./export-helper-D-BWKL3x.js";
import { M as ne } from "./message-square-BVAiuQO7.js";
import { T as de } from "./trash-W_OSIwSY.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
import "./notify-CFlpE6Mr.js";
import "./x-DH-xwxwM.js";
import "./phone-BvCyC-cH.js";
import "./send-DBUz72Lj.js";
const _ = [
  { value: "academic", label: "Academic", tone: "bg-brand-soft text-brand" },
  { value: "behaviour", label: "Behaviour", tone: "bg-warning-soft text-warning" },
  { value: "appreciation", label: "Appreciation", tone: "bg-success-soft text-success" },
  { value: "improvement", label: "Improvement", tone: "bg-danger-soft text-danger" },
  { value: "performance", label: "Performance", tone: "bg-accent text-accent-foreground" },
];
function ye() {
  const { currentSchoolId: a, user: C, roles: v, loading: R } = K(),
    $ = v.includes("super_admin"),
    z = v.includes("admin") || $,
    I = v.includes("teacher"),
    T = z || I;
  Y("Student Remarks");
  const [y, M] = s.useState([]),
    [j, B] = s.useState([]),
    [O, p] = s.useState(!1),
    [A, E] = s.useState(!1),
    [f, P] = s.useState(""),
    [q, Q] = s.useState("appreciation"),
    [D, L] = s.useState(""),
    [N, V] = s.useState(""),
    [k, W] = s.useState(""),
    [b, H] = s.useState("all"),
    [d, g] = s.useState(0),
    [c] = s.useState(10),
    [h, X] = s.useState(0),
    [G, F] = s.useState(!1);
  s.useEffect(() => {
    const t = setTimeout(() => {
      (W(N), g(0));
    }, 400);
    return () => clearTimeout(t);
  }, [N]);
  const S = async () => {
    if (a) {
      F(!0);
      try {
        let t = x
          .from("remarks")
          .select(
            "id, student_id, category, content, created_at, visible_to_parent, students!inner(full_name, parent_name, parent_phone)",
            { count: "exact" },
          )
          .eq("school_id", a)
          .is("deleted_at", null);
        (b !== "all" && (t = t.eq("category", b)),
          k.trim() && (t = t.ilike("students.full_name", `%${k.trim()}%`)));
        const r = d * c,
          l = r + c - 1,
          {
            data: u,
            count: m,
            error: i,
          } = await t.order("created_at", { ascending: !1 }).range(r, l);
        if (i) throw i;
        (B(
          (u ?? []).map((n) => ({
            ...n,
            students: Array.isArray(n.students) ? (n.students[0] ?? null) : n.students,
          })),
        ),
          X(m ?? 0));
      } catch (t) {
        o.error(t.message || "Failed to load remarks.");
      } finally {
        F(!1);
      }
    }
  };
  (s.useEffect(() => {
    a &&
      x
        .from("students")
        .select("id, full_name")
        .eq("school_id", a)
        .is("deleted_at", null)
        .order("full_name")
        .then(({ data: t }) => {
          (M(t ?? []), t?.[0] && !f && P(t[0].id));
        });
  }, [a]),
    s.useEffect(() => {
      S();
    }, [a, k, b, d]));
  const U = async (t) => {
      if ((t.preventDefault(), !a || !C || !f)) return;
      E(!0);
      const { error: r } = await x.from("remarks").insert({
        school_id: a,
        student_id: f,
        teacher_id: C.id,
        category: q,
        content: D,
        visible_to_parent: !0,
      });
      if ((E(!1), r)) return o.error(r.message);
      (o.success("Remark added — parent will see it in tonight's digest."), p(!1), L(""), S());
    },
    J = async (t) => {
      if (
        a &&
        confirm(
          "Are you sure you want to delete this remark? This will move it to the Recycle Bin.",
        )
      )
        try {
          const { error: r } = await x
            .from("remarks")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", t)
            .eq("school_id", a);
          if (r) throw r;
          (o.success("Remark moved to Recycle Bin."), S());
        } catch (r) {
          o.error(r.message || "Failed to delete remark.");
        }
    },
    w = async (t) => {
      if (a) {
        o.loading("Preparing export...");
        try {
          const { data: r, error: l } = await x
            .from("remarks")
            .select("category, content, created_at, students(full_name)")
            .eq("school_id", a)
            .is("deleted_at", null)
            .order("created_at", { ascending: !1 });
          if (l || !r) throw l || new Error("No data");
          const u = ["Student Name", "Category", "Remark Content", "Date Created"],
            m = r.map((n) => [
              n.students?.full_name || "—",
              n.category.toUpperCase(),
              n.content,
              new Date(n.created_at).toLocaleString(),
            ]);
          o.dismiss();
          const i = "Student_Remarks_Export";
          (t === "csv"
            ? se(i, u, m)
            : t === "excel"
              ? ae(i, u, m)
              : t === "pdf" && oe(i, "Student Remarks Ledger", u, m),
            o.success("Export started!"));
        } catch (r) {
          (o.dismiss(), o.error(r.message || "Export failed."));
        }
      }
    };
  return R
    ? R
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
          e.jsx(Z, {
            title: "Student Remarks",
            breadcrumb: "Operations",
            actions: e.jsx("div", {
              className: "flex gap-2",
              children:
                T &&
                e.jsxs("button", {
                  onClick: () => p(!0),
                  disabled: y.length === 0,
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer",
                  children: [e.jsx(ee, { className: "size-4" }), " Add Remark"],
                }),
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
            children: [
              e.jsxs("div", {
                className:
                  "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: [
                      e.jsxs("div", {
                        className: "relative w-48",
                        children: [
                          e.jsx(te, {
                            className:
                              "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                          }),
                          e.jsx("input", {
                            value: N,
                            onChange: (t) => V(t.target.value),
                            placeholder: "Search Student...",
                            className:
                              "w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-background text-foreground outline-none",
                          }),
                        ],
                      }),
                      e.jsxs("select", {
                        value: b,
                        onChange: (t) => {
                          (H(t.target.value), g(0));
                        },
                        className:
                          "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                        children: [
                          e.jsx("option", { value: "all", children: "All categories" }),
                          _.map((t) =>
                            e.jsx("option", { value: t.value, children: t.label }, t.value),
                          ),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                    children: [
                      e.jsx("button", {
                        onClick: () => w("csv"),
                        className:
                          "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                        children: "CSV",
                      }),
                      e.jsx("button", {
                        onClick: () => w("excel"),
                        className:
                          "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                        children: "XLS",
                      }),
                      e.jsx("button", {
                        onClick: () => w("pdf"),
                        className:
                          "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground",
                        children: "PDF",
                      }),
                    ],
                  }),
                ],
              }),
              G && j.length === 0
                ? e.jsx("div", {
                    className: "text-center py-12 text-sm text-muted-foreground",
                    children: "Loading remarks ledger...",
                  })
                : j.length === 0
                  ? e.jsxs("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                      children: [
                        e.jsx(ne, { className: "size-10 mx-auto text-muted-foreground" }),
                        e.jsx("h3", {
                          className: "font-semibold mt-3 text-foreground",
                          children: "No remarks found",
                        }),
                        e.jsx("p", {
                          className: "text-sm text-muted-foreground mt-1",
                          children:
                            y.length === 0
                              ? "Add a student first."
                              : "Start with an appreciation note.",
                        }),
                      ],
                    })
                  : e.jsxs("div", {
                      className: "space-y-4",
                      children: [
                        e.jsx("div", {
                          className:
                            "bg-card border border-border rounded-xl divide-y divide-border shadow-xs text-card-foreground",
                          children: j.map((t) => {
                            const r = _.find((l) => l.value === t.category);
                            return e.jsxs(
                              "div",
                              {
                                className: "p-5 flex gap-4 hover:bg-secondary/10 transition-colors",
                                children: [
                                  e.jsx("div", {
                                    className: `size-10 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${r?.tone}`,
                                    children: r?.label.slice(0, 1),
                                  }),
                                  e.jsxs("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2 text-sm",
                                        children: [
                                          e.jsx("span", {
                                            className: "font-semibold text-foreground",
                                            children: t.students?.full_name ?? "Student",
                                          }),
                                          e.jsx("span", {
                                            className: `text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${r?.tone}`,
                                            children: r?.label,
                                          }),
                                          t.visible_to_parent &&
                                            e.jsx("span", {
                                              className: "text-[10px] text-muted-foreground",
                                              children: "· Visible to parent",
                                            }),
                                        ],
                                      }),
                                      e.jsxs("p", {
                                        className: "text-sm text-muted-foreground mt-1 italic",
                                        children: ['"', t.content, '"'],
                                      }),
                                      e.jsx("p", {
                                        className: "text-[10px] text-muted-foreground mt-2",
                                        children: new Date(t.created_at).toLocaleString(),
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "shrink-0 flex items-center gap-2",
                                    children: [
                                      e.jsx(re, {
                                        label: "WhatsApp",
                                        recipients: [
                                          {
                                            id: t.student_id,
                                            name:
                                              t.students?.parent_name ||
                                              `${t.students?.full_name ?? "Student"}'s parent`,
                                            phone: t.students?.parent_phone,
                                            subtitle: t.students?.full_name,
                                          },
                                        ],
                                        defaultMessage: `Hello, a new ${r?.label.toLowerCase()} remark for ${t.students?.full_name ?? "your child"}:

"${t.content}"

— Class Teacher`,
                                      }),
                                      T &&
                                        e.jsx("button", {
                                          onClick: () => J(t.id),
                                          className:
                                            "p-1 text-muted-foreground hover:text-danger rounded-md border border-border bg-card cursor-pointer",
                                          title: "Delete Remark",
                                          children: e.jsx(de, { className: "size-3.5" }),
                                        }),
                                    ],
                                  }),
                                ],
                              },
                              t.id,
                            );
                          }),
                        }),
                        h > 0 &&
                          e.jsxs("div", {
                            className:
                              "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
                            children: [
                              e.jsxs("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                  "Showing ",
                                  d * c + 1,
                                  " to ",
                                  Math.min((d + 1) * c, h),
                                  " of ",
                                  h,
                                  " remarks",
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex gap-2",
                                children: [
                                  e.jsx("button", {
                                    disabled: d === 0,
                                    onClick: () => g((t) => t - 1),
                                    className:
                                      "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                                    children: "Previous",
                                  }),
                                  e.jsx("button", {
                                    disabled: (d + 1) * c >= h,
                                    onClick: () => g((t) => t + 1),
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
          }),
          O &&
            e.jsx("div", {
              className:
                "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground",
              onClick: () => p(!1),
              children: e.jsxs("form", {
                onClick: (t) => t.stopPropagation(),
                onSubmit: U,
                className:
                  "bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg text-card-foreground",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-lg text-foreground",
                    children: "New Remark",
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Student *",
                      }),
                      e.jsx("select", {
                        required: !0,
                        value: f,
                        onChange: (t) => P(t.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                        children: y.map((t) =>
                          e.jsx("option", { value: t.id, children: t.full_name }, t.id),
                        ),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Category",
                      }),
                      e.jsx("div", {
                        className: "mt-1 flex flex-wrap gap-2",
                        children: _.map((t) =>
                          e.jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => Q(t.value),
                              className: `px-3 py-1 text-xs font-semibold rounded cursor-pointer ${q === t.value ? t.tone : "bg-secondary text-muted-foreground hover:bg-accent"}`,
                              children: t.label,
                            },
                            t.value,
                          ),
                        ),
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Remark *",
                      }),
                      e.jsx("textarea", {
                        required: !0,
                        value: D,
                        onChange: (t) => L(t.target.value),
                        rows: 4,
                        placeholder: "Showed great improvement in fractions today.",
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => p(!1),
                        className:
                          "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: A,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer",
                        children: A ? "Saving…" : "Add Remark",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
}
export { ye as component };
