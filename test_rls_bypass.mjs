import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    storage: undefined,
    persistSession: false,
    autoRefreshToken: false,
  },
});

async function run() {
  console.log("Testing insert with service role key...");

  // Try to insert a dummy student with a random school_id and class_id
  const { data, error } = await supabaseAdmin
    .from("students")
    .insert({
      school_id: "00000000-0000-0000-0000-000000000000",
      class_id: "00000000-0000-0000-0000-000000000000",
      full_name: "Test Student",
    })
    .select();

  console.log("Error:", error);
}

run();
