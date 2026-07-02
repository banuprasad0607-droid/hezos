import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  Receipt,
  FileText,
  Layers,
  Printer,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  CircleDollarSign,
  X,
  Search,
  Download,
} from "lucide-react";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export-helper";
import { whatsappService } from "@/lib/whatsapp-service";

export const Route = createFileRoute("/_authenticated/fees")({
  component: FeesPage,
});

type ClassRow = { id: string; name: string };
type StudentRow = {
  id: string;
  full_name: string;
  class_id: string | null;
  parent_user_id?: string | null;
  emergency_contact?: string | null;
};
type Structure = {
  id: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  class_id: string | null;
};
type Invoice = {
  id: string;
  student_id: string;
  title: string;
  period: string;
  amount_due: number;
  amount_paid: number;
  status: string;
  due_date: string | null;
  students?: { full_name: string } | null;
};
type Payment = {
  id: string;
  invoice_id: string;
  amount: number;
  method: string;
  reference: string | null;
  paid_on: string;
  created_at: string;
  fee_invoices?: {
    student_id: string;
    title: string;
    students?: { full_name: string } | null;
  } | null;
};

type Tab = "overview" | "structures" | "invoices" | "payments";

function FeesPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    currentSchool,
    roles,
    user,
    loading: tenantLoading,
  } = useTenant();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  usePageTitle("Fees");
  const displaySchoolName = currentSchool?.name ?? "School";
  const [tab, setTab] = useState<Tab>("overview");

  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [structures, setStructures] = useState<Structure[]>([]);

  // Total totals for KPIs (loaded on init)
  const [kpiInvoices, setKpiInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    if (!effectiveSchoolId) return;
    setLoading(true);
    try {
      const [c, s, fs, fi] = await Promise.all([
        supabase
          .from("classes")
          .select("id, name")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("name"),
        supabase
          .from("students")
          .select("id, full_name, class_id, parent_user_id, emergency_contact")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("full_name"),
        supabase
          .from("fee_structures")
          .select("*")
          .eq("school_id", effectiveSchoolId)
          .order("created_at", { ascending: false }),
        supabase
          .from("fee_invoices")
          .select("amount_due, amount_paid, status, due_date")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null),
      ]);
      setClasses(c.data ?? []);
      setStudents(s.data ?? []);
      setStructures((fs.data ?? []) as Structure[]);
      setKpiInvoices((fi.data ?? []) as Invoice[]);
    } catch (err: any) {
      toast.error(err.message || "Failed to load fee configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, [effectiveSchoolId]);

  const kpis = useMemo(() => {
    const billed = kpiInvoices.reduce((s, i) => s + Number(i.amount_due), 0);
    const collected = kpiInvoices.reduce((s, i) => s + Number(i.amount_paid), 0);
    const outstanding = billed - collected;
    const overdue = kpiInvoices.filter(
      (i) => i.status !== "paid" && i.due_date && new Date(i.due_date) < new Date(),
    ).length;
    return { billed, collected, outstanding, overdue };
  }, [kpiInvoices]);

  const studentName = (id: string) => students.find((s) => s.id === id)?.full_name ?? "—";
  const className = (id: string | null) =>
    id ? (classes.find((c) => c.id === id)?.name ?? "—") : "All classes";

  if (!isAdmin) {
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
        <PageHeader title="Fees" breadcrumb="Restricted" />
        <div className="p-8 text-sm text-muted-foreground bg-background text-foreground">
          Admin access required.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Fees" breadcrumb="Finance" />
      <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-background text-foreground">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Kpi icon={CircleDollarSign} label="Billed" value={fmt(kpis.billed)} />
          <Kpi icon={CheckCircle2} label="Collected" value={fmt(kpis.collected)} tone="success" />
          <Kpi icon={TrendingUp} label="Outstanding" value={fmt(kpis.outstanding)} tone="brand" />
          <Kpi
            icon={AlertCircle}
            label="Overdue invoices"
            value={String(kpis.overdue)}
            tone="danger"
          />
        </div>

        {/* Tabs */}
        <div className="border-b border-border flex gap-1 overflow-x-auto">
          {(["overview", "structures", "invoices", "payments"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-semibold border-b-2 -mb-px capitalize transition cursor-pointer ${
                tab === t
                  ? "border-brand text-brand"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-12 text-sm text-muted-foreground text-center">
            Syncing dashboard statistics...
          </div>
        ) : tab === "overview" ? (
          <OverviewTab schoolId={effectiveSchoolId!} studentName={studentName} />
        ) : tab === "structures" ? (
          <StructuresTab
            schoolId={effectiveSchoolId!}
            classes={classes}
            structures={structures}
            onChanged={loadAll}
          />
        ) : tab === "invoices" ? (
          <InvoicesTab
            schoolId={effectiveSchoolId!}
            classes={classes}
            students={students}
            structures={structures}
            studentName={studentName}
            className={className}
            onChanged={loadAll}
          />
        ) : (
          <PaymentsTab
            schoolId={effectiveSchoolId!}
            userId={user!.id}
            studentName={studentName}
            schoolName={displaySchoolName}
            onChanged={loadAll}
          />
        )}
      </div>
    </>
  );
}

/* ------------------------------- Overview ------------------------------- */

function OverviewTab({
  schoolId,
  studentName,
}: {
  schoolId: string;
  studentName: (id: string) => string;
}) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchOverview = async () => {
      const [fi, fp] = await Promise.all([
        supabase
          .from("fee_invoices")
          .select("*")
          .eq("school_id", schoolId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(8),
        supabase
          .from("fee_payments")
          .select("*, fee_invoices(student_id)")
          .eq("school_id", schoolId)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(8),
      ]);
      setInvoices((fi.data ?? []) as Invoice[]);
      setPayments((fp.data ?? []) as unknown as Payment[]);
    };
    void fetchOverview();
  }, [schoolId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title="Recent invoices" icon={FileText}>
        {invoices.length === 0 ? (
          <Empty text="No invoices yet." />
        ) : (
          <ul className="divide-y divide-border">
            {invoices.map((i) => (
              <li
                key={i.id}
                className="px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate text-foreground">{i.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {studentName(i.student_id)} · {i.period}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {fmt(Number(i.amount_due))}
                  </p>
                  <StatusBadge status={i.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
      <Card title="Recent payments" icon={Receipt}>
        {payments.length === 0 ? (
          <Empty text="No payments yet." />
        ) : (
          <ul className="divide-y divide-border">
            {payments.map((p) => {
              const studentId = p.fee_invoices?.student_id || "";
              return (
                <li
                  key={p.id}
                  className="px-5 py-3 flex items-center justify-between hover:bg-secondary/20 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate text-foreground">
                      {studentId ? studentName(studentId) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {p.method.toUpperCase()} · {p.paid_on}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-success">+{fmt(Number(p.amount))}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}

/* ------------------------------- Structures ----------------------------- */

function StructuresTab({
  schoolId,
  classes,
  structures,
  onChanged,
}: {
  schoolId: string;
  classes: ClassRow[];
  structures: Structure[];
  onChanged: () => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("tuition");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [classId, setClassId] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const amt = Number(amount);
    if (!name.trim() || !amt) return;
    setSaving(true);
    const { error } = await supabase.from("fee_structures").insert({
      school_id: schoolId,
      name: name.trim(),
      category,
      amount: amt,
      frequency,
      class_id: classId || null,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Fee structure added");
    setName("");
    setAmount("");
    onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this fee structure?")) return;
    const { error } = await supabase
      .from("fee_structures")
      .delete()
      .eq("id", id)
      .eq("school_id", schoolId);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    onChanged();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
      <form
        onSubmit={submit}
        className="bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs"
      >
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">New fee structure</h2>
        </div>
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Monthly Tuition"
            className={inputCls}
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
            >
              <option value="tuition">Tuition</option>
              <option value="transport">Transport</option>
              <option value="exam">Exam</option>
              <option value="other">Other</option>
            </select>
          </Field>
          <Field label="Frequency">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className={inputCls}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
              <option value="one_time">One time</option>
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount">
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Class (optional)">
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              className={inputCls}
            >
              <option value="">All classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <button
          disabled={saving}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90"
        >
          <Plus className="size-4" />
          {saving ? "Adding…" : "Add structure"}
        </button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Fee structures</h2>
        </div>
        {structures.length === 0 ? (
          <Empty text="No fee structures yet." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-xs text-muted-foreground">
              <tr>
                <Th>Name</Th>
                <Th>Class</Th>
                <Th>Category</Th>
                <Th>Frequency</Th>
                <Th className="text-right">Amount</Th>
                <Th />
              </tr>
            </thead>
            <tbody>
              {structures.map((s) => (
                <tr
                  key={s.id}
                  className="border-t border-border hover:bg-secondary/20 transition-colors"
                >
                  <Td className="font-medium text-foreground">{s.name}</Td>
                  <Td className="text-muted-foreground">
                    {s.class_id
                      ? (classes.find((c) => c.id === s.class_id)?.name ?? "—")
                      : "All classes"}
                  </Td>
                  <Td className="capitalize text-muted-foreground">{s.category}</Td>
                  <Td className="capitalize text-muted-foreground">
                    {s.frequency.replace("_", " ")}
                  </Td>
                  <Td className="text-right font-semibold text-foreground">
                    {fmt(Number(s.amount))}
                  </Td>
                  <Td className="text-right">
                    <button
                      onClick={() => remove(s.id)}
                      className="text-xs text-danger hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- Invoices ------------------------------ */

function InvoicesTab({
  schoolId,
  classes,
  students,
  structures,
  studentName,
  className,
  onChanged,
}: {
  schoolId: string;
  classes: ClassRow[];
  students: StudentRow[];
  structures: Structure[];
  studentName: (id: string) => string;
  className: (id: string | null) => string;
  onChanged: () => void;
}) {
  const [structureId, setStructureId] = useState("");
  const [period, setPeriod] = useState(() => new Date().toISOString().slice(0, 7));
  const [dueDate, setDueDate] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [generating, setGenerating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Server-Side Search & Pagination States
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [localInvoices, setLocalInvoices] = useState<Invoice[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  const fetchInvoices = async () => {
    if (!schoolId) return;
    setFetching(true);
    try {
      let query = supabase
        .from("fee_invoices")
        .select("*, students!inner(full_name, class_id)", { count: "exact" })
        .eq("school_id", schoolId)
        .is("deleted_at", null);

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const targetClass = classFilter;
      if (targetClass) {
        query = query.eq("students.class_id", targetClass);
      }

      if (debouncedQ.trim()) {
        query = query.ilike("students.full_name", `%${debouncedQ.trim()}%`);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;
      setLocalInvoices(
        ((data ?? []) as any[]).map((i) => ({
          ...i,
          students: Array.isArray(i.students) ? (i.students[0] ?? null) : i.students,
        })) as Invoice[],
      );
      setTotalCount(count ?? 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load invoices.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void fetchInvoices();
  }, [schoolId, debouncedQ, page, statusFilter, classFilter]);

  const generate = async (e: FormEvent) => {
    e.preventDefault();
    const struct = structures.find((s) => s.id === structureId);
    if (!struct) return toast.error("Pick a fee structure");
    const targetClassId = classFilter || struct.class_id;
    const eligible = students.filter((s) => (targetClassId ? s.class_id === targetClassId : true));
    if (eligible.length === 0) return toast.error("No students match");
    setGenerating(true);
    const rows = eligible.map((s) => ({
      school_id: schoolId,
      student_id: s.id,
      fee_structure_id: struct.id,
      title: struct.name,
      period,
      amount_due: struct.amount,
      amount_paid: 0,
      status: "pending",
      due_date: dueDate || null,
    }));
    const { error } = await supabase.from("fee_invoices").insert(rows);
    setGenerating(false);
    if (error) return toast.error(error.message);
    toast.success(`Generated ${rows.length} invoice${rows.length === 1 ? "" : "s"}`);

    // Trigger WhatsApp fee alerts to parents of these students
    void (async () => {
      try {
        const templates = await whatsappService.getTemplates(schoolId!);
        const template = templates.find((t) => t.name === "fee_due_reminder");
        if (template) {
          for (const s of eligible) {
            const phone = s.emergency_contact || "+91 90000 00000";
            const amtStr = `₹${struct.amount}`;
            const payUrl = `http://localhost:8080/parent?pay=true`;
            // Variables: ["amount", "student_name", "due_date", "payment_link"]
            await whatsappService.sendTemplateMessage(
              schoolId!,
              phone,
              template.id!,
              [amtStr, s.full_name, dueDate || "June 30, 2026", payUrl],
              s.id,
              s.parent_user_id,
            );
          }
          toast.success("WhatsApp fee reminders dispatched to parents.");
        }
      } catch (err) {
        console.error("WhatsApp fee reminder broadcast failed:", err);
      }
    })();

    void fetchInvoices();
    onChanged();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this invoice? This will move it to the Recycle Bin.")) return;

    // Soft delete invoice
    const { error } = await (supabase as any)
      .from("fee_invoices")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .eq("school_id", schoolId);

    if (error) return toast.error(error.message);

    // Soft delete related payments
    await (supabase as any)
      .from("fee_payments")
      .update({ deleted_at: new Date().toISOString() })
      .eq("invoice_id", id)
      .eq("school_id", schoolId);

    toast.success("Invoice moved to Recycle Bin.");
    void fetchInvoices();
    onChanged();
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    toast.info("Preparing data for download...");
    const { data, error } = await supabase
      .from("fee_invoices")
      .select("title, period, amount_due, amount_paid, status, due_date, students(full_name)")
      .eq("school_id", schoolId)
      .is("deleted_at", null);

    if (error || !data) return toast.error("Export query failed.");

    const headers = [
      "Student",
      "Title",
      "Period",
      "Due Date",
      "Amount Due",
      "Amount Paid",
      "Status",
    ];
    const rows = data.map((i: any) => [
      i.students?.full_name || "—",
      i.title,
      i.period,
      i.due_date || "—",
      i.amount_due,
      i.amount_paid,
      i.status,
    ]);

    if (format === "csv") exportToCSV("Fee_Invoices", headers, rows);
    else if (format === "excel") exportToExcel("Fee_Invoices", headers, rows);
    else if (format === "pdf") exportToPDF("Fee_Invoices", "Fee Invoices Roster", headers, rows);
    toast.success("Export started!");
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={generate}
        className="bg-card border border-border rounded-xl p-5 grid grid-cols-1 md:grid-cols-5 gap-3 items-end text-card-foreground shadow-xs"
      >
        <Field label="Fee structure">
          <select
            value={structureId}
            onChange={(e) => setStructureId(e.target.value)}
            className={inputCls}
            required
          >
            <option value="">— select —</option>
            {structures.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({fmt(Number(s.amount))})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Period">
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className={inputCls}
            required
          />
        </Field>
        <Field label="Due date">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={inputCls}
          />
        </Field>
        <Field label="Class (override)">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className={inputCls}
          >
            <option value="">From structure</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <button
          disabled={generating}
          className="py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90"
        >
          <FileText className="size-4" />
          {generating ? "Generating…" : "Generate invoices"}
        </button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
        <div className="px-5 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 bg-secondary/10">
          <h2 className="text-sm font-semibold text-foreground">Invoices ({totalCount})</h2>

          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative w-44">
              <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search Student..."
                className="w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(0);
              }}
              className="text-xs border border-border rounded-md px-2 py-1 bg-background text-foreground outline-none"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>

            <div className="flex gap-1 border border-border rounded-md overflow-hidden bg-background">
              <button
                onClick={() => handleExport("csv")}
                className="p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors"
              >
                CSV
              </button>
              <button
                onClick={() => handleExport("excel")}
                className="p-1 hover:bg-secondary text-[10px] font-bold px-2 border-r border-border transition-colors"
              >
                XLS
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="p-1 hover:bg-secondary text-[10px] font-bold px-2 transition-colors"
              >
                PDF
              </button>
            </div>
          </div>
        </div>

        {fetching && localInvoices.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Loading invoices...</div>
        ) : localInvoices.length === 0 ? (
          <Empty text="No invoices match." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <Th>Student</Th>
                  <Th>Title</Th>
                  <Th>Period</Th>
                  <Th>Due</Th>
                  <Th className="text-right">Due amt</Th>
                  <Th className="text-right">Paid</Th>
                  <Th>Status</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {localInvoices.map((i) => {
                  const balance = Number(i.amount_due) - Number(i.amount_paid);
                  const overdue =
                    i.status !== "paid" && i.due_date && new Date(i.due_date) < new Date();
                  const sName = i.students?.full_name || studentName(i.student_id);
                  return (
                    <tr
                      key={i.id}
                      className="border-t border-border hover:bg-secondary/20 transition-colors"
                    >
                      <Td className="font-medium text-foreground">{sName}</Td>
                      <Td className="text-foreground">{i.title}</Td>
                      <Td className="text-muted-foreground">{i.period}</Td>
                      <Td className={overdue ? "text-danger font-medium" : "text-muted-foreground"}>
                        {i.due_date ?? "—"}
                      </Td>
                      <Td className="text-right text-foreground">{fmt(Number(i.amount_due))}</Td>
                      <Td className="text-right text-foreground">
                        {fmt(Number(i.amount_paid))}
                        {balance > 0 && (
                          <span className="block text-[10px] text-muted-foreground">
                            bal {fmt(balance)}
                          </span>
                        )}
                      </Td>
                      <Td>
                        <StatusBadge status={i.status} />
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => remove(i.id)}
                          className="text-xs text-danger hover:underline cursor-pointer"
                        >
                          Delete
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground">
          <p className="text-xs text-muted-foreground">
            Showing {totalCount > 0 ? page * pageSize + 1 : 0} to{" "}
            {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} invoices
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
      </div>
    </div>
  );
}

/* -------------------------------- Payments ------------------------------ */

function PaymentsTab({
  schoolId,
  userId,
  studentName,
  schoolName,
  onChanged,
}: {
  schoolId: string;
  userId: string;
  studentName: (id: string) => string;
  schoolName: string;
  onChanged: () => void;
}) {
  const [invoiceId, setInvoiceId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("cash");
  const [reference, setReference] = useState("");
  const [saving, setSaving] = useState(false);
  const [receipt, setReceipt] = useState<Payment | null>(null);

  // Load active open invoices for selectors
  const [openInvoices, setOpenInvoices] = useState<Invoice[]>([]);
  const selected = openInvoices.find((i) => i.id === invoiceId);
  const balance = selected ? Number(selected.amount_due) - Number(selected.amount_paid) : 0;

  // Paginated payments list
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [localPayments, setLocalPayments] = useState<Payment[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQ(q);
      setPage(0);
    }, 400);
    return () => clearTimeout(timer);
  }, [q]);

  const loadOpenInvoices = async () => {
    const { data } = await supabase
      .from("fee_invoices")
      .select("*, students(full_name)")
      .eq("school_id", schoolId)
      .is("deleted_at", null)
      .or("status.eq.pending,status.eq.partial");

    setOpenInvoices(
      ((data ?? []) as any[]).map((i) => ({
        ...i,
        students: Array.isArray(i.students) ? (i.students[0] ?? null) : i.students,
      })) as Invoice[],
    );
  };

  const fetchPayments = async () => {
    setFetching(true);
    try {
      let query = supabase
        .from("fee_payments")
        .select("*, fee_invoices!inner(student_id, title, students!inner(full_name))", {
          count: "exact",
        })
        .eq("school_id", schoolId)
        .is("deleted_at", null);

      if (debouncedQ.trim()) {
        query = query.ilike("fee_invoices.students.full_name", `%${debouncedQ.trim()}%`);
      }

      const start = page * pageSize;
      const end = start + pageSize - 1;

      const { data, count, error } = await query
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;
      setLocalPayments(data as unknown as Payment[]);
      setTotalCount(count ?? 0);
    } catch (err: any) {
      toast.error(err.message || "Failed to load payments.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    void loadOpenInvoices();
    void fetchPayments();
  }, [schoolId, debouncedQ, page]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return toast.error("Pick an invoice");
    const amt = Number(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    if (amt > balance + 0.001) return toast.error(`Amount exceeds balance of ${fmt(balance)}`);
    setSaving(true);

    const { data: payRow, error: payErr } = await supabase
      .from("fee_payments")
      .insert({
        school_id: schoolId,
        invoice_id: selected.id,
        amount: amt,
        method,
        reference: reference.trim() || null,
        collected_by: userId,
      })
      .select()
      .single();

    if (payErr) {
      setSaving(false);
      return toast.error(payErr.message);
    }

    const newPaid = Number(selected.amount_paid) + amt;
    const newStatus = newPaid >= Number(selected.amount_due) - 0.001 ? "paid" : "partial";

    const { error: updErr } = await supabase
      .from("fee_invoices")
      .update({ amount_paid: newPaid, status: newStatus })
      .eq("id", selected.id);

    setSaving(false);
    if (updErr) return toast.error(updErr.message);

    toast.success("Payment recorded");
    setAmount("");
    setReference("");
    setReceipt(payRow as Payment);
    void loadOpenInvoices();
    void fetchPayments();
    onChanged();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
      <form
        onSubmit={submit}
        className="bg-card border border-border rounded-xl p-5 space-y-3 h-fit text-card-foreground shadow-xs"
      >
        <div className="flex items-center gap-2">
          <Receipt className="size-4 text-brand" />
          <h2 className="text-sm font-semibold text-foreground">Record payment</h2>
        </div>
        <Field label="Invoice">
          <select
            value={invoiceId}
            onChange={(e) => {
              setInvoiceId(e.target.value);
              const inv = openInvoices.find((i) => i.id === e.target.value);
              if (inv) setAmount(String(Number(inv.amount_due) - Number(inv.amount_paid)));
            }}
            className={inputCls}
            required
          >
            <option value="">— select open invoice —</option>
            {openInvoices.map((i) => {
              const studentNameVal = i.students?.full_name || studentName(i.student_id);
              return (
                <option key={i.id} value={i.id}>
                  {studentNameVal} · {i.title} · bal{" "}
                  {fmt(Number(i.amount_due) - Number(i.amount_paid))}
                </option>
              );
            })}
          </select>
        </Field>
        {selected && (
          <div className="text-xs text-muted-foreground bg-secondary/35 rounded-md p-2">
            Due {fmt(Number(selected.amount_due))} · Paid {fmt(Number(selected.amount_paid))} ·{" "}
            <span className="font-semibold text-foreground">Balance {fmt(balance)}</span>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount">
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
              required
            />
          </Field>
          <Field label="Method">
            <select value={method} onChange={(e) => setMethod(e.target.value)} className={inputCls}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="card">Card</option>
              <option value="cheque">Cheque</option>
            </select>
          </Field>
        </div>
        <Field label="Reference (optional)">
          <input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Txn id / cheque #"
            className={inputCls}
          />
        </Field>
        <button
          disabled={saving || !invoiceId}
          className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer hover:opacity-90"
        >
          <Plus className="size-4" />
          {saving ? "Saving…" : "Record payment"}
        </button>
      </form>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-secondary/10 flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-foreground">Recent payments ({totalCount})</h2>

          <div className="relative w-44">
            <Search className="size-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Student..."
              className="w-full pl-8 pr-2 py-1 text-xs border border-border rounded-md bg-background text-foreground outline-none"
            />
          </div>
        </div>

        {fetching && localPayments.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">Loading payments...</div>
        ) : localPayments.length === 0 ? (
          <Empty text="No payments yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/40 text-xs text-muted-foreground">
                <tr>
                  <Th>Date</Th>
                  <Th>Student</Th>
                  <Th>Method</Th>
                  <Th>Reference</Th>
                  <Th className="text-right">Amount</Th>
                  <Th />
                </tr>
              </thead>
              <tbody>
                {localPayments.map((p) => {
                  const sName =
                    p.fee_invoices?.students?.full_name ||
                    (p.fee_invoices ? studentName(p.fee_invoices.student_id) : "—");
                  return (
                    <tr
                      key={p.id}
                      className="border-t border-border hover:bg-secondary/20 transition-colors"
                    >
                      <Td className="text-muted-foreground">{p.paid_on}</Td>
                      <Td className="font-medium text-foreground">{sName}</Td>
                      <Td className="capitalize text-muted-foreground">{p.method}</Td>
                      <Td className="text-muted-foreground">{p.reference ?? "—"}</Td>
                      <Td className="text-right font-semibold text-foreground">
                        {fmt(Number(p.amount))}
                      </Td>
                      <Td className="text-right">
                        <button
                          onClick={() => setReceipt(p)}
                          className="text-xs text-brand hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="size-3" /> Receipt
                        </button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-4 bg-secondary/10 border-t border-border text-foreground">
          <p className="text-xs text-muted-foreground">
            Showing {totalCount > 0 ? page * pageSize + 1 : 0} to{" "}
            {Math.min((page + 1) * pageSize, totalCount)} of {totalCount} payments
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
      </div>

      {receipt && (
        <ReceiptModal
          payment={receipt}
          invoice={receipt.fee_invoices as any}
          studentName={studentName}
          schoolName={schoolName}
          onClose={() => setReceipt(null)}
        />
      )}
    </div>
  );
}

/* ------------------------------ Receipt modal --------------------------- */

function ReceiptModal({
  payment,
  invoice,
  studentName,
  schoolName,
  onClose,
}: {
  payment: Payment;
  invoice: Invoice | null;
  studentName: (id: string) => string;
  schoolName: string;
  onClose: () => void;
}) {
  const sName = invoice?.students?.full_name || (invoice ? studentName(invoice.student_id) : "—");
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 print:bg-white print:p-0">
      <div className="bg-card text-card-foreground rounded-xl w-full max-w-md shadow-xl print:shadow-none print:rounded-none">
        <div className="flex items-center justify-between px-5 py-3 border-b border-border print:hidden">
          <h3 className="font-semibold text-sm">Payment receipt</h3>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="p-6 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-base text-foreground">{schoolName}</p>
              <p className="text-xs text-muted-foreground">Official receipt</p>
            </div>
            <Receipt className="size-6 text-brand" />
          </div>
          <hr className="border-border" />
          <Row k="Receipt #" v={payment.id.slice(0, 8).toUpperCase()} />
          <Row k="Date" v={payment.paid_on} />
          {invoice && <Row k="Student" v={sName} />}
          {invoice && <Row k="Invoice" v={`${invoice.title} (${invoice.period})`} />}
          <Row k="Method" v={payment.method.toUpperCase()} />
          {payment.reference && <Row k="Reference" v={payment.reference} />}
          <hr className="border-border" />
          <Row k="Amount paid" v={fmt(Number(payment.amount))} bold />
          {invoice && (
            <>
              <Row k="Total due" v={fmt(Number(invoice.amount_due))} />
              <Row k="Balance" v={fmt(Number(invoice.amount_due) - Number(invoice.amount_paid))} />
            </>
          )}
        </div>
        <div className="px-5 py-3 border-t border-border flex justify-end gap-2 print:hidden">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 text-sm border border-border rounded-md inline-flex items-center gap-1 hover:bg-secondary cursor-pointer"
          >
            <Printer className="size-4" /> Print
          </button>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Bits --------------------------------- */

const inputCls =
  "w-full px-3 py-2 text-sm border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold block mb-1 text-foreground">{label}</span>
      {children}
    </label>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Wallet;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs text-card-foreground">
      <div className="px-5 py-3 border-b border-border flex items-center gap-2 bg-secondary/10">
        <Icon className="size-4 text-brand" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  tone?: "brand" | "success" | "danger";
}) {
  const toneCls =
    tone === "success"
      ? "text-success"
      : tone === "danger"
        ? "text-danger"
        : tone === "brand"
          ? "text-brand"
          : "text-foreground";
  return (
    <div className="bg-card border border-border rounded-xl p-5 text-card-foreground shadow-xs">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className={`size-4 ${toneCls}`} />
      </div>
      <h3 className={`text-2xl font-bold mt-2 ${toneCls}`}>{value}</h3>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-success/15 text-success",
    partial: "bg-brand/15 text-brand",
    pending: "bg-secondary text-muted-foreground",
    overdue: "bg-danger/15 text-danger",
  };
  return (
    <span
      className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
        map[status] ?? "bg-secondary text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="p-8 text-sm text-muted-foreground text-center">{text}</div>;
}

function Th({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <th className={`text-left font-semibold px-5 py-2 ${className}`}>{children}</th>;
}

function Td({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-5 py-2 ${className}`}>{children}</td>;
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between text-foreground">
      <span className="text-muted-foreground">{k}</span>
      <span className={bold ? "font-bold text-foreground" : "font-medium text-foreground"}>
        {v}
      </span>
    </div>
  );
}

function fmt(n: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(n || 0);
}
