import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  aj as Sparkles,
  i as CalendarCheck,
  f as BookOpen,
  Y as MessageSquare,
  J as GraduationCap,
} from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "./client-mniyZlvf.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/recharts.mjs";
import "../_libs/clsx.mjs";
import "../_libs/lodash.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
import "../_libs/zod.mjs";
import "fs";
import "../_libs/dijkstrajs.mjs";
import "../_libs/pngjs.mjs";
import "zlib";
import "assert";
import "buffer";
import "path";
import "../_libs/fflate.mjs";
import "../_libs/fast-png.mjs";
import "../_libs/iobuffer.mjs";
import "../_libs/pako.mjs";
import "../_libs/dompurify.mjs";
import "../_libs/canvg.mjs";
import "../_libs/core-js.mjs";
import "../_libs/babel__runtime.mjs";
import "../_libs/raf.mjs";
import "../_libs/performance-now.mjs";
import "../_libs/rgbcolor.mjs";
import "../_libs/svg-pathdata.mjs";
import "../_libs/stackblur-canvas.mjs";
function Landing() {
  const { session, loading, schoolId, roles } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!session) return;
    if (roles.includes("super_admin") && !schoolId)
      navigate({
        to: "/super-admin",
      });
    else if (!schoolId && !roles.includes("parent"))
      navigate({
        to: "/onboarding",
      });
    else
      navigate({
        to: "/dashboard",
      });
  }, [session, loading, schoolId, roles, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "min-h-screen bg-background",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", {
        className: "border-b border-border bg-card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "max-w-6xl mx-auto px-8 h-16 flex items-center justify-between",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex items-center gap-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground",
                  children: "H",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: "font-semibold tracking-tight",
                  children: "HEZO SCHOOL",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                  to: "/login",
                  className:
                    "px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md",
                  children: "Sign in",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
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
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
        className: "max-w-6xl mx-auto px-8 py-24",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "max-w-3xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                className:
                  "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-medium mb-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3" }),
                  " Built for Indian schools, 100–2000 students",
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                className: "text-5xl font-bold tracking-tight text-balance leading-[1.1]",
                children:
                  "The school operations tool your teachers will actually open every morning.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-lg text-muted-foreground mt-6 max-w-2xl text-pretty",
                children:
                  "Mark attendance in one tap. Send homework with a PDF. Add a remark and the parent knows by evening — automatically, in the Parent Daily Digest.",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "mt-8 flex gap-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                    to: "/signup",
                    className:
                      "px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90",
                    children: "Set up your school",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
                    to: "/login",
                    className:
                      "px-5 py-2.5 text-sm font-semibold border border-border rounded-lg hover:bg-accent",
                    children: "Sign in",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "grid grid-cols-1 md:grid-cols-4 gap-4 mt-20",
            children: [
              {
                icon: CalendarCheck,
                title: "Attendance",
                body: "One-tap Present / Absent / Late / Half Day. Realtime.",
              },
              {
                icon: BookOpen,
                title: "Homework",
                body: "Upload PDFs or images. Parents see them instantly.",
              },
              {
                icon: MessageSquare,
                title: "Remarks",
                body: "Academic, behaviour, appreciation. Reaches parents.",
              },
              {
                icon: GraduationCap,
                title: "Daily Digest",
                body: "Every parent gets one clean summary each evening.",
              },
            ].map((f) =>
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "bg-card border border-border rounded-xl p-5",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, {
                      className: "size-5 text-brand",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mt-3",
                      children: f.title,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children: f.body,
                    }),
                  ],
                },
                f.title,
              ),
            ),
          }),
        ],
      }),
    ],
  });
}
export { Landing as component };
