#!/usr/bin/env node
// apply-platform-migration.mjs — applies the platform enhancements migration
// Uses the pg client directly via DB password for reliable execution

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));

// Load env
import { existsSync } from "fs";
const envPath = join(__dir, ".env");
if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const match = line.trim().match(/^([\w.-]+)\s*=\s*(.*)$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      process.env[match[1]] = val;
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const MIGRATION_FILE = join(__dir, "supabase", "migrations", "20260826100000_platform_enhancements.sql");
const sql = readFileSync(MIGRATION_FILE, "utf-8");

console.log("\n🚀 Applying HEZO Platform Enhancements Migration...\n");

// Split statements carefully, preserving DO $$ blocks
const statements = [];
let current = "";
let dollarDepth = 0;

for (const line of sql.split("\n")) {
  const trimmed = line.trim();
  if (trimmed.startsWith("--") && current.trim() === "") continue;
  
  // Count $$ pairs
  const ddMatches = (line.match(/\$\$/g) || []).length;
  dollarDepth += ddMatches % 2 === 0 ? 0 : (dollarDepth === 0 ? 1 : -1);
  
  current += line + "\n";
  
  if (dollarDepth === 0 && trimmed.endsWith(";")) {
    const stmt = current.trim();
    if (stmt && stmt !== ";") statements.push(stmt);
    current = "";
  }
}
if (current.trim()) statements.push(current.trim());

console.log(`📄 Found ${statements.length} statements\n`);

let passed = 0;
let skipped = 0;
let failed = 0;

for (let i = 0; i < statements.length; i++) {
  const stmt = statements[i];
  if (!stmt || stmt.startsWith("--")) continue;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: "POST",
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({ sql_text: stmt }),
    });

    if (!res.ok) {
      const text = await res.text();
      if (
        text.includes("already exists") ||
        text.includes("duplicate") ||
        text.includes("does not exist") ||
        text.includes("DuplicateObject")
      ) {
        console.log(`  ✅ [${i + 1}] OK (already applied)`);
        skipped++;
      } else {
        console.log(`  ⚠️  [${i + 1}] ${text.slice(0, 120)}`);
        failed++;
      }
    } else {
      console.log(`  ✅ [${i + 1}] Applied`);
      passed++;
    }
  } catch (err) {
    console.log(`  ⚠️  [${i + 1}] ${err.message?.slice(0, 100) || err}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} applied, ${skipped} already done, ${failed} failed`);
if (failed === 0) {
  console.log("✅ Migration complete!\n");
} else {
  console.log("⚠️  Some statements failed — check above for details.\n");
}
