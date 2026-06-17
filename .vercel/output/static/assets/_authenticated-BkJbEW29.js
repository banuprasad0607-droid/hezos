import {
  Y as $,
  $ as B,
  H as F,
  r,
  a0 as S,
  V as P,
  Z as C,
  W as z,
  _ as E,
  x as e,
  n as p,
  a as b,
  L as l,
  G as O,
  o as q,
  B as M,
  j as D,
  l as H,
  a1 as W,
  S as G,
  O as V,
} from "./index-DrqTZ7SR.js";
import { k as K } from "./vendor-charts-DECNlt_G.js";
import { M as v } from "./message-square-BVAiuQO7.js";
import { C as f } from "./calendar-check-DuiRifj2.js";
import { M as _ } from "./megaphone-DiOQmrUf.js";
import { B as N } from "./building-2-U_CRqHUZ.js";
import { S as Y } from "./shield-check-DxZCxexz.js";
import { W as X } from "./wallet-CZbtwORR.js";
import { C as Z } from "./chart-column-CibMTFTI.js";
import { U as J } from "./user-plus-ionEV5TK.js";
import { K as Q } from "./key-round-B9OZppG8.js";
import { X as ee } from "./x-DH-xwxwM.js";
import { S as se } from "./settings-BWufD4OP.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function te(t) {
  const i = $({ warn: t?.router === void 0 }),
    a = t?.router || i,
    d = K.useRef(void 0);
  return B(a.stores.__store, (o) => {
    if (t?.select) {
      if (t.structuralSharing ?? a.options.defaultStructuralSharing) {
        const n = F(d.current, t.select(o));
        return ((d.current = n), n);
      }
      return t.select(o);
    }
    return o;
  });
}
const ae = [
    ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2", key: "9lu3g6" }],
    ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
    ["path", { d: "M6 12h.01M18 12h.01", key: "113zkx" }],
  ],
  oe = r("banknote", ae);
const ne = [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]],
  re = r("chevron-down", ne);
const ce = [["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]],
  A = r("chevron-left", ce);
const le = [
    ["path", { d: "M16 2v2", key: "scm5qe" }],
    ["path", { d: "M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2", key: "1waht3" }],
    ["path", { d: "M8 2v2", key: "pbkmx" }],
    ["circle", { cx: "12", cy: "11", r: "3", key: "itu57m" }],
    ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2", key: "12vinp" }],
  ],
  ie = r("contact", le);
const de = [
    ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1", key: "10lvy0" }],
    ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1", key: "16une8" }],
    ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1", key: "1hutg5" }],
    ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1", key: "ldoo1y" }],
  ],
  R = r("layout-dashboard", de);
const me = [
    ["path", { d: "m16 17 5-5-5-5", key: "1bji2h" }],
    ["path", { d: "M21 12H9", key: "dn1m92" }],
    ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4", key: "1uf3rs" }],
  ],
  xe = r("log-out", me);
const he = [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
        key: "kfwtm",
      },
    ],
  ],
  ue = r("moon", he);
const pe = [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }],
  ],
  be = r("sun", pe),
  fe = [
    { to: "/dashboard", label: "Dashboard", icon: R },
    { to: "/classes", label: "Classes", icon: O },
    { to: "/attendance", label: "Attendance", icon: f },
    { to: "/homework", label: "Homework", icon: b },
    { to: "/remarks", label: "Remarks", icon: v },
    { to: "/marks", label: "Marks Management", icon: b },
    { to: "/report-cards", label: "Report Cards", icon: p },
    { to: "/achievements", label: "Certificates", icon: p },
    { to: "/id-cards", label: "ID Cards", icon: ie },
    { to: "/leaves", label: "Leave Requests", icon: f },
  ],
  ge = [
    { to: "/announcements", label: "Announcements", icon: _ },
    { to: "/students", label: "Students & Parents", icon: q },
    { to: "/notifications", label: "Notifications", icon: M },
  ],
  je = [
    { to: "/admin", label: "Admin Panel", icon: D },
    { to: "/admin/whatsapp", label: "WhatsApp Inbox", icon: v },
    { to: "/admin/billing", label: "Subscription & Billing", icon: Y },
    { to: "/fees", label: "Fees", icon: X },
    { to: "/payroll", label: "Payroll", icon: oe },
    { to: "/analytics", label: "Analytics", icon: Z },
    { to: "/teacher-allocations", label: "Teacher Allocations", icon: b },
    { to: "/invitations", label: "Invite Teachers", icon: J },
    { to: "/recycle-bin", label: "Recycle Bin", icon: H },
  ],
  Ne = [
    { to: "/parent", label: "Dashboard", icon: R },
    { to: "/report-cards", label: "Report Cards", icon: p },
    { to: "/achievements", label: "Certificates", icon: p },
    { to: "/homework", label: "Homework", icon: b },
    { to: "/remarks", label: "Remarks", icon: v },
    { to: "/attendance", label: "Attendance", icon: f },
    { to: "/leaves", label: "Leave Requests", icon: f },
    { to: "/announcements", label: "Announcements", icon: _ },
  ];
