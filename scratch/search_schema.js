import fs from "fs";

// Read schema_dump.sql with UTF-16 LE encoding
const content = fs.readFileSync("schema_dump.sql", "utf16le");
const lines = content.split("\n");

lines.forEach((line, idx) => {
  if (line.toLowerCase().includes("create table") && line.toLowerCase().includes("exam")) {
    console.log(`${idx + 1}: ${line.trim()}`);
    // Print next 15 lines
    for (let i = 1; i <= 15; i++) {
      if (lines[idx + i]) console.log(`  ${lines[idx + i].trim()}`);
    }
    console.log("------------------");
  }
});
