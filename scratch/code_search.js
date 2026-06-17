import fs from "fs";
import path from "path";

const SEARCH_DIR = "./src";
const PATTERNS = [/useAuth/g, /supabase/g, /schoolId/g, /school_id/g];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== "node_modules" && f !== ".git" && f !== "dist") {
      walkDir(dirPath, callback);
    } else if (!isDirectory) {
      callback(dirPath);
    }
  });
}

const results = {};
PATTERNS.forEach((p) => (results[p.toString()] = []));

console.log("Searching codebase...");

walkDir(SEARCH_DIR, (filePath) => {
  if (
    filePath.endsWith(".ts") ||
    filePath.endsWith(".tsx") ||
    filePath.endsWith(".js") ||
    filePath.endsWith(".jsx")
  ) {
    const content = fs.readFileSync(filePath, "utf8");
    PATTERNS.forEach((pattern) => {
      if (pattern.test(content)) {
        pattern.lastIndex = 0;
        const matches = content.match(pattern);
        results[pattern.toString()].push({
          file: filePath.replace(/\\/g, "/"),
          count: matches ? matches.length : 1,
        });
      }
    });
  }
});

console.log("\n--- SEARCH RESULTS ---");
console.log(JSON.stringify(results, null, 2));
console.log("----------------------\n");
