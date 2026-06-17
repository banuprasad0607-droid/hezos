import pg from "pg";
import fs from "fs";

const { Client } = pg;

const client = new Client({
  host: "db.crypicuosxqquudpgosi.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "bANU@NIRO3009",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error("Please specify a SQL file path.");
    process.exit(1);
  }

  try {
    await client.connect();
    console.log("Connected to PostgreSQL.");

    const sql = fs.readFileSync(sqlFile, "utf8");

    console.log(`Executing SQL from ${sqlFile}...`);
    await client.query("BEGIN;");
    await client.query(sql);
    await client.query("COMMIT;");
    console.log("✅ SQL migration completed successfully.");
  } catch (err) {
    console.error("❌ SQL migration failed:", err);
    try {
      await client.query("ROLLBACK;");
    } catch (e) {}
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
