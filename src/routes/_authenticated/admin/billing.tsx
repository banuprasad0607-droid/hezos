import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import {
  CreditCard,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  Clock,
  IndianRupee,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import { createRoot } from "react-dom/client";
import { InvoicePDFTemplate } from "@/components/InvoicePDFTemplate";

export const Route = createFileRoute("/_authenticated/admin/billing")({
  component: BillingPage,
});

type Invoice = {
  id: string;
  invoice_number: string;
  amount: number;
  total_amount: number;
  status: string;
  due_date: string | null;
  created_at: string;
  billing_period_start?: string | null;
  billing_period_end?: string | null;
  gst_amount?: number;
};

type SchoolData = {
  id: string;
  name: string;
  address: string | null;
  student_limit: number;
  teacher_limit: number;
};

type SubData = {
  id?: string;
  plan: string;
  status: string;
  monthly_amount: number;
  billing_cycle: string;
  trial_end?: string | null;
  current_period_end: string | null;
};

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 999,
    priceYearly: 799,
    students: 250,
    teachers: 25,
    features: [
      "Up to 250 Students",
      "Daily Student Attendance",
      "Homework & Remarks",
      "Parent Portal Access",
      "Standard CSV Export",
    ],
  },
  {
    id: "growth",
    name: "Growth (Recommended)",
    priceMonthly: 2499,
    priceYearly: 1999,
    students: 1000,
    teachers: 60,
    popular: true,
    features: [
      "Up to 1,000 Students",
      "CBSE & ICSE Term Report Cards",
      "Smart QR ID Card Generator",
      "UPI & Razorpay Fee Invoices",
      "WhatsApp Daily Digest",
      "Role-based Permissions",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceMonthly: 4999,
    priceYearly: 3999,
    students: 5000,
    teachers: 250,
    features: [
      "Unlimited Students & Staff",
      "Teacher Salary & Payroll Processing",
      "Custom School Branding & Logo",
      "Custom Report Card Designer",
      "Dedicated Phone & WhatsApp Support",
    ],
  },
];

