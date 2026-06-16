import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const superAdmin = users.users.find(u => u.email === 'niroshareddy1997@gmail.com');
  if (superAdmin) {
    const { data: prof } = await supabase.from('profiles').select('*').eq('user_id', superAdmin.id).single();
    console.log("Super admin profile:", prof);
  }
}
check();
