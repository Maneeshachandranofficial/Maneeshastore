# Challenger Audit Report (Milestone 2 Layout & Stress Tests)

**Overall Risk Assessment**: MEDIUM

This report covers the empirical verification of visual consistency, spacing rhythm, aspect ratios, responsive scaling, and lazy-loading of images for the Maneesha Chandran Couture website launch.

---

## 1. Observations

### A. E2E Test Suite Results
* Command executed: `npm run test:e2e` (running in static fallback mode)
* Result summary:
  * Total Tests: 82
  * Passed: 59
  * Failed: 23
* Critical visual and data-related failures observed in the test report (`tests/e2e-report.json`):
  * **T2.F4.1 (Centralized data)**: `Product IDs are unique across the centralized dataset. - No product IDs found.`
  * **T1.F5.1 (Size selector)**: `Product with requiresSize: false shows "Free Size / One Size" label. - No Free Size / One Size label logic found.`
  * **T1.F5.2 (Size selector)**: `Product with requiresSize: true shows size selector with options. - No size selector rendering logic found.`
  * **T2.F5.5 (Size selector)**: `Unstitched/free-size products do not show size options in quick view modal. - Sizing options not hidden for free-size items.`
  * **T1.F6.1 (WhatsApp order checkout)**: `Checkout summary contains the CheckoutAction component. - CheckoutPage does not import/render CheckoutAction.` (This and other F6/T3.6/T3.7/T4.1 tests are failing because Milestone 3 features are currently planned/unimplemented).
  * **T4.5 (Real-world workloads)**: `Cross-device persistent shopping session. - Cart context does not use client storage for persistence.`

### B. Rendering Code & CSS Review
1. **Empty Flex Container causing Asymmetric Centering on Mobile** (`src/app/page.tsx`, lines 190-216):
   The header contains:
   ```html
   <header className={`navbar ${navState === 'hero' ? 'navbar--hero' : 'navbar--scrolled'}`}>
     <div className="nav-left">
       <button className="menu-btn" ...>...</button>
       <div className="nav-links hidden-mobile">...</div>
     </div>
     <div className="nav-center">
       <a href="#" className="logo">...</a>
     </div>
     <div className="nav-right">
       <div className="nav-links hidden-mobile">...</div>
     </div>
   </header>
   ```
   * Under 768px viewports, `.hidden-mobile` classes apply `display: none`.
   * The `.nav-right` container becomes completely empty (0px width), while `.nav-left` has the `.menu-btn` (width ~24px).
   * Since `.navbar` is a flexbox with `justify-content: space-between`, this asymmetry shifts the logo `~12px` to the right of the absolute center on mobile.
   * A matching bug exists in `src/components/CategoryPage.tsx` lines 58-76, where the right flex-child `div.justify-self-end` is completely empty while the left has the "Back" button, pushing the logo off-center on mobile category screens.

2. **Quick View Modal Overflow without Scrolling on Home Page** (`src/app/page.tsx`, lines 568-592):
   ```html
   <div 
     className="relative w-full h-full max-w-5xl max-h-[90vh] m-6 flex flex-col items-center justify-center z-[2005]"
     style={{ animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
     onClick={(e) => e.stopPropagation()}
   >
     <img 
       src={quickViewProduct.src} 
       alt={quickViewProduct.title}
       className="max-w-full max-h-[70vh] object-contain shadow-2xl"
     />
     <div className="mt-8 text-center flex flex-col items-center">
       ...
   ```
   * The container lacks any overflow scrolling wrapper (no `overflow-y-auto` or `overflow-scroll`).
   * The image has a hard height limit of `max-h-[70vh]`. On a standard small viewport height of 667px (iPhone SE), the image takes `~466px`. With the text and CTA buttons taking `~150px`, the content height of `~616px` exceeds the `max-h-[90vh]` container limit (600px), causing the bottom elements (Add to Cart) to overflow or get clipped.
   * `CategoryPage.tsx` lines 141-145 avoids this overflow by using `overflow-y-auto` but still suffers from a visual design flaw where the `max-h-[60vh]` image takes up too much vertical space, pushing interactive controls below the fold of the modal on small screens.

