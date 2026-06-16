-- Migration version: 20260610170000_report_cards
-- Description: Create report_cards table with multi-tenant isolation and RLS policies.

CREATE TABLE IF NOT EXISTS public.report_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    exam_type TEXT NOT NULL, -- 'Unit Test', 'Quarterly', 'Half Yearly', 'Pre-Final', 'Annual Exam', 'Custom Exam'
    academic_year TEXT NOT NULL,
    total_obtained NUMERIC(5,2) NOT NULL DEFAULT 0,
    total_max NUMERIC(5,2) NOT NULL DEFAULT 0,
    percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    class_rank INTEGER,
    section_rank INTEGER,
    school_rank INTEGER,
    result_status TEXT NOT NULL, -- 'Pass', 'Fail', 'Distinction', 'First Class', 'Merit'
    working_days INTEGER NOT NULL DEFAULT 0,
    present_days INTEGER NOT NULL DEFAULT 0,
    absent_days INTEGER NOT NULL DEFAULT 0,
    attendance_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
    subject_marks JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {subject_id, subject_name, max_marks, obtained_marks, grade, remarks}
    class_teacher_remarks TEXT,
    principal_remarks TEXT,
    pdf_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'approved', 'published'
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT report_cards_student_exam_unique UNIQUE(student_id, exam_type, academic_year)
);

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_cards TO authenticated;
GRANT ALL ON public.report_cards TO service_role;

-- Enable Row Level Security
ALTER TABLE public.report_cards ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "School members view report cards" ON public.report_cards;
DROP POLICY IF EXISTS "Staff manage report cards" ON public.report_cards;

-- Select policy: members of school, parent of child, or superadmin
CREATE POLICY "School members view report cards" ON public.report_cards
    FOR SELECT TO authenticated
    USING (
        school_id = public.current_school_id() OR
        public.is_super_admin(auth.uid()) OR
        (EXISTS (
            SELECT 1 FROM public.students s 
            WHERE s.id = student_id AND s.parent_user_id = auth.uid()
        ))
    );

-- Insert/Update/Delete policy: staff of school or superadmin
CREATE POLICY "Staff manage report cards" ON public.report_cards
    FOR ALL TO authenticated
    USING (
        (school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR
        public.is_super_admin(auth.uid())
    )
    WITH CHECK (
        (school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR
        public.is_super_admin(auth.uid())
    );

-- Create performance indices
CREATE INDEX IF NOT EXISTS idx_report_cards_school ON public.report_cards(school_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_student ON public.report_cards(student_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_class ON public.report_cards(class_id);
CREATE INDEX IF NOT EXISTS idx_report_cards_exam_type ON public.report_cards(exam_type);
