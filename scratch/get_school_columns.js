import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data, error } = await supabase.from('schools').select('*').limit(1);
  if (error) {
    console.error('Error fetching school:', error);
  } else {
    console.log('School sample row:', data[0]);
  }
}

run();
