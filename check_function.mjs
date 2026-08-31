import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT prosrc 
    FROM pg_proc 
    WHERE proname = 'check_school_student_limit';
  `;
  const res = await client.query(sql);
  console.log("Function definition:", res.rows[0]?.prosrc);
  await client.end();
}
run();
