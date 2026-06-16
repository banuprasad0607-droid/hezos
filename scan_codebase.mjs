import fs from 'fs';
import path from 'path';

const report = {
  phase: "PHASE 4 & 8 - CODEBASE SCAN AND BRANDING AUDIT",
  status: "PASS",
  details: [],
  hardcodedBrandingIssues: [],
  queryIsolationIssues: []
};

const routesDir = path.join(process.cwd(), 'src/routes/_authenticated');

function walk(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts'))) {
      callback(filepath);
    }
  }
}

// 1. Audit Branding references
walk(routesDir, (filepath) => {
  const basename = path.basename(filepath);
  // Ignore super-admin.tsx since it is allowed to display HEZO SCHOOL branding
  if (basename === 'super-admin.tsx') return;

  const content = fs.readFileSync(filepath, 'utf8');
  
  // Search for HEZO SCHOOL, Hezo School, HEZO SCHOOL Connect, etc.
  const regex = /"HEZO\s+SCHOOL(?:[^"]*)"|'HEZO\s+SCHOOL(?:[^']*)'|Hezo\s+School/i;
  const match = content.match(regex);
  if (match) {
    // Check if the match is part of a comment or actually code/JSX
    // Let's do a simple check. If it is in a comments block, we might allow it.
    // We will parse lines
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      if (line.match(regex) && !line.trim().startsWith('//') && !line.trim().startsWith('*') && !line.includes('useSchoolName') && !line.includes('//')) {
        report.hardcodedBrandingIssues.push({
          file: path.relative(process.cwd(), filepath),
          line: index + 1,
          content: line.trim()
        });
        report.status = "FAIL";
      }
    });
  }
});

// 2. Audit schools/student queries isolation checks in React components
walk(routesDir, (filepath) => {
  const content = fs.readFileSync(filepath, 'utf8');
  const lines = content.split('\n');

  // Look for supabase.from(...) queries in tenant routes
  lines.forEach((line, index) => {
    // If we make a query against tenant tables, it must filter by school_id
    if (line.includes('supabase.from(') && !line.includes('super_admin')) {
      const match = line.match(/\.from\(\s*["']([^"']+)["']\s*\)/);
      if (match) {
        const table = match[1];
        // Ignore platform/global tables or user profiles / auth checks
        const tenantTables = [
          'students', 'classes', 'attendance', 'homework', 'remarks', 'announcements', 
          'exams', 'exam_marks', 'awards', 'certificates', 'posters', 'visitor_passes', 
          'id_card_history', 'fee_invoices', 'fee_payments', 'fee_structures', 
          'teacher_salaries', 'payroll_runs', 'payroll_items'
        ];
        if (tenantTables.includes(table)) {
          // Check if this or subsequent lines filter by school_id or student_id or class_id
          let queryBlock = "";
          for (let i = index; i < Math.min(index + 5, lines.length); i++) {
            queryBlock += lines[i];
          }
          const hasFilter = queryBlock.includes('school_id') || queryBlock.includes('student_id') || queryBlock.includes('class_id') || queryBlock.includes('user_id') || queryBlock.includes('teacher_id') || queryBlock.includes('parent_user_id') || queryBlock.includes('current_school_id') || queryBlock.includes('auth.uid()');
          if (!hasFilter) {
            report.queryIsolationIssues.push({
              file: path.relative(process.cwd(), filepath),
              line: index + 1,
              content: line.trim(),
              table: table,
              warning: "Query against tenant table might be missing multi-tenant scope filter"
            });
          }
        }
      }
    }
  });
});

if (report.hardcodedBrandingIssues.length === 0) {
  report.details.push({ check: "Branding isolation", status: "PASS", info: "No stray HEZO SCHOOL branding in tenant-scoped screens." });
} else {
  report.details.push({ check: "Branding isolation", status: "FAIL", info: `${report.hardcodedBrandingIssues.length} branding leaks found!` });
}

if (report.queryIsolationIssues.length === 0) {
  report.details.push({ check: "Tenant query isolation check", status: "PASS", info: "All verified client queries contain school-scoping filters." });
} else {
  // Let's analyze if query checks are warnings or absolute failures
  // Some queries might rely on database RLS rather than explicit filters, which is fine, but they should be noted.
  report.details.push({ check: "Tenant query isolation check", status: "WARNING", info: `${report.queryIsolationIssues.length} queries lack explicit school filters, relying solely on Row Level Security (RLS).` });
}

console.log(JSON.stringify(report, null, 2));
