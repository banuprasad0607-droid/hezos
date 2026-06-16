-- 20260610080000_multitenant_requirements.sql
-- Database alignment migration for CRITICAL MULTI-TENANT RULES

-- 1) Add generated columns to public.schools table
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_name TEXT GENERATED ALWAYS AS (name) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_code TEXT GENERATED ALWAYS AS (code) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_logo TEXT GENERATED ALWAYS AS (logo_url) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS admin_id UUID GENERATED ALWAYS AS (owner_id) STORED;

-- 2) Create the public.users view
CREATE OR REPLACE VIEW public.users WITH (security_invoker = true) AS
SELECT
  user_id AS id,
  role::text AS role,
  school_id
FROM public.user_roles;

-- 3) Grant privileges
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO service_role;
