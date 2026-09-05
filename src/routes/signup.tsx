import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckCircle2, Sparkles, ShieldCheck, ArrowRight, Loader2, IndianRupee } from "lucide-react";

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(120),
  email: z.string().email({ message: "Please enter a valid email address." }).max(120),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(72),
});

type SignupFields = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Start 14-Day Free Trial — HEZO SCHOOL SaaS" }] }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFields>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmitForm = async (fields: SignupFields) => {
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/onboarding`;
      const { error } = await supabase.auth.signUp({
        email: fields.email,
        password: fields.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { full_name: fields.fullName },
        },
      });
      setLoading(false);
      if (error) {
        if (error.status === 429 || error.message?.toLowerCase()?.includes("rate limit")) {
          return toast.error("Too many signup requests. Please wait a minute and try again.");
        }
        if (
          error.message?.toLowerCase()?.includes("already registered") ||
          error.message?.toLowerCase()?.includes("exists")
        ) {
          return toast.error("An account with this email already exists. Please sign in instead.");
        }
        return toast.error(error.message);
      }
      toast.success("Account created successfully! Welcome to HEZO SCHOOL.");
      navigate({ to: "/onboarding" });
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "An unexpected error occurred during signup.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-12 bg-background">
      {/* Left Marketing Pillar (5 cols) */}
      <div className="hidden lg:flex lg:col-span-5 bg-slate-950 text-slate-100 p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/20 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-indigo-600/20 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-600/40">
              H
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-base">HEZO SCHOOL</span>
              <span className="ml-2 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                SaaS ERP
              </span>
            </div>
          </Link>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-700/50 text-blue-300 text-xs font-semibold">
            <Sparkles className="size-3.5 text-blue-400" />
            <span>14-Day Full Free Trial</span>
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
            Power your school operations in 2 minutes flat.
          </h2>

          <ul className="space-y-3.5 text-sm text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Instant Setup:</strong> Zero IT infrastructure required.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>CBSE / ICSE Ready:</strong> Generate term report cards with 1-click.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>Parent WhatsApp Digest:</strong> Evening summaries delivered automatically.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="size-4 text-emerald-400 mt-0.5 shrink-0" />
              <span><strong>UPI Fee Invoices:</strong> Instant receipts & Razorpay payment links.</span>
            </li>
          </ul>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <ShieldCheck className="size-4 text-emerald-400" />
              <span>No Credit Card or Commitments</span>
            </div>
            <p>Your trial gives you unrestricted access to all features for 14 days.</p>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
          <span>&copy; {new Date().getFullYear()} HEZO SCHOOL</span>
          <span>Made for Indian Schools 🇮🇳</span>
        </div>
      </div>

      {/* Right Form Pillar (7 cols) */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 sm:p-12 bg-card text-foreground">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="lg:hidden flex items-center gap-2 mb-6">
              <div className="size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-white text-sm">H</div>
              <span className="font-bold text-foreground">HEZO SCHOOL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Create your school account
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5">
              Get started with your free 14-day trial. You will be set as the Principal / Administrator.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-foreground">Principal / Admin Full Name</label>
                <input
                  {...register("fullName")}
                  placeholder="e.g. Dr. Rajesh Sharma"
                  className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground shadow-sm"
                />
                {errors.fullName && (
                  <p className="text-xs text-danger mt-1 font-medium">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Official Email Address</label>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="principal@yourschool.edu.in"
                  className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground shadow-sm"
                />
                {errors.email && (
                  <p className="text-xs text-danger mt-1 font-medium">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-foreground">Create Secure Password</label>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground shadow-sm"
                />
                {errors.password && (
                  <p className="text-xs text-danger mt-1 font-medium">{errors.password.message}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1">Minimum 6 characters. You can invite other teachers next.</p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Setting up your account…</span>
                </>
              ) : (
                <>
                  <span>Continue to School Setup</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>

            <div className="pt-2 text-center text-sm text-muted-foreground">
              Already have a school account?{" "}
              <Link to="/login" className="text-brand font-semibold hover:underline">
                Sign in
              </Link>
            </div>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            By registering, you agree to the HEZO School Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
