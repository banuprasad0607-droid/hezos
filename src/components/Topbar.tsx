import {
  Search,
  Bell,
  Settings,
  ChevronLeft,
  ChevronDown,
  Building2,
  X,
  Sun,
  Moon,
  Menu,
} from "lucide-react";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolContext } from "@/lib/school-context";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme-provider";
import { GlobalSearch, useGlobalSearch } from "@/components/GlobalSearch";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { profile, roles } = useTenant();
  const { activeSchool, exitSchool } = useSchoolContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isSuper = (roles ?? []).includes("super_admin");
  const inSchoolContext = isSuper && activeSchool !== null;
  const { open: searchOpen, setOpen: setSearchOpen } = useGlobalSearch();

  return (
    <>
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 shrink-0 text-card-foreground">
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          <button 
            onClick={onToggleSidebar}
            className="p-2 text-muted-foreground hover:bg-accent rounded-md transition-colors lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </button>
          <button 
            onClick={() => window.history.back()}
            className="p-1 text-muted-foreground hover:bg-accent rounded-md transition-colors hidden lg:block"
          >
            <ChevronLeft className="size-5" />
          </button>
          {/* Global Search Trigger */}
          <button
            id="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="relative max-w-md w-full flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border/60 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <Search className="size-4 shrink-0" />
            <span className="flex-1 text-left hidden sm:block">Search schools, students, teachers…</span>
            <span className="flex-1 text-left sm:hidden">Search…</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-card border border-border rounded shadow-sm text-muted-foreground">
              <span className="text-[8px]">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Active School Badge (Super Admin in school context) */}
          {inSchoolContext && (
            <div className="flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-3 py-1.5">
              <Building2 className="size-3.5 text-brand" />
              <span className="text-xs font-semibold text-brand truncate max-w-[120px]">
                {activeSchool.name}
              </span>
              <button
                onClick={() => {
                  exitSchool();
                  void navigate({ to: "/super-admin" });
                }}
                className="size-4 rounded-full bg-brand/20 hover:bg-brand/40 flex items-center justify-center transition-colors ml-0.5"
                title="Exit school context"
                aria-label="Exit school context"
              >
                <X className="size-2.5 text-brand" />
              </button>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
          </button>

          <button className="relative p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
            <Bell className="size-5" />
            <span className="absolute top-2 right-2 size-2 bg-danger rounded-full border-2 border-card"></span>
          </button>
          
          <div className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 pr-2 rounded-full transition-colors">
            <div className="size-8 rounded-full bg-brand flex items-center justify-center text-sm font-semibold text-white shadow-sm">
              {(profile?.full_name || "U").slice(0, 1).toUpperCase()}
            </div>
            <ChevronDown className="size-4 text-muted-foreground" />
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
