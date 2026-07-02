import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { loginAttemptServer } from "@/lib/platform.functions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(120),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).max(72),
});

type LoginFields = z.infer<typeof loginSchema>;

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — HEZO SCHOOL" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cachedSchoolName, setCachedSchoolName] = useState<string | null>(null);
  const [cachedSchoolLogo, setCachedSchoolLogo] = useState<string | null>(null);

  const loginAttemptFn = useServerFn(loginAttemptServer);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    const name = localStorage.getItem("hezo_last_school_name");
    const logo = localStorage.getItem("hezo_last_school_logo");
    if (name) setCachedSchoolName(name);
    if (logo) setCachedSchoolLogo(logo);
  }, []);

  const onSubmitForm = async (fields: LoginFields) => {
    setLoading(true);
    try {
      const res = await loginAttemptFn({
        data: { email: fields.email, password: fields.password },
      });
      if (!res.session) throw new Error("Authentication failed: No session returned.");

      const { error: sessionErr } = await supabase.auth.setSession(res.session);
      if (sessionErr) throw sessionErr;

      // Cache school details for dynamic whitelabel on return
      if (res.user) {
        try {
          const { data: prof } = await supabase
            .from("profiles")
            .select("school_id")
            .eq("user_id", res.user.id)
            .maybeSingle();

          if (prof?.school_id) {
            const { data: sch } = await supabase
              .from("schools")
              .select("name, logo_url")
              .eq("id", prof.school_id)
              .maybeSingle();

            if (sch) {
              localStorage.setItem("hezo_last_school_name", sch.name);
              if (sch.logo_url) {
                localStorage.setItem("hezo_last_school_logo", sch.logo_url);
              } else {
                localStorage.removeItem("hezo_last_school_logo");
              }
            }
          }
        } catch (brandingErr) {
          console.error("Error caching school branding context:", brandingErr);
        }
      }

      setLoading(false);
      toast.success("Welcome back");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setLoading(false);
      let msg = err.message || "Could not sign in";
      if ((msg ?? "").includes("429") || (msg ?? "").toLowerCase().includes("too many requests")) {
        msg = "Too many login attempts. Please slow down and try again later.";
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          {cachedSchoolLogo ? (
            <img
              src={cachedSchoolLogo}
              alt="School Logo"
              className="size-8 rounded-lg object-cover bg-white p-0.5"
            />
          ) : (
            <div className="size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm">
              <GraduationCap className="size-5" />
            </div>
          )}
          <span className="font-semibold tracking-tight uppercase tracking-wider">
            {cachedSchoolName || "HEZO SCHOOL"}
          </span>
        </div>
        <div className="max-w-md">
          <p className="text-2xl font-medium leading-snug text-balance">
            "Mark attendance, send homework, write one remark — parents are informed by 6 PM. Every
            day."
          </p>
          <p className="text-sm text-sidebar-muted mt-4">The Parent Daily Digest, automated.</p>
        </div>
        <p className="text-xs text-sidebar-muted">© {cachedSchoolName || "HEZO SCHOOL"}</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-card text-foreground">
        <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-sm space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back to {cachedSchoolName || "your school"}.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                {...register("email")}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
                placeholder="you@school.com"
              />
              {errors.email && (
                <p className="text-xs text-danger mt-1 font-semibold">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-brand font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                {...register("password")}
                className="mt-1 w-full px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              />
              {errors.password && (
                <p className="text-xs text-danger mt-1 font-semibold">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-center text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="text-brand font-medium hover:underline">
              Create your school account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
