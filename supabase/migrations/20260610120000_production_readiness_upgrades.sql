-- 20260610120000_production_readiness_upgrades.sql
-- Production readiness schema updates and RLS hardening

-- 1. Alter schools table to add principal name and principal signature URL
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS principal_name TEXT,
  ADD COLUMN IF NOT EXISTS principal_signature_url TEXT;

-- 2. Modify handle_new_user trigger function to map parent user roles to ALL schools where they have children
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  parent_school UUID;
  invite RECORD;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 1) Teacher invitation: most recent pending, non-expired, non-revoked invite for this email
  IF NEW.email IS NOT NULL THEN
    SELECT * INTO invite
    FROM public.teacher_invitations
    WHERE lower(email) = lower(NEW.email)
      AND accepted_at IS NULL
      AND revoked_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;

    IF invite.id IS NOT NULL THEN
      UPDATE public.profiles SET school_id = invite.school_id WHERE user_id = NEW.id;
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES (NEW.id, invite.school_id, 'teacher')
      ON CONFLICT DO NOTHING;
      UPDATE public.teacher_invitations
      SET accepted_at = now(), accepted_by = NEW.id
      WHERE id = invite.id;
      RETURN NEW;
    END IF;

    -- 2) Parent auto-link (mapping roles to ALL schools where they have a registered child)
    UPDATE public.students
    SET parent_user_id = NEW.id
    WHERE parent_email = NEW.email AND parent_user_id IS NULL;

    -- Insert user roles for every school context
    INSERT INTO public.user_roles (user_id, school_id, role)
    SELECT DISTINCT NEW.id, school_id, 'parent'::public.app_role
    FROM public.students
    WHERE parent_user_id = NEW.id
    ON CONFLICT DO NOTHING;

    -- Set default school context in the base profile
    SELECT school_id INTO parent_school
    FROM public.students
    WHERE parent_user_id = NEW.id
    LIMIT 1;

    IF parent_school IS NOT NULL THEN
      UPDATE public.profiles SET school_id = parent_school WHERE user_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Harden Rankings and Awards Parent SELECT RLS policies
DROP POLICY IF EXISTS "Parents view child rankings" ON public.rankings;
CREATE POLICY "Parents view child rankings" ON public.rankings 
  FOR SELECT TO authenticated 
  USING (is_published = true AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id AND s.parent_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Parents view child awards" ON public.awards;
CREATE POLICY "Parents view child awards" ON public.awards 
  FOR SELECT TO authenticated 
  USING (is_published = true AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id AND s.parent_user_id = auth.uid()
  ));

-- 4. Harden Student Photos Storage RLS policies (write access restricted to staff)
DROP POLICY IF EXISTS "Authenticated users can upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload student photos" ON storage.objects;
CREATE POLICY "Staff upload student photos" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff update student photos" ON storage.objects;
CREATE POLICY "Staff update student photos" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'student-photos' AND public.is_staff(auth.uid())) WITH CHECK (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete student photos" ON storage.objects;
CREATE POLICY "Staff delete student photos" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

-- 5. Restrict student deletion RLS policy to School Admins
DROP POLICY IF EXISTS "Staff manage students" ON public.students;
DROP POLICY IF EXISTS "Staff view all students in school" ON public.students;
DROP POLICY IF EXISTS "Staff insert students" ON public.students;
DROP POLICY IF EXISTS "Staff update students" ON public.students;
DROP POLICY IF EXISTS "Only admins delete students" ON public.students;

CREATE POLICY "Staff view all students in school" ON public.students
  FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Staff insert students" ON public.students
  FOR INSERT TO authenticated
  WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update students" ON public.students
  FOR UPDATE TO authenticated
  USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
  WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Only admins delete students" ON public.students
  FOR DELETE TO authenticated
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- 6. Teacher attendance check-ins table
CREATE TABLE IF NOT EXISTS public.teacher_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.attendance_status NOT NULL,
  marked_by UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, date)
);
ALTER TABLE public.teacher_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage teacher attendance" ON public.teacher_attendance;
CREATE POLICY "Admins manage teacher attendance" ON public.teacher_attendance
  FOR ALL TO authenticated 
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Teachers view own attendance" ON public.teacher_attendance;
CREATE POLICY "Teachers view own attendance" ON public.teacher_attendance
  FOR SELECT TO authenticated 
  USING (school_id = public.current_school_id() AND (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_attendance TO authenticated;
GRANT ALL ON public.teacher_attendance TO service_role;
