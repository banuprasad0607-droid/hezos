import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { J as GraduationCap, r as CircleCheck, Q as KeyRound } from "../_libs/lucide-react.mjs";
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
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [completed, setCompleted] = reactExports.useState(false);
  const [checkingSession, setCheckingSession] = reactExports.useState(true);
  reactExports.useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (!retryData.session) {
            toast.error("Recovery session not found. Please request a new link.");
            navigate({
              to: "/forgot-password",
            });
          } else {
            setCheckingSession(false);
          }
        }, 1e3);
      } else {
        setCheckingSession(false);
      }
    };
    void checkSession();
  }, [navigate]);
  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password,
    });
    setLoading(false);
    if (error) {
      return toast.error(error.message);
    }
    setCompleted(true);
    toast.success("Password reset completed successfully!");
    await supabase.auth.signOut();
  };
  if (checkingSession) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className:
        "min-h-screen flex items-center justify-center text-sm text-muted-foreground bg-background",
      children: "Verifying password recovery session…",
    });
  }
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
                '"Create a strong, unique password to secure your academic details and keep your account safe."',
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
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "w-full max-w-sm space-y-6",
          children: completed
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "size-12 rounded-full bg-success-soft text-success flex items-center justify-center",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                      className: "size-6",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                        className: "text-xl font-bold",
                        children: "Password reset successful",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-sm text-muted-foreground mt-2 leading-relaxed",
                        children:
                          "Your password has been successfully updated. You can now log back into HEZO School ERP using your new password.",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () =>
                      navigate({
                        to: "/login",
                      }),
                    className:
                      "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 shadow-sm",
                    children: "Sign in with new password",
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
                onSubmit: submit,
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "flex items-center gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className:
                          "size-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, {
                          className: "size-5",
                        }),
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                            className: "text-xl font-semibold tracking-tight",
                            children: "Choose new password",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                            className: "text-xs text-muted-foreground mt-0.5",
                            children: "Please choose a password containing at least 8 characters.",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "space-y-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "New password",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "password",
                            required: true,
                            minLength: 8,
                            value: password,
                            onChange: (e) => setPassword(e.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                            placeholder: "••••••••",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Confirm new password",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "password",
                            required: true,
                            minLength: 8,
                            value: confirmPassword,
                            onChange: (e) => setConfirmPassword(e.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                            placeholder: "••••••••",
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
                    children: loading ? "Updating password…" : "Reset password",
                  }),
                ],
              }),
        }),
      }),
    ],
  });
}
export { ResetPasswordPage as component };
