import { r as C, x as e, N as u } from "./index-DrqTZ7SR.js";
import { k as i } from "./vendor-charts-DECNlt_G.js";
import { w as h } from "./notify-CFlpE6Mr.js";
import { X as z } from "./x-DH-xwxwM.js";
import { P as A } from "./phone-BvCyC-cH.js";
import { S } from "./send-DBUz72Lj.js";
const E = [
    [
      "path",
      {
        d: "M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719",
        key: "1sd12s",
      },
    ],
  ],
  b = C("message-circle", E);
function L({
  label: g = "WhatsApp",
  recipients: a,
  defaultMessage: m,
  disabled: j,
  buildMessage: r,
}) {
  const [d, x] = i.useState(!1),
    [f, N] = i.useState(m),
    [v, k] = i.useState({});
  i.useEffect(() => {
    d && N(m);
  }, [d, m]);
  const c = i.useMemo(() => a.filter((s) => h(s.phone, "x")), [a]);
  i.useEffect(() => {
    if (!d) return;
    const s = {};
    (c.forEach((t) => {
      s[t.id] = !0;
    }),
      k(s));
  }, [d, c]);
  const l = c.filter((s) => v[s.id]),
    y = async () => {
      if (l.length === 0) return u.error("No recipients selected");
      let s = 0;
      for (const t of l) {
        const o = r ? r(t) : f,
          n = h(t.phone, o);
        if (!n) continue;
        (window.open(n, "_blank", "noopener,noreferrer") && (s += 1),
          await new Promise((w) => setTimeout(w, 250)));
      }
      s === 0
        ? u.error("Browser blocked pop-ups. Allow pop-ups for this site.")
        : u.success(`Opened ${s} WhatsApp chat${s > 1 ? "s" : ""}`);
    };
  if (a.length === 1) {
    const s = a[0],
      t = r ? r(s) : m,
      o = h(s.phone, t),
      n = j || !o;
    return e.jsxs("a", {
      href: o ?? "#",
      target: "_blank",
      rel: "noreferrer",
      onClick: (p) => {
        n &&
          (p.preventDefault(),
          u.error(s.phone ? "Invalid phone number" : "No parent phone on file"));
      },
      "aria-disabled": n,
      className: `px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 ${n ? "opacity-50 cursor-not-allowed" : ""}`,
      children: [e.jsx(b, { className: "size-4" }), " ", g],
    });
  }
  return e.jsxs(e.Fragment, {
    children: [
      e.jsxs("button", {
        type: "button",
        onClick: () => x(!0),
        disabled: j || a.length === 0,
        className:
          "px-3 py-1.5 text-sm font-medium rounded-md inline-flex items-center gap-1.5 bg-success-soft text-success ring-1 ring-success/30 hover:bg-success/15 disabled:opacity-50",
        children: [e.jsx(b, { className: "size-4" }), " ", g],
      }),
      d &&
        e.jsx("div", {
          className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
          onClick: () => x(!1),
          children: e.jsxs("div", {
            onClick: (s) => s.stopPropagation(),
            className: "bg-card rounded-xl w-full max-w-lg shadow-lg max-h-[90vh] flex flex-col",
            children: [
              e.jsxs("div", {
                className: "p-5 border-b border-border flex items-center justify-between",
                children: [
                  e.jsxs("div", {
                    children: [
                      e.jsxs("h2", {
                        className: "font-semibold text-base flex items-center gap-2",
                        children: [
                          e.jsx(b, { className: "size-4 text-success" }),
                          " WhatsApp Broadcast",
                        ],
                      }),
                      e.jsxs("p", {
                        className: "text-xs text-muted-foreground mt-0.5",
                        children: [c.length, " of ", a.length, " parents have valid numbers"],
                      }),
                    ],
                  }),
                  e.jsx("button", {
                    onClick: () => x(!1),
                    className:
                      "size-8 rounded-md hover:bg-secondary inline-flex items-center justify-center",
                    children: e.jsx(z, { className: "size-4" }),
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "p-5 space-y-3 border-b border-border",
                children: [
                  e.jsx("label", {
                    className:
                      "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                    children: "Message",
                  }),
                  e.jsx("textarea", {
                    value: f,
                    onChange: (s) => N(s.target.value),
                    rows: 3,
                    className:
                      "w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                  }),
                  r &&
                    e.jsx("p", {
                      className: "text-[10px] text-muted-foreground",
                      children:
                        "Per-recipient details (like the student's name) are appended automatically.",
                    }),
                ],
              }),
              e.jsx("div", {
                className: "flex-1 overflow-y-auto p-2",
                children:
                  c.length === 0
                    ? e.jsxs("div", {
                        className: "p-8 text-center text-sm text-muted-foreground",
                        children: [
                          e.jsx(A, { className: "size-8 mx-auto mb-2 opacity-50" }),
                          "No parent phone numbers on file. Add them on the Students page.",
                        ],
                      })
                    : e.jsx("ul", {
                        className: "divide-y divide-border",
                        children: c.map((s) => {
                          const t = r ? r(s) : f,
                            o = h(s.phone, t);
                          return e.jsxs(
                            "li",
                            {
                              className: "flex items-center gap-3 px-3 py-2",
                              children: [
                                e.jsx("input", {
                                  type: "checkbox",
                                  checked: !!v[s.id],
                                  onChange: (n) => k((p) => ({ ...p, [s.id]: n.target.checked })),
                                  className: "size-4",
                                }),
                                e.jsxs("div", {
                                  className: "flex-1 min-w-0",
                                  children: [
                                    e.jsx("p", {
                                      className: "text-sm font-medium truncate",
                                      children: s.name,
                                    }),
                                    e.jsxs("p", {
                                      className: "text-[11px] text-muted-foreground truncate",
                                      children: [s.subtitle ? `${s.subtitle} · ` : "", s.phone],
                                    }),
                                  ],
                                }),
                                o &&
                                  e.jsx("a", {
                                    href: o,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className: "text-xs text-success font-semibold hover:underline",
                                    children: "Open",
                                  }),
                              ],
                            },
                            s.id,
                          );
                        }),
                      }),
              }),
              e.jsxs("div", {
                className: "p-4 border-t border-border flex items-center justify-between gap-3",
                children: [
                  e.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [l.length, " selected"],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2",
                    children: [
                      e.jsx("button", {
                        onClick: () => x(!1),
                        className: "px-3 py-2 text-sm border border-border rounded-md",
                        children: "Close",
                      }),
                      e.jsxs("button", {
                        onClick: y,
                        disabled: l.length === 0,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-success text-white rounded-md inline-flex items-center gap-1 disabled:opacity-50",
                        children: [
                          e.jsx(S, { className: "size-4" }),
                          " Open ",
                          l.length,
                          " chat",
                          l.length === 1 ? "" : "s",
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { L as W };
