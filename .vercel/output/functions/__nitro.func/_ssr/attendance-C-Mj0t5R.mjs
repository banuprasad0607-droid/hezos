import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-mniyZlvf.mjs";
import { f as useTenant, c as usePageTitle, P as PageHeader } from "./router-CplsJ0Ue.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { W as WhatsAppBroadcast } from "./WhatsAppBroadcast-C6eIuXsa.mjs";
import {
  e as exportToCSV,
  a as exportToExcel,
  b as exportToPDF,
} from "./export-helper-S9aO-V4l.mjs";
import { w as whatsappService } from "./whatsapp-service-rc8qIpIC.mjs";
import "../_libs/qrcode.mjs";
import "../_libs/jsbarcode.mjs";
import "../_libs/html2canvas.mjs";
import "../_libs/jspdf.mjs";
import { a9 as Search } from "../_libs/lucide-react.mjs";
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
import "./notify-BwRXED2l.mjs";
const STATUSES = [
  {
    value: "present",
    label: "Present",
    color: "bg-success-soft text-success ring-1 ring-success/20",
  },
  {
    value: "absent",
    label: "Absent",
    color: "bg-danger-soft text-danger ring-1 ring-danger/20",
  },
  {
    value: "late",
    label: "Late",
    color: "bg-warning-soft text-warning ring-1 ring-warning/20",
  },
  {
    value: "half_day",
    label: "Half",
    color: "bg-brand-soft text-brand ring-1 ring-brand/20",
  },
];
function AttendancePage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  usePageTitle("Attendance");
  const [activeTab, setActiveTab] = reactExports.useState("daily");
  const [classes, setClasses] = reactExports.useState([]);
  const [classId, setClassId] = reactExports.useState("");
  const [date, setDate] = reactExports.useState(() =>
    /* @__PURE__ */ new Date().toISOString().slice(0, 10),
  );
  const [students, setStudents] = reactExports.useState([]);
  const [marks, setMarks] = reactExports.useState({});
  const [selectedMonth, setSelectedMonth] = reactExports.useState(() =>
    /* @__PURE__ */ new Date().toISOString().slice(0, 7),
  );
  const [studentMatrixData, setStudentMatrixData] = reactExports.useState({});
  const [teachersList, setTeachersList] = reactExports.useState([]);
  const [teacherDailyDate, setTeacherDailyDate] = reactExports.useState(() =>
    /* @__PURE__ */ new Date().toISOString().slice(0, 10),
  );
  const [teacherDailyMarks, setTeacherDailyMarks] = reactExports.useState({});
  const [teacherMatrixData, setTeacherMatrixData] = reactExports.useState({});
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
  reactExports.useEffect(() => {
    setQ("");
    setDebouncedQ("");
    setPage(0);
    setTotalCount(0);
    setStudents([]);
    setTeachersList([]);
  }, [activeTab, classId]);
  const { year, month, daysInMonth, daysArray } = reactExports.useMemo(() => {
    const [yStr, mStr] = selectedMonth.split("-");
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10) - 1;
    const days = new Date(y, m + 1, 0).getDate();
    return {
      year: y,
      month: m,
      daysInMonth: days,
      daysArray: Array.from(
        {
          length: days,
        },
        (_, idx) => idx + 1,
      ),
    };
  }, [selectedMonth]);
  reactExports.useEffect(() => {
    if (!effectiveSchoolId) return;
    supabase
      .from("classes")
      .select("id, name")
      .eq("school_id", effectiveSchoolId)
      .is("deleted_at", null)
      .order("name")
      .then(({ data }) => {
        setClasses(data ?? []);
        if (data?.[0] && !classId) setClassId(data[0].id);
      });
  }, [effectiveSchoolId]);
  reactExports.useEffect(() => {
    if (!classId || activeTab !== "daily") return;
    (async () => {
      setFetching(true);
      try {
        let query = supabase
          .from("students")
          .select("id, full_name, roll_number, parent_name, parent_phone", {
            count: "exact",
          })
          .eq("class_id", classId)
          .is("deleted_at", null);
        if (debouncedQ.trim()) {
          query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
        }
        const start = page * pageSize;
        const end = start + pageSize - 1;
        const { data: studs, count, error } = await query.order("full_name").range(start, end);
        if (error) throw error;
        setStudents(studs ?? []);
        setTotalCount(count ?? 0);
        const studentIds = (studs ?? []).map((s) => s.id);
        if (studentIds.length > 0) {
          const { data: att, error: attError } = await supabase
            .from("attendance")
            .select("student_id, status")
            .eq("class_id", classId)
            .eq("date", date)
            .is("deleted_at", null)
            .in("student_id", studentIds);
          if (attError) throw attError;
          const m = {};
          (att ?? []).forEach((r) => {
            m[r.student_id] = r.status;
          });
          setMarks(m);
        } else {
          setMarks({});
        }
      } catch (err) {
        toast.error(err.message || "Failed to load daily attendance.");
      } finally {
        setFetching(false);
      }
    })();
  }, [classId, date, activeTab, debouncedQ, page]);
  reactExports.useEffect(() => {
    if (!classId || activeTab !== "student-matrix" || !selectedMonth) return;
    (async () => {
      setFetching(true);
      try {
        let query = supabase
          .from("students")
          .select("id, full_name, roll_number, parent_name, parent_phone", {
            count: "exact",
          })
          .eq("class_id", classId)
          .is("deleted_at", null);
        if (debouncedQ.trim()) {
          query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
        }
        const start = page * pageSize;
        const end = start + pageSize - 1;
        const { data: studs, count, error } = await query.order("full_name").range(start, end);
        if (error) throw error;
        setStudents(studs ?? []);
        setTotalCount(count ?? 0);
        const studentIds = (studs ?? []).map((s) => s.id);
        if (studentIds.length > 0) {
          const startDate = `${selectedMonth}-01`;
          const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, "0")}`;
          const { data: att, error: attError } = await supabase
            .from("attendance")
            .select("student_id, date, status")
            .eq("class_id", classId)
            .is("deleted_at", null)
            .in("student_id", studentIds)
            .gte("date", startDate)
            .lte("date", endDate);
          if (attError) throw attError;
          const map = {};
          (att ?? []).forEach((row) => {
            const dNum = parseInt(row.date.split("-")[2], 10);
            if (!map[row.student_id]) map[row.student_id] = {};
            map[row.student_id][dNum] = row.status;
          });
          setStudentMatrixData(map);
        } else {
          setStudentMatrixData({});
        }
      } catch (err) {
        toast.error(err.message || "Failed to load student matrix.");
      } finally {
        setFetching(false);
      }
    })();
  }, [classId, selectedMonth, activeTab, daysInMonth, debouncedQ, page]);
  reactExports.useEffect(() => {
    if (!effectiveSchoolId || (activeTab !== "teacher-daily" && activeTab !== "teacher-matrix"))
      return;
    (async () => {
      setFetching(true);
      try {
        const rolesRes = await supabase
          .from("user_roles")
          .select("user_id, role")
          .eq("school_id", effectiveSchoolId);
        const staffIds = (rolesRes.data || [])
          .filter((r) => r.role === "admin" || r.role === "teacher")
          .map((r) => r.user_id);
        let query = supabase
          .from("profiles")
          .select("user_id, full_name, employee_id", {
            count: "exact",
          })
          .eq("school_id", effectiveSchoolId)
          .in("user_id", staffIds.length ? staffIds : ["00000000-0000-0000-0000-000000000000"]);
        if (debouncedQ.trim()) {
          query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
        }
        const start = page * pageSize;
        const end = start + pageSize - 1;
        const {
          data: profilesRes,
          count,
          error,
        } = await query.order("full_name").range(start, end);
        if (error) throw error;
        setTeachersList(profilesRes ?? []);
        setTotalCount(count ?? 0);
        const staffIdsOnPage = (profilesRes ?? []).map((p) => p.user_id);
        if (staffIdsOnPage.length > 0) {
          if (activeTab === "teacher-daily") {
            const { data, error: attError } = await supabase
              .from("teacher_attendance")
              .select("teacher_id, status")
              .eq("school_id", effectiveSchoolId)
              .eq("date", teacherDailyDate)
              .is("deleted_at", null)
              .in("teacher_id", staffIdsOnPage);
            if (attError) throw attError;
            const map = {};
            (data || []).forEach((row) => {
              map[row.teacher_id] = row.status;
            });
            setTeacherDailyMarks(map);
          } else {
            const startDate = `${selectedMonth}-01`;
            const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, "0")}`;
            const { data, error: attError } = await supabase
              .from("teacher_attendance")
              .select("teacher_id, date, status")
              .eq("school_id", effectiveSchoolId)
              .is("deleted_at", null)
              .in("teacher_id", staffIdsOnPage)
              .gte("date", startDate)
              .lte("date", endDate);
            if (attError) throw attError;
            const map = {};
            (data || []).forEach((row) => {
              const dNum = parseInt(row.date.split("-")[2], 10);
              if (!map[row.teacher_id]) map[row.teacher_id] = {};
              map[row.teacher_id][dNum] = row.status;
            });
            setTeacherMatrixData(map);
          }
        } else {
          setTeacherDailyMarks({});
          setTeacherMatrixData({});
        }
      } catch (err) {
        toast.error(err.message || "Failed to load staff list.");
      } finally {
        setFetching(false);
      }
    })();
  }, [
    effectiveSchoolId,
    teacherDailyDate,
    selectedMonth,
    activeTab,
    daysInMonth,
    debouncedQ,
    page,
  ]);
  const mark = async (studentId, status) => {
    if (!effectiveSchoolId || !user || !classId) return;
    setMarks((m) => ({
      ...m,
      [studentId]: status,
    }));
    const { error } = await supabase.from("attendance").upsert(
      {
        school_id: effectiveSchoolId,
        class_id: classId,
        student_id: studentId,
        date,
        status,
        marked_by: user.id,
      },
      {
        onConflict: "student_id,date",
      },
    );
    if (error) {
      toast.error(error.message);
    } else if (status === "absent") {
      void (async () => {
        try {
          const { data: stud } = await supabase
            .from("students")
            .select("full_name, parent_user_id, emergency_contact")
            .eq("id", studentId)
            .single();
          if (stud) {
            const templates = await whatsappService.getTemplates(effectiveSchoolId);
            const template = templates.find((t) => t.name === "absent_alert");
            if (template) {
              const phone = stud.emergency_contact || "+91 90000 00000";
              await whatsappService.sendTemplateMessage(
                effectiveSchoolId,
                phone,
                template.id,
                [stud.full_name],
                studentId,
                stud.parent_user_id,
              );
              toast.success(`WhatsApp absent alert triggered for ${stud.full_name}.`);
            }
          }
        } catch (err) {
          console.error("WhatsApp absent alert trigger failed:", err);
        }
      })();
    }
  };
  const markTeacher = async (teacherId, status) => {
    if (!effectiveSchoolId || !user) return;
    setTeacherDailyMarks((prev) => ({
      ...prev,
      [teacherId]: status,
    }));
    const { error } = await supabase.from("teacher_attendance").upsert(
      {
        school_id: effectiveSchoolId,
        teacher_id: teacherId,
        date: teacherDailyDate,
        status,
        marked_by: user.id,
      },
      {
        onConflict: "teacher_id,date",
      },
    );
    if (error) toast.error(error.message);
  };
  const className = classes.find((c) => c.id === classId)?.name ?? "Class";
  const handleExportStudentMatrix = async (format) => {
    if (!classId || !effectiveSchoolId) return;
    toast.loading("Preparing export...");
    try {
      const { data: studs } = await supabase
        .from("students")
        .select("id, full_name, roll_number")
        .eq("class_id", classId)
        .is("deleted_at", null)
        .order("full_name");
      if (!studs || studs.length === 0) {
        toast.dismiss();
        toast.error("No students to export.");
        return;
      }
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, "0")}`;
      const { data: att } = await supabase
        .from("attendance")
        .select("student_id, date, status")
        .eq("class_id", classId)
        .is("deleted_at", null)
        .gte("date", startDate)
        .lte("date", endDate);
      const map = {};
      (att ?? []).forEach((row) => {
        const dNum = parseInt(row.date.split("-")[2], 10);
        if (!map[row.student_id]) map[row.student_id] = {};
        map[row.student_id][dNum] = row.status;
      });
      const headers = [
        "Student Name",
        "Roll Number",
        ...daysArray.map((d) => `Day ${d}`),
        "Present Days",
        "Total Marked",
        "Attendance Rate %",
      ];
      const rows = studs.map((s) => {
        const daysMarks = map[s.id] || {};
        let presentCount = 0;
        let totalCount2 = 0;
        const daysCols = daysArray.map((d) => {
          const status = daysMarks[d];
          if (status) {
            totalCount2++;
            if (status === "present" || status === "late" || status === "half_day") {
              presentCount += status === "half_day" ? 0.5 : 1;
            }
            return status.toUpperCase();
          }
          return "—";
        });
        const rate = totalCount2 > 0 ? `${Math.round((presentCount / totalCount2) * 100)}%` : "—";
        return [s.full_name, s.roll_number || "—", ...daysCols, presentCount, totalCount2, rate];
      });
      toast.dismiss();
      const fn = `Student_Attendance_Matrix_${className}_${selectedMonth}`;
      if (format === "csv") exportToCSV(fn, headers, rows);
      else if (format === "excel") exportToExcel(fn, headers, rows);
      else if (format === "pdf")
        exportToPDF(
          fn,
          `Student Attendance Matrix - ${className} (${selectedMonth})`,
          headers,
          rows,
        );
      toast.success("Export started!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };
  const handleExportTeacherMatrix = async (format) => {
    if (!effectiveSchoolId) return;
    toast.loading("Preparing export...");
    try {
      const rolesRes = await supabase
        .from("user_roles")
        .select("user_id, role")
        .eq("school_id", effectiveSchoolId);
      const staffIds = (rolesRes.data || [])
        .filter((r) => r.role === "admin" || r.role === "teacher")
        .map((r) => r.user_id);
      const { data: profilesRes } = await supabase
        .from("profiles")
        .select("user_id, full_name, employee_id")
        .eq("school_id", effectiveSchoolId)
        .in("user_id", staffIds.length ? staffIds : ["00000000-0000-0000-0000-000000000000"])
        .order("full_name");
      if (!profilesRes || profilesRes.length === 0) {
        toast.dismiss();
        toast.error("No staff to export.");
        return;
      }
      const startDate = `${selectedMonth}-01`;
      const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, "0")}`;
      const { data } = await supabase
        .from("teacher_attendance")
        .select("teacher_id, date, status")
        .eq("school_id", effectiveSchoolId)
        .gte("date", startDate)
        .lte("date", endDate);
      const map = {};
      (data || []).forEach((row) => {
        const dNum = parseInt(row.date.split("-")[2], 10);
        if (!map[row.teacher_id]) map[row.teacher_id] = {};
        map[row.teacher_id][dNum] = row.status;
      });
      const headers = [
        "Staff Name",
        "Employee ID",
        ...daysArray.map((d) => `Day ${d}`),
        "Present Days",
        "Total Marked",
        "Attendance Rate %",
      ];
      const rows = profilesRes.map((t) => {
        const daysMarks = map[t.user_id] || {};
        let presentCount = 0;
        let totalCount2 = 0;
        const daysCols = daysArray.map((d) => {
          const status = daysMarks[d];
          if (status) {
            totalCount2++;
            if (status === "present" || status === "late" || status === "half_day") {
              presentCount += status === "half_day" ? 0.5 : 1;
            }
            return status.toUpperCase();
          }
          return "—";
        });
        const rate = totalCount2 > 0 ? `${Math.round((presentCount / totalCount2) * 100)}%` : "—";
        return [t.full_name, t.employee_id || "—", ...daysCols, presentCount, totalCount2, rate];
      });
      toast.dismiss();
      const fn = `Staff_Attendance_Matrix_${selectedMonth}`;
      if (format === "csv") exportToCSV(fn, headers, rows);
      else if (format === "excel") exportToExcel(fn, headers, rows);
      else if (format === "pdf")
        exportToPDF(fn, `Staff Attendance Matrix (${selectedMonth})`, headers, rows);
      toast.success("Export started!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };
  const counts = reactExports.useMemo(() => {
    const c = {
      present: 0,
      absent: 0,
      late: 0,
      half_day: 0,
    };
    Object.values(marks).forEach((s) => {
      c[s] += 1;
    });
    return c;
  }, [marks]);
  const teacherCounts = reactExports.useMemo(() => {
    const c = {
      present: 0,
      absent: 0,
      late: 0,
      half_day: 0,
    };
    Object.values(teacherDailyMarks).forEach((s) => {
      c[s] += 1;
    });
    return c;
  }, [teacherDailyMarks]);
  const absentRecipients = students
    .filter((s) => marks[s.id] === "absent" || marks[s.id] === "late")
    .map((s) => ({
      id: s.id,
      name: s.parent_name || `${s.full_name}'s parent`,
      phone: s.parent_phone,
      subtitle: `${s.full_name} · ${marks[s.id] === "late" ? "Late" : "Absent"}`,
    }));
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
        title: "Attendance Center",
        breadcrumb: "Operations & Ledgers",
        actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
          className: "flex bg-secondary rounded-md p-0.5 border border-border",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => setActiveTab("daily"),
              className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${activeTab === "daily" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
              children: "Daily Student",
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
              onClick: () => setActiveTab("student-matrix"),
              className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${activeTab === "student-matrix" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
              children: "Student Matrix",
            }),
            isAdmin &&
              /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setActiveTab("teacher-daily"),
                    className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${activeTab === "teacher-daily" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                    children: "Daily Staff",
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                    onClick: () => setActiveTab("teacher-matrix"),
                    className: `px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${activeTab === "teacher-matrix" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`,
                    children: "Staff Matrix",
                  }),
                ],
              }),
          ],
        }),
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
        className: "flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
            className:
              "bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex flex-wrap items-center gap-3",
                children: [
                  activeTab === "daily" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          type: "date",
                          value: date,
                          onChange: (e) => setDate(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                          value: classId,
                          onChange: (e) => setClassId(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                          children: classes.map((c) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: c.id, children: c.name },
                              c.id,
                            ),
                          ),
                        }),
                      ],
                    }),
                  activeTab === "student-matrix" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, {
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                          type: "month",
                          value: selectedMonth,
                          onChange: (e) => setSelectedMonth(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("select", {
                          value: classId,
                          onChange: (e) => setClassId(e.target.value),
                          className:
                            "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                          children: classes.map((c) =>
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "option",
                              { value: c.id, children: c.name },
                              c.id,
                            ),
                          ),
                        }),
                      ],
                    }),
                  activeTab === "teacher-daily" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "date",
                      value: teacherDailyDate,
                      onChange: (e) => setTeacherDailyDate(e.target.value),
                      className:
                        "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                    }),
                  activeTab === "teacher-matrix" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", {
                      type: "month",
                      value: selectedMonth,
                      onChange: (e) => setSelectedMonth(e.target.value),
                      className:
                        "px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground",
                    }),
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
                        placeholder: "Search...",
                        className:
                          "w-full pl-8 pr-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-brand",
                      }),
                    ],
                  }),
                ],
              }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                className: "flex items-center gap-2",
                children: [
                  activeTab === "daily" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsx(WhatsAppBroadcast, {
                      label: `Notify absentees (${absentRecipients.length})`,
                      recipients: absentRecipients,
                      defaultMessage: `Hello, your child was marked absent in ${className} on ${date}. Please reach out if this is unexpected.

— ${className} Teacher`,
                      buildMessage: (
                        r,
                      ) => `Hello, ${r.subtitle?.split(" · ")[0] ?? "your child"} was marked ${r.subtitle?.includes("Late") ? "late" : "absent"} in ${className} on ${date}. Please reach out if this is unexpected.

— ${className} Teacher`,
                    }),
                  activeTab === "student-matrix" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportStudentMatrix("csv"),
                          className:
                            "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                          children: "CSV",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportStudentMatrix("excel"),
                          className:
                            "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                          children: "XLS",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportStudentMatrix("pdf"),
                          className:
                            "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer",
                          children: "PDF",
                        }),
                      ],
                    }),
                  activeTab === "teacher-matrix" &&
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                      className:
                        "flex gap-1 border border-border rounded-md overflow-hidden bg-background",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportTeacherMatrix("csv"),
                          className:
                            "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                          children: "CSV",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportTeacherMatrix("excel"),
                          className:
                            "p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer",
                          children: "XLS",
                        }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("button", {
                          onClick: () => handleExportTeacherMatrix("pdf"),
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
          fetching && students.length === 0 && teachersList.length === 0
            ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                className: "text-center py-12 text-sm text-muted-foreground",
                children: "Loading attendance logs...",
              })
            : activeTab === "daily" &&
              (classes.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                    children: "Create a class first to mark attendance.",
                  })
                : students.length === 0
                  ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                      children: "No students found.",
                    })
                  : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "space-y-4",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className:
                              "p-4 border-b border-border flex items-center justify-between bg-secondary/10",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                                className: "font-semibold text-xs",
                                children: [totalCount, " students total"],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                                className: "flex gap-2 text-xs",
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-success-soft text-success rounded font-semibold",
                                    children: ["P: ", counts.present],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-danger-soft text-danger rounded font-semibold",
                                    children: ["A: ", counts.absent],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-warning-soft text-warning rounded font-semibold",
                                    children: ["L: ", counts.late],
                                  }),
                                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                    className:
                                      "px-2 py-1 bg-brand-soft text-brand rounded font-semibold",
                                    children: ["H: ", counts.half_day],
                                  }),
                                ],
                              }),
                            ],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                            className: "w-full text-left text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                                className:
                                  "bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                      className: "px-6 py-3 font-medium",
                                      children: "Student",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                      className: "px-6 py-3 font-medium",
                                      children: "Roll",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                      className: "px-6 py-3 font-medium text-right",
                                      children: "Mark Status",
                                    }),
                                  ],
                                }),
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                                className: "divide-y divide-border",
                                children: students.map((s) => {
                                  const current = marks[s.id];
                                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                    "tr",
                                    {
                                      className: "hover:bg-secondary/10",
                                      children: [
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                          className: "px-6 py-3.5 font-bold text-foreground",
                                          children: s.full_name,
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", {
                                          className: "px-6 py-3.5 text-muted-foreground",
                                          children: ["#", s.roll_number ?? "—"],
                                        }),
                                        /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                          className: "px-6 py-3.5",
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                            className: "flex gap-1.5 justify-end",
                                            children: STATUSES.map((st) =>
                                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                                "button",
                                                {
                                                  onClick: () => mark(s.id, st.value),
                                                  className: `px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${current === st.value ? st.color : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"}`,
                                                  children: st.label,
                                                },
                                                st.value,
                                              ),
                                            ),
                                          }),
                                        }),
                                      ],
                                    },
                                    s.id,
                                  );
                                }),
                              }),
                            ],
                          }),
                        ],
                      }),
                    })),
          activeTab === "student-matrix" &&
            (classes.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                  children: "Create a class first to view attendance ledger.",
                })
              : students.length === 0
                ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                    children: "No students found to display matrix.",
                  })
                : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className: "space-y-4",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className:
                        "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                        className: "overflow-x-auto",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                          className: "w-full text-left text-xs border-collapse",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                              className:
                                "bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                                children: [
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                    className:
                                      "px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground",
                                    children: "Student Name",
                                  }),
                                  daysArray.map((d) =>
                                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                                      "th",
                                      {
                                        className:
                                          "px-1 py-3 text-center font-bold min-w-[28px] text-foreground",
                                        children: d,
                                      },
                                      d,
                                    ),
                                  ),
                                  /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                    className:
                                      "px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground",
                                    children: "Rate %",
                                  }),
                                ],
                              }),
                            }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                              className: "divide-y divide-border",
                              children: students.map((s) => {
                                const daysMarks = studentMatrixData[s.id] || {};
                                let presentCount = 0;
                                let totalCount2 = 0;
                                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "tr",
                                  {
                                    className: "hover:bg-secondary/15",
                                    children: [
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className:
                                          "px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground",
                                        children: s.full_name,
                                      }),
                                      daysArray.map((d) => {
                                        const status = daysMarks[d];
                                        let displayVal = "—";
                                        let colorClass = "text-slate-300 dark:text-slate-700";
                                        if (status) {
                                          totalCount2++;
                                          if (
                                            status === "present" ||
                                            status === "late" ||
                                            status === "half_day"
                                          ) {
                                            presentCount += status === "half_day" ? 0.5 : 1;
                                          }
                                          displayVal =
                                            status === "present"
                                              ? "P"
                                              : status === "absent"
                                                ? "A"
                                                : status === "late"
                                                  ? "L"
                                                  : "H";
                                          colorClass =
                                            status === "present"
                                              ? "bg-emerald-500/10 text-emerald-600 font-extrabold rounded"
                                              : status === "absent"
                                                ? "bg-red-500/10 text-red-600 font-extrabold rounded"
                                                : status === "late"
                                                  ? "bg-amber-500/10 text-amber-600 font-extrabold rounded"
                                                  : "bg-indigo-500/10 text-indigo-600 font-extrabold rounded";
                                        }
                                        return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                          "td",
                                          {
                                            className: "px-0.5 py-2.5 text-center min-w-[28px]",
                                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                              "span",
                                              {
                                                className: `inline-block size-5 text-center leading-5 text-[10px] ${colorClass}`,
                                                children: displayVal,
                                              },
                                            ),
                                          },
                                          d,
                                        );
                                      }),
                                      /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                        className:
                                          "px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border",
                                        children:
                                          totalCount2 > 0
                                            ? `${Math.round((presentCount / totalCount2) * 100)}%`
                                            : "—",
                                      }),
                                    ],
                                  },
                                  s.id,
                                );
                              }),
                            }),
                          ],
                        }),
                      }),
                    }),
                  })),
          activeTab === "teacher-daily" &&
            isAdmin &&
            (teachersList.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                  children: "No staff members found.",
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "space-y-4",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                    className:
                      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                        className:
                          "p-4 border-b border-border flex items-center justify-between bg-secondary/10",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", {
                            className: "font-semibold text-xs",
                            children: [totalCount, " staff members total"],
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", {
                            className: "flex gap-2 text-xs",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "px-2 py-1 bg-success-soft text-success rounded font-semibold",
                                children: ["P: ", teacherCounts.present],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "px-2 py-1 bg-danger-soft text-danger rounded font-semibold",
                                children: ["A: ", teacherCounts.absent],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "px-2 py-1 bg-warning-soft text-warning rounded font-semibold",
                                children: ["L: ", teacherCounts.late],
                              }),
                              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", {
                                className:
                                  "px-2 py-1 bg-brand-soft text-brand rounded font-semibold",
                                children: ["H: ", teacherCounts.half_day],
                              }),
                            ],
                          }),
                        ],
                      }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                        className: "w-full text-left text-xs",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                            className:
                              "bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Staff Member",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-3 font-medium",
                                  children: "Employee ID",
                                }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className: "px-6 py-3 font-medium text-right",
                                  children: "Mark Status",
                                }),
                              ],
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                            className: "divide-y divide-border",
                            children: teachersList.map((t) => {
                              const current = teacherDailyMarks[t.user_id];
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "tr",
                                {
                                  className: "hover:bg-secondary/10",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-6 py-3.5 font-bold text-foreground",
                                      children: t.full_name,
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className:
                                        "px-6 py-3.5 text-muted-foreground font-mono text-[10px]",
                                      children: t.employee_id || "—",
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className: "px-6 py-3.5",
                                      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                                        className: "flex gap-1.5 justify-end",
                                        children: STATUSES.map((st) =>
                                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                                            "button",
                                            {
                                              onClick: () => markTeacher(t.user_id, st.value),
                                              className: `px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${current === st.value ? st.color : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"}`,
                                              children: st.label,
                                            },
                                            st.value,
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
          activeTab === "teacher-matrix" &&
            isAdmin &&
            (teachersList.length === 0
              ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className:
                    "bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground",
                  children: "No staff members found.",
                })
              : /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                  className: "space-y-4",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                    className:
                      "bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", {
                      className: "overflow-x-auto",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", {
                        className: "w-full text-left text-xs border-collapse",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", {
                            className:
                              "bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold",
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", {
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className:
                                    "px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground",
                                  children: "Staff Name",
                                }),
                                daysArray.map((d) =>
                                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                                    "th",
                                    {
                                      className:
                                        "px-1 py-3 text-center font-bold min-w-[28px] text-foreground",
                                      children: d,
                                    },
                                    d,
                                  ),
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx("th", {
                                  className:
                                    "px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground",
                                  children: "Rate %",
                                }),
                              ],
                            }),
                          }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", {
                            className: "divide-y divide-border",
                            children: teachersList.map((t) => {
                              const daysMarks = teacherMatrixData[t.user_id] || {};
                              let presentCount = 0;
                              let totalCount2 = 0;
                              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "tr",
                                {
                                  className: "hover:bg-secondary/15",
                                  children: [
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className:
                                        "px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground",
                                      children: t.full_name,
                                    }),
                                    daysArray.map((d) => {
                                      const status = daysMarks[d];
                                      let displayVal = "—";
                                      let colorClass = "text-slate-300 dark:text-slate-700";
                                      if (status) {
                                        totalCount2++;
                                        if (
                                          status === "present" ||
                                          status === "late" ||
                                          status === "half_day"
                                        ) {
                                          presentCount += status === "half_day" ? 0.5 : 1;
                                        }
                                        displayVal =
                                          status === "present"
                                            ? "P"
                                            : status === "absent"
                                              ? "A"
                                              : status === "late"
                                                ? "L"
                                                : "H";
                                        colorClass =
                                          status === "present"
                                            ? "bg-emerald-500/10 text-emerald-600 font-extrabold rounded"
                                            : status === "absent"
                                              ? "bg-red-500/10 text-red-600 font-extrabold rounded"
                                              : status === "late"
                                                ? "bg-amber-500/10 text-amber-600 font-extrabold rounded"
                                                : "bg-indigo-500/10 text-indigo-600 font-extrabold rounded";
                                      }
                                      return /* @__PURE__ */ jsxRuntimeExports.jsx(
                                        "td",
                                        {
                                          className: "px-0.5 py-2.5 text-center min-w-[28px]",
                                          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", {
                                            className: `inline-block size-5 text-center leading-5 text-[10px] ${colorClass}`,
                                            children: displayVal,
                                          }),
                                        },
                                        d,
                                      );
                                    }),
                                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", {
                                      className:
                                        "px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border",
                                      children:
                                        totalCount2 > 0
                                          ? `${Math.round((presentCount / totalCount2) * 100)}%`
                                          : "—",
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
                    " records",
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
        ],
      }),
    ],
  });
}
export { AttendancePage as component };
