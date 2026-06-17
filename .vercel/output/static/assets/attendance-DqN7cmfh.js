import { a0 as we, X as Se, M as y, N as f, x as e, P as ke, S as Ce } from "./index-DrqTZ7SR.js";
import { k as l } from "./vendor-charts-DECNlt_G.js";
import { W as $e } from "./WhatsAppBroadcast-DN6Mi9QW.js";
import { e as ie, a as ue, b as xe } from "./export-helper-D-BWKL3x.js";
import { w as me } from "./whatsapp-service-BVS3HosY.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
import "./notify-CFlpE6Mr.js";
import "./x-DH-xwxwM.js";
import "./phone-BvCyC-cH.js";
import "./send-DBUz72Lj.js";
const fe = [
  {
    value: "present",
    label: "Present",
    color: "bg-success-soft text-success ring-1 ring-success/20",
  },
  { value: "absent", label: "Absent", color: "bg-danger-soft text-danger ring-1 ring-danger/20" },
  { value: "late", label: "Late", color: "bg-warning-soft text-warning ring-1 ring-warning/20" },
  { value: "half_day", label: "Half", color: "bg-brand-soft text-brand ring-1 ring-brand/20" },
];
function Oe() {
  const { currentSchoolId: x, user: R, roles: te, loading: re } = we(),
    U = te.includes("admin") || te.includes("super_admin");
  Se("Attendance");
  const [u, F] = l.useState("daily"),
    [I, be] = l.useState([]),
    [h, X] = l.useState(""),
    [$, pe] = l.useState(() => new Date().toISOString().slice(0, 10)),
    [M, B] = l.useState([]),
    [D, G] = l.useState({}),
    [b, se] = l.useState(() => new Date().toISOString().slice(0, 7)),
    [he, ae] = l.useState({}),
    [z, de] = l.useState([]),
    [H, ge] = l.useState(() => new Date().toISOString().slice(0, 10)),
    [J, K] = l.useState({}),
    [ye, ne] = l.useState({}),
    [Y, oe] = l.useState(""),
    [w, le] = l.useState(""),
    [v, O] = l.useState(0),
    [S] = l.useState(10),
    [E, V] = l.useState(0),
    [_e, A] = l.useState(!1);
  (l.useEffect(() => {
    const t = setTimeout(() => {
      (le(Y), O(0));
    }, 400);
    return () => clearTimeout(t);
  }, [Y]),
    l.useEffect(() => {
      (oe(""), le(""), O(0), V(0), B([]), de([]));
    }, [u, h]));
  const {
    year: Me,
    month: De,
    daysInMonth: T,
    daysArray: k,
  } = l.useMemo(() => {
    const [t, a] = b.split("-"),
      s = parseInt(t, 10),
      d = parseInt(a, 10) - 1,
      p = new Date(s, d + 1, 0).getDate();
    return {
      year: s,
      month: d,
      daysInMonth: p,
      daysArray: Array.from({ length: p }, (r, c) => c + 1),
    };
  }, [b]);
  (l.useEffect(() => {
    x &&
      y
        .from("classes")
        .select("id, name")
        .eq("school_id", x)
        .is("deleted_at", null)
        .order("name")
        .then(({ data: t }) => {
          (be(t ?? []), t?.[0] && !h && X(t[0].id));
        });
  }, [x]),
    l.useEffect(() => {
      !h ||
        u !== "daily" ||
        (async () => {
          A(!0);
          try {
            let t = y
              .from("students")
              .select("id, full_name, roll_number, parent_name, parent_phone", { count: "exact" })
              .eq("class_id", h)
              .is("deleted_at", null);
            w.trim() && (t = t.ilike("full_name", `%${w.trim()}%`));
            const a = v * S,
              s = a + S - 1,
              { data: d, count: p, error: r } = await t.order("full_name").range(a, s);
            if (r) throw r;
            (B(d ?? []), V(p ?? 0));
            const c = (d ?? []).map((i) => i.id);
            if (c.length > 0) {
              const { data: i, error: _ } = await y
                .from("attendance")
                .select("student_id, status")
                .eq("class_id", h)
                .eq("date", $)
                .is("deleted_at", null)
                .in("student_id", c);
              if (_) throw _;
              const n = {};
              ((i ?? []).forEach((g) => {
                n[g.student_id] = g.status;
              }),
                G(n));
            } else G({});
          } catch (t) {
            f.error(t.message || "Failed to load daily attendance.");
          } finally {
            A(!1);
          }
        })();
    }, [h, $, u, w, v]),
    l.useEffect(() => {
      !h ||
        u !== "student-matrix" ||
        !b ||
        (async () => {
          A(!0);
          try {
            let t = y
              .from("students")
              .select("id, full_name, roll_number, parent_name, parent_phone", { count: "exact" })
              .eq("class_id", h)
              .is("deleted_at", null);
            w.trim() && (t = t.ilike("full_name", `%${w.trim()}%`));
            const a = v * S,
              s = a + S - 1,
              { data: d, count: p, error: r } = await t.order("full_name").range(a, s);
            if (r) throw r;
            (B(d ?? []), V(p ?? 0));
            const c = (d ?? []).map((i) => i.id);
            if (c.length > 0) {
              const i = `${b}-01`,
                _ = `${b}-${String(T).padStart(2, "0")}`,
                { data: n, error: g } = await y
                  .from("attendance")
                  .select("student_id, date, status")
                  .eq("class_id", h)
                  .is("deleted_at", null)
                  .in("student_id", c)
                  .gte("date", i)
                  .lte("date", _);
              if (g) throw g;
              const o = {};
              ((n ?? []).forEach((m) => {
                const j = parseInt(m.date.split("-")[2], 10);
                (o[m.student_id] || (o[m.student_id] = {}), (o[m.student_id][j] = m.status));
              }),
                ae(o));
            } else ae({});
          } catch (t) {
            f.error(t.message || "Failed to load student matrix.");
          } finally {
            A(!1);
          }
        })();
    }, [h, b, u, T, w, v]),
    l.useEffect(() => {
      !x ||
        (u !== "teacher-daily" && u !== "teacher-matrix") ||
        (async () => {
          A(!0);
          try {
            const a = (
              (await y.from("user_roles").select("user_id, role").eq("school_id", x)).data || []
            )
              .filter((n) => n.role === "admin" || n.role === "teacher")
              .map((n) => n.user_id);
            let s = y
              .from("profiles")
              .select("user_id, full_name, employee_id", { count: "exact" })
              .eq("school_id", x)
              .in("user_id", a.length ? a : ["00000000-0000-0000-0000-000000000000"]);
            w.trim() && (s = s.ilike("full_name", `%${w.trim()}%`));
            const d = v * S,
              p = d + S - 1,
              { data: r, count: c, error: i } = await s.order("full_name").range(d, p);
            if (i) throw i;
            (de(r ?? []), V(c ?? 0));
            const _ = (r ?? []).map((n) => n.user_id);
            if (_.length > 0)
              if (u === "teacher-daily") {
                const { data: n, error: g } = await y
                  .from("teacher_attendance")
                  .select("teacher_id, status")
                  .eq("school_id", x)
                  .eq("date", H)
                  .is("deleted_at", null)
                  .in("teacher_id", _);
                if (g) throw g;
                const o = {};
                ((n || []).forEach((m) => {
                  o[m.teacher_id] = m.status;
                }),
                  K(o));
              } else {
                const n = `${b}-01`,
                  g = `${b}-${String(T).padStart(2, "0")}`,
                  { data: o, error: m } = await y
                    .from("teacher_attendance")
                    .select("teacher_id, date, status")
                    .eq("school_id", x)
                    .is("deleted_at", null)
                    .in("teacher_id", _)
                    .gte("date", n)
                    .lte("date", g);
                if (m) throw m;
                const j = {};
                ((o || []).forEach((N) => {
                  const L = parseInt(N.date.split("-")[2], 10);
                  (j[N.teacher_id] || (j[N.teacher_id] = {}), (j[N.teacher_id][L] = N.status));
                }),
                  ne(j));
              }
            else (K({}), ne({}));
          } catch (t) {
            f.error(t.message || "Failed to load staff list.");
          } finally {
            A(!1);
          }
        })();
    }, [x, H, b, u, T, w, v]));
  const je = async (t, a) => {
      if (!x || !R || !h) return;
      G((d) => ({ ...d, [t]: a }));
      const { error: s } = await y
        .from("attendance")
        .upsert(
          { school_id: x, class_id: h, student_id: t, date: $, status: a, marked_by: R.id },
          { onConflict: "student_id,date" },
        );
      s
        ? f.error(s.message)
        : a === "absent" &&
          (async () => {
            try {
              const { data: d } = await y
                .from("students")
                .select("full_name, parent_user_id, emergency_contact")
                .eq("id", t)
                .single();
              if (d) {
                const r = (await me.getTemplates(x)).find((c) => c.name === "absent_alert");
                if (r) {
                  const c = d.emergency_contact || "+91 90000 00000";
                  (await me.sendTemplateMessage(x, c, r.id, [d.full_name], t, d.parent_user_id),
                    f.success(`WhatsApp absent alert triggered for ${d.full_name}.`));
                }
              }
            } catch (d) {
              console.error("WhatsApp absent alert trigger failed:", d);
            }
          })();
    },
    Ne = async (t, a) => {
      if (!x || !R) return;
      K((d) => ({ ...d, [t]: a }));
      const { error: s } = await y
        .from("teacher_attendance")
        .upsert(
          { school_id: x, teacher_id: t, date: H, status: a, marked_by: R.id },
          { onConflict: "teacher_id,date" },
        );
      s && f.error(s.message);
    },
    q = I.find((t) => t.id === h)?.name ?? "Class",
    Z = async (t) => {
      if (!(!h || !x)) {
        f.loading("Preparing export...");
        try {
          const { data: a } = await y
            .from("students")
            .select("id, full_name, roll_number")
            .eq("class_id", h)
            .is("deleted_at", null)
            .order("full_name");
          if (!a || a.length === 0) {
            (f.dismiss(), f.error("No students to export."));
            return;
          }
          const s = `${b}-01`,
            d = `${b}-${String(T).padStart(2, "0")}`,
            { data: p } = await y
              .from("attendance")
              .select("student_id, date, status")
              .eq("class_id", h)
              .is("deleted_at", null)
              .gte("date", s)
              .lte("date", d),
            r = {};
          (p ?? []).forEach((n) => {
            const g = parseInt(n.date.split("-")[2], 10);
            (r[n.student_id] || (r[n.student_id] = {}), (r[n.student_id][g] = n.status));
          });
          const c = [
              "Student Name",
              "Roll Number",
              ...k.map((n) => `Day ${n}`),
              "Present Days",
              "Total Marked",
              "Attendance Rate %",
            ],
            i = a.map((n) => {
              const g = r[n.id] || {};
              let o = 0,
                m = 0;
              const j = k.map((L) => {
                  const C = g[L];
                  return C
                    ? (m++,
                      (C === "present" || C === "late" || C === "half_day") &&
                        (o += C === "half_day" ? 0.5 : 1),
                      C.toUpperCase())
                    : "—";
                }),
                N = m > 0 ? `${Math.round((o / m) * 100)}%` : "—";
              return [n.full_name, n.roll_number || "—", ...j, o, m, N];
            });
          f.dismiss();
          const _ = `Student_Attendance_Matrix_${q}_${b}`;
          (t === "csv"
            ? ie(_, c, i)
            : t === "excel"
              ? ue(_, c, i)
              : t === "pdf" && xe(_, `Student Attendance Matrix - ${q} (${b})`, c, i),
            f.success("Export started!"));
        } catch (a) {
          (f.dismiss(), f.error(a.message || "Export failed."));
        }
      }
    },
    ee = async (t) => {
      if (x) {
        f.loading("Preparing export...");
        try {
          const s = (
              (await y.from("user_roles").select("user_id, role").eq("school_id", x)).data || []
            )
              .filter((o) => o.role === "admin" || o.role === "teacher")
              .map((o) => o.user_id),
            { data: d } = await y
              .from("profiles")
              .select("user_id, full_name, employee_id")
              .eq("school_id", x)
              .in("user_id", s.length ? s : ["00000000-0000-0000-0000-000000000000"])
              .order("full_name");
          if (!d || d.length === 0) {
            (f.dismiss(), f.error("No staff to export."));
            return;
          }
          const p = `${b}-01`,
            r = `${b}-${String(T).padStart(2, "0")}`,
            { data: c } = await y
              .from("teacher_attendance")
              .select("teacher_id, date, status")
              .eq("school_id", x)
              .gte("date", p)
              .lte("date", r),
            i = {};
          (c || []).forEach((o) => {
            const m = parseInt(o.date.split("-")[2], 10);
            (i[o.teacher_id] || (i[o.teacher_id] = {}), (i[o.teacher_id][m] = o.status));
          });
          const _ = [
              "Staff Name",
              "Employee ID",
              ...k.map((o) => `Day ${o}`),
              "Present Days",
              "Total Marked",
              "Attendance Rate %",
            ],
            n = d.map((o) => {
              const m = i[o.user_id] || {};
              let j = 0,
                N = 0;
              const L = k.map((ve) => {
                  const P = m[ve];
                  return P
                    ? (N++,
                      (P === "present" || P === "late" || P === "half_day") &&
                        (j += P === "half_day" ? 0.5 : 1),
                      P.toUpperCase())
                    : "—";
                }),
                C = N > 0 ? `${Math.round((j / N) * 100)}%` : "—";
              return [o.full_name, o.employee_id || "—", ...L, j, N, C];
            });
          f.dismiss();
          const g = `Staff_Attendance_Matrix_${b}`;
          (t === "csv"
            ? ie(g, _, n)
            : t === "excel"
              ? ue(g, _, n)
              : t === "pdf" && xe(g, `Staff Attendance Matrix (${b})`, _, n),
            f.success("Export started!"));
        } catch (a) {
          (f.dismiss(), f.error(a.message || "Export failed."));
        }
      }
    },
    W = l.useMemo(() => {
      const t = { present: 0, absent: 0, late: 0, half_day: 0 };
      return (
        Object.values(D).forEach((a) => {
          t[a] += 1;
        }),
        t
      );
    }, [D]),
    Q = l.useMemo(() => {
      const t = { present: 0, absent: 0, late: 0, half_day: 0 };
      return (
        Object.values(J).forEach((a) => {
          t[a] += 1;
        }),
        t
      );
    }, [J]),
    ce = M.filter((t) => D[t.id] === "absent" || D[t.id] === "late").map((t) => ({
      id: t.id,
      name: t.parent_name || `${t.full_name}'s parent`,
      phone: t.parent_phone,
      subtitle: `${t.full_name} · ${D[t.id] === "late" ? "Late" : "Absent"}`,
    }));
  return re
    ? re
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
          e.jsx(ke, {
            title: "Attendance Center",
            breadcrumb: "Operations & Ledgers",
            actions: e.jsxs("div", {
              className: "flex bg-secondary rounded-md p-0.5 border border-border",
              children: [
                e.jsx("button", {
                  onClick: () => F("daily"),
                  className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${u === "daily" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                  children: "Daily Student",
                }),
                e.jsx("button", {
                  onClick: () => F("student-matrix"),
                  className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${u === "student-matrix" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                  children: "Student Matrix",
                }),
                U &&
                  e.jsxs(e.Fragment, {
                    children: [
                      e.jsx("button", {
                        onClick: () => F("teacher-daily"),
                        className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${u === "teacher-daily" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                        children: "Daily Staff",
                      }),
                      e.jsx("button", {
                        onClick: () => F("teacher-matrix"),
                        className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${u === "teacher-matrix" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                        children: "Staff Matrix",
                      }),
                    ],
                  }),
              ],
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
            children: [
              e.jsxs("div", {
                className:
                  "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: [
                      u === "daily" &&
                        e.jsxs(e.Fragment, {
                          children: [
                            e.jsx("input", {
                              type: "date",
                              value: $,
                              onChange: (t) => pe(t.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                            }),
                            e.jsx("select", {
                              value: h,
                              onChange: (t) => X(t.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                              children: I.map((t) =>
                                e.jsx("option", { value: t.id, children: t.name }, t.id),
                              ),
                            }),
                          ],
                        }),
                      u === "student-matrix" &&
                        e.jsxs(e.Fragment, {
                          children: [
                            e.jsx("input", {
                              type: "month",
                              value: b,
                              onChange: (t) => se(t.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                            }),
                            e.jsx("select", {
                              value: h,
                              onChange: (t) => X(t.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                              children: I.map((t) =>
                                e.jsx("option", { value: t.id, children: t.name }, t.id),
                              ),
                            }),
                          ],
                        }),
                      u === "teacher-daily" &&
                        e.jsx("input", {
                          type: "date",
                          value: H,
                          onChange: (t) => ge(t.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                        }),
                      u === "teacher-matrix" &&
                        e.jsx("input", {
                          type: "month",
                          value: b,
                          onChange: (t) => se(t.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                        }),
                      e.jsxs("div", {
                        className: "relative w-44",
                        children: [
                          e.jsx(Ce, {
                            className:
                              "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                          }),
                          e.jsx("input", {
                            value: Y,
                            onChange: (t) => oe(t.target.value),
                            placeholder: "Search...",
                            className:
                              "w-full pl-8 pr-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-brand",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                      u === "daily" &&
                        e.jsx($e, {
                          label: `Notify absentees (${ce.length})`,
                          recipients: ce,
                          defaultMessage: `Hello, your child was marked absent in ${q} on ${$}. Please reach out if this is unexpected.

— ${q} Teacher`,
                          buildMessage: (
                            t,
                          ) => `Hello, ${t.subtitle?.split(" · ")[0] ?? "your child"} was marked ${t.subtitle?.includes("Late") ? "late" : "absent"} in ${q} on ${$}. Please reach out if this is unexpected.

— ${q} Teacher`,
                        }),
                      u === "student-matrix" &&
                        e.jsxs("div", {
                          className:
                            "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                          children: [
                            e.jsx("button", {
                              onClick: () => Z("csv"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                              children: "CSV",
                            }),
                            e.jsx("button", {
                              onClick: () => Z("excel"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                              children: "XLS",
                            }),
                            e.jsx("button", {
                              onClick: () => Z("pdf"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer",
                              children: "PDF",
                            }),
                          ],
                        }),
                      u === "teacher-matrix" &&
                        e.jsxs("div", {
                          className:
                            "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                          children: [
                            e.jsx("button", {
                              onClick: () => ee("csv"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                              children: "CSV",
                            }),
                            e.jsx("button", {
                              onClick: () => ee("excel"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                              children: "XLS",
                            }),
                            e.jsx("button", {
                              onClick: () => ee("pdf"),
                              className:
                                "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer",
                              children: "PDF",
                            }),
                          ],
                        }),
                    ],
                  }),
                ],
              }),
              _e && M.length === 0 && z.length === 0
                ? e.jsx("div", {
                    className: "text-center py-12 text-sm text-muted-foreground",
                    children: "Loading attendance logs...",
                  })
                : u === "daily" &&
                  (I.length === 0
                    ? e.jsx("div", {
                        className:
                          "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                        children: "Create a class first to mark attendance.",
                      })
                    : M.length === 0
                      ? e.jsx("div", {
                          className:
                            "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                          children: "No students found.",
                        })
                      : e.jsx("div", {
                          className: "space-y-4",
                          children: e.jsxs("div", {
                            className:
                              "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                            children: [
                              e.jsxs("div", {
                                className:
                                  "p-4 border-b border-border flex items-center justify-between bg-secondary/10",
                                children: [
                                  e.jsxs("h3", {
                                    className: "font-semibold text-xs",
                                    children: [E, " students total"],
                                  }),
                                  e.jsxs("div", {
                                    className: "flex gap-2 text-xs",
                                    children: [
                                      e.jsxs("span", {
                                        className:
                                          "px-2 py-1 bg-success-soft text-success rounded font-semibold",
                                        children: ["P: ", W.present],
                                      }),
                                      e.jsxs("span", {
                                        className:
                                          "px-2 py-1 bg-danger-soft text-danger rounded font-semibold",
                                        children: ["A: ", W.absent],
                                      }),
                                      e.jsxs("span", {
                                        className:
                                          "px-2 py-1 bg-warning-soft text-warning rounded font-semibold",
                                        children: ["L: ", W.late],
                                      }),
                                      e.jsxs("span", {
                                        className:
                                          "px-2 py-1 bg-brand-soft text-brand rounded font-semibold",
                                        children: ["H: ", W.half_day],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              e.jsxs("table", {
                                className: "w-full text-left text-xs",
                                children: [
                                  e.jsx("thead", {
                                    className:
                                      "bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border",
                                    children: e.jsxs("tr", {
                                      children: [
                                        e.jsx("th", {
                                          className: "px-6 py-3 font-medium",
                                          children: "Student",
                                        }),
                                        e.jsx("th", {
                                          className: "px-6 py-3 font-medium",
                                          children: "Roll",
                                        }),
                                        e.jsx("th", {
                                          className: "px-6 py-3 font-medium text-right",
                                          children: "Mark Status",
                                        }),
                                      ],
                                    }),
                                  }),
                                  e.jsx("tbody", {
                                    className: "divide-y divide-border",
                                    children: M.map((t) => {
                                      const a = D[t.id];
                                      return e.jsxs(
                                        "tr",
                                        {
                                          className: "hover:bg-secondary/10",
                                          children: [
                                            e.jsx("td", {
                                              className: "px-6 py-3.5 font-bold text-foreground",
                                              children: t.full_name,
                                            }),
                                            e.jsxs("td", {
                                              className: "px-6 py-3.5 text-muted-foreground",
                                              children: ["#", t.roll_number ?? "—"],
                                            }),
                                            e.jsx("td", {
                                              className: "px-6 py-3.5",
                                              children: e.jsx("div", {
                                                className: "flex gap-1.5 justify-end",
                                                children: fe.map((s) =>
                                                  e.jsx(
                                                    "button",
                                                    {
                                                      onClick: () => je(t.id, s.value),
                                                      className: `px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${a === s.value ? s.color : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"}`,
                                                      children: s.label,
                                                    },
                                                    s.value,
                                                  ),
                                                ),
                                              }),
                                            }),
                                          ],
                                        },
                                        t.id,
                                      );
                                    }),
                                  }),
                                ],
                              }),
                            ],
                          }),
                        })),
              u === "student-matrix" &&
                (I.length === 0
                  ? e.jsx("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                      children: "Create a class first to view attendance ledger.",
                    })
                  : M.length === 0
                    ? e.jsx("div", {
                        className:
                          "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                        children: "No students found to display matrix.",
                      })
                    : e.jsx("div", {
                        className: "space-y-4",
                        children: e.jsx("div", {
                          className:
                            "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                          children: e.jsx("div", {
                            className: "overflow-x-auto",
                            children: e.jsxs("table", {
                              className: "w-full text-left text-xs border-collapse",
                              children: [
                                e.jsx("thead", {
                                  className:
                                    "bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold",
                                  children: e.jsxs("tr", {
                                    children: [
                                      e.jsx("th", {
                                        className:
                                          "px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground",
                                        children: "Student Name",
                                      }),
                                      k.map((t) =>
                                        e.jsx(
                                          "th",
                                          {
                                            className:
                                              "px-1 py-3 text-center font-bold min-w-[28px] text-foreground",
                                            children: t,
                                          },
                                          t,
                                        ),
                                      ),
                                      e.jsx("th", {
                                        className:
                                          "px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground",
                                        children: "Rate %",
                                      }),
                                    ],
                                  }),
                                }),
                                e.jsx("tbody", {
                                  className: "divide-y divide-border",
                                  children: M.map((t) => {
                                    const a = he[t.id] || {};
                                    let s = 0,
                                      d = 0;
                                    return e.jsxs(
                                      "tr",
                                      {
                                        className: "hover:bg-secondary/15",
                                        children: [
                                          e.jsx("td", {
                                            className:
                                              "px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground",
                                            children: t.full_name,
                                          }),
                                          k.map((p) => {
                                            const r = a[p];
                                            let c = "—",
                                              i = "text-slate-300 dark:text-slate-700";
                                            return (
                                              r &&
                                                (d++,
                                                (r === "present" ||
                                                  r === "late" ||
                                                  r === "half_day") &&
                                                  (s += r === "half_day" ? 0.5 : 1),
                                                (c =
                                                  r === "present"
                                                    ? "P"
                                                    : r === "absent"
                                                      ? "A"
                                                      : r === "late"
                                                        ? "L"
                                                        : "H"),
                                                (i =
                                                  r === "present"
                                                    ? "bg-emerald-500/10 text-emerald-600 font-extrabold rounded"
                                                    : r === "absent"
                                                      ? "bg-red-500/10 text-red-600 font-extrabold rounded"
                                                      : r === "late"
                                                        ? "bg-amber-500/10 text-amber-600 font-extrabold rounded"
                                                        : "bg-indigo-500/10 text-indigo-600 font-extrabold rounded")),
                                              e.jsx(
                                                "td",
                                                {
                                                  className:
                                                    "px-0.5 py-2.5 text-center min-w-[28px]",
                                                  children: e.jsx("span", {
                                                    className: `inline-block size-5 text-center leading-5 text-[10px] ${i}`,
                                                    children: c,
                                                  }),
                                                },
                                                p,
                                              )
                                            );
                                          }),
                                          e.jsx("td", {
                                            className:
                                              "px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border",
                                            children: d > 0 ? `${Math.round((s / d) * 100)}%` : "—",
                                          }),
                                        ],
                                      },
                                      t.id,
                                    );
                                  }),
                                }),
                              ],
                            }),
                          }),
                        }),
                      })),
              u === "teacher-daily" &&
                U &&
                (z.length === 0
                  ? e.jsx("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                      children: "No staff members found.",
                    })
                  : e.jsx("div", {
                      className: "space-y-4",
                      children: e.jsxs("div", {
                        className:
                          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                        children: [
                          e.jsxs("div", {
                            className:
                              "p-4 border-b border-border flex items-center justify-between bg-secondary/10",
                            children: [
                              e.jsxs("h3", {
                                className: "font-semibold text-xs",
                                children: [E, " staff members total"],
                              }),
                              e.jsxs("div", {
                                className: "flex gap-2 text-xs",
                                children: [
                                  e.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-success-soft text-success rounded font-semibold",
                                    children: ["P: ", Q.present],
                                  }),
                                  e.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-danger-soft text-danger rounded font-semibold",
                                    children: ["A: ", Q.absent],
                                  }),
                                  e.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-warning-soft text-warning rounded font-semibold",
                                    children: ["L: ", Q.late],
                                  }),
                                  e.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-brand-soft text-brand rounded font-semibold",
                                    children: ["H: ", Q.half_day],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("table", {
                            className: "w-full text-left text-xs",
                            children: [
                              e.jsx("thead", {
                                className:
                                  "bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border",
                                children: e.jsxs("tr", {
                                  children: [
                                    e.jsx("th", {
                                      className: "px-6 py-3 font-medium",
                                      children: "Staff Member",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-3 font-medium",
                                      children: "Employee ID",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-3 font-medium text-right",
                                      children: "Mark Status",
                                    }),
                                  ],
                                }),
                              }),
                              e.jsx("tbody", {
                                className: "divide-y divide-border",
                                children: z.map((t) => {
                                  const a = J[t.user_id];
                                  return e.jsxs(
                                    "tr",
                                    {
                                      className: "hover:bg-secondary/10",
                                      children: [
                                        e.jsx("td", {
                                          className: "px-6 py-3.5 font-bold text-foreground",
                                          children: t.full_name,
                                        }),
                                        e.jsx("td", {
                                          className:
                                            "px-6 py-3.5 text-muted-foreground font-mono text-[10px]",
                                          children: t.employee_id || "—",
                                        }),
                                        e.jsx("td", {
                                          className: "px-6 py-3.5",
                                          children: e.jsx("div", {
                                            className: "flex gap-1.5 justify-end",
                                            children: fe.map((s) =>
                                              e.jsx(
                                                "button",
                                                {
                                                  onClick: () => Ne(t.user_id, s.value),
                                                  className: `px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${a === s.value ? s.color : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"}`,
                                                  children: s.label,
                                                },
                                                s.value,
                                              ),
                                            ),
                                          }),
                                        }),
                                      ],
                                    },
                                    t.user_id,
                                  );
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    })),
              u === "teacher-matrix" &&
                U &&
                (z.length === 0
                  ? e.jsx("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                      children: "No staff members found.",
                    })
                  : e.jsx("div", {
                      className: "space-y-4",
                      children: e.jsx("div", {
                        className:
                          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                        children: e.jsx("div", {
                          className: "overflow-x-auto",
                          children: e.jsxs("table", {
                            className: "w-full text-left text-xs border-collapse",
                            children: [
                              e.jsx("thead", {
                                className:
                                  "bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold",
                                children: e.jsxs("tr", {
                                  children: [
                                    e.jsx("th", {
                                      className:
                                        "px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground",
                                      children: "Staff Name",
                                    }),
                                    k.map((t) =>
                                      e.jsx(
                                        "th",
                                        {
                                          className:
                                            "px-1 py-3 text-center font-bold min-w-[28px] text-foreground",
                                          children: t,
                                        },
                                        t,
                                      ),
                                    ),
                                    e.jsx("th", {
                                      className:
                                        "px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground",
                                      children: "Rate %",
                                    }),
                                  ],
                                }),
                              }),
                              e.jsx("tbody", {
                                className: "divide-y divide-border",
                                children: z.map((t) => {
                                  const a = ye[t.user_id] || {};
                                  let s = 0,
                                    d = 0;
                                  return e.jsxs(
                                    "tr",
                                    {
                                      className: "hover:bg-secondary/15",
                                      children: [
                                        e.jsx("td", {
                                          className:
                                            "px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground",
                                          children: t.full_name,
                                        }),
                                        k.map((p) => {
                                          const r = a[p];
                                          let c = "—",
                                            i = "text-slate-300 dark:text-slate-700";
                                          return (
                                            r &&
                                              (d++,
                                              (r === "present" ||
                                                r === "late" ||
                                                r === "half_day") &&
                                                (s += r === "half_day" ? 0.5 : 1),
                                              (c =
                                                r === "present"
                                                  ? "P"
                                                  : r === "absent"
                                                    ? "A"
                                                    : r === "late"
                                                      ? "L"
                                                      : "H"),
                                              (i =
                                                r === "present"
                                                  ? "bg-emerald-500/10 text-emerald-600 font-extrabold rounded"
                                                  : r === "absent"
                                                    ? "bg-red-500/10 text-red-600 font-extrabold rounded"
                                                    : r === "late"
                                                      ? "bg-amber-500/10 text-amber-600 font-extrabold rounded"
                                                      : "bg-indigo-500/10 text-indigo-600 font-extrabold rounded")),
                                            e.jsx(
                                              "td",
                                              {
                                                className: "px-0.5 py-2.5 text-center min-w-[28px]",
                                                children: e.jsx("span", {
                                                  className: `inline-block size-5 text-center leading-5 text-[10px] ${i}`,
                                                  children: c,
                                                }),
                                              },
                                              p,
                                            )
                                          );
                                        }),
                                        e.jsx("td", {
                                          className:
                                            "px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border",
                                          children: d > 0 ? `${Math.round((s / d) * 100)}%` : "—",
                                        }),
                                      ],
                                    },
                                    t.user_id,
                                  );
                                }),
                              }),
                            ],
                          }),
                        }),
                      }),
                    })),
              E > 0 &&
                e.jsxs("div", {
                  className:
                    "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
                  children: [
                    e.jsxs("p", {
                      className: "text-xs text-muted-foreground",
                      children: [
                        "Showing ",
                        v * S + 1,
                        " to ",
                        Math.min((v + 1) * S, E),
                        " of ",
                        E,
                        " records",
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex gap-2",
                      children: [
                        e.jsx("button", {
                          disabled: v === 0,
                          onClick: () => O((t) => t - 1),
                          className:
                            "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                          children: "Previous",
                        }),
                        e.jsx("button", {
                          disabled: (v + 1) * S >= E,
                          onClick: () => O((t) => t + 1),
                          className:
                            "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                          children: "Next",
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
export { Oe as component };
