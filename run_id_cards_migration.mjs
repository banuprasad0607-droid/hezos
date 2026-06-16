import pg from 'pg';
import fs from 'fs/promises';
import path from 'path';

const { Client } = pg;

const connectionConfig = {
  host: 'db.crypicuosxqquudpgosi.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'bANU@NIRO3009',
  ssl: { rejectUnauthorized: false }
};

const schoolId = '37fc05aa-42bd-4e10-bae1-2278ae17f00c'; // Niro school
const adminUserId = '9783fac6-341c-4abb-8479-5d434ffafaac'; // banu profile linked as admin

async function run() {
  const client = new Client(connectionConfig);
  try {
    await client.connect();
    console.log("Connected to Supabase Database.");

    // 1) Read and execute SQL migration file
    const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '20260609130000_id_cards_module.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');
    console.log("Executing SQL migration...");
    await client.query(sql);
    console.log("Migration tables and columns applied successfully.");

    // 2) Seed school profile data
    console.log("Seeding school profile details...");
    await client.query(`
      UPDATE public.schools
      SET 
        logo_url = 'https://images.unsplash.com/photo-1594608661623-aa0bd3a69d98?w=120&auto=format&fit=crop&q=80',
        address = '123 Academic Enclave, Knowledge City, Bangalore, KA - 560001',
        phone_number = '+91 80 4567 8900',
        email = 'contact@hezoschool.edu.in'
      WHERE id = $1 AND (logo_url IS NULL OR logo_url = '');
    `, [schoolId]);

    // 3) Seed student details
    console.log("Enriching student records with blood groups and transport info...");
    const studentsRes = await client.query('SELECT id, full_name FROM public.students WHERE school_id = $1', [schoolId]);
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'O+', 'O-'];
    const transportRoutes = ['Route A - Electronic City', 'Route B - Whitefield', 'Route C - Indiranagar', 'Route D - Jayanagar', 'Self Transport'];
    
    for (let i = 0; i < studentsRes.rows.length; i++) {
      const student = studentsRes.rows[i];
      const blood = bloodGroups[i % bloodGroups.length];
      const transport = transportRoutes[i % transportRoutes.length];
      const busNo = transport === 'Self Transport' ? null : `BUS-${100 + i}`;
      const emergencyPhone = `+91 98765 432${i % 10}`;
      
      // Let's also set a default photo for student (Unsplash faces for realism)
      const photoIndex = (i % 8) + 1;
      const photoUrl = `https://images.unsplash.com/photo-${photoIndex === 1 ? '1544005313-94ddf0286df2' : photoIndex === 2 ? '1506794778202-cad84cf45f1d' : photoIndex === 3 ? '1507003211169-0a1dd7228f2d' : photoIndex === 4 ? '1534528741775-53994a69daeb' : photoIndex === 5 ? '1517841905240-472988babdf9' : photoIndex === 6 ? '1539571696357-5a69c17a67c6' : photoIndex === 7 ? '1494790108377-be9c29b29330' : '1500648767791-00dcc994a43e'}?w=400&auto=format&fit=crop&q=90`;

      await client.query(`
        UPDATE public.students
        SET 
          blood_group = $1,
          emergency_contact = $2,
          transport_route = $3,
          bus_number = $4,
          academic_year = '2025-2026',
          photo_url = $5
        WHERE id = $6;
      `, [blood, emergencyPhone, transport, busNo, photoUrl, student.id]);
    }
    console.log(`Updated ${studentsRes.rows.length} students.`);

    // 4) Seed staff details (profiles table for teachers and admins)
    console.log("Enriching staff profiles...");
    const staffRolesRes = await client.query(`
      SELECT DISTINCT user_id FROM public.user_roles 
      WHERE school_id = $1 AND role IN ('admin', 'teacher')
    `, [schoolId]);

    const designations = ['Principal', 'Vice Principal', 'Senior Teacher', 'Primary Coordinator', 'Teacher', 'Admissions Officer'];
    const departments = ['Administration', 'Science Dept', 'Mathematics Dept', 'Languages Dept', 'Social Studies Dept', 'Computer Science'];

    for (let i = 0; i < staffRolesRes.rows.length; i++) {
      const staff = staffRolesRes.rows[i];
      const employeeId = `HZ-EMP-${String(100 + i).padStart(3, '0')}`;
      const designation = staff.user_id === adminUserId ? 'School Admin' : designations[i % designations.length];
      const department = staff.user_id === adminUserId ? 'Administration' : departments[i % departments.length];
      const blood = bloodGroups[i % bloodGroups.length];
      const joiningDate = new Date(2022, i % 12, 1 + i * 3).toISOString().slice(0, 10);
      const mobile = `+91 90123 456${String(10 + i)}`;
      const address = `${10 + i * 3} Garden Heights, MG Road, Bangalore, KA - 560025`;
      const emergency = `+91 99887 766${String(50 + i)}`;
      
      const photoIndex = ((i + 12) % 8) + 1;
      const photoUrl = `https://images.unsplash.com/photo-${photoIndex === 1 ? '1544005313-94ddf0286df2' : photoIndex === 2 ? '1506794778202-cad84cf45f1d' : photoIndex === 3 ? '1507003211169-0a1dd7228f2d' : photoIndex === 4 ? '1534528741775-53994a69daeb' : photoIndex === 5 ? '1517841905240-472988babdf9' : photoIndex === 6 ? '1539571696357-5a69c17a67c6' : photoIndex === 7 ? '1494790108377-be9c29b29330' : '1500648767791-00dcc994a43e'}?w=400&auto=format&fit=crop&q=90`;

      await client.query(`
        UPDATE public.profiles
        SET 
          employee_id = $1,
          designation = $2,
          department = $3,
          blood_group = $4,
          joining_date = $5,
          mobile_number = $6,
          address = $7,
          emergency_contact = $8,
          photo_url = $9,
          notes = 'This card is properties of HEZO SCHOOL. If found, please return to school office.'
        WHERE user_id = $10;
      `, [employeeId, designation, department, blood, joiningDate, mobile, address, emergency, photoUrl, staff.user_id]);
    }
    console.log(`Updated ${staffRolesRes.rows.length} staff records.`);

    // 5) Seed visitor passes
    console.log("Seeding visitor passes...");
    await client.query('DELETE FROM public.visitor_passes WHERE school_id = $1', [schoolId]);
    
    const visitors = [
      { name: 'Rajesh Kumar', purpose: 'Parent-Teacher Meeting', contact: '+91 98989 89898', host: 'Senior Teacher (Mathematics)', passNo: 'VP-2026-0001', checkOut: null },
      { name: 'Dr. Priya Murthy', purpose: 'Guest Lecture in Science', contact: '+91 97979 79797', host: 'Science Dept', passNo: 'VP-2026-0002', checkOut: new Date().toISOString() },
      { name: 'Sanjay Dutt', purpose: 'Vendor Delivery', contact: '+91 96969 69696', host: 'Admissions Officer', passNo: 'VP-2026-0003', checkOut: null }
    ];

    for (const v of visitors) {
      await client.query(`
        INSERT INTO public.visitor_passes (school_id, visitor_name, purpose_of_visit, contact_number, host_name, pass_number, check_in_time, check_out_time)
        VALUES ($1, $2, $3, $4, $5, $6, NOW() - INTERVAL '2 hours', $7);
      `, [schoolId, v.name, v.purpose, v.contact, v.host, v.passNo, v.checkOut]);
    }
    console.log(`Seeded ${visitors.length} visitor passes.`);

    // 6) Seed ID card printing history
    console.log("Seeding ID card history logs...");
    await client.query('DELETE FROM public.id_card_history WHERE school_id = $1', [schoolId]);

    // Let's log two student cards and one staff card
    if (studentsRes.rows.length > 0) {
      await client.query(`
        INSERT INTO public.id_card_history (school_id, card_type, holder_id, academic_year, printed_by, printed_at, reason)
        VALUES ($1, 'student', $2, '2025-2026', $3, NOW() - INTERVAL '10 days', 'First Issue'),
               ($1, 'student', $4, '2025-2026', $3, NOW() - INTERVAL '2 days', 'Lost Card');
      `, [schoolId, studentsRes.rows[0].id, adminUserId, studentsRes.rows[1].id]);
    }

    if (staffRolesRes.rows.length > 0) {
      await client.query(`
        INSERT INTO public.id_card_history (school_id, card_type, holder_id, academic_year, printed_by, printed_at, reason)
        VALUES ($1, 'staff', $2, '2025-2026', $3, NOW() - INTERVAL '15 days', 'First Issue');
      `, [schoolId, staffRolesRes.rows[0].user_id, adminUserId]);
    }
    console.log("Seeded reprint history successfully.");

    console.log("Database migration and seeding completed successfully!");

  } catch (err) {
    console.error("Migration/Seeding failed:", err);
  } finally {
    await client.end();
    console.log("Database connection closed.");
  }
}

run();
