import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
      SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname = 'service_role';
  `;
  const res = await client.query(sql);
  console.log("Roles:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
