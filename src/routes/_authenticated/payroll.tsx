import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Plus, Wallet, Play, CheckCircle2, FileDown, Search, Download } from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-helper";

export const Route = createFileRoute("/_authenticated/payroll")({
  component: PayrollPage,
});

interface Teacher {
  user_id: string;
  full_name: string;
  email: string | null;
}
interface Salary {
  id: string;
  teacher_id: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  bank_account: string | null;
  notes: string | null;
}
interface Run {
  id: string;
  period: string;
  status: string;
  created_at: string;
  processed_at: string | null;
}
interface Item {
  id: string;
  payroll_run_id: string;
  teacher_id: string;
  base_salary: number;
  allowances: number;
  deductions: number;
  net_amount: number;
  status: string;
  paid_on: string | null;
  payment_method: string | null;
  reference: string | null;
}

type Tab = "overview" | "salaries" | "runs";

function PayrollPage() {
  const { currentSchoolId: effectiveSchoolId, user, roles, loading: tenantLoading } = useTenant();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  usePageTitle("Payroll");
  const [tab, setTab] = useState<Tab>("overview");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [activeRun, setActiveRun] = useState<string | null>(null);

  const load = async () => {
    if (!effectiveSchoolId) return;
    const [{ data: rolesRows }, { data: sals }, { data: rs }] = await Promise.all([
      supabase
        .from("user_roles")
        .select("user_id")
        .eq("school_id", effectiveSchoolId!)
        .eq("role", "teacher"),
      supabase.from("teacher_salaries").select("*").eq("school_id", effectiveSchoolId!),
      supabase
        .from("payroll_runs")
        .select("*")
        .eq("school_id", effectiveSchoolId!)
        .order("created_at", { ascending: false }),
    ]);
    const teacherIds = (rolesRows ?? []).map((r) => r.user_id);
    let profs: Teacher[] = [];
    if (teacherIds.length) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", teacherIds);
      profs = (data ?? []) as Teacher[];
    }
    setTeachers(profs);
    setSalaries((sals ?? []) as Salary[]);
    setRuns((rs ?? []) as Run[]);
    if ((rs ?? []).length && !activeRun) setActiveRun(rs![0].id);
  };

  useEffect(() => {
    void load();
  }, [effectiveSchoolId]);

  useEffect(() => {
    if (!activeRun) {
      setItems([]);
      return;
    }
    supabase
      .from("payroll_items")
      .select("*")
      .eq("payroll_run_id", activeRun)
      .eq("school_id", effectiveSchoolId!)
      .then(({ data }) => setItems((data ?? []) as Item[]));
  }, [activeRun]);

  // KPIs
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
    return (
      <div className="p-8 text-sm text-muted-foreground bg-background text-foreground">
        Admin only.
      </div>
    );

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
        title="Payroll"
        breadcrumb="Finance"
        actions={
          <div className="flex bg-secondary rounded-md p-0.5 border border-border">
            {(["overview", "salaries", "runs"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs font-semibold rounded capitalize transition cursor-pointer ${tab === t ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <KPI label="Teachers" value={teachers.length} hint="On payroll" />
              <KPI
                label="Salary profiles"
                value={salaries.length}
                hint={`${teachers.length - salaries.length} missing`}
              />
              <KPI
                label="Monthly cost"
                value={`₹${totalMonthly.toFixed(0)}`}
                hint="Net of deductions"
              />
              <KPI
                label="Last run paid"
                value={`₹${lastRunPaid.toFixed(0)}`}
                hint={
                  lastRun ? `of ₹${lastRunTotal.toFixed(0)} (${lastRun.period})` : "No runs yet"
                }
              />
            </div>
            <section className="bg-card border border-border rounded-xl p-5 text-card-foreground">
              <h3 className="font-semibold mb-3">Quick actions</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setTab("salaries")}
                  className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer"
                >
                  Configure salaries
                </button>
                <button
                  onClick={() => setTab("runs")}
                  className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md inline-flex items-center gap-1 cursor-pointer"
                >
                  <Play className="size-3" /> Process payroll
                </button>
              </div>
            </section>
          </>
        )}

        {tab === "salaries" && <SalariesTab schoolId={effectiveSchoolId!} reloadParent={load} />}

        {tab === "runs" && (
          <RunsTab
            schoolId={effectiveSchoolId!}
            userId={user!.id}
            teachers={teachers}
            salaries={salaries}
            runs={runs}
            items={items}
            activeRun={activeRun}
            setActiveRun={setActiveRun}
            reload={load}
            reloadItems={() => {
              if (activeRun)
                supabase
                  .from("payroll_items")
                  .select("*")
                  .eq("payroll_run_id", activeRun)
                  .eq("school_id", effectiveSchoolId!)
                  .then(({ data }) => setItems((data ?? []) as Item[]));
            }}
          />
        )}
      </div>
    </>
  );
}

