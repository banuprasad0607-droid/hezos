import fs from 'fs';

const filePath = 'src/routes/_authenticated/achievements.tsx';
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

const keywords = ['exams', 'exam_marks', 'subject_allocations', 'subject_id'];

lines.forEach((line, idx) => {
  const match = keywords.some(k => line.includes(k));
  if (match) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