function ve() {
  const t = te({ select: (s) => s.location.pathname }),
    { profile: i, roles: a, currentSchoolId: d } = S(),
    { signOut: o } = P(),
    { activeSchool: n, exitSchool: g } = C(),
    k = z(),
    h = E(),
    m = a.includes("super_admin"),
    j = a.includes("admin") || m,
    y = a.includes("teacher"),
    T = a.includes("parent") && !j && !y && !m,
    I = m ? "Super Admin" : j ? "School Admin" : y ? "Teacher" : "Parent",
    u = m && n !== null,
    L = n?.id ?? d,
    U = h.slice(0, 1).toUpperCase(),
    w = n?.logo_url ?? null,
    x = (s) =>
      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${s ? "bg-brand text-white shadow-sm" : "text-sidebar-muted hover:bg-white/5 hover:text-white"}`;
  return e.jsxs("aside", {
    className: "w-64 bg-sidebar-bg text-sidebar-fg flex flex-col shrink-0",
    children: [
      e.jsxs("div", {
        className: "p-6 flex items-center gap-3",
        children: [
          w
            ? e.jsx("img", {
                src: w,
                alt: "School logo",
                className: "size-8 rounded-lg object-cover",
              })
            : e.jsx("div", {
                className:
                  "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-lg text-brand-foreground",
                children: U,
              }),
          e.jsxs("div", {
            className: "overflow-hidden flex-1",
            children: [
              e.jsx("span", {
                className: "text-base font-semibold tracking-tight block truncate",
                children: h,
              }),
              u &&
                e.jsx("span", {
                  className: "text-[10px] text-sidebar-muted font-medium uppercase tracking-wider",
                  children: "Viewing as Super Admin",
                }),
            ],
          }),
        ],
      }),
      u &&
        e.jsx("div", {
          className: "px-4 pb-2",
          children: e.jsxs("button", {
            onClick: () => {
              (g(), k({ to: "/super-admin" }));
            },
            className:
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-muted hover:bg-white/5 hover:text-white transition-colors border border-white/10",
            children: [e.jsx(A, { className: "size-3.5" }), "Back to Platform"],
          }),
        }),
      e.jsx("nav", {
        className: "flex-1 px-4 space-y-1 overflow-y-auto",
        children: T
          ? e.jsxs(e.Fragment, {
              children: [
                e.jsx("div", {
                  className:
                    "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                  children: "MAIN",
                }),
                Ne.map((s) => {
                  const c = s.icon;
                  return e.jsxs(
                    l,
                    {
                      to: s.to,
                      className: x(t === s.to),
                      children: [e.jsx(c, { className: "size-4" }), s.label],
                    },
                    s.to,
                  );
                }),
              ],
            })
          : e.jsxs(e.Fragment, {
              children: [
                m &&
                  !u &&
                  e.jsxs(e.Fragment, {
                    children: [
                      e.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                        children: "PLATFORM",
                      }),
                      e.jsxs(l, {
                        to: "/super-admin",
                        className: x(t === "/super-admin"),
                        children: [e.jsx(N, { className: "size-4" }), "Schools"],
                      }),
                    ],
                  }),
                L &&
                  e.jsxs(e.Fragment, {
                    children: [
                      e.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                        children: "MAIN",
                      }),
                      fe.map((s) => {
                        const c = s.icon;
                        return e.jsxs(
                          l,
                          {
                            to: s.to,
                            className: x(t === s.to),
                            children: [e.jsx(c, { className: "size-4" }), s.label],
                          },
                          s.to,
                        );
                      }),
                      e.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                        children: "MANAGEMENT",
                      }),
                      ge.map((s) => {
                        const c = s.icon;
                        return e.jsxs(
                          l,
                          {
                            to: s.to,
                            className: x(t === s.to),
                            children: [e.jsx(c, { className: "size-4" }), s.label],
                          },
                          s.to,
                        );
                      }),
                      j &&
                        e.jsxs(e.Fragment, {
                          children: [
                            e.jsx("div", {
                              className:
                                "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                              children: "SYSTEM",
                            }),
                            je.map((s) => {
                              const c = s.icon;
                              return e.jsxs(
                                l,
                                {
                                  to: s.to,
                                  className: x(t === s.to),
                                  children: [e.jsx(c, { className: "size-4" }), s.label],
                                },
                                s.to,
                              );
                            }),
                          ],
                        }),
                      m &&
                        u &&
                        e.jsxs(e.Fragment, {
                          children: [
                            e.jsx("div", {
                              className:
                                "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                              children: "PLATFORM",
                            }),
                            e.jsxs(l, {
                              to: "/super-admin",
                              className: x(t === "/super-admin"),
                              children: [e.jsx(N, { className: "size-4" }), "Schools"],
                            }),
                          ],
                        }),
                    ],
                  }),
              ],
            }),
      }),
      e.jsxs("div", {
        className: "p-4 border-t border-white/10",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-3 mb-3",
            children: [
              e.jsx("div", {
                className:
                  "size-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold",
                children: (i?.full_name || "U").slice(0, 1).toUpperCase(),
              }),
              e.jsxs("div", {
                className: "overflow-hidden flex-1",
                children: [
                  e.jsx("p", {
                    className: "text-sm font-medium truncate",
                    children: i?.full_name || "User",
                  }),
                  e.jsx("p", { className: "text-xs text-sidebar-muted truncate", children: I }),
                ],
              }),
              e.jsx("button", {
                onClick: o,
                className: "text-sidebar-muted hover:text-sidebar-fg transition-colors",
                "aria-label": "Sign out",
                children: e.jsx(xe, { className: "size-4" }),
              }),
            ],
          }),
          e.jsxs(l, {
            to: "/change-password",
            className:
              "flex items-center gap-2 text-xs text-sidebar-muted hover:text-sidebar-fg transition-colors",
            children: [e.jsx(Q, { className: "size-3.5" }), "Change password"],
          }),
        ],
      }),
    ],
  });
}
function ke() {
  const { profile: t, roles: i } = S(),
    { activeSchool: a, exitSchool: d } = C(),
    { theme: o, setTheme: n } = W(),
    g = z(),
    h = i.includes("super_admin") && a !== null;
  return e.jsxs("header", {
    className:
      "h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 text-card-foreground",
    children: [
      e.jsxs("div", {
        className: "flex items-center gap-6 flex-1",
        children: [
          e.jsx("button", {
            className: "p-1 text-muted-foreground hover:bg-accent rounded-md transition-colors",
            children: e.jsx(A, { className: "size-5" }),
          }),
          e.jsxs("div", {
            className: "relative max-w-md w-full",
            children: [
              e.jsx(G, {
                className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              }),
              e.jsx("input", {
                type: "text",
                placeholder: "Search students, classes, teachers...",
                className:
                  "w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-brand/30 transition-shadow text-foreground placeholder:text-muted-foreground",
              }),
            ],
          }),
        ],
      }),
      e.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          h &&
            e.jsxs("div", {
              className:
                "flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-3 py-1.5",
              children: [
                e.jsx(N, { className: "size-3.5 text-brand" }),
                e.jsx("span", {
                  className: "text-xs font-semibold text-brand truncate max-w-[120px]",
                  children: a.name,
                }),
                e.jsx("button", {
                  onClick: () => {
                    (d(), g({ to: "/super-admin" }));
                  },
                  className:
                    "size-4 rounded-full bg-brand/20 hover:bg-brand/40 flex items-center justify-center transition-colors ml-0.5",
                  title: "Exit school context",
                  "aria-label": "Exit school context",
                  children: e.jsx(ee, { className: "size-2.5 text-brand" }),
                }),
              ],
            }),
          e.jsx("button", {
            onClick: () => n(o === "dark" ? "light" : "dark"),
            className: "p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            title: `Switch to ${o === "dark" ? "light" : "dark"} mode`,
            children:
              o === "dark"
                ? e.jsx(be, { className: "size-5" })
                : e.jsx(ue, { className: "size-5" }),
          }),
          e.jsxs("button", {
            className:
              "relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            children: [
              e.jsx(M, { className: "size-5" }),
              e.jsx("span", {
                className:
                  "absolute top-2 right-2 size-2 bg-danger rounded-full border-2 border-card",
              }),
            ],
          }),
          e.jsx("button", {
            className: "p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            children: e.jsx(se, { className: "size-5" }),
          }),
          e.jsxs("div", {
            className:
              "flex items-center gap-2 cursor-pointer hover:bg-accent p-1 pr-2 rounded-full transition-colors ml-2",
            children: [
              e.jsx("div", {
                className:
                  "size-8 rounded-full bg-brand flex items-center justify-center text-sm font-semibold text-white shadow-sm",
                children: (t?.full_name || "U").slice(0, 1).toUpperCase(),
              }),
              e.jsx(re, { className: "size-4 text-muted-foreground" }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Fe() {
  return e.jsxs("div", {
    className: "min-h-screen flex bg-background",
    children: [
      e.jsx(ve, {}),
      e.jsxs("div", {
        className: "flex-1 flex flex-col min-w-0",
        children: [
          e.jsx(ke, {}),
          e.jsx("main", {
            className: "flex-1 flex flex-col min-w-0 overflow-hidden",
            children: e.jsx(V, {}),
          }),
        ],
      }),
    ],
  });
}
export { Fe as component };
