# Handoff Report - Milestone M1_3: Product Data Scan & Centralization Design

## 1. Observation
We scanned the project files under `src/` to identify files containing inline product arrays. Six files were identified containing product arrays declared at the top of the file:

1. **`src/app/bridal/page.tsx` (Lines 4-17)**
   * **Array name:** `bridalProducts`
   * **Verbatim array declaration:**
     ```typescript
     const bridalProducts: Product[] = [
       { id: 1, src: '/drive_images_categorised/bridal_1.png', title: 'The Royal Red', price: '₹ 85,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 2, src: '/drive_images_categorised/bridal_2.png', title: 'Vintage Rose', price: '₹ 95,000', sizes: ['S', 'M', 'L'] },
       { id: 3, src: '/drive_images_categorised/bridal_3.png', title: 'Pearl Encrusted', price: '₹ 1,15,000' },
       { id: 4, src: '/drive_images_categorised/bridal_4.png', title: 'The Parinaya Saree', price: '₹ 1,15,000', sizes: ['M', 'L'] },
       { id: 5, src: '/drive_images_categorised/bridal_5.png', title: 'Ivory Dreaming', price: '₹ 1,25,000' },
       { id: 6, src: '/drive_images_categorised/bridal_6.png', title: 'Kasavu Bridal Set', price: '₹ 65,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 7, src: '/drive_images_categorised/bridal_7.png', title: 'Ivory Lehenga', price: '₹ 95,000', sizes: ['S', 'M', 'L'] },
       { id: 8, src: '/drive_images_categorised/bridal_8.png', title: 'Gold Tissue Saree', price: '₹ 78,000' },
       { id: 9, src: '/drive_images_categorised/bridal_9.png', title: 'Regal Crimson', price: '₹ 1,05,000', sizes: ['M', 'L', 'XL'] },
       { id: 10, src: '/drive_images_categorised/bridal_10.png', title: 'Temple Gold Set', price: '₹ 88,000', sizes: ['S', 'M', 'L'] },
       { id: 11, src: '/drive_images_categorised/bridal_11.png', title: 'Blush Bridal', price: '₹ 72,000' },
       { id: 12, src: '/drive_images_categorised/bridal_12.png', title: 'Royal Maroon', price: '₹ 1,35,000', sizes: ['M', 'L'] },
     ];
     ```

2. **`src/app/collections/page.tsx` (Lines 4-11)**
   * **Array name:** `collectionProducts`
   * **Verbatim array declaration:**
     ```typescript
     const collectionProducts: Product[] = [
       { id: 1, src: '/drive_images_categorised/collections_1.png', title: 'Onam 2026 Chaayam', price: '₹ 85,000', sizes: ['S', 'M', 'L'] },
       { id: 2, src: '/drive_images_categorised/collections_2.png', title: 'Eves Garden 2024', price: '₹ 95,000', sizes: ['S', 'M', 'L'] },
       { id: 3, src: '/drive_images_categorised/collections_3.png', title: 'Parinaya 2026', price: '₹ 1,15,000' },
       { id: 4, src: '/drive_images_categorised/collections_4.png', title: 'Gilded Lilies', price: '₹ 75,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 5, src: '/drive_images_categorised/collections_5.jpg', title: 'Ruby Reverie', price: '₹ 82,000', sizes: ['M', 'L'] },
       { id: 6, src: '/drive_images_categorised/collections_6.jpg', title: 'Azure Dreams', price: '₹ 90,000', sizes: ['S', 'M', 'L'] },
     ];
     ```

