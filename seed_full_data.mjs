import pg from "pg";
const { Client } = pg;

const client = new Client({
  host: "db.gzhoeihogdvvtwillihs.supabase.co",
  port: 5432,
  database: "postgres",
  user: "postgres",
  password: "kNWAA4oflDthIYXF",
  ssl: { rejectUnauthorized: false },
});

async function runSeed() {
  await client.connect();
  console.log("Connected to Supabase Postgres.");

  try {
    // 1. Fetch or ensure school exists
    let schoolRes = await client.query(`SELECT id, name FROM public.schools LIMIT 1;`);
    let schoolId;
    if (schoolRes.rows.length === 0) {
      const newSchoolId = crypto.randomUUID();
      await client.query(`
        INSERT INTO public.schools (id, name, code, plan, status, student_limit, teacher_limit, branding_theme)
        VALUES ($1, 'HEZO Demo International School', 'HEZO-DEMO', 'enterprise', 'active', 1000, 100, '{"primaryColor": "#6366f1"}');
      `, [newSchoolId]);
      schoolId = newSchoolId;
    } else {
      schoolId = schoolRes.rows[0].id;
    }
    console.log("Using School ID:", schoolId);

    // 2. Ensure test users exist in auth.users with password 'Password123!'
    const testUsers = [
      { email: "brandwalestudios@gmail.com", name: "Super Admin", role: "super_admin", isSchoolSpecific: false },
      { email: "admin@hezoscl.com", name: "Banu Admin", role: "admin", isSchoolSpecific: true },
      { email: "teacher@hezo.com", name: "Priya Sharma", role: "teacher", isSchoolSpecific: true },
      { email: "janga@hezo.com", name: "Janga Reddy", role: "parent", isSchoolSpecific: true },
      { email: "parent2@hezo.com", name: "Vikram Malhotra", role: "parent", isSchoolSpecific: true }
    ];

    const userMap = {};

    for (const u of testUsers) {
      let userRes = await client.query(`SELECT id FROM auth.users WHERE email = $1;`, [u.email]);
      let uid;
      if (userRes.rows.length === 0) {
        uid = crypto.randomUUID();
        await client.query(`
          INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
          ) VALUES (
            $1, '00000000-0000-0000-0000-000000000000', $2, crypt('Password123!', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}', json_build_object('full_name', $3::text), NOW(), NOW(), 'authenticated', 'authenticated'
          );
        `, [uid, u.email, u.name]);
        console.log(`Created auth user: ${u.email}`);
      } else {
        uid = userRes.rows[0].id;
        await client.query(`
          UPDATE auth.users 
          SET encrypted_password = crypt('Password123!', gen_salt('bf')),
              email_confirmed_at = COALESCE(email_confirmed_at, NOW())
          WHERE id = $1;
        `, [uid]);
        console.log(`Updated auth password for: ${u.email}`);
      }

      userMap[u.role] = uid;
      userMap[u.email] = uid;

      // Upsert profile
      await client.query(`
        INSERT INTO public.profiles (user_id, full_name, email, school_id, designation, department)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id) DO UPDATE 
        SET full_name = EXCLUDED.full_name,
            email = EXCLUDED.email,
            school_id = EXCLUDED.school_id;
      `, [uid, u.name, u.email, u.isSchoolSpecific ? schoolId : null, u.role === "teacher" ? "Senior Teacher" : "Staff", "Academics"]);

      // Upsert user_role
      await client.query(`
        INSERT INTO public.user_roles (user_id, school_id, role)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING;
      `, [uid, u.isSchoolSpecific ? schoolId : null, u.role]);
    }

    // 3. Seed Realistic Classes
    const classNames = [
      { name: "Nursery - A", grade: "Nursery", section: "A" },
      { name: "LKG - A", grade: "LKG", section: "A" },
      { name: "UKG - A", grade: "UKG", section: "A" },
      { name: "Class 1 - A", grade: "1", section: "A" },
      { name: "Class 2 - A", grade: "2", section: "A" },
      { name: "Class 3 - A", grade: "3", section: "A" },
      { name: "Class 4 - A", grade: "4", section: "A" },
      { name: "Class 5 - A", grade: "5", section: "A" },
      { name: "Class 6 - A", grade: "6", section: "A" },
      { name: "Class 7 - A", grade: "7", section: "A" },
      { name: "Class 8 - A", grade: "8", section: "A" },
      { name: "Class 9 - A", grade: "9", section: "A" },
      { name: "Class 10 - A", grade: "10", section: "A" }
    ];

    const classMap = {};
    for (const c of classNames) {
      let clsRes = await client.query(`SELECT id FROM public.classes WHERE school_id = $1 AND name = $2;`, [schoolId, c.name]);
      let clsId;
      if (clsRes.rows.length === 0) {
        let insRes = await client.query(`
          INSERT INTO public.classes (school_id, name, grade, section, class_teacher_id)
          VALUES ($1, $2, $3, $4, $5) RETURNING id;
        `, [schoolId, c.name, c.grade, c.section, userMap["teacher@hezo.com"]]);
        clsId = insRes.rows[0].id;
      } else {
        clsId = clsRes.rows[0].id;
        await client.query(`UPDATE public.classes SET class_teacher_id = $1 WHERE id = $2;`, [userMap["teacher@hezo.com"], clsId]);
      }
      classMap[c.name] = clsId;
    }
    console.log("Seeded Classes:", Object.keys(classMap).length);

    // 4. Seed Subjects
    const subjects = [
      { name: "English", code: "ENG101" },
      { name: "Telugu", code: "TEL101" },
      { name: "Hindi", code: "HIN101" },
      { name: "Mathematics", code: "MAT101" },
      { name: "Science", code: "SCI101" },
      { name: "Social Studies", code: "SST101" },
      { name: "Computer Science", code: "CS101" }
    ];

    const subjectMap = {};
    for (const s of subjects) {
      let subRes = await client.query(`SELECT id FROM public.subjects WHERE school_id = $1 AND name = $2;`, [schoolId, s.name]);
      let subId;
      if (subRes.rows.length === 0) {
        let ins = await client.query(`
          INSERT INTO public.subjects (school_id, name, code)
          VALUES ($1, $2, $3) RETURNING id;
        `, [schoolId, s.name, s.code]);
        subId = ins.rows[0].id;
      } else {
        subId = subRes.rows[0].id;
      }
      subjectMap[s.name] = subId;
    }
    console.log("Seeded Subjects:", Object.keys(subjectMap).length);

    // Get Teacher Profile ID
    const tProfRes = await client.query(`SELECT id FROM public.profiles WHERE user_id = $1;`, [userMap["teacher@hezo.com"]]);
    const teacherProfileId = tProfRes.rows[0].id;

    // 5. Seed Teacher Allocation
    await client.query(`
      INSERT INTO public.teacher_allocations (school_id, teacher_id, subject_id, class_id, academic_year)
      VALUES ($1, $2, $3, $4, '2026-2027')
      ON CONFLICT DO NOTHING;
    `, [schoolId, teacherProfileId, subjectMap["Mathematics"], classMap["Class 10 - A"]]);
    console.log("Seeded Teacher Allocation for Priya Sharma -> Mathematics / Class 10 - A");

    // 6. Seed Realistic Students
    const studentsData = [
      { name: "Aarav Reddy", adm: "HEZO-2026-0001", roll: "101", class: "Class 10 - A", gender: "Male", dob: "2011-04-15", parent: "janga@hezo.com" },
      { name: "Diya Reddy", adm: "HEZO-2026-0002", roll: "102", class: "Class 8 - A", gender: "Female", dob: "2013-09-21", parent: "janga@hezo.com" },
      { name: "Rohan Malhotra", adm: "HEZO-2026-0003", roll: "103", class: "Class 10 - A", gender: "Male", dob: "2011-06-10", parent: "parent2@hezo.com" },
      { name: "Ananya Sharma", adm: "HEZO-2026-0004", roll: "104", class: "Class 5 - A", gender: "Female", dob: "2016-01-28", parent: "janga@hezo.com" },
      { name: "Kabir Verma", adm: "HEZO-2026-0005", roll: "105", class: "Class 10 - A", gender: "Male", dob: "2011-11-03", parent: "parent2@hezo.com" }
    ];

    const studentIds = [];
    for (const st of studentsData) {
      let stRes = await client.query(`SELECT id FROM public.students WHERE school_id = $1 AND admission_number = $2;`, [schoolId, st.adm]);
      let sId;
      if (stRes.rows.length === 0) {
        let ins = await client.query(`
          INSERT INTO public.students (
            school_id, class_id, full_name, admission_number, roll_number, gender, date_of_birth,
            parent_user_id, parent_email, blood_group, emergency_contact, academic_year
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, 'O+', '+91 9876543210', '2026-2027'
          ) RETURNING id;
        `, [schoolId, classMap[st.class], st.name, st.adm, st.roll, st.gender, st.dob, userMap[st.parent], st.parent]);
        sId = ins.rows[0].id;
      } else {
        sId = stRes.rows[0].id;
      }
      studentIds.push(sId);
    }
    console.log("Seeded Students:", studentIds.length);

    // 7. Seed Attendance Records
    const today = new Date().toISOString().split("T")[0];
    for (const sid of studentIds) {
      await client.query(`
        INSERT INTO public.attendance (school_id, student_id, class_id, date, status, marked_by)
        VALUES ($1, $2, $3, $4, 'present', $5)
        ON CONFLICT DO NOTHING;
      `, [schoolId, sid, classMap["Class 10 - A"], today, userMap["teacher@hezo.com"]]);
    }
    console.log("Seeded Attendance for today:", today);

    // 8. Seed Homework
    await client.query(`
      INSERT INTO public.homework (school_id, class_id, subject, teacher_id, title, description, due_date)
      VALUES ($1, $2, 'Mathematics', $3, 'Quadratic Equations Practice Set 4.2', 'Complete problems 1 through 15 from Chapter 4 in NCERT textbook.', '2026-09-10')
      ON CONFLICT DO NOTHING;
    `, [schoolId, classMap["Class 10 - A"], userMap["teacher@hezo.com"]]);
    console.log("Seeded Homework Assignment");

    // 9. Seed Exams & Exam Subjects
    let examRes = await client.query(`SELECT id FROM public.exams WHERE school_id = $1 AND name = 'Term 1 Mid-Term Examination' AND class_id = $2;`, [schoolId, classMap["Class 10 - A"]]);
    let examId;
    if (examRes.rows.length === 0) {
      let insExam = await client.query(`
        INSERT INTO public.exams (school_id, class_id, name, type, academic_year, date, max_marks, status)
        VALUES ($1, $2, 'Term 1 Mid-Term Examination', 'mid_term', '2026-2027', '2026-09-15', 100, 'published') RETURNING id;
      `, [schoolId, classMap["Class 10 - A"]]);
      examId = insExam.rows[0].id;
    } else {
      examId = examRes.rows[0].id;
    }

    // Exam Subjects Mapping
    let esRes = await client.query(`SELECT id FROM public.exam_subjects WHERE exam_id = $1 AND subject_id = $2;`, [examId, subjectMap["Mathematics"]]);
    let examSubjectId;
    if (esRes.rows.length === 0) {
      let insEs = await client.query(`
        INSERT INTO public.exam_subjects (school_id, exam_id, subject_id, max_marks, pass_marks)
        VALUES ($1, $2, $3, 100, 35) RETURNING id;
      `, [schoolId, examId, subjectMap["Mathematics"]]);
      examSubjectId = insEs.rows[0].id;
    } else {
      examSubjectId = esRes.rows[0].id;
    }
    console.log("Seeded Exam & Exam Subject:", examSubjectId);

    for (let i = 0; i < studentIds.length; i++) {
      const sid = studentIds[i];
      const marksObtained = 85 + (i * 2);
      await client.query(`
        INSERT INTO public.mark_entries (school_id, exam_id, exam_subject_id, student_id, marks_obtained, grade, remarks, status)
        VALUES ($1, $2, $3, $4, $5, 'A', 'Excellent performance in Algebra & Trigonometry', 'Published')
        ON CONFLICT DO NOTHING;
      `, [schoolId, examId, examSubjectId, sid, marksObtained]);
    }
    console.log("Seeded Mark Entries for Students");

    // 10. Seed Announcements
    await client.query(`
      INSERT INTO public.announcements (school_id, title, body, created_by)
      VALUES ($1, 'Annual Sports Day & Science Exhibition 2026', 'HEZO International School will celebrate its Annual Sports Meet on Sept 28th. All parents are cordially invited.', $2)
      ON CONFLICT DO NOTHING;
    `, [schoolId, userMap["admin@hezoscl.com"]]);
    console.log("Seeded School Announcement");

    // 11. Seed Fee Structure
    let feeStructRes = await client.query(`SELECT id FROM public.fee_structures WHERE school_id = $1 LIMIT 1;`, [schoolId]);
    let feeStructId;
    if (feeStructRes.rows.length === 0) {
      let insFee = await client.query(`
        INSERT INTO public.fee_structures (school_id, class_id, name, amount, frequency, category)
        VALUES ($1, $2, 'Standard Tuition Fee 2026-2027', 45000.00, 'termly', 'Tuition') RETURNING id;
      `, [schoolId, classMap["Class 10 - A"]]);
      feeStructId = insFee.rows[0].id;
    } else {
      feeStructId = feeStructRes.rows[0].id;
    }
    console.log("Seeded Fee Structure:", feeStructId);

    // 12. Seed Leave Requests
    await client.query(`
      INSERT INTO public.leave_requests (school_id, student_id, parent_user_id, start_date, end_date, reason, status)
      VALUES ($1, $2, $3, '2026-09-12', '2026-09-14', 'Family wedding ceremony', 'approved')
      ON CONFLICT DO NOTHING;
    `, [schoolId, studentIds[0], userMap["janga@hezo.com"]]);

    console.log("✅ ALL REALISTIC PRODUCTION TEST DATA SEEDED SUCCESSFULLY!");
  } catch (err) {
    console.error("Error during seed:", err);
  } finally {
    await client.end();
  }
}

runSeed();
