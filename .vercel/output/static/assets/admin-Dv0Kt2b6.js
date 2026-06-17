import {
  r as N,
  x as e,
  E as re,
  R as oe,
  N as d,
  a0 as ae,
  V as ne,
  X as de,
  W as ie,
  M as l,
  P as $,
  j as O,
  o as le,
  G as ce,
  a as me,
  L as M,
  l as ue,
} from "./index-DrqTZ7SR.js";
import { k as i } from "./vendor-charts-DECNlt_G.js";
import { u as Y, g as xe, r as he } from "./platform.functions-De0vHKEw.js";
import { C as F } from "./copy-BMBYjm5K.js";
import { W as fe } from "./wallet-CZbtwORR.js";
import { C as pe } from "./calendar-check-DuiRifj2.js";
import { M as be } from "./message-square-BVAiuQO7.js";
import { M as ge } from "./megaphone-DiOQmrUf.js";
import { U as H } from "./user-plus-ionEV5TK.js";
import { B } from "./building-2-U_CRqHUZ.js";
import { S as ye } from "./shield-check-DxZCxexz.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const je = [
    ["path", { d: "m16 3 4 4-4 4", key: "1x1c3m" }],
    ["path", { d: "M20 7H4", key: "zbl0bi" }],
    ["path", { d: "m8 21-4-4 4-4", key: "h9nckh" }],
    ["path", { d: "M4 17h16", key: "g4d7ey" }],
  ],
  ve = N("arrow-right-left", je);
const Ne = [
    [
      "path",
      {
        d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
        key: "ct8e1f",
      },
    ],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
    [
      "path",
      {
        d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
        key: "13bj9a",
      },
    ],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ],
  we = N("eye-off", Ne);
const _e = [
    [
      "path",
      { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4", key: "g0fldk" },
    ],
    ["path", { d: "m21 2-9.6 9.6", key: "1j0ho8" }],
    ["circle", { cx: "7.5", cy: "15.5", r: "5.5", key: "yqb3hr" }],
  ],
  ke = N("key", _e);
const Se = [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476",
      },
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }],
  ],
  Ce = N("save", Se);
const Ae = [
    ["path", { d: "m2 2 20 20", key: "1ooewy" }],
    [
      "path",
      {
        d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71",
        key: "1jlk70",
      },
    ],
    [
      "path",
      {
        d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264",
        key: "18rp1v",
      },
    ],
  ],
  qe = N("shield-off", Ae);
