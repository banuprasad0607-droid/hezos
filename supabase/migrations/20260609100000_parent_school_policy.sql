-- Add RLS policy to allow parents to read school details for their children's schools
CREATE POLICY "Parents can view their children's schools" ON public.schools FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.students s
    WHERE s.school_id = public.schools.id AND s.parent_user_id = auth.uid()
  )
);
