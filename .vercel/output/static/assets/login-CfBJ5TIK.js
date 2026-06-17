import {
  W as S,
  x as e,
  G as v,
  L as x,
  y as _,
  K as h,
  M as d,
  N as f,
} from "./index-DrqTZ7SR.js";
import { k as l } from "./vendor-charts-DECNlt_G.js";
import { u as k, l as E } from "./platform.functions-De0vHKEw.js";
import { a as L, u as z } from "./zod-s8Mq3DA4.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const C = _({
  email: h().email({ message: "Please enter a valid email address." }).max(120),
  password: h().min(6, { message: "Password must be at least 6 characters." }).max(72),
});
function q() {
  const p = S(),
    [m, i] = l.useState(!1),
    [c, b] = l.useState(null),
    [g, j] = l.useState(null),
    w = k(E),
    {
      register: u,
      handleSubmit: y,
      formState: { errors: a },
    } = L({ resolver: z(C) });
  l.useEffect(() => {
    const o = localStorage.getItem("hezo_last_school_name"),
      s = localStorage.getItem("hezo_last_school_logo");
    (o && b(o), s && j(s));
  }, []);
  const N = async (o) => {
    i(!0);
    try {
      const s = await w({ data: { email: o.email, password: o.password } });
      if (!s.session) throw new Error("Authentication failed: No session returned.");
      const { error: t } = await d.auth.setSession(s.session);
      if (t) throw t;
      if (s.user)
        try {
          const { data: r } = await d
            .from("profiles")
            .select("school_id")
            .eq("user_id", s.user.id)
            .maybeSingle();
          if (r?.school_id) {
            const { data: n } = await d
              .from("schools")
              .select("name, logo_url")
              .eq("id", r.school_id)
              .maybeSingle();
            n &&
              (localStorage.setItem("hezo_last_school_name", n.name),
              n.logo_url
                ? localStorage.setItem("hezo_last_school_logo", n.logo_url)
                : localStorage.removeItem("hezo_last_school_logo"));
          }
        } catch (r) {
          console.error("Error caching school branding context:", r);
        }
      (i(!1), f.success("Welcome back"), p({ to: "/dashboard" }));
    } catch (s) {
      i(!1);
      let t = s.message || "Could not sign in";
      ((t.includes("429") || t.toLowerCase().includes("too many requests")) &&
        (t = "Too many login attempts. Please slow down and try again later."),
        f.error(t));
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
              g
                ? e.jsx("img", {
                    src: g,
                    alt: "School Logo",
                    className: "size-8 rounded-lg object-cover bg-white p-0.5",
                  })
                : e.jsx("div", {
                    className:
                      "size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm",
                    children: e.jsx(v, { className: "size-5" }),
                  }),
              e.jsx("span", {
                className: "font-semibold tracking-tight uppercase tracking-wider",
                children: c || "HEZO SCHOOL",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "max-w-md",
            children: [
              e.jsx("p", {
                className: "text-2xl font-medium leading-snug text-balance",
                children:
                  '"Mark attendance, send homework, write one remark — parents are informed by 6 PM. Every day."',
              }),
              e.jsx("p", {
                className: "text-sm text-sidebar-muted mt-4",
                children: "The Parent Daily Digest, automated.",
              }),
            ],
          }),
          e.jsxs("p", {
            className: "text-xs text-sidebar-muted",
            children: ["© ", c || "HEZO SCHOOL"],
          }),
        ],
      }),
      e.jsx("div", {
        className: "flex items-center justify-center p-8 bg-card text-foreground",
        children: e.jsxs("form", {
          onSubmit: y(N),
          className: "w-full max-w-sm space-y-6",
          children: [
            e.jsxs("div", {
              children: [
                e.jsx("h1", {
                  className: "text-2xl font-semibold tracking-tight text-foreground",
                  children: "Sign in",
                }),
                e.jsxs("p", {
                  className: "text-sm text-muted-foreground mt-1",
                  children: ["Welcome back to ", c || "your school", "."],
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
                      children: "Email",
                    }),
                    e.jsx("input", {
                      type: "email",
                      ...u("email"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                      placeholder: "you@school.com",
                    }),
                    a.email &&
                      e.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: a.email.message,
                      }),
                  ],
                }),
                e.jsxs("div", {
                  children: [
                    e.jsxs("div", {
                      className: "flex items-center justify-between",
                      children: [
                        e.jsx("label", {
                          className: "text-sm font-medium text-foreground",
                          children: "Password",
                        }),
                        e.jsx(x, {
                          to: "/forgot-password",
                          className: "text-xs text-brand font-medium hover:underline",
                          children: "Forgot password?",
                        }),
                      ],
                    }),
                    e.jsx("input", {
                      type: "password",
                      ...u("password"),
                      className:
                        "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground",
                    }),
                    a.password &&
                      e.jsx("p", {
                        className: "text-xs text-danger mt-1 font-semibold",
                        children: a.password.message,
                      }),
                  ],
                }),
              ],
            }),
            e.jsx("button", {
              type: "submit",
              disabled: m,
              className:
                "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
              children: m ? "Signing in…" : "Sign in",
            }),
            e.jsxs("p", {
              className: "text-sm text-center text-muted-foreground",
              children: [
                "New here?",
                " ",
                e.jsx(x, {
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
export { q as component };
