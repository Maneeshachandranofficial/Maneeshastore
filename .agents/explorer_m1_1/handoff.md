# Handoff Report — explorer_m1_1

## 1. Observation

A complete scan of the files under `src/` was conducted to find all occurrences of inline product arrays. The following files and line numbers were observed containing inline product arrays:

- **`src/app/bridal/page.tsx`** (Lines 4-17): Defines `bridalProducts` array.
- **`src/app/ethnic/page.tsx`** (Lines 4-11): Defines `ethnicProducts` array.
- **`src/app/kids/page.tsx`** (Lines 4-7): Defines `kidsProducts` array.
- **`src/app/semi-party/page.tsx`** (Lines 4-11): Defines `semiPartyProducts` array.
- **`src/app/collections/page.tsx`** (Lines 4-11): Defines `collectionProducts` array.
- **`src/app/lookbook/page.tsx`** (Lines 15-28): Defines `lookbookImages` array containing metadata used to mock product structures when items are added to the cart drawer.

Additionally, the home page contains hardcoded product cards in JSX that reference these same image assets but define conflicting titles and prices:
- **`src/app/page.tsx`** (Lines 295-323, 354-382, 393-421): Contains inline JSX handlers calling `handleProductClick(e, { src, title, price })` with manual inline definitions.

### Observed Product Schemas

#### Current Category Page Schema (defined in `src/components/CategoryPage.tsx` lines 8-14):
```typescript
export interface Product {
  id: number;
  src: string;
  title: string;
  price: string;
  sizes?: string[];
}
```

#### Current Lookbook Metadata Schema (defined in `src/app/lookbook/page.tsx` lines 15-28):
```typescript
{
  id: number;
  src: string;
  category: string;
  title: string;
  price: string;
}
```

#### Verbatim Discrepancies Observed:
Across the home page (`page.tsx`), individual category pages, and lookbook images, several identical image assets are defined with conflicting titles or prices:

1. **`bridal_1.png`**:
   - `bridal/page.tsx`: Title: `"The Royal Red"`, Price: `"₹ 85,000"`, Sizes: `['S', 'M', 'L', 'XL']`
   - `page.tsx` (Homepage): Title: `"Royal Sherwani"`, Price: `"₹ 85,000"` (Groom)
   - `lookbook/page.tsx`: Title: `"The Royal Red"`, Price: `"₹ 85,000"`

2. **`bridal_4.png`**:
   - `bridal/page.tsx`: Title: `"The Parinaya Saree"`, Price: `"₹ 1,15,000"`, Sizes: `['M', 'L']`
   - `page.tsx` (Homepage): Title: `"The Parinaya Saree"`, Price: `"₹ 1,15,000"`
   - `lookbook/page.tsx`: Title: `"Ruby Embellishments"`, Price: `"₹ 65,000"`

3. **`ethnic_1.png`**:
   - `ethnic/page.tsx`: Title: `"Golden Threads"`, Price: `"₹ 42,000"`, Sizes: `['S', 'M', 'L', 'XL']`
   - `page.tsx` (Homepage): Title: `"Rose Aura Set"`, Price: `"₹ 42,000"`
   - `lookbook/page.tsx`: Title: `"Golden Threads"`, Price: `"₹ 42,000"`

4. **`ethnic_4.png`**:
   - `ethnic/page.tsx`: Title: `"Sage Linen Kurta"`, Price: `"₹ 38,000"`, Sizes: `['S', 'M', 'L', 'XL']`
   - `page.tsx` (Homepage): Title: `"Sage Linen Kurta"`, Price: `"₹ 38,000"`
   - `lookbook/page.tsx`: Title: `"Banarasi Magic"`, Price: `"₹ 52,000"`

5. **`semi_party_1.png`**:
   - `semi-party/page.tsx`: Title: `"Midnight Velvet"`, Price: `"₹ 28,000"`, Sizes: `['S', 'M', 'L']`
   - `page.tsx` (Homepage): Title: `"Midnight Velvet Set"`, Price: `"₹ 48,000"`

6. **`semi_party_2.jpg`**:
   - `semi-party/page.tsx`: Title: `"Emerald Drape"`, Price: `"₹ 32,000"`, Sizes: `['M', 'L', 'XL']`
   - `page.tsx` (Homepage): Title: `"Blush Sequin Drape"`, Price: `"₹ 35,000"`

7. **`semi_party_3.jpg`**:
   - `semi-party/page.tsx`: Title: `"Sapphire Silhouette"`, Price: `"₹ 35,000"`, Sizes: `['S', 'M', 'L']`
   - `page.tsx` (Homepage): Title: `"Emerald Cocktail Gown"`, Price: `"₹ 55,000"`

