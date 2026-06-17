import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
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
const signupSchema = objectType({
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
function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = reactExports.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: u(signupSchema),
  });
  const onSubmitForm = async (fields) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      const { error } = await supabase.auth.signUp({
        email: fields.email,
        password: fields.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fields.fullName,
          },
        },
      });
      setLoading(false);
      if (error) {
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          return toast.error("Too many signup requests. Please wait a minute and try again.");
        }
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("exists")
        ) {
          return toast.error("An account with this email already exists. Please sign in instead.");
        }
        return toast.error(error.message);
      }
      toast.success("Account created. Let's set up your school.");
      navigate({
        to: "/onboarding",
      });
    } catch (err) {
      setLoading(false);
      toast.error(err.message || "An unexpected error occurred during signup.");
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground font-sans",
                children: "H",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "font-semibold tracking-tight",
                children: "HEZO SCHOOL",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "max-w-md space-y-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-2xl font-medium leading-snug text-balance",
                children: "Start with one class today. Add more tomorrow.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", {
                className: "text-sm text-sidebar-muted space-y-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• One-tap attendance" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                    children: "• PDF & image homework",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("li", {
                    children: "• Parent Daily Digest, automatic",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-xs text-sidebar-muted",
            children: "© HEZO SCHOOL",
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
                  children: "Create your school",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-sm text-muted-foreground mt-1",
                  children: "You'll be the Admin. Invite teachers next.",
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
                      children: "Your full name",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      ...register("fullName"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    errors.fullName &&
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: errors.fullName.message,
                      }),
                  ],
                }),
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                      className: "text-sm font-medium text-foreground",
                      children: "Password",
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-[10px] text-muted-foreground mt-1",
                      children: "Minimum 6 characters.",
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
              children: loading ? "Creating account…" : "Continue",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
              className: "text-sm text-center text-muted-foreground",
              children: [
                "Already have an account?",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/login",
                  className: "text-brand font-medium hover:underline",
                  children: "Sign in",
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
export { SignupPage as component };
