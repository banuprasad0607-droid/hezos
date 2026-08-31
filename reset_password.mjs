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
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      env[match[1]] = val;
    }
  });
}

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function resetPassword() {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    "16fec722-1463-4913-8f38-ff6f5bb98f3c", // superadmin@hezoscl.com
    { password: "Password123!" },
  );
  if (error) {
    console.error("Error updating user:", error);
  } else {
    console.log("Successfully updated password for:", data.user.email);
  }
}

resetPassword();
