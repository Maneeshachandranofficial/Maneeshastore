# Original User Request

## Initial Request — 2026-07-09T16:30:00Z

Bring the Maneesha Chandran Next.js luxury fashion website to a flawless, client-ready, launch-quality state, leaving only Sanity.io and Razorpay integrations remaining.

Working directory: `c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp`
Integrity mode: demo

## Requirements

### R1. Fix Navigation History Bug
Fix the bug where pressing "back" from the Cart lands on `/lookbook`. Use proper Next.js router history or track the last visited category page so the user returns to their actual shopping origin (e.g., `/bridal`). 

### R2. Restructure Category & Collection Pages
Rebuild the routing structure to use fully independent, dedicated routes for categories (`/bride`, `/groom`, `/girls`, `/boys`) and collections (`/collections/[slug]`). Reuse the existing `CategoryPage` layout engine. Update all internal links across the site to point to these new routes without dead links or 404s.

### R3. Centralize Product & Collection Data
Refactor scattered product data into a single, clean typed data source (e.g., `/lib/products.ts`) shaped like a Sanity schema. Add a `SANITY_INTEGRATION_POINT` comment block indicating where to swap this for a fetch later.

### R4. Fix the Size Selector
Add a `requiresSize` boolean flag per product. For unstitched garments (e.g., sarees), show an elegant "Free Size / One Size" label. For stitched items, show a premium size selector matching the site's Cinzel/Jost design language, removing any generic/boxy styling.

### R5. WhatsApp Order Flow Checkout
Replace the current checkout payment button with a WhatsApp-based order flow that opens a pre-filled message to `+918072071420`. Add a secondary tap-to-call link. Keep the luxury order summary box intact. Isolate this in a `<CheckoutAction />` component with a `RAZORPAY_INTEGRATION_POINT` comment.

### R6. Cross-Page Visual Consistency
Ensure identical spacing rhythm, hero treatment, typography scale, 4:5 image aspect ratio (object-cover), and consistent hover/fade animations across all category and collection pages. Fix any responsive breakpoint issues across 375px, 768px, and 1440px+.

## Acceptance Criteria

### Interaction & Navigation
- [ ] Cart "Continue Shopping" or browser back returns to the correct originating category/collection page.
- [ ] Mobile hamburger drawer opens, closes, links correctly, and closes on link click.
- [ ] All navbar links, homepage tiles, and footer links route correctly with zero 404s.
- [ ] Lookbook filters update URL correctly, and hover reveals work on desktop/mobile.

### Visual & Data Integrity
- [ ] Zero broken images or dead links site-wide.
- [ ] No visual overlapping of checkout header on any mobile width (320px-768px).
- [ ] "Book an Appointment" form shows a real success/confirmation state.
- [ ] Product data is fully centralized in one file with the `SANITY_INTEGRATION_POINT` comment.
- [ ] Checkout action is isolated with the `RAZORPAY_INTEGRATION_POINT` comment.
