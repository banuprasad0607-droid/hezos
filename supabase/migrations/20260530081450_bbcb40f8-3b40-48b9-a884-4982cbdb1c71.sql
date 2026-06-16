
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
