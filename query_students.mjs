import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const res = await client.query("SELECT full_name, photo_url FROM students WHERE full_name ILIKE '%banu%'");
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
