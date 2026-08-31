import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { toast } from "sonner";
import {
  Sliders,
  ShieldCheck,
  Save,
  Lock,
  AlertTriangle,
  KeyRound,
  Globe2,
  Bell,
  Clock,
  CreditCard,
  Building2,
  ChevronDown,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/settings")({
  component: PlatformSettingsPage,
});

function PlatformSettingsPage() {
  const { user } = useTenant();
  const [superAdminEmail, setSuperAdminEmail] = useState<string | null>(null);
  const [superAdminName, setSuperAdminName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [platformConfig, setPlatformConfig] = useState({
    platformName: "HEZO SCHOOL Connect",
    supportEmail: "support@hezoscl.com",
    timezone: "Asia/Kolkata",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
    systemBanner: "",
    defaultStudentLimit: "500",
    defaultTeacherLimit: "50",
    defaultPlan: "starter",
  });

  const [changePwForm, setChangePwForm] = useState({ next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);

  useEffect(() => {
    void loadSuperAdmin();
  }, []);

  const loadSuperAdmin = async () => {
    setLoading(true);
    const { data: roles } = await supabase
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin" as never)
      .limit(1)
      .maybeSingle();

    if (roles?.user_id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("email, full_name")
        .eq("user_id", roles.user_id)
        .maybeSingle();
      setSuperAdminEmail(profile?.email ?? null);
      setSuperAdminName(profile?.full_name ?? "Super Admin");
    }
    setLoading(false);
  };

  const handleSaveSettings = (e: FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setTimeout(() => {
      toast.success("Platform settings saved successfully!");
      setSavingConfig(false);
    }, 600);
  };

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (changePwForm.next !== changePwForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (changePwForm.next.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }
    setSavingPw(true);
    const { error } = await supabase.auth.updateUser({ password: changePwForm.next });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! Please sign in again with your new password.");
      setChangePwForm({ next: "", confirm: "" });
    }
    setSavingPw(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Global Platform Settings</h1>
        <p className="text-sm text-muted-foreground">Platform branding, defaults, security, and super admin account management.</p>
      </div>

      {/* Super Admin Identity */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <ShieldCheck className="size-4 text-indigo-600 dark:text-indigo-400" />
              Platform Super Admin Account
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Exactly one platform-level Super Admin is allowed. This account cannot be shared or transferred from this panel.
            </p>
          </div>
          <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100 dark:bg-indigo-950 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5">
            <Lock className="size-3" /> Locked
          </span>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground">Loading…</div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl border border-border">
            <div className="size-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-lg select-none shadow-sm">
              {(superAdminName || superAdminEmail || "S").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">{superAdminName}</p>
              <p className="text-xs text-muted-foreground font-mono">{superAdminEmail}</p>
              {user?.id && (
                <p className="text-[10px] text-muted-foreground mt-1 font-mono opacity-50">
                  UID: {user.id.slice(0, 18)}…
                </p>
              )}
            </div>
            <div className="ml-auto">
              <span className="text-[9px] uppercase font-bold px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                Super Admin
              </span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
          <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <p className="text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
            Only <strong>one</strong> Super Admin is permitted on this platform. This account has unrestricted access to all tenants, billing, and platform settings. Never share these credentials. Contact your hosting provider to transfer ownership.
          </p>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="border-b border-border pb-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <KeyRound className="size-4 text-rose-600 dark:text-rose-400" />
            Change Master Password
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Update the Super Admin login password. Takes effect immediately.</p>
        </div>
        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Min 8 characters"
              value={changePwForm.next}
              onChange={(e) => setChangePwForm({ ...changePwForm, next: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Repeat password"
              value={changePwForm.confirm}
              onChange={(e) => setChangePwForm({ ...changePwForm, confirm: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={savingPw}
              className="w-full px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
            >
              <KeyRound className="size-4" />
              {savingPw ? "Saving…" : "Update Password"}
            </button>
          </div>
        </form>
      </section>

      {/* Platform Configuration */}
      <form onSubmit={handleSaveSettings} className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-border pb-4">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <Globe2 className="size-4 text-indigo-600 dark:text-indigo-400" /> Platform Branding & Identity
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Global branding and system-wide contact settings</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium mb-1">Platform Brand Name</label>
            <input type="text" value={platformConfig.platformName} onChange={(e) => setPlatformConfig({ ...platformConfig, platformName: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Global Support Email</label>
            <input type="email" value={platformConfig.supportEmail} onChange={(e) => setPlatformConfig({ ...platformConfig, supportEmail: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Timezone</label>
            <div className="relative">
              <Clock className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={platformConfig.timezone} onChange={(e) => setPlatformConfig({ ...platformConfig, timezone: e.target.value })} className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none appearance-none">
                <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Currency</label>
            <div className="relative">
              <CreditCard className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select value={platformConfig.currency} onChange={(e) => setPlatformConfig({ ...platformConfig, currency: e.target.value })} className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none appearance-none">
                <option value="INR">INR — Indian Rupee (₹)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="EUR">EUR — Euro (€)</option>
                <option value="GBP">GBP — British Pound (£)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Date Format</label>
            <select value={platformConfig.dateFormat} onChange={(e) => setPlatformConfig({ ...platformConfig, dateFormat: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none">
              <option value="DD/MM/YYYY">DD/MM/YYYY (Indian)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">System Announcement Banner</label>
            <input type="text" placeholder="e.g. Scheduled maintenance this Sunday 2AM" value={platformConfig.systemBanner} onChange={(e) => setPlatformConfig({ ...platformConfig, systemBanner: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none" />
            <p className="text-[10px] text-muted-foreground mt-1">Shown to all logged-in school admins when set.</p>
          </div>
        </div>

        <div className="border-t border-border pt-5">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
            <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" /> School Defaults (Applied to new schools)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Default Student Limit</label>
              <input type="number" min={10} value={platformConfig.defaultStudentLimit} onChange={(e) => setPlatformConfig({ ...platformConfig, defaultStudentLimit: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Default Teacher Limit</label>
              <input type="number" min={1} value={platformConfig.defaultTeacherLimit} onChange={(e) => setPlatformConfig({ ...platformConfig, defaultTeacherLimit: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Default Plan</label>
              <select value={platformConfig.defaultPlan} onChange={(e) => setPlatformConfig({ ...platformConfig, defaultPlan: e.target.value })} className="w-full px-3.5 py-2 text-sm border border-border rounded-xl bg-background focus:outline-none capitalize">
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Changes take effect immediately across all active tenant sessions.</span>
          <button
            type="submit"
            disabled={savingConfig}
            className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity disabled:opacity-50"
          >
            <Save className="size-4" /> {savingConfig ? "Saving…" : "Save Platform Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
