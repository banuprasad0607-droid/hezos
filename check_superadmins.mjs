import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();
  const sql = `
      SELECT profiles.email, profiles.school_id, user_roles.role
      FROM user_roles
      JOIN profiles ON profiles.user_id = user_roles.user_id
      WHERE user_roles.role = 'super_admin';
  `;
  const res = await client.query(sql);
  console.log("Super admins:", JSON.stringify(res.rows, null, 2));
  await client.end();
}
run();
