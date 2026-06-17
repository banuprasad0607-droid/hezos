
-- =========================================================
-- ENUMS
-- =========================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'parent');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'half_day');
CREATE TYPE public.remark_category AS ENUM ('academic', 'behaviour', 'appreciation', 'improvement', 'performance');
CREATE TYPE public.homework_file_type AS ENUM ('pdf', 'image', 'none');

-- =========================================================
-- UTIL: updated_at trigger
-- =========================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- =========================================================
-- SCHOOLS
-- =========================================================
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.schools TO authenticated;
GRANT ALL ON public.schools TO service_role;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_schools_updated_at
BEFORE UPDATE ON public.schools
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- PROFILES
-- =========================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  school_id UUID REFERENCES public.schools(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER trg_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- USER ROLES (separate table per security best practice)
-- =========================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  school_id UUID REFERENCES public.schools(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, school_id, role)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security-definer helpers (avoid recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.current_school_id()
RETURNS UUID
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT school_id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role IN ('admin','teacher')
  );
$$;

-- =========================================================
-- CLASSES
-- =========================================================
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT,
  section TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classes TO authenticated;
GRANT ALL ON public.classes TO service_role;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_classes_updated_at BEFORE UPDATE ON public.classes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================================
-- STUDENTS
-- =========================================================
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  roll_number TEXT,
  parent_user_id UUID,
  parent_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.students TO authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_students_updated_at BEFORE UPDATE ON public.students
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_students_class ON public.students(class_id);
CREATE INDEX idx_students_parent ON public.students(parent_user_id);

-- =========================================================
-- ATTENDANCE
-- =========================================================
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.attendance_status NOT NULL,
  marked_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.attendance TO authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_attendance_updated_at BEFORE UPDATE ON public.attendance
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_attendance_class_date ON public.attendance(class_id, date);

-- =========================================================
-- HOMEWORK
-- =========================================================
CREATE TABLE public.homework (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  subject TEXT,
  description TEXT,
  due_date DATE,
  file_url TEXT,
  file_type public.homework_file_type NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homework TO authenticated;
GRANT ALL ON public.homework TO service_role;
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER trg_homework_updated_at BEFORE UPDATE ON public.homework
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_homework_class ON public.homework(class_id);

-- =========================================================
-- REMARKS
-- =========================================================
CREATE TABLE public.remarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL,
  category public.remark_category NOT NULL,
  content TEXT NOT NULL,
  visible_to_parent BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.remarks TO authenticated;
GRANT ALL ON public.remarks TO service_role;
ALTER TABLE public.remarks ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_remarks_student ON public.remarks(student_id);

-- =========================================================
-- ANNOUNCEMENTS
-- =========================================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_announcements_school ON public.announcements(school_id);

-- =========================================================
-- RLS POLICIES
-- =========================================================

-- SCHOOLS
CREATE POLICY "Members can view their school" ON public.schools FOR SELECT TO authenticated
USING (id = public.current_school_id());
CREATE POLICY "Authenticated can create a school" ON public.schools FOR INSERT TO authenticated
WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Admins can update their school" ON public.schools FOR UPDATE TO authenticated
USING (id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- PROFILES
CREATE POLICY "Users can view profiles in their school" ON public.profiles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR school_id = public.current_school_id());
CREATE POLICY "Users insert their own profile" ON public.profiles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users update their own profile" ON public.profiles FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- USER_ROLES
CREATE POLICY "Users view roles in their school" ON public.user_roles FOR SELECT TO authenticated
USING (user_id = auth.uid() OR school_id = public.current_school_id());
CREATE POLICY "Users insert own initial role" ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins manage roles in school" ON public.user_roles FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- CLASSES
CREATE POLICY "School members view classes" ON public.classes FOR SELECT TO authenticated
USING (school_id = public.current_school_id());
CREATE POLICY "Staff manage classes" ON public.classes FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

-- STUDENTS
CREATE POLICY "Staff view all students in school" ON public.students FOR SELECT TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));
CREATE POLICY "Parents view own children" ON public.students FOR SELECT TO authenticated
USING (parent_user_id = auth.uid());
CREATE POLICY "Staff manage students" ON public.students FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

-- ATTENDANCE
CREATE POLICY "Staff view attendance in school" ON public.attendance FOR SELECT TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));
CREATE POLICY "Parents view own child attendance" ON public.attendance FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Staff manage attendance" ON public.attendance FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()) AND marked_by = auth.uid());

