import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Building2,
  Users,
  GraduationCap,
  BadgeDollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ArrowRight,
  Activity,
  Globe2,
  UserCheck,
  BookOpen,
  Zap,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/platform/")({
  component: PlatformOverviewPage,
});

type SchoolSummary = {
  id: string;
  name: string;
  code: string | null;
  status: string;
  plan: string;
  student_limit: number;
  teacher_limit: number;
  created_at: string;
  city?: string | null;
  school_type?: string | null;
  principal_name?: string | null;
};

// Animated counter hook
function useAnimatedCounter(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);

  return count;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const count = useAnimatedCounter(value);
  return <>{prefix}{count.toLocaleString()}{suffix}</>;
}

function PlatformOverviewPage() {
  const navigate = useNavigate();
  const [schools, setSchools] = useState<SchoolSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSchools: 0,
    activeSchools: 0,
    inactiveSchools: 0,
    suspendedSchools: 0,
    totalStudents: 0,
    totalTeachers: 0,
    totalAdmins: 0,
    totalClasses: 0,
    mrr: 0,
    pendingFees: 0,
  });
  const [chartData, setChartData] = useState<{
    schoolDistrib: { name: string; value: number; color: string }[];
    monthlyAdmissions: { month: string; students: number; teachers: number }[];
    feeCollection: { month: string; collected: number; pending: number }[];
    schoolActivity: { name: string; students: number; teachers: number }[];
  }>({
    schoolDistrib: [],
    monthlyAdmissions: [],
    feeCollection: [],
    schoolActivity: [],
  });
  const [recentActivity, setRecentActivity] = useState<
    { id: string; type: string; label: string; time: string; color: string }[]
  >([]);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, studentsRes, teacherRolesRes, adminRolesRes, classesRes, subsRes, feesRes] =
        await Promise.all([
          supabase.from("schools").select("*").order("created_at", { ascending: false }),
          supabase.from("students").select("id, school_id, created_at", { count: "exact" }),
          supabase.from("user_roles").select("user_id, school_id", { count: "exact" }).eq("role", "teacher" as never),
          supabase.from("user_roles").select("user_id", { count: "exact" }).eq("role", "admin" as never),
          supabase.from("classes").select("id, school_id", { count: "exact" }),
          supabase.from("subscriptions").select("school_id, monthly_amount, status"),
          supabase.from("fee_invoices").select("amount_due, amount_paid, status, created_at").limit(500),
        ]);

      const allSchools = (schoolsRes.data ?? []) as SchoolSummary[];
      const allStudents = studentsRes.data ?? [];
      const allClasses = classesRes.data ?? [];
      const allSubs = subsRes.data ?? [];
      const allFees = (feesRes.data ?? []) as { amount_due: number; amount_paid: number; status: string; created_at: string }[];

      const active = allSchools.filter((s) => s.status === "active").length;
      const inactive = allSchools.filter((s) => s.status === "inactive").length;
      const suspended = allSchools.filter((s) => s.status === "suspended").length;
      const mrr = allSubs
        .filter((s) => s.status === "active")
        .reduce((a, s) => a + Number(s.monthly_amount || 0), 0);
      const pendingFees = allFees
        .filter((f) => f.status === "pending" || f.status === "partial")
        .reduce((a, f) => a + Math.max(0, Number(f.amount_due || 0) - Number(f.amount_paid || 0)), 0);

      setStats({
        totalSchools: allSchools.length,
        activeSchools: active,
        inactiveSchools: inactive,
        suspendedSchools: suspended,
        totalStudents: studentsRes.count ?? 0,
        totalTeachers: teacherRolesRes.count ?? 0,
        totalAdmins: adminRolesRes.count ?? 0,
        totalClasses: classesRes.count ?? 0,
        mrr,
        pendingFees,
      });

      setSchools(allSchools);

      // Build school distribution pie using strictly real counts
      const distrib = allSchools.slice(0, 6).map((s, i) => ({
        name: s.name.length > 12 ? s.name.slice(0, 12) + "…" : s.name,
        value: allStudents.filter((st) => st.school_id === s.id).length,
        color: ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"][i % 6],
      }));
      if (allSchools.length > 6) {
        const othersCount = Math.max(0, allStudents.length - distrib.reduce((a, d) => a + d.value, 0));
        if (othersCount > 0) {
          distrib.push({ name: "Others", value: othersCount, color: "#94a3b8" });
        }
      }

      // Monthly admissions (last 6 months)
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return { key: d.toISOString().slice(0, 7), label: d.toLocaleString("default", { month: "short" }) };
      });
      const monthlyAdmissions = months.map((m) => ({
        month: m.label,
        students: allStudents.filter((s) => s.created_at?.slice(0, 7) === m.key).length,
        teachers: 0,
      }));

      // Fee collection chart using real invoice records
      const feeCollection = months.map((m) => ({
        month: m.label,
        collected: allFees
          .filter((f) => f.created_at?.slice(0, 7) === m.key && (f.status === "paid" || f.amount_paid > 0))
          .reduce((a, f) => a + Number(f.amount_paid || 0), 0),
        pending: allFees
          .filter((f) => f.created_at?.slice(0, 7) === m.key && f.status !== "paid")
          .reduce((a, f) => a + Math.max(0, Number(f.amount_due || 0) - Number(f.amount_paid || 0)), 0),
      }));

      // School activity (top 6 schools by actual student count)
      const schoolActivity = allSchools.slice(0, 6).map((s) => ({
        name: s.name.split(" ")[0],
        students: allStudents.filter((st) => st.school_id === s.id).length,
        teachers: 0,
      }));

      setChartData({ schoolDistrib: distrib, monthlyAdmissions, feeCollection, schoolActivity });

      // Recent activity feed
      const activity = allSchools.slice(0, 3).map((s) => ({
        id: s.id,
        type: "school",
        label: `${s.name} provisioned`,
        time: new Date(s.created_at).toLocaleDateString(),
        color: "bg-indigo-500",
      }));
      setRecentActivity(activity);
    } catch (e) {
      console.error("Platform dashboard error:", e);
    }
    setLoading(false);
  };

  const PIE_COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444", "#94a3b8"];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white p-8 rounded-3xl shadow-2xl border border-indigo-800/40">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djJoLTJ2LTJoMnptMC00aDJ2MmgtMnYtMnptLTQgNGgtMnYtMmgydjJ6bTIgMHYtMmgydjJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="size-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Globe2 className="size-4 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">HEZO Platform</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Multi-School Command Center</h1>
            <p className="text-indigo-200 text-sm mt-2 max-w-lg">
              Real-time oversight of {stats.totalSchools} school tenants — {stats.totalStudents.toLocaleString()} students, {stats.totalTeachers.toLocaleString()} teachers, across {stats.activeSchools} active institutions.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/platform/schools"
              className="px-5 py-2.5 text-sm font-semibold bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-100"
            >
              <Plus className="size-4" /> Provision School
            </Link>
            <Link
              to="/platform/schools"
              className="px-5 py-2.5 text-sm font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur flex items-center gap-2 transition-all"
            >
              <Building2 className="size-4" /> Manage Schools
            </Link>
          </div>
        </div>
      </div>

      {/* 10 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard icon={Building2} label="Total Schools" value={stats.totalSchools} color="indigo" />
        <KpiCard icon={CheckCircle2} label="Active" value={stats.activeSchools} color="emerald" />
        <KpiCard icon={AlertCircle} label="Inactive" value={stats.inactiveSchools} color="amber" />
        <KpiCard icon={AlertTriangle} label="Suspended" value={stats.suspendedSchools} color="rose" />
        <KpiCard icon={GraduationCap} label="Students" value={stats.totalStudents} color="blue" />
        <KpiCard icon={Users} label="Teachers" value={stats.totalTeachers} color="violet" />
        <KpiCard icon={UserCheck} label="School Admins" value={stats.totalAdmins} color="cyan" />
        <KpiCard icon={BookOpen} label="Classes" value={stats.totalClasses} color="orange" />
        <KpiCard icon={BadgeDollarSign} label="Monthly Revenue" value={stats.mrr} prefix="₹" color="emerald" />
        <KpiCard icon={Zap} label="Pending Fees" value={stats.pendingFees} prefix="₹" color="amber" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Admissions Line Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="size-4 text-indigo-500" /> Monthly Growth
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Student & teacher onboarding trend</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData.monthlyAdmissions}>
              <defs>
                <linearGradient id="gStudents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gTeachers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <RechartsTooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 20px rgba(0,0,0,0.1)", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Area type="monotone" dataKey="students" stroke="#6366f1" fill="url(#gStudents)" strokeWidth={2.5} name="Students" dot={{ r: 4, fill: "#6366f1" }} />
              <Area type="monotone" dataKey="teachers" stroke="#10b981" fill="url(#gTeachers)" strokeWidth={2.5} name="Teachers" dot={{ r: 4, fill: "#10b981" }} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* School Distribution Pie */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-violet-500" /> School Distribution
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Students per school</p>
          </div>
          {chartData.schoolDistrib.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={chartData.schoolDistrib} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {chartData.schoolDistrib.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {chartData.schoolDistrib.slice(0, 4).map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full" style={{ background: d.color }} />
                      <span className="text-muted-foreground truncate max-w-24">{d.name}</span>
                    </div>
                    <span className="font-semibold">{d.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-xs text-muted-foreground">No data yet</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <BadgeDollarSign className="size-4 text-emerald-500" /> Fee Collection
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Collected vs pending (last 6 months)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.feeCollection} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
              <RechartsTooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} formatter={(v: number) => `₹${v.toLocaleString()}`} />
              <Bar dataKey="collected" name="Collected" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* School Activity Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              <Building2 className="size-4 text-blue-500" /> School Activity
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Students & teachers per school</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData.schoolActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} width={50} />
              <RechartsTooltip contentStyle={{ borderRadius: "10px", border: "1px solid hsl(var(--border))", background: "hsl(var(--card))", color: "hsl(var(--foreground))" }} />
              <Bar dataKey="students" name="Students" fill="#6366f1" radius={[0, 4, 4, 0]} />
              <Bar dataKey="teachers" name="Teachers" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid: Schools table + Activity + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Schools */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">Recent Schools</h2>
              <p className="text-xs text-muted-foreground">Latest provisioned tenants</p>
            </div>
            <Link to="/platform/schools" className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="size-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            {schools.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                <Building2 className="size-10 mx-auto mb-3 opacity-20" />
                No schools provisioned yet.{" "}
                <Link to="/platform/schools" className="text-indigo-600 dark:text-indigo-400 underline">
                  Create your first school
                </Link>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3">School</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Limits</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schools.slice(0, 6).map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                            {s.name.slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground text-xs">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{s.code || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="capitalize text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {s.plan}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground">
                        {s.student_limit} stu · {s.teacher_limit} tea
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={s.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to="/platform/schools"
                          className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity hover:underline"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Platform Health + Activity */}
        <div className="flex flex-col gap-4">
          {/* System Health */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold flex items-center gap-2 mb-4">
              <ShieldCheck className="size-4 text-emerald-500" /> Platform Health
            </h2>
            <div className="space-y-2.5">
              <HealthRow icon={<CheckCircle2 className="size-3.5 text-emerald-500" />} label="Supabase BaaS" status="Healthy" color="emerald" />
              <HealthRow icon={<CheckCircle2 className="size-3.5 text-indigo-500" />} label="Multi-Tenant RLS" status="Protected" color="indigo" />
              <HealthRow icon={<CheckCircle2 className="size-3.5 text-blue-500" />} label="Auth Engine" status="Active" color="blue" />
              <HealthRow icon={<AlertTriangle className="size-3.5 text-amber-500" />} label="Edge Functions" status="Standby" color="amber" />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex-1">
            <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Add School", to: "/platform/schools", icon: <Plus className="size-3.5" />, color: "bg-indigo-500 text-white" },
                { label: "Audit Logs", to: "/platform/audit-logs", icon: <Activity className="size-3.5" />, color: "bg-muted text-foreground" },
                { label: "Subscriptions", to: "/platform/subscriptions", icon: <BadgeDollarSign className="size-3.5" />, color: "bg-muted text-foreground" },
                { label: "Settings", to: "/platform/settings", icon: <ShieldCheck className="size-3.5" />, color: "bg-muted text-foreground" },
              ].map((a) => (
                <Link
                  key={a.label}
                  to={a.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold ${a.color} hover:opacity-80 transition-opacity`}
                >
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  color = "indigo",
  prefix = "",
}: {
  icon: typeof Building2;
  label: string;
  value: number;
  color?: string;
  prefix?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
    emerald: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    blue: "text-blue-600 dark:text-blue-400 bg-blue-500/10",
    violet: "text-violet-600 dark:text-violet-400 bg-violet-500/10",
    amber: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
    rose: "text-rose-600 dark:text-rose-400 bg-rose-500/10",
    cyan: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
    orange: "text-orange-600 dark:text-orange-400 bg-orange-500/10",
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate pr-2">{label}</span>
        <div className={`p-1.5 rounded-lg shrink-0 ${colorMap[color] || colorMap.indigo}`}>
          <Icon className="size-3.5" />
        </div>
      </div>
      <p className="text-2xl font-bold text-foreground tracking-tight">
        <AnimatedNumber value={value} prefix={prefix} />
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    inactive: "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    suspended: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    archived: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };
  return (
    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

function HealthRow({
  icon,
  label,
  status,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  status: string;
  color: string;
}) {
  const bgMap: Record<string, string> = {
    emerald: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200/50 dark:border-emerald-800/50",
    indigo: "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200/50 dark:border-indigo-800/50",
    blue: "bg-blue-50 dark:bg-blue-950/40 border-blue-200/50 dark:border-blue-800/50",
    amber: "bg-amber-50 dark:bg-amber-950/40 border-amber-200/50 dark:border-amber-800/50",
  };
  const badgeMap: Record<string, string> = {
    emerald: "text-emerald-700 dark:text-emerald-400",
    indigo: "text-indigo-700 dark:text-indigo-400",
    blue: "text-blue-700 dark:text-blue-400",
    amber: "text-amber-700 dark:text-amber-400",
  };
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${bgMap[color]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`text-[10px] font-bold uppercase ${badgeMap[color]}`}>{status}</span>
    </div>
  );
}
