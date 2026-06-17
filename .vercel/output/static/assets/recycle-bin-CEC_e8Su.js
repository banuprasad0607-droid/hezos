import {
  a0 as z,
  X as C,
  x as s,
  P as E,
  l as p,
  f as D,
  M as r,
  N as n,
  a as T,
  G as A,
  o as P,
} from "./index-DrqTZ7SR.js";
import { k as i } from "./vendor-charts-DECNlt_G.js";
import { C as B } from "./calendar-DZf17yvJ.js";
import { M as F } from "./message-square-BVAiuQO7.js";
import { F as I } from "./file-text-DPnrzn5L.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function J() {
  const { currentSchoolId: d, roles: m, loading: h } = z(),
    g = m.includes("super_admin"),
    u = m.includes("admin") || g;
  C("Recycle Bin");
  const [y, b] = i.useState([]),
    [_, x] = i.useState(!1),
    [l, v] = i.useState("all"),
    c = async () => {
      if (!(!d || !u)) {
        x(!0);
        try {
          const e = [],
            { data: a } = await r
              .from("students")
              .select("id, full_name, admission_number, deleted_at")
              .eq("school_id", d)
              .not("deleted_at", "is", null);
          (a ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "student",
              name: t.full_name,
              subtext: `Admission No: ${t.admission_number || "—"}`,
              deleted_at: t.deleted_at,
            });
          });
          const { data: o } = await r
            .from("classes")
            .select("id, name, grade, section, deleted_at")
            .eq("school_id", d)
            .not("deleted_at", "is", null);
          (o ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "class",
              name: t.name,
              subtext: `Grade: ${t.grade || "—"} · Section: ${t.section || "—"}`,
              deleted_at: t.deleted_at,
            });
          });
          const { data: k } = await r
            .from("fee_invoices")
            .select("id, title, amount_due, due_date, deleted_at")
            .eq("school_id", d)
            .not("deleted_at", "is", null);
          (k ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "invoice",
              name: t.title,
              subtext: `Amount Due: ₹${t.amount_due} · Due: ${t.due_date}`,
              deleted_at: t.deleted_at,
            });
          });
          const { data: q } = await r
            .from("remarks")
            .select("id, category, content, deleted_at")
            .eq("school_id", d)
            .not("deleted_at", "is", null);
          (q ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "remark",
              name: `Remark Category: ${t.category}`,
              subtext: t.content.length > 50 ? `${t.content.slice(0, 50)}...` : t.content,
              deleted_at: t.deleted_at,
            });
          });
          const { data: R } = await r
            .from("exams")
            .select("id, name, date, deleted_at")
            .eq("school_id", d)
            .not("deleted_at", "is", null);
          (R ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "exam",
              name: t.name,
              subtext: `Exam Date: ${t.date || "—"}`,
              deleted_at: t.deleted_at,
            });
          });
          const { data: $ } = await r
            .from("attendance")
            .select("id, date, status, deleted_at, students(full_name)")
            .eq("school_id", d)
            .not("deleted_at", "is", null);
          (($ ?? []).forEach((t) => {
            e.push({
              id: t.id,
              type: "attendance",
              name: `Attendance record for ${t.students?.full_name || "Unknown Student"}`,
              subtext: `Date: ${t.date} · Status: ${t.status}`,
              deleted_at: t.deleted_at,
            });
          }),
            e.sort((t, S) => new Date(S.deleted_at).getTime() - new Date(t.deleted_at).getTime()),
            b(e));
        } catch (e) {
          n.error(e.message || "Failed to load recycle bin records.");
        } finally {
          x(!1);
        }
      }
    };
  i.useEffect(() => {
    c();
  }, [d]);
  const j = async (e) => {
      if (d) {
        n.loading("Restoring record...");
        try {
          let a = "";
          e.type === "student"
            ? (a = "students")
            : e.type === "class"
              ? (a = "classes")
              : e.type === "invoice"
                ? (a = "fee_invoices")
                : e.type === "remark"
                  ? (a = "remarks")
                  : e.type === "exam"
                    ? (a = "exams")
                    : e.type === "attendance" && (a = "attendance");
          const { error: o } = await r
            .from(a)
            .update({ deleted_at: null })
            .eq("id", e.id)
            .eq("school_id", d);
          if (o) throw o;
          (e.type === "invoice"
            ? await r
                .from("fee_payments")
                .update({ deleted_at: null })
                .eq("invoice_id", e.id)
                .eq("school_id", d)
            : e.type === "exam" &&
              (await r
                .from("mark_entries")
                .update({ deleted_at: null })
                .eq("exam_id", e.id)
                .eq("school_id", d)),
            n.dismiss(),
            n.success(`${e.type.toUpperCase()} record restored successfully.`),
            c());
        } catch (a) {
          (n.dismiss(), n.error(a.message || "Failed to restore record."));
        }
      }
    },
    N = async (e) => {
      if (
        d &&
        confirm(
          "Are you sure you want to permanently delete this record? This action CANNOT be undone.",
        )
      ) {
        n.loading("Permanently deleting...");
        try {
          e.type === "invoice"
            ? await r.from("fee_payments").delete().eq("invoice_id", e.id).eq("school_id", d)
            : e.type === "exam" &&
              (await r.from("mark_entries").delete().eq("exam_id", e.id).eq("school_id", d));
          let a = "";
          e.type === "student"
            ? (a = "students")
            : e.type === "class"
              ? (a = "classes")
              : e.type === "invoice"
                ? (a = "fee_invoices")
                : e.type === "remark"
                  ? (a = "remarks")
                  : e.type === "exam"
                    ? (a = "exams")
                    : e.type === "attendance" && (a = "attendance");
          const { error: o } = await r.from(a).delete().eq("id", e.id).eq("school_id", d);
          if ((n.dismiss(), o)) throw o;
          (n.success("Record permanently purged."), c());
        } catch (a) {
          (n.dismiss(), n.error(a.message || "Failed to purge record."));
        }
      }
    };
  if (h)
    return s.jsx("div", {
      className:
        "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
      children: s.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          s.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          s.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading recycle bin...",
          }),
        ],
      }),
    });
  if (!u)
    return s.jsx("div", {
      className:
        "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
      children: "Unauthorized access. Only school administrators can access the Recycle Bin.",
    });
  const f = y.filter((e) => l === "all" || e.type === l),
    w = (e) => {
      switch (e) {
        case "student":
          return s.jsx(P, { className: "size-4 text-blue-500" });
        case "class":
          return s.jsx(A, { className: "size-4 text-emerald-500" });
        case "invoice":
          return s.jsx(I, { className: "size-4 text-amber-500" });
        case "remark":
          return s.jsx(F, { className: "size-4 text-indigo-500" });
        case "exam":
          return s.jsx(T, { className: "size-4 text-pink-500" });
        case "attendance":
          return s.jsx(B, { className: "size-4 text-sky-500" });
      }
    };
  return s.jsxs(s.Fragment, {
    children: [
      s.jsx(E, { title: "Recycle Bin", breadcrumb: "Archived & soft-deleted records" }),
      s.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          s.jsx("div", {
            className: "flex gap-2 border-b border-border pb-px overflow-x-auto",
            children: ["all", "student", "class", "invoice", "remark", "exam", "attendance"].map(
              (e) =>
                s.jsx(
                  "button",
                  {
                    onClick: () => v(e),
                    className: `px-4 py-2 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${l === e ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`,
                    children: e.toUpperCase(),
                  },
                  e,
                ),
            ),
          }),
          _
            ? s.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Scanning archives...",
              })
            : f.length === 0
              ? s.jsxs("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                  children: [
                    s.jsx(p, { className: "size-10 mx-auto text-muted-foreground" }),
                    s.jsx("h3", { className: "font-semibold mt-3", children: "Recycle Bin Empty" }),
                    s.jsx("p", {
                      className: "text-sm text-muted-foreground mt-1",
                      children: "No soft-deleted records matching this tab were found.",
                    }),
                  ],
                })
              : s.jsx("div", {
                  className:
                    "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                  children: s.jsx("div", {
                    className: "divide-y divide-border",
                    children: f.map((e) =>
                      s.jsxs(
                        "div",
                        {
                          className:
                            "p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors",
                          children: [
                            s.jsxs("div", {
                              className: "flex items-center gap-4",
                              children: [
                                s.jsx("div", {
                                  className:
                                    "size-8 rounded-lg bg-secondary flex items-center justify-center shrink-0",
                                  children: w(e.type),
                                }),
                                s.jsxs("div", {
                                  children: [
                                    s.jsx("p", {
                                      className: "font-semibold text-sm text-foreground",
                                      children: e.name,
                                    }),
                                    s.jsx("p", {
                                      className: "text-xs text-muted-foreground mt-0.5",
                                      children: e.subtext,
                                    }),
                                    s.jsxs("p", {
                                      className: "text-[10px] text-muted-foreground mt-1",
                                      children: [
                                        "Deleted at: ",
                                        new Date(e.deleted_at).toLocaleString(),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            s.jsxs("div", {
                              className: "flex gap-2",
                              children: [
                                s.jsxs("button", {
                                  onClick: () => j(e),
                                  className:
                                    "px-3 py-1.5 text-xs font-semibold bg-emerald-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-emerald-600 cursor-pointer",
                                  title: "Restore Record",
                                  children: [s.jsx(D, { className: "size-3.5" }), " Restore"],
                                }),
                                s.jsxs("button", {
                                  onClick: () => N(e),
                                  className:
                                    "px-3 py-1.5 text-xs font-semibold bg-rose-500 text-white rounded-md inline-flex items-center gap-1 hover:bg-rose-600 cursor-pointer",
                                  title: "Permanently Purge",
                                  children: [s.jsx(p, { className: "size-3.5" }), " Purge"],
                                }),
                              ],
                            }),
                          ],
                        },
                        e.id,
                      ),
                    ),
                  }),
                }),
        ],
      }),
    ],
  });
}
export { J as component };
