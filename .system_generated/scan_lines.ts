import fs from 'fs';
import path from 'path';

function countLines(filePath: string): number {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content.split('\n').length;
}

function scanDir(dir: string, baseDir: string = dir): { path: string; lines: number; isOver300: boolean; isCloseTo300: boolean }[] {
  let results: { path: string; lines: number; isOver300: boolean; isCloseTo300: boolean }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      results = results.concat(scanDir(fullPath, baseDir));
    } else {
      const lines = countLines(fullPath);
      results.push({
        path: relPath,
        lines,
        isOver300: lines > 300,
        isCloseTo300: lines >= 250 && lines <= 300,
      });
    }
  }
  return results;
}

const srcDir = path.resolve('src');
const files = scanDir(srcDir, srcDir);

console.log('--- ALL FILES OVER 250 LINES ---');
files.filter(f => f.lines >= 250).forEach(f => {
  console.log(`${f.path}: ${f.lines} lines ${f.isOver300 ? '(OVER 300)' : '(CLOSE TO 300)'}`);
});

console.log('\nTotal scanned files:', files.length);
console.log('Files > 300 lines:', files.filter(f => f.isOver300).length);
console.log('Files 250-300 lines:', files.filter(f => f.isCloseTo300).length);
