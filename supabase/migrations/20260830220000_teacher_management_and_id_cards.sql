-- Migration: Teacher Management, Enhanced IDs, and ID Cards System

-- 1. Ensure profiles table has status and employee_id (Teacher ID)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active',
ADD COLUMN IF NOT EXISTS employee_id text,
ADD COLUMN IF NOT EXISTS created_by uuid;

-- 2. Create teacher_id_cards table
CREATE TABLE IF NOT EXISTS public.teacher_id_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  teacher_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_number text NOT NULL UNIQUE,
  verification_token text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
  issued_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone,
  revoked_at timestamp with time zone,
  revoked_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Create index for fast token verification lookup
CREATE INDEX IF NOT EXISTS idx_teacher_id_cards_token ON public.teacher_id_cards(verification_token);
CREATE INDEX IF NOT EXISTS idx_teacher_id_cards_school ON public.teacher_id_cards(school_id);
CREATE INDEX IF NOT EXISTS idx_teacher_id_cards_teacher ON public.teacher_id_cards(teacher_user_id);

-- 4. Enable RLS on teacher_id_cards
ALTER TABLE public.teacher_id_cards ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "teacher_id_cards_select" ON public.teacher_id_cards;
DROP POLICY IF EXISTS "teacher_id_cards_insert" ON public.teacher_id_cards;
DROP POLICY IF EXISTS "teacher_id_cards_update" ON public.teacher_id_cards;
DROP POLICY IF EXISTS "teacher_id_cards_delete" ON public.teacher_id_cards;

-- SELECT: Super admins, school staff, or the teacher themself
CREATE POLICY "teacher_id_cards_select"
ON public.teacher_id_cards
FOR SELECT
TO authenticated
USING (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
  OR teacher_user_id = auth.uid()
);

-- INSERT / UPDATE / DELETE: Super admins and school admins
CREATE POLICY "teacher_id_cards_insert"
ON public.teacher_id_cards
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
);

CREATE POLICY "teacher_id_cards_update"
ON public.teacher_id_cards
FOR UPDATE
TO authenticated
USING (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
)
WITH CHECK (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
);

CREATE POLICY "teacher_id_cards_delete"
ON public.teacher_id_cards
FOR DELETE
TO authenticated
USING (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
);

-- 6. Create id_card_history table for audit tracking
CREATE TABLE IF NOT EXISTS public.id_card_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  card_id uuid REFERENCES public.teacher_id_cards(id) ON DELETE SET NULL,
  card_type text NOT NULL DEFAULT 'teacher',
  target_id uuid NOT NULL,
  action text NOT NULL, -- 'GENERATED', 'REVOKED', 'REGENERATED', 'PRINTED', 'DOWNLOADED'
  actor_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.id_card_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "id_card_history_select" ON public.id_card_history;
DROP POLICY IF EXISTS "id_card_history_insert" ON public.id_card_history;

CREATE POLICY "id_card_history_select"
ON public.id_card_history
FOR SELECT
TO authenticated
USING (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
);

CREATE POLICY "id_card_history_insert"
ON public.id_card_history
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_super_admin(auth.uid())
  OR public.is_school_staff(school_id)
);

-- 7. Secure Public Verification Function
-- Allows anonymous users (e.g. scanning QR code in public) to verify a teacher card by token
CREATE OR REPLACE FUNCTION public.verify_teacher_card_by_token(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_card RECORD;
  v_profile RECORD;
  v_school RECORD;
  v_alloc RECORD;
  v_result jsonb;
BEGIN
  IF _token IS NULL OR trim(_token) = '' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Missing verification token');
  END IF;

  -- Lookup card
  SELECT * INTO v_card
  FROM public.teacher_id_cards
  WHERE verification_token = trim(_token)
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'No ID card found matching this verification code');
  END IF;

  IF v_card.status = 'revoked' THEN
    RETURN jsonb_build_object(
      'valid', false,
      'status', 'revoked',
      'card_number', v_card.card_number,
      'revoked_at', v_card.revoked_at,
      'error', 'This Teacher ID card has been REVOKED and is no longer valid.'
    );
  END IF;

  IF v_card.status = 'expired' OR (v_card.expires_at IS NOT NULL AND v_card.expires_at < now()) THEN
    RETURN jsonb_build_object(
      'valid', false,
      'status', 'expired',
      'card_number', v_card.card_number,
      'error', 'This Teacher ID card has EXPIRED.'
    );
  END IF;

  -- Lookup Teacher Profile
  SELECT id, user_id, full_name, photo_url, employee_id, designation, department, status
  INTO v_profile
  FROM public.profiles
  WHERE id = v_card.teacher_profile_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Associated teacher profile not found');
  END IF;

  -- Lookup School
  SELECT id, name, logo_url, address, phone_number, email, status
  INTO v_school
  FROM public.schools
  WHERE id = v_card.school_id;

  IF NOT FOUND OR v_school.status = 'suspended' THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Associated school is inactive or suspended');
  END IF;

  -- Lookup primary subject and class allocation
  SELECT s.name AS subject_name, c.name AS class_name
  INTO v_alloc
  FROM public.teacher_allocations ta
  LEFT JOIN public.subjects s ON ta.subject_id = s.id
  LEFT JOIN public.classes c ON ta.class_id = c.id
  WHERE ta.teacher_id = v_profile.id
  ORDER BY ta.created_at DESC
  LIMIT 1;

  v_result := jsonb_build_object(
    'valid', true,
    'status', 'active',
    'card_number', v_card.card_number,
    'issued_at', v_card.issued_at,
    'teacher_id', COALESCE(v_profile.employee_id, v_card.card_number),
    'full_name', v_profile.full_name,
    'photo_url', v_profile.photo_url,
    'designation', COALESCE(v_profile.designation, 'Teacher'),
    'department', COALESCE(v_profile.department, 'Academic Faculty'),
    'account_status', COALESCE(v_profile.status, 'active'),
    'subject', COALESCE(v_alloc.subject_name, 'General Faculty'),
    'class', COALESCE(v_alloc.class_name, 'All Assigned Grades'),
    'school_name', v_school.name,
    'school_logo', v_school.logo_url,
    'school_address', v_school.address,
    'school_phone', v_school.phone_number
  );

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_teacher_card_by_token(text) TO anon, authenticated, service_role;