3. **`src/app/ethnic/page.tsx` (Lines 4-11)**
   * **Array name:** `ethnicProducts`
   * **Verbatim array declaration:**
     ```typescript
     const ethnicProducts: Product[] = [
       { id: 1, src: '/drive_images_categorised/ethnic_1.png', title: 'Golden Threads', price: '₹ 42,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 2, src: '/drive_images_categorised/ethnic_2.png', title: 'Kanchipuram Silk', price: '₹ 55,000', sizes: ['M', 'L'] },
       { id: 3, src: '/drive_images_categorised/ethnic_3.jpg', title: 'Temple Borders', price: '₹ 48,000', sizes: ['S', 'M', 'L'] },
       { id: 4, src: '/drive_images_categorised/ethnic_4.png', title: 'Sage Linen Kurta', price: '₹ 38,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 5, src: '/drive_images_categorised/ethnic_5.png', title: 'Ivory Chanderi Saree', price: '₹ 52,000', sizes: ['M', 'L'] },
       { id: 6, src: '/drive_images_categorised/ethnic_6.jpg', title: 'Maroon Muse Kurta', price: '₹ 36,000', sizes: ['S', 'M', 'L', 'XL'] },
     ];
     ```

4. **`src/app/kids/page.tsx` (Lines 4-7)**
   * **Array name:** `kidsProducts`
   * **Verbatim array declaration:**
     ```typescript
     const kidsProducts: Product[] = [
       { id: 1, src: '/drive_images_categorised/kids_1.png', title: 'Festive Mini', price: '₹ 12,000', sizes: ['2Y', '4Y', '6Y', '8Y'] },
       { id: 2, src: '/drive_images_categorised/kids_2.png', title: 'Little Prince', price: '₹ 15,000', sizes: ['2Y', '4Y', '6Y', '8Y'] },
     ];
     ```

5. **`src/app/semi-party/page.tsx` (Lines 4-11)**
   * **Array name:** `semiPartyProducts`
   * **Verbatim array declaration:**
     ```typescript
     const semiPartyProducts: Product[] = [
       { id: 1, src: '/drive_images_categorised/semi_party_1.png', title: 'Midnight Velvet', price: '₹ 28,000', sizes: ['S', 'M', 'L'] },
       { id: 2, src: '/drive_images_categorised/semi_party_2.jpg', title: 'Emerald Drape', price: '₹ 32,000', sizes: ['M', 'L', 'XL'] },
       { id: 3, src: '/drive_images_categorised/semi_party_3.jpg', title: 'Sapphire Silhouette', price: '₹ 35,000', sizes: ['S', 'M', 'L'] },
       { id: 4, src: '/drive_images_categorised/semi_party_4.png', title: 'Rose Quartz Dress', price: '₹ 25,000', sizes: ['S', 'M', 'L', 'XL'] },
       { id: 5, src: '/drive_images_categorised/semi_party_5.jpg', title: 'Obsidian Kurta Set', price: '₹ 22,000', sizes: ['M', 'L'] },
       { id: 6, src: '/drive_images_categorised/semi_party_6.jpg', title: 'Champagne Ruffles', price: '₹ 45,000', sizes: ['S', 'M'] },
     ];
     ```

6. **`src/app/lookbook/page.tsx` (Lines 15-28)**
   * **Array name:** `lookbookImages`
   * **Verbatim array declaration:**
     ```typescript
     const lookbookImages = [
       { id: 1, src: '/drive_images_categorised/bridal_1.png', category: 'Bridal', title: 'The Royal Red', price: '₹ 85,000' },
       { id: 2, src: '/drive_images_categorised/ethnic_1.png', category: 'Ethnic', title: 'Golden Threads', price: '₹ 42,000' },
       { id: 3, src: '/drive_images_categorised/collections_1.png', category: 'Collections', title: 'Summer Velvet', price: '₹ 38,000' },
       { id: 4, src: '/drive_images_categorised/bridal_2.png', category: 'Bridal', title: 'Vintage Rose', price: '₹ 95,000' },
       { id: 5, src: '/drive_images_categorised/ethnic_2.png', category: 'Ethnic', title: 'Kanchipuram Silk', price: '₹ 55,000' },
       { id: 6, src: '/drive_images_categorised/collections_2.png', category: 'Collections', title: 'Monsoon Hue', price: '₹ 28,000' },
       { id: 7, src: '/drive_images_categorised/bridal_3.png', category: 'Bridal', title: 'Pearl Encrusted', price: '₹ 1,15,000' },
       { id: 8, src: '/drive_images_categorised/ethnic_3.jpg', category: 'Ethnic', title: 'Temple Borders', price: '₹ 48,000' },
       { id: 9, src: '/drive_images_categorised/bridal_4.png', category: 'Bridal', title: 'Ruby Embellishments', price: '₹ 65,000' },
       { id: 10, src: '/drive_images_categorised/collections_3.png', category: 'Collections', title: 'Autumn Grace', price: '₹ 32,000' },
       { id: 11, src: '/drive_images_categorised/bridal_5.png', category: 'Bridal', title: 'Ivory Dreaming', price: '₹ 1,25,000' },
       { id: 12, src: '/drive_images_categorised/ethnic_4.png', category: 'Ethnic', title: 'Banarasi Magic', price: '₹ 52,000' },
     ];
     ```

