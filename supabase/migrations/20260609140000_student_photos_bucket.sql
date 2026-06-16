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
