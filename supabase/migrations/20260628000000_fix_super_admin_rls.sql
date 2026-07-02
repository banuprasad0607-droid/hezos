-- Redefine is_super_admin to check user_roles table instead of super_admin_users
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

-- Drop the insecure policy that allowed any authenticated user to create a school
DROP POLICY IF EXISTS "Authenticated can create a school" ON public.schools;

-- Grant missing table privileges to authenticated and anon roles
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_allocations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_allocations TO anon;
GRANT ALL PRIVILEGES ON public.teacher_allocations TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_subjects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_subjects TO anon;
GRANT ALL PRIVILEGES ON public.exam_subjects TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.mark_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mark_entries TO anon;
GRANT ALL PRIVILEGES ON public.mark_entries TO service_role;
