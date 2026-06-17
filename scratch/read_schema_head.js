import fs from "fs";

const content = fs.readFileSync("schema_dump.sql", "utf8");
const lines = content.split("\n");

for (let i = 0; i < Math.min(lines.length, 50); i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
