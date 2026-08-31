import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { verifyTeacherPublicToken } from "@/lib/platform.functions";
import { useServerFn } from "@tanstack/react-start";
import {
  ShieldCheck,
  ShieldAlert,
  GraduationCap,
  Calendar,
  Building2,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  BookOpen,
} from "lucide-react";

export const Route = createFileRoute("/verify/teacher/$token")({
  head: () => ({ meta: [{ title: "Official Teacher Verification — HEZO SCHOOL" }] }),
  component: TeacherPublicVerifyPage,
});

interface VerificationResult {
  valid: boolean;
  status?: "active" | "revoked" | "expired";
  error?: string;
  card_number?: string;
  issued_at?: string;
  revoked_at?: string;
  teacher_id?: string;
  full_name?: string;
  photo_url?: string | null;
  designation?: string;
  department?: string;
  account_status?: string;
  subject?: string;
  class?: string;
  school_name?: string;
  school_logo?: string | null;
  school_address?: string | null;
  school_phone?: string | null;
}

function TeacherPublicVerifyPage() {
  const { token } = Route.useParams();
  const verifyTokenFn = useServerFn(verifyTeacherPublicToken);

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VerificationResult | null>(null);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setData({ valid: false, error: "No verification token provided in request." });
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenFn({ data: { token } });
        setData(res as VerificationResult);
      } catch (err: any) {
        setData({ valid: false, error: err.message || "Failed to contact verification gateway." });
      } finally {
        setLoading(false);
      }
    }

    void verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 md:p-8 relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.12),transparent_50%)] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10">
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="size-12 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-400">Verifying secure credentials...</p>
          </div>
        ) : !data?.valid ? (
          <div className="p-8 text-center space-y-5">
            <div className="size-20 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto border border-rose-500/20 shadow-inner">
              <ShieldAlert className="size-10" />
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                {data?.status === "revoked" ? "✕ ID CARD REVOKED" : "Verification Failed"}
              </h1>
              <p className="text-xs text-rose-400 font-semibold tracking-wide uppercase">
                {data?.status === "revoked" ? "Card Invalidation Notice" : "Authentication Failure"}
              </p>
            </div>

            <div className="p-4 bg-slate-950/70 border border-rose-900/30 rounded-2xl text-xs text-slate-300 leading-relaxed text-left space-y-2">
              <p>{data?.error || "This ID card could not be authenticated against the school registry."}</p>
              {data?.card_number && (
                <p className="font-mono text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                  Card Ref: <span className="text-slate-200">{data.card_number}</span>
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-500">HEZO SCHOOL Secure Campus Registry</p>
            </div>
          </div>
        ) : (
          <div>
            {/* School Header Banner */}
            <div className="bg-slate-950 p-6 border-b border-slate-800 flex items-center gap-4">
              {data.school_logo ? (
                <img
                  src={data.school_logo}
                  alt=""
                  className="size-14 rounded-2xl object-cover bg-white p-1 shadow-md border border-slate-800"
                />
              ) : (
                <div className="size-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                  {data.school_name?.charAt(0) || "H"}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-bold text-white truncate">{data.school_name}</h2>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                  <Building2 className="size-3 shrink-0" />
                  {data.school_address || "Certified Academic Institution"}
                </p>
              </div>
            </div>

            {/* Verification Status Badge */}
            <div className="bg-emerald-500/10 border-y border-emerald-500/20 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="size-4.5" />
                <span>Verified Active Teacher</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full">
                AUTHENTIC
              </span>
            </div>

            {/* Teacher Details */}
            <div className="p-6 space-y-6">
              {/* Photo & Primary Info */}
              <div className="flex items-center gap-4">
                {data.photo_url ? (
                  <img
                    src={data.photo_url}
                    alt=""
                    className="size-20 rounded-2xl object-cover border-2 border-emerald-500/30 shadow-lg"
                  />
                ) : (
                  <div className="size-20 rounded-2xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-400">
                    <GraduationCap className="size-10" />
                  </div>
                )}

                <div className="space-y-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate">{data.full_name}</h3>
                  <div className="inline-block bg-slate-800 text-slate-300 text-xs font-mono font-bold px-2.5 py-0.5 rounded-md border border-slate-700">
                    {data.teacher_id}
                  </div>
                  <p className="text-xs font-medium text-emerald-400">{data.designation}</p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Assigned Subject
                  </span>
                  <p className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 truncate">
                    <BookOpen className="size-3.5 text-emerald-400 shrink-0" />
                    {data.subject}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Assigned Class
                  </span>
                  <p className="text-xs font-semibold text-slate-100 flex items-center gap-1.5 truncate">
                    <GraduationCap className="size-3.5 text-emerald-400 shrink-0" />
                    {data.class}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Card Number
                  </span>
                  <p className="text-xs font-mono font-semibold text-slate-300 truncate">
                    {data.card_number}
                  </p>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Verification Date
                  </span>
                  <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 truncate">
                    <Clock className="size-3.5 text-slate-400 shrink-0" />
                    {new Date().toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* School Verification Footer */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified by HEZO SCHOOL Cloud</span>
                <span className="text-emerald-400 font-medium">100% Genuine ID</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Global Footer */}
      <footer className="text-center text-xs text-slate-500 mt-6">
        HEZO SCHOOL Digital Infrastructure & Security Protocol
      </footer>
    </div>
  );
}
