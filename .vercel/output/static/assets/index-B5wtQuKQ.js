import { V as d, W as l, x as e, L as a, k as c, a as m, G as x } from "./index-DrqTZ7SR.js";
import { k as p } from "./vendor-charts-DECNlt_G.js";
import { C as g } from "./calendar-check-DuiRifj2.js";
import { M as h } from "./message-square-BVAiuQO7.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function v() {
  const { session: o, loading: i, schoolId: r, roles: n } = d(),
    s = l();
  return (
    p.useEffect(() => {
      i ||
        (o &&
          (n.includes("super_admin") && !r
            ? s({ to: "/super-admin" })
            : !r && !n.includes("parent")
              ? s({ to: "/onboarding" })
              : s({ to: "/dashboard" })));
    }, [o, i, r, n, s]),
    e.jsxs("div", {
      className: "min-h-screen bg-background",
      children: [
        e.jsx("header", {
          className: "border-b border-border bg-card",
          children: e.jsxs("div", {
            className: "max-w-6xl mx-auto px-8 h-16 flex items-center justify-between",
            children: [
              e.jsxs("div", {
                className: "flex items-center gap-3",
                children: [
                  e.jsx("div", {
                    className:
                      "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground",
                    children: "H",
                  }),
                  e.jsx("span", {
                    className: "font-semibold tracking-tight",
                    children: "HEZO SCHOOL",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex gap-2",
                children: [
                  e.jsx(a, {
                    to: "/login",
                    className:
                      "px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md",
                    children: "Sign in",
                  }),
                  e.jsx(a, {
                    to: "/signup",
                    className:
                      "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90",
                    children: "Start free",
                  }),
                ],
              }),
            ],
          }),
        }),
        e.jsxs("section", {
          className: "max-w-6xl mx-auto px-8 py-24",
          children: [
            e.jsxs("div", {
              className: "max-w-3xl",
              children: [
                e.jsxs("span", {
                  className:
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-medium mb-6",
                  children: [
                    e.jsx(c, { className: "size-3" }),
                    " Built for Indian schools, 100–2000 students",
                  ],
                }),
                e.jsx("h1", {
                  className: "text-5xl font-bold tracking-tight text-balance leading-[1.1]",
                  children:
                    "The school operations tool your teachers will actually open every morning.",
                }),
                e.jsx("p", {
                  className: "text-lg text-muted-foreground mt-6 max-w-2xl text-pretty",
                  children:
                    "Mark attendance in one tap. Send homework with a PDF. Add a remark and the parent knows by evening — automatically, in the Parent Daily Digest.",
                }),
                e.jsxs("div", {
                  className: "mt-8 flex gap-3",
                  children: [
                    e.jsx(a, {
                      to: "/signup",
                      className:
                        "px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90",
                      children: "Set up your school",
                    }),
                    e.jsx(a, {
                      to: "/login",
                      className:
                        "px-5 py-2.5 text-sm font-semibold border border-border rounded-lg hover:bg-accent",
                      children: "Sign in",
                    }),
                  ],
                }),
              ],
            }),
            e.jsx("div", {
              className: "grid grid-cols-1 md:grid-cols-4 gap-4 mt-20",
              children: [
                {
                  icon: g,
                  title: "Attendance",
                  body: "One-tap Present / Absent / Late / Half Day. Realtime.",
                },
                {
                  icon: m,
                  title: "Homework",
                  body: "Upload PDFs or images. Parents see them instantly.",
                },
                {
                  icon: h,
                  title: "Remarks",
                  body: "Academic, behaviour, appreciation. Reaches parents.",
                },
                {
                  icon: x,
                  title: "Daily Digest",
                  body: "Every parent gets one clean summary each evening.",
                },
              ].map((t) =>
                e.jsxs(
                  "div",
                  {
                    className: "bg-card border border-border rounded-xl p-5",
                    children: [
                      e.jsx(t.icon, { className: "size-5 text-brand" }),
                      e.jsx("h3", { className: "font-semibold mt-3", children: t.title }),
                      e.jsx("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: t.body,
                      }),
                    ],
                  },
                  t.title,
                ),
              ),
            }),
          ],
        }),
      ],
    })
  );
}
export { v as component };
