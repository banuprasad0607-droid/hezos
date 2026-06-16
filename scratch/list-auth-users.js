import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Parse .env file
const envText = fs.readFileSync('.env', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    env[match[1]] = val;
  }
});

const supabase = createClient(
  env.SUPABASE_URL || env.VITE_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const { data: rolesData } = await supabase.from('user_roles').select('*');
  const { data: profilesData } = await supabase.from('profiles').select('*');
  const { data: credsData } = await supabase.from('school_credentials').select('*');

  console.log("--- AUTH USERS ---");
  for (const u of (usersData?.users || [])) {
    const roles = (rolesData || []).filter(r => r.user_id === u.id).map(r => r.role);
    const profile = (profilesData || []).find(p => p.user_id === u.id);
    const creds = (credsData || []).find(c => c.school_id === profile?.school_id);
    console.log(`Email: ${u.email} | ID: ${u.id} | Roles: ${roles.join(', ')} | Name: ${profile?.full_name || 'N/A'} | School ID: ${profile?.school_id || 'N/A'}`);
  }
  console.log("--- SCHOOL CREDENTIALS ---");
  console.log(credsData);
}

run().catch(console.error);
