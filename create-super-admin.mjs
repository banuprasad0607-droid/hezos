import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Load environment variables from .env
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.trim().match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
      process.env[match[1]] = val;
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4] || "Platform Super Admin";

  if (!email || !password) {
    console.log(`
Usage: node create-super-admin.mjs <email> <password> [fullName]

Example:
  node create-super-admin.mjs admin@mycompany.com Password123! "Super Admin"
    `);
    process.exit(1);
  }

  console.log(`🚀 Provisioning Super Admin Account for: ${email}`);

  // 1. Check if user already exists
  const { data: listData } = await supabase.auth.admin.listUsers();
  let user = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.log("  Creating new Auth user...");
    const { data: created, error: createErr } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (createErr) {
      console.error("❌ Failed to create user:", createErr.message);
      process.exit(1);
    }
    user = created.user;
    console.log(`  ✅ Auth user created (ID: ${user.id})`);
  } else {
    console.log(`  ℹ️ Found existing Auth user (ID: ${user.id}). Updating password...`);
    await supabase.auth.admin.updateUserById(user.id, { password });
  }

  // 2. Ensure profile entry exists
  await supabase.from("profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName,
      email: email,
    },
    { onConflict: "user_id" }
  );

  // 3. Grant super_admin role in user_roles
  const { error: roleErr } = await supabase.from("user_roles").upsert(
    {
      user_id: user.id,
      school_id: null,
      role: "super_admin",
    },
    { onConflict: "user_id,school_id,role" }
  );

  if (roleErr) {
    console.error("❌ Failed to assign super_admin role:", roleErr.message);
    process.exit(1);
  }

  console.log(`
✨ SUCCESS! Super Admin Account Provisioned:
   • Email: ${email}
   • Password: ${password}
   • Role: super_admin (Global Platform Access)

You can now log in at /login with these credentials!
  `);
}

main().catch(console.error);
