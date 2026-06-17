import { W as w, x as e, G as j, b as y, M as o, N as a } from "./index-DrqTZ7SR.js";
import { k as t } from "./vendor-charts-DECNlt_G.js";
import { K as N } from "./key-round-B9OZppG8.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function O() {
  const i = w(),
    [r, m] = t.useState(""),
    [d, x] = t.useState(""),
    [c, l] = t.useState(!1),
    [f, g] = t.useState(!1),
    [p, u] = t.useState(!0);
  t.useEffect(() => {
    (async () => {
      const { data: n } = await o.auth.getSession();
      n.session
        ? u(!1)
        : setTimeout(async () => {
            const { data: b } = await o.auth.getSession();
            b.session
              ? u(!1)
              : (a.error("Recovery session not found. Please request a new link."),
                i({ to: "/forgot-password" }));
          }, 1e3);
    })();
  }, [i]);
  const h = async (s) => {
    if ((s.preventDefault(), r.length < 8))
      return a.error("Password must be at least 8 characters long.");
    if (r !== d) return a.error("Passwords do not match.");
    l(!0);
    const { error: n } = await o.auth.updateUser({ password: r });
    if ((l(!1), n)) return a.error(n.message);
    (g(!0), a.success("Password reset completed successfully!"), await o.auth.signOut());
  };
  return p
    ? e.jsx("div", {
        className:
          "min-h-screen flex items-center justify-center text-sm text-muted-foreground bg-background",
        children: "Verifying password recovery session…",
      })
    : e.jsxs("div", {
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
                    children: e.jsx(j, { className: "size-5" }),
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
                    '"Create a strong, unique password to secure your academic details and keep your account safe."',
                }),
              }),
              e.jsx("p", { className: "text-xs text-sidebar-muted", children: "© HEZO SCHOOL" }),
            ],
          }),
          e.jsx("div", {
            className: "flex items-center justify-center p-8 bg-card text-foreground",
            children: e.jsx("div", {
              className: "w-full max-w-sm space-y-6",
              children: f
                ? e.jsxs("div", {
                    className: "space-y-4",
                    children: [
                      e.jsx("div", {
                        className:
                          "size-12 rounded-full bg-success-soft text-success flex items-center justify-center",
                        children: e.jsx(y, { className: "size-6" }),
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("h1", {
                            className: "text-xl font-bold",
                            children: "Password reset successful",
                          }),
                          e.jsx("p", {
                            className: "text-sm text-muted-foreground mt-2 leading-relaxed",
                            children:
                              "Your password has been successfully updated. You can now log back into HEZO School ERP using your new password.",
                          }),
                        ],
                      }),
                      e.jsx("button", {
                        onClick: () => i({ to: "/login" }),
                        className:
                          "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 shadow-sm",
                        children: "Sign in with new password",
                      }),
                    ],
                  })
                : e.jsxs("form", {
                    onSubmit: h,
                    className: "space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3",
                        children: [
                          e.jsx("div", {
                            className:
                              "size-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center",
                            children: e.jsx(N, { className: "size-5" }),
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("h1", {
                                className: "text-xl font-semibold tracking-tight",
                                children: "Choose new password",
                              }),
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children:
                                  "Please choose a password containing at least 8 characters.",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "space-y-3",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "New password",
                              }),
                              e.jsx("input", {
                                type: "password",
                                required: !0,
                                minLength: 8,
                                value: r,
                                onChange: (s) => m(s.target.value),
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                                placeholder: "••••••••",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "Confirm new password",
                              }),
                              e.jsx("input", {
                                type: "password",
                                required: !0,
                                minLength: 8,
                                value: d,
                                onChange: (s) => x(s.target.value),
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                                placeholder: "••••••••",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: c,
                        className:
                          "w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm",
                        children: c ? "Updating password…" : "Reset password",
                      }),
                    ],
                  }),
            }),
          }),
        ],
      });
}
export { O as component };
