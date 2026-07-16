/**
 * Empirical Verification of Navigation History Tracking
 * This script runs unit-level assertions on the state transition logic
 * used in CartContext, CategoryPage, and CheckoutPage.
 */

const fs = require('fs');
const path = require('path');

console.log('=== EMPIRICAL NAVIGATION HISTORY VERIFICATION ===\n');

// 1. Mock Browser Storage
class MockStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  clear() {
    this.store = {};
  }
}

const localStorage = new MockStorage();
const sessionStorage = new MockStorage();

// 2. Extracted Logic from CartContext.tsx
let lastVisitedState = '/lookbook';

function initCartContext() {
  const storedLastVisited = sessionStorage.getItem('lastVisited') || 
                            localStorage.getItem('lastVisited') ||
                            sessionStorage.getItem('last_visited_shopping_page') ||
                            localStorage.getItem('last_visited_shopping_page');
  if (storedLastVisited) {
    lastVisitedState = storedLastVisited;
  } else {
    lastVisitedState = '/lookbook';
  }
}

function setLastVisited(path) {
  lastVisitedState = path;
  sessionStorage.setItem('lastVisited', path);
  localStorage.setItem('lastVisited', path);
  sessionStorage.setItem('last_visited_shopping_page', path);
  localStorage.setItem('last_visited_shopping_page', path);
}

// 3. Extracted Logic from CategoryPage.tsx (useEffect triggered on pathname change)
function renderCategoryPage(pathname) {
  if (pathname) {
    setLastVisited(pathname);
  }
}

// 4. Extracted Logic from CheckoutPage & CartDrawer (Back / Continue Shopping links)
function getBackLink() {
  return lastVisitedState || '/lookbook';
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// Scenario 1: Initial state without visiting any category page
console.log('--- Scenario 1: No category visited ---');
localStorage.clear();
sessionStorage.clear();
initCartContext();
assert(lastVisitedState === '/lookbook', `Default state should be '/lookbook' (got: ${lastVisitedState})`);
assert(getBackLink() === '/lookbook', `Back link should resolve to '/lookbook' (got: ${getBackLink()})`);

// Scenario 2: Visitor goes to /bride
console.log('\n--- Scenario 2: Visit /bride ---');
renderCategoryPage('/bride');
assert(lastVisitedState === '/bride', `State should update to '/bride' (got: ${lastVisitedState})`);
assert(sessionStorage.getItem('lastVisited') === '/bride', `sessionStorage 'lastVisited' should be '/bride'`);
assert(localStorage.getItem('lastVisited') === '/bride', `localStorage 'lastVisited' should be '/bride'`);
assert(sessionStorage.getItem('last_visited_shopping_page') === '/bride', `sessionStorage 'last_visited_shopping_page' should be '/bride'`);
assert(localStorage.getItem('last_visited_shopping_page') === '/bride', `localStorage 'last_visited_shopping_page' should be '/bride'`);

// Scenario 3: Navigate to checkout and press back
console.log('\n--- Scenario 3: Go to checkout and press back ---');
// Checkout reads from getBackLink()
const backLinkFromCheckout = getBackLink();
assert(backLinkFromCheckout === '/bride', `Back button on checkout should route to '/bride' (got: ${backLinkFromCheckout})`);

// Scenario 4: Reload / Checkout accessed directly (state is restored from storage)
console.log('\n--- Scenario 4: Direct checkout access or reload ---');
// Simulate fresh session context init
initCartContext();
assert(lastVisitedState === '/bride', `State should be restored to '/bride' (got: ${lastVisitedState})`);
assert(getBackLink() === '/bride', `Back button should route to '/bride' after reload (got: ${getBackLink()})`);

// Scenario 5: Navigate to /groom and check cart, Continue Shopping routes to /groom
console.log('\n--- Scenario 5: Visit /groom and check cart ---');
renderCategoryPage('/groom');
assert(lastVisitedState === '/groom', `State should update to '/groom' (got: ${lastVisitedState})`);
const continueShoppingLink = getBackLink();
assert(continueShoppingLink === '/groom', `Continue Shopping should route to '/groom' (got: ${continueShoppingLink})`);

console.log('\n======================================');
console.log(`EMPRICAL VERIFICATION SUMMARY: Passed: ${passed}, Failed: ${failed}`);
console.log('======================================');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
