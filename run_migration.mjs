import pg from "pg";
import fs from "fs/promises";
import path from "path";

const { Client } = pg;

async function run() {
  const client = new Client({
    host: "aws-0-ap-south-1.pooler.supabase.com", // Sometimes pooler is needed, but we can try db.crypicuosxqquudpgosi.supabase.co
    port: 5432, // session mode port for db, 6543 for pooler
    database: "postgres",
    user: "postgres",
    password: "bANU@NIRO3009",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected using pooler hostname.");
  } catch (e) {
    console.log("Pooler hostname failed, trying direct db hostname...");
    try {
      const client2 = new Client({
        host: "db.crypicuosxqquudpgosi.supabase.co",
        port: 5432,
        database: "postgres",
        user: "postgres",
        password: "bANU@NIRO3009",
        ssl: { rejectUnauthorized: false },
      });
      await client2.connect();
      console.log("Connected using direct db hostname.");
      return await executeMigration(client2);
    } catch (e2) {
      console.error("Connection failed:", e2);
      process.exit(1);
    }
  }

  await executeMigration(client);
}

async function executeMigration(client) {
  try {
    const migrationPath = path.join(
      process.cwd(),
      "supabase",
      "migrations",
      "20260602094800_billing_updates.sql",
    );
    const sql = await fs.readFile(migrationPath, "utf8");

    console.log("Executing migration...");
    await client.query(sql);
    console.log("Migration executed successfully!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

run();
