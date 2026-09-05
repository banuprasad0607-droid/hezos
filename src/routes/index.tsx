import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useTenant } from "@/lib/tenant-context";
import {
  GraduationCap,
  CalendarCheck,
  BookOpen,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  CreditCard,
  QrCode,
  Users,
  FileSpreadsheet,
  Award,
  Zap,
  Clock,
  IndianRupee,
  ChevronDown,
  Building2,
  Star,
  Layers,
  Smartphone,
  Check,
  X,
  HelpCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HEZO SCHOOL — The #1 All-in-One School SaaS ERP in India" },
      {
        name: "description",
        content:
          "Transform your school operations. Smart Attendance, CBSE/ICSE Report Cards, WhatsApp Daily Digest, QR ID Cards, and UPI Fee Invoices. Built for 100–3000 student schools.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const { session, loading: authLoading } = useAuth();
  const { roles, currentSchoolId: schoolId, loading: tenantLoading } = useTenant();
  const navigate = useNavigate();
  const loading = authLoading || tenantLoading;

  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [studentCount, setStudentCount] = useState<number>(450);
  const [activeTab, setActiveTab] = useState<"attendance" | "report" | "fees" | "whatsapp" | "idcard">("attendance");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!session) return;
    if ((roles ?? []).includes("super_admin")) navigate({ to: "/platform" });
    else if ((roles ?? []).includes("parent")) navigate({ to: "/parent" });
    else if (schoolId) navigate({ to: "/dashboard" });
    else navigate({ to: "/onboarding" });
  }, [session, loading, schoolId, roles, navigate]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Pricing calculations
  const isYearly = billingCycle === "yearly";

  const starterPrice = isYearly ? 799 : 999;
  const growthPrice = isYearly ? 1999 : 2499;
  const enterprisePrice = isYearly ? 3999 : 4999;

  // ROI calculations
  const teachersCount = Math.max(8, Math.round(studentCount / 25));
  const hoursSavedPerMonth = teachersCount * 14;
  const paperSavingsPerYear = studentCount * 180;
  const costPerStudentPerDay = ((growthPrice / 30) / studentCount).toFixed(2);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-brand selection:text-white font-sans">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700 py-2 px-4 text-center text-xs sm:text-sm font-medium text-white flex items-center justify-center gap-2">
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
          New Release
        </span>
        <span>CBSE 8-Point Automated Report Cards & WhatsApp Daily Digest are now live!</span>
        <Link to="/signup" className="underline font-semibold hover:text-white/80 hidden sm:inline ml-1">
          Try it free &rarr;
        </Link>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-blue-500/25">
              H
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                HEZO SCHOOL
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                SaaS ERP
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Modules
            </a>
            <a href="#preview" className="hover:text-white transition-colors">
              Interactive Demo
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Pricing (₹)
            </a>
            <a href="#roi" className="hover:text-white transition-colors">
              ROI Calculator
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-4.5 py-2 text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-indigo-500 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start 14-Day Free Trial
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-700/40 text-blue-400 text-xs font-semibold mb-8 shadow-inner">
            <Sparkles className="size-3.5 text-blue-400" />
            <span>Built Specifically for Indian Schools (100–3,000 Students)</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1] max-w-5xl mx-auto">
            The School Operating System{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Teachers & Parents Love
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto text-balance leading-relaxed">
            Replace 6 disjointed spreadsheets with one unified SaaS platform. One-tap attendance, CBSE/ICSE report cards,
            UPI fee collection, QR ID cards, and automated evening WhatsApp digests.
          </p>

          {/* Action CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 text-base font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-size-200 text-white rounded-xl shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
            >
              <span>Create School Account</span>
              <ArrowRight className="size-4" />
            </Link>
            <a
              href="#preview"
              className="w-full sm:w-auto px-7 py-4 text-base font-semibold border border-slate-700 hover:border-slate-500 bg-slate-900/60 hover:bg-slate-800 text-slate-200 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Zap className="size-4 text-amber-400" />
              <span>Explore Live Demo</span>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-slate-400 text-xs sm:text-sm">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>14-Day Full Free Trial</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>CBSE / ICSE Compliant</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-400" />
              <span>Razorpay & UPI Ready</span>
            </div>
          </div>
        </div>

        {/* Live Interactive Product Demo Preview Section */}
        <div id="preview" className="max-w-6xl mx-auto px-4 sm:px-6 mt-16 relative z-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Top Demo Bar */}
            <div className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-500/80" />
                <div className="size-3 rounded-full bg-amber-500/80" />
                <div className="size-3 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-xs font-mono text-slate-400">hezo.school/demo-school-delhi</span>
              </div>

              {/* Tabs Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === "attendance" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🟢 Smart Attendance
                </button>
                <button
                  onClick={() => setActiveTab("report")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === "report" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  📜 CBSE Report Card
                </button>
                <button
                  onClick={() => setActiveTab("fees")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === "fees" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  💳 UPI Fee Invoices
                </button>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === "whatsapp" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  💬 WhatsApp Digest
                </button>
                <button
                  onClick={() => setActiveTab("idcard")}
                  className={`px-3 py-1.5 rounded-md transition-all ${
                    activeTab === "idcard" ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🪪 QR Smart ID Card
                </button>
              </div>
            </div>

            {/* Interactive Preview Canvas */}
            <div className="p-6 sm:p-8 min-h-[380px] bg-slate-950/40">
              {activeTab === "attendance" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                    <div>
                      <h4 className="font-bold text-white text-base">Class 10 - Section A (Mathematics)</h4>
                      <p className="text-xs text-slate-400">Date: Today • Teacher: Mrs. Sunita Sharma</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 bg-emerald-950 border border-emerald-800/60 text-emerald-400 rounded-lg font-semibold">
                        Present: 28
                      </span>
                      <span className="text-xs px-2.5 py-1 bg-red-950 border border-red-800/60 text-red-400 rounded-lg font-semibold">
                        Absent: 2
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { name: "Aarav Sharma", roll: "101", status: "present", time: "08:14 AM" },
                      { name: "Ananya Iyer", roll: "102", status: "present", time: "08:10 AM" },
                      { name: "Devansh Patel", roll: "103", status: "absent", time: "WhatsApp Alert Sent" },
                      { name: "Ishaan Verma", roll: "104", status: "present", time: "08:20 AM" },
                      { name: "Meera Reddy", roll: "105", status: "late", time: "08:35 AM" },
                      { name: "Rohan Gupta", roll: "106", status: "present", time: "08:05 AM" },
                    ].map((st) => (
                      <div
                        key={st.roll}
                        className="bg-slate-900 border border-slate-800/80 p-3.5 rounded-xl flex items-center justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-white">{st.name}</div>
                          <div className="text-xs text-slate-400">Roll #{st.roll} • {st.time}</div>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase ${
                            st.status === "present"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : st.status === "absent"
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "report" && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                    <div>
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">CBSE Term-1 Assessment</span>
                      <h4 className="text-lg font-bold text-white">Student: Aarav Sharma (Grade 10-A)</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-emerald-400">92.4% (Grade A1)</div>
                      <span className="text-xs text-slate-400">Rank #2 in Class</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="py-2.5 px-3">Subject</th>
                          <th className="py-2.5 px-3">Periodic Test (20)</th>
                          <th className="py-2.5 px-3">Terminal (80)</th>
                          <th className="py-2.5 px-3">Total (100)</th>
                          <th className="py-2.5 px-3">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-white">Mathematics</td>
                          <td className="py-2.5 px-3">19</td>
                          <td className="py-2.5 px-3">76</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">95</td>
                          <td className="py-2.5 px-3 font-semibold">A1</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-white">Science</td>
                          <td className="py-2.5 px-3">18</td>
                          <td className="py-2.5 px-3">74</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">92</td>
                          <td className="py-2.5 px-3 font-semibold">A1</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-3 font-medium text-white">English Language & Literature</td>
                          <td className="py-2.5 px-3">18</td>
                          <td className="py-2.5 px-3">71</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-400">89</td>
                          <td className="py-2.5 px-3 font-semibold">A2</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === "fees" && (
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                    <div>
                      <h4 className="font-bold text-white text-base">Quarterly Tuition & Transport Fee Invoice</h4>
                      <p className="text-xs text-slate-400">Invoice: #INV-2026-0892 • GSTIN: 07AAAAA0000A1Z5</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg">
                      PAID VIA UPI
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400">Tuition Fee</span>
                      <div className="text-lg font-bold text-white mt-1">₹ 18,500</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400">Lab & Digital SmartClass</span>
                      <div className="text-lg font-bold text-white mt-1">₹ 2,400</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400">Total Collected</span>
                      <div className="text-lg font-bold text-emerald-400 mt-1">₹ 20,900</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "whatsapp" && (
                <div className="max-w-md mx-auto bg-emerald-950/30 border border-emerald-800/40 p-5 rounded-2xl space-y-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 border-b border-emerald-900/50 pb-3">
                    <div className="size-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      HS
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">HEZO SCHOOL Digest 🇮🇳</div>
                      <div className="text-[11px] text-emerald-400">Official Parent Notification</div>
                    </div>
                  </div>

                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs space-y-2 text-slate-200">
                    <p className="font-semibold text-white">Namaste Mr. Sharma,</p>
                    <p>Here is Aarav&apos;s Daily School Summary for <strong>Today</strong>:</p>
                    <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 space-y-1">
                      <div>✅ <strong>Attendance:</strong> Present (08:14 AM)</div>
                      <div>📚 <strong>Homework:</strong> Math Exercise 4.2 (3 questions)</div>
                      <div>🌟 <strong>Teacher Remark:</strong> &quot;Great participation in Science quiz!&quot;</div>
                    </div>
                    <p className="text-[10px] text-slate-400 pt-1">Sent automatically at 04:30 PM via HEZO School Connect.</p>
                  </div>
                </div>
              )}

              {activeTab === "idcard" && (
                <div className="max-w-sm mx-auto bg-gradient-to-br from-slate-900 to-indigo-950 border border-indigo-700/50 p-6 rounded-2xl shadow-xl space-y-4 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-indigo-900/60 pb-3">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">Delhi Public Model School</div>
                    <div className="size-6 bg-blue-600 rounded flex items-center justify-center text-xs font-bold text-white">H</div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <div className="size-20 bg-slate-800 rounded-xl border border-indigo-500/30 flex items-center justify-center text-slate-400 text-xs">
                      Photo
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-white text-base">Aarav Sharma</div>
                      <div className="text-indigo-300">Grade: 10 - Sec A</div>
                      <div className="text-slate-400">Adm No: DPMS-2024-042</div>
                      <div className="text-slate-400">Emergency: +91 98765 43210</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-indigo-900/40 flex items-center justify-between">
                    <div className="text-[11px] text-slate-400">
                      <span>Scan for Instant Digital Verification</span>
                    </div>
                    <QrCode className="size-10 text-indigo-400" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core SaaS Feature Deep Dives */}
      <section id="features" className="py-24 bg-slate-900/50 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Comprehensive Academic SaaS Modules</h2>
            <p className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Everything Your School Needs to Run Smoothly Every Morning
            </p>
            <p className="mt-4 text-slate-400 text-base">
              Built after working closely with 50+ Indian school principals, teachers, and administrative staff.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CalendarCheck,
                title: "1-Tap Attendance with Auto-Alerts",
                description:
                  "Teachers mark an entire class in under 45 seconds. Absent student parents receive instant WhatsApp and SMS alerts.",
                badge: "Zero Delays",
              },
              {
                icon: Award,
                title: "CBSE & ICSE Term Report Cards",
                description:
                  "Input Periodic Test (PT), Half-Yearly & Final marks. Auto-computes GPA, CBSE 8-point grades, rank, and generates batch PDF cards.",
                badge: "Board Compliant",
              },
              {
                icon: IndianRupee,
                title: "UPI Fee Collections & GST Invoices",
                description:
                  "Generate term fee invoices with automated WhatsApp payment links. Instant GST-compliant receipts for parents.",
                badge: "Razorpay & UPI",
              },
              {
                icon: QrCode,
                title: "QR Smart ID Card Generator",
                description:
                  "Generate beautiful PVC/A4 student and staff identity cards with verifiable security QR codes and barcodes in 1-click.",
                badge: "PVC & A4 Print",
              },
              {
                icon: MessageSquare,
                title: "Automated Parent Daily Digest",
                description:
                  "No need to spam parents. Every parent gets one clean, beautifully composed evening summary containing attendance, homework, and remarks.",
                badge: "High Engagement",
              },
              {
                icon: Users,
                title: "Staff Payroll & Leave Approvals",
                description:
                  "Automated salary structures, monthly payroll runs, payslip generation, and teacher leave review workflows.",
                badge: "HR & Finance",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-slate-950 border border-slate-800/80 rounded-2xl p-7 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="size-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <feature.icon className="size-6" />
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2.5">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Pricing Section (Indian INR) */}
      <section id="pricing" className="py-24 bg-slate-950 border-t border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Simple & Predictable SaaS Pricing</h2>
            <p className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              Priced for Indian Institutions
            </p>
            <p className="mt-4 text-slate-400 text-base">
              No hidden setup fees. No long-term lock-ins. Start with a 14-day full free trial.
            </p>

            {/* Monthly / Annual Toggle */}
            <div className="mt-8 inline-flex items-center gap-3 bg-slate-900 border border-slate-800 p-1.5 rounded-xl">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  !isYearly ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isYearly ? "bg-blue-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            {/* Starter Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="text-lg font-bold text-white">Starter Plan</div>
                <p className="text-xs text-slate-400 mt-1">Best for small schools & coaching institutes</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹{starterPrice.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                {isYearly && <p className="text-[11px] text-emerald-400 mt-1">Billed annually (₹{(starterPrice * 12).toLocaleString("en-IN")}/yr)</p>}

                <div className="mt-8 space-y-3.5 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Up to <strong>250 Students</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Daily Student Attendance</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Homework & PDF Uploads</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Teacher Remarks & Parent Portal</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <X className="size-4 text-slate-600 shrink-0" />
                    <span>CBSE Term Report Cards</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-500">
                    <X className="size-4 text-slate-600 shrink-0" />
                    <span>PVC / A4 ID Card Generator</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="mt-8 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center text-sm transition-all"
              >
                Start 14-Day Free Trial
              </Link>
            </div>

            {/* Growth Plan (Highlighted) */}
            <div className="bg-gradient-to-b from-blue-950/80 to-slate-900 border-2 border-blue-500 rounded-2xl p-8 flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                Most Popular for CBSE/ICSE Schools
              </div>

              <div>
                <div className="text-lg font-bold text-white">Growth Plan</div>
                <p className="text-xs text-blue-300 mt-1">Complete operations for established institutions</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹{growthPrice.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                {isYearly && <p className="text-[11px] text-emerald-400 mt-1">Billed annually (₹{(growthPrice * 12).toLocaleString("en-IN")}/yr)</p>}

                <div className="mt-8 space-y-3.5 text-sm text-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Up to <strong>1,000 Students</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span><strong>CBSE / ICSE Term Report Cards</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span><strong>Instant QR ID Cards (PVC & A4)</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span><strong>Razorpay & UPI Fee Invoices</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Evening WhatsApp Daily Digest</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Parent Leave Requests & Approvals</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="mt-8 w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-center text-sm shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5"
              >
                Start Free 14-Day Trial
              </Link>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all">
              <div>
                <div className="text-lg font-bold text-white">Enterprise Plan</div>
                <p className="text-xs text-slate-400 mt-1">Multi-branch school groups & large campuses</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">₹{enterprisePrice.toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400 font-medium">/ month</span>
                </div>
                {isYearly && <p className="text-[11px] text-emerald-400 mt-1">Billed annually (₹{(enterprisePrice * 12).toLocaleString("en-IN")}/yr)</p>}

                <div className="mt-8 space-y-3.5 text-sm text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span><strong>Unlimited Students & Staff</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Staff Payroll, Payslips & Salary Profiles</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Custom School Branding & Logo Setup</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Custom Report Card Design Support</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Check className="size-4 text-emerald-400 shrink-0" />
                    <span>Dedicated WhatsApp & Phone Account Manager</span>
                  </div>
                </div>
              </div>

              <Link
                to="/signup"
                className="mt-8 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-center text-sm transition-all"
              >
                Contact Sales / Start Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ROI & Time Saved Calculator */}
      <section id="roi" className="py-24 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Interactive School ROI Calculator</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Calculate Your Return on Investment
              </h3>
              <p className="text-sm text-slate-400 mt-2">
                Adjust the slider to your current student capacity to see estimated time, paper, and cost savings.
              </p>
            </div>

            {/* Slider */}
            <div className="mt-10 max-w-xl mx-auto">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className="text-slate-400">Total Enrolled Students:</span>
                <span className="text-blue-400 text-base font-bold">{studentCount} Students</span>
              </div>
              <input
                type="range"
                min="100"
                max="2500"
                step="50"
                value={studentCount}
                onChange={(e) => setStudentCount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1 font-mono">
                <span>100</span>
                <span>500</span>
                <span>1000</span>
                <span>1500</span>
                <span>2500+</span>
              </div>
            </div>

            {/* Calculated Metrics Grid */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl">
                <Clock className="size-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-black text-white">{hoursSavedPerMonth} hrs / mo</div>
                <div className="text-xs text-slate-400 mt-1">Teacher Administrative Time Saved</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl">
                <FileSpreadsheet className="size-6 text-emerald-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">₹{paperSavingsPerYear.toLocaleString("en-IN")}</div>
                <div className="text-xs text-slate-400 mt-1">Annual Savings on Paper & Printing</div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 p-5 rounded-2xl">
                <IndianRupee className="size-6 text-indigo-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-black text-indigo-300">₹{costPerStudentPerDay}</div>
                <div className="text-xs text-slate-400 mt-1">Estimated Cost Per Student Per Day</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) */}
      <section id="faq" className="py-24 bg-slate-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-400">Got Questions?</h2>
            <p className="mt-3 text-3xl font-extrabold text-white">Frequently Asked Questions</p>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "How fast can we set up our school on HEZO SCHOOL?",
                a: "You can be fully operational in less than 5 minutes. You can import existing students and teachers via simple Excel/CSV uploads or use our pre-built setup wizard.",
              },
              {
                q: "Do parents need to download a separate mobile app?",
                a: "No! One of HEZO SCHOOL's biggest advantages is the WhatsApp Parent Daily Digest and responsive mobile web portal. Parents receive clean daily summaries directly on WhatsApp without app fatigue.",
              },
              {
                q: "Are the report cards compliant with CBSE and ICSE standards?",
                a: "Yes. HEZO SCHOOL supports standard CBSE 8-point grading scales, Periodic Tests (PT1/PT2/PT3), Term examinations, Co-scholastic grades, and batch PDF generation with custom school logos.",
              },
              {
                q: "Is our school data secure and compliant with Indian regulations?",
                a: "All database records are protected by strict Row-Level Security (RLS) multi-tenancy, hosted in secure Indian data center regions, with daily automated backups and 256-bit encryption.",
              },
              {
                q: "How does fee collection with UPI and Razorpay work?",
                a: "You can generate digital fee dues that allow parents to pay instantly using GPay, PhonePe, Paytm, BHIM, or Cards. The system automatically marks fees as paid and issues GST-ready receipts.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full py-4 px-6 text-left font-semibold text-white flex items-center justify-between gap-4 hover:bg-slate-850"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`size-4 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Conversion CTA Footer */}
      <section className="py-20 bg-gradient-to-r from-blue-900 via-indigo-950 to-blue-900 border-t border-blue-800/40 relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to Modernize Your School Operations?
          </h2>
          <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">
            Join forward-thinking Indian schools. Start your 14-day full free trial today with instant setup.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 font-extrabold rounded-xl shadow-xl hover:bg-slate-100 transition-all text-base transform hover:-translate-y-0.5"
            >
              Start Free 14-Day Trial &rarr;
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-4 bg-blue-950/60 hover:bg-blue-950 text-white font-semibold rounded-xl border border-blue-500/30 text-base transition-all"
            >
              Sign In to Existing School
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800/80 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <div className="size-6 bg-blue-600 rounded-md flex items-center justify-center font-bold text-white text-xs">H</div>
            <span className="font-bold text-sm">HEZO SCHOOL Connect</span>
            <span className="text-slate-600">|</span>
            <span>Made with ❤️ for Indian Schools</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/login" className="hover:text-slate-300 transition-colors">School Login</Link>
            <Link to="/signup" className="hover:text-slate-300 transition-colors">Register School</Link>
            <a href="#pricing" className="hover:text-slate-300 transition-colors">Pricing</a>
            <Link to="/verify-id" className="hover:text-slate-300 transition-colors">ID Card Verifier</Link>
          </div>

          <div>
            &copy; {new Date().getFullYear()} HEZO SCHOOL Technologies Pvt Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
