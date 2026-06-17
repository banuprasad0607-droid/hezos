import { a0 as R, X, M as l, x as e, P as J, d as K, D as Q, N as q } from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import { W as V } from "./WhatsAppBroadcast-DN6Mi9QW.js";
import { w as z } from "./whatsapp-service-BVS3HosY.js";
import { F as A } from "./file-text-DPnrzn5L.js";
import { I as Y } from "./image-B4nE_AY0.js";
import { C as Z } from "./calendar-DZf17yvJ.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
import "./notify-CFlpE6Mr.js";
import "./x-DH-xwxwM.js";
import "./phone-BvCyC-cH.js";
import "./send-DBUz72Lj.js";
function pe() {
  const { currentSchoolId: n, user: f, loading: N } = R(),
    d = n;
  X("Homework");
  const [b, F] = a.useState([]),
    [y, L] = a.useState([]),
    [M, U] = a.useState([]),
    [O, u] = a.useState(!1),
    [w, v] = a.useState(!1),
    [i, _] = a.useState(""),
    [g, k] = a.useState(""),
    [h, C] = a.useState(""),
    [S, D] = a.useState(""),
    [j, P] = a.useState(""),
    [p, $] = a.useState(null),
    I = async () => {
      if (!n) return;
      const { data: s } = await l
        .from("homework")
        .select(
          "id, class_id, title, subject, description, due_date, file_url, file_type, created_at, classes(name)",
        )
        .eq("school_id", n)
        .order("created_at", { ascending: !1 });
      L(
        (s ?? []).map((t) => ({
          ...t,
          classes: Array.isArray(t.classes) ? (t.classes[0] ?? null) : t.classes,
        })),
      );
    };
  a.useEffect(() => {
    n &&
      (l
        .from("classes")
        .select("id, name")
        .eq("school_id", n)
        .order("name")
        .then(({ data: s }) => {
          (F(s ?? []), s?.[0] && !i && _(s[0].id));
        }),
      l
        .from("students")
        .select("id, full_name, class_id, parent_name, parent_phone")
        .eq("school_id", n)
        .then(({ data: s }) => U(s ?? [])),
      I());
  }, [n]);
  const W = (s) =>
      M.filter((t) => t.class_id === s).map((t) => ({
        id: t.id,
        name: t.parent_name || `${t.full_name}'s parent`,
        phone: t.parent_phone,
        subtitle: t.full_name,
      })),
    B = async (s) => {
      if ((s.preventDefault(), !(!d || !f || !i))) {
        v(!0);
        try {
          let t = null,
            T = "none";
          if (p) {
            const r = p.name.split(".").pop()?.toLowerCase() ?? "",
              H = ["png", "jpg", "jpeg", "webp", "gif"].includes(r),
              c = r === "pdf";
            if (!H && !c) throw new Error("Only PDF or image files are allowed");
            const o = `${d}/${f.id}/${Date.now()}-${p.name}`,
              { error: x } = await l.storage.from("homework-files").upload(o, p);
            if (x) throw x;
            const { data: m } = l.storage.from("homework-files").getPublicUrl(o);
            ((t = m.publicUrl), (T = c ? "pdf" : "image"));
          }
          const { error: E } = await l.from("homework").insert({
            school_id: d,
            class_id: i,
            teacher_id: f.id,
            title: g,
            subject: h || null,
            description: S || null,
            due_date: j || null,
            file_url: t,
            file_type: T,
          });
          if (E) throw E;
          ((async () => {
            try {
              const { data: r } = await l
                .from("students")
                .select("id, full_name, parent_user_id, emergency_contact")
                .eq("class_id", i);
              if (r && r.length > 0) {
                const c = (await z.getTemplates(d)).find((o) => o.name === "homework_alert");
                if (c) {
                  const { data: o } = await l.from("classes").select("name").eq("id", i).single(),
                    x = o?.name || "Class";
                  for (const m of r) {
                    const G = m.emergency_contact || "+91 90000 00000";
                    await z.sendTemplateMessage(
                      d,
                      G,
                      c.id,
                      [x, h || "General", g, j || "Tomorrow"],
                      m.id,
                      m.parent_user_id,
                    );
                  }
                }
              }
            } catch (r) {
              console.error("WhatsApp homework alert failed:", r);
            }
          })(),
            q.success("Homework posted. Parents are notified."),
            u(!1),
            k(""),
            C(""),
            D(""),
            P(""),
            $(null),
            I());
        } catch (t) {
          q.error(t instanceof Error ? t.message : String(t));
        } finally {
          v(!1);
        }
      }
    };
  return N
    ? N
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
          e.jsx(J, {
            title: "Homework",
            breadcrumb: "Operations",
            actions: e.jsxs("button", {
              onClick: () => u(!0),
              disabled: b.length === 0,
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50",
              children: [e.jsx(K, { className: "size-4" }), " Create Homework"],
            }),
          }),
          e.jsx("div", {
            className: "flex-1 overflow-y-auto p-8",
            children:
              y.length === 0
                ? e.jsxs("div", {
                    className:
                      "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                    children: [
                      e.jsx(A, { className: "size-10 mx-auto text-muted-foreground" }),
                      e.jsx("h3", { className: "font-semibold mt-3", children: "No homework yet" }),
                      e.jsx("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children:
                          b.length === 0 ? "Create a class first." : "Post your first assignment.",
                      }),
                    ],
                  })
                : e.jsx("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: y.map((s) =>
                      e.jsxs(
                        "article",
                        {
                          className: "bg-card border border-border rounded-xl p-5",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-start justify-between gap-3",
                              children: [
                                e.jsxs("div", {
                                  className: "min-w-0",
                                  children: [
                                    e.jsxs("div", {
                                      className:
                                        "flex items-center gap-2 text-[10px] uppercase tracking-wider font-bold text-muted-foreground",
                                      children: [
                                        e.jsx("span", { children: s.subject ?? "General" }),
                                        e.jsx("span", { children: "·" }),
                                        e.jsx("span", { children: s.classes?.name }),
                                      ],
                                    }),
                                    e.jsx("h3", {
                                      className: "font-semibold text-base mt-1 truncate",
                                      children: s.title,
                                    }),
                                  ],
                                }),
                                s.file_type !== "none" &&
                                  e.jsxs("span", {
                                    className:
                                      "shrink-0 inline-flex items-center gap-1 text-xs bg-brand-soft text-brand px-2 py-1 rounded",
                                    children: [
                                      s.file_type === "pdf"
                                        ? e.jsx(A, { className: "size-3" })
                                        : e.jsx(Y, { className: "size-3" }),
                                      s.file_type.toUpperCase(),
                                    ],
                                  }),
                              ],
                            }),
                            s.description &&
                              e.jsx("p", {
                                className: "text-sm text-muted-foreground mt-2 line-clamp-3",
                                children: s.description,
                              }),
                            e.jsxs("div", {
                              className: "flex items-center justify-between mt-4",
                              children: [
                                e.jsxs("div", {
                                  className:
                                    "text-xs text-muted-foreground inline-flex items-center gap-1",
                                  children: [
                                    e.jsx(Z, { className: "size-3" }),
                                    s.due_date ? `Due ${s.due_date}` : "No due date",
                                  ],
                                }),
                                s.file_url &&
                                  e.jsxs("a", {
                                    href: s.file_url,
                                    target: "_blank",
                                    rel: "noreferrer",
                                    className:
                                      "text-xs text-brand font-medium inline-flex items-center gap-1 hover:underline",
                                    children: [e.jsx(Q, { className: "size-3" }), " Download"],
                                  }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "mt-3 pt-3 border-t border-border flex justify-end",
                              children: e.jsx(V, {
                                label: "Notify parents",
                                recipients: W(s.class_id),
                                defaultMessage: `📚 New homework: ${s.title}${s.subject ? ` (${s.subject})` : ""}
${s.description ?? ""}${
                                  s.due_date
                                    ? `
Due: ${s.due_date}`
                                    : ""
                                }${
                                  s.file_url
                                    ? `
Attachment: ${s.file_url}`
                                    : ""
                                }`,
                              }),
                            }),
                          ],
                        },
                        s.id,
                      ),
                    ),
                  }),
          }),
          O &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
              onClick: () => u(!1),
              children: e.jsxs("form", {
                onClick: (s) => s.stopPropagation(),
                onSubmit: B,
                className:
                  "bg-card rounded-xl p-6 w-full max-w-lg space-y-4 shadow-lg max-h-[90vh] overflow-y-auto",
                children: [
                  e.jsx("h2", { className: "font-semibold text-lg", children: "Create Homework" }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", { className: "text-sm font-medium", children: "Class *" }),
                          e.jsx("select", {
                            required: !0,
                            value: i,
                            onChange: (s) => _(s.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                            children: b.map((s) =>
                              e.jsx("option", { value: s.id, children: s.name }, s.id),
                            ),
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", { className: "text-sm font-medium", children: "Subject" }),
                          e.jsx("input", {
                            value: h,
                            onChange: (s) => C(s.target.value),
                            placeholder: "Mathematics",
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", { className: "text-sm font-medium", children: "Title *" }),
                      e.jsx("input", {
                        required: !0,
                        value: g,
                        onChange: (s) => k(s.target.value),
                        placeholder: "Algebraic Expressions Ex 4.2",
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", { className: "text-sm font-medium", children: "Description" }),
                      e.jsx("textarea", {
                        value: S,
                        onChange: (s) => D(s.target.value),
                        rows: 3,
                        className:
                          "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Due date",
                          }),
                          e.jsx("input", {
                            type: "date",
                            value: j,
                            onChange: (s) => P(s.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Attach (PDF or image)",
                          }),
                          e.jsx("input", {
                            type: "file",
                            accept: ".pdf,image/*",
                            onChange: (s) => $(s.target.files?.[0] ?? null),
                            className: "mt-1 w-full text-sm",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end pt-2",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => u(!1),
                        className: "px-4 py-2 text-sm font-medium border border-border rounded-md",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: w,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                        children: w ? "Posting…" : "Post Homework",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
}
export { pe as component };
