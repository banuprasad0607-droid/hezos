-- =========================================================
-- STUDENT ACHIEVEMENTS, RANKING AND AWARDS SCHEMAS
-- =========================================================

-- 1) Create EXAMS table
CREATE TABLE IF NOT EXISTS public.exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'unit_test', 'monthly', 'quarterly', 'half_yearly', 'annual', 'custom'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  max_marks NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Create EXAM_MARKS table
CREATE TABLE IF NOT EXISTS public.exam_marks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC(5,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (exam_id, student_id)
);

-- 3) Create RANKING_RULES table
CREATE TABLE IF NOT EXISTS public.ranking_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE UNIQUE,
  criteria TEXT NOT NULL DEFAULT 'percentage', -- 'total_marks', 'percentage', 'gpa'
  attendance_weightage NUMERIC(3,2) NOT NULL DEFAULT 0.10, -- 10%
  attendance_threshold NUMERIC(5,2) NOT NULL DEFAULT 75.00, -- 75%
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4) Create RANKINGS table
CREATE TABLE IF NOT EXISTS public.rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE, -- Nullable for overall academic year rankings
  total_marks NUMERIC(8,2) NOT NULL,
  percentage NUMERIC(5,2) NOT NULL,
  gpa NUMERIC(4,2) NOT NULL,
  rank_position INTEGER NOT NULL,
  rank_type TEXT NOT NULL, -- 'school', 'class', 'section', 'subject'
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE, -- Nullable
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5) Create AWARDS table
CREATE TABLE IF NOT EXISTS public.awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  category TEXT NOT NULL, -- 'rank_1', 'rank_2', 'rank_3', 'top_10', 'subject_topper', 'class_topper', 'section_topper', 'school_topper', 'attendance_topper', 'most_improved', 'discipline_award', 'olympiad', 'sports', 'cultural', 'scholarship'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  issued_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6) Create CERTIFICATES table
CREATE TABLE IF NOT EXISTS public.certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  award_id UUID REFERENCES public.awards(id) ON DELETE CASCADE,
  certificate_type TEXT NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  pdf_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7) Create POSTERS table
CREATE TABLE IF NOT EXISTS public.posters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  award_id UUID REFERENCES public.awards(id) ON DELETE CASCADE,
  theme TEXT NOT NULL, -- 'gold', 'silver', 'bronze', 'royal', 'modern'
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8) Create NOTIFICATION_LOGS table
CREATE TABLE IF NOT EXISTS public.notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  parent_user_id UUID NOT NULL,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  award_id UUID REFERENCES public.awards(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent', -- 'sent', 'delivered', 'failed'
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Triggers to update timestamps
CREATE TRIGGER trg_exams_updated_at BEFORE UPDATE ON public.exams
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_exam_marks_updated_at BEFORE UPDATE ON public.exam_marks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_ranking_rules_updated_at BEFORE UPDATE ON public.ranking_rules
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Grant privileges to authenticated role and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exams TO authenticated;
GRANT ALL ON public.exams TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exam_marks TO authenticated;
GRANT ALL ON public.exam_marks TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.ranking_rules TO authenticated;
GRANT ALL ON public.ranking_rules TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.rankings TO authenticated;
GRANT ALL ON public.rankings TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.awards TO authenticated;
GRANT ALL ON public.awards TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.posters TO authenticated;
GRANT ALL ON public.posters TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_logs TO authenticated;
GRANT ALL ON public.notification_logs TO service_role;

-- Row Level Security
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.awards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- EXAMS policies
CREATE POLICY "School members view exams" ON public.exams FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Staff manage exams" ON public.exams FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- EXAM_MARKS policies
CREATE POLICY "School members view exam_marks" ON public.exam_marks FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Staff manage exam_marks" ON public.exam_marks FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- RANKING_RULES policies
CREATE POLICY "School members view ranking_rules" ON public.ranking_rules FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Admins manage ranking_rules" ON public.ranking_rules FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin')) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin')) OR public.is_super_admin(auth.uid()));

-- RANKINGS policies
CREATE POLICY "School members view rankings" ON public.rankings FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view child rankings" ON public.rankings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Staff manage rankings" ON public.rankings FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- AWARDS policies
CREATE POLICY "School members view awards" ON public.awards FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view child awards" ON public.awards FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Staff manage awards" ON public.awards FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- CERTIFICATES policies
CREATE POLICY "School members view certificates" ON public.certificates FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view child certificates" ON public.certificates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Staff manage certificates" ON public.certificates FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- POSTERS policies
CREATE POLICY "School members view posters" ON public.posters FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view child posters" ON public.posters FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Staff manage posters" ON public.posters FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- NOTIFICATION_LOGS policies
CREATE POLICY "Parents view own notifications" ON public.notification_logs FOR SELECT TO authenticated
  USING (parent_user_id = auth.uid() OR public.is_super_admin(auth.uid()));
CREATE POLICY "School staff view notification_logs" ON public.notification_logs FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));
CREATE POLICY "Staff manage notification_logs" ON public.notification_logs FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- Enable Realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.exams;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exam_marks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.rankings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.awards;
