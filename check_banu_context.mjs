import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
      SELECT profiles.school_id, user_roles.role, schools.name as school_name
      FROM profiles
      LEFT JOIN user_roles ON user_roles.user_id = profiles.user_id
      LEFT JOIN schools ON schools.id = profiles.school_id
      WHERE profiles.email = 'banu@hezoscl.com';
  `;
  const res = await client.query(sql);
  console.log("Banu context:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
