import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT trigger_name, action_statement 
    FROM information_schema.triggers 
    WHERE event_object_table = 'students';
  `;
  const res = await client.query(sql);
  console.log("Triggers on students:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
