## 2026-07-09T22:03:51Z
You are the E2E Testing Worker. Your working directory is c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\worker_e2e_setup\.
Initialize your BRIEFING.md and progress.md.

Your task is to set up the E2E testing infrastructure for the Maneesha Chandran Next.js luxury fashion website under c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp.

Follow these instructions exactly:

1. Update package.json to include the following test scripts:
   - "test:e2e": "node tests/run-e2e.js"
   - "test": "npm run test:e2e"

2. Create a folder named "tests" in the project root if it does not exist, and write the main E2E test runner file "tests/run-e2e.js".
The test runner must contain exactly 82 test cases across 7 features and 4 tiers as specified:
- F1: Navigation history (10 tests: 5 Tier 1, 5 Tier 2)
- F2: Category routes (10 tests: 5 Tier 1, 5 Tier 2)
- F3: Collection routes (10 tests: 5 Tier 1, 5 Tier 2)
- F4: Centralized data (10 tests: 5 Tier 1, 5 Tier 2)
- F5: Size selector (10 tests: 5 Tier 1, 5 Tier 2)
- F6: WhatsApp order checkout (10 tests: 5 Tier 1, 5 Tier 2)
- F7: Mobile header layout (10 tests: 5 Tier 1, 5 Tier 2)
- Tier 3: Cross-Feature Combinations (7 tests)
- Tier 4: Real-world workloads (5 tests)

The test runner script must be implemented in Node.js. It should:
- Attempt to detect if a live server is running at http://localhost:3000 (by making an HTTP GET request to /).
- If a server is running, the tests can perform live HTTP assertions on status codes, returned HTML structure, responsive tags, and link destinations.
- If a server is not running, the tests should perform static code and file structure checks, ensuring files exist (like src/app/bride/page.tsx, src/lib/products.ts, etc.) and contain specific tokens or exports.
- Output a clean, detailed, colorized text summary of the results (passed, failed, skipped, and total counts) to the console.
- Output a test report file at "tests/e2e-report.json".
- Be robust: catching errors, avoiding runtime crashes, and handling missing files gracefully.

Ensure you include the MANDATORY INTEGRITY WARNING in any actions you perform:
"DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A Forensic Auditor will independently verify your work."

Here is the design for the 82 test cases that you should implement in tests/run-e2e.js:

--- F1: Navigation history ---
- T1.F1.1: Cart drawer back button returns to the last visited category page. (Check CartDrawer.tsx for tracking logic/history back)
- T1.F1.2: Checkout page back button returns to the correct category page. (Check checkout page for dynamic back route logic)
- T1.F1.3: Cart "Continue Shopping" button redirects to the last category visited. (Check CartDrawer.tsx for continue shopping button destination)
- T1.F1.4: Cart drawer back button behaves correctly when opening cart from the homepage. (Check fallback to home/first category)
- T1.F1.5: Checkout back button behaves correctly when checkout is accessed directly. (Check fallback destination when history is empty)
- T2.F1.1: Cart history state is preserved across page reloads. (Check if sessionStorage/localStorage is referenced in CartContext or pages)
- T2.F1.2: Back button works correctly after switching between multiple categories before entering cart. (Check that last visited state updates dynamically)
- T2.F1.3: Cart drawer back button with empty cart behaves correctly. (Check empty state rendering and back buttons)
- T2.F1.4: Direct browser navigation back from /checkout returns to the correct originating page. (Check checkout history stack layout)
- T2.F1.5: Cart drawer back button on mobile view returns to the correct page. (Verify mobile drawer layout back link exists)

--- F2: Category routes ---
- T1.F2.1: Navigation to /bride page displays the brides category. (Check src/app/bride/page.tsx exists)
- T1.F2.2: Navigation to /groom page displays the grooms category. (Check src/app/groom/page.tsx exists)
- T1.F2.3: Navigation to /girls page displays the girls category. (Check src/app/girls/page.tsx exists)
- T1.F2.4: Navigation to /boys page displays the boys category. (Check src/app/boys/page.tsx exists)
- T1.F2.5: Homepage category links correctly route to /bride, /groom, /girls, /boys. (Check src/app/page.tsx links)
- T2.F2.1: Invalid category routes correctly trigger 404 or redirect. (Verify routing check)
- T2.F2.2: Category route with trailing slash is handled correctly by Next.js. (Check trailing slash configurations)
- T2.F2.3: Mobile header links for categories point to new dedicated routes. (Check mobile drawer/header links)
- T2.F2.4: Category page layout is responsive and maintains visual rhythm on 375px viewports. (Verify meta viewport and CSS styling in CategoryPage.tsx)
- T2.F2.5: Category page product cards load lazy images correctly. (Verify image loading properties in CategoryPage.tsx)

