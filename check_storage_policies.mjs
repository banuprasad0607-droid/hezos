import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
    SELECT policyname, cmd, qual, with_check 
    FROM pg_policies 
    WHERE schemaname = 'storage' AND tablename = 'objects';
  `;
  const res = await client.query(sql);
  console.log("Policies on storage.objects:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
