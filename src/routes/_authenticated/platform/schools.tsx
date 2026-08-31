import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { provisionSchool } from "@/lib/platform.functions";
import { useSchoolContext } from "@/lib/school-context";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Search,
  Pause,
  Play,
  Trash2,
  ArrowRight,
  X,
  Edit3,
  Filter,
  DownloadCloud,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArchiveX,
  Globe2,
  MapPin,
  Phone,
  Mail,
  User2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/schools")({
  component: PlatformSchoolsPage,
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
  city?: string | null;
  state?: string | null;
  school_type?: string | null;
  principal_name?: string | null;
  onboarding_flags?: Record<string, boolean> | null;
};

const PAGE_SIZE = 15;

function getOnboardingPct(flags: Record<string, boolean> | null | undefined): number {
  if (!flags) return 0;
  const keys = ["basic_info", "school_admin", "academic_year", "classes", "sections", "teachers", "students", "fees", "timetable"];
  const done = keys.filter((k) => flags[k]).length;
  return Math.round((done / keys.length) * 100);
}

function PlatformSchoolsPage() {
  const { enterSchool } = useSchoolContext();
  const navigate = useNavigate();

  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [wizardOpen, setWizardOpen] = useState(false);
  const [editSchool, setEditSchool] = useState<SchoolRow | null>(null);
  const [viewSchool, setViewSchool] = useState<SchoolRow | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ school: SchoolRow; action: string } | null>(null);

  useEffect(() => {
    void loadSchools();
  }, []);

  const loadSchools = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) toast.error(`Failed: ${error.message}`);
    else setSchools((data ?? []) as SchoolRow[]);
    setLoading(false);
  };

  const setStatus = async (id: string, newStatus: string, name: string) => {
    const { error } = await supabase.from("schools").update({ status: newStatus }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`${name} → ${newStatus}`);
    setConfirmAction(null);
    void loadSchools();
  };

  const removeSchool = async (id: string, name: string) => {
    const { error } = await supabase.from("schools").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`"${name}" deleted`);
    setConfirmAction(null);
    void loadSchools();
  };

  const exportCSV = () => {
    const rows = filteredSchools.map((s) =>
      [s.name, s.code, s.status, s.plan, s.student_limit, s.teacher_limit, s.email, s.phone, s.city, s.created_at].join(",")
    );
    const csv = ["Name,Code,Status,Plan,Students Limit,Teachers Limit,Email,Phone,City,Created At", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "hezo_schools.csv";
    a.click();
    toast.success("Exported to CSV");
  };

  const filteredSchools = schools.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.toLowerCase().includes(q) || (s.code && s.code.toLowerCase().includes(q)) || (s.city && s.city.toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchPlan = planFilter === "all" || s.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const paged = filteredSchools.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filteredSchools.length / PAGE_SIZE);

  const toggleSelect = (id: string) => {
    const n = new Set(selectedIds);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelectedIds(n);
  };

  const bulkActivate = async () => {
    await Promise.all([...selectedIds].map((id) => supabase.from("schools").update({ status: "active" }).eq("id", id)));
    toast.success(`${selectedIds.size} schools activated`);
    setSelectedIds(new Set());
    void loadSchools();
  };

  const bulkSuspend = async () => {
    await Promise.all([...selectedIds].map((id) => supabase.from("schools").update({ status: "suspended" }).eq("id", id)));
    toast.success(`${selectedIds.size} schools suspended`);
    setSelectedIds(new Set());
    void loadSchools();
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">School Management</h1>
          <p className="text-sm text-muted-foreground">
            {filteredSchools.length} of {schools.length} schools · {schools.filter(s => s.status === "active").length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5 transition-colors">
            <DownloadCloud className="size-3.5" /> Export
          </button>
          <button onClick={loadSchools} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5 transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
          <button
            onClick={() => setWizardOpen(true)}
            className="px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 flex items-center gap-2 transition-opacity"
          >
            <Plus className="size-4" /> Add School
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col md:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full md:w-72">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name, code, city..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="archived">Archived</option>
          </select>
          <select value={planFilter} onChange={(e) => { setPlanFilter(e.target.value); setPage(0); }} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none capitalize">
            <option value="all">All Plans</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setViewMode("table")} className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === "table" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Table</button>
            <button onClick={() => setViewMode("grid")} className={`px-3 py-2 text-xs font-medium transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>Grid</button>
          </div>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 flex items-center gap-3">
          <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">{selectedIds.size} selected</span>
          <button onClick={bulkActivate} className="px-3 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500">Activate</button>
          <button onClick={bulkSuspend} className="px-3 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-500">Suspend</button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-xs text-muted-foreground hover:text-foreground">Clear</button>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-16 text-center">
          <Building2 className="size-12 mx-auto mb-3 text-muted-foreground/30" />
          <p className="font-semibold text-foreground">No schools found</p>
          <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or create a new school.</p>
          <button onClick={() => setWizardOpen(true)} className="mt-4 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 flex items-center gap-2 mx-auto">
            <Plus className="size-4" /> Add First School
          </button>
        </div>
      ) : viewMode === "table" ? (
        <TableView
          schools={paged}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onView={setViewSchool}
          onEdit={setEditSchool}
          onConfirmAction={setConfirmAction}
          onEnterSchool={(s) => {
            enterSchool({ id: s.id, name: s.name, code: s.code, logo_url: s.logo_url ?? null, address: s.address ?? null, phone: s.phone ?? null, email: s.email ?? null, status: s.status });
            void navigate({ to: "/dashboard" });
          }}
        />
      ) : (
        <GridView
          schools={paged}
          onView={setViewSchool}
          onEnterSchool={(s) => {
            enterSchool({ id: s.id, name: s.name, code: s.code, logo_url: s.logo_url ?? null, address: s.address ?? null, phone: s.phone ?? null, email: s.email ?? null, status: s.status });
            void navigate({ to: "/dashboard" });
          }}
          onConfirmAction={setConfirmAction}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground text-xs">
            Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredSchools.length)} of {filteredSchools.length}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-muted transition-colors">
              <ChevronLeft className="size-4" />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button key={i} onClick={() => setPage(i)} className={`w-8 h-8 rounded-lg text-xs font-medium ${i === page ? "bg-primary text-primary-foreground" : "hover:bg-muted border border-border"}`}>{i + 1}</button>
            ))}
            <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-muted transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      {wizardOpen && <CreateSchoolWizard onClose={() => setWizardOpen(false)} onCreated={() => { setWizardOpen(false); void loadSchools(); }} />}
      {editSchool && <EditSchoolModal school={editSchool} onClose={() => setEditSchool(null)} onUpdated={() => { setEditSchool(null); void loadSchools(); }} />}
      {viewSchool && <SchoolDetailModal school={viewSchool} onClose={() => setViewSchool(null)} onEdit={() => { setEditSchool(viewSchool); setViewSchool(null); }} onEnter={() => {
        enterSchool({ id: viewSchool.id, name: viewSchool.name, code: viewSchool.code, logo_url: viewSchool.logo_url ?? null, address: viewSchool.address ?? null, phone: viewSchool.phone ?? null, email: viewSchool.email ?? null, status: viewSchool.status });
        navigate({ to: "/dashboard" });
      }} />}
      {confirmAction && (
        <ConfirmModal
          title={`${confirmAction.action === "delete" ? "Delete" : confirmAction.action === "archived" ? "Archive" : confirmAction.action === "suspended" ? "Suspend" : "Activate"} School`}
          message={`Are you sure you want to ${confirmAction.action === "delete" ? "permanently delete" : `set "${confirmAction.school.name}" to ${confirmAction.action}`}? ${confirmAction.action === "delete" ? "This action cannot be undone." : ""}`}
          onConfirm={() =>
            confirmAction.action === "delete"
              ? removeSchool(confirmAction.school.id, confirmAction.school.name)
              : setStatus(confirmAction.school.id, confirmAction.action, confirmAction.school.name)
          }
          onCancel={() => setConfirmAction(null)}
          destructive={confirmAction.action === "delete" || confirmAction.action === "suspended"}
        />
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    inactive: "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    suspended: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    archived: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  };
  return (
    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${map[status] || map.inactive}`}>
      {status}
    </span>
  );
}

