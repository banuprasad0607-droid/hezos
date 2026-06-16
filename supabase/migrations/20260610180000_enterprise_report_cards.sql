-- Migration version: 20260610180000_enterprise_report_cards
-- Description: Create student_documents and report_card_audit_logs tables with strict RLS policies.

CREATE TABLE IF NOT EXISTS public.student_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL, -- 'Birth Certificate', 'Transfer Certificate', 'Aadhaar', 'Marks Memo', 'Bonafide Certificate', 'Medical Record', 'Other'
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.report_card_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    report_card_id UUID REFERENCES public.report_cards(id) ON DELETE CASCADE,
    action TEXT NOT NULL, -- 'Created', 'Edited', 'Approved', 'Published'
    performed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    performed_by_name TEXT NOT NULL,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_documents TO authenticated;
GRANT ALL ON public.student_documents TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_card_audit_logs TO authenticated;
GRANT ALL ON public.report_card_audit_logs TO service_role;

-- Enable Row Level Security
ALTER TABLE public.student_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_card_audit_logs ENABLE ROW LEVEL SECURITY;

-- Student Documents Policies
DROP POLICY IF EXISTS "School members view student documents" ON public.student_documents;
CREATE POLICY "School members view student documents" ON public.student_documents
    FOR SELECT TO authenticated
    USING (
        school_id = public.current_school_id() OR
        public.is_super_admin(auth.uid()) OR
        (EXISTS (
            SELECT 1 FROM public.students s 
            WHERE s.id = student_id AND s.parent_user_id = auth.uid()
        ))
    );

DROP POLICY IF EXISTS "Staff manage student documents" ON public.student_documents;
CREATE POLICY "Staff manage student documents" ON public.student_documents
    FOR ALL TO authenticated
    USING (
        (school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR
        public.is_super_admin(auth.uid())
    )
    WITH CHECK (
        (school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR
        public.is_super_admin(auth.uid())
    );

-- Audit Logs Policies
DROP POLICY IF EXISTS "School members view audit logs" ON public.report_card_audit_logs;
CREATE POLICY "School members view audit logs" ON public.report_card_audit_logs
    FOR SELECT TO authenticated
    USING (
        school_id = public.current_school_id() OR
        public.is_super_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Staff insert audit logs" ON public.report_card_audit_logs;
CREATE POLICY "Staff insert audit logs" ON public.report_card_audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (
        (school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR
        public.is_super_admin(auth.uid())
    );

-- Indices
CREATE INDEX IF NOT EXISTS idx_student_documents_student ON public.student_documents(student_id);
CREATE INDEX IF NOT EXISTS idx_student_documents_school ON public.student_documents(school_id);
CREATE INDEX IF NOT EXISTS idx_report_card_audit_logs_rc ON public.report_card_audit_logs(report_card_id);
CREATE INDEX IF NOT EXISTS idx_report_card_audit_logs_school ON public.report_card_audit_logs(school_id);
