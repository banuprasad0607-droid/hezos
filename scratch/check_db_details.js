import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const userId = "a542ee13-c5d5-4f22-b02f-a7833c91ae24";

  console.log("Querying profile for userId:", userId);
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId);

  console.log("Profile:", profile, "Error:", pErr);

  console.log("Querying user_roles for userId:", userId);
  const { data: roles, error: rErr } = await supabase
    .from("user_roles")
    .select("*")
    .eq("user_id", userId);

  console.log("Roles:", roles, "Error:", rErr);

  console.log("Querying schools for userId:", userId);
  const { data: schools, error: sErr } = await supabase
    .from("schools")
    .select("*")
    .eq("owner_id", userId);

  console.log("Schools:", schools, "Error:", sErr);
}

run();
