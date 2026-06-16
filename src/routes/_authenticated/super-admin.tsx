import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { provisionSchool } from "@/lib/platform.functions";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Globe2,
  Building2,
  Users,
  GraduationCap,
  BadgeDollarSign,
  Plus,
  Pause,
  Play,
  Trash2,
  ArrowRight,
  X,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_authenticated/super-admin")({
  head: () => ({ meta: [{ title: "Platform — HEZO SCHOOL" }] }),
  component: SuperAdminPage,
});

type SchoolRow = {
  id: string;
  name: string;
  code: string | null;
  status: string;
  plan: string;
  student_limit: number;
  teacher_limit: number;
  created_at: string;
  logo_url?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
};

type Sub = { 
  school_id: string; 
  monthly_amount: number; 
  status: string;
  billing_cycle?: string;
  trial_end?: string | null;
};

function SuperAdminPage() {
  const { roles } = useAuth();
  const { enterSchool } = useSchoolContext();
  const navigate = useNavigate();
  const isSuper = roles.includes("super_admin");
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [subs, setSubs] = useState<Sub[]>([]);
  const [counts, setCounts] = useState({ students: 0, teachers: 0, trial: 0, expired: 0, pendingPayments: 0 });
  const [loading, setLoading] = useState(true);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [revenueData, setRevenueData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    if (!isSuper) return;
    void loadAll();
  }, [isSuper]);

  const loadAll = async () => {
    setLoading(true);
    const [s, sb, st, tr, paymentsRows] = await Promise.all([
      supabase.from("schools").select("*").order("created_at", { ascending: false }),
      supabase.from("subscriptions").select("school_id, monthly_amount, status, billing_cycle, trial_end"),
      supabase.from("students").select("id", { count: "exact", head: true }),
      supabase.from("user_roles").select("user_id", { count: "exact", head: true }).eq("role", "teacher"),
      supabase.from("platform_payments").select("amount, paid_at").eq("status", "completed").order("paid_at", { ascending: true })
    ]);
    const allSchools = (s.data ?? []) as SchoolRow[];
    const allSubs = (sb.data ?? []) as Sub[];
    
    setSchools(allSchools);
    setSubs(allSubs);
    
    // Revenue chart — REAL payment data only, no fabricated numbers
    const revMap = new Map<string, number>();
    if (paymentsRows.data) {
      paymentsRows.data.forEach(p => {
        const month = new Date(p.paid_at).toLocaleString('default', { month: 'short', year: '2-digit' });
        revMap.set(month, (revMap.get(month) ?? 0) + Number(p.amount));
      });
    }
    setRevenueData(Array.from(revMap.entries()).map(([month, amount]) => ({ month, amount })));

    setCounts({ 
      students: st.count ?? 0, 
      teachers: tr.count ?? 0,
      trial: allSubs.filter(sub => sub.status === 'trialing' || (sub.trial_end && new Date(sub.trial_end) > new Date())).length,
      expired: allSubs.filter(sub => sub.status === 'expired' || sub.status === 'canceled').length,
      pendingPayments: 0 // Will implement real pending payments via platform_invoices later
    });
    setLoading(false);
  };

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("schools").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(status === "active" ? "School activated" : "School suspended");
    void loadAll();
  };

  const removeSchool = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This permanently removes the school and all its data.`)) return;
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("School deleted");
    void loadAll();
  };

  if (!isSuper) {
    return (
      <>
        <PageHeader title="Platform" breadcrumb="Restricted" />
        <div className="p-8">
          <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center">
            <Globe2 className="size-10 text-muted-foreground mx-auto" />
            <h2 className="mt-3 font-semibold">Super admin only</h2>
            <p className="text-sm text-muted-foreground mt-1">
              You need the platform owner role to view this page.
            </p>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const active = schools.filter((s) => s.status === "active").length;
  const revenue = subs.filter((s) => s.status === "active").reduce((a, b) => a + Number(b.monthly_amount), 0);

  return (
    <>
      <PageHeader
        title="Platform"
        breadcrumb="Super Admin"
        actions={
          <button
            onClick={() => setWizardOpen(true)}
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1"
          >
            <Plus className="size-4" /> Add school
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          <Kpi icon={Building2} label="Total Schools" value={schools.length} sub={`${active} active`} />
          <Kpi
            icon={BadgeDollarSign}
            label="MRR (Monthly)"
            value={`$${revenue.toLocaleString()}`}
            tone="brand"
          />
          <Kpi
            icon={BadgeDollarSign}
            label="Annual Revenue"
            value={`$${(revenue * 12).toLocaleString()}`}
            tone="brand"
          />
          <Kpi icon={Users} label="Trial / Expired" value={`${counts.trial} / ${counts.expired}`} />
        </div>

        <section className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold mb-6">Revenue Growth</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `$${val}`} />
                <RechartsTooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">All schools</h2>
            <span className="text-xs text-muted-foreground">{schools.length} total</span>
          </div>
          {loading ? (
            <div className="p-8 text-sm text-muted-foreground">Loading…</div>
          ) : schools.length === 0 ? (
            <div className="p-10 text-sm text-muted-foreground text-center">
              No schools yet. Click "Add school" to provision the first tenant.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-5 py-3">School</th>
                    <th className="text-left px-5 py-3">Code</th>
                    <th className="text-left px-5 py-3">Plan</th>
                    <th className="text-left px-5 py-3">Limits</th>
                    <th className="text-left px-5 py-3">Status</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {schools.map((s) => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium">{s.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.code || "—"}</td>
                      <td className="px-5 py-3 capitalize">{s.plan}</td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {s.student_limit} students · {s.teacher_limit} teachers
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            s.status === "active"
                              ? "bg-brand-soft text-brand"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          {s.status === "active" ? (
                            <button
                              onClick={() => setStatus(s.id, "suspended")}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted"
                            >
                              <Pause className="size-3" /> Suspend
                            </button>
                          ) : (
                            <button
                              onClick={() => setStatus(s.id, "active")}
                              className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-muted"
                            >
                              <Play className="size-3" /> Activate
                            </button>
                          )}
                          <button
                            onClick={() => {
                              // Enter school context without modifying the database
                              enterSchool({
                                id: s.id,
                                name: s.name,
                                code: s.code,
                                logo_url: s.logo_url ?? null,
                                address: s.address ?? null,
                                phone: s.phone ?? null,
                                email: s.email ?? null,
                                status: s.status,
                              });
                              void navigate({ to: "/dashboard" });
                            }}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-brand-soft hover:text-brand"
                            title="Enter School Dashboard"
                          >
                            <ArrowRight className="size-3" /> Enter
                          </button>
                          <button
                            onClick={() => removeSchool(s.id, s.name)}
                            className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded-md hover:bg-danger-soft hover:text-danger"
                            title="Delete School"
                          >
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <p className="text-xs text-muted-foreground">
          Tip: switch into any school via{" "}
          <Link to="/admin" className="text-brand font-medium">
            Admin Panel → Schools
          </Link>{" "}
          (you'll need an admin role in that school).
        </p>
      </div>

      {wizardOpen && (
        <CreateSchoolWizard
          onClose={() => setWizardOpen(false)}
          onCreated={() => {
            setWizardOpen(false);
            void loadAll();
          }}
        />
      )}
    </>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: typeof Building2;
  label: string;
  value: number | string;
  sub?: string;
  tone?: "brand";
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <h3 className={`text-3xl font-bold mt-2 ${tone === "brand" ? "text-brand" : "text-foreground"}`}>
        {value}
      </h3>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function CreateSchoolWizard({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const provision = useServerFn(provisionSchool);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    email: "",
    phone: "",
    logo_url: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    plan: "starter" as "starter" | "professional" | "enterprise",
    billing_cycle: "monthly" as "monthly" | "quarterly" | "yearly",
    student_limit: 500,
    teacher_limit: 50,
    monthly_amount: 0,
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await provision({
        data: {
          school: {
            name: form.name.trim(),
            code: form.code.trim(),
            address: form.address || undefined,
            email: form.email || null,
            phone: form.phone || null,
            logo_url: form.logo_url || null,
            plan: form.plan,
            billing_cycle: form.billing_cycle,
            student_limit: Number(form.student_limit),
            teacher_limit: Number(form.teacher_limit),
            monthly_amount: Number(form.monthly_amount),
          },
          admin: {
            full_name: form.admin_name.trim(),
            email: form.admin_email.trim(),
            password: form.admin_password,
          },
        },
      });
      toast.success(`Created "${form.name}"`);
      onCreated();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : String(err);
      toast.error(msg || "Failed to create school");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        onSubmit={submit}
        className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden"
      >
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Step {step} of 3
            </p>
            <h2 className="text-lg font-semibold">
              {step === 1 ? "School details" : step === 2 ? "School admin" : "Plan & limits"}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted rounded">
            <X className="size-4" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="School name" required>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="School code" required>
                <input
                  required
                  value={form.code}
                  onChange={(e) => set("code", e.target.value.toUpperCase())}
                  placeholder="HEZO-001"
                  className={inputCls}
                />
              </Field>
              <Field label="Address" className="col-span-2">
                <input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Phone">
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Logo URL" className="col-span-2">
                <input
                  type="url"
                  value={form.logo_url}
                  onChange={(e) => set("logo_url", e.target.value)}
                  className={inputCls}
                />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Admin name" required className="col-span-2">
                <input
                  required
                  value={form.admin_name}
                  onChange={(e) => set("admin_name", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Admin email" required>
                <input
                  required
                  type="email"
                  value={form.admin_email}
                  onChange={(e) => set("admin_email", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <Field label="Temporary password" required>
                <input
                  required
                  type="text"
                  minLength={8}
                  value={form.admin_password}
                  onChange={(e) => set("admin_password", e.target.value)}
                  className={inputCls}
                />
              </Field>
              <p className="col-span-2 text-xs text-muted-foreground">
                The admin will receive these credentials from you and can change the password
                after signing in.
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-3 gap-4">
              <Field label="Plan" className="col-span-3">
                <div className="grid grid-cols-3 gap-2">
                  {(["starter", "professional", "enterprise"] as const).map((p) => (
                    <button
                      type="button"
                      key={p}
                      onClick={() => set("plan", p)}
                      className={`px-3 py-3 rounded-lg border text-sm font-medium capitalize ${
                        form.plan === p
                          ? "border-brand bg-brand-soft text-brand"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Billing Cycle" className="col-span-3">
                <div className="grid grid-cols-3 gap-2">
                  {(["monthly", "quarterly", "yearly"] as const).map((b) => (
                    <button
                      type="button"
                      key={b}
                      onClick={() => set("billing_cycle", b)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium capitalize ${
                        form.billing_cycle === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Student limit">
                <input
                  type="number"
                  min={10}
                  value={form.student_limit}
                  onChange={(e) => set("student_limit", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
              <Field label="Teacher limit">
                <input
                  type="number"
                  min={1}
                  value={form.teacher_limit}
                  onChange={(e) => set("teacher_limit", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
              <Field label="Base fee (USD)">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.monthly_amount}
                  onChange={(e) => set("monthly_amount", Number(e.target.value))}
                  className={inputCls}
                />
              </Field>
            </div>
          )}
        </div>

        <footer className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 1 ? onClose() : setStep(step - 1))}
            className="text-sm px-3 py-1.5 border border-border rounded-md hover:bg-muted"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && (!form.name.trim() || !form.code.trim())) ||
                (step === 2 &&
                  (!form.admin_name.trim() ||
                    !form.admin_email.trim() ||
                    form.admin_password.length < 8))
              }
              className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 disabled:opacity-50"
            >
              Next <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create school"}
            </button>
          )}
        </footer>
      </form>
    </div>
  );
}

const inputCls =
  "mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring";

function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium">
        {label} {required && <span className="text-danger">*</span>}
      </span>
      {children}
    </label>
  );
}
