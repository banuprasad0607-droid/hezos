import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { f as useTenant, u as useAuth } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
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
import "../_libs/lucide-react.mjs";
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
function PendingAssignmentPage() {
  const navigate = useNavigate();
  const { user, loading, currentSchoolId: schoolId, roles } = useTenant();
  const { signOut } = useAuth();
  reactExports.useEffect(() => {
    if (loading) return;
    if (!user)
      navigate({
        to: "/login",
      });
    else if (roles.includes("super_admin"))
      navigate({
        to: "/super-admin",
      });
    else if (schoolId)
      navigate({
        to: "/dashboard",
      });
  }, [user, loading, schoolId, roles, navigate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
    className: "min-h-screen flex items-center justify-center p-8 bg-background",
    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className:
        "w-full max-w-md space-y-6 bg-card border border-border rounded-2xl p-8 shadow-sm text-center",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
              className: "text-2xl font-semibold tracking-tight",
              children: "Account Pending",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
              className: "text-sm text-muted-foreground mt-4",
              children: [
                "Your account has been created, but you haven't been assigned to a school yet.",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Note:" }),
                " Only platform Super Admins can create new schools. If you are a teacher or staff member, please wait for your school administrator to invite you or assign you to a school.",
              ],
            }),
          ],
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
          onClick: () => signOut(),
          className:
            "mt-6 w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90",
          children: "Sign Out",
        }),
      ],
    }),
  });
}
export { PendingAssignmentPage as component };
