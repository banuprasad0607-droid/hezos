-- 20260703000000_fix_classes_rls_policies.sql
-- Fix the classes RLS policies to allow proper multi-tenant access and super admin support.

-- Drop the old overly restrictive policy
DROP POLICY IF EXISTS "School members view classes" ON public.classes;
DROP POLICY IF EXISTS "Staff manage classes" ON public.classes;
DROP POLICY IF EXISTS "Super admins view all classes" ON public.classes;

-- Create the new select policy: School members and Super Admins can select classes
CREATE POLICY "School members view classes" ON public.classes
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND school_id = classes.school_id
    )
    OR
    public.is_super_admin(auth.uid())
  );

-- Create the new manage policy (ALL privileges: INSERT, UPDATE, DELETE): School Staff (admin/teacher) and Super Admins
CREATE POLICY "Staff manage classes" ON public.classes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND school_id = classes.school_id AND role IN ('admin', 'teacher')
    )
    OR
    public.is_super_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND school_id = classes.school_id AND role IN ('admin', 'teacher')
    )
    OR
    public.is_super_admin(auth.uid())
  );
