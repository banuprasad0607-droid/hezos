import {
  r as Ye,
  J as ps,
  x as e,
  v as Je,
  t as We,
  n as Pe,
  U as ie,
  Q as bs,
  a0 as us,
  X as hs,
  P as fs,
  o as gs,
  k as Be,
  F as Ve,
  e as qe,
  E as Ue,
  M as h,
  N as b,
  D as js,
  I as he,
} from "./index-DrqTZ7SR.js";
import { k as m } from "./vendor-charts-DECNlt_G.js";
import { C as Se, I as Ns } from "./ImageCropper-D9CaAf2x.js";
import { E as fe } from "./vendor-pdf-BA8uJ8a4.js";
import { U as ys } from "./user-check-CmmF2Gzq.js";
import { S as Oe } from "./shield-alert-BYDmGTCs.js";
import { S as vs } from "./settings-BWufD4OP.js";
import { I as ws } from "./image-B4nE_AY0.js";
import "./vendor-supabase-Bz3EdAMz.js";
const _s = [
    ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
    [
      "path",
      {
        d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
        key: "116196",
      },
    ],
    ["path", { d: "M12 11h4", key: "1jrz19" }],
    ["path", { d: "M12 16h4", key: "n85exb" }],
    ["path", { d: "M8 11h.01", key: "1dfujw" }],
    ["path", { d: "M8 16h.01", key: "18s6g9" }],
  ],
  Ge = Ye("clipboard-list", _s);
const ks = [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
    ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }],
  ],
  Cs = Ye("history", ks);
