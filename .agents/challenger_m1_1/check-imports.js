const fs = require('fs');
const path = require('path');

console.log("Scanning src/ directory for files importing products...");

function getFiles(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      files = files.concat(getFiles(filePath));
    } else if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
      files.push(filePath);
    }
  });
  return files;
}

const allFiles = getFiles(path.join(__dirname, '../../src'));
let importCount = 0;
let invalidImports = [];

allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const importMatches = content.match(/from\s+['"]([^'"]*products[^'"]*)['"]/g);
  if (importMatches) {
    console.log(`\nFile: ${path.relative(path.join(__dirname, '../../'), file)}`);
    importMatches.forEach(match => {
      importCount++;
      console.log(`  Import statement: ${match}`);
      const importPathMatch = match.match(/['"]([^'"]+)['"]/);
      if (importPathMatch) {
        const importPath = importPathMatch[1];
        // Check if the import path resolves or is correct
        if (importPath.startsWith('@/')) {
          const resolvedPath = path.join(__dirname, '../../src', importPath.substring(2) + '.ts');
          const resolvedPathTsx = path.join(__dirname, '../../src', importPath.substring(2) + '.tsx');
          if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPathTsx)) {
            invalidImports.push({ file, importPath, resolved: resolvedPath });
          }
        } else if (importPath.startsWith('.')) {
          const resolvedPath = path.resolve(path.dirname(file), importPath + '.ts');
          const resolvedPathTsx = path.resolve(path.dirname(file), importPath + '.tsx');
          if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPathTsx)) {
            invalidImports.push({ file, importPath, resolved: resolvedPath });
          }
        } else {
          console.log(`  Warning: External/Unknown alias import style: ${importPath}`);
        }
      }
    });
  }
});

console.log(`\nTotal product imports checked: ${importCount}`);
if (invalidImports.length > 0) {
  console.error("Found invalid/unresolved product imports:");
  invalidImports.forEach(imp => {
    console.error(`- In ${imp.file}: cannot resolve "${imp.importPath}" (tried ${imp.resolved})`);
  });
  process.exit(1);
} else {
  console.log("All product imports are valid and resolve correctly!");
  process.exit(0);
}
