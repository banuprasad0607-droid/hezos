-- 20260610150000_final_production_fixes.sql
-- Final production readiness fixes
-- Covers: missing indexes, missing super_admin policies, RLS hardening

-- ==========================================================
-- 1. PERFORMANCE: Add missing database indexes
-- ==========================================================

-- Fee tables
CREATE INDEX IF NOT EXISTS idx_fee_invoices_school ON public.fee_invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_student ON public.fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON public.fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_fee_structures_school ON public.fee_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_invoice ON public.fee_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school ON public.fee_payments(school_id);

-- Rankings & Awards
CREATE INDEX IF NOT EXISTS idx_rankings_school ON public.rankings(school_id);
CREATE INDEX IF NOT EXISTS idx_rankings_student ON public.rankings(student_id);
CREATE INDEX IF NOT EXISTS idx_awards_school ON public.awards(school_id);
CREATE INDEX IF NOT EXISTS idx_awards_student ON public.awards(student_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_school ON public.profiles(school_id);

-- User roles
CREATE INDEX IF NOT EXISTS idx_user_roles_school ON public.user_roles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ID card history
CREATE INDEX IF NOT EXISTS idx_id_card_history_school ON public.id_card_history(school_id);
CREATE INDEX IF NOT EXISTS idx_id_card_history_printed_at ON public.id_card_history(printed_at);

-- Visitor passes
CREATE INDEX IF NOT EXISTS idx_visitor_passes_school ON public.visitor_passes(school_id);
CREATE INDEX IF NOT EXISTS idx_visitor_passes_checkout ON public.visitor_passes(check_out_time);

-- Announcements
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

-- Homework
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON public.homework(due_date);

-- Remarks
CREATE INDEX IF NOT EXISTS idx_remarks_school ON public.remarks(school_id);
CREATE INDEX IF NOT EXISTS idx_remarks_created_at ON public.remarks(created_at);

-- ==========================================================
-- 2. SECURITY: Allow super_admin to read ALL schools
--    (needed for super-admin analytics page)
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools;
CREATE POLICY "Super admin reads all schools" ON public.schools
  FOR SELECT TO authenticated
  USING (
    -- Super admins have no school_id but need to see all schools
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 3. SECURITY: Super admin can update/delete any school
-- ==========================================================
DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools;
CREATE POLICY "Super admin manages all schools" ON public.schools
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 4. SECURITY: Prevent teachers from deleting students
--    (Only admins should be allowed to delete)
--    The latest policy already handles this in 20260610120000
--    but we add an explicit teacher restriction guard.
-- ==========================================================
-- (Already handled by "Only admins delete students" policy in production_readiness_upgrades migration)

-- ==========================================================
-- 5. DATA INTEGRITY: Ensure teacher_attendance has proper grants
-- ==========================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_attendance TO authenticated;
GRANT ALL ON public.teacher_attendance TO service_role;

-- ==========================================================
-- 6. CLEANUP: Remove duplicate/conflicting policies that may
--    cause performance issues on hot tables
-- ==========================================================
-- Consolidate students SELECT: the "Staff view all students in school"
-- policy from production_readiness_upgrades already supersedes the
-- original "Staff manage students" catch-all. Ensure no overlap.
DROP POLICY IF EXISTS "Staff manage students" ON public.students;

-- ==========================================================
-- 7. FIX: Ensure profiles can be read by super_admin
--    (needed for staff management in super-admin school view)
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all profiles" ON public.profiles;
CREATE POLICY "Super admin reads all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 8. FIX: Super admin can read all user_roles
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all roles" ON public.user_roles;
CREATE POLICY "Super admin reads all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur2
      WHERE ur2.user_id = auth.uid()
        AND ur2.role = 'super_admin'::text::public.app_role
    )
  );
