import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
      SELECT event_object_table as table_name, trigger_name, action_statement
      FROM information_schema.triggers
      WHERE event_object_schema = 'public' 
      AND event_object_table IN ('profiles', 'user_roles', 'students');
  `;
  const res = await client.query(sql);
  console.log("Triggers:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
