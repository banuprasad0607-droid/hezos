-- Fix RLS Policies for Super Admin Access to Schools and User Roles

-- 1. Ensure security definer function is_super_admin exists and checks user_roles
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = _user_id AND role = 'super_admin'
  );
$function$;

-- 2. Create helper get_user_school_id if not present
CREATE OR REPLACE FUNCTION public.get_user_school_id(_user_id uuid)
 RETURNS uuid
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT school_id FROM public.profiles WHERE user_id = _user_id LIMIT 1;
$function$;

-- 3. Allow authenticated users to read their own user_roles records
DROP POLICY IF EXISTS "Users view own user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));

-- 4. Grant super_admin access to manage user_roles
DROP POLICY IF EXISTS "Super admins manage user_roles" ON public.user_roles;
CREATE POLICY "Super admins manage user_roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- 5. Fix RLS on public.schools for Super Admin access
DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools;
DROP POLICY IF EXISTS "Members can view their school" ON public.schools;

CREATE POLICY "Members can view their school" ON public.schools
  FOR SELECT TO authenticated
  USING (
    public.is_super_admin(auth.uid()) 
    OR id = (SELECT school_id FROM public.profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Super admin manages all schools" ON public.schools
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- 6. Fix RLS on public.subscriptions for Super Admin access
DROP POLICY IF EXISTS "Super admins manage subscriptions" ON public.subscriptions;
CREATE POLICY "Super admins manage subscriptions" ON public.subscriptions
  FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- 7. Ensure Super Admin can read all user profiles
DROP POLICY IF EXISTS "Super admin reads profiles" ON public.profiles;
CREATE POLICY "Super admin reads profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_super_admin(auth.uid()));
