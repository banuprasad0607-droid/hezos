import { a0 as P, X as q, M as d, x as e, P as B, d as I, N } from "./index-DrqTZ7SR.js";
import { k as t } from "./vendor-charts-DECNlt_G.js";
import { W as E } from "./WhatsAppBroadcast-DN6Mi9QW.js";
import { M as L } from "./megaphone-DiOQmrUf.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
import "./notify-CFlpE6Mr.js";
import "./x-DH-xwxwM.js";
import "./phone-BvCyC-cH.js";
import "./send-DBUz72Lj.js";
function X() {
  const { currentSchoolId: n, user: l, loading: i } = P();
  q("Announcements");
  const [v, w] = t.useState([]),
    [c, _] = t.useState([]),
    [m, S] = t.useState([]),
    [k, o] = t.useState(!1),
    [u, x] = t.useState(!1),
    [p, f] = t.useState(""),
    [b, h] = t.useState(""),
    [g, j] = t.useState(""),
    y = async () => {
      if (!n) return;
      const { data: s } = await d
        .from("announcements")
        .select("id, title, body, created_at, class_id, classes(name)")
        .eq("school_id", n)
        .order("created_at", { ascending: !1 });
      _(
        (s ?? []).map((r) => ({
          ...r,
          classes: Array.isArray(r.classes) ? (r.classes[0] ?? null) : r.classes,
        })),
      );
    };
  t.useEffect(() => {
    n &&
      (d
        .from("classes")
        .select("id, name")
        .eq("school_id", n)
        .order("name")
        .then(({ data: s }) => w(s ?? [])),
      d
        .from("students")
        .select("id, full_name, class_id, parent_name, parent_phone")
        .eq("school_id", n)
        .then(({ data: s }) => S(s ?? [])),
      y());
  }, [n]);
  const C = (s) =>
      (s ? m.filter((a) => a.class_id === s) : m).map((a) => ({
        id: a.id,
        name: a.parent_name || `${a.full_name}'s parent`,
        phone: a.parent_phone,
        subtitle: a.full_name,
      })),
    A = async (s) => {
      if ((s.preventDefault(), !n || !l)) return;
      x(!0);
      const { error: r } = await d
        .from("announcements")
        .insert({ school_id: n, class_id: g || null, title: p, body: b, created_by: l.id });
      if ((x(!1), r)) return N.error(r.message);
      (N.success("Announcement sent"), o(!1), f(""), h(""), j(""), y());
    };
  return i
    ? i
      ? e.jsx("div", {
          className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
          children: e.jsxs("div", {
            className: "text-center space-y-4",
            children: [
              e.jsx("div", {
                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
              }),
              e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }),
            ],
          }),
        })
      : e.jsx("div", {
          className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
          children: e.jsxs("div", {
            className: "text-center space-y-4",
            children: [
              e.jsx("div", {
                className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
              }),
              e.jsx("p", { className: "text-sm text-muted-foreground", children: "Loading..." }),
            ],
          }),
        })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx(B, {
            title: "Announcements",
            breadcrumb: "Communication",
            actions: e.jsxs("button", {
              onClick: () => o(!0),
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1",
              children: [e.jsx(I, { className: "size-4" }), " New Announcement"],
            }),
          }),
          e.jsx("div", {
            className: "flex-1 overflow-y-auto p-8",
            children:
              c.length === 0
                ? e.jsxs("div", {
                    className:
                      "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                    children: [
                      e.jsx(L, { className: "size-10 mx-auto text-muted-foreground" }),
                      e.jsx("h3", {
                        className: "font-semibold mt-3",
                        children: "No announcements yet",
                      }),
                      e.jsx("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: "Post school-wide notices or target a single class.",
                      }),
                    ],
                  })
                : e.jsx("div", {
                    className: "space-y-4",
                    children: c.map((s) =>
                      e.jsx(
                        "article",
                        {
                          className: "bg-card border border-border rounded-xl p-5",
                          children: e.jsxs("div", {
                            className: "flex items-start justify-between gap-3",
                            children: [
                              e.jsxs("div", {
                                className: "min-w-0",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground",
                                    children: [
                                      e.jsx("span", { children: s.classes?.name ?? "School-wide" }),
                                      e.jsx("span", { children: "·" }),
                                      e.jsx("span", {
                                        children: new Date(s.created_at).toLocaleString(),
                                      }),
                                    ],
                                  }),
                                  e.jsx("h3", {
                                    className: "font-semibold mt-1",
                                    children: s.title,
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "text-sm text-muted-foreground mt-1 whitespace-pre-wrap",
                                    children: s.body,
                                  }),
                                ],
                              }),
                              e.jsx(E, {
                                label: "Broadcast",
                                recipients: C(s.class_id),
                                defaultMessage: `📢 ${s.title}

${s.body}

— ${s.classes?.name ?? "School"} announcement`,
                              }),
                            ],
                          }),
                        },
                        s.id,
                      ),
                    ),
                  }),
          }),
          k &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
              onClick: () => o(!1),
              children: e.jsxs("form", {
                onClick: (s) => s.stopPropagation(),
                onSubmit: A,
                className: "bg-card rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
                children: [
                  e.jsx("h2", { className: "font-semibold text-lg", children: "New Announcement" }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", { className: "text-sm font-medium", children: "Send to" }),
                      e.jsxs("select", {
                        value: g,
                        onChange: (s) => j(s.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                        children: [
                          e.jsx("option", { value: "", children: "Entire school" }),
                          v.map((s) =>
                            e.jsxs("option", { value: s.id, children: [s.name, " only"] }, s.id),
                          ),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", { className: "text-sm font-medium", children: "Title *" }),
                      e.jsx("input", {
                        required: !0,
                        value: p,
                        onChange: (s) => f(s.target.value),
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", { className: "text-sm font-medium", children: "Body *" }),
                      e.jsx("textarea", {
                        required: !0,
                        value: b,
                        onChange: (s) => h(s.target.value),
                        rows: 4,
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => o(!1),
                        className: "px-4 py-2 text-sm font-medium border border-border rounded-md",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: u,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                        children: u ? "Sending…" : "Send",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
}
export { X as component };
