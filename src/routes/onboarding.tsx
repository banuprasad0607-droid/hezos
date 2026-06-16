import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "Pending Assignment — HEZO SCHOOL" }] }),
  component: PendingAssignmentPage,
});

function PendingAssignmentPage() {
  const navigate = useNavigate();
  const { user, loading, currentSchoolId: schoolId, roles } = useTenant();
  const { signOut } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/login" });
    else if (roles.includes("super_admin")) navigate({ to: "/super-admin" });
    else if (schoolId) navigate({ to: "/dashboard" });
  }, [user, loading, schoolId, roles, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-background">
      <div className="w-full max-w-md space-y-6 bg-card border border-border rounded-2xl p-8 shadow-sm text-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Account Pending</h1>
          <p className="text-sm text-muted-foreground mt-4">
            Your account has been created, but you haven't been assigned to a school yet. 
            <br/><br/>
            <strong>Note:</strong> Only platform Super Admins can create new schools. 
            If you are a teacher or staff member, please wait for your school administrator to invite you or assign you to a school.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="mt-6 w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
