# Navigation Bug Fix & Integration Analysis

## 1. Overview of Current Navigation Flow
Currently, the navigation flow between category/collection pages, lookbook, cart drawer, and checkout is structured as follows:
- **Category/Collection Pages**: Pages like `/bride`, `/groom`, `/girls`, `/boys`, and `/collections/[slug]` render the client-side `<CategoryPage />` component.
- **Lookbook**: The `/lookbook` page renders an editorial showcase from which items can also be added to the cart.
- **Cart State**: Managed globally via `CartContext` (`src/context/CartContext.tsx`). The cart list is stored in a simple client-side React state (`cart`), which resets to an empty array `[]` on page reload (no client-side persistence).
- **CartDrawer Navigation**:
  - The "Secure Checkout" button links to `/checkout` and closes the drawer.
  - When the cart is empty, the "Continue Shopping" button simply triggers `onClick={() => setIsCartOpen(false)}`. It does not navigate the user, even if they opened the drawer on a non-shopping page like the homepage or checkout.
- **Checkout Page Navigation**:
  - The back/back-arrow button in the header is hardcoded to `<Link href="/lookbook" ...>`.
  - The "Explore Collections" CTA button in the empty checkout state is also hardcoded to `<Link href="/lookbook" ...>`.

---

## 2. Proposed Changes

### A. CartContext (`src/context/CartContext.tsx`)
We will add `localStorage` persistence for the active cart items and tracking for the last visited shopping page.

#### Interfaces:
Add `lastVisitedPage` and `setLastVisitedPage` to the `CartContextType` interface.
```typescript
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartSubtotal: number;
  toastMessage: string | null;
  lastVisitedPage: string | null;
  setLastVisitedPage: (page: string) => void;
}
```

#### Provider Logic:
Add states for `lastVisitedPage` and `isInitialized` (to prevent hydration mismatches and prevent overwriting stored items with `[]` on initial render).
```typescript
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [lastVisitedPage, setLastVisitedPageState] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from localStorage on mount (Client-only)
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Failed to parse cart from localStorage', e);
      }
    }
    const storedPage = localStorage.getItem('lastVisitedPage');
    if (storedPage) {
      setLastVisitedPageState(storedPage);
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage whenever cart changes (only after initialization)
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const setLastVisitedPage = (page: string) => {
    setLastVisitedPageState(page);
    localStorage.setItem('lastVisitedPage', page);
  };
  
  // ... rest of logic
```

### B. CategoryPage (`src/components/CategoryPage.tsx`)
Record page visits when a user lands on a category or collection page.
- Import `usePathname` from `next/navigation`.
- Fetch `setLastVisitedPage` from `useCart()`.
- Use a `useEffect` hook to record the path.

```typescript
import { usePathname } from 'next/navigation';
// ...
export default function CategoryPage({ label, title, description, heroImage, products, accentColor }: CategoryPageProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { cart, setIsCartOpen, addToCart, setLastVisitedPage } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) {
      setLastVisitedPage(pathname);
    }
  }, [pathname, setLastVisitedPage]);
  
  // ... rest of component
```

### C. CartDrawer (`src/components/CartDrawer.tsx`)
Incorporate dynamic routing when clicking "Continue Shopping".
- Import `useRouter` and `usePathname` from `next/navigation`.
- Retrieve `lastVisitedPage` from `useCart()`.
- Define a click handler `handleContinueShopping`:
  - Closes the drawer.
  - Dynamically routes to the last visited page with a safe fallback of `/lookbook`.
  - Avoids redundant navigation if already on that page.

```typescript
import { useRouter, usePathname } from 'next/navigation';
// ...
export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartSubtotal, lastVisitedPage } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    const destination = lastVisitedPage || '/lookbook';
    if (pathname !== destination) {
      router.push(destination);
    }
  };
  
  // Inside the empty cart return block:
  // Change:
  // <button onClick={() => setIsCartOpen(false)} ...>Continue Shopping</button>
  // To:
  // <button onClick={handleContinueShopping} ...>Continue Shopping</button>
```

### D. Checkout Page (`src/app/checkout/page.tsx`)
Retrieve `lastVisitedPage` from `useCart()` and update the hardcoded `/lookbook` links.
- Top-left header back link:
  ```typescript
  // Change:
  // <Link href="/lookbook" ...>
  // To:
  // <Link href={lastVisitedPage || '/lookbook'} ...>
  ```
- Empty state "Explore Collections" button:
  ```typescript
  // Change:
  // <Link href="/lookbook" ...>
  // To:
  // <Link href={lastVisitedPage || '/lookbook'} ...>
  ```

---

## 3. File Impact Table

| File | Change Type | Description |
| --- | --- | --- |
| `src/context/CartContext.tsx` | Modification | Load/save cart to `localStorage`, implement and expose `lastVisitedPage` state and setter. |
| `src/components/CategoryPage.tsx` | Modification | Integrate `usePathname` and record visited category/collection routes on mount/transition. |
| `src/components/CartDrawer.tsx` | Modification | Implement `handleContinueShopping` routing using `useRouter`/`usePathname` and empty state CTA update. |
| `src/app/checkout/page.tsx` | Modification | Dynamically render the Continue Shopping links (header and empty state CTA) based on `lastVisitedPage` with `/lookbook` as fallback. |

---

## 4. Verification Plan

### Manual Verification Flow
1. **Local Storage Persistence**:
   - Add items to the cart on `/bride`.
   - Refresh the page and open the Cart Drawer. Verify items are still in the cart.
2. **Category/Collection Tracking**:
   - Navigate to `/boys` and check `localStorage` under `lastVisitedPage`. It should show `/boys`.
   - Navigate to `/collections/onam-2026-chaayam` and check `localStorage`. It should show `/collections/onam-2026-chaayam`.
3. **Cart Drawer "Continue Shopping"**:
   - Navigate to `/checkout` (empty cart) or home page `/`, open Cart Drawer, click "Continue Shopping". Verify the user is redirected to the last tracked category/collection page (e.g. `/collections/onam-2026-chaayam`), or falls back to `/lookbook` if no page is tracked.
4. **Checkout Page Back Links**:
   - Access `/bride`.
   - Add a product to the cart and click "Secure Checkout" in the Cart Drawer.
   - On `/checkout`, click the "Continue Shopping" back arrow in the header. Verify it routes back to `/bride`.
   - Remove the product from the checkout page so it goes to empty state. Click "Explore Collections". Verify it routes back to `/bride`.
