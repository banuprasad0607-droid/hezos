import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useServerFn, l as loginAttemptServer } from "./platform.functions-CG6gbu1e.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import "../_libs/seroval.mjs";
import { J as GraduationCap } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
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
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
const loginSchema = objectType({
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
function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const [cachedSchoolName, setCachedSchoolName] = reactExports.useState(null);
  const [cachedSchoolLogo, setCachedSchoolLogo] = reactExports.useState(null);
  const loginAttemptFn = useServerFn(loginAttemptServer);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: u(loginSchema),
  });
  reactExports.useEffect(() => {
    const name = localStorage.getItem("hezo_last_school_name");
    const logo = localStorage.getItem("hezo_last_school_logo");
    if (name) setCachedSchoolName(name);
    if (logo) setCachedSchoolLogo(logo);
  }, []);
  const onSubmitForm = async (fields) => {
    setLoading(true);
    try {
      const res = await loginAttemptFn({
        data: {
          email: fields.email,
          password: fields.password,
        },
      });
      if (!res.session) throw new Error("Authentication failed: No session returned.");
      const { error: sessionErr } = await supabase.auth.setSession(res.session);
      if (sessionErr) throw sessionErr;
      if (res.user) {
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("school_id")
            .eq("user_id", res.user.id)
            .maybeSingle();
          if (prof?.school_id) {
            const { data: sch } = await supabase
              .from("schools")
              .select("name, logo_url")
              .eq("id", prof.school_id)
              .maybeSingle();
            if (sch) {
              localStorage.setItem("hezo_last_school_name", sch.name);
              if (sch.logo_url) {
                localStorage.setItem("hezo_last_school_logo", sch.logo_url);
              } else {
                localStorage.removeItem("hezo_last_school_logo");
              }
            }
          }
        } catch (brandingErr) {
          console.error("Error caching school branding context:", brandingErr);
        }
      }
      setLoading(false);
      toast.success("Welcome back");
      navigate({
        to: "/dashboard",
      });
    } catch (err) {
      setLoading(false);
      let msg = err.message || "Could not sign in";
      if (msg.includes("429") || msg.toLowerCase().includes("too many requests")) {
        msg = "Too many login attempts. Please slow down and try again later.";
      }
      toast.error(msg);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "min-h-screen grid lg:grid-cols-2",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              cachedSchoolLogo
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                    src: cachedSchoolLogo,
                    alt: "School Logo",
                    className: "size-8 rounded-lg object-cover bg-white p-0.5",
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                      className: "size-5",
                    }),
                  }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "font-semibold tracking-tight uppercase tracking-wider",
                children: cachedSchoolName || "HEZO SCHOOL",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "max-w-md",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-2xl font-medium leading-snug text-balance",
                children:
                  '"Mark attendance, send homework, write one remark — parents are informed by 6 PM. Every day."',
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-sidebar-muted mt-4",
                children: "The Parent Daily Digest, automated.",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
            className: "text-xs text-sidebar-muted",
            children: ["© ", cachedSchoolName || "HEZO SCHOOL"],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex items-center justify-center p-8 bg-card text-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
          onSubmit: handleSubmit(onSubmitForm),
          className: "w-full max-w-sm space-y-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                  className: "text-2xl font-semibold tracking-tight text-foreground",
                  children: "Sign in",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                  className: "text-sm text-muted-foreground mt-1",
                  children: ["Welcome back to ", cachedSchoolName || "your school", "."],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium text-foreground",
                      children: "Email",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "email",
                      ...register("email"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                      placeholder: "you@school.com",
                    }),
                    errors.email &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: errors.email.message,
                      }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                          className: "text-sm font-medium text-foreground",
                          children: "Password",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                          to: "/forgot-password",
                          className: "text-xs text-brand font-medium hover:underline",
                          children: "Forgot password?",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "password",
                      ...register("password"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    errors.password &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: errors.password.message,
                      }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              type: "submit",
              disabled: loading,
              className:
                "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
              children: loading ? "Signing in…" : "Sign in",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
              className: "text-sm text-center text-muted-foreground",
              children: [
                "New here?",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/signup",
                  className: "text-brand font-medium hover:underline",
                  children: "Create your school account",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { LoginPage as component };
