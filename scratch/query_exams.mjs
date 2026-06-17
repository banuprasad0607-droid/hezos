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
    const exams = await client.query("SELECT * FROM public.exams LIMIT 10;");
    console.log("EXAMS:", exams.rows);
    const marks = await client.query("SELECT * FROM public.exam_marks LIMIT 5;");
    console.log("MARKS:", marks.rows);
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
