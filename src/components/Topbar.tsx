import {
  Search,
  Bell,
  ChevronLeft,
  ChevronDown,
  Building2,
  X,
  Sun,
  Moon,
  Menu,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolContext } from "@/lib/school-context";
import { useNavigate, Link } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme-provider";
import { GlobalSearch, useGlobalSearch } from "@/components/GlobalSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const { signOut } = useAuth();
  const { profile, roles } = useTenant();
  const { activeSchool, exitSchool } = useSchoolContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isSuper = (roles ?? []).includes("super_admin");
  const isAdmin = (roles ?? []).includes("admin") || isSuper;
  const isTeacher = (roles ?? []).includes("teacher");
  const inSchoolContext = isSuper && activeSchool !== null;
  const { open: searchOpen, setOpen: setSearchOpen } = useGlobalSearch();

  const roleLabel = isSuper
    ? "Super Admin"
    : isAdmin
      ? "School Admin"
      : isTeacher
        ? "Teacher"
        : "Parent";

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-card/95 backdrop-blur-md border-b border-border/70 flex items-center justify-between px-3 sm:px-6 shrink-0 text-card-foreground shadow-xs">
        <div className="flex items-center gap-2.5 sm:gap-4 flex-1 max-w-2xl">
          <button 
            onClick={onToggleSidebar}
            className="size-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-foreground hover:bg-secondary rounded-xl transition-colors lg:hidden cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="size-5.5" />
          </button>
          <button 
            onClick={() => window.history.back()}
            className="size-10 min-h-[40px] min-w-[40px] flex items-center justify-center text-muted-foreground hover:bg-secondary rounded-xl transition-colors hidden lg:flex cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft className="size-5" />
          </button>
          {/* Global Search Trigger */}
          <button
            id="global-search-trigger"
            onClick={() => setSearchOpen(true)}
            className="relative max-w-md w-full min-h-[44px] flex items-center gap-2.5 px-3.5 py-2 bg-secondary/70 border border-border/60 rounded-xl text-sm text-muted-foreground hover:bg-secondary hover:border-primary/40 transition-all cursor-pointer"
          >
            <Search className="size-4 shrink-0 text-primary" />
            <span className="flex-1 text-left hidden sm:block font-medium">Search schools, students, teachers…</span>
            <span className="flex-1 text-left sm:hidden font-medium">Search…</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-card border border-border rounded-md shadow-xs text-muted-foreground font-semibold">
              <span className="text-[9px]">⌘</span>K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Active School Badge (Super Admin in school context) */}
          {inSchoolContext && (
            <div className="hidden sm:flex items-center gap-2 bg-blue-500/10 border border-blue-500/25 rounded-full px-3 py-1.5">
              <Building2 className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 truncate max-w-[120px]">
                {activeSchool.name}
              </span>
              <button
                onClick={() => {
                  exitSchool();
                  void navigate({ to: "/super-admin" });
                }}
                className="size-4 rounded-full bg-blue-500/20 hover:bg-blue-500/40 flex items-center justify-center transition-colors ml-0.5 cursor-pointer"
                title="Exit school context"
                aria-label="Exit school context"
              >
                <X className="size-2.5 text-blue-600 dark:text-blue-400" />
              </button>
            </div>
          )}

          {/* Theme Switcher Button */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="size-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="size-5 text-amber-400" /> : <Moon className="size-5 text-slate-700" />}
          </button>

          <button
            className="size-11 min-h-[44px] min-w-[44px] relative flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="size-5" />
            <span className="absolute top-2.5 right-2.5 size-2 bg-rose-500 rounded-full ring-2 ring-card"></span>
          </button>
          
          {/* User Profile Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 cursor-pointer hover:bg-secondary p-1 pr-2 rounded-full transition-colors outline-none min-h-[44px]">
                <div className="size-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shadow-xs ring-2 ring-primary/20">
                  {(profile?.full_name || "U").slice(0, 1).toUpperCase()}
                </div>
                <ChevronDown className="size-4 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 p-2 rounded-2xl shadow-xl border border-border">
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold leading-none truncate text-foreground">{profile?.full_name || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground truncate">{profile?.email || ""}</p>
                  <span className="inline-block w-fit mt-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                    {roleLabel}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/change-password" className="flex items-center gap-2.5 px-3 py-2 cursor-pointer w-full text-xs font-semibold rounded-lg">
                  <KeyRound className="size-4 text-muted-foreground" />
                  <span>Change Password</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  void signOut().then(() => navigate({ to: "/login" }));
                }}
                className="flex items-center gap-2.5 px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 dark:text-rose-400 cursor-pointer text-xs font-semibold rounded-lg"
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Search Modal */}
      {searchOpen && <GlobalSearch onClose={() => setSearchOpen(false)} />}
    </>
  );
}
