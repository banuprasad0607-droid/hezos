import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_authenticated/super-admin")({
  component: SuperAdminRedirect,
});

function SuperAdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({ to: "/platform", replace: true });
  }, [navigate]);

  return (
    <div className="p-8 text-center text-sm text-muted-foreground">
      Redirecting to Multi-Tenant Control Center…
    </div>
  );
}
