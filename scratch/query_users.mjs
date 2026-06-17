import pg from "pg";

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
  try {
    await client.connect();
    console.log("Connected.");
    const students = await client.query("SELECT id, full_name, class_id FROM public.students;");
    console.log("STUDENTS:", students.rows);
    const classes = await client.query("SELECT id, name FROM public.classes;");
    console.log("CLASSES:", classes.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
