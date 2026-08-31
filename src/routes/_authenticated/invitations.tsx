import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useTenant } from "@/lib/tenant-context";
import { useSchoolName, usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import { toast } from "sonner";
import {
  Copy,
  Mail,
  X,
  CheckCircle2,
  Clock,
  KeyRound,
  BookOpen,
  GraduationCap,
  Sparkles,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Printer,
  Download,
  Ban,
  RefreshCw,
  Eye,
  UserCheck,
  UserX,
  Search,
  Check,
  ExternalLink,
  Plus,
  AlertCircle,
} from "lucide-react";
import {
  provisionTeacher,
  manageTeacherIdCard,
} from "@/lib/platform.functions";
import { TeacherIdCardModal, type TeacherIdCardData } from "@/components/TeacherIdCardModal";

export const Route = createFileRoute("/_authenticated/invitations")({
  component: InvitationsPage,
});

type SubjectOption = {
  id: string;
  name: string;
  code: string | null;
};

type ClassOption = {
  id: string;
  name: string;
};

interface TeacherRow {
  profile_id: string;
  user_id: string;
  full_name: string;
  email: string;
  employee_id: string; // Teacher ID
  photo_url?: string | null;
  status: "active" | "pending" | "suspended" | "inactive";
  created_at: string;
  subjects: string[];
  classes: string[];
  card?: {
    id: string;
    card_number: string;
    verification_token: string;
    status: "active" | "revoked" | "expired";
    issued_at: string;
  } | null;
}

interface CreationResult {
  full_name: string;
  email: string;
  employee_id: string;
  temp_password: string;
  subject_name: string;
  class_name: string;
  card_number: string;
  verification_token: string;
  qr_verification_url: string;
}

function InvitationsPage() {
  const {
    currentSchoolId: effectiveSchoolId,
    profile,
    roles,
    user,
  } = useTenant();
  const isAdmin = (roles ?? []).includes("admin") || (roles ?? []).includes("super_admin");
  const createTeacher = useServerFn(provisionTeacher);
  const cardManager = useServerFn(manageTeacherIdCard);
  const schoolDisplayName = useSchoolName();
  usePageTitle("Invite & Manage Teachers");

  const [mode, setMode] = useState<"direct" | "invite">("direct");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [autoSendEmail, setAutoSendEmail] = useState(true);

  // Subject & Class Selection
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [classesList, setClassesList] = useState<ClassOption[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [newSubjectName, setNewSubjectName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");

  // Teacher Roster State
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Immediate Success Banner State
  const [createdResult, setCreatedResult] = useState<CreationResult | null>(null);

  // ID Card Modal State
  const [activeCardModal, setActiveCardModal] = useState<TeacherIdCardData | null>(null);

  const loadData = async () => {
    if (!effectiveSchoolId) return;
    setLoading(true);
    try {
      // 1. Fetch Subjects & Classes
      const [subRes, clsRes] = await Promise.all([
        supabase
          .from("subjects")
          .select("id, name, code")
          .eq("school_id", effectiveSchoolId)
          .order("name"),
        supabase
          .from("classes")
          .select("id, name")
          .eq("school_id", effectiveSchoolId)
          .is("deleted_at", null)
          .order("name"),
      ]);

      setSubjects((subRes.data ?? []) as SubjectOption[]);
      setClassesList((clsRes.data ?? []) as ClassOption[]);

      // 2. Fetch Teacher Profiles belonging to this school
      const { data: profData, error: profErr } = await supabase
        .from("profiles")
        .select("id, user_id, full_name, email, employee_id, photo_url, status, created_at")
        .eq("school_id", effectiveSchoolId)
        .order("created_at", { ascending: false });

      if (profErr) throw profErr;

      // 3. Fetch Subject Allocations for this school
      const { data: allocData } = await (supabase as any)
        .from("teacher_allocations")
        .select("teacher_id, subjects(name), classes(name)")
        .eq("school_id", effectiveSchoolId);

      const teacherSubMap = new Map<string, string[]>();
      const teacherClsMap = new Map<string, string[]>();

      (allocData || []).forEach((a: any) => {
        if (a.teacher_id) {
          const subName = a.subjects?.name;
          const clsName = a.classes?.name;
          if (subName) {
            const arr = teacherSubMap.get(a.teacher_id) ?? [];
            if (!arr.includes(subName)) arr.push(subName);
            teacherSubMap.set(a.teacher_id, arr);
          }
          if (clsName) {
            const arr = teacherClsMap.get(a.teacher_id) ?? [];
            if (!arr.includes(clsName)) arr.push(clsName);
            teacherClsMap.set(a.teacher_id, arr);
          }
        }
      });

      // 4. Fetch Active ID Cards for Teachers
      const { data: cardsData } = await (supabase as any)
        .from("teacher_id_cards")
        .select("id, teacher_profile_id, card_number, verification_token, status, issued_at")
        .eq("school_id", effectiveSchoolId)
        .order("issued_at", { ascending: false });

      const cardMap = new Map<string, any>();
      (cardsData || []).forEach((c: any) => {
        if (!cardMap.has(c.teacher_profile_id)) {
          cardMap.set(c.teacher_profile_id, c);
        }
      });

      const roster: TeacherRow[] = (profData || []).map((p: any) => ({
        profile_id: p.id,
        user_id: p.user_id,
        full_name: p.full_name || "Faculty Member",
        email: p.email || "",
        employee_id: p.employee_id || `HEZO-TCH-2026-${p.id.slice(0, 4).toUpperCase()}`,
        photo_url: p.photo_url,
        status: p.status || "active",
        created_at: p.created_at,
        subjects: teacherSubMap.get(p.id) || [],
        classes: teacherClsMap.get(p.id) || [],
        card: cardMap.get(p.id) || null,
      }));

      setTeachers(roster);
    } catch (err: any) {
      toast.error("Failed to load teachers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && effectiveSchoolId) void loadData();
  }, [isAdmin, effectiveSchoolId]);

  const generateCryptographicPassword = () => {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lower = "abcdefghijkmnopqrstuvwxyz";
    const numbers = "23456789";
    const specials = "!@#$%^&*";
    const all = upper + lower + numbers + specials;
    const bytes = new Uint8Array(14);
    crypto.getRandomValues(bytes);

    let pwd = [
      upper[bytes[0] % upper.length],
      lower[bytes[1] % lower.length],
      numbers[bytes[2] % numbers.length],
      specials[bytes[3] % specials.length],
    ];

    for (let i = 4; i < 14; i++) {
      pwd.push(all[bytes[i] % all.length]);
    }

    for (let i = pwd.length - 1; i > 0; i--) {
      const j = bytes[i] % (i + 1);
      [pwd[i], pwd[j]] = [pwd[j], pwd[i]];
    }

    const res = pwd.join("");
    setPassword(res);
    toast.success("Generated cryptographically secure 14-char password!");
  };

  const handleCreateTeacher = async (e: FormEvent) => {
    e.preventDefault();
    if (!effectiveSchoolId || !user) return;

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error("Teacher email is required.");
      return;
    }

    setSubmitting(true);
    setCreatedResult(null);

    try {
      if (mode === "direct") {
        const res = await createTeacher({
          data: {
            email: trimmedEmail,
            full_name: fullName.trim() || trimmedEmail.split("@")[0],
            password: password || undefined, // Server generates cryptographic password if empty
            subject_id: selectedSubjectId || undefined,
            custom_subject_name: newSubjectName.trim() || undefined,
            class_id: selectedClassId || undefined,
            school_id: effectiveSchoolId,
            send_email: autoSendEmail,
          },
        });

        toast.success(`Teacher account for ${trimmedEmail} created successfully!`);

        setCreatedResult({
          full_name: res.full_name,
          email: res.email,
          employee_id: res.employee_id,
          temp_password: res.temp_password,
          subject_name: res.subject_name,
          class_name: res.class_name,
          card_number: res.card_number,
          verification_token: res.verification_token,
          qr_verification_url: res.qr_verification_url,
        });

        // Reset form inputs
        setEmail("");
        setFullName("");
        setPassword("");
        setSelectedSubjectId("");
        setNewSubjectName("");
        setSelectedClassId("");
      } else {
        // Mode === 'invite'
        const { error } = await supabase.from("teacher_invitations").insert({
          school_id: effectiveSchoolId,
          email: trimmedEmail,
          full_name: fullName.trim() || null,
          invited_by: user.id,
        });

        if (error) throw error;
        toast.success(`Invitation created and queued for ${trimmedEmail}`);
        setEmail("");
        setFullName("");
      }

      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to create teacher account.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenIdCardModal = (t: TeacherRow) => {
    if (!t.card) {
      toast.error("No active ID Card found for this teacher. Please regenerate ID card.");
      return;
    }

    setActiveCardModal({
      card_id: t.card.id,
      teacher_id: t.employee_id,
      full_name: t.full_name,
      photo_url: t.photo_url,
      designation: "Teacher",
      department: "Academic Faculty",
      subject_name: t.subjects.join(", ") || "General Faculty",
      class_name: t.classes.join(", ") || "All Classes",
      school_name: schoolDisplayName || "School Campus",
      card_number: t.card.card_number,
      verification_token: t.card.verification_token,
      status: t.card.status,
    });
  };

  const handleRevokeCard = async (cardId: string) => {
    try {
      await cardManager({
        data: { card_id: cardId, action: "revoke", reason: "Administrator revocation" },
      });
      toast.success("Teacher ID Card revoked. QR code is now invalid.");
      setActiveCardModal(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to revoke ID card.");
    }
  };

  const handleRegenerateCard = async (cardId: string) => {
    try {
      const res = await cardManager({
        data: { card_id: cardId, action: "regenerate" },
      });
      toast.success("New Teacher ID Card issued with refreshed QR token!");
      setActiveCardModal(null);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to regenerate ID card.");
    }
  };

  const handleToggleStatus = async (profileId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      const { error } = await (supabase as any)
        .from("profiles")
        .update({ status: nextStatus })
        .eq("id", profileId);
      if (error) throw error;
      toast.success(`Teacher marked as ${nextStatus.toUpperCase()}`);
      await loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update teacher status.");
    }
  };

  const copyToClipboard = (text: string, label = "Copied") => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.full_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.employee_id.toLowerCase().includes(search.toLowerCase());

    if (filterStatus === "all") return matchesSearch;
    return matchesSearch && t.status === filterStatus;
  });

  if (!isAdmin) {
    return (
      <div className="p-8 text-center space-y-3">
        <PageHeader title="Invite Teachers" breadcrumb="Admin only" />
        <p className="text-sm text-muted-foreground">You need administrator privileges to manage faculty.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Teachers & Subject Assignment" breadcrumb="Faculty Management" />

      {/* SUCCESS CONFIRMATION BANNER */}
      {createdResult && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Teacher Account Created Successfully</h3>
                <p className="text-xs text-muted-foreground">
                  Credentials and ID pass generated for {createdResult.full_name}.
                </p>
              </div>
            </div>
            <button
              onClick={() => setCreatedResult(null)}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-background border border-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Teacher ID</span>
              <span className="font-mono font-bold text-foreground">{createdResult.employee_id}</span>
            </div>

            <div className="p-3 bg-background border border-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Login Email</span>
              <span className="font-semibold text-foreground truncate block">{createdResult.email}</span>
            </div>

            <div className="p-3 bg-background border border-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Assigned Subject</span>
              <span className="font-semibold text-indigo-600 dark:text-indigo-400">{createdResult.subject_name}</span>
            </div>

            <div className="p-3 bg-background border border-border rounded-xl">
              <span className="text-[10px] uppercase font-bold text-muted-foreground block">Assigned Class</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{createdResult.class_name}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <KeyRound className="size-4 shrink-0" />
              <span>
                Temporary Password: <strong className="font-mono">{createdResult.temp_password}</strong>
              </span>
            </div>
            <button
              onClick={() => copyToClipboard(createdResult.temp_password, "Temporary Password")}
              className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-semibold rounded-lg flex items-center gap-1 transition"
            >
              <Copy className="size-3" /> Copy Password
            </button>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href={createdResult.qr_verification_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:opacity-90 transition"
            >
              <QrCode className="size-3.5" /> Test Public QR Verification
            </a>
            <span className="text-[11px] text-muted-foreground">
              Save temporary password securely. It will not be shown in plaintext again.
            </span>
          </div>
        </div>
      )}

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid lg:grid-cols-[420px_1fr] gap-6 items-start">
        {/* LEFT COLUMN: TEACHER CREATION FORM */}
        <form
          onSubmit={handleCreateTeacher}
          className="bg-card border border-border rounded-2xl p-6 space-y-5 shadow-xs"
        >
          <div>
            <h2 className="text-base font-bold text-foreground">Teacher Provisioning</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instantly create a faculty account with credentials, ID card, and subject allocation.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => setMode("direct")}
              className={`text-xs py-2 rounded-lg font-semibold transition-all ${
                mode === "direct" ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create with Password
            </button>
            <button
              type="button"
              onClick={() => setMode("invite")}
              className={`text-xs py-2 rounded-lg font-semibold transition-all ${
                mode === "invite" ? "bg-card shadow-xs text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Send Invitation
            </button>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Teacher Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. priya.sharma@school.edu"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Full Name {mode === "invite" && "(Optional)"}
            </label>
            <input
              required={mode === "direct"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* ACADEMIC ALLOCATIONS */}
          {mode === "direct" && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Assigned Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => {
                    setSelectedSubjectId(e.target.value);
                    if (e.target.value) setNewSubjectName("");
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Existing Subject --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} {s.code ? `(${s.code})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  OR Custom Subject Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Environmental Science"
                  value={newSubjectName}
                  disabled={Boolean(selectedSubjectId)}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background disabled:opacity-40"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                  Assigned Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:ring-2 focus:ring-primary"
                >
                  <option value="">-- Select Class --</option>
                  {classesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Section */}
              <div className="pt-3 border-t border-border">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Temporary Password
                  </label>
                  <span className="text-[10px] text-muted-foreground">Auto-generated if empty</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Auto-generated secure 14-char password"
                    className="flex-1 px-3.5 py-2 text-sm border border-border rounded-xl bg-background font-mono focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={generateCryptographicPassword}
                    className="px-3 py-2 text-xs border border-border rounded-xl bg-muted/60 hover:bg-muted font-bold flex items-center gap-1 transition"
                  >
                    <Sparkles className="size-3.5 text-primary" /> Generate
                  </button>
                </div>
              </div>

              {/* Automatic Email Checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-muted-foreground cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={autoSendEmail}
                  onChange={(e) => setAutoSendEmail(e.target.checked)}
                  className="rounded border-border size-4 accent-primary"
                />
                <span>Automatically dispatch login credentials & ID pass via email</span>
              </label>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {submitting ? (
              <>Processing Faculty Account...</>
            ) : mode === "direct" ? (
              <>
                <Plus className="size-4" /> Create Teacher & Assign Subject
              </>
            ) : (
              <>
                <Mail className="size-4" /> Send Teacher Invitation
              </>
            )}
          </button>
        </form>

        {/* RIGHT COLUMN: ACTIVE TEACHER ROSTER & ID PASSES */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs space-y-4">
          <div className="p-5 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-base font-bold text-foreground">Registered Faculty & ID Cards</h2>
              <p className="text-xs text-muted-foreground">
                Live faculty roster with status toggling, QR verification cards, and subject mappings.
              </p>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search faculty..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8.5 pr-3 py-1.5 text-xs bg-background border border-border rounded-lg focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-background border border-border rounded-lg"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-16 text-center text-sm text-muted-foreground space-y-3">
              <RefreshCw className="size-6 animate-spin text-primary mx-auto" />
              <p>Loading school teacher roster...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="p-16 text-center space-y-3 text-muted-foreground">
              <GraduationCap className="size-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm font-semibold">No teachers registered yet.</p>
              <p className="text-xs max-w-sm mx-auto">
                Use the form on the left to create your first teacher account with instant subject and ID pass assignment.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Faculty Member</th>
                    <th className="py-3 px-4">Teacher ID</th>
                    <th className="py-3 px-4">Subjects & Classes</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">ID Card & QR</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTeachers.map((t) => (
                    <tr key={t.profile_id} className="hover:bg-muted/20 transition-colors">
                      {/* Faculty Member */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {t.photo_url ? (
                            <img
                              src={t.photo_url}
                              alt=""
                              className="size-8 rounded-full object-cover border border-border"
                            />
                          ) : (
                            <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                              {t.full_name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-foreground">{t.full_name}</p>
                            <p className="text-[11px] text-muted-foreground">{t.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Teacher ID */}
                      <td className="py-3 px-4 font-mono font-bold text-foreground">
                        {t.employee_id}
                      </td>

                      {/* Subjects & Classes */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1 max-w-[200px]">
                          {t.subjects.length > 0 ? (
                            <div className="flex items-center gap-1 flex-wrap">
                              {t.subjects.map((sub) => (
                                <span
                                  key={sub}
                                  className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-semibold"
                                >
                                  {sub}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground italic text-[11px]">No subject</span>
                          )}

                          {t.classes.length > 0 && (
                            <div className="flex items-center gap-1 flex-wrap">
                              {t.classes.map((cls) => (
                                <span
                                  key={cls}
                                  className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold"
                                >
                                  Class {cls}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Account Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            t.status === "active"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {t.status === "active" ? <UserCheck className="size-3" /> : <UserX className="size-3" />}
                          {t.status}
                        </span>
                      </td>

                      {/* ID Card & QR */}
                      <td className="py-3 px-4">
                        {t.card ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                                t.card.status === "active"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-red-500/10 text-red-600 line-through"
                              }`}
                            >
                              {t.card.card_number}
                            </span>
                            <button
                              onClick={() => handleOpenIdCardModal(t)}
                              className="p-1 text-primary hover:bg-primary/10 rounded-md transition"
                              title="View & Download ID Card"
                            >
                              <QrCode className="size-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic text-[11px]">Card unissued</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {t.card && (
                            <button
                              onClick={() => handleOpenIdCardModal(t)}
                              className="px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg flex items-center gap-1 transition text-[11px]"
                            >
                              <Eye className="size-3" /> Card
                            </button>
                          )}

                          <button
                            onClick={() => handleToggleStatus(t.profile_id, t.status)}
                            title={
                              t.status === "active"
                                ? "Click to suspend/deactivate teacher access"
                                : "Click to reactivate teacher access"
                            }
                            className={`px-2.5 py-1 rounded-lg font-semibold transition text-[11px] inline-flex items-center gap-1.5 border ${
                              t.status === "active"
                                ? "text-amber-700 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 dark:text-amber-400"
                                : "text-emerald-700 bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 dark:text-emerald-400"
                            }`}
                          >
                            {t.status === "active" ? (
                              <>
                                <Ban className="size-3 text-amber-600" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="size-3 text-emerald-600" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ID CARD MODAL */}
      {activeCardModal && (
        <TeacherIdCardModal
          cardData={activeCardModal}
          onClose={() => setActiveCardModal(null)}
          onRevoke={handleRevokeCard}
          onRegenerate={handleRegenerateCard}
        />
      )}
    </div>
  );
}

