import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { WhatsAppBroadcast, type BroadcastRecipient } from "@/components/WhatsAppBroadcast";
import {
  Calendar,
  Download,
  UserCheck,
  Users,
  ClipboardList,
  Printer,
  FileDown,
  Search,
} from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-helper";
import { whatsappService } from "@/lib/whatsapp-service";

export const Route = createFileRoute("/_authenticated/attendance")({
  component: AttendancePage,
});

type Status = "present" | "absent" | "late" | "half_day";
const STATUSES: { value: Status; label: string; color: string }[] = [
  {
    value: "present",
    label: "Present",
    color: "bg-success-soft text-success ring-1 ring-success/20",
  },
  { value: "absent", label: "Absent", color: "bg-danger-soft text-danger ring-1 ring-danger/20" },
  { value: "late", label: "Late", color: "bg-warning-soft text-warning ring-1 ring-warning/20" },
  { value: "half_day", label: "Half", color: "bg-brand-soft text-brand ring-1 ring-brand/20" },
];

interface Klass {
  id: string;
  name: string;
}
interface Student {
  id: string;
  full_name: string;
  roll_number: string | null;
  parent_name: string | null;
  parent_phone: string | null;
}

function AttendancePage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  usePageTitle("Attendance");

  // Tabs: daily | student-matrix | teacher-daily | teacher-matrix
  const [activeTab, setActiveTab] = useState<
    "daily" | "student-matrix" | "teacher-daily" | "teacher-matrix"
  >("daily");

  const [classes, setClasses] = useState<Klass[]>([]);
  const [classId, setClassId] = useState<string>("");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10));
  const [students, setStudents] = useState<Student[]>([]);
  const [marks, setMarks] = useState<Record<string, Status>>({});

  // Monthly Matrix states
  const [selectedMonth, setSelectedMonth] = useState<string>(() =>
    new Date().toISOString().slice(0, 7),
  ); // e.g. "2026-06"
  const [studentMatrixData, setStudentMatrixData] = useState<
    Record<string, Record<number, Status>>
  >({});

  // Teacher register states
  const [teachersList, setTeachersList] = useState<
    Array<{ user_id: string; full_name: string; employee_id: string | null }>
  >([]);
  const [teacherDailyDate, setTeacherDailyDate] = useState<string>(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [teacherDailyMarks, setTeacherDailyMarks] = useState<Record<string, Status>>({});
  const [teacherMatrixData, setTeacherMatrixData] = useState<
    Record<string, Record<number, Status>>
  >({});

  // Server-Side Search & Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  // Reset pagination and search when tabs or class changes
  useEffect(() => {
    setQ("");
    setDebouncedQ("");
    setPage(0);
    setTotalCount(0);
    setStudents([]);
    setTeachersList([]);
  }, [activeTab, classId]);

  // Days calculations
  const { year, month, daysInMonth, daysArray } = useMemo(() => {
    const [yStr, mStr] = selectedMonth.split("-");
    const y = parseInt(yStr, 10);
    const m = parseInt(mStr, 10) - 1;
    const days = new Date(y, m + 1, 0).getDate();
    return {
      year: y,
      month: m,
      daysInMonth: days,
      daysArray: Array.from({ length: days }, (_, idx) => idx + 1),
    };
  }, [selectedMonth]);

  // Load Classes
  useEffect(() => {
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

  // Load daily student marks
  useEffect(() => {
    if (!classId || activeTab !== "daily") return;
    (async () => {
      setFetching(true);
      try {
        let query = supabase
          .from("students")
          .select("id, full_name, roll_number, parent_name, parent_phone", { count: "exact" })
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

          const m: Record<string, Status> = {};
          (att ?? []).forEach((r) => {
            m[r.student_id] = r.status as Status;
          });
          setMarks(m);
        } else {
          setMarks({});
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load daily attendance.");
      } finally {
        setFetching(false);
      }
    })();
  }, [classId, date, activeTab, debouncedQ, page]);

  // Load student matrix ledger
  useEffect(() => {
    if (!classId || activeTab !== "student-matrix" || !selectedMonth) return;
    (async () => {
      setFetching(true);
      try {
        let query = supabase
          .from("students")
          .select("id, full_name, roll_number, parent_name, parent_phone", { count: "exact" })
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

          const map: Record<string, Record<number, Status>> = {};
          (att ?? []).forEach((row: any) => {
            const dNum = parseInt(row.date.split("-")[2], 10);
            if (!map[row.student_id]) map[row.student_id] = {};
            map[row.student_id][dNum] = row.status as Status;
          });
          setStudentMatrixData(map);
        } else {
          setStudentMatrixData({});
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load student matrix.");
      } finally {
        setFetching(false);
      }
    })();
  }, [classId, selectedMonth, activeTab, daysInMonth, debouncedQ, page]);

  // Load teachers/staff list (for daily & matrix logs)
  useEffect(() => {
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
          .select("user_id, full_name, employee_id", { count: "exact" })
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
            const { data, error: attError } = await (supabase as any)
              .from("teacher_attendance")
              .select("teacher_id, status")
              .eq("school_id", effectiveSchoolId)
              .eq("date", teacherDailyDate)
              .is("deleted_at", null)
              .in("teacher_id", staffIdsOnPage);

            if (attError) throw attError;

            const map: Record<string, Status> = {};
            (data || []).forEach((row: any) => {
              map[row.teacher_id] = row.status as Status;
            });
            setTeacherDailyMarks(map);
          } else {
            const startDate = `${selectedMonth}-01`;
            const endDate = `${selectedMonth}-${String(daysInMonth).padStart(2, "0")}`;
            const { data, error: attError } = await (supabase as any)
              .from("teacher_attendance")
              .select("teacher_id, date, status")
              .eq("school_id", effectiveSchoolId)
              .is("deleted_at", null)
              .in("teacher_id", staffIdsOnPage)
              .gte("date", startDate)
              .lte("date", endDate);

            if (attError) throw attError;

            const map: Record<string, Record<number, Status>> = {};
            (data || []).forEach((row: any) => {
              const dNum = parseInt(row.date.split("-")[2], 10);
              if (!map[row.teacher_id]) map[row.teacher_id] = {};
              map[row.teacher_id][dNum] = row.status as Status;
            });
            setTeacherMatrixData(map);
          }
        } else {
          setTeacherDailyMarks({});
          setTeacherMatrixData({});
        }
      } catch (err: any) {
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

  const mark = async (studentId: string, status: Status) => {
    if (!effectiveSchoolId || !user || !classId) return;
    setMarks((m) => ({ ...m, [studentId]: status }));
    const { error } = await supabase.from("attendance").upsert(
      {
        school_id: effectiveSchoolId,
        class_id: classId,
        student_id: studentId,
        date,
        status,
        marked_by: user.id,
      },
      { onConflict: "student_id,date" },
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
                template.id!,
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

  const markTeacher = async (teacherId: string, status: Status) => {
    if (!effectiveSchoolId || !user) return;
    setTeacherDailyMarks((prev) => ({ ...prev, [teacherId]: status }));
    const { error } = await (supabase as any).from("teacher_attendance").upsert(
      {
        school_id: effectiveSchoolId,
        teacher_id: teacherId,
        date: teacherDailyDate,
        status,
        marked_by: user.id,
      },
      { onConflict: "teacher_id,date" },
    );
    if (error) toast.error(error.message);
  };

  const className = classes.find((c) => c.id === classId)?.name ?? "Class";

  const handleExportStudentMatrix = async (format: "csv" | "excel" | "pdf") => {
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

      const map: Record<string, Record<number, Status>> = {};
      (att ?? []).forEach((row: any) => {
        const dNum = parseInt(row.date.split("-")[2], 10);
        if (!map[row.student_id]) map[row.student_id] = {};
        map[row.student_id][dNum] = row.status as Status;
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
        let totalCount = 0;
        const daysCols = daysArray.map((d) => {
          const status = daysMarks[d];
          if (status) {
            totalCount++;
            if (status === "present" || status === "late" || status === "half_day") {
              presentCount += status === "half_day" ? 0.5 : 1;
            }
            return status.toUpperCase();
          }
          return "—";
        });
        const rate = totalCount > 0 ? `${Math.round((presentCount / totalCount) * 100)}%` : "—";
        return [s.full_name, s.roll_number || "—", ...daysCols, presentCount, totalCount, rate];
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
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };

  const handleExportTeacherMatrix = async (format: "csv" | "excel" | "pdf") => {
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
      const { data } = await (supabase as any)
        .from("teacher_attendance")
        .select("teacher_id, date, status")
        .eq("school_id", effectiveSchoolId)
        .gte("date", startDate)
        .lte("date", endDate);

      const map: Record<string, Record<number, Status>> = {};
      (data || []).forEach((row: any) => {
        const dNum = parseInt(row.date.split("-")[2], 10);
        if (!map[row.teacher_id]) map[row.teacher_id] = {};
        map[row.teacher_id][dNum] = row.status as Status;
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
        let totalCount = 0;
        const daysCols = daysArray.map((d) => {
          const status = daysMarks[d];
          if (status) {
            totalCount++;
            if (status === "present" || status === "late" || status === "half_day") {
              presentCount += status === "half_day" ? 0.5 : 1;
            }
            return status.toUpperCase();
          }
          return "—";
        });
        const rate = totalCount > 0 ? `${Math.round((presentCount / totalCount) * 100)}%` : "—";
        return [t.full_name, t.employee_id || "—", ...daysCols, presentCount, totalCount, rate];
      });

      toast.dismiss();
      const fn = `Staff_Attendance_Matrix_${selectedMonth}`;
      if (format === "csv") exportToCSV(fn, headers, rows);
      else if (format === "excel") exportToExcel(fn, headers, rows);
      else if (format === "pdf")
        exportToPDF(fn, `Staff Attendance Matrix (${selectedMonth})`, headers, rows);
      toast.success("Export started!");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, half_day: 0 };
    Object.values(marks).forEach((s) => {
      c[s] += 1;
    });
    return c;
  }, [marks]);

  const teacherCounts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, half_day: 0 };
    Object.values(teacherDailyMarks).forEach((s) => {
      c[s] += 1;
    });
    return c;
  }, [teacherDailyMarks]);

  const absentRecipients: BroadcastRecipient[] = students
    .filter((s) => marks[s.id] === "absent" || marks[s.id] === "late")
    .map((s) => ({
      id: s.id,
      name: s.parent_name || `${s.full_name}'s parent`,
      phone: s.parent_phone,
      subtitle: `${s.full_name} · ${marks[s.id] === "late" ? "Late" : "Absent"}`,
    }));

  if (tenantLoading) {
    if (tenantLoading) {
      return (
        <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>

            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-background min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>

          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Attendance Center"
        breadcrumb="Operations & Ledgers"
        actions={
          <div className="flex bg-secondary rounded-md p-0.5 border border-border">
            <button
              onClick={() => setActiveTab("daily")}
              className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${
                activeTab === "daily"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Daily Student
            </button>
            <button
              onClick={() => setActiveTab("student-matrix")}
              className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${
                activeTab === "student-matrix"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Student Matrix
            </button>
            {isAdmin && (
              <>
                <button
                  onClick={() => setActiveTab("teacher-daily")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${
                    activeTab === "teacher-daily"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Daily Staff
                </button>
                <button
                  onClick={() => setActiveTab("teacher-matrix")}
                  className={`px-3 py-1.5 text-xs font-semibold rounded capitalize transition cursor-pointer ${
                    activeTab === "teacher-matrix"
                      ? "bg-card shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Staff Matrix
                </button>
              </>
            )}
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {/* Filters Panel */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {activeTab === "daily" && (
              <>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
                />
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {activeTab === "student-matrix" && (
              <>
                <input
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
                />
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {activeTab === "teacher-daily" && (
              <input
                type="date"
                value={teacherDailyDate}
                onChange={(e) => setTeacherDailyDate(e.target.value)}
                className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
              />
            )}

            {activeTab === "teacher-matrix" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1.5 text-xs border border-border rounded-md bg-background focus:outline-none text-foreground"
              />
            )}

            <div className="relative w-44">
              <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-2 py-1.5 text-xs border border-border rounded-md bg-background text-foreground outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "daily" && (
              <WhatsAppBroadcast
                label={`Notify absentees (${absentRecipients.length})`}
                recipients={absentRecipients}
                defaultMessage={`Hello, your child was marked absent in ${className} on ${date}. Please reach out if this is unexpected.\n\n— ${className} Teacher`}
                buildMessage={(r) =>
                  `Hello, ${r.subtitle?.split(" · ")[0] ?? "your child"} was marked ${r.subtitle?.includes("Late") ? "late" : "absent"} in ${className} on ${date}. Please reach out if this is unexpected.\n\n— ${className} Teacher`
                }
              />
            )}

            {activeTab === "student-matrix" && (
              <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-background">
                <button
                  onClick={() => handleExportStudentMatrix("csv")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExportStudentMatrix("excel")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer"
                >
                  XLS
                </button>
                <button
                  onClick={() => handleExportStudentMatrix("pdf")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer"
                >
                  PDF
                </button>
              </div>
            )}

            {activeTab === "teacher-matrix" && (
              <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-background">
                <button
                  onClick={() => handleExportTeacherMatrix("csv")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer"
                >
                  CSV
                </button>
                <button
                  onClick={() => handleExportTeacherMatrix("excel")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer"
                >
                  XLS
                </button>
                <button
                  onClick={() => handleExportTeacherMatrix("pdf")}
                  className="p-1.5 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer"
                >
                  PDF
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab content logic */}
        {fetching && students.length === 0 && teachersList.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            Loading attendance logs...
          </div>
        ) : (
          activeTab === "daily" &&
          (classes.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              Create a class first to mark attendance.
            </div>
          ) : students.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              No students found.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
                <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                  <h3 className="font-semibold text-xs">{totalCount} students total</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-success-soft text-success rounded font-semibold">
                      P: {counts.present}
                    </span>
                    <span className="px-2 py-1 bg-danger-soft text-danger rounded font-semibold">
                      A: {counts.absent}
                    </span>
                    <span className="px-2 py-1 bg-warning-soft text-warning rounded font-semibold">
                      L: {counts.late}
                    </span>
                    <span className="px-2 py-1 bg-brand-soft text-brand rounded font-semibold">
                      H: {counts.half_day}
                    </span>
                  </div>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium">Student</th>
                      <th className="px-6 py-3 font-medium">Roll</th>
                      <th className="px-6 py-3 font-medium text-right">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map((s) => {
                      const current = marks[s.id];
                      return (
                        <tr key={s.id} className="hover:bg-secondary/10">
                          <td className="px-6 py-3.5 font-bold text-foreground">{s.full_name}</td>
                          <td className="px-6 py-3.5 text-muted-foreground">
                            #{s.roll_number ?? "—"}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex gap-1.5 justify-end">
                              {STATUSES.map((st) => (
                                <button
                                  key={st.value}
                                  onClick={() => mark(s.id, st.value)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                                    current === st.value
                                      ? st.color
                                      : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"
                                  }`}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        {activeTab === "student-matrix" &&
          (classes.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              Create a class first to view attendance ledger.
            </div>
          ) : students.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              No students found to display matrix.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground">
                          Student Name
                        </th>
                        {daysArray.map((d) => (
                          <th
                            key={d}
                            className="px-1 py-3 text-center font-bold min-w-[28px] text-foreground"
                          >
                            {d}
                          </th>
                        ))}
                        <th className="px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground">
                          Rate %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {students.map((s) => {
                        const daysMarks = studentMatrixData[s.id] || {};
                        let presentCount = 0;
                        let totalCount = 0;
                        return (
                          <tr key={s.id} className="hover:bg-secondary/15">
                            <td className="px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground">
                              {s.full_name}
                            </td>
                            {daysArray.map((d) => {
                              const status = daysMarks[d];
                              let displayVal = "—";
                              let colorClass = "text-slate-300 dark:text-slate-700";
                              if (status) {
                                totalCount++;
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
                              return (
                                <td key={d} className="px-0.5 py-2.5 text-center min-w-[28px]">
                                  <span
                                    className={`inline-block size-5 text-center leading-5 text-[10px] ${colorClass}`}
                                  >
                                    {displayVal}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border">
                              {totalCount > 0
                                ? `${Math.round((presentCount / totalCount) * 100)}%`
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

        {activeTab === "teacher-daily" &&
          isAdmin &&
          (teachersList.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              No staff members found.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
                <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/10">
                  <h3 className="font-semibold text-xs">{totalCount} staff members total</h3>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-success-soft text-success rounded font-semibold">
                      P: {teacherCounts.present}
                    </span>
                    <span className="px-2 py-1 bg-danger-soft text-danger rounded font-semibold">
                      A: {teacherCounts.absent}
                    </span>
                    <span className="px-2 py-1 bg-warning-soft text-warning rounded font-semibold">
                      L: {teacherCounts.late}
                    </span>
                    <span className="px-2 py-1 bg-brand-soft text-brand rounded font-semibold">
                      H: {teacherCounts.half_day}
                    </span>
                  </div>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/40 text-[10px] uppercase font-bold text-muted-foreground border-b border-border">
                    <tr>
                      <th className="px-6 py-3 font-medium">Staff Member</th>
                      <th className="px-6 py-3 font-medium">Employee ID</th>
                      <th className="px-6 py-3 font-medium text-right">Mark Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {teachersList.map((t) => {
                      const current = teacherDailyMarks[t.user_id];
                      return (
                        <tr key={t.user_id} className="hover:bg-secondary/10">
                          <td className="px-6 py-3.5 font-bold text-foreground">{t.full_name}</td>
                          <td className="px-6 py-3.5 text-muted-foreground font-mono text-[10px]">
                            {t.employee_id || "—"}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex gap-1.5 justify-end">
                              {STATUSES.map((st) => (
                                <button
                                  key={st.value}
                                  onClick={() => markTeacher(t.user_id, st.value)}
                                  className={`px-2.5 py-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                                    current === st.value
                                      ? st.color
                                      : "bg-secondary text-muted-foreground hover:bg-accent text-foreground"
                                  }`}
                                >
                                  {st.label}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        {activeTab === "teacher-matrix" &&
          isAdmin &&
          (teachersList.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center text-muted-foreground">
              No staff members found.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-secondary/40 text-muted-foreground border-b border-border uppercase text-[10px] font-bold">
                      <tr>
                        <th className="px-4 py-3 font-semibold sticky left-0 bg-secondary z-10 w-44 shadow-sm text-foreground">
                          Staff Name
                        </th>
                        {daysArray.map((d) => (
                          <th
                            key={d}
                            className="px-1 py-3 text-center font-bold min-w-[28px] text-foreground"
                          >
                            {d}
                          </th>
                        ))}
                        <th className="px-3 py-3 text-right font-bold w-20 sticky right-0 bg-secondary z-10 shadow-sm text-foreground">
                          Rate %
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teachersList.map((t) => {
                        const daysMarks = teacherMatrixData[t.user_id] || {};
                        let presentCount = 0;
                        let totalCount = 0;
                        return (
                          <tr key={t.user_id} className="hover:bg-secondary/15">
                            <td className="px-4 py-2.5 font-bold sticky left-0 bg-card z-10 w-44 border-r border-border truncate shadow-xs text-foreground">
                              {t.full_name}
                            </td>
                            {daysArray.map((d) => {
                              const status = daysMarks[d];
                              let displayVal = "—";
                              let colorClass = "text-slate-300 dark:text-slate-700";
                              if (status) {
                                totalCount++;
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
                              return (
                                <td key={d} className="px-0.5 py-2.5 text-center min-w-[28px]">
                                  <span
                                    className={`inline-block size-5 text-center leading-5 text-[10px] ${colorClass}`}
                                  >
                                    {displayVal}
                                  </span>
                                </td>
                              );
                            })}
                            <td className="px-3 py-2.5 text-right font-black text-slate-700 dark:text-slate-300 sticky right-0 bg-card z-10 shadow-xs border-l border-border">
                              {totalCount > 0
                                ? `${Math.round((presentCount / totalCount) * 100)}%`
                                : "—"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}

        {/* Pagination controls */}
        {totalCount > 0 && (
          <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground">
            <p className="text-xs text-muted-foreground">
              Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of{" "}
              {totalCount} records
            </p>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary"
              >
                Previous
              </button>
              <button
                disabled={(page + 1) * pageSize >= totalCount}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 text-xs font-semibold border border-border bg-card text-card-foreground rounded-md disabled:opacity-50 cursor-pointer hover:bg-secondary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