-- HOMEWORK
CREATE POLICY "School staff view homework" ON public.homework FOR SELECT TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));
CREATE POLICY "Parents view homework for their child class" ON public.homework FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.students s WHERE s.parent_user_id = auth.uid() AND s.class_id = homework.class_id));
CREATE POLICY "Teachers manage homework" ON public.homework FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()) AND teacher_id = auth.uid());

-- REMARKS
CREATE POLICY "Staff view remarks in school" ON public.remarks FOR SELECT TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));
CREATE POLICY "Parents view remarks for own children" ON public.remarks FOR SELECT TO authenticated
USING (visible_to_parent = true AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.parent_user_id = auth.uid()));
CREATE POLICY "Teachers insert remarks" ON public.remarks FOR INSERT TO authenticated
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()) AND teacher_id = auth.uid());
CREATE POLICY "Teachers update own remarks" ON public.remarks FOR UPDATE TO authenticated
USING (teacher_id = auth.uid());
CREATE POLICY "Teachers delete own remarks" ON public.remarks FOR DELETE TO authenticated
USING (teacher_id = auth.uid());

-- ANNOUNCEMENTS
CREATE POLICY "School members view announcements" ON public.announcements FOR SELECT TO authenticated
USING (school_id = public.current_school_id() OR
       EXISTS (SELECT 1 FROM public.students s WHERE s.parent_user_id = auth.uid() AND s.school_id = announcements.school_id));
CREATE POLICY "Staff manage announcements" ON public.announcements FOR ALL TO authenticated
USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()) AND created_by = auth.uid());

-- =========================================================
-- SIGNUP TRIGGER: create profile automatically
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- REALTIME
-- =========================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.attendance;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homework;
ALTER PUBLICATION supabase_realtime ADD TABLE public.remarks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- =========================================================
-- STORAGE: homework files bucket (public read for easy download)
-- =========================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('homework-files', 'homework-files', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Homework files publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'homework-files');

CREATE POLICY "Authenticated can upload homework files"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'homework-files');

CREATE POLICY "Owners can update homework files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'homework-files' AND owner = auth.uid());

CREATE POLICY "Owners can delete homework files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'homework-files' AND owner = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  parent_school UUID;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Auto-link as parent if any student already lists this email
  IF NEW.email IS NOT NULL THEN
    UPDATE public.students
    SET parent_user_id = NEW.id
    WHERE parent_email = NEW.email AND parent_user_id IS NULL;

    SELECT school_id INTO parent_school
    FROM public.students
    WHERE parent_user_id = NEW.id
    LIMIT 1;

    IF parent_school IS NOT NULL THEN
      UPDATE public.profiles SET school_id = parent_school WHERE user_id = NEW.id;
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES (NEW.id, parent_school, 'parent')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TABLE public.teacher_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  invited_by UUID NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by UUID,
  revoked_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_teacher_invitations_email_school ON public.teacher_invitations (lower(email), school_id);
CREATE INDEX idx_teacher_invitations_school ON public.teacher_invitations (school_id);

GRANT SELECT, INSERT, UPDATE ON public.teacher_invitations TO authenticated;
GRANT ALL ON public.teacher_invitations TO service_role;

ALTER TABLE public.teacher_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view invitations in their school"
ON public.teacher_invitations FOR SELECT TO authenticated
USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins create invitations"
ON public.teacher_invitations FOR INSERT TO authenticated
WITH CHECK (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin') AND invited_by = auth.uid());

CREATE POLICY "Admins update invitations (revoke)"
ON public.teacher_invitations FOR UPDATE TO authenticated
USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- Update signup handler to also consume teacher invitations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  parent_school UUID;
  invite RECORD;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 1) Teacher invitation: most recent pending, non-expired, non-revoked invite for this email
  IF NEW.email IS NOT NULL THEN
    SELECT * INTO invite
    FROM public.teacher_invitations
    WHERE lower(email) = lower(NEW.email)
      AND accepted_at IS NULL
      AND revoked_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;

    IF invite.id IS NOT NULL THEN
      UPDATE public.profiles SET school_id = invite.school_id WHERE user_id = NEW.id;
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES (NEW.id, invite.school_id, 'teacher')
      ON CONFLICT DO NOTHING;
      UPDATE public.teacher_invitations
      SET accepted_at = now(), accepted_by = NEW.id
      WHERE id = invite.id;
      RETURN NEW;
    END IF;

    -- 2) Parent auto-link (existing behavior)
    UPDATE public.students
    SET parent_user_id = NEW.id
    WHERE parent_email = NEW.email AND parent_user_id IS NULL;

    SELECT school_id INTO parent_school
    FROM public.students
    WHERE parent_user_id = NEW.id
    LIMIT 1;

    IF parent_school IS NOT NULL THEN
      UPDATE public.profiles SET school_id = parent_school WHERE user_id = NEW.id;
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES (NEW.id, parent_school, 'parent')
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;
-- Allow owners to view all schools they own (for multi-school admin)
CREATE POLICY "Owners can view their schools"
ON public.schools
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());
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

