import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function clean() {
  console.log("Cleaning up Gopal School test data...");

  // 1. Find and delete auth users
  const { data: usersData } = await supabase.auth.admin.listUsers();
  const emailsToDelete = ["admin@gopal.com", "teacher@gopal.com"];
  const usersToDelete = usersData.users.filter((u) => emailsToDelete.includes(u.email));

  for (const user of usersToDelete) {
    console.log(`Deleting auth user: ${user.email} (${user.id})`);
    await supabase.auth.admin.deleteUser(user.id);
  }

  // 2. Find and delete schools
  const { data: schools } = await supabase.from("schools").select("id").ilike("name", "%Gopal%");
  if (schools && schools.length > 0) {
    const schoolIds = schools.map((s) => s.id);
    console.log(`Deleting schools: ${schoolIds.join(", ")}`);

    // Cascading deletes on public tables (profiles, students, classes, user_roles, etc.)
    // Supposing there are foreign key cascades or delete policies. Let's do it explicitly if needed:
    await supabase.from("user_roles").delete().in("school_id", schoolIds);
    await supabase.from("profiles").delete().in("school_id", schoolIds);
    await supabase.from("students").delete().in("school_id", schoolIds);
    await supabase.from("classes").delete().in("school_id", schoolIds);
    await supabase.from("schools").delete().in("id", schoolIds);
  }

  console.log("Cleanup finished.");
}

clean();
