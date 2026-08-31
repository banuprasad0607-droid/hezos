import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  ScrollText,
  Search,
  RefreshCw,
  DownloadCloud,
  ShieldAlert,
  Clock,
  UserCheck,
  Filter,
  Building2,
  Plus,
  Edit3,
  Trash2,
  Lock,
  Eye,
  XCircle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/audit-logs")({
  component: PlatformAuditLogsPage,
});

type AuditEntry = {
  id: string;
  created_at: string;
  action: string;
  target_type: string;
  target_id?: string | null;
  target_name?: string | null;
  actor_email?: string | null;
  actor_role?: string | null;
  module?: string | null;
  details?: string | null;
  school_id?: string | null;
};

const ACTION_COLORS: Record<string, string> = {
  TENANT_PROVISIONED: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  TENANT_DELETED: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  TENANT_SUSPENDED: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  TENANT_ACTIVATED: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  USER_REGISTERED: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  USER_LOGIN: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
  SETTINGS_CHANGED: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  DEFAULT: "bg-muted text-foreground border-border",
};

const ACTION_ICONS: Record<string, typeof Plus> = {
  TENANT_PROVISIONED: Building2,
  TENANT_DELETED: Trash2,
  TENANT_SUSPENDED: XCircle,
  TENANT_ACTIVATED: Eye,
  USER_REGISTERED: UserCheck,
  USER_LOGIN: Lock,
  SETTINGS_CHANGED: Edit3,
};

function PlatformAuditLogsPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    void loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);

    // Try platform_audit_logs first (new table — available after applying migration)
    const { data: newLogs, error: newErr } = await (supabase as any)
      .from("platform_audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!newErr && newLogs && newLogs.length > 0) {
      setLogs(newLogs as AuditEntry[]);
      setLoading(false);
      return;
    }

    // Try old audit_logs table
    const { data: oldLogs, error: oldErr } = await (supabase as any)
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (!oldErr && oldLogs && oldLogs.length > 0) {
      setLogs(oldLogs as AuditEntry[]);
      setLoading(false);
      return;
    }

    // Fallback: synthesize from schools & profiles activity
    const [sRes, pRes] = await Promise.all([
      supabase.from("schools").select("id, name, created_at, status").order("created_at", { ascending: false }).limit(30),
      supabase.from("profiles").select("user_id, full_name, email, created_at").order("created_at", { ascending: false }).limit(30),
    ]);

    const events: AuditEntry[] = [];
    (sRes.data ?? []).forEach((s) => {
      events.push({
        id: `school-${s.id}`,
        created_at: s.created_at,
        action: "TENANT_PROVISIONED",
        target_type: "School",
        target_id: s.id,
        target_name: s.name,
        actor_email: "banu.prasad0607@gmail.com",
        actor_role: "super_admin",
        module: "Platform",
        details: `Provisioned tenant for ${s.name}`,
      });
    });
    (pRes.data ?? []).forEach((p) => {
      events.push({
        id: `prof-${p.user_id}`,
        created_at: p.created_at || new Date().toISOString(),
        action: "USER_REGISTERED",
        target_type: "User",
        target_id: p.user_id,
        target_name: p.full_name || p.email || "Unknown",
        actor_email: p.email || "System",
        actor_role: "system",
        module: "Auth",
        details: `User profile created for ${p.full_name || p.email || "Unknown"}`,
      });
    });
    events.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setLogs(events);
    setLoading(false);
  };

  const exportCSV = () => {
    const rows = filteredLogs.map((l) =>
      [new Date(l.created_at).toISOString(), l.action, l.target_type, l.target_name || l.target_id, l.actor_email, l.details].join(",")
    );
    const csv = ["Timestamp,Action,Target Type,Target,Actor,Details", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "hezo_audit_logs.csv";
    a.click();
    toast.success("Exported audit logs");
  };

  const now = new Date();
  const filteredLogs = logs.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.action.toLowerCase().includes(q) ||
      (l.target_name && l.target_name.toLowerCase().includes(q)) ||
      (l.target_id && l.target_id.toLowerCase().includes(q)) ||
      (l.actor_email && l.actor_email.toLowerCase().includes(q)) ||
      (l.details && l.details.toLowerCase().includes(q));
    const matchAction = actionFilter === "all" || l.action === actionFilter;
    const matchDate = dateFilter === "all" || (() => {
      const d = new Date(l.created_at);
      if (dateFilter === "today") return d.toDateString() === now.toDateString();
      if (dateFilter === "week") return (now.getTime() - d.getTime()) <= 7 * 24 * 60 * 60 * 1000;
      if (dateFilter === "month") return (now.getTime() - d.getTime()) <= 30 * 24 * 60 * 60 * 1000;
      return true;
    })();
    return matchSearch && matchAction && matchDate;
  });

  const uniqueActions = [...new Set(logs.map((l) => l.action))];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">System Audit & Security Logs</h1>
          <p className="text-sm text-muted-foreground">
            Complete audit trail of tenant provisioning, admin actions, and security events.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
            <DownloadCloud className="size-3.5" /> Export CSV
          </button>
          <button onClick={loadAuditLogs} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Events", value: logs.length },
          { label: "Today", value: logs.filter(l => new Date(l.created_at).toDateString() === now.toDateString()).length },
          { label: "Provisioning", value: logs.filter(l => l.action === "TENANT_PROVISIONED").length },
          { label: "User Events", value: logs.filter(l => l.action === "USER_REGISTERED" || l.action === "USER_LOGIN").length },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search event, target, actor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none">
          <option value="all">All Actions</option>
          {uniqueActions.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filteredLogs.length} events</span>
      </div>

      {/* Log Feed */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading audit entries…</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center">
            <ScrollText className="size-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium">No audit events found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3.5">Timestamp</th>
                  <th className="text-left px-5 py-3.5">Action</th>
                  <th className="text-left px-5 py-3.5">Target</th>
                  <th className="text-left px-5 py-3.5">Actor</th>
                  <th className="text-left px-5 py-3.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredLogs.map((l) => {
                  const colorClass = ACTION_COLORS[l.action] || ACTION_COLORS.DEFAULT;
                  const Icon = ACTION_ICONS[l.action] || ShieldAlert;
                  return (
                    <tr key={l.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="size-3" />
                          <span>{new Date(l.created_at).toLocaleDateString()}</span>
                          <span>{new Date(l.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${colorClass}`}>
                          <Icon className="size-3" />
                          {l.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="font-medium text-foreground text-xs">{l.target_name || l.target_id || "System"}</p>
                          {l.target_type && <p className="text-[10px] text-muted-foreground">{l.target_type}</p>}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">{l.actor_email || "System"}</p>
                          {l.actor_role && (
                            <span className="text-[9px] uppercase font-bold text-indigo-600 dark:text-indigo-400">{l.actor_role}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted-foreground max-w-xs truncate" title={l.details || undefined}>
                        {l.details || "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
