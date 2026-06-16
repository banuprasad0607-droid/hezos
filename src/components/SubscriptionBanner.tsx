import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { AlertCircle, Clock } from "lucide-react";

export function SubscriptionBanner() {
  const { currentSchoolId: schoolId, roles } = useTenant();
  const isAdmin = roles.includes("admin");
  const isSuper = roles.includes("super_admin");
  const [sub, setSub] = useState<{ status: string; trial_end: string | null } | null>(null);

  useEffect(() => {
    if (!schoolId) return;
    
    // Super admins don't pay for the platform themselves, so hide the banner
    if (isSuper) return;
    // We only care about banners if we are an admin managing the school.
    if (!isAdmin) return;

    supabase
      .from("subscriptions")
      .select("status, trial_end")
      .eq("school_id", schoolId)
      .single()
      .then(({ data }) => setSub(data));
  }, [schoolId, isAdmin, isSuper]);

  if (!sub) return null;

  if (sub.status === "trialing" && sub.trial_end) {
    const trialEnd = new Date(sub.trial_end);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    
    return (
      <div className="bg-brand-soft border-b border-brand/20 px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <Clock className="size-4 text-brand" />
        <span className="text-brand-dark font-medium">
          You are on a free trial. {daysLeft} days remaining.
        </span>
        <Link to="/admin/billing" className="text-xs font-semibold bg-brand text-brand-foreground px-3 py-1 rounded shadow-sm hover:opacity-90">
          Upgrade Now
        </Link>
      </div>
    );
  }

  if (sub.status === "expired" || sub.status === "suspended" || sub.status === "canceled") {
    return (
      <div className="bg-danger-soft border-b border-danger/20 px-4 py-2 flex items-center justify-center gap-3 text-sm">
        <AlertCircle className="size-4 text-danger" />
        <span className="text-danger-dark font-medium">
          Your subscription is {sub.status}. Please update your payment method to restore full access.
        </span>
        <Link to="/admin/billing" className="text-xs font-semibold bg-danger text-danger-foreground px-3 py-1 rounded shadow-sm hover:opacity-90">
          Manage Billing
        </Link>
      </div>
    );
  }

  return null;
}
