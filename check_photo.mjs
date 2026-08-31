import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();

const sb = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
sb.from('students').select('full_name, photo_url').ilike('full_name', '%banu%').then(res => console.log(res.data)).catch(console.error);
