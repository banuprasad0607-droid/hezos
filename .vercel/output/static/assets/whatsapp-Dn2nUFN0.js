import {
  r as G,
  a0 as rs,
  X as ns,
  M as os,
  N as d,
  x as e,
  P as ds,
  k as ls,
  S as is,
  G as cs,
  a as us,
  c as xs,
} from "./index-DrqTZ7SR.js";
import { k as a } from "./vendor-charts-DECNlt_G.js";
import { w as l } from "./whatsapp-service-BVS3HosY.js";
import { M as ke } from "./message-square-BVAiuQO7.js";
import { C as ms } from "./chart-column-CibMTFTI.js";
import { M as ps } from "./megaphone-DiOQmrUf.js";
import { F as gs } from "./file-text-DPnrzn5L.js";
import { S as fs } from "./settings-BWufD4OP.js";
import { U as bs } from "./user-check-CmmF2Gzq.js";
import { C as O } from "./check-check-Cg-Ku-yC.js";
import { C as hs } from "./check-oRz9qccl.js";
import { S as Y } from "./send-DBUz72Lj.js";
import { C as vs } from "./calendar-DZf17yvJ.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const js = [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }],
  ],
  Se = G("bot", js);
const ys = [
    ["line", { x1: "12", x2: "12", y1: "2", y2: "22", key: "7eqyqh" }],
    ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", key: "1b0p4s" }],
  ],
  Ns = G("dollar-sign", ys);
const ws = [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }],
  ],
  _s = G("info", ws),
  _ = os;
