
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
