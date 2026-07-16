# Milestone 2 Exploration Report & Handoff

**Summary**: Detailed read-only exploration and implementation plan to restructure category and collection pages. We have identified current routing limitations, responsive layout bugs at 375px viewports (header column squishing and modal scrolling truncation), and compiled a precise, step-by-step fix strategy and test verification checklist.

---

## 1. Observation

### Current Routing & Page Structure
The current page routes are implemented statically in `src/app/` under the following directories:
*   **`src/app/bridal/page.tsx`** (Lines 4-6):
    ```typescript
    const bridalProducts = getAllProducts().filter(p =>
      p.src.includes('/bridal_')
    );
    ```
*   **`src/app/kids/page.tsx`** (Lines 4-6):
    ```typescript
    const kidsProducts = getAllProducts().filter(p =>
      p.src.includes('/kids_')
    );
    ```
*   **`src/app/collections/page.tsx`** (Lines 4-6):
    ```typescript
    const collectionProducts = getAllProducts().filter(p =>
      p.src.includes('/collections_')
    );
    ```
*   **`src/app/ethnic/page.tsx`** and **`src/app/semi-party/page.tsx`** follow a similar file-path matching strategy.

### Target Schema Categories & Collections
In `src/lib/products.ts` (Lines 5-14), the centralized product schema is defined as:
```typescript
export interface Product {
  id: number;
  src: string;
  title: string;
  price: string;
  requiresSize: boolean;
  sizes?: string[];
  category: 'bride' | 'groom' | 'girls' | 'boys';
  collection?: string;
}
```
The active collections defined on products in `src/lib/products.ts` are:
*   `onam-2026-chaayam` (e.g., id 27)
*   `eves-garden-2024` (e.g., id 28)
*   `parinaya-2026` (e.g., id 29)
*   `signature-couture` (e.g., ids 30, 31, 32)

---

### Layout & Visual Design Findings

#### 1. Header Navigation Issues at 375px (Mobile Viewports)
In `src/components/CategoryPage.tsx` (Lines 58-76), the header is structured as a rigid three-column grid:
```tsx
<header className="fixed top-0 left-0 right-0 z-[100] py-5 px-6 md:px-12 lg:px-[10vw] grid grid-cols-3 items-center bg-gradient-to-b from-black/40 to-transparent">
  <div className="justify-self-start">...</div>
  <div className="justify-self-center text-center">
    <Link href="/" className="inline-flex flex-col items-center hover:opacity-80 transition-opacity">
      <img src="/logo-circle.png" alt="Maneesha Chandran" className="w-9 h-9 mb-1" />
      <span className="text-[10px] uppercase tracking-[0.3em] text-white/90" style={{ fontFamily: 'var(--font-heading)' }}>Maneesha Chandran</span>
    </Link>
  </div>
  <div className="justify-self-end">...</div>
</header>
```
*   **Issue**: On a 375px viewport, each column is allocated exactly $375 / 3 = 125\text{px}$. The center column contains the text `"Maneesha Chandran"` with uppercase letter spacing of `0.3em`, which requires approximately $170\text{px}$ of horizontal space. This rigid layout forces the text to wrap awkwardly or overlap other elements.

#### 2. Quick View Modal Truncation on Small Viewports
In `src/components/CategoryPage.tsx` (Lines 126-143), the Quick View modal wraps its content in a flexbox layout:
```tsx
<div
  className="relative w-full h-full max-w-5xl max-h-[90vh] m-6 flex flex-col items-center justify-center z-[2005]"
  style={{ animation: 'scaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
  onClick={(e) => e.stopPropagation()}
>
```
*   **Issue**: The modal uses `justify-center` and lacks scroll capabilities (`overflow-y-auto`). On a 375px height screen, the image (max height `60vh` $\approx 400\text{px}$) combined with title, size buttons, and the "Add to Cart" button (together $\approx 200\text{px}$) exceeds the vertical space, cutting off checkout actions at the bottom.

