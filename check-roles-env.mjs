import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users, error: ue } = await supabase.auth.admin.listUsers();
  console.log(
    "Users:",
    users?.users.map((u) => ({ email: u.email, id: u.id })),
  );

  const { data: profiles, error: pe } = await supabase.from("profiles").select("*");
  console.log("Profiles:", profiles);
}

check();
