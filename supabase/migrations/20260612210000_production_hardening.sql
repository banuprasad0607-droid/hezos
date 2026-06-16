-- SQL Migration: 20260612210000_production_hardening.sql
-- Adds deleted_at columns, partial indexes, and updates RLS policies for soft-deletions.

-- 1. Add deleted_at columns to the 8 target tables
ALTER TABLE public.students ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.classes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.fee_invoices ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.fee_payments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.exams ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.exam_marks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;
ALTER TABLE public.remarks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create partial performance indexes to ignore deleted rows in core lookups
CREATE INDEX IF NOT EXISTS idx_students_active ON public.students(school_id, class_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_classes_active ON public.classes(school_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_fee_invoices_active ON public.fee_invoices(school_id, student_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_fee_payments_active ON public.fee_payments(school_id, invoice_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exams_active ON public.exams(school_id, class_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_exam_marks_active ON public.exam_marks(school_id, exam_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_attendance_active ON public.attendance(school_id, class_id, date) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_remarks_active ON public.remarks(school_id, student_id) WHERE deleted_at IS NULL;

-- 3. Update RLS policies to enforce deleted_at IS NULL filter rules for parents and teachers

-- For Students
DROP POLICY IF EXISTS "Staff view all students in school" ON public.students;
CREATE POLICY "Staff view all students in school" ON public.students
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id() 
    AND public.is_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Parents view own children" ON public.students;
CREATE POLICY "Parents view own children" ON public.students
  FOR SELECT TO authenticated
  USING (
    parent_user_id = auth.uid() 
    AND deleted_at IS NULL
  );

-- For Classes
DROP POLICY IF EXISTS "School members view classes" ON public.classes;
CREATE POLICY "School members view classes" ON public.classes
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    AND (deleted_at IS NULL OR public.has_role(auth.uid(), 'admin'))
  );

-- For Invoices
DROP POLICY IF EXISTS "School members view invoices" ON public.fee_invoices;
DROP POLICY IF EXISTS "School staff view invoices" ON public.fee_invoices;
CREATE POLICY "School staff view invoices" ON public.fee_invoices
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id() 
    AND public.is_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Parents view child invoices" ON public.fee_invoices;
CREATE POLICY "Parents view child invoices" ON public.fee_invoices
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL 
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.parent_user_id = auth.uid()
    )
  );

-- For Payments
DROP POLICY IF EXISTS "School staff view payments" ON public.fee_payments;
CREATE POLICY "School staff view payments" ON public.fee_payments
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id() 
    AND public.is_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Parents view own child payments" ON public.fee_payments;
CREATE POLICY "Parents view own child payments" ON public.fee_payments
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL 
    AND EXISTS (
      SELECT 1 FROM public.fee_invoices i
      JOIN public.students s ON s.id = i.student_id
      WHERE i.id = invoice_id AND s.parent_user_id = auth.uid()
    )
  );

-- For Exams
DROP POLICY IF EXISTS "School members view exams" ON public.exams;
CREATE POLICY "School members view exams" ON public.exams
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    AND (deleted_at IS NULL OR public.has_role(auth.uid(), 'admin'))
  );

-- For Exam Marks
DROP POLICY IF EXISTS "School members view exam_marks" ON public.exam_marks;
CREATE POLICY "School members view exam_marks" ON public.exam_marks
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    AND (deleted_at IS NULL OR public.has_role(auth.uid(), 'admin'))
  );

DROP POLICY IF EXISTS "Parents view own child marks" ON public.exam_marks;
CREATE POLICY "Parents view own child marks" ON public.exam_marks
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL 
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.parent_user_id = auth.uid()
    )
  );

-- For Attendance
DROP POLICY IF EXISTS "Staff view attendance in school" ON public.attendance;
CREATE POLICY "Staff view attendance in school" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    AND public.is_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Parents view own child attendance" ON public.attendance;
CREATE POLICY "Parents view own child attendance" ON public.attendance
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL 
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.parent_user_id = auth.uid()
    )
  );

-- For Remarks
DROP POLICY IF EXISTS "Staff view remarks in school" ON public.remarks;
CREATE POLICY "Staff view remarks in school" ON public.remarks
  FOR SELECT TO authenticated
  USING (
    school_id = public.current_school_id()
    AND public.is_staff(auth.uid())
  );

DROP POLICY IF EXISTS "Parents view remarks for own children" ON public.remarks;
CREATE POLICY "Parents view remarks for own children" ON public.remarks
  FOR SELECT TO authenticated
  USING (
    deleted_at IS NULL 
    AND visible_to_parent = true 
    AND EXISTS (
      SELECT 1 FROM public.students s 
      WHERE s.id = student_id AND s.parent_user_id = auth.uid()
    )
  );
