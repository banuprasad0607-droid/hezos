import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { CreditCard, Download, ShieldCheck, CheckCircle2 } from "lucide-react";
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
  name: string;
  address: string | null;
  student_limit: number;
  teacher_limit: number;
};

type SubData = {
  plan: string;
  status: string;
  monthly_amount: number;
  billing_cycle: string;
  current_period_end: string | null;
};

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

  useEffect(() => {
    if (!schoolId || !isAdmin) return;
    loadData();
  }, [schoolId, isAdmin]);

  const loadData = async () => {
    setLoading(true);
    const [sc, sb, inv, st, tr] = await Promise.all([
      supabase
        .from("schools")
        .select("name, address, student_limit, teacher_limit")
        .eq("id", schoolId!)
        .single(),
      supabase
        .from("subscriptions")
        .select("plan, status, monthly_amount, billing_cycle, current_period_end")
        .eq("school_id", schoolId!)
        .single(),
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

    if (sc.data) setSchool(sc.data);
    if (sb.data) setSub(sb.data);
    if (inv.data) setInvoices(inv.data);
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
      toast.success("Invoice downloaded!");
    } catch (err) {
      toast.error("Failed to generate PDF");
    } finally {
      setGeneratingPdf(null);
    }
  };

  if (!isAdmin) return <div className="p-8 text-center">Unauthorized</div>;
  if (loading || !sub || !school)
    return <div className="p-8 text-center">Loading billing data...</div>;

  const stuPercent = Math.min(100, Math.round((counts.students / school.student_limit) * 100));
  const teaPercent = Math.min(100, Math.round((counts.teachers / school.teacher_limit) * 100));

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
      <PageHeader title="Billing & Subscription" breadcrumb="Admin" />
      <div className="p-8 max-w-5xl mx-auto space-y-8">
        {/* Subscription Plan Card */}
        <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="size-6 text-brand" />
                <h2 className="text-xl font-bold capitalize">{sub.plan} Plan</h2>
                <span
                  className={`text-xs px-2 py-0.5 rounded uppercase font-semibold tracking-wider ${sub.status === "active" ? "bg-brand-soft text-brand" : "bg-warning/20 text-warning-dark"}`}
                >
                  {sub.status}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                You are currently on the {sub.plan} tier billed {sub.billing_cycle}.
                {sub.current_period_end &&
                  ` Your current billing period ends on ${new Date(sub.current_period_end).toLocaleDateString()}.`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">${sub.monthly_amount}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Per{" "}
                {sub.billing_cycle === "yearly"
                  ? "Year"
                  : sub.billing_cycle === "quarterly"
                    ? "Quarter"
                    : "Month"}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Students</span>
                <span className="text-muted-foreground">
                  {counts.students} / {school.student_limit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${stuPercent}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Teachers</span>
                <span className="text-muted-foreground">
                  {counts.teachers} / {school.teacher_limit}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-brand" style={{ width: `${teaPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md shadow-sm">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 bg-muted text-foreground text-sm font-medium rounded-md">
              Update Payment Method
            </button>
          </div>
        </section>

        {/* Invoice History */}
        <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-semibold flex items-center gap-2">
              <CreditCard className="size-4 text-muted-foreground" />
              Invoice History
            </h3>
          </div>
          {invoices.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No invoices generated yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="text-left px-6 py-3">Invoice #</th>
                    <th className="text-left px-6 py-3">Date</th>
                    <th className="text-left px-6 py-3">Amount</th>
                    <th className="text-left px-6 py-3">Status</th>
                    <th className="text-right px-6 py-3">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium">{inv.invoice_number}</td>
                      <td className="px-6 py-3 text-muted-foreground">
                        {new Date(inv.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3">${inv.total_amount.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            inv.status === "paid"
                              ? "bg-success/20 text-success-dark"
                              : "bg-warning/20 text-warning-dark"
                          }`}
                        >
                          {inv.status === "paid" && <CheckCircle2 className="size-3" />}
                          {inv.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          disabled={generatingPdf === inv.id}
                          className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:opacity-80 disabled:opacity-50"
                        >
                          {generatingPdf === inv.id ? (
                            "Generating..."
                          ) : (
                            <>
                              <Download className="size-3" /> PDF
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
    </>
  );
}
