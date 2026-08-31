-- Fix HEZO School Admin Multi-Tenant RLS Isolation

BEGIN;

-- 1. Remove the overly permissive policy on `schools`
DROP POLICY IF EXISTS "Users can view schools" ON public.schools;

-- 2. Add correct policy for `schools`
-- A user can see a school if they have a role in it.
CREATE POLICY "Assigned users can view their schools" 
ON public.schools 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
      AND user_roles.school_id = schools.id
  )
);

-- 3. Secure the `current_school_id()` function
-- Ensure it only returns a school_id if the user actually has a valid role for that school
CREATE OR REPLACE FUNCTION public.current_school_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.school_id 
  FROM public.profiles p
  JOIN public.user_roles ur ON p.user_id = ur.user_id AND p.school_id = ur.school_id
  WHERE p.user_id = auth.uid() 
  LIMIT 1;
$$;

-- 4. Secure the `has_role()` function
-- Ensure it checks the role specifically for the user's current valid school context
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
      AND role = _role
      AND school_id = public.current_school_id()
  );
$$;

-- 5. Secure the `is_staff()` function
-- Ensure it checks the staff roles specifically for the user's current valid school context
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id 
      AND role IN ('admin', 'teacher')
      AND school_id = public.current_school_id()
  );
$$;

COMMIT;
