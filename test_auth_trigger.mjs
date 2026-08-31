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
  console.log("Testing auth user creation...");

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: "test_parent@hezocl.com",
    password: "password123!",
    email_confirm: true,
    user_metadata: { full_name: "Test Parent" },
  });

  console.log("Error:", error);
  if (data?.user?.id) {
    console.log("Created user:", data.user.id);
    // Clean up
    await supabaseAdmin.auth.admin.deleteUser(data.user.id);
  }
}

run();
