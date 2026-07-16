## 2026-07-10T05:12:05Z

You are a worker agent task-assigned by the Milestone 2 Sub-orchestrator.
Your working directory is: c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\worker_m2\

MISSION:
Restructure Category & Collection pages for the Maneesha Chandran website launch. Create routes /bride, /groom, /girls, /boys, and /collections/[slug], reuse CategoryPage layout engine, update all navbar, mobile drawer, homepage tiles, footer, and lookbook links to point to these new routes (with zero 404s), ensure identical spacing rhythm/aspect ratios, run tests, and write a handoff report.

TASKS TO EXECUTE:
1. Create new category routes by creating files:
   - `src/app/bride/page.tsx` (filters products by category 'bride')
   - `src/app/groom/page.tsx` (filters products by category 'groom')
   - `src/app/girls/page.tsx` (filters products by category 'girls')
   - `src/app/boys/page.tsx` (filters products by category 'boys')
   Use the `CategoryPage` component from `@/components/CategoryPage` for layout, preserving the same props and layout structure. Ensure spacing rhythm/aspect ratios are identical to the original pages.

2. Create dynamic collections route by creating the file:
   - `src/app/collections/[slug]/page.tsx`
   Note that Next.js 16/React 19 params are Promises and must be awaited:
   ```typescript
   interface PageProps {
     params: Promise<{ slug: string }>;
   }
   export default async function CollectionPage({ params }: PageProps) {
     const { slug } = await params;
     ...
   }
   ```
   Filter products using `getProductsByCollection(slug)`. If the slug is not a valid collection or there are no products, return `notFound()` from `next/navigation` to trigger a 404.
   Define custom labels, titles, descriptions, and hero images for the valid collection slugs:
   - 'onam-2026-chaayam': Label: 'Onam 2026 Chaayam', Title: 'Chaayam', Description: "A vibrant celebration of colours and Kerala's rich heritage...", Hero: '/drive_images_categorised/collections_1.png'
   - 'eves-garden-2024': Label: "Eve's Garden 2024", Title: "Eve's Garden", Description: "Pristine whites, intricate lacework, and ethereal beauty...", Hero: '/drive_images_categorised/collections_2.png'
   - 'parinaya-2026': Label: 'Parinaya 2026', Title: 'Parinaya', Description: "Majestic silks, rich hues, and timeless bridal grandeur...", Hero: '/drive_images_categorised/collections_3.png'
   - 'signature-couture': Label: 'Signature Couture', Title: 'The Art of Couture', Description: "Our iconic collections, each telling a unique story through fabric, color, and unparalleled craftsmanship.", Hero: '/drive_images_categorised/collections_4.png'
   For other slugs, return `notFound()`.

3. Update all links in:
   - `src/app/page.tsx` (Navbar, Mobile Drawer, Homepage section tiles/pane-ctas, Footer shop links, and Collections list)
   - `src/app/lookbook/page.tsx` (Lookbook links and filtering mapping)
   Ensure there are absolutely no references pointing to the old /bridal, /ethnic, /kids, /semi-party, or /collections (except dynamic sublinks).

4. Configure Next.js redirects in `next.config.ts` to prevent 404s for bookmarked old links:
   - `/bridal` -> `/bride`
   - `/kids` -> `/girls`
   - `/ethnic` -> `/bride`
   - `/semi-party` -> `/bride`
   - `/collections` -> `/collections/signature-couture`

5. Clean up old routes by deleting or replacing their files to avoid duplicate code:
   - `src/app/bridal/page.tsx`
   - `src/app/ethnic/page.tsx`
   - `src/app/kids/page.tsx`
   - `src/app/semi-party/page.tsx`
   - `src/app/collections/page.tsx`

6. Verify that the app builds successfully (`npm run build`) and run E2E tests (`npm run test:e2e`). Ensure features F2 (Category routes) and F3 (Collection routes) are fully passing.

7. Write a detailed handoff report to `c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\worker_m2\handoff.md` with:
   - What was done
   - Compilation and test commands run and their outputs (test success logs)
   - Layout compliance verification details
   - Any issues encountered and resolved
