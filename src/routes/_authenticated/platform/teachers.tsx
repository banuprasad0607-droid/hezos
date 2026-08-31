import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users,
  Search,
  Plus,
  RefreshCw,
  DownloadCloud,
  Mail,
  Phone,
  Building2,
  UserCheck,
  UserX,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform/teachers")({
  component: PlatformTeachersPage,
});

type TeacherRow = {
  user_id: string;
  role: string;
  school_id: string | null;
  school_name?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at?: string;
};

const PAGE_SIZE = 20;

function PlatformTeachersPage() {
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [rolesRes, schoolsRes] = await Promise.all([
      supabase
        .from("user_roles")
        .select("user_id, role, school_id, created_at")
        .eq("role", "teacher" as never)
        .order("created_at", { ascending: false }),
      supabase.from("schools").select("id, name"),
    ]);

    const schoolMap = new Map((schoolsRes.data ?? []).map((s) => [s.id, s.name]));
    setSchools(schoolsRes.data ?? []);

    const userIds = (rolesRes.data ?? []).map((r) => r.user_id);
    let profileMap = new Map<string, { full_name: string; email: string; phone?: string }>();

    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .in("user_id", userIds.slice(0, 100));
      (profiles ?? []).forEach((p) =>
        profileMap.set(p.user_id, { full_name: p.full_name, email: p.email || "" })
      );
    }

    setTeachers(
      (rolesRes.data ?? []).map((r) => ({
        ...r,
        school_name: r.school_id ? (schoolMap.get(r.school_id) ?? "Unknown") : "—",
        full_name: profileMap.get(r.user_id)?.full_name || "Unknown Teacher",
        email: profileMap.get(r.user_id)?.email || "",
      }))
    );
    setLoading(false);
  };

  const filtered = teachers.filter((t) => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.full_name?.toLowerCase().includes(q) || t.email?.toLowerCase().includes(q) || t.school_name?.toLowerCase().includes(q);
    const matchSchool = schoolFilter === "all" || t.school_id === schoolFilter;
    return matchSearch && matchSchool;
  });

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const exportCSV = () => {
    const rows = filtered.map((t) => [t.full_name, t.email, t.school_name].join(","));
    const csv = ["Name,Email,School", ...rows].join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    a.download = "hezo_teachers.csv";
    a.click();
    toast.success("Exported");
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Teacher Management</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length} teachers across {schools.length} schools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5 transition-colors">
            <DownloadCloud className="size-3.5" /> Export
          </button>
          <button onClick={loadData} className="px-3 py-2 text-xs font-medium border border-border rounded-lg hover:bg-muted flex items-center gap-1.5 transition-colors">
            <RefreshCw className="size-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Teachers", value: teachers.length, icon: Users, color: "indigo" },
          { label: "Active Schools", value: schools.length, icon: Building2, color: "emerald" },
          { label: "With Profile", value: teachers.filter(t => t.full_name !== "Unknown Teacher").length, icon: UserCheck, color: "blue" },
          { label: "This Month", value: teachers.filter(t => t.created_at && new Date(t.created_at).getMonth() === new Date().getMonth()).length, icon: BookOpen, color: "violet" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</span>
              <div className={`p-1.5 rounded-lg bg-${color}-500/10`}>
                <Icon className={`size-3.5 text-${color}-600 dark:text-${color}-400`} />
              </div>
            </div>
            <p className="text-2xl font-bold">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <div className="relative w-full sm:w-72">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search teacher or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-8 pr-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={schoolFilter}
          onChange={(e) => { setSchoolFilter(e.target.value); setPage(0); }}
          className="px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none"
        >
          <option value="all">All Schools</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} results</span>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Loading teachers…</div>
        ) : paged.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="size-12 mx-auto mb-3 text-muted-foreground/30" />
            <p className="text-sm font-medium text-foreground">No teachers found</p>
            <p className="text-xs text-muted-foreground mt-1">Teachers are added from School Admin → Invitations</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                <tr>
                  <th className="text-left px-5 py-3.5">Teacher</th>
                  <th className="text-left px-5 py-3.5">Email</th>
                  <th className="text-left px-5 py-3.5">School</th>
                  <th className="text-left px-5 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((t) => (
                  <tr key={`${t.user_id}-${t.school_id}`} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-white font-bold flex items-center justify-center text-xs">
                          {(t.full_name || "T").slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-foreground">{t.full_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{t.email || "—"}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs">
                        <Building2 className="size-3 text-muted-foreground" />
                        <span>{t.school_name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted-foreground">
                      {t.created_at ? new Date(t.created_at).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
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
