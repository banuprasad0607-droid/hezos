import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { R as Route$x } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  ae as ShieldAlert,
  af as ShieldCheck,
  ap as User,
  K as Heart,
  a1 as Phone,
  C as Calendar,
  ad as Shield,
} from "../_libs/lucide-react.mjs";
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
function VerifyIdPage() {
  const { type, id } = Route$x.useSearch();
  const [loading, setLoading] = reactExports.useState(true);
  const [data, setData] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchRecord = async () => {
      if (!id || !type) {
        setError("Invalid verification link. Missing card type or identifier.");
        setLoading(false);
        return;
      }
      try {
        if (type === "student") {
          const { data: student, error: studentErr } = await supabase
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
            .eq("id", id)
            .maybeSingle();
          if (studentErr) throw studentErr;
          if (!student) {
            setError(
              "No student record found matching this ID. This card may have been deleted or revoked.",
            );
            setLoading(false);
            return;
          }
          const { data: school, error: schoolErr } = await supabase
            .from("schools")
            .select("name, school_name, logo_url, school_logo, address, status")
            .eq("id", student.school_id)
            .maybeSingle();
          if (schoolErr) throw schoolErr;
          if (!school) {
            setError("Associated school record not found.");
            setLoading(false);
            return;
          }
          if (school.status !== "active") {
            setError(
              `Verification blocked: ${school.school_name || school.name || "School"} access is suspended.`,
            );
            setLoading(false);
            return;
          }
          const classInfo = student.classes;
          const className = classInfo ? classInfo.name : "—";
          const sectionName = classInfo && classInfo.section ? classInfo.section : "";
          const currentYear = /* @__PURE__ */ new Date().getFullYear();
          const currentMonth = /* @__PURE__ */ new Date().getMonth();
          const currentAcademicYear =
            currentMonth >= 5
              ? `${currentYear}-${currentYear + 1}`
              : `${currentYear - 1}-${currentYear}`;
          const isActive =
            !student.academic_year || student.academic_year === currentAcademicYear
              ? "Active"
              : "Inactive";
          setData({
            id: student.id,
            name: student.full_name,
            photoUrl: student.photo_url,
            identifier:
              student.admission_number ||
              student.roll_number ||
              `STU-${currentYear}-${student.id.slice(0, 4).toUpperCase()}`,
            role: "Student",
            classOrDesignation: className,
            departmentOrSection: sectionName,
            bloodGroup: student.blood_group,
            emergencyContact: student.emergency_contact,
            academicYear: student.academic_year || currentAcademicYear,
            schoolName: school.school_name || school.name || "School",
            schoolLogo: school.school_logo || school.logo_url || null,
            schoolAddress: school.address || null,
            status: isActive,
          });
        } else if (type === "staff") {
          const { data: staff, error: staffErr } = await supabase
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
            .eq("user_id", id)
            .maybeSingle();
          if (staffErr) throw staffErr;
          if (!staff) {
            setError(
              "No staff record found matching this ID. This card may have been deleted or revoked.",
            );
            setLoading(false);
            return;
          }
          if (!staff.school_id) {
            setError("Staff member is not associated with any school.");
            setLoading(false);
            return;
          }
          const { data: school, error: schoolErr } = await supabase
            .from("schools")
            .select("name, school_name, logo_url, school_logo, address, status")
            .eq("id", staff.school_id)
            .maybeSingle();
          if (schoolErr) throw schoolErr;
          if (!school) {
            setError("Associated school record not found.");
            setLoading(false);
            return;
          }
          if (school.status !== "active") {
            setError(
              `Verification blocked: ${school.school_name || school.name || "School"} access is suspended.`,
            );
            setLoading(false);
            return;
          }
          setData({
            id: staff.user_id,
            name: staff.full_name,
            photoUrl: staff.photo_url,
            identifier:
              staff.employee_id ||
              `EMP-${/* @__PURE__ */ new Date().getFullYear()}-${staff.user_id.slice(0, 4).toUpperCase()}`,
            role: "Staff",
            classOrDesignation: staff.designation || "Staff Member",
            departmentOrSection: staff.department || "General",
            bloodGroup: staff.blood_group,
            emergencyContact: staff.emergency_contact || staff.mobile_number || null,
            schoolName: school.school_name || school.name || "School",
            schoolLogo: school.school_logo || school.logo_url || null,
            schoolAddress: school.address || null,
            status: "Active",
            // Staff profiles with active roles are active
          });
        } else {
          setError("Unsupported record type.");
        }
      } catch (err) {
        setError(err.message || "An error occurred while verifying the record.");
      } finally {
        setLoading(false);
      }
    };
    void fetchRecord();
  }, [id, type]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "min-h-screen bg-slate-950 flex flex-col justify-between py-10 px-4 text-slate-100",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className:
          "absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.1),transparent_50%)] pointer-events-none",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className:
          "max-w-md w-full mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative z-10 overflow-hidden",
        children: loading
          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "py-20 text-center space-y-3",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "size-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                  className: "text-slate-400 text-sm",
                  children: "Querying secure records...",
                }),
              ],
            })
          : error
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "text-center py-10 space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "size-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto border border-red-500/20",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
                      className: "size-8",
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                    className: "text-xl font-bold text-slate-100",
                    children: "Verification Failed",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-slate-400 text-sm max-w-xs mx-auto",
                    children: error,
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "pt-6 border-t border-slate-800/80",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-slate-500",
                      children: "Secure School ERP Verification Gateway",
                    }),
                  }),
                ],
              })
            : data
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-3 pb-4 border-b border-slate-800",
                      children: [
                        data.schoolLogo
                          ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                              src: data.schoolLogo,
                              alt: "",
                              className: "size-10 rounded-lg object-cover bg-white",
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className:
                                "size-10 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 font-bold",
                              children: "H",
                            }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "min-w-0",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                              className:
                                "text-sm font-bold text-slate-100 truncate uppercase tracking-wide",
                              children: data.schoolName,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[10px] text-slate-400 truncate max-w-[280px]",
                              children: data.schoolAddress || "Bengaluru, KA",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: `border rounded-xl p-3 flex items-center gap-3 ${data.status === "Active" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border-red-500/20 text-red-450"}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: `size-8 rounded-full flex items-center justify-center ${data.status === "Active" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`,
                          children:
                            data.status === "Active"
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, {
                                  className: "size-5",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, {
                                  className: "size-5",
                                }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-xs font-semibold uppercase tracking-wider",
                              children:
                                data.status === "Active"
                                  ? "VERIFIED ACTIVE CARD"
                                  : "CARD INACTIVE / EXPIRED",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[10px] text-slate-400",
                              children:
                                data.status === "Active"
                                  ? "Authenticated active school registration."
                                  : "Card has expired or academic year registry is inactive.",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-4 py-2 relative",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "size-24 rounded-xl border border-slate-700 bg-slate-850 overflow-hidden flex-shrink-0 shadow-inner",
                          children: data.photoUrl
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                                src: data.photoUrl,
                                alt: data.name,
                                className: "size-full object-cover",
                              })
                            : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                className:
                                  "size-full flex items-center justify-center bg-slate-800 text-slate-400",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                                  className: "size-10",
                                }),
                              }),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "min-w-0 flex-1 space-y-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                              className:
                                "text-[9px] font-bold uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full",
                              children: data.role,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
                              className: "text-lg font-bold text-slate-100 leading-tight truncate",
                              children: data.name,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-xs text-slate-300 font-medium",
                              children: [
                                data.role === "Student"
                                  ? `Class ${data.classOrDesignation}`
                                  : data.classOrDesignation,
                                data.departmentOrSection &&
                                  ` · Section ${data.departmentOrSection}`,
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[11px] text-slate-400 font-mono",
                              children:
                                data.role === "Student"
                                  ? `Adm: ${data.identifier}`
                                  : `Emp ID: ${data.identifier}`,
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-2 gap-3 pt-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[9px] uppercase tracking-wider text-slate-400",
                              children: "Blood Group",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, {
                                  className: "size-3.5 text-red-550 fill-red-550",
                                }),
                                data.bloodGroup || "—",
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 space-y-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[9px] uppercase tracking-wider text-slate-400",
                              children: "Emergency Contact",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, {
                                  className: "size-3.5 text-slate-400",
                                }),
                                data.emergencyContact || "—",
                              ],
                            }),
                          ],
                        }),
                        data.role === "Student" &&
                          data.academicYear &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "bg-slate-850/50 border border-slate-800/80 rounded-xl p-3 col-span-2 space-y-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "text-[9px] uppercase tracking-wider text-slate-400",
                                children: "Academic Session",
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className:
                                  "flex items-center gap-1.5 text-xs font-semibold text-slate-200",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, {
                                    className: "size-3.5 text-slate-400",
                                  }),
                                  data.academicYear,
                                ],
                              }),
                            ],
                          }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "pt-4 border-t border-slate-800/80 text-center space-y-1.5",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "inline-flex items-center gap-1 bg-slate-950 px-3 py-1 rounded-full border border-slate-800",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "size-1.5 bg-emerald-500 rounded-full animate-pulse",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                              className: "text-[9px] text-slate-400 font-mono",
                              children: ["VERIFIED: ", /* @__PURE__ */ new Date().toLocaleString()],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-[9px] text-slate-500 max-w-xs mx-auto",
                          children: [
                            "This verification check query is real-time and directly matched with the official active registers of ",
                            data?.schoolName || "the school",
                            ".",
                          ],
                        }),
                      ],
                    }),
                  ],
                })
              : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "text-center pt-8",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
          className: "text-xs text-slate-500 flex items-center justify-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "size-3.5" }),
            " Powered by School ERP Security",
          ],
        }),
      }),
    ],
  });
}
export { VerifyIdPage as component };
