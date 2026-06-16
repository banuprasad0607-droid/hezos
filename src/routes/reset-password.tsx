import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap, KeyRound, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Choose New Password — HEZO SCHOOL" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    // Check if we have an active recovery session.
    // Sometimes Supabase takes a small delay to parse the hash from the URL and establish the session.
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        // If there's no session, let's wait a moment and try again
        setTimeout(async () => {
          const { data: retryData } = await supabase.auth.getSession();
          if (!retryData.session) {
            toast.error("Recovery session not found. Please request a new link.");
            navigate({ to: "/forgot-password" });
          } else {
            setCheckingSession(false);
          }
        }, 1000);
      } else {
        setCheckingSession(false);
      }
    };
    void checkSession();
  }, [navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      return toast.error(error.message);
    }

    setCompleted(true);
    toast.success("Password reset completed successfully!");
    
    // Automatically sign out after password reset so the user can log in with new password
    await supabase.auth.signOut();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-muted-foreground bg-background">
        Verifying password recovery session…
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-semibold tracking-tight uppercase tracking-wider">HEZO SCHOOL</span>
        </div>
        <div className="max-w-md">
          <p className="text-2xl font-medium leading-snug text-balance">
            "Create a strong, unique password to secure your academic details and keep your account safe."
          </p>
        </div>
        <p className="text-xs text-sidebar-muted">© HEZO SCHOOL</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-card text-foreground">
        <div className="w-full max-w-sm space-y-6">
          {completed ? (
            <div className="space-y-4">
              <div className="size-12 rounded-full bg-success-soft text-success flex items-center justify-center">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Password reset successful</h1>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Your password has been successfully updated. You can now log back into HEZO School ERP using your new password.
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/login" })}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 shadow-sm"
              >
                Sign in with new password
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                  <KeyRound className="size-5" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">Choose new password</h1>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Please choose a password containing at least 8 characters.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">New password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Confirm new password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading ? "Updating password…" : "Reset password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
