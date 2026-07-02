import { getDbClient } from "./db_helper.mjs";

const client = getDbClient();

async function run() {
  try {
    await client.connect();
    console.log("Connected for security & role testing.");

    const report = {
      phase: "PHASE 2 & 3 & 7 - MULTI-TENANT ISOLATION AND ROLE SECURITY TEST",
      status: "PASS",
      details: [],
    };

    // Start a transaction
    await client.query("BEGIN;");

    // 1. Provision Test Schools
    const schoolAId = "a0000000-a000-a000-a000-a00000000000";
    const schoolBId = "b0000000-b000-b000-b000-b00000000000";

    await client.query(
      `
      INSERT INTO public.schools (id, name, owner_id) 
      VALUES 
        ($1, 'School A', '00000000-0000-0000-0000-000000000001'),
        ($2, 'School B', '00000000-0000-0000-0000-000000000002')
      ON CONFLICT (id) DO NOTHING;
    `,
      [schoolAId, schoolBId],
    );

    // 2. Provision Users (Admins, Teachers, Parents/Students)
    const adminA = "10000000-0000-0000-0000-000000000001";
    const adminB = "10000000-0000-0000-0000-000000000002";
    const teacherA = "20000000-0000-0000-0000-000000000001";
    const teacherB = "20000000-0000-0000-0000-000000000002";
    const parentA = "30000000-0000-0000-0000-000000000001";
    const parentB = "30000000-0000-0000-0000-000000000002";

    // Insert profiles
    await client.query(
      `
      INSERT INTO public.profiles (user_id, school_id, full_name, email)
      VALUES 
        ($1, $7, 'Admin A', 'admina@schoola.com'),
        ($2, $8, 'Admin B', 'adminb@schoolb.com'),
        ($3, $7, 'Teacher A', 'teachera@schoola.com'),
        ($4, $8, 'Teacher B', 'teacherb@schoolb.com'),
        ($5, $7, 'Parent A', 'parenta@schoola.com'),
        ($6, $8, 'Parent B', 'parentb@schoolb.com')
      ON CONFLICT (user_id) DO NOTHING;
    `,
      [adminA, adminB, teacherA, teacherB, parentA, parentB, schoolAId, schoolBId],
    );

    // Insert roles
    await client.query(
      `
      INSERT INTO public.user_roles (user_id, school_id, role)
      VALUES 
        ($1, $7, 'admin'),
        ($2, $8, 'admin'),
        ($3, $7, 'teacher'),
        ($4, $8, 'teacher'),
        ($5, $7, 'parent'),
        ($6, $8, 'parent')
      ON CONFLICT DO NOTHING;
    `,
      [adminA, adminB, teacherA, teacherB, parentA, parentB, schoolAId, schoolBId],
    );

    // Insert classes
    const classAId = "c1000000-0000-0000-0000-000000000001";
    const classBId = "c2000000-0000-0000-0000-000000000002";
    await client.query(
      `
      INSERT INTO public.classes (id, school_id, name)
      VALUES 
        ($1, $3, 'Class A1'),
        ($2, $4, 'Class B1')
      ON CONFLICT DO NOTHING;
    `,
      [classAId, classBId, schoolAId, schoolBId],
    );

    // Insert students
    const studentAId = "d1000000-0000-0000-0000-000000000001";
    const studentBId = "d2000000-0000-0000-0000-000000000002";
    await client.query(
      `
      INSERT INTO public.students (id, school_id, class_id, full_name, parent_user_id)
      VALUES 
        ($1, $3, $5, 'Student A1', $7),
        ($2, $4, $6, 'Student B1', $8)
      ON CONFLICT DO NOTHING;
    `,
      [studentAId, studentBId, schoolAId, schoolBId, classAId, classBId, parentA, parentB],
    );

    // Function to set session role in transaction
    const setSessionUser = async (userId) => {
      await client.query(`SET LOCAL request.jwt.claim.sub = '${userId}';`);
      await client.query(`SET LOCAL role = 'authenticated';`);
    };

    // -----------------------------------------------------------------
    // TEST 1: Admin A Query Isolation (Schools table RLS check)
    // -----------------------------------------------------------------
    await setSessionUser(adminA);
    const adminASchools = await client.query(`SELECT id, name FROM public.schools;`);
    if (adminASchools.rowCount === 1 && adminASchools.rows[0].id === schoolAId) {
      report.details.push({
        check: "Admin A School isolation check",
        status: "PASS",
        info: "Admin A only sees School A",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "Admin A School isolation check",
        status: "FAIL",
        info: `Admin A saw: ${JSON.stringify(adminASchools.rows)}`,
      });
    }

    // -----------------------------------------------------------------
    // TEST 2: Admin A Student Isolation (Students table RLS check)
    // -----------------------------------------------------------------
    const adminAStudents = await client.query(`SELECT id, full_name FROM public.students;`);
    if (adminAStudents.rowCount === 1 && adminAStudents.rows[0].id === studentAId) {
      report.details.push({
        check: "Admin A Student isolation check",
        status: "PASS",
        info: "Admin A only sees Student A1",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "Admin A Student isolation check",
        status: "FAIL",
        info: `Admin A saw: ${JSON.stringify(adminAStudents.rows)}`,
      });
    }

    // -----------------------------------------------------------------
    // TEST 3: Admin B Query Isolation (Schools & Students RLS checks)
    // -----------------------------------------------------------------
    await setSessionUser(adminB);
    const adminBSchools = await client.query(`SELECT id, name FROM public.schools;`);
    const adminBStudents = await client.query(`SELECT id, full_name FROM public.students;`);

    if (
      adminBSchools.rowCount === 1 &&
      adminBSchools.rows[0].id === schoolBId &&
      adminBStudents.rowCount === 1 &&
      adminBStudents.rows[0].id === studentBId
    ) {
      report.details.push({
        check: "Admin B Isolation checks",
        status: "PASS",
        info: "Admin B only sees School B and Student B1",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "Admin B Isolation checks",
        status: "FAIL",
        info: "Admin B saw other schools or other students",
      });
    }

    // -----------------------------------------------------------------
    // TEST 4: Teacher A Isolation (Students & Classes RLS check)
    // -----------------------------------------------------------------
    await setSessionUser(teacherA);
    const teacherAStudents = await client.query(`SELECT id, full_name FROM public.students;`);
    const teacherAClasses = await client.query(`SELECT id, name FROM public.classes;`);

    if (
      teacherAStudents.rowCount === 1 &&
      teacherAStudents.rows[0].id === studentAId &&
      teacherAClasses.rowCount === 1 &&
      teacherAClasses.rows[0].id === classAId
    ) {
      report.details.push({
        check: "Teacher A Isolation checks",
        status: "PASS",
        info: "Teacher A only sees School A students/classes",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "Teacher A Isolation checks",
        status: "FAIL",
        info: "Teacher A saw other school students or classes",
      });
    }

    // -----------------------------------------------------------------
    // TEST 5: Parent A/Student A Isolation (Only own children)
    // -----------------------------------------------------------------
    await setSessionUser(parentA);
    const parentAStudents = await client.query(`SELECT id, full_name FROM public.students;`);
    if (parentAStudents.rowCount === 1 && parentAStudents.rows[0].id === studentAId) {
      report.details.push({
        check: "Parent A Student isolation check",
        status: "PASS",
        info: "Parent A only sees own child (Student A1)",
      });
    } else {
      report.status = "FAIL";
      report.details.push({
        check: "Parent A Student isolation check",
        status: "FAIL",
        info: `Parent A saw: ${JSON.stringify(parentAStudents.rows)}`,
      });
    }

    // -----------------------------------------------------------------
    // TEST 6: Privilege Escalation Checks
    // -----------------------------------------------------------------

    // Teacher A attempting to delete/update School credentials
    await setSessionUser(teacherA);
    try {
      await client.query(
        `
        INSERT INTO public.school_credentials (school_id, temp_password) 
        VALUES ($1, 'escalated_pwd');
      `,
        [schoolAId],
      );
      // If the insert completes, privilege escalation succeeded!
      report.status = "FAIL";
      report.details.push({
        check: "Privilege Escalation: Teacher write school_credentials",
        status: "FAIL",
        info: "Teacher successfully wrote to school_credentials!",
      });
    } catch (e) {
      report.details.push({
        check: "Privilege Escalation: Teacher write school_credentials",
        status: "PASS",
        info: "Teacher write blocked as expected: " + e.message,
      });
    }

    // Rollback the transaction to keep DB clean
    await client.query("ROLLBACK;");
    console.log("Security tests transaction rolled back successfully.");
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error("Security audit run failed:", err);
    try {
      await client.query("ROLLBACK;");
    } catch (e) {}
  } finally {
    await client.end();
  }
}

run();
