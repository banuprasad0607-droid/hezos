import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function check() {
  const { data: users } = await supabase.auth.admin.listUsers();
  const banup = users.users.find((u) => u.email === "banup@school.com");
  if (banup) {
    const { data: roles } = await supabase.from("user_roles").select("*").eq("user_id", banup.id);
    console.log("Roles for banup:", roles);
    const { data: prof } = await supabase.from("profiles").select("*").eq("user_id", banup.id);
    console.log("Profile for banup:", prof);
  }
}

check();
