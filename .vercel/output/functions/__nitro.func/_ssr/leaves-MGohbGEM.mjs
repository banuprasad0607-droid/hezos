import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { a3 as Plus, i as CalendarCheck, l as Check, au as X } from "../_libs/lucide-react.mjs";
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
function LeavesPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isStaff =
    roles.includes("admin") || roles.includes("teacher") || roles.includes("super_admin");
  const isParent = roles.includes("parent") && !isStaff;
  usePageTitle("Leave Requests");
  const [children, setChildren] = reactExports.useState([]);
  const [leaves, setLeaves] = reactExports.useState([]);
  const [open, setOpen] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    student_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [submitting, setSubmitting] = reactExports.useState(false);
  const load = reactExports.useCallback(async () => {
    if (isParent && user) {
      const { data: kids } = await supabase
        .from("students")
        .select("id, full_name, school_id")
        .eq("parent_user_id", user.id);
      setChildren(kids ?? []);
      const kidsMap = {};
      (kids ?? []).forEach((k) => {
        kidsMap[k.id] = k.full_name;
      });
      const { data } = await supabase
        .from("leave_requests")
        .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
        .eq("parent_user_id", user.id)
        .order("created_at", {
          ascending: false,
        });
      const mapped = (data ?? []).map((l) => ({
        ...l,
        students: l.student_id
          ? {
              full_name: kidsMap[l.student_id] || "Student",
            }
          : null,
      }));
      setLeaves(mapped);
    } else if (isStaff && effectiveSchoolId) {
      const { data: schoolStudents } = await supabase
        .from("students")
        .select("id, full_name")
        .eq("school_id", effectiveSchoolId);
      const studentMap = {};
      (schoolStudents ?? []).forEach((s) => {
        studentMap[s.id] = s.full_name;
      });
      const { data } = await supabase
        .from("leave_requests")
        .select("id, student_id, start_date, end_date, reason, status, review_note, created_at")
        .eq("school_id", effectiveSchoolId)
        .order("created_at", {
          ascending: false,
        });
      const mapped = (data ?? []).map((l) => ({
        ...l,
        students: l.student_id
          ? {
              full_name: studentMap[l.student_id] || "Student",
            }
          : null,
      }));
      setLeaves(mapped);
    }
  }, [isParent, isStaff, user, effectiveSchoolId]);
  reactExports.useEffect(() => {
    void load();
  }, [load]);
  const submit = async () => {
    if (!user) return;
    const child = children.find((c) => c.id === form.student_id) ?? children[0];
    if (!child) return toast.error("No child linked to your account");
    if (!form.start_date || !form.end_date || !form.reason.trim())
      return toast.error("Fill all fields");
    if (form.end_date < form.start_date) return toast.error("End date must be after start date");
    setSubmitting(true);
    const { error } = await supabase.from("leave_requests").insert({
      school_id: child.school_id,
      student_id: child.id,
      parent_user_id: user.id,
      start_date: form.start_date,
      end_date: form.end_date,
      reason: form.reason.trim(),
    });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Leave request submitted");
    setOpen(false);
    setForm({
      student_id: "",
      start_date: "",
      end_date: "",
      reason: "",
    });
    void load();
  };
  const cancel = async (id) => {
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status: "cancelled",
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Cancelled");
    void load();
  };
  const review = async (id, status) => {
    if (!user) return;
    const { error } = await supabase
      .from("leave_requests")
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Leave ${status}`);
    void load();
  };
  if (tenantLoading) {
    if (tenantLoading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading...",
            }),
          ],
        }),
      });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-background min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading...",
          }),
        ],
      }),
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Leave Requests",
        breadcrumb: isParent ? "Parent" : "Staff",
        actions: isParent
          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
              onClick: () => {
                setForm((f) => ({
                  ...f,
                  student_id: children[0]?.id ?? "",
                }));
                setOpen(true);
              },
              className:
                "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                " Apply for leave",
              ],
            })
          : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 overflow-y-auto p-8",
        children:
          leaves.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, {
                    className: "size-10 text-muted-foreground mx-auto",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "font-semibold mt-3",
                    children: "No leave requests yet",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-sm text-muted-foreground mt-1",
                    children: isParent
                      ? "Apply for a leave when your child can't attend school."
                      : "Parent leave requests will appear here.",
                  }),
                ],
              })
            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "space-y-3",
                children: leaves.map((l) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className:
                        "bg-card border border-border rounded-xl p-5 flex items-start justify-between gap-4",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "flex items-center gap-2 flex-wrap",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "font-medium",
                                  children: l.students?.full_name ?? "Student",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, {
                                  status: l.status,
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-sm text-muted-foreground mt-1",
                              children: [
                                l.start_date,
                                l.end_date !== l.start_date ? ` → ${l.end_date}` : "",
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-sm mt-2 italic",
                              children: ['"', l.reason, '"'],
                            }),
                            l.review_note &&
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                className: "text-xs text-muted-foreground mt-1",
                                children: ["Note: ", l.review_note],
                              }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center gap-2 shrink-0",
                          children: [
                            isParent &&
                              l.status === "pending" &&
                              /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                onClick: () => cancel(l.id),
                                className:
                                  "text-xs text-muted-foreground border border-border px-3 py-1.5 rounded-md hover:bg-accent",
                                children: "Cancel",
                              }),
                            isStaff &&
                              l.status === "pending" &&
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () => review(l.id, "approved"),
                                    className:
                                      "text-xs font-medium bg-success-soft text-success px-3 py-1.5 rounded-md inline-flex items-center gap-1",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, {
                                        className: "size-3",
                                      }),
                                      " Approve",
                                    ],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                    onClick: () => review(l.id, "rejected"),
                                    className:
                                      "text-xs font-medium bg-danger-soft text-danger px-3 py-1.5 rounded-md inline-flex items-center gap-1",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx(X, {
                                        className: "size-3",
                                      }),
                                      " Reject",
                                    ],
                                  }),
                                ],
                              }),
                          ],
                        }),
                      ],
                    },
                    l.id,
                  ),
                ),
              }),
      }),
      open &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50",
          onClick: () => setOpen(false),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-card border border-border rounded-xl p-6 w-full max-w-md",
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "font-semibold text-lg",
                children: "Apply for leave",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "space-y-3 mt-4",
                children: [
                  children.length > 1 &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                      className: "block text-sm",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-muted-foreground",
                          children: "Child",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                          value: form.student_id,
                          onChange: (e) =>
                            setForm({
                              ...form,
                              student_id: e.target.value,
                            }),
                          className:
                            "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                          children: children.map((c) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: c.id, children: c.full_name },
                              c.id,
                            ),
                          ),
                        }),
                      ],
                    }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                        className: "block text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "From",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "date",
                            value: form.start_date,
                            onChange: (e) =>
                              setForm({
                                ...form,
                                start_date: e.target.value,
                              }),
                            className:
                              "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                        className: "block text-sm",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-muted-foreground",
                            children: "To",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                            type: "date",
                            value: form.end_date,
                            onChange: (e) =>
                              setForm({
                                ...form,
                                end_date: e.target.value,
                              }),
                            className:
                              "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                          }),
                        ],
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", {
                    className: "block text-sm",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "text-muted-foreground",
                        children: "Reason",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                        value: form.reason,
                        onChange: (e) =>
                          setForm({
                            ...form,
                            reason: e.target.value,
                          }),
                        rows: 3,
                        placeholder: "e.g. Fever, family function...",
                        className:
                          "mt-1 w-full px-3 py-2 border border-border rounded-md bg-background text-sm",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex justify-end gap-2 mt-5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setOpen(false),
                    className: "px-4 py-1.5 text-sm border border-border rounded-md",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: submit,
                    disabled: submitting,
                    className:
                      "px-4 py-1.5 text-sm bg-primary text-primary-foreground rounded-md disabled:opacity-50",
                    children: submitting ? "Submitting..." : "Submit",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function StatusBadge({ status }) {
  const styles = {
    pending: "bg-warning-soft text-warning",
    approved: "bg-success-soft text-success",
    rejected: "bg-danger-soft text-danger",
    cancelled: "bg-accent text-accent-foreground",
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
    className: `text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${styles[status] ?? "bg-accent"}`,
    children: status,
  });
}
export { LeavesPage as component };
