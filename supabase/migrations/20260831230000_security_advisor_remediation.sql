-- HEZO SCHOOL — SUPABASE SECURITY ADVISOR REMEDIATION MIGRATION
-- Fixes mutable function search_paths and hardens RLS policies on audit logs.

-- 1. Fix Mutable search_path on all custom functions
ALTER FUNCTION public.check_school_student_limit() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.check_school_teacher_limit() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.clean_auth_user_tokens() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.enforce_single_super_admin() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.log_mark_update() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.validate_mark_entry_score() SET search_path = 'public', 'pg_temp';

-- 2. Secure mark_audit_logs RLS Policies
DROP POLICY IF EXISTS "System can insert audit logs" ON public.mark_audit_logs;
DROP POLICY IF EXISTS "Staff can view audit logs" ON public.mark_audit_logs;

-- Restrict SELECT to school staff or platform super admins
CREATE POLICY "Staff can view audit logs"
  ON public.mark_audit_logs
  FOR SELECT
  TO authenticated
  USING (
    is_school_staff(school_id) OR is_super_admin(auth.uid())
  );

-- Restrict client direct INSERT to authenticated school admins or super admins
CREATE POLICY "Admins can insert audit logs"
  ON public.mark_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_school_admin(auth.uid(), school_id) OR is_super_admin(auth.uid())
  );

-- Prevent client-side updates and deletes on audit trails
REVOKE UPDATE, DELETE ON public.mark_audit_logs FROM public, anon, authenticated;
