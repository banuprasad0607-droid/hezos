import {
  h as B,
  a0 as H,
  X as O,
  M as o,
  x as e,
  P as W,
  L as G,
  a as K,
  N as z,
} from "./index-DrqTZ7SR.js";
import { k as d } from "./vendor-charts-DECNlt_G.js";
import { C as X, I as J } from "./ImageCropper-D9CaAf2x.js";
import { w as Q } from "./notify-CFlpE6Mr.js";
import { A as V } from "./arrow-left-OIn1xrb6.js";
import { M as Y } from "./mail-BgE7oUjd.js";
import { P as Z } from "./phone-BvCyC-cH.js";
import { C as ee } from "./calendar-check-DuiRifj2.js";
import { M as te } from "./message-square-BVAiuQO7.js";
import { W as se } from "./wallet-CZbtwORR.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function he() {
  const { studentId: r } = B.useParams(),
    { currentSchoolId: n, loading: c } = H();
  O("Student Profile");
  const [s, v] = d.useState(null),
    [m, L] = d.useState([]),
    [g, D] = d.useState([]),
    [b, F] = d.useState([]),
    [u, R] = d.useState([]),
    [w, j] = d.useState(null),
    [y, k] = d.useState(!1),
    U = async (t) => {
      if (s) {
        (j(null), k(!0));
        try {
          const a = atob(t.split(",")[1]),
            l = new ArrayBuffer(a.length),
            N = new Uint8Array(l);
          for (let p = 0; p < a.length; p++) N[p] = a.charCodeAt(p);
          const _ = new Blob([l], { type: "image/jpeg" }),
            x = `${s.school_id}/student/${r}-${Date.now()}.jpg`,
            { error: $ } = await o.storage
              .from("student-photos")
              .upload(x, _, { contentType: "image/jpeg", cacheControl: "3600", upsert: !0 });
          if ($) throw $;
          const { data: E } = o.storage.from("student-photos").getPublicUrl(x),
            A = E.publicUrl,
            { error: q } = await o
              .from("students")
              .update({ photo_url: A })
              .eq("id", r)
              .eq("school_id", s.school_id);
          if (q) throw q;
          (v({ ...s, photo_url: A }), z.success("Student photo updated successfully!"));
        } catch (a) {
          z.error(a.message || "Failed to update profile photo.");
        } finally {
          k(!1);
        }
      }
    };
  if (
    (d.useEffect(() => {
      n &&
        (async () => {
          const { data: t } = await o
            .from("students")
            .select(
              "id, full_name, admission_number, roll_number, photo_url, date_of_birth, gender, address, parent_name, parent_email, parent_phone, parent_user_id, class_id, school_id, classes(name)",
            )
            .eq("id", r)
            .eq("school_id", n)
            .is("deleted_at", null)
            .maybeSingle();
          if (!t) return;
          const a = {
            ...t,
            classes: Array.isArray(t.classes) ? (t.classes[0] ?? null) : t.classes,
          };
          v(a);
          const [l, N, _, x] = await Promise.all([
            o
              .from("attendance")
              .select("date, status")
              .eq("student_id", r)
              .eq("school_id", n)
              .is("deleted_at", null)
              .order("date", { ascending: !1 })
              .limit(60),
            o
              .from("remarks")
              .select("id, category, content, created_at")
              .eq("student_id", r)
              .eq("school_id", n)
              .is("deleted_at", null)
              .order("created_at", { ascending: !1 })
              .limit(30),
            o
              .from("fee_invoices")
              .select("id, title, period, amount_due, amount_paid, status, due_date")
              .eq("student_id", r)
              .eq("school_id", n)
              .is("deleted_at", null)
              .order("created_at", { ascending: !1 }),
            a.class_id
              ? o
                  .from("homework")
                  .select("id, title, subject, due_date, created_at")
                  .eq("class_id", a.class_id)
                  .eq("school_id", n)
                  .order("created_at", { ascending: !1 })
                  .limit(20)
              : Promise.resolve({ data: [] }),
          ]);
          (L(l.data ?? []), F(N.data ?? []), R(_.data ?? []), D(x.data ?? []));
        })();
    }, [r, n]),
    !s)
  )
    return c
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
          className: "p-8 text-sm text-muted-foreground",
          children: "Loading student profile…",
        });
  const P = m.filter((t) => t.status === "present").length,
    T = m.length ? Math.round((P / m.length) * 100) : 0,
    S = u.reduce((t, a) => t + Number(a.amount_due), 0),
    I = u.reduce((t, a) => t + Number(a.amount_paid), 0),
    M = S - I,
    C = Q(s.parent_phone, `Hello ${s.parent_name ?? ""}, this is regarding ${s.full_name}.`);
  return c
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
          e.jsx(W, {
            title: s.full_name,
            breadcrumb: e.jsxs(G, {
              to: "/students",
              className: "inline-flex items-center gap-1 hover:text-foreground",
              children: [e.jsx(V, { className: "size-3" }), " Students"],
            }),
            actions: C
              ? e.jsx("a", {
                  href: C,
                  target: "_blank",
                  rel: "noreferrer",
                  className: "px-3 py-1.5 text-sm font-medium bg-[#25D366] text-white rounded-md",
                  children: "WhatsApp Parent",
                })
              : null,
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-8 space-y-6",
            children: [
              e.jsxs("section", {
                className: "bg-card border border-border rounded-xl p-6 flex items-center gap-6",
                children: [
                  e.jsxs("div", {
                    className:
                      "relative group size-20 rounded-full bg-brand/20 text-brand flex items-center justify-center text-2xl font-bold overflow-hidden border border-border shrink-0",
                    children: [
                      s.photo_url
                        ? e.jsx("img", {
                            src: s.photo_url,
                            alt: "",
                            className: "size-full object-cover",
                          })
                        : s.full_name
                            .split(" ")
                            .map((t) => t[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase(),
                      e.jsxs("label", {
                        className:
                          "absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-white",
                        children: [
                          e.jsx(X, { className: "size-5 mb-0.5" }),
                          e.jsx("span", {
                            className: "text-[9px] uppercase font-bold tracking-wider",
                            children: y ? "Saving..." : "Update",
                          }),
                          e.jsx("input", {
                            type: "file",
                            accept: "image/*",
                            disabled: y,
                            onChange: (t) => {
                              const a = t.target.files?.[0];
                              if (a) {
                                const l = new FileReader();
                                ((l.onload = () => j(l.result)), l.readAsDataURL(a));
                              }
                            },
                            className: "hidden",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex-1 grid grid-cols-2 md:grid-cols-4 gap-4",
                    children: [
                      e.jsx(i, {
                        label: "Admission #",
                        value: s.admission_number ?? "—",
                        mono: !0,
                      }),
                      e.jsx(i, { label: "Class", value: s.classes?.name ?? "—" }),
                      e.jsx(i, { label: "Roll #", value: s.roll_number ?? "—" }),
                      e.jsx(i, { label: "DOB", value: s.date_of_birth ?? "—" }),
                      e.jsx(i, { label: "Gender", value: s.gender ?? "—" }),
                      e.jsx(i, { label: "Parent", value: s.parent_name ?? "—" }),
                      e.jsx(i, {
                        label: "Contact",
                        value: e.jsxs("div", {
                          className: "text-xs space-y-0.5",
                          children: [
                            s.parent_email &&
                              e.jsxs("p", {
                                className: "inline-flex items-center gap-1",
                                children: [e.jsx(Y, { className: "size-3" }), s.parent_email],
                              }),
                            s.parent_phone &&
                              e.jsxs("p", {
                                className: "inline-flex items-center gap-1",
                                children: [e.jsx(Z, { className: "size-3" }), s.parent_phone],
                              }),
                            !s.parent_email && !s.parent_phone && "—",
                          ],
                        }),
                      }),
                      e.jsx(i, { label: "Address", value: s.address ?? "—" }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                children: [
                  e.jsx(h, {
                    icon: e.jsx(ee, { className: "size-4" }),
                    label: "Attendance (60d)",
                    value: `${T}%`,
                    hint: `${P}/${m.length} present`,
                  }),
                  e.jsx(h, {
                    icon: e.jsx(K, { className: "size-4" }),
                    label: "Homework posted",
                    value: String(g.length),
                    hint: "Last 20 items",
                  }),
                  e.jsx(h, {
                    icon: e.jsx(te, { className: "size-4" }),
                    label: "Teacher remarks",
                    value: String(b.length),
                    hint: "Total",
                  }),
                  e.jsx(h, {
                    icon: e.jsx(se, { className: "size-4" }),
                    label: "Outstanding",
                    value: `₹${M.toFixed(0)}`,
                    hint: `Of ₹${S.toFixed(0)} billed`,
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                  e.jsx(f, {
                    title: "Attendance — last 60 days",
                    children: e.jsxs("div", {
                      className: "flex flex-wrap gap-1",
                      children: [
                        m
                          .slice()
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
                        m.length === 0 &&
                          e.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: "No records.",
                          }),
                      ],
                    }),
                  }),
                  e.jsx(f, {
                    title: "Remarks timeline",
                    children:
                      b.length === 0
                        ? e.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: "No remarks yet.",
                          })
                        : e.jsx("div", {
                            className: "space-y-3",
                            children: b.slice(0, 8).map((t) =>
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
                                      className: "text-sm italic mt-0.5",
                                      children: ['"', t.content, '"'],
                                    }),
                                    e.jsx("p", {
                                      className: "text-[10px] text-muted-foreground mt-0.5",
                                      children: new Date(t.created_at).toLocaleDateString(),
                                    }),
                                  ],
                                },
                                t.id,
                              ),
                            ),
                          }),
                  }),
                  e.jsx(f, {
                    title: "Fee history",
                    children:
                      u.length === 0
                        ? e.jsx("p", {
                            className: "text-sm text-muted-foreground",
                            children: "No invoices.",
                          })
                        : e.jsx("div", {
                            className: "space-y-2",
                            children: u.map((t) =>
                              e.jsxs(
                                "div",
                                {
                                  className:
                                    "flex items-center justify-between text-sm border-b border-border pb-2 last:border-0",
                                  children: [
                                    e.jsxs("div", {
                                      children: [
                                        e.jsx("p", { className: "font-medium", children: t.title }),
                                        e.jsxs("p", {
                                          className: "text-xs text-muted-foreground",
                                          children: [t.period, " · Due ", t.due_date ?? "—"],
                                        }),
                                      ],
                                    }),
                                    e.jsxs("div", {
                                      className: "text-right",
                                      children: [
                                        e.jsxs("p", {
                                          className: "font-mono text-xs",
                                          children: [
                                            "₹",
                                            Number(t.amount_paid).toFixed(0),
                                            " / ₹",
                                            Number(t.amount_due).toFixed(0),
                                          ],
                                        }),
                                        e.jsx("span", {
                                          className: `text-[10px] uppercase font-semibold ${t.status === "paid" ? "text-success" : t.status === "partial" ? "text-warning" : "text-muted-foreground"}`,
                                          children: t.status,
                                        }),
                                      ],
                                    }),
                                  ],
                                },
                                t.id,
                              ),
                            ),
                          }),
                  }),
                ],
              }),
              e.jsx(f, {
                title: "Recent class homework",
                children:
                  g.length === 0
                    ? e.jsx("p", {
                        className: "text-sm text-muted-foreground",
                        children: "No homework posted.",
                      })
                    : e.jsx("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-3",
                        children: g.map((t) =>
                          e.jsxs(
                            "div",
                            {
                              className: "border border-border rounded-lg p-3",
                              children: [
                                e.jsx("p", {
                                  className:
                                    "text-[10px] uppercase tracking-wider font-bold text-muted-foreground",
                                  children: t.subject ?? "General",
                                }),
                                e.jsx("p", { className: "font-medium text-sm", children: t.title }),
                                e.jsxs("p", {
                                  className: "text-xs text-muted-foreground mt-1",
                                  children: [
                                    "Due ",
                                    t.due_date ?? "—",
                                    " · Posted ",
                                    new Date(t.created_at).toLocaleDateString(),
                                  ],
                                }),
                              ],
                            },
                            t.id,
                          ),
                        ),
                      }),
              }),
            ],
          }),
          w &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]",
              onClick: (t) => t.stopPropagation(),
              children: e.jsxs("div", {
                className: "bg-card p-6 rounded-xl w-full max-w-sm",
                onClick: (t) => t.stopPropagation(),
                children: [
                  e.jsx("h3", {
                    className: "font-bold text-base mb-3",
                    children: "Crop Profile Photo",
                  }),
                  e.jsx(J, { imageSrc: w, onCrop: U, onCancel: () => j(null), circular: !0 }),
                ],
              }),
            }),
        ],
      });
}
function i({ label: r, value: n, mono: c }) {
  return e.jsxs("div", {
    children: [
      e.jsx("p", {
        className: "text-[10px] uppercase tracking-wider text-muted-foreground",
        children: r,
      }),
      e.jsx("div", {
        className: `text-sm font-medium mt-0.5 ${c ? "font-mono" : ""}`,
        children: n,
      }),
    ],
  });
}
function h({ icon: r, label: n, value: c, hint: s }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-4",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-2 text-muted-foreground",
        children: [
          r,
          e.jsx("span", { className: "text-xs uppercase tracking-wider", children: n }),
        ],
      }),
      e.jsx("p", { className: "text-2xl font-bold mt-2", children: c }),
      s && e.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: s }),
    ],
  });
}
function f({ title: r, children: n }) {
  return e.jsxs("section", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [e.jsx("h3", { className: "font-semibold mb-3", children: r }), n],
  });
}
export { he as component };
