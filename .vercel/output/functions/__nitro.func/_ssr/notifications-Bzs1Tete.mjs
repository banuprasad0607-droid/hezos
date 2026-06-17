import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { u as useAuth, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  m as CheckCheck,
  e as Bell,
  at as Wallet,
  W as Megaphone,
  Y as MessageSquare,
  i as CalendarCheck,
  f as BookOpen,
} from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__react-router.mjs";
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
const ICON = {
  homework: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 text-brand" }),
  attendance: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, {
    className: "size-4 text-success",
  }),
  remark: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, {
    className: "size-4 text-warning",
  }),
  announcement: /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, {
    className: "size-4 text-brand",
  }),
  fee: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4 text-danger" }),
};
function NotificationsPage() {
  const { user } = useAuth();
  usePageTitle("Notifications");
  const [items, setItems] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      })
      .limit(100)
      .then(({ data }) => setItems(data ?? []));
    const ch = supabase
      .channel(`notif-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => setItems((p) => [payload.new, ...p]),
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(ch);
    };
  }, [user]);
  const markAllRead = async () => {
    if (!user) return;
    await supabase
      .from("notifications")
      .update({
        read_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .is("read_at", null);
    setItems((p) =>
      p.map((n) => ({
        ...n,
        read_at: n.read_at ?? /* @__PURE__ */ new Date().toISOString(),
      })),
    );
  };
  const markRead = async (id) => {
    await supabase
      .from("notifications")
      .update({
        read_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("id", id);
    setItems((p) =>
      p.map((n) =>
        n.id === id
          ? {
              ...n,
              read_at: /* @__PURE__ */ new Date().toISOString(),
            }
          : n,
      ),
    );
  };
  const unread = items.filter((n) => !n.read_at).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Notifications",
        breadcrumb: `${unread} unread`,
        actions:
          unread > 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                onClick: markAllRead,
                className:
                  "px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "size-4" }),
                  " Mark all read",
                ],
              })
            : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 overflow-y-auto p-8",
        children:
          items.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, {
                    className: "size-10 mx-auto text-muted-foreground",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "font-semibold mt-3",
                    children: "You're all caught up",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children:
                      "New homework, remarks, fees and announcements appear here in real time.",
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "bg-card border border-border rounded-xl divide-y divide-border",
                children: items.map((n) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      onClick: () => markRead(n.id),
                      className: `p-4 flex gap-4 cursor-pointer hover:bg-secondary/40 ${!n.read_at ? "bg-brand/5" : ""}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "size-9 rounded-full bg-secondary flex items-center justify-center shrink-0",
                          children:
                            ICON[n.type] ??
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, {
                              className: "size-4 text-muted-foreground",
                            }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex-1 min-w-0",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex items-baseline justify-between gap-3",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-sm font-semibold truncate",
                                  children: n.title,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                  className: "text-[10px] text-muted-foreground whitespace-nowrap",
                                  children: new Date(n.created_at).toLocaleString(),
                                }),
                              ],
                            }),
                            n.body &&
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children: n.body,
                              }),
                          ],
                        }),
                        !n.read_at &&
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "size-2 rounded-full bg-brand mt-2",
                          }),
                      ],
                    },
                    n.id,
                  ),
                ),
              }),
      }),
    ],
  });
}
export { NotificationsPage as component };
