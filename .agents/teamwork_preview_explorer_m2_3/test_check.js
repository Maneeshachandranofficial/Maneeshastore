const fs = require('fs');
const path = require('path');

const file1 = 'src/app/collections/[slug]/page.tsx';
const file2 = 'src/components/CategoryPage.tsx';

function check(file) {
  const content = fs.readFileSync(path.resolve(__dirname, '../../..', file), 'utf8');
  const isResponsive = content.includes('grid') && (content.includes('grid-cols-1') || content.includes('grid-cols-2') || content.includes('flex'));
  console.log(`${file}: isResponsive = ${isResponsive}`);
  console.log(`- contains grid: ${content.includes('grid')}`);
  console.log(`- contains grid-cols-1: ${content.includes('grid-cols-1')}`);
  console.log(`- contains grid-cols-2: ${content.includes('grid-cols-2')}`);
  console.log(`- contains flex: ${content.includes('flex')}`);
}

try {
  check(file1);
} catch (e) {
  console.error(e);
}

try {
  check(file2);
} catch (e) {
  console.error(e);
}