function PlanBadge({ plan }: { plan: string }) {
  const map: Record<string, string> = {
    starter: "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
    professional: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    enterprise: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-800",
  };
  return (
    <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${map[plan] || map.starter}`}>
      {plan}
    </span>
  );
}

function OnboardingBar({ pct }: { pct: number }) {
  const color = pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-indigo-500" : "bg-amber-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-muted-foreground w-8 text-right">{pct}%</span>
    </div>
  );
}

function TableView({ schools, selectedIds, onToggleSelect, onView, onEdit, onConfirmAction, onEnterSchool }: {
  schools: SchoolRow[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onView: (s: SchoolRow) => void;
  onEdit: (s: SchoolRow) => void;
  onConfirmAction: (v: { school: SchoolRow; action: string }) => void;
  onEnterSchool: (s: SchoolRow) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <tr>
              <th className="px-4 py-3.5 w-10">
                <input type="checkbox" className="rounded" onChange={(e) => schools.forEach(s => e.target.checked ? onToggleSelect(s.id) : onToggleSelect(s.id))} />
              </th>
              <th className="text-left px-4 py-3.5">School</th>
              <th className="text-left px-4 py-3.5">Type</th>
              <th className="text-left px-4 py-3.5">Contact</th>
              <th className="text-left px-4 py-3.5">Limits</th>
              <th className="text-left px-4 py-3.5">Onboarding</th>
              <th className="text-left px-4 py-3.5">Status</th>
              <th className="text-right px-4 py-3.5">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {schools.map((s) => (
              <tr key={s.id} className={`hover:bg-muted/20 transition-colors ${selectedIds.has(s.id) ? "bg-indigo-50/50 dark:bg-indigo-950/20" : ""}`}>
                <td className="px-4 py-3.5">
                  <input type="checkbox" checked={selectedIds.has(s.id)} onChange={() => onToggleSelect(s.id)} className="rounded" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    {s.logo_url ? (
                      <img src={s.logo_url} alt="" className="size-9 rounded-lg object-cover" />
                    ) : (
                      <div className="size-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                        {s.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <button onClick={() => onView(s)} className="font-semibold text-foreground text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left">
                        {s.name}
                      </button>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-mono text-muted-foreground">{s.code || "—"}</span>
                        {s.city && <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin className="size-2.5" />{s.city}</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <div className="space-y-1">
                    <PlanBadge plan={s.plan} />
                    {s.school_type && <div className="text-[9px] text-muted-foreground capitalize">{s.school_type.replace("_", " ")}</div>}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                  <div className="space-y-0.5">
                    {s.email && <div className="flex items-center gap-1"><Mail className="size-2.5" />{s.email.slice(0, 20)}{s.email.length > 20 ? "…" : ""}</div>}
                    {s.phone && <div className="flex items-center gap-1"><Phone className="size-2.5" />{s.phone}</div>}
                    {s.principal_name && <div className="flex items-center gap-1"><User2 className="size-2.5" />{s.principal_name}</div>}
                  </div>
                </td>
                <td className="px-4 py-3.5 text-xs text-muted-foreground">
                  <div>
                    <span className="font-semibold text-foreground">{s.student_limit}</span> stu
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{s.teacher_limit}</span> tea
                  </div>
                </td>
                <td className="px-4 py-3.5 w-32">
                  <OnboardingBar pct={getOnboardingPct(s.onboarding_flags)} />
                </td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={s.status} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="inline-flex items-center gap-1">
                    <button onClick={() => onView(s)} title="View" className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <Eye className="size-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => onEdit(s)} title="Edit" className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                      <Edit3 className="size-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onConfirmAction({ school: s, action: s.status === "active" ? "suspended" : "active" })}
                      title={s.status === "active" ? "Suspend" : "Activate"}
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                    >
                      {s.status === "active" ? <Pause className="size-3.5 text-amber-500" /> : <Play className="size-3.5 text-emerald-500" />}
                    </button>
                    <button
                      onClick={() => onEnterSchool(s)}
                      title="Enter School"
                      className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <ArrowRight className="size-3" /> Enter
                    </button>
                    <button onClick={() => onConfirmAction({ school: s, action: "delete" })} title="Delete" className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors">
                      <Trash2 className="size-3.5 text-rose-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GridView({ schools, onView, onEnterSchool, onConfirmAction }: {
  schools: SchoolRow[];
  onView: (s: SchoolRow) => void;
  onEnterSchool: (s: SchoolRow) => void;
  onConfirmAction: (v: { school: SchoolRow; action: string }) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {schools.map((s) => (
        <div key={s.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {s.logo_url ? (
                <img src={s.logo_url} alt="" className="size-12 rounded-xl object-cover shadow-sm" />
              ) : (
                <div className="size-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-lg shadow-sm">
                  {s.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <button onClick={() => onView(s)} className="font-bold text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm">{s.name}</button>
                <p className="text-[10px] font-mono text-muted-foreground">{s.code || "—"}</p>
              </div>
            </div>
            <StatusBadge status={s.status} />
          </div>

          <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
            {s.city && <div className="flex items-center gap-1.5"><MapPin className="size-3" />{s.city}{s.state ? `, ${s.state}` : ""}</div>}
            {s.email && <div className="flex items-center gap-1.5"><Mail className="size-3" />{s.email}</div>}
            {s.principal_name && <div className="flex items-center gap-1.5"><User2 className="size-3" />Principal: {s.principal_name}</div>}
          </div>

          <div className="flex items-center justify-between text-xs mb-3">
            <PlanBadge plan={s.plan} />
            <span className="text-muted-foreground">{s.student_limit} stu · {s.teacher_limit} tea</span>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-muted-foreground">Onboarding</span>
              <span className="font-semibold">{getOnboardingPct(s.onboarding_flags)}%</span>
            </div>
            <OnboardingBar pct={getOnboardingPct(s.onboarding_flags)} />
          </div>

          <div className="flex items-center gap-2 pt-3 border-t border-border">
            <button
              onClick={() => onEnterSchool(s)}
              className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowRight className="size-3.5" /> Enter School
            </button>
            <button
              onClick={() => onConfirmAction({ school: s, action: s.status === "active" ? "suspended" : "active" })}
              className="p-2 hover:bg-muted rounded-lg transition-colors border border-border"
            >
              {s.status === "active" ? <Pause className="size-3.5 text-amber-500" /> : <Play className="size-3.5 text-emerald-500" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function SchoolDetailModal({ school, onClose, onEdit, onEnter }: { school: SchoolRow; onClose: () => void; onEdit: () => void; onEnter: () => void }) {
  const pct = getOnboardingPct(school.onboarding_flags);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {school.logo_url ? (
              <img src={school.logo_url} alt="" className="size-14 rounded-xl object-cover" />
            ) : (
              <div className="size-14 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-2xl font-bold flex items-center justify-center">
                {school.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold">{school.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xs text-muted-foreground">{school.code}</span>
                <StatusBadge status={school.status} />
                <PlanBadge plan={school.plan} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="size-4" /></button>
        </div>
        <div className="p-6 space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Email", value: school.email },
              { label: "Phone", value: school.phone },
              { label: "City", value: school.city },
              { label: "State", value: school.state },
              { label: "Principal", value: school.principal_name },
              { label: "Type", value: school.school_type?.replace("_", " ") },
              { label: "Student Limit", value: school.student_limit },
              { label: "Teacher Limit", value: school.teacher_limit },
            ].map(({ label, value }) => value ? (
              <div key={label}>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium capitalize">{String(value)}</p>
              </div>
            ) : null)}
          </div>
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground font-medium">Onboarding Progress</span>
              <span className="font-bold">{pct}% Complete</span>
            </div>
            <OnboardingBar pct={pct} />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex items-center gap-3">
          <button onClick={onEdit} className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-2">
            <Edit3 className="size-3.5" /> Edit
          </button>
          <button onClick={onEnter} className="flex-1 px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
            <ArrowRight className="size-4" /> Enter School Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ title, message, onConfirm, onCancel, destructive }: { title: string; message: string; onConfirm: () => void; onCancel: () => void; destructive?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-sm shadow-2xl p-6">
        <div className={`size-10 rounded-xl flex items-center justify-center mb-4 ${destructive ? "bg-rose-100 dark:bg-rose-950" : "bg-amber-100 dark:bg-amber-950"}`}>
          <AlertTriangle className={`size-5 ${destructive ? "text-rose-600" : "text-amber-600"}`} />
        </div>
        <h3 className="text-base font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 text-sm border border-border rounded-xl hover:bg-muted">Cancel</button>
          <button onClick={onConfirm} className={`flex-1 px-4 py-2 text-sm font-semibold rounded-xl text-white ${destructive ? "bg-rose-600 hover:bg-rose-500" : "bg-amber-600 hover:bg-amber-500"}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function EditSchoolModal({ school, onClose, onUpdated }: { school: SchoolRow; onClose: () => void; onUpdated: () => void }) {
  const [form, setForm] = useState({
    name: school.name,
    code: school.code || "",
    plan: school.plan,
    student_limit: school.student_limit,
    teacher_limit: school.teacher_limit,
    email: school.email || "",
    phone: school.phone || "",
    city: school.city || "",
    state: school.state || "",
    principal_name: school.principal_name || "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const addressStr = [form.city, form.state].filter(Boolean).join(", ") || school.address;
    const { error } = await supabase
      .from("schools")
      .update({
        name: form.name,
        code: form.code || null,
        plan: form.plan,
        student_limit: Number(form.student_limit),
        teacher_limit: Number(form.teacher_limit),
        email: form.email || null,
        phone: form.phone || null,
        address: addressStr || null,
      })
      .eq("id", school.id);
    if (error) toast.error(error.message);
    else { toast.success("School updated!"); onUpdated(); }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <header className="px-6 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-base font-bold">Edit School — {school.name}</h2>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="size-4" /></button>
        </header>
        <div className="p-6 grid grid-cols-2 gap-4">
          {[
            { label: "School Name", key: "name", full: true },
            { label: "School Code", key: "code" },
            { label: "Email", key: "email" },
            { label: "Phone", key: "phone" },
            { label: "City", key: "city" },
            { label: "State", key: "state" },
            { label: "Principal Name", key: "principal_name", full: true },
          ].map(({ label, key, full }) => (
            <div key={key} className={full ? "col-span-2" : ""}>
              <label className="block text-xs font-medium mb-1">{label}</label>
              <input value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium mb-1">Plan</label>
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background">
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Student Limit</label>
            <input type="number" min={10} value={form.student_limit} onChange={(e) => setForm({ ...form, student_limit: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background" />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Teacher Limit</label>
            <input type="number" min={1} value={form.teacher_limit} onChange={(e) => setForm({ ...form, teacher_limit: Number(e.target.value) })} className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background" />
          </div>
        </div>
        <footer className="px-6 py-4 border-t border-border bg-muted/30 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-xl hover:bg-muted">Cancel</button>
          <button type="submit" disabled={submitting} className="px-5 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-xl disabled:opacity-50">
            {submitting ? "Saving…" : "Save Changes"}
          </button>
        </footer>
      </form>
    </div>
  );
}

// ── 6-STEP WIZARD ─────────────────────────────────────────────────────────────
const TOTAL_STEPS = 6;

const STEP_LABELS = [
  "Basic Info",
  "Contact",
  "Management",
  "Academic",
  "Subscription",
  "Review",
];

function CreateSchoolWizard({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const provision = useServerFn(provisionSchool);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    // Step 1
    name: "",
    code: "",
    school_type: "school",
    registration_number: "",
    established_year: new Date().getFullYear().toString(),
    logo_url: "",
    // Step 2
    email: "",
    phone: "",
    alternate_phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    // Step 3
    principal_name: "",
    principal_email: "",
    principal_phone: "",
    admin_name: "",
    admin_email: "",
    admin_password: "",
    // Step 4
    academic_year: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    start_date: "",
    end_date: "",
    // Step 5
    plan: "starter" as "starter" | "professional" | "enterprise",
    student_limit: 500,
    teacher_limit: 50,
    monthly_amount: 0,
    billing_cycle: "monthly" as "monthly" | "quarterly" | "yearly",
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.name.trim().length >= 2 && form.code.trim().length >= 2;
    if (step === 2) return true;
    if (step === 3) return form.admin_name.trim().length >= 2 && form.admin_email.includes("@") && form.admin_password.length >= 8;
    if (step === 4) return true;
    if (step === 5) return true;
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      await provision({
        data: {
          school: {
            name: form.name.trim(),
            code: form.code.trim().toUpperCase(),
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
      toast.success(`School "${form.name}" provisioned successfully!`);
      onCreated();
    } catch (err: unknown) {
      const msg = typeof err === "object" && err !== null && "message" in err ? String((err as { message: unknown }).message) : String(err);
      toast.error(msg || "Failed to provision school");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Step {step} of {TOTAL_STEPS} — {STEP_LABELS[step - 1]}
              </p>
              <h2 className="text-lg font-bold mt-0.5">Create New School</h2>
            </div>
            <button type="button" onClick={onClose} className="p-1.5 hover:bg-muted rounded-lg"><X className="size-4" /></button>
          </div>
          {/* Progress bar */}
          <div className="flex gap-1">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all duration-300 ${i + 1 <= step ? "bg-indigo-600" : "bg-muted"}`} />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] mt-1 text-muted-foreground">
            {STEP_LABELS.map((l, i) => <span key={i} className={i + 1 === step ? "text-indigo-600 font-bold" : ""}>{l}</span>)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1.5">School Name *</label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Greenwood International School" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">School Code *</label>
                <input required value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="HEZO-001" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">School Type</label>
                <select value={form.school_type} onChange={(e) => set("school_type", e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none">
                  <option value="school">School</option>
                  <option value="cbse">CBSE</option>
                  <option value="icse">ICSE</option>
                  <option value="state_board">State Board</option>
                  <option value="international">International</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Registration Number</label>
                <input value={form.registration_number} onChange={(e) => set("registration_number", e.target.value)} placeholder="REG-2024-001" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Established Year</label>
                <input type="number" value={form.established_year} onChange={(e) => set("established_year", e.target.value)} placeholder="2010" min="1800" max={new Date().getFullYear()} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1.5">Logo URL (optional)</label>
                <input value={form.logo_url} onChange={(e) => set("logo_url", e.target.value)} placeholder="https://school.edu/logo.png" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
            </div>
          )}

          {/* Step 2: Contact */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Official Email</label>
                <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@school.edu" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Phone</label>
                <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Alternate Phone</label>
                <input value={form.alternate_phone} onChange={(e) => set("alternate_phone", e.target.value)} placeholder="+91 98765 43211" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Website</label>
                <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://school.edu" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold mb-1.5">Address</label>
                <input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="123 School Road, Block A" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">City</label>
                <input value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Bengaluru" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">State</label>
                <input value={form.state} onChange={(e) => set("state", e.target.value)} placeholder="Karnataka" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Country</label>
                <input value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="India" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Pincode</label>
                <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)} placeholder="560001" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
              </div>
            </div>
          )}

          {/* Step 3: Management */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Principal / Head</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Name</label>
                    <input value={form.principal_name} onChange={(e) => set("principal_name", e.target.value)} placeholder="Dr. Ramesh Kumar" className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Email</label>
                    <input type="email" value={form.principal_email} onChange={(e) => set("principal_email", e.target.value)} placeholder="principal@school.edu" className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Phone</label>
                    <input value={form.principal_phone} onChange={(e) => set("principal_phone", e.target.value)} placeholder="+91 98765 43210" className="w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">School Admin Account *</h3>
                <p className="text-xs text-muted-foreground mb-3">This person will be granted school_admin role and can log in immediately.</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold mb-1.5">Full Name *</label>
                    <input required value={form.admin_name} onChange={(e) => set("admin_name", e.target.value)} placeholder="Admin Full Name" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Admin Email *</label>
                    <input required type="email" value={form.admin_email} onChange={(e) => set("admin_email", e.target.value)} placeholder="admin@school.edu" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5">Temporary Password *</label>
                    <input required type="text" minLength={8} value={form.admin_password} onChange={(e) => set("admin_password", e.target.value)} placeholder="Min 8 chars" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Academic Config */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/50 dark:border-indigo-800/50">
                <p className="text-xs text-indigo-700 dark:text-indigo-300 font-medium">
                  📚 Academic configuration can be completed after school creation. You can set up classes, sections, and subjects from the School Dashboard.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold mb-1.5">Academic Year</label>
                  <input value={form.academic_year} onChange={(e) => set("academic_year", e.target.value)} placeholder="2025-2026" className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Start Date</label>
                  <input type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">End Date</label>
                  <input type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Subscription */}
          {step === 5 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2">Subscription Plan</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["starter", "professional", "enterprise"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => { set("plan", p); set("monthly_amount", p === "starter" ? 0 : p === "professional" ? 2999 : 9999); set("student_limit", p === "starter" ? 200 : p === "professional" ? 1000 : 5000); set("teacher_limit", p === "starter" ? 20 : p === "professional" ? 100 : 500); }}
                      className={`p-4 rounded-xl border-2 text-sm font-bold capitalize transition-all ${form.plan === p ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shadow-sm" : "border-border hover:border-indigo-300 hover:bg-muted"}`}
                    >
                      <div>{p}</div>
                      <div className="text-xs font-normal text-muted-foreground mt-1">
                        {p === "starter" ? "Up to 200 students" : p === "professional" ? "Up to 1,000 students" : "Unlimited"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Student Limit</label>
                  <input type="number" min={10} value={form.student_limit} onChange={(e) => set("student_limit", Number(e.target.value))} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Teacher Limit</label>
                  <input type="number" min={1} value={form.teacher_limit} onChange={(e) => set("teacher_limit", Number(e.target.value))} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Monthly Fee (₹)</label>
                  <input type="number" min={0} value={form.monthly_amount} onChange={(e) => set("monthly_amount", Number(e.target.value))} className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2">Billing Cycle</label>
                <div className="flex gap-2">
                  {(["monthly", "quarterly", "yearly"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => set("billing_cycle", c)} className={`px-4 py-2 text-xs font-semibold rounded-lg border capitalize ${form.billing_cycle === c ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" : "border-border hover:bg-muted"}`}>{c}</button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 6: Review */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">✓ Review your school setup before creating</p>
              </div>
              {[
                { title: "Basic Info", items: [["Name", form.name], ["Code", form.code], ["Type", form.school_type], ["Est. Year", form.established_year]] },
                { title: "Contact", items: [["Email", form.email], ["Phone", form.phone], ["City", form.city], ["State", form.state]] },
                { title: "School Admin", items: [["Name", form.admin_name], ["Email", form.admin_email], ["Password", "•".repeat(form.admin_password.length)]] },
                { title: "Subscription", items: [["Plan", form.plan], ["Students", form.student_limit], ["Teachers", form.teacher_limit], ["Monthly ₹", form.monthly_amount]] },
              ].map(({ title, items }) => (
                <div key={title} className="border border-border rounded-xl overflow-hidden">
                  <div className="px-4 py-2 bg-muted/40 border-b border-border">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-2">
                    {items.map(([label, value]) => (
                      <div key={label}>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                        <p className="text-xs font-semibold capitalize">{value || "—"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between flex-shrink-0">
          <button type="button" onClick={() => step === 1 ? onClose() : setStep(step - 1)} className="px-4 py-2.5 text-sm font-medium border border-border rounded-xl hover:bg-muted flex items-center gap-2">
            <ChevronLeft className="size-4" /> {step === 1 ? "Cancel" : "Back"}
          </button>
          {step < TOTAL_STEPS ? (
            <button type="button" onClick={() => setStep(step + 1)} disabled={!canNext()} className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-40 flex items-center gap-2 transition-colors">
              Next <ChevronRight className="size-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={submitting} className="px-6 py-2.5 text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl disabled:opacity-40 shadow-sm flex items-center gap-2 transition-colors">
              {submitting ? "Creating…" : "🚀 Create School"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