-- Students: admission number + contact/profile fields
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS admission_number text,
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS parent_phone text,
  ADD COLUMN IF NOT EXISTS parent_name text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS address text;

CREATE UNIQUE INDEX IF NOT EXISTS students_school_admission_unique
  ON public.students(school_id, admission_number)
  WHERE admission_number IS NOT NULL;

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL,
  user_id uuid NOT NULL,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Users update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Staff create notifications in school" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

CREATE POLICY "Super admins manage notifications" ON public.notifications
  FOR ALL TO authenticated
  USING (is_super_admin(auth.uid()))
  WITH CHECK (is_super_admin(auth.uid()));

CREATE INDEX IF NOT EXISTS notifications_user_created_idx
  ON public.notifications(user_id, created_at DESC);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS temp_password TEXT;
ALTER TABLE public.teacher_invitations ADD COLUMN IF NOT EXISTS temp_password text;

CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_id UUID NOT NULL,
  student_id UUID NOT NULL,
  parent_user_id UUID NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT leave_dates_valid CHECK (end_date >= start_date),
  CONSTRAINT leave_status_valid CHECK (status IN ('pending','approved','rejected','cancelled'))
);

CREATE INDEX idx_leave_requests_school ON public.leave_requests(school_id, status);
CREATE INDEX idx_leave_requests_student ON public.leave_requests(student_id);
CREATE INDEX idx_leave_requests_parent ON public.leave_requests(parent_user_id);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.leave_requests TO authenticated;
GRANT ALL ON public.leave_requests TO service_role;

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

-- Parents: view own children's leave requests
CREATE POLICY "Parents view own leave requests"
ON public.leave_requests FOR SELECT
TO authenticated
USING (parent_user_id = auth.uid());

-- Parents: create leave requests for their own children
CREATE POLICY "Parents create leave requests"
ON public.leave_requests FOR INSERT
TO authenticated
WITH CHECK (
  parent_user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.id = leave_requests.student_id
      AND s.parent_user_id = auth.uid()
      AND s.school_id = leave_requests.school_id
  )
);

-- Parents: cancel their own pending requests
CREATE POLICY "Parents cancel own pending leave requests"
ON public.leave_requests FOR UPDATE
TO authenticated
USING (parent_user_id = auth.uid() AND status = 'pending')
WITH CHECK (parent_user_id = auth.uid() AND status IN ('pending','cancelled'));

-- Staff: view all leave requests in their school
CREATE POLICY "Staff view leave requests in school"
ON public.leave_requests FOR SELECT
TO authenticated
USING (school_id = current_school_id() AND is_staff(auth.uid()));

-- Staff: approve / reject leave requests
CREATE POLICY "Staff review leave requests"
ON public.leave_requests FOR UPDATE
TO authenticated
USING (school_id = current_school_id() AND is_staff(auth.uid()))
WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

CREATE TRIGGER update_leave_requests_updated_at
BEFORE UPDATE ON public.leave_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
-- 1) Privilege escalation: restrict self-insert to parent role only
DROP POLICY IF EXISTS "Users insert own initial role" ON public.user_roles;
CREATE POLICY "Users insert own parent role"
  ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'parent'::app_role);

-- 2) Move temp_password out of schools into a restricted table
CREATE TABLE IF NOT EXISTS public.school_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL UNIQUE,
  temp_password text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT ALL ON public.school_credentials TO service_role;

ALTER TABLE public.school_credentials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins manage school credentials"
  ON public.school_credentials
  FOR ALL
  TO authenticated
  USING (public.is_super_admin(auth.uid()))
  WITH CHECK (public.is_super_admin(auth.uid()));

-- Backfill existing temp passwords
INSERT INTO public.school_credentials (school_id, temp_password)
SELECT id, temp_password FROM public.schools WHERE temp_password IS NOT NULL
ON CONFLICT (school_id) DO UPDATE SET temp_password = EXCLUDED.temp_password;

-- Drop the exposed column from schools
ALTER TABLE public.schools DROP COLUMN IF EXISTS temp_password;

-- 3) Homework storage: restrict uploads to staff only
DROP POLICY IF EXISTS "Authenticated can upload homework files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload homework files" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload homework files" ON storage.objects;

