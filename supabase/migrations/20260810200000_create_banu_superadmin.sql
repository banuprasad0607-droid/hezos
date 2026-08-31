-- Create Super Admin account for banu@hezoscl.com
DO $$
DECLARE
  v_user_id uuid;
  target_user_id uuid;
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE lower(email) = 'banu@hezoscl.com';

  IF target_user_id IS NULL THEN
    target_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      role,
      aud
    ) VALUES (
      target_user_id,
      '00000000-0000-0000-0000-000000000000',
      'banu@hezoscl.com',
      crypt('Password123!', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Banu Super Admin"}'::jsonb,
      now(),
      now(),
      'authenticated',
      'authenticated'
    );
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('Password123!', gen_salt('bf')),
        updated_at = now()
    WHERE id = target_user_id;
  END IF;

  -- Ensure profile exists
  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (target_user_id, 'Banu Super Admin', 'banu@hezoscl.com')
  ON CONFLICT (user_id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

  -- Assign super_admin role
  INSERT INTO public.user_roles (user_id, school_id, role)
  VALUES (target_user_id, NULL, 'super_admin')
  ON CONFLICT (user_id, school_id, role) DO NOTHING;

END $$;
