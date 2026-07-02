import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { CredentialsCard } from "@/components/CredentialsCard";
import { toast } from "sonner";
import {
  Shield,
  Users,
  GraduationCap,
  UserPlus,
  Megaphone,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Building2,
  Trash2,
  Save,
  ShieldCheck,
  ShieldOff,
  Plus,
  ArrowRightLeft,
  Wallet,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPanel,
});

type Staff = {
  user_id: string;
  full_name: string;
  email: string | null;
  roles: ("admin" | "teacher" | "parent")[];
};

type Counts = {
  students: number;
  teachers: number;
  classes: number;
  pendingInvites: number;
  announcements: number;
  homework: number;
};

function AdminPanel() {
  const {
    currentSchoolId: effectiveSchoolId,
    roles,
    user,
    profile,
    loading: tenantLoading,
  } = useTenant();
  const schoolId = effectiveSchoolId;
  const { refresh } = useAuth();
  usePageTitle("Admin Panel");
  const navigate = useNavigate();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");

  const [schoolName, setSchoolName] = useState("");
  const [savingSchool, setSavingSchool] = useState(false);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(true);
  const [ownedSchools, setOwnedSchools] = useState<{ id: string; name: string }[]>([]);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [creatingSchool, setCreatingSchool] = useState(false);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin || !effectiveSchoolId) return;
    void loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, effectiveSchoolId]);

  const loadAll = async () => {
    setLoading(true);
    const [
      school,
      profiles,
      userRoles,
      students,
      classes,
      invites,
      announcements,
      homework,
      owned,
    ] = await Promise.all([
      supabase.from("schools").select("school_name").eq("id", effectiveSchoolId!).maybeSingle(),
      supabase
        .from("profiles")
        .select("user_id, full_name, email")
        .eq("school_id", effectiveSchoolId!),
      supabase.from("user_roles").select("user_id, role").eq("school_id", effectiveSchoolId!),
      supabase
        .from("students")
        .select("id", { count: "exact", head: true })
        .eq("school_id", effectiveSchoolId!),
      supabase
        .from("classes")
        .select("id", { count: "exact", head: true })
        .eq("school_id", effectiveSchoolId!),
      supabase
        .from("teacher_invitations")
        .select("id", { count: "exact", head: true })
        .eq("school_id", effectiveSchoolId!)
        .is("accepted_at", null)
        .is("revoked_at", null),
      supabase
        .from("announcements")
        .select("id", { count: "exact", head: true })
        .eq("school_id", effectiveSchoolId!),
      supabase
        .from("homework")
        .select("id", { count: "exact", head: true })
        .eq("school_id", effectiveSchoolId!),
      supabase
        .from("schools")
        .select("id, school_name")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: true }),
    ]);

    setOwnedSchools((owned.data ?? []).map((s) => ({ id: s.id, name: s.school_name })));
    setSchoolName(school.data?.school_name ?? "");

    const rolesByUser = new Map<string, Staff["roles"]>();
    (userRoles.data ?? []).forEach((r) => {
      const arr = rolesByUser.get(r.user_id) ?? [];
      arr.push(r.role as Staff["roles"][number]);
      rolesByUser.set(r.user_id, arr);
    });

    const list: Staff[] = (profiles.data ?? [])
      .map((p) => ({
        user_id: p.user_id,
        full_name: p.full_name || "—",
        email: p.email,
        roles: rolesByUser.get(p.user_id) ?? [],
      }))
      .filter((s) => (s.roles ?? []).includes("admin") || (s.roles ?? []).includes("teacher"))
      .sort((a, b) => a.full_name.localeCompare(b.full_name));

    setStaff(list);
    const teacherCount = list.filter((s) => (s.roles ?? []).includes("teacher")).length;
    setCounts({
      students: students.count ?? 0,
      teachers: teacherCount,
      classes: classes.count ?? 0,
      pendingInvites: invites.count ?? 0,
      announcements: announcements.count ?? 0,
      homework: homework.count ?? 0,
    });
    setLoading(false);
  };

  const saveSchool = async (e: FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;
    setSavingSchool(true);
    // Note: school_name is a generated column (alias of 'name'), so we update 'name'
    const { error } = await supabase
      .from("schools")
      .update({ name: schoolName.trim() })
      .eq("id", schoolId);
    setSavingSchool(false);
    if (error) return toast.error(error.message);
    toast.success("School updated");
    void refresh();
  };

  const createSchool = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const name = newSchoolName.trim();
    if (!name) return;
    setCreatingSchool(true);
    try {
      const newId = crypto.randomUUID();
      const { error: schoolErr } = await supabase
        .from("schools")
        .insert({ id: newId, name, owner_id: user.id });
      if (schoolErr) throw schoolErr;
      // Switch profile to new school so the admin role insert satisfies current_school_id() check
      const { error: profileErr } = await supabase
        .from("profiles")
        .update({ school_id: newId })
        .eq("user_id", user.id);
      if (profileErr) throw profileErr;
      const { error: roleErr } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, school_id: newId, role: "admin" });
      if (roleErr) throw roleErr;
      toast.success(`Created "${name}" and switched to it`);
      setNewSchoolName("");
      await refresh();
    } catch (err: unknown) {
      const msg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : String(err);
      toast.error(msg || "Failed to create school");
    } finally {
      setCreatingSchool(false);
    }
  };

  const switchSchool = async (id: string) => {
    if (!user || id === schoolId) return;
    setSwitchingTo(id);
    const { error } = await supabase
      .from("profiles")
      .update({ school_id: id })
      .eq("user_id", user.id);
    setSwitchingTo(null);
    if (error) return toast.error(error.message);
    toast.success("Switched school");
    await refresh();
  };

  const grantAdmin = async (uid: string) => {
    if (!schoolId) return;
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: uid, school_id: schoolId, role: "admin" });
    if (error) return toast.error(error.message);
    toast.success("Admin role granted");
    void loadAll();
  };

  const revokeAdmin = async (uid: string) => {
    if (!schoolId) return;
    if (uid === user?.id) return toast.error("You can't revoke your own admin role");
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", uid)
      .eq("school_id", schoolId)
      .eq("role", "admin");
    if (error) return toast.error(error.message);
    toast.success("Admin role revoked");
    void loadAll();
  };

  const removeStaff = async (s: Staff) => {
    if (!schoolId) return;
    if (s.user_id === user?.id) return toast.error("You can't remove yourself");
    if (!confirm(`Remove ${s.full_name} from this school? They will lose all access.`)) return;
    const { error: rolesErr } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", s.user_id)
      .eq("school_id", schoolId);
    if (rolesErr) return toast.error(rolesErr.message);
    await supabase.from("profiles").update({ school_id: null }).eq("user_id", s.user_id);
    toast.success(`${s.full_name} removed`);
    void loadAll();
  };

  if (!isAdmin) {
    return (
      <>
        <PageHeader title="Admin Panel" breadcrumb="Restricted" />
        <div className="p-8">
          <div className="max-w-md mx-auto bg-card border border-border rounded-xl p-8 text-center">
            <Shield className="size-10 text-muted-foreground mx-auto" />
            <h2 className="mt-3 font-semibold">Admin access only</h2>
            <p className="text-sm text-muted-foreground mt-1">
              You need an admin role to access the control panel.
            </p>
            <button
              onClick={() => navigate({ to: "/dashboard" })}
              className="mt-4 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  const services: {
    to: string;
    label: string;
    icon: typeof Users;
    count?: number;
    desc: string;
  }[] = [
    {
      to: "/students",
      label: "Students & Parents",
      icon: Users,
      count: counts?.students,
      desc: "Roster, parent linking",
    },
    {
      to: "/classes",
      label: "Classes",
      icon: GraduationCap,
      count: counts?.classes,
      desc: "Grades and sections",
    },
    { to: "/fees", label: "Fees & Invoices", icon: Wallet, desc: "Structures, invoices, payments" },
    {
      to: "/attendance",
      label: "Attendance",
      icon: CalendarCheck,
      desc: "Daily marking & history",
    },
    {
      to: "/homework",
      label: "Homework",
      icon: BookOpen,
      count: counts?.homework,
      desc: "Assignments & files",
    },
    { to: "/remarks", label: "Remarks", icon: MessageSquare, desc: "Teacher feedback" },
    {
      to: "/announcements",
      label: "Announcements",
      icon: Megaphone,
      count: counts?.announcements,
      desc: "School-wide notices",
    },
    {
      to: "/invitations",
      label: "Invite Teachers",
      icon: UserPlus,
      count: counts?.pendingInvites,
      desc: "Pending invitations",
    },
    { to: "/parent", label: "Parent Digest", icon: Shield, desc: "Preview parent view" },
  ];

  return (
    <>
      <PageHeader
        title="Admin Panel"
        breadcrumb={profile?.full_name ?? "Admin"}
        actions={
          <Link
            to="/invitations"
            className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90 inline-flex items-center gap-1"
          >
            <UserPlus className="size-4" /> Invite teacher
          </Link>
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label="Students" value={counts?.students ?? "—"} />
          <Stat label="Teachers" value={counts?.teachers ?? "—"} />
          <Stat label="Classes" value={counts?.classes ?? "—"} />
          <Stat label="Pending invites" value={counts?.pendingInvites ?? "—"} tone="brand" />
        </div>

        {/* Services control grid */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Services
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  className="group bg-card border border-border rounded-xl p-5 hover:border-brand/40 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="size-9 rounded-lg bg-brand-soft text-brand flex items-center justify-center">
                      <Icon className="size-4" />
                    </div>
                    {typeof s.count === "number" && (
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {s.count}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 font-medium text-foreground">{s.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Schools management */}
        <section className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-brand" />
              <h2 className="text-sm font-semibold">Schools</h2>
            </div>
            <span className="text-xs text-muted-foreground">{ownedSchools.length} owned</span>
          </div>

          <ul className="divide-y divide-border">
            {ownedSchools.map((s) => {
              const isCurrent = s.id === schoolId;
              return (
                <li key={s.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isCurrent ? "Active school" : "Owned"}
                    </p>
                  </div>
                  {isCurrent ? (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-brand-soft text-brand px-2 py-1 rounded">
                      Current
                    </span>
                  ) : (
                    <button
                      onClick={() => switchSchool(s.id)}
                      disabled={switchingTo === s.id}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-50"
                    >
                      <ArrowRightLeft className="size-3" />
                      {switchingTo === s.id ? "Switching…" : "Switch"}
                    </button>
                  )}
                </li>
              );
            })}
            {ownedSchools.length === 0 && (
              <li className="px-5 py-6 text-sm text-muted-foreground text-center">
                You don't own any schools yet.
              </li>
            )}
          </ul>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
          <div className="space-y-6">
            {schoolId && <CredentialsCard schoolId={schoolId} />}
            {/* School settings */}
            <form
              onSubmit={saveSchool}
              className="bg-card border border-border rounded-xl p-5 h-fit space-y-4"
            >
              <div className="flex items-center gap-2">
                <Building2 className="size-4 text-brand" />
                <h2 className="text-sm font-semibold">School settings</h2>
              </div>
              <div>
                <label className="text-xs font-medium">School name</label>
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={savingSchool || !schoolName.trim()}
                className="w-full py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold inline-flex items-center justify-center gap-1.5 hover:opacity-90 disabled:opacity-50"
              >
                <Save className="size-4" />
                {savingSchool ? "Saving…" : "Save changes"}
              </button>
            </form>
          </div>

          {/* Staff management */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-semibold">Staff & permissions</h2>
              <span className="text-xs text-muted-foreground">{staff.length} members</span>
            </div>
            {loading ? (
              <div className="p-8 text-sm text-muted-foreground">Loading…</div>
            ) : staff.length === 0 ? (
              <div className="p-8 text-sm text-muted-foreground text-center">
                No staff yet.{" "}
                <Link to="/invitations" className="text-brand font-medium">
                  Invite your first teacher →
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {staff.map((s) => {
                  const isMe = s.user_id === user?.id;
                  const isAdminRole = (s.roles ?? []).includes("admin");
                  return (
                    <li
                      key={s.user_id}
                      className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{s.full_name}</p>
                          {isMe && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                              You
                            </span>
                          )}
                          {s.roles.map((r) => (
                            <span
                              key={r}
                              className={`text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded ${
                                r === "admin"
                                  ? "bg-brand-soft text-brand"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {s.email ?? "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdminRole ? (
                          <button
                            onClick={() => revokeAdmin(s.user_id)}
                            disabled={isMe}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted disabled:opacity-40"
                            title={isMe ? "You can't revoke your own admin" : "Revoke admin"}
                          >
                            <ShieldOff className="size-3" /> Revoke admin
                          </button>
                        ) : (
                          <button
                            onClick={() => grantAdmin(s.user_id)}
                            className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-muted"
                          >
                            <ShieldCheck className="size-3" /> Make admin
                          </button>
                        )}
                        <button
                          onClick={() => removeStaff(s)}
                          disabled={isMe}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 border border-border rounded-md hover:bg-danger-soft hover:text-danger disabled:opacity-40"
                          title={isMe ? "You can't remove yourself" : "Remove from school"}
                        >
                          <Trash2 className="size-3" /> Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: "brand" }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <h3
        className={`text-3xl font-bold mt-2 ${tone === "brand" ? "text-brand" : "text-foreground"}`}
      >
        {value}
      </h3>
    </div>
  );
}
