-- SQL Migration: 20260616090000_mark_entries_soft_delete.sql
-- Adds deleted_at column and updates policies for mark_entries soft deletion.

-- 1. Add deleted_at column
ALTER TABLE public.mark_entries ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NULL;

-- 2. Create partial active index for performance
CREATE INDEX IF NOT EXISTS idx_mark_entries_active ON public.mark_entries(school_id, exam_id) WHERE deleted_at IS NULL;

-- 3. Update select policies for Parents/Students & Teachers to filter out soft-deleted marks
DROP POLICY IF EXISTS "Parents/Students can view locked marks" ON public.mark_entries;
CREATE POLICY "Parents/Students can view locked marks" ON public.mark_entries FOR SELECT 
USING (
  deleted_at IS NULL AND
  status IN ('Locked', 'Published', 'Approved') AND 
  (
    student_id IN (SELECT id FROM students WHERE parent_user_id = auth.uid()) OR 
    student_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Teachers can view their allocated subject marks" ON public.mark_entries;
CREATE POLICY "Teachers can view their allocated subject marks" ON public.mark_entries FOR SELECT 
USING (
  deleted_at IS NULL AND
  EXISTS (
    SELECT 1 FROM teacher_allocations ta
    JOIN exams e ON e.class_id = ta.class_id
    JOIN exam_subjects es ON es.exam_id = e.id AND es.subject_id = ta.subject_id
    WHERE ta.teacher_id = auth.uid() 
    AND es.id = mark_entries.exam_subject_id
  )
);
