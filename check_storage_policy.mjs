import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname LIKE '%Staff upload student photos%';
  `;
  const res = await client.query(sql);
  console.log("Policies:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
