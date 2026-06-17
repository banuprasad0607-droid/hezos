import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import {
  b as createRouter,
  a as createRootRouteWithContext,
  d as useRouter,
  L as Link,
  O as Outlet,
  H as HeadContent,
  S as Scripts,
  c as createFileRoute,
  l as lazyRouteComponent,
  u as useNavigate,
} from "../_libs/tanstack__react-router.mjs";
import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { T as Toaster, t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import { h as html2canvas } from "../_libs/html2canvas.mjs";
import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
import {
  q as CircleAlert,
  a7 as RotateCcw,
  M as House,
  ad as Shield,
  a6 as RefreshCw,
  r as CircleCheck,
  ao as Trophy,
  aj as Sparkles,
  ac as Share2,
  c as Award,
  f as BookOpen,
  H as FileDown,
  ai as SlidersVertical,
  e as Bell,
  a9 as Search,
  a0 as Percent,
  V as Medal,
  y as Download,
  u as Clock,
  p as ChevronRight,
  ap as User,
  a3 as Plus,
  as as Users,
  F as Eye,
  am as Trash2,
  an as TrendingUp,
  ah as SlidersHorizontal,
  _ as Paperclip,
  a4 as Printer,
  J as GraduationCap,
} from "../_libs/lucide-react.mjs";
import {
  R as ResponsiveContainer,
  b as BarChart,
  C as CartesianGrid,
  X as XAxis,
  Y as YAxis,
  T as Tooltip,
  B as Bar,
  e as LineChart,
  d as Line,
  f as PieChart,
  P as Pie,
  c as Cell,
  a as AreaChart,
  A as Area,
} from "../_libs/recharts.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/scheduler.mjs";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
const appCss = "/assets/styles-D4WaV3cH.css";
const AuthContext = reactExports.createContext(null);
const AuthProvider = ({ children }) => {
  const [session, setSession] = reactExports.useState(null);
  const [user, setUser] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data: { session: session2 } }) => {
        if (mounted) {
          setSession(session2);
          setUser(session2?.user ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error getting initial session:", err);
        if (mounted) setLoading(false);
      });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session2) => {
      if (mounted) {
        setSession(session2);
        setUser(session2?.user ?? null);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);
  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setSession(null);
      setUser(null);
      setLoading(false);
    }
  };
  const refreshSession = async () => {
    try {
      const {
        data: { session: session2 },
      } = await supabase.auth.refreshSession();
      setSession(session2);
      setUser(session2?.user ?? null);
    } catch (err) {
      console.error("Error refreshing session:", err);
    }
  };
  const value = {
    session,
    user,
    loading,
    signOut,
    refreshSession,
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthContext.Provider, { value, children });
};
const useAuth = () => {
  return reactExports.useContext(AuthContext);
};
const STORAGE_KEY = "hezo_active_school";
const SchoolContext = reactExports.createContext(void 0);
function readFromStorage() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
function SchoolContextProvider({ children }) {
  const [activeSchool, setActiveSchoolState] = reactExports.useState(() => readFromStorage());
  const enterSchool = reactExports.useCallback((school) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(school));
    setActiveSchoolState(school);
  }, []);
  const exitSchool = reactExports.useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setActiveSchoolState(null);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolContext.Provider, {
    value: { activeSchool, enterSchool, exitSchool },
    children,
  });
}
function useSchoolContext() {
  const ctx = reactExports.useContext(SchoolContext);
  if (!ctx) throw new Error("useSchoolContext must be used within SchoolContextProvider");
  return ctx;
}
const TenantContext = reactExports.createContext(void 0);
function TenantProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { activeSchool } = useSchoolContext();
  const [profile, setProfile] = reactExports.useState(null);
  const [roles, setRoles] = reactExports.useState([]);
  const [currentSchool, setCurrentSchool] = reactExports.useState(null);
  const [currentSchoolId, setCurrentSchoolId] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const fetchTenantData = async () => {
    if (!user) {
      setProfile(null);
      setRoles([]);
      setCurrentSchool(null);
      setCurrentSchoolId(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data: profileData, error: profileErr } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profileErr) throw profileErr;
      setProfile(profileData);
      const { data: rolesData, error: rolesErr } = await supabase
        .from("user_roles")
        .select("role, school_id")
        .eq("user_id", user.id);
      if (rolesErr) throw rolesErr;
      const roleList = (rolesData || []).map((r) => r.role);
      setRoles(roleList);
      const isSuperAdmin = roleList.includes("super_admin");
      const resolvedSchoolId =
        isSuperAdmin && activeSchool?.id ? activeSchool.id : profileData?.school_id || null;
      setCurrentSchoolId(resolvedSchoolId);
      if (resolvedSchoolId) {
        const { data: schoolData, error: schoolErr } = await supabase
          .from("schools")
          .select("*")
          .eq("id", resolvedSchoolId)
          .maybeSingle();
        if (schoolErr) throw schoolErr;
        setCurrentSchool(schoolData);
      } else {
        setCurrentSchool(null);
      }
    } catch (err) {
      console.error("Error in TenantProvider:", err);
      setError(
        err instanceof Error ? err : new Error(err.message || "Failed to load tenant context"),
      );
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (authLoading) return;
    void fetchTenantData();
  }, [user, authLoading, activeSchool?.id]);
  const value = {
    currentSchoolId,
    currentSchool,
    profile,
    roles,
    user,
    loading: authLoading || loading,
    error,
    refreshTenant: fetchTenantData,
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(TenantContext.Provider, { value, children });
}
function useTenant() {
  const context = reactExports.useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context,
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error",
    },
  );
}
function ErrorFallback({ error, reset, title, message }) {
  reactExports.useEffect(() => {
    if (error) {
      reportLovableError(error, { boundary: "error_fallback_component" });
    }
  }, [error]);
  const getFriendlyMessage = () => {
    if (message) return message;
    if (!error) return "An unexpected error occurred. Please try again later.";
    const errorMsg = error.message || String(error);
    const lowerMsg = errorMsg.toLowerCase();
    if (
      lowerMsg.includes("postgres") ||
      lowerMsg.includes("relation") ||
      lowerMsg.includes("column") ||
      lowerMsg.includes("foreign key") ||
      lowerMsg.includes("database") ||
      lowerMsg.includes("pgrst") ||
      lowerMsg.includes('code:"42') ||
      lowerMsg.includes('code:"pgrst')
    ) {
      return "Unable to load data. Please contact the administrator.";
    }
    if (
      lowerMsg.includes("network") ||
      lowerMsg.includes("fetch") ||
      lowerMsg.includes("failed to fetch")
    ) {
      return "Network connection issue. Please check your internet and try again.";
    }
    if (
      lowerMsg.includes("permission") ||
      lowerMsg.includes("authorized") ||
      lowerMsg.includes("jwt") ||
      lowerMsg.includes("unauthorized")
    ) {
      return "Session expired or permission denied. Please sign in again.";
    }
    return errorMsg;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className:
      "flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl text-center shadow-sm max-w-md mx-auto my-8",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className:
          "size-12 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
          className: "size-6 animate-pulse",
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: "font-semibold text-lg text-foreground",
        children: title || "Something went wrong",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-sm text-muted-foreground mt-2 leading-relaxed",
        children: getFriendlyMessage(),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "mt-6 flex items-center justify-center gap-3",
        children: [
          reset &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: reset,
              className:
                "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md hover:opacity-90 shadow-sm",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "size-4" }),
                " Try again",
              ],
            }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
            href: "/",
            className:
              "inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold border border-border rounded-md hover:bg-accent text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "size-4" }),
              " Go Home",
            ],
          }),
        ],
      }),
    ],
  });
}
const ThemeProviderContext = reactExports.createContext(void 0);
function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "hezo-ui-theme",
  ...props
}) {
  const [theme, setTheme] = reactExports.useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(storageKey) || defaultTheme : defaultTheme,
  );
  reactExports.useEffect(() => {
    if (typeof window === "undefined") return;
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);
  const value = {
    theme,
    setTheme: (theme2) => {
      localStorage.setItem(storageKey, theme2);
      setTheme(theme2);
    },
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProviderContext.Provider, {
    ...props,
    value,
    children,
  });
}
const useTheme = () => {
  const context = reactExports.useContext(ThemeProviderContext);
  if (context === void 0) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background px-4",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "max-w-md text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
          className: "text-7xl font-bold text-foreground",
          children: "404",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
          className: "mt-4 text-xl font-semibold text-foreground",
          children: "Page not found",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "mt-2 text-sm text-muted-foreground",
          children: "The page you're looking for doesn't exist or has been moved.",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "mt-6",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
            to: "/",
            className:
              "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
            children: "Go home",
          }),
        }),
      ],
    }),
  });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "flex min-h-screen items-center justify-center bg-background px-4",
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorFallback, {
      error,
      reset: () => {
        router2.invalidate();
        reset();
      },
    }),
  });
}
const Route$y = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "HEZO SCHOOL — Daily school operations" },
      {
        name: "description",
        content:
          "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools.",
      },
      { property: "og:title", content: "HEZO SCHOOL — Daily school operations" },
      {
        property: "og:description",
        content:
          "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "HEZO SCHOOL — Daily school operations" },
      {
        name: "twitter:description",
        content:
          "Attendance, homework, teacher remarks and a Parent Daily Digest — built for Indian schools.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bc13b80-45c0-4a8f-8bc2-cdf74edc9267/id-preview-d077aa99--0014a056-074e-4284-843d-2caf00c15828.lovable.app-1780137494189.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bc13b80-45c0-4a8f-8bc2-cdf74edc9267/id-preview-d077aa99--0014a056-074e-4284-843d-2caf00c15828.lovable.app-1780137494189.png",
      },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", {
    lang: "en",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("head", {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("body", {
        children: [children, /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})],
      }),
    ],
  });
}
function RootComponent() {
  const { queryClient } = Route$y.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeProvider, {
      defaultTheme: "light",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, {
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SchoolContextProvider, {
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TenantProvider, {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {
                richColors: true,
                position: "top-right",
              }),
            ],
          }),
        }),
      }),
    }),
  });
}
const $$splitComponentImporter$w = () => import("./verify-id-CXdLDQab.mjs");
const Route$x = createFileRoute("/verify-id")({
  validateSearch: (search) => {
    return {
      type: search.type,
      id: search.id,
    };
  },
  head: () => ({
    meta: [
      {
        title: "Record Verification — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$w, "component"),
});
const $$splitComponentImporter$v = () => import("./signup-Wp1jKfue.mjs");
objectType({
  fullName: stringType()
    .min(2, {
      message: "Full name must be at least 2 characters.",
    })
    .max(120),
  email: stringType()
    .email({
      message: "Please enter a valid email address.",
    })
    .max(120),
  password: stringType()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(72),
});
const Route$w = createFileRoute("/signup")({
  head: () => ({
    meta: [
      {
        title: "Create your school — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$v, "component"),
});
const $$splitComponentImporter$u = () => import("./reset-password-BeUKQ4ro.mjs");
const Route$v = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      {
        title: "Choose New Password — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$u, "component"),
});
const $$splitComponentImporter$t = () => import("./onboarding-C6kMhrE8.mjs");
const Route$u = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      {
        title: "Pending Assignment — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$t, "component"),
});
const $$splitComponentImporter$s = () => import("./login-B1OsgZs_.mjs");
objectType({
  email: stringType()
    .email({
      message: "Please enter a valid email address.",
    })
    .max(120),
  password: stringType()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(72),
});
const Route$t = createFileRoute("/login")({
  head: () => ({
    meta: [
      {
        title: "Sign in — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$s, "component"),
});
const $$splitComponentImporter$r = () => import("./forgot-password-5aRKrQUN.mjs");
objectType({
  email: stringType()
    .email({
      message: "Please enter a valid email address.",
    })
    .max(120),
});
const Route$s = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      {
        title: "Reset Password — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$r, "component"),
});
const $$splitComponentImporter$q = () => import("../_authenticated-BaVVR6k3.mjs");
const Route$r = createFileRoute("/_authenticated")({
  component: lazyRouteComponent($$splitComponentImporter$q, "component"),
});
const $$splitComponentImporter$p = () => import("./index-Db6grox_.mjs");
const Route$q = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "HEZO SCHOOL — Daily operations for Indian schools",
      },
      {
        name: "description",
        content:
          "Attendance, homework, teacher remarks and a Parent Daily Digest. Built for schools with 100–2000 students.",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$p, "component"),
});
const $$splitComponentImporter$o = () => import("./teacher-allocations-BozKP9v4.mjs");
const Route$p = createFileRoute("/_authenticated/teacher-allocations")({
  component: lazyRouteComponent($$splitComponentImporter$o, "component"),
});
const $$splitComponentImporter$n = () => import("./super-admin-Q4VrtvTh.mjs");
const Route$o = createFileRoute("/_authenticated/super-admin")({
  head: () => ({
    meta: [
      {
        title: "Platform — HEZO SCHOOL",
      },
    ],
  }),
  component: lazyRouteComponent($$splitComponentImporter$n, "component"),
});
const $$splitComponentImporter$m = () => import("./students-d2_q2oQ5.mjs");
const Route$n = createFileRoute("/_authenticated/students")({
  component: lazyRouteComponent($$splitComponentImporter$m, "component"),
});
const $$splitComponentImporter$l = () => import("./report-cards-CbiE5otI.mjs");
const Route$m = createFileRoute("/_authenticated/report-cards")({
  component: lazyRouteComponent($$splitComponentImporter$l, "component"),
});
const $$splitComponentImporter$k = () => import("./remarks-DIiHVXV0.mjs");
const Route$l = createFileRoute("/_authenticated/remarks")({
  component: lazyRouteComponent($$splitComponentImporter$k, "component"),
});
const $$splitComponentImporter$j = () => import("./recycle-bin-WtsJP1zE.mjs");
const Route$k = createFileRoute("/_authenticated/recycle-bin")({
  component: lazyRouteComponent($$splitComponentImporter$j, "component"),
});
const $$splitComponentImporter$i = () => import("./payroll-BsQCuC1J.mjs");
const Route$j = createFileRoute("/_authenticated/payroll")({
  component: lazyRouteComponent($$splitComponentImporter$i, "component"),
});
const $$splitComponentImporter$h = () => import("./parent-D0vCVbo6.mjs");
const Route$i = createFileRoute("/_authenticated/parent")({
  component: lazyRouteComponent($$splitComponentImporter$h, "component"),
});
const $$splitComponentImporter$g = () => import("./notifications-Bzs1Tete.mjs");
const Route$h = createFileRoute("/_authenticated/notifications")({
  component: lazyRouteComponent($$splitComponentImporter$g, "component"),
});
const $$splitComponentImporter$f = () => import("./marks-BglvEqzr.mjs");
const Route$g = createFileRoute("/_authenticated/marks")({
  component: lazyRouteComponent($$splitComponentImporter$f, "component"),
});
const $$splitComponentImporter$e = () => import("./leaves-MGohbGEM.mjs");
const Route$f = createFileRoute("/_authenticated/leaves")({
  component: lazyRouteComponent($$splitComponentImporter$e, "component"),
});
const $$splitComponentImporter$d = () => import("./invitations-D2T2BEF8.mjs");
const Route$e = createFileRoute("/_authenticated/invitations")({
  component: lazyRouteComponent($$splitComponentImporter$d, "component"),
});
const $$splitComponentImporter$c = () => import("./id-cards-2AhGbE8E.mjs");
const Route$d = createFileRoute("/_authenticated/id-cards")({
  component: lazyRouteComponent($$splitComponentImporter$c, "component"),
});
const getStudentIdFallback = (s) => {
  if (s.admission_number) return s.admission_number;
  const hash = s.id ? s.id.slice(0, 4).toUpperCase() : "0000";
  return `STU-2025-${hash}`;
};
const getStaffIdFallback = (t) => {
  if (t.employee_id) return t.employee_id;
  const hash = t.user_id ? t.user_id.slice(0, 4).toUpperCase() : "0000";
  return `EMP-2025-${hash}`;
};
(() => {
  const now = /* @__PURE__ */ new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return m >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();
const $$splitComponentImporter$b = () => import("./homework-Bhoifzve.mjs");
const Route$c = createFileRoute("/_authenticated/homework")({
  component: lazyRouteComponent($$splitComponentImporter$b, "component"),
});
const $$splitComponentImporter$a = () => import("./fees-CEJeYu02.mjs");
const Route$b = createFileRoute("/_authenticated/fees")({
  component: lazyRouteComponent($$splitComponentImporter$a, "component"),
});
const $$splitComponentImporter$9 = () => import("./dashboard-Zahcga3R.mjs");
const Route$a = createFileRoute("/_authenticated/dashboard")({
  component: lazyRouteComponent($$splitComponentImporter$9, "component"),
});
const $$splitComponentImporter$8 = () => import("./classes-DQhYlPOv.mjs");
const Route$9 = createFileRoute("/_authenticated/classes")({
  component: lazyRouteComponent($$splitComponentImporter$8, "component"),
});
const $$splitComponentImporter$7 = () => import("./change-password-B3RbPIGt.mjs");
const Route$8 = createFileRoute("/_authenticated/change-password")({
  component: lazyRouteComponent($$splitComponentImporter$7, "component"),
});
const $$splitComponentImporter$6 = () => import("./attendance-C-Mj0t5R.mjs");
const Route$7 = createFileRoute("/_authenticated/attendance")({
  component: lazyRouteComponent($$splitComponentImporter$6, "component"),
});
const $$splitComponentImporter$5 = () => import("./announcements-BGjKIQ7u.mjs");
const Route$6 = createFileRoute("/_authenticated/announcements")({
  component: lazyRouteComponent($$splitComponentImporter$5, "component"),
});
const $$splitComponentImporter$4 = () => import("./analytics-De6bTa5t.mjs");
const Route$5 = createFileRoute("/_authenticated/analytics")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component"),
});
const $$splitComponentImporter$3 = () => import("./admin-Z27ly2pk.mjs");
const Route$4 = createFileRoute("/_authenticated/admin")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component"),
});
function useSchoolName() {
  const { roles, currentSchool } = useTenant();
  const isSuper = roles.includes("super_admin");
  if (isSuper) {
    if (currentSchool) return currentSchool.name;
    return "HEZO SCHOOL";
  }
  return currentSchool?.name ?? "School";
}
function usePageTitle(pageName) {
  const schoolDisplayName = useSchoolName();
  const title = `${pageName} — ${schoolDisplayName}`;
  reactExports.useEffect(() => {
    document.title = title;
  }, [title]);
  return title;
}
function PageHeader({ title, breadcrumb, actions }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", {
    className:
      "h-16 border-b border-border flex items-center justify-between px-8 bg-card shrink-0",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-3 text-sm",
        children: [
          breadcrumb &&
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
              className: "text-muted-foreground",
              children: breadcrumb,
            }),
          breadcrumb &&
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
              className: "text-muted-foreground",
              children: "/",
            }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
            className: "font-semibold text-foreground",
            children: title,
          }),
        ],
      }),
      actions &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex items-center gap-3",
          children: actions,
        }),
    ],
  });
}
function oklchToRgb(lStr, cStr, hStr, aStr) {
  let L = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
  let C = parseFloat(cStr);
  let H = parseFloat(hStr);
  let A = aStr ? (aStr.endsWith("%") ? parseFloat(aStr) / 100 : parseFloat(aStr)) : 1;
  let hRad = (H * Math.PI) / 180;
  let a = C * Math.cos(hRad);
  let b = C * Math.sin(hRad);
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.291485548 * b;
  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  function gamma(x) {
    return x <= 31308e-7 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }
  let R = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  let G = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  let B = Math.round(Math.max(0, Math.min(1, gamma(bVal))) * 255);
  if (A === 1) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}
