-- Fix current_school_id to bypass RLS
CREATE OR REPLACE FUNCTION public.current_school_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Fix is_staff to bypass RLS
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','teacher')
  );
$$;

-- Fix has_role to bypass RLS
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admins manage all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admin reads all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins view all profiles" ON public.profiles;


CREATE POLICY "Super admins manage all schools" ON public.schools
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "Super admins view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_super_admin(auth.uid()));

-- Reload PostgREST schema cache
SELECT pg_notify('pgrst', 'reload schema');
