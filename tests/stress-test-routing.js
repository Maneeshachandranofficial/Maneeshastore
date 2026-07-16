const http = require('http');

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

function fetchPath(pathStr) {
  return new Promise((resolve) => {
    const req = http.get(`${BASE_URL}${pathStr}`, { timeout: 3000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', (err) => {
      resolve({ status: 500, headers: {}, body: '', error: err });
    });
    req.on('timeout', () => {
      req.destroy();
      resolve({ status: 500, headers: {}, body: '', error: new Error('Timeout') });
    });
  });
}

const CATEGORY_ROUTES = ['/bride', '/groom', '/girls', '/boys'];
const COLLECTION_ROUTES = [
  '/collections/onam-2026-chaayam',
  '/collections/eves-garden-2024',
  '/collections/parinaya-2026',
  '/collections/signature-couture'
];

const LEGACY_REDIRECTS = [
  { source: '/bridal', destination: '/bride' },
  { source: '/kids', destination: '/girls' },
  { source: '/ethnic', destination: '/bride' },
  { source: '/semi-party', destination: '/bride' },
  { source: '/collections', destination: '/collections/signature-couture' }
];

const INVALID_ROUTES = [
  '/invalid-category-route-test-123',
  '/collections/non-existent-collection-test-123',
  '/bride/something',
  '/collections/signature-couture/something',
  '/collections/ONAM-2026-CHAAYAM',
  '/collections/onam-2026-chaayam$',
  '/collections/..%2f..%2fbride',
  '/collections/..%2fbride',
  '/collections/.'
];

async function runTests() {
  console.log('=== ROUTING & REDIRECTION STRESS TEST ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.log(`[FAIL] ${message}`);
      failed++;
    }
  }

  // 1. Valid Category Routes (200 OK)
  console.log('--- 1. Valid Category Routes ---');
  for (const route of CATEGORY_ROUTES) {
    const res = await fetchPath(route);
    assert(res.status === 200, `GET ${route} -> status ${res.status} (expected 200)`);
  }

  // 2. Category Routes with Trailing Slash (should handle correctly, e.g. 200 or 308 redirect)
  console.log('\n--- 2. Category Routes with Trailing Slash ---');
  for (const route of CATEGORY_ROUTES) {
    const res = await fetchPath(`${route}/`);
    assert(res.status === 200 || res.status === 308, `GET ${route}/ -> status ${res.status} (expected 200 or 308)`);
    if (res.status === 308) {
      const location = res.headers.location;
      assert(location === route || location === `${BASE_URL}${route}`, `  Redirects to ${route} (got ${location})`);
    }
  }

  // 3. Valid Collection Routes (200 OK)
  console.log('\n--- 3. Valid Collection Routes ---');
  for (const route of COLLECTION_ROUTES) {
    const res = await fetchPath(route);
    assert(res.status === 200, `GET ${route} -> status ${res.status} (expected 200)`);
  }

  // 4. Collection Routes with Trailing Slash (should handle correctly, e.g. 200 or 308 redirect)
  console.log('\n--- 4. Collection Routes with Trailing Slash ---');
  for (const route of COLLECTION_ROUTES) {
    const res = await fetchPath(`${route}/`);
    assert(res.status === 200 || res.status === 308, `GET ${route}/ -> status ${res.status} (expected 200 or 308)`);
    if (res.status === 308) {
      const location = res.headers.location;
      assert(location === route || location === `${BASE_URL}${route}`, `  Redirects to ${route} (got ${location})`);
    }
  }

  // 5. Legacy Redirects (307 or 308)
  console.log('\n--- 5. Legacy Redirects ---');
  for (const redirect of LEGACY_REDIRECTS) {
    const res = await fetchPath(redirect.source);
    // Next.js config redirects are usually 307 or 308
    assert(res.status === 307 || res.status === 308, `GET ${redirect.source} -> status ${res.status} (expected 307 or 308)`);
    const location = res.headers.location;
    const expectedDest = redirect.destination;
    assert(location === expectedDest || location === `${BASE_URL}${expectedDest}`, `  Redirects to ${expectedDest} (got ${location})`);
  }

  // 6. Invalid Routes (404 Not Found)
  console.log('\n--- 6. Invalid Routes (404) ---');
  for (const route of INVALID_ROUTES) {
    const res = await fetchPath(route);
    assert(res.status === 404, `GET ${route} -> status ${res.status} (expected 404)`);
  }

  console.log('\n======================================');
  console.log(`STRESS TEST SUMMARY: Passed: ${passed}, Failed: ${failed}`);
  console.log('======================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Check if server is running, then run tests
const req = http.get(BASE_URL, { timeout: 1000 }, (res) => {
  runTests();
});
req.on('error', () => {
  console.error(`Error: Dev server is not running on ${BASE_URL}. Start the dev server first!`);
  process.exit(1);
});
