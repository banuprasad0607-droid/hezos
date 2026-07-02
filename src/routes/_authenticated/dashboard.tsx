import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { Users, Clock, Building2, FileText, ArrowRight, Check, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

interface Stats {
  students: number;
  teachers: number;
  attendanceToday: { present: number; total: number };
  homeworkToday: number;
  pendingHomework: number;
}

interface Remark {
  id: string;
  category: string;
  content: string;
  created_at: string;
  student: { full_name: string } | null;
}

function DashboardPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    profile,
    roles,
    loading: tenantLoading,
    error: tenantError,
  } = useTenant();
  usePageTitle("Dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [remarks, setRemarks] = useState<Remark[]>([]);

  const isParent =
    (roles ?? []).includes("parent") &&
    !(roles ?? []).includes("admin") &&
    !(roles ?? []).includes("teacher");

  useEffect(() => {
    if (!effectiveSchoolId || isParent) return;
    let mounted = true;

    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [students, teacherRoles, attRows, hwToday, hwPending, recentRemarks] =
        await Promise.all([
          supabase
            .from("students")
            .select("id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId),
          supabase
            .from("user_roles")
            .select("user_id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId)
            .eq("role", "teacher"),
          supabase
            .from("attendance")
            .select("status")
            .eq("school_id", effectiveSchoolId)
            .eq("date", today),
          supabase
            .from("homework")
            .select("id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId)
            .gte("created_at", today),
          supabase
            .from("homework")
            .select("id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId)
            .gte("due_date", today),
          supabase
            .from("remarks")
            .select("id, category, content, created_at, students(full_name)")
            .eq("school_id", effectiveSchoolId)
            .order("created_at", { ascending: false })
            .limit(5),
        ]);

      if (!mounted) return;
      const present = (attRows.data ?? []).filter(
        (r) => r.status === "present" || r.status === "late" || r.status === "half_day",
      ).length;
      setStats({
        students: students.count ?? 0,
        teachers: teacherRoles.count ?? 0,
        attendanceToday: { present, total: attRows.data?.length ?? 0 },
        homeworkToday: hwToday.count ?? 0,
        pendingHomework: hwPending.count ?? 0,
      });
      setRemarks(
        (recentRemarks.data ?? []).map((r) => {
          const studentField = r.students as unknown;
          const student = Array.isArray(studentField)
            ? ((studentField[0] as { full_name: string } | undefined) ?? null)
            : (studentField as { full_name: string } | null);
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
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Loading dashboard information...</p>
        </div>
      </div>
    );
  }

  if (tenantError) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen">
        <div className="max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="text-danger font-semibold mb-2">Unable to load dashboard.</p>
          <p className="text-sm text-muted-foreground mb-4">
            Please contact the administrator or check your connection.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const isSuperAdmin = (roles ?? []).includes("super_admin");
  if (!effectiveSchoolId && !isParent && !isSuperAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-[#F9FAFB] min-h-screen">
        <div className="max-w-md text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
          <p className="font-semibold mb-2 text-foreground">School information not found.</p>
          <p className="text-sm text-muted-foreground mb-4">
            You are not associated with any school. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  if (isParent) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome back!</h1>
        <Link to="/parent" className="mt-4 inline-block text-brand font-medium">
          Open Parent Dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8 space-y-6 text-foreground">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {(roles ?? []).includes("admin") ? "Admin Dashboard" : "Teacher Dashboard"} • School
            Management & Academics
          </p>
        </div>
        <Link
          to="/students"
          className="bg-brand text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm inline-flex items-center gap-2"
        >
          <Users className="size-4" /> Manage Students
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="TOTAL STUDENTS"
          value={stats?.students ?? 0}
          subtext={`Enrolled`}
          subtextColor="text-success"
          icon={<Users className="size-5 text-brand" />}
          iconBg="bg-brand/10"
        />
        <KpiCard
          label="ATTENDANCE TODAY"
          value={stats?.attendanceToday.present ?? 0}
          subtext={
            stats?.attendanceToday.total
              ? `of ${stats.attendanceToday.total} marked`
              : "Not marked yet"
          }
          icon={<Clock className="size-5 text-warning" />}
          iconBg="bg-warning/10"
        />
        <KpiCard
          label="TEACHERS"
          value={stats?.teachers ?? 0}
          subtext="Active staff members"
          icon={<Building2 className="size-5 text-brand" />}
          iconBg="bg-brand/10"
        />
        <KpiCard
          label="PENDING HOMEWORK"
          value={stats?.pendingHomework ?? 0}
          subtext="Due from today onwards"
          icon={<FileText className="size-5 text-muted-foreground" />}
          iconBg="bg-slate-200"
        />
      </div>

      {/* Bottom Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
        {/* Remarks Panel (similar to "Pending Employee Approvals") */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Recent Remarks & Feedback</h3>
            <span className="bg-warning/15 text-warning text-xs font-semibold px-2 py-1 rounded-full">
              {remarks.length} recent
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Review and acknowledge student remarks
          </p>

          <div className="space-y-4">
            {remarks.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No recent remarks.
              </div>
            ) : (
              remarks.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm uppercase">
                      {r.student?.full_name?.slice(0, 1) || "S"}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {r.student?.full_name || "Unknown Student"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {r.category} •{" "}
                        {r.content.length > 30 ? r.content.slice(0, 30) + "..." : r.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="bg-brand text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-brand/90 transition-colors">
                      Acknowledge
                    </button>
                    <button className="bg-slate-100 text-slate-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-slate-200 transition-colors">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Progress Panel (similar to "Onboarding Status") */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold">Academic Progress</h3>
            <Link
              to="/attendance"
              className="text-sm font-medium flex items-center gap-1 hover:text-brand transition-colors"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mb-6">Daily school activity progress</p>

          <div className="space-y-6">
            {/* Progress 1 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Overall Attendance</span>
                <span className="font-semibold text-brand">
                  {stats?.attendanceToday.total
                    ? Math.round(
                        (stats.attendanceToday.present / stats.attendanceToday.total) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-500"
                  style={{
                    width: `${stats?.attendanceToday.total ? (stats.attendanceToday.present / stats.attendanceToday.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress 2 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Homework Assigned Today</span>
                <span className="font-semibold text-success">{stats?.homeworkToday ?? 0}</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-success rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((stats?.homeworkToday ?? 0) / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Progress 3 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">Pending Actions</span>
                <span className="font-semibold text-danger">0</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.attendanceToday.present ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats?.homeworkToday ?? 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Homework</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{remarks.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Remarks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  subtext,
  subtextColor = "text-muted-foreground",
  icon,
  iconBg,
}: {
  label: string;
  value: number | string;
  subtext?: string;
  subtextColor?: string;
  icon: React.ReactNode;
  iconBg: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1 tracking-wider uppercase">
          {label}
        </p>
        <div className="flex items-end gap-2">
          <h3 className="text-3xl font-bold text-foreground">{value}</h3>
          {subtext && <span className={`text-xs font-medium mb-1 ${subtextColor}`}>{subtext}</span>}
        </div>
      </div>
      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}
