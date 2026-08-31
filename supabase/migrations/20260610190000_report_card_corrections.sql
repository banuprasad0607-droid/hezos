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



-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subject_allocations TO authenticated;
GRANT ALL ON public.subject_allocations TO service_role;
