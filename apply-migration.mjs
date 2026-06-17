#!/usr/bin/env node
// apply-migration.mjs — applies the final production fixes SQL migration
// directly via Supabase REST API using service_role key

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = "https://crypicuosxqquudpgosi.supabase.co";
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeXBpY3Vvc3hxcXV1ZHBnb3NpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDIyODU0NSwiZXhwIjoyMDk1ODA0NTQ1fQ.WBHduzvpxjjuWzPrwQWxU__akZc0Gj1sFpkMBeOcpXw";

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const MIGRATION_PATH = join(
  __dir,
  "supabase",
  "migrations",
  "20260610150000_final_production_fixes.sql",
);
const sql = readFileSync(MIGRATION_PATH, "utf-8");

// Split into individual statements (rough split on semicolons not in strings)
// Filter out comments and blank lines
const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

console.log(`\n🚀 Applying final production fixes migration...\n`);
console.log(`📄 Found ${statements.length} SQL statements\n`);

let passed = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i].trim();
  if (!stmt || stmt.startsWith("--")) continue;

  try {
    const { error } = await supabase.rpc("exec_sql", { sql_text: stmt + ";" }).single();
    if (error) {
      // Try direct query approach
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: "POST",
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql_text: stmt + ";" }),
      });

      if (!res.ok) {
        const text = await res.text();
        // Many statements like CREATE INDEX IF NOT EXISTS are fine to fail silently
        if (text.includes("already exists") || text.includes("duplicate")) {
          console.log(`  ✅ [${i + 1}] Already exists (OK)`);
          passed++;
        } else {
          console.log(`  ⚠️  [${i + 1}] ${text.slice(0, 100)}`);
          failed++;
        }
      } else {
        console.log(`  ✅ [${i + 1}] Applied`);
        passed++;
      }
    } else {
      console.log(`  ✅ [${i + 1}] Applied via RPC`);
      passed++;
    }
  } catch (err) {
    console.log(`  ⚠️  [${i + 1}] ${err.message?.slice(0, 100) || err}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} applied, ${failed} failed/skipped`);
console.log(`\n✅ Migration complete.\n`);
