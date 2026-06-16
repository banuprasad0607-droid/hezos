import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function test() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'banup@school.com',
    password: 'banup@123'
  });
  if (error) {
    console.error("Login error:", error);
    return;
  }
  
  const { error: insertErr } = await supabase.from('classes').insert({
    school_id: '1ff48b51-b7e2-41d6-b141-3160c96f0609',
    name: 'Class 1-A'
  });
  
  console.log("Insert error:", insertErr || "Success!");
}

test();
