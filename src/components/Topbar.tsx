import { Search, Bell, Settings, ChevronLeft, ChevronDown, Building2, X, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { useNavigate } from "@tanstack/react-router";
import { useTheme } from "@/lib/theme-provider";

export function Topbar() {
  const { profile, roles } = useTenant();
  const { activeSchool, exitSchool } = useSchoolContext();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isSuper = roles.includes("super_admin");
  const inSchoolContext = isSuper && activeSchool !== null;
  
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 text-card-foreground">
      <div className="flex items-center gap-6 flex-1">
        <button className="p-1 text-muted-foreground hover:bg-accent rounded-md transition-colors">
          <ChevronLeft className="size-5" />
        </button>
        <div className="relative max-w-md w-full">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search students, classes, teachers..." 
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border-none rounded-md text-sm outline-none focus:ring-1 focus:ring-brand/30 transition-shadow text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
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
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
          <Settings className="size-5" />
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-accent p-1 pr-2 rounded-full transition-colors ml-2">
          <div className="size-8 rounded-full bg-brand flex items-center justify-center text-sm font-semibold text-white shadow-sm">
            {(profile?.full_name || "U").slice(0, 1).toUpperCase()}
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
}
