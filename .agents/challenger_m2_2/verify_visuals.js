const fs = require('fs');
const path = require('path');

const webappDir = path.resolve(__dirname, '../..');

console.log('--- Static Visual & Performance Auditor ---');

const filesToAudit = {
  homePage: path.join(webappDir, 'src/app/page.tsx'),
  categoryPage: path.join(webappDir, 'src/components/CategoryPage.tsx'),
  globalCss: path.join(webappDir, 'src/app/globals.css'),
  checkoutPage: path.join(webappDir, 'src/app/checkout/page.tsx')
};

// Check if files exist
for (const [key, filePath] of Object.entries(filesToAudit)) {
  if (fs.existsSync(filePath)) {
    console.log(`[OK] Found ${key}: ${filePath}`);
  } else {
    console.error(`[ERROR] Missing ${key} at ${filePath}`);
  }
}

// 1. Lazy Loading Audit
console.log('\n--- 1. Lazy Loading Audit ---');
const homeContent = fs.readFileSync(filesToAudit.homePage, 'utf8');
const categoryContent = fs.readFileSync(filesToAudit.categoryPage, 'utf8');

// Find all img tags in page.tsx
const imgRegex = /<img[^>]*>/g;
const homeImgs = homeContent.match(imgRegex) || [];
console.log(`Found ${homeImgs.length} image tags on Home Page (page.tsx):`);
let lazyCount = 0;
let eagerCount = 0;
homeImgs.forEach((img, idx) => {
  const isLazy = img.includes('loading="lazy"') || img.includes("loading='lazy'");
  const srcMatch = img.match(/src=["']([^"']+)["']/);
  const src = srcMatch ? srcMatch[1] : 'unknown';
  if (isLazy) {
    lazyCount++;
    console.log(`  [LAZY] Image ${idx + 1}: ${src}`);
  } else {
    eagerCount++;
    console.log(`  [EAGER] Image ${idx + 1}: ${src}`);
  }
});
console.log(`Summary page.tsx: ${lazyCount} lazy, ${eagerCount} eager`);

const catImgs = categoryContent.match(imgRegex) || [];
console.log(`\nFound ${catImgs.length} image tags in CategoryPage.tsx:`);
lazyCount = 0;
eagerCount = 0;
catImgs.forEach((img, idx) => {
  const isLazy = img.includes('loading="lazy"') || img.includes("loading='lazy'");
  const srcMatch = img.match(/src={[^}]+}/) || img.match(/src=["']([^"']+)["']/);
  const src = srcMatch ? srcMatch[0] : 'unknown';
  if (isLazy) {
    lazyCount++;
    console.log(`  [LAZY] Image ${idx + 1}: ${src}`);
  } else {
    eagerCount++;
    console.log(`  [EAGER] Image ${idx + 1}: ${src}`);
  }
});
console.log(`Summary CategoryPage.tsx: ${lazyCount} lazy, ${eagerCount} eager`);


// 2. Aspect Ratio Check
console.log('\n--- 2. Aspect Ratio Audit ---');
// Let's audit product card images aspect ratios
const hasAspectClass = categoryContent.includes('aspect-[4/5]');
console.log(`CategoryPage.tsx uses aspect-[4/5]: ${hasAspectClass ? 'YES' : 'NO'}`);

const cssContent = fs.readFileSync(filesToAudit.globalCss, 'utf8');
const productImgAspect = cssContent.match(/\.product-card\s+\.product-img[^{]*\{[^}]*aspect-ratio:[^;}]+/g);
console.log(`globals.css .product-card .product-img aspect-ratio: ${productImgAspect ? productImgAspect[0].trim() : 'NOT FOUND'}`);


// 3. Mobile Header Overlap & Alignment Check
console.log('\n--- 3. Mobile Navigation Header Alignment Audit ---');
const navLeftRightWidth = cssContent.match(/\.nav-left,\s*\.nav-right\s*\{[^}]*\}/g);
console.log(`globals.css .nav-left, .nav-right rules:`);
if (navLeftRightWidth) {
  navLeftRightWidth.forEach(rule => console.log(`  ${rule.replace(/\s+/g, ' ')}`));
} else {
  console.log('  Not found in globals.css');
}

const navLeftRightMobile = cssContent.match(/@media[^{]*max-width:\s*768px[^{]*\{[^}]*\.nav-left,\s*\.nav-right[^}]*\}/g);
console.log(`globals.css mobile overrides for .nav-left, .nav-right: ${navLeftRightMobile ? 'FOUND' : 'NONE'}`);


// 4. Modal Scrollability Audit
console.log('\n--- 4. Quick View Modal Scrollability Audit ---');
const homeModalScrollable = homeContent.includes('overflow-y-auto') || homeContent.includes('overflow-scroll');
console.log(`Home page quick-view modal contains scrollable property: ${homeModalScrollable ? 'YES' : 'NO'}`);
const catModalScrollable = categoryContent.includes('overflow-y-auto') || categoryContent.includes('overflow-scroll');
console.log(`CategoryPage quick-view modal contains scrollable property: ${catModalScrollable ? 'YES' : 'NO'}`);
