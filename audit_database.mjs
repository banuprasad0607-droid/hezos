import pg from "pg";

const { Client } = pg;

const client = new Client({
  host: "db.crypicuosxqquudpgosi.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "bANU@NIRO3009",
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");

    const report = {
      phase: "PHASE 1 - DATABASE AUDIT",
      status: "PASS",
      details: [],
    };

    // 1. Verify schools table & columns
    const schoolsColsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'schools';
    `);
    const schoolsCols = schoolsColsRes.rows.map((r) => r.column_name);
    const requiredSchoolsCols = ["id", "school_name", "school_code", "school_logo", "admin_id"];
    const missingSchoolsCols = requiredSchoolsCols.filter((c) => !schoolsCols.includes(c));

    if (missingSchoolsCols.length === 0) {
      report.details.push({
        check: "schools table columns",
        status: "PASS",
        info: "All columns present: " + requiredSchoolsCols.join(", "),
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "schools table columns",
        status: "FAIL",
        info: "Missing columns: " + missingSchoolsCols.join(", "),
      });
    }

    // 2. Verify users view/table & columns
    const usersColsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'users';
    `);
    const usersCols = usersColsRes.rows.map((r) => r.column_name);
    const requiredUsersCols = ["id", "role", "school_id"];
    const missingUsersCols = requiredUsersCols.filter((c) => !usersCols.includes(c));

    if (missingUsersCols.length === 0) {
      report.details.push({
        check: "users view/table columns",
        status: "PASS",
        info: "All columns present: " + requiredUsersCols.join(", "),
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "users view/table columns",
        status: "FAIL",
        info: "Missing columns: " + missingUsersCols.join(", "),
      });
    }

    // 3. Verify school_id exists in critical tables
    const criticalTables = [
      "students",
      "classes",
      "attendance",
      "homework",
      "remarks",
      "announcements",
      "exams",
      "mark_entries",
      "awards",
      "certificates",
      "posters",
      "visitor_passes",
      "id_card_history",
      "fee_invoices",
      "fee_payments",
      "fee_structures",
      "teacher_salaries",
      "payroll_runs",
      "payroll_items",
    ];

    for (const table of criticalTables) {
      const colCheck = await client.query(
        `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = $1 AND column_name = 'school_id';
      `,
        [table],
      );

      if (colCheck.rowCount > 0) {
        report.details.push({
          check: `school_id in ${table}`,
          status: "PASS",
          info: "school_id exists",
        });
      } else {
        report.status = "FAIL";
        report.details.push({
          check: `school_id in ${table}`,
          status: "FAIL",
          info: "school_id column is missing!",
        });
      }
    }

    // 4. Verify no orphan records (records in critical tables referencing non-existent schools)
    for (const table of criticalTables) {
      const orphans = await client.query(`
        SELECT COUNT(*) as count 
        FROM public."${table}" t
        LEFT JOIN public.schools s ON t.school_id = s.id
        WHERE s.id IS NULL AND t.school_id IS NOT NULL;
      `);
      const count = parseInt(orphans.rows[0].count, 10);
      if (count === 0) {
        report.details.push({
          check: `orphan records in ${table}`,
          status: "PASS",
          info: "0 orphan records",
        });
      } else {
        report.status = "FAIL";
        report.details.push({
          check: `orphan records in ${table}`,
          status: "FAIL",
          info: `${count} orphan records found!`,
        });
      }
    }

    // 5. Verify school_name is correctly fetched and not null/empty for active schools
    const schoolNameCheck = await client.query(`
      SELECT id, school_name, name 
      FROM public.schools 
      LIMIT 5;
    `);

    let schoolNameIssues = 0;
    for (const row of schoolNameCheck.rows) {
      if (!row.school_name || row.school_name !== row.name) {
        schoolNameIssues++;
      }
    }

    if (schoolNameIssues === 0 && schoolNameCheck.rowCount > 0) {
      report.details.push({
        check: "school_name correct value check",
        status: "PASS",
        info: "school_name is generated successfully and matches 'name' column",
      });
    } else if (schoolNameCheck.rowCount === 0) {
      report.details.push({
        check: "school_name correct value check",
        status: "PASS",
        info: "No schools in DB to verify, schema check is passed",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "school_name correct value check",
        status: "FAIL",
        info: `Found issues with school_name generated values in ${schoolNameIssues} rows.`,
      });
    }

    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Database audit failed:", err);
  } finally {
    await client.end();
  }
}

run();
