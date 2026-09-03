import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  BadgeDollarSign,
  Calendar,
  CreditCard,
  Plus,
  RefreshCw,
  X,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/subscriptions")({
  component: PlatformSubscriptionsPage,
});

type SubscriptionRow = {
  id?: string;
  school_id: string;
  plan: string;
  status: string;
  billing_cycle?: string;
  monthly_amount: number;
  trial_end?: string | null;
  current_period_end?: string | null;
  school_name?: string;
};

function PlatformSubscriptionsPage() {
  const [subs, setSubs] = useState<SubscriptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [editSub, setEditSub] = useState<SubscriptionRow | null>(null);

  useEffect(() => {
    void loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    const [sbRes, scRes] = await Promise.all([
      supabase.from("subscriptions").select("*"),
      supabase.from("schools").select("id, name"),
    ]);

    if (sbRes.error) {
      toast.error(`Error loading subscriptions: ${sbRes.error.message}`);
    } else {
      const schoolMap = new Map((scRes.data ?? []).map((s) => [s.id, s.name]));
      const list = (sbRes.data ?? []).map((sub) => ({
        ...sub,
        school_name: schoolMap.get(sub.school_id) || `School (${sub.school_id.slice(0, 8)})`,
      }));
      setSubs(list);
    }
    setLoading(false);
  };

  const extendTrial = async (schoolId: string, currentTrialEnd?: string | null) => {
    const baseDate = currentTrialEnd && new Date(currentTrialEnd) > new Date() ? new Date(currentTrialEnd) : new Date();
    const newEnd = new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("subscriptions")
      .update({ trial_end: newEnd, status: "trialing" })
      .eq("school_id", schoolId);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Extended trial by 14 days!");
      void loadSubscriptions();
    }
  };

  const totalMrr = subs
    .filter((s) => s.status === "active")
    .reduce((acc, sub) => acc + Number(sub.monthly_amount || 0), 0);

  const starterCount = subs.filter((s) => s.plan === "starter").length;
  const proCount = subs.filter((s) => s.plan === "professional").length;
  const enterpriseCount = subs.filter((s) => s.plan === "enterprise").length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Subscriptions & Platform Revenue</h1>
          <p className="text-sm text-muted-foreground">
            Monitor tenant subscription statuses, trial expirations, billing tiers, and recurring revenue.
          </p>
        </div>
        <button
          onClick={loadSubscriptions}
          className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-2 transition-colors self-start"
        >
          <RefreshCw className="size-4" /> Refresh Subscriptions
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Active MRR</span>
          <h3 className="text-3xl font-bold mt-2 text-emerald-600 dark:text-emerald-400 font-mono">₹{totalMrr.toLocaleString()}</h3>
          <p className="text-xs text-muted-foreground mt-1">ARR: ₹{(totalMrr * 12).toLocaleString()}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Starter Tier (₹)</span>
          <h3 className="text-3xl font-bold mt-2 text-foreground">{starterCount} Tenants</h3>
          <p className="text-xs text-muted-foreground mt-1">Entry level subscription</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Professional Tier</span>
          <h3 className="text-3xl font-bold mt-2 text-indigo-600 dark:text-indigo-400">{proCount} Tenants</h3>
          <p className="text-xs text-muted-foreground mt-1">Mid-size growth schools</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-xs">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enterprise Tier</span>
          <h3 className="text-3xl font-bold mt-2 text-purple-600 dark:text-purple-400">{enterpriseCount} Tenants</h3>
          <p className="text-xs text-muted-foreground mt-1">Custom limits & SLA</p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold">Tenant Subscriptions Roster</h2>
          <span className="text-xs text-muted-foreground">{subs.length} total records</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading subscriptions…</div>
        ) : subs.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            No active subscriptions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3.5">School Tenant</th>
                  <th className="text-left px-6 py-3.5">Plan Tier</th>
                  <th className="text-left px-6 py-3.5">Cycle</th>
                  <th className="text-left px-6 py-3.5">Monthly Fee</th>
                  <th className="text-left px-6 py-3.5">Status</th>
                  <th className="text-left px-6 py-3.5">Trial End</th>
                  <th className="text-right px-6 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subs.map((s) => (
                  <tr key={s.school_id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground">{s.school_name}</td>
                    <td className="px-6 py-4">
                      <span className="capitalize px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {s.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 capitalize text-xs text-muted-foreground">
                      {s.billing_cycle || "monthly"}
                    </td>
                    <td className="px-6 py-4 font-mono font-medium text-foreground">
                      ₹{Number(s.monthly_amount || 0).toLocaleString()} / mo
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                          s.status === "active"
                            ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            : s.status === "trialing"
                              ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                              : "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {s.trial_end
                        ? new Date(s.trial_end).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => extendTrial(s.school_id, s.trial_end)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800 font-medium"
                          title="Add 14 days to trial"
                        >
                          <Sparkles className="size-3" /> +14d Trial
                        </button>
                        <button
                          onClick={() => setEditSub(s)}
                          className="inline-flex items-center gap-1 text-xs px-2 py-1 border border-border rounded hover:bg-muted font-medium"
                        >
                          Edit Plan
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Subscription Modal */}
      {editSub && (
        <EditSubscriptionModal
          sub={editSub}
          onClose={() => setEditSub(null)}
          onUpdated={() => {
            setEditSub(null);
            void loadSubscriptions();
          }}
        />
      )}
    </div>
  );
}

function EditSubscriptionModal({
  sub,
  onClose,
  onUpdated,
}: {
  sub: SubscriptionRow;
  onClose: () => void;
  onUpdated: () => void;
}) {
  const [plan, setPlan] = useState(sub.plan);
  const [status, setStatus] = useState(sub.status);
  const [monthlyAmount, setMonthlyAmount] = useState(sub.monthly_amount);
  const [billingCycle, setBillingCycle] = useState(sub.billing_cycle || "monthly");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from("subscriptions")
      .update({
        plan,
        status,
        monthly_amount: Number(monthlyAmount),
        billing_cycle: billingCycle,
      })
      .eq("school_id", sub.school_id);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Updated subscription for "${sub.school_name}"`);
      onUpdated();
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-semibold">Subscription — {sub.school_name}</h2>
          <button type="button" onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="size-4" />
          </button>
        </header>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Plan Tier</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
            >
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Subscription Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background capitalize"
            >
              <option value="active">Active</option>
              <option value="trialing">Trialing</option>
              <option value="past_due">Past Due</option>
              <option value="canceled">Canceled</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Monthly Amount (₹)</label>
            <input
              type="number"
              min={0}
              value={monthlyAmount}
              onChange={(e) => setMonthlyAmount(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Billing Cycle</label>
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background capitalize"
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <footer className="px-6 py-4 border-t border-border bg-muted/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save Subscription"}
          </button>
        </footer>
      </form>
    </div>
  );
}
