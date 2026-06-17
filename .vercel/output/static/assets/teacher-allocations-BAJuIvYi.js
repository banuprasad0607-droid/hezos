import {
  a0 as E,
  X as U,
  x as e,
  j as H,
  P as M,
  d as R,
  l as X,
  M as l,
  N as d,
} from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function O() {
  const { currentSchoolId: r, roles: o, loading: x } = E();
  U("Teacher Subject Allocations");
  const [y, h] = a.useState(!0),
    [b, p] = a.useState([]),
    [S, k] = a.useState([]),
    [w, _] = a.useState([]),
    [A, T] = a.useState([]),
    [c, C] = a.useState(""),
    [n, f] = a.useState(""),
    [i, j] = a.useState(""),
    [g, I] = a.useState("2026-2027"),
    [q, N] = a.useState(!1),
    D = o.includes("super_admin") || o.includes("admin") || o.includes("principal"),
    v = async () => {
      if (r) {
        h(!0);
        try {
          const { data: s } = await l
            .from("teacher_allocations")
            .select(
              `
          id,
          academic_year,
          profiles:teacher_id ( full_name, email ),
          subjects:subject_id ( name, code ),
          classes:class_id ( name )
        `,
            )
            .eq("school_id", r);
          p(s || []);
          const { data: t } = await l
            .from("user_roles")
            .select("user_id")
            .eq("school_id", r)
            .eq("role", "teacher");
          if (t && t.length > 0) {
            const Y = t.map((z) => z.user_id),
              { data: F } = await l.from("profiles").select("id, full_name, email").in("id", Y);
            k(F || []);
          }
          const { data: m } = await l
            .from("subjects")
            .select("id, name, code")
            .eq("school_id", r)
            .order("name");
          _(m || []);
          const { data: u } = await l
            .from("classes")
            .select("id, name")
            .eq("school_id", r)
            .is("deleted_at", null)
            .order("name");
          T(u || []);
        } catch (s) {
          d.error("Failed to load allocations: " + s.message);
        } finally {
          h(!1);
        }
      }
    };
  a.useEffect(() => {
    v();
  }, [r]);
  const L = async (s) => {
      if ((s.preventDefault(), !r || !c || !n || !i)) {
        d.error("Please select all fields");
        return;
      }
      N(!0);
      try {
        const { error: t } = await l
          .from("teacher_allocations")
          .insert({ school_id: r, teacher_id: c, subject_id: n, class_id: i, academic_year: g });
        if (t) throw t;
        (d.success("Allocation created successfully"), f(""), j(""), v());
      } catch (t) {
        d.error("Failed to create allocation: " + t.message);
      } finally {
        N(!1);
      }
    },
    P = async (s) => {
      if (confirm("Are you sure you want to remove this allocation?"))
        try {
          const { error: t } = await l.from("teacher_allocations").delete().eq("id", s);
          if (t) throw t;
          (d.success("Allocation removed"), p((m) => m.filter((u) => u.id !== s)));
        } catch (t) {
          d.error("Failed to delete: " + t.message);
        }
    };
  return D
    ? x
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
      : e.jsxs(e.Fragment, {
          children: [
            e.jsx(M, { title: "Teacher Subject Allocations", breadcrumb: "Academics" }),
            e.jsxs("div", {
              className: "p-6 lg:p-8 space-y-8",
              children: [
                e.jsxs("div", {
                  className:
                    "bg-white dark:bg-slate-900 p-6 rounded-2xl border border-border dark:border-slate-800 shadow-sm",
                  children: [
                    e.jsxs("h3", {
                      className:
                        "font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2",
                      children: [e.jsx(R, { className: "size-4" }), " New Allocation"],
                    }),
                    e.jsxs("form", {
                      onSubmit: L,
                      className: "grid grid-cols-1 md:grid-cols-5 gap-4 items-end",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className:
                                "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                              children: "Teacher",
                            }),
                            e.jsxs("select", {
                              value: c,
                              onChange: (s) => C(s.target.value),
                              className:
                                "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                              required: !0,
                              children: [
                                e.jsx("option", { value: "", children: "-- Select Teacher --" }),
                                S.map((s) =>
                                  e.jsx("option", { value: s.id, children: s.full_name }, s.id),
                                ),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className:
                                "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                              children: "Subject",
                            }),
                            e.jsxs("select", {
                              value: n,
                              onChange: (s) => f(s.target.value),
                              className:
                                "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                              required: !0,
                              children: [
                                e.jsx("option", { value: "", children: "-- Select Subject --" }),
                                w.map((s) =>
                                  e.jsx("option", { value: s.id, children: s.name }, s.id),
                                ),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className:
                                "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                              children: "Class",
                            }),
                            e.jsxs("select", {
                              value: i,
                              onChange: (s) => j(s.target.value),
                              className:
                                "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                              required: !0,
                              children: [
                                e.jsx("option", { value: "", children: "-- Select Class --" }),
                                A.map((s) =>
                                  e.jsx("option", { value: s.id, children: s.name }, s.id),
                                ),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className:
                                "block text-[10px] font-bold text-muted-foreground uppercase mb-1",
                              children: "Academic Year",
                            }),
                            e.jsx("input", {
                              type: "text",
                              value: g,
                              onChange: (s) => I(s.target.value),
                              className:
                                "w-full bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none",
                              required: !0,
                            }),
                          ],
                        }),
                        e.jsx("button", {
                          type: "submit",
                          disabled: q,
                          className:
                            "px-4 py-2 bg-brand text-white font-semibold text-sm rounded-lg shadow-sm hover:bg-brand/90 transition-all disabled:opacity-50 h-[38px]",
                          children: "Allocate",
                        }),
                      ],
                    }),
                  ],
                }),
                e.jsx("div", {
                  className:
                    "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden",
                  children: e.jsxs("table", {
                    className: "w-full text-sm text-left",
                    children: [
                      e.jsx("thead", {
                        className:
                          "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-border dark:border-slate-800",
                        children: e.jsxs("tr", {
                          children: [
                            e.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Teacher",
                            }),
                            e.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Subject",
                            }),
                            e.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Class",
                            }),
                            e.jsx("th", {
                              className: "py-3 px-6 font-semibold",
                              children: "Academic Year",
                            }),
                            e.jsx("th", {
                              className: "py-3 px-6 font-semibold w-16 text-right",
                              children: "Actions",
                            }),
                          ],
                        }),
                      }),
                      e.jsx("tbody", {
                        className: "divide-y divide-border dark:divide-slate-800",
                        children: y
                          ? e.jsx("tr", {
                              children: e.jsx("td", {
                                colSpan: 5,
                                className: "p-6 text-center text-muted-foreground",
                                children: "Loading allocations...",
                              }),
                            })
                          : b.length === 0
                            ? e.jsx("tr", {
                                children: e.jsx("td", {
                                  colSpan: 5,
                                  className: "p-6 text-center text-muted-foreground",
                                  children: "No allocations found.",
                                }),
                              })
                            : b.map((s) =>
                                e.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-slate-50/50 dark:hover:bg-slate-800/50",
                                    children: [
                                      e.jsx("td", {
                                        className:
                                          "py-3 px-6 font-medium text-slate-800 dark:text-slate-200",
                                        children: s.profiles?.full_name || "Unknown Teacher",
                                      }),
                                      e.jsx("td", {
                                        className: "py-3 px-6 text-slate-600 dark:text-slate-300",
                                        children: s.subjects?.name || "Unknown Subject",
                                      }),
                                      e.jsx("td", {
                                        className:
                                          "py-3 px-6 font-bold text-slate-700 dark:text-slate-200",
                                        children: s.classes?.name || "Unknown Class",
                                      }),
                                      e.jsx("td", {
                                        className: "py-3 px-6 text-slate-500",
                                        children: s.academic_year,
                                      }),
                                      e.jsx("td", {
                                        className: "py-3 px-6 text-right",
                                        children: e.jsx("button", {
                                          onClick: () => P(s.id),
                                          className:
                                            "p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-md transition-colors",
                                          children: e.jsx(X, { className: "size-4" }),
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
        })
    : x
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
      : e.jsxs("div", {
          className: "p-8 text-center text-muted-foreground",
          children: [
            e.jsx(H, { className: "size-10 mx-auto text-rose-300 mb-2" }),
            e.jsx("p", { children: "You do not have permission to access Teacher Allocations." }),
          ],
        });
}
export { O as component };
