# Handoff Report: Milestone 2 — Restructure Category & Collection Pages

## 1. Observation
We observed the following files and details in the codebase:
- **Product Categories in Database**: In `src/lib/products.ts`, the product database defines category properties as:
  ```typescript
  category: 'bride' | 'groom' | 'girls' | 'boys';
  ```
  Items are statically defined under these categories (e.g., lines 68, 77, 85, etc.), but the existing routes correspond to `/bridal`, `/ethnic`, `/kids`, `/semi-party`, and `/collections`.
- **Existing Page Routing**:
  - `src/app/bridal/page.tsx` retrieves products by filtering:
    ```typescript
    const bridalProducts = getAllProducts().filter(p => p.src.includes('/bridal_'));
    ```
  - `src/app/kids/page.tsx` filters:
    ```typescript
    const kidsProducts = getAllProducts().filter(p => p.src.includes('/kids_'));
    ```
  - `src/app/ethnic/page.tsx` filters:
    ```typescript
    const ethnicProducts = getAllProducts().filter(p => p.src.includes('/ethnic_'));
    ```
  - `src/app/semi-party/page.tsx` filters:
    ```typescript
    const semiPartyProducts = getAllProducts().filter(p => p.src.includes('/semi_party_'));
    ```
- **Existing Collection Routing**: A static route exists at `src/app/collections/page.tsx` that lists products containing `'/collections_'` in their `src` path, rather than resolving individual dynamic slug routes.
- **Header & Navbar Links**:
  - `src/app/page.tsx` contains static links to the old routes:
    - Line 149-150: `<Link href="/bridal" ...>Brides</Link>` and `<Link href="/bridal" ...>Grooms</Link>`
    - Line 158-159: `<Link href="/ethnic" ...>Women</Link>` and `<Link href="/ethnic" ...>Men</Link>`
    - Line 162: `<Link href="/semi-party" ...>`
    - Line 168-169: `<Link href="/kids" ...>Girls</Link>` and `<Link href="/kids" ...>Boys</Link>`
    - Line 177-179: Collapsible links that route to `/collections`
    - Line 196-199: Desktop navbar links to `/bridal`, `/ethnic`, `/semi-party`, `/kids`.
    - Line 266, 274: Split layout links to `/bridal`.
    - Line 325, 333: Grid links to `/ethnic`.
    - Line 426, 434: Grid links to `/kids`.
    - Line 459, 470, 481: Collections links in rows routing to `/collections`.
    - Line 613-617: Footer links routing to `/bridal`, `/ethnic`, `/semi-party`, `/kids`, `/collections`.
- **CategoryPage Layout Details**:
  - Spacing rhythm: Left/Right padding is `px-6 md:px-12 lg:px-[10vw]` and vertical padding is `py-16 md:py-24` on the products grid.
  - Aspect ratio: `aspect-[4/5] overflow-hidden bg-[var(--cream-dark)] mb-4`.
  - Image object-cover: `w-full h-full object-cover object-top`.
  - Hover animation: `group-hover:scale-105 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)]` and `transition-colors group-hover:text-[var(--maroon)]`.
  - Header:
    ```typescript
    <header className="fixed top-0 left-0 right-0 z-[100] py-5 px-6 md:px-12 lg:px-[10vw] grid grid-cols-3 items-center bg-gradient-to-b from-black/40 to-transparent">
    ```
- **E2E Test Suite checks**: In `tests/run-e2e.js`:
  - `T1.F2.1` to `T1.F2.4` test that `/bride`, `/groom`, `/girls`, and `/boys` exist and return status 200.
  - `T2.F2.3` verifies that mobile header links for categories contain `/bride`, `/groom`, `/girls`, and `/boys`.
  - `T1.F3.1` to `T1.F3.3` test `/collections/onam-2026-chaayam`, `/collections/eves-garden-2024`, and `/collections/parinaya-2026`.
  - `T2.F3.1` verifies that invalid collection slugs return a 404 response.
  - `T2.F3.3` verifies that the collection page/CategoryPage contains `breadcrumb` or `Home` or `Collections` or `path` or `title`.

---

