import {
  r as Qe,
  a0 as Xe,
  X as Ye,
  M as h,
  x as e,
  P as Je,
  d as Ze,
  D as et,
  o as we,
  L as _e,
  U as Se,
  N as m,
} from "./index-DrqTZ7SR.js";
import { k as n } from "./vendor-charts-DECNlt_G.js";
import { u as tt, a as st } from "./platform.functions-De0vHKEw.js";
import { C as rt, I as nt } from "./ImageCropper-D9CaAf2x.js";
import { w as ot } from "./notify-CFlpE6Mr.js";
import { e as at, a as lt, b as dt } from "./export-helper-D-BWKL3x.js";
import { U as it } from "./user-check-CmmF2Gzq.js";
import { S as ct } from "./shield-alert-BYDmGTCs.js";
import { M as ut } from "./mail-BgE7oUjd.js";
import { P as mt } from "./phone-BvCyC-cH.js";
import { T as pt } from "./trash-W_OSIwSY.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const xt = [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }],
  ],
  ht = Qe("external-link", xt);
async function Ce(l, f = 800, A = 0.8, _ = 500 * 1024) {
  return new Promise((F, S) => {
    if (!window.FileReader || !window.HTMLCanvasElement) return F(l);
    const g = new FileReader();
    (g.readAsDataURL(l),
      (g.onload = (K) => {
        const p = new Image();
        ((p.src = K.target?.result),
          (p.onload = () => {
            let j = p.width,
              x = p.height;
            (j > f || x > f) &&
              (j > x
                ? ((x = Math.round((x * f) / j)), (j = f))
                : ((j = Math.round((j * f) / x)), (x = f)));
            const N = document.createElement("canvas");
            ((N.width = j), (N.height = x));
            const k = N.getContext("2d");
            if (!k) return S(new Error("Could not construct 2D canvas context."));
            (k.drawImage(p, 0, 0, j, x),
              N.toBlob(
                (v) => {
                  if (!v) return S(new Error("Canvas export returned empty blob."));
                  v.size > _
                    ? N.toBlob(
                        (C) => {
                          C && C.size <= _
                            ? F(C)
                            : S(
                                new Error(
                                  `Image is too large (${Math.round(v.size / 1024)}KB). Compressed version exceeds maximum allowed size of 500KB.`,
                                ),
                              );
                        },
                        "image/webp",
                        0.5,
                      )
                    : F(v);
                },
                "image/webp",
                A,
              ));
          }),
          (p.onerror = () => S(new Error("Could not parse image source."))));
      }),
      (g.onerror = () => S(new Error("Failed to read image file."))));
  });
}
function re({ title: l, count: f, subtext: A, icon: _ }) {
  return e.jsxs("div", {
    className:
      "bg-card border border-border rounded-xl p-5 flex items-center justify-between shadow-xs",
    children: [
      e.jsxs("div", {
        className: "space-y-1",
        children: [
          e.jsx("p", {
            className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground",
            children: l,
          }),
          e.jsx("h3", { className: "text-2xl font-bold text-foreground", children: f }),
          e.jsx("p", { className: "text-[10px] text-muted-foreground", children: A }),
        ],
      }),
      e.jsx("div", {
        className: "size-10 bg-secondary rounded-lg flex items-center justify-center",
        children: _,
      }),
    ],
  });
}
function Et() {
  const { currentSchoolId: l, roles: f, loading: A } = Xe(),
    _ = l,
    F = f.includes("super_admin"),
    S = f.includes("admin") || F;
  Ye("Students & Parents");
  const [g, K] = n.useState([]),
    [p, j] = n.useState([]),
    [x, N] = n.useState(!1),
    [k, v] = n.useState(!1),
    [C, Pe] = n.useState(""),
    [G, ke] = n.useState(""),
    [E, $] = n.useState(0),
    [U] = n.useState(10),
    [D, Ee] = n.useState(0),
    [z, ne] = n.useState("all"),
    [R, ze] = n.useState(0),
    [Ie, Ae] = n.useState(0),
    [Fe, $e] = n.useState(0),
    [Ue, V] = n.useState(!1),
    [qe, B] = n.useState(!1),
    [oe, Q] = n.useState(null),
    [ae, le] = n.useState(!1),
    [I, X] = n.useState(null),
    [Y, de] = n.useState(!1),
    [W, ie] = n.useState({ current: 0, total: 0 });
  n.useEffect(() => {
    const t = setTimeout(() => {
      (ke(C), $(0));
    }, 400);
    return () => clearTimeout(t);
  }, [C]);
  const q = async () => {
      if (!l) return;
      const { count: t } = await h
        .from("students")
        .select("id", { count: "exact", head: !0 })
        .eq("school_id", l)
        .is("deleted_at", null);
      ze(t ?? 0);
      const { count: s } = await h
        .from("students")
        .select("id", { count: "exact", head: !0 })
        .eq("school_id", l)
        .is("deleted_at", null)
        .not("photo_url", "is", null);
      (Ae(s ?? 0), $e((t ?? 0) - (s ?? 0)));
    },
    M = async () => {
      if (l) {
        v(!0);
        try {
          let t = h
            .from("students")
            .select(
              "id, full_name, roll_number, admission_number, photo_url, parent_email, parent_phone, parent_name, parent_user_id, class_id, classes(name)",
              { count: "exact" },
            )
            .eq("school_id", l)
            .is("deleted_at", null);
          (G.trim() && (t = t.ilike("full_name", `%${G.trim()}%`)),
            z === "_none"
              ? (t = t.is("class_id", null))
              : z !== "all" && (t = t.eq("class_id", z)));
          const s = E * U,
            r = s + U - 1,
            { data: o, count: c, error: a } = await t.order("full_name").range(s, r);
          if (a) throw a;
          (Ee(c ?? 0),
            j(
              (o ?? []).map((d) => ({
                ...d,
                classes: Array.isArray(d.classes) ? (d.classes[0] ?? null) : d.classes,
              })),
            ));
        } catch (t) {
          m.error(t.message || "Failed to load students.");
        } finally {
          v(!1);
        }
      }
    };
  (n.useEffect(() => {
    (M(), q());
  }, [l, G, E, z]),
    n.useEffect(() => {
      l &&
        h
          .from("classes")
          .select("id, name, grade, section")
          .eq("school_id", l)
          .is("deleted_at", null)
          .order("name")
          .then(({ data: t }) => {
            (K(t ?? []), t?.[0] && !O && xe(t[0].id));
          });
    }, [l]));
  const Me = (t) => {
      const s = [];
      let r = [""],
        o = !1;
      for (let c = 0; c < t.length; c++) {
        const a = t[c],
          d = t[c + 1];
        a === '"'
          ? (o = !o)
          : a === "," && !o
            ? r.push("")
            : (a === "\r" ||
                  a ===
                    `
`) &&
                !o
              ? (a === "\r" &&
                  d ===
                    `
` &&
                  c++,
                s.push(r.map((y) => y.trim().replace(/^["']|["']$/g, ""))),
                (r = [""]))
              : (r[r.length - 1] += a);
      }
      return (
        (r.length > 1 || r[0] !== "") && s.push(r.map((c) => c.trim().replace(/^["']|["']$/g, ""))),
        s
      );
    },
    Te = async (t) => {
      if ((t.preventDefault(), !(!oe || !l))) {
        le(!0);
        try {
          const s = await oe.text(),
            r = Me(s);
          if (r.length < 2)
            throw new Error(
              "CSV file must contain a header row and at least one student data row.",
            );
          const o = r[0],
            c = r.slice(1),
            a = {};
          o.forEach((i, b) => {
            const w = i.toLowerCase().replace(/[^a-z0-9]/g, "");
            a[w] = b;
          });
          const d = (i, b) => {
              for (const w of b) {
                const u = a[w];
                if (u !== void 0 && i[u]) return i[u];
              }
              return "";
            },
            y = [];
          for (const i of c) {
            if (i.length === 0 || (i.length === 1 && i[0] === "")) continue;
            const b = d(i, ["fullname", "name", "studentname", "student"]);
            if (!b) continue;
            const w = d(i, ["admissionnumber", "admissionno", "admission", "id"]),
              u = d(i, ["rollnumber", "rollno", "roll"]),
              Be = d(i, ["class", "classname", "section", "grade"]),
              We = d(i, ["parentname", "parent", "fathername", "mothername"]),
              Oe = d(i, ["parentemail", "email", "parentmail"]),
              He = d(i, ["parentphone", "phone", "parentwhatsapp", "whatsapp"]),
              ve = g.find((Ge) => Ge.name.toLowerCase() === Be.toLowerCase()),
              Ke = ve ? ve.id : g[0]?.id || null;
            y.push({
              school_id: l,
              full_name: b,
              admission_number: w || `ADM-${Date.now()}-${Math.floor(Math.random() * 1e3)}`,
              roll_number: u || null,
              class_id: Ke,
              parent_name: We || null,
              parent_email: Oe || null,
              parent_phone: He || null,
              photo_url: null,
            });
          }
          if (y.length === 0)
            throw new Error(
              "No valid student rows found in the CSV. Make sure you have a 'name' or 'fullname' header column.",
            );
          const { error: P } = await h.from("students").insert(y);
          if (P) throw P;
          (m.success(`Successfully imported ${y.length} students!`), V(!1), Q(null), M(), q());
        } catch (s) {
          m.error(s.message || "Failed to import CSV.");
        } finally {
          le(!1);
        }
      }
    },
    Le = async (t) => {
      if ((t.preventDefault(), !I || I.length === 0 || !l)) return;
      (de(!0), ie({ current: 0, total: I.length }));
      let s = 0;
      try {
        for (let r = 0; r < I.length; r++) {
          const o = I[r];
          ie((u) => ({ ...u, current: r + 1 }));
          const a = (o.name.substring(0, o.name.lastIndexOf(".")) || o.name).toLowerCase().trim(),
            d = p.find(
              (u) =>
                (u.admission_number && u.admission_number.toLowerCase().trim() === a) ||
                (u.roll_number && u.roll_number.toLowerCase().trim() === a) ||
                (u.full_name && u.full_name.toLowerCase().trim() === a),
            );
          if (!d) continue;
          const y = await Ce(o, 400, 0.8, 200 * 1024),
            P = `${l}/student/bulk-${d.id}-${Date.now()}.webp`,
            { error: i } = await h.storage
              .from("student-photos")
              .upload(P, y, { contentType: "image/webp", cacheControl: "3600", upsert: !0 });
          if (i) continue;
          const { data: b } = h.storage.from("student-photos").getPublicUrl(P),
            { error: w } = await h
              .from("students")
              .update({ photo_url: b.publicUrl })
              .eq("id", d.id)
              .eq("school_id", l);
          w || s++;
        }
        (m.success(`Successfully uploaded and matched ${s} student photos!`),
          B(!1),
          X(null),
          M(),
          q());
      } catch (r) {
        m.error(r.message || "Photo sync encountered errors.");
      } finally {
        de(!1);
      }
    },
    [ce, ue] = n.useState(""),
    [J, Z] = n.useState(""),
    [me, pe] = n.useState(""),
    [O, xe] = n.useState(""),
    [he, fe] = n.useState(""),
    [ee, ge] = n.useState(""),
    [be, je] = n.useState(""),
    [T, Ne] = n.useState(""),
    De = tt(st);
  n.useEffect(() => {
    if (!x || J) return;
    const t = new Date().getFullYear(),
      s = p
        .map((o) => o.admission_number)
        .filter((o) => !!o && o.startsWith(`${t}-`))
        .map((o) => parseInt(o.split("-")[1] ?? "0", 10))
        .filter((o) => !Number.isNaN(o)),
      r = (s.length ? Math.max(...s) : 0) + 1;
    Z(`${t}-${String(r).padStart(4, "0")}`);
  }, [x]);
  const [ye, L] = n.useState(null),
    [H, te] = n.useState(null),
    Re = async (t) => {
      if ((t.preventDefault(), !(!_ || !O))) {
        if (T && !ee) return m.error("Enter parent email to create a parent login.");
        if (T && T.length < 8) return m.error("Parent password must be at least 8 characters.");
        v(!0);
        try {
          let s = null;
          if (H) {
            const o = atob(H.split(",")[1]),
              c = new ArrayBuffer(o.length),
              a = new Uint8Array(c);
            for (let u = 0; u < o.length; u++) a[u] = o.charCodeAt(u);
            const d = new Blob([c], { type: "image/jpeg" }),
              y = new File([d], "avatar.jpg", { type: "image/jpeg" }),
              P = await Ce(y, 300, 0.8, 150 * 1024),
              i = `${_}/student/admission-${Date.now()}.webp`,
              { error: b } = await h.storage
                .from("student-photos")
                .upload(i, P, { contentType: "image/webp", cacheControl: "3600", upsert: !0 });
            if (b) throw b;
            const { data: w } = h.storage.from("student-photos").getPublicUrl(i);
            s = w.publicUrl;
          }
          const r = await De({
            data: {
              student: {
                full_name: ce,
                admission_number: J || null,
                roll_number: me || null,
                class_id: O,
                photo_url: s,
              },
              parent: {
                full_name: he || null,
                email: ee || null,
                phone: be || null,
                password: T || null,
              },
            },
          });
          (m.success(
            r.parent_account_created
              ? "Student added & parent login created."
              : r.parent_user_id
                ? "Student added & linked to existing parent account."
                : "Student added.",
          ),
            N(!1),
            ue(""),
            Z(""),
            pe(""),
            fe(""),
            ge(""),
            je(""),
            Ne(""),
            te(null),
            L(null),
            M(),
            q());
        } catch (s) {
          m.error(s instanceof Error ? s.message : "Could not add student");
        } finally {
          v(!1);
        }
      }
    },
    se = async (t) => {
      if (!l) return;
      m.info("Preparing data for export...");
      const { data: s, error: r } = await h
        .from("students")
        .select("admission_number, full_name, roll_number, parent_name, parent_email, parent_phone")
        .eq("school_id", l)
        .is("deleted_at", null)
        .order("full_name");
      if (r || !s) return m.error("Failed to load export data.");
      const o = [
          "Admission No",
          "Student Name",
          "Roll No",
          "Parent Name",
          "Parent Email",
          "Parent Phone",
        ],
        c = s.map((a) => [
          a.admission_number,
          a.full_name,
          a.roll_number,
          a.parent_name,
          a.parent_email,
          a.parent_phone,
        ]);
      (t === "csv"
        ? at("Student_Roster", o, c)
        : t === "excel"
          ? lt("Student_Roster", o, c)
          : t === "pdf" && dt("Student_Roster", "Enrolled Students Directory", o, c),
        m.success("Download started!"));
    },
    Ve = async (t, s) => {
      if (
        l &&
        confirm(`Are you sure you want to delete ${s}? This will move them to the Recycle Bin.`)
      )
        try {
          const { error: r } = await h
            .from("students")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", t)
            .eq("school_id", l);
          if (r) throw r;
          (m.success(`${s} has been soft-deleted.`), M(), q());
        } catch (r) {
          m.error(r.message || "Failed to delete student.");
        }
    };
  return A
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
    : e.jsxs(e.Fragment, {
        children: [
          e.jsx(Je, {
            title: "Students & Parents",
            breadcrumb: `${R} enrolled`,
            actions: e.jsxs(e.Fragment, {
              children: [
                e.jsx("input", {
                  value: C,
                  onChange: (t) => Pe(t.target.value),
                  placeholder: "Search name, admission #, parent…",
                  className:
                    "px-3 py-1.5 text-sm border border-border rounded-md bg-card w-64 text-foreground outline-none",
                }),
                e.jsx("button", {
                  onClick: () => V(!0),
                  className:
                    "px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
                  children: "Import CSV",
                }),
                e.jsx("button", {
                  onClick: () => B(!0),
                  className:
                    "px-3 py-1.5 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer",
                  children: "Upload Photos",
                }),
                e.jsxs("button", {
                  onClick: () => N(!0),
                  disabled: g.length === 0,
                  className:
                    "px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50 cursor-pointer",
                  children: [e.jsx(Ze, { className: "size-4" }), " Add Student"],
                }),
                e.jsxs("div", {
                  className:
                    "flex gap-1 border border-border rounded-md overflow-hidden bg-card text-card-foreground shrink-0 shadow-xs",
                  children: [
                    e.jsx("button", {
                      onClick: () => se("csv"),
                      className: "p-1.5 hover:bg-secondary transition-colors",
                      title: "Export CSV",
                      children: e.jsx(et, { className: "size-4 text-muted-foreground" }),
                    }),
                    e.jsx("button", {
                      onClick: () => se("excel"),
                      className:
                        "p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold",
                      title: "Export Excel",
                      children: "XLS",
                    }),
                    e.jsx("button", {
                      onClick: () => se("pdf"),
                      className:
                        "p-1.5 hover:bg-secondary border-l border-border transition-colors text-xs font-bold",
                      title: "Export PDF",
                      children: "PDF",
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
                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                children: [
                  e.jsx(re, {
                    title: "Total Students",
                    count: R,
                    subtext: "Enrolled active profiles",
                    icon: e.jsx(we, { className: "size-5 text-brand" }),
                  }),
                  e.jsx(re, {
                    title: "Students with Photos",
                    count: Ie,
                    subtext: "Valid photos",
                    icon: e.jsx(it, { className: "size-5 text-success" }),
                  }),
                  e.jsx(re, {
                    title: "Missing Photos",
                    count: Fe,
                    subtext: "Requires upload",
                    icon: e.jsx(ct, { className: "size-5 text-danger" }),
                  }),
                ],
              }),
              g.length > 0 &&
                e.jsxs("div", {
                  className: "mb-5",
                  children: [
                    e.jsx("p", {
                      className:
                        "text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2",
                      children: "Filter by class",
                    }),
                    e.jsxs("div", {
                      className: "flex flex-wrap gap-2",
                      children: [
                        e.jsxs("button", {
                          onClick: () => {
                            (ne("all"), $(0));
                          },
                          className: `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${z === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:bg-secondary"}`,
                          children: [
                            "All ",
                            e.jsxs("span", { className: "opacity-70", children: ["(", R, ")"] }),
                          ],
                        }),
                        g.map((t) =>
                          e.jsx(
                            "button",
                            {
                              onClick: () => {
                                (ne(t.id), $(0));
                              },
                              className: `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${z === t.id ? "bg-primary text-primary-foreground border-primary" : "bg-card text-card-foreground border-border hover:bg-secondary"}`,
                              children: t.name,
                            },
                            t.id,
                          ),
                        ),
                      ],
                    }),
                  ],
                }),
              k && p.length === 0
                ? e.jsx("div", {
                    className: "text-center py-12 text-muted-foreground text-sm",
                    children: "Loading records from database...",
                  })
                : p.length === 0
                  ? e.jsxs("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center text-card-foreground",
                      children: [
                        e.jsx(we, { className: "size-10 mx-auto text-muted-foreground" }),
                        e.jsx("h3", {
                          className: "font-semibold mt-3",
                          children: R === 0 ? "No students yet" : "No matches",
                        }),
                        e.jsx("p", {
                          className: "text-sm text-muted-foreground mt-1",
                          children:
                            g.length === 0 ? "Create a class first." : "Add your first student.",
                        }),
                      ],
                    })
                  : e.jsxs("div", {
                      className:
                        "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                      children: [
                        e.jsxs("table", {
                          className: "w-full text-left text-sm",
                          children: [
                            e.jsx("thead", {
                              className: "bg-secondary/50 text-xs text-muted-foreground",
                              children: e.jsxs("tr", {
                                children: [
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium",
                                    children: "Admission #",
                                  }),
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium",
                                    children: "Student",
                                  }),
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium",
                                    children: "Class",
                                  }),
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium",
                                    children: "Roll",
                                  }),
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium",
                                    children: "Parent",
                                  }),
                                  e.jsx("th", {
                                    className: "px-6 py-3 font-medium text-right",
                                    children: "Actions",
                                  }),
                                ],
                              }),
                            }),
                            e.jsx("tbody", {
                              className: "divide-y divide-border",
                              children: p.map((t) => {
                                const s = ot(
                                  t.parent_phone,
                                  `Hello ${t.parent_name ?? ""}, this is regarding ${t.full_name}.`,
                                );
                                return e.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/40 transition-colors",
                                    children: [
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-mono text-xs text-foreground",
                                        children: t.admission_number ?? "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-medium text-foreground",
                                        children: e.jsxs(_e, {
                                          to: "/students/$studentId",
                                          params: { studentId: t.id },
                                          className: "hover:text-brand flex items-center gap-3",
                                          children: [
                                            e.jsx("div", {
                                              className:
                                                "size-8 rounded-full border border-border bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center shrink-0",
                                              children: t.photo_url
                                                ? e.jsx("img", {
                                                    src: t.photo_url,
                                                    alt: "",
                                                    className: "size-full object-cover",
                                                    loading: "lazy",
                                                  })
                                                : e.jsx(Se, { className: "size-4 text-slate-400" }),
                                            }),
                                            e.jsx("span", { children: t.full_name }),
                                          ],
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-muted-foreground",
                                        children: t.classes?.name ?? "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-muted-foreground",
                                        children: t.roll_number ?? "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsxs("div", {
                                          className: "space-y-0.5",
                                          children: [
                                            t.parent_name &&
                                              e.jsx("p", {
                                                className: "text-xs font-medium text-foreground",
                                                children: t.parent_name,
                                              }),
                                            t.parent_email &&
                                              e.jsxs("p", {
                                                className:
                                                  "inline-flex items-center gap-1 text-xs text-muted-foreground",
                                                children: [
                                                  e.jsx(ut, { className: "size-3" }),
                                                  " ",
                                                  t.parent_email,
                                                  t.parent_user_id
                                                    ? e.jsx("span", {
                                                        className:
                                                          "ml-1 text-[10px] bg-success-soft text-success px-1.5 py-0.5 rounded font-semibold",
                                                        children: "Linked",
                                                      })
                                                    : e.jsx("span", {
                                                        className:
                                                          "ml-1 text-[10px] bg-warning-soft text-warning px-1.5 py-0.5 rounded font-semibold",
                                                        children: "Pending",
                                                      }),
                                                ],
                                              }),
                                            t.parent_phone &&
                                              e.jsxs("p", {
                                                className:
                                                  "inline-flex items-center gap-1 text-xs text-muted-foreground",
                                                children: [
                                                  e.jsx(mt, { className: "size-3" }),
                                                  " ",
                                                  t.parent_phone,
                                                ],
                                              }),
                                            !t.parent_email &&
                                              !t.parent_phone &&
                                              e.jsx("span", {
                                                className: "text-xs text-muted-foreground",
                                                children: "—",
                                              }),
                                          ],
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-right",
                                        children: e.jsxs("div", {
                                          className: "flex justify-end gap-3 items-center",
                                          children: [
                                            s &&
                                              e.jsx("a", {
                                                href: s,
                                                target: "_blank",
                                                rel: "noreferrer",
                                                className:
                                                  "text-xs font-medium text-[#25D366] inline-flex items-center gap-1 hover:underline",
                                                title: "WhatsApp parent",
                                                children: "WhatsApp",
                                              }),
                                            e.jsxs(_e, {
                                              to: "/students/$studentId",
                                              params: { studentId: t.id },
                                              className:
                                                "text-xs font-medium text-brand inline-flex items-center gap-1 hover:underline",
                                              children: [
                                                "Profile ",
                                                e.jsx(ht, { className: "size-3" }),
                                              ],
                                            }),
                                            S &&
                                              e.jsx("button", {
                                                onClick: () => Ve(t.id, t.full_name),
                                                className:
                                                  "text-xs font-medium text-danger hover:text-red-700 inline-flex items-center gap-1 cursor-pointer",
                                                title: "Delete Student",
                                                children: e.jsx(pt, { className: "size-3.5" }),
                                              }),
                                          ],
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
                        e.jsxs("div", {
                          className:
                            "flex items-center justify-between p-4 bg-secondary/10 border-t border-border",
                          children: [
                            e.jsxs("p", {
                              className: "text-xs text-muted-foreground",
                              children: [
                                "Showing ",
                                D > 0 ? E * U + 1 : 0,
                                " to ",
                                Math.min((E + 1) * U, D),
                                " of ",
                                D,
                                " records",
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex gap-2",
                              children: [
                                e.jsx("button", {
                                  disabled: E === 0,
                                  onClick: () => $((t) => t - 1),
                                  className:
                                    "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                                  children: "Previous",
                                }),
                                e.jsx("button", {
                                  disabled: (E + 1) * U >= D,
                                  onClick: () => $((t) => t + 1),
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
              e.jsx("p", {
                className: "text-xs text-muted-foreground mt-4",
                children:
                  "Parent's email auto-links to their school account on signup. Admission number is unique per school.",
              }),
            ],
          }),
          x &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
              onClick: () => N(!1),
              children: e.jsxs("form", {
                onClick: (t) => t.stopPropagation(),
                onSubmit: Re,
                className:
                  "bg-card text-card-foreground rounded-xl p-6 w-full max-w-xl space-y-4 shadow-lg max-h-[90vh] overflow-y-auto",
                children: [
                  e.jsx("h2", { className: "font-semibold text-lg", children: "Add Student" }),
                  e.jsxs("div", {
                    className:
                      "flex flex-col gap-2 p-3 border border-border rounded-lg bg-secondary/20",
                    children: [
                      e.jsx("span", {
                        className: "text-xs font-semibold text-muted-foreground uppercase",
                        children: "Student Photo",
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-4",
                        children: [
                          e.jsx("div", {
                            className:
                              "size-16 rounded-full border border-border bg-card overflow-hidden flex items-center justify-center relative shadow-sm shrink-0",
                            children: H
                              ? e.jsx("img", {
                                  src: H,
                                  alt: "Preview",
                                  className: "size-full object-cover",
                                })
                              : e.jsx(Se, { className: "size-8 text-muted-foreground" }),
                          }),
                          e.jsxs("div", {
                            className: "flex-grow",
                            children: [
                              e.jsxs("label", {
                                className:
                                  "px-3 py-1.5 text-xs bg-primary text-primary-foreground font-semibold rounded-md cursor-pointer hover:opacity-90 inline-flex items-center gap-1",
                                children: [
                                  e.jsx(rt, { className: "size-3.5" }),
                                  " Select Photo",
                                  e.jsx("input", {
                                    type: "file",
                                    accept: "image/*",
                                    onChange: (t) => {
                                      const s = t.target.files?.[0];
                                      if (s) {
                                        const r = new FileReader();
                                        ((r.onload = () => L(r.result)), r.readAsDataURL(s));
                                      }
                                    },
                                    className: "hidden",
                                  }),
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-[10px] text-muted-foreground mt-1",
                                children: "Supports JPG, PNG, WEBP. Will be cropped automatically.",
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          e.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Full name *",
                          }),
                          e.jsx("input", {
                            required: !0,
                            value: ce,
                            onChange: (t) => ue(t.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-sm font-medium",
                            children: "Admission # *",
                          }),
                          e.jsx("input", {
                            required: !0,
                            value: J,
                            onChange: (t) => Z(t.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", { className: "text-sm font-medium", children: "Roll #" }),
                          e.jsx("input", {
                            value: me,
                            onChange: (t) => pe(t.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          e.jsx("label", { className: "text-sm font-medium", children: "Class *" }),
                          e.jsx("select", {
                            required: !0,
                            value: O,
                            onChange: (t) => xe(t.target.value),
                            className:
                              "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                            children: g.map((t) => {
                              const s = [t.grade, t.section].filter(Boolean).join(" · ");
                              return e.jsxs(
                                "option",
                                { value: t.id, children: [t.name, s ? ` — ${s}` : ""] },
                                t.id,
                              );
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "pt-2 border-t border-border",
                    children: [
                      e.jsx("p", {
                        className:
                          "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2",
                        children: "Parent / Guardian",
                      }),
                      e.jsxs("div", {
                        className: "grid grid-cols-2 gap-3",
                        children: [
                          e.jsxs("div", {
                            className: "col-span-2",
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "Parent name",
                              }),
                              e.jsx("input", {
                                value: he,
                                onChange: (t) => fe(t.target.value),
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "Parent email",
                              }),
                              e.jsx("input", {
                                type: "email",
                                value: ee,
                                onChange: (t) => ge(t.target.value),
                                placeholder: "parent@example.com",
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "Parent WhatsApp #",
                              }),
                              e.jsx("input", {
                                value: be,
                                onChange: (t) => je(t.target.value),
                                placeholder: "+919876543210",
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "col-span-2",
                            children: [
                              e.jsx("label", {
                                className: "text-sm font-medium",
                                children: "Parent login password",
                              }),
                              e.jsx("input", {
                                type: "text",
                                value: T,
                                onChange: (t) => Ne(t.target.value),
                                placeholder: "Min 8 characters — leave blank to skip",
                                className:
                                  "mt-1 w-full px-3 py-2 text-sm font-mono border border-border rounded-md bg-background text-foreground",
                              }),
                              e.jsx("p", {
                                className: "text-xs text-muted-foreground mt-1",
                                children:
                                  "Optional. If set together with parent email, a parent login is created so they can sign in and view homework, attendance and remarks.",
                              }),
                            ],
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
                        onClick: () => {
                          (N(!1), te(null), L(null));
                        },
                        className:
                          "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: k,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md disabled:opacity-50 cursor-pointer",
                        children: k ? "Adding…" : "Add Student",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ye &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]",
              onClick: (t) => t.stopPropagation(),
              children: e.jsxs("div", {
                className: "bg-card p-6 rounded-xl w-full max-w-sm",
                onClick: (t) => t.stopPropagation(),
                children: [
                  e.jsx("h3", {
                    className: "font-bold text-base mb-3 text-card-foreground",
                    children: "Crop Student Photo",
                  }),
                  e.jsx(nt, {
                    imageSrc: ye,
                    onCrop: (t) => {
                      (te(t), L(null));
                    },
                    onCancel: () => L(null),
                    circular: !0,
                  }),
                ],
              }),
            }),
          Ue &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
              onClick: () => V(!1),
              children: e.jsxs("form", {
                onClick: (t) => t.stopPropagation(),
                onSubmit: Te,
                className:
                  "bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-lg",
                    children: "Bulk Student Import (CSV)",
                  }),
                  e.jsxs("p", {
                    className: "text-xs text-muted-foreground",
                    children: [
                      "Import multiple students instantly. Your CSV should have columns like: ",
                      e.jsx("strong", {
                        children:
                          "name, admission_no, roll_no, class_name, parent_name, parent_email, parent_phone",
                      }),
                      ".",
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Select CSV File *",
                      }),
                      e.jsx("input", {
                        type: "file",
                        accept: ".csv",
                        required: !0,
                        onChange: (t) => Q(t.target.files?.[0] || null),
                        className: "mt-1 w-full text-xs text-foreground",
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end pt-2",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => {
                          (V(!1), Q(null));
                        },
                        className:
                          "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: ae,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer",
                        children: ae ? "Importing..." : "Run CSV Import",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          qe &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50",
              onClick: () => B(!1),
              children: e.jsxs("form", {
                onClick: (t) => t.stopPropagation(),
                onSubmit: Le,
                className:
                  "bg-card text-card-foreground rounded-xl p-6 w-full max-w-md space-y-4 shadow-lg",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-lg",
                    children: "Bulk Photo Sync Upload",
                  }),
                  e.jsxs("p", {
                    className: "text-xs text-muted-foreground",
                    children: [
                      "Select multiple student photo files. The filename (e.g. ",
                      e.jsx("code", { children: "2026-0001.jpg" }),
                      " or ",
                      e.jsx("code", { children: "Aarav Sharma.png" }),
                      ") must match the student's **admission number**, **roll number**, or **full name** case-insensitively.",
                    ],
                  }),
                  e.jsxs("div", {
                    children: [
                      e.jsx("label", {
                        className: "text-sm font-medium text-foreground",
                        children: "Select Photo Files *",
                      }),
                      e.jsx("input", {
                        type: "file",
                        multiple: !0,
                        accept: "image/*",
                        required: !0,
                        onChange: (t) => X(t.target.files),
                        className: "mt-1 w-full text-xs text-foreground",
                      }),
                    ],
                  }),
                  Y &&
                    e.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        e.jsx("div", {
                          className: "w-full bg-secondary h-2 rounded-full overflow-hidden",
                          children: e.jsx("div", {
                            className: "bg-brand h-full transition-all duration-300",
                            style: { width: `${Math.round((W.current / W.total) * 100)}%` },
                          }),
                        }),
                        e.jsxs("p", {
                          className: "text-[10px] text-center text-muted-foreground font-semibold",
                          children: ["Uploading ", W.current, " of ", W.total, " photos..."],
                        }),
                      ],
                    }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end pt-2",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => {
                          (B(!1), X(null));
                        },
                        className:
                          "px-4 py-2 text-sm font-medium border border-border rounded-md hover:bg-secondary cursor-pointer",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        disabled: Y || !I,
                        className:
                          "px-4 py-2 text-sm font-semibold bg-brand text-brand-foreground rounded-md disabled:opacity-50 cursor-pointer",
                        children: Y ? "Uploading & Syncing..." : "Sync Photos",
                      }),
                    ],
                  }),
                ],
              }),
            }),
        ],
      });
}
export { Et as component };
