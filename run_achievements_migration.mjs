import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';

const { Client } = pg;

// Connection options following the repository's established runner pattern
const connectionConfig = {
  host: 'db.crypicuosxqquudpgosi.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'bANU@NIRO3009',
  ssl: { rejectUnauthorized: false }
};

const schoolId = '37fc05aa-42bd-4e10-bae1-2278ae17f00c'; // Niro school
const classId = '58f33f79-2434-4408-82d1-e021307ae311'; // 1st class
const parentUserId = '2b69b820-5891-4033-9155-418862032864'; // banu.prasad0607@gmail.com
const parentEmail = 'banu.prasad0607@gmail.com';
const adminUserId = '9783fac6-341c-4abb-8479-5d434ffafaac'; // banu profile linked as admin

async function run() {
  const client = new Client(connectionConfig);
  try {
    await client.connect();
    console.log("Connected to PostgreSQL Database.");

    // 1) Read and execute SQL migration file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20260609110000_achievements_and_awards.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    console.log("Applying SQL schemas...");
    await client.query(sql);
    console.log("Schema applied successfully.");

    // 2) Seed Subjects
    console.log("Seeding subjects...");
    const subjects = [
      { name: 'Mathematics', code: 'MATH-01' },
      { name: 'Science', code: 'SCI-01' },
      { name: 'English', code: 'ENG-01' },
      { name: 'Social Studies', code: 'SST-01' },
      { name: 'Computer Science', code: 'CS-01' }
    ];
    const subjectIds = [];
    for (const sub of subjects) {
      // Check if subject exists
      const checkRes = await client.query(
        'SELECT id FROM public.subjects WHERE school_id = $1 AND name = $2',
        [schoolId, sub.name]
      );
      if (checkRes.rows.length > 0) {
        subjectIds.push(checkRes.rows[0].id);
      } else {
        const insRes = await client.query(
          'INSERT INTO public.subjects (school_id, name, code) VALUES ($1, $2, $3) RETURNING id',
          [schoolId, sub.name, sub.code]
        );
        subjectIds.push(insRes.rows[0].id);
      }
    }
    console.log(`Seeded ${subjectIds.length} subjects.`);

    // 3) Seed Students
    console.log("Seeding students...");
    const studentsData = [
      { full_name: 'Aarav Sharma', roll_number: '101', parent_user_id: parentUserId, parent_email: parentEmail },
      { full_name: 'Vihaan Patel', roll_number: '102', parent_user_id: parentUserId, parent_email: parentEmail },
      { full_name: 'Ananya Iyer', roll_number: '103', parent_user_id: null, parent_email: null },
      { full_name: 'Diya Sen', roll_number: '104', parent_user_id: null, parent_email: null },
      { full_name: 'Kabir Mehta', roll_number: '105', parent_user_id: null, parent_email: null },
      { full_name: 'Ishaan Rao', roll_number: '106', parent_user_id: null, parent_email: null },
      { full_name: 'Zara Khan', roll_number: '107', parent_user_id: null, parent_email: null },
      { full_name: 'Rohan Das', roll_number: '108', parent_user_id: null, parent_email: null }
    ];
    const studentIds = [];
    for (const stud of studentsData) {
      const checkRes = await client.query(
        'SELECT id FROM public.students WHERE school_id = $1 AND class_id = $2 AND full_name = $3',
        [schoolId, classId, stud.full_name]
      );
      if (checkRes.rows.length > 0) {
        studentIds.push(checkRes.rows[0].id);
      } else {
        const insRes = await client.query(
          'INSERT INTO public.students (school_id, class_id, full_name, roll_number, parent_user_id, parent_email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
          [schoolId, classId, stud.full_name, stud.roll_number, stud.parent_user_id, stud.parent_email]
        );
        studentIds.push(insRes.rows[0].id);
      }
    }
    console.log(`Seeded ${studentIds.length} students.`);

    // 4) Seed Exams
    console.log("Seeding exams...");
    const examTypes = [
      { name: 'Unit Test 1', type: 'unit_test', max_marks: 50 },
      { name: 'Quarterly Exam', type: 'quarterly', max_marks: 100 },
      { name: 'Half-Yearly Exam', type: 'half_yearly', max_marks: 100 },
      { name: 'Annual Exam', type: 'annual', max_marks: 100 }
    ];

    const exams = [];
    for (const subId of subjectIds) {
      for (const et of examTypes) {
        const examName = `${et.name} - ${subjects[subjectIds.indexOf(subId)].name}`;
        const checkRes = await client.query(
          'SELECT id FROM public.exams WHERE school_id = $1 AND class_id = $2 AND name = $3',
          [schoolId, classId, examName]
        );
        let examId;
        if (checkRes.rows.length > 0) {
          examId = checkRes.rows[0].id;
        } else {
          const insRes = await client.query(
            'INSERT INTO public.exams (school_id, class_id, subject_id, name, type, max_marks) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            [schoolId, classId, subId, examName, et.type, et.max_marks]
          );
          examId = insRes.rows[0].id;
        }
        exams.push({ id: examId, subject_id: subId, name: examName, max_marks: et.max_marks });
      }
    }
    console.log(`Seeded ${exams.length} exams.`);

    // 5) Seed Exam Marks
    console.log("Seeding exam marks...");
    // Let's seed realistic grades
    // Aarav: 95% average, Vihaan: 88% average, Ananya: 92% average, Diya: 79% average, Kabir: 84% average, Ishaan: 70% average, Zara: 65% average, Rohan: 55% average
    const studentPerformance = [
      { index: 0, base: 0.95 },
      { index: 1, base: 0.88 },
      { index: 2, base: 0.92 },
      { index: 3, base: 0.79 },
      { index: 4, base: 0.84 },
      { index: 5, base: 0.70 },
      { index: 6, base: 0.65 },
      { index: 7, base: 0.55 }
    ];

    for (const stPerf of studentPerformance) {
      const sId = studentIds[stPerf.index];
      for (const exam of exams) {
        const checkRes = await client.query(
          'SELECT id FROM public.exam_marks WHERE exam_id = $1 AND student_id = $2',
          [exam.id, sId]
        );
        if (checkRes.rows.length === 0) {
          // Calculate realistic mark: base +/- 5% variance
          const variance = (Math.random() - 0.5) * 0.1;
          const percentage = Math.min(Math.max(stPerf.base + variance, 0.4), 1.0);
          const marks = Math.round(percentage * exam.max_marks * 10) / 10;
          await client.query(
            'INSERT INTO public.exam_marks (school_id, exam_id, student_id, marks_obtained) VALUES ($1, $2, $3, $4)',
            [schoolId, exam.id, sId, marks]
          );
        }
      }
    }
    console.log("Seeded exam marks successfully.");

    // 6) Seed Attendance logs
    console.log("Seeding attendance logs...");
    // Aarav: 100%, Vihaan: 98%, Ananya: 90%, Diya: 85%, Kabir: 95%, Ishaan: 70%, Zara: 88%, Rohan: 99%
    const attendanceStats = [1.0, 0.98, 0.90, 0.85, 0.95, 0.70, 0.88, 0.99];
    const dates = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(d.toISOString().slice(0, 10));
    }

    for (let sIdx = 0; sIdx < studentIds.length; sIdx++) {
      const sId = studentIds[sIdx];
      const rate = attendanceStats[sIdx];
      for (const d of dates) {
        const status = Math.random() < rate ? 'present' : (Math.random() < 0.5 ? 'absent' : 'late');
        await client.query(
          'INSERT INTO public.attendance (school_id, class_id, student_id, date, status, marked_by) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (student_id, date) DO NOTHING',
          [schoolId, classId, sId, d, status, adminUserId]
        );
      }
    }
    console.log("Seeded attendance records successfully.");

    // 7) Seed default ranking rule
    console.log("Seeding ranking rules...");
    await client.query(`
      INSERT INTO public.ranking_rules (school_id, criteria, attendance_weightage, attendance_threshold)
      VALUES ($1, 'percentage', 0.10, 75.00)
      ON CONFLICT (school_id) DO UPDATE
      SET criteria = EXCLUDED.criteria, attendance_weightage = EXCLUDED.attendance_weightage
    `, [schoolId]);

    // 8) Seed default rankings and achievements
    console.log("Seeding initial rankings and awards...");
    // Let's delete existing rankings/awards for niro school so we seed fresh
    await client.query('DELETE FROM public.rankings WHERE school_id = $1', [schoolId]);
    await client.query('DELETE FROM public.awards WHERE school_id = $1', [schoolId]);
    await client.query('DELETE FROM public.certificates WHERE school_id = $1', [schoolId]);
    await client.query('DELETE FROM public.notification_logs WHERE school_id = $1', [schoolId]);

    // Seed 1st, 2nd, 3rd rankings
    const rankingsSeed = [
      { index: 0, pos: 1, pct: 96.2, gpa: 9.8, marks: 432 }, // Aarav Sharma
      { index: 2, pos: 2, pct: 92.8, gpa: 9.4, marks: 418 }, // Ananya Iyer
      { index: 1, pos: 3, pct: 88.5, gpa: 8.9, marks: 398 }  // Vihaan Patel
    ];

    const awardsSeed = [];

    for (const r of rankingsSeed) {
      const sId = studentIds[r.index];
      const studentName = studentsData[r.index].full_name;
      // Ranking row
      await client.query(`
        INSERT INTO public.rankings (school_id, student_id, academic_year, total_marks, percentage, gpa, rank_position, rank_type)
        VALUES ($1, $2, '2025-2026', $3, $4, $5, $6, 'class')
      `, [schoolId, sId, r.marks, r.pct, r.gpa, r.pos]);

      // Award row
      const suffix = r.pos === 1 ? 'First' : (r.pos === 2 ? 'Second' : 'Third');
      const awardCat = `rank_${r.pos}`;
      const awardRes = await client.query(`
        INSERT INTO public.awards (school_id, student_id, academic_year, category, title, description, issued_by)
        VALUES ($1, $2, '2025-2026', $3, $4, $5, $6)
        RETURNING id
      `, [
        schoolId,
        sId,
        awardCat,
        `${suffix} Rank Academic Excellence Award`,
        `Secured Rank #${r.pos} in Class 1A for outstanding academic performance with a cumulative percentage of ${r.pct}% and GPA of ${r.gpa}.`,
        adminUserId
      ]);

      const awardId = awardRes.rows[0].id;
      awardsSeed.push({ student_id: sId, award_id: awardId, name: studentName, cat: awardCat });

      // Certificate row
      const certNo = `HZ-2526-000${r.pos}`;
      await client.query(`
        INSERT INTO public.certificates (school_id, student_id, award_id, certificate_type, certificate_number, issued_date)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      `, [schoolId, sId, awardId, `${suffix} Rank Certificate`, certNo]);

      // Poster row
      const theme = r.pos === 1 ? 'gold' : (r.pos === 2 ? 'silver' : 'bronze');
      await client.query(`
        INSERT INTO public.posters (school_id, student_id, award_id, theme)
        VALUES ($1, $2, $3, $4)
      `, [schoolId, sId, awardId, theme]);
    }

    // Seed other awards (Attendance champion, Subject topper)
    // Aarav: math topper (index 0)
    // Vihaan: attendance topper (index 1)
    // Rohan: Best discipline (index 7)
    const extraAwards = [
      { index: 0, cat: 'subject_topper', title: 'Mathematics Topper Award', desc: 'Achieved the highest score in Mathematics across all examinations in Class 1A.', cert: 'Subject Topper Certificate', certNo: 'HZ-2526-SUB1' },
      { index: 1, cat: 'attendance_topper', title: 'Perfect Attendance Champion', desc: 'Maintained an outstanding 100% attendance track record during the academic session.', cert: 'Best Attendance Certificate', certNo: 'HZ-2526-ATT1' },
      { index: 7, cat: 'discipline_award', title: 'Best Discipline & Leadership Award', desc: 'Recognized for exemplary behavior, leadership qualities, and adherence to school values.', cert: 'Best Discipline Certificate', certNo: 'HZ-2526-DIS1' }
    ];

    for (const ea of extraAwards) {
      const sId = studentIds[ea.index];
      const studentName = studentsData[ea.index].full_name;

      const awardRes = await client.query(`
        INSERT INTO public.awards (school_id, student_id, academic_year, category, title, description, issued_by)
        VALUES ($1, $2, '2025-2026', $3, $4, $5, $6)
        RETURNING id
      `, [schoolId, sId, ea.cat, ea.title, ea.desc, adminUserId]);

      const awardId = awardRes.rows[0].id;
      awardsSeed.push({ student_id: sId, award_id: awardId, name: studentName, cat: ea.cat });

      await client.query(`
        INSERT INTO public.certificates (school_id, student_id, award_id, certificate_type, certificate_number, issued_date)
        VALUES ($1, $2, $3, $4, $5, CURRENT_DATE)
      `, [schoolId, sId, awardId, ea.cert, ea.certNo]);

      await client.query(`
        INSERT INTO public.posters (school_id, student_id, award_id, theme)
        VALUES ($1, $2, $3, 'royal')
      `, [schoolId, sId, awardId]);
    }

    // Seed parent notification logs (Aarav, Vihaan are linked to parent banu.prasad0607@gmail.com)
    console.log("Seeding parent notification logs...");
    const parentNotifications = [
      { studentIdx: 0, title: 'Rank #1 Achieved — Aarav Sharma', body: 'Congratulations! Your child Aarav Sharma has achieved Rank 1 in Class 1A for the academic year 2025-2026. Academic Excellence certificate has been generated.', type: 'rank' },
      { studentIdx: 0, title: 'Achievement Poster Available — Aarav Sharma', body: 'A premium achievement poster has been generated for Aarav Sharma. You can view, customize themes, and download it from the parent dashboard.', type: 'poster' },
      { studentIdx: 1, title: 'Attendance Champion Award — Vihaan Patel', body: 'Congratulations! Vihaan Patel was awarded the Perfect Attendance Champion in Class 1A for the term. Download the certificate in your dashboard.', type: 'award' }
    ];

    for (const pn of parentNotifications) {
      const sId = studentIds[pn.studentIdx];
      const award = awardsSeed.find(a => a.student_id === sId && a.cat.startsWith(pn.type === 'rank' ? 'rank' : ''));
      await client.query(`
        INSERT INTO public.notification_logs (school_id, parent_user_id, student_id, award_id, type, title, body, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, 'delivered')
      `, [
        schoolId,
        parentUserId,
        sId,
        award ? award.award_id : null,
        pn.type,
        pn.title,
        pn.body
      ]);
    }

    console.log("Seed data created successfully!");

  } catch (err) {
    console.error("Migration/Seeding failed:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

run();
