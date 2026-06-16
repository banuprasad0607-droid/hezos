import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const superAdmin = users.users.find(u => u.email === 'niroshareddy1997@gmail.com');
  if (superAdmin) {
    const { error } = await supabase.from('profiles').upsert({
      user_id: superAdmin.id,
      full_name: 'Nirosha Reddy',
      email: 'niroshareddy1997@gmail.com',
      school_id: null
    }, { onConflict: 'user_id' });
    console.log("Upserted profile:", error || "Success");
  }
}
run();
