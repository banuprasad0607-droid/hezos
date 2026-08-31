import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useTenant } from "@/lib/tenant-context";
import { PageHeader } from "@/components/PageHeader";
import {
  LayoutDashboard,
  Building2,
  BadgeDollarSign,
  ScrollText,
  Sliders,
  Globe2,
  Users,
  UserCheck,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/platform")({
  head: () => ({ meta: [{ title: "Platform Management — HEZO SCHOOL" }] }),
  component: PlatformLayout,
});

function PlatformLayout() {
  const { roles } = useTenant();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });

  const isSuper = (roles ?? []).includes("super_admin");

  if (!isSuper) {
    return (
      <>
        <PageHeader title="Platform Administration" breadcrumb="Restricted" />
        <div className="p-8">
          <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center shadow-sm">
            <Globe2 className="size-12 text-muted-foreground mx-auto" />
            <h2 className="mt-4 font-semibold text-lg">Super Admin Access Only</h2>
            <p className="text-sm text-muted-foreground mt-2">
              You need platform owner privileges to view the multi-tenant administration control panel.
            </p>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-6 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90 transition-opacity"
            >
              Return to School Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const tabs = [
    { to: "/platform", label: "Overview", icon: LayoutDashboard, exact: true },
    { to: "/platform/schools", label: "Schools", icon: Building2 },
    { to: "/platform/teachers", label: "Teachers", icon: Users },
    { to: "/platform/staff", label: "Staff", icon: UserCheck },
    { to: "/platform/bulk-import", label: "Bulk Import", icon: Upload },
    { to: "/platform/subscriptions", label: "Billing", icon: BadgeDollarSign },
    { to: "/platform/audit-logs", label: "Audit Logs", icon: ScrollText },
    { to: "/platform/settings", label: "Settings", icon: Sliders },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <PageHeader title="Multi-Tenant Control Center" breadcrumb="Platform Super Admin" />

      {/* Secondary Top Navigation Bar for Platform Modules */}
      <div className="border-b border-border bg-card/60 backdrop-blur px-8 py-2 sticky top-0 z-10">
        <nav className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = t.exact ? pathname === t.to : pathname.startsWith(t.to);
            return (
              <Link
                key={t.to}
                to={t.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {t.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Sub-route Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}
