import { W as p, X as x, x as e, P as g, N as t, M as b } from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import { K as f } from "./key-round-B9OZppG8.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function v() {
  const c = p();
  x("Change Password");
  const [r, o] = a.useState(""),
    [d, n] = a.useState(""),
    [i, u] = a.useState(!1),
    l = async (s) => {
      if ((s.preventDefault(), r.length < 8))
        return t.error("Password must be at least 8 characters");
      if (r !== d) return t.error("Passwords do not match");
      u(!0);
      const { error: m } = await b.auth.updateUser({ password: r });
      if ((u(!1), m)) return t.error(m.message);
      (t.success("Password updated"), o(""), n(""), c({ to: "/dashboard" }));
    };
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(g, { title: "Change password", breadcrumb: "Account" }),
      e.jsx("div", {
        className: "p-8",
        children: e.jsxs("form", {
          onSubmit: l,
          className: "max-w-md bg-card border border-border rounded-xl p-6 space-y-4",
          children: [
            e.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                e.jsx("div", {
                  className:
                    "size-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center",
                  children: e.jsx(f, { className: "size-5" }),
                }),
                e.jsxs("div", {
                  children: [
                    e.jsx("h2", { className: "font-semibold", children: "Update your password" }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Use at least 8 characters.",
                    }),
                  ],
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className: "text-xs font-medium text-muted-foreground",
                  children: "New password",
                }),
                e.jsx("input", {
                  type: "password",
                  required: !0,
                  minLength: 8,
                  value: r,
                  onChange: (s) => o(s.target.value),
                  className:
                    "mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand",
                }),
              ],
            }),
            e.jsxs("div", {
              children: [
                e.jsx("label", {
                  className: "text-xs font-medium text-muted-foreground",
                  children: "Confirm password",
                }),
                e.jsx("input", {
                  type: "password",
                  required: !0,
                  minLength: 8,
                  value: d,
                  onChange: (s) => n(s.target.value),
                  className:
                    "mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand",
                }),
              ],
            }),
            e.jsx("button", {
              type: "submit",
              disabled: i,
              className:
                "w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50",
              children: i ? "Updating…" : "Update password",
            }),
          ],
        }),
      }),
    ],
  });
}
export { v as component };
