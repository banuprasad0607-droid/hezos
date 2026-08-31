-- ============================================================
-- HEZO SCHOOL Platform Enhancements Migration
-- Adds school type, extended school metadata, onboarding flags,
-- bulk import tracking, and a proper platform audit log table.
-- ============================================================

-- 1. School type enum
DO $$ BEGIN
  CREATE TYPE public.school_type AS ENUM (
    'school', 'cbse', 'icse', 'state_board', 'international', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. School status enum (upgrade from text)
DO $$ BEGIN
  CREATE TYPE public.school_status AS ENUM (
    'active', 'inactive', 'suspended', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Extend schools table with additional columns
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS school_type public.school_type DEFAULT 'school',
  ADD COLUMN IF NOT EXISTS school_status public.school_status DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS principal_name TEXT,
  ADD COLUMN IF NOT EXISTS principal_email TEXT,
  ADD COLUMN IF NOT EXISTS principal_phone TEXT,
  ADD COLUMN IF NOT EXISTS website TEXT,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS state TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS pincode TEXT,
  ADD COLUMN IF NOT EXISTS established_year INTEGER,
  ADD COLUMN IF NOT EXISTS registration_number TEXT,
  ADD COLUMN IF NOT EXISTS alternate_phone TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_flags JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS description TEXT;

-- 4. Migrate existing status column values to school_status if applicable
-- (schools.status is TEXT — keep it for backwards compat, sync school_status from it)
UPDATE public.schools
SET school_status = CASE
  WHEN status = 'active' THEN 'active'::public.school_status
  WHEN status = 'suspended' THEN 'suspended'::public.school_status
  WHEN status = 'inactive' THEN 'inactive'::public.school_status
  WHEN status = 'archived' THEN 'archived'::public.school_status
  ELSE 'active'::public.school_status
END
WHERE school_status IS NULL OR school_status = 'active';

-- 5. Bulk Imports table
CREATE TABLE IF NOT EXISTS public.bulk_imports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  import_type TEXT NOT NULL CHECK (import_type IN ('students', 'teachers', 'staff')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  total_rows INTEGER DEFAULT 0,
  successful_rows INTEGER DEFAULT 0,
  failed_rows INTEGER DEFAULT 0,
  duplicate_rows INTEGER DEFAULT 0,
  error_report JSONB,
  imported_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
GRANT SELECT, INSERT, UPDATE ON public.bulk_imports TO authenticated;
GRANT ALL ON public.bulk_imports TO service_role;
ALTER TABLE public.bulk_imports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_full_bulk_imports" ON public.bulk_imports
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "school_admin_own_imports" ON public.bulk_imports
  FOR SELECT USING (
    school_id IN (
      SELECT school_id FROM public.user_roles
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin')
    )
  );

-- 6. Platform Audit Logs table
CREATE TABLE IF NOT EXISTS public.platform_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  actor_id UUID,
  actor_email TEXT,
  actor_role TEXT,
  action TEXT NOT NULL,
  module TEXT,
  target_type TEXT,
  target_id TEXT,
  target_name TEXT,
  details TEXT,
  metadata JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.platform_audit_logs TO authenticated;
GRANT ALL ON public.platform_audit_logs TO service_role;
ALTER TABLE public.platform_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "super_admin_read_all_audit" ON public.platform_audit_logs
  FOR SELECT USING (public.is_super_admin(auth.uid()));

CREATE POLICY "insert_audit_authenticated" ON public.platform_audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_created_at ON public.platform_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_school_id ON public.platform_audit_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_actor_id ON public.platform_audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_platform_audit_logs_action ON public.platform_audit_logs(action);

-- 7. Staff table (if not already exists via user_roles)
CREATE TABLE IF NOT EXISTS public.staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id UUID,
  employee_id TEXT,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  photo_url TEXT,
  department TEXT,
  designation TEXT,
  staff_category TEXT DEFAULT 'other' CHECK (
    staff_category IN (
      'accountant', 'receptionist', 'librarian', 'transport',
      'office', 'support', 'security', 'maintenance', 'other'
    )
  ),
  employment_type TEXT DEFAULT 'full_time' CHECK (
    employment_type IN ('full_time', 'part_time', 'contract', 'temporary')
  ),
  joining_date DATE,
  address TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (school_id, employee_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.staff TO authenticated;
GRANT ALL ON public.staff TO service_role;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_staff_updated_at
BEFORE UPDATE ON public.staff
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "super_admin_all_staff" ON public.staff
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "school_admin_own_staff" ON public.staff
  USING (
    school_id = public.current_school_id()
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    school_id = public.current_school_id()
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "staff_view_own_school" ON public.staff
  FOR SELECT USING (school_id = public.current_school_id());

CREATE INDEX IF NOT EXISTS idx_staff_school_id ON public.staff(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON public.staff(user_id);

NOTIFY pgrst, 'reload schema';
