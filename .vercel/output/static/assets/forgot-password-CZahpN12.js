import { x as e, G as b, L as j, y, K as N, N as l } from "./index-DrqTZ7SR.js";
import { k as r } from "./vendor-charts-DECNlt_G.js";
import { u as w, c as v } from "./platform.functions-De0vHKEw.js";
import { a as k, u as S } from "./zod-s8Mq3DA4.js";
import { A as E } from "./arrow-left-OIn1xrb6.js";
import { M as L } from "./mail-BgE7oUjd.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const P = y({ email: N().email({ message: "Please enter a valid email address." }).max(120) });
function A() {
  const [a, t] = r.useState(!1),
    [d, i] = r.useState(!1),
    [c, m] = r.useState(""),
    x = w(v),
    {
      register: u,
      handleSubmit: g,
      formState: { errors: o },
    } = k({ resolver: S(P) }),
    f = async (n) => {
      (t(!0), m(n.email));
      const p = `${window.location.origin}/reset-password`;
      try {
        (await x({ data: { email: n.email, redirectTo: p } }),
          t(!1),
          i(!0),
          l.success("Recovery email sent successfully!"));
      } catch (h) {
        t(!1);
        let s = h.message || "Failed to send reset link.";
        ((s.includes("429") || s.toLowerCase().includes("too many requests")) &&
          (s = "Too many password reset requests. Please slow down and try again later."),
          l.error(s));
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
                  "size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm",
                children: e.jsx(b, { className: "size-5" }),
              }),
              e.jsx("span", {
                className: "font-semibold tracking-tight uppercase tracking-wider",
                children: "HEZO SCHOOL",
              }),
            ],
          }),
          e.jsx("div", {
            className: "max-w-md",
            children: e.jsx("p", {
              className: "text-2xl font-medium leading-snug text-balance",
              children:
                '"Request a password recovery link to securely log back into your academic portal."',
            }),
          }),
          e.jsx("p", { className: "text-xs text-sidebar-muted", children: "© HEZO SCHOOL" }),
        ],
      }),
      e.jsx("div", {
        className: "flex items-center justify-center p-8 bg-card text-foreground",
        children: e.jsxs("div", {
          className: "w-full max-w-sm space-y-6",
          children: [
            e.jsx("div", {
              className: "flex items-center",
              children: e.jsxs(j, {
                to: "/login",
                className:
                  "text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1",
                children: [e.jsx(E, { className: "size-3.5" }), " Back to Sign in"],
              }),
            }),
            d
              ? e.jsxs("div", {
                  className: "space-y-4",
                  children: [
                    e.jsx("div", {
                      className:
                        "size-12 rounded-full bg-success-soft text-success flex items-center justify-center",
                      children: e.jsx(L, { className: "size-6" }),
                    }),
                    e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className: "text-xl font-bold",
                          children: "Check your inbox",
                        }),
                        e.jsxs("p", {
                          className: "text-sm text-muted-foreground mt-2 leading-relaxed",
                          children: [
                            "We have sent a secure password recovery link to ",
                            e.jsx("strong", { children: c }),
                            ". Please click the link in the email to choose a new password.",
                          ],
                        }),
                      ],
                    }),
                    e.jsx("button", {
                      onClick: () => i(!1),
                      className: "text-sm text-brand font-medium hover:underline block pt-2",
                      children: "Did not receive? Send again",
                    }),
                  ],
                })
              : e.jsxs("form", {
                  onSubmit: g(f),
                  className: "space-y-6",
                  children: [
                    e.jsxs("div", {
                      children: [
                        e.jsx("h1", {
                          className: "text-2xl font-semibold tracking-tight text-foreground",
                          children: "Reset password",
                        }),
                        e.jsx("p", {
                          className: "text-sm text-muted-foreground mt-1",
                          children:
                            "Enter your email address and we'll send you a link to reset your password.",
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "space-y-3",
                      children: e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-sm font-medium text-foreground",
                            children: "Email address",
                          }),
                          e.jsx("input", {
                            type: "email",
                            ...u("email"),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                            placeholder: "you@school.com",
                          }),
                          o.email &&
                            e.jsx("p", {
                              className: "text-xs text-danger mt-1 font-semibold",
                              children: o.email.message,
                            }),
                        ],
                      }),
                    }),
                    e.jsx("button", {
                      type: "submit",
                      disabled: a,
                      className:
                        "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
                      children: a ? "Sending link…" : "Send reset link",
                    }),
                  ],
                }),
          ],
        }),
      }),
    ],
  });
}
export { A as component };
