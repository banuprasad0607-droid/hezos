import { getDbClient } from "./db_helper.mjs";
import fs from "fs";

let client;
try {
  client = getDbClient();
} catch (e) {
  console.error("❌ Database initialization failed:", e.message);
  process.exit(1);
}

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
