import { V as u, X as f, M as i, x as e, P as p, B as c, a as h } from "./index-DrqTZ7SR.js";
import { k as l } from "./vendor-charts-DECNlt_G.js";
import { C as b } from "./check-check-Cg-Ku-yC.js";
import { W as g } from "./wallet-CZbtwORR.js";
import { M as N } from "./megaphone-DiOQmrUf.js";
import { M as j } from "./message-square-BVAiuQO7.js";
import { C as w } from "./calendar-check-DuiRifj2.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const k = {
  homework: e.jsx(h, { className: "size-4 text-brand" }),
  attendance: e.jsx(w, { className: "size-4 text-success" }),
  remark: e.jsx(j, { className: "size-4 text-warning" }),
  announcement: e.jsx(N, { className: "size-4 text-brand" }),
  fee: e.jsx(g, { className: "size-4 text-danger" }),
};
function q() {
  const { user: t } = u();
  f("Notifications");
  const [o, n] = l.useState([]);
  l.useEffect(() => {
    if (!t) return;
    i.from("notifications")
      .select("*")
      .eq("user_id", t.id)
      .order("created_at", { ascending: !1 })
      .limit(100)
      .then(({ data: s }) => n(s ?? []));
    const a = i
      .channel(`notif-${t.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${t.id}` },
        (s) => n((r) => [s.new, ...r]),
      )
      .subscribe();
    return () => {
      i.removeChannel(a);
    };
  }, [t]);
  const m = async () => {
      t &&
        (await i
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("user_id", t.id)
          .is("read_at", null),
        n((a) => a.map((s) => ({ ...s, read_at: s.read_at ?? new Date().toISOString() }))));
    },
    x = async (a) => {
      (await i.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", a),
        n((s) => s.map((r) => (r.id === a ? { ...r, read_at: new Date().toISOString() } : r))));
    },
    d = o.filter((a) => !a.read_at).length;
  return e.jsxs(e.Fragment, {
    children: [
      e.jsx(p, {
        title: "Notifications",
        breadcrumb: `${d} unread`,
        actions:
          d > 0
            ? e.jsxs("button", {
                onClick: m,
                className:
                  "px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1",
                children: [e.jsx(b, { className: "size-4" }), " Mark all read"],
              })
            : null,
      }),
      e.jsx("div", {
        className: "flex-1 overflow-y-auto p-8",
        children:
          o.length === 0
            ? e.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  e.jsx(c, { className: "size-10 mx-auto text-muted-foreground" }),
                  e.jsx("h3", {
                    className: "font-semibold mt-3",
                    children: "You're all caught up",
                  }),
                  e.jsx("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children:
                      "New homework, remarks, fees and announcements appear here in real time.",
                  }),
                ],
              })
            : e.jsx("div", {
                className: "bg-card border border-border rounded-xl divide-y divide-border",
                children: o.map((a) =>
                  e.jsxs(
                    "div",
                    {
                      onClick: () => x(a.id),
                      className: `p-4 flex gap-4 cursor-pointer hover:bg-secondary/40 ${a.read_at ? "" : "bg-brand/5"}`,
                      children: [
                        e.jsx("div", {
                          className:
                            "size-9 rounded-full bg-secondary flex items-center justify-center shrink-0",
                          children:
                            k[a.type] ?? e.jsx(c, { className: "size-4 text-muted-foreground" }),
                        }),
                        e.jsxs("div", {
                          className: "flex-1 min-w-0",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-baseline justify-between gap-3",
                              children: [
                                e.jsx("p", {
                                  className: "text-sm font-semibold truncate",
                                  children: a.title,
                                }),
                                e.jsx("span", {
                                  className: "text-[10px] text-muted-foreground whitespace-nowrap",
                                  children: new Date(a.created_at).toLocaleString(),
                                }),
                              ],
                            }),
                            a.body &&
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground mt-0.5",
                                children: a.body,
                              }),
                          ],
                        }),
                        !a.read_at &&
                          e.jsx("span", { className: "size-2 rounded-full bg-brand mt-2" }),
                      ],
                    },
                    a.id,
                  ),
                ),
              }),
      }),
    ],
  });
}
export { q as component };
