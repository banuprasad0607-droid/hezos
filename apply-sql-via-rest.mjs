#!/usr/bin/env node
// apply-sql-via-rest.mjs
// Applies production SQL via Supabase's built-in pg_net / raw SQL execution
// Uses the service_role key which has full database permissions

const SUPABASE_URL = 'https://crypicuosxqquudpgosi.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeXBpY3Vvc3hxcXV1ZHBnb3NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyODU0NSwiZXhwIjoyMDk1ODA0NTQ1fQ.WBHduzvpxjjuWzPrwQWxU__akZc0Gj1sFpkMBeOcpXw';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// Test connectivity first
const { data: testData, error: testErr } = await supabase.from('schools').select('id').limit(1);
if (testErr) {
  console.error('❌ Connection failed:', testErr.message);
  process.exit(1);
}
console.log('✅ Connected to Supabase. Schools table accessible.');
console.log(`   Found at least ${testData.length} school(s).\n`);

// Index creation queries — using Supabase's rpc if available
// Since we can't run raw DDL through REST API without a custom function,
// let's verify what we can and report the status.

// Check existing indexes
const indexCheckQuery = `
SELECT indexname, tablename
FROM pg_indexes 
WHERE schemaname = 'public'
  AND tablename IN ('fee_invoices', 'fee_structures', 'fee_payments', 'rankings', 'awards', 'profiles', 'user_roles', 'id_card_history', 'visitor_passes', 'homework', 'remarks', 'announcements')
ORDER BY tablename, indexname
`;

// Check existing RLS policies
const policyCheckQuery = `
SELECT policyname, tablename
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('schools', 'students', 'profiles', 'user_roles')
ORDER BY tablename, policyname
`;

// Use the pgmeta endpoint if available (Supabase exposes this)
const headers = {
  'apikey': SERVICE_ROLE_KEY,
  'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json'
};

// Try /rest/v1 with a raw SQL via the pg_catalog approach
async function execSQL(sql, label) {
  // Method 1: Try via RPC
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  if (!error) {
    console.log(`  ✅ ${label}`);
    return true;
  }

  // Method 2: Try via pg/query endpoint (sometimes available)
  const res = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: sql })
  });
  if (res.ok) {
    console.log(`  ✅ ${label}`);
    return true;
  }
  
  console.log(`  ⚠️  ${label} — requires manual SQL execution`);
  return false;
}

console.log('📋 Checking current database state...\n');

// Report on indexes
const { data: indexes } = await supabase
  .from('pg_indexes' as any)
  .select('indexname, tablename')
  .in('tablename', ['fee_invoices', 'fee_structures', 'fee_payments', 'rankings', 'awards'])
  .limit(50);

if (indexes) {
  console.log(`Found ${indexes.length} existing performance indexes on key tables.\n`);
}

// Report on RLS policies  
const { data: policies } = await supabase
  .from('pg_policies' as any)
  .select('policyname, tablename')
  .in('tablename', ['schools', 'students', 'profiles'])
  .limit(50);

if (policies) {
  console.log('Current RLS policies:');
  policies.forEach(p => console.log(`  - ${p.tablename}: ${p.policyname}`));
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 MANUAL SQL REQUIRED — Apply in Supabase SQL Editor
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Open: https://supabase.com/dashboard/project/crypicuosxqquudpgosi/sql/new

Copy and run the migration file:
  supabase/migrations/20260610150000_final_production_fixes.sql

This adds:
  ✓ 19 performance indexes on hot tables
  ✓ Super admin RLS policies for schools, profiles, user_roles
  ✓ Proper grants for teacher_attendance table

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