## 2. Logic Chain
1. Since the E2E tests for Feature 2 require routes `/bride`, `/groom`, `/girls`, `/boys` to serve status 200, we must create pages at `src/app/bride/page.tsx`, `src/app/groom/page.tsx`, `src/app/girls/page.tsx`, and `src/app/boys/page.tsx`.
2. Since these pages represent specific categories, they must filter products by `p.category === category` instead of querying the image file paths.
3. Since Feature 3 requires collection routes `/collections/[slug]` to load specific collections dynamically and return 404 for invalid slugs, we must create a dynamic route at `src/app/collections/[slug]/page.tsx` and check `slug` against our database and collection metadata.
4. Since `T2.F3.3` checks for breadcrumbs/navigation indicators, we must ensure `CategoryPage.tsx` or the collection pages contain paths like `Home / Collections / [Title]` to pass validation.
5. In `CategoryPage.tsx`, the fixed header contains a grid with 3 columns. At 375px viewport width, the center column gets only ~109px of space, which is too narrow for "Maneesha Chandran" with `tracking-[0.3em]`, causing overflow. Therefore, we should hide the text on mobile viewports using `hidden sm:inline-block`.
6. Since E2E checks `T1.F2.5`, `T2.F2.3`, `T1.F3.4`, and `T1.F3.5` verify that the homepage navbar, mobile menu, and section links point to the new routes instead of the old ones, we must update all links in `src/app/page.tsx` and the footer.

---

## 3. Caveats
- **Lookbook Page**: The lookbook filters by query param `?filter=Bridal` or `?filter=Ethnic` and determines categories based on image source path names. Since the user request focuses on restructuring category/collection routes and updating internal links, we assume the lookbook's internal filtering logic remains as-is, but we will ensure the back link in `lookbook/page.tsx` works correctly.
- **Heritage Page**: The `/heritage` storytelling page contains custom GSAP parallax animations. We assume this page remains intact, but we must update the link in the footer/menu if needed.

---

## 4. Conclusion
We need to create 4 category pages (`/bride`, `/groom`, `/girls`, `/boys`) and 1 dynamic collection page (`/collections/[slug]`) using `CategoryPage` as the layout engine. Additionally, we must update all navbar, drawer, homepage, and footer links in `src/app/page.tsx` to point to the new routes. We must also resolve visual/responsive layout issues on `CategoryPage.tsx` for 375px viewports.

---

## 5. Implementation Strategy (For the Worker)

### Step 1: Create Dedicated Category Pages
Create the following page files:
- **`src/app/bride/page.tsx`**:
  ```typescript
  import CategoryPage from '@/components/CategoryPage';
  import { getProductsByCategory } from '@/lib/products';

  export default function BridePage() {
    const products = getProductsByCategory('bride');
    return (
      <CategoryPage
        label="The Bride Edit"
        title="Where Dreams Meet Reality"
        description="Timeless luxury for the modern bride. Handcrafted details for your special day."
        heroImage="/drive_images_categorised/bridal_2.png"
        products={products}
      />
    );
  }
  ```
- **`src/app/groom/page.tsx`**:
  ```typescript
  import CategoryPage from '@/components/CategoryPage';
  import { getProductsByCategory } from '@/lib/products';

  export default function GroomPage() {
    const products = getProductsByCategory('groom');
    return (
      <CategoryPage
        label="The Groom Edit"
        title="Regal Elegance"
        description="Couture Sherwanis and elegant ensembles meticulously designed for the modern groom."
        heroImage="/drive_images_categorised/bridal_1.png"
        products={products}
      />
    );
  }
  ```
- **`src/app/girls/page.tsx`**:
  ```typescript
  import CategoryPage from '@/components/CategoryPage';
  import { getProductsByCategory } from '@/lib/products';

  export default function GirlsPage() {
    const products = getProductsByCategory('girls');
    return (
      <CategoryPage
        label="Little Princess"
        title="Girls Couture"
        description="Elegance has no age. Handcrafted ethnic ensembles and festive dresses for young ladies."
        heroImage="/drive_images_categorised/kids_1.png"
        products={products}
      />
    );
  }
  ```
- **`src/app/boys/page.tsx`**:
  ```typescript
  import CategoryPage from '@/components/CategoryPage';
  import { getProductsByCategory } from '@/lib/products';

  export default function BoysPage() {
    const products = getProductsByCategory('boys');
    return (
      <CategoryPage
        label="Little Prince"
        title="Boys Couture"
        description="Classic kurtas, sherwanis, and formal sets tailored beautifully for young gentlemen."
        heroImage="/drive_images_categorised/kids_2.png"
        products={products}
      />
    );
  }
  ```

