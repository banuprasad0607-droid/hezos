import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import {
  u as useAuth,
  e as useSchoolName,
  c as usePageTitle,
  P as PageHeader,
  s as safeHtml2Canvas,
} from "./router-CplsJ0Ue.mjs";
import { j as jspdf_node_minExports } from "../_libs/jspdf.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import {
  q as CircleAlert,
  aj as Sparkles,
  ao as Trophy,
  ac as Share2,
  c as Award,
  f as BookOpen,
  y as Download,
  Y as MessageSquare,
  i as CalendarCheck,
  W as Megaphone,
  ap as User,
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
const getPosterStyle = (themeName) => {
  const baseStyle = {
    width: "360px",
    height: "450px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box",
  };
  if (themeName === "rank_1") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #fef9c2 50%, #f59e0b 100%)",
      color: "#1e293b",
      borderColor: "#fcd34d",
    };
  }
  if (themeName === "rank_2") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
      color: "#1e293b",
      borderColor: "#cbd5e1",
    };
  }
  if (themeName === "rank_3") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #d97706 0%, #fef3c7 50%, #b45309 100%)",
      color: "#1e293b",
      borderColor: "#d97706",
    };
  }
  return {
    ...baseStyle,
    backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
    color: "#ffffff",
    borderColor: "#312e81",
  };
};
function ParentDashboard() {
  const { user, profile } = useAuth();
  const schoolDisplayName = useSchoolName();
  usePageTitle("Parent Dashboard");
  const [children, setChildren] = reactExports.useState([]);
  const [selected, setSelected] = reactExports.useState("");
  const [attendance, setAttendance] = reactExports.useState([]);
  const [homework, setHomework] = reactExports.useState([]);
  const [remarks, setRemarks] = reactExports.useState([]);
  const [announcements, setAnnouncements] = reactExports.useState([]);
  const [childRank, setChildRank] = reactExports.useState(null);
  const [childAwards, setChildAwards] = reactExports.useState([]);
  const [selectedAward, setSelectedAward] = reactExports.useState(null);
  const [isExporting, setIsExporting] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) return;
    supabase
      .from("students")
      .select("id, full_name, class_id, school_id, photo_url, classes(name), schools(status)")
      .eq("parent_user_id", user.id)
      .then(({ data }) => {
        const list = (data ?? []).map((c) => ({
          ...c,
          classes: Array.isArray(c.classes) ? (c.classes[0] ?? null) : c.classes,
          schools: Array.isArray(c.schools) ? (c.schools[0] ?? null) : c.schools,
        }));
        setChildren(list);
        if (list[0] && !selected) setSelected(list[0].id);
      });
  }, [user]);
  reactExports.useEffect(() => {
    const child2 = children.find((c) => c.id === selected);
    if (!child2) return;
    if (child2.schools?.status === "suspended") {
      setAttendance([]);
      setHomework([]);
      setRemarks([]);
      setAnnouncements([]);
      setChildRank(null);
      setChildAwards([]);
      return;
    }
    /* @__PURE__ */ new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
    (async () => {
      const [att, hw, rem, ann, rnk, awd] = await Promise.all([
        supabase
          .from("attendance")
          .select("date, status")
          .eq("student_id", child2.id)
          .gte("date", monthAgo)
          .order("date", {
            ascending: false,
          }),
        child2.class_id
          ? supabase
              .from("homework")
              .select("id, title, subject, due_date, file_url, file_type")
              .eq("class_id", child2.class_id)
              .order("created_at", {
                ascending: false,
              })
              .limit(10)
          : Promise.resolve({
              data: [],
            }),
        supabase
          .from("remarks")
          .select("id, category, content, created_at")
          .eq("student_id", child2.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(10),
        supabase
          .from("announcements")
          .select("id, title, body, created_at")
          .eq("school_id", child2.school_id)
          .order("created_at", {
            ascending: false,
          })
          .limit(5),
        supabase
          .from("rankings")
          .select("rank_position, percentage, gpa, academic_year")
          .eq("student_id", child2.id)
          .eq("is_published", true)
          .maybeSingle(),
        supabase
          .from("awards")
          .select("id, category, title, description, issued_at")
          .eq("student_id", child2.id)
          .eq("is_published", true)
          .order("issued_at", {
            ascending: false,
          }),
      ]);
      setAttendance(att.data ?? []);
      setHomework(hw.data ?? []);
      setRemarks(rem.data ?? []);
      setAnnouncements(ann.data ?? []);
      setChildRank(rnk.data || null);
      setChildAwards(awd.data || []);
    })();
  }, [selected, children]);
  const child = children.find((c) => c.id === selected);
  const todayAtt = attendance[0];
  const last30Present = attendance.filter((a) => a.status === "present").length;
  const attRate = attendance.length > 0 ? Math.round((last30Present / attendance.length) * 100) : 0;
  const handleDownloadPoster = (award) => {
    setSelectedAward(award);
    setIsExporting("png");
    toast.info("Preparing poster download...");
    setTimeout(() => {
      const element = document.getElementById("parent-poster-export");
      if (!element) {
        toast.error("Poster container not found");
        setIsExporting(null);
        return;
      }
      safeHtml2Canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `${child?.full_name || "student"}_achievement_poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Poster downloaded!");
          setIsExporting(null);
        })
        .catch((e) => {
          toast.error("Failed to download poster: " + e.message);
          setIsExporting(null);
        });
    }, 250);
  };
  const handleDownloadCert = (award) => {
    setSelectedAward(award);
    setIsExporting("pdf");
    toast.info("Preparing certificate PDF...");
    setTimeout(() => {
      const element = document.getElementById("parent-cert-export");
      if (!element) {
        toast.error("Certificate container not found");
        setIsExporting(null);
        return;
      }
      safeHtml2Canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jspdf_node_minExports.jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
          });
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasRatio = canvas.width / canvas.height;
          const pageRatio = pdfWidth / pdfHeight;
          let imgWidth = pdfWidth;
          let imgHeight = pdfHeight;
          let x = 0;
          let y = 0;
          if (canvasRatio > pageRatio) {
            imgHeight = pdfWidth / canvasRatio;
            y = (pdfHeight - imgHeight) / 2;
          } else {
            imgWidth = pdfHeight * canvasRatio;
            x = (pdfWidth - imgWidth) / 2;
          }
          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
          pdf.save(`${child?.full_name || "student"}_certificate.pdf`);
          toast.success("Certificate downloaded!");
          setIsExporting(null);
        })
        .catch((e) => {
          toast.error("Failed to download certificate: " + e.message);
          setIsExporting(null);
        });
    }, 250);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, {
        title: "Parent Dashboard",
        breadcrumb: profile?.full_name ?? "Parent",
        actions:
          children.length > 1
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                value: selected,
                onChange: (e) => setSelected(e.target.value),
                className: "px-3 py-1.5 text-sm border border-border rounded-md bg-card",
                children: children.map((c) =>
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "option",
                    { value: c.id, children: c.full_name },
                    c.id,
                  ),
                ),
              })
            : null,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-8",
        children:
          children.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "bg-card border border-dashed border-border rounded-xl p-16 text-center",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "font-semibold",
                    children: "No children linked yet",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                    className: "text-sm text-muted-foreground mt-2 max-w-md mx-auto",
                    children: [
                      "Ask your child's school admin to add your email ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                        className: "font-mono",
                        children: profile?.email,
                      }),
                      " as the parent email for your child in their school's system. You'll be linked automatically.",
                    ],
                  }),
                ],
              })
            : child?.schools?.status === "suspended"
              ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "bg-card border border-border rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "size-12 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto mb-4",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, {
                        className: "size-6",
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "text-lg font-semibold text-foreground",
                      children: "School Portal Suspended",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                      className: "text-sm text-muted-foreground mt-2",
                      children: [
                        "Access to the digital portal for ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", {
                          children: child.full_name,
                        }),
                        "'s school has been temporarily suspended.",
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-xs text-muted-foreground mt-1",
                      children:
                        "Please contact the school administration or system owner for support or reactivation queries.",
                    }),
                  ],
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                      className:
                        "bg-primary text-primary-foreground rounded-2xl p-8 relative overflow-hidden",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "absolute -right-8 -top-8 size-48 bg-brand/30 blur-3xl rounded-full",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "relative",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-foreground bg-brand/30 px-3 py-1 rounded-full",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                                  className: "size-3.5",
                                }),
                                " Today's Digest · ",
                                /* @__PURE__ */ new Date().toLocaleDateString(void 0, {
                                  weekday: "long",
                                  month: "long",
                                  day: "numeric",
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", {
                              className: "text-3xl font-bold mt-4",
                              children: ["How ", child?.full_name.split(" ")[0], "'s day went"],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-sm opacity-80 mt-2",
                              children:
                                "A daily summary your child's school sends every evening. Everything that happened — at a glance.",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className: "grid grid-cols-2 md:grid-cols-4 gap-3 mt-6",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DigestCell, {
                                  label: "Attendance",
                                  value: todayAtt
                                    ? todayAtt.status.replace("_", " ")
                                    : "Not marked",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DigestCell, {
                                  label: "Homework today",
                                  value: `${homework.filter((h) => h.due_date && new Date(h.due_date) >= new Date(/* @__PURE__ */ new Date().toDateString())).length}`,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DigestCell, {
                                  label: "New remarks",
                                  value: `${remarks.filter((r) => new Date(r.created_at).toDateString() === /* @__PURE__ */ new Date().toDateString()).length}`,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(DigestCell, {
                                  label: "30-day attendance",
                                  value: `${attRate}%`,
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                      className:
                        "bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4 text-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "flex items-center justify-between flex-wrap gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                  className:
                                    "font-bold text-lg text-slate-800 flex items-center gap-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                                      className: "text-amber-500 size-5",
                                    }),
                                    " Academic Ranks & Honor Roll",
                                  ],
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children:
                                    "Officially published certifications and dashboard achievements.",
                                }),
                              ],
                            }),
                            childRank &&
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "bg-amber-50 text-amber-700 font-extrabold border border-amber-200 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, {
                                    className: "size-3.5 text-amber-500 animate-pulse",
                                  }),
                                  " Rank Position: #",
                                  childRank.rank_position,
                                  " (",
                                  childRank.percentage,
                                  "%)",
                                ],
                              }),
                          ],
                        }),
                        childAwards.length === 0
                          ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                              className:
                                "text-center py-6 border border-dashed border-slate-100 rounded-xl text-xs text-muted-foreground",
                              children: [
                                "No published achievements or ranks available for ",
                                child?.full_name,
                                " at this time.",
                              ],
                            })
                          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                              children: childAwards.map((aw) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "div",
                                  {
                                    className:
                                      "p-4 border border-slate-100 rounded-xl bg-slate-50/40 flex flex-col justify-between hover:border-slate-200 transition-colors",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className: "space-y-2",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            className: "flex items-center gap-2",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className:
                                                  "bg-brand/10 text-brand text-[9px] uppercase font-black px-2 py-0.5 rounded",
                                                children: badgeLabel(aw.category),
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                                className: "text-[10px] text-muted-foreground",
                                                children: new Date(
                                                  aw.issued_at,
                                                ).toLocaleDateString(),
                                              }),
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                                            className: "font-bold text-sm text-slate-800",
                                            children: aw.title,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-xs text-slate-600 leading-relaxed",
                                            children: aw.description,
                                          }),
                                        ],
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                        className:
                                          "flex gap-2 mt-4 pt-3 border-t border-slate-100/50",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                            onClick: () => handleDownloadPoster(aw),
                                            className:
                                              "flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, {
                                                className: "size-3.5",
                                              }),
                                              " Share Poster",
                                            ],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                            onClick: () => handleDownloadCert(aw),
                                            className:
                                              "flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer",
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(Award, {
                                                className: "size-3.5",
                                              }),
                                              " Certificate PDF",
                                            ],
                                          }),
                                        ],
                                      }),
                                    ],
                                  },
                                  aw.id,
                                ),
                              ),
                            }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "lg:col-span-2 bg-card border border-border rounded-xl p-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, {
                                  className: "size-4 text-brand",
                                }),
                                " Recent Homework",
                              ],
                            }),
                            homework.length === 0
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No homework posted recently.",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: homework.map((h) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className:
                                          "flex items-center justify-between p-3 rounded-lg border border-border",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                            children: [
                                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                                className: "text-sm font-medium",
                                                children: h.title,
                                              }),
                                              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                                className: "text-xs text-muted-foreground",
                                                children: [
                                                  h.subject ?? "—",
                                                  " · Due ",
                                                  h.due_date ?? "—",
                                                ],
                                              }),
                                            ],
                                          }),
                                          h.file_url &&
                                            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", {
                                              href: h.file_url,
                                              target: "_blank",
                                              rel: "noreferrer",
                                              className:
                                                "text-xs text-brand font-medium inline-flex items-center gap-1",
                                              children: [
                                                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, {
                                                  className: "size-3",
                                                }),
                                                " ",
                                                h.file_type,
                                              ],
                                            }),
                                        ],
                                      },
                                      h.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "bg-card border border-border rounded-xl p-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, {
                                  className: "size-4 text-brand",
                                }),
                                " Teacher Remarks",
                              ],
                            }),
                            remarks.length === 0
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No remarks yet.",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: remarks.map((r) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className: "border-l-2 border-brand pl-3",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className:
                                              "text-[10px] uppercase tracking-wider font-bold text-brand",
                                            children: r.category,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                            className: "text-sm italic mt-1",
                                            children: ['"', r.content, '"'],
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-[10px] text-muted-foreground mt-1",
                                            children: new Date(r.created_at).toLocaleDateString(),
                                          }),
                                        ],
                                      },
                                      r.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "bg-card border border-border rounded-xl p-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarCheck, {
                                  className: "size-4 text-brand",
                                }),
                                " Last 30 Days",
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                              className: "mt-4 flex flex-wrap gap-1",
                              children: attendance
                                .slice(0, 30)
                                .reverse()
                                .map((a) =>
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "div",
                                    {
                                      title: `${a.date} · ${a.status}`,
                                      className: `size-5 rounded ${a.status === "present" ? "bg-success" : a.status === "absent" ? "bg-danger" : a.status === "late" ? "bg-warning" : "bg-brand"}`,
                                    },
                                    a.date,
                                  ),
                                ),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                              className: "text-xs text-muted-foreground mt-3",
                              children: [
                                last30Present,
                                " present out of ",
                                attendance.length,
                                " marked days",
                              ],
                            }),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className: "lg:col-span-2 bg-card border border-border rounded-xl p-6",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                              className: "font-semibold flex items-center gap-2",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, {
                                  className: "size-4 text-brand",
                                }),
                                " School Announcements",
                              ],
                            }),
                            announcements.length === 0
                              ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-sm text-muted-foreground mt-4",
                                  children: "No announcements.",
                                })
                              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                  className: "space-y-3 mt-4",
                                  children: announcements.map((a) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                      "div",
                                      {
                                        className: "p-3 rounded-lg border border-border",
                                        children: [
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-sm font-medium",
                                            children: a.title,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className:
                                              "text-xs text-muted-foreground mt-1 line-clamp-2",
                                            children: a.body,
                                          }),
                                          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                            className: "text-[10px] text-muted-foreground mt-1",
                                            children: new Date(a.created_at).toLocaleString(),
                                          }),
                                        ],
                                      },
                                      a.id,
                                    ),
                                  ),
                                }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        style: {
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        },
        children: [
          selectedAward &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              id: "parent-poster-export",
              style: getPosterStyle(selectedAward.category),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex items-center justify-between border-b border-black/10 pb-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "size-8 font-extrabold text-sm rounded-lg flex items-center justify-center bg-black/10 text-slate-800 shadow-xs",
                          children: "H",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                              className: "font-extrabold text-xs tracking-wider",
                              children: schoolDisplayName,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                              className: "text-[7px] uppercase tracking-widest opacity-80",
                              children: "Empowering Academic Excellence",
                            }),
                          ],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                      className: "text-[8px] font-bold uppercase tracking-wider opacity-90",
                      children: "Academic Showcase",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "flex flex-col items-center text-center my-6 space-y-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "size-24 rounded-full border-4 border-black/10 bg-white/40 text-slate-700 flex items-center justify-center font-bold text-3xl shadow-lg relative overflow-hidden",
                      children: child?.photo_url
                        ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                            src: child.photo_url,
                            alt: "",
                            className: "size-full object-cover",
                            crossOrigin: "anonymous",
                          })
                        : child?.full_name?.slice(0, 1) || "S",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-[10px] uppercase font-bold tracking-widest opacity-70",
                          children: "Honor Roll Achievement",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                          className: "text-2xl font-black tracking-tight",
                          children: child?.full_name,
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                          className: "text-xs font-semibold opacity-90",
                          children: child?.classes?.name,
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "px-5 py-3 bg-white/40 border border-black/5 rounded-2xl text-center shadow-md space-y-1 max-w-[200px]",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                          className:
                            "flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-500",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                              className: "size-4 animate-bounce",
                            }),
                            " ",
                            badgeLabel(selectedAward.category),
                          ],
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "text-[9px] uppercase tracking-wider opacity-85 font-bold",
                          children: "Verified Honor",
                        }),
                        childRank &&
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "text-[10px] font-black text-brand",
                            children: [
                              "GPA ",
                              childRank.gpa,
                              " · Percentage ",
                              childRank.percentage,
                              "%",
                            ],
                          }),
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "flex items-end justify-between border-t border-black/10 pt-4 text-left",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "space-y-1",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-[8px] uppercase tracking-wider font-bold opacity-60",
                          children: "Verification Code",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "p-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center",
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                            src: `https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=VERIFY-${child?.full_name}-HZ`,
                            alt: "Verification QR",
                            className: "size-8",
                          }),
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "text-right space-y-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className:
                            "font-serif italic text-amber-600 font-bold text-sm tracking-wide block",
                          children: "Nirosha Reddy",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-[1px] w-24 bg-black/10 ml-auto",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-[8px] uppercase font-bold tracking-wider opacity-70",
                          children: "School Principal",
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          selectedAward &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              id: "parent-cert-export",
              className:
                "w-[640px] aspect-[1.414] bg-[#FDFBF7] p-12 border-[12px] border-amber-800 rounded-sm shadow-2xl relative flex flex-col justify-between items-center text-center text-slate-800",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "absolute inset-2 border-[2px] border-amber-400 pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute top-4 left-4 size-8 border-t-2 border-l-2 border-amber-600 pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute top-4 right-4 size-8 border-t-2 border-r-2 border-amber-600 pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute bottom-4 left-4 size-8 border-b-2 border-l-2 border-amber-600 pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "absolute bottom-4 right-4 size-8 border-b-2 border-r-2 border-amber-600 pointer-events-none",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex items-center justify-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Trophy, {
                          className: "size-8 text-amber-500",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                          className:
                            "font-serif italic font-extrabold text-2xl tracking-wider text-amber-900",
                          children: schoolDisplayName,
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-[8px] uppercase tracking-widest font-black opacity-85",
                      children: "Affiliated School Certificate of Honors",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "space-y-4 my-4 flex flex-col items-center",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-serif text-2xl font-extrabold text-amber-800 tracking-tight",
                      children: "CERTIFICATE OF EXCELLENCE",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "size-14 rounded-full border-2 border-amber-400 bg-white overflow-hidden shadow-xs flex items-center justify-center my-1",
                      children: child?.photo_url
                        ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", {
                            src: child.photo_url,
                            alt: "",
                            className: "size-full object-cover",
                            crossOrigin: "anonymous",
                          })
                        : /* @__PURE__ */ jsxRuntimeExports.jsx(User, {
                            className: "size-6 text-slate-300",
                          }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                      className: "text-[10px] italic text-slate-600",
                      children: "This certificate is proudly presented to",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                      className:
                        "font-serif text-xl font-black border-b border-amber-200 pb-0.5 px-6 text-amber-900 inline-block",
                      children: child?.full_name,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                      className: "text-xs text-slate-600 max-w-lg mx-auto leading-relaxed",
                      children: [
                        "Awarded for outstanding achievements in ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "font-bold text-amber-800",
                          children: selectedAward.title,
                        }),
                        ". Demonstrated academic dedication, good character, and excellence in school values for the term.",
                      ],
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "w-full flex items-end justify-between px-10 border-t border-slate-100 pt-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "text-center space-y-1.5 w-32 text-xs",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className:
                            "font-serif italic text-amber-700 font-semibold text-xs tracking-wide",
                          children: "Nirosha Reddy",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-[1px] bg-slate-300 w-full",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-[7px] uppercase font-bold tracking-wider opacity-70",
                          children: "School Principal",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "size-16 rounded-full border-4 border-amber-400 bg-amber-50 shadow-md flex items-center justify-center relative shrink-0",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className:
                            "absolute inset-0.5 border border-dashed border-amber-400 rounded-full",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Award, {
                          className: "size-8 text-amber-500",
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "text-center space-y-1.5 w-32 text-xs",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "font-bold text-slate-700",
                          children: new Date(selectedAward.issued_at).toLocaleDateString(),
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-[1px] bg-slate-300 w-full",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                          className: "text-[7px] uppercase font-bold tracking-wider opacity-70",
                          children: "Issued Date",
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
function DigestCell({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-white/10 backdrop-blur rounded-lg p-3",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-[10px] uppercase tracking-wider opacity-60",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-lg font-semibold capitalize mt-1",
        children: value,
      }),
    ],
  });
}
function badgeLabel(cat) {
  const map = {
    rank_1: "Gold Rank Topper",
    rank_2: "Silver Rank #2",
    rank_3: "Bronze Rank #3",
    top_10: "Top 10 Scholar",
    subject_topper: "Subject Topper",
    attendance_topper: "Attendance Champion",
    discipline_award: "Best Discipline Award",
  };
  return map[cat] || cat.toUpperCase().replace("_", " ");
}
export { ParentDashboard as component };
