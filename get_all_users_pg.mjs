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

    console.log("=== SCHOOLS ===");
    const schoolsRes = await client.query(
      "SELECT id, name, school_name, school_code FROM public.schools",
    );
    console.table(schoolsRes.rows);

    console.log("\n=== USERS (PROFILES + ROLES) ===");
    const usersRes = await client.query(`
      SELECT p.user_id, p.full_name, p.email, p.school_id, r.role
      FROM public.profiles p
      LEFT JOIN public.user_roles r ON p.user_id = r.user_id AND (p.school_id = r.school_id OR r.school_id IS NULL)
    `);
    console.table(usersRes.rows);

    console.log("\n=== SCHOOL CREDENTIALS ===");
    const credsRes = await client.query("SELECT * FROM public.school_credentials");
    console.table(credsRes.rows);
  } catch (err) {
    console.error("Error running script:", err);
  } finally {
    await client.end();
  }
}

run();
