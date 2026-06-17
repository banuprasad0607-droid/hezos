import {
  a0 as Y,
  _ as U,
  X as H,
  x as e,
  P as I,
  M as f,
  N as r,
  b as K,
  c as T,
} from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import { u as V, b as X } from "./platform.functions-De0vHKEw.js";
import { K as G } from "./key-round-B9OZppG8.js";
import { C as $ } from "./copy-BMBYjm5K.js";
import { M as J } from "./mail-BgE7oUjd.js";
import { X as D } from "./x-DH-xwxwM.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function oe() {
  const { currentSchoolId: g, profile: A, roles: b, user: j, loading: O } = Y(),
    d = b.includes("admin") || b.includes("super_admin"),
    E = V(X),
    y = U();
  H("Invite Teachers");
  const [o, N] = a.useState("direct"),
    [c, l] = a.useState(""),
    [m, L] = a.useState([]),
    [P, v] = a.useState(!0),
    [n, w] = a.useState(""),
    [u, _] = a.useState(""),
    [k, x] = a.useState(!1),
    p = async () => {
      v(!0);
      const { data: t, error: s } = await f
        .from("teacher_invitations")
        .select("*")
        .order("created_at", { ascending: !1 });
      (s && r.error(s.message), L(t ?? []), v(!1));
    };
  a.useEffect(() => {
    d && p();
  }, [d]);
  const R = () => {
      const t = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789",
        s = new Uint8Array(12);
      crypto.getRandomValues(s);
      let i = "";
      for (let h = 0; h < s.length; h++) i += t[s[h] % t.length];
      l(i);
    },
    z = async (t) => {
      if ((t.preventDefault(), !(!g || !j))) {
        x(!0);
        try {
          if (o === "direct") {
            if (c.length < 8) {
              (r.error("Password must be at least 8 characters"), x(!1));
              return;
            }
            (await E({
              data: {
                email: n.trim().toLowerCase(),
                full_name: u.trim() || n.split("@")[0],
                password: c,
              },
            }),
              r.success(`Teacher ${n} created. Share the password with them.`));
          } else {
            const { error: s } = await f.from("teacher_invitations").insert({
              school_id: g,
              email: n.trim().toLowerCase(),
              full_name: u.trim() || null,
              invited_by: j.id,
            });
            if (s) throw new Error(s.message);
            r.success(`Invitation created for ${n}`);
          }
          (w(""), _(""), l(""), p());
        } catch (s) {
          r.error(s instanceof Error ? s.message : "Failed");
        } finally {
          x(!1);
        }
      }
    },
    M = async (t) => {
      const { error: s } = await f
        .from("teacher_invitations")
        .update({ revoked_at: new Date().toISOString() })
        .eq("id", t);
      if (s) return r.error(s.message);
      (r.success("Invitation revoked"), p());
    },
    C = (t) => `${window.location.origin}/signup?invite=${t}`,
    S = (t) => {
      (navigator.clipboard.writeText(t), r.success("Copied to clipboard"));
    },
    q = (t) => {
      const s = encodeURIComponent(`You're invited to join ${y} as a Teacher`),
        i = encodeURIComponent(`Hi${t.full_name ? " " + t.full_name : ""},

You've been invited to join as a teacher at ${y}.

Accept your invitation and create your account here:
${C(t.token)}

This link expires on ${new Date(t.expires_at).toLocaleDateString()}.

— ${A?.full_name ?? "Your school admin"}`);
      window.location.href = `mailto:${t.email}?subject=${s}&body=${i}`;
    };
  if (!d)
    return e.jsxs("div", {
      children: [
        e.jsx(I, { title: "Invite Teachers", breadcrumb: "Admin only" }),
        e.jsx("p", {
          className: "text-sm text-muted-foreground",
          children: "You need admin access to invite teachers.",
        }),
      ],
    });
  const F = (t) =>
    t.accepted_at
      ? { label: "Accepted", tone: "bg-success/10 text-success", Icon: K }
      : t.revoked_at
        ? { label: "Revoked", tone: "bg-muted text-muted-foreground", Icon: D }
        : new Date(t.expires_at) < new Date()
          ? { label: "Expired", tone: "bg-muted text-muted-foreground", Icon: T }
          : { label: "Pending", tone: "bg-warning/10 text-warning", Icon: T };
  return e.jsxs("div", {
    children: [
      e.jsx(I, { title: "Teachers", breadcrumb: "Admin" }),
      e.jsxs("div", {
        className: "grid lg:grid-cols-[380px_1fr] gap-6",
        children: [
          e.jsxs("form", {
            onSubmit: z,
            className: "bg-card border border-border rounded-lg p-5 h-fit space-y-4",
            children: [
              e.jsxs("div", {
                children: [
                  e.jsx("h2", { className: "text-sm font-semibold", children: "Add teacher" }),
                  e.jsx("p", {
                    className: "text-xs text-muted-foreground mt-0.5",
                    children: "Create credentials directly, or send a signup invitation.",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "grid grid-cols-2 gap-1 p-1 bg-muted rounded-md",
                children: [
                  e.jsx("button", {
                    type: "button",
                    onClick: () => N("direct"),
                    className: `text-xs py-1.5 rounded ${o === "direct" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`,
                    children: "Create with password",
                  }),
                  e.jsx("button", {
                    type: "button",
                    onClick: () => N("invite"),
                    className: `text-xs py-1.5 rounded ${o === "invite" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`,
                    children: "Send invitation",
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsx("label", { className: "text-xs font-medium", children: "Teacher email" }),
                  e.jsx("input", {
                    type: "email",
                    required: !0,
                    value: n,
                    onChange: (t) => w(t.target.value),
                    placeholder: "teacher@school.edu",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                  }),
                ],
              }),
              e.jsxs("div", {
                children: [
                  e.jsxs("label", {
                    className: "text-xs font-medium",
                    children: ["Full name ", o === "invite" && "(optional)"],
                  }),
                  e.jsx("input", {
                    required: o === "direct",
                    value: u,
                    onChange: (t) => _(t.target.value),
                    placeholder: "Asha Verma",
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring",
                  }),
                ],
              }),
              o === "direct" &&
                e.jsxs("div", {
                  children: [
                    e.jsx("label", {
                      className: "text-xs font-medium",
                      children: "Temporary password",
                    }),
                    e.jsxs("div", {
                      className: "mt-1 flex gap-2",
                      children: [
                        e.jsx("input", {
                          type: "text",
                          required: !0,
                          minLength: 8,
                          value: c,
                          onChange: (t) => l(t.target.value),
                          placeholder: "Min 8 characters",
                          className:
                            "flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono",
                        }),
                        e.jsx("button", {
                          type: "button",
                          onClick: R,
                          className:
                            "px-3 py-2 text-xs border border-border rounded-md hover:bg-muted",
                          children: "Generate",
                        }),
                      ],
                    }),
                    e.jsx("p", {
                      className: "text-xs text-muted-foreground mt-1",
                      children: "Share this with the teacher. They can change it after signing in.",
                    }),
                  ],
                }),
              e.jsx("button", {
                type: "submit",
                disabled: k,
                className:
                  "w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50",
                children: k ? "Creating…" : o === "direct" ? "Create teacher" : "Create invitation",
              }),
            ],
          }),
          e.jsxs("div", {
            className: "bg-card border border-border rounded-lg overflow-hidden",
            children: [
              e.jsxs("div", {
                className: "px-5 py-3 border-b border-border flex items-center justify-between",
                children: [
                  e.jsx("h2", {
                    className: "text-sm font-semibold",
                    children: "Teachers & invitations",
                  }),
                  e.jsxs("span", {
                    className: "text-xs text-muted-foreground",
                    children: [m.length, " total"],
                  }),
                ],
              }),
              P
                ? e.jsx("div", {
                    className: "p-8 text-sm text-muted-foreground",
                    children: "Loading…",
                  })
                : m.length === 0
                  ? e.jsx("div", {
                      className: "p-8 text-sm text-muted-foreground text-center",
                      children: "No invitations yet. Send your first one to onboard a teacher.",
                    })
                  : e.jsx("ul", {
                      className: "divide-y divide-border",
                      children: m.map((t) => {
                        const s = F(t),
                          i =
                            !t.accepted_at && !t.revoked_at && new Date(t.expires_at) >= new Date();
                        return e.jsx(
                          "li",
                          {
                            className: "px-5 py-4",
                            children: e.jsxs("div", {
                              className: "flex items-start justify-between gap-4 flex-wrap",
                              children: [
                                e.jsxs("div", {
                                  className: "min-w-0 flex-1",
                                  children: [
                                    e.jsxs("div", {
                                      className: "flex items-center gap-2 flex-wrap",
                                      children: [
                                        e.jsx("p", {
                                          className: "text-sm font-medium truncate",
                                          children: t.email,
                                        }),
                                        e.jsxs("span", {
                                          className: `inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.tone}`,
                                          children: [
                                            e.jsx(s.Icon, { className: "size-3" }),
                                            s.label,
                                          ],
                                        }),
                                      ],
                                    }),
                                    t.full_name &&
                                      e.jsx("p", {
                                        className: "text-xs text-muted-foreground mt-0.5",
                                        children: t.full_name,
                                      }),
                                    e.jsxs("p", {
                                      className: "text-xs text-muted-foreground mt-1",
                                      children: [
                                        t.accepted_at ? "Joined" : "Expires",
                                        " ",
                                        new Date(
                                          t.accepted_at ?? t.expires_at,
                                        ).toLocaleDateString(),
                                      ],
                                    }),
                                    t.temp_password &&
                                      e.jsxs("div", {
                                        className:
                                          "mt-2 flex items-center gap-2 text-xs bg-muted px-2 py-1.5 rounded-md",
                                        children: [
                                          e.jsx(G, { className: "size-3 text-muted-foreground" }),
                                          e.jsx("span", {
                                            className: "font-mono",
                                            children: t.temp_password,
                                          }),
                                          e.jsx("button", {
                                            type: "button",
                                            onClick: () => S(t.temp_password),
                                            className:
                                              "ml-auto text-muted-foreground hover:text-foreground",
                                            "aria-label": "Copy password",
                                            children: e.jsx($, { className: "size-3" }),
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                i &&
                                  e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      e.jsxs("button", {
                                        onClick: () => S(C(t.token)),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted",
                                        children: [e.jsx($, { className: "size-3" }), " Copy link"],
                                      }),
                                      e.jsxs("button", {
                                        onClick: () => q(t),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90",
                                        children: [e.jsx(J, { className: "size-3" }), " Email"],
                                      }),
                                      e.jsxs("button", {
                                        onClick: () => M(t.id),
                                        className:
                                          "inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted text-muted-foreground",
                                        children: [e.jsx(D, { className: "size-3" }), " Revoke"],
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                          },
                          t.id,
                        );
                      }),
                    }),
            ],
          }),
        ],
      }),
    ],
  });
}
export { oe as component };
