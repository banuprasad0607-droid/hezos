import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSchoolName, usePageTitle } from "@/hooks/use-school-name";
import { PageHeader } from "@/components/PageHeader";
import {
  Sparkles,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Megaphone,
  Download,
  AlertCircle,
  Trophy,
  Award,
  Share2,
  User,
} from "lucide-react";
import { safeHtml2Canvas } from "@/lib/pdf-helper";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

// Reusable clean inline styling helper for HTML2Canvas exports
const getPosterStyle = (themeName: string) => {
  const baseStyle = {
    width: "360px",
    height: "450px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
    position: "relative" as const,
    overflow: "hidden",
    borderRadius: "1rem",
    borderWidth: "1px",
    borderStyle: "solid",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    boxSizing: "border-box" as const,
  };

  if (themeName === "rank_1") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #fbbf24 0%, #fef9c2 50%, #f59e0b 100%)",
      color: "#1e293b",
      borderColor: "#fcd34d",
    };
  }
  if (themeName === "rank_2") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #cbd5e1 0%, #f8fafc 50%, #94a3b8 100%)",
      color: "#1e293b",
      borderColor: "#cbd5e1",
    };
  }
  if (themeName === "rank_3") {
    return {
      ...baseStyle,
      backgroundImage: "linear-gradient(135deg, #d97706 0%, #fef3c7 50%, #b45309 100%)",
      color: "#1e293b",
      borderColor: "#d97706",
    };
  }
  // royal / default
  return {
    ...baseStyle,
    backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
    color: "#ffffff",
    borderColor: "#312e81",
  };
};

export const Route = createFileRoute("/_authenticated/parent")({
  component: ParentDashboard,
});

interface Child {
  id: string;
  full_name: string;
  class_id: string | null;
  school_id: string;
  photo_url: string | null;
  classes: { name: string } | null;
  schools: { status: string } | null;
}
interface AttendanceRow {
  date: string;
  status: string;
}
interface HomeworkRow {
  id: string;
  title: string;
  subject: string | null;
  due_date: string | null;
  file_url: string | null;
  file_type: string;
}
interface RemarkRow {
  id: string;
  category: string;
  content: string;
  created_at: string;
}
interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  created_at: string;
}

