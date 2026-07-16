import { products } from '../../src/lib/products';

function runValidation() {
  const errors: string[] = [];
  const warnings: string[] = [];

  console.log(`Starting validation of products data. Total items: ${products.length}`);

  // 1. All 32 unique products exist in the centralized array in src/lib/products.ts
  if (products.length !== 32) {
    errors.push(`Product count is ${products.length}, expected exactly 32 unique products.`);
  }

  const ids = new Set<number>();
  const titles = new Set<string>();

  for (const product of products) {
    const { id, title, price, category, requiresSize, sizes } = product;

    // 2. Every product has a valid ID, title, price, category, and requiresSize boolean flag
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      errors.push(`Product has invalid ID: ${JSON.stringify(product)}`);
    } else {
      if (ids.has(id)) {
        errors.push(`Duplicate product ID found: ${id}`);
      }
      ids.add(id);
    }

    if (typeof title !== 'string' || !title.trim()) {
      errors.push(`Product with ID ${id} has invalid title: ${JSON.stringify(title)}`);
    } else {
      if (titles.has(title)) {
        warnings.push(`Duplicate product title found: "${title}" (ID ${id})`);
      }
      titles.add(title);
    }

    if (typeof price !== 'string' || !price.trim()) {
      errors.push(`Product with ID ${id} has invalid price: ${JSON.stringify(price)}`);
    }

    if (typeof requiresSize !== 'boolean') {
      errors.push(`Product with ID ${id} has invalid requiresSize (must be a boolean): ${JSON.stringify(requiresSize)}`);
    }

    // 3. The categories are strictly 'bride' | 'groom' | 'girls' | 'boys'
    const allowedCategories = ['bride', 'groom', 'girls', 'boys'];
    if (!allowedCategories.includes(category)) {
      errors.push(`Product with ID ${id} has invalid category: ${JSON.stringify(category)}. Must be one of ${allowedCategories.join(', ')}`);
    }

    // 4. Products requiring size selection (e.g., those with defined size arrays) have requiresSize: true and those without have requiresSize: false
    const hasSizes = Array.isArray(sizes) && sizes.length > 0;
    if (hasSizes && !requiresSize) {
      errors.push(`Product with ID ${id} has a sizes array but requiresSize is false.`);
    }
    if (!hasSizes && requiresSize) {
      errors.push(`Product with ID ${id} has requiresSize as true but no sizes array (or empty sizes array).`);
    }
  }

  // Check that IDs 1 to 32 are all present
  for (let i = 1; i <= 32; i++) {
    if (!ids.has(i)) {
      errors.push(`Product ID ${i} is missing from the products array.`);
    }
  }

  console.log('\n--- Validation Results ---');
  if (errors.length > 0) {
    console.error(`❌ Validation failed with ${errors.length} error(s):`);
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  } else {
    console.log('✅ All products data successfully validated!');
    if (warnings.length > 0) {
      console.log(`⚠️ Warnings (${warnings.length}):`);
      warnings.forEach(warn => console.log(`  - ${warn}`));
    }
    process.exit(0);
  }
}

runValidation();