We also observed hardcoded product elements in **`src/app/page.tsx`** (homepage) referenced in quick view trigger calls:
* Line 295: `handleProductClick(e, { src: '/drive_images_categorised/bridal_4.png', title: 'The Parinaya Saree', price: '₹ 1,15,000' })`
* Line 302: `handleProductClick(e, { src: '/drive_images_categorised/bridal_1.png', title: 'Royal Sherwani', price: '₹ 85,000' })`
* Line 309: `handleProductClick(e, { src: '/drive_images_categorised/bridal_6.png', title: 'Kasavu Bridal Set', price: '₹ 65,000' })`
* Line 316: `handleProductClick(e, { src: '/drive_images_categorised/bridal_7.png', title: 'Ivory Lehenga', price: '₹ 95,000' })`
* Line 354: `handleProductClick(e, { src: '/drive_images_categorised/ethnic_1.png', title: 'Rose Aura Set', price: '₹ 42,000' })`
* Line 361: `handleProductClick(e, { src: '/drive_images_categorised/ethnic_4.png', title: 'Sage Linen Kurta', price: '₹ 38,000' })`
* Line 368: `handleProductClick(e, { src: '/drive_images_categorised/ethnic_5.png', title: 'Ivory Chanderi Saree', price: '₹ 52,000' })`
* Line 375: `handleProductClick(e, { src: '/drive_images_categorised/ethnic_6.jpg', title: 'Maroon Muse Kurta', price: '₹ 36,000' })`
* Line 393: `handleProductClick(e, { src: '/drive_images_categorised/semi_party_1.png', title: 'Midnight Velvet Set', price: '₹ 48,000' })`
* Line 400: `handleProductClick(e, { src: '/drive_images_categorised/semi_party_2.jpg', title: 'Blush Sequin Drape', price: '₹ 35,000' })`
* Line 407: `handleProductClick(e, { src: '/drive_images_categorised/semi_party_3.jpg', title: 'Emerald Cocktail Gown', price: '₹ 55,000' })`
* Line 414: `handleProductClick(e, { src: '/drive_images_categorised/semi_party_4.png', title: 'Champagne Organza Set', price: '₹ 45,000' })`

### Product Data Discrepancies
When comparing the arrays, several items using the same image source (`src`) differ in title, price, or sizes across files:
* **`bridal_1.png`**:
  * Homepage: "Royal Sherwani" (price: ₹ 85,000)
  * Bridal Page / Lookbook: "The Royal Red" (price: ₹ 85,000, sizes: `['S', 'M', 'L', 'XL']`)
* **`bridal_4.png`**:
  * Homepage / Bridal Page: "The Parinaya Saree" (price: ₹ 1,15,000, sizes: `['M', 'L']`)
  * Lookbook: "Ruby Embellishments" (price: ₹ 65,000)
* **`collections_1.png`**:
  * Collections Page: "Onam 2026 Chaayam" (price: ₹ 85,000, sizes: `['S', 'M', 'L']`)
  * Lookbook: "Summer Velvet" (price: ₹ 38,000)
* **`collections_2.png`**:
  * Collections Page: "Eves Garden 2024" (price: ₹ 95,000, sizes: `['S', 'M', 'L']`)
  * Lookbook: "Monsoon Hue" (price: ₹ 28,000)
