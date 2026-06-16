import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function clean() {
  const { data, error } = await supabase.from('user_roles')
    .delete()
    .eq('id', 'bc8eb1e2-8e9c-4f1b-94ef-c0e7a26ee013');
  console.log("Deleted duplicate row:", error || "Success");
}

clean();
