import { getDbClient } from "./db_helper.mjs";

let client = getDbClient();

async function run() {
  await client.connect();

  const policies = [
    { name: "Staff delete homework files", cmd: "DELETE", bucket: "homework-files" },
    { name: "Staff delete school logos", cmd: "DELETE", bucket: "school-logos" },
    { name: "Staff delete signatures", cmd: "DELETE", bucket: "signatures" },
    { name: "Staff delete student photos", cmd: "DELETE", bucket: "student-photos" },
    { name: "Staff delete visitor photos", cmd: "DELETE", bucket: "visitor-photos" },
    { name: "Staff manage report cards", cmd: "ALL", bucket: "report-cards" },
    { name: "Staff update homework files", cmd: "UPDATE", bucket: "homework-files" },
    { name: "Staff update school logos", cmd: "UPDATE", bucket: "school-logos" },
    { name: "Staff update signatures", cmd: "UPDATE", bucket: "signatures" },
    { name: "Staff update student photos", cmd: "UPDATE", bucket: "student-photos" },
    { name: "Staff update visitor photos", cmd: "UPDATE", bucket: "visitor-photos" },
    { name: "Staff upload homework files", cmd: "INSERT", bucket: "homework-files" },
    { name: "Staff upload school logos", cmd: "INSERT", bucket: "school-logos" },
    { name: "Staff upload signatures", cmd: "INSERT", bucket: "signatures" },
    { name: "Staff upload student photos", cmd: "INSERT", bucket: "student-photos" },
    { name: "Staff upload visitor photos", cmd: "INSERT", bucket: "visitor-photos" },
  ];

  for (const p of policies) {
    console.log(`Fixing ${p.name}...`);
    await client.query(`DROP POLICY IF EXISTS "${p.name}" ON storage.objects;`);

    let sql = `CREATE POLICY "${p.name}" ON storage.objects FOR ${p.cmd} TO public`;

    if (p.cmd === "INSERT") {
      sql += ` WITH CHECK (
        bucket_id = '${p.bucket}' AND (
          (is_staff(auth.uid()) AND split_part(name, '/', 1) = current_school_id()::text)
          OR public.is_super_admin(auth.uid())
        )
      );`;
    } else if (p.cmd === "DELETE") {
      sql += ` USING (
        bucket_id = '${p.bucket}' AND (
          (is_staff(auth.uid()) AND split_part(name, '/', 1) = current_school_id()::text)
          OR public.is_super_admin(auth.uid())
        )
      );`;
    } else {
      sql += ` USING (
        bucket_id = '${p.bucket}' AND (
          (is_staff(auth.uid()) AND split_part(name, '/', 1) = current_school_id()::text)
          OR public.is_super_admin(auth.uid())
        )
      ) WITH CHECK (
        bucket_id = '${p.bucket}' AND (
          (is_staff(auth.uid()) AND split_part(name, '/', 1) = current_school_id()::text)
          OR public.is_super_admin(auth.uid())
        )
      );`;
    }

    await client.query(sql);
  }

  console.log("Policies updated.");
  await client.end();
}
run();
