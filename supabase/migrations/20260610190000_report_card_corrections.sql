-- Migration version: 20260610190000_report_card_corrections
-- Description: Implement Subject Allocation System, marks lock lifecycle columns, and seed mock teacher users.

-- 1. Add class_teacher_id to classes
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS class_teacher_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Add status to exams (Draft -> Submitted -> Verified -> Approved -> Published)
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'Draft';

-- 3. Add remarks to exam_marks
ALTER TABLE public.exam_marks ADD COLUMN IF NOT EXISTS remarks TEXT;

-- 4. Create subject_allocations table
CREATE TABLE IF NOT EXISTS public.subject_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT subject_allocations_class_subject_unique UNIQUE (class_id, subject_id)
);

-- Enable RLS
ALTER TABLE public.subject_allocations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "School members view allocations" ON public.subject_allocations;
DROP POLICY IF EXISTS "Admins manage allocations" ON public.subject_allocations;

-- Select policy: members of school or superadmin
CREATE POLICY "School members view allocations" ON public.subject_allocations
    FOR SELECT TO authenticated
    USING (
        school_id = public.current_school_id() OR
        public.is_super_admin(auth.uid())
    );

-- All policy: school admins or superadmin
CREATE POLICY "Admins manage allocations" ON public.subject_allocations
    FOR ALL TO authenticated
    USING (
        (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin')) OR
        public.is_super_admin(auth.uid())
    )
    WITH CHECK (
        (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin')) OR
        public.is_super_admin(auth.uid())
    );

-- Create performance indices
CREATE INDEX IF NOT EXISTS idx_subject_allocations_school ON public.subject_allocations(school_id);
CREATE INDEX IF NOT EXISTS idx_subject_allocations_teacher ON public.subject_allocations(teacher_id);
CREATE INDEX IF NOT EXISTS idx_subject_allocations_class ON public.subject_allocations(class_id);

-- Seed mock teacher users in auth.users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ramesh@hezo.com', '{"full_name": "Ramesh Mathematics"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'suresh@hezo.com', '{"full_name": "Suresh Science"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'lakshmi@hezo.com', '{"full_name": "Lakshmi English"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed profiles
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Ramesh' WHERE user_id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Suresh' WHERE user_id = '22222222-2222-2222-2222-222222222222';
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Lakshmi' WHERE user_id = '33333333-3333-3333-3333-333333333333';

-- Seed roles
INSERT INTO public.user_roles (user_id, school_id, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher'),
  ('22222222-2222-2222-2222-222222222222', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher'),
  ('33333333-3333-3333-3333-333333333333', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher')
ON CONFLICT DO NOTHING;

-- Allocate dynamic mock data
DO $$
DECLARE
  v_school_id UUID := 'af1daae9-aa47-4647-9911-4fea8a2b3301';
  v_class_id UUID;
  v_math_id UUID;
  v_sci_id UUID;
  v_eng_id UUID;
BEGIN
  SELECT id INTO v_class_id FROM public.classes WHERE school_id = v_school_id AND name = '1' AND section = 'a' LIMIT 1;
  IF v_class_id IS NULL THEN
    SELECT id INTO v_class_id FROM public.classes WHERE school_id = v_school_id LIMIT 1;
  END IF;

  SELECT id INTO v_math_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%Math%' LIMIT 1;
  SELECT id INTO v_sci_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%Science%' LIMIT 1;
  SELECT id INTO v_eng_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%English%' LIMIT 1;

  IF v_class_id IS NOT NULL THEN
    -- Suresh as Class Teacher for Class 1A
    UPDATE public.classes SET class_teacher_id = '22222222-2222-2222-2222-222222222222' WHERE id = v_class_id;

    IF v_math_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '11111111-1111-1111-1111-111111111111', v_math_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;

    IF v_sci_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '22222222-2222-2222-2222-222222222222', v_sci_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;

    IF v_eng_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '33333333-3333-3333-3333-333333333333', v_eng_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;
  END IF;
END $$;

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subject_allocations TO authenticated;
GRANT ALL ON public.subject_allocations TO service_role;
