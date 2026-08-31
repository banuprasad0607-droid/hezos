import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  Search,
  RefreshCw,
  DownloadCloud,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/staff")({
  component: PlatformStaffPage,
});

type StaffRow = {
  id: string;
  school_id: string;
  full_name: string;
  email?: string | null;
  phone?: string | null;
  department?: string | null;
  designation?: string | null;
  staff_category?: string | null;
  status?: string;
  joining_date?: string | null;
  school_name?: string;
};

const PAGE_SIZE = 20;
const CATEGORIES = ["accountant", "receptionist", "librarian", "transport", "office", "support", "security", "maintenance", "other"];

function PlatformStaffPage() {
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [staffRes, schoolsRes] = await Promise.all([
      (supabase.from as any)("staff").select("*").order("created_at", { ascending: false }),
      supabase.from("schools").select("id, name"),
    ]);

    const schoolMap = new Map((schoolsRes.data ?? []).map((s) => [s.id, s.name]));
    setSchools(schoolsRes.data ?? []);

    if (staffRes.error && (staffRes.error.message || "").includes("relation")) {
      // staff table not yet created — show empty state
      setStaff([]);
    } else {
      setStaff(
        ((staffRes.data ?? []) as any[]).map((s: any) => ({
          ...s,
          school_name: schoolMap.get(s.school_id) ?? "Unknown",
        }))
      );
    }
    setLoading(false);
  };

  const filtered = staff.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.full_name.toLowerCase().includes(q) || (s.email && s.email.toLowerCase().includes(q)) || (s.school_name && s.school_name.toLowerCase().includes(q));
    const matchSchool = schoolFilter === "all" || s.school_id === schoolFilter;
    const matchCat = categoryFilter === "all" || s.staff_category === categoryFilter;
    return matchSearch && matchSchool && matchCat;
  });

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const exportCSV = () => {
    const rows = filtered.map((s) => [s.full_name, s.email, s.staff_category, s.designation, s.school_name].join(","));
    const csv = ["Name,Email,Category,Designation,School", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "hezo_staff.csv";
    a.click();
    toast.success("Exported to CSV");
  };

  const categoryColor: Record<string, string> = {
    accountant: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300",
    receptionist: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300",
    librarian: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300",
    transport: "bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300",
    office: "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300",
    support: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300",
    security: "bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300",
    maintenance: "bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300",
    other: "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400",
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} staff members across {schools.length} schools</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5"><DownloadCloud className="size-3.5" /> Export</button>
          <button onClick={loadData} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5"><RefreshCw className="size-3.5" /> Refresh</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: staff.length },
          { label: "Active", value: staff.filter(s => s.status === "active" || !s.status).length },
          { label: "Schools Covered", value: new Set(staff.map(s => s.school_id)).size },
          { label: "Categories", value: new Set(staff.map(s => s.staff_category).filter(Boolean)).size },
        ].map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search staff..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={schoolFilter} onChange={(e) => { setSchoolFilter(e.target.value); setPage(0); }} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none">
          <option value="all">All Schools</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }} className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none capitalize">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading staff…</div>
        ) : paged.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="size-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium">No staff records found</p>
            <p className="text-xs text-muted-foreground mt-1">Apply the platform migration to enable staff management, then add staff from school dashboards.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3.5">Staff Member</th>
                  <th className="text-left px-5 py-3.5">Category</th>
                  <th className="text-left px-5 py-3.5">Designation</th>
                  <th className="text-left px-5 py-3.5">School</th>
                  <th className="text-left px-5 py-3.5">Contact</th>
                  <th className="text-left px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white font-bold flex items-center justify-center text-xs">
                          {s.full_name.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold">{s.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      {s.staff_category && (
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${categoryColor[s.staff_category] || categoryColor.other}`}>
                          {s.staff_category}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.designation || "—"}</td>
                    <td className="px-5 py-3.5 text-xs flex items-center gap-1.5 mt-1">
                      <Building2 className="size-3 text-muted-foreground" />{s.school_name}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">{s.email || s.phone || "—"}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${s.status === "inactive" ? "bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"}`}>
                        {s.status || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Page {page + 1} of {totalPages}</span>
          <div className="flex items-center gap-1">
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-muted"><ChevronLeft className="size-4" /></button>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="p-1.5 border border-border rounded-lg disabled:opacity-40 hover:bg-muted"><ChevronRight className="size-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