### Step 2: Create Dynamic Collection Pages
- Create **`src/app/collections/[slug]/page.tsx`**:
  ```typescript
  import { notFound } from 'next/navigation';
  import CategoryPage from '@/components/CategoryPage';
  import { getProductsByCollection } from '@/lib/products';

  const collectionsMetadata: Record<string, { label: string, title: string, description: string, heroImage: string }> = {
    'onam-2026-chaayam': {
      label: 'Signature Collection',
      title: 'Onam 2026 Chaayam',
      description: "A vibrant celebration of colours and Kerala's rich heritage. Traditional kasavu meets contemporary silhouettes in a palette inspired by the festival of harvest.",
      heroImage: '/drive_images_categorised/collections_1.png'
    },
    'eves-garden-2024': {
      label: 'Signature Collection',
      title: "Eve's Garden 2024",
      description: 'Pristine whites, intricate lacework, and ethereal beauty. A collection that honours the sacred elegance of Christian wedding traditions with a modern sensibility.',
      heroImage: '/drive_images_categorised/collections_2.png'
    },
    'parinaya-2026': {
      label: 'Signature Collection',
      title: 'Parinaya 2026',
      description: 'Majestic silks, rich hues, and timeless bridal grandeur. Drawing from centuries of tradition, every piece is a testament to the artistry of Indian craftsmanship.',
      heroImage: '/drive_images_categorised/collections_3.png'
    },
    'signature-couture': {
      label: 'Signature Collection',
      title: 'Signature Couture',
      description: 'Our signature couture range, representing the peak of craftsmanship and luxury.',
      heroImage: '/drive_images_categorised/collections_4.png'
    }
  };

  interface PageProps {
    params: {
      slug: string;
    };
  }

  export default function CollectionSlugPage({ params }: PageProps) {
    const { slug } = params;
    const metadata = collectionsMetadata[slug];

    if (!metadata) {
      notFound();
    }

    const products = getProductsByCollection(slug);
    if (products.length === 0) {
      notFound();
    }

    return (
      <CategoryPage
        label={metadata.label}
        title={metadata.title}
        description={metadata.description}
        heroImage={metadata.heroImage}
        products={products}
      />
    );
  }
  ```

### Step 3: Refine CategoryPage.tsx Responsive Styles
Apply the following updates to `src/components/CategoryPage.tsx`:
1. **Prevent Logo Text Overflow (375px responsive fix)**:
   Find the logo text link (line 70) and modify it to hide the text on mobile viewports:
   ```typescript
   // Before
   <span className="text-[10px] uppercase tracking-[0.3em] text-white/90" ...>Maneesha Chandran</span>
   
   // After
   <span className="text-[10px] uppercase tracking-[0.3em] text-white/90 hidden sm:inline-block" ...>Maneesha Chandran</span>
   ```
2. **Breadcrumbs Addition**:
   To robustly pass `T2.F3.3`, add a breadcrumb path indicator below the hero title or inside the bottom section. Inside the Hero text area:
   ```typescript
   <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 lg:px-[10vw] pb-16 md:pb-20">
     <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-2">
       <Link href="/" className="hover:text-white transition-colors">Home</Link>
       <span className="mx-2">/</span>
       {label.includes('Collection') ? (
         <>
           <span className="text-white/30">Collections</span>
           <span className="mx-2">/</span>
         </>
       ) : null}
       <span className="text-[var(--gold)]">{title}</span>
     </div>
     ...
   ```
3. **Adjust Product Grid Spacing**:
   Change grid gap classes (line 101) to support smaller viewports comfortably:
   ```typescript
   // Before
   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-12 md:gap-y-16">
   
   // After
   <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-16">
   ```

### Step 4: Update All Links in src/app/page.tsx
Modify `src/app/page.tsx` to point to the new dedicated paths:
- **Mobile Menu (Drawer)**:
  - Line 149: `<Link href="/bride" ...>Brides</Link>`
  - Line 150: `<Link href="/groom" ...>Grooms</Link>`
  - Line 158: `<Link href="/bride" ...>Women</Link>`
  - Line 159: `<Link href="/groom" ...>Men</Link>`
  - Line 162: `<Link href="/bride" ...>Semi Party Wear</Link>`
  - Line 168: `<Link href="/girls" ...>Girls</Link>`
  - Line 169: `<Link href="/boys" ...>Boys</Link>`
  - Line 177: `<Link href="/collections/onam-2026-chaayam" ...>Onam 2026 Chaayam</Link>`
  - Line 178: `<Link href="/collections/eves-garden-2024" ...>Eve's Garden 2024</Link>`
  - Line 179: `<Link href="/collections/parinaya-2026" ...>Parinaya 2026</Link>`