3. **Eager Loading below the fold on Home Page** (`src/app/page.tsx` lines 286-314, 344-374, 384-412):
   * Product card images on the Home page (Bridal edit, Ethnic wear, Semi-party wear) lack `loading="lazy"` on their `<img>` tags. Only the split panes have it. This causes unnecessary network request chains on initial page load.

4. **Desktop Layout Spacing Inconsistency** (`src/app/globals.css`, line 102 vs `src/components/CategoryPage.tsx`, line 94):
   * Home page sections use `.section-padding` which sets `padding: 7rem 6%`.
   * Category and Collection pages use padding `px-6 md:px-12 lg:px-[10vw]` on their products grid sections.
   * On desktop viewports (e.g. 1200px wide), the Home page content aligns at 72px inset (`6%`), whereas the Category pages align at 120px inset (`10vw`). This causes visual misalignment when navigating back and forth.

5. **Test Runner Code Bug in Regex Matcher** (`tests/run-e2e.js`, line 554):
   * `const idRegex = /(?:id|id":|id':)\s*["']?(\d+)["']?/g;` fails to match static declarations like `id: 1,` because there is no optional colon `:` in the first capture group.

---

## 2. Logic Chain

1. **Observations on Header Columns**:
   * Desktop layout uses `width: 38%` on `.nav-left`/`.nav-right` and `width: 24%` on `.nav-center`.
   * Mobile override styles set `width: auto` on all three column divs.
   * Because `.nav-right` collapses to 0px on mobile, `flex justify-between` renders the header asymmetrical.
   * **Conclusion**: This results in visual shifting of the logo (off-center alignment on mobile viewports).

2. **Observations on Modal Scroll Container**:
   * The home page quick-view modal contains no class indicating overflow handling, while its child elements are height-constrained.
   * **Conclusion**: Content overflows and gets clipped on viewport heights under 700px.

3. **Observations on Image Lazy-loading**:
   * E-commerce images in page.tsx are rendered using standard `<img>` tags without `loading="lazy"`.
   * **Conclusion**: Under real-world network conditions, this causes poor performance scores and layout shifts.

---

## 3. Caveats

* **Unimplemented Milestones**: Several test failures are due to features that are explicitly marked as "planned" in `PROJECT.md` for Milestones 3 & 4 (e.g. WhatsApp checkout buttons, Razorpay integration, persistence of Cart using client storage). These failures are expected at this stage.
* **Network Mode Constraints**: Visual audits were conducted using static file inspections (reviewing Next.js code structures and Tailwind classes) rather than dynamic browser screen captures.

---

## 4. Conclusions

1. **Grid Responsiveness**: Excellent. Grids on high-resolution screens limit their content size cleanly using `max-w-[1400px]` constraints, maintaining structural stability.
2. **Aspect Ratios**: Aspect ratios for product card image containers are correctly set to `4:5` on both home and category grids, preventing cumulative layout shifts (CLS).
3. **Responsive Visual Defects**:
   * **Header Centering**: Defect confirmed on both home and category pages on viewports under 768px.
   * **Quick View Modal**: Truncation defect confirmed on mobile viewport heights.
   * **Lazy-loading**: Performance defect due to missing lazy-loading on Home page product grids.

---

## 5. Verification Method

To verify these observations, review the following files:
* **Mobile Header Centering**: View `src/app/page.tsx` line 190 and `src/components/CategoryPage.tsx` line 58. Check the width properties and layout structure on mobile.
* **Modal Overflow**: View `src/app/page.tsx` line 568. Check for `overflow-y-auto`.
* **Lazy Loading**: Check product cards inside `src/app/page.tsx` (lines 285-412) to verify the absence of `loading="lazy"`.
* **E2E Test Run**: Run `npm run test:e2e` to verify the baseline test failures.