#### 3. Grid Stretch at 1440px+
In `src/components/CategoryPage.tsx` (Line 101), the products grid has no max-width constraints:
```tsx
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
```
*   **Issue**: Unlike lookbook pages (`max-width: 1800px` on line 127) and home pages (`max-width: 1400px` on line 737 of `globals.css`), the category product cards stretch infinitely on ultra-wide monitors, breaking visual rhythm.

---

## 2. Logic Chain

1.  **Observation of Data Mismatch**: The current pages (`/bridal`, `/kids`) aggregate products using image file paths rather than database attributes. For example, `bridal` contains both bride and groom items, and `kids` contains both girls and boys items.
2.  **Observation of Test Constraints**: E2E test files look specifically for `/bride`, `/groom`, `/girls`, `/boys`, and `/collections/[slug]` (with dynamic route parameters).
3.  **Conclusion on Routing Rebuild**: Fully independent Next.js App Router directories must be set up under `src/app/` using dynamic and static routes that query the products database using the typed categories and collections.
4.  **Observation of Layout Bugs**: The rigid CSS grid in the CategoryPage header causes wrapping at 375px. The lack of scroll properties in the Quick View modal hides checkout buttons.
5.  **Conclusion on Styles**: The layout engine component (`CategoryPage.tsx`) must be refactored to use responsive flex settings for its header, dynamic overflow settings for the Quick View modal, and a clean max-width container to limit grid stretching on large desktop monitors.

---

## 3. Caveats

*   **Network Command Timing**: Executing tests or builds directly via terminal was not performed because a command execution request timed out. We assume the dev environment has all standard dependencies installed (`package.json` specifies Next.js `16.2.10`, React `19.2.4`, and standard PostCSS/Tailwind configuration).
*   **Next.js 16 Dynamic Parameters**: In Next.js 15+, dynamic route parameters in server pages are treated as Promises and must be awaited before accessing properties (e.g., `const { slug } = await params`).

---

## 4. Conclusion & Plan

### Detailed Analysis of Routing Structure
The new routing structure maps directly to the `Product` schema fields:
1.  **Category Routes**: `/bride`, `/groom`, `/girls`, `/boys` querying `getProductsByCategory(category)`.
2.  **Collection Routes**: `/collections/[slug]` querying `getProductsByCollection(slug)`. If `slug` is not a registered collection, it must return a Next.js `notFound()`.

### Inventory of Links to Update
All internal links pointing to old paths must be updated in `src/app/page.tsx` and `src/components/CartDrawer.tsx` to prevent 404s:

| Original Link Location | Old Path | New Path |
| :--- | :--- | :--- |
| **Mobile Drawer (Bridal - Brides)** | `/bridal` | `/bride` |
| **Mobile Drawer (Bridal - Grooms)** | `/bridal` | `/groom` |
| **Mobile Drawer (Ethnic - Women)** | `/ethnic` | `/bride` |
| **Mobile Drawer (Ethnic - Men)** | `/ethnic` | `/groom` |
| **Mobile Drawer (Semi Party Wear)** | `/semi-party` | `/bride` |
| **Mobile Drawer (Kids - Girls)** | `/kids` | `/girls` |
| **Mobile Drawer (Kids - Boys)** | `/kids` | `/boys` |
| **Mobile Drawer (Collections - Onam)** | `/collections` | `/collections/onam-2026-chaayam` |
| **Mobile Drawer (Collections - Eves)** | `/collections` | `/collections/eves-garden-2024` |
| **Mobile Drawer (Collections - Parinaya)** | `/collections` | `/collections/parinaya-2026` |
| **Desktop Header (Bridal)** | `/bridal` | `/bride` |
| **Desktop Header (Ethnic)** | `/ethnic` | `/bride` |
| **Desktop Header (Semi Party)** | `/semi-party` | `/bride` |
| **Desktop Header (Kids)** | `/kids` | `/girls` |
| **Desktop Header (Collections)** | `/collections` | `/collections/onam-2026-chaayam` |
| **Home Hero Section** | `/bridal` | `/bride` |
| **Home Bridal Grid** | `/bridal` | Brides $\rightarrow$ `/bride`, Grooms $\rightarrow$ `/groom` |
| **Home Ethnic Grid** | `/ethnic` | Women $\rightarrow$ `/bride`, Men $\rightarrow$ `/groom` |
| **Home Kids Grid** | `/kids` | Girls $\rightarrow$ `/girls`, Boys $\rightarrow$ `/boys` |
| **Home Collection Rows** | `/collections` | Point to their respective `/collections/[slug]` routes |
| **Footer Links** | `/bridal`, `/ethnic`, `/semi-party`, `/kids`, `/collections` | `/bride`, `/groom`, `/girls`, `/boys`, `/collections/onam-2026-chaayam` |

