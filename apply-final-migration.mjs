#!/usr/bin/env node
// apply-final-migration.mjs
// Applies the final production SQL fixes using Supabase Management API

const PROJECT_REF = "crypicuosxqquudpgosi";
const SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeXBpY3Vvc3hxcXV1ZHBnb3NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyODU0NSwiZXhwIjoyMDk1ODA0NTQ1fQ.WBHduzvpxjjuWzPrwQWxU__akZc0Gj1sFpkMBeOcpXw";

// Individual SQL statements to apply
const statements = [
  // Performance indexes
  `CREATE INDEX IF NOT EXISTS idx_fee_invoices_school ON public.fee_invoices(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_invoices_student ON public.fee_invoices(student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_invoices_status ON public.fee_invoices(status)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_structures_school ON public.fee_structures(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_payments_invoice ON public.fee_payments(invoice_id)`,
  `CREATE INDEX IF NOT EXISTS idx_fee_payments_school ON public.fee_payments(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_rankings_school ON public.rankings(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_rankings_student ON public.rankings(student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_awards_school ON public.awards(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_awards_student ON public.awards(student_id)`,
  `CREATE INDEX IF NOT EXISTS idx_profiles_school ON public.profiles(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_roles_school ON public.user_roles(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role)`,
  `CREATE INDEX IF NOT EXISTS idx_id_card_history_school ON public.id_card_history(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_visitor_passes_school ON public.visitor_passes(school_id)`,
  `CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON public.announcements(created_at)`,
  `CREATE INDEX IF NOT EXISTS idx_homework_due_date ON public.homework(due_date)`,
  `CREATE INDEX IF NOT EXISTS idx_remarks_school ON public.remarks(school_id)`,
  // Super admin RLS policies
  `DROP POLICY IF EXISTS "Super admin reads all schools" ON public.schools`,
  `CREATE POLICY "Super admin reads all schools" ON public.schools FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role::text = 'super_admin'))`,
  `DROP POLICY IF EXISTS "Super admin manages all schools" ON public.schools`,
  `CREATE POLICY "Super admin manages all schools" ON public.schools FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role::text = 'super_admin')) WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role::text = 'super_admin'))`,
  `DROP POLICY IF EXISTS "Super admin reads all profiles" ON public.profiles`,
  `CREATE POLICY "Super admin reads all profiles" ON public.profiles FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role::text = 'super_admin'))`,
];

console.log(`\n🚀 Applying ${statements.length} production SQL fixes...\n`);

let passed = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const sql = statements[i];
  const label = sql.slice(0, 60) + "...";

  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({ query: sql }),
    });

    if (res.ok) {
      console.log(`  ✅ [${i + 1}] ${label}`);
      passed++;
    } else {
      const txt = await res.text();
      if (txt.includes("already exists") || txt.includes("duplicate key")) {
        console.log(`  ✅ [${i + 1}] Already exists — ${label}`);
        passed++;
      } else {
        console.log(`  ⚠️  [${i + 1}] ${txt.slice(0, 120)}`);
        failed++;
      }
    }
  } catch (err) {
    console.log(`  ❌ [${i + 1}] ${err.message}`);
    failed++;
  }
}

console.log(`\n📊 ${passed} succeeded, ${failed} failed/skipped`);
console.log(`✅ Done.\n`);