function ParentDashboard() {
  const { user, profile } = useAuth();
  const schoolDisplayName = useSchoolName();
  usePageTitle("Parent Dashboard");
  const [children, setChildren] = useState<Child[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [homework, setHomework] = useState<HomeworkRow[]>([]);
  const [remarks, setRemarks] = useState<RemarkRow[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementRow[]>([]);

  // Achievements states
  const [childRank, setChildRank] = useState<{
    rank_position: number;
    percentage: number;
    gpa: number;
    academic_year: string;
  } | null>(null);
  const [childAwards, setChildAwards] = useState<
    Array<{ id: string; category: string; title: string; description: string; issued_at: string }>
  >([]);
  const [selectedAward, setSelectedAward] = useState<any | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("students")
      .select("id, full_name, class_id, school_id, photo_url, classes(name), schools(status)")
      .eq("parent_user_id", user.id)
      .then(({ data }) => {
        const list = (
          (data ?? []) as unknown as Array<
            Child & {
              classes: { name: string } | { name: string }[] | null;
              schools: { status: string } | { status: string }[] | null;
            }
          >
        ).map((c) => ({
          ...c,
          classes: Array.isArray(c.classes) ? (c.classes[0] ?? null) : c.classes,
          schools: Array.isArray(c.schools) ? (c.schools[0] ?? null) : c.schools,
        }));
        setChildren(list);
        if (list[0] && !selected) setSelected(list[0].id);
      });
  }, [user]);

  useEffect(() => {
    const child = children.find((c) => c.id === selected);
    if (!child) return;

    if (child.schools?.status === "suspended") {
      setAttendance([]);
      setHomework([]);
      setRemarks([]);
      setAnnouncements([]);
      setChildRank(null);
      setChildAwards([]);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

    (async () => {
      const [att, hw, rem, ann, rnk, awd] = await Promise.all([
        supabase
          .from("attendance")
          .select("date, status")
          .eq("student_id", child.id)
          .gte("date", monthAgo)
          .order("date", { ascending: false }),
        child.class_id
          ? supabase
              .from("homework")
              .select("id, title, subject, due_date, file_url, file_type")
              .eq("class_id", child.class_id)
              .order("created_at", { ascending: false })
              .limit(10)
          : Promise.resolve({ data: [] as HomeworkRow[] }),
        supabase
          .from("remarks")
          .select("id, category, content, created_at")
          .eq("student_id", child.id)
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("announcements")
          .select("id, title, body, created_at")
          .eq("school_id", child.school_id)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("rankings")
          .select("rank_position, percentage, gpa, academic_year")
          .eq("student_id", child.id)
          .eq("is_published", true)
          .maybeSingle(),
        supabase
          .from("awards")
          .select("id, category, title, description, issued_at")
          .eq("student_id", child.id)
          .eq("is_published", true)
          .order("issued_at", { ascending: false }),
      ]);
      setAttendance(att.data ?? []);
      setHomework((hw.data ?? []) as HomeworkRow[]);
      setRemarks(rem.data ?? []);
      setAnnouncements(ann.data ?? []);
      setChildRank(rnk.data || null);
      setChildAwards((awd.data || []) as any[]);

      // unused today guard
      void today;
    })();
  }, [selected, children]);

  const child = children.find((c) => c.id === selected);
  const todayAtt = attendance[0];
  const last30Present = attendance.filter((a) => a.status === "present").length;
  const attRate = attendance.length > 0 ? Math.round((last30Present / attendance.length) * 100) : 0;

  const handleDownloadPoster = (award: any) => {
    setSelectedAward(award);
    setIsExporting("png");
    toast.info("Preparing poster download...");
    setTimeout(() => {
      const element = document.getElementById("parent-poster-export");
      if (!element) {
        toast.error("Poster container not found");
        setIsExporting(null);
        return;
      }
      safeHtml2Canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const link = document.createElement("a");
          link.href = imgData;
          link.download = `${child?.full_name || "student"}_achievement_poster.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          toast.success("Poster downloaded!");
          setIsExporting(null);
        })
        .catch((e) => {
          toast.error("Failed to download poster: " + e.message);
          setIsExporting(null);
        });
    }, 250);
  };

  const handleDownloadCert = (award: any) => {
    setSelectedAward(award);
    setIsExporting("pdf");
    toast.info("Preparing certificate PDF...");
    setTimeout(() => {
      const element = document.getElementById("parent-cert-export");
      if (!element) {
        toast.error("Certificate container not found");
        setIsExporting(null);
        return;
      }
      safeHtml2Canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
      })
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          // Create landscape standard A4 PDF (dimensions in pt: 841.89 x 595.28)
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "pt",
            format: "a4",
          });

          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          // Calculate aspect ratio to fit the page
          const canvasRatio = canvas.width / canvas.height;
          const pageRatio = pdfWidth / pdfHeight;

          let imgWidth = pdfWidth;
          let imgHeight = pdfHeight;
          let x = 0;
          let y = 0;

          if (canvasRatio > pageRatio) {
            // Canvas is wider than standard page ratio
            imgHeight = pdfWidth / canvasRatio;
            y = (pdfHeight - imgHeight) / 2;
          } else {
            // Canvas is taller than standard page ratio
            imgWidth = pdfHeight * canvasRatio;
            x = (pdfWidth - imgWidth) / 2;
          }

          pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);
          pdf.save(`${child?.full_name || "student"}_certificate.pdf`);
          toast.success("Certificate downloaded!");
          setIsExporting(null);
        })
        .catch((e) => {
          toast.error("Failed to download certificate: " + e.message);
          setIsExporting(null);
        });
    }, 250);
  };

  return (
    <>
      <PageHeader
        title="Parent Dashboard"
        breadcrumb={profile?.full_name ?? "Parent"}
        actions={
          children.length > 1 ? (
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="px-3 py-1.5 text-sm border border-border rounded-md bg-card"
            >
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name}
                </option>
              ))}
            </select>
          ) : null
        }
      />

      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        {children.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
            <h3 className="font-semibold">No children linked yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              Ask your child's school admin to add your email{" "}
              <span className="font-mono">{profile?.email}</span> as the parent email for your child
              in their school's system. You'll be linked automatically.
            </p>
          </div>
        ) : child?.schools?.status === "suspended" ? (
          <div className="bg-card border border-border rounded-xl p-12 text-center max-w-2xl mx-auto shadow-sm">
            <div className="size-12 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">School Portal Suspended</h3>
            <p className="text-sm text-muted-foreground mt-2">
              Access to the digital portal for <strong>{child.full_name}</strong>'s school has been
              temporarily suspended.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Please contact the school administration or system owner for support or reactivation
              queries.
            </p>
          </div>
        ) : (
          <>
            {/* Daily Digest Hero */}
            <section className="bg-primary text-primary-foreground rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 size-48 bg-brand/30 blur-3xl rounded-full" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-brand-foreground bg-brand/30 px-3 py-1 rounded-full">
                  <Sparkles className="size-3.5" /> Today's Digest ·{" "}
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <h2 className="text-3xl font-bold mt-4">
                  How {child?.full_name.split(" ")[0]}'s day went
                </h2>
                <p className="text-sm opacity-80 mt-2">
                  A daily summary your child's school sends every evening. Everything that happened
                  — at a glance.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                  <DigestCell
                    label="Attendance"
                    value={todayAtt ? todayAtt.status.replace("_", " ") : "Not marked"}
                  />
                  <DigestCell
                    label="Homework today"
                    value={`${homework.filter((h) => h.due_date && new Date(h.due_date) >= new Date(new Date().toDateString())).length}`}
                  />
                  <DigestCell
                    label="New remarks"
                    value={`${remarks.filter((r) => new Date(r.created_at).toDateString() === new Date().toDateString()).length}`}
                  />
                  <DigestCell label="30-day attendance" value={`${attRate}%`} />
                </div>
              </div>
            </section>

            {/* Achievements & Academic Honors (Integrated Section) */}
            <section className="bg-white border border-border rounded-2xl p-6 shadow-xs space-y-4 text-foreground">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                    <Trophy className="text-amber-500 size-5" /> Academic Ranks & Honor Roll
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Officially published certifications and dashboard achievements.
                  </p>
                </div>
                {childRank && (
                  <span className="bg-amber-50 text-amber-700 font-extrabold border border-amber-200 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="size-3.5 text-amber-500 animate-pulse" /> Rank Position: #
                    {childRank.rank_position} ({childRank.percentage}%)
                  </span>
                )}
              </div>

              {childAwards.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-100 rounded-xl text-xs text-muted-foreground">
                  No published achievements or ranks available for {child?.full_name} at this time.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {childAwards.map((aw) => (
                    <div
                      key={aw.id}
                      className="p-4 border border-slate-100 rounded-xl bg-slate-50/40 flex flex-col justify-between hover:border-slate-200 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="bg-brand/10 text-brand text-[9px] uppercase font-black px-2 py-0.5 rounded">
                            {badgeLabel(aw.category)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(aw.issued_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-800">{aw.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{aw.description}</p>
                      </div>

                      <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100/50">
                        <button
                          onClick={() => handleDownloadPoster(aw)}
                          className="flex-1 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Share2 className="size-3.5" /> Share Poster
                        </button>
                        <button
                          onClick={() => handleDownloadCert(aw)}
                          className="flex-1 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-100 text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Award className="size-3.5" /> Certificate PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Homework */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="size-4 text-brand" /> Recent Homework
                </h3>
                {homework.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-4">No homework posted recently.</p>
                ) : (
                  <div className="space-y-3 mt-4">
                    {homework.map((h) => (
                      <div
                        key={h.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border"
                      >
                        <div>
                          <p className="text-sm font-medium">{h.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {h.subject ?? "—"} · Due {h.due_date ?? "—"}
                          </p>
                        </div>
                        {h.file_url && (
                          <a
                            href={h.file_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-brand font-medium inline-flex items-center gap-1"
                          >
                            <Download className="size-3" /> {h.file_type}
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Remarks */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="size-4 text-brand" /> Teacher Remarks
                </h3>
                {remarks.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-4">No remarks yet.</p>
                ) : (
                  <div className="space-y-3 mt-4">
                    {remarks.map((r) => (
                      <div key={r.id} className="border-l-2 border-brand pl-3">
                        <p className="text-[10px] uppercase tracking-wider font-bold text-brand">
                          {r.category}
                        </p>
                        <p className="text-sm italic mt-1">"{r.content}"</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(r.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attendance history */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <CalendarCheck className="size-4 text-brand" /> Last 30 Days
                </h3>
                <div className="mt-4 flex flex-wrap gap-1">
                  {attendance
                    .slice(0, 30)
                    .reverse()
                    .map((a) => (
                      <div
                        key={a.date}
                        title={`${a.date} · ${a.status}`}
                        className={`size-5 rounded ${
                          a.status === "present"
                            ? "bg-success"
                            : a.status === "absent"
                              ? "bg-danger"
                              : a.status === "late"
                                ? "bg-warning"
                                : "bg-brand"
                        }`}
                      />
                    ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  {last30Present} present out of {attendance.length} marked days
                </p>
              </div>

              {/* Announcements */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold flex items-center gap-2">
                  <Megaphone className="size-4 text-brand" /> School Announcements
                </h3>
                {announcements.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-4">No announcements.</p>
                ) : (
                  <div className="space-y-3 mt-4">
                    {announcements.map((a) => (
                      <div key={a.id} className="p-3 rounded-lg border border-border">
                        <p className="text-sm font-medium">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.body}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(a.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Hidden Portal for PDF/PNG Generation */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {selectedAward && (
          <div id="parent-poster-export" style={getPosterStyle(selectedAward.category)}>
            <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -translate-x-12 translate-y-12 size-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-black/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="size-8 font-extrabold text-sm rounded-lg flex items-center justify-center bg-black/10 text-slate-800 shadow-xs">
                  H
                </div>
                <div>
                  <h4 className="font-extrabold text-xs tracking-wider">{schoolDisplayName}</h4>
                  <p className="text-[7px] uppercase tracking-widest opacity-80">
                    Empowering Academic Excellence
                  </p>
                </div>
              </div>
              <span className="text-[8px] font-bold uppercase tracking-wider opacity-90">
                Academic Showcase
              </span>
            </div>

            <div className="flex flex-col items-center text-center my-6 space-y-4">
              <div className="size-24 rounded-full border-4 border-black/10 bg-white/40 text-slate-700 flex items-center justify-center font-bold text-3xl shadow-lg relative overflow-hidden">
                {child?.photo_url ? (
                  <img
                    src={child.photo_url}
                    alt=""
                    className="size-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  child?.full_name?.slice(0, 1) || "S"
                )}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold tracking-widest opacity-70">
                  Honor Roll Achievement
                </p>
                <h3 className="text-2xl font-black tracking-tight">{child?.full_name}</h3>
                <p className="text-xs font-semibold opacity-90">{child?.classes?.name}</p>
              </div>

              <div className="px-5 py-3 bg-white/40 border border-black/5 rounded-2xl text-center shadow-md space-y-1 max-w-[200px]">
                <div className="flex items-center justify-center gap-1.5 text-xs font-black uppercase text-amber-500">
                  <Trophy className="size-4 animate-bounce" /> {badgeLabel(selectedAward.category)}
                </div>
                <div className="text-[9px] uppercase tracking-wider opacity-85 font-bold">
                  Verified Honor
                </div>
                {childRank && (
                  <div className="text-[10px] font-black text-brand">
                    GPA {childRank.gpa} · Percentage {childRank.percentage}%
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-end justify-between border-t border-black/10 pt-4 text-left">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-wider font-bold opacity-60">
                  Verification Code
                </span>
                <div className="p-1 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&data=VERIFY-${child?.full_name}-HZ`}
                    alt="Verification QR"
                    className="size-8"
                  />
                </div>
              </div>
              <div className="text-right space-y-2">
                <span className="font-serif italic text-amber-600 font-bold text-sm tracking-wide block">
                  Nirosha Reddy
                </span>
                <div className="h-[1px] w-24 bg-black/10 ml-auto" />
                <span className="text-[8px] uppercase font-bold tracking-wider opacity-70">
                  School Principal
                </span>
              </div>
            </div>
          </div>
        )}

        {selectedAward && (
          <div
            id="parent-cert-export"
            className="w-[640px] aspect-[1.414] bg-[#FDFBF7] p-12 border-[12px] border-amber-800 rounded-sm shadow-2xl relative flex flex-col justify-between items-center text-center text-slate-800"
          >
            <div className="absolute inset-2 border-[2px] border-amber-400 pointer-events-none" />
            <div className="absolute top-4 left-4 size-8 border-t-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute top-4 right-4 size-8 border-t-2 border-r-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-4 left-4 size-8 border-b-2 border-l-2 border-amber-600 pointer-events-none" />
            <div className="absolute bottom-4 right-4 size-8 border-b-2 border-r-2 border-amber-600 pointer-events-none" />

            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="size-8 text-amber-500" />
                <h2 className="font-serif italic font-extrabold text-2xl tracking-wider text-amber-900">
                  {schoolDisplayName}
                </h2>
              </div>
              <p className="text-[8px] uppercase tracking-widest font-black opacity-85">
                Affiliated School Certificate of Honors
              </p>
            </div>

            <div className="space-y-4 my-4 flex flex-col items-center">
              <h3 className="font-serif text-2xl font-extrabold text-amber-800 tracking-tight">
                CERTIFICATE OF EXCELLENCE
              </h3>

              {/* Child Photo */}
              <div className="size-14 rounded-full border-2 border-amber-400 bg-white overflow-hidden shadow-xs flex items-center justify-center my-1">
                {child?.photo_url ? (
                  <img
                    src={child.photo_url}
                    alt=""
                    className="size-full object-cover"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <User className="size-6 text-slate-300" />
                )}
              </div>

              <p className="text-[10px] italic text-slate-600">
                This certificate is proudly presented to
              </p>
              <h4 className="font-serif text-xl font-black border-b border-amber-200 pb-0.5 px-6 text-amber-900 inline-block">
                {child?.full_name}
              </h4>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                Awarded for outstanding achievements in{" "}
                <span className="font-bold text-amber-800">{selectedAward.title}</span>.
                Demonstrated academic dedication, good character, and excellence in school values
                for the term.
              </p>
            </div>

            <div className="w-full flex items-end justify-between px-10 border-t border-slate-100 pt-6">
              <div className="text-center space-y-1.5 w-32 text-xs">
                <span className="font-serif italic text-amber-700 font-semibold text-xs tracking-wide">
                  Nirosha Reddy
                </span>
                <div className="h-[1px] bg-slate-300 w-full" />
                <span className="text-[7px] uppercase font-bold tracking-wider opacity-70">
                  School Principal
                </span>
              </div>
              <div className="size-16 rounded-full border-4 border-amber-400 bg-amber-50 shadow-md flex items-center justify-center relative shrink-0">
                <div className="absolute inset-0.5 border border-dashed border-amber-400 rounded-full" />
                <Award className="size-8 text-amber-500" />
              </div>
              <div className="text-center space-y-1.5 w-32 text-xs">
                <span className="font-bold text-slate-700">
                  {new Date(selectedAward.issued_at).toLocaleDateString()}
                </span>
                <div className="h-[1px] bg-slate-300 w-full" />
                <span className="text-[7px] uppercase font-bold tracking-wider opacity-70">
                  Issued Date
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function DigestCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-wider opacity-60">{label}</p>
      <p className="text-lg font-semibold capitalize mt-1">{value}</p>
    </div>
  );
}

function badgeLabel(cat: string) {
  const map: Record<string, string> = {
    rank_1: "Gold Rank Topper",
    rank_2: "Silver Rank #2",
    rank_3: "Bronze Rank #3",
    top_10: "Top 10 Scholar",
    subject_topper: "Subject Topper",
    attendance_topper: "Attendance Champion",
    discipline_award: "Best Discipline Award",
  };
  return map[cat] || cat.toUpperCase().replace("_", " ");
}
