import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const { data: classes } = await supabase.from('classes').select('*');
  console.log("Classes:", classes);
}

check();
