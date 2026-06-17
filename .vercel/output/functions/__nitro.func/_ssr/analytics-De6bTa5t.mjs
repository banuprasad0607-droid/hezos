import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import "../_libs/sonner.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  as as Users,
  J as GraduationCap,
  an as TrendingUp,
  at as Wallet,
} from "../_libs/lucide-react.mjs";
import {
  R as ResponsiveContainer,
  e as LineChart,
  C as CartesianGrid,
  X as XAxis,
  Y as YAxis,
  T as Tooltip,
  d as Line,
  f as PieChart,
  P as Pie,
  c as Cell,
  L as Legend,
  b as BarChart,
  B as Bar,
} from "../_libs/recharts.mjs";
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
const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];
function AnalyticsPage() {
  const { currentSchoolId: effectiveSchoolId, loading: tenantLoading } = useTenant();
  usePageTitle("Analytics");
  const [attTrend, setAttTrend] = reactExports.useState([]);
  const [revTrend, setRevTrend] = reactExports.useState([]);
  const [statusMix, setStatusMix] = reactExports.useState([]);
  const [classRoll, setClassRoll] = reactExports.useState([]);
  const [kpi, setKpi] = reactExports.useState({
    students: 0,
    teachers: 0,
    attRate: 0,
    collected: 0,
  });
  reactExports.useEffect(() => {
    if (!effectiveSchoolId) return;
    (async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10);
      const monthAgo6 = new Date(Date.now() - 180 * 864e5).toISOString().slice(0, 10);
      const [
        { data: att },
        { data: pays },
        { data: students },
        { data: teachers },
        { data: classes },
      ] = await Promise.all([
        supabase
          .from("attendance")
          .select("date, status")
          .eq("school_id", effectiveSchoolId)
          .gte("date", since),
        supabase
          .from("fee_payments")
          .select("amount, paid_on")
          .eq("school_id", effectiveSchoolId)
          .gte("paid_on", monthAgo6),
        supabase
          .from("students")
          .select("id, class_id, classes(name)")
          .eq("school_id", effectiveSchoolId),
        supabase
          .from("user_roles")
          .select("user_id")
          .eq("school_id", effectiveSchoolId)
          .eq("role", "teacher"),
        supabase.from("classes").select("id, name").eq("school_id", effectiveSchoolId),
      ]);
      const byDate = /* @__PURE__ */ new Map();
      (att ?? []).forEach((r) => {
        const e = byDate.get(r.date) ?? {
          p: 0,
          t: 0,
        };
        e.t += 1;
        if (r.status === "present") e.p += 1;
        byDate.set(r.date, e);
      });
      const trend = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({
          date: date.slice(5),
          rate: Math.round((v.p / v.t) * 100),
          total: v.t,
        }));
      setAttTrend(trend);
      const mix = {
        present: 0,
        absent: 0,
        late: 0,
        half_day: 0,
      };
      (att ?? []).forEach((r) => {
        mix[r.status] = (mix[r.status] ?? 0) + 1;
      });
      setStatusMix(
        [
          {
            name: "Present",
            value: mix.present,
          },
          {
            name: "Absent",
            value: mix.absent,
          },
          {
            name: "Late",
            value: mix.late,
          },
          {
            name: "Half day",
            value: mix.half_day,
          },
        ].filter((x) => x.value > 0),
      );
      const byMonth = /* @__PURE__ */ new Map();
      (pays ?? []).forEach((p) => {
        const m = p.paid_on.slice(0, 7);
        byMonth.set(m, (byMonth.get(m) ?? 0) + Number(p.amount));
      });
      setRevTrend(
        Array.from(byMonth.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([month, collected]) => ({
            month,
            collected,
          })),
      );
      const klassCount = /* @__PURE__ */ new Map();
      (students ?? []).forEach((s) => {
        const cls = Array.isArray(s.classes) ? s.classes[0] : s.classes;
        const name = cls?.name ?? "Unassigned";
        klassCount.set(name, (klassCount.get(name) ?? 0) + 1);
      });
      setClassRoll(
        Array.from(klassCount.entries()).map(([name, students2]) => ({
          name,
          students: students2,
        })),
      );
      const totalAtt = att?.length ?? 0;
      const presentCount = (att ?? []).filter((a) => a.status === "present").length;
      setKpi({
        students: students?.length ?? 0,
        teachers: teachers?.length ?? 0,
        attRate: totalAtt ? Math.round((presentCount / totalAtt) * 100) : 0,
        collected: (pays ?? []).reduce((s, p) => s + Number(p.amount), 0),
      });
    })();
  }, [effectiveSchoolId]);
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
        title: "Analytics",
        breadcrumb: "Insights",
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-2 md:grid-cols-4 gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-4" }),
                label: "Students",
                value: String(kpi.students),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4" }),
                label: "Teachers",
                value: String(kpi.teachers),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "size-4" }),
                label: "Attendance (30d)",
                value: `${kpi.attRate}%`,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Kpi, {
                icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "size-4" }),
                label: "Collected (180d)",
                value: `₹${kpi.collected.toFixed(0)}`,
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Attendance rate — last 30 days",
                children:
                  attTrend.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {})
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                        width: "100%",
                        height: 260,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(LineChart, {
                          data: attTrend,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                              strokeDasharray: "3 3",
                              stroke: "hsl(var(--border))",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                              dataKey: "date",
                              tick: {
                                fontSize: 11,
                              },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                              domain: [0, 100],
                              tick: {
                                fontSize: 11,
                              },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Line, {
                              type: "monotone",
                              dataKey: "rate",
                              stroke: "hsl(var(--brand))",
                              strokeWidth: 2,
                              dot: false,
                            }),
                          ],
                        }),
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Attendance breakdown (30d)",
                children:
                  statusMix.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {})
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                        width: "100%",
                        height: 260,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, {
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, {
                              data: statusMix,
                              dataKey: "value",
                              nameKey: "name",
                              cx: "50%",
                              cy: "50%",
                              outerRadius: 90,
                              label: true,
                              children: statusMix.map((_, i) =>
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Cell,
                                  { fill: COLORS[i % COLORS.length] },
                                  i,
                                ),
                              ),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                          ],
                        }),
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Revenue collected — last 6 months",
                children:
                  revTrend.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {})
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                        width: "100%",
                        height: 260,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, {
                          data: revTrend,
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                              strokeDasharray: "3 3",
                              stroke: "hsl(var(--border))",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                              dataKey: "month",
                              tick: {
                                fontSize: 11,
                              },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                              tick: {
                                fontSize: 11,
                              },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                              dataKey: "collected",
                              fill: "hsl(var(--brand))",
                              radius: [4, 4, 0, 0],
                            }),
                          ],
                        }),
                      }),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Card, {
                title: "Class strength",
                children:
                  classRoll.length === 0
                    ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, {})
                    : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, {
                        width: "100%",
                        height: 260,
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, {
                          data: classRoll,
                          layout: "vertical",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, {
                              strokeDasharray: "3 3",
                              stroke: "hsl(var(--border))",
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, {
                              type: "number",
                              tick: {
                                fontSize: 11,
                              },
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {
                              dataKey: "name",
                              type: "category",
                              tick: {
                                fontSize: 11,
                              },
                              width: 100,
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, {
                              dataKey: "students",
                              fill: "#3b82f6",
                              radius: [0, 4, 4, 0],
                            }),
                          ],
                        }),
                      }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
function Kpi({ icon, label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex items-center gap-2 text-muted-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
            className: "text-xs uppercase tracking-wider",
            children: label,
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-2xl font-bold mt-2",
        children: value,
      }),
    ],
  });
}
function Card({ title, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
    className: "bg-card border border-border rounded-xl p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
        className: "font-semibold mb-3",
        children: title,
      }),
      children,
    ],
  });
}
function Empty() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
    className: "text-sm text-muted-foreground py-12 text-center",
    children: "Not enough data yet.",
  });
}
export { AnalyticsPage as component };
