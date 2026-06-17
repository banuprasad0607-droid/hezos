import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const signupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters." }).max(120),
  email: z.string().email({ message: "Please enter a valid email address." }).max(120),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(72),
});

type SignupFields = z.infer<typeof signupSchema>;

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your school — HEZO SCHOOL" }] }),
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
        if (error.status === 429 || error.message.toLowerCase().includes("rate limit")) {
          return toast.error("Too many signup requests. Please wait a minute and try again.");
        }
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.message.toLowerCase().includes("exists")
        ) {
          return toast.error("An account with this email already exists. Please sign in instead.");
        }
        return toast.error(error.message);
      }
      toast.success("Account created. Let's set up your school.");
      navigate({ to: "/onboarding" });
    } catch (err: any) {
      setLoading(false);
      toast.error(err.message || "An unexpected error occurred during signup.");
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center font-bold text-brand-foreground font-sans">
            H
          </div>
          <span className="font-semibold tracking-tight">HEZO SCHOOL</span>
        </div>
        <div className="max-w-md space-y-4">
          <p className="text-2xl font-medium leading-snug text-balance">
            Start with one class today. Add more tomorrow.
          </p>
          <ul className="text-sm text-sidebar-muted space-y-2">
            <li>• One-tap attendance</li>
            <li>• PDF & image homework</li>
            <li>• Parent Daily Digest, automatic</li>
          </ul>
        </div>
        <p className="text-xs text-sidebar-muted">© HEZO SCHOOL</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-card text-foreground">
        <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Create your school
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You'll be the Admin. Invite teachers next.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Your full name</label>
              <input
                {...register("fullName")}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              {errors.fullName && (
                <p className="text-xs text-danger mt-1 font-semibold">{errors.fullName.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              {errors.email && (
                <p className="text-xs text-danger mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <input
                type="password"
                {...register("password")}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              {errors.password && (
                <p className="text-xs text-danger mt-1 font-semibold">{errors.password.message}</p>
              )}
              <p className="text-[10px] text-muted-foreground mt-1">Minimum 6 characters.</p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Creating account…" : "Continue"}
          </button>

          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-brand font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
