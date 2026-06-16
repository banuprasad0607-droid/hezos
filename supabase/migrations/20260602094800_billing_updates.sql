-- 1) Extend subscriptions table
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS billing_cycle text NOT NULL DEFAULT 'monthly',
  ADD COLUMN IF NOT EXISTS trial_end timestamptz,
  ADD COLUMN IF NOT EXISTS next_billing_date timestamptz,
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id text;

-- 2) Platform Invoices (Invoices from Platform -> School for their subscription)
CREATE TABLE public.platform_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  invoice_number text NOT NULL UNIQUE,
  amount numeric(10,2) NOT NULL,
  gst_amount numeric(10,2) NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL,
  billing_period_start date,
  billing_period_end date,
  due_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- pending, paid, cancelled, overdue
  pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_invoices TO authenticated;
GRANT ALL ON public.platform_invoices TO service_role;
ALTER TABLE public.platform_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage platform invoices" ON public.platform_invoices FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "School admins view their platform invoices" ON public.platform_invoices FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_platform_invoices_updated_at
  BEFORE UPDATE ON public.platform_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Platform Payments
CREATE TABLE public.platform_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  invoice_id uuid REFERENCES public.platform_invoices(id) ON DELETE SET NULL,
  amount numeric(10,2) NOT NULL,
  payment_method text NOT NULL DEFAULT 'online', -- online, bank_transfer, cash, razorpay, stripe
  reference_id text,
  status text NOT NULL DEFAULT 'completed', -- pending, completed, failed
  paid_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.platform_payments TO authenticated;
GRANT ALL ON public.platform_payments TO service_role;
ALTER TABLE public.platform_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage platform payments" ON public.platform_payments FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

CREATE POLICY "School admins view their platform payments" ON public.platform_payments FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- 4) Branch and Storage limits on Schools
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS storage_limit_gb numeric(10,2) NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS branch_limit integer NOT NULL DEFAULT 1;

-- 5) Enforce limits with triggers

-- Function to check student limit before insert
CREATE OR REPLACE FUNCTION public.check_school_student_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_limit integer;
  v_count integer;
BEGIN
  -- Get the limit for the school
  SELECT student_limit INTO v_limit FROM public.schools WHERE id = NEW.school_id;
  
  -- Get current count of students
  SELECT count(*) INTO v_count FROM public.students WHERE school_id = NEW.school_id;
  
  IF v_count >= v_limit THEN
    RAISE EXCEPTION 'Student limit (%) reached for this school plan.', v_limit;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_student_limit ON public.students;
CREATE TRIGGER trg_check_student_limit
BEFORE INSERT ON public.students
FOR EACH ROW EXECUTE FUNCTION public.check_school_student_limit();

-- Function to check teacher limit before insert (on user_roles where role = 'teacher')
CREATE OR REPLACE FUNCTION public.check_school_teacher_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_limit integer;
  v_count integer;
BEGIN
  IF NEW.role = 'teacher' THEN
    -- Get the limit for the school
    SELECT teacher_limit INTO v_limit FROM public.schools WHERE id = NEW.school_id;
    
    -- Get current count of teachers
    SELECT count(*) INTO v_count FROM public.user_roles WHERE school_id = NEW.school_id AND role = 'teacher';
    
    IF v_count >= v_limit THEN
      RAISE EXCEPTION 'Teacher limit (%) reached for this school plan.', v_limit;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_check_teacher_limit ON public.user_roles;
CREATE TRIGGER trg_check_teacher_limit
BEFORE INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.check_school_teacher_limit();
