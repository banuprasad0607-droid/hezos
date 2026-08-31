-- Fix: Restore INSERT/UPDATE/DELETE policies that were stripped by fix_all_rls.sql.
-- The SELECT-only policies we set were correct, but super_admins need write access too.

-- ===================== user_roles =====================
-- INSERT: users can set their own initial role (needed for signup trigger)
CREATE POLICY "Users insert own initial role" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- ===================== profiles =====================
-- INSERT: users can create their own profile
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- UPDATE: users can update their own profile
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

-- ===================== schools =====================
-- Super admins (those with a super_admin role row) can INSERT new schools.
-- But the server function uses supabaseAdmin (service role) which bypasses RLS entirely.
-- This policy is for any direct client-side calls.
CREATE POLICY "Super admins insert schools" ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- Super admins can UPDATE schools
CREATE POLICY "Super admins update schools" ON public.schools
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ===================== subscriptions =====================
-- Super admins can read all subscriptions
CREATE POLICY "Super admins read subscriptions" ON public.subscriptions
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'
    )
  );

-- ===================== teacher_invitations =====================
-- Admins in that school can read/insert invitations
CREATE POLICY "Admins read invitations" ON public.teacher_invitations
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND school_id = teacher_invitations.school_id
        AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins insert invitations" ON public.teacher_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND school_id = teacher_invitations.school_id
        AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "Admins update invitations" ON public.teacher_invitations
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND school_id = teacher_invitations.school_id
        AND role IN ('admin', 'super_admin')
    )
  );

-- Force PostgREST schema reload
NOTIFY pgrst, 'reload schema';
