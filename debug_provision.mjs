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
  console.log("Fetching a valid school and class...");

  const { data: schools } = await supabaseAdmin.from("schools").select("id").limit(1);
  const schoolId = schools?.[0]?.id;

  if (!schoolId) return console.log("No school found");

  const { data: classes } = await supabaseAdmin
    .from("classes")
    .select("id")
    .eq("school_id", schoolId)
    .limit(1);
  const classId = classes?.[0]?.id;

  if (!classId) return console.log("No class found");

  console.log("Creating parent user...");
  let parentUserId;
  const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email: "debug_parent@hezoscl.com",
    password: "password123!",
    email_confirm: true,
    user_metadata: { full_name: "Debug Parent" },
  });

  if (createErr && !/already.*registered|exists/i.test(createErr.message)) {
    return console.log("Create user err:", createErr);
  }
  parentUserId = created?.user?.id;

  if (!parentUserId) {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    parentUserId = list?.users.find((u) => u.email === "debug_parent@hezoscl.com")?.id;
  }

  if (parentUserId) {
    console.log("Upserting profile...");
    const { error: profErr } = await supabaseAdmin.from("profiles").upsert(
      {
        user_id: parentUserId,
        full_name: "Debug Parent",
        email: "debug_parent@hezoscl.com",
        school_id: schoolId,
      },
      { onConflict: "user_id" },
    );
    if (profErr) console.log("Profile upsert err:", profErr);

    console.log("Upserting user_roles...");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: parentUserId, school_id: schoolId, role: "parent" },
        { onConflict: "user_id,school_id,role" },
      );
    if (roleErr) console.log("User roles upsert err:", roleErr);
  }

  console.log("Inserting student...");
  const { data: studentRow, error: insertErr } = await supabaseAdmin
    .from("students")
    .insert({
      school_id: schoolId,
      class_id: classId,
      full_name: "Test Student 123",
      parent_user_id: parentUserId,
    })
    .select("id")
    .single();

  console.log("Student insert err:", insertErr);

  if (studentRow) {
    await supabaseAdmin.from("students").delete().eq("id", studentRow.id);
  }
  if (parentUserId) {
    await supabaseAdmin.auth.admin.deleteUser(parentUserId);
  }
}

run();
