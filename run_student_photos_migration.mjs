import pg from "pg";
import fs from "fs/promises";
import path from "path";

const { Client } = pg;

const connectionConfig = {
  host: "db.crypicuosxqquudpgosi.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "bANU@NIRO3009",
  ssl: { rejectUnauthorized: false },
};

async function run() {
  const client = new Client(connectionConfig);
  try {
    await client.connect();
    console.log("Connected to Supabase Database.");

    const sqlPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260609140000_student_photos_bucket.sql",
    );
    const sql = await fs.readFile(sqlPath, "utf8");

    console.log("Executing SQL migration for student-photos bucket...");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
