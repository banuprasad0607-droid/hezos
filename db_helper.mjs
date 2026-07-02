import pg from "pg";
import fs from "fs";
import path from "path";

export function getDbClient() {
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

  const projectId = env.VITE_SUPABASE_PROJECT_ID || env.SUPABASE_PROJECT_ID;
  const password = env.SUPABASE_DB_PASSWORD;

  if (!projectId) {
    throw new Error("Missing VITE_SUPABASE_PROJECT_ID in .env file.");
  }
  if (!password || password.startsWith("[YOUR_DATABASE")) {
    throw new Error(
      "Missing or placeholder SUPABASE_DB_PASSWORD in .env file. Please set your actual database password.",
    );
  }

  const { Client } = pg;
  return new Client({
    host: `db.${projectId}.supabase.co`,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: password,
    ssl: { rejectUnauthorized: false },
  });
}
