import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSchoolCredentials, resetAdminPassword } from "@/lib/platform.functions";
import { toast } from "sonner";
import { Key, Copy, Eye, EyeOff, RefreshCw } from "lucide-react";

export function CredentialsCard({ schoolId }: { schoolId: string }) {
  const fetchCreds = useServerFn(getSchoolCredentials);
  const doReset = useServerFn(resetAdminPassword);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [resetting, setResetting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchCreds({ data: { schoolId } });
      setEmail(res.email ?? null);
      setPassword(res.tempPassword ?? null);
    } catch {
      toast.error("Failed to load credentials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schoolId]);

  const copy = async (text: string | null) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const reset = async () => {
    if (!confirm("Generate a new temporary password? The admin will need to use this to sign in.")) return;
    setResetting(true);
    try {
      const res = await doReset({ data: { schoolId } });
      setPassword(res.password);
      setShowPassword(true);
      toast.success("Password reset successfully");
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : String(err);
      toast.error(msg || "Failed to reset password");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-5 h-fit space-y-4">
      <div className="flex items-center gap-2">
        <Key className="size-4 text-brand" />
        <h2 className="text-sm font-semibold">Credentials</h2>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-3">
          {/* Admin email */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Admin email</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                readOnly
                value={email ?? "—"}
                className="flex-1 min-w-0 px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => copy(email)}
                disabled={!email}
                className="shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40"
                title="Copy email"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Temporary password */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Temporary password</label>
            <div className="mt-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  readOnly
                  type={showPassword ? "text" : "password"}
                  value={password ?? ""}
                  placeholder={password === null ? "Not set" : "••••••••"}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md bg-muted/40 focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                disabled={!password}
                className="shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => copy(password)}
                disabled={!password}
                className="shrink-0 p-2 border border-border rounded-md hover:bg-muted disabled:opacity-40"
                title="Copy password"
              >
                <Copy className="size-3.5" />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            disabled={resetting}
            className="w-full py-2 border border-border rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:bg-muted disabled:opacity-50"
          >
            <RefreshCw className={`size-4 ${resetting ? "animate-spin" : ""}`} />
            {resetting ? "Generating…" : "Reset password"}
          </button>
        </div>
      )}
    </div>
  );
}
