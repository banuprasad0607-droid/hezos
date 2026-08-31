import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const envPath = path.resolve(process.cwd(), ".env");
const env = {};
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.trim().match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.substring(1, val.length - 1);
      env[match[1]] = val;
    }
  });
}

const SUPABASE_URL = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

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

  console.log("Inserting student...");
  const { data: studentRow, error: insertErr } = await supabaseAdmin
    .from("students")
    .insert({
      school_id: schoolId,
      class_id: classId,
      full_name: "Test Student 123",
    })
    .select("id")
    .single();

  console.log("Student insert err:", insertErr);

  if (studentRow) {
    await supabaseAdmin.from("students").delete().eq("id", studentRow.id);
  }
}

run();