function ge({ title: r, count: y, subtext: x, icon: J }) {
  return e.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 flex items-center justify-between",
    children: [
      e.jsxs("div", {
        className: "space-y-1",
        children: [
          e.jsx("p", {
            className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground",
            children: r,
          }),
          e.jsx("h3", { className: "text-2xl font-bold text-foreground", children: y }),
          e.jsx("p", { className: "text-[10px] text-muted-foreground", children: x }),
        ],
      }),
      e.jsx("div", {
        className: "size-10 bg-secondary rounded-lg flex items-center justify-center",
        children: J,
      }),
    ],
  });
}
function He({ value: r }) {
  const y = m.useRef(null);
  return (
    m.useEffect(() => {
      if (y.current && r)
        try {
          ps(y.current, r, {
            format: "CODE128",
            width: 1.2,
            height: 32,
            displayValue: !1,
            margin: 0,
            background: "transparent",
            lineColor: "#000000",
          });
        } catch {}
    }, [r]),
    e.jsx("canvas", { ref: y, className: "max-h-8 max-w-full block" })
  );
}
function je({ value: r, className: y }) {
  const [x, J] = m.useState("");
  return (
    m.useEffect(() => {
      r &&
        bs
          .toDataURL(r, { margin: 1, width: 100, color: { dark: "#000000", light: "#ffffff" } })
          .then((u) => J(u))
          .catch((u) => console.error("QR Code generation failed", u));
    }, [r]),
    x
      ? e.jsx("img", { src: x, alt: "QR Code", className: y })
      : e.jsx("div", { className: "size-10 bg-slate-100 animate-pulse rounded" })
  );
}
const De = (() => {
  const r = new Date(),
    y = r.getFullYear();
  return r.getMonth() >= 5 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
})();
function Ts() {
  const { currentSchoolId: r, user: y, roles: x, loading: J } = us();
  (x.includes("admin") || x.includes("super_admin"), hs("ID Cards"));
  const [u, W] = m.useState("overview"),
    [k, F] = m.useState("modern-blue"),
    [l, P] = m.useState("portrait"),
    [Q, G] = m.useState("front-back"),
    [i, C] = m.useState(null),
    [Z, A] = m.useState([]),
    [j, L] = m.useState([]),
    [z, se] = m.useState([]),
    [T, Ne] = m.useState([]),
    [te, Qe] = m.useState([]),
    [B, X] = m.useState([]),
    [V, ce] = m.useState([]),
    [Ie, Ze] = m.useState(""),
    [ye, Ke] = m.useState("all"),
    [ve, Xe] = m.useState("all"),
    [ze, es] = m.useState(""),
    [we, ss] = m.useState("all"),
    [Ee, me] = m.useState(!0),
    [xe, re] = m.useState(!1),
    [H, _e] = m.useState(null),
    pe = m.useRef(!1),
    [ee, ke] = m.useState(null),
    [E, ae] = m.useState({ name: "", phone: "", purpose: "", host: "" }),
    [le, $e] = m.useState(null),
    [d, S] = m.useState(null),
    [p, D] = m.useState(null),
    [_, ne] = m.useState(null),
    [Re, be] = m.useState(!1),
    [ts, Fe] = m.useState("none"),
    [oe, Ae] = m.useState(null),
    Y = async () => {
      if (r) {
        me(!0);
        try {
          const [s, t, n, a, o, f, R, w] = await Promise.all([
            h
              .from("schools")
              .select(
                "id, name, school_name, logo_url, school_logo, address, phone_number, email, principal_name, principal_signature_url",
              )
              .eq("id", r)
              .single(),
            h.from("classes").select("id, name, section").eq("school_id", r).order("name"),
            h
              .from("students")
              .select("*, classes(name, section)")
              .eq("school_id", r)
              .order("full_name"),
            h.from("profiles").select("*").eq("school_id", r),
            h
              .from("visitor_passes")
              .select("*")
              .eq("school_id", r)
              .order("created_at", { ascending: !1 }),
            h
              .from("id_card_history")
              .select("*, profiles(full_name)")
              .eq("school_id", r)
              .order("printed_at", { ascending: !1 }),
            h
              .from("rankings")
              .select("student_id, rank_position, percentage, rank_type")
              .eq("school_id", r),
            h.from("awards").select("student_id, category, title").eq("school_id", r),
          ]);
          (s.data
            ? C({
                id: s.data.id,
                name: s.data.school_name || s.data.name,
                logo_url: s.data.school_logo || s.data.logo_url,
                address: s.data.address,
                phone_number: s.data.phone_number,
                email: s.data.email,
                principal_name: s.data.principal_name || "",
                principal_signature_url: s.data.principal_signature_url || null,
              })
            : C(null),
            A(t.data || []));
          const g = (n.data || []).map((c) => {
            const q = (R.data || []).filter((O) => O.student_id === c.id),
              U = (w.data || []).filter((O) => O.student_id === c.id);
            return {
              ...c,
              classes: Array.isArray(c.classes) ? c.classes[0] || null : c.classes,
              rankings: q,
              awards: U,
            };
          });
          L(g);
          const v = (
              (await h.from("user_roles").select("user_id, role").eq("school_id", r)).data || []
            )
              .filter((c) => c.role === "admin" || c.role === "teacher")
              .map((c) => c.user_id),
            I = (a.data || [])
              .filter((c) => v.includes(c.user_id))
              .map((c) => ({
                user_id: c.user_id,
                full_name: c.full_name || "—",
                email: c.email,
                photo_url: c.photo_url,
                employee_id: c.employee_id,
                designation: c.designation,
                department: c.department,
                joining_date: c.joining_date,
                mobile_number: c.mobile_number,
                blood_group: c.blood_group,
                address: c.address,
                emergency_contact: c.emergency_contact,
                notes: c.notes,
              }));
          (se(I), Ne(o.data || []), Qe(f.data || []));
        } catch (s) {
          b.error(s.message || "Failed to load ERP records.");
        } finally {
          me(!1);
        }
      }
    };
  m.useEffect(() => {
    Y();
  }, [r]);
  const ue = (s, t, n) => {
      const a = s.target.files?.[0];
      if (!a) return;
      const o = new FileReader();
      ((o.onload = () => {
        ke({ type: t, id: n, original: o.result });
      }),
        o.readAsDataURL(a));
    },
    rs = async (s) => {
      if (!ee) return;
      const { type: t, id: n } = ee;
      (ke(null), me(!0));
      try {
        let a = s;
        if (t === "student" || t === "staff" || t === "school" || t === "signature")
          try {
            const o = atob(s.split(",")[1]),
              f = new ArrayBuffer(o.length),
              R = new Uint8Array(f);
            for (let U = 0; U < o.length; U++) R[U] = o.charCodeAt(U);
            const w = t === "signature",
              g = new Blob([f], { type: w ? "image/png" : "image/jpeg" }),
              v = `${n}.${w ? "png" : "jpg"}`;
            let I = "student-photos";
            t === "school"
              ? (I = "school-logos")
              : t === "signature"
                ? (I = "signatures")
                : (t === "student" || t === "staff") && (I = "student-photos");
            const { error: c } = await h.storage.from(I).upload(v, g, {
              contentType: w ? "image/png" : "image/jpeg",
              cacheControl: "3600",
              upsert: !0,
            });
            if (c) throw c;
            const { data: q } = h.storage.from(I).getPublicUrl(v);
            a = q.publicUrl;
          } catch (o) {
            console.error("Storage upload failed, falling back to base64:", o);
          }
        if (t === "student") {
          const { error: o } = await h
            .from("students")
            .update({ photo_url: a })
            .eq("id", n)
            .eq("school_id", r);
          if (o) throw o;
          (b.success("Student photo updated successfully."),
            d && d.id === n && S({ ...d, photo_url: a }));
        } else if (t === "staff") {
          const { error: o } = await h
            .from("profiles")
            .update({ photo_url: a })
            .eq("user_id", n)
            .eq("school_id", r);
          if (o) throw o;
          (b.success("Staff photo updated successfully."),
            p && p.user_id === n && D({ ...p, photo_url: a }));
        } else if (t === "school") {
          const { error: o } = await h.from("schools").update({ logo_url: a }).eq("id", n);
          if (o) throw o;
          (b.success("School logo updated."), i && C({ ...i, logo_url: a }));
        } else if (t === "signature") {
          const { error: o } = await h
            .from("schools")
            .update({ principal_signature_url: a })
            .eq("id", r);
          if (o) throw o;
          (b.success("Principal signature updated successfully."),
            i && C({ ...i, principal_signature_url: a }));
        }
        Y();
      } catch (a) {
        b.error(a.message || "Failed to save cropped image.");
      } finally {
        me(!1);
      }
    },
    as = async (s) => {
      if ((s.preventDefault(), !!r))
        try {
          const n = `VP-${new Date().getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`;
          let a = null;
          if (le && le.startsWith("data:")) {
            const R = atob(le.split(",")[1]),
              w = new ArrayBuffer(R.length),
              g = new Uint8Array(w);
            for (let q = 0; q < R.length; q++) g[q] = R.charCodeAt(q);
            const N = new Blob([w], { type: "image/jpeg" }),
              v = `${r}/visitor/${n}-${Date.now()}.jpg`,
              { error: I } = await h.storage
                .from("visitor-photos")
                .upload(v, N, { contentType: "image/jpeg", cacheControl: "3600", upsert: !0 });
            if (I) throw I;
            const { data: c } = h.storage.from("visitor-photos").getPublicUrl(v);
            a = c.publicUrl;
          }
          const { error: o } = await h.from("visitor_passes").insert({
            school_id: r,
            visitor_name: E.name,
            contact_number: E.phone,
            purpose_of_visit: E.purpose,
            host_name: E.host,
            pass_number: n,
            photo_url: a,
          });
          if (o) throw o;
          (b.success("Visitor checked in successfully."),
            ae({ name: "", phone: "", purpose: "", host: "" }),
            $e(null),
            Y());
        } catch (t) {
          b.error(t.message || "Failed to check in visitor.");
        }
    },
    ls = async (s) => {
      try {
        const { error: t } = await h
          .from("visitor_passes")
          .update({ check_out_time: new Date().toISOString() })
          .eq("id", s)
          .eq("school_id", r);
        if (t) throw t;
        (b.success("Visitor checked out."), Y());
      } catch (t) {
        b.error(t.message || "Failed to check out visitor.");
      }
    },
    ns = async (s) => {
      if ((s.preventDefault(), !!d))
        try {
          const { error: t } = await h
            .from("students")
            .update({
              full_name: d.full_name,
              roll_number: d.roll_number,
              admission_number: d.admission_number,
              blood_group: d.blood_group,
              emergency_contact: d.emergency_contact,
              transport_route: d.transport_route,
              bus_number: d.bus_number,
              academic_year: d.academic_year,
              date_of_birth: d.date_of_birth,
              parent_name: d.parent_name,
              parent_phone: d.parent_phone,
            })
            .eq("id", d.id)
            .eq("school_id", r);
          if (t) throw t;
          (b.success("Student details saved."), S(null), Y());
        } catch (t) {
          b.error(t.message || "Failed to save details.");
        }
    },
    os = async (s) => {
      if ((s.preventDefault(), !!p))
        try {
          const { error: t } = await h
            .from("profiles")
            .update({
              employee_id: p.employee_id,
              designation: p.designation,
              department: p.department,
              blood_group: p.blood_group,
              mobile_number: p.mobile_number,
              emergency_contact: p.emergency_contact,
              address: p.address,
              notes: p.notes,
            })
            .eq("user_id", p.user_id)
            .eq("school_id", r);
          if (t) throw t;
          (b.success("Staff details saved."), D(null), Y());
        } catch (t) {
          b.error(t.message || "Failed to save details.");
        }
    },
    Ce = async (s, t, n) => {
      if (!(!r || !y))
        try {
          (await h.from("id_card_history").insert({
            school_id: r,
            card_type: s,
            holder_id: t,
            academic_year: De,
            printed_by: y.id,
            reason: n,
          }),
            Y());
        } catch {}
    },
    ds = async (s, t, n) => {
      (re(!0), await new Promise((f) => setTimeout(f, 100)));
      const a = document.getElementById(`id-card-preview-front-${t.id || t.user_id}`),
        o = document.getElementById(`id-card-preview-back-${t.id || t.user_id}`);
      if (!a || (!o && n !== "front-only")) {
        (b.error("Preview card element not found."), re(!1));
        return;
      }
      try {
        const R = (await he(a, { scale: 4 })).toDataURL("image/jpeg", 0.95);
        let w = null;
        n !== "front-only" && o && (w = (await he(o, { scale: 4 })).toDataURL("image/jpeg", 0.95));
        const g = l === "portrait" ? 54 : 85.6,
          N = l === "portrait" ? 85.6 : 54;
        if (n === "side-by-side") {
          const v = new fe({
            orientation: l === "portrait" ? "landscape" : "portrait",
            unit: "mm",
            format: [g * 2, N],
          });
          (v.addImage(R, "JPEG", 0, 0, g, N),
            w && v.addImage(w, "JPEG", g, 0, g, N),
            v.save(`${t.full_name || t.visitor_name || "id"}_card.pdf`));
        } else {
          const v = new fe({ orientation: l, unit: "mm", format: [g, N] });
          (v.addImage(R, "JPEG", 0, 0, g, N),
            n === "front-back" && w && (v.addPage([g, N], l), v.addImage(w, "JPEG", 0, 0, g, N)),
            v.save(`${t.full_name || t.visitor_name || "id"}_card.pdf`));
        }
        (b.success("PDF exported successfully."), Ce(s, t.id || t.user_id, "Individual Download"));
      } catch (f) {
        b.error("Failed to generate PDF: " + f.message);
      } finally {
        re(!1);
      }
    },
    Te = async (s, t) => {
      const n =
        s === "student"
          ? j.filter((a) => B.includes(a.id))
          : z.filter((a) => V.includes(a.user_id));
      if (n.length === 0) {
        b.error("Please select at least one record to generate.");
        return;
      }
      (re(!0),
        (pe.current = !1),
        _e({ current: 0, total: n.length, activeName: "" }),
        b.info("Initializing bulk PDF generation..."),
        await new Promise((a) => setTimeout(a, 100)));
      try {
        const a = l === "portrait" ? 54 : 85.6,
          o = l === "portrait" ? 85.6 : 54;
        let f;
        t === "side-by-side"
          ? (f = new fe({
              orientation: l === "portrait" ? "landscape" : "portrait",
              unit: "mm",
              format: [a * 2, o],
            }))
          : (f = new fe({ orientation: l, unit: "mm", format: [a, o] }));
        const R = 10;
        let w = !0;
        for (let g = 0; g < n.length; g++) {
          if (pe.current) {
            b.warning("PDF generation cancelled.");
            break;
          }
          const N = n[g],
            v = N.full_name || N.visitor_name || "Card";
          _e({ current: g + 1, total: n.length, activeName: v });
          const I = document.getElementById(`bulk-card-front-${N.id || N.user_id}`),
            c = document.getElementById(`bulk-card-back-${N.id || N.user_id}`);
          if (!I) continue;
          const U = (await he(I, { scale: 4 })).toDataURL("image/jpeg", 0.85);
          let O = null;
          (t !== "front-only" &&
            c &&
            (O = (await he(c, { scale: 4 })).toDataURL("image/jpeg", 0.85)),
            t === "side-by-side"
              ? (w || f.addPage([a * 2, o], l === "portrait" ? "landscape" : "portrait"),
                f.addImage(U, "JPEG", 0, 0, a, o),
                O && f.addImage(O, "JPEG", a, 0, a, o))
              : (w || f.addPage([a, o], l),
                f.addImage(U, "JPEG", 0, 0, a, o),
                t === "front-back" &&
                  O &&
                  (f.addPage([a, o], l), f.addImage(O, "JPEG", 0, 0, a, o))),
            (w = !1),
            Ce(s, N.id || N.user_id, "Bulk Download"),
            g % R === 0 && g > 0 && (await new Promise((Le) => setTimeout(Le, 80))));
        }
        pe.current ||
          (f.save(`bulk_${s}_cards.pdf`), b.success(`Exported ${n.length} cards successfully.`));
      } catch (a) {
        b.error("Failed to export bulk PDF: " + a.message);
      } finally {
        (re(!1), _e(null));
      }
    },
    Me = (s, t, n) => {
      (Ae({ type: s, list: t }),
        Fe(n),
        setTimeout(() => {
          (window.print(),
            Fe("none"),
            Ae(null),
            t.forEach((a) => {
              Ce(s, a.id || a.user_id, `Print (${n.toUpperCase()})`);
            }));
        }, 500));
    },
    is = () => {
      (X(K.map((s) => s.id)), b.success(`Selected all ${K.length} class students.`));
    },
    cs = () => {
      (X(j.map((s) => s.id)), b.success(`Selected all ${j.length} students school-wide.`));
    },
    K = j.filter((s) => {
      const t = Ie.toLowerCase(),
        n =
          s.full_name.toLowerCase().includes(t) ||
          (s.admission_number || "").toLowerCase().includes(t) ||
          (s.roll_number || "").toLowerCase().includes(t),
        a = ye === "all" || s.class_id === ye;
      let o = !0;
      return (
        ve === "missing" ? (o = !s.photo_url) : ve === "present" && (o = !!s.photo_url),
        n && a && o
      );
    }),
    de = z.filter((s) => {
      const t = ze.toLowerCase(),
        n =
          s.full_name.toLowerCase().includes(t) || (s.employee_id || "").toLowerCase().includes(t),
        a = we === "all" || s.department === we;
      return n && a;
    }),
    ms = Array.from(new Set(z.map((s) => s.department).filter(Boolean))),
    $ = i?.principal_signature_url || null,
    xs = j.filter((s) => s.academic_year && s.academic_year !== "2025-2026").length;
  return J
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
          e.jsx(fs, {
            title: "ID Cards",
            breadcrumb: "Card & Visitor Passes",
            actions: e.jsx("div", {
              className: "flex bg-secondary rounded-md p-0.5",
              children: ["overview", "students", "staff", "visitors", "settings", "reports"].map(
                (s) =>
                  e.jsx(
                    "button",
                    {
                      onClick: () => W(s),
                      className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition ${u === s ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                      children: s,
                    },
                    s,
                  ),
              ),
            }),
          }),
          e.jsxs("div", {
            className: "flex-1 overflow-y-auto p-8 space-y-6 print:hidden",
            children: [
              u === "overview" &&
                e.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                      children: [
                        e.jsx(ge, {
                          title: "Total Cards",
                          count: j.length + z.length,
                          subtext: "Enrolled profiles",
                          icon: e.jsx(gs, { className: "size-5 text-brand" }),
                        }),
                        e.jsx(ge, {
                          title: "Visitor Passes",
                          count: T.length,
                          subtext: `${T.filter((s) => !s.check_out_time).length} active guests`,
                          icon: e.jsx(ys, { className: "size-5 text-warning" }),
                        }),
                        e.jsx(ge, {
                          title: "Missing Photos",
                          count:
                            j.filter((s) => !s.photo_url).length +
                            z.filter((s) => !s.photo_url).length,
                          subtext: "Requires upload",
                          icon: e.jsx(Oe, { className: "size-5 text-danger" }),
                        }),
                        e.jsx(ge, {
                          title: "Expired Cards",
                          count: xs,
                          subtext: "Requires renewal",
                          icon: e.jsx(Ge, { className: "size-5 text-danger" }),
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                      children: [
                        e.jsxs("section", {
                          className: "bg-card border border-border rounded-xl p-5 space-y-4",
                          children: [
                            e.jsxs("div", {
                              className: "flex items-center gap-2 border-b border-border pb-3",
                              children: [
                                e.jsx(Be, { className: "size-4 text-brand" }),
                                e.jsx("h3", {
                                  className: "font-semibold text-sm",
                                  children: "Theme Settings",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "space-y-3",
                              children: [
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("label", {
                                      className:
                                        "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5",
                                      children: "Template Theme",
                                    }),
                                    e.jsxs("select", {
                                      value: k,
                                      onChange: (s) => F(s.target.value),
                                      className:
                                        "w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none",
                                      children: [
                                        e.jsx("option", {
                                          value: "modern-blue",
                                          children: "Modern School Design (Vertical/Horizontal)",
                                        }),
                                        e.jsx("option", {
                                          value: "premium-corporate",
                                          children: "Premium Corporate Design",
                                        }),
                                        e.jsx("option", {
                                          value: "gold-premium",
                                          children: "Gold Premium Design",
                                        }),
                                        e.jsx("option", {
                                          value: "school-classic",
                                          children: "School Classic Design",
                                        }),
                                        e.jsx("option", {
                                          value: "minimal",
                                          children: "Minimalist Card Design",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                e.jsxs("div", {
                                  children: [
                                    e.jsx("label", {
                                      className:
                                        "text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5",
                                      children: "Card Orientation Layout",
                                    }),
                                    e.jsxs("div", {
                                      className: "grid grid-cols-2 gap-2",
                                      children: [
                                        e.jsx("button", {
                                          onClick: () => P("portrait"),
                                          className: `py-2 text-xs font-medium rounded-md border text-center transition ${l === "portrait" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"}`,
                                          children: "Vertical PVC Size",
                                        }),
                                        e.jsx("button", {
                                          onClick: () => P("landscape"),
                                          className: `py-2 text-xs font-medium rounded-md border text-center transition ${l === "landscape" ? "bg-brand text-white border-brand shadow-sm" : "bg-card border-border hover:bg-secondary"}`,
                                          children: "Horizontal PVC Size",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("section", {
                          className:
                            "lg:col-span-2 bg-card border border-border rounded-xl p-5 flex flex-col justify-between",
                          children: [
                            e.jsxs("div", {
                              className: "space-y-3",
                              children: [
                                e.jsxs("h3", {
                                  className: "font-semibold text-sm flex items-center gap-1.5",
                                  children: [
                                    e.jsx(Pe, { className: "size-4 text-amber-500" }),
                                    "Achievements Integration Active",
                                  ],
                                }),
                                e.jsx("p", {
                                  className: "text-xs text-muted-foreground leading-relaxed",
                                  children:
                                    "This ID Card Module is fully integrated with the Achievements & Rankings system. If a student has a class rank of #1, #2, or #3 (e.g., Aarav Sharma is Rank #1), the front of their card will dynamically display a gold/silver/bronze academic topper medal. Scanning the card's QR code will load the public verification page, displaying real-time database credentials, card status (Active/Inactive), and official honors.",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex gap-2 pt-4 border-t border-border mt-4",
                              children: [
                                e.jsx("button", {
                                  onClick: () => W("students"),
                                  className:
                                    "px-3 py-2 text-xs bg-brand text-white rounded-md font-semibold",
                                  children: "Manage Students",
                                }),
                                e.jsx("button", {
                                  onClick: () => W("staff"),
                                  className:
                                    "px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground",
                                  children: "Manage Staff",
                                }),
                                e.jsx("button", {
                                  onClick: () => W("visitors"),
                                  className:
                                    "px-3 py-2 text-xs bg-secondary hover:bg-secondary/70 border border-border rounded-md font-semibold text-foreground",
                                  children: "Guest passes",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("section", {
                      className: "bg-card border border-border rounded-xl overflow-hidden",
                      children: [
                        e.jsxs("div", {
                          className:
                            "px-5 py-4 border-b border-border flex items-center justify-between",
                          children: [
                            e.jsxs("h3", {
                              className: "font-semibold text-sm flex items-center gap-2",
                              children: [
                                e.jsx(Cs, { className: "size-4 text-muted-foreground" }),
                                "Recent Issuance & Reprint Logs",
                              ],
                            }),
                            e.jsxs("span", {
                              className: "text-xs text-muted-foreground",
                              children: [te.length, " records logged"],
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "overflow-x-auto",
                          children: e.jsxs("table", {
                            className: "w-full text-left text-xs",
                            children: [
                              e.jsx("thead", {
                                className: "bg-secondary text-muted-foreground",
                                children: e.jsxs("tr", {
                                  children: [
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Date & Time",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Card Type",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Holder Reference ID",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Operator",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Issuance Reason",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Session",
                                    }),
                                  ],
                                }),
                              }),
                              e.jsxs("tbody", {
                                className: "divide-y divide-border text-muted-foreground",
                                children: [
                                  te.slice(0, 5).map((s) =>
                                    e.jsxs(
                                      "tr",
                                      {
                                        className: "hover:bg-secondary/20",
                                        children: [
                                          e.jsx("td", {
                                            className: "px-6 py-3 font-mono",
                                            children: new Date(s.printed_at).toLocaleString(),
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3 font-semibold uppercase",
                                            children: s.card_type,
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3 font-mono",
                                            children: s.holder_id,
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3",
                                            children: s.profiles?.full_name || "Operator",
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3",
                                            children: s.reason || "First Issue",
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3",
                                            children: s.academic_year,
                                          }),
                                        ],
                                      },
                                      s.id,
                                    ),
                                  ),
                                  te.length === 0 &&
                                    e.jsx("tr", {
                                      children: e.jsx("td", {
                                        colSpan: 6,
                                        className: "text-center py-6 text-slate-400",
                                        children: "No print logs found.",
                                      }),
                                    }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              u === "students" &&
                e.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    e.jsxs("div", {
                      className:
                        "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-wrap items-center gap-3",
                          children: [
                            e.jsx("input", {
                              value: Ie,
                              onChange: (s) => Ze(s.target.value),
                              placeholder: "Search student name, adm #...",
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none",
                            }),
                            e.jsxs("select", {
                              value: ye,
                              onChange: (s) => Ke(s.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                              children: [
                                e.jsx("option", { value: "all", children: "All Classes" }),
                                Z.map((s) =>
                                  e.jsxs(
                                    "option",
                                    {
                                      value: s.id,
                                      children: [s.name, " ", s.section ? ` · ${s.section}` : ""],
                                    },
                                    s.id,
                                  ),
                                ),
                              ],
                            }),
                            e.jsxs("select", {
                              value: ve,
                              onChange: (s) => Xe(s.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                              children: [
                                e.jsx("option", { value: "all", children: "All Photos" }),
                                e.jsx("option", { value: "present", children: "With Photo" }),
                                e.jsx("option", { value: "missing", children: "Missing Photo" }),
                              ],
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "flex items-center gap-2",
                          children: [
                            e.jsx("button", {
                              onClick: is,
                              className:
                                "px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1",
                              children: "Select Class",
                            }),
                            e.jsx("button", {
                              onClick: cs,
                              className:
                                "px-2.5 py-1.5 text-xs border border-border bg-secondary hover:bg-secondary/70 rounded-md font-semibold text-foreground inline-flex items-center gap-1",
                              children: "Select School-wide",
                            }),
                            B.length > 0 &&
                              e.jsxs("div", {
                                className: "flex items-center gap-2 ml-2",
                                children: [
                                  e.jsxs("span", {
                                    className: "text-xs text-muted-foreground font-semibold",
                                    children: [B.length, " selected"],
                                  }),
                                  e.jsxs("div", {
                                    className:
                                      "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                                    children: [
                                      e.jsxs("select", {
                                        value: Q,
                                        onChange: (s) => G(s.target.value),
                                        className:
                                          "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                                        style: { WebkitAppearance: "none", MozAppearance: "none" },
                                        title: "PDF Layout Options",
                                        children: [
                                          e.jsx("option", {
                                            value: "front-back",
                                            children: "Front+Back",
                                          }),
                                          e.jsx("option", {
                                            value: "front-only",
                                            children: "Front Only",
                                          }),
                                          e.jsx("option", {
                                            value: "side-by-side",
                                            children: "Side-by-Side",
                                          }),
                                        ],
                                      }),
                                      e.jsxs("button", {
                                        onClick: () => Te("student", Q),
                                        disabled: xe,
                                        className:
                                          "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                                        children: [e.jsx(Ve, { className: "size-3" }), " Export"],
                                      }),
                                    ],
                                  }),
                                  e.jsxs("button", {
                                    onClick: () => {
                                      const s = j.filter((t) => B.includes(t.id));
                                      Me("student", s, "a4");
                                    },
                                    className:
                                      "px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold",
                                    children: [
                                      e.jsx(qe, { className: "size-3" }),
                                      " A4 Grid Print",
                                    ],
                                  }),
                                ],
                              }),
                            e.jsxs("div", {
                              className:
                                "flex border border-border rounded-md overflow-hidden bg-secondary ml-2",
                              children: [
                                e.jsx("button", {
                                  onClick: () => P("portrait"),
                                  className: `px-2.5 py-1.5 text-xs font-semibold ${l === "portrait" ? "bg-white shadow-sm" : ""}`,
                                  children: "Vert",
                                }),
                                e.jsx("button", {
                                  onClick: () => P("landscape"),
                                  className: `px-2.5 py-1.5 text-xs font-semibold ${l === "landscape" ? "bg-white shadow-sm" : ""}`,
                                  children: "Horiz",
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "bg-card border border-border rounded-xl overflow-hidden",
                      children: e.jsxs("table", {
                        className: "w-full text-left text-xs",
                        children: [
                          e.jsx("thead", {
                            className: "bg-secondary text-muted-foreground",
                            children: e.jsxs("tr", {
                              children: [
                                e.jsx("th", {
                                  className: "px-6 py-3 w-10",
                                  children: e.jsx("input", {
                                    type: "checkbox",
                                    checked: B.length === K.length && K.length > 0,
                                    onChange: (s) => {
                                      s.target.checked ? X(K.map((t) => t.id)) : X([]);
                                    },
                                    className: "rounded",
                                  }),
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Photo",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Student ID #",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Student Name",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Class / Section",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Blood Group",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Transport / Bus",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium text-right",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          e.jsxs("tbody", {
                            className: "divide-y divide-border",
                            children: [
                              K.map((s) => {
                                const t = s.rankings?.find((a) => a.rank_position <= 3),
                                  n = Je(s);
                                return e.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/20",
                                    children: [
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsx("input", {
                                          type: "checkbox",
                                          checked: B.includes(s.id),
                                          onChange: (a) => {
                                            a.target.checked
                                              ? X([...B, s.id])
                                              : X(B.filter((o) => o !== s.id));
                                          },
                                          className: "rounded",
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsxs("div", {
                                          className:
                                            "relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0",
                                          children: [
                                            s.photo_url
                                              ? e.jsx("img", {
                                                  src: s.photo_url,
                                                  alt: "",
                                                  className: "size-full object-cover",
                                                })
                                              : e.jsx(ie, { className: "size-4 text-slate-400" }),
                                            e.jsxs("label", {
                                              className:
                                                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                              children: [
                                                e.jsx(Se, { className: "size-3 text-white" }),
                                                e.jsx("input", {
                                                  type: "file",
                                                  accept: "image/*",
                                                  onChange: (a) => ue(a, "student", s.id),
                                                  className: "hidden",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-mono font-semibold",
                                        children: n,
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsxs("div", {
                                          className: "flex items-center gap-1.5",
                                          children: [
                                            e.jsx("span", {
                                              className: "font-semibold text-foreground",
                                              children: s.full_name,
                                            }),
                                            t &&
                                              e.jsxs("span", {
                                                className:
                                                  "inline-flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-bold px-1 py-0.5 rounded",
                                                children: [
                                                  e.jsx(Pe, { className: "size-2.5" }),
                                                  " Rank ",
                                                  t.rank_position,
                                                ],
                                              }),
                                          ],
                                        }),
                                      }),
                                      e.jsxs("td", {
                                        className: "px-6 py-3",
                                        children: [
                                          s.classes?.name || "—",
                                          " ",
                                          s.classes?.section ? `(${s.classes.section})` : "",
                                        ],
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsx("span", {
                                          className: "font-semibold text-red-500",
                                          children: s.blood_group || "—",
                                        }),
                                      }),
                                      e.jsxs("td", {
                                        className: "px-6 py-3 truncate max-w-[150px]",
                                        children: [
                                          s.transport_route || "—",
                                          " ",
                                          s.bus_number ? `(${s.bus_number})` : "",
                                        ],
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-right",
                                        children: e.jsxs("div", {
                                          className: "flex justify-end gap-2",
                                          children: [
                                            e.jsxs("button", {
                                              onClick: () => {
                                                (ne({ type: "student", data: s }), be(!1));
                                              },
                                              className:
                                                "text-brand hover:underline inline-flex items-center gap-0.5 font-semibold",
                                              children: [
                                                e.jsx(Ue, { className: "size-3" }),
                                                " Preview",
                                              ],
                                            }),
                                            e.jsx("button", {
                                              onClick: () => S(s),
                                              className: "text-brand hover:underline font-semibold",
                                              children: "Edit",
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  s.id,
                                );
                              }),
                              K.length === 0 &&
                                e.jsx("tr", {
                                  children: e.jsx("td", {
                                    colSpan: 8,
                                    className: "text-center py-12 text-slate-400",
                                    children: Ee
                                      ? "Loading ERP roster..."
                                      : "No student records matching your filters found.",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              u === "staff" &&
                e.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    e.jsxs("div", {
                      className:
                        "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
                      children: [
                        e.jsxs("div", {
                          className: "flex flex-wrap items-center gap-3",
                          children: [
                            e.jsx("input", {
                              value: ze,
                              onChange: (s) => es(s.target.value),
                              placeholder: "Search staff name, emp id...",
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background w-48 focus:outline-none",
                            }),
                            e.jsxs("select", {
                              value: we,
                              onChange: (s) => ss(s.target.value),
                              className:
                                "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none",
                              children: [
                                e.jsx("option", { value: "all", children: "All Departments" }),
                                ms.map((s) => e.jsx("option", { value: s, children: s }, s)),
                              ],
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "flex items-center gap-2",
                          children:
                            V.length > 0 &&
                            e.jsxs("div", {
                              className: "flex items-center gap-2 mr-2",
                              children: [
                                e.jsxs("span", {
                                  className: "text-xs text-muted-foreground font-semibold",
                                  children: [V.length, " selected"],
                                }),
                                e.jsxs("div", {
                                  className:
                                    "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                                  children: [
                                    e.jsxs("select", {
                                      value: Q,
                                      onChange: (s) => G(s.target.value),
                                      className:
                                        "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                                      style: { WebkitAppearance: "none", MozAppearance: "none" },
                                      title: "PDF Layout Options",
                                      children: [
                                        e.jsx("option", {
                                          value: "front-back",
                                          children: "Front+Back",
                                        }),
                                        e.jsx("option", {
                                          value: "front-only",
                                          children: "Front Only",
                                        }),
                                        e.jsx("option", {
                                          value: "side-by-side",
                                          children: "Side-by-Side",
                                        }),
                                      ],
                                    }),
                                    e.jsxs("button", {
                                      onClick: () => Te("staff", Q),
                                      disabled: xe,
                                      className:
                                        "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                                      children: [e.jsx(Ve, { className: "size-3" }), " Export"],
                                    }),
                                  ],
                                }),
                                e.jsxs("button", {
                                  onClick: () => {
                                    const s = z.filter((t) => V.includes(t.user_id));
                                    Me("staff", s, "a4");
                                  },
                                  className:
                                    "px-3 py-1.5 text-xs bg-secondary border border-border rounded-md inline-flex items-center gap-1 text-foreground font-semibold",
                                  children: [e.jsx(qe, { className: "size-3" }), " A4 Grid Print"],
                                }),
                              ],
                            }),
                        }),
                      ],
                    }),
                    e.jsx("div", {
                      className: "bg-card border border-border rounded-xl overflow-hidden",
                      children: e.jsxs("table", {
                        className: "w-full text-left text-xs",
                        children: [
                          e.jsx("thead", {
                            className: "bg-secondary text-muted-foreground",
                            children: e.jsxs("tr", {
                              children: [
                                e.jsx("th", {
                                  className: "px-6 py-3 w-10",
                                  children: e.jsx("input", {
                                    type: "checkbox",
                                    checked: V.length === de.length && de.length > 0,
                                    onChange: (s) => {
                                      s.target.checked ? ce(de.map((t) => t.user_id)) : ce([]);
                                    },
                                    className: "rounded",
                                  }),
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Photo",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Employee ID #",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Name",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Designation",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Department",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Contact Number",
                                }),
                                e.jsx("th", {
                                  className: "px-6 py-3 font-medium text-right",
                                  children: "Actions",
                                }),
                              ],
                            }),
                          }),
                          e.jsxs("tbody", {
                            className: "divide-y divide-border",
                            children: [
                              de.map((s) => {
                                const t = We(s);
                                return e.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/20",
                                    children: [
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsx("input", {
                                          type: "checkbox",
                                          checked: V.includes(s.user_id),
                                          onChange: (n) => {
                                            n.target.checked
                                              ? ce([...V, s.user_id])
                                              : ce(V.filter((a) => a !== s.user_id));
                                          },
                                          className: "rounded",
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: e.jsxs("div", {
                                          className:
                                            "relative group size-8 rounded bg-slate-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0",
                                          children: [
                                            s.photo_url
                                              ? e.jsx("img", {
                                                  src: s.photo_url,
                                                  alt: "",
                                                  className: "size-full object-cover",
                                                })
                                              : e.jsx(ie, { className: "size-4 text-slate-400" }),
                                            e.jsxs("label", {
                                              className:
                                                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                              children: [
                                                e.jsx(Se, { className: "size-3 text-white" }),
                                                e.jsx("input", {
                                                  type: "file",
                                                  accept: "image/*",
                                                  onChange: (n) => ue(n, "staff", s.user_id),
                                                  className: "hidden",
                                                }),
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-mono font-semibold",
                                        children: t,
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-semibold text-foreground",
                                        children: s.full_name,
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 font-medium",
                                        children: s.designation || "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: s.department || "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3",
                                        children: s.mobile_number || "—",
                                      }),
                                      e.jsx("td", {
                                        className: "px-6 py-3 text-right",
                                        children: e.jsxs("div", {
                                          className: "flex justify-end gap-2",
                                          children: [
                                            e.jsxs("button", {
                                              onClick: () => {
                                                (ne({ type: "staff", data: s }), be(!1));
                                              },
                                              className:
                                                "text-brand hover:underline inline-flex items-center gap-0.5 font-semibold",
                                              children: [
                                                e.jsx(Ue, { className: "size-3" }),
                                                " Preview",
                                              ],
                                            }),
                                            e.jsx("button", {
                                              onClick: () => D(s),
                                              className: "text-brand hover:underline font-semibold",
                                              children: "Edit",
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  },
                                  s.user_id,
                                );
                              }),
                              de.length === 0 &&
                                e.jsx("tr", {
                                  children: e.jsx("td", {
                                    colSpan: 8,
                                    className: "text-center py-12 text-slate-400",
                                    children: Ee
                                      ? "Querying ERP records..."
                                      : "No matching staff records found.",
                                  }),
                                }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  ],
                }),
              u === "visitors" &&
                e.jsxs("div", {
                  className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                  children: [
                    e.jsxs("form", {
                      onSubmit: as,
                      className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                      children: [
                        e.jsx("h3", {
                          className: "font-semibold text-sm border-b border-border pb-3",
                          children: "New Visitor Check-In",
                        }),
                        e.jsxs("div", {
                          className: "space-y-1.5 text-center",
                          children: [
                            e.jsx("label", {
                              className:
                                "text-xs font-semibold text-muted-foreground block text-left",
                              children: "Visitor Snap (Optional)",
                            }),
                            e.jsxs("div", {
                              className:
                                "size-20 rounded-lg bg-secondary border border-border overflow-hidden mx-auto flex items-center justify-center relative group",
                              children: [
                                le
                                  ? e.jsx("img", {
                                      src: le,
                                      alt: "Visitor",
                                      className: "size-full object-cover",
                                    })
                                  : e.jsx(Se, { className: "size-6 text-slate-400" }),
                                e.jsxs("label", {
                                  className:
                                    "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-[10px] text-white font-medium",
                                      children: "Capture",
                                    }),
                                    e.jsx("input", {
                                      type: "file",
                                      accept: "image/*",
                                      onChange: (s) => {
                                        const t = s.target.files?.[0];
                                        if (t) {
                                          const n = new FileReader();
                                          ((n.onload = () => $e(n.result)), n.readAsDataURL(t));
                                        }
                                      },
                                      className: "hidden",
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
                              className: "text-xs font-semibold block mb-1",
                              children: "Visitor Full Name *",
                            }),
                            e.jsx("input", {
                              required: !0,
                              value: E.name,
                              onChange: (s) => ae({ ...E, name: s.target.value }),
                              placeholder: "e.g. Ramesh Chandra",
                              className:
                                "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "Contact Number *",
                            }),
                            e.jsx("input", {
                              required: !0,
                              value: E.phone,
                              onChange: (s) => ae({ ...E, phone: s.target.value }),
                              placeholder: "e.g. +91 99000 88000",
                              className:
                                "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "Purpose of Visit",
                            }),
                            e.jsx("input", {
                              value: E.purpose,
                              onChange: (s) => ae({ ...E, purpose: s.target.value }),
                              placeholder: "e.g. Admissions query",
                              className:
                                "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          children: [
                            e.jsx("label", {
                              className: "text-xs font-semibold block mb-1",
                              children: "Host Member",
                            }),
                            e.jsx("input", {
                              value: E.host,
                              onChange: (s) => ae({ ...E, host: s.target.value }),
                              placeholder: "e.g. Admin or Principal",
                              className:
                                "w-full px-3 py-2 text-xs border border-border rounded-md bg-background focus:outline-none",
                            }),
                          ],
                        }),
                        e.jsx("button", {
                          type: "submit",
                          className:
                            "w-full py-2 bg-brand text-white rounded-md text-xs font-semibold hover:opacity-90 transition",
                          children: "Issue Pass & Check In",
                        }),
                      ],
                    }),
                    e.jsxs("div", {
                      className:
                        "lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden h-fit",
                      children: [
                        e.jsx("div", {
                          className: "px-5 py-4 border-b border-border",
                          children: e.jsx("h3", {
                            className: "font-semibold text-sm",
                            children: "Guest Logs",
                          }),
                        }),
                        e.jsx("div", {
                          className: "overflow-x-auto",
                          children: e.jsxs("table", {
                            className: "w-full text-left text-xs",
                            children: [
                              e.jsx("thead", {
                                className: "bg-secondary text-muted-foreground",
                                children: e.jsxs("tr", {
                                  children: [
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Pass Number",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Visitor",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Purpose / Host",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Checked In",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium",
                                      children: "Checked Out",
                                    }),
                                    e.jsx("th", {
                                      className: "px-6 py-2.5 font-medium text-right",
                                      children: "Actions",
                                    }),
                                  ],
                                }),
                              }),
                              e.jsxs("tbody", {
                                className: "divide-y divide-border",
                                children: [
                                  T.map((s) =>
                                    e.jsxs(
                                      "tr",
                                      {
                                        className: "hover:bg-secondary/15",
                                        children: [
                                          e.jsx("td", {
                                            className:
                                              "px-6 py-3 font-mono font-semibold text-slate-700",
                                            children: s.pass_number,
                                          }),
                                          e.jsxs("td", {
                                            className: "px-6 py-3",
                                            children: [
                                              e.jsxs("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                  s.photo_url
                                                    ? e.jsx("img", {
                                                        src: s.photo_url,
                                                        alt: "",
                                                        className: "size-6 rounded object-cover",
                                                      })
                                                    : e.jsx(ie, {
                                                        className: "size-4 text-slate-400",
                                                      }),
                                                  e.jsx("span", {
                                                    className: "font-semibold text-foreground",
                                                    children: s.visitor_name,
                                                  }),
                                                ],
                                              }),
                                              e.jsx("span", {
                                                className:
                                                  "text-[10px] text-muted-foreground block font-mono",
                                                children: s.contact_number,
                                              }),
                                            ],
                                          }),
                                          e.jsxs("td", {
                                            className: "px-6 py-3",
                                            children: [
                                              e.jsx("p", {
                                                className: "font-medium text-foreground",
                                                children: s.purpose_of_visit || "—",
                                              }),
                                              e.jsxs("p", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: ["Host: ", s.host_name || "—"],
                                              }),
                                            ],
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3 text-muted-foreground font-mono",
                                            children: new Date(
                                              s.check_in_time,
                                            ).toLocaleTimeString(),
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3 font-mono",
                                            children: s.check_out_time
                                              ? e.jsx("span", {
                                                  className: "text-slate-400",
                                                  children: new Date(
                                                    s.check_out_time,
                                                  ).toLocaleTimeString(),
                                                })
                                              : e.jsx("span", {
                                                  className:
                                                    "text-emerald-500 font-semibold uppercase tracking-wider text-[9px] bg-emerald-500/10 px-1.5 py-0.5 rounded",
                                                  children: "Active",
                                                }),
                                          }),
                                          e.jsx("td", {
                                            className: "px-6 py-3 text-right",
                                            children: e.jsxs("div", {
                                              className: "flex justify-end gap-2",
                                              children: [
                                                e.jsx("button", {
                                                  onClick: () => {
                                                    (ne({ type: "visitor", data: s }), be(!1));
                                                  },
                                                  className:
                                                    "text-brand hover:underline inline-flex items-center font-semibold",
                                                  children: "Badge",
                                                }),
                                                !s.check_out_time &&
                                                  e.jsx("button", {
                                                    onClick: () => ls(s.id),
                                                    className:
                                                      "text-danger hover:underline font-semibold",
                                                    children: "Check Out",
                                                  }),
                                              ],
                                            }),
                                          }),
                                        ],
                                      },
                                      s.id,
                                    ),
                                  ),
                                  T.length === 0 &&
                                    e.jsx("tr", {
                                      children: e.jsx("td", {
                                        colSpan: 6,
                                        className: "text-center py-8 text-slate-400",
                                        children: "No visitors logged today.",
                                      }),
                                    }),
                                ],
                              }),
                            ],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              u === "settings" &&
                e.jsxs("div", {
                  className:
                    "max-w-2xl bg-card border border-border rounded-xl overflow-hidden p-6 space-y-6",
                  children: [
                    e.jsxs("h3", {
                      className:
                        "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                      children: [
                        e.jsx(vs, { className: "size-4 text-brand" }),
                        "School Details Settings",
                      ],
                    }),
                    e.jsxs("div", {
                      className: "grid grid-cols-1 md:grid-cols-3 gap-6",
                      children: [
                        e.jsxs("div", {
                          className: "space-y-2 text-center border-r border-border pr-6",
                          children: [
                            e.jsx("label", {
                              className: "text-xs font-semibold block text-left mb-2",
                              children: "School Official Logo",
                            }),
                            e.jsxs("div", {
                              className:
                                "size-24 rounded-xl bg-slate-50 border border-dashed border-border mx-auto flex items-center justify-center overflow-hidden relative group",
                              children: [
                                i?.logo_url
                                  ? e.jsx("img", {
                                      src: i.logo_url,
                                      alt: "Logo",
                                      className: "size-full object-contain p-2",
                                    })
                                  : e.jsx(ws, { className: "size-8 text-slate-400" }),
                                e.jsxs("label", {
                                  className:
                                    "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-[10px] text-white font-medium",
                                      children: "Upload logo",
                                    }),
                                    e.jsx("input", {
                                      type: "file",
                                      accept: "image/*",
                                      onChange: (s) => ue(s, "school", r),
                                      className: "hidden",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsx("p", {
                              className: "text-[10px] text-muted-foreground",
                              children: "Format: PNG/JPG square",
                            }),
                          ],
                        }),
                        e.jsxs("div", {
                          className: "space-y-2 text-center col-span-2",
                          children: [
                            e.jsx("label", {
                              className: "text-xs font-semibold block text-left mb-2",
                              children: "Principal Official Signature",
                            }),
                            e.jsxs("div", {
                              className:
                                "h-24 w-full rounded-xl bg-slate-50 border border-dashed border-border flex items-center justify-center overflow-hidden relative group p-2",
                              children: [
                                $
                                  ? e.jsx("img", {
                                      src: $,
                                      alt: "Signature",
                                      className: "h-full max-w-full object-contain",
                                    })
                                  : e.jsxs("div", {
                                      className: "text-center",
                                      children: [
                                        e.jsx(Be, {
                                          className: "size-6 text-slate-400 mx-auto mb-1",
                                        }),
                                        e.jsx("span", {
                                          className: "text-[11px] text-muted-foreground",
                                          children: "No signature uploaded",
                                        }),
                                      ],
                                    }),
                                e.jsxs("label", {
                                  className:
                                    "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer",
                                  children: [
                                    e.jsx("span", {
                                      className: "text-xs text-white font-medium",
                                      children: "Upload Signature Image",
                                    }),
                                    e.jsx("input", {
                                      type: "file",
                                      accept: "image/*",
                                      onChange: (s) => ue(s, "signature", r),
                                      className: "hidden",
                                    }),
                                  ],
                                }),
                              ],
                            }),
                            e.jsx("p", {
                              className: "text-[10px] text-muted-foreground text-left",
                              children: "Upload transparent PNG signature of the school principal.",
                            }),
                          ],
                        }),
                      ],
                    }),
                    e.jsxs("form", {
                      onSubmit: async (s) => {
                        if ((s.preventDefault(), !(!i || !r)))
                          try {
                            const { error: t } = await h
                              .from("schools")
                              .update({
                                name: i.name,
                                address: i.address,
                                phone_number: i.phone_number,
                                email: i.email,
                                principal_name: i.principal_name || null,
                              })
                              .eq("id", r);
                            if (t) throw t;
                            (b.success("School profile settings updated successfully."), Y());
                          } catch (t) {
                            b.error(t.message || "Failed to update settings.");
                          }
                      },
                      className: "space-y-4 pt-4 border-t border-border",
                      children: [
                        e.jsxs("div", {
                          className: "grid grid-cols-2 gap-4",
                          children: [
                            e.jsxs("div", {
                              className: "col-span-2",
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold block mb-1",
                                  children: "School Official Name",
                                }),
                                e.jsx("input", {
                                  required: !0,
                                  value: i?.name || "",
                                  onChange: (s) =>
                                    C((t) => (t ? { ...t, name: s.target.value } : null)),
                                  className:
                                    "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "col-span-2",
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold block mb-1",
                                  children: "School Physical Address",
                                }),
                                e.jsx("input", {
                                  required: !0,
                                  value: i?.address || "",
                                  onChange: (s) =>
                                    C((t) => (t ? { ...t, address: s.target.value } : null)),
                                  className:
                                    "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold block mb-1",
                                  children: "School Contact Phone",
                                }),
                                e.jsx("input", {
                                  value: i?.phone_number || "",
                                  onChange: (s) =>
                                    C((t) => (t ? { ...t, phone_number: s.target.value } : null)),
                                  className:
                                    "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold block mb-1",
                                  children: "School Official Email",
                                }),
                                e.jsx("input", {
                                  type: "email",
                                  value: i?.email || "",
                                  onChange: (s) =>
                                    C((t) => (t ? { ...t, email: s.target.value } : null)),
                                  className:
                                    "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "col-span-2",
                              children: [
                                e.jsx("label", {
                                  className: "text-xs font-semibold block mb-1",
                                  children: "School Principal Name",
                                }),
                                e.jsx("input", {
                                  value: i?.principal_name || "",
                                  onChange: (s) =>
                                    C((t) => (t ? { ...t, principal_name: s.target.value } : null)),
                                  className:
                                    "w-full px-3 py-2 text-xs border border-border bg-background rounded-md focus:outline-none",
                                  placeholder: "Enter Principal Name",
                                }),
                              ],
                            }),
                          ],
                        }),
                        e.jsx("div", {
                          className: "flex justify-end pt-2",
                          children: e.jsx("button", {
                            type: "submit",
                            className:
                              "px-4 py-2 text-xs bg-brand text-white font-semibold rounded-md hover:opacity-90",
                            children: "Save School Settings",
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              u === "reports" &&
                e.jsx("div", {
                  className: "space-y-6",
                  children: e.jsxs("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [
                      e.jsxs("section", {
                        className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                        children: [
                          e.jsxs("h3", {
                            className:
                              "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                            children: [
                              e.jsx(Oe, { className: "size-4 text-danger" }),
                              "Profiles Missing Photos",
                            ],
                          }),
                          e.jsxs("div", {
                            className: "max-h-80 overflow-y-auto space-y-2",
                            children: [
                              j
                                .filter((s) => !s.photo_url)
                                .map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                      children: [
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx("p", {
                                              className: "font-semibold text-foreground",
                                              children: s.full_name,
                                            }),
                                            e.jsxs("p", {
                                              className: "text-[10px] text-muted-foreground",
                                              children: [
                                                "Student · ",
                                                s.classes?.name || "Unassigned",
                                              ],
                                            }),
                                          ],
                                        }),
                                        e.jsx("span", {
                                          className:
                                            "px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider",
                                          children: "No Photo",
                                        }),
                                      ],
                                    },
                                    s.id,
                                  ),
                                ),
                              z
                                .filter((s) => !s.photo_url)
                                .map((s) =>
                                  e.jsxs(
                                    "div",
                                    {
                                      className:
                                        "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                      children: [
                                        e.jsxs("div", {
                                          children: [
                                            e.jsx("p", {
                                              className: "font-semibold text-foreground",
                                              children: s.full_name,
                                            }),
                                            e.jsxs("p", {
                                              className: "text-[10px] text-muted-foreground",
                                              children: ["Staff · ", s.department || "General"],
                                            }),
                                          ],
                                        }),
                                        e.jsx("span", {
                                          className:
                                            "px-2 py-0.5 rounded bg-danger-soft text-danger text-[9px] font-bold uppercase tracking-wider",
                                          children: "No Photo",
                                        }),
                                      ],
                                    },
                                    s.user_id,
                                  ),
                                ),
                              j.filter((s) => !s.photo_url).length === 0 &&
                                z.filter((s) => !s.photo_url).length === 0 &&
                                e.jsx("p", {
                                  className: "text-center text-slate-400 py-10",
                                  children: "All profiles have registered photos.",
                                }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("section", {
                        className: "bg-card border border-border rounded-xl p-5 space-y-4 h-fit",
                        children: [
                          e.jsxs("h3", {
                            className:
                              "font-semibold text-sm border-b border-border pb-3 flex items-center gap-2",
                            children: [
                              e.jsx(Ge, { className: "size-4 text-brand" }),
                              "Reprint Logs & Operator Audit",
                            ],
                          }),
                          e.jsxs("div", {
                            className: "max-h-80 overflow-y-auto space-y-2",
                            children: [
                              te.map((s) =>
                                e.jsxs(
                                  "div",
                                  {
                                    className:
                                      "flex items-center justify-between text-xs border-b border-border/50 pb-2",
                                    children: [
                                      e.jsxs("div", {
                                        children: [
                                          e.jsxs("p", {
                                            className: "font-semibold text-foreground",
                                            children: [s.card_type.toUpperCase(), " Card Issued"],
                                          }),
                                          e.jsxs("p", {
                                            className: "text-[10px] text-muted-foreground",
                                            children: [
                                              "Operator: ",
                                              s.profiles?.full_name || "Admin",
                                              " · ",
                                              s.reason || "First Issue",
                                            ],
                                          }),
                                        ],
                                      }),
                                      e.jsx("span", {
                                        className: "font-mono text-slate-400 text-[10px]",
                                        children: new Date(s.printed_at).toLocaleDateString(),
                                      }),
                                    ],
                                  },
                                  s.id,
                                ),
                              ),
                              te.length === 0 &&
                                e.jsx("p", {
                                  className: "text-center text-slate-400 py-10",
                                  children: "No reprint history logged.",
                                }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
            ],
          }),
          H &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[9999]",
              children: e.jsxs("div", {
                className:
                  "bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-2xl space-y-4 text-center",
                children: [
                  e.jsx("h3", {
                    className: "font-bold text-base",
                    children: "Generating PDF Cards",
                  }),
                  e.jsxs("p", {
                    className: "text-xs text-muted-foreground",
                    children: [
                      "Drawing card for ",
                      e.jsx("span", {
                        className: "font-semibold text-foreground",
                        children: H.activeName,
                      }),
                      "...",
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden",
                    children: e.jsx("div", {
                      className: "bg-brand h-full transition-all duration-300",
                      style: { width: `${Math.round((H.current / H.total) * 100)}%` },
                    }),
                  }),
                  e.jsxs("p", {
                    className: "text-xs font-semibold",
                    children: [
                      H.current,
                      " / ",
                      H.total,
                      " (",
                      Math.round((H.current / H.total) * 100),
                      "%)",
                    ],
                  }),
                  e.jsx("button", {
                    onClick: () => {
                      pe.current = !0;
                    },
                    className:
                      "px-4 py-2 text-xs border border-border rounded-md hover:bg-danger-soft hover:text-danger hover:border-danger transition-colors cursor-pointer w-full font-medium",
                    children: "Cancel Process",
                  }),
                ],
              }),
            }),
          e.jsx("div", {
            className: "absolute left-[-9999px] top-[-9999px]",
            style: { zIndex: -100 },
            children:
              xe &&
              e.jsxs("div", {
                className: "space-y-4",
                children: [
                  _ &&
                    e.jsxs("div", {
                      className: "flex gap-4",
                      children: [
                        e.jsx("div", {
                          id: `id-card-preview-front-${_.data.id || _.data.user_id}`,
                          style: {
                            width: l === "portrait" ? "250px" : "396px",
                            height: l === "portrait" ? "396px" : "250px",
                            transform: "none",
                            rotate: "0deg",
                            scale: "1",
                          },
                          children: e.jsx(M, {
                            rec: _.data,
                            type: _.type,
                            theme: k,
                            orientation: l,
                            school: i,
                            side: "front",
                            signature: $,
                          }),
                        }),
                        e.jsx("div", {
                          id: `id-card-preview-back-${_.data.id || _.data.user_id}`,
                          style: {
                            width: l === "portrait" ? "250px" : "396px",
                            height: l === "portrait" ? "396px" : "250px",
                            transform: "none",
                            rotate: "0deg",
                            scale: "1",
                          },
                          children: e.jsx(M, {
                            rec: _.data,
                            type: _.type,
                            theme: k,
                            orientation: l,
                            school: i,
                            side: "back",
                            signature: $,
                          }),
                        }),
                      ],
                    }),
                  j
                    .filter((s) => B.includes(s.id))
                    .map((s) =>
                      e.jsxs(
                        "div",
                        {
                          className: "flex gap-4",
                          children: [
                            e.jsx("div", {
                              id: `bulk-card-front-${s.id}`,
                              style: {
                                width: l === "portrait" ? "250px" : "396px",
                                height: l === "portrait" ? "396px" : "250px",
                              },
                              children: e.jsx(M, {
                                rec: s,
                                type: "student",
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "front",
                                signature: $,
                              }),
                            }),
                            e.jsx("div", {
                              id: `bulk-card-back-${s.id}`,
                              style: {
                                width: l === "portrait" ? "250px" : "396px",
                                height: l === "portrait" ? "396px" : "250px",
                              },
                              children: e.jsx(M, {
                                rec: s,
                                type: "student",
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "back",
                                signature: $,
                              }),
                            }),
                          ],
                        },
                        `bulk-student-${s.id}`,
                      ),
                    ),
                  z
                    .filter((s) => V.includes(s.user_id))
                    .map((s) =>
                      e.jsxs(
                        "div",
                        {
                          className: "flex gap-4",
                          children: [
                            e.jsx("div", {
                              id: `bulk-card-front-${s.user_id}`,
                              style: {
                                width: l === "portrait" ? "250px" : "396px",
                                height: l === "portrait" ? "396px" : "250px",
                              },
                              children: e.jsx(M, {
                                rec: s,
                                type: "staff",
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "front",
                                signature: $,
                              }),
                            }),
                            e.jsx("div", {
                              id: `bulk-card-back-${s.user_id}`,
                              style: {
                                width: l === "portrait" ? "250px" : "396px",
                                height: l === "portrait" ? "396px" : "250px",
                              },
                              children: e.jsx(M, {
                                rec: s,
                                type: "staff",
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "back",
                                signature: $,
                              }),
                            }),
                          ],
                        },
                        `bulk-staff-${s.user_id}`,
                      ),
                    ),
                ],
              }),
          }),
          _ &&
            e.jsx("div", {
              className:
                "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
              onClick: () => ne(null),
              children: e.jsxs("div", {
                onClick: (s) => s.stopPropagation(),
                className:
                  "bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-6",
                children: [
                  e.jsxs("div", {
                    className: "flex items-center justify-between border-b border-border pb-3",
                    children: [
                      e.jsxs("h2", {
                        className: "font-semibold text-sm capitalize",
                        children: [_.type, " ID Card Preview"],
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                          e.jsx("button", {
                            onClick: () => be(!Re),
                            className:
                              "px-2 py-1 text-xs border border-border rounded-md bg-secondary hover:bg-secondary/70 font-semibold",
                            children: "Flip Card",
                          }),
                          e.jsxs("div", {
                            className:
                              "flex items-center gap-1 bg-brand text-white rounded-md pl-1 pr-0.5 py-0.5",
                            children: [
                              e.jsxs("select", {
                                value: Q,
                                onChange: (s) => G(s.target.value),
                                className:
                                  "bg-brand text-white text-xs font-semibold focus:outline-none cursor-pointer appearance-none px-2",
                                style: { WebkitAppearance: "none", MozAppearance: "none" },
                                children: [
                                  e.jsx("option", { value: "front-back", children: "Front+Back" }),
                                  e.jsx("option", { value: "front-only", children: "Front Only" }),
                                  e.jsx("option", {
                                    value: "side-by-side",
                                    children: "Side-by-Side",
                                  }),
                                ],
                              }),
                              e.jsxs("button", {
                                onClick: () => ds(_.type, _.data, Q),
                                disabled: xe,
                                className:
                                  "px-2 py-1 text-xs bg-white/20 hover:bg-white/30 rounded inline-flex items-center gap-1 font-semibold disabled:opacity-50 transition",
                                children: [e.jsx(js, { className: "size-3" }), " PDF"],
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className: "flex justify-center py-6",
                    children: e.jsx("div", {
                      className: "perspective-[1000px]",
                      style: {
                        width: l === "portrait" ? "250px" : "396px",
                        height: l === "portrait" ? "396px" : "250px",
                      },
                      children: e.jsxs("div", {
                        className:
                          "w-full h-full relative transition-transform duration-500 transform-style-3d shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] rounded-xl",
                        style: { transform: Re ? "rotateY(180deg)" : "none" },
                        children: [
                          e.jsxs("div", {
                            className:
                              "absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50",
                            children: [
                              e.jsx(M, {
                                rec: _.data,
                                type: _.type,
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "front",
                                signature: $,
                              }),
                              e.jsx("div", {
                                className:
                                  "absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className:
                              "absolute inset-0 backface-hidden rounded-xl overflow-hidden bg-slate-50",
                            style: { transform: "rotateY(180deg)" },
                            children: [
                              e.jsx(M, {
                                rec: _.data,
                                type: _.type,
                                theme: k,
                                orientation: l,
                                school: i,
                                side: "back",
                                signature: $,
                              }),
                              e.jsx("div", {
                                className:
                                  "absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none mix-blend-overlay",
                              }),
                            ],
                          }),
                        ],
                      }),
                    }),
                  }),
                  e.jsx("div", {
                    className: "text-center text-xs text-muted-foreground",
                    children:
                      "Tip: Interactive 3D preview. Click 'Flip Card' to see front and back overlays.",
                  }),
                  e.jsx("div", {
                    className: "flex justify-end pt-2 border-t border-border",
                    children: e.jsx("button", {
                      onClick: () => ne(null),
                      className:
                        "px-4 py-1.5 text-xs border border-border rounded-md font-semibold",
                      children: "Close",
                    }),
                  }),
                ],
              }),
            }),
          d &&
            e.jsx("div", {
              className:
                "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
              onClick: () => S(null),
              children: e.jsxs("form", {
                onClick: (s) => s.stopPropagation(),
                onSubmit: ns,
                className:
                  "bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-sm border-b border-border pb-3",
                    children: "Edit Student Details",
                  }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Full Name",
                          }),
                          e.jsx("input", {
                            required: !0,
                            value: d.full_name,
                            onChange: (s) => S({ ...d, full_name: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Admission Number",
                          }),
                          e.jsx("input", {
                            required: !0,
                            value: d.admission_number || "",
                            onChange: (s) => S({ ...d, admission_number: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Roll Number",
                          }),
                          e.jsx("input", {
                            value: d.roll_number || "",
                            onChange: (s) => S({ ...d, roll_number: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Blood Group",
                          }),
                          e.jsx("input", {
                            value: d.blood_group || "",
                            onChange: (s) => S({ ...d, blood_group: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "DOB (YYYY-MM-DD)",
                          }),
                          e.jsx("input", {
                            type: "date",
                            value: d.date_of_birth || "",
                            onChange: (s) => S({ ...d, date_of_birth: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Emergency Contact",
                          }),
                          e.jsx("input", {
                            value: d.emergency_contact || "",
                            onChange: (s) => S({ ...d, emergency_contact: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Parent/Guardian Name",
                          }),
                          e.jsx("input", {
                            value: d.parent_name || "",
                            onChange: (s) => S({ ...d, parent_name: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Parent Phone Number",
                          }),
                          e.jsx("input", {
                            value: d.parent_phone || "",
                            onChange: (s) => S({ ...d, parent_phone: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Transport Route",
                          }),
                          e.jsx("input", {
                            value: d.transport_route || "",
                            onChange: (s) => S({ ...d, transport_route: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Bus Number",
                          }),
                          e.jsx("input", {
                            value: d.bus_number || "",
                            onChange: (s) => S({ ...d, bus_number: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end pt-2 border-t border-border",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => S(null),
                        className: "px-3 py-2 text-xs border border-border rounded-md",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        className: "px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md",
                        children: "Save Details",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          p &&
            e.jsx("div", {
              className:
                "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 overflow-y-auto",
              onClick: () => D(null),
              children: e.jsxs("form", {
                onClick: (s) => s.stopPropagation(),
                onSubmit: os,
                className:
                  "bg-card border border-border rounded-xl p-6 w-full max-w-lg shadow-xl space-y-4 max-h-[90vh] overflow-y-auto",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-sm border-b border-border pb-3",
                    children: "Edit Staff Details",
                  }),
                  e.jsxs("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Employee ID",
                          }),
                          e.jsx("input", {
                            required: !0,
                            value: p.employee_id || "",
                            onChange: (s) => D({ ...p, employee_id: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md font-mono",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Designation",
                          }),
                          e.jsx("input", {
                            value: p.designation || "",
                            onChange: (s) => D({ ...p, designation: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Department",
                          }),
                          e.jsx("input", {
                            value: p.department || "",
                            onChange: (s) => D({ ...p, department: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Blood Group",
                          }),
                          e.jsx("input", {
                            value: p.blood_group || "",
                            onChange: (s) => D({ ...p, blood_group: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Mobile Number",
                          }),
                          e.jsx("input", {
                            value: p.mobile_number || "",
                            onChange: (s) => D({ ...p, mobile_number: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Emergency Contact",
                          }),
                          e.jsx("input", {
                            value: p.emergency_contact || "",
                            onChange: (s) => D({ ...p, emergency_contact: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Physical Address",
                          }),
                          e.jsx("input", {
                            value: p.address || "",
                            onChange: (s) => D({ ...p, address: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "col-span-2",
                        children: [
                          e.jsx("label", {
                            className: "text-xs font-semibold block mb-1",
                            children: "Card Back Notes",
                          }),
                          e.jsx("textarea", {
                            rows: 2,
                            value: p.notes || "",
                            onChange: (s) => D({ ...p, notes: s.target.value }),
                            className:
                              "w-full px-3 py-2 text-xs border border-border bg-background rounded-md",
                          }),
                        ],
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex gap-2 justify-end pt-2 border-t border-border",
                    children: [
                      e.jsx("button", {
                        type: "button",
                        onClick: () => D(null),
                        className: "px-3 py-2 text-xs border border-border rounded-md",
                        children: "Cancel",
                      }),
                      e.jsx("button", {
                        type: "submit",
                        className: "px-3 py-2 text-xs bg-brand text-white font-semibold rounded-md",
                        children: "Save Details",
                      }),
                    ],
                  }),
                ],
              }),
            }),
          ee &&
            e.jsx("div", {
              className: "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50",
              children: e.jsxs("div", {
                className:
                  "bg-card border border-border rounded-xl p-6 w-full max-w-sm shadow-xl space-y-4",
                children: [
                  e.jsx("h2", {
                    className: "font-semibold text-sm border-b border-border pb-3",
                    children: "Crop Profile Photo",
                  }),
                  e.jsx(Ns, {
                    imageSrc: ee.original,
                    onCrop: rs,
                    onCancel: () => ke(null),
                    circular: ee.type !== "school" && ee.type !== "signature",
                  }),
                ],
              }),
            }),
          e.jsx("style", {
            children: `
        /* 3D Flipping styles */
        .perspective-[1000px] {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }

        /* Print Specific Styling */
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .print\\:hidden, aside, main > header, nav, button, input, select, .PageHeader {
            display: none !important;
          }
          main {
            overflow: visible !important;
          }
          #id-card-print-container {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            background-color: #ffffff !important;
          }
          .a4-page {
            width: 210mm !important;
            height: 297mm !important;
            page-break-after: always !important;
            box-sizing: border-box !important;
            padding: 10mm 15mm !important;
            margin: 0 !important;
            background-color: #ffffff !important;
          }
          /* Print grid layouts */
          .a4-grid-portrait {
            display: grid !important;
            grid-template-columns: repeat(3, 54mm) !important;
            grid-gap: 5mm !important;
            justify-content: center !important;
            align-content: start !important;
          }
          .a4-grid-landscape {
            display: grid !important;
            grid-template-columns: repeat(2, 85.6mm) !important;
            grid-gap: 4mm !important;
            justify-content: center !important;
            align-content: start !important;
          }
          .print-card-portrait {
            width: 54mm !important;
            height: 85.6mm !important;
            page-break-inside: avoid !important;
          }
          .print-card-landscape {
            width: 85.6mm !important;
            height: 54mm !important;
            page-break-inside: avoid !important;
          }
        }
      `,
          }),
          ts !== "none" &&
            oe &&
            e.jsxs("div", {
              id: "id-card-print-container",
              className: "hidden print:block",
              children: [
                e.jsx("div", {
                  className: "a4-page",
                  children: e.jsx("div", {
                    className: l === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape",
                    children: oe.list.map((s, t) => {
                      const n = s.id || s.user_id;
                      return e.jsx(
                        "div",
                        {
                          className:
                            l === "portrait" ? "print-card-portrait" : "print-card-landscape",
                          children: e.jsx(M, {
                            rec: s,
                            type: oe.type,
                            theme: k,
                            orientation: l,
                            school: i,
                            side: "front",
                            signature: $,
                          }),
                        },
                        `print-${n}-${t}`,
                      );
                    }),
                  }),
                }),
                e.jsx("div", {
                  className: "a4-page",
                  style: { pageBreakBefore: "always" },
                  children: e.jsx("div", {
                    className: l === "portrait" ? "a4-grid-portrait" : "a4-grid-landscape",
                    children: oe.list.map((s, t) => {
                      const n = s.id || s.user_id;
                      return e.jsx(
                        "div",
                        {
                          className:
                            l === "portrait" ? "print-card-portrait" : "print-card-landscape",
                          children: e.jsx(M, {
                            rec: s,
                            type: oe.type,
                            theme: k,
                            orientation: l,
                            school: i,
                            side: "back",
                            signature: $,
                          }),
                        },
                        `print-back-${n}-${t}`,
                      );
                    }),
                  }),
                }),
              ],
            }),
        ],
      });
}
function Ss({ className: r = "size-8" }) {
  return e.jsxs("svg", {
    className: r,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      e.jsx("path", {
        d: "M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z",
        fill: "currentColor",
        fillOpacity: "0.1",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinejoin: "round",
      }),
      e.jsx("path", {
        d: "M12 6v10M9 8h6M9 11h6",
        stroke: "currentColor",
        strokeWidth: "1.2",
        strokeLinecap: "round",
      }),
      e.jsx("path", {
        d: "M12 6l-3 3M12 6l3 3M12 11l-3 3M12 11l3 3",
        stroke: "currentColor",
        strokeWidth: "1.2",
        strokeLinecap: "round",
      }),
    ],
  });
}
function M({
  rec: r,
  type: y,
  theme: x,
  orientation: J,
  school: u,
  side: W = "front",
  signature: k,
}) {
  const F = y === "student",
    l = y === "visitor",
    P = F ? Je(r) : l ? r.pass_number : We(r),
    G = `${typeof window < "u" ? window.location.origin : "https://school.hezo.in"}/verify-id?type=${y}&id=${r.id || r.user_id}`,
    i = F ? r.full_name || "Student" : l ? r.visitor_name || "Visitor" : r.full_name || "Staff";
  let C = "";
  F
    ? (C = r.classes?.name
        ? `${r.classes.name}${r.classes.section ? ` (${r.classes.section})` : ""}`
        : "Student")
    : l
      ? (C = "Visitor")
      : (C = r.designation || "Staff");
  let Z = "text-[12px]";
  (i.length > 35
    ? (Z = "text-[7.5px]")
    : i.length > 25
      ? (Z = "text-[9px]")
      : i.length > 15 && (Z = "text-[10.5px]"),
    C.length > 20);
  let A = "",
    j = "",
    L = "border-slate-200";
  x === "modern-blue"
    ? ((A =
        "bg-gradient-to-br from-slate-50 via-sky-50/50 to-blue-50 text-slate-800 border-sky-200"),
      (j = "bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white"),
      (L = "border-sky-300"))
    : x === "premium-corporate"
      ? ((A =
          "bg-gradient-to-br from-slate-900 to-slate-950 text-slate-100 border-slate-700 shadow-inner"),
        (j = "bg-slate-950 text-teal-400 border-b border-teal-500/30"),
        (L = "border-teal-500/40"))
      : x === "gold-premium"
        ? ((A =
            "bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-amber-50 border-amber-400"),
          (j = "bg-slate-950 text-amber-400 border-b-2 border-amber-400"),
          (L = "border-amber-400/50"))
        : x === "school-classic"
          ? ((A = "bg-rose-50/10 text-rose-950 border-rose-800"),
            (j = "bg-gradient-to-r from-red-800 to-rose-950 text-white border-b-2 border-red-900"),
            (L = "border-rose-800/30"))
          : ((A = "bg-white text-slate-800 border-slate-200"),
            (j = "bg-slate-50 text-slate-800 border-b border-slate-200"),
            (L = "border-slate-200"));
  const z = r.rankings?.find((Ne) => Ne.rank_position <= 3),
    se = u?.logo_url
      ? e.jsx("img", {
          src: u.logo_url,
          alt: "",
          className: "size-12 object-contain bg-white rounded p-0.5",
        })
      : e.jsx(Ss, {
          className: `size-12 ${x === "premium-corporate" || x === "gold-premium" ? "text-teal-400" : "text-amber-400"}`,
        });
  let T = "bg-amber-400 text-slate-950";
  return (
    x === "premium-corporate"
      ? (T = "bg-teal-500 text-slate-950")
      : x === "gold-premium"
        ? (T = "bg-amber-500 text-slate-950")
        : x === "school-classic"
          ? (T = "bg-rose-800 text-white")
          : x === "minimal" && (T = "bg-slate-100 text-slate-900 border-y border-slate-200"),
    J === "portrait"
      ? W === "front"
        ? e.jsxs("div", {
            className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${A}`,
            children: [
              e.jsxs("div", {
                className: `px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${j}`,
                children: [
                  se,
                  e.jsxs("div", {
                    className: "text-left min-w-0 flex-1 leading-tight",
                    children: [
                      e.jsx("h2", {
                        className:
                          "text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                        children: u?.name || "School Name",
                      }),
                      e.jsx("p", {
                        className:
                          "text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                        children: u?.address || "Address Detail",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "text-right leading-none flex-shrink-0 font-mono text-[7px] opacity-85 font-semibold ml-1",
                    children: e.jsx("div", { children: r.academic_year || De }),
                  }),
                ],
              }),
              e.jsx("div", {
                className: `font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${T}`,
                children: F ? "STUDENT IDENTITY CARD" : l ? "VISITOR PASS" : "IDENTITY CARD",
              }),
              e.jsxs("div", {
                className:
                  "flex-1 p-2 flex flex-col items-center justify-start space-y-1 min-h-0 relative",
                children: [
                  z &&
                    e.jsxs("div", {
                      className:
                        "absolute top-1 right-1 bg-amber-400 text-slate-950 text-[6px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-300 shadow-md",
                      children: [
                        e.jsx(Pe, { className: "size-1.5 text-slate-950" }),
                        "Rank ",
                        z.rank_position,
                      ],
                    }),
                  e.jsx("div", {
                    className: `w-[110px] h-[142px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${L}`,
                    children: r.photo_url
                      ? e.jsx("img", {
                          src: r.photo_url,
                          alt: "",
                          className: "size-full object-cover",
                        })
                      : e.jsx(ie, { className: "size-16 text-slate-300" }),
                  }),
                  e.jsx("div", {
                    className: "text-center w-full min-w-0",
                    children: e.jsx("h4", {
                      className: `${Z} font-bold leading-tight break-words whitespace-normal px-1 text-center w-full`,
                      title: i,
                      children: i,
                    }),
                  }),
                  e.jsx("div", {
                    className: "w-full text-[7.2px] space-y-0.5 px-2",
                    children: F
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                              children: [
                                e.jsx("span", { className: "opacity-60", children: "Student ID:" }),
                                " ",
                                e.jsx("span", { className: "font-bold font-mono", children: P }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                              children: [
                                e.jsx("span", { className: "opacity-60", children: "Class:" }),
                                " ",
                                e.jsx("span", { className: "font-bold", children: C }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60",
                                  children: "Roll Number:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold",
                                  children: r.roll_number || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60",
                                  children: "Date of Birth:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold",
                                  children: r.date_of_birth || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60",
                                  children: "Blood Group:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold text-red-500",
                                  children: r.blood_group || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex justify-between",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60",
                                  children: "Parent Contact:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold font-mono",
                                  children: r.parent_phone || "—",
                                }),
                              ],
                            }),
                          ],
                        })
                      : l
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Pass Number:",
                                  }),
                                  " ",
                                  e.jsx("span", { className: "font-bold font-mono", children: P }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Visitor Phone:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold font-mono",
                                    children: r.contact_number,
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  e.jsx("span", { className: "opacity-60", children: "Host:" }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold truncate max-w-[100px]",
                                    children: r.host_name || "—",
                                  }),
                                ],
                              }),
                            ],
                          })
                        : e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Employee ID:",
                                  }),
                                  " ",
                                  e.jsx("span", { className: "font-bold font-mono", children: P }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Department:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold",
                                    children: r.department || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/55 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Blood Group:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold text-red-505",
                                    children: r.blood_group || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60",
                                    children: "Mobile Number:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold font-mono",
                                    children: r.mobile_number || "—",
                                  }),
                                ],
                              }),
                            ],
                          }),
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `p-1.5 border-t flex items-center justify-between gap-1 bg-white ${x === "premium-corporate" || x === "gold-premium" ? "border-slate-800" : "border-border"}`,
                children: [
                  e.jsxs("div", {
                    className: "flex-1 flex flex-col justify-end min-w-0",
                    children: [
                      e.jsx(He, { value: P }),
                      k &&
                        !l &&
                        e.jsx("div", {
                          className: "h-3.5 mt-0.5 flex items-end opacity-75 grayscale",
                          children: e.jsx("img", {
                            src: k,
                            alt: "Sig",
                            className: "h-full object-contain",
                          }),
                        }),
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex flex-col items-center flex-shrink-0",
                    children: [
                      e.jsx(je, {
                        value: G,
                        className: "size-9 bg-white p-0.5 rounded border border-border",
                      }),
                      e.jsx("span", {
                        className:
                          "text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter",
                        children: "Scan to Verify",
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
        : e.jsxs("div", {
            className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md ${A}`,
            children: [
              e.jsxs("div", {
                className: `px-2 py-1.5 flex items-center gap-2 border-b relative min-h-[56px] ${j}`,
                children: [
                  se,
                  e.jsxs("div", {
                    className: "text-left min-w-0 flex-1 leading-tight",
                    children: [
                      e.jsx("h2", {
                        className:
                          "text-[13.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                        children: u?.name || "School Name",
                      }),
                      e.jsx("p", {
                        className:
                          "text-[7.5px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                        children: u?.address || "Address Detail",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsx("div", {
                className:
                  "bg-slate-900 text-white font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5",
                children: "TERMS & GUIDELINES",
              }),
              e.jsxs("div", {
                className: "flex-1 p-3 flex flex-col justify-between space-y-2 text-[7.5px]",
                children: [
                  F
                    ? e.jsxs("div", {
                        className: "space-y-1.5",
                        children: [
                          e.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              e.jsx("span", {
                                className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                children: "Emergency Contact:",
                              }),
                              e.jsx("span", {
                                className: "font-bold font-mono text-[8.5px]",
                                children: r.emergency_contact || r.parent_phone || "—",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              e.jsx("span", {
                                className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                children: "Parent/Guardian Contact:",
                              }),
                              e.jsx("span", {
                                className: "font-bold text-[8.5px]",
                                children: r.parent_name || "—",
                              }),
                              e.jsx("span", {
                                className: "font-bold font-mono text-[8px]",
                                children: r.parent_phone || "—",
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className: "flex flex-col",
                            children: [
                              e.jsx("span", {
                                className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                children: "School Contact Details:",
                              }),
                              e.jsxs("span", {
                                className: "font-semibold font-mono",
                                children: ["Ph: ", u?.phone_number || "—"],
                              }),
                              e.jsxs("span", {
                                className: "font-semibold truncate",
                                children: ["Web: ", u?.email || "www.hezo.in"],
                              }),
                            ],
                          }),
                        ],
                      })
                    : l
                      ? e.jsxs("div", {
                          className:
                            "space-y-2 text-center p-2 bg-white/20 rounded border border-border/10",
                          children: [
                            e.jsx("span", {
                              className: "text-[9.5px] font-bold text-red-550 block",
                              children: "TEMPORARY GUEST PASS",
                            }),
                            e.jsx("p", {
                              className: "text-[7.5px] leading-normal opacity-90",
                              children:
                                "This visitor badge is temporary and issued strictly for verification. Return it to reception upon checkout.",
                            }),
                          ],
                        })
                      : e.jsxs("div", {
                          className: "space-y-1.5",
                          children: [
                            e.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                  children: "Emergency Contact:",
                                }),
                                e.jsx("span", {
                                  className: "font-bold font-mono text-[8.5px]",
                                  children: r.emergency_contact || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                  children: "Residential Address:",
                                }),
                                e.jsx("p", {
                                  className: "font-semibold leading-normal line-clamp-3",
                                  children: r.address || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex flex-col",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 text-[6.5px] uppercase font-semibold",
                                  children: "Notes:",
                                }),
                                e.jsx("p", {
                                  className:
                                    "italic text-[7px] leading-tight line-clamp-2 opacity-85",
                                  children:
                                    r.notes ||
                                    "This card belongs to the school administration. If found, please return immediately.",
                                }),
                              ],
                            }),
                          ],
                        }),
                  e.jsx("div", {
                    className:
                      "text-center font-bold text-[7px] text-red-650 bg-red-50 py-0.5 rounded border border-red-200 uppercase tracking-tighter",
                    children: '"If found please return to school."',
                  }),
                ],
              }),
              e.jsxs("div", {
                className:
                  "p-1.5 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between",
                children: [
                  e.jsxs("span", {
                    className: "text-[5.5px] font-mono opacity-60",
                    children: [
                      "Secure Badge HZ-",
                      r.id?.slice(0, 8) || r.user_id?.slice(0, 8) || "000000",
                    ],
                  }),
                  e.jsxs("div", {
                    className: "flex items-center gap-1",
                    children: [
                      e.jsx(je, {
                        value: G,
                        className: "size-7 bg-white p-0.5 rounded border border-border",
                      }),
                      e.jsx("div", {
                        className: "leading-none text-left",
                        children: e.jsx("span", {
                          className:
                            "text-[5px] block font-bold text-slate-500 uppercase tracking-tighter",
                          children: "Scan to Verify",
                        }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          })
      : W === "front"
        ? e.jsxs("div", {
            className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden shadow-md relative ${A}`,
            children: [
              e.jsxs("div", {
                className: `px-3 py-1.5 flex items-center gap-2.5 border-b relative min-h-[56px] ${j}`,
                children: [
                  se,
                  e.jsxs("div", {
                    className: "text-left min-w-0 flex-1 leading-tight",
                    children: [
                      e.jsx("h2", {
                        className:
                          "text-[15.5px] font-extrabold uppercase tracking-wide leading-tight break-words whitespace-normal",
                        children: u?.name || "School Name",
                      }),
                      e.jsx("p", {
                        className:
                          "text-[8px] opacity-85 break-words whitespace-normal leading-tight mt-0.5",
                        children: u?.address || "Address Detail",
                      }),
                    ],
                  }),
                  e.jsx("div", {
                    className:
                      "text-right leading-none flex-shrink-0 font-mono text-[8px] opacity-85 font-semibold ml-1",
                    children: e.jsx("div", { children: r.academic_year || De }),
                  }),
                ],
              }),
              e.jsx("div", {
                className: `font-extrabold text-[7px] text-center uppercase tracking-wider py-0.5 ${T}`,
                children: F ? "STUDENT IDENTITY CARD" : l ? "VISITOR PASS" : "IDENTITY CARD",
              }),
              e.jsxs("div", {
                className:
                  "flex-1 p-2 flex items-center justify-center gap-4 min-h-0 relative bg-white/10",
                children: [
                  e.jsx("div", {
                    className: "w-[125px] flex-shrink-0 text-[7px] space-y-0.5",
                    children: F
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Student ID:",
                                }),
                                " ",
                                e.jsx("span", { className: "font-bold font-mono", children: P }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Class-Sec:",
                                }),
                                " ",
                                e.jsx("span", { className: "font-bold", children: C }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Roll No:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold",
                                  children: r.roll_number || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "DOB:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold",
                                  children: r.date_of_birth || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Blood Grp:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold text-red-500",
                                  children: r.blood_group || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex justify-between",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Parent Mob:",
                                }),
                                " ",
                                e.jsx("span", {
                                  className: "font-bold font-mono",
                                  children: r.parent_phone || "—",
                                }),
                              ],
                            }),
                          ],
                        })
                      : l
                        ? e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Pass No:",
                                  }),
                                  " ",
                                  e.jsx("span", { className: "font-bold font-mono", children: P }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Visitor Phone:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold font-mono",
                                    children: r.contact_number,
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Host:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold truncate max-w-[80px]",
                                    children: r.host_name || "—",
                                  }),
                                ],
                              }),
                            ],
                          })
                        : e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Emp ID:",
                                  }),
                                  " ",
                                  e.jsx("span", { className: "font-bold font-mono", children: P }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Dept:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold",
                                    children: r.department || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Blood Grp:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold text-red-550",
                                    children: r.blood_group || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex justify-between",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Mobile:",
                                  }),
                                  " ",
                                  e.jsx("span", {
                                    className: "font-bold font-mono",
                                    children: r.mobile_number || "—",
                                  }),
                                ],
                              }),
                            ],
                          }),
                  }),
                  e.jsxs("div", {
                    className: "flex-1 flex flex-col items-center justify-center min-w-0",
                    children: [
                      e.jsx("div", {
                        className: `w-[72px] h-[92px] rounded border bg-white overflow-hidden shadow-sm flex items-center justify-center flex-shrink-0 relative ${L}`,
                        children: r.photo_url
                          ? e.jsx("img", {
                              src: r.photo_url,
                              alt: "",
                              className: "size-full object-cover",
                            })
                          : e.jsx(ie, { className: "size-12 text-slate-300" }),
                      }),
                      e.jsx("h4", {
                        className: `${Z} font-bold text-center leading-tight whitespace-normal break-words w-full px-1 mt-1.5`,
                        title: i,
                        children: i,
                      }),
                    ],
                  }),
                  e.jsxs("div", {
                    className:
                      "w-[100px] flex-shrink-0 flex flex-col items-center justify-between h-full py-0.5",
                    children: [
                      e.jsx(He, { value: P }),
                      k &&
                        !l &&
                        e.jsx("div", {
                          className: "h-3.5 flex items-end opacity-75 grayscale mt-1",
                          children: e.jsx("img", {
                            src: k,
                            alt: "Sig",
                            className: "h-full object-contain",
                          }),
                        }),
                      e.jsxs("div", {
                        className: "flex flex-col items-center mt-1",
                        children: [
                          e.jsx(je, {
                            value: G,
                            className: "size-9 bg-white p-0.5 rounded border border-border",
                          }),
                          e.jsx("span", {
                            className:
                              "text-[5px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter",
                            children: "Scan to Verify",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `h-4 px-3 bg-slate-50 border-t flex items-center justify-between text-[5.5px] font-mono opacity-60 ${x === "premium-corporate" || x === "gold-premium" ? "border-slate-800" : "border-border"}`,
                children: [
                  e.jsxs("span", { children: ["Secure Badge System · ", u?.name || "School ERP"] }),
                  e.jsxs("span", {
                    children: ["HZ-", r.id?.slice(0, 8) || r.user_id?.slice(0, 8) || "000000"],
                  }),
                ],
              }),
            ],
          })
        : e.jsxs("div", {
            className: `w-full h-full border rounded-xl flex flex-col justify-between overflow-hidden p-2.5 shadow-md ${A}`,
            children: [
              e.jsxs("div", {
                className: `text-center pb-1.5 border-b flex justify-between items-center ${x === "premium-corporate" || x === "gold-premium" ? "border-slate-800" : "border-border"}`,
                children: [
                  e.jsx("span", {
                    className: "text-[9px] font-bold uppercase font-sans",
                    children: "TERMS & INSTRUCTIONS",
                  }),
                  e.jsx("span", {
                    className: "text-[6.5px] opacity-75 truncate max-w-[180px]",
                    children: u?.name || "School Name",
                  }),
                ],
              }),
              e.jsxs("div", {
                className: "flex-1 flex items-center justify-between gap-3 py-1.5 min-h-0",
                children: [
                  e.jsx("div", {
                    className: "flex-1 text-[7.5px] space-y-1",
                    children: F
                      ? e.jsxs(e.Fragment, {
                          children: [
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Emergency Contact:",
                                }),
                                e.jsx("span", {
                                  className: "font-bold font-mono",
                                  children: r.emergency_contact || r.parent_phone || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Parent/Guardian:",
                                }),
                                e.jsx("span", {
                                  className: "font-bold",
                                  children: r.parent_name || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className:
                                "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "Parent Mob. Contact:",
                                }),
                                e.jsx("span", {
                                  className: "font-bold font-mono",
                                  children: r.parent_phone || "—",
                                }),
                              ],
                            }),
                            e.jsxs("div", {
                              className: "flex justify-between",
                              children: [
                                e.jsx("span", {
                                  className: "opacity-60 font-semibold",
                                  children: "School Address:",
                                }),
                                e.jsx("span", {
                                  className: "font-semibold truncate max-w-[120px]",
                                  children: u?.address || "—",
                                }),
                              ],
                            }),
                          ],
                        })
                      : l
                        ? e.jsxs("div", {
                            className: "space-y-1 p-1 bg-white/10 rounded",
                            children: [
                              e.jsx("span", {
                                className: "text-[8px] font-bold text-red-550 uppercase",
                                children: "visitor badge terms",
                              }),
                              e.jsx("p", {
                                className: "text-[6.5px] leading-normal opacity-90",
                                children:
                                  "This temporary pass allows access strictly for official visitations. Report to reception if any assistance is required. Please return pass before checking out.",
                              }),
                            ],
                          })
                        : e.jsxs(e.Fragment, {
                            children: [
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Emergency Contact:",
                                  }),
                                  e.jsx("span", {
                                    className: "font-bold font-mono",
                                    children: r.emergency_contact || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex justify-between border-b border-dashed border-slate-200/50 pb-0.5",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Residential Address:",
                                  }),
                                  e.jsx("span", {
                                    className: "font-semibold truncate max-w-[120px]",
                                    children: r.address || "—",
                                  }),
                                ],
                              }),
                              e.jsxs("div", {
                                className: "flex flex-col",
                                children: [
                                  e.jsx("span", {
                                    className: "opacity-60 font-semibold",
                                    children: "Notes:",
                                  }),
                                  e.jsx("p", {
                                    className:
                                      "italic text-[6.5px] leading-tight line-clamp-2 opacity-85",
                                    children:
                                      r.notes || "This card belongs to the school administration.",
                                  }),
                                ],
                              }),
                            ],
                          }),
                  }),
                  e.jsxs("div", {
                    className: `flex flex-col items-center justify-center border-l pl-3 h-full ${x === "premium-corporate" || x === "gold-premium" ? "border-slate-800" : "border-border"}`,
                    children: [
                      e.jsx(je, {
                        value: G,
                        className: "size-9 bg-white p-0.5 rounded border border-border",
                      }),
                      e.jsx("span", {
                        className:
                          "text-[5px] block font-bold text-slate-500 uppercase tracking-tighter mt-1",
                        children: "Scan to Verify",
                      }),
                    ],
                  }),
                ],
              }),
              e.jsxs("div", {
                className: `border-t pt-1 flex justify-between items-center text-[6.5px] ${x === "premium-corporate" || x === "gold-premium" ? "border-slate-800" : "border-border"}`,
                children: [
                  e.jsx("span", {
                    className:
                      "font-bold text-red-600 animate-pulse uppercase tracking-tighter font-sans",
                    children: '"If found please return to school."',
                  }),
                  e.jsxs("span", {
                    className: "font-mono opacity-60",
                    children: ["HZ-", r.id?.slice(0, 8) || r.user_id?.slice(0, 8) || "00000"],
                  }),
                ],
              }),
            ],
          })
  );
}
export {
  He as Barcode,
  M as IDCardComponent,
  ge as KpiWidget,
  je as QRCodeImage,
  Ss as SchoolCrestPlaceholder,
  Ts as component,
};
