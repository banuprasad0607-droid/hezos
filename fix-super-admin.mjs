import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: list } = await supabase.auth.admin.listUsers();
  const superAdmin = list.users.find(u => u.email === 'niroshareddy1997@gmail.com');
  
  if (!superAdmin) {
    console.log("Super admin user not found. Re-creating...");
    const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
      email: 'niroshareddy1997@gmail.com',
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'Super Admin' }
    });
    if (createErr) console.error("Create err:", createErr);
    else {
      console.log("Created user:", newUser.user.id);
      await supabase.from('user_roles').insert({ user_id: newUser.user.id, role: 'super_admin' });
      console.log("Granted role.");
    }
    return;
  }
  
  console.log("Found super admin:", superAdmin.id);
  const { error: updErr } = await supabase.auth.admin.updateUserById(superAdmin.id, {
    password: 'Password123!'
  });
  console.log("Forced password to Password123! :", updErr || "Success");

  const { data: roles } = await supabase.from('user_roles').select('*').eq('user_id', superAdmin.id);
  console.log("Roles for super admin:", roles);
  
  if (!roles.some(r => r.role === 'super_admin')) {
    await supabase.from('user_roles').insert({ user_id: superAdmin.id, role: 'super_admin' });
    console.log("Restored super admin role.");
  }
}

check();