---

### Step-by-Step Fix Strategy

#### Step 1: Create Dedicated Category Routes
Create the following page components under `src/app/` using `CategoryPage` and products data filtered by category:
*   `src/app/bride/page.tsx`
*   `src/app/groom/page.tsx`
*   `src/app/girls/page.tsx`
*   `src/app/boys/page.tsx`

*Example Implementation (`src/app/bride/page.tsx`):*
```typescript
import CategoryPage from '@/components/CategoryPage';
import { getProductsByCategory } from '@/lib/products';

export default function BridePage() {
  const products = getProductsByCategory('bride');
  return (
    <CategoryPage
      label="Bride"
      title="The Bridal Edit"
      description="Two souls, one celebration. Couture crafted for the most important day of your life."
      heroImage="/drive_images_categorised/bridal_2.png"
      products={products}
    />
  );
}
```

#### Step 2: Create Dynamic Collection Route
Create the folder `src/app/collections/[slug]` and add `page.tsx`:
*   Import `notFound` from `next/navigation`.
*   Validate `slug` against the available collections: `onam-2026-chaayam`, `eves-garden-2024`, `parinaya-2026`, and `signature-couture`. If not matching, trigger `notFound()`.
*   Pass relevant metadata (title, description, heroImage) and products to `<CategoryPage />`.

*Example Implementation (`src/app/collections/[slug]/page.tsx`):*
```typescript
import { notFound } from 'next/navigation';
import CategoryPage from '@/components/CategoryPage';
import { getProductsByCollection } from '@/lib/products';

const METADATA: Record<string, { title: string; description: string; heroImage: string }> = {
  'onam-2026-chaayam': {
    title: "Onam 2026 Chaayam",
    description: "Traditional kasavu meets contemporary silhouettes in a harvest palette.",
    heroImage: "/drive_images_categorised/collections_1.png"
  },
  'eves-garden-2024': {
    title: "Eve's Garden 2024",
    description: "Pristine whites and intricate lacework honouring Christian wedding traditions.",
    heroImage: "/drive_images_categorised/collections_2.png"
  },
  'parinaya-2026': {
    title: "Parinaya 2026",
    description: "Majestic silks, rich hues, and timeless bridal grandeur.",
    heroImage: "/drive_images_categorised/collections_3.png"
  },
  'signature-couture': {
    title: "Signature Couture",
    description: "Our signature line of bespoke couture creations.",
    heroImage: "/drive_images_categorised/collections_4.png"
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const metadata = METADATA[slug];
  if (!metadata) notFound();

  const products = getProductsByCollection(slug);
  return (
    <CategoryPage
      label="Collections"
      title={metadata.title}
      description={metadata.description}
      heroImage={metadata.heroImage}
      products={products}
    />
  );
}
```

#### Step 3: Delete Obsolete Directories
Remove the old routing folders to avoid confusion and clean up the codebase:
*   `src/app/bridal`
*   `src/app/ethnic`
*   `src/app/kids`
*   `src/app/semi-party`
*   `src/app/collections/page.tsx`

#### Step 4: Fix Responsive Breakpoint Layout Issues in `CategoryPage.tsx`
1.  **Header squishing (375px)**:
    Modify the header wrapper class in `src/components/CategoryPage.tsx` (Line 58) from a rigid `grid grid-cols-3` to a responsive flex layout:
    ```tsx
    // Before:
    // <header className="fixed top-0 left-0 right-0 z-[100] py-5 px-6 md:px-12 lg:px-[10vw] grid grid-cols-3 items-center bg-gradient-to-b from-black/40 to-transparent">
    // After (flex replacement):
    <header className="fixed top-0 left-0 right-0 z-[100] py-5 px-6 md:px-12 lg:px-[10vw] flex justify-between items-center bg-gradient-to-b from-black/40 to-transparent">
    ```
