-- 1) Add super_admin enum value (must be in its own statement; safe to reference via role::text afterwards)
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';

-- 2) Helper: is_super_admin (uses text cast so it works in the same migration as the enum add)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role::text = 'super_admin'
  );
$$;

-- 3) Extend schools
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS code text UNIQUE,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS plan text NOT NULL DEFAULT 'starter',
  ADD COLUMN IF NOT EXISTS student_limit integer NOT NULL DEFAULT 500,
  ADD COLUMN IF NOT EXISTS teacher_limit integer NOT NULL DEFAULT 50;

-- 4) Super-admin visibility on existing tables
CREATE POLICY "Super admins manage all schools" ON public.schools FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins view all profiles" ON public.profiles FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins view all user_roles" ON public.user_roles FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins manage all user_roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins view all students" ON public.students FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));
CREATE POLICY "Super admins view all classes" ON public.classes FOR SELECT TO authenticated
  USING (public.is_super_admin(auth.uid()));

-- 5) Subscriptions
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'starter',
  status text NOT NULL DEFAULT 'active',
  monthly_amount numeric(10,2) NOT NULL DEFAULT 0,
  current_period_end date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Super admins manage subscriptions" ON public.subscriptions FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "Members view own subscription" ON public.subscriptions FOR SELECT TO authenticated
  USING (school_id = public.current_school_id());
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6) Subjects
CREATE TABLE public.subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subjects TO authenticated;
GRANT ALL ON public.subjects TO service_role;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "School members view subjects" ON public.subjects FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Staff manage subjects" ON public.subjects FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));

-- 7) Fee structure (per class, per period type)
CREATE TABLE public.fee_structures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id uuid REFERENCES public.classes(id) ON DELETE SET NULL,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'tuition', -- tuition, admission, transport, exam, other
  amount numeric(10,2) NOT NULL,
  frequency text NOT NULL DEFAULT 'monthly', -- monthly, one_time, term
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fee_structures TO authenticated;
GRANT ALL ON public.fee_structures TO service_role;
ALTER TABLE public.fee_structures ENABLE ROW LEVEL SECURITY;
CREATE POLICY "School members view fee structures" ON public.fee_structures FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() OR public.is_super_admin(auth.uid()));
CREATE POLICY "Admins manage fee structures" ON public.fee_structures FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()));

-- 8) Fee invoices (per student per period)
CREATE TABLE public.fee_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  fee_structure_id uuid REFERENCES public.fee_structures(id) ON DELETE SET NULL,
  title text NOT NULL,
  period text NOT NULL,            -- e.g. 2026-03, 2026-Term1, ADMISSION
  amount_due numeric(10,2) NOT NULL,
  amount_paid numeric(10,2) NOT NULL DEFAULT 0,
  due_date date,
  status text NOT NULL DEFAULT 'pending', -- pending, partial, paid, overdue
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_fee_invoices_school_status ON public.fee_invoices(school_id, status);
CREATE INDEX idx_fee_invoices_student ON public.fee_invoices(student_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fee_invoices TO authenticated;
GRANT ALL ON public.fee_invoices TO service_role;
ALTER TABLE public.fee_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage fee invoices" ON public.fee_invoices FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view own child invoices" ON public.fee_invoices FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = fee_invoices.student_id AND s.parent_user_id = auth.uid()));
CREATE TRIGGER update_fee_invoices_updated_at
  BEFORE UPDATE ON public.fee_invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 9) Fee payments
CREATE TABLE public.fee_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  invoice_id uuid NOT NULL REFERENCES public.fee_invoices(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  method text NOT NULL DEFAULT 'cash', -- cash, bank, upi, card, online
  reference text,
  paid_on date NOT NULL DEFAULT CURRENT_DATE,
  collected_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fee_payments TO authenticated;
GRANT ALL ON public.fee_payments TO service_role;
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Staff manage fee payments" ON public.fee_payments FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.is_staff(auth.uid())) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.is_staff(auth.uid()) AND collected_by = auth.uid()) OR public.is_super_admin(auth.uid()));
CREATE POLICY "Parents view own child payments" ON public.fee_payments FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.fee_invoices i JOIN public.students s ON s.id = i.student_id
    WHERE i.id = fee_payments.invoice_id AND s.parent_user_id = auth.uid()
  ));

-- 10) Teacher salaries (profile, one per teacher)
CREATE TABLE public.teacher_salaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL,
  base_salary numeric(10,2) NOT NULL DEFAULT 0,
  allowances numeric(10,2) NOT NULL DEFAULT 0,
  deductions numeric(10,2) NOT NULL DEFAULT 0,
  bank_account text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, teacher_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_salaries TO authenticated;
GRANT ALL ON public.teacher_salaries TO service_role;
ALTER TABLE public.teacher_salaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage teacher salaries" ON public.teacher_salaries FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()));
CREATE POLICY "Teachers view own salary" ON public.teacher_salaries FOR SELECT TO authenticated
  USING (teacher_id = auth.uid());
CREATE TRIGGER update_teacher_salaries_updated_at
  BEFORE UPDATE ON public.teacher_salaries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 11) Payroll runs (monthly batch) and items (per teacher)
CREATE TABLE public.payroll_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  period text NOT NULL,   -- YYYY-MM
  status text NOT NULL DEFAULT 'draft', -- draft, processed, paid
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  UNIQUE (school_id, period)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_runs TO authenticated;
GRANT ALL ON public.payroll_runs TO service_role;
ALTER TABLE public.payroll_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payroll runs" ON public.payroll_runs FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin') AND created_by = auth.uid()) OR public.is_super_admin(auth.uid()));

CREATE TABLE public.payroll_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_run_id uuid NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id uuid NOT NULL,
  base_salary numeric(10,2) NOT NULL DEFAULT 0,
  allowances numeric(10,2) NOT NULL DEFAULT 0,
  deductions numeric(10,2) NOT NULL DEFAULT 0,
  net_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending', -- pending, paid
  paid_on date,
  payment_method text,
  reference text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_payroll_items_run ON public.payroll_items(payroll_run_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payroll_items TO authenticated;
GRANT ALL ON public.payroll_items TO service_role;
ALTER TABLE public.payroll_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage payroll items" ON public.payroll_items FOR ALL TO authenticated
  USING ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()))
  WITH CHECK ((school_id = public.current_school_id() AND public.has_role(auth.uid(),'admin')) OR public.is_super_admin(auth.uid()));
CREATE POLICY "Teachers view own payroll items" ON public.payroll_items FOR SELECT TO authenticated
  USING (teacher_id = auth.uid());