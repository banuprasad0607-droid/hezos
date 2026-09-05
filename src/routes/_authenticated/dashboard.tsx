import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { Users, Clock, Building2, FileText, ArrowRight, Check, X } from "lucide-react";
import { OnboardingChecklist } from "@/components/onboarding/OnboardingChecklist";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

interface Stats {
  students: number;
  teachers: number;
  classes: number;
  fees: number;
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
  const navigate = useNavigate();
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
    !(roles ?? []).includes("teacher") &&
    !(roles ?? []).includes("super_admin");

  useEffect(() => {
    if (isParent) {
      void navigate({ to: "/parent" });
    }
  }, [isParent, navigate]);

  useEffect(() => {
    if (!effectiveSchoolId || isParent) return;
    let mounted = true;

    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const [students, teacherRoles, attRows, hwToday, hwPending, recentRemarks, classesRes, feesRes] =
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
          supabase
            .from("classes")
            .select("id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId),
          supabase
            .from("fee_structures")
            .select("id", { count: "exact", head: true })
            .eq("school_id", effectiveSchoolId),
        ]);

      if (!mounted) return;
      const present = (attRows.data ?? []).filter(
        (r) => r.status === "present" || r.status === "late" || r.status === "half_day",
      ).length;
      setStats({
        students: students.count ?? 0,
        teachers: teacherRoles.count ?? 0,
        classes: classesRes.count ?? 0,
        fees: feesRes.count ?? 0,
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
    <div className="flex-1 overflow-y-auto bg-background p-4 sm:p-6 lg:p-8 space-y-6 text-foreground">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {profile?.full_name?.split(" ")[0] || "Admin"}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            {(roles ?? []).includes("admin") ? "Admin Dashboard" : "Teacher Dashboard"} • School
            Management & Academics
          </p>
        </div>
        <Link
          to="/students"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 min-h-[44px] rounded-xl text-xs sm:text-sm font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-xs inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
        >
          <Users className="size-4" /> Manage Students
        </Link>
      </div>

      {/* Onboarding Quick Setup Checklist for Admins */}
      {effectiveSchoolId && (roles ?? []).includes("admin") && (
        <OnboardingChecklist
          schoolId={effectiveSchoolId}
          hasClasses={(stats?.classes ?? 0) > 0}
          hasStudents={(stats?.students ?? 0) > 0}
          hasAttendance={(stats?.attendanceToday.total ?? 0) > 0}
          hasFees={(stats?.fees ?? 0) > 0}
          onRefresh={() => window.location.reload()}
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          label="TOTAL STUDENTS"
          value={stats?.students ?? 0}
          subtext={`Enrolled`}
          subtextColor="text-emerald-600 dark:text-emerald-400 font-semibold"
          icon={<Users className="size-5 text-blue-600 dark:text-blue-400" />}
          iconBg="bg-blue-500/10"
        />
        <KpiCard
          label="ATTENDANCE TODAY"
          value={stats?.attendanceToday.present ?? 0}
          subtext={
            stats?.attendanceToday.total
              ? `of ${stats.attendanceToday.total} marked`
              : "Not marked yet"
          }
          subtextColor="text-amber-600 dark:text-amber-400 font-semibold"
          icon={<Clock className="size-5 text-amber-600 dark:text-amber-400" />}
          iconBg="bg-amber-500/10"
        />
        <KpiCard
          label="TEACHERS"
          value={stats?.teachers ?? 0}
          subtext="Active staff members"
          icon={<Building2 className="size-5 text-indigo-600 dark:text-indigo-400" />}
          iconBg="bg-indigo-500/10"
        />
        <KpiCard
          label="PENDING HOMEWORK"
          value={stats?.pendingHomework ?? 0}
          subtext="Due from today onwards"
          icon={<FileText className="size-5 text-violet-600 dark:text-violet-400" />}
          iconBg="bg-violet-500/10"
        />
      </div>

      {/* Bottom Grid Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Remarks Panel */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border/80 text-card-foreground space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-foreground">Recent Remarks & Feedback</h3>
            <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/20">
              {remarks.length} recent
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Review and acknowledge student remarks
          </p>

          <div className="space-y-3">
            {remarks.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-6">
                No recent remarks.
              </div>
            ) : (
              remarks.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-xl border border-border/70 bg-secondary/30 gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-blue-500/10 text-primary flex items-center justify-center font-bold text-sm uppercase shrink-0">
                      {r.student?.full_name?.slice(0, 1) || "S"}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">
                        {r.student?.full_name || "Unknown Student"}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize mt-0.5">
                        {r.category} •{" "}
                        {r.content.length > 30 ? r.content.slice(0, 30) + "..." : r.content}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button className="bg-primary text-primary-foreground px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                      Acknowledge
                    </button>
                    <button className="bg-secondary text-secondary-foreground px-3.5 py-2 min-h-[36px] rounded-lg text-xs font-bold hover:bg-secondary/80 transition-colors cursor-pointer">
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Academic Progress Panel */}
        <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border/80 text-card-foreground space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-foreground">Academic Progress</h3>
            <Link
              to="/attendance"
              className="text-xs sm:text-sm font-bold text-primary flex items-center gap-1 hover:underline"
            >
              View All <ArrowRight className="size-4" />
            </Link>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">Daily school activity progress</p>

          <div className="space-y-5">
            {/* Progress 1 */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-2">
                <span className="text-muted-foreground">Overall Attendance</span>
                <span className="font-bold text-primary">
                  {stats?.attendanceToday.total
                    ? Math.round(
                        (stats.attendanceToday.present / stats.attendanceToday.total) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${stats?.attendanceToday.total ? (stats.attendanceToday.present / stats.attendanceToday.total) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Progress 2 */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-2">
                <span className="text-muted-foreground">Homework Assigned Today</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats?.homeworkToday ?? 0}</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(((stats?.homeworkToday ?? 0) / 10) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Progress 3 */}
            <div>
              <div className="flex justify-between text-xs sm:text-sm font-semibold mb-2">
                <span className="text-muted-foreground">Pending Actions</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">0</span>
              </div>
              <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-border/70">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats?.attendanceToday.present ?? 0}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Present</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats?.homeworkToday ?? 0}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Homework</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{remarks.length}</p>
              <p className="text-xs text-muted-foreground font-semibold mt-1">Remarks</p>
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
    <div className="bg-card rounded-2xl p-5 sm:p-6 shadow-xs border border-border/80 flex items-center justify-between text-card-foreground">
      <div>
        <p className="text-xs font-bold text-muted-foreground mb-1 tracking-wider uppercase">
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">{value}</h3>
          {subtext && <span className={`text-xs ${subtextColor}`}>{subtext}</span>}
        </div>
      </div>
      <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}
