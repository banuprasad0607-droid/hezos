import { a0 as R, X as E, M as r, x as e, L as b, o as j, c as P } from "./index-DrqTZ7SR.js";
import { k as g } from "./vendor-charts-DECNlt_G.js";
import { B as q } from "./building-2-U_CRqHUZ.js";
import { F as B } from "./file-text-DPnrzn5L.js";
import { A as z } from "./arrow-right-rZebaCwW.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function U() {
  const { currentSchoolId: t, profile: i, roles: d, loading: m, error: x } = R();
  E("Dashboard");
  const [s, N] = g.useState(null),
    [l, v] = g.useState([]),
    o = d.includes("parent") && !d.includes("admin") && !d.includes("teacher");
  if (
    (g.useEffect(() => {
      if (!t || o) return;
      let a = !0;
      const u = async () => {
        const h = new Date().toISOString().slice(0, 10),
          [k, T, p, A, _, F] = await Promise.all([
            r.from("students").select("id", { count: "exact", head: !0 }).eq("school_id", t),
            r
              .from("user_roles")
              .select("user_id", { count: "exact", head: !0 })
              .eq("school_id", t)
              .eq("role", "teacher"),
            r.from("attendance").select("status").eq("school_id", t).eq("date", h),
            r
              .from("homework")
              .select("id", { count: "exact", head: !0 })
              .eq("school_id", t)
              .gte("created_at", h),
            r
              .from("homework")
              .select("id", { count: "exact", head: !0 })
              .eq("school_id", t)
              .gte("due_date", h),
            r
              .from("remarks")
              .select("id, category, content, created_at, students(full_name)")
              .eq("school_id", t)
              .order("created_at", { ascending: !1 })
              .limit(5),
          ]);
        if (!a) return;
        const S = (p.data ?? []).filter(
          (n) => n.status === "present" || n.status === "late" || n.status === "half_day",
        ).length;
        (N({
          students: k.count ?? 0,
          teachers: T.count ?? 0,
          attendanceToday: { present: S, total: p.data?.length ?? 0 },
          homeworkToday: A.count ?? 0,
          pendingHomework: _.count ?? 0,
        }),
          v(
            (F.data ?? []).map((n) => {
              const f = n.students,
                D = Array.isArray(f) ? (f[0] ?? null) : f;
              return {
                id: n.id,
                category: n.category,
                content: n.content,
                created_at: n.created_at,
                student: D,
              };
            }),
          ));
      };
      u();
      const y = r
        .channel(`dashboard-${t}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "attendance", filter: `school_id=eq.${t}` },
          () => {
            u();
          },
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "remarks", filter: `school_id=eq.${t}` },
          () => {
            u();
          },
        )
        .subscribe();
      return () => {
        ((a = !1), r.removeChannel(y));
      };
    }, [t, o]),
    m)
  )
    return e.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
      children: e.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          e.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          e.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading dashboard information...",
          }),
        ],
      }),
    });
  if (x)
    return e.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
      children: e.jsxs("div", {
        className:
          "max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100",
        children: [
          e.jsx("p", {
            className: "text-danger font-semibold mb-2",
            children: "Unable to load dashboard.",
          }),
          e.jsx("p", {
            className: "text-sm text-muted-foreground mb-4",
            children: "Please contact the administrator or check your connection.",
          }),
          e.jsx("button", {
            onClick: () => window.location.reload(),
            className:
              "bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90",
            children: "Retry",
          }),
        ],
      }),
    });
  const w = d.includes("super_admin");
  return !t && !o && !w
    ? e.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
        children: e.jsxs("div", {
          className:
            "max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100",
          children: [
            e.jsx("p", {
              className: "font-semibold mb-2 text-foreground",
              children: "School information not found.",
            }),
            e.jsx("p", {
              className: "text-sm text-muted-foreground mb-4",
              children: "You are not associated with any school. Please contact the administrator.",
            }),
          ],
        }),
      })
    : o
      ? e.jsxs("div", {
          className: "p-8",
          children: [
            e.jsx("h1", { className: "text-2xl font-bold", children: "Welcome back!" }),
            e.jsx(b, {
              to: "/parent",
              className: "mt-4 inline-block text-brand font-medium",
              children: "Open Parent Dashboard →",
            }),
          ],
        })
      : e.jsxs("div", {
          className: "flex-1 overflow-y-auto bg-[#F9FAFB] p-8 space-y-6 text-foreground",
          children: [
            e.jsxs("div", {
              className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsxs("h1", {
                      className: "text-3xl font-bold tracking-tight",
                      children: ["Welcome back, ", i?.full_name?.split(" ")[0] || "Admin"],
                    }),
                    e.jsxs("p", {
                      className: "text-muted-foreground text-sm mt-1",
                      children: [
                        d.includes("admin") ? "Admin Dashboard" : "Teacher Dashboard",
                        " • School Management & Academics",
                      ],
                    }),
                  ],
                }),
                e.jsxs(b, {
                  to: "/students",
                  className:
                    "bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm inline-flex items-center gap-2",
                  children: [e.jsx(j, { className: "size-4" }), " Manage Students"],
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
              children: [
                e.jsx(c, {
                  label: "TOTAL STUDENTS",
                  value: s?.students ?? 0,
                  subtext: "Enrolled",
                  subtextColor: "text-success",
                  icon: e.jsx(j, { className: "size-5 text-brand" }),
                  iconBg: "bg-brand/10",
                }),
                e.jsx(c, {
                  label: "ATTENDANCE TODAY",
                  value: s?.attendanceToday.present ?? 0,
                  subtext: s?.attendanceToday.total
                    ? `of ${s.attendanceToday.total} marked`
                    : "Not marked yet",
                  icon: e.jsx(P, { className: "size-5 text-warning" }),
                  iconBg: "bg-warning/10",
                }),
                e.jsx(c, {
                  label: "TEACHERS",
                  value: s?.teachers ?? 0,
                  subtext: "Active staff members",
                  icon: e.jsx(q, { className: "size-5 text-brand" }),
                  iconBg: "bg-brand/10",
                }),
                e.jsx(c, {
                  label: "PENDING HOMEWORK",
                  value: s?.pendingHomework ?? 0,
                  subtext: "Due from today onwards",
                  icon: e.jsx(B, { className: "size-5 text-muted-foreground" }),
                  iconBg: "bg-slate-200",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4",
              children: [
                e.jsxs("div", {
                  className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between mb-2",
                      children: [
                        e.jsx("h3", {
                          className: "text-lg font-bold",
                          children: "Recent Remarks & Feedback",
                        }),
                        e.jsxs("span", {
                          className:
                            "bg-warning/15 text-warning text-xs font-semibold px-2 py-1 rounded-full",
                          children: [l.length, " recent"],
                        }),
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-sm text-muted-foreground mb-6",
                      children: "Review and acknowledge student remarks",
                    }),
                    e.jsx("div", {
                      className: "space-y-4",
                      children:
                        l.length === 0
                          ? e.jsx("div", {
                              className: "text-sm text-muted-foreground text-center py-4",
                              children: "No recent remarks.",
                            })
                          : l.map((a) =>
                              e.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex items-center gap-3",
                                      children: [
                                        e.jsx("div", {
                                          className:
                                            "size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm uppercase",
                                          children: a.student?.full_name?.slice(0, 1) || "S",
                                        }),
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx("p", {
                                              className: "font-semibold text-sm",
                                              children: a.student?.full_name || "Unknown Student",
                                            }),
                                            e.jsxs("p", {
                                              className:
                                                "text-xs text-muted-foreground capitalize mt-0.5",
                                              children: [
                                                a.category,
                                                " • ",
                                                a.content.length > 30
                                                  ? a.content.slice(0, 30) + "..."
                                                  : a.content,
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "flex items-center gap-2",
                                      children: [
                                        e.jsx("button", {
                                          className:
                                            "bg-brand text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors",
                                          children: "Acknowledge",
                                        }),
                                        e.jsx("button", {
                                          className:
                                            "bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors",
                                          children: "Dismiss",
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                a.id,
                              ),
                            ),
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between mb-2",
                      children: [
                        e.jsx("h3", {
                          className: "text-lg font-bold",
                          children: "Academic Progress",
                        }),
                        e.jsxs(b, {
                          to: "/attendance",
                          className:
                            "text-sm font-medium flex items-center gap-1 hover:text-brand transition-colors",
                          children: ["View All ", e.jsx(z, { className: "size-4" })],
                        }),
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-sm text-muted-foreground mb-6",
                      children: "Daily school activity progress",
                    }),
                    e.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className: "flex justify-between text-sm mb-2",
                              children: [
                                e.jsx("span", {
                                  className: "text-slate-600",
                                  children: "Overall Attendance",
                                }),
                                e.jsxs("span", {
                                  className: "font-semibold text-brand",
                                  children: [
                                    s?.attendanceToday.total
                                      ? Math.round(
                                          (s.attendanceToday.present / s.attendanceToday.total) *
                                            100,
                                        )
                                      : 0,
                                    "%",
                                  ],
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                              children: e.jsx("div", {
                                className:
                                  "h-full bg-brand rounded-full transition-all duration-500",
                                style: {
                                  width: `${s?.attendanceToday.total ? (s.attendanceToday.present / s.attendanceToday.total) * 100 : 0}%`,
                                },
                              }),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className: "flex justify-between text-sm mb-2",
                              children: [
                                e.jsx("span", {
                                  className: "text-slate-600",
                                  children: "Homework Assigned Today",
                                }),
                                e.jsx("span", {
                                  className: "font-semibold text-success",
                                  children: s?.homeworkToday ?? 0,
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                              children: e.jsx("div", {
                                className:
                                  "h-full bg-success rounded-full transition-all duration-500",
                                style: {
                                  width: `${Math.min(((s?.homeworkToday ?? 0) / 10) * 100, 100)}%`,
                                },
                              }),
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsxs("div", {
                              className: "flex justify-between text-sm mb-2",
                              children: [
                                e.jsx("span", {
                                  className: "text-slate-600",
                                  children: "Pending Actions",
                                }),
                                e.jsx("span", {
                                  className: "font-semibold text-danger",
                                  children: "0",
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100",
                      children: [
                        e.jsxs("div", {
                          className: "text-center",
                          children: [
                            e.jsx("p", {
                              className: "text-2xl font-bold",
                              children: s?.attendanceToday.present ?? 0,
                            }),
                            e.jsx("p", {
                              className: "text-xs text-muted-foreground mt-1",
                              children: "Present",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "text-center",
                          children: [
                            e.jsx("p", {
                              className: "text-2xl font-bold",
                              children: s?.homeworkToday ?? 0,
                            }),
                            e.jsx("p", {
                              className: "text-xs text-muted-foreground mt-1",
                              children: "Homework",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "text-center",
                          children: [
                            e.jsx("p", { className: "text-2xl font-bold", children: l.length }),
                            e.jsx("p", {
                              className: "text-xs text-muted-foreground mt-1",
                              children: "Remarks",
                            }),
                          ],
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
function c({
  label: t,
  value: i,
  subtext: d,
  subtextColor: m = "text-muted-foreground",
  icon: x,
  iconBg: s,
}) {
  return e.jsxs("div", {
    className:
      "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between",
    children: [
      e.jsxs("div", {
        children: [
          e.jsx("p", {
            className: "text-xs font-semibold text-muted-foreground mb-1 tracking-wider uppercase",
            children: t,
          }),
          e.jsxs("div", {
            className: "flex items-end gap-2",
            children: [
              e.jsx("h3", { className: "text-3xl font-bold text-foreground", children: i }),
              d && e.jsx("span", { className: `text-xs font-medium mb-1 ${m}`, children: d }),
            ],
          }),
        ],
      }),
      e.jsx("div", {
        className: `size-12 rounded-xl flex items-center justify-center shrink-0 ${s}`,
        children: x,
      }),
    ],
  });
}
export { U as component };
