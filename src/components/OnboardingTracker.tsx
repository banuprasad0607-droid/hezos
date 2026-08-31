import { CheckCircle2, Circle, Clock } from "lucide-react";

interface OnboardingFlag {
  key: string;
  label: string;
}

const FLAGS: OnboardingFlag[] = [
  { key: "basic_info", label: "Basic School Info" },
  { key: "school_admin", label: "School Admin Created" },
  { key: "academic_year", label: "Academic Year Set" },
  { key: "classes", label: "Classes Added" },
  { key: "sections", label: "Sections Configured" },
  { key: "teachers", label: "Teachers Invited" },
  { key: "students", label: "Students Added" },
  { key: "fees", label: "Fee Structure Set" },
  { key: "timetable", label: "Timetable Created" },
];

export function getOnboardingPct(flags: Record<string, boolean> | null | undefined): number {
  if (!flags) return 0;
  const done = FLAGS.filter((f) => flags[f.key]).length;
  return Math.round((done / FLAGS.length) * 100);
}

interface OnboardingTrackerProps {
  flags?: Record<string, boolean> | null;
  compact?: boolean;
}

export function OnboardingTracker({ flags, compact = false }: OnboardingTrackerProps) {
  const pct = getOnboardingPct(flags);
  const done = FLAGS.filter((f) => flags?.[f.key]).length;

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-indigo-500" : pct >= 30 ? "bg-amber-500" : "bg-rose-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground shrink-0 w-8 text-right">{pct}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Progress Summary */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">{pct === 100 ? "✅ Setup Complete!" : `${done} of ${FLAGS.length} steps done`}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{pct === 100 ? "School is fully configured" : "Complete all steps to fully activate the school"}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{pct}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${pct === 100 ? "bg-emerald-500" : pct >= 60 ? "bg-indigo-500" : pct >= 30 ? "bg-amber-500" : "bg-rose-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {FLAGS.map((flag) => {
          const done = flags?.[flag.key] ?? false;
          return (
            <div
              key={flag.key}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-colors ${
                done
                  ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                  : "bg-muted/30 border-border"
              }`}
            >
              {done ? (
                <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <Circle className="size-4 text-muted-foreground shrink-0" />
              )}
              <span className={`text-xs font-medium ${done ? "text-emerald-800 dark:text-emerald-200" : "text-muted-foreground"}`}>
                {flag.label}
              </span>
              {!done && <Clock className="size-3 text-muted-foreground ml-auto shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
