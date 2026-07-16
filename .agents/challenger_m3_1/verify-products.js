const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../../src/lib/products.ts');
const content = fs.readFileSync(filePath, 'utf8');

// Match all price: '...' in the file
const priceRegex = /price:\s*['"`]([^'"`]+)['"`]/g;
let match;
const prices = [];

while ((match = priceRegex.exec(content)) !== null) {
  prices.push(match[1]);
}

console.log(`Found ${prices.length} product prices.`);

let failed = 0;
prices.forEach((priceStr, index) => {
  const parsed = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
  if (isNaN(parsed)) {
    console.error(`❌ Product price at index ${index} failed to parse: "${priceStr}" -> NaN`);
    failed++;
  } else {
    // console.log(`✅ Parsed: "${priceStr}" -> ${parsed}`);
  }
});

if (failed === 0) {
  console.log('✅ All product prices parsed successfully to integers!');
} else {
  console.log(`❌ Failed to parse ${failed} product prices.`);
}