CREATE POLICY "Staff upload homework files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update homework files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'homework-files' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete homework files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'homework-files' AND public.is_staff(auth.uid()));
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
-- Add RLS policy to allow parents to read school details for their children's schools
CREATE POLICY "Parents can view their children's schools" ON public.schools FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.school_id = public.schools.id AND s.parent_user_id = auth.uid()
  )
);
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
-- =========================================================
-- ACHIEVEMENTS AND RANKINGS ENHANCEMENTS MIGRATION
-- =========================================================

-- 1) Add is_published column to rankings and awards
ALTER TABLE public.rankings
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

ALTER TABLE public.awards
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false;

-- 2) Add enabled_categories to ranking_rules
ALTER TABLE public.ranking_rules
  ADD COLUMN IF NOT EXISTS enabled_categories TEXT[] DEFAULT ARRAY[
    'rank_1', 'rank_2', 'rank_3', 'top_10', 'subject_topper', 
    'class_topper', 'section_topper', 'school_topper', 
    'attendance_topper', 'most_improved', 'discipline_award', 
    'olympiad', 'sports', 'cultural', 'scholarship'
  ]::TEXT[];

-- 3) Update existing students seed data to have proper admission_number values
UPDATE public.students SET admission_number = 'ADM-2026-001' WHERE roll_number = '101';
UPDATE public.students SET admission_number = 'ADM-2026-002' WHERE roll_number = '102';
UPDATE public.students SET admission_number = 'ADM-2026-003' WHERE roll_number = '103';
UPDATE public.students SET admission_number = 'ADM-2026-004' WHERE roll_number = '104';
UPDATE public.students SET admission_number = 'ADM-2026-005' WHERE roll_number = '105';
UPDATE public.students SET admission_number = 'ADM-2026-006' WHERE roll_number = '106';
UPDATE public.students SET admission_number = 'ADM-2026-007' WHERE roll_number = '107';
UPDATE public.students SET admission_number = 'ADM-2026-008' WHERE roll_number = '108';

-- 4) Set all previously seeded rankings and awards as published
UPDATE public.rankings SET is_published = true;
UPDATE public.awards SET is_published = true;
-- ID Card Management Module Schema Enhancements

-- 1. Alter schools table
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS phone_number text,
  ADD COLUMN IF NOT EXISTS email text;

-- 2. Alter students table
ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS transport_route text,
  ADD COLUMN IF NOT EXISTS bus_number text,
  ADD COLUMN IF NOT EXISTS academic_year text DEFAULT '2025-2026';

-- 3. Alter profiles table
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS photo_url text,
  ADD COLUMN IF NOT EXISTS employee_id text,
  ADD COLUMN IF NOT EXISTS designation text,
  ADD COLUMN IF NOT EXISTS department text,
  ADD COLUMN IF NOT EXISTS joining_date date,
  ADD COLUMN IF NOT EXISTS mobile_number text,
  ADD COLUMN IF NOT EXISTS blood_group text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS emergency_contact text,
  ADD COLUMN IF NOT EXISTS notes text;

-- 4. Create visitor_passes table
CREATE TABLE IF NOT EXISTS public.visitor_passes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  visitor_name text NOT NULL,
  photo_url text,
  purpose_of_visit text,
  contact_number text NOT NULL,
  host_name text,
  check_in_time timestamptz NOT NULL DEFAULT now(),
  check_out_time timestamptz,
  pass_number text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitor_passes TO authenticated;
GRANT ALL ON public.visitor_passes TO service_role;

ALTER TABLE public.visitor_passes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own school visitor passes" ON public.visitor_passes
  FOR SELECT TO authenticated
  USING (school_id = current_school_id());

CREATE POLICY "Staff manage visitor passes" ON public.visitor_passes
  FOR ALL TO authenticated
  USING (school_id = current_school_id() AND is_staff(auth.uid()))
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

-- 5. Create id_card_history table
CREATE TABLE IF NOT EXISTS public.id_card_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  card_type text NOT NULL, -- 'student', 'staff', 'visitor'
  holder_id uuid NOT NULL,
  academic_year text NOT NULL,
  printed_by uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  printed_at timestamptz NOT NULL DEFAULT now(),
  reason text DEFAULT 'First Issue'
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.id_card_history TO authenticated;
GRANT ALL ON public.id_card_history TO service_role;

ALTER TABLE public.id_card_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own school reprint history" ON public.id_card_history
  FOR SELECT TO authenticated
  USING (school_id = current_school_id());

CREATE POLICY "Staff insert reprint logs" ON public.id_card_history
  FOR INSERT TO authenticated
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));

