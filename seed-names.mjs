import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const SCHOOLS = [
  { id: 'af1daae9-aa47-4647-9911-4fea8a2b3301', classId: '885a7d6d-9950-4eec-93a8-2fb2673c1216' }, // Gopal School
  { id: '37fc05aa-42bd-4e10-bae1-2278ae17f00c', classId: '58f33f79-2434-4408-82d1-e021307ae311' }  // niro School
];

const TEST_STUDENTS = [
  {
    full_name: 'Bhanu',
    admission_number: 'ADM-2026-B1',
    roll_number: '11',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80',
    date_of_birth: '2018-05-15',
    blood_group: 'O+',
    emergency_contact: '+91 99999 88888',
    parent_name: 'Venkata Rao',
    parent_phone: '+91 99999 88888',
    academic_year: '2025-2026'
  },
  {
    full_name: 'Sai Charan Reddy',
    admission_number: 'ADM-2026-S2',
    roll_number: '12',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&fit=crop&q=80',
    date_of_birth: '2018-08-20',
    blood_group: 'A+',
    emergency_contact: '+91 88888 77777',
    parent_name: 'Malleswara Reddy',
    parent_phone: '+91 88888 77777',
    academic_year: '2025-2026'
  },
  {
    full_name: 'Ananya Lakshmi Narayana',
    admission_number: 'ADM-2026-A3',
    roll_number: '13',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&fit=crop&q=80',
    date_of_birth: '2018-11-10',
    blood_group: 'B+',
    emergency_contact: '+91 77777 66666',
    parent_name: 'Satyanarayana',
    parent_phone: '+91 77777 66666',
    academic_year: '2025-2026'
  },
  {
    full_name: 'Peddinti Venkata Sai Srinivasa Rao',
    admission_number: 'ADM-2026-P4',
    roll_number: '14',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&fit=crop&q=80',
    date_of_birth: '2018-03-25',
    blood_group: 'O-',
    emergency_contact: '+91 66666 55555',
    parent_name: 'P. V. Krishna Rao',
    parent_phone: '+91 66666 55555',
    academic_year: '2025-2026'
  }
];

async function seed() {
  console.log("Seeding test students with short, medium, and long names...");

  for (const school of SCHOOLS) {
    console.log(`Seeding for school: ${school.id}`);
    for (const student of TEST_STUDENTS) {
      const { data, error } = await supabase.from('students').insert({
        school_id: school.id,
        class_id: school.classId,
        full_name: student.full_name,
        admission_number: student.admission_number,
        roll_number: student.roll_number,
        photo_url: student.photo_url,
        date_of_birth: student.date_of_birth,
        blood_group: student.blood_group,
        emergency_contact: student.emergency_contact,
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
        academic_year: student.academic_year
      }).select();

      if (error) {
        console.error(`Failed to insert student ${student.full_name}:`, error.message);
      } else {
        console.log(`Inserted student ${student.full_name}:`, data[0]?.id);
      }
    }
  }

  console.log("Seeding complete.");
}

seed();
