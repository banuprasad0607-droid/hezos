import {
  V as Z,
  _ as J,
  X as K,
  M as x,
  x as e,
  P as ee,
  C as te,
  k as B,
  n as S,
  i as se,
  A as M,
  a as ae,
  D as re,
  U as le,
  N as c,
  I as U,
} from "./index-DrqTZ7SR.js";
import { k as n } from "./vendor-charts-DECNlt_G.js";
import { E as ne } from "./vendor-pdf-BA8uJ8a4.js";
import { M as de } from "./message-square-BVAiuQO7.js";
import { C as oe } from "./calendar-check-DuiRifj2.js";
import { M as ie } from "./megaphone-DiOQmrUf.js";
import "./vendor-supabase-Bz3EdAMz.js";
const ce = (r) => {
  const o = {
    width: "360px",
    height: "450px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  };
  return r === "rank_1"
    ? {
        ...o,
        backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #fef9c2 50%, #f59e0b 100%)",
        color: "#1e293b",
        borderColor: "#fcd34d",
      }
    : r === "rank_2"
      ? {
          ...o,
          backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
          color: "#1e293b",
          borderColor: "#cbd5e1",
        }
      : r === "rank_3"
        ? {
            ...o,
            backgroundImage: "linear-gradient(135deg, #d97706 0%, #fef3c7 50%, #b45309 100%)",
            color: "#1e293b",
            borderColor: "#d97706",
          }
        : {
            ...o,
            backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
            color: "#ffffff",
            borderColor: "#312e81",
          };
};
function je() {
  const { user: r, profile: o } = Z(),
    D = J();
  K("Parent Dashboard");
  const [m, W] = n.useState([]),
    [g, z] = n.useState(""),
    [p, C] = n.useState([]),
    [v, A] = n.useState([]),
    [w, P] = n.useState([]),
    [R, E] = n.useState([]),
    [u, H] = n.useState(null),
    [I, q] = n.useState([]),
    [b, F] = n.useState(null),
    [xe, i] = n.useState(null);
  (n.useEffect(() => {
    r &&
      x
        .from("students")
        .select("id, full_name, class_id, school_id, photo_url, classes(name), schools(status)")
        .eq("parent_user_id", r.id)
        .then(({ data: t }) => {
          const d = (t ?? []).map((s) => ({
            ...s,
            classes: Array.isArray(s.classes) ? (s.classes[0] ?? null) : s.classes,
            schools: Array.isArray(s.schools) ? (s.schools[0] ?? null) : s.schools,
          }));
          (W(d), d[0] && !g && z(d[0].id));
        });
  }, [r]),
    n.useEffect(() => {
      const t = m.find((s) => s.id === g);
      if (!t) return;
      if (t.schools?.status === "suspended") {
        (C([]), A([]), P([]), E([]), H(null), q([]));
        return;
      }
      new Date().toISOString().slice(0, 10);
      const d = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      (async () => {
        const [s, j, l, h, f, N] = await Promise.all([
          x
            .from("attendance")
            .select("date, status")
            .eq("student_id", t.id)
            .gte("date", d)
            .order("date", { ascending: !1 }),
          t.class_id
            ? x
                .from("homework")
                .select("id, title, subject, due_date, file_url, file_type")
                .eq("class_id", t.class_id)
                .order("created_at", { ascending: !1 })
                .limit(10)
            : Promise.resolve({ data: [] }),
          x
            .from("remarks")
            .select("id, category, content, created_at")
            .eq("student_id", t.id)
            .order("created_at", { ascending: !1 })
            .limit(10),
          x
            .from("announcements")
            .select("id, title, body, created_at")
            .eq("school_id", t.school_id)
            .order("created_at", { ascending: !1 })
            .limit(5),
          x
            .from("rankings")
            .select("rank_position, percentage, gpa, academic_year")
            .eq("student_id", t.id)
            .eq("is_published", !0)
            .maybeSingle(),
          x
            .from("awards")
            .select("id, category, title, description, issued_at")
            .eq("student_id", t.id)
            .eq("is_published", !0)
            .order("issued_at", { ascending: !1 }),
        ]);
        (C(s.data ?? []),
          A(j.data ?? []),
          P(l.data ?? []),
          E(h.data ?? []),
          H(f.data || null),
          q(N.data || []));
      })();
    }, [g, m]));
  const a = m.find((t) => t.id === g),
    T = p[0],
    L = p.filter((t) => t.status === "present").length,
    G = p.length > 0 ? Math.round((L / p.length) * 100) : 0,
    X = (t) => {
      (F(t),
        i("png"),
        c.info("Preparing poster download..."),
        setTimeout(() => {
          const d = document.getElementById("parent-poster-export");
          if (!d) {
            (c.error("Poster container not found"), i(null));
            return;
          }
          U(d, { scale: 3, useCORS: !0, backgroundColor: null })
            .then((s) => {
              const j = s.toDataURL("image/png"),
                l = document.createElement("a");
              ((l.href = j),
                (l.download = `${a?.full_name || "student"}_achievement_poster.png`),
                document.body.appendChild(l),
                l.click(),
                document.body.removeChild(l),
                c.success("Poster downloaded!"),
                i(null));
            })
            .catch((s) => {
              (c.error("Failed to download poster: " + s.message), i(null));
            });
        }, 250));
    },
    Y = (t) => {
      (F(t),
        i("pdf"),
        c.info("Preparing certificate PDF..."),
        setTimeout(() => {
          const d = document.getElementById("parent-cert-export");
          if (!d) {
            (c.error("Certificate container not found"), i(null));
            return;
          }
          U(d, { scale: 3, useCORS: !0, backgroundColor: "#ffffff" })
            .then((s) => {
              const j = s.toDataURL("image/png"),
                l = new ne({ orientation: "landscape", unit: "pt", format: "a4" }),
                h = l.internal.pageSize.getWidth(),
                f = l.internal.pageSize.getHeight(),
                N = s.width / s.height,
                Q = h / f;
              let k = h,
                _ = f,
                O = 0,
                $ = 0;
              (N > Q ? ((_ = h / N), ($ = (f - _) / 2)) : ((k = f * N), (O = (h - k) / 2)),
                l.addImage(j, "PNG", O, $, k, _),
                l.save(`${a?.full_name || "student"}_certificate.pdf`),
                c.success("Certificate downloaded!"),
                i(null));
            })
            .catch((s) => {
              (c.error("Failed to download certificate: " + s.message), i(null));
            });
        }, 250));
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(ee, {
        title: "Parent Dashboard",
        breadcrumb: o?.full_name ?? "Parent",
        actions:
          m.length > 1
            ? e.jsx("select", {
                value: g,
                onChange: (t) => z(t.target.value),
                className: "px-3 py-1.5 text-sm border border-border rounded-md bg-card",
                children: m.map((t) =>
                  e.jsx("option", { value: t.id, children: t.full_name }, t.id),
                ),
              })
            : null,
      }),
      e.jsx("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children:
          m.length === 0
            ? e.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  e.jsx("h3", { className: "font-semibold", children: "No children linked yet" }),
                  e.jsxs("p", {
                    className: "text-sm text-muted-foreground mt-2 max-w-md mx-auto",
                    children: [
                      "Ask your child's school admin to add your email ",
                      e.jsx("span", { className: "font-mono", children: o?.email }),
                      " as the parent email for your child in their school's system. You'll be linked automatically.",
                    ],
                  }),
                ],
              })
            : a?.schools?.status === "suspended"
              ? e.jsxs("div", {
                  className:
                    "bg-card border border-border rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm",
                  children: [
                    e.jsx("div", {
                      className:
                        "size-12 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto mb-4",
                      children: e.jsx(te, { className: "size-6" }),
                    }),
                    e.jsx("h3", {
                      className: "text-lg font-semibold text-foreground",
                      children: "School Portal Suspended",
                    }),
                    e.jsxs("p", {
                      className: "text-sm text-muted-foreground mt-2",
                      children: [
                        "Access to the digital portal for ",
                        e.jsx("strong", { children: a.full_name }),
                        "'s school has been temporarily suspended.",
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground mt-1",
                      children:
                        "Please contact the school administration or system owner for support or reactivation queries.",
                    }),
                  ],
                })
              : e.jsxs(e.Fragment, {
                  children: [
                    e.jsxs("section", {
                      className:
                        "bg-primary text-primary-foreground rounded-2xl p-8 relative overflow-hidden",
                      children: [
                        e.jsx("div", {
                          className:
                            "absolute -right-8 -top-8 size-48 bg-brand/30 blur-3xl rounded-full",
                        }),
                        e.jsxs("div", {
                          className: "relative",
                          children: [
                            e.jsxs("div", {
                              className:
                                "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-foreground bg-brand/30 px-3 py-1 rounded-full",
                              children: [
                                e.jsx(B, { className: "size-3.5" }),
                                " Today's Digest · ",
                                new Date().toLocaleDateString(void 0, {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                }),
                              ],
                            }),
                            e.jsxs("h2", {
                              className: "text-3xl font-bold mt-4",
                              children: ["How ", a?.full_name.split(" ")[0], "'s day went"],
                            }),
                            e.jsx("p", {
                              className: "text-sm opacity-80 mt-2",
                              children:
                                "A daily summary your child's school sends every evening. Everything that happened — at a glance.",
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-6",
                              children: [
                                e.jsx(y, {
                                  label: "Attendance",
                                  value: T ? T.status.replace("_", " ") : "Not marked",
                                }),
                                e.jsx(y, {
                                  label: "Homework today",
                                  value: `${v.filter((t) => t.due_date && new Date(t.due_date) >= new Date(new Date().toDateString())).length}`,
                                }),
                                e.jsx(y, {
                                  label: "New remarks",
                                  value: `${w.filter((t) => new Date(t.created_at).toDateString() === new Date().toDateString()).length}`,
                                }),
                                e.jsx(y, { label: "30-day attendance", value: `${G}%` }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("section", {
                      className:
                        "bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4 text-foreground",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsxs("h3", {
                                  className:
                                    "font-bold text-lg text-slate-800 flex items-center gap-2",
                                  children: [
                                    e.jsx(S, { className: "text-amber-500 size-5" }),
                                    " Academic Ranks & Honor Roll",
                                  ],
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Officially published certifications and dashboard achievements.",
                                }),
                              ],
                            }),
                            u &&
                              e.jsxs("span", {
                                className:
                                  "bg-amber-50 text-amber-700 font-extrabold border border-amber-200 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs",
                                children: [
                                  e.jsx(B, { className: "size-3.5 text-amber-500 animate-pulse" }),
                                  " Rank Position: #",
                                  u.rank_position,
                                  " (",
                                  u.percentage,
                                  "%)",
                                ],
                              }),
                          ],
                        }),
                        I.length === 0
                          ? e.jsxs("div", {
                              className:
                                "text-center py-6 border border-dashed border-slate-100 rounded-xl text-xs text-muted-foreground",
                              children: [
                                "No published achievements or ranks available for ",
                                a?.full_name,
                                " at this time.",
                              ],
                            })
                          : e.jsx("div", {
                              className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                              children: I.map((t) =>
                                e.jsxs(
                                  "div",
                                  {
                                    className:
                                      "p-4 border border-slate-100 rounded-xl bg-slate-50/40 flex flex-col justify-between hover:border-slate-200 transition-colors",
                                    children: [
                                      e.jsxs("div", {
                                        className: "space-y-2",
                                        children: [
                                          e.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              e.jsx("span", {
                                                className:
                                                  "bg-brand/10 text-brand text-[9px] uppercase font-black px-2 py-0.5 rounded",
                                                children: V(t.category),
                                              }),
                                              e.jsx("span", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: new Date(
                                                  t.issued_at,
                                                ).toLocaleDateString(),
                                              }),
                                            ],
                                          }),
                                          e.jsx("h4", {
                                            className: "font-bold text-sm text-slate-800",
                                            children: t.title,
                                          }),
                                          e.jsx("p", {
                                            className: "text-xs text-slate-600 leading-relaxed",
                                            children: t.description,
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "flex gap-2 mt-4 pt-3 border-t border-slate-100/50",
                                        children: [
                                          e.jsxs("button", {
                                            onClick: () => X(t),
                                            className:
                                              "flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer",
                                            children: [
                                              e.jsx(se, { className: "size-3.5" }),
                                              " Share Poster",
                                            ],
                                          }),
                                          e.jsxs("button", {
                                            onClick: () => Y(t),
                                            className:
                                              "flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer",
                                            children: [
                                              e.jsx(M, { className: "size-3.5" }),
                                              " Certificate PDF",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  t.id,
                                ),
                              ),
                            }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                      children: [
                        e.jsxs("div", {
                          className: "lg:col-span-2 bg-card border border-border rounded-xl p-6",
                          children: [
                            e.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                e.jsx(ae, { className: "size-4 text-brand" }),
                                " Recent Homework",
                              ],
                            }),
                            v.length === 0
                              ? e.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No homework posted recently.",
                                })
                              : e.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: v.map((t) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between p-3 rounded-lg border border-border",
                                        children: [
                                          e.jsxs("div", {
                                            children: [
                                              e.jsx("p", {
                                                className: "text-sm font-medium",
                                                children: t.title,
                                              }),
                                              e.jsxs("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                  t.subject ?? "—",
                                                  " · Due ",
                                                  t.due_date ?? "—",
                                                ],
                                              }),
                                            ],
                                          }),
                                          t.file_url &&
                                            e.jsxs("a", {
                                              href: t.file_url,
                                              target: "_blank",
                                              rel: "noreferrer",
                                              className:
                                                "text-xs text-brand font-medium inline-flex items-center gap-1",
                                              children: [
                                                e.jsx(re, { className: "size-3" }),
                                                " ",
                                                t.file_type,
                                              ],
                                            }),
                                        ],
                                      },
                                      t.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "bg-card border border-border rounded-xl p-6",
                          children: [
                            e.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                e.jsx(de, { className: "size-4 text-brand" }),
                                " Teacher Remarks",
                              ],
                            }),
                            w.length === 0
                              ? e.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No remarks yet.",
                                })
                              : e.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: w.map((t) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className: "border-l-2 border-brand pl-3",
                                        children: [
                                          e.jsx("p", {
                                            className:
                                              "text-[10px] uppercase tracking-wider font-bold text-brand",
                                            children: t.category,
                                          }),
                                          e.jsxs("p", {
                                            className: "text-sm italic mt-1",
                                            children: ['"', t.content, '"'],
                                          }),
                                          e.jsx("p", {
                                            className: "text-[10px] text-muted-foreground mt-1",
                                            children: new Date(t.created_at).toLocaleDateString(),
                                          }),
                                        ],
                                      },
                                      t.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "bg-card border border-border rounded-xl p-6",
                          children: [
                            e.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                e.jsx(oe, { className: "size-4 text-brand" }),
                                " Last 30 Days",
                              ],
                            }),
                            e.jsx("div", {
                              className: "mt-4 flex flex-wrap gap-1",
                              children: p
                                .slice(0, 30)
                                .reverse()
                                .map((t) =>
                                  e.jsx(
                                    "div",
                                    {
                                      title: `${t.date} · ${t.status}`,
                                      className: `size-5 rounded ${t.status === "present" ? "bg-success" : t.status === "absent" ? "bg-danger" : t.status === "late" ? "bg-warning" : "bg-brand"}`,
                                    },
                                    t.date,
                                  ),
                                ),
                            }),
                            e.jsxs("p", {
                              className: "text-xs text-muted-foreground mt-3",
                              children: [L, " present out of ", p.length, " marked days"],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "lg:col-span-2 bg-card border border-border rounded-xl p-6",
                          children: [
                            e.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                e.jsx(ie, { className: "size-4 text-brand" }),
                                " School Announcements",
                              ],
                            }),
                            R.length === 0
                              ? e.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No announcements.",
                                })
                              : e.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: R.map((t) =>
                                    e.jsxs(
                                      "div",
                                      {
                                        className: "p-3 rounded-lg border border-border",
                                        children: [
                                          e.jsx("p", {
                                            className: "text-sm font-medium",
                                            children: t.title,
                                          }),
                                          e.jsx("p", {
                                            className:
                                              "text-xs text-muted-foreground mt-1 line-clamp-2",
                                            children: t.body,
                                          }),
                                          e.jsx("p", {
                                            className: "text-[10px] text-muted-foreground mt-1",
                                            children: new Date(t.created_at).toLocaleString(),
                                          }),
                                        ],
                                      },
                                      t.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
      }),
      e.jsxs("div", {
        style: { position: "absolute", left: "-9999px", top: "-9999px" },
        children: [
          b &&
            e.jsxs("div", {
              id: "parent-poster-export",
              style: ce(b.category),
              children: [
                e.jsx("div", {
                  className:
                    "absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                }),
                e.jsx("div", {
                  className:
                    "absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                }),
                e.jsxs("div", {
                  className: "flex items-center justify-between border-b border-black/10 pb-4",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        e.jsx("div", {
                          className:
                            "size-8 font-extrabold text-sm rounded-lg flex items-center justify-center bg-black/10 text-slate-800 shadow-xs",
                          children: "H",
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("h4", {
                              className: "font-extrabold text-xs tracking-wider",
                              children: D,
                            }),
                            e.jsx("p", {
                              className: "text-[7px] uppercase tracking-widest opacity-80",
                              children: "Empowering Academic Excellence",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsx("span", {
                      className: "text-[8px] font-bold uppercase tracking-wider opacity-90",
                      children: "Academic Showcase",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "flex flex-col items-center text-center my-6 space-y-4",
                  children: [
                    e.jsx("div", {
                      className:
                        "size-24 rounded-full border-4 border-black/10 bg-white/40 text-slate-700 flex items-center justify-center font-bold text-3xl shadow-lg relative overflow-hidden",
                      children: a?.photo_url
                        ? e.jsx("img", {
                            src: a.photo_url,
                            alt: "",
                            className: "size-full object-cover",
                            crossOrigin: "anonymous",
                          })
                        : a?.full_name?.slice(0, 1) || "S",
                    }),
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("p", {
                          className: "text-[10px] uppercase font-bold tracking-widest opacity-70",
                          children: "Honor Roll Achievement",
                        }),
                        e.jsx("h3", {
                          className: "text-2xl font-black tracking-tight",
                          children: a?.full_name,
                        }),
                        e.jsx("p", {
                          className: "text-xs font-semibold opacity-90",
                          children: a?.classes?.name,
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className:
                        "px-5 py-3 bg-white/40 border border-black/5 rounded-2xl text-center shadow-md space-y-1 max-w-[200px]",
                      children: [
                        e.jsxs("div", {
                          className:
                            "flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-500",
                          children: [
                            e.jsx(S, { className: "size-4 animate-bounce" }),
                            " ",
                            V(b.category),
                          ],
                        }),
                        e.jsx("div", {
                          className: "text-[9px] uppercase tracking-wider opacity-85 font-bold",
                          children: "Verified Honor",
                        }),
                        u &&
                          e.jsxs("div", {
                            className: "text-[10px] font-black text-brand",
                            children: ["GPA ", u.gpa, " · Percentage ", u.percentage, "%"],
                          }),
                      ],
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "flex items-end justify-between border-t border-black/10 pt-4 text-left",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsx("span", {
                          className: "text-[8px] uppercase tracking-wider font-bold opacity-60",
                          children: "Verification Code",
                        }),
                        e.jsx("div", {
                          className:
                            "p-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center",
                          children: e.jsx("img", {
                            src: `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=VERIFY-${a?.full_name}-HZ`,
                            alt: "Verification QR",
                            className: "size-8",
                          }),
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "text-right space-y-2",
                      children: [
                        e.jsx("span", {
                          className:
                            "font-serif italic text-amber-600 font-bold text-sm tracking-wide block",
                          children: "Nirosha Reddy",
                        }),
                        e.jsx("div", { className: "h-[1px] w-24 bg-black/10 ml-auto" }),
                        e.jsx("span", {
                          className: "text-[8px] uppercase font-bold tracking-wider opacity-70",
                          children: "School Principal",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          b &&
            e.jsxs("div", {
              id: "parent-cert-export",
              className:
                "w-[640px] aspect-[1.414] bg-[#FDFBF7] p-12 border-[12px] border-amber-800 rounded-sm shadow-2xl relative flex flex-col justify-between items-center text-center text-slate-800",
              children: [
                e.jsx("div", {
                  className: "absolute inset-2 border-[2px] border-amber-400 pointer-events-none",
                }),
                e.jsx("div", {
                  className:
                    "absolute top-4 left-4 size-8 border-t-2 border-l-2 border-amber-600 pointer-events-none",
                }),
                e.jsx("div", {
                  className:
                    "absolute top-4 right-4 size-8 border-t-2 border-r-2 border-amber-600 pointer-events-none",
                }),
                e.jsx("div", {
                  className:
                    "absolute bottom-4 left-4 size-8 border-b-2 border-l-2 border-amber-600 pointer-events-none",
                }),
                e.jsx("div", {
                  className:
                    "absolute bottom-4 right-4 size-8 border-b-2 border-r-2 border-amber-600 pointer-events-none",
                }),
                e.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-center gap-2",
                      children: [
                        e.jsx(S, { className: "size-8 text-amber-500" }),
                        e.jsx("h2", {
                          className:
                            "font-serif italic font-extrabold text-2xl tracking-wider text-amber-900",
                          children: D,
                        }),
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-[8px] uppercase tracking-widest font-black opacity-85",
                      children: "Affiliated School Certificate of Honors",
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className: "space-y-4 my-4 flex flex-col items-center",
                  children: [
                    e.jsx("h3", {
                      className: "font-serif text-2xl font-extrabold text-amber-800 tracking-tight",
                      children: "CERTIFICATE OF EXCELLENCE",
                    }),
                    e.jsx("div", {
                      className:
                        "size-14 rounded-full border-2 border-amber-400 bg-white overflow-hidden shadow-xs flex items-center justify-center my-1",
                      children: a?.photo_url
                        ? e.jsx("img", {
                            src: a.photo_url,
                            alt: "",
                            className: "size-full object-cover",
                            crossOrigin: "anonymous",
                          })
                        : e.jsx(le, { className: "size-6 text-slate-300" }),
                    }),
                    e.jsx("p", {
                      className: "text-[10px] italic text-slate-600",
                      children: "This certificate is proudly presented to",
                    }),
                    e.jsx("h4", {
                      className:
                        "font-serif text-xl font-black border-b border-amber-200 pb-0.5 px-6 text-amber-900 inline-block",
                      children: a?.full_name,
                    }),
                    e.jsxs("p", {
                      className: "text-xs text-slate-600 max-w-lg mx-auto leading-relaxed",
                      children: [
                        "Awarded for outstanding achievements in ",
                        e.jsx("span", { className: "font-bold text-amber-800", children: b.title }),
                        ". Demonstrated academic dedication, good character, and excellence in school values for the term.",
                      ],
                    }),
                  ],
                }),
                e.jsxs("div", {
                  className:
                    "w-full flex items-end justify-between px-10 border-t border-slate-100 pt-6",
                  children: [
                    e.jsxs("div", {
                      className: "text-center space-y-1.5 w-32 text-xs",
                      children: [
                        e.jsx("span", {
                          className:
                            "font-serif italic text-amber-700 font-semibold text-xs tracking-wide",
                          children: "Nirosha Reddy",
                        }),
                        e.jsx("div", { className: "h-[1px] bg-slate-300 w-full" }),
                        e.jsx("span", {
                          className: "text-[7px] uppercase font-bold tracking-wider opacity-70",
                          children: "School Principal",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className:
                        "size-16 rounded-full border-4 border-amber-400 bg-amber-50 shadow-md flex items-center justify-center relative shrink-0",
                      children: [
                        e.jsx("div", {
                          className:
                            "absolute inset-0.5 border border-dashed border-amber-400 rounded-full",
                        }),
                        e.jsx(M, { className: "size-8 text-amber-500" }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "text-center space-y-1.5 w-32 text-xs",
                      children: [
                        e.jsx("span", {
                          className: "font-bold text-slate-700",
                          children: new Date(b.issued_at).toLocaleDateString(),
                        }),
                        e.jsx("div", { className: "h-[1px] bg-slate-300 w-full" }),
                        e.jsx("span", {
                          className: "text-[7px] uppercase font-bold tracking-wider opacity-70",
                          children: "Issued Date",
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
function y({ label: r, value: o }) {
  return e.jsxs("div", {
    className: "bg-white/10 backdrop-blur rounded-lg p-3",
    children: [
      e.jsx("p", { className: "text-[10px] uppercase tracking-wider opacity-60", children: r }),
      e.jsx("p", { className: "text-lg font-semibold capitalize mt-1", children: o }),
    ],
  });
}
function V(r) {
  return (
    {
      rank_1: "Gold Rank Topper",
      rank_2: "Silver Rank #2",
      rank_3: "Bronze Rank #3",
      top_10: "Top 10 Scholar",
      subject_topper: "Subject Topper",
      attendance_topper: "Attendance Champion",
      discipline_award: "Best Discipline Award",
    }[r] || r.toUpperCase().replace("_", " ")
  );
}
export { je as component };
