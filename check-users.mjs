import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: ue } = await supabase.auth.admin.listUsers();
  console.log("Users:");
  users?.users.forEach((u) => console.log(u.email));

  const { data: creds } = await supabase.from("school_credentials").select("*");
  console.log("\nCredentials stored:");
  console.log(creds);
}

check();
