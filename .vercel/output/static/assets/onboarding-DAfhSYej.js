import { W as i, a0 as c, V as d, x as e } from "./index-DrqTZ7SR.js";
import { k as l } from "./vendor-charts-DECNlt_G.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function f() {
  const s = i(),
    { user: t, loading: o, currentSchoolId: r, roles: n } = c(),
    { signOut: a } = d();
  return (
    l.useEffect(() => {
      o ||
        (t
          ? n.includes("super_admin")
            ? s({ to: "/super-admin" })
            : r && s({ to: "/dashboard" })
          : s({ to: "/login" }));
    }, [t, o, r, n, s]),
    e.jsx("div", {
      className: "min-h-screen flex items-center justify-center p-8 bg-background",
      children: e.jsxs("div", {
        className:
          "w-full max-w-md space-y-6 bg-card border border-border rounded-2xl p-8 shadow-sm text-center",
        children: [
          e.jsxs("div", {
            children: [
              e.jsx("h1", {
                className: "text-2xl font-semibold tracking-tight",
                children: "Account Pending",
              }),
              e.jsxs("p", {
                className: "text-sm text-muted-foreground mt-4",
                children: [
                  "Your account has been created, but you haven't been assigned to a school yet.",
                  e.jsx("br", {}),
                  e.jsx("br", {}),
                  e.jsx("strong", { children: "Note:" }),
                  " Only platform Super Admins can create new schools. If you are a teacher or staff member, please wait for your school administrator to invite you or assign you to a school.",
                ],
              }),
            ],
          }),
          e.jsx("button", {
            onClick: () => a(),
            className:
              "mt-6 w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90",
            children: "Sign Out",
          }),
        ],
      }),
    })
  );
}
export { f as component };
