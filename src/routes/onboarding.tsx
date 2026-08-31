import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapOwnSchool } from "@/lib/platform.functions";
import { Building2, GraduationCap, ArrowRight, Loader2, LogOut, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Welcome & Setup — HEZO SCHOOL" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading, currentSchoolId: schoolId, roles, refreshTenant } = useTenant();
  const { signOut } = useAuth();
  const bootstrapSchoolFn = useServerFn(bootstrapOwnSchool);

  const [schoolName, setSchoolName] = useState("");
  const [creating, setCreating] = useState(false);

  const isSuperAdmin = (roles ?? []).includes("super_admin");
  const isParent = (roles ?? []).includes("parent");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (isSuperAdmin) {
      navigate({ to: "/platform" });
    } else if (isParent) {
      navigate({ to: "/parent" });
    } else if (schoolId) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, schoolId, isSuperAdmin, isParent, navigate]);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) {
      toast.error("Please enter your school or institution name.");
      return;
    }
    setCreating(true);
    try {
      await bootstrapSchoolFn({
        data: { name: schoolName.trim() },
      });
      toast.success("School created successfully! Welcome aboard.");
      await refreshTenant();
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create school.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="size-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Checking account configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground">
      <div className="w-full max-w-lg space-y-6">
        {/* Header Branding */}
        <div className="flex items-center justify-center gap-3">
          <div className="size-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center font-bold text-xl shadow-md">
            H
          </div>
          <span className="font-bold text-xl tracking-tight">HEZO SCHOOL</span>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Set Up Your Institution
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              Welcome to HEZO SCHOOL. Let's create your digital campus workspace to manage
              students, staff, attendance, and academics.
            </p>
          </div>

          <form onSubmit={handleCreateSchool} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                School or Academy Name
              </label>
              <div className="relative">
                <Building2 className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. St. Xavier's International School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating || !schoolName.trim()}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {creating ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Setting up Campus...
                </>
              ) : (
                <>
                  Launch School Workspace <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          {/* Role Assistance Notice */}
          <div className="pt-4 border-t border-border/60 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Joining an existing school?</p>
            <p className="leading-relaxed">
              If you are a teacher or parent, your school administrator will automatically assign you
              to your school classes upon creating your profile.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => navigate({ to: "/platform" })}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <GraduationCap className="size-3.5" /> Platform Control Center
              </button>
            )}
            <button
              type="button"
              onClick={() => signOut()}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 cursor-pointer transition-colors ml-auto"
            >
              <LogOut className="size-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

