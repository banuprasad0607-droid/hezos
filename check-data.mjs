import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'db.crypicuosxqquudpgosi.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'bANU@NIRO3009',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to database.");

    const schoolsRes = await client.query("SELECT id, name, school_name FROM public.schools;");
    console.log("\n--- SCHOOLS ---");
    console.dir(schoolsRes.rows);

    const studentsRes = await client.query("SELECT id, school_id, full_name, admission_number, roll_number FROM public.students LIMIT 20;");
    console.log("\n--- STUDENTS ---");
    console.dir(studentsRes.rows);

  } catch (err) {
    console.error("Error running query:", err);
  } finally {
    await client.end();
  }
}

run();
