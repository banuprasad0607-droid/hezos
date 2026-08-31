import { getDbClient } from "./db_helper.mjs";
import fs from "fs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = fs.readFileSync("check_functions.sql", "utf8");
  const res = await client.query(sql);
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
