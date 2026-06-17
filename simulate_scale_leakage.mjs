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
    console.log("Connected for Multi-Tenant Scale Simulation.");

    const report = {
      phase: "PHASE 6 - MULTI-TENANT SCALE SIMULATION TEST",
      status: "PASS",
      details: [],
    };

    console.log("Starting transaction...");
    await client.query("BEGIN;");

    // 1. Generate Schools (simulate up to 100 schools)
    const schoolCount = 100;
    const studentsPerSchool = 10; // 100 schools * 10 students = 1000 students total

    console.log(`Generating ${schoolCount} schools...`);
    const schoolIds = [];
    for (let i = 0; i < schoolCount; i++) {
      const schoolId = `e${String(i).padStart(7, "0")}-0000-0000-0000-000000000000`;
      schoolIds.push(schoolId);
    }

    // Bulk insert schools
    const schoolInsertValues = schoolIds
      .map(
        (id, idx) =>
          `('${id}', 'Simulated School ${idx + 1}', '00000000-0000-0000-0000-${String(idx).padStart(12, "0")}')`,
      )
      .join(",\n");
    await client.query(`
      INSERT INTO public.schools (id, name, owner_id) 
      VALUES ${schoolInsertValues}
      ON CONFLICT (id) DO NOTHING;
    `);

    // 2. Generate Admin users for each school to test RLS
    console.log(`Generating ${schoolCount} admin profiles & roles...`);
    const adminUserIds = schoolIds.map(
      (_, idx) => `e${String(idx).padStart(7, "0")}-1000-0000-0000-000000000000`,
    );

    const profileInsertValues = schoolIds
      .map((schoolId, idx) => {
        const adminId = adminUserIds[idx];
        return `('${adminId}', '${schoolId}', 'Admin School ${idx + 1}', 'admin${idx + 1}@simulated.com')`;
      })
      .join(",\n");

    await client.query(`
      INSERT INTO public.profiles (user_id, school_id, full_name, email)
      VALUES ${profileInsertValues}
      ON CONFLICT (user_id) DO NOTHING;
    `);

    const roleInsertValues = schoolIds
      .map((schoolId, idx) => {
        const adminId = adminUserIds[idx];
        return `('${adminId}', '${schoolId}', 'admin')`;
      })
      .join(",\n");

    await client.query(`
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES ${roleInsertValues}
      ON CONFLICT DO NOTHING;
    `);

    // 3. Generate 1000 Students (10 students per school)
    console.log(`Generating ${schoolCount * studentsPerSchool} student records...`);
    const studentInsertRows = [];
    for (let s = 0; s < schoolCount; s++) {
      const schoolId = schoolIds[s];
      for (let stud = 0; stud < studentsPerSchool; stud++) {
        const studentId = `e${String(s).padStart(3, "0")}${String(stud).padStart(4, "0")}-2000-0000-0000-000000000000`;
        studentInsertRows.push(
          `('${studentId}', '${schoolId}', 'Simulated Student ${s + 1}-${stud + 1}')`,
        );
      }
    }

    const studentInsertValues = studentInsertRows.join(",\n");
    await client.query(`
      INSERT INTO public.students (id, school_id, full_name)
      VALUES ${studentInsertValues}
      ON CONFLICT (id) DO NOTHING;
    `);

    console.log("Database populated successfully. Running isolation assertions...");

    // Helper to query under a session user context
    const setSessionUser = async (userId) => {
      await client.query(`SET LOCAL request.jwt.claim.sub = '${userId}';`);
      await client.query(`SET LOCAL role = 'authenticated';`);
    };

    // 4. Test RLS Isolation across a sample of schools to verify absolutely zero leakage
    const sampleIndices = [0, 9, 49, 99]; // Verify school 1, 10, 50, and 100
    let leakDetected = false;

    for (const idx of sampleIndices) {
      const adminId = adminUserIds[idx];
      const schoolId = schoolIds[idx];

      await setSessionUser(adminId);

      // Verify school access
      const schoolRes = await client.query(`SELECT id FROM public.schools;`);
      if (schoolRes.rowCount !== 1 || schoolRes.rows[0].id !== schoolId) {
        leakDetected = true;
        report.status = "FAIL";
        report.details.push({
          check: `Isolation check: School ${idx + 1}`,
          status: "FAIL",
          info: `Expected school ID ${schoolId}, but query returned ${schoolRes.rowCount} rows.`,
        });
        break;
      }

      // Verify student access (should return exactly 10 students all belonging to schoolId)
      const studentsRes = await client.query(`SELECT id, school_id FROM public.students;`);
      const differentTenantRows = studentsRes.rows.filter((r) => r.school_id !== schoolId);

      if (studentsRes.rowCount !== studentsPerSchool || differentTenantRows.length > 0) {
        leakDetected = true;
        report.status = "FAIL";
        report.details.push({
          check: `Leakage check: Students of School ${idx + 1}`,
          status: "FAIL",
          info: `Expected ${studentsPerSchool} students of school ${schoolId}. Got ${studentsRes.rowCount} rows, with ${differentTenantRows.length} foreign rows.`,
        });
        break;
      }
    }

    if (!leakDetected) {
      report.details.push({
        check: "RLS Multi-Tenant Isolation (100 schools, 1000 students)",
        status: "PASS",
        info: "RLS perfectly isolated queries. Zero tenant leaks detected under test conditions.",
      });
    }

    // Rollback to keep database completely pristine
    await client.query("ROLLBACK;");
    console.log("Scale simulation transaction rolled back successfully.");
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Scale simulation run failed:", err);
    try {
      await client.query("ROLLBACK;");
    } catch (e) {}
  } finally {
    await client.end();
  }
}

run();
