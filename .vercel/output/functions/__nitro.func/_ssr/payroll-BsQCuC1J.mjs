import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import {
  e as exportToCSV,
  a as exportToExcel,
  b as exportToPDF,
} from "./export-helper-S9aO-V4l.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import {
  a2 as Play,
  a9 as Search,
  a3 as Plus,
  r as CircleCheck,
  at as Wallet,
  H as FileDown,
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
function PayrollPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("Payroll");
  const [tab, setTab] = reactExports.useState("overview");
  const [teachers, setTeachers] = reactExports.useState([]);
  const [salaries, setSalaries] = reactExports.useState([]);
  const [runs, setRuns] = reactExports.useState([]);
  const [items, setItems] = reactExports.useState([]);
  const [activeRun, setActiveRun] = reactExports.useState(null);
  const load = async () => {
    if (!effectiveSchoolId) return;
    const [{ data: rolesRows }, { data: sals }, { data: rs }] = await Promise.all([
      supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", effectiveSchoolId)
        .eq("role", "teacher"),
      supabase.from("teacher_salaries").select("*").eq("school_id", effectiveSchoolId),
      supabase
        .from("payroll_runs")
        .select("*")
        .eq("school_id", effectiveSchoolId)
        .order("created_at", {
          ascending: false,
        }),
    ]);
    const teacherIds = (rolesRows ?? []).map((r) => r.user_id);
    let profs = [];
    if (teacherIds.length) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", teacherIds);
      profs = data ?? [];
    }
    setTeachers(profs);
    setSalaries(sals ?? []);
    setRuns(rs ?? []);
    if ((rs ?? []).length && !activeRun) setActiveRun(rs[0].id);
  };
  reactExports.useEffect(() => {
    void load();
  }, [effectiveSchoolId]);
  reactExports.useEffect(() => {
    if (!activeRun) {
      setItems([]);
      return;
    }
    supabase
      .from("payroll_items")
      .select("*")
      .eq("payroll_run_id", activeRun)
      .eq("school_id", effectiveSchoolId)
      .then(({ data }) => setItems(data ?? []));
  }, [activeRun]);
  const totalMonthly = salaries.reduce(
    (s, x) => s + Number(x.base_salary) + Number(x.allowances) - Number(x.deductions),
    0,
  );
  const lastRun = runs[0];
  const lastRunItems = items.filter((i) => i.payroll_run_id === lastRun?.id);
  const lastRunTotal = lastRunItems.reduce((s, i) => s + Number(i.net_amount), 0);
  const lastRunPaid = lastRunItems
    .filter((i) => i.status === "paid")
    .reduce((s, i) => s + Number(i.net_amount), 0);
  if (!isAdmin)
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
      className: "p-8 text-sm text-muted-foreground bg-background text-foreground",
      children: "Admin only.",
    });
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
        title: "Payroll",
        breadcrumb: "Finance",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className: "flex bg-secondary rounded-md p-0.5 border border-border",
          children: ["overview", "salaries", "runs"].map((t) =>
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setTab(t),
                className: `px-3 py-1 text-xs font-semibold rounded capitalize transition cursor-pointer ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                children: t,
              },
              t,
            ),
          ),
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          tab === "overview" &&
            /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className: "grid grid-cols-1 md:grid-cols-4 gap-4",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, {
                      label: "Teachers",
                      value: teachers.length,
                      hint: "On payroll",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, {
                      label: "Salary profiles",
                      value: salaries.length,
                      hint: `${teachers.length - salaries.length} missing`,
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, {
                      label: "Monthly cost",
                      value: `₹${totalMonthly.toFixed(0)}`,
                      hint: "Net of deductions",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, {
                      label: "Last run paid",
                      value: `₹${lastRunPaid.toFixed(0)}`,
                      hint: lastRun
                        ? `of ₹${lastRunTotal.toFixed(0)} (${lastRun.period})`
                        : "No runs yet",
                    }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
                  className: "bg-card border border-border rounded-xl p-5 text-card-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                      className: "font-semibold mb-3",
                      children: "Quick actions",
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className: "flex flex-wrap gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => setTab("salaries"),
                          className:
                            "px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer",
                          children: "Configure salaries",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                          onClick: () => setTab("runs"),
                          className:
                            "px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "size-3" }),
                            " Process payroll",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          tab === "salaries" &&
            /* @__PURE__ */ jsxRuntimeExports.jsx(SalariesTab, {
              schoolId: effectiveSchoolId,
              reloadParent: load,
            }),
          tab === "runs" &&
            /* @__PURE__ */ jsxRuntimeExports.jsx(RunsTab, {
              schoolId: effectiveSchoolId,
              userId: user.id,
              teachers,
              salaries,
              runs,
              items,
              activeRun,
              setActiveRun,
              reload: load,
              reloadItems: () => {
                if (activeRun)
                  supabase
                    .from("payroll_items")
                    .select("*")
                    .eq("payroll_run_id", activeRun)
                    .eq("school_id", effectiveSchoolId)
                    .then(({ data }) => setItems(data ?? []));
              },
            }),
        ],
      }),
    ],
  });
}
function KPI({ label, value, hint }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
        className: "text-2xl font-bold mt-1",
        children: value,
      }),
      hint &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "text-xs text-muted-foreground mt-1",
          children: hint,
        }),
    ],
  });
}
function SalariesTab({ schoolId, reloadParent }) {
  const [editing, setEditing] = reactExports.useState(null);
  const [form, setForm] = reactExports.useState({
    base: "",
    allow: "",
    ded: "",
    bank: "",
    notes: "",
  });
  const [teachers, setTeachers] = reactExports.useState([]);
  const [salaries, setSalaries] = reactExports.useState([]);
  const [q, setQ] = reactExports.useState("");
  const [debouncedQ, setDebouncedQ] = reactExports.useState("");
  const [page, setPage] = reactExports.useState(0);
  const [pageSize] = reactExports.useState(10);
  const [totalCount, setTotalCount] = reactExports.useState(0);
  const [fetching, setFetching] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);
  const loadSalariesData = async () => {
    if (!schoolId) return;
    setFetching(true);
    try {
      const rolesRes = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", schoolId)
        .eq("role", "teacher");
      const teacherIds = (rolesRes.data ?? []).map((r) => r.user_id);
      let query = supabase
        .from("profiles")
        .select("user_id, full_name, email", {
          count: "exact",
        })
        .eq("school_id", schoolId)
        .in("user_id", teacherIds.length ? teacherIds : ["00000000-0000-0000-0000-000000000000"]);
      if (debouncedQ.trim()) {
        query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
      }
      const start = page * pageSize;
      const end = start + pageSize - 1;
      const { data: profs, count, error } = await query.order("full_name").range(start, end);
      if (error) throw error;
      setTeachers(profs ?? []);
      setTotalCount(count ?? 0);
      const pageTeacherIds = (profs ?? []).map((p) => p.user_id);
      if (pageTeacherIds.length > 0) {
        const { data: sals } = await supabase
          .from("teacher_salaries")
          .select("*")
          .eq("school_id", schoolId)
          .in("teacher_id", pageTeacherIds);
        setSalaries(sals ?? []);
      } else {
        setSalaries([]);
      }
    } catch (err) {
      toast.error(err.message || "Failed to load salaries.");
    } finally {
      setFetching(false);
    }
  };
  reactExports.useEffect(() => {
    void loadSalariesData();
  }, [schoolId, debouncedQ, page]);
  const netVal = () => {
    const b = Number(form.base || 0);
    const a = Number(form.allow || 0);
    const d = Number(form.ded || 0);
    return b + a - d;
  };
  const startEdit = (teacherId) => {
    const s = salaries.find((x) => x.teacher_id === teacherId);
    setForm({
      base: s?.base_salary?.toString() ?? "",
      allow: s?.allowances?.toString() ?? "",
      ded: s?.deductions?.toString() ?? "",
      bank: s?.bank_account ?? "",
      notes: s?.notes ?? "",
    });
    setEditing(teacherId);
  };
  const save = async (e) => {
    e.preventDefault();
    if (!editing) return;
    const existing = salaries.find((x) => x.teacher_id === editing);
    const payload = {
      school_id: schoolId,
      teacher_id: editing,
      base_salary: Number(form.base || 0),
      allowances: Number(form.allow || 0),
      deductions: Number(form.ded || 0),
      bank_account: form.bank || null,
      notes: form.notes || null,
    };
    const op = existing
      ? supabase
          .from("teacher_salaries")
          .update(payload)
          .eq("id", existing.id)
          .eq("school_id", schoolId)
      : supabase.from("teacher_salaries").insert(payload);
    const { error } = await op;
    if (error) return toast.error(error.message);
    toast.success("Salary saved");
    setEditing(null);
    await loadSalariesData();
    await reloadParent();
  };
  const handleExport = async (format) => {
    toast.loading("Preparing export...");
    try {
      const { data: rolesRows } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", schoolId)
        .eq("role", "teacher");
      const teacherIds = (rolesRows ?? []).map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("school_id", schoolId)
        .in("user_id", teacherIds.length ? teacherIds : ["00000000-0000-0000-0000-000000000000"])
        .order("full_name");
      if (!profiles || profiles.length === 0) {
        toast.dismiss();
        toast.error("No teachers to export.");
        return;
      }
      const { data: sals } = await supabase
        .from("teacher_salaries")
        .select("*")
        .eq("school_id", schoolId);
      const headers = [
        "Teacher Name",
        "Email",
        "Base Salary",
        "Allowances",
        "Deductions",
        "Net Salary",
        "Bank Account",
        "Notes",
      ];
      const rows = profiles.map((t) => {
        const s = (sals ?? []).find((x) => x.teacher_id === t.user_id);
        const net =
          Number(s?.base_salary ?? 0) + Number(s?.allowances ?? 0) - Number(s?.deductions ?? 0);
        return [
          t.full_name || "—",
          t.email || "—",
          s?.base_salary ?? 0,
          s?.allowances ?? 0,
          s?.deductions ?? 0,
          net,
          s?.bank_account || "—",
          s?.notes || "—",
        ];
      });
      toast.dismiss();
      const fn = "Teacher_Payroll_Profiles";
      if (format === "csv") exportToCSV(fn, headers, rows);
      else if (format === "excel") exportToExcel(fn, headers, rows);
      else if (format === "pdf") exportToPDF(fn, "Teacher Payroll Profiles", headers, rows);
      toast.success("Export started!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", {
    className:
      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground space-y-4 p-5",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                className: "font-semibold text-base text-foreground",
                children: "Teacher salary profiles",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-xs text-muted-foreground",
                children: "Set base salary, allowances and deductions per teacher.",
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "flex gap-2 items-center flex-wrap",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "relative w-44",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Search, {
                    className:
                      "size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    value: q,
                    onChange: (e) => setQ(e.target.value),
                    placeholder: "Search Teacher...",
                    className:
                      "w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("csv"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "CSV",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("excel"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground",
                    children: "XLS",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => handleExport("pdf"),
                    className:
                      "p-1 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground",
                    children: "PDF",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      fetching && teachers.length === 0
        ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
            className: "text-center py-12 text-sm text-muted-foreground",
            children: "Loading salary profiles...",
          })
        : teachers.length === 0
          ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "p-10 text-center text-sm text-muted-foreground",
              children: "No teachers found.",
            })
          : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "overflow-x-auto border border-border rounded-lg",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                className: "w-full text-left text-sm",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                    className:
                      "bg-secondary/40 text-xs text-muted-foreground border-b border-border",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-foreground",
                          children: "Teacher",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Base",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Allowances",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Deductions",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Net",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                          className: "px-6 py-3 font-medium text-right text-foreground",
                          children: "Action",
                        }),
                      ],
                    }),
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                    className: "divide-y divide-border",
                    children: teachers.map((t) => {
                      const s = salaries.find((x) => x.teacher_id === t.user_id);
                      const net = (
                        Number(s?.base_salary ?? 0) +
                        Number(s?.allowances ?? 0) -
                        Number(s?.deductions ?? 0)
                      ).toFixed(0);
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "tr",
                        {
                          className: "hover:bg-secondary/40",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-6 py-3",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "font-medium text-foreground",
                                  children: t.full_name || t.email,
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                  className: "text-xs text-muted-foreground",
                                  children: t.email,
                                }),
                              ],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-foreground",
                              children: ["₹", Number(s?.base_salary ?? 0).toFixed(0)],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-success",
                              children: ["+₹", Number(s?.allowances ?? 0).toFixed(0)],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className: "px-6 py-3 text-right font-mono text-danger",
                              children: ["-₹", Number(s?.deductions ?? 0).toFixed(0)],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                              className:
                                "px-6 py-3 text-right font-mono font-semibold text-foreground",
                              children: ["₹", net],
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                              className: "px-6 py-3 text-right",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                onClick: () => startEdit(t.user_id),
                                className:
                                  "text-xs font-semibold text-brand hover:underline cursor-pointer",
                                children: s ? "Edit" : "Set",
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
            }),
      totalCount > 0 &&
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className:
            "flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
              className: "text-xs text-muted-foreground",
              children: [
                "Showing ",
                page * pageSize + 1,
                " to ",
                Math.min((page + 1) * pageSize, totalCount),
                " of ",
                totalCount,
                " teachers",
              ],
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
              className: "flex gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  disabled: page === 0,
                  onClick: () => setPage((p) => p - 1),
                  className:
                    "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                  children: "Previous",
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                  disabled: (page + 1) * pageSize >= totalCount,
                  onClick: () => setPage((p) => p + 1),
                  className:
                    "px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary",
                  children: "Next",
                }),
              ],
            }),
          ],
        }),
      editing &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground",
          onClick: () => setEditing(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", {
            onClick: (e) => e.stopPropagation(),
            onSubmit: save,
            className:
              "bg-card rounded-xl p-6 w-full max-w-md space-y-3 shadow-lg text-card-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                className: "font-semibold text-lg text-foreground",
                children: teachers.find((t) => t.user_id === editing)?.full_name,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Money, {
                label: "Base salary",
                v: form.base,
                onChange: (v) =>
                  setForm((f) => ({
                    ...f,
                    base: v,
                  })),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Money, {
                label: "Allowances",
                v: form.allow,
                onChange: (v) =>
                  setForm((f) => ({
                    ...f,
                    allow: v,
                  })),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Money, {
                label: "Deductions",
                v: form.ded,
                onChange: (v) =>
                  setForm((f) => ({
                    ...f,
                    ded: v,
                  })),
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className:
                  "bg-secondary/60 border border-border rounded-md p-3 flex items-center justify-between text-foreground",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className:
                          "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
                        children: "Net salary (auto)",
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                        className: "text-[11px] text-muted-foreground",
                        children: "Base + Allowances − Deductions",
                      }),
                    ],
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                    className: "text-xl font-bold font-mono",
                    children: ["₹", netVal().toFixed(0)],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Bank account",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                    value: form.bank,
                    onChange: (e) =>
                      setForm({
                        ...form,
                        bank: e.target.value,
                      }),
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
                    className: "text-sm font-medium text-foreground",
                    children: "Notes",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", {
                    value: form.notes,
                    onChange: (e) =>
                      setForm({
                        ...form,
                        notes: e.target.value,
                      }),
                    rows: 2,
                    className:
                      "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex justify-end gap-2 pt-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "button",
                    onClick: () => setEditing(null),
                    className:
                      "px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer",
                    children: "Cancel",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    type: "submit",
                    className:
                      "px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer",
                    children: "Save",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
function Money({ label, v, onChange }) {
  const [raw, setRaw] = reactExports.useState(v);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    setRaw(v);
    setError(null);
  }, [v]);
  const handleChange = (e) => {
    const val = e.target.value;
    setRaw(val);
    if (val === "") {
      setError(null);
      onChange("");
      return;
    }
    const num = Number(val);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      return;
    }
    if (num < 0) {
      setError("Value cannot be negative");
      return;
    }
    setError(null);
    onChange(val);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("label", {
        className: "text-sm font-medium text-foreground",
        children: label,
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
        type: "text",
        inputMode: "numeric",
        value: raw,
        onChange: handleChange,
        className: `mt-1 w-full px-3 py-2 text-sm font-mono border rounded-md bg-background text-foreground focus:outline-none ${error ? "border-danger" : "border-border"}`,
      }),
      error &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
          className: "mt-1 text-xs text-danger",
          children: error,
        }),
    ],
  });
}
function RunsTab({
  schoolId,
  userId,
  teachers,
  salaries,
  runs,
  items,
  activeRun,
  setActiveRun,
  reload,
  reloadItems,
}) {
  const [period, setPeriod] = reactExports.useState(() =>
    /* @__PURE__ */ new Date().toISOString().slice(0, 7),
  );
  const [showSlip, setShowSlip] = reactExports.useState(null);
  const createRun = async () => {
    const eligible = salaries.filter((s) => Number(s.base_salary) > 0);
    if (eligible.length === 0) return toast.error("Set salaries first");
    const { data: run, error } = await supabase
      .from("payroll_runs")
      .insert({
        school_id: schoolId,
        period,
        status: "draft",
        created_by: userId,
      })
      .select()
      .single();
    if (error || !run) return toast.error(error?.message ?? "Failed");
    const rows = eligible.map((s) => ({
      payroll_run_id: run.id,
      school_id: schoolId,
      teacher_id: s.teacher_id,
      base_salary: s.base_salary,
      allowances: s.allowances,
      deductions: s.deductions,
      net_amount: Number(s.base_salary) + Number(s.allowances) - Number(s.deductions),
      status: "pending",
    }));
    await supabase.from("payroll_items").insert(rows);
    toast.success(`Run created for ${period} · ${rows.length} teachers`);
    await reload();
    setActiveRun(run.id);
  };
  const markPaid = async (itemId, method) => {
    const { error } = await supabase
      .from("payroll_items")
      .update({
        status: "paid",
        payment_method: method,
        paid_on: /* @__PURE__ */ new Date().toISOString().slice(0, 10),
      })
      .eq("id", itemId)
      .eq("school_id", schoolId);
    if (error) return toast.error(error.message);
    reloadItems();
  };
  const processRun = async (runId) => {
    await supabase
      .from("payroll_runs")
      .update({
        status: "processed",
        processed_at: /* @__PURE__ */ new Date().toISOString(),
      })
      .eq("id", runId)
      .eq("school_id", schoolId);
    toast.success("Run marked processed");
    await reload();
  };
  const activeItems = items;
  const activeRunRec = runs.find((r) => r.id === activeRun);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
    className: "grid grid-cols-1 lg:grid-cols-4 gap-6 text-card-foreground",
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", {
        className: "lg:col-span-1 space-y-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className: "bg-card border border-border rounded-xl p-4 space-y-3 text-card-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h4", {
                className: "font-semibold text-sm text-foreground",
                children: "New payroll run",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                type: "month",
                value: period,
                onChange: (e) => setPeriod(e.target.value),
                className:
                  "w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground",
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                onClick: createRun,
                className:
                  "w-full px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center gap-1 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
                  " Create run",
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl divide-y divide-border text-card-foreground",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className:
                  "p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
                children: "Past runs",
              }),
              runs.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "p-3 text-xs text-muted-foreground",
                    children: "None yet.",
                  })
                : runs.map((r) =>
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        onClick: () => setActiveRun(r.id),
                        className: `w-full text-left p-3 text-sm flex justify-between items-center hover:bg-secondary transition cursor-pointer text-foreground ${activeRun === r.id ? "bg-secondary" : ""}`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className: "font-medium text-foreground",
                                children: r.period,
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                className:
                                  "text-[10px] uppercase tracking-wider text-muted-foreground",
                                children: r.status,
                              }),
                            ],
                          }),
                          r.status === "processed"
                            ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                                className: "size-4 text-success",
                              })
                            : /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, {
                                className: "size-4 text-muted-foreground",
                              }),
                        ],
                      },
                      r.id,
                    ),
                  ),
            ],
          }),
        ],
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", {
        className:
          "lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden text-card-foreground",
        children: !activeRunRec
          ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
              className: "p-10 text-center text-sm text-muted-foreground",
              children: "Select or create a payroll run.",
            })
          : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                  className:
                    "p-4 border-b border-border flex justify-between items-center bg-secondary/10 text-foreground",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", {
                          className: "font-semibold text-foreground",
                          children: activeRunRec.period,
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                          className: "text-xs text-muted-foreground",
                          children: [
                            activeItems.length,
                            " teachers · ",
                            activeItems.filter((i) => i.status === "paid").length,
                            " paid",
                          ],
                        }),
                      ],
                    }),
                    activeRunRec.status !== "processed" &&
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                        onClick: () => processRun(activeRunRec.id),
                        className:
                          "px-3 py-1.5 text-xs bg-success text-white rounded-md inline-flex items-center gap-1 cursor-pointer",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, {
                            className: "size-3",
                          }),
                          " Mark run processed",
                        ],
                      }),
                  ],
                }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                  className: "w-full text-left text-sm",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                      className:
                        "bg-secondary/40 text-xs text-muted-foreground border-b border-border",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                            className: "px-6 py-3 font-medium text-foreground",
                            children: "Teacher",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                            className: "px-6 py-3 font-medium text-right text-foreground",
                            children: "Net",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                            className: "px-6 py-3 font-medium text-foreground",
                            children: "Status",
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                            className: "px-6 py-3 font-medium text-right text-foreground",
                            children: "Action",
                          }),
                        ],
                      }),
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                      className: "divide-y divide-border",
                      children: activeItems.map((i) => {
                        const t = teachers.find((x) => x.user_id === i.teacher_id);
                        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "tr",
                          {
                            className: "hover:bg-secondary/10",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                className: "px-6 py-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                                    className: "font-medium text-foreground",
                                    children: t?.full_name ?? "Teacher",
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: [
                                      "Base ₹",
                                      Number(i.base_salary).toFixed(0),
                                      " +₹",
                                      Number(i.allowances).toFixed(0),
                                      " -₹",
                                      Number(i.deductions).toFixed(0),
                                    ],
                                  }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                className:
                                  "px-6 py-3 text-right font-mono font-semibold text-foreground",
                                children: ["₹", Number(i.net_amount).toFixed(0)],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                className: "px-6 py-3",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                    className: `text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${i.status === "paid" ? "bg-success-soft text-success" : "bg-warning-soft text-warning"}`,
                                    children: i.status,
                                  }),
                                  i.paid_on &&
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                      className: "ml-2 text-[10px] text-muted-foreground",
                                      children: [i.paid_on, " · ", i.payment_method],
                                    }),
                                ],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                className: "px-6 py-3 text-right",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                  className: "flex justify-end gap-2",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", {
                                      onClick: () => setShowSlip(i),
                                      className:
                                        "text-xs font-semibold text-brand inline-flex items-center gap-1 hover:underline cursor-pointer",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx(FileDown, {
                                          className: "size-3",
                                        }),
                                        " Slip",
                                      ],
                                    }),
                                    i.status !== "paid" &&
                                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                        jsxRuntimeExports.Fragment,
                                        {
                                          children: [
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                              onClick: () => markPaid(i.id, "bank"),
                                              className:
                                                "text-xs px-2 py-1 bg-primary text-primary-foreground rounded cursor-pointer",
                                              children: "Pay (Bank)",
                                            }),
                                            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                                              onClick: () => markPaid(i.id, "cash"),
                                              className:
                                                "text-xs px-2 py-1 border border-border rounded cursor-pointer text-foreground",
                                              children: "Cash",
                                            }),
                                          ],
                                        },
                                      ),
                                  ],
                                }),
                              }),
                            ],
                          },
                          i.id,
                        );
                      }),
                    }),
                  ],
                }),
              ],
            }),
      }),
      showSlip &&
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
          className:
            "fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 print:bg-white",
          onClick: () => setShowSlip(null),
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            onClick: (e) => e.stopPropagation(),
            className:
              "bg-white text-black rounded-xl p-8 w-full max-w-md shadow-lg print:shadow-none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "text-center border-b border-gray-300 pb-3 mb-3",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", {
                    className: "font-bold text-lg text-black",
                    children: "SALARY SLIP",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                    className: "text-xs text-gray-600",
                    children: activeRunRec?.period,
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "font-semibold text-black",
                children: teachers.find((t) => t.user_id === showSlip.teacher_id)?.full_name,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", {
                className: "text-xs text-gray-600 mb-3",
                children: teachers.find((t) => t.user_id === showSlip.teacher_id)?.email,
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("table", {
                className: "w-full text-sm text-black",
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", {
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          className: "py-1",
                          children: "Base salary",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                          className: "text-right font-mono",
                          children: ["₹", Number(showSlip.base_salary).toFixed(2)],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          className: "py-1",
                          children: "Allowances",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                          className: "text-right font-mono text-green-700",
                          children: ["+₹", Number(showSlip.allowances).toFixed(2)],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          className: "py-1",
                          children: "Deductions",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                          className: "text-right font-mono text-red-700",
                          children: ["-₹", Number(showSlip.deductions).toFixed(2)],
                        }),
                      ],
                    }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                      className: "border-t border-gray-300 font-bold",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                          className: "py-2",
                          children: "Net pay",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                          className: "text-right font-mono",
                          children: ["₹", Number(showSlip.net_amount).toFixed(2)],
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              showSlip.status === "paid" &&
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", {
                  className: "text-xs text-center text-green-700 mt-3",
                  children: ["PAID on ", showSlip.paid_on, " via ", showSlip.payment_method],
                }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex gap-2 mt-4 print:hidden",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => window.print(),
                    className:
                      "flex-1 px-3 py-2 text-sm border border-gray-300 rounded text-black bg-white cursor-pointer",
                    children: "Print",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setShowSlip(null),
                    className:
                      "flex-1 px-3 py-2 text-sm bg-black text-white rounded cursor-pointer",
                    children: "Close",
                  }),
                ],
              }),
            ],
          }),
        }),
    ],
  });
}
export { PayrollPage as component };
