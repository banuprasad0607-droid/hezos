import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT prosrc 
    FROM pg_proc 
    WHERE proname = 'current_school_id';
  `;
  const res = await client.query(sql);
  console.log("current_school_id:", res.rows[0]?.prosrc);
  await client.end();
}
run();
