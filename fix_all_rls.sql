-- This script completely obliterates ALL potentially recursive policies!

-- 1. Drop ALL policies on user_roles
DROP POLICY IF EXISTS "Users view roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Users insert own initial role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins manage roles in school" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins view all user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins manage all user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admin reads all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins manage user_roles" ON public.user_roles;

-- 2. Drop ALL policies on profiles
DROP POLICY IF EXISTS "Users can view profiles in their school" ON public.profiles;
DROP POLICY IF EXISTS "Super admin reads profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super admins manage all profiles" ON public.profiles;

-- 3. Drop ALL policies on schools
DROP POLICY IF EXISTS "Members can view their school" ON public.schools;
DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools;
DROP POLICY IF EXISTS "Users can view schools" ON public.schools;
DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools;
DROP POLICY IF EXISTS "Super admins manage schools" ON public.schools;

-- 4. Recreate only the absolute minimum simple policies for the frontend
CREATE POLICY "Users can read own roles" ON public.user_roles 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own profile" ON public.profiles 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can view schools" ON public.schools 
  FOR SELECT TO authenticated 
  USING (true);

-- 5. Delete corrupted raw-SQL user so you can recreate it properly via API later!
DELETE FROM auth.users WHERE email = 'banu@hezoscl.com';

-- 6. Force the Supabase API to reload its cache
NOTIFY pgrst, 'reload schema';
