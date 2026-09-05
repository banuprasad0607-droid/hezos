import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowRight,
  GraduationCap,
  Users,
  CalendarCheck,
  IndianRupee,
  Layers,
  Loader2,
  X,
} from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { seedDemoSchoolData } from "@/lib/platform.functions";
import { toast } from "sonner";

interface OnboardingChecklistProps {
  schoolId: string;
  hasClasses: boolean;
  hasStudents: boolean;
  hasAttendance: boolean;
  hasFees: boolean;
  onRefresh: () => void;
}

export function OnboardingChecklist({
  schoolId,
  hasClasses,
  hasStudents,
  hasAttendance,
  hasFees,
  onRefresh,
}: OnboardingChecklistProps) {
  const [seeding, setSeeding] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const seedDemoFn = useServerFn(seedDemoSchoolData);

  const steps = [
    {
      id: "profile",
      title: "School Profile & Board Settings",
      description: "Institution identity and board affiliation configured.",
      completed: true,
      href: "/admin",
    },
    {
      id: "classes",
      title: "Create Classes & Sections",
      description: "Define class structures from KG to Grade 12.",
      completed: hasClasses,
      href: "/classes",
    },
    {
      id: "students",
      title: "Enroll Students",
      description: "Add students manually or import via CSV/Excel spreadsheet.",
      completed: hasStudents,
      href: "/students",
    },
    {
      id: "attendance",
      title: "Take Today's Attendance",
      description: "Mark attendance in 1-tap and dispatch WhatsApp alerts.",
      completed: hasAttendance,
      href: "/attendance",
    },
    {
      id: "fees",
      title: "Configure Fee Structures",
      description: "Set up tuition, lab, and transport fee schedules.",
      completed: hasFees,
      href: "/fees",
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // If all completed or dismissed, hide
  if (dismissed || completedCount === steps.length) {
    return null;
  }

  const handleSeedDemoData = async () => {
    setSeeding(true);
    try {
      await seedDemoFn({ data: { school_id: schoolId } });
      toast.success("✨ Sample demo classes, students, and fees loaded successfully!");
      onRefresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to load demo data.");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-950/20 via-card to-card border border-blue-500/30 rounded-2xl p-6 shadow-sm relative overflow-hidden mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-brand/10 text-brand text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Quick Setup Guide
            </span>
            <span className="text-xs text-muted-foreground">
              {completedCount} of {steps.length} completed
            </span>
          </div>
          <h3 className="text-lg font-bold text-foreground mt-1">
            Get Your School Ready for Daily Operations
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete these essential steps to unlock the full power of HEZO SCHOOL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!hasStudents && (
            <button
              onClick={handleSeedDemoData}
              disabled={seeding}
              className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-sm hover:from-blue-500 hover:to-indigo-500 flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              {seeding ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Loading Demo Data…</span>
                </>
              ) : (
                <>
                  <Sparkles className="size-3.5 text-amber-300" />
                  <span>Load Sample Demo Data</span>
                </>
              )}
            </button>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
            title="Dismiss checklist"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-muted h-2 rounded-full mt-4 overflow-hidden">
        <div
          className="bg-brand h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-4">
        {steps.map((step) => (
          <Link
            key={step.id}
            to={step.href as any}
            className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
              step.completed
                ? "bg-success-soft/30 border-success/30 text-foreground"
                : "bg-background border-border hover:border-brand/40 hover:shadow-sm"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                {step.completed ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <Circle className="size-4 text-muted-foreground" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {step.completed ? "Done" : "Pending"}
                </span>
              </div>
              <div className="text-xs font-bold text-foreground leading-snug">{step.title}</div>
              <div className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                {step.description}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-brand mt-2">
              <span>{step.completed ? "View" : "Set up"}</span>
              <ArrowRight className="size-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
