import { j as jsxRuntimeExports } from "./_libs/react.mjs";
import {
  O as Outlet,
  e as useRouterState,
  u as useNavigate,
  L as Link,
} from "./_libs/tanstack__react-router.mjs";
import {
  f as useTenant,
  u as useAuth,
  d as useSchoolContext,
  e as useSchoolName,
  h as useTheme,
} from "./_ssr/router-CplsJ0Ue.mjs";
import "./_libs/sonner.mjs";
import "./_libs/qrcode.mjs";
import "./_libs/jsbarcode.mjs";
import "./_libs/html2canvas.mjs";
import "./_libs/jspdf.mjs";
import {
  o as ChevronLeft,
  S as LayoutDashboard,
  ao as Trophy,
  f as BookOpen,
  Y as MessageSquare,
  i as CalendarCheck,
  W as Megaphone,
  h as Building2,
  J as GraduationCap,
  v as Contact,
  as as Users,
  e as Bell,
  ad as Shield,
  af as ShieldCheck,
  at as Wallet,
  d as Banknote,
  k as ChartColumn,
  ar as UserPlus,
  am as Trash2,
  T as LogOut,
  Q as KeyRound,
  a9 as Search,
  au as X,
  ak as Sun,
  Z as Moon,
  ab as Settings,
  n as ChevronDown,
} from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/scheduler.mjs";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_ssr/client-mniyZlvf.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_libs/recharts.mjs";
import "./_libs/clsx.mjs";
import "./_libs/lodash.mjs";
import "./_libs/react-smooth.mjs";
import "./_libs/prop-types.mjs";
import "./_libs/fast-equals.mjs";
import "./_libs/tiny-invariant.mjs";
import "./_libs/react-is.mjs";
import "./_libs/d3-shape.mjs";
import "./_libs/d3-path.mjs";
import "./_libs/victory-vendor.mjs";
import "./_libs/d3-scale.mjs";
import "./_libs/internmap.mjs";
import "./_libs/d3-array.mjs";
import "./_libs/d3-time-format.mjs";
import "./_libs/d3-time.mjs";
import "./_libs/d3-interpolate.mjs";
import "./_libs/d3-color.mjs";
import "./_libs/d3-format.mjs";
import "./_libs/recharts-scale.mjs";
import "./_libs/decimal.js-light.mjs";
import "./_libs/eventemitter3.mjs";
import "./_libs/zod.mjs";
import "fs";
import "./_libs/dijkstrajs.mjs";
import "./_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "./_libs/fflate.mjs";
import "./_libs/fast-png.mjs";
import "./_libs/iobuffer.mjs";
import "./_libs/pako.mjs";
import "./_libs/dompurify.mjs";
import "./_libs/canvg.mjs";
import "./_libs/core-js.mjs";
import "./_libs/babel__runtime.mjs";
import "./_libs/raf.mjs";
import "./_libs/performance-now.mjs";
import "./_libs/rgbcolor.mjs";
import "./_libs/svg-pathdata.mjs";
import "./_libs/stackblur-canvas.mjs";
const operationsNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classes", label: "Classes", icon: GraduationCap },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/homework", label: "Homework", icon: BookOpen },
  { to: "/remarks", label: "Remarks", icon: MessageSquare },
  { to: "/marks", label: "Marks Management", icon: BookOpen },
  { to: "/report-cards", label: "Report Cards", icon: Trophy },
  { to: "/achievements", label: "Certificates", icon: Trophy },
  { to: "/id-cards", label: "ID Cards", icon: Contact },
  { to: "/leaves", label: "Leave Requests", icon: CalendarCheck },
];
const commsNav = [
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/students", label: "Students & Parents", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
];
const adminNav = [
  { to: "/admin", label: "Admin Panel", icon: Shield },
  { to: "/admin/whatsapp", label: "WhatsApp Inbox", icon: MessageSquare },
  { to: "/admin/billing", label: "Subscription & Billing", icon: ShieldCheck },
  { to: "/fees", label: "Fees", icon: Wallet },
  { to: "/payroll", label: "Payroll", icon: Banknote },
  { to: "/analytics", label: "Analytics", icon: ChartColumn },
  { to: "/teacher-allocations", label: "Teacher Allocations", icon: BookOpen },
  { to: "/invitations", label: "Invite Teachers", icon: UserPlus },
  { to: "/recycle-bin", label: "Recycle Bin", icon: Trash2 },
];
const parentNav = [
  { to: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report-cards", label: "Report Cards", icon: Trophy },
  { to: "/achievements", label: "Certificates", icon: Trophy },
  { to: "/homework", label: "Homework", icon: BookOpen },
  { to: "/remarks", label: "Remarks", icon: MessageSquare },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leaves", label: "Leave Requests", icon: CalendarCheck },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
];
function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { profile, roles, currentSchoolId: schoolId } = useTenant();
  const { signOut } = useAuth();
  const { activeSchool, exitSchool } = useSchoolContext();
  const navigate = useNavigate();
  const schoolDisplayName = useSchoolName();
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || isSuper;
  const isTeacher = roles.includes("teacher");
  const isParentOnly = roles.includes("parent") && !isAdmin && !isTeacher && !isSuper;
  const roleLabel = isSuper
    ? "Super Admin"
    : isAdmin
      ? "School Admin"
      : isTeacher
        ? "Teacher"
        : "Parent";
  const inSchoolContext = isSuper && activeSchool !== null;
  const effectiveSchoolId = activeSchool?.id ?? schoolId;
  const logoLetter = schoolDisplayName.slice(0, 1).toUpperCase();
  const logoUrl = activeSchool?.logo_url ?? null;
  const linkCls = (active) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-brand text-white shadow-sm" : "text-sidebar-muted hover:bg-white/5 hover:text-white"}`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", {
    className: "w-64 bg-sidebar-bg text-sidebar-fg flex flex-col shrink-0",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-6 flex items-center gap-3",
        children: [
          logoUrl
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                src: logoUrl,
                alt: "School logo",
                className: "size-8 rounded-lg object-cover",
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-lg text-brand-foreground",
                children: logoLetter,
              }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "overflow-hidden flex-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-base font-semibold tracking-tight block truncate",
                children: schoolDisplayName,
              }),
              inSchoolContext &&
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "text-[10px] text-sidebar-muted font-medium uppercase tracking-wider",
                  children: "Viewing as Super Admin",
                }),
            ],
          }),
        ],
      }),
      inSchoolContext &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "px-4 pb-2",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
            onClick: () => {
              exitSchool();
              void navigate({ to: "/super-admin" });
            },
            className:
              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-muted hover:bg-white/5 hover:text-white transition-colors border border-white/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-3.5" }),
              "Back to Platform",
            ],
          }),
        }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", {
        className: "flex-1 px-4 space-y-1 overflow-y-auto",
        children: isParentOnly
          ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                  children: "MAIN",
                }),
                parentNav.map((item) => {
                  const Icon = item.icon;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Link,
                    {
                      to: item.to,
                      className: linkCls(pathname === item.to),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
                        item.label,
                      ],
                    },
                    item.to,
                  );
                }),
              ],
            })
          : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
              children: [
                isSuper &&
                  !inSchoolContext &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                        children: "PLATFORM",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                        to: "/super-admin",
                        className: linkCls(pathname === "/super-admin"),
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "size-4" }),
                          "Schools",
                        ],
                      }),
                    ],
                  }),
                effectiveSchoolId &&
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3",
                        children: "MAIN",
                      }),
                      operationsNav.map((item) => {
                        const Icon = item.icon;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Link,
                          {
                            to: item.to,
                            className: linkCls(pathname === item.to),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
                              item.label,
                            ],
                          },
                          item.to,
                        );
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                        children: "MANAGEMENT",
                      }),
                      commsNav.map((item) => {
                        const Icon = item.icon;
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          Link,
                          {
                            to: item.to,
                            className: linkCls(pathname === item.to),
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4" }),
                              item.label,
                            ],
                          },
                          item.to,
                        );
                      }),
                      isAdmin &&
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                              children: "SYSTEM",
                            }),
                            adminNav.map((item) => {
                              const Icon = item.icon;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                Link,
                                {
                                  to: item.to,
                                  className: linkCls(pathname === item.to),
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, {
                                      className: "size-4",
                                    }),
                                    item.label,
                                  ],
                                },
                                item.to,
                              );
                            }),
                          ],
                        }),
                      isSuper &&
                        inSchoolContext &&
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4",
                              children: "PLATFORM",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                              to: "/super-admin",
                              className: linkCls(pathname === "/super-admin"),
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, {
                                  className: "size-4",
                                }),
                                "Schools",
                              ],
                            }),
                          ],
                        }),
                    ],
                  }),
              ],
            }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "p-4 border-t border-white/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-3 mb-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "size-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold",
                children: (profile?.full_name || "U").slice(0, 1).toUpperCase(),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "overflow-hidden flex-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm font-medium truncate",
                    children: profile?.full_name || "User",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-xs text-sidebar-muted truncate",
                    children: roleLabel,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                onClick: signOut,
                className: "text-sidebar-muted hover:text-sidebar-fg transition-colors",
                "aria-label": "Sign out",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
            to: "/change-password",
            className:
              "flex items-center gap-2 text-xs text-sidebar-muted hover:text-sidebar-fg transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-3.5" }),
              "Change password",
            ],
          }),
        ],
      }),
    ],
  });
}
function Topbar() {
  const { profile, roles } = useTenant();
  const { activeSchool, exitSchool } = useSchoolContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isSuper = roles.includes("super_admin");
  const inSchoolContext = isSuper && activeSchool !== null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", {
    className:
      "h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 text-card-foreground",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-6 flex-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            className: "p-1 text-muted-foreground hover:bg-accent rounded-md transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "size-5" }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "relative max-w-md w-full",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                type: "text",
                placeholder: "Search students, classes, teachers...",
                className:
                  "w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-brand/30 transition-shadow text-foreground placeholder:text-muted-foreground",
              }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          inSchoolContext &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className:
                "flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-3 py-1.5",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, {
                  className: "size-3.5 text-brand",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "text-xs font-semibold text-brand truncate max-w-[120px]",
                  children: activeSchool.name,
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  onClick: () => {
                    exitSchool();
                    void navigate({ to: "/super-admin" });
                  },
                  className:
                    "size-4 rounded-full bg-brand/20 hover:bg-brand/40 flex items-center justify-center transition-colors ml-0.5",
                  title: "Exit school context",
                  "aria-label": "Exit school context",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, {
                    className: "size-2.5 text-brand",
                  }),
                }),
              ],
            }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
            className: "p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            title: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
            children:
              theme === "dark"
                ? /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "size-5" })
                : /* @__PURE__ */ jsxRuntimeExports.jsx(Moon, { className: "size-5" }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
            className:
              "relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className:
                  "absolute top-2 right-2 size-2 bg-danger rounded-full border-2 border-card",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            className: "p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "size-5" }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex items-center gap-2 cursor-pointer hover:bg-accent p-1 pr-2 rounded-full transition-colors ml-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "size-8 rounded-full bg-brand flex items-center justify-center text-sm font-semibold text-white shadow-sm",
                children: (profile?.full_name || "U").slice(0, 1).toUpperCase(),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, {
                className: "size-4 text-muted-foreground",
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function AuthLayout() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "min-h-screen flex bg-background",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AppSidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 flex flex-col min-w-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Topbar, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx("main", {
            className: "flex-1 flex flex-col min-w-0 overflow-hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
          }),
        ],
      }),
    ],
  });
}
export { AuthLayout as component };
