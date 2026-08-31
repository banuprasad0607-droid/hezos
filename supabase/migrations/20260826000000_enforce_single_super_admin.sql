-- =====================================================================
-- REAL SUPER ADMIN SETUP
-- Only ONE super_admin is allowed. Email: banu.prasad0607@gmail.com
-- =====================================================================

-- 1. Remove ALL existing super_admin rows (clean slate)
DELETE FROM public.user_roles WHERE role = 'super_admin';

-- 2. Grant super_admin ONLY to banu.prasad0607@gmail.com
--    We look up their UUID from auth.users
INSERT INTO public.user_roles (user_id, school_id, role)
SELECT id, NULL, 'super_admin'
FROM auth.users
WHERE email = 'banu.prasad0607@gmail.com'
ON CONFLICT DO NOTHING;

-- 3. Ensure profile has no school_id (platform-level)
UPDATE public.profiles
SET school_id = NULL, full_name = 'Super Admin'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'banu.prasad0607@gmail.com');

-- 4. ENFORCE: Create a DB trigger that blocks any second super_admin being inserted
CREATE OR REPLACE FUNCTION enforce_single_super_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'super_admin' THEN
    -- Check if a super_admin already exists for a different user
    IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE role = 'super_admin'
        AND user_id <> NEW.user_id
    ) THEN
      RAISE EXCEPTION 'A super_admin already exists. Only one super_admin is allowed on this platform.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_single_super_admin_trigger ON public.user_roles;

CREATE TRIGGER enforce_single_super_admin_trigger
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION enforce_single_super_admin();

-- 5. Verify
SELECT u.email, r.role, r.school_id
FROM public.user_roles r
JOIN auth.users u ON u.id = r.user_id
WHERE r.role = 'super_admin';

NOTIFY pgrst, 'reload schema';
