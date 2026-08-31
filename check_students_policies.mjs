import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE tablename = 'students';
  `;
  const res = await client.query(sql);
  console.log("Policies on students:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
