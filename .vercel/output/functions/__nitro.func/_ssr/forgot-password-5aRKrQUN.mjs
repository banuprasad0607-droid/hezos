import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useServerFn, c as resetPasswordEmailServer } from "./platform.functions-CG6gbu1e.mjs";
import { u as useForm } from "../_libs/react-hook-form.mjs";
import { u } from "../_libs/hookform__resolvers.mjs";
import "../_libs/seroval.mjs";
import { J as GraduationCap, A as ArrowLeft, U as Mail } from "../_libs/lucide-react.mjs";
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
import "./server-DOPhEqh1.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-CDUZ4KwQ.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const forgotSchema = objectType({
  email: stringType()
    .email({
      message: "Please enter a valid email address.",
    })
    .max(120),
});
function ForgotPasswordPage() {
  const [loading, setLoading] = reactExports.useState(false);
  const [sent, setSent] = reactExports.useState(false);
  const [submittedEmail, setSubmittedEmail] = reactExports.useState("");
  const resetPasswordEmailFn = useServerFn(resetPasswordEmailServer);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: u(forgotSchema),
  });
  const onSubmitForm = async (fields) => {
    setLoading(true);
    setSubmittedEmail(fields.email);
    const redirectUrl = `${window.location.origin}/reset-password`;
    try {
      await resetPasswordEmailFn({
        data: {
          email: fields.email,
          redirectTo: redirectUrl,
        },
      });
      setLoading(false);
      setSent(true);
      toast.success("Recovery email sent successfully!");
    } catch (err) {
      setLoading(false);
      let msg = err.message || "Failed to send reset link.";
      if (msg.includes("429") || msg.toLowerCase().includes("too many requests")) {
        msg = "Too many password reset requests. Please slow down and try again later.";
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
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, {
                  className: "size-5",
                }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                className: "font-semibold tracking-tight uppercase tracking-wider",
                children: "HEZO SCHOOL",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "max-w-md",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "text-2xl font-medium leading-snug text-balance",
              children:
                '"Request a password recovery link to securely log back into your academic portal."',
            }),
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-xs text-sidebar-muted",
            children: "© HEZO SCHOOL",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex items-center justify-center p-8 bg-card text-foreground",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "w-full max-w-sm space-y-6",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "flex items-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                to: "/login",
                className:
                  "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-3.5" }),
                  " Back to Sign in",
                ],
              }),
            }),
            sent
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "size-12 rounded-full bg-success-soft text-success flex items-center justify-center",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, {
                        className: "size-6",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                          className: "text-xl font-bold",
                          children: "Check your inbox",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-sm text-muted-foreground mt-2 leading-relaxed",
                          children: [
                            "We have sent a secure password recovery link to ",
                            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                              children: submittedEmail,
                            }),
                            ". Please click the link in the email to choose a new password.",
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                      onClick: () => setSent(false),
                      className: "text-sm text-brand font-medium hover:underline block pt-2",
                      children: "Did not receive? Send again",
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                  onSubmit: handleSubmit(onSubmitForm),
                  className: "space-y-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                          className: "text-2xl font-semibold tracking-tight text-foreground",
                          children: "Reset password",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-sm text-muted-foreground mt-1",
                          children:
                            "Enter your email address and we'll send you a link to reset your password.",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "space-y-3",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium text-foreground",
                            children: "Email address",
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
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                      type: "submit",
                      disabled: loading,
                      className:
                        "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
                      children: loading ? "Sending link…" : "Send reset link",
                    }),
                  ],
                }),
          ],
        }),
      }),
    ],
  });
}
export { ForgotPasswordPage as component };
