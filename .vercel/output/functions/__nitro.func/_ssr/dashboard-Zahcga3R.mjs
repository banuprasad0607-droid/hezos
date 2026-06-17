import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  as as Users,
  u as Clock,
  h as Building2,
  I as FileText,
  a as ArrowRight,
} from "../_libs/lucide-react.mjs";
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
function DashboardPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    profile,
    roles,
    loading: tenantLoading,
    error: tenantError,
  } = useTenant();
  usePageTitle("Dashboard");
  const [stats, setStats] = reactExports.useState(null);
  const [remarks, setRemarks] = reactExports.useState([]);
  const isParent =
    roles.includes("parent") && !roles.includes("admin") && !roles.includes("teacher");
  reactExports.useEffect(() => {
    if (!effectiveSchoolId || isParent) return;
    let mounted = true;
    const load = async () => {
      const today = /* @__PURE__ */ new Date().toISOString().slice(0, 10);
      const [students, teacherRoles, attRows, hwToday, hwPending, recentRemarks] =
        await Promise.all([
          supabase
            .from("students")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("school_id", effectiveSchoolId),
          supabase
            .from("user_roles")
            .select("user_id", {
              count: "exact",
              head: true,
            })
            .eq("school_id", effectiveSchoolId)
            .eq("role", "teacher"),
          supabase
            .from("attendance")
            .select("status")
            .eq("school_id", effectiveSchoolId)
            .eq("date", today),
          supabase
            .from("homework")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("school_id", effectiveSchoolId)
            .gte("created_at", today),
          supabase
            .from("homework")
            .select("id", {
              count: "exact",
              head: true,
            })
            .eq("school_id", effectiveSchoolId)
            .gte("due_date", today),
          supabase
            .from("remarks")
            .select("id, category, content, created_at, students(full_name)")
            .eq("school_id", effectiveSchoolId)
            .order("created_at", {
              ascending: false,
            })
            .limit(5),
        ]);
      if (!mounted) return;
      const present = (attRows.data ?? []).filter(
        (r) => r.status === "present" || r.status === "late" || r.status === "half_day",
      ).length;
      setStats({
        students: students.count ?? 0,
        teachers: teacherRoles.count ?? 0,
        attendanceToday: {
          present,
          total: attRows.data?.length ?? 0,
        },
        homeworkToday: hwToday.count ?? 0,
        pendingHomework: hwPending.count ?? 0,
      });
      setRemarks(
        (recentRemarks.data ?? []).map((r) => {
          const studentField = r.students;
          const student = Array.isArray(studentField) ? (studentField[0] ?? null) : studentField;
          return {
            id: r.id,
            category: r.category,
            content: r.content,
            created_at: r.created_at,
            student,
          };
        }),
      );
    };
    void load();
    const channel = supabase
      .channel(`dashboard-${effectiveSchoolId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "attendance",
          filter: `school_id=eq.${effectiveSchoolId}`,
        },
        () => void load(),
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "remarks",
          filter: `school_id=eq.${effectiveSchoolId}`,
        },
        () => void load(),
      )
      .subscribe();
    return () => {
      mounted = false;
      void supabase.removeChannel(channel);
    };
  }, [effectiveSchoolId, isParent]);
  if (tenantLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "text-center space-y-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground",
            children: "Loading dashboard information...",
          }),
        ],
      }),
    });
  }
  if (tenantError) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-danger font-semibold mb-2",
            children: "Unable to load dashboard.",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground mb-4",
            children: "Please contact the administrator or check your connection.",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
            onClick: () => window.location.reload(),
            className:
              "bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90",
            children: "Retry",
          }),
        ],
      }),
    });
  }
  const isSuperAdmin = roles.includes("super_admin");
  if (!effectiveSchoolId && !isParent && !isSuperAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className:
          "max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "font-semibold mb-2 text-foreground",
            children: "School information not found.",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-sm text-muted-foreground mb-4",
            children: "You are not associated with any school. Please contact the administrator.",
          }),
        ],
      }),
    });
  }
  if (isParent) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
      className: "p-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", {
          className: "text-2xl font-bold",
          children: "Welcome back!",
        }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, {
          to: "/parent",
          className: "mt-4 inline-block text-brand font-medium",
          children: "Open Parent Dashboard →",
        }),
      ],
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "flex-1 overflow-y-auto bg-[#F9FAFB] p-8 space-y-6 text-foreground",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", {
                className: "text-3xl font-bold tracking-tight",
                children: ["Welcome back, ", profile?.full_name?.split(" ")[0] || "Admin"],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                className: "text-muted-foreground text-sm mt-1",
                children: [
                  roles.includes("admin") ? "Admin Dashboard" : "Teacher Dashboard",
                  " • School Management & Academics",
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
            to: "/students",
            className:
              "bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm inline-flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
              " Manage Students",
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, {
            label: "TOTAL STUDENTS",
            value: stats?.students ?? 0,
            subtext: `Enrolled`,
            subtextColor: "text-success",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5 text-brand" }),
            iconBg: "bg-brand/10",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, {
            label: "ATTENDANCE TODAY",
            value: stats?.attendanceToday.present ?? 0,
            subtext: stats?.attendanceToday.total
              ? `of ${stats.attendanceToday.total} marked`
              : "Not marked yet",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {
              className: "size-5 text-warning",
            }),
            iconBg: "bg-warning/10",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, {
            label: "TEACHERS",
            value: stats?.teachers ?? 0,
            subtext: "Active staff members",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, {
              className: "size-5 text-brand",
            }),
            iconBg: "bg-brand/10",
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(KpiCard, {
            label: "PENDING HOMEWORK",
            value: stats?.pendingHomework ?? 0,
            subtext: "Due from today onwards",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, {
              className: "size-5 text-muted-foreground",
            }),
            iconBg: "bg-slate-200",
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "text-lg font-bold",
                    children: "Recent Remarks & Feedback",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                    className:
                      "bg-warning/15 text-warning text-xs font-semibold px-2 py-1 rounded-full",
                    children: [remarks.length, " recent"],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-muted-foreground mb-6",
                children: "Review and acknowledge student remarks",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "space-y-4",
                children:
                  remarks.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "text-sm text-muted-foreground text-center py-4",
                        children: "No recent remarks.",
                      })
                    : remarks.map((r) =>
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className:
                              "flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex items-center gap-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                    className:
                                      "size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm uppercase",
                                    children: r.student?.full_name?.slice(0, 1) || "S",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                        className: "font-semibold text-sm",
                                        children: r.student?.full_name || "Unknown Student",
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                        className:
                                          "text-xs text-muted-foreground capitalize mt-0.5",
                                        children: [
                                          r.category,
                                          " • ",
                                          r.content.length > 30
                                            ? r.content.slice(0, 30) + "..."
                                            : r.content,
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex items-center gap-2",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                    className:
                                      "bg-brand text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors",
                                    children: "Acknowledge",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                    className:
                                      "bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors",
                                    children: "Dismiss",
                                  }),
                                ],
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
            className: "bg-white rounded-2xl p-6 shadow-sm border border-slate-100",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center justify-between mb-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                    className: "text-lg font-bold",
                    children: "Academic Progress",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, {
                    to: "/attendance",
                    className:
                      "text-sm font-medium flex items-center gap-1 hover:text-brand transition-colors",
                    children: [
                      "View All ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-sm text-muted-foreground mb-6",
                children: "Daily school activity progress",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "space-y-6",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex justify-between text-sm mb-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-slate-600",
                            children: "Overall Attendance",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                            className: "font-semibold text-brand",
                            children: [
                              stats?.attendanceToday.total
                                ? Math.round(
                                    (stats.attendanceToday.present / stats.attendanceToday.total) *
                                      100,
                                  )
                                : 0,
                              "%",
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-full bg-brand rounded-full transition-all duration-500",
                          style: {
                            width: `${stats?.attendanceToday.total ? (stats.attendanceToday.present / stats.attendanceToday.total) * 100 : 0}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex justify-between text-sm mb-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-slate-600",
                            children: "Homework Assigned Today",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-semibold text-success",
                            children: stats?.homeworkToday ?? 0,
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                          className: "h-full bg-success rounded-full transition-all duration-500",
                          style: {
                            width: `${Math.min(((stats?.homeworkToday ?? 0) / 10) * 100, 100)}%`,
                          },
                        }),
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className: "flex justify-between text-sm mb-2",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "text-slate-600",
                            children: "Pending Actions",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                            className: "font-semibold text-danger",
                            children: "0",
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "h-2.5 w-full bg-slate-100 rounded-full overflow-hidden",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-2xl font-bold",
                        children: stats?.attendanceToday.present ?? 0,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: "Present",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-2xl font-bold",
                        children: stats?.homeworkToday ?? 0,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: "Homework",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className: "text-center",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-2xl font-bold",
                        children: remarks.length,
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-xs text-muted-foreground mt-1",
                        children: "Remarks",
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
function KpiCard({ label, value, subtext, subtextColor = "text-muted-foreground", icon, iconBg }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className:
      "bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
            className: "text-xs font-semibold text-muted-foreground mb-1 tracking-wider uppercase",
            children: label,
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex items-end gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "text-3xl font-bold text-foreground",
                children: value,
              }),
              subtext &&
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                  className: `text-xs font-medium mb-1 ${subtextColor}`,
                  children: subtext,
                }),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
        className: `size-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`,
        children: icon,
      }),
    ],
  });
}
export { DashboardPage as component };
