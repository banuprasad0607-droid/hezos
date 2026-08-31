import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useSchoolContext } from "@/lib/school-context";
import {
  Search,
  Building2,
  GraduationCap,
  Users,
  UserCheck,
  X,
  ArrowRight,
  Loader2,
} from "lucide-react";

type SearchResult = {
  id: string;
  type: "school" | "student" | "teacher" | "staff";
  label: string;
  sublabel?: string;
  school?: string;
  status?: string;
};

const TYPE_CONFIG = {
  school: { icon: Building2, color: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950", label: "School" },
  student: { icon: GraduationCap, color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-950", label: "Student" },
  teacher: { icon: Users, color: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950", label: "Teacher" },
  staff: { icon: UserCheck, color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950", label: "Staff" },
};

export function GlobalSearch({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { enterSchool } = useSchoolContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      void doSearch(query.trim());
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const doSearch = async (q: string) => {
    setLoading(true);
    try {
      const [schoolsRes, studentsRes, teacherRolesRes] = await Promise.all([
        supabase
          .from("schools")
          .select("id, name, code, status, address")
          .ilike("name", `%${q}%`)
          .limit(5),
        supabase
          .from("students")
          .select("id, full_name, admission_number, school_id")
          .ilike("full_name", `%${q}%`)
          .limit(5),
        supabase
          .from("profiles")
          .select("user_id, full_name, email, school_id")
          .ilike("full_name", `%${q}%`)
          .limit(5),
      ]);

      const out: SearchResult[] = [];

      // Schools
      (schoolsRes.data ?? []).forEach((s) =>
        out.push({ id: s.id, type: "school", label: s.name, sublabel: s.code || undefined, school: s.address || undefined, status: s.status })
      );

      // Students
      (studentsRes.data ?? []).forEach((s) =>
        out.push({ id: s.id, type: "student", label: s.full_name, sublabel: s.admission_number || undefined })
      );

      // Teachers/profiles
      (teacherRolesRes.data ?? []).forEach((p) => {
        if (!out.some((r) => r.id === p.user_id)) {
          out.push({ id: p.user_id, type: "teacher", label: p.full_name, sublabel: p.email || undefined });
        }
      });

      setResults(out);
      setSelectedIndex(0);
    } catch (e) {
      console.error("Search error:", e);
    }
    setLoading(false);
  };

  const handleSelect = useCallback(
    (result: SearchResult) => {
      if (result.type === "school") {
        navigate({ to: "/platform/schools" });
      } else if (result.type === "student") {
        navigate({ to: "/students" });
      } else {
        navigate({ to: "/platform/teachers" });
      }
      onClose();
    },
    [navigate, onClose]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setSelectedIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setSelectedIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter" && results[selectedIndex]) { handleSelect(results[selectedIndex]); }
  };

  // Group results by type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    (acc[r.type] = acc[r.type] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-4 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          {loading ? (
            <Loader2 className="size-4 text-muted-foreground animate-spin shrink-0" />
          ) : (
            <Search className="size-4 text-muted-foreground shrink-0" />
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search schools, students, teachers, staff…"
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex items-center gap-2 shrink-0">
            {query && (
              <button onClick={() => setQuery("")} className="p-1 hover:bg-muted rounded-md transition-colors">
                <X className="size-3.5 text-muted-foreground" />
              </button>
            )}
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-muted text-muted-foreground rounded border border-border">ESC</kbd>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.length < 2 ? (
            <div className="p-6 text-center">
              <Search className="size-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">Type at least 2 characters to search across all schools, students, teachers, and staff.</p>
              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono">↑</kbd><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono">↓</kbd> Navigate</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono">↵</kbd> Select</span>
                <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 bg-muted rounded border border-border font-mono">Esc</kbd> Close</span>
              </div>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="p-6 text-center">
              <p className="text-sm font-medium text-foreground">No results for "{query}"</p>
              <p className="text-xs text-muted-foreground mt-1">Try searching by name, code, or email</p>
            </div>
          ) : (
            <div className="p-2">
              {(Object.entries(grouped) as [string, SearchResult[]][]).map(([type, items]) => {
                const cfg = TYPE_CONFIG[type as SearchResult["type"]];
                const Icon = cfg.icon;
                return (
                  <div key={type} className="mb-2">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{cfg.label}s</div>
                    {items.map((item, i) => {
                      const globalIdx = results.indexOf(item);
                      const isSelected = globalIdx === selectedIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          onMouseEnter={() => setSelectedIndex(globalIdx)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${isSelected ? "bg-indigo-50 dark:bg-indigo-950/50" : "hover:bg-muted"}`}
                        >
                          <div className={`size-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.color}`}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{item.label}</p>
                            {item.sublabel && <p className="text-xs text-muted-foreground truncate">{item.sublabel}</p>}
                          </div>
                          {item.status && (
                            <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === "active" ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" : "bg-muted text-muted-foreground"}`}>
                              {item.status}
                            </span>
                          )}
                          <ArrowRight className={`size-3.5 text-muted-foreground shrink-0 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`} />
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-muted/20 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">{results.length > 0 ? `${results.length} results` : "Global search across all HEZO data"}</p>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>Powered by</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">HEZO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for triggering global search
export function useGlobalSearch() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return { open, setOpen };
}