function BillingPage() {
  const { currentSchoolId: schoolId, roles, loading: tenantLoading } = useTenant();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  usePageTitle("Billing & Subscription");

  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<SchoolData | null>(null);
  const [sub, setSub] = useState<SubData | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [counts, setCounts] = useState({ students: 0, teachers: 0 });
  const [generatingPdf, setGeneratingPdf] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<"monthly" | "yearly">("yearly");
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!schoolId || !isAdmin) return;
    loadData();
  }, [schoolId, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [sc, sb, inv, st, tr] = await Promise.all([
      supabase
        .from("schools")
        .select("id, name, address, student_limit, teacher_limit")
        .eq("id", schoolId!)
        .single(),
      supabase
        .from("subscriptions")
        .select("*")
        .eq("school_id", schoolId!)
        .maybeSingle(),
      supabase
        .from("platform_invoices")
        .select("*")
        .eq("school_id", schoolId!)
        .order("created_at", { ascending: false }),
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("school_id", schoolId!),
      supabase
        .from("user_roles")
        .select("user_id", { count: "exact", head: true })
        .eq("school_id", schoolId!)
        .eq("role", "teacher"),
    ]);

    if (sc.data) setSchool(sc.data as SchoolData);
    if (sb.data) setSub(sb.data as SubData);
    if (inv.data) setInvoices(inv.data as Invoice[]);
    setCounts({ students: st.count ?? 0, teachers: tr.count ?? 0 });
    setLoading(false);
  };

  const handleDownloadInvoice = async (invoice: Invoice) => {
    try {
      setGeneratingPdf(invoice.id);

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.top = "-9999px";
      container.style.left = "-9999px";
      document.body.appendChild(container);

      const root = createRoot(container);
      root.render(<InvoicePDFTemplate invoice={invoice} school={school!} sub={sub!} />);

      // Wait for React to render
      await new Promise((resolve) => setTimeout(resolve, 500));

      const canvas = await safeHtml2Canvas(container.firstElementChild as HTMLElement, {
        scale: 2,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${invoice.invoice_number}.pdf`);

      root.unmount();
      document.body.removeChild(container);
      toast.success("GST Tax Invoice downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPdf(null);
    }
  };

  const handlePlanUpgrade = async (planKey: string) => {
    setUpgrading(true);
    try {
      const targetPlan = PLANS.find((p) => p.id === planKey);
      if (!targetPlan) return;

      const monthlyAmt = selectedCycle === "yearly" ? targetPlan.priceYearly : targetPlan.priceMonthly;
      const periodEnd = new Date(
        Date.now() + (selectedCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .slice(0, 10);

      // 1. Update subscription in DB
      const { error: subErr } = await supabase
        .from("subscriptions")
        .upsert(
          {
            school_id: schoolId!,
            plan: planKey,
            status: "active",
            billing_cycle: selectedCycle,
            monthly_amount: monthlyAmt,
            current_period_end: periodEnd,
          },
          { onConflict: "school_id" }
        );

      if (subErr) throw new Error(subErr.message);

      // 2. Update school limits
      await supabase
        .from("schools")
        .update({
          student_limit: targetPlan.students,
          teacher_limit: targetPlan.teachers,
          plan: planKey,
        })
        .eq("id", schoolId!);

      // 3. Create a GST tax invoice
      const gstAmount = Math.round(monthlyAmt * 0.18);
      const totalAmt = monthlyAmt + gstAmount;
      const invNum = `HS-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await supabase.from("platform_invoices").insert({
        school_id: schoolId!,
        invoice_number: invNum,
        amount: monthlyAmt,
        gst_amount: gstAmount,
        total_amount: totalAmt,
        status: "paid",
        due_date: new Date().toISOString().slice(0, 10),
      });

      toast.success(`🎉 Successfully upgraded to ${targetPlan.name} Plan!`);
      setShowUpgradeModal(false);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update subscription");
    } finally {
      setUpgrading(false);
    }
  };

  if (!isAdmin) return <div className="p-8 text-center">Unauthorized</div>;
  if (loading || !sub || !school)
    return (
      <div className="flex-1 flex items-center justify-center p-8 min-h-screen">
        <Loader2 className="size-8 animate-spin text-primary mx-auto" />
      </div>
    );

  const stuPercent = Math.min(100, Math.round((counts.students / school.student_limit) * 100));
  const teaPercent = Math.min(100, Math.round((counts.teachers / school.teacher_limit) * 100));

  // Trial calculations
  const isTrial = sub.status === "trialing";
  const trialEndDate = sub.trial_end ? new Date(sub.trial_end) : null;
  const daysLeftInTrial = trialEndDate
    ? Math.max(0, Math.ceil((trialEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <>
      <PageHeader title="Billing & Subscription" breadcrumb="Admin" />
      <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
        {/* Free Trial Banner */}
        {isTrial && (
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white rounded-2xl p-6 border border-blue-500/40 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  14-Day Free Trial
                </span>
                <span className="text-xs text-blue-200">
                  {daysLeftInTrial > 0 ? `${daysLeftInTrial} days remaining` : "Trial expired"}
                </span>
              </div>
              <h3 className="text-xl font-bold">You are currently testing HEZO SCHOOL Growth Tier</h3>
              <p className="text-xs text-blue-200 max-w-xl">
                Experience full access to CBSE Report Cards, QR ID Cards, and UPI Invoicing. Upgrade anytime to keep your
                school running seamlessly.
              </p>
            </div>
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-5 py-2.5 bg-white text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:bg-slate-100 flex items-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              <Zap className="size-4 text-amber-500 fill-amber-500" />
              <span>Choose a Permanent Plan</span>
            </button>
          </div>
        )}

        {/* Current Plan Overview Card */}
        <section className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className="size-10 bg-brand-soft text-brand rounded-xl flex items-center justify-center">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold capitalize text-foreground">{sub.plan} Tier</h2>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        sub.status === "active"
                          ? "bg-success-soft text-success"
                          : sub.status === "trialing"
                          ? "bg-brand-soft text-brand"
                          : "bg-danger-soft text-danger"
                      }`}
                    >
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-0.5">
                    School ID: <span className="font-mono">{school.id.slice(0, 12)}...</span> • Billed{" "}
                    {sub.billing_cycle}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <div className="text-3xl font-extrabold text-foreground">₹{sub.monthly_amount.toLocaleString("en-IN")}</div>
              <div className="text-xs text-muted-foreground uppercase font-medium">
                Per {sub.billing_cycle === "yearly" ? "Year" : "Month"} + 18% GST
              </div>
            </div>
          </div>

          {/* Usage Meters */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
              Current Plan Quota & Usage
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-background border border-border p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Enrolled Students</span>
                  <span className="text-muted-foreground">
                    {counts.students} / {school.student_limit} students ({stuPercent}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      stuPercent > 90 ? "bg-danger" : stuPercent > 70 ? "bg-warning" : "bg-brand"
                    }`}
                    style={{ width: `${stuPercent}%` }}
                  />
                </div>
              </div>

              <div className="bg-background border border-border p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-foreground">Teacher Seats</span>
                  <span className="text-muted-foreground">
                    {counts.teachers} / {school.teacher_limit} teachers ({teaPercent}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      teaPercent > 90 ? "bg-danger" : "bg-brand"
                    }`}
                    style={{ width: `${teaPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="size-4" />
              <span>Change / Upgrade Plan</span>
            </button>
            <button
              onClick={() => toast.info("Payment methods are linked to your Indian UPI / Razorpay account.")}
              className="px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground text-sm font-semibold rounded-xl transition-all"
            >
              Manage Payment Methods
            </button>
          </div>
        </section>

        {/* GST Tax Invoices History */}
        <section className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base flex items-center gap-2 text-foreground">
                <CreditCard className="size-4 text-brand" />
                GST Tax Invoices & Billing Receipts
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Compliant with Indian GST regulations (SAC 998315 - SaaS Services).
              </p>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No platform invoices generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="text-left px-6 py-3.5">Invoice #</th>
                    <th className="text-left px-6 py-3.5">Date</th>
                    <th className="text-left px-6 py-3.5">Taxable Amount</th>
                    <th className="text-left px-6 py-3.5">GST (18%)</th>
                    <th className="text-left px-6 py-3.5">Total Paid</th>
                    <th className="text-left px-6 py-3.5">Status</th>
                    <th className="text-right px-6 py-3.5">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-3.5 font-bold font-mono text-xs text-foreground">{inv.invoice_number}</td>
                      <td className="px-6 py-3.5 text-muted-foreground text-xs">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3.5 font-medium">₹{inv.amount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3.5 text-muted-foreground text-xs">
                        ₹{(inv.gst_amount ?? Math.round(inv.amount * 0.18)).toLocaleString("en-IN")}
                      </td>
                      <td className="px-6 py-3.5 font-bold text-foreground">₹{inv.total_amount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                            inv.status === "paid"
                              ? "bg-success-soft text-success"
                              : "bg-warning-soft text-warning"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="size-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          disabled={generatingPdf === inv.id}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {generatingPdf === inv.id ? (
                            "Generating..."
                          ) : (
                            <>
                              <Download className="size-3.5" /> Download PDF
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Upgrade / Change Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">Select Your HEZO SCHOOL Plan</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Upgrade or switch your subscription tier anytime. Instant activation.
                </p>
              </div>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Cycle Switch */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 bg-muted p-1 rounded-xl">
                <button
                  onClick={() => setSelectedCycle("monthly")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedCycle === "monthly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setSelectedCycle("yearly")}
                  className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                    selectedCycle === "yearly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  <span>Annual Billing</span>
                  <span className="bg-success text-white text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase">
                    20% OFF
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PLANS.map((p) => {
                const isCurrent = sub.plan === p.id && sub.status === "active";
                const price = selectedCycle === "yearly" ? p.priceYearly : p.priceMonthly;

                return (
                  <div
                    key={p.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      p.popular
                        ? "border-brand bg-brand-soft/20 shadow-md"
                        : "border-border bg-background"
                    }`}
                  >
                    <div>
                      {p.popular && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider bg-brand text-white px-2 py-0.5 rounded-full inline-block mb-2">
                          Most Popular
                        </span>
                      )}
                      <h4 className="font-bold text-base text-foreground">{p.name}</h4>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-2xl font-black text-foreground">₹{price.toLocaleString("en-IN")}</span>
                        <span className="text-xs text-muted-foreground">/mo</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Billed {selectedCycle === "yearly" ? "annually" : "monthly"} + 18% GST
                      </p>

                      <ul className="mt-5 space-y-2 text-xs text-foreground/90">
                        {p.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Check className="size-3.5 text-success shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handlePlanUpgrade(p.id)}
                      disabled={upgrading || isCurrent}
                      className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isCurrent
                          ? "bg-muted text-muted-foreground cursor-default"
                          : p.popular
                          ? "bg-brand text-white hover:bg-brand/90 shadow-sm"
                          : "bg-foreground text-background hover:opacity-90"
                      }`}
                    >
                      {upgrading ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : isCurrent ? (
                        "Current Plan"
                      ) : (
                        `Upgrade to ${p.name}`
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
