
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
