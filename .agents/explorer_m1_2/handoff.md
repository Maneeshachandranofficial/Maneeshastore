# Handoff Report - explorer_m1_2

## 1. Observation
We scanned the project codebase under `src/` and made the following specific observations of files containing inline product arrays or hardcoded inline product objects, along with their schemas and line numbers:

### A. Inline Product Type Definition
*   **File Path**: `src/components/CategoryPage.tsx`
*   **Lines 8–14**:
    ```typescript
    export interface Product {
      id: number;
      src: string;
      title: string;
      price: string;
      sizes?: string[];
    }
    ```

### B. Category Pages with Inline Product Arrays
*   **File Path**: `src/app/bridal/page.tsx`
    *   **Lines 4–17**: Defines `bridalProducts: Product[]` (12 items) with `sizes` optionally specified.
*   **File Path**: `src/app/ethnic/page.tsx`
    *   **Lines 4–11**: Defines `ethnicProducts: Product[]` (6 items) all having `sizes`.
*   **File Path**: `src/app/kids/page.tsx`
    *   **Lines 4–7**: Defines `kidsProducts: Product[]` (2 items) both having `sizes`.
*   **File Path**: `src/app/semi-party/page.tsx`
    *   **Lines 4–11**: Defines `semiPartyProducts: Product[]` (6 items) all having `sizes`.
*   **File Path**: `src/app/collections/page.tsx`
    *   **Lines 4–11**: Defines `collectionProducts: Product[]` (6 items) with `sizes` optionally specified.

### C. Lookbook Page with Inline Image/Product Array
*   **File Path**: `src/app/lookbook/page.tsx`
    *   **Lines 15–28**: Defines `lookbookImages` containing 12 items. Schema:
        ```typescript
        { id: number; src: string; category: string; title: string; price: string; }
        ```
    *   *Note*: The titles and prices of some images in this lookbook list do not match the values used in the respective category pages (e.g., `/collections` vs `/lookbook`).

### D. Homepage with Inline Product Objects in JSX
*   **File Path**: `src/app/page.tsx`
    *   **Lines 295, 302, 309, 316, 354, 361, 368, 375, 393, 400, 407, 414**: Hardcoded inline objects passed to `handleProductClick` inside the JSX code, such as:
        ```typescript
        handleProductClick(e, { src: '/drive_images_categorised/bridal_4.png', title: 'The Parinaya Saree', price: '₹ 1,15,000' })
        ```

### E. Target Product Schema defined in PROJECT.md
*   **File Path**: `PROJECT.md`
    *   **Lines 21–33**: Defines the expected unified `Product` schema:
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

---

## 2. Logic Chain
1.  **Deduplication and Centralization**: By cross-referencing all image `src` values across the category pages and the lookbook, we identified exactly **32 unique products**.
2.  **Schema Alignment**:
    *   Any product that originally defined a `sizes` array (e.g., `sizes: ['S', 'M', 'L']`) requires size selection, so `requiresSize` is set to `true`.
    *   Products that did not have `sizes` defined (e.g., sarees like "Gold Tissue Saree" or "Pearl Encrusted") have `requiresSize` set to `false`.
    *   Categories are strictly mapped to `'bride' | 'groom' | 'girls' | 'boys'` to meet the target schema. Bridal, Ethnic, and Semi-Party items are mapped to `'bride'` (for women's designs) and `'groom'` (for men's designs). Kids items are mapped to `'girls'` and `'boys'`.
    *   Specific signature collections (Onam 2026 Chaayam, Eve's Garden 2024, Parinaya 2026) are assigned their respective collection slugs under the `collection` attribute. Other collections page items are tagged with `'signature-couture'`.
3.  **Conflict Resolution**: Pricing and title discrepancies between the Lookbook/Homepage and the category pages were resolved in favor of the more descriptive/primary category page data (e.g. `collections_1.png` is resolved as "Onam 2026 Chaayam" with price "₹ 85,000" rather than "Summer Velvet" at "₹ 38,000").
4.  **Integration Transition Plan**: 
    *   Created `proposed_products.ts` with all 32 items correctly schema-typed and containing the required `SANITY_INTEGRATION_POINT` comment block outlining the GROQ queries and client configuration required to transition to Sanity.io.
    *   Created `proposed_changes.patch` to allow the implementer to easily refactor the codebase to import all products from `src/lib/products.ts` instead of declaring inline arrays.

---

## 3. Caveats
*   **Intermediate Filtering**: Since the current routing structure (e.g., `/bridal`, `/ethnic`, `/semi-party`) will be restructured in Milestone 2 into `/bride`, `/groom`, etc., we recommend an interim path-based filter (e.g., `p.src.includes('/bridal_')`) so that existing pages continue to render their exact original subset of items without disruption.
*   **Homepage Event Payload**: In `src/app/page.tsx`, the inline objects do not have IDs. The proposed changes update `handleProductClick` to pull complete products using `getProductById(id)`, which guarantees ID presence and ensures correct price/size tracking in the cart context.

---

## 4. Conclusion
We have successfully located all inline product arrays and designed a comprehensive centralized products dataset in `src/lib/products.ts` (`proposed_products.ts` in our folder) that conforms exactly to the `Product` schema in `PROJECT.md`. The design resolves mock data inconsistencies, incorporates a clear Sanity.io migration template, and includes a precise patch representation of changes needed across the codebase.

---

## 5. Verification Method
To verify the correctness of the proposed centralization:
1.  **File Check**: Verify that the proposed centralized products array in `proposed_products.ts` compiles cleanly under TypeScript and that every item conforms to the target `Product` interface.
2.  **Schema Check**: Confirm that all 32 products define `requiresSize` (boolean) and that the `category` attribute is restricted to `'bride' | 'groom' | 'girls' | 'boys'`.
3.  **Import Verification**: Once the patch is applied, run:
    ```bash
    npm run build
    ```
    Ensure that the Next.js compilation completes without errors, validating that imports from `@/lib/products` function correctly across all category, lookbook, and homepage files.
