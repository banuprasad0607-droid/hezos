import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapOwnSchool } from "@/lib/platform.functions";
import {
  Building2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Loader2,
  LogOut,
  CheckCircle2,
  Sparkles,
  Database,
  Phone,
  MapPin,
  Layers,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/onboarding")({
  head: () => ({ meta: [{ title: "School Setup Wizard — HEZO SCHOOL" }] }),
  component: OnboardingPage,
});

function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading, currentSchoolId: schoolId, roles, refreshTenant } = useTenant();
  const { signOut } = useAuth();
  const bootstrapSchoolFn = useServerFn(bootstrapOwnSchool);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [creating, setCreating] = useState(false);

  // Form State
  const [schoolName, setSchoolName] = useState("");
  const [board, setBoard] = useState("CBSE");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [studentCapacity, setStudentCapacity] = useState("500");
  const [seedDemoData, setSeedDemoData] = useState(true);

  const isSuperAdmin = (roles ?? []).includes("super_admin");
  const isParent = (roles ?? []).includes("parent");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login" });
    } else if (isSuperAdmin) {
      navigate({ to: "/platform" });
    } else if (isParent) {
      navigate({ to: "/parent" });
    } else if (schoolId) {
      navigate({ to: "/dashboard" });
    }
  }, [user, loading, schoolId, isSuperAdmin, isParent, navigate]);

  const handleFinishOnboarding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!schoolName.trim()) {
      toast.error("Please enter your school name.");
      setStep(1);
      return;
    }

    setCreating(true);
    try {
      await bootstrapSchoolFn({
        data: {
          name: schoolName.trim(),
          board,
          phone: phone.trim() || undefined,
          address: address.trim() || undefined,
          seedDemoData,
        },
      });

      toast.success(
        seedDemoData
          ? "🎉 School created with sample demo data! Welcome aboard."
          : "🎉 School created successfully! Welcome aboard."
      );
      await refreshTenant();
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      toast.error(err.message || "Failed to create school.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-background">
        <div className="text-center space-y-3">
          <Loader2 className="size-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Checking account configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        {/* Top Header Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
              H
            </div>
            <div>
              <span className="font-bold tracking-tight text-white">HEZO SCHOOL</span>
              <span className="ml-2 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                Setup Wizard
              </span>
            </div>
          </div>

          <button
            onClick={() => signOut()}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="size-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Step Progress Indicator */}
        <div className="grid grid-cols-3 gap-2">
          <div className={`h-1.5 rounded-full transition-all ${step >= 1 ? "bg-blue-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 2 ? "bg-blue-500" : "bg-slate-800"}`} />
          <div className={`h-1.5 rounded-full transition-all ${step >= 3 ? "bg-blue-500" : "bg-slate-800"}`} />
        </div>

        {/* Main Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
          {/* Step 1: School Identity */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 1 of 3</span>
                <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
                  School Profile & Identity
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Tell us about your institution to configure your customized campus portal.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    School / Institution Name <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. Delhi Public Model Academy"
                      required
                      autoFocus
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Education Board / Affiliation
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                    <option value="ICSE">ICSE / ISC (Council for the Indian School Certificate)</option>
                    <option value="State Board">State Board (Matriculation / State SSC)</option>
                    <option value="Cambridge/IB">Cambridge (IGCSE) / International Baccalaureate (IB)</option>
                    <option value="Other">Other / Play School & Kindergarten</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      School Contact Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Campus City / State
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. New Delhi"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!schoolName.trim()) {
                      toast.error("Please provide your school name.");
                      return;
                    }
                    setStep(2);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to Academic Settings</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Academic & Operations */}
          {step === 2 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 2 of 3</span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Academic Configuration
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Configure default academic calendar and operational scale.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Active Academic Session
                  </label>
                  <select
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="2026-2027">2026 - 2027 (Current Academic Year)</option>
                    <option value="2025-2026">2025 - 2026</option>
                    <option value="2027-2028">2027 - 2028</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Approximate Student Strength
                  </label>
                  <select
                    value={studentCapacity}
                    onChange={(e) => setStudentCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="250">Up to 250 Students (Small / Play School)</option>
                    <option value="500">250 – 500 Students (Medium School)</option>
                    <option value="1000">500 – 1,000 Students (Standard K-12)</option>
                    <option value="2500">1,000+ Students (Large Campus)</option>
                  </select>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="size-4" />
                    <span>14-Day Full Free Trial Activated</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Your school will have immediate access to all modules including CBSE Report Cards, QR ID Cards,
                    and UPI Fee Invoicing.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue to Quick Start</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Quick Start & Demo Data Loader */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Step 3 of 3</span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  How would you like to start?
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Choose whether to preload sample Indian school demo data to explore all features instantly.
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: Sample Data */}
                <div
                  onClick={() => setSeedDemoData(true)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    seedDemoData
                      ? "bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white flex items-center gap-2">
                          <span>Load Sample Demo Data</span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Preloads 5 realistic classes (Grade 1 to 10), 12 sample students, today&apos;s attendance,
                          and fee structures so you can immediately test report card printing and ID cards.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${
                        seedDemoData ? "border-blue-500 bg-blue-600 text-white" : "border-slate-700"
                      }`}
                    >
                      {seedDemoData && <CheckCircle2 className="size-3.5" />}
                    </div>
                  </div>
                </div>

                {/* Option 2: Clean School */}
                <div
                  onClick={() => setSeedDemoData(false)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    !seedDemoData
                      ? "bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="size-9 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Database className="size-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Start with Empty School</div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Start with a clean slate. You will manually add classes or import students via CSV spreadsheet.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`size-5 rounded-full border flex items-center justify-center shrink-0 ${
                        !seedDemoData ? "border-blue-500 bg-blue-600 text-white" : "border-slate-700"
                      }`}
                    >
                      {!seedDemoData && <CheckCircle2 className="size-3.5" />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  disabled={creating}
                  onClick={() => setStep(2)}
                  className="px-5 py-3 border border-slate-800 hover:bg-slate-800 text-slate-300 font-semibold rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  <ArrowLeft className="size-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={creating}
                  onClick={() => handleFinishOnboarding()}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {creating ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      <span>Provisioning Your School Campus…</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup & Launch Dashboard</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
