import { a0 as L, X as P, M as c, x as e, P as E, d as F, N as n } from "./index-DrqTZ7SR.js";
import { k as l } from "./vendor-charts-DECNlt_G.js";
import { C as z } from "./calendar-check-DuiRifj2.js";
import { C as R } from "./check-oRz9qccl.js";
import { X as A } from "./x-DH-xwxwM.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function H() {
  const { currentSchoolId: i, user: d, roles: f, loading: _ } = L(),
    b = f.includes("admin") || f.includes("teacher") || f.includes("super_admin"),
    u = f.includes("parent") && !b;
  P("Leave Requests");
  const [x, k] = l.useState([]),
    [j, v] = l.useState([]),
    [C, g] = l.useState(!1),
    [s, m] = l.useState({ student_id: "", start_date: "", end_date: "", reason: "" }),
    [N, y] = l.useState(!1),
    p = l.useCallback(async () => {
      if (u && d) {
        const { data: t } = await c
          .from("students")
          .select("id, full_name, school_id")
          .eq("parent_user_id", d.id);
        k(t ?? []);
        const a = {};
        (t ?? []).forEach((r) => {
          a[r.id] = r.full_name;
        });
        const { data: o } = await c
            .from("leave_requests")
            .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
            .eq("parent_user_id", d.id)
            .order("created_at", { ascending: !1 }),
          h = (o ?? []).map((r) => ({
            ...r,
            students: r.student_id ? { full_name: a[r.student_id] || "Student" } : null,
          }));
        v(h);
      } else if (b && i) {
        const { data: t } = await c.from("students").select("id, full_name").eq("school_id", i),
          a = {};
        (t ?? []).forEach((r) => {
          a[r.id] = r.full_name;
        });
        const { data: o } = await c
            .from("leave_requests")
            .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
            .eq("school_id", i)
            .order("created_at", { ascending: !1 }),
          h = (o ?? []).map((r) => ({
            ...r,
            students: r.student_id ? { full_name: a[r.student_id] || "Student" } : null,
          }));
        v(h);
      }
    }, [u, b, d, i]);
  l.useEffect(() => {
    p();
  }, [p]);
  const S = async () => {
      if (!d) return;
      const t = x.find((o) => o.id === s.student_id) ?? x[0];
      if (!t) return n.error("No child linked to your account");
      if (!s.start_date || !s.end_date || !s.reason.trim()) return n.error("Fill all fields");
      if (s.end_date < s.start_date) return n.error("End date must be after start date");
      y(!0);
      const { error: a } = await c.from("leave_requests").insert({
        school_id: t.school_id,
        student_id: t.id,
        parent_user_id: d.id,
        start_date: s.start_date,
        end_date: s.end_date,
        reason: s.reason.trim(),
      });
      if ((y(!1), a)) return n.error(a.message);
      (n.success("Leave request submitted"),
        g(!1),
        m({ student_id: "", start_date: "", end_date: "", reason: "" }),
        p());
    },
    q = async (t) => {
      const { error: a } = await c
        .from("leave_requests")
        .update({ status: "cancelled" })
        .eq("id", t);
      if (a) return n.error(a.message);
      (n.success("Cancelled"), p());
    },
    w = async (t, a) => {
      if (!d) return;
      const { error: o } = await c
        .from("leave_requests")
        .update({ status: a, reviewed_by: d.id, reviewed_at: new Date().toISOString() })
        .eq("id", t);
      if (o) return n.error(o.message);
      (n.success(`Leave ${a}`), p());
    };
  return _
    ? _
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
          e.jsx(E, {
            title: "Leave Requests",
            breadcrumb: u ? "Parent" : "Staff",
            actions: u
              ? e.jsxs("button", {
                  onClick: () => {
                    (m((t) => ({ ...t, student_id: x[0]?.id ?? "" })), g(!0));
                  },
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1",
                  children: [e.jsx(F, { className: "size-4" }), " Apply for leave"],
                })
              : null,
          }),
          e.jsx("div", {
            className: "flex-1 overflow-y-auto p-8",
            children:
              j.length === 0
                ? e.jsxs("div", {
                    className:
                      "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                    children: [
                      e.jsx(z, { className: "size-10 text-muted-foreground mx-auto" }),
                      e.jsx("h3", {
                        className: "font-semibold mt-3",
                        children: "No leave requests yet",
                      }),
                      e.jsx("p", {
                        className: "text-sm text-muted-foreground mt-1",
                        children: u
                          ? "Apply for a leave when your child can't attend school."
                          : "Parent leave requests will appear here.",
                      }),
                    ],
                  })
                : e.jsx("div", {
                    className: "space-y-3",
                    children: j.map((t) =>
                      e.jsxs(
                        "div",
                        {
                          className:
                            "bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4",
                          children: [
                            e.jsxs("div", {
                              className: "min-w-0",
                              children: [
                                e.jsxs("div", {
                                  className: "flex items-center gap-2 flex-wrap",
                                  children: [
                                    e.jsx("p", {
                                      className: "font-medium",
                                      children: t.students?.full_name ?? "Student",
                                    }),
                                    e.jsx(I, { status: t.status }),
                                  ],
                                }),
                                e.jsxs("p", {
                                  className: "text-sm text-muted-foreground mt-1",
                                  children: [
                                    t.start_date,
                                    t.end_date !== t.start_date ? ` → ${t.end_date}` : "",
                                  ],
                                }),
                                e.jsxs("p", {
                                  className: "text-sm mt-2 italic",
                                  children: ['"', t.reason, '"'],
                                }),
                                t.review_note &&
                                  e.jsxs("p", {
                                    className: "text-xs text-muted-foreground mt-1",
                                    children: ["Note: ", t.review_note],
                                  }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex items-center gap-2 shrink-0",
                              children: [
                                u &&
                                  t.status === "pending" &&
                                  e.jsx("button", {
                                    onClick: () => q(t.id),
                                    className:
                                      "text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-md hover:bg-accent",
                                    children: "Cancel",
                                  }),
                                b &&
                                  t.status === "pending" &&
                                  e.jsxs(e.Fragment, {
                                    children: [
                                      e.jsxs("button", {
                                        onClick: () => w(t.id, "approved"),
                                        className:
                                          "text-xs font-medium bg-success-soft text-success px-3 py-1.5 rounded-md inline-flex items-center gap-1",
                                        children: [e.jsx(R, { className: "size-3" }), " Approve"],
                                      }),
                                      e.jsxs("button", {
                                        onClick: () => w(t.id, "rejected"),
                                        className:
                                          "text-xs font-medium bg-danger-soft text-danger px-3 py-1.5 rounded-md inline-flex items-center gap-1",
                                        children: [e.jsx(A, { className: "size-3" }), " Reject"],
                                      }),
                                    ],
                                  }),
                              ],
                            }),
                          ],
                        },
                        t.id,
                      ),
                    ),
                  }),
          }),
          C &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
              onClick: () => g(!1),
              children: e.jsxs("div", {
                className: "bg-card border border-border rounded-xl p-6 w-full max-w-md",
                onClick: (t) => t.stopPropagation(),
                children: [
                  e.jsx("h3", { className: "font-semibold text-lg", children: "Apply for leave" }),
                  e.jsxs("div", {
                    className: "space-y-3 mt-4",
                    children: [
                      x.length > 1 &&
                        e.jsxs("label", {
                          className: "block text-sm",
                          children: [
                            e.jsx("span", {
                              className: "text-muted-foreground",
                              children: "Child",
                            }),
                            e.jsx("select", {
                              value: s.student_id,
                              onChange: (t) => m({ ...s, student_id: t.target.value }),
                              className:
                                "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                              children: x.map((t) =>
                                e.jsx("option", { value: t.id, children: t.full_name }, t.id),
                              ),
                            }),
                          ],
                        }),
                      e.jsxs("div", {
                        className: "grid grid-cols-2 gap-3",
                        children: [
                          e.jsxs("label", {
                            className: "block text-sm",
                            children: [
                              e.jsx("span", {
                                className: "text-muted-foreground",
                                children: "From",
                              }),
                              e.jsx("input", {
                                type: "date",
                                value: s.start_date,
                                onChange: (t) => m({ ...s, start_date: t.target.value }),
                                className:
                                  "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                              }),
                            ],
                          }),
                          e.jsxs("label", {
                            className: "block text-sm",
                            children: [
                              e.jsx("span", { className: "text-muted-foreground", children: "To" }),
                              e.jsx("input", {
                                type: "date",
                                value: s.end_date,
                                onChange: (t) => m({ ...s, end_date: t.target.value }),
                                className:
                                  "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("label", {
                        className: "block text-sm",
                        children: [
                          e.jsx("span", { className: "text-muted-foreground", children: "Reason" }),
                          e.jsx("textarea", {
                            value: s.reason,
                            onChange: (t) => m({ ...s, reason: t.target.value }),
                            rows: 3,
                            placeholder: "e.g. Fever, family function...",
                            className:
                              "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex justify-end gap-2 mt-5",
                    children: [
                      e.jsx("button", {
                        onClick: () => g(!1),
                        className: "px-4 py-1.5 text-sm border border-border rounded-md",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        onClick: S,
                        disabled: N,
                        className:
                          "px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                        children: N ? "Submitting..." : "Submit",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
}
function I({ status: i }) {
  const d = {
    pending: "bg-warning-soft text-warning",
    approved: "bg-success-soft text-success",
    rejected: "bg-danger-soft text-danger",
    cancelled: "bg-accent text-accent-foreground",
  };
  return e.jsx("span", {
    className: `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${d[i] ?? "bg-accent"}`,
    children: i,
  });
}
export { H as component };