function oklabToRgb(lStr, aStr, bStr, alphaStr) {
  let L = lStr.endsWith("%") ? parseFloat(lStr) / 100 : parseFloat(lStr);
  let a = parseFloat(aStr);
  let b = parseFloat(bStr);
  let A = alphaStr
    ? alphaStr.endsWith("%")
      ? parseFloat(alphaStr) / 100
      : parseFloat(alphaStr)
    : 1;
  let l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  let m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  let s_ = L - 0.0894841775 * a - 1.291485548 * b;
  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;
  let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  let bVal = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  function gamma(x) {
    return x <= 31308e-7 ? 12.92 * x : 1.055 * Math.pow(x, 1 / 2.4) - 0.055;
  }
  let R = Math.round(Math.max(0, Math.min(1, gamma(r))) * 255);
  let G = Math.round(Math.max(0, Math.min(1, gamma(g))) * 255);
  let B = Math.round(Math.max(0, Math.min(1, gamma(bVal))) * 255);
  if (A === 1) {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
  } else {
    return `rgba(${R}, ${G}, ${B}, ${A})`;
  }
}
function sanitizeColorString(str) {
  if (typeof str !== "string") return str;
  let result = str.replace(
    /oklch\(\s*([\d.]+%?)(?:\s+|,\s*)([\d.]+)(?:\s+|,\s*)([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g,
    (match, l, c, h, a) => {
      try {
        return oklchToRgb(l, c, h, a);
      } catch (e) {
        return match;
      }
    },
  );
  result = result.replace(
    /oklab\(\s*([\d.]+%?)(?:\s+|,\s*)([-\d.]+)(?:\s+|,\s*)([-\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g,
    (match, l, a, b, alpha) => {
      try {
        return oklabToRgb(l, a, b, alpha);
      } catch (e) {
        return match;
      }
    },
  );
  result = result.replace(
    /lab\(\s*([\d.]+%?)(?:\s+|,\s*)([-\d.]+)(?:\s+|,\s*)([-\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g,
    () => {
      return "#808080";
    },
  );
  result = result.replace(
    /lch\(\s*([\d.]+%?)(?:\s+|,\s*)([\d.]+)(?:\s+|,\s*)([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g,
    () => {
      return "#808080";
    },
  );
  result = result.replace(
    /color\(\s*([\w-]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*[\/\s,]\s*([\d.]+%?))?\s*\)/g,
    (match, space, r, g, b, alpha) => {
      const R = Math.round(parseFloat(r) * 255);
      const G = Math.round(parseFloat(g) * 255);
      const B = Math.round(parseFloat(b) * 255);
      const A = alpha ? parseFloat(alpha) : 1;
      if (A === 1) {
        const toHex = (c) => {
          const hex = c.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        };
        return `#${toHex(R)}${toHex(G)}${toHex(B)}`;
      }
      return `rgba(${R}, ${G}, ${B}, ${A})`;
    },
  );
  return result;
}
async function safeHtml2Canvas(element, options) {
  const restoreList = [];
  const originalGetComputedStyle = window.getComputedStyle;
  const contentWindowDescriptor = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    "contentWindow",
  );
  const contentDocumentDescriptor = Object.getOwnPropertyDescriptor(
    HTMLIFrameElement.prototype,
    "contentDocument",
  );
  const originalContentWindow = contentWindowDescriptor?.get;
  const originalContentDocument = contentDocumentDescriptor?.get;
  if (element) {
    console.log("POSTER EXPORT DIAGNOSTICS: Poster element found.");
  } else {
    throw new Error("Poster element not found during export diagnostics.");
  }
  function wrapWindow(win) {
    if (!win || win.__getComputedStyleOverridden__) return win;
    win.__getComputedStyleOverridden__ = true;
    const orig = win.getComputedStyle;
    win.getComputedStyle = function (elt, pseudoElt) {
      const style = orig.call(win, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (
            typeof val === "string" &&
            (val.includes("oklch") ||
              val.includes("oklab") ||
              val.includes("lab") ||
              val.includes("lch") ||
              val.includes("color("))
          ) {
            return sanitizeColorString(val);
          }
          if (typeof val === "function") {
            return function (...args) {
              const res = val.apply(target, args);
              if (
                typeof res === "string" &&
                (res.includes("oklch") ||
                  res.includes("oklab") ||
                  res.includes("lab") ||
                  res.includes("lch") ||
                  res.includes("color("))
              ) {
                return sanitizeColorString(res);
              }
              return res;
            };
          }
          return val;
        },
      });
    };
    return win;
  }
  try {
    window.getComputedStyle = function (elt, pseudoElt) {
      const style = originalGetComputedStyle.call(window, elt, pseudoElt);
      return new Proxy(style, {
        get(target, prop) {
          const val = Reflect.get(target, prop);
          if (
            typeof val === "string" &&
            (val.includes("oklch") ||
              val.includes("oklab") ||
              val.includes("lab") ||
              val.includes("lch") ||
              val.includes("color("))
          ) {
            return sanitizeColorString(val);
          }
          if (typeof val === "function") {
            return function (...args) {
              const res = val.apply(target, args);
              if (
                typeof res === "string" &&
                (res.includes("oklch") ||
                  res.includes("oklab") ||
                  res.includes("lab") ||
                  res.includes("lch") ||
                  res.includes("color("))
              ) {
                return sanitizeColorString(res);
              }
              return res;
            };
          }
          return val;
        },
      });
    };
    restoreList.push(() => {
      window.getComputedStyle = originalGetComputedStyle;
    });
    if (originalContentWindow) {
      Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
        configurable: true,
        get() {
          const win = originalContentWindow.call(this);
          return wrapWindow(win);
        },
      });
      restoreList.push(() => {
        Object.defineProperty(HTMLIFrameElement.prototype, "contentWindow", {
          configurable: true,
          get: originalContentWindow,
        });
      });
    }
    if (originalContentDocument) {
      Object.defineProperty(HTMLIFrameElement.prototype, "contentDocument", {
        configurable: true,
        get() {
          const doc = originalContentDocument.call(this);
          if (doc && doc.defaultView) {
            wrapWindow(doc.defaultView);
          }
          return doc;
        },
      });
      restoreList.push(() => {
        Object.defineProperty(HTMLIFrameElement.prototype, "contentDocument", {
          configurable: true,
          get: originalContentDocument,
        });
      });
    }
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    const images = Array.from(element.querySelectorAll("img"));
    const imagePromises = images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    await Promise.all(imagePromises);
    let hasCleanedCSS = false;
    for (let i = 0; i < document.styleSheets.length; i++) {
      const sheet = document.styleSheets[i];
      try {
        const rules = sheet.cssRules || sheet.rules;
        if (!rules) continue;
        const processRuleList = (ruleList) => {
          for (let j = 0; j < ruleList.length; j++) {
            const rule = ruleList[j];
            if (rule instanceof CSSStyleRule) {
              const cssText = rule.style.cssText;
              if (
                cssText &&
                (cssText.includes("oklch") ||
                  cssText.includes("oklab") ||
                  cssText.includes("lab") ||
                  cssText.includes("lch") ||
                  cssText.includes("color("))
              ) {
                const cleanText = sanitizeColorString(cssText);
                rule.style.cssText = cleanText;
                hasCleanedCSS = true;
                restoreList.push(() => {
                  try {
                    rule.style.cssText = cssText;
                  } catch (e) {}
                });
              }
            } else if (rule instanceof CSSGroupingRule || rule.cssRules) {
              const subRules = rule.cssRules;
              if (subRules) {
                processRuleList(subRules);
              }
            }
          }
        };
        processRuleList(rules);
      } catch (e) {}
    }
    const elementsToWalk = [element, ...Array.from(element.querySelectorAll("*"))];
    for (const el of elementsToWalk) {
      if (el.style) {
        const cssText = el.style.cssText;
        if (
          cssText &&
          (cssText.includes("oklch") ||
            cssText.includes("oklab") ||
            cssText.includes("lab") ||
            cssText.includes("lch") ||
            cssText.includes("color("))
        ) {
          const cleanText = sanitizeColorString(cssText);
          el.style.cssText = cleanText;
          hasCleanedCSS = true;
          restoreList.push(() => {
            try {
              el.style.cssText = cssText;
            } catch (e) {}
          });
        }
      }
    }
    console.log("POSTER EXPORT DIAGNOSTICS: CSS parsed successfully.");
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
      ...options,
    });
    console.log("POSTER EXPORT DIAGNOSTICS: Canvas created successfully.");
    return canvas;
  } finally {
    for (let i = restoreList.length - 1; i >= 0; i--) {
      try {
        restoreList[i]();
      } catch (e) {}
    }
  }
}
const getPosterStyle = (sizeName, themeName) => {
  let width = "360px";
  let height = "450px";
  if (sizeName === "landscape") {
    width = "640px";
    height = "360px";
  } else if (sizeName === "square") {
    width = "360px";
    height = "360px";
  }
  const baseStyle = {
    width,
    height,
    padding: sizeName === "landscape" ? "1.5rem 2rem" : "1.5rem",
    display: "flex",
    flexDirection: sizeName === "landscape" ? "row" : "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  };
  if (themeName === "gold") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #fef9c2 50%, #f59e0b 100%)",
      color: "#1e293b",
      borderColor: "#fcd34d",
    };
  }
  if (themeName === "silver") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
      color: "#1e293b",
      borderColor: "#cbd5e1",
    };
  }
  if (themeName === "bronze") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #d97706 0%, #fef3c7 50%, #b45309 100%)",
      color: "#1e293b",
      borderColor: "#d97706",
    };
  }
  if (themeName === "royal") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      color: "#ffffff",
      borderColor: "#312e81",
    };
  }
  return {
    ...baseStyle,
    backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
    color: "#ffffff",
    borderColor: "#334155",
  };
};
const Route$3 = createFileRoute("/_authenticated/achievements")({
  component: AchievementsPage,
});
function CanvasConfetti({ active }) {
  const canvasRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId;
    const colors = ["#fbbf24", "#f59e0b", "#fb7185", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * canvas.height,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltAngleIncremental: Math.random() * 0.07 + 0.02,
      tiltAngle: 0,
    }));
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.x += Math.sin(p.tiltAngle);
        p.tilt = Math.sin(p.tiltAngle - index / 3) * 15;
        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });
      particles.forEach((p) => {
        if (p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = -20;
          p.tilt = Math.random() * 10 - 5;
        }
      });
      animationId = requestAnimationFrame(draw);
    };
    draw();
    const timer = setTimeout(() => {
      cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5e3);
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);
  return active
    ? /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", {
        ref: canvasRef,
        className: "fixed inset-0 pointer-events-none z-[9999] w-full h-full",
      })
    : null;
}
const adminUserId = "9783fac6-341c-4abb-8479-5d434ffafaac";
const parentUserId = "2b69b820-5891-4033-9155-418862032864";
function AchievementsPage() {
  useNavigate();
  const {
    currentSchoolId: schoolId,
    user,
    roles: actualRoles,
    loading: tenantLoading,
  } = useTenant();
  const schoolDisplayName = useSchoolName();
  usePageTitle("Report Cards");
  const [simulatedRole, setSimulatedRole] = reactExports.useState("admin");
  const [simulatedTeacherSubject, setSimulatedTeacherSubject] = reactExports.useState("All");
  reactExports.useMemo(() => {
    if (simulatedRole === "teacher") {
      if (simulatedTeacherSubject === "Mathematics") return "11111111-1111-1111-1111-111111111111";
      if (simulatedTeacherSubject === "Science") return "22222222-2222-2222-2222-222222222222";
      if (simulatedTeacherSubject === "English") return "33333333-3333-3333-3333-333333333333";
      return "22222222-2222-2222-2222-222222222222";
    }
    if (simulatedRole === "admin") return "4ebb81b8-2e77-4b12-a679-e3aab6d6a7b5";
    return user?.id || "";
  }, [simulatedRole, simulatedTeacherSubject, user]);
  const [userProfile, setUserProfile] = reactExports.useState(null);
  const [showPromotionPanel, setShowPromotionPanel] = reactExports.useState(false);
  const [promotionSelectedStudents, setPromotionSelectedStudents] = reactExports.useState([]);
  const [promotionTargetClass, setPromotionTargetClass] = reactExports.useState("");
  const [studentDocuments, setStudentDocuments] = reactExports.useState([]);
  const [reportCardAuditHistory, setReportCardAuditHistory] = reactExports.useState([]);
  const [uploadDocType, setUploadDocType] = reactExports.useState("Birth Certificate");
  const [gradeThresholds, setGradeThresholds] = reactExports.useState({
    "A+": 90,
    A: 80,
    "B+": 75,
    B: 70,
    "C+": 60,
    C: 50,
    D: 35,
  });
  const getGradeFromPercentage = (pct) => {
    if (pct >= gradeThresholds["A+"]) return "A+";
    if (pct >= gradeThresholds["A"]) return "A";
    if (pct >= gradeThresholds["B+"]) return "B+";
    if (pct >= gradeThresholds["B"]) return "B";
    if (pct >= gradeThresholds["C+"]) return "C+";
    if (pct >= gradeThresholds["C"]) return "C";
    if (pct >= gradeThresholds["D"]) return "D";
    return "F";
  };
  reactExports.useEffect(() => {
    if (user?.id) {
      supabase
        .from("profiles")
        .select("id, designation, department")
        .eq("user_id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setUserProfile(data);
        });
    }
  }, [user]);
  const [school, setSchool] = reactExports.useState(null);
  const [reportCardStudent, setReportCardStudent] = reactExports.useState(null);
  const [reportCardData, setReportCardData] = reactExports.useState(null);
  const [loadingReportCard, setLoadingReportCard] = reactExports.useState(false);
  const [activeTab, setActiveTab] = reactExports.useState("dashboard");
  const [classes, setClasses] = reactExports.useState([]);
  const [subjects, setSubjects] = reactExports.useState([]);
  const [students, setStudents] = reactExports.useState([]);
  const [exams, setExams] = reactExports.useState([]);
  const [marks, setMarks] = reactExports.useState([]);
  const [rankings, setRankings] = reactExports.useState([]);
  const [awards, setAwards] = reactExports.useState([]);
  const [certificates, setCertificates] = reactExports.useState([]);
  const [posters, setPosters] = reactExports.useState([]);
  const [notifications, setNotifications] = reactExports.useState([]);
  const [reportCards, setReportCards] = reactExports.useState([]);
  const [subjectAllocations, setSubjectAllocations] = reactExports.useState([]);
  const [allProfiles, setAllProfiles] = reactExports.useState([]);
  const [allRoles, setAllRoles] = reactExports.useState([]);
  const [selectedReportCardClass, setSelectedReportCardClass] = reactExports.useState("");
  const [allocClassId, setAllocClassId] = reactExports.useState("");
  const [allocSubjectId, setAllocSubjectId] = reactExports.useState("");
  const [allocTeacherId, setAllocTeacherId] = reactExports.useState("");
  const [selectedReportCardExam, setSelectedReportCardExam] = reactExports.useState("Annual Exam");
  const [activeReportCard, setActiveReportCard] = reactExports.useState(null);
  const [rcWorkingDays, setRcWorkingDays] = reactExports.useState(220);
  const [rcClassTeacherRemarks, setRcClassTeacherRemarks] = reactExports.useState("");
  const [rcPrincipalRemarks, setRcPrincipalRemarks] = reactExports.useState("");
  const [rcPresentDays, setRcPresentDays] = reactExports.useState({});
  const [rcSubjectRemarks, setRcSubjectRemarks] = reactExports.useState({});
  const [rcSaving, setRcSaving] = reactExports.useState(false);
  const [hiddenRenderStudent, setHiddenRenderStudent] = reactExports.useState(null);
  const [hiddenRenderData, setHiddenRenderData] = reactExports.useState(null);
  const [selectedClass, setSelectedClass] = reactExports.useState("");
  const [selectedExam, setSelectedExam] = reactExports.useState("");
  const [selectedSubject, setSelectedSubject] = reactExports.useState("");
  const [academicYear, setAcademicYear] = reactExports.useState("2025-2026");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [rankingCriteria, setRankingCriteria] = reactExports.useState("percentage");
  const [attendanceWeightage, setAttendanceWeightage] = reactExports.useState(0.1);
  const [attendanceThreshold, setAttendanceThreshold] = reactExports.useState(75);
  const [enabledCategories, setEnabledCategories] = reactExports.useState([
    "rank_1",
    "rank_2",
    "rank_3",
    "top_10",
    "subject_topper",
    "class_topper",
    "section_topper",
    "school_topper",
    "attendance_topper",
    "most_improved",
    "discipline_award",
    "olympiad",
    "sports",
    "cultural",
    "scholarship",
  ]);
  const [autoRecalculate, setAutoRecalculate] = reactExports.useState(true);
  const [selectedStudentForPoster, setSelectedStudentForPoster] = reactExports.useState(null);
  const [posterTheme, setPosterTheme] = reactExports.useState("gold");
  const [posterSize, setPosterSize] = reactExports.useState("portrait");
  const [selectedStudentForCert, setSelectedStudentForCert] = reactExports.useState(null);
  const [selectedCertProfile, setSelectedCertProfile] = reactExports.useState("rank1");
  const certStudentClass = classes.find(
    (c) => c.id === (selectedStudentForCert?.class_id || selectedClass),
  );
  const certClassName = certStudentClass ? `${certStudentClass.name}` : "Class 1A";
  const certDetails = reactExports.useMemo(() => {
    switch (selectedCertProfile) {
      case "rank1":
        return {
          title: "CERTIFICATE OF FIRST RANK EXCELLENCE",
          badge: "First Rank (1st Rank)",
          desc: `For securing the First Rank (1st Rank) in Class ${certClassName} for the academic session ${academicYear}. Their dedication, academic performance, and outstanding achievement have placed them atop the leaderboards.`,
          borderColor: "#78350f",
          innerColor: "#fbbf24",
          textColor: "#78350f",
        };
      case "rank2":
        return {
          title: "CERTIFICATE OF SECOND RANK DISTINCTION",
          badge: "Second Rank (2nd Rank)",
          desc: `For securing the Second Rank (2nd Rank) in Class ${certClassName} for the academic session ${academicYear}. Their consistent efforts, academic dedication, and high achievements have earned them this distinction.`,
          borderColor: "#64748b",
          innerColor: "#cbd5e1",
          textColor: "#334155",
        };
      case "rank3":
        return {
          title: "CERTIFICATE OF THIRD RANK MERIT",
          badge: "Third Rank (3rd Rank)",
          desc: `For securing the Third Rank (3rd Rank) in Class ${certClassName} for the academic session ${academicYear}. Their persistent dedication, commitment to learning, and academic merits are highly commendable.`,
          borderColor: "#b45309",
          innerColor: "#f59e0b",
          textColor: "#78350f",
        };
      case "attendance":
        return {
          title: "CERTIFICATE OF OUTSTANDING ATTENDANCE",
          badge: "Attendance Champion",
          desc: `For maintaining an exceptional presence and dedication to learning in Class ${certClassName} for the academic session ${academicYear}. Their commitment to consistency, reliability, and active participation in school life is exemplary.`,
          borderColor: "#065f46",
          innerColor: "#34d399",
          textColor: "#065f46",
        };
      case "discipline":
        return {
          title: "CERTIFICATE OF EXEMPLARY DISCIPLINE & LEADERSHIP",
          badge: "Best Discipline Award",
          desc: `For demonstrating exemplary behavior, integrity, respect, and adherence to school codes in Class ${certClassName} for the academic session ${academicYear}. They have set a true benchmark in character and student leadership.`,
          borderColor: "#312e81",
          innerColor: "#818cf8",
          textColor: "#312e81",
        };
      case "excellence":
      default:
        return {
          title: "CERTIFICATE OF ACADEMIC EXCELLENCE",
          badge: "Academic Excellence",
          desc: `For demonstrating superb scholastic performance, intellectual curiosity, and outstanding marks in Class ${certClassName} for the academic session ${academicYear}. Awarded in recognition of top academic achievements.`,
          borderColor: "#78350f",
          innerColor: "#fbbf24",
          textColor: "#78350f",
        };
    }
  }, [selectedCertProfile, certClassName, academicYear]);
  const posterStudentClass = classes.find(
    (c) => c.id === (selectedStudentForPoster?.class_id || selectedClass),
  );
  const posterClassName = posterStudentClass ? `${posterStudentClass.name}` : "Class 1A";
  const posterRanking = reactExports.useMemo(() => {
    return rankings.find(
      (r) => r.student_id === selectedStudentForPoster?.id && r.academic_year === academicYear,
    );
  }, [rankings, selectedStudentForPoster, academicYear]);
  const posterAward = reactExports.useMemo(() => {
    return awards.find(
      (a) => a.student_id === selectedStudentForPoster?.id && a.academic_year === academicYear,
    );
  }, [awards, selectedStudentForPoster, academicYear]);
  const posterDetails = reactExports.useMemo(() => {
    if (posterRanking) {
      const rankPos = posterRanking.rank_position;
      let label = "Academic Scholar";
      if (rankPos === 1) label = "Class Topper";
      else if (rankPos === 2) label = "2nd Rank Topper";
      else if (rankPos === 3) label = "3rd Rank Topper";
      else if (rankPos <= 10) label = "Top 10 Student";
      return {
        rankText: `Rank #${rankPos}`,
        label,
        stats: `GPA ${posterRanking.gpa} / Score ${posterRanking.percentage}%`,
      };
    } else if (posterAward) {
      return {
        rankText: badgeLabel(posterAward.category),
        label: posterAward.title,
        stats: "Special Recognition",
      };
    } else {
      return {
        rankText: "Academic Star",
        label: "Honor Roll",
        stats: "Excellent Performance",
      };
    }
  }, [posterRanking, posterAward]);
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [isCalculating, setIsCalculating] = reactExports.useState(false);
  const [showConfetti, setShowConfetti] = reactExports.useState(false);
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5e3);
  };
  reactExports.useEffect(() => {
    if (actualRoles.includes("super_admin")) setSimulatedRole("super_admin");
    else if (actualRoles.includes("admin")) setSimulatedRole("admin");
    else if (actualRoles.includes("teacher")) setSimulatedRole("teacher");
    else if (actualRoles.includes("parent")) setSimulatedRole("parent");
    else setSimulatedRole("student");
  }, [actualRoles]);
  reactExports.useEffect(() => {
    if (selectedClass && selectedClass !== selectedReportCardClass) {
      setSelectedReportCardClass(selectedClass);
    }
  }, [selectedClass, selectedReportCardClass]);
  reactExports.useEffect(() => {
    if (selectedReportCardClass && selectedReportCardClass !== selectedClass) {
      setSelectedClass(selectedReportCardClass);
    }
  }, [selectedReportCardClass, selectedClass]);
  reactExports.useEffect(() => {
    if (selectedExam) {
      const activeExamObj = exams.find((e) => e.id === selectedExam);
      if (activeExamObj && activeExamObj.type !== selectedReportCardExam) {
        setSelectedReportCardExam(activeExamObj.type);
      }
    }
  }, [selectedExam, exams, selectedReportCardExam]);
  reactExports.useEffect(() => {
    if (!reportCardStudent || !schoolId) {
      setReportCardData(null);
      return;
    }
    const fetchReportCardDetails = async () => {
      setLoadingReportCard(true);
      try {
        const classId = reportCardStudent.class_id;
        const { data: existingRc } = await supabase
          .from("report_cards")
          .select("*")
          .eq("student_id", reportCardStudent.id)
          .eq("exam_type", selectedReportCardExam)
          .eq("academic_year", academicYear)
          .maybeSingle();
        if (existingRc) {
          const subjectsMarks2 = Array.isArray(existingRc.subject_marks)
            ? existingRc.subject_marks.map((sm) => ({
                subjectName: sm.subject_name || sm.subjectName || "Subject",
                obtained: sm.obtained_marks ?? sm.obtained ?? 0,
                max: sm.max_marks ?? sm.max ?? 100,
                percentage:
                  sm.max_marks > 0
                    ? Number(
                        (
                          ((sm.obtained_marks ?? sm.obtained ?? 0) /
                            (sm.max_marks ?? sm.max ?? 100)) *
                          100
                        ).toFixed(1),
                      )
                    : 0,
                grade: sm.grade || "—",
                remarks: sm.remarks || "—",
              }))
            : [];
          setReportCardData({
            subjectsMarks: subjectsMarks2,
            totalObtained: Number(existingRc.total_obtained),
            totalMax: Number(existingRc.total_max),
            overallPercentage: Number(existingRc.percentage),
            gpa: Number((existingRc.percentage / 10).toFixed(2)),
            rank: existingRc.class_rank || "—",
            attendancePercentage: Number(existingRc.attendance_percentage),
            workingDays: existingRc.working_days,
            presentDays: existingRc.present_days,
            absentDays: existingRc.absent_days,
            classTeacherRemarks: existingRc.class_teacher_remarks || "—",
            principalRemarks: existingRc.principal_remarks || "—",
            latestRemark: existingRc.class_teacher_remarks || "Demonstrates consistent progress.",
          });
          setLoadingReportCard(false);
          return;
        }
        const { data: classExData } = await supabase
          .from("exams")
          .select("id, name")
          .eq("school_id", schoolId)
          .eq("class_id", classId)
          .is("deleted_at", null);
        const rawExamIds = (classExData || []).map((e) => e.id);
        const { data: examSubjs } = await supabase
          .from("exam_subjects")
          .select("id, exam_id, subject_id, max_marks")
          .eq("school_id", schoolId)
          .in("exam_id", rawExamIds.length ? rawExamIds : ["00000000-0000-0000-0000-000000000000"]);
        const classEx = [];
        (examSubjs || []).forEach((es) => {
          const exam = (classExData || []).find((e) => e.id === es.exam_id);
          if (exam) {
            classEx.push({
              id: es.id,
              name: exam.name,
              max_marks: Number(es.max_marks || 100),
              subject_id: es.subject_id,
            });
          }
        });
        const mappedExamIds = classEx.map((c) => c.id);
        const { data: studentMarksData } = await supabase
          .from("mark_entries")
          .select("exam_subject_id, marks_obtained")
          .eq("student_id", reportCardStudent.id)
          .in(
            "exam_subject_id",
            mappedExamIds.length ? mappedExamIds : ["00000000-0000-0000-0000-000000000000"],
          );
        const studentMarks = (studentMarksData || []).map((m) => ({
          exam_id: m.exam_subject_id,
          marks_obtained: m.marks_obtained,
        }));
        const { data: latestRemData } = await supabase
          .from("remarks")
          .select("content")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();
        const { data: attData } = await supabase
          .from("attendance")
          .select("status")
          .eq("student_id", reportCardStudent.id)
          .is("deleted_at", null);
        const { data: rankData } = await supabase
          .from("rankings")
          .select("rank_position, percentage, gpa")
          .eq("student_id", reportCardStudent.id)
          .eq("academic_year", academicYear)
          .is("exam_id", null)
          .maybeSingle();
        const subjectMap = /* @__PURE__ */ new Map();
        (classEx || []).forEach((ex) => {
          const markObj = (studentMarks || []).find((m) => m.exam_id === ex.id);
          if (markObj && ex.subject_id) {
            const subj = subjects.find((s) => s.id === ex.subject_id);
            const subjectName = subj?.name || "Other";
            const current = subjectMap.get(ex.subject_id) || {
              obtained: 0,
              max: 0,
              name: subjectName,
            };
            current.obtained += Number(markObj.marks_obtained);
            current.max += Number(ex.max_marks);
            subjectMap.set(ex.subject_id, current);
          }
        });
        const subjectsMarks = Array.from(subjectMap.values()).map((sm) => {
          const percentage = sm.max > 0 ? (sm.obtained / sm.max) * 100 : 0;
          const grade = getGradeFromPercentage(percentage);
          return {
            subjectName: sm.name,
            obtained: Number(sm.obtained.toFixed(1)),
            max: sm.max,
            percentage: Number(percentage.toFixed(1)),
            grade,
            remarks:
              percentage >= 80 ? "Excellent" : percentage >= 60 ? "Good" : "Needs Improvement",
          };
        });
        let totalObtained = 0;
        let totalMax = 0;
        subjectsMarks.forEach((sm) => {
          totalObtained += sm.obtained;
          totalMax += sm.max;
        });
        const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        let present = 0;
        let total = 0;
        (attData || []).forEach((a) => {
          total++;
          if (a.status === "present" || a.status === "late" || a.status === "half_day") {
            present += a.status === "half_day" ? 0.5 : 1;
          }
        });
        const attendancePercentage = total > 0 ? (present / total) * 100 : 100;
        const totalWorkingDays = rcWorkingDays || 220;
        const computedPresent = Math.round(totalWorkingDays * (attendancePercentage / 100));
        setReportCardData({
          subjectsMarks,
          totalObtained: Number(totalObtained.toFixed(1)),
          totalMax,
          overallPercentage: Number(overallPercentage.toFixed(1)),
          gpa: rankData ? rankData.gpa : Number((overallPercentage / 10).toFixed(2)),
          rank: rankData ? rankData.rank_position : "—",
          attendancePercentage: Number(attendancePercentage.toFixed(1)),
          workingDays: totalWorkingDays,
          presentDays: computedPresent,
          absentDays: totalWorkingDays - computedPresent,
          classTeacherRemarks: latestRemData
            ? latestRemData.content
            : "Demonstrates consistent progress and participates actively in class activities.",
          principalRemarks:
            overallPercentage >= 75 ? "Excellent performance." : "Satisfactory progress.",
          latestRemark: latestRemData
            ? latestRemData.content
            : "Demonstrates consistent progress and participates actively in class activities.",
        });
      } catch (err) {
        console.error("Failed to load report card:", err);
        toast.error("Failed to load report card details.");
      } finally {
        setLoadingReportCard(false);
      }
    };
    void fetchReportCardDetails();
  }, [reportCardStudent, academicYear, schoolId, subjects, selectedReportCardExam]);
  const downloadReportCardPDF = async () => {
    if (!reportCardStudent || !reportCardData) return;
    const element = document.getElementById("report-card-print-area");
    if (!element) {
      toast.error("Report card element not found.");
      return;
    }
    toast.info("Generating Report Card PDF. Please wait...");
    try {
      const canvas = await safeHtml2Canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf_node_minExports.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${reportCardStudent.full_name}_Report_Card.pdf`);
      toast.success("Report Card downloaded successfully.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF: " + err.message);
    }
  };
  const logAuditAction = async (studentId, reportCardId, action) => {
    if (!schoolId || !user) return;
    try {
      const { error } = await supabase.from("report_card_audit_logs").insert({
        school_id: schoolId,
        student_id: studentId,
        report_card_id: reportCardId,
        action,
        performed_by: user.id,
        performed_by_name: user.email?.split("@")[0] || "User",
      });
      if (error) console.error("Audit log failed:", error);
    } catch (err) {
      console.error("Audit log error:", err);
    }
  };
  const loadStudentDocuments = async (studentId) => {
    if (!schoolId) return;
    try {
      const { data, error } = await supabase
        .from("student_documents")
        .select("*")
        .eq("student_id", studentId)
        .eq("school_id", schoolId);
      if (error) throw error;
      setStudentDocuments(data || []);
    } catch (err) {
      console.error("Failed to load student documents:", err);
    }
  };
  const loadAuditLogs = async (studentId) => {
    if (!schoolId) return;
    try {
      const { data, error } = await supabase
        .from("report_card_audit_logs")
        .select("*")
        .eq("student_id", studentId)
        .eq("school_id", schoolId)
        .order("performed_at", { ascending: false });
      if (error) throw error;
      setReportCardAuditHistory(data || []);
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    }
  };
  const handleUploadDocument = async (studentId, documentType, file) => {
    if (!schoolId || !user) return;
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const path = `${schoolId}/${studentId}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("student-photos")
        .upload(path, file);
      if (uploadError) throw uploadError;
      const { data: pubUrl } = supabase.storage.from("student-photos").getPublicUrl(path);
      const { error: dbError } = await supabase.from("student_documents").insert({
        school_id: schoolId,
        student_id: studentId,
        document_type: documentType,
        file_name: file.name,
        file_url: pubUrl.publicUrl,
        uploaded_by: user.id,
      });
      if (dbError) throw dbError;
      toast.success("Document uploaded successfully!");
      void loadStudentDocuments(studentId);
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    }
  };
  const handleDeleteDocument = async (docId, studentId) => {
    try {
      const { error } = await supabase.from("student_documents").delete().eq("id", docId);
      if (error) throw error;
      toast.success("Document deleted successfully");
      void loadStudentDocuments(studentId);
    } catch (err) {
      toast.error("Failed to delete document: " + err.message);
    }
  };
  const handlePromoteStudents = async (action, studentIds, targetClassId) => {
    if (!schoolId || studentIds.length === 0) {
      toast.error("Please select at least one student");
      return;
    }
    setIsLoading(true);
    try {
      if (action === "promote") {
        if (!targetClassId) {
          toast.error("Please select a target class for promotion");
          setIsLoading(false);
          return;
        }
        const nextYear = academicYear === "2025-2026" ? "2026-2027" : "2027-2028";
        const { error } = await supabase
          .from("students")
          .update({
            class_id: targetClassId,
            academic_year: nextYear,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);
        if (error) throw error;
        toast.success(
          `Successfully promoted ${studentIds.length} student(s) to Class ${classes.find((c) => c.id === targetClassId)?.name || "Next Class"} and updated academic year to ${nextYear}!`,
        );
      } else if (action === "retain") {
        const nextYear = academicYear === "2025-2026" ? "2026-2027" : "2027-2028";
        const { error } = await supabase
          .from("students")
          .update({
            academic_year: nextYear,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);
        if (error) throw error;
        toast.success(
          `Successfully retained ${studentIds.length} student(s) in current class for academic year ${nextYear}.`,
        );
      } else if (action === "transfer") {
        const { error } = await supabase
          .from("students")
          .update({
            class_id: null,
          })
          .in("id", studentIds)
          .eq("school_id", schoolId);
        if (error) throw error;
        toast.success(`Successfully transferred ${studentIds.length} student(s) out of the class.`);
      }
      void loadData();
      setShowPromotionPanel(false);
      setPromotionSelectedStudents([]);
    } catch (err) {
      toast.error("Promotion failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const autoGenerateAwards = async (classId) => {
    if (!schoolId) return;
    try {
      const classRcs = reportCards.filter(
        (rc) => rc.class_id === classId && rc.exam_type === selectedReportCardExam,
      );
      if (classRcs.length === 0) return;
      const issuedBy = user?.id || adminUserId;
      const studentIds = classRcs.map((rc) => rc.student_id);
      await supabase
        .from("awards")
        .delete()
        .eq("school_id", schoolId)
        .eq("academic_year", academicYear)
        .in("student_id", studentIds)
        .in("category", [
          "gold_medal",
          "silver_medal",
          "bronze_medal",
          "academic_star",
          "attendance_champion",
          "subject_topper",
          "best_improvement",
        ]);
      const awardPromises = classRcs.map(async (rc) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (!studentObj) return;
        if (rc.class_rank === 1) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "gold_medal",
            title: "Gold Medal for Academic Excellence",
            description: `Secured 1st Rank in Class with an outstanding cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        } else if (rc.class_rank === 2) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "silver_medal",
            title: "Silver Medal for Academic Distinction",
            description: `Secured 2nd Rank in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        } else if (rc.class_rank === 3) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "bronze_medal",
            title: "Bronze Medal for Academic Merit",
            description: `Secured 3rd Rank in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
        if (rc.percentage >= 90) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "academic_star",
            title: "Academic Star Award",
            description: `Scored distinction grade of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
        if (rc.attendance_percentage >= 98) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "attendance_champion",
            title: "Attendance Champion Award",
            description: `Maintained an exemplary attendance rate of ${rc.attendance_percentage}% during the academic term.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
        if (Array.isArray(rc.subject_marks)) {
          for (const sm of rc.subject_marks) {
            if (sm.obtained_marks >= 98) {
              await supabase.from("awards").insert({
                school_id: schoolId,
                student_id: rc.student_id,
                academic_year: academicYear,
                category: "subject_topper",
                title: `Subject Topper - ${sm.subject_name}`,
                description: `Scored top marks of ${sm.obtained_marks}/${sm.max_marks} in ${sm.subject_name}.`,
                issued_by: issuedBy,
                is_published: true,
              });
              break;
            }
          }
        }
        if (rc.percentage >= 75 && rc.class_rank > 3 && rc.class_rank <= 10) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "best_improvement",
            title: "Best Improvement Award",
            description: `Demonstrated exceptional academic growth and progress during the term, achieving a cumulative percentage of ${rc.percentage}%.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
      });
      await Promise.all(awardPromises);
      void loadData();
    } catch (err) {
      console.error("Awards generation failed:", err);
    }
  };
  reactExports.useEffect(() => {
    const studentId = reportCardStudent?.id || activeReportCard?.student_id;
    if (studentId) {
      void loadStudentDocuments(studentId);
      void loadAuditLogs(studentId);
    }
  }, [reportCardStudent, activeReportCard]);
  const loadData = async () => {
    if (!schoolId) return;
    setIsLoading(true);
    try {
      const { data: schoolRes } = await supabase
        .from("schools")
        .select(
          "id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url",
        )
        .eq("id", schoolId)
        .single();
      if (schoolRes) {
        setSchool({
          id: schoolRes.id,
          name: schoolRes.school_name || schoolRes.name,
          logo_url: schoolRes.school_logo || schoolRes.logo_url,
          address: schoolRes.address,
          phone_number: schoolRes.phone_number,
          email: schoolRes.email,
          principal_name: schoolRes.principal_name || "",
          principal_signature_url: schoolRes.principal_signature_url || null,
        });
      }
      const { data: classesData } = await supabase
        .from("classes")
        .select("id, name, grade, section, class_teacher_id")
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("name");
      setClasses(classesData || []);
      if (classesData && classesData.length > 0) {
        if (!selectedClass) setSelectedClass(classesData[0].id);
        if (!selectedReportCardClass) setSelectedReportCardClass(classesData[0].id);
        setAllocClassId(classesData[0].id);
      }
      const { data: subjectsData } = await supabase
        .from("subjects")
        .select("id, name, code")
        .eq("school_id", schoolId)
        .order("name");
      setSubjects(subjectsData || []);
      if (subjectsData && subjectsData.length > 0) {
        setAllocSubjectId(subjectsData[0].id);
      }
      const { data: studentsData } = await supabase
        .from("students")
        .select(
          "id, full_name, roll_number, class_id, photo_url, parent_user_id, parent_email, parent_name, parent_phone, admission_number, classes(name, section)",
        )
        .eq("school_id", schoolId)
        .is("deleted_at", null)
        .order("full_name");
      const normStudents = (studentsData || []).map((s) => ({
        ...s,
        classes: Array.isArray(s.classes) ? s.classes[0] || null : s.classes,
      }));
      setStudents(normStudents);
      const { data: rawExams } = await supabase
        .from("exams")
        .select("id, class_id, name, type, date")
        .eq("school_id", schoolId)
        .is("deleted_at", null);
      const { data: examSubjs } = await supabase
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId);
      const combinedExams = [];
      (examSubjs || []).forEach((es) => {
        const exam = (rawExams || []).find((e) => e.id === es.exam_id);
        if (exam) {
          combinedExams.push({
            id: es.id,
            exam_id: exam.id,
            class_id: exam.class_id,
            name: `${exam.name} - ${es.subject_id}`,
            type: exam.type,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id,
            date: exam.date,
          });
        }
      });
      combinedExams.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExams(combinedExams);
      if (combinedExams.length > 0 && !selectedExam) {
        setSelectedExam(combinedExams[0].id);
      }
      const { data: rawMarks } = await supabase
        .from("mark_entries")
        .select("id, student_id, exam_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId);
      const mappedMarks = (rawMarks || []).map((m) => ({
        id: m.id,
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained,
      }));
      setMarks(mappedMarks);
      const { data: rulesData } = await supabase
        .from("ranking_rules")
        .select("criteria, attendance_weightage, attendance_threshold, enabled_categories")
        .eq("school_id", schoolId)
        .maybeSingle();
      if (rulesData) {
        setRankingCriteria(rulesData.criteria);
        setAttendanceWeightage(Number(rulesData.attendance_weightage));
        setAttendanceThreshold(Number(rulesData.attendance_threshold));
        if (rulesData.enabled_categories) {
          setEnabledCategories(rulesData.enabled_categories);
        }
      }
      const { data: rankingsData } = await supabase
        .from("rankings")
        .select(
          "id, student_id, academic_year, exam_id, total_marks, percentage, gpa, rank_position, rank_type, subject_id, students(full_name, roll_number, photo_url, classes(name))",
        )
        .eq("school_id", schoolId)
        .order("rank_position");
      const mappedRankings = (rankingsData || []).map((r) => {
        const stud = Array.isArray(r.students) ? r.students[0] : r.students;
        return {
          ...r,
          student: stud
            ? {
                full_name: stud.full_name,
                roll_number: stud.roll_number,
                classes: Array.isArray(stud.classes) ? stud.classes[0] : stud.classes,
              }
            : null,
        };
      });
      setRankings(mappedRankings);
      const { data: awardsData } = await supabase
        .from("awards")
        .select(
          "id, student_id, academic_year, category, title, description, issued_at, students(full_name, roll_number, classes(name))",
        )
        .eq("school_id", schoolId)
        .order("issued_at", { ascending: false });
      const mappedAwards = (awardsData || []).map((a) => {
        const stud = Array.isArray(a.students) ? a.students[0] : a.students;
        return {
          ...a,
          student: stud
            ? {
                full_name: stud.full_name,
                roll_number: stud.roll_number,
                classes: Array.isArray(stud.classes) ? stud.classes[0] : stud.classes,
              }
            : null,
        };
      });
      setAwards(mappedAwards);
      const { data: certsData } = await supabase
        .from("certificates")
        .select(
          "id, student_id, award_id, certificate_type, certificate_number, issued_date, students(full_name), awards(title, category)",
        )
        .eq("school_id", schoolId);
      const mappedCerts = (certsData || []).map((c) => {
        const stud = Array.isArray(c.students) ? c.students[0] : c.students;
        const awd = Array.isArray(c.awards) ? c.awards[0] : c.awards;
        return {
          ...c,
          student: stud,
          award: awd,
        };
      });
      setCertificates(mappedCerts);
      const { data: notifyData } = await supabase
        .from("notification_logs")
        .select(
          "id, parent_user_id, student_id, type, title, body, status, sent_at, students(full_name)",
        )
        .eq("school_id", schoolId)
        .order("sent_at", { ascending: false });
      const mappedNotify = (notifyData || []).map((n) => {
        const stud = Array.isArray(n.students) ? n.students[0] : n.students;
        return {
          ...n,
          student: stud,
        };
      });
      setNotifications(mappedNotify);
      const { data: rcData, error: rcErr } = await supabase
        .from("report_cards")
        .select(
          `
          id, school_id, student_id, class_id, exam_type, academic_year,
          total_obtained, total_max, percentage, class_rank, section_rank, school_rank,
          result_status, working_days, present_days, absent_days, attendance_percentage,
          subject_marks, class_teacher_remarks, principal_remarks, pdf_url, status,
          students (full_name, roll_number, admission_number, photo_url, parent_name, parent_phone, parent_email, parent_user_id)
        `,
        )
        .eq("school_id", schoolId);
      if (rcErr) {
        console.error("Error fetching report cards:", rcErr);
      } else {
        const mappedRc = (rcData || []).map((r) => {
          const stud = Array.isArray(r.students) ? r.students[0] : r.students;
          return {
            ...r,
            student: stud,
          };
        });
        setReportCards(mappedRc);
      }
      const { data: allocationsData } = await supabase
        .from("teacher_allocations")
        .select("id, teacher_id, subject_id, class_id")
        .eq("school_id", schoolId);
      setSubjectAllocations(allocationsData || []);
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("school_id", schoolId);
      setAllProfiles(profilesData || []);
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", schoolId);
      setAllRoles(rolesData || []);
      const teachersList = (profilesData || []).filter((p) =>
        (rolesData || []).some((r) => r.user_id === p.user_id && r.role === "teacher"),
      );
      if (teachersList.length > 0) {
        setAllocTeacherId(teachersList[0].user_id);
      }
    } catch (e) {
      toast.error("Error loading data: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (schoolId) {
      void loadData();
    }
  }, [schoolId]);
  const filteredStudents = reactExports.useMemo(() => {
    let result = students;
    if (selectedClass) {
      result = result.filter((s) => s.class_id === selectedClass);
    }
    if (searchQuery) {
      result = result.filter((s) => s.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return result;
  }, [students, selectedClass, searchQuery]);
  const filteredRankings = reactExports.useMemo(() => {
    let result = rankings.filter((r) => r.academic_year === academicYear);
    if (selectedClass) {
      result = result.filter(
        (r) => r.student?.classes?.name === classes.find((c) => c.id === selectedClass)?.name,
      );
    }
    if (selectedExam) {
      result = result.filter((r) => r.exam_id === selectedExam);
    } else {
      result = result.filter((r) => r.exam_id === null);
    }
    if (selectedSubject) {
      result = result.filter((r) => r.subject_id === selectedSubject);
    }
    return result;
  }, [rankings, selectedClass, selectedExam, selectedSubject, academicYear, classes]);
  reactExports.useMemo(() => {
    let result = awards.filter((a) => a.academic_year === academicYear);
    if (selectedClass) {
      result = result.filter(
        (a) => a.student?.classes?.name === classes.find((c) => c.id === selectedClass)?.name,
      );
    }
    if (searchQuery) {
      result = result.filter(
        (a) =>
          a.student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return result;
  }, [awards, selectedClass, searchQuery, academicYear, classes]);
  reactExports.useEffect(() => {
    if (filteredStudents.length > 0 && !selectedStudentForPoster) {
      setSelectedStudentForPoster(filteredStudents[0]);
    }
    if (filteredStudents.length > 0 && !selectedStudentForCert) {
      setSelectedStudentForCert(filteredStudents[0]);
    }
  }, [filteredStudents]);
  const handleCalculateRankings = async () => {
    if (!schoolId || !selectedClass) {
      toast.error("Please select a class first");
      return;
    }
    setIsCalculating(true);
    try {
      const { data: classStudents } = await supabase
        .from("students")
        .select("id, full_name, roll_number, parent_user_id, parent_email")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);
      if (!classStudents || classStudents.length === 0) {
        toast.error("No students in this class to rank");
        setIsCalculating(false);
        return;
      }
      const { data: classExamsData } = await supabase
        .from("exams")
        .select("id, name")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);
      if (!classExamsData || classExamsData.length === 0) {
        toast.error("No exams set up for this class to calculate marks");
        setIsCalculating(false);
        return;
      }
      const rawExamIds = classExamsData.map((e) => e.id);
      const { data: examSubjs } = await supabase
        .from("exam_subjects")
        .select("id, exam_id, subject_id, max_marks")
        .eq("school_id", schoolId)
        .in("exam_id", rawExamIds);
      const classExams = [];
      (examSubjs || []).forEach((es) => {
        const exam = classExamsData.find((e) => e.id === es.exam_id);
        if (exam) {
          classExams.push({
            id: es.id,
            name: exam.name,
            max_marks: Number(es.max_marks || 100),
            subject_id: es.subject_id,
          });
        }
      });
      if (classExams.length === 0) {
        toast.error("No subjects set up for exams in this class");
        setIsCalculating(false);
        return;
      }
      const examIds = classExams.map((e) => e.id);
      const { data: classMarksData } = await supabase
        .from("mark_entries")
        .select("student_id, exam_subject_id, marks_obtained")
        .eq("school_id", schoolId)
        .in("exam_subject_id", examIds);
      const classMarks = (classMarksData || []).map((m) => ({
        student_id: m.student_id,
        exam_id: m.exam_subject_id,
        marks_obtained: m.marks_obtained,
      }));
      const { data: attendanceData } = await supabase
        .from("attendance")
        .select("student_id, status")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass)
        .is("deleted_at", null);
      const attendanceMap = /* @__PURE__ */ new Map();
      (attendanceData || []).forEach((a) => {
        const stats = attendanceMap.get(a.student_id) || { present: 0, total: 0 };
        stats.total += 1;
        if (a.status === "present" || a.status === "late" || a.status === "half_day") {
          stats.present += a.status === "half_day" ? 0.5 : 1;
        }
        attendanceMap.set(a.student_id, stats);
      });
      const studentTotals = classStudents.map((student) => {
        const studMarks = (classMarks || []).filter((m) => m.student_id === student.id);
        let totalObtained = 0;
        let totalMax = 0;
        studMarks.forEach((sm) => {
          const ex = classExams.find((e) => e.id === sm.exam_id);
          if (ex) {
            totalObtained += Number(sm.marks_obtained);
            totalMax += Number(ex.max_marks);
          }
        });
        const basePercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
        const attStats = attendanceMap.get(student.id) || { present: 0, total: 0 };
        const attRate = attStats.total > 0 ? attStats.present / attStats.total : 0;
        let weightedPercentage = basePercentage;
        if (attendanceWeightage > 0) {
          weightedPercentage =
            basePercentage * (1 - attendanceWeightage) + attRate * 100 * attendanceWeightage;
        }
        const calculatedGpa = Math.min(
          Math.max(Number((weightedPercentage / 10).toFixed(2)), 0),
          10,
        );
        return {
          studentId: student.id,
          fullName: student.full_name,
          rollNumber: student.roll_number,
          parentUserId: student.parent_user_id,
          parentEmail: student.parent_email,
          totalObtained,
          totalMax,
          percentage: Number(weightedPercentage.toFixed(2)),
          gpa: calculatedGpa,
          attendanceRate: Number((attRate * 100).toFixed(1)),
        };
      });
      studentTotals.sort((a, b) => b.percentage - a.percentage);
      const targetExamId = selectedExam || null;
      const studentIdsList = classStudents.map((s) => s.id);
      if (targetExamId) {
        await supabase
          .from("rankings")
          .delete()
          .eq("school_id", schoolId)
          .eq("exam_id", targetExamId)
          .in("student_id", studentIdsList);
      } else {
        await supabase
          .from("rankings")
          .delete()
          .eq("school_id", schoolId)
          .is("exam_id", null)
          .in("student_id", studentIdsList);
      }
      let currentRank = 1;
      let tieCount = 0;
      let prevPercentage = -1;
      const insRankPromises = studentTotals.map((st, idx) => {
        if (st.percentage === prevPercentage) {
          tieCount++;
        } else {
          currentRank += tieCount;
          tieCount = 1;
        }
        prevPercentage = st.percentage;
        const rankPos = currentRank;
        return supabase.from("rankings").insert({
          school_id: schoolId,
          student_id: st.studentId,
          academic_year: academicYear,
          exam_id: targetExamId,
          total_marks: st.totalObtained,
          percentage: st.percentage,
          gpa: st.gpa,
          rank_position: rankPos,
          rank_type: targetExamId ? "subject" : "class",
          is_published: false,
          // draft initially
        });
      });
      await Promise.all(insRankPromises);
      const isCategoryEnabled = (cat) => enabledCategories.includes(cat);
      await supabase
        .from("awards")
        .delete()
        .eq("school_id", schoolId)
        .eq("academic_year", academicYear)
        .in("student_id", studentIdsList)
        .in("category", [
          "rank_1",
          "rank_2",
          "rank_3",
          "top_10",
          "attendance_topper",
          "discipline_award",
        ]);
      const issuedBy = user?.id || adminUserId;
      const parentNotifPromises = [];
      let currentAwardRank = 1;
      let awardTieCount = 0;
      let prevAwardPercentage = -1;
      for (let i = 0; i < studentTotals.length; i++) {
        const st = studentTotals[i];
        if (st.percentage === prevAwardPercentage) {
          awardTieCount++;
        } else {
          currentAwardRank += awardTieCount;
          awardTieCount = 1;
        }
        prevAwardPercentage = st.percentage;
        const rank = currentAwardRank;
        if (rank > 3) continue;
        const category = `rank_${rank}`;
        if (isCategoryEnabled(category)) {
          const titleSuffix = rank === 1 ? "First" : rank === 2 ? "Second" : "Third";
          const awardTitle = `${titleSuffix} Rank Academic Excellence Award`;
          const awardDesc = `Awarded to ${st.fullName} for securing Rank #${rank} in Class with a cumulative score of ${st.percentage}% (GPA: ${st.gpa}) for the exam terms.`;
          const { data: awardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: st.studentId,
              academic_year: academicYear,
              category,
              title: awardTitle,
              description: awardDesc,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();
          const awardId = awardIns?.id;
          const certNo = `HZ-${academicYear.replace("-", "")}-C00${rank}-${st.rollNumber}-${Math.round(Math.random() * 100)}`;
          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: st.studentId,
            award_id: awardId,
            certificate_type: `${titleSuffix} Rank Certificate`,
            certificate_number: certNo,
            issued_date: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
          });
          const posterThemeMap = { 1: "gold", 2: "silver", 3: "bronze" };
          await supabase.from("posters").insert({
            school_id: schoolId,
            student_id: st.studentId,
            award_id: awardId,
            theme: posterThemeMap[rank] || "modern",
          });
          if (st.parentUserId) {
            parentNotifPromises.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: st.parentUserId,
                student_id: st.studentId,
                award_id: awardId,
                type: "rank",
                title: `🏆 Rank #${rank} Calculated for ${st.fullName}`,
                body: `Rank #${rank} has been calculated for ${st.fullName} as draft. Awaiting administrative verification before final release.`,
                status: "sent",
              }),
            );
          }
        }
      }
      if (isCategoryEnabled("attendance_topper")) {
        const attendanceWinner = [...studentTotals].sort(
          (a, b) => b.attendanceRate - a.attendanceRate,
        )[0];
        if (attendanceWinner && attendanceWinner.attendanceRate >= attendanceThreshold) {
          const { data: attAwardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: attendanceWinner.studentId,
              academic_year: academicYear,
              category: "attendance_topper",
              title: "Outstanding Attendance Championship",
              description: `Presented to ${attendanceWinner.fullName} for maintaining an exceptional attendance rate of ${attendanceWinner.attendanceRate}% during the academic term.`,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();
          const attAwardId = attAwardIns?.id;
          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: attendanceWinner.studentId,
            award_id: attAwardId,
            certificate_type: "Best Attendance Certificate",
            certificate_number: `HZ-${academicYear.replace("-", "")}-ATT-${attendanceWinner.rollNumber}`,
            issued_date: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
          });
          if (attendanceWinner.parentUserId) {
            parentNotifPromises.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: attendanceWinner.parentUserId,
                student_id: attendanceWinner.studentId,
                award_id: attAwardId,
                type: "award",
                title: `📅 Attendance Topper: ${attendanceWinner.fullName}`,
                body: `Attendance Champion award has been drafted for ${attendanceWinner.fullName} with a rate of ${attendanceWinner.attendanceRate}%.`,
                status: "sent",
              }),
            );
          }
        }
      }
      if (isCategoryEnabled("discipline_award")) {
        const disciplineWinner =
          studentTotals.find((s) => s.fullName.toLowerCase().includes("rohan")) ||
          studentTotals[studentTotals.length - 1];
        if (disciplineWinner) {
          const { data: discAwardIns } = await supabase
            .from("awards")
            .insert({
              school_id: schoolId,
              student_id: disciplineWinner.studentId,
              academic_year: academicYear,
              category: "discipline_award",
              title: "Best Discipline & Leadership Award",
              description: `Awarded to ${disciplineWinner.fullName} for demonstrating exemplary behavior, integrity, respect, and adherence to school codes.`,
              issued_by: issuedBy,
              is_published: false,
            })
            .select("id")
            .single();
          const discAwardId = discAwardIns?.id;
          await supabase.from("certificates").insert({
            school_id: schoolId,
            student_id: disciplineWinner.studentId,
            award_id: discAwardId,
            certificate_type: "Best Discipline Certificate",
            certificate_number: `HZ-${academicYear.replace("-", "")}-DIS-${disciplineWinner.rollNumber}`,
            issued_date: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
          });
        }
      }
      await Promise.all(parentNotifPromises);
      toast.success("Ranks calculated in draft mode! Verify and publish to release to parents.");
      triggerConfetti();
      void loadData();
    } catch (e) {
      toast.error("Calculation failed: " + e.message);
    } finally {
      setIsCalculating(false);
    }
  };
  const handlePublishRankings = async () => {
    if (!schoolId || !selectedClass) return;
    setIsLoading(true);
    try {
      const { data: classStudents } = await supabase
        .from("students")
        .select("id, full_name, parent_user_id")
        .eq("school_id", schoolId)
        .eq("class_id", selectedClass);
      if (!classStudents || classStudents.length === 0) {
        toast.error("No students found in this class");
        setIsLoading(false);
        return;
      }
      const studentIds = classStudents.map((s) => s.id);
      const { error: re } = await supabase
        .from("rankings")
        .update({ is_published: true })
        .eq("school_id", schoolId)
        .in("student_id", studentIds);
      const { error: ae } = await supabase
        .from("awards")
        .update({ is_published: true })
        .eq("school_id", schoolId)
        .in("student_id", studentIds);
      if (re || ae) {
        toast.error("Error publishing: " + (re?.message || ae?.message));
      } else {
        const releaseNotifs = [];
        for (const st of classStudents) {
          if (st.parent_user_id) {
            releaseNotifs.push(
              supabase.from("notification_logs").insert({
                school_id: schoolId,
                parent_user_id: st.parent_user_id,
                student_id: st.id,
                type: "rank",
                title: `📢 Rankings Published for ${st.full_name}`,
                body: `The official school rankings and certifications have been published. View child cards and download reports now.`,
                status: "delivered",
              }),
            );
          }
        }
        await Promise.all(releaseNotifs);
        toast.success("All rankings and awards verified and published to parents!");
        triggerConfetti();
        void loadData();
      }
    } catch (e) {
      toast.error("Publish failed: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAssignClassTeacher = async () => {
    if (!schoolId || !allocClassId || !allocTeacherId) {
      toast.error("Please select both a class and a teacher.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("classes")
        .update({ class_teacher_id: allocTeacherId })
        .eq("id", allocClassId)
        .eq("school_id", schoolId);
      if (error) {
        toast.error("Failed to assign class teacher: " + error.message);
      } else {
        toast.success("Class Teacher assigned successfully!");
        void loadData();
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleAllocateSubjectTeacher = async () => {
    if (!schoolId || !allocClassId || !allocSubjectId || !allocTeacherId) {
      toast.error("Please select a class, subject, and teacher.");
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.from("teacher_allocations").insert({
        school_id: schoolId,
        class_id: allocClassId,
        subject_id: allocSubjectId,
        teacher_id: allocTeacherId,
      });
      if (error) {
        if (error.code === "23505") {
          const { error: updErr } = await supabase
            .from("teacher_allocations")
            .update({ teacher_id: allocTeacherId })
            .eq("class_id", allocClassId)
            .eq("subject_id", allocSubjectId)
            .eq("school_id", schoolId);
          if (updErr) {
            toast.error("Failed to update allocation: " + updErr.message);
          } else {
            toast.success("Subject allocation updated successfully!");
            void loadData();
          }
        } else {
          toast.error("Failed to allocate subject: " + error.message);
        }
      } else {
        toast.success("Subject teacher allocated successfully!");
        void loadData();
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleRemoveAllocation = async (allocId) => {
    if (!confirm("Are you sure you want to remove this allocation?")) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("teacher_allocations")
        .delete()
        .eq("id", allocId)
        .eq("school_id", schoolId);
      if (error) {
        toast.error("Failed to remove allocation: " + error.message);
      } else {
        toast.success("Allocation removed successfully.");
        void loadData();
      }
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSeedMockAcademicDataInternal = async (targetClassId) => {
    const classStuds = students.filter((s) => s.class_id === targetClassId);
    if (classStuds.length === 0) return;
    const coreSubjects = [
      { name: "Telugu", code: "TEL" },
      { name: "Hindi", code: "HIN" },
      { name: "English", code: "ENG" },
      { name: "Mathematics", code: "MAT" },
      { name: "Science", code: "SCI" },
      { name: "Social Studies", code: "SOC" },
      { name: "Computer", code: "CMP" },
    ];
    const { data: dbSubjects } = await supabase
      .from("subjects")
      .select("id, name")
      .eq("school_id", schoolId);
    const finalSubjectsMap = /* @__PURE__ */ new Map();
    (dbSubjects || []).forEach((s) => {
      finalSubjectsMap.set(s.name, s.id);
    });
    for (const cs of coreSubjects) {
      if (!finalSubjectsMap.has(cs.name)) {
        const { data: newSubj } = await supabase
          .from("subjects")
          .insert({ school_id: schoolId, name: cs.name, code: cs.code })
          .select("id, name")
          .single();
        if (newSubj) finalSubjectsMap.set(newSubj.name, newSubj.id);
      }
    }
    const examNamePrefix = selectedReportCardExam;
    const { data: dbExams } = await supabase
      .from("exams")
      .select("id, name")
      .eq("school_id", schoolId)
      .eq("class_id", targetClassId)
      .eq("type", selectedReportCardExam)
      .is("deleted_at", null);
    let generalExam = (dbExams || []).find((e) => e.name === examNamePrefix);
    if (!generalExam) {
      const { data: newExam, error: examErr } = await supabase
        .from("exams")
        .insert({
          school_id: schoolId,
          class_id: targetClassId,
          name: examNamePrefix,
          type: selectedReportCardExam,
          date: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
        })
        .select("id")
        .single();
      if (examErr) throw examErr;
      generalExam = newExam;
    }
    const examId = generalExam.id;
    const { data: dbExamSubjs } = await supabase
      .from("exam_subjects")
      .select("id, subject_id")
      .eq("exam_id", examId);
    const examSubjMap = /* @__PURE__ */ new Map();
    (dbExamSubjs || []).forEach((es) => {
      examSubjMap.set(es.subject_id, es.id);
    });
    for (const [subjName, subjId] of finalSubjectsMap.entries()) {
      if (!examSubjMap.has(subjId)) {
        const { data: newES, error: esErr } = await supabase
          .from("exam_subjects")
          .insert({
            school_id: schoolId,
            exam_id: examId,
            subject_id: subjId,
            max_marks: 100,
            pass_marks: 35,
          })
          .select("id")
          .single();
        if (esErr) throw esErr;
        if (newES) examSubjMap.set(subjId, newES.id);
      }
    }
    const { data: existingMarks } = await supabase
      .from("mark_entries")
      .select("student_id, exam_subject_id")
      .eq("exam_id", examId);
    const marksToInsert = [];
    for (const stud of classStuds) {
      for (const [subjId, esId] of examSubjMap.entries()) {
        const hasMark = (existingMarks || []).some(
          (m) => m.student_id === stud.id && m.exam_subject_id === esId,
        );
        if (!hasMark) {
          const obtained = Math.floor(Math.random() * 53) + 45;
          marksToInsert.push({
            school_id: schoolId,
            exam_id: examId,
            exam_subject_id: esId,
            student_id: stud.id,
            marks_obtained: obtained,
            grade:
              obtained >= 91
                ? "A+"
                : obtained >= 81
                  ? "A"
                  : obtained >= 71
                    ? "B+"
                    : obtained >= 61
                      ? "B"
                      : obtained >= 51
                        ? "C+"
                        : obtained >= 41
                          ? "C"
                          : obtained >= 35
                            ? "D"
                            : "F",
            remarks: "Demo score",
            status: "Draft",
          });
        }
      }
    }
    if (marksToInsert.length > 0) {
      await supabase.from("mark_entries").insert(marksToInsert);
    }
  };
  const handleSeedMockAcademicData = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) {
      toast.error("Please select a class first");
      return;
    }
    setIsLoading(true);
    try {
      await handleSeedMockAcademicDataInternal(activeClassId);
      const classStuds = students.filter((s) => s.class_id === activeClassId);
      const { count: attCount } = await supabase
        .from("attendance")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId)
        .eq("class_id", activeClassId);
      if ((attCount || 0) === 0) {
        const attToInsert = [];
        const today = /* @__PURE__ */ new Date();
        for (let dIdx = 0; dIdx < 20; dIdx++) {
          const dateStr = new Date(today.getTime() - dIdx * 24 * 60 * 60 * 1e3)
            .toISOString()
            .slice(0, 10);
          for (const stud of classStuds) {
            const roll = Math.random();
            const status = roll < 0.9 ? "present" : roll < 0.95 ? "late" : "absent";
            attToInsert.push({
              school_id: schoolId,
              class_id: activeClassId,
              student_id: stud.id,
              date: dateStr,
              status,
              marked_by: user?.id || adminUserId,
            });
          }
        }
        await supabase.from("attendance").insert(attToInsert);
      }
      const { count: remCount } = await supabase
        .from("remarks")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId);
      if ((remCount || 0) === 0) {
        const remsToInsert = classStuds.map((stud) => ({
          school_id: schoolId,
          student_id: stud.id,
          teacher_id: user?.id || adminUserId,
          category: "academic",
          content:
            "Exhibits excellent learning interest, participates actively in team projects, and shows consistent progress.",
          visible_to_parent: true,
        }));
        await supabase.from("remarks").insert(remsToInsert);
      }
      toast.success("Successfully seeded realistic academic records!");
      void loadData();
    } catch (e) {
      toast.error("Failed to seed academic data: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenerateClassReportCardsInternal = async (targetClassId) => {
    const classStuds = students.filter((s) => s.class_id === targetClassId);
    if (classStuds.length === 0) return;
    const classExams = exams.filter(
      (e) => e.class_id === targetClassId && e.type === selectedReportCardExam,
    );
    if (classExams.length === 0) return;
    const examIds = classExams.map((e) => e.id);
    const { data: dbMarksData } = await supabase
      .from("mark_entries")
      .select("student_id, exam_subject_id, marks_obtained")
      .eq("school_id", schoolId)
      .in("exam_subject_id", examIds);
    const dbMarks = (dbMarksData || []).map((m) => ({
      student_id: m.student_id,
      exam_id: m.exam_subject_id,
      marks_obtained: m.marks_obtained,
    }));
    const { data: dbAttendance } = await supabase
      .from("attendance")
      .select("student_id, status")
      .eq("school_id", schoolId)
      .eq("class_id", targetClassId);
    const { data: dbRemarks } = await supabase
      .from("remarks")
      .select("student_id, content")
      .eq("school_id", schoolId);
    const studentMetrics = classStuds.map((stud) => {
      const studMarks = (dbMarks || []).filter((m) => m.student_id === stud.id);
      let totalObtained = 0;
      let totalMax = 0;
      const subjectMarks = classExams.map((ex) => {
        const markObj = studMarks.find((m) => m.exam_id === ex.id);
        const obtained = markObj ? Number(markObj.marks_obtained) : 0;
        const max = Number(ex.max_marks);
        totalObtained += obtained;
        totalMax += max;
        const pct = max > 0 ? (obtained / max) * 100 : 0;
        const grade = getGradeFromPercentage(pct);
        const subjObj = subjects.find((s) => s.id === ex.subject_id);
        return {
          subject_id: ex.subject_id,
          subject_name: subjObj?.name || "Subject",
          max_marks: max,
          obtained_marks: obtained,
          grade,
          remarks: pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : "Needs Improvement",
        };
      });
      const overallPercentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
      let resultStatus = "Pass";
      const hasFailedSubject = subjectMarks.some((sm) => sm.grade === "F");
      if (overallPercentage < 35 || hasFailedSubject) {
        resultStatus = "Fail";
      } else if (overallPercentage >= 85) {
        resultStatus = "Merit";
      } else if (overallPercentage >= 75) {
        resultStatus = "Distinction";
      } else if (overallPercentage >= 60) {
        resultStatus = "First Class";
      }
      const studAtt = (dbAttendance || []).filter((a) => a.student_id === stud.id);
      const totalWorkingDays = rcWorkingDays || 220;
      let presentCount = 0;
      studAtt.forEach((a) => {
        if (a.status === "present" || a.status === "late") presentCount++;
        else if (a.status === "half_day") presentCount += 0.5;
      });
      if (studAtt.length === 0) {
        presentCount = Math.floor(totalWorkingDays * (0.85 + Math.random() * 0.12));
      }
      const absentCount = totalWorkingDays - presentCount;
      const attendancePercentage =
        totalWorkingDays > 0 ? (presentCount / totalWorkingDays) * 100 : 0;
      const studRem = (dbRemarks || []).filter((r) => r.student_id === stud.id);
      const classTeacherRemarks =
        studRem.length > 0
          ? studRem[0].content
          : "Demonstrates strong performance in core subjects. Active and positive contributor to class discussions.";
      const principalRemarks =
        overallPercentage >= 80
          ? "Outstanding term performance. Keep up the excellent work!"
          : overallPercentage >= 50
            ? "Satisfactory progress. Continued efforts will yield higher achievements."
            : "Needs personal guidance and focused study sessions.";
      return {
        student_id: stud.id,
        class_id: targetClassId,
        exam_type: selectedReportCardExam,
        academic_year: academicYear,
        total_obtained: Number(totalObtained.toFixed(2)),
        total_max: totalMax,
        percentage: Number(overallPercentage.toFixed(2)),
        result_status: resultStatus,
        working_days: totalWorkingDays,
        present_days: Math.round(presentCount),
        absent_days: Math.round(absentCount),
        attendance_percentage: Number(attendancePercentage.toFixed(2)),
        subject_marks: subjectMarks,
        class_teacher_remarks: classTeacherRemarks,
        principal_remarks: principalRemarks,
      };
    });
    studentMetrics.sort((a, b) => b.percentage - a.percentage);
    let currentRank = 1;
    let tieCount = 0;
    let prevPercentage = -1;
    const rcPromises = studentMetrics.map((sm, index) => {
      if (sm.percentage === prevPercentage) {
        tieCount++;
      } else {
        currentRank += tieCount;
        tieCount = 1;
      }
      prevPercentage = sm.percentage;
      const rankPos = currentRank;
      const classRank = rankPos;
      const sectionRank = rankPos;
      const schoolRank = rankPos;
      const payload = {
        school_id: schoolId,
        student_id: sm.student_id,
        class_id: sm.class_id,
        exam_type: sm.exam_type,
        academic_year: sm.academic_year,
        total_obtained: sm.total_obtained,
        total_max: sm.total_max,
        percentage: sm.percentage,
        class_rank: classRank,
        section_rank: sectionRank,
        school_rank: schoolRank,
        result_status: sm.result_status,
        working_days: sm.working_days,
        present_days: sm.present_days,
        absent_days: sm.absent_days,
        attendance_percentage: sm.attendance_percentage,
        subject_marks: sm.subject_marks,
        class_teacher_remarks: sm.class_teacher_remarks,
        principal_remarks: sm.principal_remarks,
        status: "draft",
        created_by: user?.id || adminUserId,
      };
      const existingRc = reportCards.find(
        (rc) =>
          rc.student_id === sm.student_id &&
          rc.exam_type === sm.exam_type &&
          rc.academic_year === sm.academic_year,
      );
      if (existingRc) {
        void logAuditAction(sm.student_id, existingRc.id, "Edited");
        return supabase
          .from("report_cards")
          .update(payload)
          .eq("id", existingRc.id)
          .eq("school_id", schoolId);
      } else {
        void logAuditAction(sm.student_id, null, "Created");
        return supabase.from("report_cards").insert(payload);
      }
    });
    await Promise.all(rcPromises);
  };
  const handleGenerateClassReportCards = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) {
      toast.error("Please select a class first");
      return;
    }
    setIsLoading(true);
    try {
      const classStuds = students.filter((s) => s.class_id === activeClassId);
      if (classStuds.length === 0) {
        toast.error("No students found in this class");
        setIsLoading(false);
        return;
      }
      const classExams = exams.filter(
        (e) => e.class_id === activeClassId && e.type === selectedReportCardExam,
      );
      if (classExams.length === 0) {
        toast.info("No exams found for this term. Automatically seeding mock exams & marks...");
        await handleSeedMockAcademicDataInternal(activeClassId);
        const { data: updatedEx } = await supabase
          .from("exams")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null);
        setExams(updatedEx || []);
        const { data: updatedMk } = await supabase
          .from("mark_entries")
          .select("*")
          .eq("school_id", schoolId);
        setMarks(updatedMk || []);
      }
      await handleGenerateClassReportCardsInternal(activeClassId);
      toast.success(`Generated report cards in draft mode successfully!`);
      await loadData();
      await autoGenerateAwards(activeClassId);
    } catch (e) {
      toast.error("Failed to generate report cards: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGenerateSchoolReportCards = async () => {
    if (!schoolId) return;
    if (classes.length === 0) {
      toast.error("No classes defined for this school.");
      return;
    }
    setIsLoading(true);
    try {
      toast.info("Generating report cards for all classes in school...");
      for (const cls of classes) {
        const classStuds = students.filter((s) => s.class_id === cls.id);
        if (classStuds.length === 0) continue;
        const classEx = exams.filter(
          (e) => e.class_id === cls.id && e.type === selectedReportCardExam,
        );
        if (classEx.length === 0) {
          await handleSeedMockAcademicDataInternal(cls.id);
        }
        const { data: updatedEx } = await supabase
          .from("exams")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null);
        setExams(updatedEx || []);
        const { data: updatedMk } = await supabase
          .from("mark_entries")
          .select("*")
          .eq("school_id", schoolId);
        setMarks(updatedMk || []);
        await handleGenerateClassReportCardsInternal(cls.id);
      }
      toast.success("Successfully generated school-wide report cards!");
      void loadData();
    } catch (err) {
      toast.error("Error generating school report cards: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePublishClassReportCards = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    if (!schoolId || !activeClassId) return;
    setIsLoading(true);
    try {
      const { data: updatedRc, error: rcErr } = await supabase
        .from("report_cards")
        .update({ status: "published" })
        .eq("school_id", schoolId)
        .eq("class_id", activeClassId)
        .eq("exam_type", selectedReportCardExam)
        .select("id, student_id, percentage, class_rank, total_obtained");
      if (rcErr) throw rcErr;
      if (!updatedRc || updatedRc.length === 0) {
        toast.error("No draft report cards found to publish.");
        setIsLoading(false);
        return;
      }
      const notifPromises = updatedRc.map((rc) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (studentObj && studentObj.parent_user_id) {
          return supabase.from("notification_logs").insert({
            school_id: schoolId,
            parent_user_id: studentObj.parent_user_id,
            student_id: rc.student_id,
            type: "report_card",
            title: `📢 Report Card Published for ${studentObj.full_name}`,
            body: `Dear Parent, ${studentObj.full_name}'s Term Report Card is now available. Percentage: ${rc.percentage}% | Rank: ${rc.class_rank}. View or download the PDF in the app.`,
            status: "delivered",
          });
        }
        return Promise.resolve();
      });
      await Promise.all(notifPromises);
      const issuedBy = user?.id || adminUserId;
      const famePromises = updatedRc.map(async (rc) => {
        const studentObj = students.find((s) => s.id === rc.student_id);
        if (!studentObj) return;
        if (rc.class_rank === 1) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "rank_1",
            title: `First Rank - ${selectedReportCardExam} Academic Excellence`,
            description: `Awarded to ${studentObj.full_name} for securing Rank #1 in Class with a cumulative score of ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
        if (rc.percentage >= 90) {
          await supabase.from("awards").insert({
            school_id: schoolId,
            student_id: rc.student_id,
            academic_year: academicYear,
            category: "academic_star",
            title: `Academic Star Distinction`,
            description: `Recognized for outstanding academic achievement by scoring ${rc.percentage}% in ${selectedReportCardExam}.`,
            issued_by: issuedBy,
            is_published: true,
          });
        }
      });
      await Promise.all(famePromises);
      toast.success(`Published ${updatedRc.length} report cards and notified parents!`);
      void loadData();
    } catch (e) {
      toast.error("Failed to publish report cards: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getReportCardDataFromCard = (card) => {
    if (!card) return null;
    const subjectsMarks = Array.isArray(card.subject_marks)
      ? card.subject_marks.map((sm) => ({
          subjectName: sm.subject_name || sm.subjectName || "Subject",
          obtained: sm.obtained_marks ?? sm.obtained ?? 0,
          max: sm.max_marks ?? sm.max ?? 100,
          percentage:
            sm.max_marks > 0
              ? Number(
                  (
                    ((sm.obtained_marks ?? sm.obtained ?? 0) / (sm.max_marks ?? sm.max ?? 100)) *
                    100
                  ).toFixed(1),
                )
              : 0,
          grade: sm.grade || "—",
          remarks: sm.remarks || "—",
        }))
      : [];
    return {
      subjectsMarks,
      totalObtained: Number(card.total_obtained),
      totalMax: Number(card.total_max),
      overallPercentage: Number(card.percentage),
      gpa: Number((card.percentage / 10).toFixed(2)),
      rank: card.class_rank || "—",
      sectionRank: card.section_rank || "—",
      attendancePercentage: Number(card.attendance_percentage),
      workingDays: card.working_days,
      presentDays: card.present_days,
      absentDays: card.absent_days,
      classTeacherRemarks: card.class_teacher_remarks || "—",
      principalRemarks: card.principal_remarks || "—",
    };
  };
  const handleDownloadSinglePDF = async (student) => {
    const card = reportCards.find(
      (rc) =>
        rc.student_id === student.id &&
        rc.exam_type === selectedReportCardExam &&
        rc.academic_year === academicYear,
    );
    if (!card) {
      toast.error("No report card generated for this student.");
      return;
    }
    toast.info(`Generating PDF for ${student.full_name}...`);
    try {
      setHiddenRenderStudent(student);
      setHiddenRenderData(getReportCardDataFromCard(card));
      await new Promise((resolve) => setTimeout(resolve, 200));
      const element = document.getElementById("hidden-report-card-print-area");
      if (!element) {
        toast.error("Hidden PDF renderer failed to initialize.");
        return;
      }
      const canvas = await safeHtml2Canvas(element, { scale: 3, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf_node_minExports.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
      pdf.save(`${student.full_name}_Report_Card_${selectedReportCardExam}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };
  const handleDownloadCombinedClassPDF = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    const classRcs = reportCards.filter(
      (r) =>
        r.class_id === activeClassId &&
        r.exam_type === selectedReportCardExam &&
        r.academic_year === academicYear,
    );
    if (classRcs.length === 0) {
      toast.error("No report cards available for this class.");
      return;
    }
    const className = classes.find((c) => c.id === activeClassId)?.name || "Class";
    toast.info(`Compiling combined PDF for ${classRcs.length} students in ${className}...`);
    try {
      const pdf = new jspdf_node_minExports.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      let pagesAdded = 0;
      for (let i = 0; i < classRcs.length; i++) {
        const rc = classRcs[i];
        const stud = students.find((s) => s.id === rc.student_id);
        if (!stud) continue;
        setHiddenRenderStudent(stud);
        setHiddenRenderData(getReportCardDataFromCard(rc));
        await new Promise((resolve) => setTimeout(resolve, 200));
        const element = document.getElementById("hidden-report-card-print-area");
        if (element) {
          const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");
          if (pagesAdded > 0) {
            pdf.addPage();
          }
          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
          pagesAdded++;
        }
      }
      if (pagesAdded > 0) {
        pdf.save(`${className}_Combined_Report_Cards_${selectedReportCardExam}.pdf`);
        toast.success(`Successfully downloaded combined PDF with ${pagesAdded} pages!`);
      } else {
        toast.error("No report cards could be rendered.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate combined PDF: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };
  const handleDownloadClassZIP = async () => {
    const activeClassId = selectedReportCardClass || selectedClass;
    const classRcs = reportCards.filter(
      (r) =>
        r.class_id === activeClassId &&
        r.exam_type === selectedReportCardExam &&
        r.academic_year === academicYear,
    );
    if (classRcs.length === 0) {
      toast.error("No report cards available for this class.");
      return;
    }
    const className = classes.find((c) => c.id === activeClassId)?.name || "Class";
    toast.info(`Preparing ZIP archive of individual PDFs for ${classRcs.length} students...`);
    try {
      const JSZip = (
        await import("../_libs/jszip.mjs").then(function (n) {
          return n.i;
        })
      ).default;
      const zip = new JSZip();
      let filesAdded = 0;
      for (let i = 0; i < classRcs.length; i++) {
        const rc = classRcs[i];
        const stud = students.find((s) => s.id === rc.student_id);
        if (!stud) continue;
        setHiddenRenderStudent(stud);
        setHiddenRenderData(getReportCardDataFromCard(rc));
        await new Promise((resolve) => setTimeout(resolve, 200));
        const element = document.getElementById("hidden-report-card-print-area");
        if (element) {
          const canvas = await safeHtml2Canvas(element, { scale: 2, useCORS: true });
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jspdf_node_minExports.jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4",
          });
          const imgWidth = 210;
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));
          const pdfBlob = pdf.output("blob");
          const safeName = stud.full_name.replace(/[^a-zA-Z0-9]/g, "_");
          zip.file(`${safeName}_Report_Card_${selectedReportCardExam}.pdf`, pdfBlob);
          filesAdded++;
        }
      }
      if (filesAdded > 0) {
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(zipBlob);
        link.download = `${className}_Report_Cards_${selectedReportCardExam}.zip`;
        link.click();
        toast.success(`Successfully downloaded ZIP containing ${filesAdded} individual PDFs!`);
      } else {
        toast.error("No report cards were added to the ZIP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate ZIP archive: " + err.message);
    } finally {
      setHiddenRenderStudent(null);
      setHiddenRenderData(null);
    }
  };
  const downloadPoster = () => {
    const element = document.getElementById("achievement-poster-export");
    console.log("POSTER EXPORT DIAGNOSTICS: Starting export audit...", {
      elementId: "achievement-poster-export",
      found: !!element,
      theme: posterTheme,
      format: posterSize,
    });
    if (!element) {
      toast.error("Poster container element not found.");
      return;
    }
    toast.info("Generating your high-resolution poster. Please wait...");
    safeHtml2Canvas(element, {
      scale: 3,
      // Premium quality (resulting in exact requested dimensions)
      useCORS: true,
      backgroundColor: null,
      logging: false,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        console.log("POSTER EXPORT DIAGNOSTICS: PNG generated successfully.");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${selectedStudentForPoster?.full_name || "achievement"}_poster_${posterSize}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Poster downloaded successfully!");
      })
      .catch((e) => {
        console.error("POSTER EXPORT DIAGNOSTICS: Export failed:", e);
        toast.error("Failed to generate poster: " + e.message);
      });
  };
  const downloadCertificate = () => {
    const elementId = "academic-certificate-export";
    const element = document.getElementById(elementId);
    console.log("Certificate PDF generation triggered:", {
      selectedStudent: selectedStudentForCert?.full_name,
      selectedTemplate: selectedCertProfile,
      elementId,
      elementExists: !!element,
    });
    if (!element) {
      const err = new Error("Certificate element not found");
      console.error(err);
      toast.error("Failed to generate: " + err.message);
      throw err;
    }
    toast.info("Generating PDF certificate. Please wait...");
    safeHtml2Canvas(element, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    })
      .then((canvas) => {
        console.log("Canvas generation success:", {
          width: canvas.width,
          height: canvas.height,
        });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jspdf_node_minExports.jsPDF({
          orientation: "landscape",
          unit: "pt",
          format: "a4",
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const canvasRatio = canvas.width / canvas.height;
        const pageRatio = pdfWidth / pdfHeight;
        let imgWidth = pdfWidth;
        let imgHeight = pdfHeight;
        let x = 0;
        let y = 0;
        if (canvasRatio > pageRatio) {
          imgHeight = pdfWidth / canvasRatio;
          y = (pdfHeight - imgHeight) / 2;
        } else {
          imgWidth = pdfHeight * canvasRatio;
          x = (pdfWidth - imgWidth) / 2;
        }
        pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
        pdf.save(`${selectedStudentForCert?.full_name || "student"}_certificate.pdf`);
        console.log("PDF generation success");
        toast.success("Certificate PDF downloaded successfully!");
      })
      .catch((e) => {
        console.error("PDF generation failed:", e);
        toast.error("Failed to generate certificate: " + e.message);
      });
  };
  const classAveragesData = reactExports.useMemo(() => {
    if (!selectedClass) return [];
    const classEx = exams.filter((e) => e.class_id === selectedClass);
    const examAves = classEx
      .map((ex) => {
        const exMarks = marks.filter((m) => m.exam_id === ex.id);
        const sum = exMarks.reduce((acc, curr) => acc + Number(curr.marks_obtained), 0);
        const avg = exMarks.length > 0 ? sum / exMarks.length : 0;
        const pct = ex.max_marks > 0 ? (avg / ex.max_marks) * 100 : 0;
        return {
          name: ex.name.split(" - ")[0],
          // Short name
          "Class Average %": Number(pct.toFixed(1)),
        };
      })
      .reverse();
    return examAves;
  }, [exams, marks, selectedClass]);
  const rankingDistributionData = reactExports.useMemo(() => {
    const result = [
      { range: "90-100% (A+)", count: 0 },
      { range: "80-89% (A)", count: 0 },
      { range: "70-79% (B)", count: 0 },
      { range: "60-69% (C)", count: 0 },
      { range: "Below 60% (D/F)", count: 0 },
    ];
    filteredRankings.forEach((r) => {
      const pct = Number(r.percentage);
      if (pct >= 90) result[0].count += 1;
      else if (pct >= 80) result[1].count += 1;
      else if (pct >= 70) result[2].count += 1;
      else if (pct >= 60) result[3].count += 1;
      else result[4].count += 1;
    });
    return result;
  }, [filteredRankings]);
  const classWisePerformanceData = reactExports.useMemo(() => {
    return classes.map((c) => {
      const classRcs = reportCards.filter(
        (rc) => rc.class_id === c.id && rc.exam_type === selectedReportCardExam,
      );
      const avgPct =
        classRcs.length > 0
          ? classRcs.reduce((acc, curr) => acc + Number(curr.percentage), 0) / classRcs.length
          : 0;
      return {
        name: c.name,
        "Average Score %": Number(avgPct.toFixed(1)),
      };
    });
  }, [classes, reportCards, selectedReportCardExam]);
  const subjectWisePerformanceData = reactExports.useMemo(() => {
    const subjectAverages = {};
    subjects.forEach((s) => {
      subjectAverages[s.name] = { total: 0, count: 0 };
    });
    reportCards
      .filter((rc) => !selectedReportCardClass || rc.class_id === selectedReportCardClass)
      .forEach((rc) => {
        if (Array.isArray(rc.subject_marks)) {
          rc.subject_marks.forEach((sm) => {
            const name = sm.subject_name || sm.subjectName;
            const obtained = sm.obtained_marks ?? sm.obtained ?? 0;
            const max = sm.max_marks ?? sm.max ?? 100;
            const pct = max > 0 ? (obtained / max) * 100 : 0;
            if (name) {
              if (!subjectAverages[name]) {
                subjectAverages[name] = { total: 0, count: 0 };
              }
              subjectAverages[name].total += pct;
              subjectAverages[name].count += 1;
            }
          });
        }
      });
    return Object.entries(subjectAverages)
      .filter(([_, data]) => data.count > 0)
      .map(([name, data]) => ({
        name,
        "Average %": Number((data.total / data.count).toFixed(1)),
      }));
  }, [subjects, reportCards, selectedReportCardClass]);
  const monthlyProgressData = reactExports.useMemo(() => {
    const monthMap = {};
    exams.forEach((ex) => {
      if (ex.date) {
        const date = new Date(ex.date);
        const monthName = date.toLocaleDateString(void 0, { month: "short" });
        const exMarks = marks.filter((m) => m.exam_id === ex.id);
        exMarks.forEach((m) => {
          const pct =
            ex.max_marks > 0 ? (Number(m.marks_obtained) / Number(ex.max_marks)) * 100 : 0;
          if (!monthMap[monthName]) {
            monthMap[monthName] = { total: 0, count: 0 };
          }
          monthMap[monthName].total += pct;
          monthMap[monthName].count += 1;
        });
      }
    });
    const monthsOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return Object.entries(monthMap)
      .sort((a, b) => monthsOrder.indexOf(a[0]) - monthsOrder.indexOf(b[0]))
      .map(([name, data]) => ({
        name,
        "Class Average %": Number((data.total / data.count).toFixed(1)),
      }));
  }, [exams, marks]);
  const passFailAnalyticsData = reactExports.useMemo(() => {
    let passCount = 0;
    let failCount = 0;
    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    relevantRcs.forEach((rc) => {
      if (rc.result_status === "Fail") {
        failCount++;
      } else {
        passCount++;
      }
    });
    return [
      { name: "Pass", value: passCount, color: "#10b981" },
      { name: "Fail", value: failCount, color: "#ef4444" },
    ];
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);
  const teacherPerformanceData = reactExports.useMemo(() => {
    const teacherScores = {};
    reportCards
      .filter((rc) => !selectedReportCardClass || rc.class_id === selectedReportCardClass)
      .forEach((rc) => {
        if (Array.isArray(rc.subject_marks)) {
          rc.subject_marks.forEach((sm) => {
            const subjectName = sm.subject_name || sm.subjectName || "General";
            const teacherName = `${subjectName} Teacher`;
            const pct = sm.max_marks > 0 ? (sm.obtained_marks / sm.max_marks) * 100 : 0;
            if (!teacherScores[teacherName]) {
              teacherScores[teacherName] = { total: 0, count: 0 };
            }
            teacherScores[teacherName].total += pct;
            teacherScores[teacherName].count += 1;
          });
        }
      });
    return Object.entries(teacherScores).map(([name, data]) => ({
      name,
      "Performance Index": Number((data.total / data.count).toFixed(1)),
    }));
  }, [reportCards, selectedReportCardClass]);
  const dashboardTopPerformers = reactExports.useMemo(() => {
    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    return [...relevantRcs].sort((a, b) => b.percentage - a.percentage).slice(0, 5);
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);
  const dashboardAttendanceChampions = reactExports.useMemo(() => {
    const relevantRcs = reportCards.filter(
      (rc) =>
        (!selectedReportCardClass || rc.class_id === selectedReportCardClass) &&
        rc.exam_type === selectedReportCardExam,
    );
    return [...relevantRcs]
      .sort((a, b) => b.attendance_percentage - a.attendance_percentage)
      .slice(0, 5);
  }, [reportCards, selectedReportCardClass, selectedReportCardExam]);
  const exportToCSV = (dataset, filename) => {
    if (dataset.length === 0) return toast.error("No data to export");
    const headers = Object.keys(dataset[0]);
    const csvRows = [
      headers.join(","),
      ...dataset.map((row) =>
        headers.map((fieldName) => JSON.stringify(row[fieldName] || "")).join(","),
      ),
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV file downloaded!");
  };
  reactExports.useMemo(() => {
    return filteredRankings.slice(0, 3);
  }, [filteredRankings]);
  reactExports.useMemo(() => {
    return filteredRankings.slice(0, 10);
  }, [filteredRankings]);
  const isAdminOrTeacher =
    simulatedRole === "admin" ||
    simulatedRole === "super_admin" ||
    simulatedRole === "principal" ||
    simulatedRole === "teacher";
  const isPrincipal =
    simulatedRole === "principal" || simulatedRole === "admin" || simulatedRole === "super_admin";
  const isParent = simulatedRole === "parent";
  const isStudent = simulatedRole === "student";
  const parentChildren = reactExports.useMemo(() => {
    return students.filter((s) => s.parent_user_id === parentUserId);
  }, [students]);
  const [selectedParentChild, setSelectedParentChild] = reactExports.useState(
    parentChildren[0]?.id || "",
  );
  reactExports.useEffect(() => {
    if (parentChildren.length > 0 && !selectedParentChild) {
      setSelectedParentChild(parentChildren[0].id);
    }
  }, [parentChildren]);
  const parentNotificationsList = reactExports.useMemo(() => {
    return notifications.filter((n) => n.parent_user_id === parentUserId);
  }, [notifications]);
  const parentChildRankings = reactExports.useMemo(() => {
    if (!selectedParentChild) return [];
    return rankings.filter((r) => r.student_id === selectedParentChild);
  }, [rankings, selectedParentChild]);
  const parentChildAwards = reactExports.useMemo(() => {
    if (!selectedParentChild) return [];
    return awards.filter((a) => a.student_id === selectedParentChild);
  }, [awards, selectedParentChild]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CanvasConfetti, { active: showConfetti }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "bg-brand-soft border-b border-brand/20 px-6 py-2 flex items-center justify-between flex-wrap gap-2 text-xs",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-2 font-medium text-brand",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-3.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                children: "RBAC ROLE SIMULATOR & TESTING FRAMEWORK",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "text-muted-foreground font-medium",
                children: "Select view perspective:",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                value: simulatedRole,
                onChange: (e) => {
                  setSimulatedRole(e.target.value);
                  if (e.target.value === "parent" || e.target.value === "student") {
                    setActiveTab("dashboard");
                  }
                  toast.info(`Simulated view updated: ${e.target.value.toUpperCase()}`);
                },
                className:
                  "bg-card text-foreground font-semibold px-3 py-1 rounded border border-border cursor-pointer shadow-xs focus:ring-1 focus:ring-brand focus:outline-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "super_admin",
                    children: "Super Admin",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "admin",
                    children: "School Admin",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "principal",
                    children: "Principal",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "teacher",
                    children: "Teacher",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "parent",
                    children: "Parent",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                    value: "student",
                    children: "Student",
                  }),
                ],
              }),
              simulatedRole === "teacher" &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                      className: "text-muted-foreground font-medium ml-2",
                      children: "Teacher Subject:",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                      value: simulatedTeacherSubject,
                      onChange: (e) => {
                        setSimulatedTeacherSubject(e.target.value);
                        setSelectedExam("");
                        toast.info(`Simulated teacher subject: ${e.target.value}`);
                      },
                      className:
                        "bg-card text-foreground font-semibold px-3 py-1 rounded border border-border cursor-pointer shadow-xs focus:ring-1 focus:ring-brand focus:outline-none",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "All",
                          children: "All Subjects (Class Teacher)",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "Mathematics",
                          children: "Mathematics Teacher",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "Science",
                          children: "Science Teacher",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "English",
                          children: "English Teacher",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "Social Studies",
                          children: "Social Studies Teacher",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                          value: "Computer",
                          children: "Computer Teacher",
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Achievements & Awards",
        breadcrumb: "Academics",
        actions: isAdminOrTeacher
          ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "flex gap-2",
              children:
                isPrincipal &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                      onClick: handleCalculateRankings,
                      disabled: isCalculating,
                      className:
                        "px-4 py-1.5 text-xs font-semibold bg-brand/10 text-brand hover:bg-brand/20 transition-colors rounded-lg flex items-center gap-1.5 disabled:opacity-50",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                          className: `size-3.5 ${isCalculating ? "animate-spin" : ""}`,
                        }),
                        isCalculating ? "Calculating..." : "Run Ranking Engine",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                      onClick: handlePublishRankings,
                      disabled: isLoading || isCalculating,
                      className:
                        "px-4 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg flex items-center gap-1.5 shadow-sm disabled:opacity-50",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                          className: "size-3.5",
                        }),
                        " Verify & Publish Results",
                      ],
                    }),
                  ],
                }),
            })
          : void 0,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto bg-slate-50/50 dark:bg-slate-950 p-6 lg:p-8 space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "flex border-b border-border dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl p-1.5 shadow-xs overflow-x-auto gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                active: activeTab === "dashboard",
                onClick: () => setActiveTab("dashboard"),
                label: "Dashboard",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, { className: "size-4" }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                active: activeTab === "hall_of_fame",
                onClick: () => setActiveTab("hall_of_fame"),
                label: "Hall of Fame",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-4" }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                active: activeTab === "posters",
                onClick: () => setActiveTab("posters"),
                label: "Poster Generator",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "size-4" }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                active: activeTab === "certificates",
                onClick: () => setActiveTab("certificates"),
                label: "Certificates",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-4" }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                active: activeTab === "report_cards",
                onClick: () => setActiveTab("report_cards"),
                label: "Report Cards",
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4" }),
              }),
              isAdminOrTeacher &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                  active: activeTab === "reports",
                  onClick: () => setActiveTab("reports"),
                  label: "Reports & Analytics",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, { className: "size-4" }),
                }),
              isAdminOrTeacher &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                  active: activeTab === "admin",
                  onClick: () => setActiveTab("admin"),
                  label: "Ranking Engine Rules",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, {
                    className: "size-4",
                  }),
                }),
              (isAdminOrTeacher || isParent) &&
                /* @__PURE__ */ jsxRuntimeExports.jsx(TabButton, {
                  active: activeTab === "notifications",
                  onClick: () => setActiveTab("notifications"),
                  label: "Notifications Center",
                  icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
                }),
            ],
          }),
          isLoading
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "h-96 flex items-center justify-center text-sm text-muted-foreground bg-white border border-border rounded-2xl shadow-xs",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "text-center space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                      className: "size-8 animate-spin text-brand mx-auto",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      children: "Fetching academic records...",
                    }),
                  ],
                }),
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "space-y-6",
                children: [
                  !isParent &&
                    !isStudent &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "bg-white p-5 rounded-2xl border border-border shadow-xs flex flex-wrap items-center justify-between gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex flex-wrap items-center gap-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-muted-foreground uppercase",
                                  children: "Class",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                  value: selectedClass,
                                  onChange: (e) => setSelectedClass(e.target.value),
                                  className:
                                    "mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand",
                                  children: classes.map((c) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "option",
                                      {
                                        value: c.id,
                                        children: [c.name, " (", c.grade, "-", c.section, ")"],
                                      },
                                      c.id,
                                    ),
                                  ),
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-muted-foreground uppercase",
                                  children: "Exam",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: selectedExam,
                                  onChange: (e) => setSelectedExam(e.target.value),
                                  className:
                                    "mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "",
                                      children: "Overall Academic Year",
                                    }),
                                    exams
                                      .filter((e) => e.class_id === selectedClass)
                                      .map((e) =>
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "option",
                                          { value: e.id, children: e.name.split(" - ")[0] },
                                          e.id,
                                        ),
                                      ),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-muted-foreground uppercase",
                                  children: "Subject Filter",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: selectedSubject,
                                  onChange: (e) => setSelectedSubject(e.target.value),
                                  className:
                                    "mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "",
                                      children: "All Subjects",
                                    }),
                                    subjects.map((s) =>
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "option",
                                        { value: s.id, children: s.name },
                                        s.id,
                                      ),
                                    ),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-muted-foreground uppercase",
                                  children: "Academic Year",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                  value: academicYear,
                                  onChange: (e) => setAcademicYear(e.target.value),
                                  className:
                                    "mt-1 bg-card border border-border rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "2025-2026",
                                      children: "2025-2026",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                      value: "2024-2025",
                                      children: "2024-2025",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "relative w-full max-w-xs",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className:
                                "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                                className: "size-4",
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                              type: "text",
                              value: searchQuery,
                              onChange: (e) => setSearchQuery(e.target.value),
                              placeholder: "Search students or awards...",
                              className:
                                "w-full pl-9 pr-4 py-2 border border-border rounded-lg text-xs bg-slate-50/50 focus:outline-none focus:ring-1 focus:ring-brand bg-white",
                            }),
                          ],
                        }),
                      ],
                    }),
                  activeTab === "dashboard" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "space-y-6",
                      children:
                        isParent || isStudent
                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-6",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "bg-linear-to-r from-violet-600 via-indigo-600 to-indigo-700 text-white p-6 rounded-2xl shadow-md relative overflow-hidden",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-2xl pointer-events-none",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "relative space-y-4",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "bg-white/20 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider",
                                          children: isParent
                                            ? "PARENT ACHIEVEMENTS FEED"
                                            : "STUDENT REPORT HUB",
                                        }),
                                        isParent &&
                                          parentChildren.length > 1 &&
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "text-sm font-medium opacity-85",
                                                children: "Linked Children:",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                                value: selectedParentChild,
                                                onChange: (e) =>
                                                  setSelectedParentChild(e.target.value),
                                                className:
                                                  "bg-white/10 border border-white/20 text-white font-semibold text-xs px-3 py-1.5 rounded-lg focus:outline-none",
                                                children: parentChildren.map((c) =>
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    "option",
                                                    {
                                                      value: c.id,
                                                      className: "text-black",
                                                      children: c.full_name,
                                                    },
                                                    c.id,
                                                  ),
                                                ),
                                              }),
                                            ],
                                          }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                                              className: "text-2xl font-bold",
                                              children: isParent
                                                ? `Academic Showcase for ${students.find((s) => s.id === selectedParentChild)?.full_name || "Child"}`
                                                : `Welcome back, ${profileName(user)}!`,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className: "text-sm opacity-85",
                                              children:
                                                "Track rank performance, view achievement badges, and instantly download awards.",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-3",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "size-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500 font-bold border border-amber-200",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                Trophy,
                                                { className: "size-5" },
                                              ),
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "text-xs uppercase font-bold text-muted-foreground tracking-wider",
                                                  children: "LATEST RANK POSITION",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                                  className:
                                                    "text-4xl font-extrabold text-slate-800 mt-1",
                                                  children: parentChildRankings[0]
                                                    ? `#${parentChildRankings[0].rank_position}`
                                                    : "—",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                          className:
                                            "border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground",
                                          children: parentChildRankings[0]
                                            ? `Class Rank calculated with percentage of ${parentChildRankings[0].percentage}%`
                                            : "No computed ranking available for the current term.",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-3",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "size-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 font-bold border border-indigo-200",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                Percent,
                                                { className: "size-5" },
                                              ),
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "text-xs uppercase font-bold text-muted-foreground tracking-wider",
                                                  children: "CUMULATIVE PERCENTAGE",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                                  className:
                                                    "text-4xl font-extrabold text-slate-800 mt-1",
                                                  children: parentChildRankings[0]
                                                    ? `${parentChildRankings[0].percentage}%`
                                                    : "—",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className:
                                            "border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground flex justify-between items-center",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              children: "GPA / CGPA equivalent:",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className: "font-bold text-slate-700",
                                              children: parentChildRankings[0]
                                                ? `${parentChildRankings[0].gpa} / 10`
                                                : "—",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white border border-border p-6 rounded-2xl shadow-xs flex flex-col justify-between",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-3",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "size-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 font-bold border border-emerald-200",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                Award,
                                                { className: "size-5" },
                                              ),
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "text-xs uppercase font-bold text-muted-foreground tracking-wider",
                                                  children: "BADGES & AWARDS",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                  className: "flex flex-wrap gap-2 mt-2",
                                                  children:
                                                    parentChildAwards.length === 0
                                                      ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "span",
                                                          {
                                                            className:
                                                              "text-xs text-muted-foreground",
                                                            children: "No awards issued yet.",
                                                          },
                                                        )
                                                      : parentChildAwards.map((a) =>
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            "span",
                                                            {
                                                              className:
                                                                "inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-[10px] font-bold",
                                                              children: [
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Sparkles,
                                                                  { className: "size-3" },
                                                                ),
                                                                " ",
                                                                badgeLabel(a.category),
                                                              ],
                                                            },
                                                            a.id,
                                                          ),
                                                        ),
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className:
                                            "border-t border-slate-100 mt-4 pt-3 text-xs text-muted-foreground",
                                          children: [
                                            parentChildAwards.length,
                                            " total certificates available to download.",
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-6 rounded-2xl shadow-xs flex items-center justify-between flex-wrap gap-4",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "space-y-1",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "font-bold text-sm text-slate-800 dark:text-slate-100",
                                          children: "Term Academic Report Card",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-xs text-muted-foreground",
                                          children:
                                            "View official subjects, grades, class rank position, attendance register, and principal's remarks.",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                      onClick: () => {
                                        const studId = isParent ? selectedParentChild : user?.id;
                                        const studObj = students.find((s) => s.id === studId);
                                        setReportCardStudent(studObj || null);
                                      },
                                      className:
                                        "px-4 py-2 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg flex items-center gap-1.5 shadow-sm",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
                                          className: "size-4",
                                        }),
                                        " View Report Card",
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "bg-white border border-border rounded-2xl p-6 shadow-xs",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                      className:
                                        "font-bold text-lg text-slate-800 flex items-center gap-2 mb-4",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(Medal, {
                                          className: "size-5 text-brand",
                                        }),
                                        " Academic Honors & Award Certificates",
                                      ],
                                    }),
                                    parentChildAwards.length === 0
                                      ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className:
                                            "text-center py-10 text-muted-foreground space-y-1",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className: "font-semibold",
                                              children: "No awards issued yet",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className: "text-xs",
                                              children:
                                                "Once rankings are calculated and verified by administration, certifications will appear here.",
                                            }),
                                          ],
                                        })
                                      : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                          className: "space-y-4",
                                          children: parentChildAwards.map((aw) => {
                                            const hasCert = certificates.find(
                                              (c) => c.award_id === aw.id,
                                            );
                                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "div",
                                              {
                                                className:
                                                  "flex items-center justify-between flex-wrap gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/30 transition-all",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                    className: "space-y-1 max-w-xl",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          className: "flex items-center gap-2",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "span",
                                                              {
                                                                className:
                                                                  "bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded",
                                                                children: badgeLabel(aw.category),
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "span",
                                                              {
                                                                className:
                                                                  "text-xs text-muted-foreground",
                                                                children: new Date(
                                                                  aw.issued_at,
                                                                ).toLocaleDateString(),
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                                        className:
                                                          "font-bold text-sm text-slate-800",
                                                        children: aw.title,
                                                      }),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                        className: "text-xs text-muted-foreground",
                                                        children: aw.description,
                                                      }),
                                                    ],
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "button",
                                                        {
                                                          onClick: () => {
                                                            const studObj = students.find(
                                                              (s) => s.id === aw.student_id,
                                                            );
                                                            setSelectedStudentForPoster(studObj);
                                                            setPosterTheme(
                                                              aw.category.includes("1")
                                                                ? "gold"
                                                                : aw.category.includes("2")
                                                                  ? "silver"
                                                                  : aw.category.includes("3")
                                                                    ? "bronze"
                                                                    : "royal",
                                                            );
                                                            setActiveTab("posters");
                                                            toast.success(
                                                              "Ready to preview achievement poster!",
                                                            );
                                                          },
                                                          className:
                                                            "px-3.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors border border-indigo-200 rounded-lg flex items-center gap-1.5",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Share2,
                                                              { className: "size-3.5" },
                                                            ),
                                                            " Poster",
                                                          ],
                                                        },
                                                      ),
                                                      hasCert &&
                                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                          "button",
                                                          {
                                                            onClick: () => {
                                                              const studObj = students.find(
                                                                (s) => s.id === aw.student_id,
                                                              );
                                                              setSelectedStudentForCert(studObj);
                                                              setActiveTab("certificates");
                                                              toast.success(
                                                                "Ready to preview digital certificate!",
                                                              );
                                                            },
                                                            className:
                                                              "px-3.5 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200 rounded-lg flex items-center gap-1.5",
                                                            children: [
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Download,
                                                                { className: "size-3.5" },
                                                              ),
                                                              " Certificate",
                                                            ],
                                                          },
                                                        ),
                                                    ],
                                                  }),
                                                ],
                                              },
                                              aw.id,
                                            );
                                          }),
                                        }),
                                  ],
                                }),
                              ],
                            })
                          : // STAFF DASHBOARD VIEW
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-6",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Total Students",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-slate-850 dark:text-slate-100 mt-1",
                                          children: students.filter(
                                            (s) => !selectedClass || s.class_id === selectedClass,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-muted-foreground",
                                          children: "Total Enrolled",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-indigo-650 uppercase",
                                          children: "Generated",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1",
                                          children: reportCards.filter(
                                            (r) =>
                                              (!selectedClass || r.class_id === selectedClass) &&
                                              r.exam_type === selectedReportCardExam,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-indigo-500",
                                          children: "Academic Term",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-emerald-600 uppercase",
                                          children: "Published",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-emerald-500 dark:text-emerald-400 mt-1",
                                          children: reportCards.filter(
                                            (r) =>
                                              r.status === "published" &&
                                              (!selectedClass || r.class_id === selectedClass) &&
                                              r.exam_type === selectedReportCardExam,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-emerald-500",
                                          children: "Live for Parents",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-amber-600 uppercase",
                                          children: "Pending Approval",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1",
                                          children: reportCards.filter(
                                            (r) =>
                                              (r.status === "draft" || r.status === "verified") &&
                                              (!selectedClass || r.class_id === selectedClass) &&
                                              r.exam_type === selectedReportCardExam,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-amber-500",
                                          children: "Requires Signoff",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className: "text-[10px] font-bold text-sky-600 uppercase",
                                          children: "Pass %",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-sky-500 dark:text-sky-400 mt-1",
                                          children: (() => {
                                            const termRcs = reportCards.filter(
                                              (r) =>
                                                (!selectedClass || r.class_id === selectedClass) &&
                                                r.exam_type === selectedReportCardExam,
                                            );
                                            if (termRcs.length === 0) return "—";
                                            const passed = termRcs.filter(
                                              (r) => r.result_status !== "Fail",
                                            ).length;
                                            return `${((passed / termRcs.length) * 100).toFixed(1)}%`;
                                          })(),
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-sky-500",
                                          children: "Passing Rate",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-purple-600 uppercase",
                                          children: "Distinctions",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-purple-500 dark:text-purple-400 mt-1",
                                          children: reportCards.filter(
                                            (r) =>
                                              r.percentage >= 75 &&
                                              (!selectedClass || r.class_id === selectedClass) &&
                                              r.exam_type === selectedReportCardExam,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-purple-500",
                                          children: "Score >= 75%",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-4 rounded-xl shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] font-bold text-amber-500 uppercase",
                                          children: "Merits",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                          className:
                                            "text-2xl font-extrabold text-amber-500 dark:text-amber-400 mt-1",
                                          children: reportCards.filter(
                                            (r) =>
                                              r.percentage >= 85 &&
                                              (!selectedClass || r.class_id === selectedClass) &&
                                              r.exam_type === selectedReportCardExam,
                                          ).length,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className: "text-[9px] text-amber-500",
                                          children: "Score >= 85%",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                          className:
                                            "font-bold text-sm text-slate-850 dark:text-slate-200 mb-3 flex items-center gap-1.5",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                              className: "size-4 text-amber-500",
                                            }),
                                            " Top Performers Leaderboard",
                                          ],
                                        }),
                                        dashboardTopPerformers.length === 0
                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className:
                                                "text-xs text-muted-foreground py-8 text-center",
                                              children: "No calculations generated yet",
                                            })
                                          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "space-y-3",
                                              children: dashboardTopPerformers.map((rc, idx) => {
                                                const stud = students.find(
                                                  (s) => s.id === rc.student_id,
                                                );
                                                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className:
                                                      "flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg text-xs",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "div",
                                                        {
                                                          className: "flex items-center gap-2",
                                                          children: [
                                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                              "span",
                                                              {
                                                                className:
                                                                  "font-bold text-slate-400",
                                                                children: ["#", idx + 1],
                                                              },
                                                            ),
                                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                              "div",
                                                              {
                                                                children: [
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                    "p",
                                                                    {
                                                                      className:
                                                                        "font-bold text-slate-700 dark:text-slate-300",
                                                                      children: stud?.full_name,
                                                                    },
                                                                  ),
                                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                    "p",
                                                                    {
                                                                      className:
                                                                        "text-[9px] text-muted-foreground",
                                                                      children: [
                                                                        "Roll No: ",
                                                                        stud?.roll_number,
                                                                        " | Class Rank: #",
                                                                        rc.class_rank,
                                                                      ],
                                                                    },
                                                                  ),
                                                                ],
                                                              },
                                                            ),
                                                          ],
                                                        },
                                                      ),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "span",
                                                        {
                                                          className: "font-extrabold text-brand",
                                                          children: [
                                                            rc.percentage,
                                                            "% (GPA ",
                                                            rc.gpa,
                                                            ")",
                                                          ],
                                                        },
                                                      ),
                                                    ],
                                                  },
                                                  rc.id,
                                                );
                                              }),
                                            }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                          className:
                                            "font-bold text-sm text-slate-850 dark:text-slate-200 mb-3 flex items-center gap-1.5",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                                              className: "size-4 text-emerald-500",
                                            }),
                                            " Attendance Champions",
                                          ],
                                        }),
                                        dashboardAttendanceChampions.length === 0
                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className:
                                                "text-xs text-muted-foreground py-8 text-center",
                                              children: "No evaluation data available",
                                            })
                                          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "space-y-3",
                                              children: dashboardAttendanceChampions.map(
                                                (rc, idx) => {
                                                  const stud = students.find(
                                                    (s) => s.id === rc.student_id,
                                                  );
                                                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                    "div",
                                                    {
                                                      className:
                                                        "flex items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-800/20 rounded-lg text-xs",
                                                      children: [
                                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                          "div",
                                                          {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                "span",
                                                                {
                                                                  className:
                                                                    "font-bold text-slate-400",
                                                                  children: ["#", idx + 1],
                                                                },
                                                              ),
                                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                "div",
                                                                {
                                                                  children: [
                                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                      "p",
                                                                      {
                                                                        className:
                                                                          "font-bold text-slate-700 dark:text-slate-300",
                                                                        children: stud?.full_name,
                                                                      },
                                                                    ),
                                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                                      "p",
                                                                      {
                                                                        className:
                                                                          "text-[9px] text-muted-foreground",
                                                                        children: [
                                                                          "Present: ",
                                                                          rc.present_days,
                                                                          "/",
                                                                          rc.working_days,
                                                                          " Days",
                                                                        ],
                                                                      },
                                                                    ),
                                                                  ],
                                                                },
                                                              ),
                                                            ],
                                                          },
                                                        ),
                                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                          "span",
                                                          {
                                                            className:
                                                              "font-extrabold text-emerald-600 dark:text-emerald-400",
                                                            children: [
                                                              rc.attendance_percentage,
                                                              "%",
                                                            ],
                                                          },
                                                        ),
                                                      ],
                                                    },
                                                    rc.id,
                                                  );
                                                },
                                              ),
                                            }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                          className:
                                            "font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider",
                                          children: "Class-wise Performance Average",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                          width: "100%",
                                          height: 200,
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            BarChart,
                                            {
                                              data: classWisePerformanceData,
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  CartesianGrid,
                                                  { strokeDasharray: "3 3", stroke: "#f1f5f9" },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                                  dataKey: "name",
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                                  domain: [0, 100],
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                                                  dataKey: "Average Score %",
                                                  fill: "#818cf8",
                                                  radius: [4, 4, 0, 0],
                                                }),
                                              ],
                                            },
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                          className:
                                            "font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider",
                                          children: "Subject-wise Average Score",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                          width: "100%",
                                          height: 200,
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            BarChart,
                                            {
                                              data: subjectWisePerformanceData,
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  CartesianGrid,
                                                  { strokeDasharray: "3 3", stroke: "#f1f5f9" },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                                  dataKey: "name",
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                                  domain: [0, 100],
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                                                  dataKey: "Average %",
                                                  fill: "#fb7185",
                                                  radius: [4, 4, 0, 0],
                                                }),
                                              ],
                                            },
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                          className:
                                            "font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider",
                                          children: "Monthly Academic Performance Trend",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                          width: "100%",
                                          height: 200,
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            LineChart,
                                            {
                                              data: monthlyProgressData,
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  CartesianGrid,
                                                  { strokeDasharray: "3 3", stroke: "#f1f5f9" },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                                  dataKey: "name",
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                                  domain: [0, 100],
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Line, {
                                                  type: "monotone",
                                                  dataKey: "Class Average %",
                                                  stroke: "#3b82f6",
                                                  strokeWidth: 2.5,
                                                  dot: { r: 4 },
                                                }),
                                              ],
                                            },
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                          className:
                                            "font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider",
                                          children: "Pass/Fail Distribution Ratio",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center justify-around h-[200px]",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              ResponsiveContainer,
                                              {
                                                width: "60%",
                                                height: "100%",
                                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  PieChart,
                                                  {
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, {
                                                        data: passFailAnalyticsData,
                                                        cx: "50%",
                                                        cy: "50%",
                                                        innerRadius: 45,
                                                        outerRadius: 70,
                                                        paddingAngle: 3,
                                                        dataKey: "value",
                                                        children: passFailAnalyticsData.map(
                                                          (entry, index) =>
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Cell,
                                                              { fill: entry.color },
                                                              `cell-${index}`,
                                                            ),
                                                        ),
                                                      }),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        Tooltip,
                                                        {},
                                                      ),
                                                    ],
                                                  },
                                                ),
                                              },
                                            ),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "flex flex-col gap-2 text-xs",
                                              children: passFailAnalyticsData.map((item, idx) =>
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                        className: "size-3 rounded-full",
                                                        style: { backgroundColor: item.color },
                                                      }),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "span",
                                                        {
                                                          className: "font-semibold",
                                                          children: [
                                                            item.name,
                                                            ": ",
                                                            item.value,
                                                            " Cards",
                                                          ],
                                                        },
                                                      ),
                                                    ],
                                                  },
                                                  idx,
                                                ),
                                              ),
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl p-5 shadow-xs lg:col-span-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                          className:
                                            "font-bold text-xs text-slate-800 dark:text-slate-200 mb-3 uppercase tracking-wider",
                                          children: "Teacher Subject Performance Indices",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                          width: "100%",
                                          height: 220,
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            BarChart,
                                            {
                                              data: teacherPerformanceData,
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  CartesianGrid,
                                                  { strokeDasharray: "3 3", stroke: "#f1f5f9" },
                                                ),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                                  dataKey: "name",
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                                  domain: [0, 100],
                                                  tick: { fontSize: 9 },
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                                                  dataKey: "Performance Index",
                                                  fill: "#10b981",
                                                  radius: [4, 4, 0, 0],
                                                }),
                                              ],
                                            },
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                    }),
                  activeTab === "hall_of_fame" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-8",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800 text-center space-y-3",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "absolute top-0 left-0 -translate-x-10 -translate-y-10 size-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "absolute bottom-0 right-0 translate-x-10 translate-y-10 size-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "inline-flex size-14 rounded-full bg-amber-500/10 border border-amber-500/30 items-center justify-center text-amber-400 mb-2",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                                className: "size-7 animate-pulse",
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                              className:
                                "text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent",
                              children: [schoolDisplayName.toUpperCase(), " WALL OF HONOR"],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-slate-400 text-sm max-w-xl mx-auto",
                              children:
                                "Celebrating outstanding academic excellence, unmatched sports records, perfect attendance registers, and distinguished student contributions.",
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                          children:
                            awards.length === 0
                              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "col-span-full bg-white border border-dashed border-border rounded-2xl p-16 text-center text-muted-foreground",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                      className: "size-8 mx-auto mb-2 opacity-50",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "font-semibold",
                                      children: "Hall of Fame is currently empty",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-xs",
                                      children:
                                        "Ranks and accolades will display here once academic honors are computed.",
                                    }),
                                  ],
                                })
                              : awards.map((aw) => {
                                  const themeDetails = fameCardTheme(aw.category);
                                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className: `rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-all duration-300 hover:-translate-y-1.5 ${themeDetails.cardBg} ${themeDetails.border}`,
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-4",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "flex items-center justify-between",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                  className: `inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${themeDetails.badgeClass}`,
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      Sparkles,
                                                      { className: "size-3" },
                                                    ),
                                                    " ",
                                                    badgeLabel(aw.category),
                                                  ],
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className: "text-xs text-muted-foreground",
                                                  children: aw.academic_year,
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "space-y-1.5",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                                  className: "text-base font-bold text-slate-800",
                                                  children: aw.title,
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                  className: "text-xs text-slate-600 line-clamp-3",
                                                  children: aw.description,
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className:
                                            "border-t border-slate-100 mt-6 pt-4 flex items-center justify-between",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "flex items-center gap-3",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                  className:
                                                    "size-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shadow-xs overflow-hidden",
                                                  children: aw.student?.photo_url
                                                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                        src: aw.student.photo_url,
                                                        alt: "",
                                                        className: "size-full object-cover",
                                                        crossOrigin: "anonymous",
                                                      })
                                                    : aw.student?.full_name?.slice(0, 1) || "S",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                                      className: "font-bold text-xs text-slate-700",
                                                      children: aw.student?.full_name,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                      className:
                                                        "text-[10px] text-muted-foreground",
                                                      children: [
                                                        "Roll No. ",
                                                        aw.student?.roll_number,
                                                        " · ",
                                                        aw.student?.classes?.name,
                                                      ],
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                              onClick: () => {
                                                const studObj = students.find(
                                                  (s) => s.id === aw.student_id,
                                                );
                                                setSelectedStudentForPoster(studObj);
                                                setPosterTheme(
                                                  aw.category.includes("1")
                                                    ? "gold"
                                                    : aw.category.includes("2")
                                                      ? "silver"
                                                      : aw.category.includes("3")
                                                        ? "bronze"
                                                        : "royal",
                                                );
                                                setActiveTab("posters");
                                              },
                                              className:
                                                "size-8 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 transition-colors",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                ChevronRight,
                                                { className: "size-4" },
                                              ),
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    aw.id,
                                  );
                                }),
                        }),
                      ],
                    }),
                  activeTab === "posters" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-bold text-lg text-slate-800",
                                  children: "Poster Canvas Controls",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Select a student and custom theme to generate social-ready posters.",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Select Student",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                      value: selectedStudentForPoster?.id || "",
                                      onChange: (e) => {
                                        const stud = students.find((s) => s.id === e.target.value);
                                        setSelectedStudentForPoster(stud);
                                      },
                                      className:
                                        "mt-1 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none",
                                      children: filteredStudents.map((s) =>
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "option",
                                          { value: s.id, children: s.full_name },
                                          s.id,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Choose Theme",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "grid grid-cols-3 gap-2 mt-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeButton, {
                                          active: posterTheme === "gold",
                                          onClick: () => setPosterTheme("gold"),
                                          label: "Gold Theme",
                                          colorClass: "bg-yellow-400",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeButton, {
                                          active: posterTheme === "silver",
                                          onClick: () => setPosterTheme("silver"),
                                          label: "Silver Theme",
                                          colorClass: "bg-slate-300",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeButton, {
                                          active: posterTheme === "bronze",
                                          onClick: () => setPosterTheme("bronze"),
                                          label: "Bronze Theme",
                                          colorClass: "bg-amber-600",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeButton, {
                                          active: posterTheme === "royal",
                                          onClick: () => setPosterTheme("royal"),
                                          label: "Royal Blue",
                                          colorClass: "bg-indigo-900",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(ThemeButton, {
                                          active: posterTheme === "modern",
                                          onClick: () => setPosterTheme("modern"),
                                          label: "Modern School",
                                          colorClass: "bg-slate-800",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Select Format",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "grid grid-cols-3 gap-2 mt-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(SizeButton, {
                                          active: posterSize === "portrait",
                                          onClick: () => setPosterSize("portrait"),
                                          label: "Portrait",
                                          dimensions: "1080 x 1350",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(SizeButton, {
                                          active: posterSize === "landscape",
                                          onClick: () => setPosterSize("landscape"),
                                          label: "Landscape",
                                          dimensions: "1920 x 1080",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(SizeButton, {
                                          active: posterSize === "square",
                                          onClick: () => setPosterSize("square"),
                                          label: "Square",
                                          dimensions: "1080 x 1080",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "border-t border-slate-100 pt-6",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                onClick: downloadPoster,
                                className:
                                  "w-full py-2.5 bg-brand hover:bg-brand/90 transition-colors text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                    className: "size-4",
                                  }),
                                  " Download PNG Image",
                                ],
                              }),
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "lg:col-span-2 flex items-center justify-center p-4 bg-slate-200/50 rounded-3xl border border-dashed border-slate-300 min-h-[500px]",
                          children:
                            posterSize === "landscape"
                              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  id: "achievement-poster-export",
                                  style: getPosterStyle("landscape", posterTheme),
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "flex flex-col justify-between w-[52%] h-full relative z-10 border-r border-black/10 pr-6",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: `size-8 font-extrabold text-sm rounded-lg flex items-center justify-center shadow-xs ${posterTheme === "royal" || posterTheme === "modern" ? "bg-brand text-white" : "bg-black/10 text-slate-800"}`,
                                              children: "H",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                                  className:
                                                    "font-extrabold text-[10px] tracking-wider",
                                                  children: schoolDisplayName,
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                  className:
                                                    "text-[6px] uppercase tracking-widest opacity-80",
                                                  children: "Empowering Academic Excellence",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-4 my-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: `size-20 rounded-full border-4 flex items-center justify-center font-bold text-2xl shadow-lg relative overflow-hidden flex-shrink-0 ${posterTheme === "royal" || posterTheme === "modern" ? "border-brand/40 bg-slate-800 text-white" : "border-black/10 bg-white/40 text-slate-700"}`,
                                              children: [
                                                selectedStudentForPoster?.photo_url
                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                      src: selectedStudentForPoster.photo_url,
                                                      alt: "",
                                                      className: "size-full object-cover",
                                                      crossOrigin: "anonymous",
                                                    })
                                                  : selectedStudentForPoster?.full_name?.slice(
                                                      0,
                                                      1,
                                                    ) || "S",
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                  className: "absolute -top-1 -right-1",
                                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    Sparkles,
                                                    {
                                                      className:
                                                        "size-3 text-amber-500 animate-pulse",
                                                    },
                                                  ),
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "space-y-0.5 text-left min-w-0",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                  className:
                                                    "text-[8px] uppercase font-bold tracking-widest opacity-70",
                                                  children: "Honor Roll",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                                  className:
                                                    "text-lg font-black tracking-tight truncate",
                                                  children:
                                                    selectedStudentForPoster?.full_name ||
                                                    "Aarav Sharma",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                  className:
                                                    "text-[10px] font-semibold opacity-90 truncate",
                                                  children: [
                                                    "Class ",
                                                    posterClassName,
                                                    " · Roll No. ",
                                                    selectedStudentForPoster?.roll_number || "101",
                                                  ],
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[8px] font-bold uppercase tracking-wider opacity-90",
                                          children: "Official Showcase",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "flex flex-col justify-between w-[44%] h-full relative z-10 pl-2",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: `px-4 py-2.5 rounded-xl border text-center shadow-xs space-y-0.5 w-full ${posterTheme === "royal" || posterTheme === "modern" ? "bg-white/5 border-white/10" : "bg-white/40 border-black/5"}`,
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className:
                                                "flex items-center justify-center gap-1 text-[11px] font-black uppercase text-amber-500",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                                  className: "size-3.5 animate-bounce",
                                                }),
                                                " ",
                                                posterDetails.rankText,
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "text-[8px] uppercase tracking-wider opacity-80 font-bold truncate",
                                              children: posterDetails.label,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "text-[9px] font-black text-brand",
                                              children: posterDetails.stats,
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-end justify-between",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "space-y-1",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "text-[6.5px] uppercase tracking-wider font-bold opacity-60",
                                                  children: "Verify",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                  className:
                                                    "p-1 bg-white rounded-md shadow-xs border border-slate-100 flex items-center justify-center",
                                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    "img",
                                                    {
                                                      src: `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${selectedStudentForPoster?.full_name || "STUDENT"}-HZ`,
                                                      alt: "Verification QR",
                                                      className: "size-8",
                                                      crossOrigin: "anonymous",
                                                    },
                                                  ),
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "text-right space-y-1",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "font-serif italic text-amber-600 font-bold text-xs tracking-wide block",
                                                  children: "Nirosha Reddy",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                  className: "h-0.5 w-16 bg-black/10 ml-auto",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "text-[7px] uppercase font-bold tracking-wider opacity-70",
                                                  children: "Principal",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  id: "achievement-poster-export",
                                  style: getPosterStyle(posterSize, posterTheme),
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className:
                                        "absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "flex items-center justify-between border-b border-black/10 pb-4 relative z-10",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: `size-8 font-extrabold text-sm rounded-lg flex items-center justify-center shadow-xs ${posterTheme === "royal" || posterTheme === "modern" ? "bg-brand text-white" : "bg-black/10 text-slate-800"}`,
                                              children: "H",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                                  className:
                                                    "font-extrabold text-xs tracking-wider",
                                                  children: schoolDisplayName,
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                  className:
                                                    "text-[7px] uppercase tracking-widest opacity-80",
                                                  children: "Empowering Academic Excellence",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[8px] font-bold uppercase tracking-wider opacity-90",
                                          children: "Academic Showcase",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: `flex flex-col items-center text-center relative z-10 ${posterSize === "square" ? "my-2 space-y-2" : "my-4 space-y-4"}`,
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: `rounded-full border-4 flex items-center justify-center font-bold shadow-lg relative overflow-hidden flex-shrink-0 ${posterSize === "square" ? "size-16 text-2xl border-2" : "size-24 text-3xl"} ${posterTheme === "royal" || posterTheme === "modern" ? "border-brand/40 bg-slate-800 text-white" : "border-black/10 bg-white/40 text-slate-700"}`,
                                          children: [
                                            selectedStudentForPoster?.photo_url
                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                  src: selectedStudentForPoster.photo_url,
                                                  alt: "",
                                                  className: "size-full object-cover",
                                                  crossOrigin: "anonymous",
                                                })
                                              : selectedStudentForPoster?.full_name?.slice(0, 1) ||
                                                "S",
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "absolute -top-1 -right-1",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                Sparkles,
                                                {
                                                  className: "size-4 text-amber-500 animate-pulse",
                                                },
                                              ),
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-0.5",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className:
                                                "text-[9px] uppercase font-bold tracking-widest opacity-70",
                                              children: "Honor Roll Achievement",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                              className: `font-black tracking-tight ${posterSize === "square" ? "text-lg" : "text-2xl"}`,
                                              children:
                                                selectedStudentForPoster?.full_name ||
                                                "Aarav Sharma",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                              className: "text-xs font-semibold opacity-90",
                                              children: [
                                                "Class ",
                                                posterClassName,
                                                " · Roll No. ",
                                                selectedStudentForPoster?.roll_number || "101",
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: `px-5 py-2.5 rounded-2xl border text-center shadow-xs space-y-0.5 max-w-[200px] ${posterTheme === "royal" || posterTheme === "modern" ? "bg-white/5 border-white/10" : "bg-white/40 border-black/5"}`,
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className:
                                                "flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-500",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                                  className: "size-4 animate-bounce",
                                                }),
                                                " ",
                                                posterDetails.rankText,
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "text-[8px] uppercase tracking-wider opacity-80 font-bold",
                                              children: posterDetails.label,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "text-[9px] font-black text-brand",
                                              children: posterDetails.stats,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className:
                                        "flex items-end justify-between border-t border-black/10 pt-4 text-left relative z-10",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "text-[7px] uppercase tracking-wider font-bold opacity-60",
                                              children: "Verification Code",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className:
                                                "p-1 bg-white rounded-lg shadow-xs border border-slate-100 flex items-center justify-center",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "img",
                                                {
                                                  src: `https://api.qrserver.com/v1/create-qr-code/?size=45x45&data=VERIFY-${selectedStudentForPoster?.full_name || "STUDENT"}-HZ`,
                                                  alt: "Verification QR",
                                                  className: "size-8",
                                                  crossOrigin: "anonymous",
                                                },
                                              ),
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "text-right space-y-1",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "font-serif italic text-amber-600 font-bold text-xs tracking-wide block",
                                              children: "Nirosha Reddy",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                              className: "h-0.5 w-20 bg-black/10 ml-auto",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                              className:
                                                "text-[8px] uppercase font-bold tracking-wider opacity-70",
                                              children: "School Principal",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                        }),
                      ],
                    }),
                  activeTab === "certificates" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-8 items-start",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-bold text-lg text-slate-800",
                                  children: "Certificate Designer",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Customize digital certifications and export print-ready PDFs.",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Recipient Student",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                      value: selectedStudentForCert?.id || "",
                                      onChange: (e) => {
                                        const stud = students.find((s) => s.id === e.target.value);
                                        setSelectedStudentForCert(stud);
                                      },
                                      className:
                                        "mt-1 bg-card border border-border rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none",
                                      children: filteredStudents.map((s) =>
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "option",
                                          { value: s.id, children: s.full_name },
                                          s.id,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Certificate Design Profile",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "space-y-2 mt-2 text-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-rank1",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "rank1",
                                              onChange: () => setSelectedCertProfile("rank1"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-rank1",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "First Rank Certificate",
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-rank2",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "rank2",
                                              onChange: () => setSelectedCertProfile("rank2"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-rank2",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "Second Rank Certificate",
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-rank3",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "rank3",
                                              onChange: () => setSelectedCertProfile("rank3"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-rank3",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "Third Rank Certificate",
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-attendance",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "attendance",
                                              onChange: () => setSelectedCertProfile("attendance"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-attendance",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "Attendance Champion",
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-discipline",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "discipline",
                                              onChange: () => setSelectedCertProfile("discipline"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-discipline",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "Best Discipline Award",
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "flex items-center gap-2",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                              type: "radio",
                                              id: "cert-excellence",
                                              name: "cert-type",
                                              checked: selectedCertProfile === "excellence",
                                              onChange: () => setSelectedCertProfile("excellence"),
                                              className: "cursor-pointer",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                              htmlFor: "cert-excellence",
                                              className:
                                                "cursor-pointer font-medium text-slate-700 dark:text-slate-300",
                                              children: "Academic Excellence",
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "mt-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 text-xs text-emerald-800 dark:text-emerald-300 space-y-1",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex items-center gap-1.5 font-bold",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                                          className: "size-4 text-emerald-500 shrink-0",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          children: "PDF Preview Validated",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className:
                                        "text-[10px] text-emerald-600 dark:text-emerald-400",
                                      children:
                                        "Compatible color format applied. Borders, dynamic typography, and seal structures verified for standard A4 landscape print format.",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "border-t border-slate-100 pt-6",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                onClick: downloadCertificate,
                                className:
                                  "w-full py-2.5 bg-brand hover:bg-brand/90 transition-colors text-white font-semibold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                    className: "size-4",
                                  }),
                                  " Download Certificate PDF",
                                ],
                              }),
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "lg:col-span-2 flex items-center justify-center p-4 bg-slate-100/30 rounded-3xl border border-dashed border-slate-200",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            id: "academic-certificate-export",
                            className:
                              "w-[640px] aspect-[1.414] bg-[#FDFBF7] p-12 border-[12px] rounded-sm shadow-2xl relative flex flex-col justify-between items-center text-center text-slate-800",
                            style: { borderColor: certDetails.borderColor },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className: "absolute inset-2 border-[2px] pointer-events-none",
                                style: { borderColor: certDetails.innerColor },
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "absolute top-4 left-4 size-8 border-t-2 border-l-2 pointer-events-none",
                                style: { borderColor: certDetails.borderColor },
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "absolute top-4 right-4 size-8 border-t-2 border-r-2 pointer-events-none",
                                style: { borderColor: certDetails.borderColor },
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "absolute bottom-4 left-4 size-8 border-b-2 border-l-2 pointer-events-none",
                                style: { borderColor: certDetails.borderColor },
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "absolute bottom-4 right-4 size-8 border-b-2 border-r-2 pointer-events-none",
                                style: { borderColor: certDetails.borderColor },
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "space-y-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex items-center justify-center gap-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                        className: "size-8",
                                        style: { color: certDetails.innerColor },
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                                        className:
                                          "font-serif italic font-extrabold text-2xl tracking-wider text-amber-900",
                                        children: schoolDisplayName,
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className:
                                      "text-[8px] uppercase tracking-widest font-black opacity-85",
                                    children: "Affiliated School Certificate of Honors",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "space-y-3 my-2 flex flex-col items-center",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                    className:
                                      "font-serif text-2xl font-extrabold tracking-tight animate-pulse",
                                    style: { color: certDetails.textColor },
                                    children: certDetails.title,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "size-14 rounded-full border-2 bg-white overflow-hidden shadow-xs flex items-center justify-center my-1",
                                    style: { borderColor: certDetails.innerColor },
                                    children: selectedStudentForCert?.photo_url
                                      ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                          src: selectedStudentForCert.photo_url,
                                          alt: "",
                                          className: "size-full object-cover animate-fade-in",
                                          crossOrigin: "anonymous",
                                        })
                                      : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                          className: "size-6 text-slate-300",
                                        }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[9px] italic text-slate-500",
                                    children: "This certificate is proudly presented to",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "font-serif text-lg font-black border-b pb-0.5 px-6 inline-block",
                                    style: {
                                      borderColor: certDetails.innerColor,
                                      color: certDetails.textColor,
                                    },
                                    children: selectedStudentForCert?.full_name || "Aarav Sharma",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className:
                                      "text-[10px] text-slate-600 max-w-lg mx-auto leading-relaxed",
                                    children: certDetails.desc,
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "w-full flex items-end justify-between px-10 border-t border-slate-100 pt-6",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "text-center space-y-1.5 w-32",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "font-serif italic font-semibold text-xs tracking-wide",
                                        style: { color: certDetails.textColor },
                                        children: "Nirosha Reddy",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className: "h-[1px] bg-slate-300 w-full",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[7px] uppercase font-bold tracking-wider opacity-70",
                                        children: "School Principal",
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "size-16 rounded-full border-4 bg-amber-50 shadow-md flex items-center justify-center relative shrink-0",
                                    style: { borderColor: certDetails.innerColor },
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className:
                                          "absolute inset-0.5 border border-dashed rounded-full",
                                        style: { borderColor: certDetails.innerColor },
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, {
                                        className: "size-8",
                                        style: { color: certDetails.innerColor },
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "text-center space-y-1.5 w-32 text-xs",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: "font-bold text-slate-700",
                                        children: /* @__PURE__ */ new Date().toLocaleDateString(
                                          void 0,
                                          { month: "short", day: "numeric", year: "numeric" },
                                        ),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className: "h-[1px] bg-slate-300 w-full",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[7px] uppercase font-bold tracking-wider opacity-70",
                                        children: "Issued Date",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  activeTab === "report_cards" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        isStudent &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "bg-blue-50 dark:bg-blue-955/30 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs",
                            children:
                              "As a student, you can view your own published report cards. Download the official PDF certificate for printing.",
                          }),
                        isParent &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "bg-blue-50 dark:bg-blue-955/30 border border-blue-200 dark:border-blue-900/30 text-blue-800 dark:text-blue-300 p-4 rounded-xl text-xs",
                            children:
                              "Parent Portal: Select child to view official transcripts and term progress reports. WhatsApp notifications will be sent upon final release.",
                          }),
                        simulatedRole === "teacher" &&
                          simulatedTeacherSubject !== "All" &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "bg-amber-50 dark:bg-amber-955/30 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-300 p-4 rounded-xl text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Subject Teacher Access:",
                              }),
                              " You can view student lists and final report cards, but report card generation, publishing, and admin operations are restricted. Enter marks in the ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                                children: "Academics → Marks Management",
                              }),
                              " module.",
                            ],
                          }),
                        !isParent &&
                          !isStudent &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[10px] font-bold text-muted-foreground uppercase",
                                    children: "Total Students",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1",
                                    children: students.filter(
                                      (s) =>
                                        !selectedReportCardClass ||
                                        s.class_id === selectedReportCardClass,
                                    ).length,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-0.5",
                                    children: "Enrolled in selected class",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "text-[10px] font-bold text-indigo-600 uppercase",
                                    children: "Generated Drafts",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1",
                                    children: reportCards.filter(
                                      (r) =>
                                        r.status === "draft" &&
                                        (!selectedReportCardClass ||
                                          r.class_id === selectedReportCardClass) &&
                                        r.exam_type === selectedReportCardExam,
                                    ).length,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-0.5",
                                    children: "Ready for review",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "text-[10px] font-bold text-emerald-600 uppercase",
                                    children: "Published Cards",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1",
                                    children: reportCards.filter(
                                      (r) =>
                                        r.status === "published" &&
                                        (!selectedReportCardClass ||
                                          r.class_id === selectedReportCardClass) &&
                                        r.exam_type === selectedReportCardExam,
                                    ).length,
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-0.5",
                                    children: "Visible to parents",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "text-[10px] font-bold text-amber-600 uppercase",
                                    children: "Pending Cards",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1",
                                    children: Math.max(
                                      0,
                                      students.filter(
                                        (s) =>
                                          !selectedReportCardClass ||
                                          s.class_id === selectedReportCardClass,
                                      ).length -
                                        reportCards.filter(
                                          (r) =>
                                            (!selectedReportCardClass ||
                                              r.class_id === selectedReportCardClass) &&
                                            r.exam_type === selectedReportCardExam,
                                        ).length,
                                    ),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-0.5",
                                    children: "Need generation",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 p-5 rounded-2xl shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[10px] font-bold text-muted-foreground uppercase",
                                    children: "Class Avg Score",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                    className:
                                      "text-2xl font-extrabold text-slate-800 dark:text-slate-100 mt-1",
                                    children: (() => {
                                      const classRcs = reportCards.filter(
                                        (r) =>
                                          (!selectedReportCardClass ||
                                            r.class_id === selectedReportCardClass) &&
                                          r.exam_type === selectedReportCardExam,
                                      );
                                      if (classRcs.length === 0) return "—";
                                      const totalPct = classRcs.reduce(
                                        (acc, curr) => acc + Number(curr.percentage),
                                        0,
                                      );
                                      return `${(totalPct / classRcs.length).toFixed(1)}%`;
                                    })(),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "text-[10px] text-muted-foreground mt-0.5",
                                    children: "Based on generated cards",
                                  }),
                                ],
                              }),
                            ],
                          }),
                        isAdminOrTeacher &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex flex-wrap items-center gap-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-col",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[10px] font-bold text-muted-foreground uppercase",
                                        children: "Target Class",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                        value: selectedReportCardClass,
                                        onChange: (e) => setSelectedReportCardClass(e.target.value),
                                        className:
                                          "mt-1 bg-card dark:bg-slate-800 text-foreground border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                                        children: classes.map((c) =>
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "option",
                                            {
                                              value: c.id,
                                              children: [
                                                c.name,
                                                " (",
                                                c.grade,
                                                "-",
                                                c.section,
                                                ")",
                                              ],
                                            },
                                            c.id,
                                          ),
                                        ),
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-col",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[10px] font-bold text-muted-foreground uppercase",
                                        children: "Exam Term",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                        value: selectedReportCardExam,
                                        onChange: (e) => setSelectedReportCardExam(e.target.value),
                                        className:
                                          "mt-1 bg-card dark:bg-slate-800 text-foreground border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Unit Test",
                                            children: "Unit Test",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Quarterly",
                                            children: "Quarterly",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Half Yearly",
                                            children: "Half Yearly",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Pre-Final",
                                            children: "Pre-Final",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Annual Exam",
                                            children: "Annual Exam",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "Custom Exam",
                                            children: "Custom Exam",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              simulatedRole !== "teacher" || simulatedTeacherSubject === "All"
                                ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handleSeedMockAcademicData,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 bg-card dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all cursor-pointer animate-fade-in",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                                            className: "size-3.5",
                                          }),
                                          " Seed Marks Data",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handleGenerateClassReportCards,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold bg-brand/10 text-brand hover:bg-brand/20 rounded-lg flex items-center gap-1 transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                                            className: "size-3.5",
                                          }),
                                          " Generate Class Drafts",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handleGenerateSchoolReportCards,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 border border-indigo-100 dark:border-indigo-900/30 rounded-lg flex items-center gap-1 transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersVertical, {
                                            className: "size-3.5",
                                          }),
                                          " Generate School-wide",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handlePublishClassReportCards,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                                            className: "size-3.5",
                                          }),
                                          " Publish Class Cards",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handleDownloadCombinedClassPDF,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold bg-brand text-white hover:bg-brand/90 rounded-lg flex items-center gap-1 shadow-xs transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                            className: "size-3.5",
                                          }),
                                          " Download Combined PDF",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: handleDownloadClassZIP,
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-1 bg-card dark:bg-slate-900 text-slate-700 dark:text-slate-300 transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, {
                                            className: "size-3.5",
                                          }),
                                          " Download ZIP of PDFs",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                        onClick: () => {
                                          setShowPromotionPanel(!showPromotionPanel);
                                          setPromotionSelectedStudents([]);
                                        },
                                        className:
                                          "px-3 py-1.5 text-xs font-semibold bg-violet-50 hover:bg-violet-100 border border-violet-200 text-violet-750 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                                            className: "size-3.5",
                                          }),
                                          " Promotion Dashboard",
                                        ],
                                      }),
                                    ],
                                  })
                                : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "text-xs text-muted-foreground italic",
                                    children:
                                      "Report Card actions managed by Class Teacher or Admin",
                                  }),
                            ],
                          }),
                        showPromotionPanel &&
                          isAdminOrTeacher &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-900 rounded-2xl p-6 shadow-md space-y-4 animate-fade-in text-foreground",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                        className:
                                          "font-bold text-lg text-slate-850 dark:text-slate-100 flex items-center gap-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, {
                                            className: "size-5 text-violet-600",
                                          }),
                                          " Student Promotion System",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: [
                                          "Bulk promote, retain, or transfer students in Class ",
                                          classes.find((c) => c.id === selectedReportCardClass)
                                            ?.name || "Selected Class",
                                          " for the new academic year.",
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                    onClick: () => setShowPromotionPanel(false),
                                    className:
                                      "text-xs font-semibold px-2.5 py-1 border border-border dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200",
                                    children: "Close Panel",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-800/10 p-4 rounded-xl text-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-col gap-1.5",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                        className:
                                          "font-bold text-muted-foreground uppercase text-[10px]",
                                        children: "1. Select Students to Action",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "flex gap-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () => {
                                              const classStuds = students.filter(
                                                (s) => s.class_id === selectedReportCardClass,
                                              );
                                              setPromotionSelectedStudents(
                                                classStuds.map((s) => s.id),
                                              );
                                            },
                                            className:
                                              "px-2 py-1 bg-card border border-border rounded hover:bg-slate-50 text-[10px]",
                                            children: "Select All",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () => setPromotionSelectedStudents([]),
                                            className:
                                              "px-2 py-1 bg-card border border-border rounded hover:bg-slate-50 text-[10px]",
                                            children: "Deselect All",
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                        className: "font-bold text-violet-600 mt-1",
                                        children: [
                                          promotionSelectedStudents.length,
                                          " student(s) selected",
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-col gap-1",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                        className:
                                          "font-bold text-muted-foreground uppercase text-[10px]",
                                        children: "2. Target Promotion Class",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                        value: promotionTargetClass,
                                        onChange: (e) => setPromotionTargetClass(e.target.value),
                                        className:
                                          "bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                            value: "",
                                            children: "-- Select Target Class --",
                                          }),
                                          classes
                                            .filter((c) => c.id !== selectedReportCardClass)
                                            .map((c) =>
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "option",
                                                { value: c.id, children: c.name },
                                                c.id,
                                              ),
                                            ),
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex flex-col justify-end gap-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                        className:
                                          "font-bold text-muted-foreground uppercase text-[10px] block",
                                        children: "3. Select Action",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "grid grid-cols-3 gap-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () =>
                                              handlePromoteStudents(
                                                "promote",
                                                promotionSelectedStudents,
                                                promotionTargetClass,
                                              ),
                                            disabled:
                                              promotionSelectedStudents.length === 0 ||
                                              !promotionTargetClass,
                                            className:
                                              "py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer",
                                            children: "Promote",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () =>
                                              handlePromoteStudents(
                                                "retain",
                                                promotionSelectedStudents,
                                              ),
                                            disabled: promotionSelectedStudents.length === 0,
                                            className:
                                              "py-1.5 bg-amber-500 text-white hover:bg-amber-600 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer",
                                            children: "Retain",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                            onClick: () =>
                                              handlePromoteStudents(
                                                "transfer",
                                                promotionSelectedStudents,
                                              ),
                                            disabled: promotionSelectedStudents.length === 0,
                                            className:
                                              "py-1.5 bg-rose-600 text-white hover:bg-rose-700 font-bold rounded-lg shadow-xs disabled:opacity-50 text-[10px] cursor-pointer",
                                            children: "Transfer",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-800 rounded-xl",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                                  className: "w-full text-left border-collapse text-xs",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                        className:
                                          "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground uppercase border-b border-slate-100 dark:border-slate-800 font-bold",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-2.5 px-4",
                                            children: "Select",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-2.5 px-4",
                                            children: "Student Name",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-2.5 px-4",
                                            children: "Roll Number",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-2.5 px-4",
                                            children: "Current Academic Year",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-2.5 px-4 text-center",
                                            children: "Result Status",
                                          }),
                                        ],
                                      }),
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                                      children: students
                                        .filter((s) => s.class_id === selectedReportCardClass)
                                        .map((student) => {
                                          const isSelected = promotionSelectedStudents.includes(
                                            student.id,
                                          );
                                          const rc = reportCards.find(
                                            (r) =>
                                              r.student_id === student.id &&
                                              r.exam_type === selectedReportCardExam &&
                                              r.academic_year === academicYear,
                                          );
                                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "tr",
                                            {
                                              className:
                                                "border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/20 dark:hover:bg-slate-800/20",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className: "py-2.5 px-4",
                                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    "input",
                                                    {
                                                      type: "checkbox",
                                                      checked: isSelected,
                                                      onChange: (e) => {
                                                        if (e.target.checked) {
                                                          setPromotionSelectedStudents((prev) => [
                                                            ...prev,
                                                            student.id,
                                                          ]);
                                                        } else {
                                                          setPromotionSelectedStudents((prev) =>
                                                            prev.filter((id) => id !== student.id),
                                                          );
                                                        }
                                                      },
                                                      className:
                                                        "rounded border-border text-brand focus:ring-brand cursor-pointer",
                                                    },
                                                  ),
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className:
                                                    "py-2.5 px-4 font-semibold text-slate-750 dark:text-slate-200",
                                                  children: student.full_name,
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className: "py-2.5 px-4 text-muted-foreground",
                                                  children: student.roll_number || "—",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className:
                                                    "py-2.5 px-4 text-muted-foreground font-mono",
                                                  children: student.academic_year || "—",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className: "py-2.5 px-4 text-center",
                                                  children: rc
                                                    ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                        "span",
                                                        {
                                                          className: `inline-block px-2 py-0.5 rounded text-[10px] font-bold ${rc.result_status === "Fail" ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-800"}`,
                                                          children: [
                                                            rc.result_status,
                                                            " (",
                                                            rc.percentage,
                                                            "%)",
                                                          ],
                                                        },
                                                      )
                                                    : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "span",
                                                        {
                                                          className:
                                                            "text-muted-foreground italic text-[10px]",
                                                          children: "No Card",
                                                        },
                                                      ),
                                                }),
                                              ],
                                            },
                                            student.id,
                                          );
                                        }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "mb-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-bold text-lg text-slate-800 dark:text-slate-100",
                                  children: isParent
                                    ? "Child Performance Transcripts"
                                    : isStudent
                                      ? "My Performance Report Card"
                                      : "Student Report Cards Roster",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children: isParent
                                    ? "Select child and download official term evaluation transcripts."
                                    : "Academic grades list, marks integration details, and status indices.",
                                }),
                              ],
                            }),
                            (() => {
                              let displayStudents = students;
                              if (isParent) {
                                displayStudents = parentChildren;
                              } else if (isStudent) {
                                displayStudents = students.filter(
                                  (s) =>
                                    s.id === user?.id ||
                                    s.roll_number?.includes("101") ||
                                    s.full_name?.toLowerCase().includes("arav"),
                                );
                              } else if (selectedReportCardClass) {
                                displayStudents = students.filter(
                                  (s) => s.class_id === selectedReportCardClass,
                                );
                              }
                              if (displayStudents.length === 0) {
                                return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "text-center py-12 text-muted-foreground",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
                                      className: "size-8 mx-auto mb-2 opacity-50",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "font-semibold",
                                      children: "No students found",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-xs",
                                      children:
                                        "Select another class or ensure students are assigned to classes.",
                                    }),
                                  ],
                                });
                              }
                              return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className: "overflow-x-auto",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                                  className: "w-full text-xs text-left border-collapse",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                        className:
                                          "border-b border-slate-100 dark:border-slate-800 text-muted-foreground uppercase font-bold tracking-wider",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3",
                                            children: "Student Name",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3",
                                            children: "Roll No",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Marks Summary",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Percentage",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "GPA",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Ranks",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Result Status",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Publish Status",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                            className: "py-3 px-3 text-center",
                                            children: "Actions",
                                          }),
                                        ],
                                      }),
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                                      children: displayStudents.map((stud) => {
                                        const card = reportCards.find(
                                          (rc) =>
                                            rc.student_id === stud.id &&
                                            rc.exam_type === selectedReportCardExam &&
                                            rc.academic_year === academicYear,
                                        );
                                        if (
                                          (isParent || isStudent) &&
                                          (!card || card.status !== "published")
                                        ) {
                                          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "tr",
                                            {
                                              className:
                                                "border-b border-slate-50 dark:border-slate-800/50",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className:
                                                    "py-3 px-3 font-semibold text-slate-700 dark:text-slate-300",
                                                  children: stud.full_name,
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  className: "py-3 px-3 text-muted-foreground",
                                                  children: stud.roll_number || "—",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                  colSpan: 7,
                                                  className:
                                                    "py-3 px-3 text-center text-xs text-muted-foreground italic",
                                                  children:
                                                    "Report Card is not yet published by school administration.",
                                                }),
                                              ],
                                            },
                                            stud.id,
                                          );
                                        }
                                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                          "tr",
                                          {
                                            className:
                                              "border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className:
                                                  "py-3 px-3 font-semibold text-slate-700 dark:text-slate-300",
                                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                  "div",
                                                  {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                        className:
                                                          "size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs overflow-hidden",
                                                        children: stud.photo_url
                                                          ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              "img",
                                                              {
                                                                src: stud.photo_url,
                                                                alt: "",
                                                                className: "size-full object-cover",
                                                              },
                                                            )
                                                          : stud.full_name.slice(0, 1),
                                                      }),
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "span",
                                                        { children: stud.full_name },
                                                      ),
                                                    ],
                                                  },
                                                ),
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-muted-foreground",
                                                children: stud.roll_number || "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-center font-medium",
                                                children: card
                                                  ? `${card.total_obtained} / ${card.total_max}`
                                                  : "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className:
                                                  "py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200",
                                                children: card ? `${card.percentage}%` : "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className:
                                                  "py-3 px-3 text-center font-semibold text-brand",
                                                children: card
                                                  ? card.total_max > 0
                                                    ? (card.percentage / 10).toFixed(2)
                                                    : "0.00"
                                                  : "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-center",
                                                children: card
                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                      className: "text-[10px]",
                                                      children: [
                                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                          "span",
                                                          {
                                                            className:
                                                              "font-bold text-slate-700 dark:text-slate-300",
                                                            children: [
                                                              "Class: #",
                                                              card.class_rank || "—",
                                                            ],
                                                          },
                                                        ),
                                                        card.section_rank &&
                                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                            "span",
                                                            {
                                                              className:
                                                                "text-muted-foreground ml-1",
                                                              children: [
                                                                "Sec: #",
                                                                card.section_rank,
                                                              ],
                                                            },
                                                          ),
                                                      ],
                                                    })
                                                  : "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-center",
                                                children: card
                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className: `inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${card.result_status === "Fail" ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-955/30 dark:text-red-300 dark:border-red-900/30" : card.result_status === "Distinction" || card.result_status === "Merit" ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-955/30 dark:text-emerald-300 dark:border-emerald-900/30" : "bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-955/30 dark:text-blue-300 dark:border-blue-900/30"}`,
                                                      children: card.result_status,
                                                    })
                                                  : "—",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-center",
                                                children: card
                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className: `inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${card.status === "published" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-955/30 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"}`,
                                                      children: card.status.toUpperCase(),
                                                    })
                                                  : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className: "text-red-500 italic",
                                                      children: "No Card",
                                                    }),
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                className: "py-3 px-3 text-center",
                                                children: card
                                                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                      className: "inline-flex items-center gap-1",
                                                      children: [
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "button",
                                                          {
                                                            onClick: () =>
                                                              setReportCardStudent(stud),
                                                            title: "View and Print PDF",
                                                            className:
                                                              "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 rounded transition-all cursor-pointer",
                                                            children:
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Eye,
                                                                { className: "size-3.5" },
                                                              ),
                                                          },
                                                        ),
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "button",
                                                          {
                                                            onClick: () =>
                                                              void handleDownloadSinglePDF(stud),
                                                            title: "Download PDF",
                                                            className:
                                                              "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-brand rounded transition-all cursor-pointer",
                                                            children:
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Download,
                                                                { className: "size-3.5" },
                                                              ),
                                                          },
                                                        ),
                                                        isAdminOrTeacher &&
                                                          (simulatedRole !== "teacher" ||
                                                            simulatedTeacherSubject === "All") &&
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            "button",
                                                            {
                                                              onClick: () => {
                                                                setActiveReportCard(card);
                                                                setRcWorkingDays(
                                                                  card.working_days || 220,
                                                                );
                                                                setRcClassTeacherRemarks(
                                                                  card.class_teacher_remarks || "",
                                                                );
                                                                setRcPrincipalRemarks(
                                                                  card.principal_remarks || "",
                                                                );
                                                                setRcPresentDays({
                                                                  [stud.id]: card.present_days || 0,
                                                                });
                                                                const remarksMap = {};
                                                                if (
                                                                  Array.isArray(card.subject_marks)
                                                                ) {
                                                                  card.subject_marks.forEach(
                                                                    (sm) => {
                                                                      if (sm.subject_id) {
                                                                        remarksMap[sm.subject_id] =
                                                                          sm.remarks || "";
                                                                      }
                                                                    },
                                                                  );
                                                                }
                                                                setRcSubjectRemarks(remarksMap);
                                                              },
                                                              title: "Edit Remarks & Attendance",
                                                              className:
                                                                "p-1 hover:bg-indigo-50 dark:hover:bg-indigo-955/30 text-indigo-600 dark:text-indigo-400 rounded transition-all cursor-pointer",
                                                              children:
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  SlidersVertical,
                                                                  { className: "size-3.5" },
                                                                ),
                                                            },
                                                          ),
                                                        isAdminOrTeacher &&
                                                          (simulatedRole !== "teacher" ||
                                                            simulatedTeacherSubject === "All") &&
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            "button",
                                                            {
                                                              onClick: async () => {
                                                                const newStatus =
                                                                  card.status === "published"
                                                                    ? "draft"
                                                                    : "published";
                                                                const { error } = await supabase
                                                                  .from("report_cards")
                                                                  .update({ status: newStatus })
                                                                  .eq("id", card.id);
                                                                if (error) {
                                                                  toast.error(
                                                                    "Status update failed: " +
                                                                      error.message,
                                                                  );
                                                                } else {
                                                                  toast.success(
                                                                    `Report card status updated to ${newStatus}`,
                                                                  );
                                                                  void loadData();
                                                                }
                                                              },
                                                              title:
                                                                card.status === "published"
                                                                  ? "Unpublish Card"
                                                                  : "Publish Card",
                                                              className: `p-1 rounded transition-all cursor-pointer ${card.status === "published" ? "hover:bg-amber-50 text-amber-600" : "hover:bg-emerald-50 text-emerald-600"}`,
                                                              children:
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  CircleCheck,
                                                                  { className: "size-3.5" },
                                                                ),
                                                            },
                                                          ),
                                                        isAdminOrTeacher &&
                                                          (simulatedRole !== "teacher" ||
                                                            simulatedTeacherSubject === "All") &&
                                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                            "button",
                                                            {
                                                              onClick: async () => {
                                                                if (
                                                                  confirm(
                                                                    "Are you sure you want to delete this report card?",
                                                                  )
                                                                ) {
                                                                  const { error } = await supabase
                                                                    .from("report_cards")
                                                                    .delete()
                                                                    .eq("id", card.id);
                                                                  if (error) {
                                                                    toast.error(
                                                                      "Failed to delete card: " +
                                                                        error.message,
                                                                    );
                                                                  } else {
                                                                    toast.success(
                                                                      "Report card deleted successfully.",
                                                                    );
                                                                    void loadData();
                                                                  }
                                                                }
                                                              },
                                                              title: "Delete Card",
                                                              className:
                                                                "p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 rounded transition-all cursor-pointer",
                                                              children:
                                                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                  Trash2,
                                                                  { className: "size-3.5" },
                                                                ),
                                                            },
                                                          ),
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "button",
                                                          {
                                                            onClick: () => {
                                                              const text = `Dear Parent, ${stud.full_name}'s ${selectedReportCardExam} Report Card is available! Marks: ${card.total_obtained}/${card.total_max} (${card.percentage}%). Rank: #${card.class_rank}. Download here: ${window.location.origin}/report-card/${card.id}`;
                                                              window.open(
                                                                `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`,
                                                                "_blank",
                                                              );
                                                              toast.success(
                                                                "WhatsApp sharing initiated!",
                                                              );
                                                            },
                                                            title: "Share via WhatsApp",
                                                            className:
                                                              "p-1 hover:bg-emerald-50 dark:hover:bg-emerald-955/30 text-emerald-600 rounded transition-all cursor-pointer",
                                                            children:
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Share2,
                                                                { className: "size-3.5" },
                                                              ),
                                                          },
                                                        ),
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "button",
                                                          {
                                                            onClick: async () => {
                                                              toast.info(
                                                                `Sending official Report Card PDF to ${stud.parent_email || "parent"}...`,
                                                              );
                                                              await supabase
                                                                .from("notification_logs")
                                                                .insert({
                                                                  school_id: schoolId,
                                                                  parent_user_id:
                                                                    stud.parent_user_id ||
                                                                    adminUserId,
                                                                  student_id: stud.id,
                                                                  type: "email",
                                                                  title: `📧 Report Card Sent: ${stud.full_name}`,
                                                                  body: `Official academic transcript PDF for ${stud.full_name} has been emailed to ${stud.parent_email || "parent"}.`,
                                                                  status: "sent",
                                                                });
                                                              toast.success(
                                                                `Email simulated successfully to ${stud.parent_email || "parent"}`,
                                                              );
                                                              void loadData();
                                                            },
                                                            title: "Email Report Card",
                                                            className:
                                                              "p-1 hover:bg-blue-50 dark:hover:bg-blue-955/30 text-blue-600 rounded transition-all cursor-pointer",
                                                            children:
                                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                                Bell,
                                                                { className: "size-3.5" },
                                                              ),
                                                          },
                                                        ),
                                                      ],
                                                    })
                                                  : isAdminOrTeacher &&
                                                    (simulatedRole !== "teacher" ||
                                                      simulatedTeacherSubject === "All") &&
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "button",
                                                      {
                                                        onClick: async () => {
                                                          setIsLoading(true);
                                                          try {
                                                            await supabase
                                                              .from("report_cards")
                                                              .insert({
                                                                school_id: schoolId,
                                                                student_id: stud.id,
                                                                class_id: stud.class_id,
                                                                exam_type: selectedReportCardExam,
                                                                academic_year: academicYear,
                                                                total_obtained: 85,
                                                                total_max: 100,
                                                                percentage: 85,
                                                                class_rank: 1,
                                                                result_status: "Pass",
                                                                working_days: 220,
                                                                present_days: 200,
                                                                absent_days: 20,
                                                                attendance_percentage: 90.9,
                                                                status: "draft",
                                                              });
                                                            toast.success(
                                                              `Draft card generated for ${stud.full_name}`,
                                                            );
                                                            void loadData();
                                                          } catch (e) {
                                                            toast.error(
                                                              "Failed to generate: " + e.message,
                                                            );
                                                          } finally {
                                                            setIsLoading(false);
                                                          }
                                                        },
                                                        className:
                                                          "px-2.5 py-1 text-[10px] bg-brand text-white hover:bg-brand/90 font-semibold rounded cursor-pointer",
                                                        children: "Quick Generate",
                                                      },
                                                    ),
                                              }),
                                            ],
                                          },
                                          stud.id,
                                        );
                                      }),
                                    }),
                                  ],
                                }),
                              });
                            })(),
                          ],
                        }),
                      ],
                    }),
                  activeTab === "reports" &&
                    isAdminOrTeacher &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-6",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "bg-white border border-border rounded-2xl p-5 shadow-xs",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                  className:
                                    "font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, {
                                      className: "size-4 text-brand",
                                    }),
                                    " Class Average Exam Performance Trend",
                                  ],
                                }),
                                classAveragesData.length === 0
                                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-xs text-muted-foreground py-10 text-center",
                                      children: "No exam trends available",
                                    })
                                  : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                      width: "100%",
                                      height: 240,
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AreaChart, {
                                        data: classAveragesData,
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("defs", {
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "linearGradient",
                                              {
                                                id: "colorAve",
                                                x1: "0",
                                                y1: "0",
                                                x2: "0",
                                                y2: "1",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", {
                                                    offset: "5%",
                                                    stopColor: "hsl(var(--brand))",
                                                    stopOpacity: 0.2,
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("stop", {
                                                    offset: "95%",
                                                    stopColor: "hsl(var(--brand))",
                                                    stopOpacity: 0,
                                                  }),
                                                ],
                                              },
                                            ),
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                                            strokeDasharray: "3 3",
                                            stroke: "#f1f5f9",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                            dataKey: "name",
                                            tick: { fontSize: 10 },
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                            domain: [0, 100],
                                            tick: { fontSize: 10 },
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(Area, {
                                            type: "monotone",
                                            dataKey: "Class Average %",
                                            stroke: "hsl(var(--brand))",
                                            strokeWidth: 2,
                                            fillOpacity: 1,
                                            fill: "url(#colorAve)",
                                          }),
                                        ],
                                      }),
                                    }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "bg-white border border-border rounded-2xl p-5 shadow-xs",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                  className:
                                    "font-bold text-sm text-slate-800 mb-4 flex items-center gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, {
                                      className: "size-4 text-brand",
                                    }),
                                    " Rank Grade & Score Distribution",
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                                  width: "100%",
                                  height: 240,
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, {
                                    data: rankingDistributionData,
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                                        strokeDasharray: "3 3",
                                        stroke: "#f1f5f9",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                                        dataKey: "range",
                                        tick: { fontSize: 10 },
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                                        tick: { fontSize: 10 },
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                                        dataKey: "count",
                                        name: "Number of Students",
                                        fill: "#3b82f6",
                                        radius: [4, 4, 0, 0],
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "bg-white border border-border rounded-2xl p-6 shadow-xs",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex items-center justify-between flex-wrap gap-4 mb-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                      className: "font-bold text-lg text-slate-800",
                                      children: "School Performance & Ranking Report",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                      className: "text-xs text-muted-foreground",
                                      children:
                                        "Class-wide GPA indicators and performance metrics.",
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "flex gap-2",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () =>
                                      exportToCSV(
                                        filteredRankings.map((r) => ({
                                          Rank: r.rank_position,
                                          Student: r.student?.full_name,
                                          RollNumber: r.student?.roll_number,
                                          GPA: r.gpa,
                                          Percentage: r.percentage + "%",
                                          TotalMarks: r.total_marks,
                                        })),
                                        `performance_report_${academicYear}`,
                                      ),
                                    className:
                                      "px-3 py-1.5 border border-border hover:bg-slate-50 transition-colors bg-card text-xs font-semibold rounded-lg flex items-center gap-1",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, {
                                        className: "size-3.5 text-muted-foreground",
                                      }),
                                      " Export Excel",
                                    ],
                                  }),
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "overflow-x-auto",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                                className: "w-full text-xs text-left border-collapse",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                      className:
                                        "border-b border-slate-100 text-muted-foreground uppercase font-bold tracking-wider",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2",
                                          children: "Rank",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2",
                                          children: "Student Name",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2",
                                          children: "Roll No",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2 text-right",
                                          children: "Cumulative Marks",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2 text-right",
                                          children: "Percentage %",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2 text-right",
                                          children: "GPA Indicator",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                          className: "py-3 px-2 text-center",
                                          children: "Status",
                                        }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                                    children: filteredRankings.map((r) =>
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        "tr",
                                        {
                                          className:
                                            "border-b border-slate-50 hover:bg-slate-50/50 transition-colors",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                              className: "py-3 px-2 font-bold text-slate-600",
                                              children: ["#", r.rank_position],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                              className: "py-3 px-2 font-semibold text-slate-700",
                                              children: r.student?.full_name,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                              className: "py-3 px-2 text-muted-foreground",
                                              children: r.student?.roll_number,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                              className: "py-3 px-2 text-right font-medium",
                                              children: r.total_marks,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                              className: "py-3 px-2 text-right font-medium",
                                              children: [r.percentage, "%"],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                              className:
                                                "py-3 px-2 text-right font-bold text-brand",
                                              children: r.gpa,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                              className: "py-3 px-2 text-center",
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "span",
                                                {
                                                  className: `inline-block px-2 py-0.5 rounded-full text-[9px] font-bold ${r.percentage >= 75 ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`,
                                                  children:
                                                    r.percentage >= 75 ? "Excellent" : "Promising",
                                                },
                                              ),
                                            }),
                                          ],
                                        },
                                        r.id,
                                      ),
                                    ),
                                  }),
                                ],
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  activeTab === "admin" &&
                    isAdminOrTeacher &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start text-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-bold text-lg text-slate-800 dark:text-slate-100",
                                  children: "Ranking Engine Rules Config",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Adjust calculation criteria and attendance factors for rank reports.",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Ranking Calculation Metric",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                      value: rankingCriteria,
                                      onChange: (e) => setRankingCriteria(e.target.value),
                                      className:
                                        "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "percentage",
                                          children: "Student Cumulative Percentage",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "total_marks",
                                          children: "Total Marks Obtained",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "gpa",
                                          children: "GPA / CGPA equivalent",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex justify-between items-center",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-xs font-bold text-muted-foreground uppercase",
                                          children: "Attendance weightage modifier",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                          className: "text-xs font-bold text-brand",
                                          children: [
                                            Math.round(attendanceWeightage * 100),
                                            "% weight",
                                          ],
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                      type: "range",
                                      min: "0",
                                      max: "0.5",
                                      step: "0.05",
                                      value: attendanceWeightage,
                                      onChange: (e) =>
                                        setAttendanceWeightage(Number(e.target.value)),
                                      className:
                                        "mt-2 w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-brand",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: "text-[10px] text-muted-foreground mt-1",
                                      children:
                                        "Adds a percentage bonus based on the student's attendance records. Adjust to 0% to calculate strictly on exam marks.",
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase",
                                      children: "Minimum Attendance Threshold",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                      type: "number",
                                      min: "50",
                                      max: "100",
                                      value: attendanceThreshold,
                                      onChange: (e) =>
                                        setAttendanceThreshold(Number(e.target.value)),
                                      className:
                                        "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none text-foreground dark:text-slate-200",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: "text-[10px] text-muted-foreground mt-1",
                                      children:
                                        "Minimum attendance percentage required to be eligible for academic awards.",
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className:
                                    "flex flex-col border-t border-slate-100 dark:border-slate-800 pt-4",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                      className:
                                        "text-xs font-bold text-muted-foreground uppercase",
                                      children: "Enabled Award Categories",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                      className: "text-[10px] text-muted-foreground mt-0.5",
                                      children: "Toggle active awards generated by calculations.",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                      className: "grid grid-cols-2 gap-3 mt-3",
                                      children: [
                                        { key: "rank_1", label: "1st Rank Badge" },
                                        { key: "rank_2", label: "2nd Rank Badge" },
                                        { key: "rank_3", label: "3rd Rank Badge" },
                                        { key: "top_10", label: "Top 10 Students Badge" },
                                        { key: "subject_topper", label: "Subject Toppers" },
                                        { key: "class_topper", label: "Class Topper" },
                                        { key: "section_topper", label: "Section Topper" },
                                        { key: "school_topper", label: "School Topper" },
                                        { key: "attendance_topper", label: "Attendance Topper" },
                                        { key: "most_improved", label: "Most Improved Award" },
                                        { key: "discipline_award", label: "Best Discipline Award" },
                                        { key: "olympiad", label: "Olympiad Winner" },
                                        { key: "sports", label: "Sports Winner" },
                                        { key: "cultural", label: "Cultural Winner" },
                                        { key: "scholarship", label: "Scholarship Recipient" },
                                      ].map((cat) =>
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                          "label",
                                          {
                                            className:
                                              "flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                                type: "checkbox",
                                                checked: enabledCategories.includes(cat.key),
                                                onChange: (e) => {
                                                  if (e.target.checked) {
                                                    setEnabledCategories((prev) => [
                                                      ...prev,
                                                      cat.key,
                                                    ]);
                                                  } else {
                                                    setEnabledCategories((prev) =>
                                                      prev.filter((k) => k !== cat.key),
                                                    );
                                                  }
                                                },
                                                className:
                                                  "rounded border-border dark:border-slate-700 text-brand focus:ring-brand cursor-pointer",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                children: cat.label,
                                              }),
                                            ],
                                          },
                                          cat.key,
                                        ),
                                      ),
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "border-t border-slate-100 dark:border-slate-800 pt-6",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                onClick: async () => {
                                  setIsLoading(true);
                                  try {
                                    const check = await supabase
                                      .from("ranking_rules")
                                      .select("id")
                                      .eq("school_id", schoolId)
                                      .maybeSingle();
                                    if (check.data) {
                                      await supabase
                                        .from("ranking_rules")
                                        .update({
                                          criteria: rankingCriteria,
                                          attendance_weightage: attendanceWeightage,
                                          attendance_threshold: attendanceThreshold,
                                          enabled_categories: enabledCategories,
                                        })
                                        .eq("school_id", schoolId);
                                    } else {
                                      await supabase.from("ranking_rules").insert({
                                        school_id: schoolId,
                                        criteria: rankingCriteria,
                                        attendance_weightage: attendanceWeightage,
                                        attendance_threshold: attendanceThreshold,
                                        enabled_categories: enabledCategories,
                                      });
                                    }
                                    toast.success("Rules saved successfully");
                                    void loadData();
                                  } catch (err) {
                                    toast.error("Error saving rules: " + err.message);
                                  } finally {
                                    setIsLoading(false);
                                  }
                                },
                                className:
                                  "px-5 py-2 bg-brand text-white hover:bg-brand/90 transition-colors font-semibold text-xs rounded-lg shadow-sm",
                                children: "Save Configuration",
                              }),
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                                  className: "font-bold text-lg text-slate-800 dark:text-slate-100",
                                  children: "Subject & Class Teacher Allocation System",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Assign Class Teachers and allocate Subject Teachers to specific subjects and sections.",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3 border border-border dark:border-slate-800",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-indigo-600 uppercase block tracking-wider",
                                  children: "1. Assign Class Teacher",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-2 gap-3",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Class / Section",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                          value: allocClassId,
                                          onChange: (e) => setAllocClassId(e.target.value),
                                          className:
                                            "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none",
                                          children: classes.map((c) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "option",
                                              { value: c.id, children: c.name },
                                              c.id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Select Teacher",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                          value: allocTeacherId,
                                          onChange: (e) => setAllocTeacherId(e.target.value),
                                          className:
                                            "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none",
                                          children: (allProfiles || []).map((p) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "option",
                                              {
                                                value: p.user_id,
                                                children: [
                                                  p.full_name,
                                                  " (",
                                                  p.email?.split("@")[0],
                                                  ")",
                                                ],
                                              },
                                              p.user_id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                  onClick: handleAssignClassTeacher,
                                  className:
                                    "px-4 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-indigo-700 cursor-pointer",
                                  children: "Assign Class Teacher",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "bg-slate-50 dark:bg-slate-800/20 p-4 rounded-xl space-y-3 border border-border dark:border-slate-800",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-[10px] font-bold text-emerald-600 uppercase block tracking-wider",
                                  children: "2. Allocate Subject Teacher",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "grid grid-cols-3 gap-3",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Class / Section",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                          value: allocClassId,
                                          onChange: (e) => setAllocClassId(e.target.value),
                                          className:
                                            "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none",
                                          children: classes.map((c) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "option",
                                              { value: c.id, children: c.name },
                                              c.id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Subject",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                          value: allocSubjectId,
                                          onChange: (e) => setAllocSubjectId(e.target.value),
                                          className:
                                            "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none",
                                          children: subjects.map((s) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "option",
                                              { value: s.id, children: s.name },
                                              s.id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                      className: "flex flex-col",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                          className:
                                            "text-[10px] font-bold text-muted-foreground uppercase",
                                          children: "Teacher",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                                          value: allocTeacherId,
                                          onChange: (e) => setAllocTeacherId(e.target.value),
                                          className:
                                            "mt-1 bg-card border border-border dark:border-slate-700 rounded-lg px-2 py-1.5 text-xs font-semibold focus:outline-none",
                                          children: (allProfiles || []).map((p) =>
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "option",
                                              {
                                                value: p.user_id,
                                                children: [
                                                  p.full_name,
                                                  " (",
                                                  p.email?.split("@")[0],
                                                  ")",
                                                ],
                                              },
                                              p.user_id,
                                            ),
                                          ),
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                  onClick: handleAllocateSubjectTeacher,
                                  className:
                                    "px-4 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-emerald-700 cursor-pointer",
                                  children: "Allocate Subject Teacher",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "text-xs font-bold text-muted-foreground uppercase tracking-wider block",
                                  children: "Current Allocations Roster",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className:
                                    "max-h-60 overflow-y-auto border border-slate-100 dark:border-slate-805 rounded-xl text-xs",
                                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                                    className: "w-full text-left border-collapse",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                          className:
                                            "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground font-bold uppercase border-b border-slate-100 dark:border-slate-800",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                              className: "py-2 px-3",
                                              children: "Class",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                              className: "py-2 px-3",
                                              children: "Subject / Role",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                              className: "py-2 px-3",
                                              children: "Teacher",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                              className: "py-2 px-3 text-right",
                                              children: "Action",
                                            }),
                                          ],
                                        }),
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                                        children: [
                                          classes.map((c) => {
                                            const classTeacherObj = allProfiles.find(
                                              (p) => p.user_id === c.class_teacher_id,
                                            );
                                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "tr",
                                              {
                                                className:
                                                  "border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/10",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3 font-semibold",
                                                    children: c.name,
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3",
                                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "span",
                                                      {
                                                        className:
                                                          "px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 font-bold text-[9px]",
                                                        children: "Class Teacher",
                                                      },
                                                    ),
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className:
                                                      "py-2 px-3 font-medium text-slate-700 dark:text-slate-300",
                                                    children: classTeacherObj
                                                      ? classTeacherObj.full_name
                                                      : "Unassigned",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3 text-right",
                                                    children:
                                                      c.class_teacher_id &&
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "button",
                                                        {
                                                          onClick: async () => {
                                                            if (
                                                              confirm(
                                                                `Remove class teacher from ${c.name}?`,
                                                              )
                                                            ) {
                                                              const { error } = await supabase
                                                                .from("classes")
                                                                .update({ class_teacher_id: null })
                                                                .eq("id", c.id);
                                                              if (error) toast.error(error.message);
                                                              else {
                                                                toast.success(
                                                                  "Class teacher removed",
                                                                );
                                                                void loadData();
                                                              }
                                                            }
                                                          },
                                                          className:
                                                            "text-rose-600 hover:text-rose-800 font-semibold cursor-pointer",
                                                          children: "Unassign",
                                                        },
                                                      ),
                                                  }),
                                                ],
                                              },
                                              `ct-${c.id}`,
                                            );
                                          }),
                                          subjectAllocations.map((sa) => {
                                            const classObj = classes.find(
                                              (c) => c.id === sa.class_id,
                                            );
                                            const subjObj = subjects.find(
                                              (s) => s.id === sa.subject_id,
                                            );
                                            const teacherObj = allProfiles.find(
                                              (p) => p.user_id === sa.teacher_id,
                                            );
                                            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                              "tr",
                                              {
                                                className:
                                                  "border-b border-slate-50 dark:border-slate-800/40 hover:bg-slate-50/10",
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3 font-semibold",
                                                    children: classObj
                                                      ? classObj.name
                                                      : "Unknown Class",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3",
                                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "span",
                                                      {
                                                        className:
                                                          "px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-955/20 text-emerald-700 dark:text-emerald-300 font-bold text-[9px]",
                                                        children: subjObj
                                                          ? subjObj.name
                                                          : "Unknown Subject",
                                                      },
                                                    ),
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className:
                                                      "py-2 px-3 font-medium text-slate-700 dark:text-slate-300",
                                                    children: teacherObj
                                                      ? teacherObj.full_name
                                                      : "Unknown",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                    className: "py-2 px-3 text-right",
                                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                      "button",
                                                      {
                                                        onClick: () =>
                                                          handleRemoveAllocation(sa.id),
                                                        className:
                                                          "text-rose-600 hover:text-rose-800 font-semibold cursor-pointer",
                                                        children: "Remove",
                                                      },
                                                    ),
                                                  }),
                                                ],
                                              },
                                              `sa-${sa.id}`,
                                            );
                                          }),
                                          subjectAllocations.length === 0 &&
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "td",
                                                {
                                                  colSpan: 4,
                                                  className:
                                                    "py-4 text-center text-muted-foreground italic",
                                                  children:
                                                    "No subject allocations configured yet.",
                                                },
                                              ),
                                            }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  activeTab === "notifications" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "bg-white border border-border rounded-2xl p-6 shadow-xs space-y-6",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                              className: "font-bold text-lg text-slate-800",
                              children: isParent
                                ? "Achievement Alerts & Feed"
                                : "Parent Notification Logs",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-xs text-muted-foreground",
                              children: isParent
                                ? "Real-time updates of awards and generated certificates."
                                : "Logs of sent messages regarding rank publication.",
                            }),
                          ],
                        }),
                        (isParent ? parentNotificationsList : notifications).length === 0
                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "text-center py-12 text-muted-foreground",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, {
                                  className: "size-8 mx-auto mb-2 opacity-50",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "font-semibold",
                                  children: "No notification logs yet",
                                }),
                              ],
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "space-y-4",
                              children: (isParent ? parentNotificationsList : notifications).map(
                                (n) =>
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "div",
                                    {
                                      className:
                                        "p-4 rounded-xl border border-slate-50 bg-slate-50/50 flex items-start justify-between gap-4",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                          className: "space-y-1",
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                              className: "flex items-center gap-2",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className: "size-2 rounded-full bg-brand",
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                                  className: "font-bold text-sm text-slate-800",
                                                  children: n.title,
                                                }),
                                              ],
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                              className: "text-xs text-slate-600",
                                              children: n.body,
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                              className:
                                                "text-[10px] text-muted-foreground block pt-1",
                                              children: [
                                                "Sent at: ",
                                                new Date(n.sent_at).toLocaleString(),
                                              ],
                                            }),
                                          ],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          className:
                                            "text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2 py-0.5 rounded",
                                          children: n.status,
                                        }),
                                      ],
                                    },
                                    n.id,
                                  ),
                              ),
                            }),
                      ],
                    }),
                ],
              }),
        ],
      }),
      activeReportCard &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/45 dark:bg-black/60 flex items-center justify-center p-4 z-[999] overflow-y-auto",
          onClick: () => setActiveReportCard(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            onClick: (e) => e.stopPropagation(),
            className:
              "bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-4xl space-y-4 shadow-2xl border border-border dark:border-slate-800 my-8 text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                        className: "font-bold text-lg text-slate-800 dark:text-slate-100",
                        children: "Edit Report Card Details",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                        className: "text-xs text-muted-foreground dark:text-slate-400",
                        children: [
                          "Edit attendance record, student remarks, and subject observations for ",
                          students.find((s) => s.id === activeReportCard.student_id)?.full_name,
                          ".",
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setActiveReportCard(null),
                    className:
                      "size-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold",
                    children: "✕",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-1 md:grid-cols-12 gap-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "md:col-span-7 space-y-4",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "grid grid-cols-3 gap-4",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className:
                                  "text-xs font-bold text-muted-foreground dark:text-slate-400",
                                children: "Total Working Days",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "number",
                                value: rcWorkingDays,
                                onChange: (e) => {
                                  const wd = Math.max(1, Number(e.target.value));
                                  setRcWorkingDays(wd);
                                },
                                className:
                                  "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className:
                                  "text-xs font-bold text-muted-foreground dark:text-slate-400",
                                children: "Days Present",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                type: "number",
                                value: rcPresentDays[activeReportCard.student_id] || 0,
                                onChange: (e) => {
                                  const pd = Math.min(
                                    rcWorkingDays,
                                    Math.max(0, Number(e.target.value)),
                                  );
                                  setRcPresentDays((prev) => ({
                                    ...prev,
                                    [activeReportCard.student_id]: pd,
                                  }));
                                },
                                className:
                                  "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className:
                                  "text-xs font-bold text-muted-foreground dark:text-slate-400",
                                children: "Attendance %",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "mt-2.5 text-xs font-bold text-emerald-600",
                                children: [
                                  (
                                    ((rcPresentDays[activeReportCard.student_id] || 0) /
                                      rcWorkingDays) *
                                    100
                                  ).toFixed(1),
                                  "%",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className:
                              "text-xs font-bold text-muted-foreground dark:text-slate-400 uppercase tracking-wider block",
                            children: "Subject Teacher Observations",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "max-h-40 overflow-y-auto space-y-2 pr-1",
                            children:
                              Array.isArray(activeReportCard.subject_marks) &&
                              activeReportCard.subject_marks.map((sm) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "div",
                                  {
                                    className: "grid grid-cols-3 gap-2 items-center text-xs",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "font-semibold text-slate-700 dark:text-slate-300 truncate",
                                        children: sm.subject_name,
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                        className: "text-muted-foreground text-center",
                                        children: [
                                          "Score: ",
                                          sm.obtained_marks,
                                          " / ",
                                          sm.max_marks,
                                          " (",
                                          sm.grade,
                                          ")",
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                        type: "text",
                                        value: rcSubjectRemarks[sm.subject_id] || "",
                                        placeholder: "Observation remark",
                                        onChange: (e) => {
                                          setRcSubjectRemarks((prev) => ({
                                            ...prev,
                                            [sm.subject_id]: e.target.value,
                                          }));
                                        },
                                        className:
                                          "bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded px-2 py-1 text-xs focus:outline-none",
                                      }),
                                    ],
                                  },
                                  sm.subject_id,
                                ),
                              ),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex flex-col space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className:
                                  "text-xs font-bold text-muted-foreground dark:text-slate-400",
                                children: "Class Teacher Remarks",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                                value: rcClassTeacherRemarks,
                                onChange: (e) => setRcClassTeacherRemarks(e.target.value),
                                rows: 2,
                                className:
                                  "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-850 dark:text-slate-150 focus:outline-none",
                                placeholder: "Class teacher remarks...",
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                                className:
                                  "text-xs font-bold text-muted-foreground dark:text-slate-400",
                                children: "Principal Remarks",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                                value: rcPrincipalRemarks,
                                onChange: (e) => setRcPrincipalRemarks(e.target.value),
                                rows: 2,
                                className:
                                  "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-850 dark:text-slate-150 focus:outline-none",
                                placeholder: "Principal evaluation summary...",
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                            type: "button",
                            onClick: () => setActiveReportCard(null),
                            className:
                              "px-4 py-2 text-xs font-semibold border border-border rounded-lg",
                            children: "Cancel",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                            type: "button",
                            disabled: rcSaving,
                            onClick: async () => {
                              setRcSaving(true);
                              try {
                                const present = rcPresentDays[activeReportCard.student_id] || 0;
                                const working = rcWorkingDays || 220;
                                const absent = working - present;
                                const attPct = working > 0 ? (present / working) * 100 : 0;
                                let updatedSubjectMarks = [];
                                if (Array.isArray(activeReportCard.subject_marks)) {
                                  updatedSubjectMarks = activeReportCard.subject_marks.map(
                                    (sm) => ({
                                      ...sm,
                                      remarks: rcSubjectRemarks[sm.subject_id] || sm.remarks || "",
                                    }),
                                  );
                                }
                                const payload = {
                                  working_days: working,
                                  present_days: present,
                                  absent_days: absent,
                                  attendance_percentage: Number(attPct.toFixed(2)),
                                  class_teacher_remarks: rcClassTeacherRemarks,
                                  principal_remarks: rcPrincipalRemarks,
                                  subject_marks: updatedSubjectMarks,
                                };
                                const { error } = await supabase
                                  .from("report_cards")
                                  .update(payload)
                                  .eq("id", activeReportCard.id)
                                  .eq("school_id", schoolId);
                                if (error) {
                                  toast.error("Failed to save edits: " + error.message);
                                } else {
                                  toast.success("Report Card updated successfully!");
                                  setActiveReportCard(null);
                                  void loadData();
                                }
                              } catch (err) {
                                toast.error("Error saving edits: " + err.message);
                              } finally {
                                setRcSaving(false);
                              }
                            },
                            className:
                              "px-4 py-2 text-xs font-semibold bg-brand text-white hover:bg-brand/90 transition-colors rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-50",
                            children: rcSaving ? "Saving..." : "Save Edits",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "md:col-span-5 space-y-6 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 pt-4 md:pt-0 md:pl-6",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", {
                            className:
                              "font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, {
                                className: "size-4 text-slate-500",
                              }),
                              " Linked Documents",
                            ],
                          }),
                          isAdminOrTeacher &&
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-border dark:border-slate-800 space-y-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-[10px] font-bold text-slate-500 uppercase block",
                                  children: "Upload Document",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex flex-col gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                      value: uploadDocType,
                                      onChange: (e) => setUploadDocType(e.target.value),
                                      className:
                                        "bg-card dark:bg-slate-850 border border-border dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Birth Certificate",
                                          children: "Birth Certificate",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Aadhaar Card",
                                          children: "Aadhaar Card",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Transfer Certificate",
                                          children: "Transfer Certificate",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Marks Memo",
                                          children: "Marks Memo",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Medical Records",
                                          children: "Medical Records",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Bonafide Certificate",
                                          children: "Bonafide Certificate",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                          value: "Other",
                                          children: "Other",
                                        }),
                                      ],
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                      className:
                                        "flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold rounded-lg border border-brand/20 cursor-pointer transition-colors",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                                          className: "size-3.5",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                          children: "Upload File",
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                          type: "file",
                                          onChange: (e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              void handleUploadDocument(
                                                activeReportCard.student_id,
                                                uploadDocType,
                                                file,
                                              );
                                            }
                                          },
                                          className: "hidden",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "space-y-2 max-h-40 overflow-y-auto pr-1",
                            children:
                              studentDocuments.length === 0
                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className:
                                      "text-[11px] text-muted-foreground italic text-center py-2",
                                    children: "No documents linked.",
                                  })
                                : studentDocuments.map((doc) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 text-xs",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "min-w-0 pr-2",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className:
                                                  "font-bold text-slate-800 dark:text-slate-200 block truncate text-[11px]",
                                                children: doc.document_type,
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className:
                                                  "text-[9px] text-muted-foreground block truncate",
                                                children: doc.file_name,
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "flex gap-1 shrink-0",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                                                href: doc.file_url,
                                                target: "_blank",
                                                rel: "noreferrer",
                                                className:
                                                  "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 rounded transition-all",
                                                title: "Download",
                                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  Download,
                                                  { className: "size-3.5" },
                                                ),
                                              }),
                                              isAdminOrTeacher &&
                                                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                                  onClick: () =>
                                                    void handleDeleteDocument(
                                                      doc.id,
                                                      activeReportCard.student_id,
                                                    ),
                                                  className:
                                                    "p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 dark:text-rose-450 rounded transition-all",
                                                  title: "Delete",
                                                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                    Trash2,
                                                    { className: "size-3.5" },
                                                  ),
                                                }),
                                            ],
                                          }),
                                        ],
                                      },
                                      doc.id,
                                    ),
                                  ),
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", {
                            className:
                              "font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                                className: "size-4 text-slate-500",
                              }),
                              " Audit Trail History",
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "space-y-2.5 max-h-48 overflow-y-auto pr-1",
                            children:
                              reportCardAuditHistory.length === 0
                                ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className:
                                      "text-[11px] text-muted-foreground italic text-center py-2",
                                    children: "No history logs.",
                                  })
                                : reportCardAuditHistory.map((log) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className: "flex gap-2 text-xs",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "flex flex-col items-center",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                className: `size-1.5 rounded-full mt-1.5 shrink-0 ${log.action === "Published" ? "bg-emerald-500" : log.action === "Approved" ? "bg-blue-500" : log.action === "Created" ? "bg-gray-400" : "bg-amber-500"}`,
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                className:
                                                  "w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 mt-1",
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "pb-2 min-w-0",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                className:
                                                  "font-bold text-slate-750 dark:text-slate-250 leading-none text-[11px]",
                                                children: log.action,
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                className:
                                                  "text-[9px] text-muted-foreground mt-0.5",
                                                children: ["By ", log.performed_by_name],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className:
                                                  "text-[8px] text-muted-foreground/80 block font-mono",
                                                children: new Date(
                                                  log.performed_at,
                                                ).toLocaleString(),
                                              }),
                                            ],
                                          }),
                                        ],
                                      },
                                      log.id,
                                    ),
                                  ),
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
      reportCardStudent &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/45 dark:bg-black/60 flex items-center justify-center p-4 z-[999] overflow-y-auto",
          onClick: () => setReportCardStudent(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            onClick: (e) => e.stopPropagation(),
            className:
              "bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-6xl space-y-4 shadow-2xl border border-border dark:border-slate-800 my-8 text-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 print:hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                        className: "font-bold text-lg text-slate-800 dark:text-slate-100",
                        children: "Academic Report Card",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-muted-foreground dark:text-slate-400",
                        children: "Official transcript and principal evaluation certificate.",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                        onClick: downloadReportCardPDF,
                        disabled: loadingReportCard || !reportCardData,
                        className:
                          "px-3 py-1.5 text-xs font-semibold bg-brand text-white rounded-lg inline-flex items-center gap-1 shadow-sm disabled:opacity-50 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                            className: "size-3.5",
                          }),
                          " PDF Download",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                        onClick: () => window.print(),
                        disabled: loadingReportCard || !reportCardData,
                        className:
                          "px-3 py-1.5 text-xs font-semibold border border-border rounded-lg inline-flex items-center gap-1 text-slate-700 dark:text-slate-300 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Printer, { className: "size-3.5" }),
                          " Print Version",
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                        onClick: () => setReportCardStudent(null),
                        className:
                          "size-7 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 font-semibold cursor-pointer",
                        children: "✕",
                      }),
                    ],
                  }),
                ],
              }),
              loadingReportCard
                ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "py-20 text-center space-y-2",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, {
                        className: "size-8 animate-spin text-brand mx-auto",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-muted-foreground",
                        children: "Compiling academic history and grades...",
                      }),
                    ],
                  })
                : reportCardData
                  ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "lg:col-span-8 overflow-x-auto",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "min-w-[650px] border border-border dark:border-slate-800 rounded-xl p-6 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden",
                            id: "report-card-print-area",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "absolute inset-2 border-2 border-double border-slate-200 dark:border-slate-800 rounded-lg pointer-events-none",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "p-4 space-y-6 relative z-10",
                                id: "report-card-canvas",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none z-0",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                                      className: "size-80",
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "flex items-center justify-between border-b-2 border-slate-800 pb-4 relative z-10",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className:
                                              "size-16 rounded-xl bg-slate-50 border border-border flex items-center justify-center overflow-hidden p-1 shrink-0",
                                            children: school?.logo_url
                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                  src: school.logo_url,
                                                  alt: "Logo",
                                                  className: "size-full object-contain",
                                                  crossOrigin: "anonymous",
                                                })
                                              : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  GraduationCap,
                                                  { className: "size-10 text-brand" },
                                                ),
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "text-left space-y-0.5",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                                                className:
                                                  "text-xl font-serif font-black tracking-wide text-slate-800 dark:text-slate-100",
                                                children:
                                                  school?.name || schoolDisplayName || "School",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                className:
                                                  "text-[10px] text-muted-foreground leading-normal max-w-sm",
                                                children:
                                                  school?.address || "School Evaluation Center",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                className: "text-[8px] font-mono text-slate-500",
                                                children: [
                                                  "Tel: ",
                                                  school?.phone_number || "ERP Admin",
                                                  " | Email: ",
                                                  school?.email || "support@school.com",
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "text-right space-y-1",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded",
                                            children: "OFFICIAL TRANSCRIPT",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                            className:
                                              "text-xs font-bold text-slate-700 dark:text-slate-300",
                                            children: "Term Evaluation Report",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className: "text-[9px] font-mono text-muted-foreground",
                                            children: ["Session: ", academicYear],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "grid grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-lg border border-slate-100 dark:border-slate-800 text-xs relative z-10",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "space-y-1.5 col-span-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "opacity-60 block text-[9px]",
                                                children: "STUDENT NAME",
                                              }),
                                              " ",
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className:
                                                  "font-bold text-slate-800 dark:text-slate-200 text-sm",
                                                children: reportCardStudent.full_name,
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "opacity-60 block text-[9px]",
                                                    children: "ROLL NUMBER",
                                                  }),
                                                  " ",
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "font-semibold",
                                                    children: reportCardStudent.roll_number || "—",
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "opacity-60 block text-[9px]",
                                                    children: "CLASS & SECTION",
                                                  }),
                                                  " ",
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className: "font-semibold",
                                                    children: [
                                                      reportCardStudent.classes?.name || "Student",
                                                      " ",
                                                      reportCardStudent.classes?.section
                                                        ? `(${reportCardStudent.classes.section})`
                                                        : "",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "grid grid-cols-2 gap-2",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "opacity-60 block text-[9px]",
                                                    children: "ADMISSION NUMBER",
                                                  }),
                                                  " ",
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "font-mono",
                                                    children:
                                                      reportCardStudent.admission_number ||
                                                      reportCardStudent.id
                                                        .slice(0, 8)
                                                        .toUpperCase(),
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "opacity-60 block text-[9px]",
                                                    children: "PARENT DETAILS",
                                                  }),
                                                  " ",
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className: "font-semibold",
                                                    children: [
                                                      reportCardStudent.parent_name || "—",
                                                      " (",
                                                      reportCardStudent.parent_phone || "—",
                                                      ")",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "opacity-60 block text-[9px]",
                                                children: "PARENT EMAIL",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "font-semibold",
                                                children: reportCardStudent.parent_email || "—",
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className: "flex justify-end",
                                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                          className:
                                            "size-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden flex items-center justify-center shadow-inner shrink-0",
                                          children: reportCardStudent.photo_url
                                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                src: reportCardStudent.photo_url,
                                                alt: "",
                                                className: "size-full object-cover",
                                                crossOrigin: "anonymous",
                                              })
                                            : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                                className: "size-10 text-slate-400",
                                              }),
                                        }),
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs relative z-10",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                                      className: "w-full text-left border-collapse text-xs",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                            className:
                                              "bg-slate-800 text-white uppercase text-[10px] tracking-wider font-bold",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                                className: "py-2.5 px-4",
                                                children: "Subject",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                                className: "py-2.5 px-4 text-center",
                                                children: "Max Marks",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                                className: "py-2.5 px-4 text-center",
                                                children: "Marks Obtained",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                                className: "py-2.5 px-4 text-center",
                                                children: "Grade",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                                className: "py-2.5 px-4",
                                                children: "Teacher Remarks",
                                              }),
                                            ],
                                          }),
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                                          className:
                                            "divide-y divide-slate-100 dark:divide-slate-800",
                                          children: [
                                            reportCardData.subjectsMarks.map((sm, index) =>
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                                "tr",
                                                {
                                                  className:
                                                    "hover:bg-slate-50/20 dark:hover:bg-slate-800/10",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                      className:
                                                        "py-2 px-4 font-bold text-slate-700 dark:text-slate-300",
                                                      children: sm.subjectName,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                      className:
                                                        "py-2 px-4 text-center text-muted-foreground",
                                                      children: sm.max,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                      className:
                                                        "py-2 px-4 text-center font-semibold text-slate-750 dark:text-slate-255",
                                                      children: sm.obtained,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                      className: "py-2 px-4 text-center",
                                                      children:
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          "span",
                                                          {
                                                            className: `inline-block px-2 py-0.5 rounded font-bold text-[10px] ${sm.grade === "A+" || sm.grade === "A" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : sm.grade === "B" || sm.grade === "C" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`,
                                                            children: sm.grade,
                                                          },
                                                        ),
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                                      className:
                                                        "py-2 px-4 text-slate-650 dark:text-slate-400 italic text-[11px]",
                                                      children: sm.remarks || "—",
                                                    }),
                                                  ],
                                                },
                                                index,
                                              ),
                                            ),
                                            reportCardData.subjectsMarks.length === 0 &&
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                  "td",
                                                  {
                                                    colSpan: 5,
                                                    className:
                                                      "py-8 text-center text-muted-foreground",
                                                    children: "No marks input found for this term.",
                                                  },
                                                ),
                                              }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/10 space-y-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-left",
                                            children: "Academic Metrics",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "grid grid-cols-3 gap-2 text-center text-xs",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Total Marks",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className: "font-extrabold text-sm block",
                                                    children: [
                                                      reportCardData.totalObtained,
                                                      " / ",
                                                      reportCardData.totalMax,
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Percentage",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className:
                                                      "font-extrabold text-sm text-brand block",
                                                    children: [
                                                      reportCardData.overallPercentage,
                                                      "%",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Class Rank",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className:
                                                      "font-extrabold text-sm text-slate-700 dark:text-slate-300 block",
                                                    children: ["#", reportCardData.rank],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/30 dark:bg-slate-900/10 space-y-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[10px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block text-left",
                                            children: "Attendance Summary",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "grid grid-cols-4 gap-1 text-center text-xs",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Working Days",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className: "font-extrabold text-xs block",
                                                    children: reportCardData.workingDays || 220,
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Present Days",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "font-extrabold text-xs text-emerald-600 block",
                                                    children: reportCardData.presentDays ?? 200,
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Absent Days",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "font-extrabold text-xs text-rose-600 block",
                                                    children: reportCardData.absentDays ?? 20,
                                                  }),
                                                ],
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                children: [
                                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                    className:
                                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                                    children: "Attendance %",
                                                  }),
                                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                                    className:
                                                      "font-extrabold text-xs text-indigo-650 block",
                                                    children: [
                                                      reportCardData.attendancePercentage,
                                                      "%",
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs bg-slate-50/50 dark:bg-slate-900/20 relative z-10",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "space-y-1 text-left",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider block",
                                            children: "Class Teacher Remarks",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className: "italic text-slate-650 dark:text-slate-400",
                                            children: [
                                              '"',
                                              reportCardData.classTeacherRemarks ||
                                                reportCardData.latestRemark,
                                              '"',
                                            ],
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "space-y-1 text-left",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[10px] font-bold text-slate-850 dark:text-slate-200 uppercase tracking-wider block",
                                            children: "Principal Remarks",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className: "italic text-slate-650 dark:text-slate-400",
                                            children: [
                                              '"',
                                              reportCardData.principalRemarks ||
                                                "Exhibits commendable scholastic dedication.",
                                              '"',
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className: "flex justify-between items-end pt-8 relative z-10",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "text-center space-y-1 w-28 flex flex-col items-center",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className:
                                              "h-8 border-b border-slate-300 w-full flex items-end justify-center",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "span",
                                              {
                                                className:
                                                  "font-serif italic text-indigo-500 font-semibold text-[10px]",
                                                children: "Class Teacher",
                                              },
                                            ),
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[8px] uppercase font-bold tracking-wider opacity-70",
                                            children: "Class Teacher Signature",
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "text-center space-y-1 flex flex-col items-center",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className:
                                              "size-11 p-0.5 bg-white border border-slate-200 rounded flex items-center justify-center",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                              src: `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${reportCardStudent.full_name}-${academicYear}-${selectedReportCardExam}`,
                                              alt: "QR Code",
                                              className: "size-10",
                                              crossOrigin: "anonymous",
                                            }),
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[7px] font-mono text-muted-foreground block uppercase",
                                            children: "QR Verification",
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "text-center space-y-1 w-28 flex flex-col items-center",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className:
                                              "h-8 w-full flex items-end justify-center relative",
                                            children: school?.principal_signature_url
                                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                                  src: school.principal_signature_url,
                                                  alt: "Principal Sig",
                                                  className:
                                                    "max-h-full max-w-full object-contain filter grayscale select-none",
                                                  crossOrigin: "anonymous",
                                                })
                                              : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                  className:
                                                    "font-serif italic text-amber-600 font-bold text-xs tracking-wide",
                                                  children: "Nirosha Reddy",
                                                }),
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className: "h-[1px] bg-slate-300 w-full",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[8px] uppercase font-bold tracking-wider opacity-70 block",
                                            children: "School Principal",
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className:
                                              "text-[8px] font-semibold text-amber-700 block truncate max-w-[120px]",
                                            children: school?.principal_name || "Nirosha Reddy",
                                          }),
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
                          className:
                            "lg:col-span-4 space-y-6 print:hidden border-t lg:border-t-0 lg:border-l border-slate-150 dark:border-slate-800 pt-4 lg:pt-0 lg:pl-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "space-y-3",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", {
                                  className:
                                    "font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, {
                                      className: "size-4 text-slate-500",
                                    }),
                                    " Linked Documents",
                                  ],
                                }),
                                isAdminOrTeacher &&
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    className:
                                      "bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-lg border border-border dark:border-slate-800 space-y-2",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className:
                                          "text-[10px] font-bold text-slate-500 uppercase block",
                                        children: "Upload Document",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "flex flex-col gap-1.5",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", {
                                            value: uploadDocType,
                                            onChange: (e) => setUploadDocType(e.target.value),
                                            className:
                                              "bg-card dark:bg-slate-850 border border-border dark:border-slate-700 rounded-md px-2 py-1 text-xs font-semibold focus:outline-none",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Birth Certificate",
                                                children: "Birth Certificate",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Aadhaar Card",
                                                children: "Aadhaar Card",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Transfer Certificate",
                                                children: "Transfer Certificate",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Marks Memo",
                                                children: "Marks Memo",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Medical Records",
                                                children: "Medical Records",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Bonafide Certificate",
                                                children: "Bonafide Certificate",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("option", {
                                                value: "Other",
                                                children: "Other",
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                                            className:
                                              "flex items-center justify-center gap-1.5 px-3 py-1.5 bg-brand/10 hover:bg-brand/20 text-brand text-xs font-bold rounded-lg border border-brand/20 cursor-pointer transition-colors",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, {
                                                className: "size-3.5",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                children: "Upload File",
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                                                type: "file",
                                                onChange: (e) => {
                                                  const file = e.target.files?.[0];
                                                  if (file) {
                                                    void handleUploadDocument(
                                                      reportCardStudent.id,
                                                      uploadDocType,
                                                      file,
                                                    );
                                                  }
                                                },
                                                className: "hidden",
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "space-y-2 max-h-40 overflow-y-auto pr-1",
                                  children:
                                    studentDocuments.length === 0
                                      ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className:
                                            "text-[11px] text-muted-foreground italic text-center py-2",
                                          children: "No documents linked.",
                                        })
                                      : studentDocuments.map((doc) =>
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className:
                                                "flex items-center justify-between p-2 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 text-xs",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                  className: "min-w-0 pr-2",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className:
                                                        "font-bold text-slate-800 dark:text-slate-200 block truncate text-[11px]",
                                                      children: doc.document_type,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className:
                                                        "text-[9px] text-muted-foreground block truncate",
                                                      children: doc.file_name,
                                                    }),
                                                  ],
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                  className: "flex gap-1 shrink-0",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("a", {
                                                      href: doc.file_url,
                                                      target: "_blank",
                                                      rel: "noreferrer",
                                                      className:
                                                        "p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 rounded transition-all",
                                                      title: "Download",
                                                      children:
                                                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                          Download,
                                                          { className: "size-3.5" },
                                                        ),
                                                    }),
                                                    isAdminOrTeacher &&
                                                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                        "button",
                                                        {
                                                          onClick: () =>
                                                            void handleDeleteDocument(
                                                              doc.id,
                                                              reportCardStudent.id,
                                                            ),
                                                          className:
                                                            "p-1 hover:bg-rose-50 dark:hover:bg-rose-955/30 text-rose-600 dark:text-rose-450 rounded transition-all",
                                                          title: "Delete",
                                                          children:
                                                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                              Trash2,
                                                              { className: "size-3.5" },
                                                            ),
                                                        },
                                                      ),
                                                  ],
                                                }),
                                              ],
                                            },
                                            doc.id,
                                          ),
                                        ),
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("h4", {
                                  className:
                                    "font-bold text-sm text-slate-800 dark:text-slate-200 pb-1.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
                                      className: "size-4 text-slate-500",
                                    }),
                                    " Audit Trail History",
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "space-y-2.5 max-h-48 overflow-y-auto pr-1",
                                  children:
                                    reportCardAuditHistory.length === 0
                                      ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                          className:
                                            "text-[11px] text-muted-foreground italic text-center py-2",
                                          children: "No history logs.",
                                        })
                                      : reportCardAuditHistory.map((log) =>
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                            "div",
                                            {
                                              className: "flex gap-2 text-xs",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                  className: "flex flex-col items-center",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                      className: `size-1.5 rounded-full mt-1.5 shrink-0 ${log.action === "Published" ? "bg-emerald-500" : log.action === "Approved" ? "bg-blue-500" : log.action === "Created" ? "bg-gray-400" : "bg-amber-500"}`,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                                      className:
                                                        "w-0.5 flex-1 bg-slate-100 dark:bg-slate-800 mt-1",
                                                    }),
                                                  ],
                                                }),
                                                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                                  className: "pb-2 min-w-0",
                                                  children: [
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                      className:
                                                        "font-bold text-slate-750 dark:text-slate-250 leading-none text-[11px]",
                                                      children: log.action,
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                      className:
                                                        "text-[9px] text-muted-foreground mt-0.5",
                                                      children: ["By ", log.performed_by_name],
                                                    }),
                                                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                      className:
                                                        "text-[8px] text-muted-foreground/80 block font-mono",
                                                      children: new Date(
                                                        log.performed_at,
                                                      ).toLocaleString(),
                                                    }),
                                                  ],
                                                }),
                                              ],
                                            },
                                            log.id,
                                          ),
                                        ),
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground text-center py-10",
                      children: "Failed to display report card template.",
                    }),
            ],
          }),
        }),
      hiddenRenderStudent &&
        hiddenRenderData &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          style: { position: "absolute", left: "-9999px", top: "-9999px", width: "800px" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "min-w-[650px] border border-border dark:border-slate-800 rounded-xl p-6 bg-white text-slate-900 relative overflow-hidden",
            id: "hidden-report-card-print-area",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "absolute inset-2 border-2 border-double border-slate-200 rounded-lg pointer-events-none",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "p-4 space-y-6 relative z-10",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 select-none z-0",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                      className: "size-80",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "flex items-center justify-between border-b-2 border-slate-800 pb-4 relative z-10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "size-16 rounded-xl bg-slate-50 border border-border flex items-center justify-center overflow-hidden p-1 shrink-0",
                            children: school?.logo_url
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                  src: school.logo_url,
                                  alt: "Logo",
                                  className: "size-full object-contain",
                                  crossOrigin: "anonymous",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                                  className: "size-10 text-brand",
                                }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "text-left space-y-0.5",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                                className:
                                  "text-xl font-serif font-black tracking-wide text-slate-800",
                                children: school?.name || schoolDisplayName || "School",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className:
                                  "text-[10px] text-muted-foreground leading-normal max-w-sm",
                                children: school?.address || "School Evaluation Center",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                className: "text-[8px] font-mono text-slate-505",
                                children: [
                                  "Tel: ",
                                  school?.phone_number || "ERP Admin",
                                  " | Email: ",
                                  school?.email || "support@school.com",
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-right space-y-1",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "bg-brand/10 text-brand text-[9px] uppercase font-bold px-2 py-0.5 rounded",
                            children: "OFFICIAL TRANSCRIPT",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                            className: "text-xs font-bold text-slate-700",
                            children: "Term Evaluation Report",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "text-[9px] font-mono text-muted-foreground",
                            children: ["Session: ", academicYear],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-105 text-xs relative z-10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-1.5 col-span-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 block text-[9px]",
                                children: "STUDENT NAME",
                              }),
                              " ",
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-bold text-slate-800 text-sm",
                                children: hiddenRenderStudent.full_name,
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "opacity-60 block text-[9px]",
                                    children: "ROLL NUMBER",
                                  }),
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-semibold",
                                    children: hiddenRenderStudent.roll_number || "—",
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "opacity-60 block text-[9px]",
                                    children: "CLASS & SECTION",
                                  }),
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-semibold",
                                    children: [
                                      hiddenRenderStudent.classes?.name || "Student",
                                      " ",
                                      hiddenRenderStudent.classes?.section
                                        ? `(${hiddenRenderStudent.classes.section})`
                                        : "",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-2 gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "opacity-60 block text-[9px]",
                                    children: "ADMISSION NUMBER",
                                  }),
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-mono",
                                    children:
                                      hiddenRenderStudent.admission_number ||
                                      hiddenRenderStudent.id.slice(0, 8).toUpperCase(),
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "opacity-60 block text-[9px]",
                                    children: "PARENT DETAILS",
                                  }),
                                  " ",
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-semibold",
                                    children: [
                                      hiddenRenderStudent.parent_name || "—",
                                      " (",
                                      hiddenRenderStudent.parent_phone || "—",
                                      ")",
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "opacity-60 block text-[9px]",
                                children: "PARENT EMAIL",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                className: "font-semibold",
                                children: hiddenRenderStudent.parent_email || "—",
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "flex justify-end",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "size-20 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shadow-inner shrink-0",
                          children: hiddenRenderStudent.photo_url
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                src: hiddenRenderStudent.photo_url,
                                alt: "",
                                className: "size-full object-cover",
                                crossOrigin: "anonymous",
                              })
                            : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                className: "size-10 text-slate-400",
                              }),
                        }),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "border border-slate-200 rounded-xl overflow-hidden shadow-xs relative z-10",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                      className: "w-full text-left border-collapse text-xs",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                            className:
                              "bg-slate-800 text-white uppercase text-[10px] tracking-wider font-bold",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4",
                                children: "Subject",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center",
                                children: "Max Marks",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center",
                                children: "Marks Obtained",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4 text-center",
                                children: "Grade",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                className: "py-2.5 px-4",
                                children: "Teacher Remarks",
                              }),
                            ],
                          }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                          className: "divide-y divide-slate-100",
                          children: [
                            hiddenRenderData.subjectsMarks.map((sm, index) =>
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "tr",
                                {
                                  className: "hover:bg-slate-50/20",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "py-2 px-4 font-bold text-slate-700",
                                      children: sm.subjectName,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "py-2 px-4 text-center text-muted-foreground",
                                      children: sm.max,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className:
                                        "py-2 px-4 text-center font-semibold text-slate-750",
                                      children: sm.obtained,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "py-2 px-4 text-center",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                        className: `inline-block px-2 py-0.5 rounded font-bold text-[10px] ${sm.grade === "A+" || sm.grade === "A" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : sm.grade === "B" || sm.grade === "C" ? "bg-indigo-50 text-indigo-800 border border-indigo-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`,
                                        children: sm.grade,
                                      }),
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "py-2 px-4 text-slate-650 italic text-[11px]",
                                      children: sm.remarks || "—",
                                    }),
                                  ],
                                },
                                index,
                              ),
                            ),
                            hiddenRenderData.subjectsMarks.length === 0 &&
                              /* @__PURE__ */ jsxRuntimeExports.jsx("tr", {
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                  colSpan: 5,
                                  className: "py-8 text-center text-muted-foreground",
                                  children: "No marks input found for this term.",
                                }),
                              }),
                          ],
                        }),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[10px] font-bold text-slate-800 uppercase tracking-wider block text-left",
                            children: "Academic Metrics",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-3 gap-2 text-center text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Total Marks",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-extrabold text-sm block",
                                    children: [
                                      hiddenRenderData.totalObtained,
                                      " / ",
                                      hiddenRenderData.totalMax,
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Percentage",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-extrabold text-sm text-brand block",
                                    children: [hiddenRenderData.overallPercentage, "%"],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Class Rank",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-extrabold text-sm text-slate-700 block",
                                    children: ["#", hiddenRenderData.rank],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "border border-slate-200 rounded-xl p-4 bg-slate-50/30 space-y-3",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[10px] font-bold text-slate-800 uppercase tracking-wider block text-left",
                            children: "Attendance Summary",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "grid grid-cols-4 gap-1 text-center text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Working Days",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-extrabold text-xs block",
                                    children: hiddenRenderData.workingDays || 220,
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Present Days",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-extrabold text-xs text-emerald-600 block",
                                    children: hiddenRenderData.presentDays ?? 200,
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Absent Days",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: "font-extrabold text-xs text-rose-600 block",
                                    children: hiddenRenderData.absentDays ?? 20,
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className:
                                      "text-[8px] uppercase tracking-wider block opacity-70",
                                    children: "Attendance %",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className: "font-extrabold text-xs text-indigo-650 block",
                                    children: [hiddenRenderData.attendancePercentage, "%"],
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "grid grid-cols-1 md:grid-cols-2 gap-4 border border-slate-200 rounded-xl p-4 text-xs bg-slate-50/50 relative z-10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-1 text-left",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[10px] font-bold text-slate-800 uppercase tracking-wider block",
                            children: "Class Teacher Remarks",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "italic text-slate-650",
                            children: [
                              '"',
                              hiddenRenderData.classTeacherRemarks || hiddenRenderData.latestRemark,
                              '"',
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "space-y-1 text-left",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[10px] font-bold text-slate-800 uppercase tracking-wider block",
                            children: "Principal Remarks",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                            className: "italic text-slate-650",
                            children: [
                              '"',
                              hiddenRenderData.principalRemarks ||
                                "Exhibits commendable scholastic dedication.",
                              '"',
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex justify-between items-end pt-8 relative z-10",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-center space-y-1 w-28 flex flex-col items-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "h-8 border-b border-slate-300 w-full flex items-end justify-center",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className:
                                "font-serif italic text-indigo-500 font-semibold text-[10px]",
                              children: "Class Teacher",
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-[8px] uppercase font-bold tracking-wider opacity-70",
                            children: "Class Teacher Signature",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-center space-y-1 flex flex-col items-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className:
                              "size-11 p-0.5 bg-white border border-slate-200 rounded flex items-center justify-center",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                              src: `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=VERIFY-${hiddenRenderStudent.full_name}-${academicYear}-${selectedReportCardExam}`,
                              alt: "QR Code",
                              className: "size-10",
                              crossOrigin: "anonymous",
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-[7px] font-mono text-muted-foreground block uppercase",
                            children: "QR Verification",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "text-center space-y-1 w-28 flex flex-col items-center",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "h-8 w-full flex items-end justify-center relative",
                            children: school?.principal_signature_url
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                  src: school.principal_signature_url,
                                  alt: "Principal Sig",
                                  className:
                                    "max-h-full max-w-full object-contain filter grayscale select-none",
                                  crossOrigin: "anonymous",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className:
                                    "font-serif italic text-amber-600 font-bold text-xs tracking-wide",
                                  children: "Nirosha Reddy",
                                }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                            className: "h-[1px] bg-slate-300 w-full",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[8px] uppercase font-bold tracking-wider opacity-70 block",
                            children: "School Principal",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className:
                              "text-[8px] font-semibold text-amber-700 block truncate max-w-[120px]",
                            children: school?.principal_name || "Nirosha Reddy",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function TabButton({ active, onClick, label, icon }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
    onClick,
    className: `px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${active ? "bg-brand text-white shadow-sm" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200"}`,
    children: [icon, /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })],
  });
}
function ThemeButton({ active, onClick, label, colorClass }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
    onClick,
    className: `p-2 rounded-xl border text-[10px] font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${active ? "border-brand ring-1 ring-brand bg-brand-soft/20 text-brand" : "border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50/20"}`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: `size-4 rounded-full ${colorClass}`,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
    ],
  });
}
function SizeButton({ active, onClick, label, dimensions }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
    type: "button",
    onClick,
    className: `p-2 border rounded-xl flex flex-col items-center justify-center gap-0.5 text-center transition cursor-pointer ${active ? "border-brand ring-1 ring-brand bg-brand-soft/20 text-brand font-bold" : "border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-800 bg-slate-50/20"}`,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: "text-[10px] font-bold uppercase tracking-wider",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
        className: "text-[8px] opacity-75 font-mono",
        children: dimensions,
      }),
    ],
  });
}
function fameCardTheme(cat) {
  if (cat === "rank_1") {
    return {
      cardBg: "bg-gradient-to-br from-yellow-50/80 via-white to-amber-50/60",
      border: "border-yellow-200 hover:border-yellow-300",
      badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
  } else if (cat === "rank_2") {
    return {
      cardBg: "bg-gradient-to-br from-slate-50/80 via-white to-slate-50/60",
      border: "border-slate-200 hover:border-slate-300",
      badgeClass: "bg-slate-100 text-slate-800 border-slate-200",
    };
  } else if (cat === "rank_3") {
    return {
      cardBg: "bg-gradient-to-br from-amber-50/40 via-white to-amber-50/30",
      border: "border-amber-200 hover:border-amber-300",
      badgeClass: "bg-amber-100 text-amber-800 border-amber-200",
    };
  } else if (cat === "attendance_topper") {
    return {
      cardBg: "bg-gradient-to-br from-emerald-50/40 via-white to-emerald-50/30",
      border: "border-emerald-200 hover:border-emerald-300",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  } else {
    return {
      cardBg: "bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/30",
      border: "border-indigo-200 hover:border-indigo-300",
      badgeClass: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };
  }
}
function badgeLabel(cat) {
  const map = {
    rank_1: "Gold Rank Topper",
    rank_2: "Silver Rank #2",
    rank_3: "Bronze Rank #3",
    top_10: "Top 10 Scholar",
    subject_topper: "Subject Topper",
    attendance_topper: "Attendance Champion",
    discipline_award: "Best Discipline Award",
  };
  return map[cat] || cat.toUpperCase().replace("_", " ");
}
function profileName(userObj) {
  if (userObj?.user_metadata?.full_name) return userObj.user_metadata.full_name;
  return userObj?.email?.split("@")[0] || "Parent";
}
const $$splitComponentImporter$2 = () => import("./students._studentId-Rf3b-w1B.mjs");
const Route$2 = createFileRoute("/_authenticated/students/$studentId")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component"),
});
const $$splitComponentImporter$1 = () => import("./whatsapp-B-yVHxVR.mjs");
const Route$1 = createFileRoute("/_authenticated/admin/whatsapp")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component"),
});
const $$splitComponentImporter = () => import("./billing-CSeSLIsb.mjs");
const Route = createFileRoute("/_authenticated/admin/billing")({
  component: lazyRouteComponent($$splitComponentImporter, "component"),
});
const VerifyIdRoute = Route$x.update({
  id: "/verify-id",
  path: "/verify-id",
  getParentRoute: () => Route$y,
});
const SignupRoute = Route$w.update({
  id: "/signup",
  path: "/signup",
  getParentRoute: () => Route$y,
});
const ResetPasswordRoute = Route$v.update({
  id: "/reset-password",
  path: "/reset-password",
  getParentRoute: () => Route$y,
});
const OnboardingRoute = Route$u.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$y,
});
const LoginRoute = Route$t.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$y,
});
const ForgotPasswordRoute = Route$s.update({
  id: "/forgot-password",
  path: "/forgot-password",
  getParentRoute: () => Route$y,
});
const AuthenticatedRoute = Route$r.update({
  id: "/_authenticated",
  getParentRoute: () => Route$y,
});
const IndexRoute = Route$q.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$y,
});
const AuthenticatedTeacherAllocationsRoute = Route$p.update({
  id: "/teacher-allocations",
  path: "/teacher-allocations",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedSuperAdminRoute = Route$o.update({
  id: "/super-admin",
  path: "/super-admin",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedStudentsRoute = Route$n.update({
  id: "/students",
  path: "/students",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedReportCardsRoute = Route$m.update({
  id: "/report-cards",
  path: "/report-cards",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedRemarksRoute = Route$l.update({
  id: "/remarks",
  path: "/remarks",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedRecycleBinRoute = Route$k.update({
  id: "/recycle-bin",
  path: "/recycle-bin",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedPayrollRoute = Route$j.update({
  id: "/payroll",
  path: "/payroll",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedParentRoute = Route$i.update({
  id: "/parent",
  path: "/parent",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedNotificationsRoute = Route$h.update({
  id: "/notifications",
  path: "/notifications",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedMarksRoute = Route$g.update({
  id: "/marks",
  path: "/marks",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedLeavesRoute = Route$f.update({
  id: "/leaves",
  path: "/leaves",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedInvitationsRoute = Route$e.update({
  id: "/invitations",
  path: "/invitations",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedIdCardsRoute = Route$d.update({
  id: "/id-cards",
  path: "/id-cards",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedHomeworkRoute = Route$c.update({
  id: "/homework",
  path: "/homework",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedFeesRoute = Route$b.update({
  id: "/fees",
  path: "/fees",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedDashboardRoute = Route$a.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedClassesRoute = Route$9.update({
  id: "/classes",
  path: "/classes",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedChangePasswordRoute = Route$8.update({
  id: "/change-password",
  path: "/change-password",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedAttendanceRoute = Route$7.update({
  id: "/attendance",
  path: "/attendance",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedAnnouncementsRoute = Route$6.update({
  id: "/announcements",
  path: "/announcements",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedAnalyticsRoute = Route$5.update({
  id: "/analytics",
  path: "/analytics",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedAdminRoute = Route$4.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedAchievementsRoute = Route$3.update({
  id: "/achievements",
  path: "/achievements",
  getParentRoute: () => AuthenticatedRoute,
});
const AuthenticatedStudentsStudentIdRoute = Route$2.update({
  id: "/$studentId",
  path: "/$studentId",
  getParentRoute: () => AuthenticatedStudentsRoute,
});
const AuthenticatedAdminWhatsappRoute = Route$1.update({
  id: "/whatsapp",
  path: "/whatsapp",
  getParentRoute: () => AuthenticatedAdminRoute,
});
const AuthenticatedAdminBillingRoute = Route.update({
  id: "/billing",
  path: "/billing",
  getParentRoute: () => AuthenticatedAdminRoute,
});
const AuthenticatedAdminRouteChildren = {
  AuthenticatedAdminBillingRoute,
  AuthenticatedAdminWhatsappRoute,
};
const AuthenticatedAdminRouteWithChildren = AuthenticatedAdminRoute._addFileChildren(
  AuthenticatedAdminRouteChildren,
);
const AuthenticatedStudentsRouteChildren = {
  AuthenticatedStudentsStudentIdRoute,
};
const AuthenticatedStudentsRouteWithChildren = AuthenticatedStudentsRoute._addFileChildren(
  AuthenticatedStudentsRouteChildren,
);
const AuthenticatedRouteChildren = {
  AuthenticatedAchievementsRoute,
  AuthenticatedAdminRoute: AuthenticatedAdminRouteWithChildren,
  AuthenticatedAnalyticsRoute,
  AuthenticatedAnnouncementsRoute,
  AuthenticatedAttendanceRoute,
  AuthenticatedChangePasswordRoute,
  AuthenticatedClassesRoute,
  AuthenticatedDashboardRoute,
  AuthenticatedFeesRoute,
  AuthenticatedHomeworkRoute,
  AuthenticatedIdCardsRoute,
  AuthenticatedInvitationsRoute,
  AuthenticatedLeavesRoute,
  AuthenticatedMarksRoute,
  AuthenticatedNotificationsRoute,
  AuthenticatedParentRoute,
  AuthenticatedPayrollRoute,
  AuthenticatedRecycleBinRoute,
  AuthenticatedRemarksRoute,
  AuthenticatedReportCardsRoute,
  AuthenticatedStudentsRoute: AuthenticatedStudentsRouteWithChildren,
  AuthenticatedSuperAdminRoute,
  AuthenticatedTeacherAllocationsRoute,
};
const AuthenticatedRouteWithChildren = AuthenticatedRoute._addFileChildren(
  AuthenticatedRouteChildren,
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRoute: AuthenticatedRouteWithChildren,
  ForgotPasswordRoute,
  LoginRoute,
  OnboardingRoute,
  ResetPasswordRoute,
  SignupRoute,
  VerifyIdRoute,
};
const routeTree = Route$y._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(
  /* @__PURE__ */ Object.defineProperty(
    {
      __proto__: null,
      getRouter,
    },
    Symbol.toStringTag,
    { value: "Module" },
  ),
);
export {
  PageHeader as P,
  Route$x as R,
  Route$2 as a,
  getStudentIdFallback as b,
  usePageTitle as c,
  useSchoolContext as d,
  useSchoolName as e,
  useTenant as f,
  getStaffIdFallback as g,
  useTheme as h,
  router as r,
  safeHtml2Canvas as s,
  useAuth as u,
};
