import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// Load .env manually
const envPath = path.resolve(".env");
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

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const timestamp = Date.now();
  const email = `qa_admin_${timestamp}@gmail.com`;
  const password = `Pass_${timestamp}!`;
  const fullName = `QA Test Admin ${timestamp}`;
  const schoolName = `QA School ${timestamp}`;
  const schoolCode = `QA-${timestamp.toString().slice(-4)}`;

  console.log("Creating QA School Admin...");
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);

  try {
    // 1. Create auth user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (userError) {
      throw new Error(`Failed to create auth user: ${userError.message}`);
    }

    const userId = userData.user.id;
    console.log(`Created auth user with ID: ${userId}`);

    // 2. Create school (omitting generated columns: school_name, school_code, and admin_id)
    const schoolId = crypto.randomUUID();
    const { data: schoolData, error: schoolError } = await supabase
      .from("schools")
      .insert({
        id: schoolId,
        name: schoolName,
        code: schoolCode,
        status: "active",
        plan: "starter",
        owner_id: userId,
        email: email,
      })
      .select();

    if (schoolError) {
      throw new Error(`Failed to create school: ${schoolError.message}`);
    }

    console.log(`Created school "${schoolName}" with ID: ${schoolId}`);

    // 3. Upsert Profile
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (existingProfile) {
      console.log("Profile already exists (via trigger), updating school_id...");
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          school_id: schoolId,
          full_name: fullName,
          designation: "School Admin",
        })
        .eq("user_id", userId);

      if (profileUpdateError) {
        throw new Error(`Failed to update profile: ${profileUpdateError.message}`);
      }
    } else {
      console.log("Profile does not exist, inserting profile...");
      const { error: profileInsertError } = await supabase.from("profiles").insert({
        user_id: userId,
        school_id: schoolId,
        full_name: fullName,
        email: email,
        designation: "School Admin",
      });

      if (profileInsertError) {
        throw new Error(`Failed to insert profile: ${profileInsertError.message}`);
      }
    }

    // 4. Assign Admin Role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userId,
      school_id: schoolId,
      role: "admin",
    });

    if (roleError) {
      throw new Error(`Failed to assign role: ${roleError.message}`);
    }

    console.log('Successfully configured role "admin"!');
    console.log("\n--- CREATED CREDENTIALS ---");
    console.log(JSON.stringify({ email, password, schoolId, userId, schoolName }, null, 2));
    console.log("---------------------------\n");
  } catch (error) {
    console.error("Execution failed:", error.message);
    process.exit(1);
  }
}

run();
