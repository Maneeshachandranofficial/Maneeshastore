# E2E Testing Infrastructure

This document outlines the design and operation of the E2E testing infrastructure for the Maneesha Chandran luxury fashion website.

## Test Runner Architecture
The test suite is built natively in Node.js, ensuring maximum speed, zero external dependencies, and absolute robustness. It operates in two modes:

1. **Live HTTP Assertion Mode**: If a local server is detected running at `http://localhost:3000`, the suite makes live HTTP requests to assert HTTP statuses, HTML structure, responsive tags, and link destinations.
2. **Static Fallback Mode**: If no server is running, the suite performs static source code parsing, AST checks, and folder structure checks, ensuring files exist (like `src/app/bride/page.tsx`, `src/lib/products.ts`, etc.) and contain specific exports, comments, or logical tokens.

## Coverage
The suite covers exactly **82 test cases** across **7 features** and **4 tiers**:

- **F1: Navigation history** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates back buttons in the cart drawer and checkout, ensuring they route dynamically to the last visited category page.
- **F2: Category routes** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates routes (`/bride`, `/groom`, `/girls`, `/boys`), responsiveness, and lazy-loading of images.
- **F3: Collection routes** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates specific collection slug routing (`/collections/[slug]`) and quick-view modal reuse.
- **F4: Centralized data** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates the typed schema and unique IDs in the central dataset (`src/lib/products.ts`), checking for `SANITY_INTEGRATION_POINT`.
- **F5: Size selector** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates size selectors in CategoryPage, Cart Drawer, and Checkout, asserting font/typography styles.
- **F6: WhatsApp order checkout** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates the `<CheckoutAction />` component, order summary layouts, and pre-filled, URL-encoded WhatsApp messages targeting `+918072071420`.
- **F7: Mobile header layout** (10 tests: 5 Tier 1, 5 Tier 2)
  - Validates responsive mobile headers, hamburger buttons, collapsible menus, and backdrop overlays.
- **Tier 3: Cross-Feature Combinations** (7 tests)
  - Validates cross-component interactions (e.g. size selector + WhatsApp text serialization).
- **Tier 4: Real-world workloads** (5 tests)
  - Validates complex client-side workflows (e.g., complete purchase funnel, multi-item checkout, persistent sessions).

## How to Run the Tests
To run the E2E tests, use the following commands from the project root:

```bash
# Run tests
npm run test:e2e

# Or use the generic npm test script
npm test
```

## Test Report Output
Upon completion, the test runner outputs:
1. A colorized text summary directly in the console.
2. A detailed test report file in JSON format at `tests/e2e-report.json`.

---
*DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work.*
