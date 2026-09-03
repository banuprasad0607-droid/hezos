import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { GraduationCap, Eye, EyeOff } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { loginAttemptServer } from "@/lib/platform.functions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Please enter a valid email address." })
    .max(120),
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
  const [showPassword, setShowPassword] = useState(false);
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

    // Auto-redirect if already authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        window.location.href = "/dashboard";
      }
    });
  }, []);

  const onSubmitForm = async (fields: LoginFields) => {
    setLoading(true);
    const cleanEmail = fields.email.trim().toLowerCase();
    const cleanPassword = fields.password;

    try {
      // 1. Direct client-side authentication with Supabase
      const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPassword,
      });

      if (authErr) {
        throw authErr;
      }

      const authUser = authData?.user;
      if (!authUser) throw new Error("Authentication failed: No user returned.");

      // Cache school details for dynamic whitelabel on return
      try {
        const { data: prof } = await supabase
          .from("profiles")
          .select("school_id")
          .eq("user_id", authUser.id)
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

      // Fetch roles to decide optimal redirect destination
      let dest = "/dashboard";
      try {
        const { data: roleRows } = await supabase
          .from("user_roles")
          .select("role, school_id")
          .eq("user_id", authUser.id);
        const roles = (roleRows || []).map((r) => r.role);
        if (roles.includes("super_admin")) {
          dest = "/platform";
        } else if (
          roles.includes("parent") &&
          !roles.includes("admin") &&
          !roles.includes("teacher")
        ) {
          dest = "/parent";
        } else if (!roleRows || roleRows.length === 0 || !roleRows.some((r) => r.school_id)) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("school_id")
            .eq("user_id", authUser.id)
            .maybeSingle();
          if (prof?.school_id) {
            dest = "/dashboard";
          } else {
            const { data: std } = await supabase
              .from("students")
              .select("id")
              .eq("parent_user_id", authUser.id)
              .maybeSingle();
            if (std) dest = "/parent";
            else dest = "/onboarding";
          }
        }
      } catch (rErr) {
        console.error("Role lookup error on login:", rErr);
      }

      toast.success("Welcome back");
      // Use clean full page redirect so all auth/tenant providers mount with the fresh session
      window.location.href = dest;
    } catch (err: any) {
      setLoading(false);
      let msg = err.message || "Could not sign in";
      if ((msg ?? "").includes("429") || (msg ?? "").toLowerCase().includes("too many requests")) {
        msg = "Too many login attempts. Please slow down and try again later.";
      } else if ((msg ?? "").toLowerCase().includes("invalid login credentials")) {
        msg = "Invalid email or password. Please check your credentials.";
      } else if ((msg ?? "").toLowerCase().includes("email not confirmed")) {
        msg = "Email address not confirmed. Please check your inbox.";
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

      <div className="flex items-center justify-center p-6 sm:p-10 bg-card text-foreground">
        <form onSubmit={handleSubmit(onSubmitForm)} className="w-full max-w-sm space-y-6">
          {/* Mobile-only Branding Header */}
          <div className="flex lg:hidden items-center gap-3 mb-2">
            {cachedSchoolLogo ? (
              <img
                src={cachedSchoolLogo}
                alt="School Logo"
                className="size-9 rounded-xl object-cover bg-white p-0.5 border border-border shadow-sm"
              />
            ) : (
              <div className="size-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                <GraduationCap className="size-5" />
              </div>
            )}
            <span className="font-bold text-lg tracking-tight text-foreground">
              {cachedSchoolName || "HEZO SCHOOL"}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Sign in</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome back to {cachedSchoolName || "your school"}.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Email address
              </label>
              <input
                type="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                inputMode="email"
                autoComplete="email"
                {...register("email")}
                className="mt-1.5 w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
                placeholder="you@school.com"
              />
              {errors.email && (
                <p className="text-xs text-danger mt-1.5 font-semibold">{errors.email.message}</p>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative mt-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  autoComplete="current-password"
                  {...register("password")}
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-danger mt-1.5 font-semibold">{errors.password.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm transition-all flex items-center justify-center"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-sm text-center text-muted-foreground pt-1">
            New here?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create your school account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