* **`collections_3.png`**:
  * Collections Page: "Parinaya 2026" (price: ₹ 1,15,000)
  * Lookbook: "Autumn Grace" (price: ₹ 32,000)
* **`ethnic_4.png`**:
  * Homepage / Ethnic Page: "Sage Linen Kurta" (price: ₹ 38,000, sizes: `['S', 'M', 'L', 'XL']`)
  * Lookbook: "Banarasi Magic" (price: ₹ 52,000)
* **`semi_party_1.png`**:
  * Homepage: "Midnight Velvet Set" (price: ₹ 48,000)
  * Semi-Party Page: "Midnight Velvet" (price: ₹ 28,000, sizes: `['S', 'M', 'L']`)
* **`semi_party_2.jpg`**:
  * Homepage: "Blush Sequin Drape" (price: ₹ 35,000)
  * Semi-Party Page: "Emerald Drape" (price: ₹ 32,000, sizes: `['M', 'L', 'XL']`)
* **`semi_party_3.jpg`**:
  * Homepage: "Emerald Cocktail Gown" (price: ₹ 55,000)
  * Semi-Party Page: "Sapphire Silhouette" (price: ₹ 35,000, sizes: `['S', 'M', 'L']`)
* **`semi_party_4.png`**:
  * Homepage: "Champagne Organza Set" (price: ₹ 45,000)
  * Semi-Party Page: "Rose Quartz Dress" (price: ₹ 25,000, sizes: `['S', 'M', 'L', 'XL']`)

---

## 2. Logic Chain
1. We identified 32 unique images representing products.
2. In the existing codebase, product lists are duplicated inline inside multiple page modules (`src/app/bridal/page.tsx`, `src/app/collections/page.tsx`, etc.).
3. The inline arrays are out-of-sync regarding titles and prices for identical image assets.
4. To meet the requirements of Milestone M1 and centralize the data, a centralized dataset is required.
5. In `PROJECT.md`, the canonical `Product` schema requires specific types:
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
6. Mapping logic:
   * **`category`**: The allowed values are `'bride' | 'groom' | 'girls' | 'boys'`.
     * Kids products map to `girls` ("Festive Mini") and `boys` ("Little Prince").
     * Men's items (such as "Sage Linen Kurta" and "Maroon Muse Kurta") map to `groom`.
     * Women's bridal, collections, ethnic, and party wear items map to `bride`.
   * **`requiresSize`**: Set to `true` if a product has a non-empty `sizes` array, and `false` otherwise (e.g. sarees or standard free-size sets like "Pearl Encrusted").
   * **`collection`**: Set to the collection slug (e.g., `'parinaya-2026'`, `'eves-garden-2024'`, or `'onam-2026-chaayam'`) for products belonging to a specific collection.
7. To facilitate implementation, we wrote the reconciled static data and the SANITY_INTEGRATION_POINT comments into `c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\explorer_m1_3\proposed_products.ts`.

---

## 3. Caveats
* **Product categorization mapping assumptions**: We mapped some items like "The Royal Red" (which might be "Royal Sherwani" on the homepage) to `bride` and "Sage Linen Kurta" to `groom` based on titles. A final content verification with the client might adjust some mappings.
* **Pricing resolutions**: Discrepancies between the homepage, lookbook, and individual category pages were resolved in favor of the category page definitions (since they represent the primary product listing pages).

---

## 4. Conclusion
Centralizing the product lists into `src/lib/products.ts` will resolve the discrepancies and enforce the unified schema from `PROJECT.md`. The design is fully documented, and a ready-to-use proposed file has been written to `proposed_products.ts` in our working directory.

---

## 5. Verification Method
1. Inspect `proposed_products.ts` in this directory to verify it conforms to the target schema:
   * Contains exactly 32 products.
   * Every product has `id: number`, `src: string`, `title: string`, `price: string`, `requiresSize: boolean`.
   * Optional properties `sizes?: string[]` and `collection?: string` are included.
   * `category` is restricted strictly to `'bride' | 'groom' | 'girls' | 'boys'`.
2. When implemented, compile the project using `npm run build` or `npm run lint` to ensure type-safety against the new interface.
