-- 1) Privilege escalation: restrict self-insert to parent role only
DROP POLICY IF EXISTS "Users insert own initial role" ON public.user_roles;
CREATE POLICY "Users insert own parent role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'parent'::app_role);

-- 2) Move temp_password out of schools into a restricted table
CREATE TABLE IF NOT EXISTS public.school_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL UNIQUE,
  temp_password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.school_credentials TO service_role;

ALTER TABLE public.school_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage school credentials"
  ON public.school_credentials
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Backfill existing temp passwords
INSERT INTO public.school_credentials (school_id, temp_password)
SELECT id, temp_password FROM public.schools WHERE temp_password IS NOT NULL
ON CONFLICT (school_id) DO UPDATE SET temp_password = EXCLUDED.temp_password;

-- Drop the exposed column from schools
ALTER TABLE public.schools DROP COLUMN IF EXISTS temp_password;

-- 3) Homework storage: restrict uploads to staff only
DROP POLICY IF EXISTS "Authenticated can upload homework files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload homework files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload homework files" ON storage.objects;

CREATE POLICY "Staff upload homework files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update homework files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'homework-files' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete homework files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));