-- 6. Trigger for visitor_passes updated_at
CREATE TRIGGER trg_visitor_passes_updated_at BEFORE UPDATE ON public.visitor_passes
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add policy for profiles updating by self or admin
-- Supabase profiles table sometimes needs direct policies if not already exist
CREATE POLICY "Users update own profile fields" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Staff update all profiles" ON public.profiles
  FOR UPDATE TO authenticated
  USING (school_id = current_school_id() AND is_staff(auth.uid()))
  WITH CHECK (school_id = current_school_id() AND is_staff(auth.uid()));
-- SQL Migration: Add student-photos bucket and configure access policies
INSERT INTO storage.buckets (id, name, public) VALUES ('student-photos', 'student-photos', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policies for student-photos bucket
CREATE POLICY "Student photos publicly readable"
ON storage.objects FOR SELECT
USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can upload student photos"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can update student photos"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'student-photos');

CREATE POLICY "Authenticated users can delete student photos"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'student-photos');
-- 20260610080000_multitenant_requirements.sql
-- Database alignment migration for CRITICAL MULTI-TENANT RULES

-- 1) Add generated columns to public.schools table
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_name TEXT GENERATED ALWAYS AS (name) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_code TEXT GENERATED ALWAYS AS (code) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS school_logo TEXT GENERATED ALWAYS AS (logo_url) STORED;
ALTER TABLE public.schools ADD COLUMN IF NOT EXISTS admin_id UUID GENERATED ALWAYS AS (owner_id) STORED;

-- 2) Create the public.users view
CREATE OR REPLACE VIEW public.users WITH (security_invoker = true) AS
SELECT
  user_id AS id,
  role::text AS role,
  school_id
FROM public.user_roles;

-- 3) Grant privileges
GRANT SELECT ON public.users TO authenticated;
GRANT SELECT ON public.users TO service_role;
-- 20260610120000_production_readiness_upgrades.sql
-- Production readiness schema updates and RLS hardening

-- 1. Alter schools table to add principal name and principal signature URL
ALTER TABLE public.schools
  ADD COLUMN IF NOT EXISTS principal_name TEXT,
  ADD COLUMN IF NOT EXISTS principal_signature_url TEXT;

-- 2. Modify handle_new_user trigger function to map parent user roles to ALL schools where they have children
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  parent_school UUID;
  invite RECORD;
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- 1) Teacher invitation: most recent pending, non-expired, non-revoked invite for this email
  IF NEW.email IS NOT NULL THEN
    SELECT * INTO invite
    FROM public.teacher_invitations
    WHERE lower(email) = lower(NEW.email)
      AND accepted_at IS NULL
      AND revoked_at IS NULL
      AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT 1;

    IF invite.id IS NOT NULL THEN
      UPDATE public.profiles SET school_id = invite.school_id WHERE user_id = NEW.id;
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES (NEW.id, invite.school_id, 'teacher')
      ON CONFLICT DO NOTHING;
      UPDATE public.teacher_invitations
      SET accepted_at = now(), accepted_by = NEW.id
      WHERE id = invite.id;
      RETURN NEW;
    END IF;

    -- 2) Parent auto-link (mapping roles to ALL schools where they have a registered child)
    UPDATE public.students
    SET parent_user_id = NEW.id
    WHERE parent_email = NEW.email AND parent_user_id IS NULL;

    -- Insert user roles for every school context
    INSERT INTO public.user_roles (user_id, school_id, role)
    SELECT DISTINCT NEW.id, school_id, 'parent'::public.app_role
    FROM public.students
    WHERE parent_user_id = NEW.id
    ON CONFLICT DO NOTHING;

    -- Set default school context in the base profile
    SELECT school_id INTO parent_school
    FROM public.students
    WHERE parent_user_id = NEW.id
    LIMIT 1;

    IF parent_school IS NOT NULL THEN
      UPDATE public.profiles SET school_id = parent_school WHERE user_id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;

