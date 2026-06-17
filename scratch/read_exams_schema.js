import fs from "fs";

const content = fs.readFileSync("schema_dump.sql", "utf8");
const lines = content.split("\n");

let print = false;
let bracketCount = 0;

lines.forEach((line, idx) => {
  if (line.includes("CREATE TABLE public.exams ") || line.includes("CREATE TABLE public.exams(")) {
    print = true;
    console.log(`--- Line ${idx + 1}: exams ---`);
  }
  if (
    line.includes("CREATE TABLE public.exam_subjects ") ||
    line.includes("CREATE TABLE public.exam_subjects(")
  ) {
    print = true;
    console.log(`--- Line ${idx + 1}: exam_subjects ---`);
  }
  if (print) {
    console.log(line);
    if (line.includes(");")) {
      print = false;
      console.log("-----------------------------\n");
    }
  }
});