function Pe({ schoolId: a }) {
  const x = Y(xe),
    m = Y(he),
    [p, R] = i.useState(null),
    [r, b] = i.useState(null),
    [C, h] = i.useState(!0),
    [u, g] = i.useState(!1),
    [f, y] = i.useState(!1),
    j = async () => {
      h(!0);
      try {
        const n = await x({ data: { schoolId: a } });
        (R(n.email ?? null), b(n.tempPassword ?? null));
      } catch {
        d.error("Failed to load credentials");
      } finally {
        h(!1);
      }
    };
  i.useEffect(() => {
    j();
  }, [a]);
  const w = async (n) => {
      n && (await navigator.clipboard.writeText(n), d.success("Copied to clipboard"));
    },
    c = async () => {
      if (
        confirm("Generate a new temporary password? The admin will need to use this to sign in.")
      ) {
        y(!0);
        try {
          const n = await m({ data: { schoolId: a } });
          (b(n.password), g(!0), d.success("Password reset successfully"));
        } catch (n) {
          const A =
            typeof n == "object" && n !== null && "message" in n ? String(n.message) : String(n);
          d.error(A || "Failed to reset password");
        } finally {
          y(!1);
        }
      }
    };
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 h-fit space-y-4",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          e.jsx(ke, { className: "size-4 text-brand" }),
          e.jsx("h2", { className: "text-sm font-semibold", children: "Credentials" }),
        ],
      }),
      C
        ? e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading…" })
        : e.jsxs("div", {
            className: "space-y-3",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Admin email",
                  }),
                  e.jsxs("div", {
                    className: "mt-1 flex items-center gap-2",
                    children: [
                      e.jsx("input", {
                        readOnly: !0,
                        value: p ?? "—",
                        className:
                          "flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none",
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => w(p),
                        disabled: !p,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: "Copy email",
                        children: e.jsx(F, { className: "size-3.5" }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", {
                    className: "text-xs font-medium text-muted-foreground",
                    children: "Temporary password",
                  }),
                  e.jsxs("div", {
                    className: "mt-1 flex items-center gap-2",
                    children: [
                      e.jsx("div", {
                        className: "flex-1 relative",
                        children: e.jsx("input", {
                          readOnly: !0,
                          type: u ? "text" : "password",
                          value: r ?? "",
                          placeholder: r === null ? "Not set" : "••••••••",
                          className:
                            "w-full px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none",
                        }),
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => g((n) => !n),
                        disabled: !r,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: u ? "Hide password" : "Show password",
                        children: u
                          ? e.jsx(we, { className: "size-3.5" })
                          : e.jsx(re, { className: "size-3.5" }),
                      }),
                      e.jsx("button", {
                        type: "button",
                        onClick: () => w(r),
                        disabled: !r,
                        className:
                          "shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                        title: "Copy password",
                        children: e.jsx(F, { className: "size-3.5" }),
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("button", {
                type: "button",
                onClick: c,
                disabled: f,
                className:
                  "w-full py-2 border border-border rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-muted disabled:opacity-50",
                children: [
                  e.jsx(oe, { className: `size-4 ${f ? "animate-spin" : ""}` }),
                  f ? "Generating…" : "Reset password",
                ],
              }),
            ],
          }),
    ],
  });
}
function We() {
  const { currentSchoolId: a, roles: x, user: m, profile: p, loading: R } = ae(),
    r = a,
    { refresh: b } = ne();
  de("Admin Panel");
  const C = ie(),
    h = x.includes("admin") || x.includes("super_admin"),
    [u, g] = i.useState(""),
    [f, y] = i.useState(!1),
    [j, w] = i.useState([]),
    [c, n] = i.useState(null),
    [A, T] = i.useState(!0),
    [q, G] = i.useState([]),
    [ze, Me] = i.useState(""),
    [Re, Te] = i.useState(!1),
    [E, I] = i.useState(null);
  i.useEffect(() => {
    !h || !a || _();
  }, [h, a]);
  const _ = async () => {
      T(!0);
      const [s, t, P, v, J, Q, Z, ee, se] = await Promise.all([
        l.from("schools").select("school_name").eq("id", a).maybeSingle(),
        l.from("profiles").select("user_id, full_name, email").eq("school_id", a),
        l.from("user_roles").select("user_id, role").eq("school_id", a),
        l.from("students").select("id", { count: "exact", head: !0 }).eq("school_id", a),
        l.from("classes").select("id", { count: "exact", head: !0 }).eq("school_id", a),
        l
          .from("teacher_invitations")
          .select("id", { count: "exact", head: !0 })
          .eq("school_id", a)
          .is("accepted_at", null)
          .is("revoked_at", null),
        l.from("announcements").select("id", { count: "exact", head: !0 }).eq("school_id", a),
        l.from("homework").select("id", { count: "exact", head: !0 }).eq("school_id", a),
        l
          .from("schools")
          .select("id, school_name")
          .eq("owner_id", m.id)
          .order("created_at", { ascending: !0 }),
      ]);
      (G((se.data ?? []).map((o) => ({ id: o.id, name: o.school_name }))),
        g(s.data?.school_name ?? ""));
      const z = new Map();
      (P.data ?? []).forEach((o) => {
        const k = z.get(o.user_id) ?? [];
        (k.push(o.role), z.set(o.user_id, k));
      });
      const L = (t.data ?? [])
        .map((o) => ({
          user_id: o.user_id,
          full_name: o.full_name || "—",
          email: o.email,
          roles: z.get(o.user_id) ?? [],
        }))
        .filter((o) => o.roles.includes("admin") || o.roles.includes("teacher"))
        .sort((o, k) => o.full_name.localeCompare(k.full_name));
      w(L);
      const te = L.filter((o) => o.roles.includes("teacher")).length;
      (n({
        students: v.count ?? 0,
        teachers: te,
        classes: J.count ?? 0,
        pendingInvites: Q.count ?? 0,
        announcements: Z.count ?? 0,
        homework: ee.count ?? 0,
      }),
        T(!1));
    },
    U = async (s) => {
      if ((s.preventDefault(), !r)) return;
      y(!0);
      const { error: t } = await l.from("schools").update({ name: u.trim() }).eq("id", r);
      if ((y(!1), t)) return d.error(t.message);
      (d.success("School updated"), b());
    },
    D = async (s) => {
      if (!m || s === r) return;
      I(s);
      const { error: t } = await l.from("profiles").update({ school_id: s }).eq("user_id", m.id);
      if ((I(null), t)) return d.error(t.message);
      (d.success("Switched school"), await b());
    },
    V = async (s) => {
      if (!r) return;
      const { error: t } = await l
        .from("user_roles")
        .insert({ user_id: s, school_id: r, role: "admin" });
      if (t) return d.error(t.message);
      (d.success("Admin role granted"), _());
    },
    W = async (s) => {
      if (!r) return;
      if (s === m?.id) return d.error("You can't revoke your own admin role");
      const { error: t } = await l
        .from("user_roles")
        .delete()
        .eq("user_id", s)
        .eq("school_id", r)
        .eq("role", "admin");
      if (t) return d.error(t.message);
      (d.success("Admin role revoked"), _());
    },
    K = async (s) => {
      if (!r) return;
      if (s.user_id === m?.id) return d.error("You can't remove yourself");
      if (!confirm(`Remove ${s.full_name} from this school? They will lose all access.`)) return;
      const { error: t } = await l
        .from("user_roles")
        .delete()
        .eq("user_id", s.user_id)
        .eq("school_id", r);
      if (t) return d.error(t.message);
      (await l.from("profiles").update({ school_id: null }).eq("user_id", s.user_id),
        d.success(`${s.full_name} removed`),
        _());
    };
  if (!h)
    return e.jsxs(e.Fragment, {
      children: [
        e.jsx($, { title: "Admin Panel", breadcrumb: "Restricted" }),
        e.jsx("div", {
          className: "p-8",
          children: e.jsxs("div", {
            className: "max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center",
            children: [
              e.jsx(O, { className: "size-10 text-muted-foreground mx-auto" }),
              e.jsx("h2", { className: "mt-3 font-semibold", children: "Admin access only" }),
              e.jsx("p", {
                className: "text-sm text-muted-foreground mt-1",
                children: "You need an admin role to access the control panel.",
              }),
              e.jsx("button", {
                onClick: () => C({ to: "/dashboard" }),
                className: "mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md",
                children: "Back to dashboard",
              }),
            ],
          }),
        }),
      ],
    });
  const X = [
    {
      to: "/students",
      label: "Students & Parents",
      icon: le,
      count: c?.students,
      desc: "Roster, parent linking",
    },
    { to: "/classes", label: "Classes", icon: ce, count: c?.classes, desc: "Grades and sections" },
    { to: "/fees", label: "Fees & Invoices", icon: fe, desc: "Structures, invoices, payments" },
    { to: "/attendance", label: "Attendance", icon: pe, desc: "Daily marking & history" },
    {
      to: "/homework",
      label: "Homework",
      icon: me,
      count: c?.homework,
      desc: "Assignments & files",
    },
    { to: "/remarks", label: "Remarks", icon: be, desc: "Teacher feedback" },
    {
      to: "/announcements",
      label: "Announcements",
      icon: ge,
      count: c?.announcements,
      desc: "School-wide notices",
    },
    {
      to: "/invitations",
      label: "Invite Teachers",
      icon: H,
      count: c?.pendingInvites,
      desc: "Pending invitations",
    },
    { to: "/parent", label: "Parent Digest", icon: O, desc: "Preview parent view" },
  ];
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx($, {
        title: "Admin Panel",
        breadcrumb: p?.full_name ?? "Admin",
        actions: e.jsxs(M, {
          to: "/invitations",
          className:
            "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1",
          children: [e.jsx(H, { className: "size-4" }), " Invite teacher"],
        }),
      }),
      e.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children: [
          e.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: [
              e.jsx(S, { label: "Students", value: c?.students ?? "—" }),
              e.jsx(S, { label: "Teachers", value: c?.teachers ?? "—" }),
              e.jsx(S, { label: "Classes", value: c?.classes ?? "—" }),
              e.jsx(S, {
                label: "Pending invites",
                value: c?.pendingInvites ?? "—",
                tone: "brand",
              }),
            ],
          }),
          e.jsxs("section", {
            children: [
              e.jsx("h2", {
                className:
                  "text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3",
                children: "Services",
              }),
              e.jsx("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
                children: X.map((s) => {
                  const t = s.icon;
                  return e.jsxs(
                    M,
                    {
                      to: s.to,
                      className:
                        "group bg-card border border-border rounded-xl p-5 hover:border-brand/40 hover:shadow-sm transition",
                      children: [
                        e.jsxs("div", {
                          className: "flex items-center justify-between",
                          children: [
                            e.jsx("div", {
                              className:
                                "size-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center",
                              children: e.jsx(t, { className: "size-4" }),
                            }),
                            typeof s.count == "number" &&
                              e.jsx("span", {
                                className:
                                  "text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full",
                                children: s.count,
                              }),
                          ],
                        }),
                        e.jsx("p", {
                          className: "mt-3 font-medium text-foreground",
                          children: s.label,
                        }),
                        e.jsx("p", {
                          className: "text-xs text-muted-foreground mt-0.5",
                          children: s.desc,
                        }),
                      ],
                    },
                    s.to,
                  );
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
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      e.jsx(B, { className: "size-4 text-brand" }),
                      e.jsx("h2", { className: "text-sm font-semibold", children: "Schools" }),
                    ],
                  }),
                  e.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [q.length, " owned"],
                  }),
                ],
              }),
              e.jsxs("ul", {
                className: "divide-y divide-border",
                children: [
                  q.map((s) => {
                    const t = s.id === r;
                    return e.jsxs(
                      "li",
                      {
                        className: "px-5 py-3 flex items-center justify-between gap-3",
                        children: [
                          e.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              e.jsx("p", {
                                className: "text-sm font-medium truncate",
                                children: s.name,
                              }),
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground",
                                children: t ? "Active school" : "Owned",
                              }),
                            ],
                          }),
                          t
                            ? e.jsx("span", {
                                className:
                                  "text-[10px] uppercase font-bold tracking-wider bg-brand-soft text-brand px-2 py-1 rounded",
                                children: "Current",
                              })
                            : e.jsxs("button", {
                                onClick: () => D(s.id),
                                disabled: E === s.id,
                                className:
                                  "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-50",
                                children: [
                                  e.jsx(ve, { className: "size-3" }),
                                  E === s.id ? "Switching…" : "Switch",
                                ],
                              }),
                        ],
                      },
                      s.id,
                    );
                  }),
                  q.length === 0 &&
                    e.jsx("li", {
                      className: "px-5 py-6 text-sm text-muted-foreground text-center",
                      children: "You don't own any schools yet.",
                    }),
                ],
              }),
            ],
          }),
          e.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6",
            children: [
              e.jsxs("div", {
                className: "space-y-6",
                children: [
                  r && e.jsx(Pe, { schoolId: r }),
                  e.jsxs("form", {
                    onSubmit: U,
                    className: "bg-card border border-border rounded-xl p-5 h-fit space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-2",
                        children: [
                          e.jsx(B, { className: "size-4 text-brand" }),
                          e.jsx("h2", {
                            className: "text-sm font-semibold",
                            children: "School settings",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-medium",
                            children: "School name",
                          }),
                          e.jsx("input", {
                            value: u,
                            onChange: (s) => g(s.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                            required: !0,
                          }),
                        ],
                      }),
                      e.jsxs("button", {
                        type: "submit",
                        disabled: f || !u.trim(),
                        className:
                          "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50",
                        children: [
                          e.jsx(Ce, { className: "size-4" }),
                          f ? "Saving…" : "Save changes",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "bg-card border border-border rounded-xl overflow-hidden",
                children: [
                  e.jsxs("div", {
                    className: "px-5 py-3 border-b border-border flex items-center justify-between",
                    children: [
                      e.jsx("h2", {
                        className: "text-sm font-semibold",
                        children: "Staff & permissions",
                      }),
                      e.jsxs("span", {
                        className: "text-xs text-muted-foreground",
                        children: [j.length, " members"],
                      }),
                    ],
                  }),
                  A
                    ? e.jsx("div", {
                        className: "p-8 text-sm text-muted-foreground",
                        children: "Loading…",
                      })
                    : j.length === 0
                      ? e.jsxs("div", {
                          className: "p-8 text-sm text-muted-foreground text-center",
                          children: [
                            "No staff yet.",
                            " ",
                            e.jsx(M, {
                              to: "/invitations",
                              className: "text-brand font-medium",
                              children: "Invite your first teacher →",
                            }),
                          ],
                        })
                      : e.jsx("ul", {
                          className: "divide-y divide-border",
                          children: j.map((s) => {
                            const t = s.user_id === m?.id,
                              P = s.roles.includes("admin");
                            return e.jsxs(
                              "li",
                              {
                                className:
                                  "px-5 py-3 flex items-center justify-between gap-3 flex-wrap",
                                children: [
                                  e.jsxs("div", {
                                    className: "min-w-0 flex-1",
                                    children: [
                                      e.jsxs("div", {
                                        className: "flex items-center gap-2 flex-wrap",
                                        children: [
                                          e.jsx("p", {
                                            className: "text-sm font-medium truncate",
                                            children: s.full_name,
                                          }),
                                          t &&
                                            e.jsx("span", {
                                              className:
                                                "text-[10px] uppercase font-bold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded",
                                              children: "You",
                                            }),
                                          s.roles.map((v) =>
                                            e.jsx(
                                              "span",
                                              {
                                                className: `text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${v === "admin" ? "bg-brand-soft text-brand" : "bg-muted text-muted-foreground"}`,
                                                children: v,
                                              },
                                              v,
                                            ),
                                          ),
                                        ],
                                      }),
                                      e.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-0.5 truncate",
                                        children: s.email ?? "—",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      P
                                        ? e.jsxs("button", {
                                            onClick: () => W(s.user_id),
                                            disabled: t,
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-40",
                                            title: t
                                              ? "You can't revoke your own admin"
                                              : "Revoke admin",
                                            children: [
                                              e.jsx(qe, { className: "size-3" }),
                                              " Revoke admin",
                                            ],
                                          })
                                        : e.jsxs("button", {
                                            onClick: () => V(s.user_id),
                                            className:
                                              "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted",
                                            children: [
                                              e.jsx(ye, { className: "size-3" }),
                                              " Make admin",
                                            ],
                                          }),
                                      e.jsxs("button", {
                                        onClick: () => K(s),
                                        disabled: t,
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-danger-soft hover:text-danger disabled:opacity-40",
                                        title: t
                                          ? "You can't remove yourself"
                                          : "Remove from school",
                                        children: [e.jsx(ue, { className: "size-3" }), " Remove"],
                                      }),
                                    ],
                                  }),
                                ],
                              },
                              s.user_id,
                            );
                          }),
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
function S({ label: a, value: x, tone: m }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      e.jsx("p", { className: "text-sm font-medium text-muted-foreground", children: a }),
      e.jsx("h3", {
        className: `text-3xl font-bold mt-2 ${m === "brand" ? "text-brand" : "text-foreground"}`,
        children: x,
      }),
    ],
  });
}
export { We as component };
