import { getDbClient } from "./db_helper.mjs";
import fs from "fs";

let client;
try {
  client = getDbClient();
} catch (e) {
  console.error("❌ Database initialization failed:", e.message);
  process.exit(1);
}

function splitSql(sql) {
  const statements = [];
  let current = "";
  let inDollarQuote = false;
  let dollarQuoteTag = "";
  let inLineComment = false;
  let inBlockComment = false;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];

    // Check block comment start/end
    if (!inDollarQuote && !inLineComment && !inSingleQuote && !inDoubleQuote) {
      if (!inBlockComment && char === "/" && sql[i + 1] === "*") {
        inBlockComment = true;
        i++; // skip '*'
        continue;
      }
      if (inBlockComment && char === "*" && sql[i + 1] === "/") {
        inBlockComment = false;
        i++; // skip '/'
        continue;
      }
    }

    // Check line comment start/end
    if (!inDollarQuote && !inBlockComment && !inSingleQuote && !inDoubleQuote) {
      if (!inLineComment && char === "-" && sql[i + 1] === "-") {
        inLineComment = true;
        i++; // skip second '-'
        continue;
      }
      if (inLineComment && (char === "\n" || char === "\r")) {
        inLineComment = false;
        continue;
      }
    }

    // Skip appending characters if we are in a comment
    if (inLineComment || inBlockComment) {
      continue;
    }

    // Check single/double quotes start/end
    if (!inDollarQuote) {
      if (char === "'") {
        if (!inDoubleQuote) {
          if (inSingleQuote && sql[i + 1] === "'") {
            current += "''";
            i++;
            continue;
          }
          inSingleQuote = !inSingleQuote;
        }
      } else if (char === '"') {
        if (!inSingleQuote) {
          inDoubleQuote = !inDoubleQuote;
        }
      }
    }

    // Check for dollar quote start/end (e.g. $$ or $function$)
    if (!inSingleQuote && !inDoubleQuote && char === "$") {
      const nextDollar = sql.indexOf("$", i + 1);
      if (nextDollar !== -1 && nextDollar - i < 50) {
        const tag = sql.substring(i, nextDollar + 1);
        if (/^\$[a-zA-Z0-9_]*\$$/.test(tag)) {
          if (!inDollarQuote) {
            inDollarQuote = true;
            dollarQuoteTag = tag;
          } else if (tag === dollarQuoteTag) {
            inDollarQuote = false;
            dollarQuoteTag = "";
          }
          current += tag;
          i = nextDollar;
          continue;
        }
      }
    }

    current += char;

    // Split on semicolon if we are not inside a function body, comment, or string
    if (char === ";" && !inDollarQuote && !inSingleQuote && !inDoubleQuote) {
      statements.push(current.trim());
      current = "";
    }
  }

  if (current.trim().length > 0) {
    statements.push(current.trim());
  }

  return statements;
}

async function run() {
  try {
    await client.connect();
    console.log("Connected to Supabase Postgres.");

    const sql = fs.readFileSync("schema_dump_utf8.sql", "utf8");

    // Parse statements using our dollar-quote aware splitter
    const statements = splitSql(sql)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`🚀 Found ${statements.length} SQL statements to execute.`);

    let count = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      try {
        await client.query(stmt);
        count++;
      } catch (err) {
        // Many statements like CREATE OR REPLACE function/policy might fail if dependencies are not built,
        // but since we run sequentially, we will output warnings.
        if (err.message.includes("already exists") || err.message.includes("duplicate")) {
          count++;
        } else {
          console.warn(`  ⚠️ Statement [${i + 1}] failed: ${err.message}`);
          console.warn(`    SQL: ${stmt.slice(0, 150)}...\n`);
        }
      }
    }

    console.log(
      `✅ Schema dump applied successfully. Executed ${count} of ${statements.length} statements.`,
    );
  } catch (err) {
    console.error("❌ Schema import failed:", err);
  } finally {
    await client.end();
  }
}

run();
