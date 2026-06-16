import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, Users, Wallet, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/analytics")({
  component: AnalyticsPage,
});

const COLORS = ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6"];

function AnalyticsPage() {
  const { currentSchoolId: effectiveSchoolId, loading: tenantLoading } = useTenant();
  usePageTitle("Analytics");
  const [attTrend, setAttTrend] = useState<Array<{ date: string; rate: number; total: number }>>([]);
  const [revTrend, setRevTrend] = useState<Array<{ month: string; collected: number }>>([]);
  const [statusMix, setStatusMix] = useState<Array<{ name: string; value: number }>>([]);
  const [classRoll, setClassRoll] = useState<Array<{ name: string; students: number }>>([]);
  const [kpi, setKpi] = useState({ students: 0, teachers: 0, attRate: 0, collected: 0 });

  useEffect(() => {
    if (!effectiveSchoolId) return;
    (async () => {
      const since = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
      const monthAgo6 = new Date(Date.now() - 180 * 86400000).toISOString().slice(0, 10);

      const [{ data: att }, { data: pays }, { data: students }, { data: teachers }, { data: classes }] = await Promise.all([
        supabase.from("attendance").select("date, status").eq("school_id", effectiveSchoolId).gte("date", since),
        supabase.from("fee_payments").select("amount, paid_on").eq("school_id", effectiveSchoolId).gte("paid_on", monthAgo6),
        supabase.from("students").select("id, class_id, classes(name)").eq("school_id", effectiveSchoolId),
        supabase.from("user_roles").select("user_id").eq("school_id", effectiveSchoolId).eq("role", "teacher"),
        supabase.from("classes").select("id, name").eq("school_id", effectiveSchoolId),
      ]);

      // attendance trend by day
      const byDate = new Map<string, { p: number; t: number }>();
      (att ?? []).forEach((r) => {
        const e = byDate.get(r.date) ?? { p: 0, t: 0 };
        e.t += 1;
        if (r.status === "present") e.p += 1;
        byDate.set(r.date, e);
      });
      const trend = Array.from(byDate.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, v]) => ({ date: date.slice(5), rate: Math.round((v.p / v.t) * 100), total: v.t }));
      setAttTrend(trend);

      // status mix
      const mix = { present: 0, absent: 0, late: 0, half_day: 0 } as Record<string, number>;
      (att ?? []).forEach((r) => { mix[r.status] = (mix[r.status] ?? 0) + 1; });
      setStatusMix([
        { name: "Present", value: mix.present },
        { name: "Absent", value: mix.absent },
        { name: "Late", value: mix.late },
        { name: "Half day", value: mix.half_day },
      ].filter((x) => x.value > 0));

      // revenue by month
      const byMonth = new Map<string, number>();
      (pays ?? []).forEach((p) => {
        const m = p.paid_on.slice(0, 7);
        byMonth.set(m, (byMonth.get(m) ?? 0) + Number(p.amount));
      });
      setRevTrend(Array.from(byMonth.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([month, collected]) => ({ month, collected })));

      // class strength
      const klassCount = new Map<string, number>();
      ((students ?? []) as Array<{ class_id: string | null; classes: { name: string } | { name: string }[] | null }>).forEach((s) => {
        const cls = Array.isArray(s.classes) ? s.classes[0] : s.classes;
        const name = cls?.name ?? "Unassigned";
        klassCount.set(name, (klassCount.get(name) ?? 0) + 1);
      });
      setClassRoll(Array.from(klassCount.entries()).map(([name, students]) => ({ name, students })));

      const totalAtt = att?.length ?? 0;
      const presentCount = (att ?? []).filter((a) => a.status === "present").length;
      setKpi({
        students: students?.length ?? 0,
        teachers: teachers?.length ?? 0,
        attRate: totalAtt ? Math.round((presentCount / totalAtt) * 100) : 0,
        collected: (pays ?? []).reduce((s, p) => s + Number(p.amount), 0),
      });

      void classes;
    })();
  }, [effectiveSchoolId]);

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
      <PageHeader title="Analytics" breadcrumb="Insights" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi icon={<Users className="size-4" />} label="Students" value={String(kpi.students)} />
          <Kpi icon={<GraduationCap className="size-4" />} label="Teachers" value={String(kpi.teachers)} />
          <Kpi icon={<TrendingUp className="size-4" />} label="Attendance (30d)" value={`${kpi.attRate}%`} />
          <Kpi icon={<Wallet className="size-4" />} label="Collected (180d)" value={`₹${kpi.collected.toFixed(0)}`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Attendance rate — last 30 days">
            {attTrend.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={attTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="rate" stroke="hsl(var(--brand))" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card title="Attendance breakdown (30d)">
            {statusMix.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={statusMix} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {statusMix.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card title="Revenue collected — last 6 months">
            {revTrend.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={revTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="collected" fill="hsl(var(--brand))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>

          <Card title="Class strength">
            {classRoll.length === 0 ? <Empty /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={classRoll} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="students" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}

function Kpi({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 text-muted-foreground"><span>{icon}</span><span className="text-xs uppercase tracking-wider">{label}</span></div>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-semibold mb-3">{title}</h3>
      {children}
    </section>
  );
}

function Empty() {
  return <p className="text-sm text-muted-foreground py-12 text-center">Not enough data yet.</p>;
}
