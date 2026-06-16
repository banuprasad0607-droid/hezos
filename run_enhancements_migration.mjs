import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';

const { Client } = pg;

const connectionConfig = {
  host: 'db.crypicuosxqquudpgosi.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'bANU@NIRO3009',
  ssl: { rejectUnauthorized: false }
};

async function run() {
  const client = new Client(connectionConfig);
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database.");

    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20260609120000_achievements_enhancements.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    console.log("Applying SQL enhancements...");
    await client.query(sql);
    console.log("Enhancements schema applied successfully.");

  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

run();