8. **`semi_party_4.png`**:
   - `semi-party/page.tsx`: Title: `"Rose Quartz Dress"`, Price: `"₹ 25,000"`, Sizes: `['S', 'M', 'L', 'XL']`
   - `page.tsx` (Homepage): Title: `"Champagne Organza Set"`, Price: `"₹ 45,000"`

9. **`collections_1.png`**:
   - `collections/page.tsx`: Title: `"Onam 2026 Chaayam"`, Price: `"₹ 85,000"`, Sizes: `['S', 'M', 'L']`
   - `lookbook/page.tsx`: Title: `"Summer Velvet"`, Price: `"₹ 38,000"`

10. **`collections_2.png`**:
    - `collections/page.tsx`: Title: `"Eves Garden 2024"`, Price: `"₹ 95,000"`, Sizes: `['S', 'M', 'L']`
    - `lookbook/page.tsx`: Title: `"Monsoon Hue"`, Price: `"₹ 28,000"`

11. **`collections_3.png`**:
    - `collections/page.tsx`: Title: `"Parinaya 2026"`, Price: `"₹ 1,15,000"`
    - `lookbook/page.tsx`: Title: `"Autumn Grace"`, Price: `"₹ 32,000"`

---

## 2. Logic Chain

1. **Discrepancy Root Cause**: The current implementation stores products locally inside individual page files. Because there is no single source of truth, different pages (like `lookbook/page.tsx` or `app/page.tsx`) define titles and prices manually, introducing visual and functional discrepancies (e.g., price and title mismatch when adding from lookbook vs. category pages).
2. **Schema Incomplete State**: The existing product representations lack the fields `requiresSize`, `category`, and `collection` required by the unified `Product` schema in `PROJECT.md`.
3. **Canonical Mapping Rules**:
   - `id`: Assign a unique numeric ID to each product (e.g., 100s for Bridal, 200s for Ethnic, 300s for Kids, 400s for Semi-Party, 500s for Collections) to avoid ID conflicts in query filters and cart context.
   - `category`: Must map to `'bride' | 'groom' | 'girls' | 'boys'`.
     - Kurtas, Sherwanis, and menswear should map to `'groom'` or `'boys'` (for kids).
     - Lehengas, Sarees, and womenswear should map to `'bride'` or `'girls'` (for kids).
   - `requiresSize`: Set to `true` if `sizes` is specified and non-empty (e.g., garments requiring fitting). Set to `false` for draping garments (like sarees) or size-independent items (where `sizes` is empty/undefined).
   - `collection`: Specify collection names (e.g., `"Onam 2026 Chaayam"`, `"Eves Garden 2024"`, `"Parinaya 2026"`) for products belonging to signature series.
4. **Discrepancy Resolution**: Choose a canonical title and price for each asset. The recommendation is to use the values from the specific category pages (e.g., `app/bridal/page.tsx`) as they are the formal catalog pages.

---

## 3. Caveats

- **Lookbook Names/Prices**: We assume the lookbook images are meant to represent the same catalog products rather than unique design variations. If they were meant to be distinct, they would require unique images, but since they share identical URLs, they should be mapped to the canonical product entries.
- **Kids Split**: Kids products currently live under a single `kids` route, but `PROJECT.md` specifies separate `'girls'` and `'boys'` categories. We have categorised `"Festive Mini"` under `'girls'` and `"Little Prince"` under `'boys'`.
- **Groom / Bride Split**: In `bridal/page.tsx`, `bridal_1.png` is named `"The Royal Red"` but on the home page it is `"Royal Sherwani"`. In our design, we recommend `'groom'` for this product, resolving it as `"Royal Sherwani"` to match the groom context.

---

## 4. Conclusion

We propose the following implementation to centralize product data into `src/lib/products.ts`. This design maps all 32 products to conform with the `Product` schema in `PROJECT.md` and provides the `SANITY_INTEGRATION_POINT` to guide the live migration.

### Proposed Code for `src/lib/products.ts`

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

