-- Migration: Allow Super Admin full access to students, classes, attendance, homework, remarks, announcements
-- 1. Update is_staff function to also include super_admin
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin', 'teacher', 'super_admin')
  );
$$;

-- 2. Update is_super_admin function
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = 'super_admin'
  );
$$;

-- 3. Students Policies
DROP POLICY IF EXISTS "Staff insert students" ON public.students;
DROP POLICY IF EXISTS "Staff update students" ON public.students;
DROP POLICY IF EXISTS "Only admins delete students" ON public.students;
DROP POLICY IF EXISTS "Super admins manage all students" ON public.students;
DROP POLICY IF EXISTS "Super admins view all students" ON public.students;
DROP POLICY IF EXISTS "Staff view all students in school" ON public.students;
DROP POLICY IF EXISTS "Staff and Super Admin view students" ON public.students;
DROP POLICY IF EXISTS "Staff and Super Admin insert students" ON public.students;
DROP POLICY IF EXISTS "Staff and Super Admin update students" ON public.students;
DROP POLICY IF EXISTS "Admins and Super Admin delete students" ON public.students;

CREATE POLICY "Staff and Super Admin view students" ON public.students
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin(auth.uid())
    OR school_id = public.current_school_id()
    OR school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Staff and Super Admin insert students" ON public.students
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_super_admin(auth.uid())
    OR (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
    OR (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()) AND public.is_staff(auth.uid()))
  );

CREATE POLICY "Staff and Super Admin update students" ON public.students
  FOR UPDATE TO authenticated
  USING (
    public.is_super_admin(auth.uid())
    OR (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
    OR (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()) AND public.is_staff(auth.uid()))
  )
  WITH CHECK (
    public.is_super_admin(auth.uid())
    OR (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
    OR (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()) AND public.is_staff(auth.uid()))
  );

CREATE POLICY "Admins and Super Admin delete students" ON public.students
  FOR DELETE TO authenticated
  USING (
    public.is_super_admin(auth.uid())
    OR (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'))
    OR (school_id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid()) AND public.has_role(auth.uid(), 'admin'))
  );