function Us() {
  const { currentSchoolId: r, roles: Cs, user: C, loading: Te } = rs();
  ns("WhatsApp Inbox");
  const [f, Ae] = a.useState("inbox"),
    [Ie, j] = a.useState(!0),
    [ks, Me] = a.useState(null),
    [x, Pe] = a.useState([]),
    [K, Re] = a.useState([]),
    [Q, k] = a.useState([]),
    [Z, F] = a.useState([]),
    [Le, ze] = a.useState([]),
    [J, $e] = a.useState([]),
    [g, qe] = a.useState([]),
    [u, X] = a.useState({
      sent: 0,
      delivered: 0,
      read: 0,
      failed: 0,
      inbound: 0,
      aiAnswered: 0,
      openConversations: 0,
      resolutionRate: 0,
      avgResponseTimeMin: 0,
    }),
    [n, S] = a.useState(null),
    [T, ee] = a.useState(""),
    [A, se] = a.useState(""),
    [De, B] = a.useState(!1),
    [Fe, W] = a.useState(!1),
    [b, Be] = a.useState("all"),
    [I, We] = a.useState(""),
    [y, te] = a.useState(""),
    [p, Ue] = a.useState("all_parents"),
    [U, Ee] = a.useState(""),
    [ae, He] = a.useState(""),
    [m, re] = a.useState(""),
    [E, ne] = a.useState([]),
    [oe, N] = a.useState(!1),
    [M, de] = a.useState(""),
    [le, Ve] = a.useState("UTILITY"),
    [w, ie] = a.useState(""),
    [ce, H] = a.useState(!1),
    [P, ue] = a.useState("meta"),
    [xe, me] = a.useState(""),
    [pe, ge] = a.useState(""),
    [fe, be] = a.useState(""),
    [he, ve] = a.useState(""),
    [je, ye] = a.useState(!1),
    [Ne, V] = a.useState(!1),
    [R, Oe] = a.useState(""),
    [Ye, L] = a.useState(!1),
    h = a.useCallback(async () => {
      if (r) {
        j(!0);
        try {
          const s = await l.getSettings(r);
          s &&
            (Me(s),
            ue(s.provider),
            me(s.api_key || ""),
            ge(s.phone_number_id || ""),
            be(s.whatsapp_business_account_id || ""),
            ve(s.sender_number || ""),
            ye(s.is_active));
          const t = await l.getTemplates(r);
          (Pe(t), t.length > 0 && !m && re(t[0].id));
          const o = await l.getCampaigns(r);
          Re(o);
          const c = await l.getConversations(r);
          k(c);
          const { data: v } = await _.from("profiles")
            .select("user_id, full_name, designation")
            .eq("school_id", r);
          ze(v || []);
          const { data: $ } = await _.from("classes")
            .select("id, name, section")
            .eq("school_id", r);
          $e($ || []);
          const { data: i } = await _.from("students")
            .select("id, full_name, class_id, roll_number, parent_user_id, parent_email")
            .eq("school_id", r);
          qe(i || []);
          const q = await l.getAnalytics(r);
          (X(q), j(!1));
        } catch (s) {
          (d.error("Failed to load WhatsApp data: " + s.message), j(!1));
        }
      }
    }, [r]);
  (a.useEffect(() => {
    h();
  }, [h]),
    a.useEffect(() => {
      if (!r || !n) return;
      (async () => {
        try {
          const t = await l.getMessages(r, n.id);
          F(t);
        } catch (t) {
          d.error("Failed to load message thread: " + t.message);
        }
      })();
    }, [n, r]));
  const Ge = async () => {
      if (r) {
        j(!0);
        try {
          await l.saveSettings(r, {
            provider: "meta",
            api_key: "EAAG3tYZBZC8wBA...",
            phone_number_id: "105658822479634",
            whatsapp_business_account_id: "109865489812652",
            sender_number: "+15550100456",
            is_active: !0,
          });
          const s = [
            {
              name: "absent_alert",
              category: "UTILITY",
              language: "en",
              body_text:
                "Dear Parent, your child {{1}} was marked ABSENT today. Please check the attendance panel or submit a leave request if required.",
              status: "approved",
              variables: ["student_name"],
            },
            {
              name: "homework_alert",
              category: "UTILITY",
              language: "en",
              body_text: "New homework assigned for Class {{1}} ({{2}}): {{3}}. Due on {{4}}.",
              status: "approved",
              variables: ["class_name", "subject", "homework_title", "due_date"],
            },
            {
              name: "fee_due_reminder",
              category: "UTILITY",
              language: "en",
              body_text:
                "Fee Reminder: A pending fee of {{1}} is due for {{2}} by {{3}}. Pay online at {{4}} to avoid late fines.",
              status: "approved",
              variables: ["amount", "student_name", "due_date", "payment_link"],
            },
            {
              name: "exam_result_notification",
              category: "UTILITY",
              language: "en",
              body_text:
                "Dear Parent, exam results for {{1}} are published. Total Score: {{2}}%. Please review report cards on the parent dashboard.",
              status: "approved",
              variables: ["student_name", "percentage"],
            },
          ];
          for (const o of s) await l.createTemplate(r, o);
          (g[0] &&
            (await l.mockInboundMessage(
              r,
              "+91 98765 43210",
              "Sanjay Kumar (Parent)",
              "Hi, is Rohan present today?",
            )),
            d.success(
              "Successfully seeded default WhatsApp templates and configured Sandbox settings!",
            ),
            h());
        } catch (s) {
          (d.error("Auto provision failed: " + s.message), j(!1));
        }
      }
    },
    we = async () => {
      if (!(!r || !n || !T.trim() || !C)) {
        B(!0);
        try {
          (await l.sendChatMessage(r, n.id, T.trim(), C.id), ee(""));
          const s = await l.getMessages(r, n.id);
          (F(s), B(!1));
        } catch (s) {
          (d.error("Failed to send message: " + s.message), B(!1));
        }
      }
    },
    Ke = async () => {
      if (!(!r || !n || !A.trim())) {
        W(!0);
        try {
          (await l.mockInboundMessage(r, n.parent_phone, n.parent_name, A.trim()), se(""));
          const s = await l.getMessages(r, n.id);
          F(s);
          const t = await l.getConversations(r);
          k(t);
          const o = t.find((v) => v.id === n.id);
          o && S(o);
          const c = await l.getAnalytics(r);
          (X(c), d.success("Mock parent reply and AI auto-response logged successfully!"), W(!1));
        } catch (s) {
          (d.error("Mock failed: " + s.message), W(!1));
        }
      }
    },
    Qe = async (s) => {
      if (n)
        try {
          await l.assignConversation(n.id, s);
          const t = await l.getConversations(r);
          k(t);
          const o = t.find((c) => c.id === n.id);
          (o && S(o), d.success("Conversation assignment updated."));
        } catch (t) {
          d.error("Failed to assign: " + t.message);
        }
    },
    Ze = async (s) => {
      if (n)
        try {
          await l.updateConversationStatus(n.id, s);
          const t = await l.getConversations(r);
          k(t);
          const o = t.find((c) => c.id === n.id);
          (o && S(o), d.success(`Status updated to ${s}.`));
        } catch (t) {
          d.error("Failed to update status: " + t.message);
        }
    },
    Je = async () => {
      if (r) {
        if (!y.trim() || !m) {
          d.error("Please fill campaign name and choose a template.");
          return;
        }
        N(!0);
        try {
          const s = x.find((i) => i.id === m);
          if (!s) throw new Error("Template not found");
          if (E.length < s.variables.length) {
            (d.error(
              `Please provide mappings for all template variables (needs ${s.variables.length} values).`,
            ),
              N(!1));
            return;
          }
          const t = await l.createCampaign(r, {
            name: y.trim(),
            template_id: m,
            target_type: p,
            target_class_id: p === "class" ? U : null,
            total_messages: 0,
          });
          let o = [];
          if (
            (p === "all_parents"
              ? (o = g.filter((i) => i.parent_user_id !== null))
              : p === "class"
                ? (o = g.filter((i) => i.class_id === U && i.parent_user_id !== null))
                : p === "student" &&
                  (o = g.filter((i) => i.id === ae && i.parent_user_id !== null)),
            o.length === 0)
          ) {
            (d.info("No parents matching selected audience cohort."), N(!1));
            return;
          }
          (await _.from("whatsapp_campaigns").update({ total_messages: o.length }).eq("id", t.id),
            d.info(`Broadcasting template message to ${o.length} parent contacts...`));
          let c = 0,
            v = 0,
            $ = 0;
          for (const i of o)
            try {
              const q = i.phone_number || "+91 90000 " + Math.floor(1e4 + Math.random() * 9e4),
                ts = E.map((D) => {
                  if (D === "{student_name}") return i.full_name;
                  if (D === "{class_name}") {
                    const Ce = J.find((as) => as.id === i.class_id);
                    return Ce ? Ce.name : "Class 1";
                  }
                  return D === "{due_date}" ? "June 30, 2026" : D;
                });
              (await l.sendTemplateMessage(r, q, m, ts, i.id, i.parent_user_id, t.id),
                c++,
                ($ += Math.random() > 0.4 ? 1 : 0));
            } catch {
              v++;
            }
          (await _.from("whatsapp_campaigns")
            .update({
              status: "completed",
              sent_count: c,
              delivered_count: c,
              read_count: $,
              failed_count: v,
            })
            .eq("id", t.id),
            te(""),
            ne([]),
            d.success(`Campaign "${y}" completed! ${c} messages sent successfully.`),
            h(),
            N(!1));
        } catch (s) {
          (d.error("Campaign execution failed: " + s.message), N(!1));
        }
      }
    },
    Xe = async () => {
      if (r) {
        V(!0);
        try {
          (await l.saveSettings(r, {
            provider: P,
            api_key: xe.trim() || null,
            phone_number_id: pe.trim() || null,
            whatsapp_business_account_id: fe.trim() || null,
            sender_number: he.trim() || null,
            is_active: je,
          }),
            d.success("WhatsApp credentials saved successfully!"),
            h(),
            V(!1));
        } catch (s) {
          (d.error("Failed to save configuration: " + s.message), V(!1));
        }
      }
    },
    es = async () => {
      if (!r || !R.trim()) {
        d.error("Enter a valid recipient phone number.");
        return;
      }
      L(!0);
      try {
        const s = x.find((t) => t.name === "absent_alert");
        if (!s) {
          (d.error("Please create templates first to execute test triggers."), L(!1));
          return;
        }
        (await l.sendTemplateMessage(r, R.trim(), s.id, ["Aman Sharma"]),
          d.success("Test message dispatched! Check recipient's phone."),
          L(!1));
      } catch (s) {
        (d.error("Test connection failed: " + s.message), L(!1));
      }
    },
    ss = async () => {
      if (!r || !M.trim() || !w.trim()) {
        d.error("Fill all template fields.");
        return;
      }
      H(!0);
      try {
        const s = w.match(/\{\{\d+\}\}/g) || [],
          t = Array.from(new Set(s)).map((o) => o.replace(/[\{\}]/g, ""));
        (await l.createTemplate(r, {
          name: M.toLowerCase().trim().replace(/\s+/g, "_"),
          category: le,
          language: "en",
          body_text: w.trim(),
          status: "approved",
          variables: t,
        }),
          de(""),
          ie(""),
          d.success("Template registered and synced successfully!"),
          h(),
          H(!1));
      } catch (s) {
        (d.error("Failed to register template: " + s.message), H(!1));
      }
    },
    _e = a.useMemo(
      () =>
        Q.filter((s) =>
          s.parent_phone.includes(I) ||
          (s.parent_name || "").toLowerCase().includes(I.toLowerCase())
            ? b === "open"
              ? s.status === "open"
              : b === "in_progress"
                ? s.status === "in_progress"
                : b === "resolved"
                  ? s.status === "resolved" || s.status === "closed"
                  : b === "my"
                    ? s.assigned_to_user_id === C?.id
                    : !0
            : !1,
        ),
      [Q, b, I, C],
    ),
    z = a.useMemo(
      () =>
        !n || !n.parent_user_id
          ? null
          : g.find((s) => s.parent_user_id === n.parent_user_id) || null,
      [n, g],
    );
  return Te || Ie
    ? e.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
        children: e.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            e.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            e.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading WhatsApp Services...",
            }),
          ],
        }),
      })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx(ds, {
            title: "WhatsApp Inbox",
            breadcrumb: "SaaS Messaging Hub",
            actions:
              x.length === 0
                ? e.jsxs("button", {
                    onClick: Ge,
                    className:
                      "px-4 py-2 text-xs font-semibold bg-brand text-brand-foreground rounded-lg inline-flex items-center gap-1.5 shadow-sm hover:opacity-90 transition",
                    children: [
                      e.jsx(ls, { className: "size-4 animate-pulse" }),
                      " Auto-Provision Sandbox Config",
                    ],
                  })
                : null,
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-hidden p-6 flex flex-col gap-6",
            children: [
              e.jsx("div", {
                className: "flex bg-secondary p-0.5 rounded-lg self-start",
                children: [
                  { id: "inbox", label: "Conversational Inbox", icon: ke },
                  { id: "dashboard", label: "Analytics Dashboard", icon: ms },
                  { id: "campaigns", label: "Campaign Broadcaster", icon: ps },
                  { id: "templates", label: "Template Registry", icon: gs },
                  { id: "config", label: "Integration Settings", icon: fs },
                ].map((s) => {
                  const t = s.icon;
                  return e.jsxs(
                    "button",
                    {
                      onClick: () => Ae(s.id),
                      className: `px-4 py-2 text-xs font-semibold rounded-md inline-flex items-center gap-1.5 transition ${f === s.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
                      children: [e.jsx(t, { className: "size-3.5" }), " ", s.label],
                    },
                    s.id,
                  );
                }),
              }),
              f === "inbox" &&
                e.jsxs("div", {
                  className:
                    "flex-1 min-h-0 bg-card border border-border rounded-xl flex overflow-hidden shadow-sm",
                  children: [
                    e.jsxs("div", {
                      className: "w-80 border-r border-border flex flex-col shrink-0",
                      children: [
                        e.jsxs("div", {
                          className: "p-4 border-b border-border space-y-3",
                          children: [
                            e.jsxs("div", {
                              className: "relative",
                              children: [
                                e.jsx(is, {
                                  className: "size-4 absolute left-3 top-2.5 text-muted-foreground",
                                }),
                                e.jsx("input", {
                                  type: "text",
                                  placeholder: "Search conversations...",
                                  value: I,
                                  onChange: (s) => We(s.target.value),
                                  className:
                                    "w-full pl-9 pr-4 py-2 border border-border rounded-lg bg-background text-xs",
                                }),
                              ],
                            }),
                            e.jsx("div", {
                              className: "flex gap-1 flex-wrap",
                              children: [
                                { id: "all", label: "All" },
                                { id: "open", label: "Open" },
                                { id: "in_progress", label: "Active" },
                                { id: "resolved", label: "Resolved" },
                                { id: "my", label: "Mine" },
                              ].map((s) =>
                                e.jsx(
                                  "button",
                                  {
                                    onClick: () => Be(s.id),
                                    className: `px-2 py-1 text-[10px] font-medium rounded transition ${b === s.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`,
                                    children: s.label,
                                  },
                                  s.id,
                                ),
                              ),
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "flex-1 overflow-y-auto divide-y divide-border/60",
                          children:
                            _e.length === 0
                              ? e.jsx("div", {
                                  className: "p-8 text-center text-muted-foreground text-xs",
                                  children: "No active chats found.",
                                })
                              : _e.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      onClick: () => S(s),
                                      className: `p-4 cursor-pointer hover:bg-accent transition flex flex-col gap-1.5 ${n?.id === s.id ? "bg-accent" : ""}`,
                                      children: [
                                        e.jsxs("div", {
                                          className: "flex justify-between items-start",
                                          children: [
                                            e.jsx("span", {
                                              className:
                                                "font-semibold text-xs truncate max-w-[140px] text-foreground",
                                              children: s.parent_name || s.parent_phone,
                                            }),
                                            e.jsx("span", {
                                              className: "text-[10px] text-muted-foreground",
                                              children: new Date(
                                                s.last_message_at,
                                              ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              }),
                                            }),
                                          ],
                                        }),
                                        e.jsx("p", {
                                          className: "text-[11px] text-muted-foreground truncate",
                                          children: s.last_message_body,
                                        }),
                                        e.jsxs("div", {
                                          className: "flex justify-between items-center mt-1",
                                          children: [
                                            e.jsx("span", {
                                              className: `text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${s.status === "open" ? "bg-danger-soft text-danger" : s.status === "in_progress" ? "bg-warning-soft text-warning" : "bg-success-soft text-success"}`,
                                              children: s.status,
                                            }),
                                            s.unread_count > 0 &&
                                              e.jsx("span", {
                                                className:
                                                  "size-4 bg-brand text-brand-foreground text-[10px] rounded-full flex items-center justify-center font-bold",
                                                children: s.unread_count,
                                              }),
                                          ],
                                        }),
                                      ],
                                    },
                                    s.id,
                                  ),
                                ),
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "flex-1 flex flex-col min-w-0 bg-secondary/20",
                      children: n
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "p-4 border-b border-border bg-card flex justify-between items-center shrink-0",
                                children: [
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("h4", {
                                        className: "font-bold text-sm text-foreground",
                                        children: n.parent_name,
                                      }),
                                      e.jsx("p", {
                                        className: "text-xs text-muted-foreground",
                                        children: n.parent_phone,
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "flex items-center gap-1.5 bg-secondary px-2.5 py-1.5 rounded-lg border border-border",
                                        children: [
                                          e.jsx(bs, {
                                            className: "size-3.5 text-muted-foreground",
                                          }),
                                          e.jsxs("select", {
                                            value: n.assigned_to_user_id || "",
                                            onChange: (s) => Qe(s.target.value || null),
                                            className:
                                              "bg-transparent text-xs focus:outline-none text-foreground",
                                            children: [
                                              e.jsx("option", {
                                                value: "",
                                                children: "Unassigned",
                                              }),
                                              Le.map((s) =>
                                                e.jsxs(
                                                  "option",
                                                  {
                                                    value: s.user_id,
                                                    children: [
                                                      s.full_name,
                                                      " (",
                                                      s.designation || "Staff",
                                                      ")",
                                                    ],
                                                  },
                                                  s.user_id,
                                                ),
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsxs("select", {
                                        value: n.status,
                                        onChange: (s) => Ze(s.target.value),
                                        className: `text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none ${n.status === "open" ? "bg-danger-soft text-danger border-danger/30" : n.status === "in_progress" ? "bg-warning-soft text-warning border-warning/30" : "bg-success-soft text-success border-success/30"}`,
                                        children: [
                                          e.jsx("option", { value: "open", children: "Open" }),
                                          e.jsx("option", {
                                            value: "in_progress",
                                            children: "Active",
                                          }),
                                          e.jsx("option", {
                                            value: "resolved",
                                            children: "Resolved",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: "flex-1 overflow-y-auto p-4 space-y-3 flex flex-col",
                                children:
                                  Z.length === 0
                                    ? e.jsx("div", {
                                        className:
                                          "flex-1 flex items-center justify-center text-muted-foreground text-xs italic",
                                        children: "No messages inside this thread.",
                                      })
                                    : Z.map((s) => {
                                        const t = s.direction === "outbound";
                                        return e.jsxs(
                                          "div",
                                          {
                                            className: `max-w-[70%] rounded-xl p-3 shadow-sm text-xs flex flex-col gap-1 ${t ? "bg-primary text-primary-foreground self-end rounded-tr-none" : "bg-card text-foreground self-start rounded-tl-none border border-border"}`,
                                            children: [
                                              e.jsx("p", {
                                                className: "leading-relaxed whitespace-pre-wrap",
                                                children: s.message_body,
                                              }),
                                              e.jsxs("div", {
                                                className:
                                                  "flex justify-between items-center gap-4 text-[9px] mt-1 opacity-70",
                                                children: [
                                                  e.jsx("span", {
                                                    className: "font-semibold",
                                                    children: t
                                                      ? s.ai_replied
                                                        ? "🤖 AI Assistant"
                                                        : s.sender?.full_name || "Office"
                                                      : "Parent",
                                                  }),
                                                  e.jsxs("div", {
                                                    className: "flex items-center gap-0.5",
                                                    children: [
                                                      e.jsx("span", {
                                                        children: new Date(
                                                          s.created_at,
                                                        ).toLocaleTimeString([], {
                                                          hour: "2-digit",
                                                          minute: "2-digit",
                                                        }),
                                                      }),
                                                      t &&
                                                        (s.status === "read"
                                                          ? e.jsx(O, {
                                                              className: "size-3 text-success",
                                                            })
                                                          : s.status === "delivered"
                                                            ? e.jsx(O, {
                                                                className: "size-3 text-muted",
                                                              })
                                                            : e.jsx(hs, {
                                                                className: "size-3 text-muted",
                                                              })),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            ],
                                          },
                                          s.id,
                                        );
                                      }),
                              }),
                              e.jsxs("div", {
                                className: "p-4 bg-card border-t border-border shrink-0 space-y-3",
                                children: [
                                  e.jsxs("div", {
                                    className:
                                      "bg-secondary/40 border border-dashed border-border rounded-lg p-2.5 flex items-center justify-between gap-3",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "flex items-center gap-1.5 text-xs text-muted-foreground",
                                        children: [
                                          e.jsx(Se, { className: "size-4 text-brand" }),
                                          e.jsx("span", {
                                            children:
                                              "Mock inbound reply from parent (triggers AI):",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className: "flex-1 max-w-md flex gap-2",
                                        children: [
                                          e.jsx("input", {
                                            type: "text",
                                            placeholder:
                                              "e.g. Is Rohan present today? / pending fees",
                                            value: A,
                                            onChange: (s) => se(s.target.value),
                                            className:
                                              "flex-1 px-3 py-1 text-xs border border-border rounded bg-background text-foreground",
                                          }),
                                          e.jsx("button", {
                                            onClick: Ke,
                                            disabled: Fe || !A.trim(),
                                            className:
                                              "px-3 py-1 bg-brand text-brand-foreground rounded text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                                            children: "Simulate Reply",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex gap-2",
                                    children: [
                                      e.jsx("input", {
                                        type: "text",
                                        placeholder: "Type a custom reply message...",
                                        value: T,
                                        onChange: (s) => ee(s.target.value),
                                        onKeyDown: (s) => s.key === "Enter" && we(),
                                        className:
                                          "flex-1 px-4 py-2 border border-border rounded-lg bg-background text-xs text-foreground focus:outline-none",
                                      }),
                                      e.jsxs("button", {
                                        onClick: we,
                                        disabled: De || !T.trim(),
                                        className:
                                          "px-4 py-2 bg-primary text-primary-foreground rounded-lg inline-flex items-center gap-1 text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                                        children: [e.jsx(Y, { className: "size-3.5" }), " Send"],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          })
                        : e.jsxs("div", {
                            className:
                              "flex-1 flex flex-col items-center justify-center text-center p-8 text-muted-foreground",
                            children: [
                              e.jsx(ke, { className: "size-12 text-muted-foreground/40 mb-3" }),
                              e.jsx("p", {
                                className: "font-semibold text-sm",
                                children: "No conversation selected",
                              }),
                              e.jsx("p", {
                                className: "text-xs mt-1",
                                children: "Select a chat from the left panel to begin replying.",
                              }),
                            ],
                          }),
                    }),
                    n &&
                      e.jsxs("div", {
                        className:
                          "w-80 border-l border-border flex flex-col shrink-0 p-5 space-y-6 overflow-y-auto",
                        children: [
                          e.jsxs("div", {
                            className: "flex items-center gap-2 border-b border-border pb-3",
                            children: [
                              e.jsx(_s, { className: "size-4.5 text-muted-foreground" }),
                              e.jsx("h4", {
                                className:
                                  "font-bold text-xs uppercase tracking-wider text-foreground",
                                children: "Student Context",
                              }),
                            ],
                          }),
                          z
                            ? e.jsxs("div", {
                                className: "space-y-5",
                                children: [
                                  e.jsxs("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.jsx("div", {
                                        className:
                                          "size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold",
                                        children: z.full_name.slice(0, 1).toUpperCase(),
                                      }),
                                      e.jsxs("div", {
                                        children: [
                                          e.jsx("h5", {
                                            className: "font-semibold text-xs text-foreground",
                                            children: z.full_name,
                                          }),
                                          e.jsxs("p", {
                                            className: "text-[10px] text-muted-foreground",
                                            children: ["Roll No: ", z.roll_number || "—"],
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [
                                      e.jsxs("div", {
                                        className:
                                          "bg-secondary/40 border border-border/80 rounded-lg p-3 text-center",
                                        children: [
                                          e.jsx(vs, {
                                            className: "size-4 text-brand mx-auto mb-1",
                                          }),
                                          e.jsx("span", {
                                            className:
                                              "text-[9px] uppercase font-bold tracking-wider text-muted-foreground block",
                                            children: "Attendance",
                                          }),
                                          e.jsx("span", {
                                            className: "text-xs font-bold text-foreground",
                                            children: "94% (Good)",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className:
                                          "bg-secondary/40 border border-border/80 rounded-lg p-3 text-center",
                                        children: [
                                          e.jsx(Ns, {
                                            className: "size-4 text-danger mx-auto mb-1",
                                          }),
                                          e.jsx("span", {
                                            className:
                                              "text-[9px] uppercase font-bold tracking-wider text-muted-foreground block",
                                            children: "Fee Dues",
                                          }),
                                          e.jsx("span", {
                                            className: "text-xs font-bold text-danger",
                                            children: "₹4,500",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    className: "space-y-3 border-t border-border/60 pt-4",
                                    children: [
                                      e.jsxs("div", {
                                        className: "flex items-center gap-1.5 text-xs",
                                        children: [
                                          e.jsx(cs, { className: "size-4 text-muted-foreground" }),
                                          e.jsx("span", {
                                            className: "font-medium text-foreground",
                                            children: "Class:",
                                          }),
                                          e.jsx("span", {
                                            className: "text-muted-foreground",
                                            children: "Class 10A",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("div", {
                                        className: "flex items-center gap-1.5 text-xs",
                                        children: [
                                          e.jsx(us, { className: "size-4 text-muted-foreground" }),
                                          e.jsx("span", {
                                            className: "font-medium text-foreground",
                                            children: "Active Homework:",
                                          }),
                                          e.jsx("span", {
                                            className: "text-muted-foreground",
                                            children: "Quadratic Equations",
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              })
                            : e.jsx("div", {
                                className: "text-center p-8 text-muted-foreground text-xs italic",
                                children:
                                  "Could not link conversation phone number to an active student profile in database.",
                              }),
                        ],
                      }),
                  ],
                }),
              f === "dashboard" &&
                e.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    e.jsx("div", {
                      className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                      children: [
                        {
                          title: "WhatsApp Sent",
                          value: u.sent,
                          desc: "Total broadcasts & responses",
                          icon: Y,
                          color: "text-brand",
                        },
                        {
                          title: "Delivery Success",
                          value: `${Math.round((u.delivered / u.sent) * 100)}%`,
                          desc: `${u.delivered} delivered logs`,
                          icon: O,
                          color: "text-success",
                        },
                        {
                          title: "Average Response Time",
                          value: `${u.avgResponseTimeMin}m`,
                          desc: "Inbound query resolution",
                          icon: xs,
                          color: "text-warning",
                        },
                        {
                          title: "AI Assistant Replies",
                          value: u.aiAnswered,
                          desc: "Automated auto-responses",
                          icon: Se,
                          color: "text-brand",
                        },
                      ].map((s, t) => {
                        const o = s.icon;
                        return e.jsxs(
                          "div",
                          {
                            className:
                              "bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-sm",
                            children: [
                              e.jsxs("div", {
                                className: "space-y-1.5",
                                children: [
                                  e.jsx("span", {
                                    className: "text-xs text-muted-foreground font-medium",
                                    children: s.title,
                                  }),
                                  e.jsx("p", {
                                    className: "text-2xl font-bold text-foreground",
                                    children: s.value,
                                  }),
                                  e.jsx("span", {
                                    className: "text-[10px] text-muted-foreground block",
                                    children: s.desc,
                                  }),
                                ],
                              }),
                              e.jsx("div", {
                                className: `size-10 rounded-full bg-secondary flex items-center justify-center ${s.color}`,
                                children: e.jsx(o, { className: "size-5" }),
                              }),
                            ],
                          },
                          t,
                        );
                      }),
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                      children: [
                        e.jsxs("div", {
                          className:
                            "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                          children: [
                            e.jsx("h4", {
                              className:
                                "font-bold text-xs uppercase tracking-wider text-foreground",
                              children: "Resolution Performance",
                            }),
                            e.jsxs("div", {
                              className: "space-y-3",
                              children: [
                                e.jsxs("div", {
                                  className: "flex justify-between items-center text-xs",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Read Rate (Total Opened)",
                                    }),
                                    e.jsxs("span", {
                                      className: "font-semibold text-foreground",
                                      children: [Math.round((u.read / u.delivered) * 100), "%"],
                                    }),
                                  ],
                                }),
                                e.jsx("div", {
                                  className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                                  children: e.jsx("div", {
                                    className: "bg-brand h-full rounded-full",
                                    style: { width: `${(u.read / u.delivered) * 100}%` },
                                  }),
                                }),
                                e.jsxs("div", {
                                  className: "flex justify-between items-center text-xs mt-3",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-muted-foreground",
                                      children: "Open Chats Resolution Rate",
                                    }),
                                    e.jsxs("span", {
                                      className: "font-semibold text-foreground",
                                      children: [u.resolutionRate, "%"],
                                    }),
                                  ],
                                }),
                                e.jsx("div", {
                                  className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                                  children: e.jsx("div", {
                                    className: "bg-success h-full rounded-full",
                                    style: { width: `${u.resolutionRate}%` },
                                  }),
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className:
                            "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                          children: [
                            e.jsx("h4", {
                              className:
                                "font-bold text-xs uppercase tracking-wider text-foreground font-sans",
                              children: "Common Parent Questions",
                            }),
                            e.jsx("div", {
                              className: "space-y-2",
                              children: [
                                { question: "Attendance Verification (absences checks)", pct: 42 },
                                { question: "Unpaid Fees & Payment Link requests", pct: 28 },
                                { question: "Class homework schedule questions", pct: 18 },
                                { question: "Exam timetable releases details", pct: 12 },
                              ].map((s, t) =>
                                e.jsxs(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-between text-xs border-b border-border/40 pb-2",
                                    children: [
                                      e.jsx("span", {
                                        className: "text-muted-foreground truncate",
                                        children: s.question,
                                      }),
                                      e.jsxs("span", {
                                        className: "font-semibold text-foreground",
                                        children: [s.pct, "%"],
                                      }),
                                    ],
                                  },
                                  t,
                                ),
                              ),
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              f === "campaigns" &&
                e.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
                  children: [
                    e.jsxs("div", {
                      className:
                        "lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm space-y-5",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground",
                          children: "Launch New Campaign",
                        }),
                        e.jsxs("div", {
                          className: "space-y-4",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold text-muted-foreground",
                                  children: "Campaign Name",
                                }),
                                e.jsx("input", {
                                  type: "text",
                                  placeholder: "e.g. Homework alerts class 10",
                                  value: y,
                                  onChange: (s) => te(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "grid grid-cols-2 gap-4",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("label", {
                                      className: "text-xs font-semibold text-muted-foreground",
                                      children: "Target Cohort",
                                    }),
                                    e.jsxs("select", {
                                      value: p,
                                      onChange: (s) => Ue(s.target.value),
                                      className:
                                        "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                      children: [
                                        e.jsx("option", {
                                          value: "all_parents",
                                          children: "All Parents",
                                        }),
                                        e.jsx("option", {
                                          value: "class",
                                          children: "Selected Class",
                                        }),
                                        e.jsx("option", {
                                          value: "student",
                                          children: "Specific Student",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    p === "class" &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("label", {
                                            className:
                                              "text-xs font-semibold text-muted-foreground font-sans",
                                            children: "Choose Class",
                                          }),
                                          e.jsxs("select", {
                                            value: U,
                                            onChange: (s) => Ee(s.target.value),
                                            className:
                                              "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                            children: [
                                              e.jsx("option", {
                                                value: "",
                                                children: "Select Class",
                                              }),
                                              J.map((s) =>
                                                e.jsxs(
                                                  "option",
                                                  {
                                                    value: s.id,
                                                    children: [s.name, " ", s.section],
                                                  },
                                                  s.id,
                                                ),
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                    p === "student" &&
                                      e.jsxs(e.Fragment, {
                                        children: [
                                          e.jsx("label", {
                                            className:
                                              "text-xs font-semibold text-muted-foreground font-sans",
                                            children: "Choose Student",
                                          }),
                                          e.jsxs("select", {
                                            value: ae,
                                            onChange: (s) => He(s.target.value),
                                            className:
                                              "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                            children: [
                                              e.jsx("option", {
                                                value: "",
                                                children: "Select Student",
                                              }),
                                              g.map((s) =>
                                                e.jsx(
                                                  "option",
                                                  { value: s.id, children: s.full_name },
                                                  s.id,
                                                ),
                                              ),
                                            ],
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold text-muted-foreground",
                                  children: "Choose Template",
                                }),
                                e.jsxs("select", {
                                  value: m,
                                  onChange: (s) => re(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  children: [
                                    e.jsx("option", { value: "", children: "Select Template" }),
                                    x.map((s) =>
                                      e.jsxs(
                                        "option",
                                        { value: s.id, children: [s.name, " (", s.category, ")"] },
                                        s.id,
                                      ),
                                    ),
                                  ],
                                }),
                              ],
                            }),
                            m &&
                              x.find((s) => s.id === m) &&
                              e.jsxs("div", {
                                className:
                                  "bg-secondary/40 border border-border/80 rounded-lg p-4 space-y-3",
                                children: [
                                  e.jsx("span", {
                                    className:
                                      "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block",
                                    children: "Variable Mappings",
                                  }),
                                  x
                                    .find((s) => s.id === m)
                                    ?.variables.map((s, t) =>
                                      e.jsxs(
                                        "div",
                                        {
                                          className: "flex items-center gap-3 text-xs",
                                          children: [
                                            e.jsxs("span", {
                                              className: "w-12 text-muted-foreground",
                                              children: ["Variable #", t + 1, ":"],
                                            }),
                                            e.jsx("input", {
                                              type: "text",
                                              placeholder: "Value or {student_name} / {class_name}",
                                              onChange: (o) => {
                                                const c = [...E];
                                                ((c[t] = o.target.value), ne(c));
                                              },
                                              className:
                                                "flex-1 px-3 py-1 border border-border rounded bg-background text-foreground text-xs",
                                            }),
                                          ],
                                        },
                                        t,
                                      ),
                                    ),
                                ],
                              }),
                            e.jsx("button", {
                              onClick: Je,
                              disabled: oe || !y.trim(),
                              className:
                                "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                              children: oe ? "Broadcasting..." : "Launch Campaign Broadcast",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider text-foreground font-sans",
                          children: "Recent Campaigns",
                        }),
                        e.jsx("div", {
                          className: "space-y-3",
                          children:
                            K.length === 0
                              ? e.jsx("p", {
                                  className:
                                    "text-center text-muted-foreground text-xs italic py-4",
                                  children: "No broadcasts executed yet.",
                                })
                              : K.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "border border-border/80 rounded-lg p-3 space-y-2 text-xs",
                                      children: [
                                        e.jsxs("div", {
                                          className: "flex justify-between items-center",
                                          children: [
                                            e.jsx("span", {
                                              className: "font-bold text-foreground",
                                              children: s.name,
                                            }),
                                            e.jsx("span", {
                                              className:
                                                "text-[9px] uppercase font-bold tracking-wider text-success",
                                              children: s.status,
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className:
                                            "grid grid-cols-2 gap-2 text-muted-foreground text-[10px]",
                                          children: [
                                            e.jsxs("span", {
                                              children: ["Target: ", s.target_type],
                                            }),
                                            e.jsxs("span", {
                                              children: ["Total: ", s.total_messages, " msgs"],
                                            }),
                                          ],
                                        }),
                                        e.jsx("div", {
                                          className:
                                            "h-1.5 w-full bg-secondary rounded-full overflow-hidden",
                                          children: e.jsx("div", {
                                            className: "bg-success h-full rounded-full",
                                            style: {
                                              width:
                                                s.total_messages > 0
                                                  ? `${(s.sent_count / s.total_messages) * 100}%`
                                                  : "100%",
                                            },
                                          }),
                                        }),
                                      ],
                                    },
                                    s.id,
                                  ),
                                ),
                        }),
                      ],
                    }),
                  ],
                }),
              f === "templates" &&
                e.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-3 gap-6 items-start",
                  children: [
                    e.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-4",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                          children: "Request New Template",
                        }),
                        e.jsxs("div", {
                          className: "space-y-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "Template Name",
                                }),
                                e.jsx("input", {
                                  type: "text",
                                  placeholder: "e.g. class_alert",
                                  value: M,
                                  onChange: (s) => de(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "Category",
                                }),
                                e.jsxs("select", {
                                  value: le,
                                  onChange: (s) => Ve(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  children: [
                                    e.jsx("option", {
                                      value: "UTILITY",
                                      children: "Utility / Transactional",
                                    }),
                                    e.jsx("option", {
                                      value: "MARKETING",
                                      children: "Marketing / Promotion",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "Body Text",
                                }),
                                e.jsx("textarea", {
                                  rows: 4,
                                  placeholder:
                                    "Dear Parent, your child {{1}} has been assigned {{2}}.",
                                  value: w,
                                  onChange: (s) => ie(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                }),
                                e.jsxs("p", {
                                  className:
                                    "text-[10px] text-muted-foreground mt-1 leading-relaxed",
                                  children: [
                                    "Use placeholders starting from ",
                                    e.jsx("code", {
                                      className:
                                        "bg-secondary px-1 py-0.5 rounded font-mono font-bold",
                                      children: "{{1}}",
                                    }),
                                    ", ",
                                    e.jsx("code", {
                                      className:
                                        "bg-secondary px-1 py-0.5 rounded font-mono font-bold",
                                      children: "{{2}}",
                                    }),
                                    ", etc.",
                                  ],
                                }),
                              ],
                            }),
                            e.jsx("button", {
                              onClick: ss,
                              disabled: ce || !M.trim() || !w.trim(),
                              className:
                                "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                              children: ce ? "Registering..." : "Submit for Approval",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className:
                        "lg:col-span-2 bg-card border border-border rounded-xl p-5 shadow-sm space-y-4",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                          children: "Approved Templates",
                        }),
                        e.jsx("div", {
                          className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                          children:
                            x.length === 0
                              ? e.jsx("p", {
                                  className:
                                    "text-muted-foreground text-xs italic p-4 text-center col-span-2",
                                  children: "No templates registered.",
                                })
                              : x.map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "border border-border/80 rounded-xl p-4 flex flex-col justify-between gap-4 text-xs bg-secondary/10",
                                      children: [
                                        e.jsxs("div", {
                                          className: "space-y-2",
                                          children: [
                                            e.jsxs("div", {
                                              className: "flex justify-between items-center",
                                              children: [
                                                e.jsx("span", {
                                                  className: "font-bold text-foreground",
                                                  children: s.name,
                                                }),
                                                e.jsx("span", {
                                                  className:
                                                    "text-[9px] uppercase font-bold tracking-wider bg-success-soft text-success px-1.5 py-0.5 rounded",
                                                  children: s.status,
                                                }),
                                              ],
                                            }),
                                            e.jsxs("p", {
                                              className:
                                                "text-muted-foreground text-[11px] leading-relaxed italic",
                                              children: ['"', s.body_text, '"'],
                                            }),
                                          ],
                                        }),
                                        e.jsxs("div", {
                                          className:
                                            "flex justify-between text-[10px] text-muted-foreground border-t border-border/40 pt-2",
                                          children: [
                                            e.jsxs("span", {
                                              children: [
                                                "Variables: ",
                                                s.variables.join(", ") || "none",
                                              ],
                                            }),
                                            e.jsx("span", {
                                              className:
                                                "uppercase font-semibold text-[8px] tracking-wider",
                                              children: s.category,
                                            }),
                                          ],
                                        }),
                                      ],
                                    },
                                    s.id,
                                  ),
                                ),
                        }),
                      ],
                    }),
                  ],
                }),
              f === "config" &&
                e.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6 items-start",
                  children: [
                    e.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-5",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                          children: "Provider Credentials",
                        }),
                        e.jsxs("div", {
                          className: "space-y-4",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "WhatsApp API Provider",
                                }),
                                e.jsxs("select", {
                                  value: P,
                                  onChange: (s) => ue(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  children: [
                                    e.jsx("option", {
                                      value: "meta",
                                      children: "Meta WhatsApp Business API (Official Cloud)",
                                    }),
                                    e.jsx("option", {
                                      value: "twilio",
                                      children: "Twilio WhatsApp API Adapter",
                                    }),
                                    e.jsx("option", {
                                      value: "interakt",
                                      children: "Interakt Business Hub (India)",
                                    }),
                                    e.jsx("option", {
                                      value: "wati",
                                      children: "WATI API Portal (India)",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "API Authorization Bearer Key",
                                }),
                                e.jsx("input", {
                                  type: "password",
                                  placeholder: "Enter API key / Auth token",
                                  value: xe,
                                  onChange: (s) => me(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                }),
                              ],
                            }),
                            P === "meta" &&
                              e.jsxs("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("label", {
                                        className:
                                          "text-xs font-semibold text-muted-foreground font-sans",
                                        children: "Phone Number ID",
                                      }),
                                      e.jsx("input", {
                                        type: "text",
                                        placeholder: "e.g. 105658822",
                                        value: pe,
                                        onChange: (s) => ge(s.target.value),
                                        className:
                                          "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                      }),
                                    ],
                                  }),
                                  e.jsxs("div", {
                                    children: [
                                      e.jsx("label", {
                                        className:
                                          "text-xs font-semibold text-muted-foreground font-sans",
                                        children: "WhatsApp Business ID",
                                      }),
                                      e.jsx("input", {
                                        type: "text",
                                        placeholder: "e.g. 10986548",
                                        value: fe,
                                        onChange: (s) => be(s.target.value),
                                        className:
                                          "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            P === "twilio" &&
                              e.jsxs("div", {
                                children: [
                                  e.jsx("label", {
                                    className:
                                      "text-xs font-semibold text-muted-foreground font-sans",
                                    children: "Twilio Sender Number",
                                  }),
                                  e.jsx("input", {
                                    type: "text",
                                    placeholder: "e.g. whatsapp:+14155238886",
                                    value: he,
                                    onChange: (s) => ve(s.target.value),
                                    className:
                                      "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                  }),
                                ],
                              }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2",
                              children: [
                                e.jsx("input", {
                                  type: "checkbox",
                                  id: "is_active_check",
                                  checked: je,
                                  onChange: (s) => ye(s.target.checked),
                                  className:
                                    "size-4 border-border rounded text-primary focus:ring-ring",
                                }),
                                e.jsx("label", {
                                  htmlFor: "is_active_check",
                                  className: "text-xs font-semibold text-foreground",
                                  children: "Enable WhatsApp Integrations Gateway",
                                }),
                              ],
                            }),
                            e.jsx("button", {
                              onClick: Xe,
                              disabled: Ne,
                              className:
                                "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50",
                              children: Ne ? "Saving..." : "Save Credentials",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-4",
                      children: [
                        e.jsx("h4", {
                          className:
                            "font-bold text-xs uppercase tracking-wider border-b border-border pb-3 text-foreground font-sans",
                          children: "Connection Diagnostic Utility",
                        }),
                        e.jsx("p", {
                          className: "text-xs text-muted-foreground leading-relaxed",
                          children:
                            "Sends a sandbox absent template notification message to verify webhook bindings and authorization tokens.",
                        }),
                        e.jsxs("div", {
                          className: "space-y-3 mt-3",
                          children: [
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className:
                                    "text-xs font-semibold text-muted-foreground font-sans",
                                  children: "Recipient Mobile Phone",
                                }),
                                e.jsx("input", {
                                  type: "text",
                                  placeholder: "e.g. +919876543210",
                                  value: R,
                                  onChange: (s) => Oe(s.target.value),
                                  className:
                                    "w-full px-3 py-2 border border-border rounded-lg bg-background text-xs mt-1 text-foreground",
                                }),
                              ],
                            }),
                            e.jsxs("button", {
                              onClick: es,
                              disabled: Ye || !R.trim() || x.length === 0,
                              className:
                                "px-4 py-2 bg-brand text-brand-foreground rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-1.5 shadow",
                              children: [
                                e.jsx(Y, { className: "size-3.5" }),
                                " Dispatch Test Message",
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          }),
        ],
      });
}
export { Us as component };
