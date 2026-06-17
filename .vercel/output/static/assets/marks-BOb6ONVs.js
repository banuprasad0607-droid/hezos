import {
  a0 as be,
  X as pe,
  x as e,
  P as fe,
  j as Y,
  R as J,
  b as he,
  a as ge,
  M as u,
  N as E,
} from "./index-DrqTZ7SR.js";
import { k as d } from "./vendor-charts-DECNlt_G.js";
import { w as K } from "./whatsapp-service-BVS3HosY.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
function Se() {
  const { currentSchoolId: x, user: p, roles: z, loading: Q } = be();
  pe("Marks Management");
  const Z = z.includes("super_admin"),
    ee = z.includes("admin"),
    se = z.includes("principal"),
    b = Z || ee || se,
    [g, te] = d.useState([]),
    [I, ae] = d.useState([]),
    [D, re] = d.useState([]),
    [X, le] = d.useState([]),
    [T, de] = d.useState([]),
    [S, ie] = d.useState([]),
    [n, O] = d.useState(""),
    [w, ne] = d.useState("All"),
    [c, G] = d.useState(""),
    [f, V] = d.useState(""),
    [C, M] = d.useState({}),
    [oe, H] = d.useState(!0),
    [y, L] = d.useState(!1),
    $ = d.useRef({}),
    _ = { "A+": 91, A: 81, "B+": 71, B: 61, "C+": 51, C: 41, D: 35 },
    ce = (s, t, r, i) => {
      if (r) return "F (Abs)";
      if (i) return "EX (Med)";
      if (t <= 0) return "—";
      const a = (s / t) * 100;
      return a >= _["A+"]
        ? "A+"
        : a >= _.A
          ? "A"
          : a >= _["B+"]
            ? "B+"
            : a >= _.B
              ? "B"
              : a >= _["C+"]
                ? "C+"
                : a >= _.C
                  ? "C"
                  : a >= _.D
                    ? "D"
                    : "F";
    },
    U = async () => {
      if (!(!x || !p?.id)) {
        H(!0);
        try {
          const { data: s } = await u
            .from("teacher_allocations")
            .select("id, teacher_id, subject_id, class_id")
            .eq("school_id", x);
          ie(s || []);
          const { data: t } = await u
            .from("classes")
            .select("id, name, grade, section, class_teacher_id")
            .eq("school_id", x)
            .is("deleted_at", null)
            .order("name");
          te(t || []);
          const { data: r } = await u
            .from("subjects")
            .select("id, name, code")
            .eq("school_id", x)
            .order("name");
          ae(r || []);
          const { data: i } = await u
            .from("exams")
            .select("id, class_id, name, type, academic_year, date")
            .eq("school_id", x)
            .order("date", { ascending: !1 });
          le(i || []);
          const { data: a } = await u
            .from("exam_subjects")
            .select("id, exam_id, subject_id, max_marks, pass_marks")
            .eq("school_id", x);
          de(a || []);
          const { data: l } = await u
            .from("students")
            .select("id, full_name, roll_number, class_id, photo_url")
            .eq("school_id", x)
            .is("deleted_at", null)
            .order("full_name");
          re(l || []);
        } catch (s) {
          E.error("Failed to load data: " + s.message);
        } finally {
          H(!1);
        }
      }
    };
  d.useEffect(() => {
    U();
  }, [x, p?.id]);
  const j = d.useMemo(() => {
    let s = g;
    if (
      (w !== "All" &&
        (s = s.filter(
          (t) =>
            t.section?.toLowerCase() === w.toLowerCase() ||
            t.name.toLowerCase().includes(w.toLowerCase()),
        )),
      !b)
    ) {
      const t = S.map((r) => r.class_id);
      s = s.filter((r) => t.includes(r.id) || r.class_teacher_id === p?.id);
    }
    return s;
  }, [g, S, b, p?.id, w]);
  d.useEffect(() => {
    j.length > 0 && !j.some((s) => s.id === n) ? O(j[0].id) : j.length === 0 && O("");
  }, [j, n]);
  const k = d.useMemo(() => X.filter((s) => s.class_id === n), [X, n]);
  d.useEffect(() => {
    k.length > 0 && !k.some((s) => s.id === c) ? G(k[0].id) : k.length === 0 && G("");
  }, [k, c]);
  const m = d.useMemo(() => T.find((s) => s.exam_id === c && s.subject_id === f), [T, c, f]),
    N = d.useMemo(() => {
      const s = T.filter((r) => r.exam_id === c);
      let t = I.filter((r) => s.some((i) => i.subject_id === r.id));
      if (!b && !(g.find((a) => a.id === n)?.class_teacher_id === p?.id)) {
        const a = S.filter((l) => l.class_id === n).map((l) => l.subject_id);
        t = t.filter((l) => a.includes(l.id));
      }
      return t;
    }, [I, c, T, b, S, n, g, p?.id]);
  (d.useEffect(() => {
    N.length > 0 && !N.some((s) => s.id === f) ? V(N[0].id) : N.length === 0 && V("");
  }, [N, f]),
    d.useEffect(() => {
      if (!c || !n || !m) {
        M({});
        return;
      }
      (async () => {
        try {
          const t = D.filter((a) => a.class_id === n).map((a) => a.id);
          if (t.length === 0) {
            M({});
            return;
          }
          const { data: r } = await u
              .from("mark_entries")
              .select("*")
              .eq("exam_id", c)
              .eq("exam_subject_id", m.id)
              .in("student_id", t),
            i = {};
          (t.forEach((a) => {
            const l = (r || []).find((h) => h.student_id === a);
            l
              ? (i[a] = {
                  id: l.id,
                  student_id: l.student_id,
                  marks_obtained: Number(l.marks_obtained || 0),
                  grade: l.grade || "",
                  remarks: l.remarks || "",
                  is_absent: l.is_absent || !1,
                  is_medical_exempt: l.is_medical_exempt || !1,
                  status: l.status || "Draft",
                })
              : (i[a] = {
                  student_id: a,
                  marks_obtained: 0,
                  grade: "F",
                  remarks: "",
                  is_absent: !1,
                  is_medical_exempt: !1,
                  status: "Draft",
                });
          }),
            M(i));
        } catch (t) {
          console.error("Error loading marks:", t);
        }
      })();
    }, [c, n, m, D]));
  const R = Object.values(C).map((s) => s.status),
    o = R.length > 0 ? (R.every((s) => s === R[0]) ? R[0] : "Mixed") : "Draft",
    W = d.useMemo(
      () =>
        b
          ? !0
          : !n || !f
            ? !1
            : S.some((s) => s.class_id === n && s.subject_id === f && s.teacher_id === p?.id),
      [b, n, f, S, p?.id],
    ),
    me = d.useMemo(() => g.find((t) => t.id === n)?.class_teacher_id === p?.id, [g, n, p?.id]),
    v = d.useMemo(
      () =>
        !W && !b
          ? !1
          : b
            ? o !== "Locked" && o !== "Published"
            : o === "Draft" || o === "Submitted" || o === "Mixed",
      [W, b, o],
    ),
    q = (s, t) => {
      !m ||
        !v ||
        M((r) => {
          const i = r[s],
            a = m.max_marks;
          let l = t.marks_obtained ?? i.marks_obtained;
          l = Math.min(Math.max(l, 0), a);
          const h = t.is_absent ?? i.is_absent,
            B = t.is_medical_exempt ?? i.is_medical_exempt,
            F = ce(l, a, h, B),
            P = { ...i, ...t, marks_obtained: l, grade: F, is_absent: h, is_medical_exempt: B };
          return (
            $.current[s] && clearTimeout($.current[s]),
            ($.current[s] = setTimeout(() => {
              xe(s, P);
            }, 1e3)),
            { ...r, [s]: P }
          );
        });
    },
    xe = async (s, t) => {
      if (!(!c || !m || !x)) {
        L(!0);
        try {
          const r = {
            school_id: x,
            exam_id: c,
            exam_subject_id: m.id,
            student_id: s,
            marks_obtained: t.marks_obtained,
            grade: t.grade,
            remarks: t.remarks,
            is_absent: t.is_absent,
            is_medical_exempt: t.is_medical_exempt,
            status: t.status || "Draft",
          };
          if (t.id) await u.from("mark_entries").update(r).eq("id", t.id);
          else {
            const { data: i, error: a } = await u
              .from("mark_entries")
              .insert(r)
              .select("id")
              .single();
            if (a) throw a;
            i && M((l) => ({ ...l, [s]: { ...l[s], id: i.id } }));
          }
        } catch (r) {
          E.error("Failed to auto-save: " + r.message);
        } finally {
          L(!1);
        }
      }
    },
    A = async (s) => {
      if (!(!c || !m)) {
        L(!0);
        try {
          const t = Object.keys(C);
          if (t.length === 0) return;
          const r = t.map(async (i) => {
            const a = C[i],
              l = {
                school_id: x,
                exam_id: c,
                exam_subject_id: m.id,
                student_id: i,
                marks_obtained: a.marks_obtained,
                grade: a.grade,
                remarks: a.remarks,
                is_absent: a.is_absent,
                is_medical_exempt: a.is_medical_exempt,
                status: s,
              };
            return a.id
              ? u.from("mark_entries").update(l).eq("id", a.id)
              : u.from("mark_entries").insert(l);
          });
          (await Promise.all(r),
            s === "Published" &&
              (async () => {
                try {
                  const a = (await K.getTemplates(x)).find(
                    (l) => l.name === "exam_result_notification",
                  );
                  if (a) {
                    const { data: l } = await u
                      .from("students")
                      .select("id, full_name, parent_user_id, emergency_contact")
                      .in("id", t);
                    for (const h of l || []) {
                      const B = h.emergency_contact || "+91 90000 00000",
                        F = C[h.id];
                      if (F) {
                        const P = m.max_marks || 100,
                          ue = Math.round((F.marks_obtained / P) * 100);
                        await K.sendTemplateMessage(
                          x,
                          B,
                          a.id,
                          [h.full_name, String(ue)],
                          h.id,
                          h.parent_user_id,
                        );
                      }
                    }
                    E.success("WhatsApp results alerts broadcasted to parents.");
                  }
                } catch (i) {
                  console.error("WhatsApp exam marks trigger failed:", i);
                }
              })(),
            E.success(`Subject marks status updated to ${s}`),
            U());
        } catch (t) {
          E.error("Status update failed: " + t.message);
        } finally {
          L(!1);
        }
      }
    };
  return Q
    ? e.jsx("div", {
        className:
          "flex-1 flex items-center justify-center p-8 bg-background text-foreground text-sm font-semibold",
        children: e.jsxs("div", {
          className: "text-center space-y-4",
          children: [
            e.jsx("div", {
              className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
            }),
            e.jsx("p", {
              className: "text-sm text-muted-foreground",
              children: "Loading marks manager...",
            }),
          ],
        }),
      })
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx(fe, {
            title: "Marks Management",
            breadcrumb: "Academics",
            actions: e.jsx("div", {
              className: "flex gap-2 text-xs font-semibold",
              children: e.jsxs("span", {
                className: `px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 ${o === "Draft" ? "bg-slate-100 text-slate-700 border-slate-200" : o === "Submitted" ? "bg-blue-50 text-blue-700 border-blue-200" : o === "Verified" ? "bg-purple-50 text-purple-700 border-purple-200" : o === "Approved" ? "bg-amber-50 text-amber-700 border-amber-200" : o === "Locked" ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"}`,
                children: [e.jsx(Y, { className: "size-3.5" }), " Status: ", o.toUpperCase()],
              }),
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-6 lg:p-8 space-y-6",
            children: [
              e.jsxs("div", {
                className:
                  "bg-white dark:bg-slate-900 p-5 rounded-2xl border border-border dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4",
                children: [
                  e.jsxs("div", {
                    className: "flex flex-wrap items-center gap-3",
                    children: [
                      e.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          e.jsx("span", {
                            className: "text-[10px] font-bold text-muted-foreground uppercase",
                            children: "Class",
                          }),
                          e.jsxs("select", {
                            value: n,
                            onChange: (s) => O(s.target.value),
                            className:
                              "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                            children: [
                              j.map((s) =>
                                e.jsx("option", { value: s.id, children: s.name }, s.id),
                              ),
                              j.length === 0 &&
                                e.jsx("option", { value: "", children: "No Allocated Classes" }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          e.jsx("span", {
                            className: "text-[10px] font-bold text-muted-foreground uppercase",
                            children: "Section",
                          }),
                          e.jsxs("select", {
                            value: w,
                            onChange: (s) => ne(s.target.value),
                            className:
                              "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                            children: [
                              e.jsx("option", { value: "All", children: "All Sections" }),
                              e.jsx("option", { value: "a", children: "Section A" }),
                              e.jsx("option", { value: "b", children: "Section B" }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          e.jsx("span", {
                            className: "text-[10px] font-bold text-muted-foreground uppercase",
                            children: "Exam Term",
                          }),
                          e.jsxs("select", {
                            value: c,
                            onChange: (s) => G(s.target.value),
                            className:
                              "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                            children: [
                              k.length === 0 &&
                                e.jsx("option", { value: "", children: "-- No Exams --" }),
                              k.map((s) =>
                                e.jsx("option", { value: s.id, children: s.name }, s.id),
                              ),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex flex-col",
                        children: [
                          e.jsx("span", {
                            className: "text-[10px] font-bold text-muted-foreground uppercase",
                            children: "Subject",
                          }),
                          e.jsxs("select", {
                            value: f,
                            onChange: (s) => V(s.target.value),
                            className:
                              "mt-1 bg-card dark:bg-slate-800 border border-border dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none",
                            children: [
                              N.length === 0 &&
                                e.jsx("option", { value: "", children: "-- No Subjects --" }),
                              N.map((s) =>
                                e.jsx("option", { value: s.id, children: s.name }, s.id),
                              ),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "flex items-center gap-2",
                    children: e.jsx("button", {
                      onClick: U,
                      className:
                        "p-1.5 border border-border dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg bg-card text-muted-foreground transition-all cursor-pointer",
                      title: "Refresh",
                      children: e.jsx(J, { className: `size-4 ${oe ? "animate-spin" : ""}` }),
                    }),
                  }),
                ],
              }),
              c &&
                f &&
                e.jsxs("div", {
                  className:
                    "bg-slate-50 dark:bg-slate-800/10 p-5 rounded-2xl border border-border dark:border-slate-800 flex flex-wrap items-center justify-between gap-4",
                  children: [
                    e.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        e.jsxs("h4", {
                          className:
                            "font-bold text-sm text-slate-850 dark:text-slate-100 flex items-center gap-1.5",
                          children: [
                            e.jsx(Y, { className: "size-4 text-indigo-500" }),
                            " Marks Lock Workflow",
                          ],
                        }),
                        e.jsxs("p", {
                          className: "text-xs text-muted-foreground",
                          children: [
                            "Current Subject Status: ",
                            e.jsx("strong", {
                              className: "text-slate-800 dark:text-slate-200",
                              children: o,
                            }),
                            ".",
                            !v &&
                              " Editing is strictly prohibited by RBAC rules because marks are locked or you lack allocation.",
                            v && " You have edit privileges. Marks are auto-saved on change.",
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "flex flex-wrap gap-2",
                      children: [
                        W &&
                          (o === "Draft" || o === "Mixed") &&
                          e.jsx("button", {
                            onClick: () => A("Submitted"),
                            disabled: y,
                            className:
                              "px-4 py-1.5 bg-blue-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-blue-700 transition-all cursor-pointer",
                            children: "Submit Subject to Class Teacher",
                          }),
                        me &&
                          o === "Submitted" &&
                          e.jsxs(e.Fragment, {
                            children: [
                              e.jsx("button", {
                                onClick: () => A("Verified"),
                                disabled: y,
                                className:
                                  "px-4 py-1.5 bg-purple-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-purple-700 transition-all cursor-pointer",
                                children: "Verify Subject Marks",
                              }),
                              e.jsx("button", {
                                onClick: () => A("Draft"),
                                disabled: y,
                                className:
                                  "px-4 py-1.5 border border-red-200 bg-red-50 text-red-700 font-bold text-xs rounded-lg hover:bg-red-100 transition-all cursor-pointer",
                                children: "Reject & Return to Draft",
                              }),
                            ],
                          }),
                        b &&
                          o === "Verified" &&
                          e.jsx("button", {
                            onClick: () => A("Approved"),
                            disabled: y,
                            className:
                              "px-4 py-1.5 bg-amber-500 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-amber-600 transition-all cursor-pointer",
                            children: "Approve Marks",
                          }),
                        b &&
                          o === "Approved" &&
                          e.jsx("button", {
                            onClick: () => A("Locked"),
                            disabled: y,
                            className:
                              "px-4 py-1.5 bg-rose-600 text-white font-bold text-xs rounded-lg shadow-sm hover:bg-rose-700 transition-all cursor-pointer",
                            children: "Lock Marks (Final)",
                          }),
                      ],
                    }),
                  ],
                }),
              c && m
                ? e.jsxs("div", {
                    className:
                      "bg-white dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                          e.jsxs("div", {
                            children: [
                              e.jsx("h3", {
                                className: "font-bold text-base text-slate-850 dark:text-slate-100",
                                children: "Student Scores Grid",
                              }),
                              e.jsxs("p", {
                                className: "text-xs text-muted-foreground",
                                children: [
                                  "Class: ",
                                  g.find((s) => s.id === n)?.name,
                                  " · Subject: ",
                                  I.find((s) => s.id === f)?.name,
                                  " · Max Score: ",
                                  m?.max_marks,
                                  " · Pass: ",
                                  m?.pass_marks,
                                ],
                              }),
                            ],
                          }),
                          e.jsx("div", {
                            className:
                              "flex items-center gap-2 text-xs font-semibold text-muted-foreground",
                            children: y
                              ? e.jsxs("span", {
                                  className: "flex items-center gap-1",
                                  children: [
                                    e.jsx(J, { className: "size-3 animate-spin" }),
                                    " Auto-saving...",
                                  ],
                                })
                              : e.jsxs("span", {
                                  className: "flex items-center gap-1 text-emerald-600",
                                  children: [e.jsx(he, { className: "size-3" }), " Saved"],
                                }),
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        className:
                          "overflow-x-auto border border-slate-100 dark:border-slate-800 rounded-xl",
                        children: e.jsxs("table", {
                          className: "w-full text-xs text-left border-collapse",
                          children: [
                            e.jsx("thead", {
                              children: e.jsxs("tr", {
                                className:
                                  "bg-slate-50 dark:bg-slate-800/40 text-muted-foreground border-b border-slate-150 dark:border-slate-800 font-bold uppercase",
                                children: [
                                  e.jsx("th", {
                                    className: "py-2.5 px-4 w-20",
                                    children: "Roll No",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4",
                                    children: "Student Name",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4 text-center w-28",
                                    children: "Max Marks",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4 text-right w-36",
                                    children: "Obtained",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4 text-center w-36",
                                    children: "Flags",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4 text-center w-24",
                                    children: "Grade",
                                  }),
                                  e.jsx("th", {
                                    className: "py-2.5 px-4",
                                    children: "Teacher Remarks",
                                  }),
                                ],
                              }),
                            }),
                            e.jsxs("tbody", {
                              children: [
                                D.filter((s) => s.class_id === n).map((s) => {
                                  const t = C[s.id];
                                  return t
                                    ? e.jsxs(
                                        "tr",
                                        {
                                          className:
                                            "border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50/20 dark:hover:bg-slate-800/20 transition-colors",
                                          children: [
                                            e.jsxs("td", {
                                              className:
                                                "py-3 px-4 font-mono font-bold text-slate-500",
                                              children: ["#", s.roll_number || "—"],
                                            }),
                                            e.jsx("td", {
                                              className:
                                                "py-3 px-4 font-bold text-slate-800 dark:text-slate-100",
                                              children: e.jsxs("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                  e.jsx("div", {
                                                    className:
                                                      "size-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0",
                                                    children: s.photo_url
                                                      ? e.jsx("img", {
                                                          src: s.photo_url,
                                                          alt: "",
                                                          className: "size-full object-cover",
                                                        })
                                                      : s.full_name.slice(0, 1).toUpperCase(),
                                                  }),
                                                  s.full_name,
                                                ],
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className:
                                                "py-3 px-4 text-center font-semibold text-slate-500",
                                              children: m.max_marks,
                                            }),
                                            e.jsx("td", {
                                              className: "py-3 px-4 text-right",
                                              children: e.jsx("input", {
                                                type: "number",
                                                min: "0",
                                                max: m.max_marks,
                                                step: "0.5",
                                                value: t.marks_obtained,
                                                disabled: !v || t.is_absent || t.is_medical_exempt,
                                                onChange: (r) =>
                                                  q(s.id, {
                                                    marks_obtained: Number(r.target.value),
                                                  }),
                                                className:
                                                  "w-24 px-2 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-right font-black focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all",
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className: "py-3 px-4 text-center",
                                              children: e.jsxs("div", {
                                                className: "flex items-center justify-center gap-2",
                                                children: [
                                                  e.jsxs("label", {
                                                    className:
                                                      "flex items-center gap-1 cursor-pointer",
                                                    children: [
                                                      e.jsx("input", {
                                                        type: "checkbox",
                                                        checked: t.is_absent,
                                                        disabled: !v || t.is_medical_exempt,
                                                        onChange: (r) =>
                                                          q(s.id, { is_absent: r.target.checked }),
                                                        className:
                                                          "rounded border-slate-300 text-rose-500 focus:ring-rose-500 disabled:opacity-50",
                                                      }),
                                                      e.jsx("span", {
                                                        className:
                                                          "text-[10px] font-bold text-rose-600",
                                                        children: "ABS",
                                                      }),
                                                    ],
                                                  }),
                                                  e.jsxs("label", {
                                                    className:
                                                      "flex items-center gap-1 cursor-pointer",
                                                    children: [
                                                      e.jsx("input", {
                                                        type: "checkbox",
                                                        checked: t.is_medical_exempt,
                                                        disabled: !v || t.is_absent,
                                                        onChange: (r) =>
                                                          q(s.id, {
                                                            is_medical_exempt: r.target.checked,
                                                          }),
                                                        className:
                                                          "rounded border-slate-300 text-blue-500 focus:ring-blue-500 disabled:opacity-50",
                                                      }),
                                                      e.jsx("span", {
                                                        className:
                                                          "text-[10px] font-bold text-blue-600",
                                                        children: "MED",
                                                      }),
                                                    ],
                                                  }),
                                                ],
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className: "py-3 px-4 text-center",
                                              children: e.jsx("span", {
                                                className: `inline-block px-2.5 py-0.5 rounded font-black text-[10px] ${t.grade.includes("F") ? "bg-rose-50 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400" : t.grade.includes("EX") ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400" : t.grade.includes("A") ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-955/20 dark:text-emerald-400" : "bg-blue-50 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400"}`,
                                                children: t.grade,
                                              }),
                                            }),
                                            e.jsx("td", {
                                              className: "py-3 px-4",
                                              children: e.jsx("input", {
                                                type: "text",
                                                value: t.remarks,
                                                disabled: !v,
                                                placeholder: "Enter remarks...",
                                                onChange: (r) =>
                                                  q(s.id, { remarks: r.target.value }),
                                                className:
                                                  "w-full px-2.5 py-1.5 border border-border dark:border-slate-700 bg-white dark:bg-slate-800 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-brand text-slate-800 dark:text-slate-100 disabled:bg-slate-50 dark:disabled:bg-slate-900 disabled:text-slate-500 transition-all",
                                              }),
                                            }),
                                          ],
                                        },
                                        s.id,
                                      )
                                    : null;
                                }),
                                D.filter((s) => s.class_id === n).length === 0 &&
                                  e.jsx("tr", {
                                    children: e.jsx("td", {
                                      colSpan: 7,
                                      className: "py-8 text-center text-muted-foreground italic",
                                      children: "No students enrolled in this class.",
                                    }),
                                  }),
                              ],
                            }),
                          ],
                        }),
                      }),
                    ],
                  })
                : e.jsxs("div", {
                    className:
                      "bg-white dark:bg-slate-900 p-12 text-center text-muted-foreground rounded-2xl border border-border dark:border-slate-800",
                    children: [
                      e.jsx(ge, { className: "size-10 mx-auto text-slate-300 mb-2" }),
                      e.jsx("p", {
                        className: "font-semibold",
                        children: "Select class, exam term, and subject above to enter marks.",
                      }),
                    ],
                  }),
            ],
          }),
        ],
      });
}
export { Se as component };
