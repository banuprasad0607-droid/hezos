
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
