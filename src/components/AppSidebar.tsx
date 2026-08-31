import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Megaphone,
  Users,
  GraduationCap,
  UserPlus,
  LogOut,
  Shield,
  ShieldCheck,
  Globe2,
  Wallet,
  Bell,
  BarChart3,
  Banknote,
  Building2,
  KeyRound,
  Trophy,
  Contact,
  ChevronLeft,
  Trash2,
  UserCheck,
  Upload,
  ScrollText,
  Camera,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolName } from "@/hooks/use-school-name";
import { SchoolLogoUploadModal } from "@/components/SchoolLogoUploadModal";

const operationsNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classes", label: "Classes", icon: GraduationCap },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/homework", label: "Homework", icon: BookOpen },
  { to: "/remarks", label: "Remarks", icon: MessageSquare },
  { to: "/marks", label: "Marks Management", icon: BookOpen },
  { to: "/report-cards", label: "Report Cards", icon: Trophy },
  { to: "/achievements", label: "Certificates", icon: Trophy },
  { to: "/id-cards", label: "ID Cards", icon: Contact },
  { to: "/leaves", label: "Leave Requests", icon: CalendarCheck },
] as const;

const commsNav = [
  { to: "/announcements", label: "Announcements", icon: Megaphone },
  { to: "/students", label: "Students & Parents", icon: Users },
  { to: "/notifications", label: "Notifications", icon: Bell },
] as const;

const adminNav = [
  { to: "/admin", label: "Admin Panel", icon: Shield },
  { to: "/admin/whatsapp", label: "WhatsApp Inbox", icon: MessageSquare },
  { to: "/admin/billing", label: "Subscription & Billing", icon: ShieldCheck },
  { to: "/fees", label: "Fees", icon: Wallet },
  { to: "/payroll", label: "Payroll", icon: Banknote },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/teacher-allocations", label: "Teacher Allocations", icon: BookOpen },
  { to: "/invitations", label: "Invite Teachers", icon: UserPlus },
  { to: "/recycle-bin", label: "Recycle Bin", icon: Trash2 },
] as const;

const parentNav = [
  { to: "/parent", label: "Dashboard", icon: LayoutDashboard },
  { to: "/report-cards", label: "Report Cards", icon: Trophy },
  { to: "/achievements", label: "Certificates", icon: Trophy },
  { to: "/homework", label: "Homework", icon: BookOpen },
  { to: "/remarks", label: "Remarks", icon: MessageSquare },
  { to: "/attendance", label: "Attendance", icon: CalendarCheck },
  { to: "/leaves", label: "Leave Requests", icon: CalendarCheck },
  { to: "/announcements", label: "Announcements", icon: Megaphone },
] as const;

