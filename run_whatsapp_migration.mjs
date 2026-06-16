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
    console.log("Connected to Supabase Database.");

    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20260615220000_whatsapp_business_module.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    console.log("Executing SQL migration...");
    await client.query(sql);
    console.log("WhatsApp module migration tables, columns, indexes and RLS policies applied successfully!");

  } catch (err) {
    console.error("WhatsApp migration failed:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

run();
