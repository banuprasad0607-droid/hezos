import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useSchoolContext } from "@/lib/school-context";
import { useTenant } from "@/lib/tenant-context";
import { AppSidebar } from "@/components/AppSidebar";
import { Topbar } from "@/components/Topbar";
import { SubscriptionBanner } from "@/components/SubscriptionBanner";
import { AlertCircle } from "lucide-react";

import { useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthLayout,
});

function AuthLayout() {
  const { loading: authLoading, session, signOut } = useAuth();
  const { roles, currentSchoolId: schoolId, currentSchool, loading: tenantLoading } = useTenant();
  const { activeSchool } = useSchoolContext();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loading = authLoading || tenantLoading;
  const schoolStatus = currentSchool?.status;

  const isSuper = (roles || []).includes("super_admin");
  // Super admin can access school pages if they have entered a school context
  const hasSchoolAccess = !!schoolId || (isSuper && !!activeSchool);

  useEffect(() => {
    if (loading) return;
    if (!session) navigate({ to: "/login" });
    else if (!hasSchoolAccess && !(roles || []).includes("parent") && !isSuper)
      navigate({ to: "/onboarding" });
  }, [loading, session, hasSchoolAccess, roles, isSuper, navigate]);

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (schoolStatus === "suspended" && !(roles || []).includes("super_admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-xl p-8 text-center shadow-lg transition-all">
          <div className="size-12 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="size-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-foreground">Access Suspended</h2>
          <p className="text-sm text-muted-foreground mt-3">
            The school linked to your account has been temporarily suspended by the platform
            administrator.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Please contact your school administrator or system owner to restore access.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                void signOut().then(() => navigate({ to: "/login" }));
              }}
              className="w-full px-4 py-2 text-sm font-semibold bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 transition-opacity cursor-pointer"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      {/* Sidebar Backdrop Overlay for Mobile/Tablet */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Responsive Sidebar Container */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[300px] lg:w-64 bg-sidebar-bg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 shadow-2xl lg:shadow-none flex ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AppSidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <SubscriptionBanner />
        <Topbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
