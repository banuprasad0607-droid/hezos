import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolName, usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import { Copy, Mail, X, CheckCircle2, Clock, KeyRound } from "lucide-react";
import { provisionTeacher } from "@/lib/platform.functions";

export const Route = createFileRoute("/_authenticated/invitations")({
  component: InvitationsPage,
});

type Invite = {
  id: string;
  email: string;
  full_name: string | null;
  token: string;
  accepted_at: string | null;
  revoked_at: string | null;
  expires_at: string;
  created_at: string;
  temp_password: string | null;
};

function InvitationsPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    profile,
    roles,
    user,
    loading: tenantLoading,
  } = useTenant();
  const isAdmin = roles.includes("admin") || roles.includes("super_admin");
  const createTeacher = useServerFn(provisionTeacher);
  const schoolDisplayName = useSchoolName();
  usePageTitle("Invite Teachers");
  const [mode, setMode] = useState<"invite" | "direct">("direct");
  const [password, setPassword] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("teacher_invitations")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setInvites((data ?? []) as Invite[]);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const genPassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    let p = "";
    for (let i = 0; i < arr.length; i++) p += chars[arr[i] % chars.length];
    setPassword(p);
  };

  const invite = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user) return;
    setSubmitting(true);
    try {
      if (mode === "direct") {
        if (password.length < 8) {
          toast.error("Password must be at least 8 characters");
          setSubmitting(false);
          return;
        }
        await createTeacher({
          data: {
            email: email.trim().toLowerCase(),
            full_name: fullName.trim() || email.split("@")[0],
            password,
          },
        });
        toast.success(`Teacher ${email} created. Share the password with them.`);
      } else {
        const { error } = await supabase.from("teacher_invitations").insert({
          school_id: effectiveSchoolId,
          email: email.trim().toLowerCase(),
          full_name: fullName.trim() || null,
          invited_by: user.id,
        });
        if (error) throw new Error(error.message);
        toast.success(`Invitation created for ${email}`);
      }
      setEmail("");
      setFullName("");
      setPassword("");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const revoke = async (id: string) => {
    const { error } = await supabase
      .from("teacher_invitations")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Invitation revoked");
    load();
  };

  const inviteLink = (token: string) => `${window.location.origin}/signup?invite=${token}`;

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const mailto = (inv: Invite) => {
    const subject = encodeURIComponent(`You're invited to join ${schoolDisplayName} as a Teacher`);
    const body = encodeURIComponent(
      `Hi${inv.full_name ? " " + inv.full_name : ""},\n\nYou've been invited to join as a teacher at ${schoolDisplayName}.\n\nAccept your invitation and create your account here:\n${inviteLink(inv.token)}\n\nThis link expires on ${new Date(inv.expires_at).toLocaleDateString()}.\n\n— ${profile?.full_name ?? "Your school admin"}`,
    );
    window.location.href = `mailto:${inv.email}?subject=${subject}&body=${body}`;
  };

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Invite Teachers" breadcrumb="Admin only" />
        <p className="text-sm text-muted-foreground">You need admin access to invite teachers.</p>
      </div>
    );
  }

  const statusOf = (inv: Invite) => {
    if (inv.accepted_at)
      return { label: "Accepted", tone: "bg-success/10 text-success", Icon: CheckCircle2 };
    if (inv.revoked_at)
      return { label: "Revoked", tone: "bg-muted text-muted-foreground", Icon: X };
    if (new Date(inv.expires_at) < new Date())
      return { label: "Expired", tone: "bg-muted text-muted-foreground", Icon: Clock };
    return { label: "Pending", tone: "bg-warning/10 text-warning", Icon: Clock };
  };

  return (
    <div>
      <PageHeader title="Teachers" breadcrumb="Admin" />

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <form
          onSubmit={invite}
          className="bg-card border border-border rounded-lg p-5 h-fit space-y-4"
        >
          <div>
            <h2 className="text-sm font-semibold">Add teacher</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Create credentials directly, or send a signup invitation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-md">
            <button
              type="button"
              onClick={() => setMode("direct")}
              className={`text-xs py-1.5 rounded ${mode === "direct" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`}
            >
              Create with password
            </button>
            <button
              type="button"
              onClick={() => setMode("invite")}
              className={`text-xs py-1.5 rounded ${mode === "invite" ? "bg-background shadow-sm font-semibold" : "text-muted-foreground"}`}
            >
              Send invitation
            </button>
          </div>
          <div>
            <label className="text-xs font-medium">Teacher email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@school.edu"
              className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium">
              Full name {mode === "invite" && "(optional)"}
            </label>
            <input
              required={mode === "direct"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Asha Verma"
              className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {mode === "direct" && (
            <div>
              <label className="text-xs font-medium">Temporary password</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono"
                />
                <button
                  type="button"
                  onClick={genPassword}
                  className="px-3 py-2 text-xs border border-border rounded-md hover:bg-muted"
                >
                  Generate
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Share this with the teacher. They can change it after signing in.
              </p>
            </div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Creating…" : mode === "direct" ? "Create teacher" : "Create invitation"}
          </button>
        </form>

        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-semibold">Teachers & invitations</h2>
            <span className="text-xs text-muted-foreground">{invites.length} total</span>
          </div>

          {loading ? (
            <div className="p-8 text-sm text-muted-foreground">Loading…</div>
          ) : invites.length === 0 ? (
            <div className="p-8 text-sm text-muted-foreground text-center">
              No invitations yet. Send your first one to onboard a teacher.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {invites.map((inv) => {
                const s = statusOf(inv);
                const isActive =
                  !inv.accepted_at && !inv.revoked_at && new Date(inv.expires_at) >= new Date();
                return (
                  <li key={inv.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{inv.email}</p>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${s.tone}`}
                          >
                            <s.Icon className="size-3" />
                            {s.label}
                          </span>
                        </div>
                        {inv.full_name && (
                          <p className="text-xs text-muted-foreground mt-0.5">{inv.full_name}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {inv.accepted_at ? "Joined" : "Expires"}{" "}
                          {new Date(inv.accepted_at ?? inv.expires_at).toLocaleDateString()}
                        </p>
                        {inv.temp_password && (
                          <div className="mt-2 flex items-center gap-2 text-xs bg-muted px-2 py-1.5 rounded-md">
                            <KeyRound className="size-3 text-muted-foreground" />
                            <span className="font-mono">{inv.temp_password}</span>
                            <button
                              type="button"
                              onClick={() => copy(inv.temp_password!)}
                              className="ml-auto text-muted-foreground hover:text-foreground"
                              aria-label="Copy password"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {isActive && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copy(inviteLink(inv.token))}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted"
                          >
                            <Copy className="size-3" /> Copy link
                          </button>
                          <button
                            onClick={() => mailto(inv)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 bg-primary text-primary-foreground rounded-md hover:opacity-90"
                          >
                            <Mail className="size-3" /> Email
                          </button>
                          <button
                            onClick={() => revoke(inv.id)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted text-muted-foreground"
                          >
                            <X className="size-3" /> Revoke
                          </button>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
