import fs from 'fs';
import path from 'path';

const SEARCH_DIR = './src';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory && f !== 'node_modules' && f !== '.git' && f !== 'dist') {
      walkDir(dirPath, callback);
    } else if (!isDirectory) {
      callback(dirPath);
    }
  });
}

walkDir(SEARCH_DIR, (filePath) => {
  if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('profiles') || line.includes('school-context')) {
        console.log(`${filePath}:${idx + 1}: ${line.trim()}`);
      }
    });
  }
});
