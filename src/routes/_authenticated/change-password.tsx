import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageHeader } from "@/components/PageHeader";
import { usePageTitle } from "@/hooks/use-school-name";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/change-password")({
  component: ChangePasswordPage,
});

function ChangePasswordPage() {
  const navigate = useNavigate();
  usePageTitle("Change Password");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) return toast.error("Password must be at least 8 characters");
    if (pwd !== confirm) return toast.error("Passwords do not match");
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setSubmitting(false);
    if (error) return toast.error(error.message);
    toast.success("Password updated");
    setPwd("");
    setConfirm("");
    navigate({ to: "/dashboard" });
  };

  return (
    <>
      <PageHeader title="Change password" breadcrumb="Account" />
      <div className="p-8">
        <form
          onSubmit={submit}
          className="max-w-md bg-card border border-border rounded-xl p-6 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
              <KeyRound className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Update your password</h2>
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters.
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">New password</label>
            <input
              type="password"
              required
              minLength={8}
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Confirm password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md disabled:opacity-50"
          >
            {submitting ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </>
  );
}
