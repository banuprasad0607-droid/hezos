-- ID Card Management Module Schema Enhancements

-- 1. Alter schools table
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS email text;

-- 2. Alter students table
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS transport_route text,
  ADD COLUMN IF NOT EXISTS bus_number text,
  ADD COLUMN IF NOT EXISTS academic_year text DEFAULT '2025-2026';

-- 3. Alter profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS employee_id text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS joining_date date,
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS notes text;

-- 4. Create visitor_passes table
CREATE TABLE IF NOT EXISTS public.visitor_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  photo_url text,
  purpose_of_visit text,
  contact_number text NOT NULL,
  host_name text,
  check_in_time timestamptz NOT NULL DEFAULT now(),
  check_out_time timestamptz,
  pass_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitor_passes TO authenticated;
GRANT ALL ON public.visitor_passes TO service_role;

ALTER TABLE public.visitor_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own school visitor passes" ON public.visitor_passes
  FOR SELECT TO authenticated
  USING (school_id = current_school_id());

CREATE POLICY "Staff manage visitor passes" ON public.visitor_passes
  FOR ALL TO authenticated
  USING (school_id = current_school_id() AND is_staff(auth.uid()))
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

-- 5. Create id_card_history table
CREATE TABLE IF NOT EXISTS public.id_card_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  card_type text NOT NULL, -- 'student', 'staff', 'visitor'
  holder_id uuid NOT NULL,
  academic_year text NOT NULL,
  printed_by uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  printed_at timestamptz NOT NULL DEFAULT now(),
  reason text DEFAULT 'First Issue'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.id_card_history TO authenticated;
GRANT ALL ON public.id_card_history TO service_role;

ALTER TABLE public.id_card_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own school reprint history" ON public.id_card_history
  FOR SELECT TO authenticated
  USING (school_id = current_school_id());

CREATE POLICY "Staff insert reprint logs" ON public.id_card_history
  FOR INSERT TO authenticated
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

-- 6. Trigger for visitor_passes updated_at
CREATE TRIGGER trg_visitor_passes_updated_at BEFORE UPDATE ON public.visitor_passes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add policy for profiles updating by self or admin
-- Supabase profiles table sometimes needs direct policies if not already exist
CREATE POLICY "Users update own profile fields" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (school_id = current_school_id() AND is_staff(auth.uid()))
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));
