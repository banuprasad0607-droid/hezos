import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const ARTIFACT_DIR = 'C:\\Users\\banup\\.gemini\\antigravity\\brain\\06b37cee-8ad9-40c9-8b2f-9b34e6208fef';
const email = 'qa_admin_1781532222398@gmail.com';
const password = 'Pass_1781532222398!';

const ROUTES = [
  { name: '01_Dashboard', path: '/dashboard' },
  { name: '02_Classes', path: '/classes' },
  { name: '03_Attendance', path: '/attendance' },
  { name: '04_Homework', path: '/homework' },
  { name: '05_Remarks', path: '/remarks' },
  { name: '06_MarksManagement', path: '/marks' },
  { name: '07_ReportCards', path: '/report-cards' },
  { name: '08_Certificates', path: '/achievements' },
  { name: '09_IDCards', path: '/id-cards' },
  { name: '10_LeaveRequests', path: '/leaves' },
  { name: '11_Announcements', path: '/announcements' },
  { name: '12_StudentsParents', path: '/students' },
  { name: '13_Notifications', path: '/notifications' },
  { name: '14_AdminPanel', path: '/admin' },
  { name: '15_Billing', path: '/admin/billing' },
  { name: '16_Fees', path: '/fees' },
  { name: '17_Payroll', path: '/payroll' },
  { name: '18_Analytics', path: '/analytics' },
  { name: '19_TeacherAllocations', path: '/teacher-allocations' },
  { name: '20_InviteTeachers', path: '/invitations' },
  { name: '21_RecycleBin', path: '/recycle-bin' },
  { name: '22_ChangePassword', path: '/change-password' },
  { name: '23_WhatsApp', path: '/admin/whatsapp' }
];

async function run() {
  console.log('Starting Complete E2E Audit...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const auditLog = [];

  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' || text.includes('invalid') || text.includes('failed')) {
      console.log(`[CONSOLE] [${msg.type()}]:`, text);
      auditLog.push({ type: 'console', severity: msg.type(), message: text });
    }
  });

  page.on('pageerror', err => {
    console.error('[PAGE ERROR]:', err.message);
    auditLog.push({ type: 'pageerror', severity: 'error', message: err.message });
  });

  page.on('response', async response => {
    const url = response.url();
    const status = response.status();
    if (url.includes('supabase.co') && status >= 400) {
      try {
        const text = await response.text();
        console.log(`[API ERROR] [${status}] ${url}: ${text}`);
        auditLog.push({ type: 'api', severity: 'error', url, status, response: text });
      } catch (e) {
        console.log(`[API ERROR] [${status}] ${url} (Could not read body)`);
        auditLog.push({ type: 'api', severity: 'error', url, status, response: 'Could not read body' });
      }
    }
  });

  try {
    // 1. Log in
    console.log('Logging in...');
    await page.goto('http://localhost:8080/login', { waitUntil: 'networkidle2' });
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 2. Iterate through routes
    for (const route of ROUTES) {
      console.log(`Auditing route: ${route.name} (${route.path})...`);
      try {
        await page.goto(`http://localhost:8080${route.path}`, { waitUntil: 'networkidle2' });
      } catch (e) {
        console.log(`Navigation to ${route.path} triggered standard timeout, waiting 3s...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const screenshotPath = path.join(ARTIFACT_DIR, `${route.name}.png`);
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot to ${route.name}.png`);

      const pageText = await page.evaluate(() => document.body.innerText);
      const containsError = pageText.toLowerCase().includes('error') || pageText.toLowerCase().includes('invalid');
      
      auditLog.push({
        type: 'route',
        name: route.name,
        path: route.path,
        screenshot: `${route.name}.png`,
        containsTextError: containsError,
        snippet: pageText.substring(0, 300).replace(/\n/g, ' ')
      });
    }

    console.log('Audit completed. Writing audit log...');
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'audit_run_log.json'),
      JSON.stringify(auditLog, null, 2)
    );
    console.log('Audit log written to audit_run_log.json.');

  } catch (error) {
    console.error('Audit crashed:', error);
  } finally {
    await browser.close();
  }
}

run();
