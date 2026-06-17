import fs from "fs";

try {
  const buf = fs.readFileSync("schema_dump.sql");
  let text;

  if (buf[0] === 0xff && buf[1] === 0xfe) {
    // UTF-16LE BOM
    text = buf.toString("utf16le");
    console.log("Detected UTF-16LE file. Converting...");
  } else {
    text = buf.toString("utf8");
    console.log("Read as UTF-8.");
  }

  // Remove BOM if present at start of text
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  fs.writeFileSync("schema_dump_utf8.sql", text, "utf8");
  console.log("✅ Successfully wrote UTF-8 version as schema_dump_utf8.sql");
} catch (e) {
  console.error("Conversion failed:", e);
}
