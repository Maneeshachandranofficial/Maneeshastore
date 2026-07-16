# Project: Maneesha Chandran Website Launch Hardening

## Architecture
- **Next.js App Router**: Client-side rendering and routing for category pages (`/bride`, `/groom`, `/girls`, `/boys`), collection pages (`/collections/[slug]`), lookbook (`/lookbook`), and checkout (`/checkout`).
- **Data Source**: Centralized typed product dataset in `src/lib/products.ts` mock-integrating Sanity.io.
- **Cart Context**: React context (`src/context/CartContext.tsx`) maintaining active cart state, items, total, and last visited category.
- **Components**: Reusable UI blocks:
  - `CategoryPage`: Standard layout engine for viewing list of items, triggering quick-view modals.
  - `CheckoutAction`: Located in checkout summary, handles WhatsApp checkouts.
  - `CartDrawer`: Sidebar shopping cart slider.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Centralize Product & Collection Data | Create `src/lib/products.ts` with typed schemas, centralize data, and add `SANITY_INTEGRATION_POINT`. | None | DONE |
| M2 | Restructure Category & Collection Pages | Create `/bride`, `/groom`, `/girls`, `/boys`, and `/collections/[slug]`. Update all navbar, footer, homepage, and lookbook links. Ensure visual rhythm consistency. | M1 | DONE |
| M3 | Size Selector & Checkout Components | Update size selection in quick view (requiresSize flag, elegant display). Build `<CheckoutAction />` with WhatsApp flow and `RAZORPAY_INTEGRATION_POINT`. | M1, M2 | DONE |
| M4 | Navigation Bug Fix & Integration | Correct cart drawer and checkout page back button history behavior using CartContext/session last visited state. | M3 | DONE |

## Interface Contracts
### Product Schema
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

### Checkout Action Component
```typescript
interface CheckoutActionProps {
  cart: CartItem[];
  cartSubtotal: number;
}
```

## Code Layout
- `src/app/` - Routing and layout directories.
- `src/components/` - Global components: `CategoryPage.tsx`, `CartDrawer.tsx`, `FloatingCart.tsx`, `CheckoutAction.tsx`.
- `src/context/` - Global state context files: `CartContext.tsx`.
- `src/lib/` - Shared utility files and database mock: `products.ts`.
