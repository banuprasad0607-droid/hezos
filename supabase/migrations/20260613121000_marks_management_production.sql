-- 20260613121000_marks_management_production.sql
-- ERP Marks Management Overhaul & Strict RBAC

-- 1. Create Teacher Allocations Table
CREATE TABLE IF NOT EXISTS teacher_allocations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  section TEXT, -- optional, if null implies whole class
  academic_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookup of a teacher's allocated classes/subjects
CREATE INDEX IF NOT EXISTS idx_teacher_allocations_lookup ON teacher_allocations(school_id, teacher_id);

-- 2. Refactor Exams Table (Drop old exam_marks temporarily to avoid foreign key issues during refactor)
DROP TABLE IF EXISTS exam_marks CASCADE;
-- Also drop old subject_allocations if it existed as it's replaced by teacher_allocations
DROP TABLE IF EXISTS subject_allocations CASCADE;

ALTER TABLE exams ADD COLUMN IF NOT EXISTS academic_year TEXT;
ALTER TABLE exams DROP COLUMN IF EXISTS subject_id;

-- 3. Create Exam Subjects (Mapping table for subjects within an exam)
CREATE TABLE IF NOT EXISTS exam_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  max_marks NUMERIC NOT NULL DEFAULT 100,
  pass_marks NUMERIC NOT NULL DEFAULT 35,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(exam_id, subject_id)
);

-- 4. Create Mark Entries Table
CREATE TABLE IF NOT EXISTS mark_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  exam_subject_id UUID NOT NULL REFERENCES exam_subjects(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks_obtained NUMERIC,
  grade TEXT,
  remarks TEXT,
  is_absent BOOLEAN DEFAULT false,
  is_medical_exempt BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'Draft', -- Draft, Submitted, Verified, Approved, Locked
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(exam_subject_id, student_id)
);

-- 5. Create Mark Audit Logs
CREATE TABLE IF NOT EXISTS mark_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  mark_entry_id UUID NOT NULL REFERENCES mark_entries(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  old_marks NUMERIC,
  new_marks NUMERIC,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Create Report Cards
CREATE TABLE IF NOT EXISTS report_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  attendance_percentage NUMERIC,
  total_marks NUMERIC,
  percentage NUMERIC,
  rank_position INTEGER,
  teacher_remarks TEXT,
  status TEXT DEFAULT 'Draft', -- Draft, Published
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, exam_id)
);

-- Enable RLS on all new tables
ALTER TABLE teacher_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mark_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user has admin/principal roles
CREATE OR REPLACE FUNCTION public.is_school_staff(school_id UUID) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid()
    AND school_id = $1
    AND role IN ('super_admin', 'admin')
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- RLS: Teacher Allocations
CREATE POLICY "Staff can view all allocations" ON teacher_allocations FOR SELECT 
USING (public.is_school_staff(school_id) OR teacher_id = auth.uid());

CREATE POLICY "Staff can insert allocations" ON teacher_allocations FOR INSERT 
WITH CHECK (public.is_school_staff(school_id));

CREATE POLICY "Staff can update allocations" ON teacher_allocations FOR UPDATE 
USING (public.is_school_staff(school_id));

CREATE POLICY "Staff can delete allocations" ON teacher_allocations FOR DELETE 
USING (public.is_school_staff(school_id));

-- RLS: Exam Subjects
CREATE POLICY "Anyone in school can view exam subjects" ON exam_subjects FOR SELECT 
USING (school_id IN (SELECT school_id FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can manage exam subjects" ON exam_subjects FOR ALL 
USING (public.is_school_staff(school_id));

-- RLS: Mark Entries (The core RBAC rules)
CREATE POLICY "Staff can view all marks" ON mark_entries FOR SELECT 
USING (public.is_school_staff(school_id));

CREATE POLICY "Teachers can view their allocated subject marks" ON mark_entries FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM teacher_allocations ta
    JOIN exams e ON e.class_id = ta.class_id
    JOIN exam_subjects es ON es.exam_id = e.id AND es.subject_id = ta.subject_id
    WHERE ta.teacher_id = auth.uid() 
    AND es.id = mark_entries.exam_subject_id
  )
);

CREATE POLICY "Parents/Students can view locked marks" ON mark_entries FOR SELECT 
USING (
  status IN ('Locked', 'Published', 'Approved') AND 
  (
    student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()) OR 
    student_id = auth.uid()
  )
);

CREATE POLICY "Staff can insert/update marks anytime" ON mark_entries FOR ALL 
USING (public.is_school_staff(school_id));

CREATE POLICY "Teachers can insert/update marks for their subjects if unlocked" ON mark_entries FOR UPDATE 
USING (
  status IN ('Draft', 'Submitted') AND 
  EXISTS (
    SELECT 1 FROM teacher_allocations ta
    JOIN exams e ON e.class_id = ta.class_id
    JOIN exam_subjects es ON es.exam_id = e.id AND es.subject_id = ta.subject_id
    WHERE ta.teacher_id = auth.uid() 
    AND es.id = mark_entries.exam_subject_id
  )
);

CREATE POLICY "Teachers can insert marks for their subjects" ON mark_entries FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM teacher_allocations ta
    JOIN exams e ON e.class_id = ta.class_id
    JOIN exam_subjects es ON es.exam_id = e.id AND es.subject_id = ta.subject_id
    WHERE ta.teacher_id = auth.uid() 
    AND es.id = mark_entries.exam_subject_id
  )
);

-- RLS: Mark Audit Logs
CREATE POLICY "Staff can view audit logs" ON mark_audit_logs FOR SELECT 
USING (public.is_school_staff(school_id));

CREATE POLICY "System can insert audit logs" ON mark_audit_logs FOR INSERT 
WITH CHECK (true); -- Inserted via frontend or trigger, we'll allow insert but not update/delete

-- RLS: Report Cards
CREATE POLICY "Staff can view all report cards" ON report_cards FOR SELECT 
USING (public.is_school_staff(school_id));

CREATE POLICY "Staff can manage report cards" ON report_cards FOR ALL 
USING (public.is_school_staff(school_id));

CREATE POLICY "Parents/Students can view published report cards" ON report_cards FOR SELECT 
USING (
  status = 'Published' AND 
  (
    student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()) OR 
    student_id = auth.uid()
  )
);

-- Trigger for Audit Logging on Mark Updates
CREATE OR REPLACE FUNCTION log_mark_update()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.marks_obtained IS DISTINCT FROM OLD.marks_obtained THEN
    INSERT INTO mark_audit_logs (
      school_id, mark_entry_id, teacher_id, action, old_marks, new_marks
    ) VALUES (
      NEW.school_id, NEW.id, auth.uid(), 'Score Updated', OLD.marks_obtained, NEW.marks_obtained
    );
  END IF;
  
  -- Auto update updated_at
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS mark_entry_audit_trigger ON mark_entries;
CREATE TRIGGER mark_entry_audit_trigger
  BEFORE UPDATE ON mark_entries
  FOR EACH ROW
  EXECUTE FUNCTION log_mark_update();