- **Desktop Navbar**:
  - In `nav-links` (lines 195-200), render links to `/bride`, `/groom`, `/girls`, `/boys`.
  - Update `Collections` link (line 211) or add dynamic sub-links.
- **Section CTA Links**:
  - Line 266: `<Link href="/bride" className="split-pane">`
  - Line 274: `<Link href="/groom" className="split-pane">`
  - Line 325: `<Link href="/bride" className="editorial-item">`
  - Line 333: `<Link href="/groom" className="editorial-item">`
  - Line 414: `<Link href="/bride" className="btn-outline">View All Semi Party Wear</Link>`
  - Line 426: `<Link href="/girls" className="editorial-item">`
  - Line 434: `<Link href="/boys" className="editorial-item">`
- **Collections Row Links**:
  - Line 459: `/collections` -> `/collections/onam-2026-chaayam`
  - Line 470: `/collections` -> `/collections/eves-garden-2024`
  - Line 481: `/collections` -> `/collections/parinaya-2026`
- **Footer Links**:
  - Update all static shop links (lines 613-617) to `/bride`, `/groom`, `/girls`, `/boys`, and `/collections/onam-2026-chaayam`.

### Step 5: Delete Obsolete Directories
Remove the following directories and page files:
- `src/app/bridal`
- `src/app/ethnic`
- `src/app/kids`
- `src/app/semi-party`
- `src/app/collections/page.tsx`

---

## 6. Verification Method
1. Start the Next.js local server at `http://localhost:3000`.
2. Run the E2E test runner script:
   ```powershell
   node tests/run-e2e.js
   ```
3. Inspect `tests/e2e-report.json` to verify that all the listed tests under Feature 2, Feature 3, and Tier 3 combinations (shown below) have passed.

### Test Verification Checklist

| Test ID | Expected Result | Status |
|---|---|---|
| **T1.F2.1** | Navigating to `/bride` page successfully serves status 200 | Pending Implementation |
| **T1.F2.2** | Navigating to `/groom` page successfully serves status 200 | Pending Implementation |
| **T1.F2.3** | Navigating to `/girls` page successfully serves status 200 | Pending Implementation |
| **T1.F2.4** | Navigating to `/boys` page successfully serves status 200 | Pending Implementation |
| **T1.F2.5** | Homepage category links route to new dedicated routes | Pending Implementation |
| **T2.F2.1** | Invalid categories trigger 404 response | Pending Implementation |
| **T2.F2.2** | Routes with trailing slashes function correctly | Pending Implementation |
| **T2.F2.3** | Mobile header category links route to new pages | Pending Implementation |
| **T2.F2.4** | Layout displays responsively on mobile | Pending Implementation |
| **T2.F2.5** | Product cards load images lazily | Pending Implementation |
| **T1.F3.1** | Navigating to `/collections/onam-2026-chaayam` succeeds | Pending Implementation |
| **T1.F3.2** | Navigating to `/collections/eves-garden-2024` succeeds | Pending Implementation |
| **T1.F3.3** | Navigating to `/collections/parinaya-2026` succeeds | Pending Implementation |
| **T1.F3.4** | Homepage collections link to specific collection slugs | Pending Implementation |
| **T1.F3.5** | Navbar links point to dedicated collection routes | Pending Implementation |
| **T2.F3.1** | Invalid collection slug returns 404 | Pending Implementation |
| **T2.F3.2** | Collections page imports `CategoryPage` | Pending Implementation |
| **T2.F3.3** | Collections page shows breadcrumbs/navigation path | Pending Implementation |
| **T2.F3.4** | Collections page is responsive on mobile | Pending Implementation |
| **T2.F3.5** | Quick View works correctly on collections pages | Pending Implementation |
| **T3.1** | Browser history behavior with dedicated routes is correct | Pending Implementation |
| **T3.2** | Dedicated routes and collection routes transition correctly | Pending Implementation |
| **T3.3** | Category page products load dynamically from `products.ts` | Pending Implementation |
| **T3.5** | Sizing selector options add items to cart correctly | Pending Implementation |
