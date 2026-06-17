import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { Q as KeyRound } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
function ChangePasswordPage() {
  const navigate = useNavigate();
  usePageTitle("Change Password");
  const [pwd, setPwd] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [submitting, setSubmitting] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (pwd !== confirm) return toast.error("Passwords do not match");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({
      password: pwd,
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd("");
    setConfirm("");
    navigate({
      to: "/dashboard",
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Change password",
        breadcrumb: "Account",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "p-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
          onSubmit: submit,
          className: "max-w-md bg-card border border-border rounded-xl p-6 space-y-4",
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                      className: "font-semibold",
                      children: "Update your password",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground",
                      children: "Use at least 8 characters.",
                    }),
                  ],
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                  className: "text-xs font-medium text-muted-foreground",
                  children: "New password",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                  type: "password",
                  required: true,
                  minLength: 8,
                  value: pwd,
                  onChange: (e) => setPwd(e.target.value),
                  className:
                    "mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                  className: "text-xs font-medium text-muted-foreground",
                  children: "Confirm password",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                  type: "password",
                  required: true,
                  minLength: 8,
                  value: confirm,
                  onChange: (e) => setConfirm(e.target.value),
                  className:
                    "mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand",
                }),
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              type: "submit",
              disabled: submitting,
              className:
                "w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50",
              children: submitting ? "Updating…" : "Update password",
            }),
          ],
        }),
      }),
    ],
  });
}
export { ChangePasswordPage as component };