function KPI({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs">
      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {label}
      </p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function SalariesTab({
  schoolId,
  reloadParent,
}: {
  schoolId: string;
  reloadParent: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ base: "", allow: "", ded: "", bank: "", notes: "" });

  // Server Pagination & Search States
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [salaries, setSalaries] = useState<Salary[]>([]);
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
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
        .select("user_id, full_name, email", { count: "exact" })
        .eq("school_id", schoolId)
        .in("user_id", teacherIds.length ? teacherIds : ["00000000-0000-0000-0000-000000000000"]);

      if (debouncedQ.trim()) {
        query = query.ilike("full_name", `%${debouncedQ.trim()}%`);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data: profs, count, error } = await query.order("full_name").range(start, end);

      if (error) throw error;

      setTeachers((profs ?? []) as Teacher[]);
      setTotalCount(count ?? 0);

      const pageTeacherIds = (profs ?? []).map((p) => p.user_id);
      if (pageTeacherIds.length > 0) {
        const { data: sals } = await supabase
          .from("teacher_salaries")
          .select("*")
          .eq("school_id", schoolId)
          .in("teacher_id", pageTeacherIds);
        setSalaries((sals ?? []) as Salary[]);
      } else {
        setSalaries([]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load salaries.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void loadSalariesData();
  }, [schoolId, debouncedQ, page]);

  const netVal = () => {
    const b = Number(form.base || 0);
    const a = Number(form.allow || 0);
    const d = Number(form.ded || 0);
    return b + a - d;
  };

  const startEdit = (teacherId: string) => {
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

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    const existing = salaries.find((x) => x.teacher_id === editing);
    const payload = {
      school_id: schoolId!,
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

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
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
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Export failed.");
    }
  };

  return (
    <section className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-3">
        <div>
          <h3 className="font-semibold text-base text-foreground">Teacher salary profiles</h3>
          <p className="text-xs text-muted-foreground">
            Set base salary, allowances and deductions per teacher.
          </p>
        </div>

        <div className="flex gap-2 items-center flex-wrap">
          <div className="relative w-44">
            <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Teacher..."
              className="w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none"
            />
          </div>

          <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-background">
            <button
              onClick={() => handleExport("csv")}
              className="p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground"
            >
              CSV
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors cursor-pointer text-foreground"
            >
              XLS
            </button>
            <button
              onClick={() => handleExport("pdf")}
              className="p-1 hover:bg-secondary text-[10px] font-bold px-2 transition-colors cursor-pointer text-foreground"
            >
              PDF
            </button>
          </div>
        </div>
      </div>

      {fetching && teachers.length === 0 ? (
        <div className="text-center py-12 text-sm text-muted-foreground">
          Loading salary profiles...
        </div>
      ) : teachers.length === 0 ? (
        <div className="p-10 text-center text-sm text-muted-foreground">No teachers found.</div>
      ) : (
        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 font-medium text-foreground">Teacher</th>
                <th className="px-6 py-3 font-medium text-right text-foreground">Base</th>
                <th className="px-6 py-3 font-medium text-right text-foreground">Allowances</th>
                <th className="px-6 py-3 font-medium text-right text-foreground">Deductions</th>
                <th className="px-6 py-3 font-medium text-right text-foreground">Net</th>
                <th className="px-6 py-3 font-medium text-right text-foreground">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((t) => {
                const s = salaries.find((x) => x.teacher_id === t.user_id);
                const net = (
                  Number(s?.base_salary ?? 0) +
                  Number(s?.allowances ?? 0) -
                  Number(s?.deductions ?? 0)
                ).toFixed(0);
                return (
                  <tr key={t.user_id} className="hover:bg-secondary/40">
                    <td className="px-6 py-3">
                      <p className="font-medium text-foreground">{t.full_name || t.email}</p>
                      <p className="text-xs text-muted-foreground">{t.email}</p>
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-foreground">
                      ₹{Number(s?.base_salary ?? 0).toFixed(0)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-success">
                      +₹{Number(s?.allowances ?? 0).toFixed(0)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono text-danger">
                      -₹{Number(s?.deductions ?? 0).toFixed(0)}
                    </td>
                    <td className="px-6 py-3 text-right font-mono font-semibold text-foreground">
                      ₹{net}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button
                        onClick={() => startEdit(t.user_id)}
                        className="text-xs font-semibold text-brand hover:underline cursor-pointer"
                      >
                        {s ? "Edit" : "Set"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-xl shadow-xs text-card-foreground">
          <p className="text-xs text-muted-foreground">
            Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, totalCount)} of{" "}
            {totalCount} teachers
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

      {editing && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 text-foreground"
          onClick={() => setEditing(null)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={save}
            className="bg-card rounded-xl p-6 w-full max-w-md space-y-3 shadow-lg text-card-foreground"
          >
            <h2 className="font-semibold text-lg text-foreground">
              {teachers.find((t) => t.user_id === editing)?.full_name}
            </h2>
            <Money
              label="Base salary"
              v={form.base}
              onChange={(v) => setForm((f) => ({ ...f, base: v }))}
            />
            <Money
              label="Allowances"
              v={form.allow}
              onChange={(v) => setForm((f) => ({ ...f, allow: v }))}
            />
            <Money
              label="Deductions"
              v={form.ded}
              onChange={(v) => setForm((f) => ({ ...f, ded: v }))}
            />
            <div className="bg-secondary/60 border border-border rounded-md p-3 flex items-center justify-between text-foreground">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Net salary (auto)
                </p>
                <p className="text-[11px] text-muted-foreground">Base + Allowances − Deductions</p>
              </div>
              <p className="text-xl font-bold font-mono">₹{netVal().toFixed(0)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Bank account</label>
              <input
                value={form.bank}
                onChange={(e) => setForm({ ...form, bank: e.target.value })}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-3 py-2 text-sm border border-border rounded-md hover:bg-secondary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function Money({
  label,
  v,
  onChange,
}: {
  label: string;
  v: string;
  onChange: (v: string) => void;
}) {
  const [raw, setRaw] = useState(v);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRaw(v);
    setError(null);
  }, [v]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        inputMode="numeric"
        value={raw}
        onChange={handleChange}
        className={`mt-1 w-full px-3 py-2 text-sm font-mono border rounded-md bg-background text-foreground focus:outline-none ${error ? "border-danger" : "border-border"}`}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
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
}: {
  schoolId: string;
  userId: string;
  teachers: Teacher[];
  salaries: Salary[];
  runs: Run[];
  items: Item[];
  activeRun: string | null;
  setActiveRun: (s: string | null) => void;
  reload: () => Promise<void>;
  reloadItems: () => void;
}) {
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [showSlip, setShowSlip] = useState<Item | null>(null);

  const createRun = async () => {
    const eligible = salaries.filter((s) => Number(s.base_salary) > 0);
    if (eligible.length === 0) return toast.error("Set salaries first");
    const { data: run, error } = await supabase
      .from("payroll_runs")
      .insert({ school_id: schoolId, period, status: "draft", created_by: userId })
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

  const markPaid = async (itemId: string, method: string) => {
    const { error } = await supabase
      .from("payroll_items")
      .update({
        status: "paid",
        payment_method: method,
        paid_on: new Date().toISOString().slice(0, 10),
      })
      .eq("id", itemId)
      .eq("school_id", schoolId);
    if (error) return toast.error(error.message);
    reloadItems();
  };

  const processRun = async (runId: string) => {
    await supabase
      .from("payroll_runs")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("id", runId)
      .eq("school_id", schoolId);
    toast.success("Run marked processed");
    await reload();
  };

  const activeItems = items;
  const activeRunRec = runs.find((r) => r.id === activeRun);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-card-foreground">
      <aside className="lg:col-span-1 space-y-3">
        <div className="bg-card border border-border rounded-xl p-4 space-y-3 text-card-foreground">
          <h4 className="font-semibold text-sm text-foreground">New payroll run</h4>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground"
          />
          <button
            onClick={createRun}
            className="w-full px-3 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md inline-flex items-center justify-center gap-1 cursor-pointer"
          >
            <Plus className="size-3" /> Create run
          </button>
        </div>
        <div className="bg-card border border-border rounded-xl divide-y divide-border text-card-foreground">
          <div className="p-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Past runs
          </div>
          {runs.length === 0 ? (
            <p className="p-3 text-xs text-muted-foreground">None yet.</p>
          ) : (
            runs.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRun(r.id)}
                className={`w-full text-left p-3 text-sm flex justify-between items-center hover:bg-secondary transition cursor-pointer text-foreground ${activeRun === r.id ? "bg-secondary" : ""}`}
              >
                <div>
                  <p className="font-medium text-foreground">{r.period}</p>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.status}
                  </p>
                </div>
                {r.status === "processed" ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <Wallet className="size-4 text-muted-foreground" />
                )}
              </button>
            ))
          )}
        </div>
      </aside>

      <section className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden text-card-foreground">
        {!activeRunRec ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Select or create a payroll run.
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/10 text-foreground">
              <div>
                <h3 className="font-semibold text-foreground">{activeRunRec.period}</h3>
                <p className="text-xs text-muted-foreground">
                  {activeItems.length} teachers ·{" "}
                  {activeItems.filter((i) => i.status === "paid").length} paid
                </p>
              </div>
              {activeRunRec.status !== "processed" && (
                <button
                  onClick={() => processRun(activeRunRec.id)}
                  className="px-3 py-1.5 text-xs bg-success text-white rounded-md inline-flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="size-3" /> Mark run processed
                </button>
              )}
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-3 font-medium text-foreground">Teacher</th>
                  <th className="px-6 py-3 font-medium text-right text-foreground">Net</th>
                  <th className="px-6 py-3 font-medium text-foreground">Status</th>
                  <th className="px-6 py-3 font-medium text-right text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeItems.map((i) => {
                  const t = teachers.find((x) => x.user_id === i.teacher_id);
                  return (
                    <tr key={i.id} className="hover:bg-secondary/10">
                      <td className="px-6 py-3">
                        <p className="font-medium text-foreground">{t?.full_name ?? "Teacher"}</p>
                        <p className="text-xs text-muted-foreground">
                          Base ₹{Number(i.base_salary).toFixed(0)} +₹
                          {Number(i.allowances).toFixed(0)} -₹{Number(i.deductions).toFixed(0)}
                        </p>
                      </td>
                      <td className="px-6 py-3 text-right font-mono font-semibold text-foreground">
                        ₹{Number(i.net_amount).toFixed(0)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                            i.status === "paid"
                              ? "bg-success-soft text-success"
                              : "bg-warning-soft text-warning"
                          }`}
                        >
                          {i.status}
                        </span>
                        {i.paid_on && (
                          <span className="ml-2 text-[10px] text-muted-foreground">
                            {i.paid_on} · {i.payment_method}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowSlip(i)}
                            className="text-xs font-semibold text-brand inline-flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <FileDown className="size-3" /> Slip
                          </button>
                          {i.status !== "paid" && (
                            <>
                              <button
                                onClick={() => markPaid(i.id, "bank")}
                                className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded cursor-pointer"
                              >
                                Pay (Bank)
                              </button>
                              <button
                                onClick={() => markPaid(i.id, "cash")}
                                className="text-xs px-2 py-1 border border-border rounded cursor-pointer text-foreground"
                              >
                                Cash
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </section>

      {showSlip && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 print:bg-white"
          onClick={() => setShowSlip(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white text-black rounded-xl p-8 w-full max-w-md shadow-lg print:shadow-none"
          >
            <div className="text-center border-b border-gray-300 pb-3 mb-3">
              <h2 className="font-bold text-lg text-black">SALARY SLIP</h2>
              <p className="text-xs text-gray-600">{activeRunRec?.period}</p>
            </div>
            <p className="font-semibold text-black">
              {teachers.find((t) => t.user_id === showSlip.teacher_id)?.full_name}
            </p>
            <p className="text-xs text-gray-600 mb-3">
              {teachers.find((t) => t.user_id === showSlip.teacher_id)?.email}
            </p>
            <table className="w-full text-sm text-black">
              <tbody>
                <tr>
                  <td className="py-1">Base salary</td>
                  <td className="text-right font-mono">
                    ₹{Number(showSlip.base_salary).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">Allowances</td>
                  <td className="text-right font-mono text-green-700">
                    +₹{Number(showSlip.allowances).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td className="py-1">Deductions</td>
                  <td className="text-right font-mono text-red-700">
                    -₹{Number(showSlip.deductions).toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t border-gray-300 font-bold">
                  <td className="py-2">Net pay</td>
                  <td className="text-right font-mono">
                    ₹{Number(showSlip.net_amount).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
            {showSlip.status === "paid" && (
              <p className="text-xs text-center text-green-700 mt-3">
                PAID on {showSlip.paid_on} via {showSlip.payment_method}
              </p>
            )}
            <div className="flex gap-2 mt-4 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded text-black bg-white cursor-pointer"
              >
                Print
              </button>
              <button
                onClick={() => setShowSlip(null)}
                className="flex-1 px-3 py-2 text-sm bg-black text-white rounded cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