-- 3. Harden Rankings and Awards Parent SELECT RLS policies
DROP POLICY IF EXISTS "Parents view child rankings" ON public.rankings;
CREATE POLICY "Parents view child rankings" ON public.rankings 
  FOR SELECT TO authenticated 
  USING (is_published = true AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id AND s.parent_user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Parents view child awards" ON public.awards;
CREATE POLICY "Parents view child awards" ON public.awards 
  FOR SELECT TO authenticated 
  USING (is_published = true AND EXISTS (
    SELECT 1 FROM public.students s 
    WHERE s.id = student_id AND s.parent_user_id = auth.uid()
  ));

-- 4. Harden Student Photos Storage RLS policies (write access restricted to staff)
DROP POLICY IF EXISTS "Authenticated users can upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload student photos" ON storage.objects;
CREATE POLICY "Staff upload student photos" ON storage.objects 
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff update student photos" ON storage.objects;
CREATE POLICY "Staff update student photos" ON storage.objects 
  FOR UPDATE TO authenticated USING (bucket_id = 'student-photos' AND public.is_staff(auth.uid())) WITH CHECK (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete student photos" ON storage.objects;
CREATE POLICY "Staff delete student photos" ON storage.objects 
  FOR DELETE TO authenticated USING (bucket_id = 'student-photos' AND public.is_staff(auth.uid()));

-- 5. Restrict student deletion RLS policy to School Admins
DROP POLICY IF EXISTS "Staff manage students" ON public.students;
DROP POLICY IF EXISTS "Staff view all students in school" ON public.students;
DROP POLICY IF EXISTS "Staff insert students" ON public.students;
DROP POLICY IF EXISTS "Staff update students" ON public.students;
DROP POLICY IF EXISTS "Only admins delete students" ON public.students;

CREATE POLICY "Staff view all students in school" ON public.students
  FOR SELECT TO authenticated
  USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Staff insert students" ON public.students
  FOR INSERT TO authenticated
  WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update students" ON public.students
  FOR UPDATE TO authenticated
  USING (school_id = public.current_school_id() AND public.is_staff(auth.uid()))
  WITH CHECK (school_id = public.current_school_id() AND public.is_staff(auth.uid()));

CREATE POLICY "Only admins delete students" ON public.students
  FOR DELETE TO authenticated
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

-- 6. Teacher attendance check-ins table
CREATE TABLE IF NOT EXISTS public.teacher_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status public.attendance_status NOT NULL,
  marked_by UUID NOT NULL REFERENCES public.profiles(user_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, date)
);
ALTER TABLE public.teacher_attendance ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage teacher attendance" ON public.teacher_attendance;
CREATE POLICY "Admins manage teacher attendance" ON public.teacher_attendance
  FOR ALL TO authenticated 
  USING (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (school_id = public.current_school_id() AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Teachers view own attendance" ON public.teacher_attendance;
CREATE POLICY "Teachers view own attendance" ON public.teacher_attendance
  FOR SELECT TO authenticated 
  USING (school_id = public.current_school_id() AND (teacher_id = auth.uid() OR public.has_role(auth.uid(), 'admin')));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_attendance TO authenticated;
GRANT ALL ON public.teacher_attendance TO service_role;
-- 20260610150000_final_production_fixes.sql
-- Final production readiness fixes
-- Covers: missing indexes, missing super_admin policies, RLS hardening

-- ==========================================================
-- 1. PERFORMANCE: Add missing database indexes
-- ==========================================================

-- Fee tables
CREATE INDEX IF NOT EXISTS idx_fee_invoices_school ON public.fee_invoices(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_student ON public.fee_invoices(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON public.fee_invoices(status);
CREATE INDEX IF NOT EXISTS idx_fee_structures_school ON public.fee_structures(school_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_invoice ON public.fee_payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_fee_payments_school ON public.fee_payments(school_id);

-- Rankings & Awards
CREATE INDEX IF NOT EXISTS idx_rankings_school ON public.rankings(school_id);
CREATE INDEX IF NOT EXISTS idx_rankings_student ON public.rankings(student_id);
CREATE INDEX IF NOT EXISTS idx_awards_school ON public.awards(school_id);
CREATE INDEX IF NOT EXISTS idx_awards_student ON public.awards(student_id);

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_school ON public.profiles(school_id);

-- User roles
CREATE INDEX IF NOT EXISTS idx_user_roles_school ON public.user_roles(school_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);

-- ID card history
CREATE INDEX IF NOT EXISTS idx_id_card_history_school ON public.id_card_history(school_id);
CREATE INDEX IF NOT EXISTS idx_id_card_history_printed_at ON public.id_card_history(printed_at);

-- Visitor passes
CREATE INDEX IF NOT EXISTS idx_visitor_passes_school ON public.visitor_passes(school_id);
CREATE INDEX IF NOT EXISTS idx_visitor_passes_checkout ON public.visitor_passes(check_out_time);

-- Announcements
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at);

-- Homework
CREATE INDEX IF NOT EXISTS idx_homework_due_date ON public.homework(due_date);

-- Remarks
CREATE INDEX IF NOT EXISTS idx_remarks_school ON public.remarks(school_id);
CREATE INDEX IF NOT EXISTS idx_remarks_created_at ON public.remarks(created_at);

-- ==========================================================
-- 2. SECURITY: Allow super_admin to read ALL schools
--    (needed for super-admin analytics page)
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools;
CREATE POLICY "Super admin reads all schools" ON public.schools
  FOR SELECT TO authenticated
  USING (
    -- Super admins have no school_id but need to see all schools
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 3. SECURITY: Super admin can update/delete any school
-- ==========================================================
DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools;
CREATE POLICY "Super admin manages all schools" ON public.schools
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 4. SECURITY: Prevent teachers from deleting students
--    (Only admins should be allowed to delete)
--    The latest policy already handles this in 20260610120000
--    but we add an explicit teacher restriction guard.
-- ==========================================================
-- (Already handled by "Only admins delete students" policy in production_readiness_upgrades migration)

-- ==========================================================
-- 5. DATA INTEGRITY: Ensure teacher_attendance has proper grants
-- ==========================================================
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teacher_attendance TO authenticated;
GRANT ALL ON public.teacher_attendance TO service_role;

-- ==========================================================
-- 6. CLEANUP: Remove duplicate/conflicting policies that may
--    cause performance issues on hot tables
-- ==========================================================
-- Consolidate students SELECT: the "Staff view all students in school"
-- policy from production_readiness_upgrades already supersedes the
-- original "Staff manage students" catch-all. Ensure no overlap.
DROP POLICY IF EXISTS "Staff manage students" ON public.students;

-- ==========================================================
-- 7. FIX: Ensure profiles can be read by super_admin
--    (needed for staff management in super-admin school view)
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all profiles" ON public.profiles;
CREATE POLICY "Super admin reads all profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
        AND role = 'super_admin'::text::public.app_role
    )
  );

-- ==========================================================
-- 8. FIX: Super admin can read all user_roles
-- ==========================================================
DROP POLICY IF EXISTS "Super admin reads all roles" ON public.user_roles;
CREATE POLICY "Super admin reads all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur2
      WHERE ur2.user_id = auth.uid()
        AND ur2.role = 'super_admin'::text::public.app_role
    )
  );
-- SQL Migration: Storage hardening and multi-tenant RLS policies
-- Covers: school-logos, student-photos, report-cards, signatures, visitor-photos

-- 1. Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('school-logos', 'school-logos', true),
  ('student-photos', 'student-photos', true),
  ('report-cards', 'report-cards', false),
  ('signatures', 'signatures', false),
  ('visitor-photos', 'visitor-photos', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Drop existing conflicting storage policies
DROP POLICY IF EXISTS "Student photos publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update student photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete student photos" ON storage.objects;

DROP POLICY IF EXISTS "School logos publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload school logos" ON storage.objects;
DROP POLICY IF EXISTS "Staff update school logos" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete school logos" ON storage.objects;

DROP POLICY IF EXISTS "Signatures readable by school" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload signatures" ON storage.objects;
DROP POLICY IF EXISTS "Staff update signatures" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete signatures" ON storage.objects;

DROP POLICY IF EXISTS "Visitor photos readable by school" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload visitor photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff update visitor photos" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete visitor photos" ON storage.objects;

DROP POLICY IF EXISTS "Report cards readable by school" ON storage.objects;
DROP POLICY IF EXISTS "Staff manage report cards" ON storage.objects;

-- 3. Configure hardened RLS policies for each bucket

-- BUCKET: school-logos (Public = true)
CREATE POLICY "School logos publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'school-logos');

CREATE POLICY "Staff upload school logos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'school-logos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff update school logos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'school-logos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'school-logos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff delete school logos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'school-logos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );


-- BUCKET: student-photos (Public = true)
CREATE POLICY "Student photos publicly readable" ON storage.objects
  FOR SELECT USING (bucket_id = 'student-photos');

CREATE POLICY "Staff upload student photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'student-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff update student photos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'student-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'student-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff delete student photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'student-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );


-- BUCKET: signatures (Public = false)
CREATE POLICY "Signatures readable by school" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'signatures'
    AND (
      split_part(name, '/', 1) = public.current_school_id()::text
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
    )
  );

CREATE POLICY "Staff upload signatures" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'signatures' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff update signatures" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'signatures' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'signatures' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff delete signatures" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'signatures' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );


-- BUCKET: visitor-photos (Public = false)
CREATE POLICY "Visitor photos readable by school" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'visitor-photos'
    AND (
      split_part(name, '/', 1) = public.current_school_id()::text
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
    )
  );

