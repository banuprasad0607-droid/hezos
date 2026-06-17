import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, ArrowLeft, Mail } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { resetPasswordEmailServer } from "@/lib/platform.functions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const forgotSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }).max(120),
});

type ForgotFields = z.infer<typeof forgotSchema>;

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset Password — HEZO SCHOOL" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const resetPasswordEmailFn = useServerFn(resetPasswordEmailServer);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFields>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmitForm = async (fields: ForgotFields) => {
    setLoading(true);
    setSubmittedEmail(fields.email);
    const redirectUrl = `${window.location.origin}/reset-password`;

    try {
      await resetPasswordEmailFn({
        data: {
          email: fields.email,
          redirectTo: redirectUrl,
        },
      });
      setLoading(false);
      setSent(true);
      toast.success("Recovery email sent successfully!");
    } catch (err: any) {
      setLoading(false);
      let msg = err.message || "Failed to send reset link.";
      if (msg.includes("429") || msg.toLowerCase().includes("too many requests")) {
        msg = "Too many password reset requests. Please slow down and try again later.";
      }
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex bg-sidebar-bg text-sidebar-fg p-12 flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-brand rounded-lg flex items-center justify-center text-brand-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <span className="font-semibold tracking-tight uppercase tracking-wider">HEZO SCHOOL</span>
        </div>
        <div className="max-w-md">
          <p className="text-2xl font-medium leading-snug text-balance">
            "Request a password recovery link to securely log back into your academic portal."
          </p>
        </div>
        <p className="text-xs text-sidebar-muted">© HEZO SCHOOL</p>
      </div>

      <div className="flex items-center justify-center p-8 bg-card text-foreground">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-center">
            <Link
              to="/login"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="size-3.5" /> Back to Sign in
            </Link>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="size-12 rounded-full bg-success-soft text-success flex items-center justify-center">
                <Mail className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Check your inbox</h1>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  We have sent a secure password recovery link to <strong>{submittedEmail}</strong>.
                  Please click the link in the email to choose a new password.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="text-sm text-brand font-medium hover:underline block pt-2"
              >
                Did not receive? Send again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Reset password
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground">Email address</label>
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                {loading ? "Sending link…" : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
