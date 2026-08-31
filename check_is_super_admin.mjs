import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT proname, prosrc 
    FROM pg_proc 
    WHERE proname = 'is_super_admin';
  `;
  const res = await client.query(sql);
  console.log("Functions:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
