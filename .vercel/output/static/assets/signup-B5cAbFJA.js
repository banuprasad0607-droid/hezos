import { W as x, x as e, L as g, M as f, N as r, y as p, K as l } from "./index-DrqTZ7SR.js";
import { k as h } from "./vendor-charts-DECNlt_G.js";
import { a as b, u as j } from "./zod-s8Mq3DA4.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const N = p({
  fullName: l().min(2, { message: "Full name must be at least 2 characters." }).max(120),
  email: l().email({ message: "Please enter a valid email address." }).max(120),
  password: l().min(6, { message: "Password must be at least 6 characters." }).max(72),
});
function k() {
  const m = x(),
    [d, a] = h.useState(!1),
    {
      register: n,
      handleSubmit: c,
      formState: { errors: s },
    } = b({ resolver: j(N) }),
    u = async (o) => {
      a(!0);
      try {
        const i = `${window.location.origin}/onboarding`,
          { error: t } = await f.auth.signUp({
            email: o.email,
            password: o.password,
            options: { emailRedirectTo: i, data: { full_name: o.fullName } },
          });
        if ((a(!1), t))
          return t.status === 429 || t.message.toLowerCase().includes("rate limit")
            ? r.error("Too many signup requests. Please wait a minute and try again.")
            : t.message.toLowerCase().includes("already registered") ||
                t.message.toLowerCase().includes("exists")
              ? r.error("An account with this email already exists. Please sign in instead.")
              : r.error(t.message);
        (r.success("Account created. Let's set up your school."), m({ to: "/onboarding" }));
      } catch (i) {
        (a(!1), r.error(i.message || "An unexpected error occurred during signup."));
      }
    };
  return e.jsxs("div", {
    className: "min-h-screen grid lg:grid-cols-2",
    children: [
      e.jsxs("div", {
        className: "hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between",
        children: [
          e.jsxs("div", {
            className: "flex items-center gap-3",
            children: [
              e.jsx("div", {
                className:
                  "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground font-sans",
                children: "H",
              }),
              e.jsx("span", { className: "font-semibold tracking-tight", children: "HEZO SCHOOL" }),
            ],
          }),
          e.jsxs("div", {
            className: "max-w-md space-y-4",
            children: [
              e.jsx("p", {
                className: "text-2xl font-medium leading-snug text-balance",
                children: "Start with one class today. Add more tomorrow.",
              }),
              e.jsxs("ul", {
                className: "text-sm text-sidebar-muted space-y-2",
                children: [
                  e.jsx("li", { children: "• One-tap attendance" }),
                  e.jsx("li", { children: "• PDF & image homework" }),
                  e.jsx("li", { children: "• Parent Daily Digest, automatic" }),
                ],
              }),
            ],
          }),
          e.jsx("p", { className: "text-xs text-sidebar-muted", children: "© HEZO SCHOOL" }),
        ],
      }),
      e.jsx("div", {
        className: "flex items-center justify-center p-8 bg-card text-foreground",
        children: e.jsxs("form", {
          onSubmit: c(u),
          className: "w-full max-w-sm space-y-6",
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("h1", {
                  className: "text-2xl font-semibold tracking-tight text-foreground",
                  children: "Create your school",
                }),
                e.jsx("p", {
                  className: "text-sm text-muted-foreground mt-1",
                  children: "You'll be the Admin. Invite teachers next.",
                }),
              ],
            }),
            e.jsxs("div", {
              className: "space-y-3",
              children: [
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className: "text-sm font-medium text-foreground",
                      children: "Your full name",
                    }),
                    e.jsx("input", {
                      ...n("fullName"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    s.fullName &&
                      e.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: s.fullName.message,
                      }),
                  ],
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className: "text-sm font-medium text-foreground",
                      children: "Email",
                    }),
                    e.jsx("input", {
                      type: "email",
                      ...n("email"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    s.email &&
                      e.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: s.email.message,
                      }),
                  ],
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className: "text-sm font-medium text-foreground",
                      children: "Password",
                    }),
                    e.jsx("input", {
                      type: "password",
                      ...n("password"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    s.password &&
                      e.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: s.password.message,
                      }),
                    e.jsx("p", {
                      className: "text-[10px] text-muted-foreground mt-1",
                      children: "Minimum 6 characters.",
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("button", {
              type: "submit",
              disabled: d,
              className:
                "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
              children: d ? "Creating account…" : "Continue",
            }),
            e.jsxs("p", {
              className: "text-sm text-center text-muted-foreground",
              children: [
                "Already have an account?",
                " ",
                e.jsx(g, {
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
export { k as component };