2.  **Quick View Modal height overflow (375px)**:
    Enable scrolling on the modal inner container by adding `overflow-y-auto` and vertical padding:
    ```tsx
    // Before:
    // className="relative w-full h-full max-w-5xl max-h-[90vh] m-6 flex flex-col items-center justify-center z-[2005]"
    // After:
    className="relative w-full h-full max-w-5xl max-h-[90vh] m-6 flex flex-col items-center justify-start md:justify-center overflow-y-auto py-8 z-[2005]"
    ```
3.  **Large monitor card stretch (1440px+)**:
    Wrap the products grid inside a max-width container in `src/components/CategoryPage.tsx` (Line 94):
    ```tsx
    <section className="px-6 md:px-12 lg:px-[10vw] py-16 md:py-24">
      <div className="max-w-[1400px] mx-auto">
        {/* grid goes here */}
      </div>
    </section>
    ```

---

## 5. Verification Method

To verify the implementation of Milestone 2, run the E2E test suite. 

### Execution Command
Execute the test runner from the root directory:
```powershell
npm run test:e2e
```
*Alternative:*
```powershell
node tests/run-e2e.js
```

### Relevant Test Case Checklist
Ensure that all of the following tests pass cleanly:

*   [ ] **Category Routes Verification**:
    *   `T1.F2.1`: Navigation to `/bride` page displays the brides category.
    *   `T1.F2.2`: Navigation to `/groom` page displays the grooms category.
    *   `T1.F2.3`: Navigation to `/girls` page displays the girls category.
    *   `T1.F2.4`: Navigation to `/boys` page displays the boys category.
    *   `T1.F2.5`: Homepage category links correctly route to `/bride`, `/groom`, `/girls`, `/boys`.
    *   `T2.F2.1`: Invalid category routes correctly trigger 404 or redirect.
    *   `T2.F2.2`: Category route with trailing slash is handled correctly by Next.js.
    *   `T2.F2.3`: Mobile header links for categories point to new dedicated routes.
    *   `T2.F2.4`: Category page layout is responsive and maintains visual rhythm on 375px viewports.
    *   `T2.F2.5`: Category page product cards load lazy images correctly.
*   [ ] **Collection Routes Verification**:
    *   `T1.F3.1`: Navigation to `/collections/onam-2026-chaayam` displays the Onam collection.
    *   `T1.F3.2`: Navigation to `/collections/eves-garden-2024` displays the Christian Wedding collection.
    *   `T1.F3.3`: Navigation to `/collections/parinaya-2026` displays the Hindu Wedding collection.
    *   `T1.F3.4`: Homepage collection rows link correctly to `/collections/[slug]`.
    *   `T1.F3.5`: Navbar collection sub-links route correctly to dedicated collection routes.
    *   `T2.F3.1`: Navigation to a non-existent collection slug returns a 404.
    *   `T2.F3.2`: Collection page reuses the CategoryPage layout engine.
    *   `T2.F3.3`: Collection page shows correct breadcrumbs or navigation path.
    *   `T2.F3.4`: Collection page grid is responsive on mobile viewport.
    *   `T2.F3.5`: Quick view modal triggers and functions on collection pages.
*   [ ] **Cross-Feature Integration Verification**:
    *   `T3.1`: Navigation history and dedicated routes (F1 + F2) - browser history behaves correctly when navigating through new category routes to the cart, then clicking back.
    *   `T3.2`: Dedicated routes and collection routes (F2 + F3) - navigate between category and collection pages and verify links transition correctly.
    *   `T3.3`: Centralized data and category routes (F4 + F2) - verify category page products load dynamically from `src/lib/products.ts`.
    *   `T3.5`: Dedicated routes and size selector (F2 + F5) - verify size choices add items to cart correctly from category page.
