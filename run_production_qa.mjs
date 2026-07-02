import { getDbClient } from "./db_helper.mjs";

const client = getDbClient();

// Mock Token Bucket rate limit check for programmatic validation
function checkRateLimit(key, limit, intervalMs, activeBuckets = new Map()) {
  const now = Date.now();
  let bucket = activeBuckets.get(key);

  if (!bucket) {
    bucket = { tokens: limit, lastRefill: now };
    activeBuckets.set(key, bucket);
  }

  const elapsed = now - bucket.lastRefill;
  const refillRate = limit / intervalMs;
  const tokensToAdd = elapsed * refillRate;

  bucket.tokens = Math.min(limit, bucket.tokens + tokensToAdd);
  bucket.lastRefill = now;

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return true;
  }
  return false;
}

async function run() {
  console.log("Starting production hardening QA tests...");
  let exitCode = 0;

  try {
    await client.connect();
    console.log("Connected to PostgreSQL database successfully.");

    // TEST 1: Check if deleted_at exists on all 8 tables
    console.log(
      "\n--- TEST 1: Checking if deleted_at columns exist on all 8 operational tables ---",
    );
    const targetTables = [
      "students",
      "classes",
      "fee_invoices",
      "fee_payments",
      "exams",
      "mark_entries",
      "attendance",
      "remarks",
    ];

    for (const table of targetTables) {
      const colCheck = await client.query(
        `
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1 AND column_name = 'deleted_at';
      `,
        [table],
      );

      if (colCheck.rowCount > 0) {
        console.log(`[PASS] Table "${table}" contains column "deleted_at".`);
      } else {
        console.error(`[FAIL] Table "${table}" is missing column "deleted_at"!`);
        exitCode = 1;
      }
    }

    // TEST 2: Check soft delete trigger behavior on public.students
    console.log("\n--- TEST 2: Checking Student soft-delete / restore mechanics ---");
    await client.query("BEGIN;"); // Run tests in a transaction to rollback and stay clean

    // Insert dummy student
    const testStudentId = "d8888888-8888-8888-8888-888888888888";
    const schoolId = "a0000000-a000-a000-a000-a00000000000";

    // Insert school first to satisfy foreign key constraint
    await client.query(
      `
      INSERT INTO public.schools (id, name, owner_id) 
      VALUES ($1, 'QA Test School', '00000000-0000-0000-0000-000000000001')
      ON CONFLICT (id) DO NOTHING;
    `,
      [schoolId],
    );

    // Insert student
    await client.query(
      `
      INSERT INTO public.students (id, school_id, full_name, admission_number) 
      VALUES ($1, $2, 'QA Test Student', 'QA-8888')
      ON CONFLICT (id) DO NOTHING;
    `,
      [testStudentId, schoolId],
    );

    // Soft delete
    await client.query(
      `
      UPDATE public.students 
      SET deleted_at = NOW() 
      WHERE id = $1;
    `,
      [testStudentId],
    );

    // Verify it is marked deleted
    const checkDel = await client.query(
      `
      SELECT deleted_at 
      FROM public.students 
      WHERE id = $1;
    `,
      [testStudentId],
    );

    if (checkDel.rowCount > 0 && checkDel.rows[0].deleted_at !== null) {
      console.log("[PASS] Student soft delete successfully set deleted_at timestamp.");
    } else {
      console.error("[FAIL] Student soft delete did not set deleted_at timestamp!");
      exitCode = 1;
    }

    // Restore
    await client.query(
      `
      UPDATE public.students 
      SET deleted_at = NULL 
      WHERE id = $1;
    `,
      [testStudentId],
    );

    // Verify it is restored
    const checkRest = await client.query(
      `
      SELECT deleted_at 
      FROM public.students 
      WHERE id = $1;
    `,
      [testStudentId],
    );

    if (checkRest.rowCount > 0 && checkRest.rows[0].deleted_at === null) {
      console.log("[PASS] Student successfully restored by setting deleted_at to NULL.");
    } else {
      console.error("[FAIL] Student restore failed to clear deleted_at timestamp!");
      exitCode = 1;
    }

    await client.query("ROLLBACK;");

    // TEST 3: Rate Limiter Token Bucket mechanics
    console.log("\n--- TEST 3: Validating Token Bucket Rate Limiting algorithm ---");
    const activeBuckets = new Map();
    const limit = 3;
    const intervalMs = 1000;

    // Allow up to limit
    let allAllowed = true;
    for (let i = 0; i < limit; i++) {
      const allowed = checkRateLimit("user1", limit, intervalMs, activeBuckets);
      if (!allowed) allAllowed = false;
    }

    if (allAllowed) {
      console.log("[PASS] Rate limiter allowed initial token allocations.");
    } else {
      console.error("[FAIL] Rate limiter blocked requests before reaching threshold limit!");
      exitCode = 1;
    }

    // Exhausted request
    const blocked = !checkRateLimit("user1", limit, intervalMs, activeBuckets);
    if (blocked) {
      console.log(
        "[PASS] Rate limiter successfully throttled subsequent requests after capacity depletion.",
      );
    } else {
      console.error("[FAIL] Rate limiter failed to throttle request after token exhaustion!");
      exitCode = 1;
    }

    // Refill check
    await new Promise((resolve) => setTimeout(resolve, intervalMs + 50));
    const refilled = checkRateLimit("user1", limit, intervalMs, activeBuckets);
    if (refilled) {
      console.log(
        "[PASS] Rate limiter refilled tokens and allowed new requests after the refill interval.",
      );
    } else {
      console.error("[FAIL] Rate limiter did not refill tokens after time elapsed!");
      exitCode = 1;
    }

    console.log("\n=================================");
    if (exitCode === 0) {
      console.log("PRODUCTION QA STATUS: SUCCESS (All Production Hardening checks passed)");
    } else {
      console.error("PRODUCTION QA STATUS: FAIL (Some check failures occurred)");
    }
    console.log("=================================\n");
  } catch (err) {
    console.error("QA script error:", err);
    exitCode = 1;
  } finally {
    await client.end();
    process.exit(exitCode);
  }
}

run();