CREATE POLICY "Staff upload visitor photos" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'visitor-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff update visitor photos" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'visitor-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'visitor-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

CREATE POLICY "Staff delete visitor photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'visitor-photos' 
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );


-- BUCKET: report-cards (Public = false)
CREATE POLICY "Report cards readable by school" ON storage.objects
  FOR SELECT TO authenticated USING (
    bucket_id = 'report-cards'
    AND (
      split_part(name, '/', 1) = public.current_school_id()::text
      OR EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
    )
  );

CREATE POLICY "Staff manage report cards" ON storage.objects
  FOR ALL TO authenticated USING (
    bucket_id = 'report-cards'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'report-cards'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

-- 4. Harden existing bucket homework-files (public = true)
DROP POLICY IF EXISTS "Authenticated can upload homework files" ON storage.objects;
DROP POLICY IF EXISTS "Staff upload homework files" ON storage.objects;
CREATE POLICY "Staff upload homework files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (
    bucket_id = 'homework-files'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

DROP POLICY IF EXISTS "Owners can update homework files" ON storage.objects;
DROP POLICY IF EXISTS "Staff update homework files" ON storage.objects;
CREATE POLICY "Staff update homework files" ON storage.objects
  FOR UPDATE TO authenticated USING (
    bucket_id = 'homework-files'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  ) WITH CHECK (
    bucket_id = 'homework-files'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );

DROP POLICY IF EXISTS "Owners can delete homework files" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete homework files" ON storage.objects;
CREATE POLICY "Staff delete homework files" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'homework-files'
    AND public.is_staff(auth.uid())
    AND split_part(name, '/', 1) = public.current_school_id()::text
  );
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

