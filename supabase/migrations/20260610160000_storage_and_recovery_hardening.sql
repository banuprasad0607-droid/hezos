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
