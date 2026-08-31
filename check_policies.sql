SELECT policyname, tablename, qual, with_check FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('user_roles', 'schools', 'profiles');
