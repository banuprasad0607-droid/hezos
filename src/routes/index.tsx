import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { GraduationCap, CalendarCheck, BookOpen, MessageSquare, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HEZO SCHOOL — Daily operations for Indian schools" },
      { name: "description", content: "Attendance, homework, teacher remarks and a Parent Daily Digest. Built for schools with 100–2000 students." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { session, loading, schoolId, roles } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) return;
    if (roles.includes("super_admin") && !schoolId) navigate({ to: "/super-admin" });
    else if (!schoolId && !roles.includes("parent")) navigate({ to: "/onboarding" });
    else navigate({ to: "/dashboard" });
  }, [session, loading, schoolId, roles, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground">H</div>
            <span className="font-semibold tracking-tight">HEZO SCHOOL</span>
          </div>
          <div className="flex gap-2">
            <Link to="/login" className="px-4 py-1.5 text-sm font-medium text-foreground hover:bg-accent rounded-md">Sign in</Link>
            <Link to="/signup" className="px-4 py-1.5 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:opacity-90">Start free</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-soft text-brand text-xs font-medium mb-6">
            <Sparkles className="size-3" /> Built for Indian schools, 100–2000 students
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-balance leading-[1.1]">
            The school operations tool your teachers will actually open every morning.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-2xl text-pretty">
            Mark attendance in one tap. Send homework with a PDF. Add a remark and the parent knows by evening — automatically, in the Parent Daily Digest.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/signup" className="px-5 py-2.5 text-sm font-semibold bg-primary text-primary-foreground rounded-lg shadow-sm hover:opacity-90">
              Set up your school
            </Link>
            <Link to="/login" className="px-5 py-2.5 text-sm font-semibold border border-border rounded-lg hover:bg-accent">
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-20">
          {[
            { icon: CalendarCheck, title: "Attendance", body: "One-tap Present / Absent / Late / Half Day. Realtime." },
            { icon: BookOpen, title: "Homework", body: "Upload PDFs or images. Parents see them instantly." },
            { icon: MessageSquare, title: "Remarks", body: "Academic, behaviour, appreciation. Reaches parents." },
            { icon: GraduationCap, title: "Daily Digest", body: "Every parent gets one clean summary each evening." },
          ].map((f) => (
            <div key={f.title} className="bg-card border border-border rounded-xl p-5">
              <f.icon className="size-5 text-brand" />
              <h3 className="font-semibold mt-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
