SELECT id, email, raw_user_meta_data->>'full_name' as name FROM auth.users LIMIT 5;