-- Seed mock teacher users in auth.users
INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'ramesh@hezo.com', '{"full_name": "Ramesh Mathematics"}'::jsonb),
  ('22222222-2222-2222-2222-222222222222', 'suresh@hezo.com', '{"full_name": "Suresh Science"}'::jsonb),
  ('33333333-3333-3333-3333-333333333333', 'lakshmi@hezo.com', '{"full_name": "Lakshmi English"}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed profiles
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Ramesh' WHERE user_id = '11111111-1111-1111-1111-111111111111';
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Suresh' WHERE user_id = '22222222-2222-2222-2222-222222222222';
UPDATE public.profiles SET school_id = 'af1daae9-aa47-4647-9911-4fea8a2b3301', full_name = 'Lakshmi' WHERE user_id = '33333333-3333-3333-3333-333333333333';

-- Seed roles
INSERT INTO public.user_roles (user_id, school_id, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher'),
  ('22222222-2222-2222-2222-222222222222', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher'),
  ('33333333-3333-3333-3333-333333333333', 'af1daae9-aa47-4647-9911-4fea8a2b3301', 'teacher')
ON CONFLICT DO NOTHING;

-- Allocate dynamic mock data
DO $$
DECLARE
  v_school_id UUID := 'af1daae9-aa47-4647-9911-4fea8a2b3301';
  v_class_id UUID;
  v_math_id UUID;
  v_sci_id UUID;
  v_eng_id UUID;
BEGIN
  SELECT id INTO v_class_id FROM public.classes WHERE school_id = v_school_id AND name = '1' AND section = 'a' LIMIT 1;
  IF v_class_id IS NULL THEN
    SELECT id INTO v_class_id FROM public.classes WHERE school_id = v_school_id LIMIT 1;
  END IF;

  SELECT id INTO v_math_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%Math%' LIMIT 1;
  SELECT id INTO v_sci_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%Science%' LIMIT 1;
  SELECT id INTO v_eng_id FROM public.subjects WHERE school_id = v_school_id AND name ILIKE '%English%' LIMIT 1;

  IF v_class_id IS NOT NULL THEN
    -- Suresh as Class Teacher for Class 1A
    UPDATE public.classes SET class_teacher_id = '22222222-2222-2222-2222-222222222222' WHERE id = v_class_id;

    IF v_math_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '11111111-1111-1111-1111-111111111111', v_math_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;

    IF v_sci_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '22222222-2222-2222-2222-222222222222', v_sci_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;

    IF v_eng_id IS NOT NULL THEN
      INSERT INTO public.subject_allocations (school_id, teacher_id, subject_id, class_id)
      VALUES (v_school_id, '33333333-3333-3333-3333-333333333333', v_eng_id, v_class_id)
      ON CONFLICT (class_id, subject_id) DO UPDATE SET teacher_id = EXCLUDED.teacher_id;
    END IF;
  END IF;
END $$;

-- Grant privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.subject_allocations TO authenticated;
GRANT ALL ON public.subject_allocations TO service_role;
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