export const products: Product[] = [
  // ─── Bridal Edit (IDs 101 - 112) ───
  {
    id: 101,
    src: '/drive_images_categorised/bridal_1.png',
    title: 'Royal Sherwani',
    price: '₹ 85,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'groom'
  },
  {
    id: 102,
    src: '/drive_images_categorised/bridal_2.png',
    title: 'Vintage Rose lehenga',
    price: '₹ 95,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 103,
    src: '/drive_images_categorised/bridal_3.png',
    title: 'Pearl Encrusted Saree',
    price: '₹ 1,15,000',
    requiresSize: false,
    category: 'bride'
  },
  {
    id: 104,
    src: '/drive_images_categorised/bridal_4.png',
    title: 'The Parinaya Saree',
    price: '₹ 1,15,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'bride',
    collection: 'Parinaya 2026'
  },
  {
    id: 105,
    src: '/drive_images_categorised/bridal_5.png',
    title: 'Ivory Dreaming Lehenga',
    price: '₹ 1,25,000',
    requiresSize: false,
    category: 'bride'
  },
  {
    id: 106,
    src: '/drive_images_categorised/bridal_6.png',
    title: 'Kasavu Bridal Set',
    price: '₹ 65,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 107,
    src: '/drive_images_categorised/bridal_7.png',
    title: 'Ivory Lehenga',
    price: '₹ 95,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 108,
    src: '/drive_images_categorised/bridal_8.png',
    title: 'Gold Tissue Saree',
    price: '₹ 78,000',
    requiresSize: false,
    category: 'bride'
  },
  {
    id: 109,
    src: '/drive_images_categorised/bridal_9.png',
    title: 'Regal Crimson Lehenga',
    price: '₹ 1,05,000',
    requiresSize: true,
    sizes: ['M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 110,
    src: '/drive_images_categorised/bridal_10.png',
    title: 'Temple Gold Set',
    price: '₹ 88,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 111,
    src: '/drive_images_categorised/bridal_11.png',
    title: 'Blush Bridal Lehenga',
    price: '₹ 72,000',
    requiresSize: false,
    category: 'bride'
  },
  {
    id: 112,
    src: '/drive_images_categorised/bridal_12.png',
    title: 'Royal Maroon Lehenga',
    price: '₹ 1,35,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'bride'
  },

  // ─── Ethnic Edit (IDs 201 - 206) ───
  {
    id: 201,
    src: '/drive_images_categorised/ethnic_1.png',
    title: 'Golden Threads',
    price: '₹ 42,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 202,
    src: '/drive_images_categorised/ethnic_2.png',
    title: 'Kanchipuram Silk',
    price: '₹ 55,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'bride'
  },
  {
    id: 203,
    src: '/drive_images_categorised/ethnic_3.jpg',
    title: 'Temple Borders Saree',
    price: '₹ 48,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 204,
    src: '/drive_images_categorised/ethnic_4.png',
    title: 'Sage Linen Kurta',
    price: '₹ 38,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'groom'
  },
  {
    id: 205,
    src: '/drive_images_categorised/ethnic_5.png',
    title: 'Ivory Chanderi Saree',
    price: '₹ 52,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'bride'
  },
  {
    id: 206,
    src: '/drive_images_categorised/ethnic_6.jpg',
    title: 'Maroon Muse Kurta',
    price: '₹ 36,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'groom'
  },

  // ─── Kids Couture (IDs 301 - 302) ───
  {
    id: 301,
    src: '/drive_images_categorised/kids_1.png',
    title: 'Festive Mini Lehanga',
    price: '₹ 12,000',
    requiresSize: true,
    sizes: ['2Y', '4Y', '6Y', '8Y'],
    category: 'girls'
  },
  {
    id: 302,
    src: '/drive_images_categorised/kids_2.png',
    title: 'Little Prince Sherwani',
    price: '₹ 15,000',
    requiresSize: true,
    sizes: ['2Y', '4Y', '6Y', '8Y'],
    category: 'boys'
  },

  // ─── Semi Party Wear (IDs 401 - 406) ───
  {
    id: 401,
    src: '/drive_images_categorised/semi_party_1.png',
    title: 'Midnight Velvet Set',
    price: '₹ 28,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 402,
    src: '/drive_images_categorised/semi_party_2.jpg',
    title: 'Emerald Drape Saree',
    price: '₹ 32,000',
    requiresSize: true,
    sizes: ['M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 403,
    src: '/drive_images_categorised/semi_party_3.jpg',
    title: 'Sapphire Silhouette Dress',
    price: '₹ 35,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  },
  {
    id: 404,
    src: '/drive_images_categorised/semi_party_4.png',
    title: 'Rose Quartz Dress',
    price: '₹ 25,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 405,
    src: '/drive_images_categorised/semi_party_5.jpg',
    title: 'Obsidian Kurta Set',
    price: '₹ 22,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'groom'
  },
  {
    id: 406,
    src: '/drive_images_categorised/semi_party_6.jpg',
    title: 'Champagne Ruffles Dress',
    price: '₹ 45,000',
    requiresSize: true,
    sizes: ['S', 'M'],
    category: 'bride'
  },

  // ─── Signature Collections (IDs 501 - 506) ───
  {
    id: 501,
    src: '/drive_images_categorised/collections_1.png',
    title: 'Onam 2026 Chaayam Kasavu Saree',
    price: '₹ 85,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride',
    collection: 'Onam 2026 Chaayam'
  },
  {
    id: 502,
    src: '/drive_images_categorised/collections_2.png',
    title: 'Eves Garden 2024 Christian Wedding Gown',
    price: '₹ 95,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride',
    collection: 'Eves Garden 2024'
  },
  {
    id: 503,
    src: '/drive_images_categorised/collections_3.png',
    title: 'Parinaya 2026 Hindu Wedding Lehenga',
    price: '₹ 1,15,000',
    requiresSize: false,
    category: 'bride',
    collection: 'Parinaya 2026'
  },
  {
    id: 504,
    src: '/drive_images_categorised/collections_4.png',
    title: 'Gilded Lilies Dress',
    price: '₹ 75,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'bride'
  },
  {
    id: 505,
    src: '/drive_images_categorised/collections_5.jpg',
    title: 'Ruby Reverie Lehenga',
    price: '₹ 82,000',
    requiresSize: true,
    sizes: ['M', 'L'],
    category: 'bride'
  },
  {
    id: 506,
    src: '/drive_images_categorised/collections_6.jpg',
    title: 'Azure Dreams Kurti',
    price: '₹ 90,000',
    requiresSize: true,
    sizes: ['S', 'M', 'L'],
    category: 'bride'
  }
];

/* =============================================================================
   SANITY_INTEGRATION_POINT
   =============================================================================
   Eventually, this mock array will be replaced by a dynamic query fetching from
   a live Sanity.io studio instance. The integration will proceed as follows:

   1. Install Sanity Client libraries:
      `npm install @sanity/client next-sanity`

   2. Configure your Environment Variables (`.env.local`):
      `NEXT_PUBLIC_SANITY_PROJECT_ID=yourProjectID`
      `NEXT_PUBLIC_SANITY_DATASET=production`
      `SANITY_API_TOKEN=yourWriteOrReadToken`

   3. Create the 'product' document schema in Sanity Studio:
      ```javascript
      export default {
        name: 'product',
        title: 'Product',
        type: 'document',
        fields: [
          { name: 'id', title: 'Unique ID', type: 'number' },
          { name: 'image', title: 'Product Image', type: 'image', options: { hotspot: true } },
          { name: 'title', title: 'Title', type: 'string' },
          { name: 'price', title: 'Price String', type: 'string', description: 'e.g., ₹ 85,000' },
          { name: 'requiresSize', title: 'Requires Size Selection', type: 'boolean' },
          { name: 'sizes', title: 'Available Sizes', type: 'array', of: [{ type: 'string' }] },
          { 
            name: 'category', 
            title: 'Category', 
            type: 'string', 
            options: { list: ['bride', 'groom', 'girls', 'boys'] } 
          },
          { name: 'collection', title: 'Collection Name', type: 'string' }
        ]
      }
      ```

   4. Implement live client querying in `src/lib/products.ts`:
      ```typescript
      import { createClient } from '@sanity/client';

      export const sanityClient = createClient({
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
        apiVersion: '2026-07-09',
        useCdn: process.env.NODE_ENV === 'production',
      });

      export async function getLiveProducts(): Promise<Product[]> {
        const query = `*[_type == "product"] | order(id asc) {
          id,
          "src": image.asset->url,
          title,
          price,
          requiresSize,
          sizes,
          category,
          collection
        }`;
        return await sanityClient.fetch(query);
      }
      ```
   ============================================================================= */
```

---

## 5. Verification Method

To verify the observations and logic:
1. Run a build test on the project to ensure no syntax errors are introduced when the mock is in place:
   `npm run build`
2. Inspect the proposed `src/lib/products.ts` layout to verify it matches the schema defined in `PROJECT.md` exactly:
   - `id: number`
   - `src: string`
   - `title: string`
   - `price: string`
   - `requiresSize: boolean`
   - `sizes?: string[]`
   - `category: 'bride' | 'groom' | 'girls' | 'boys'`
   - `collection?: string`
3. Compare the image assets referenced in the centralized mock against the actual image files under `public/drive_images_categorised/` to verify all image names match (e.g. `bridal_1.png` through `bridal_12.png`).
