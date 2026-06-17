import {
  a0 as M,
  X as O,
  x as e,
  P as H,
  S as X,
  d as T,
  G as Y,
  M as m,
  N as i,
} from "./index-DrqTZ7SR.js";
import { k as t } from "./vendor-charts-DECNlt_G.js";
import { T as J } from "./trash-W_OSIwSY.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function ee() {
  const { currentSchoolId: r, roles: j, loading: q } = M(),
    y = j.includes("super_admin"),
    z = j.includes("admin") || y;
  O("Classes");
  const [x, B] = t.useState([]),
    [D, l] = t.useState(!1),
    [N, v] = t.useState(""),
    [w, C] = t.useState(""),
    [S, k] = t.useState(""),
    [f, u] = t.useState(!1),
    [g, E] = t.useState(""),
    [b, G] = t.useState(""),
    [o, p] = t.useState(0),
    [c] = t.useState(6),
    [d, $] = t.useState(0);
  t.useEffect(() => {
    const s = setTimeout(() => {
      (G(g), p(0));
    }, 400);
    return () => clearTimeout(s);
  }, [g]);
  const h = async () => {
    if (r) {
      u(!0);
      try {
        let s = m
          .from("classes")
          .select("id, name, grade, section", { count: "exact" })
          .eq("school_id", r)
          .is("deleted_at", null);
        b.trim() && (s = s.ilike("name", `%${b.trim()}%`));
        const a = o * c,
          n = a + c - 1,
          { data: Q, count: R, error: P } = await s.order("name").range(a, n);
        if (P) throw P;
        $(R ?? 0);
        const A = await Promise.all(
          (Q ?? []).map(async (_) => {
            const { count: L } = await m
              .from("students")
              .select("id", { count: "exact", head: !0 })
              .eq("class_id", _.id)
              .is("deleted_at", null);
            return { ..._, student_count: L ?? 0 };
          }),
        );
        B(A);
      } catch (s) {
        i.error(s.message || "Failed to load classes.");
      } finally {
        u(!1);
      }
    }
  };
  t.useEffect(() => {
    h();
  }, [r, b, o]);
  const F = async (s) => {
      if ((s.preventDefault(), !r)) return;
      u(!0);
      const { error: a } = await m
        .from("classes")
        .insert({ school_id: r, name: N, grade: w || null, section: S || null });
      if ((u(!1), a)) return i.error(a.message);
      (i.success("Class created"), l(!1), v(""), C(""), k(""), h());
    },
    I = async (s, a) => {
      if (
        r &&
        confirm(
          `Are you sure you want to delete ${a}? This will move the class to the Recycle Bin.`,
        )
      )
        try {
          const { error: n } = await m
            .from("classes")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", s)
            .eq("school_id", r);
          if (n) throw n;
          (i.success(`${a} moved to Recycle Bin.`), h());
        } catch (n) {
          i.error(n.message || "Failed to delete class.");
        }
    };
  return q
    ? e.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
        children: e.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            e.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            e.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading classes...",
            }),
          ],
        }),
      })
    : !r && !y
      ? e.jsx("div", {
          className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
          children: e.jsxs("div", {
            className:
              "max-w-md text-center p-6 bg-card rounded-2xl shadow-sm border border-border",
            children: [
              e.jsx("p", {
                className: "font-semibold mb-2 text-foreground",
                children: "School information not found.",
              }),
              e.jsx("p", {
                className: "text-sm text-muted-foreground",
                children:
                  "You are not associated with any school. Please contact the administrator.",
              }),
            ],
          }),
        })
      : e.jsxs(e.Fragment, {
          children: [
            e.jsx(H, {
              title: "Classes",
              breadcrumb: `${d} classes setup`,
              actions: e.jsxs("div", {
                className: "flex gap-3 items-center",
                children: [
                  e.jsxs("div", {
                    className: "relative w-48",
                    children: [
                      e.jsx(X, {
                        className:
                          "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                      }),
                      e.jsx("input", {
                        value: g,
                        onChange: (s) => E(s.target.value),
                        placeholder: "Search classes...",
                        className:
                          "w-full pl-9 pr-4 py-1.5 text-sm border border-border rounded-md bg-card text-foreground outline-none",
                      }),
                    ],
                  }),
                  e.jsxs("button", {
                    onClick: () => l(!0),
                    className:
                      "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 hover:opacity-90 cursor-pointer",
                    children: [e.jsx(T, { className: "size-4" }), " New Class"],
                  }),
                ],
              }),
            }),
            e.jsx("div", {
              className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
              children:
                f && x.length === 0
                  ? e.jsx("div", {
                      className: "text-center py-12 text-muted-foreground text-sm",
                      children: "Syncing class structures...",
                    })
                  : x.length === 0
                    ? e.jsxs("div", {
                        className:
                          "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                        children: [
                          e.jsx(Y, { className: "size-10 mx-auto text-muted-foreground" }),
                          e.jsx("h3", {
                            className: "font-semibold mt-3",
                            children: d === 0 ? "No classes yet" : "No matches",
                          }),
                          e.jsx("p", {
                            className: "text-sm text-muted-foreground mt-1",
                            children: "Create your first class to start adding students.",
                          }),
                          e.jsxs("button", {
                            onClick: () => l(!0),
                            className:
                              "mt-4 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer",
                            children: [e.jsx(T, { className: "size-4" }), " New Class"],
                          }),
                        ],
                      })
                    : e.jsxs("div", {
                        className: "space-y-6",
                        children: [
                          e.jsx("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                            children: x.map((s) =>
                              e.jsxs(
                                "div",
                                {
                                  className:
                                    "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs flex flex-col justify-between",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsxs("div", {
                                          className: "flex items-center justify-between",
                                          children: [
                                            e.jsx("h3", {
                                              className: "font-semibold text-lg",
                                              children: s.name,
                                            }),
                                            e.jsxs("span", {
                                              className: "text-xs text-muted-foreground",
                                              children: [s.student_count, " students"],
                                            }),
                                          ],
                                        }),
                                        e.jsx("p", {
                                          className: "text-sm text-muted-foreground mt-1",
                                          children:
                                            [s.grade, s.section].filter(Boolean).join(" · ") || "—",
                                        }),
                                      ],
                                    }),
                                    z &&
                                      e.jsx("div", {
                                        className:
                                          "flex justify-end pt-4 border-t border-border mt-4",
                                        children: e.jsxs("button", {
                                          onClick: () => I(s.id, s.name),
                                          className:
                                            "text-xs font-semibold text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer",
                                          title: "Delete Class",
                                          children: [
                                            e.jsx(J, { className: "size-3.5" }),
                                            " Delete",
                                          ],
                                        }),
                                      }),
                                  ],
                                },
                                s.id,
                              ),
                            ),
                          }),
                          e.jsxs("div", {
                            className:
                              "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
                            children: [
                              e.jsxs("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                  "Showing ",
                                  d > 0 ? o * c + 1 : 0,
                                  " to ",
                                  Math.min((o + 1) * c, d),
                                  " of ",
                                  d,
                                  " classes",
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex gap-2",
                                children: [
                                  e.jsx("button", {
                                    disabled: o === 0,
                                    onClick: () => p((s) => s - 1),
                                    className:
                                      "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                                    children: "Previous",
                                  }),
                                  e.jsx("button", {
                                    disabled: (o + 1) * c >= d,
                                    onClick: () => p((s) => s + 1),
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
            }),
            D &&
              e.jsx("div", {
                className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
                onClick: () => l(!1),
                children: e.jsxs("form", {
                  onClick: (s) => s.stopPropagation(),
                  onSubmit: F,
                  className:
                    "bg-card text-card-foreground rounded-xl p-6 w-full max-w-sm space-y-4 shadow-lg",
                  children: [
                    e.jsx("h2", { className: "font-semibold text-lg", children: "New Class" }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("label", {
                          className: "text-sm font-medium text-foreground",
                          children: "Class name *",
                        }),
                        e.jsx("input", {
                          required: !0,
                          value: N,
                          onChange: (s) => v(s.target.value),
                          placeholder: "e.g. Class 7-B",
                          className:
                            "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-2 gap-3",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className: "text-sm font-medium text-foreground",
                              children: "Grade",
                            }),
                            e.jsx("input", {
                              value: w,
                              onChange: (s) => C(s.target.value),
                              placeholder: "7",
                              className:
                                "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className: "text-sm font-medium text-foreground",
                              children: "Section",
                            }),
                            e.jsx("input", {
                              value: S,
                              onChange: (s) => k(s.target.value),
                              placeholder: "B",
                              className:
                                "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex gap-2 justify-end",
                      children: [
                        e.jsx("button", {
                          type: "button",
                          onClick: () => l(!1),
                          className:
                            "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                          children: "Cancel",
                        }),
                        e.jsx("button", {
                          type: "submit",
                          disabled: f,
                          className:
                            "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer",
                          children: f ? "Creating…" : "Create",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
          ],
        });
}
export { ee as component };
