import pg from "pg";

const { Client } = pg;

async function run() {
  const client = new Client({
    host: "db.crypicuosxqquudpgosi.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "bANU@NIRO3009",
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Connected to database.");

    const sql = `
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND (role::text = 'admin' OR role::text = 'teacher' OR role::text = 'super_admin')
  );
$$;
    `;
    await client.query(sql);
    console.log("Successfully updated is_staff function to include super_admin!");
  } catch (err) {
    console.error("Failed to update database:", err);
  } finally {
    await client.end();
  }
}

run();