export function AppSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const { profile, roles, currentSchool, currentSchoolId: schoolId, refreshTenant } = useTenant();
  const { signOut } = useAuth();
  const { activeSchool, exitSchool } = useSchoolContext();
  const navigate = useNavigate();
  const schoolDisplayName = useSchoolName();
  const [logoModalOpen, setLogoModalOpen] = useState(false);

  const isSuper = (roles ?? []).includes("super_admin");
  const isAdmin = (roles ?? []).includes("admin") || isSuper;
  const isTeacher = (roles ?? []).includes("teacher");
  const isParentOnly = (roles ?? []).includes("parent") && !isAdmin && !isTeacher && !isSuper;

  const roleLabel = isSuper
    ? "Super Admin"
    : isAdmin
      ? "School Admin"
      : isTeacher
        ? "Teacher"
        : "Parent";

  void Globe2;

  // Active school context (super admin entered a school)
  const inSchoolContext = isSuper && activeSchool !== null;

  // Effective schoolId for nav visibility
  const effectiveSchoolId = activeSchool?.id ?? schoolId;

  // Logo letter — use first letter of the display name
  const logoLetter = schoolDisplayName.slice(0, 1).toUpperCase();

  // Logo URL — active school logo or current school logo
  const logoUrl = activeSchool?.logo_url || currentSchool?.logo_url || currentSchool?.school_logo || null;

  const linkCls = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-brand text-white shadow-sm"
        : "text-sidebar-muted hover:bg-white/5 hover:text-white"
    }`;

  return (
    <aside className="w-64 bg-sidebar-bg text-sidebar-fg flex flex-col shrink-0">
      {/* School Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="relative group">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="School logo"
              className="size-9 rounded-xl object-cover border border-white/10 shadow-sm"
            />
          ) : (
            <div className="size-9 bg-brand rounded-xl flex items-center justify-center font-bold text-base text-brand-foreground shadow-sm">
              {logoLetter}
            </div>
          )}

          {isAdmin && effectiveSchoolId && (
            <button
              type="button"
              onClick={() => setLogoModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-1 bg-primary text-primary-foreground rounded-full shadow-md hover:scale-110 transition border border-sidebar-bg opacity-80 group-hover:opacity-100"
              title="Upload / Change School Logo"
            >
              <Camera className="size-2.5" />
            </button>
          )}
        </div>

        <div className="overflow-hidden flex-1">
          <span className="text-base font-semibold tracking-tight block truncate">
            {schoolDisplayName}
          </span>
          {inSchoolContext && (
            <span className="text-[10px] text-sidebar-muted font-medium uppercase tracking-wider">
              Viewing as Super Admin
            </span>
          )}
        </div>
      </div>

      {/* Back to Platform (Super Admin in a school) */}
      {inSchoolContext && (
        <div className="px-4 pb-2">
          <button
            onClick={() => {
              exitSchool();
              onClose?.();
              void navigate({ to: "/platform" });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-sidebar-muted hover:bg-white/5 hover:text-white transition-colors border border-white/10"
          >
            <ChevronLeft className="size-3.5" />
            Back to Platform
          </button>
        </div>
      )}

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto" onClick={onClose}>
        {/* PARENT-ONLY view */}
        {isParentOnly ? (
          <>
            <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3">
              MAIN
            </div>
            {parentNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.to} to={item.to} className={linkCls(pathname === item.to)}>
                  <Icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </>
        ) : (
          <>
            {/* SUPER ADMIN without school context — platform only */}
            {isSuper && !inSchoolContext && (
              <>
                <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3">
                  PLATFORM
                </div>
                <Link to="/platform" className={linkCls(pathname === "/platform")}>
                  <LayoutDashboard className="size-4" />
                  Overview
                </Link>
                <Link to="/platform/schools" className={linkCls(pathname.startsWith("/platform/schools"))}>
                  <Building2 className="size-4" />
                  Schools
                </Link>
                <Link to="/platform/teachers" className={linkCls(pathname.startsWith("/platform/teachers"))}>
                  <Users className="size-4" />
                  Teachers
                </Link>
                <Link to="/platform/staff" className={linkCls(pathname.startsWith("/platform/staff"))}>
                  <UserCheck className="size-4" />
                  Staff
                </Link>
                <Link to="/platform/bulk-import" className={linkCls(pathname.startsWith("/platform/bulk-import"))}>
                  <Upload className="size-4" />
                  Bulk Import
                </Link>
                <Link to="/platform/audit-logs" className={linkCls(pathname.startsWith("/platform/audit-logs"))}>
                  <ScrollText className="size-4" />
                  Audit Logs
                </Link>
              </>
            )}

            {/* School-context nav (admin/teacher/super-in-school) */}
            {effectiveSchoolId && (
              <>
                <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3">
                  MAIN
                </div>
                {operationsNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={linkCls(pathname === item.to)}>
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}

                <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4">
                  MANAGEMENT
                </div>
                {commsNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.to} to={item.to} className={linkCls(pathname === item.to)}>
                      <Icon className="size-4" />
                      {item.label}
                    </Link>
                  );
                })}

                {/* Admin-only section — NOT shown to teachers */}
                {isAdmin && (
                  <>
                    <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4">
                      SYSTEM
                    </div>
                    {adminNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link key={item.to} to={item.to} className={linkCls(pathname === item.to)}>
                          <Icon className="size-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </>
                )}

                {/* Super admin also gets back-to-platform link while in school context */}
                {isSuper && inSchoolContext && (
                  <>
                    <div className="text-[10px] font-bold text-sidebar-muted uppercase tracking-wider px-2 py-3 mt-4">
                      PLATFORM
                    </div>
                    <Link to="/platform" className={linkCls(pathname.startsWith("/platform"))}>
                      <Building2 className="size-4" />
                      Control Center
                    </Link>
                  </>
                )}
              </>
            )}
          </>
        )}
      </nav>

      <div className="p-4 border-t border-white/10" onClick={onClose}>
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-semibold">
            {(profile?.full_name || "U").slice(0, 1).toUpperCase()}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-sm font-medium truncate">{profile?.full_name || "User"}</p>
            <p className="text-xs text-sidebar-muted truncate">{roleLabel}</p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              void signOut().then(() => navigate({ to: "/login" }));
            }}
            className="text-sidebar-muted hover:text-sidebar-fg transition-colors cursor-pointer"
            aria-label="Sign out"
          >
            <LogOut className="size-4" />
          </button>
        </div>
        <Link
          to="/change-password"
          className="flex items-center gap-2 text-xs text-sidebar-muted hover:text-sidebar-fg transition-colors"
        >
          <KeyRound className="size-3.5" />
          Change password
        </Link>
      </div>

      {effectiveSchoolId && (
        <SchoolLogoUploadModal
          isOpen={logoModalOpen}
          onClose={() => setLogoModalOpen(false)}
          schoolId={effectiveSchoolId}
          currentLogoUrl={logoUrl}
          schoolName={schoolDisplayName}
          onLogoUpdated={() => {
            void refreshTenant();
          }}
        />
      )}
    </aside>
  );
}
