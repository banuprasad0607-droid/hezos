-- 20260810220000_admin_only_classes_and_allocations.sql
-- Restrict class creation, update, and deletion strictly to Admins and Super Admins.

-- 1. Ensure class_teacher_id column exists on classes
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS class_teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Update classes RLS policy: ONLY Admins and Super Admins can insert/update/delete classes
DROP POLICY IF EXISTS "Staff manage classes" ON public.classes;
DROP POLICY IF EXISTS "Admins manage classes" ON public.classes;

CREATE POLICY "Admins manage classes" ON public.classes
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() 
        AND (school_id = classes.school_id OR school_id IS NULL)
        AND role IN ('admin', 'super_admin')
    )
    OR public.is_super_admin(auth.uid())
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() 
        AND (school_id = classes.school_id OR school_id IS NULL)
        AND role IN ('admin', 'super_admin')
    )
    OR public.is_super_admin(auth.uid())
  );

-- 3. Ensure admins can manage subjects
DROP POLICY IF EXISTS "Admins manage subjects" ON public.subjects;
CREATE POLICY "Admins manage subjects" ON public.subjects
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() 
        AND (school_id = subjects.school_id OR school_id IS NULL)
        AND role IN ('admin', 'super_admin')
    )
    OR public.is_super_admin(auth.uid())
  );
