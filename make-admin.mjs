import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const email = 'niroshareddy1997@gmail.com';
  console.log(`Looking for user with email: ${email}`);

  // Fetch user by email
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    console.error('Error fetching users:', listError);
    return;
  }

  const user = users.users.find(u => u.email === email);
  if (!user) {
    console.log(`User ${email} not found. Creating user...`);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: 'Password123!',
      email_confirm: true,
      user_metadata: { full_name: 'Nirosha Reddy' }
    });
    
    if (createError) {
      console.error('Failed to create user:', createError);
      return;
    }
    
    console.log(`Created user with ID: ${newUser.user.id}`);
    await assignRole(newUser.user.id);
  } else {
    console.log(`Found user with ID: ${user.id}`);
    await assignRole(user.id);
  }
}

async function assignRole(userId) {
  // Check if role exists
  const { data: existingRoles, error: roleError } = await supabase
    .from('user_roles')
    .select('*')
    .eq('user_id', userId)
    .eq('role', 'super_admin');

  if (roleError) {
    console.error('Error checking roles:', roleError);
    return;
  }

  if (existingRoles.length > 0) {
    console.log('User is already a super_admin!');
    return;
  }

  console.log('Assigning super_admin role...');
  const { error: insertError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role: 'super_admin'
    });

  if (insertError) {
    console.error('Failed to insert super_admin role:', insertError);
  } else {
    console.log('Successfully made user a super_admin!');
  }
}

run();
