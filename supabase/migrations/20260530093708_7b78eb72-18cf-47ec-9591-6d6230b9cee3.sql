-- Allow owners to view all schools they own (for multi-school admin)
CREATE POLICY "Owners can view their schools"
ON public.schools
FOR SELECT
TO authenticated
USING (owner_id = auth.uid());