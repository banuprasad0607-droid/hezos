-- 1. Drop ALL policies on user_roles that might cause recursion
DROP POLICY IF EXISTS "Users view roles in their school" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins manage user_roles" ON public.user_roles;

-- 2. Create the simplest, foolproof policy that has ZERO chance of recursion
CREATE POLICY "Users can read own roles" ON public.user_roles 
  FOR SELECT TO authenticated 
  USING (user_id = auth.uid());

-- Note: Super Admins use the Service Role Key on the backend, which bypasses RLS entirely,
-- so they do not need complex RLS policies here to manage roles!