--- F3: Collection routes ---
- T1.F3.1: Navigation to /collections/onam-2026-chaayam displays the Onam collection. (Check folder structure or routes)
- T1.F3.2: Navigation to /collections/eves-garden-2024 displays the Christian Wedding collection. (Check routes)
- T1.F3.3: Navigation to /collections/parinaya-2026 displays the Hindu Wedding collection. (Check routes)
- T1.F3.4: Homepage collection rows link correctly to /collections/[slug]. (Check src/app/page.tsx for collection links)
- T1.F3.5: Navbar collection sub-links route correctly to dedicated collection routes. (Check navbar links in header component or page.tsx)
- T2.F3.1: Navigation to a non-existent collection slug returns a 404. (Verify route handling)
- T2.F3.2: Collection page reuses the CategoryPage layout engine. (Verify imports in collection pages)
- T2.F3.3: Collection page shows correct breadcrumbs or navigation path. (Verify page title and labels)
- T2.F3.4: Collection page grid is responsive on mobile viewport. (Verify responsive classes on collection layouts)
- T2.F3.5: Quick view modal triggers and functions on collection pages. (Verify quick view modal logic in collection pages)

--- F4: Centralized data ---
- T1.F4.1: Products data is imported from a single file src/lib/products.ts. (Check file existence)
- T1.F4.2: Products dataset exports a strongly-typed Product interface. (Check for export interface Product)
- T1.F4.3: Products list contains all items for bride, groom, girls, boys. (Check list size or categories in products.ts)
- T1.F4.4: Every product has a valid category property matching the schema. (Check data validation)
- T1.F4.5: Centralized file src/lib/products.ts contains the SANITY_INTEGRATION_POINT comment block. (Verify comment exists)
- T2.F4.1: Product IDs are unique across the centralized dataset. (Verify ID uniqueness)
- T2.F4.2: Product prices are correctly formatted strings. (Verify price strings)
- T2.F4.3: Products schema specifies optional and required fields correctly. (Verify TypeScript types)
- T2.F4.4: Centralized data file is clean of duplicate declarations. (Check for multiple product arrays)
- T2.F4.5: SANITY_INTEGRATION_POINT comment contains instructions or placeholder. (Verify comment details)

--- F5: Size selector ---
- T1.F5.1: Product with requiresSize: false shows "Free Size / One Size" label. (Verify CategoryPage.tsx rendering rules)
- T1.F5.2: Product with requiresSize: true shows size selector with options. (Verify size selector display logic)
- T1.F5.3: Size selector options match the custom array defined on the product. (Check sizes mapping)
- T1.F5.4: Adding a product to cart with size selected puts the correct size in the cart. (Check cart drawer context size mapping)
- T1.F5.5: Size selector UI uses Cinzel/Jost typography. (Verify classes or fonts in selector component)
- T2.F5.1: Attempting to add a sized product to cart without selecting a size defaults to the first size or shows validation. (Check size validation logic)
- T2.F5.2: Sized products in quick view modal have responsive design for sizing buttons. (Verify responsive sizing button CSS)
- T2.F5.3: Sized products added to cart display the chosen size in Cart Drawer. (Check CartDrawer size rendering)
- T2.F5.4: Sized products added to cart display the chosen size on Checkout Page. (Check checkout page item rendering)
- T2.F5.5: Unstitched/free-size products do not show size options in quick view modal. (Verify size list hidden when requiresSize is false)

