import { r as y, g as _, x as e, U as w, j as S, M as x } from "./index-DrqTZ7SR.js";
import { k as u } from "./vendor-charts-DECNlt_G.js";
import { S as g } from "./shield-alert-BYDmGTCs.js";
import { S as A } from "./shield-check-DxZCxexz.js";
import { P as E } from "./phone-BvCyC-cH.js";
import { C as z } from "./calendar-DZf17yvJ.js";
import "./vendor-supabase-Bz3EdAMz.js";
import "./vendor-pdf-BA8uJ8a4.js";
const D = [
    [
      "path",
      {
        d: "M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5",
        key: "mvr1a0",
      },
    ],
  ],
  k = y("heart", D);
function Y() {
  const { type: d, id: m } = _.useSearch(),
    [b, l] = u.useState(!0),
    [t, h] = u.useState(null),
    [p, r] = u.useState(null);
  return (
    u.useEffect(() => {
      (async () => {
        if (!m || !d) {
          (r("Invalid verification link. Missing card type or identifier."), l(!1));
          return;
        }
        try {
          if (d === "student") {
            const { data: s, error: o } = await x
              .from("students")
              .select(
                `
              id,
              full_name,
              admission_number,
              roll_number,
              photo_url,
              blood_group,
              emergency_contact,
              academic_year,
              school_id,
              classes (name, section)
            `,
              )
              .eq("id", m)
              .maybeSingle();
            if (o) throw o;
            if (!s) {
              (r(
                "No student record found matching this ID. This card may have been deleted or revoked.",
              ),
                l(!1));
              return;
            }
            const { data: a, error: c } = await x
              .from("schools")
              .select("name, school_name, logo_url, school_logo, address, status")
              .eq("id", s.school_id)
              .maybeSingle();
            if (c) throw c;
            if (!a) {
              (r("Associated school record not found."), l(!1));
              return;
            }
            if (a.status !== "active") {
              (r(
                `Verification blocked: ${a.school_name || a.name || "School"} access is suspended.`,
              ),
                l(!1));
              return;
            }
            const i = s.classes,
              j = i ? i.name : "—",
              N = i && i.section ? i.section : "",
              n = new Date().getFullYear(),
              f = new Date().getMonth() >= 5 ? `${n}-${n + 1}` : `${n - 1}-${n}`,
              v = !s.academic_year || s.academic_year === f ? "Active" : "Inactive";
            h({
              id: s.id,
              name: s.full_name,
              photoUrl: s.photo_url,
              identifier:
                s.admission_number || s.roll_number || `STU-${n}-${s.id.slice(0, 4).toUpperCase()}`,
              role: "Student",
              classOrDesignation: j,
              departmentOrSection: N,
              bloodGroup: s.blood_group,
              emergencyContact: s.emergency_contact,
              academicYear: s.academic_year || f,
              schoolName: a.school_name || a.name || "School",
              schoolLogo: a.school_logo || a.logo_url || null,
              schoolAddress: a.address || null,
              status: v,
            });
          } else if (d === "staff") {
            const { data: s, error: o } = await x
              .from("profiles")
              .select(
                `
              user_id,
              full_name,
              photo_url,
              employee_id,
              designation,
              department,
              blood_group,
              emergency_contact,
              mobile_number,
              school_id
            `,
              )
              .eq("user_id", m)
              .maybeSingle();
            if (o) throw o;
            if (!s) {
              (r(
                "No staff record found matching this ID. This card may have been deleted or revoked.",
              ),
                l(!1));
              return;
            }
            if (!s.school_id) {
              (r("Staff member is not associated with any school."), l(!1));
              return;
            }
            const { data: a, error: c } = await x
              .from("schools")
              .select("name, school_name, logo_url, school_logo, address, status")
              .eq("id", s.school_id)
              .maybeSingle();
            if (c) throw c;
            if (!a) {
              (r("Associated school record not found."), l(!1));
              return;
            }
            if (a.status !== "active") {
              (r(
                `Verification blocked: ${a.school_name || a.name || "School"} access is suspended.`,
              ),
                l(!1));
              return;
            }
            h({
              id: s.user_id,
              name: s.full_name,
              photoUrl: s.photo_url,
              identifier:
                s.employee_id ||
                `EMP-${new Date().getFullYear()}-${s.user_id.slice(0, 4).toUpperCase()}`,
              role: "Staff",
              classOrDesignation: s.designation || "Staff Member",
              departmentOrSection: s.department || "General",
              bloodGroup: s.blood_group,
              emergencyContact: s.emergency_contact || s.mobile_number || null,
              schoolName: a.school_name || a.name || "School",
              schoolLogo: a.school_logo || a.logo_url || null,
              schoolAddress: a.address || null,
              status: "Active",
            });
          } else r("Unsupported record type.");
        } catch (s) {
          r(s.message || "An error occurred while verifying the record.");
        } finally {
          l(!1);
        }
      })();
    }, [m, d]),
    e.jsxs("div", {
      className:
        "min-h-screen bg-slate-950 flex flex-col justify-between py-10 px-4 text-slate-100",
      children: [
        e.jsx("div", {
          className:
            "absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none",
        }),
        e.jsx("div", {
          className:
            "max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative z-10 overflow-hidden",
          children: b
            ? e.jsxs("div", {
                className: "py-20 text-center space-y-3",
                children: [
                  e.jsx("div", {
                    className:
                      "size-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto",
                  }),
                  e.jsx("p", {
                    className: "text-slate-400 text-sm",
                    children: "Querying secure records...",
                  }),
                ],
              })
            : p
              ? e.jsxs("div", {
                  className: "text-center py-10 space-y-4",
                  children: [
                    e.jsx("div", {
                      className:
                        "size-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20",
                      children: e.jsx(g, { className: "size-8" }),
                    }),
                    e.jsx("h1", {
                      className: "text-xl font-bold text-slate-100",
                      children: "Verification Failed",
                    }),
                    e.jsx("p", {
                      className: "text-slate-400 text-sm max-w-xs mx-auto",
                      children: p,
                    }),
                    e.jsx("div", {
                      className: "pt-6 border-t border-slate-800/80",
                      children: e.jsx("p", {
                        className: "text-xs text-slate-500",
                        children: "Secure School ERP Verification Gateway",
                      }),
                    }),
                  ],
                })
              : t
                ? e.jsxs("div", {
                    className: "space-y-6",
                    children: [
                      e.jsxs("div", {
                        className: "flex items-center gap-3 pb-4 border-b border-slate-800",
                        children: [
                          t.schoolLogo
                            ? e.jsx("img", {
                                src: t.schoolLogo,
                                alt: "",
                                className: "size-10 rounded-lg object-cover bg-white",
                              })
                            : e.jsx("div", {
                                className:
                                  "size-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold",
                                children: "H",
                              }),
                          e.jsxs("div", {
                            className: "min-w-0",
                            children: [
                              e.jsx("h2", {
                                className:
                                  "text-sm font-bold text-slate-100 truncate uppercase tracking-wide",
                                children: t.schoolName,
                              }),
                              e.jsx("p", {
                                className: "text-[10px] text-slate-400 truncate max-w-[280px]",
                                children: t.schoolAddress || "Bengaluru, KA",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: `border rounded-xl p-3 flex items-center gap-3 ${t.status === "Active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-450"}`,
                        children: [
                          e.jsx("div", {
                            className: `size-8 rounded-full flex items-center justify-center ${t.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`,
                            children:
                              t.status === "Active"
                                ? e.jsx(A, { className: "size-5" })
                                : e.jsx(g, { className: "size-5" }),
                          }),
                          e.jsxs("div", {
                            children: [
                              e.jsx("p", {
                                className: "text-xs font-semibold uppercase tracking-wider",
                                children:
                                  t.status === "Active"
                                    ? "VERIFIED ACTIVE CARD"
                                    : "CARD INACTIVE / EXPIRED",
                              }),
                              e.jsx("p", {
                                className: "text-[10px] text-slate-400",
                                children:
                                  t.status === "Active"
                                    ? "Authenticated active school registration."
                                    : "Card has expired or academic year registry is inactive.",
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "flex items-center gap-4 py-2 relative",
                        children: [
                          e.jsx("div", {
                            className:
                              "size-24 rounded-xl border border-slate-700 bg-slate-850 overflow-hidden flex-shrink-0 shadow-inner",
                            children: t.photoUrl
                              ? e.jsx("img", {
                                  src: t.photoUrl,
                                  alt: t.name,
                                  className: "size-full object-cover",
                                })
                              : e.jsx("div", {
                                  className:
                                    "size-full flex items-center justify-center bg-slate-800 text-slate-400",
                                  children: e.jsx(w, { className: "size-10" }),
                                }),
                          }),
                          e.jsxs("div", {
                            className: "min-w-0 flex-1 space-y-1",
                            children: [
                              e.jsx("span", {
                                className:
                                  "text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full",
                                children: t.role,
                              }),
                              e.jsx("h1", {
                                className:
                                  "text-lg font-bold text-slate-100 leading-tight truncate",
                                children: t.name,
                              }),
                              e.jsxs("p", {
                                className: "text-xs text-slate-300 font-medium",
                                children: [
                                  t.role === "Student"
                                    ? `Class ${t.classOrDesignation}`
                                    : t.classOrDesignation,
                                  t.departmentOrSection && ` · Section ${t.departmentOrSection}`,
                                ],
                              }),
                              e.jsx("p", {
                                className: "text-[11px] text-slate-400 font-mono",
                                children:
                                  t.role === "Student"
                                    ? `Adm: ${t.identifier}`
                                    : `Emp ID: ${t.identifier}`,
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "grid grid-cols-2 gap-3 pt-2",
                        children: [
                          e.jsxs("div", {
                            className:
                              "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1",
                            children: [
                              e.jsx("p", {
                                className: "text-[9px] uppercase tracking-wider text-slate-400",
                                children: "Blood Group",
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                                children: [
                                  e.jsx(k, { className: "size-3.5 text-red-550 fill-red-550" }),
                                  t.bloodGroup || "—",
                                ],
                              }),
                            ],
                          }),
                          e.jsxs("div", {
                            className:
                              "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1",
                            children: [
                              e.jsx("p", {
                                className: "text-[9px] uppercase tracking-wider text-slate-400",
                                children: "Emergency Contact",
                              }),
                              e.jsxs("div", {
                                className:
                                  "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                                children: [
                                  e.jsx(E, { className: "size-3.5 text-slate-400" }),
                                  t.emergencyContact || "—",
                                ],
                              }),
                            ],
                          }),
                          t.role === "Student" &&
                            t.academicYear &&
                            e.jsxs("div", {
                              className:
                                "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 col-span-2 space-y-1",
                              children: [
                                e.jsx("p", {
                                  className: "text-[9px] uppercase tracking-wider text-slate-400",
                                  children: "Academic Session",
                                }),
                                e.jsxs("div", {
                                  className:
                                    "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                                  children: [
                                    e.jsx(z, { className: "size-3.5 text-slate-400" }),
                                    t.academicYear,
                                  ],
                                }),
                              ],
                            }),
                        ],
                      }),
                      e.jsxs("div", {
                        className: "pt-4 border-t border-slate-800/80 text-center space-y-1.5",
                        children: [
                          e.jsxs("div", {
                            className:
                              "inline-flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800",
                            children: [
                              e.jsx("div", {
                                className: "size-1.5 bg-emerald-500 rounded-full animate-pulse",
                              }),
                              e.jsxs("span", {
                                className: "text-[9px] text-slate-400 font-mono",
                                children: ["VERIFIED: ", new Date().toLocaleString()],
                              }),
                            ],
                          }),
                          e.jsxs("p", {
                            className: "text-[9px] text-slate-500 max-w-xs mx-auto",
                            children: [
                              "This verification check query is real-time and directly matched with the official active registers of ",
                              t?.schoolName || "the school",
                              ".",
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : null,
        }),
        e.jsx("div", {
          className: "text-center pt-8",
          children: e.jsxs("p", {
            className: "text-xs text-slate-500 flex items-center justify-center gap-1",
            children: [e.jsx(S, { className: "size-3.5" }), " Powered by School ERP Security"],
          }),
        }),
      ],
    })
  );
}
export { Y as component };
