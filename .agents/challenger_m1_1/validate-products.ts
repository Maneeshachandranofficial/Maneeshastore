import { products } from '../../src/lib/products';

console.log("Starting verification of products...");

let errors: string[] = [];

// 1. All 32 unique products exist in the centralized array
const ids = products.map(p => p.id);
const uniqueIds = new Set(ids);

if (products.length !== 32) {
  errors.push(`Expected 32 products, found ${products.length}`);
}

if (uniqueIds.size !== products.length) {
  errors.push(`Duplicate IDs found: ${ids.filter((item, index) => ids.indexOf(item) !== index)}`);
}

// 2. Every product has a valid ID, title, price, category, and requiresSize boolean flag
// 3. The categories are strictly 'bride' | 'groom' | 'girls' | 'boys'
// 4. Products requiring size selection (e.g., those with defined size arrays) have requiresSize: true and those without have requiresSize: false

products.forEach(p => {
  if (typeof p.id !== 'number' || p.id <= 0) {
    errors.push(`Product ${p.title || p.id}: Invalid ID ${p.id}`);
  }
  if (typeof p.title !== 'string' || !p.title.trim()) {
    errors.push(`Product ID ${p.id}: Invalid title "${p.title}"`);
  }
  if (typeof p.price !== 'string' || !p.price.trim()) {
    errors.push(`Product ID ${p.id}: Invalid price "${p.price}"`);
  }
  if (typeof p.requiresSize !== 'boolean') {
    errors.push(`Product ID ${p.id}: requiresSize must be boolean, found ${p.requiresSize}`);
  }
  
  const allowedCategories = ['bride', 'groom', 'girls', 'boys'];
  if (!allowedCategories.includes(p.category)) {
    errors.push(`Product ID ${p.id}: Invalid category "${p.category}". Must be one of ${allowedCategories.join(', ')}`);
  }
  
  const hasSizes = Array.isArray(p.sizes) && p.sizes.length > 0;
  if (hasSizes && !p.requiresSize) {
    errors.push(`Product ID ${p.id}: has sizes defined (${JSON.stringify(p.sizes)}) but requiresSize is false`);
  }
  if (!hasSizes && p.requiresSize) {
    errors.push(`Product ID ${p.id}: requiresSize is true but sizes is undefined or empty`);
  }
});

if (errors.length > 0) {
  console.error("Verification failed with the following errors:");
  errors.forEach(err => console.error(`- ${err}`));
  process.exit(1);
} else {
  console.log("All verifications passed successfully!");
  process.exit(0);
}