--- F6: WhatsApp order checkout ---
- T1.F6.1: Checkout summary contains the CheckoutAction component. (Check checkout page for import or tag)
- T1.F6.2: WhatsApp checkout button opens a WhatsApp link to +918072071420. (Check phone number)
- T1.F6.3: WhatsApp link includes pre-filled message with order items, sizes, prices, and subtotal. (Check string composition)
- T1.F6.4: Secondary tap-to-call link for customer care is present on the page. (Check secondary call href)
- T1.F6.5: CheckoutAction component code contains the RAZORPAY_INTEGRATION_POINT comment block. (Verify comment exists)
- T2.F6.1: WhatsApp URL pre-filled message is properly URI-encoded. (Verify encodeURIComponent usage)
- T2.F6.2: WhatsApp checkout flow works when the cart contains multiple items. (Verify looping over items in link generation)
- T2.F6.3: WhatsApp checkout link opens in a new tab/window. (Verify target="_blank")
- T2.F6.4: Secondary tap-to-call link has a valid tel:+918072071420 href. (Verify tel link)
- T2.F6.5: Order summary box layout remains intact with the new checkout action buttons. (Verify summary markup structure)

--- F7: Mobile header layout ---
- T1.F7.1: Mobile header displays correctly at viewport widths under 768px. (Check mobile CSS classes)
- T1.F7.2: Hamburger menu button is visible on mobile viewports. (Check hamburger markup/classes)
- T1.F7.3: Clicking hamburger menu opens the mobile drawer menu. (Check menu toggle state/JS)
- T1.F7.4: Mobile drawer displays all links correctly without truncation. (Verify mobile drawer markup)
- T1.F7.5: Clicking a link in the mobile drawer closes the drawer and routes to the page. (Verify onClick close trigger)
- T2.F7.1: Checkout header does not visually overlap on any mobile width from 320px to 768px. (Verify header styling and padding/height)
- T2.F7.2: Clicking the close button in the mobile drawer closes the drawer. (Verify close button click handler)
- T2.F7.3: Clicking the backdrop overlay closes the mobile drawer. (Verify overlay onClick handler)
- T2.F7.4: Logo and search icons scale correctly in the mobile header. (Verify responsive sizing classes)
- T2.F7.5: Collapsible menus in the mobile drawer toggle open/closed on click. (Verify submenu expand/collapse toggle)

--- Tier 3: Cross-Feature Combinations ---
- T3.1: Navigation history and dedicated routes (F1 + F2) - verify browser history behaves correctly when navigating through new category routes to the cart, then clicking back.
- T3.2: Dedicated routes and collection routes (F2 + F3) - navigate between category and collection pages and verify links transition correctly.
- T3.3: Centralized data and category routes (F4 + F2) - verify category page products load dynamically from src/lib/products.ts.
- T3.4: Centralized data and size selector (F4 + F5) - verify products loaded from products.ts use requiresSize flag to render size selector.
- T3.5: Dedicated routes and size selector (F2 + F5) - verify size choices add items to cart correctly from category page.
- T3.6: Size selector and WhatsApp checkout (F5 + F6) - verify selected size is represented in WhatsApp text message.
- T3.7: WhatsApp checkout and Mobile header layout (F6 + F7) - verify checkout action works on mobile viewport without overlapping.

--- Tier 4: Real-world workloads ---
- T4.1: Complete customer purchase flow - navigate home, click mobile menu, go to category, open quick-view, select size, add to cart, open cart drawer, checkout, complete WhatsApp order.
- T4.2: Multi-item custom checkout - add multiple custom and standard size items, verify subtotal and message format.
- T4.3: Interrupted shopping & navigation - add items, navigate to checkout, go back, add another product, check out.
- T4.4: Responsive boutique experience - lookbook filters, mobile menu navigation, appointment booking, and checking out.
- T4.5: Cross-device persistent shopping session - verify cart persists on refresh, layout renders correctly on viewport change, and checkout elements match.

3. Create and publish TEST_INFRA.md and TEST_READY.md in the project root (c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\). Follow the standard formatting templates for these files.
In TEST_READY.md, under "Test Runner", specify:
- Command: npm run test:e2e
- Expected: all tests pass (or output a complete status report showing pass/fail status cleanly).
Under "Feature Checklist", show the status of all 7 features.

4. Run the test runner using npm run test:e2e and verify that it executes cleanly without syntax/compile errors. Document the command output. Note that since some of these features are in progress or planned by the implementation track, some tests will fail; verify that the test runner reports these failures gracefully and outputs the test report JSON file.

Report back with a detailed handoff when done.
