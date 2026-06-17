-- SQL Migration: 20260617000000_harden_db_business_rules.sql
-- Hardens Database Constraints for Fees & Marks Modules

-- 1. fee_invoices: Enforce amount_due >= 0, amount_paid >= 0, and amount_paid <= amount_due (prevent negative balances)
ALTER TABLE public.fee_invoices 
  ADD CONSTRAINT invoice_amounts_valid 
  CHECK (amount_due >= 0 AND amount_paid >= 0 AND amount_paid <= amount_due);

-- 2. fee_payments: Enforce payment amount > 0
ALTER TABLE public.fee_payments 
  ADD CONSTRAINT payment_amount_positive 
  CHECK (amount > 0);

-- 3. exam_subjects: Enforce max_marks > 0, pass_marks >= 0, and pass_marks <= max_marks
ALTER TABLE public.exam_subjects 
  ADD CONSTRAINT exam_subject_marks_valid 
  CHECK (max_marks > 0 AND pass_marks >= 0 AND pass_marks <= max_marks);

-- 4. mark_entries trigger: Enforce marks_obtained >= 0 and marks_obtained <= max_marks
CREATE OR REPLACE FUNCTION public.validate_mark_entry_score()
RETURNS TRIGGER AS $$
DECLARE
  v_max_marks NUMERIC;
BEGIN
  -- Retrieve max_marks for the exam subject
  SELECT max_marks INTO v_max_marks
  FROM public.exam_subjects
  WHERE id = NEW.exam_subject_id;

  IF v_max_marks IS NULL THEN
    RAISE EXCEPTION 'Invalid exam_subject_id: %', NEW.exam_subject_id;
  END IF;

  -- Validate score bounds
  IF NEW.marks_obtained IS NOT NULL THEN
    IF NEW.marks_obtained < 0 THEN
      RAISE EXCEPTION 'Marks obtained cannot be negative (got %)', NEW.marks_obtained;
    END IF;
    
    IF NEW.marks_obtained > v_max_marks THEN
      RAISE EXCEPTION 'Marks obtained (%) exceeds maximum marks allowed (%)', NEW.marks_obtained, v_max_marks;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS mark_entry_score_validation_trigger ON public.mark_entries;
CREATE TRIGGER mark_entry_score_validation_trigger
  BEFORE INSERT OR UPDATE ON public.mark_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_mark_entry_score();
