# Analysis Report: Navigation Routing & State Persistence

This report contains the analysis, recommended design changes, and file impacts for the navigation routing bugs and shopping session persistence in Milestone 4.

## 1. Overview of Navigation Routing & State Persistence

During E2E validation of the website launch hardening, the following issues were identified in the navigation history tracking and session state persistence:
- **No Client-side Cart Persistence**: Cart items are reset upon page reloads because `CartContext` does not persist items in client storage.
- **Static Navigation in CartDrawer**: The "Continue Shopping" button on the empty cart drawer does not route back to the last visited category/collection page; it only closes the drawer.
- **Static Navigation in Checkout Page**: The "Continue Shopping" link (header) and "Explore Collections" link (empty state) in `src/app/checkout/page.tsx` statically link to `/lookbook`, ignoring the user's historical shopping origin (e.g. `/bride`, `/collections/onam-2026-chaayam`).
- **No Dynamic Category/Collection Tracking**: The system does not record which category or collection the user was browsing before entering checkout or opening the cart drawer.

---

## 2. Recommended Architecture & Design Changes

### A. Session & State Persistence (`src/context/CartContext.tsx`)
1. **Persistence of Cart Items**:
   - Use `localStorage` with a custom key (e.g., `maneesha_cart`) to persist cart items across reloads and devices.
   - To prevent hydration mismatch in Next.js, initialize the state to `[]` and load data from `localStorage` inside a client-side `useEffect` on mount.
   - Track initialization with an `isLoaded` boolean flag. Only write updates to `localStorage` when `isLoaded` is `true` to avoid wiping out stored items with the initial empty array state.
2. **Persistence of Last Visited Shopping Page**:
   - Expose a `lastVisitedPage` state in `CartContextType` that tracks the path of the last visited shopping page.
   - Expose a `setLastVisitedPage(path: string)` function in `CartContextType`.
   - The setter function should only record valid category pages (`/bride`, `/groom`, `/girls`, `/boys`), collection pages (`/collections/[slug]`), or the lookbook page (`/lookbook`). It must ignore non-shopping paths (like `/checkout` or the home page `/`).
   - Store and retrieve the last visited page in `localStorage` (key: `last_visited_shopping_page`) inside the mount hook to persist it across reloads.

### B. Route Visit Recording (`src/components/CategoryPage.tsx` & `src/app/lookbook/page.tsx`)
1. **CategoryPage recording**:
   - Use Next.js client-side hook `usePathname()` from `next/navigation`.
   - Run a `useEffect` that triggers `setLastVisitedPage(pathname)` whenever the `pathname` changes.
   - Since `/bride`, `/groom`, `/girls`, `/boys`, and `/collections/[slug]` all render using the `CategoryPage` component, they will automatically be recorded when a user visits them.
2. **LookbookPage recording**:
   - Add the same `useEffect` logic inside `LookbookContent` in `src/app/lookbook/page.tsx` so that visiting the `/lookbook` page is tracked as a valid shopping origin.

### C. CartDrawer Dynamic Routing (`src/components/CartDrawer.tsx`)
1. **Continue Shopping Button**:
   - Replace the empty state `button` with a Next.js `<Link>` component.
   - Bind its `href` to `lastVisitedPage || '/lookbook'` to fall back gracefully to the lookbook page if no previous history exists.
2. **Mobile Back Button**:
   - Add a mobile-friendly back button or link next to the drawer's close icon, dynamically routing to `lastVisitedPage || '/lookbook'`.
   - Label this link/button clearly with "Back" and ensure it is annotated for E2E search patterns (containing keywords like `back` and `lastVisited`).

### D. Checkout Page Dynamic Routing (`src/app/checkout/page.tsx`)
1. **Header Back Button ("Continue Shopping")**:
   - Retrieve `lastVisitedPage` from `useCart()`.
   - Update the link's `href` to `lastVisitedPage || '/lookbook'`.
2. **Empty State Link ("Explore Collections")**:
   - Update the link's `href` to `lastVisitedPage || '/lookbook'`.

---

## 3. Detailed File Modification Proposals

### File 1: `src/context/CartContext.tsx`
Add `lastVisitedPage` and `setLastVisitedPage` to the context and implement client storage persistence:

```typescript
// Replace lines 14-22 with:
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartSubtotal: number;
  toastMessage: string | null;
  lastVisitedPage: string;
  setLastVisitedPage: (path: string) => void;
}
```

```typescript
// Replace lines 26-52 with:
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastVisitedPage, setLastVisitedPageState] = useState<string>('/lookbook');
  const [isLoaded, setIsLoaded] = useState(false);

  // Client side hydration mount loading
  useEffect(() => {
    const storedCart = localStorage.getItem('maneesha_cart');
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart));
      } catch (e) {
        console.error('Error parsing cart from localStorage', e);
      }
    }

    const storedPage = localStorage.getItem('last_visited_shopping_page');
    if (storedPage) {
      setLastVisitedPageState(storedPage);
    }

    setIsLoaded(true);
  }, []);

  // Write changes to storage only after initial load finishes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('maneesha_cart', JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const setLastVisitedPage = (path: string) => {
    const isShoppingPage = 
      path === '/lookbook' ||
      ['/bride', '/groom', '/girls', '/boys'].includes(path) ||
      path.startsWith('/collections/');

    if (isShoppingPage) {
      setLastVisitedPageState(path);
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_visited_shopping_page', path);
      }
    }
  };

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      return [...prev, item];
    });
    
    // Show toast
    setToastMessage(`Added to Shopping Bag: ${item.title}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      isCartOpen, 
      setIsCartOpen, 
      cartSubtotal, 
      toastMessage,
      lastVisitedPage,
      setLastVisitedPage
    }}>
```

---

### File 2: `src/components/CategoryPage.tsx`
Add imports and hook to trigger routing history capture:

```typescript
// Replace lines 3-7 with:
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/products';
```

```typescript
// Replace lines 21-22 with:
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const { cart, setIsCartOpen, addToCart, setLastVisitedPage } = useCart();
  const pathname = usePathname();

  // Track the page visit
  useEffect(() => {
    if (pathname) {
      setLastVisitedPage(pathname);
    }
  }, [pathname, setLastVisitedPage]);
```

---

### File 3: `src/app/lookbook/page.tsx`
Track lookbook visits as well:

```typescript
// Replace lines 53-54 with:
  const { addToCart, setLastVisitedPage } = useCart();
  
  // Track page visit
  useEffect(() => {
    if (pathname) {
      setLastVisitedPage(pathname);
    }
  }, [pathname, setLastVisitedPage]);
```

---

### File 4: `src/components/CartDrawer.tsx`
Update to use the dynamic `lastVisitedPage` for continue and back navigation:

```typescript
// Replace lines 8-9 with:
export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, cartSubtotal, lastVisitedPage } = useCart();
```

```typescript
// Replace header action button (lines 52-58) to include a mobile back button:
          <div className="flex items-center gap-4">
            <Link
              href={lastVisitedPage || '/lookbook'}
              onClick={() => setIsCartOpen(false)}
              className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors duration-300 flex items-center gap-1 sm:hidden"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back
            </Link>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors duration-300 p-1"
              aria-label="Close shopping bag"
            >
              <X size={22} strokeWidth={1} />
            </button>
          </div>
```

```typescript
// Replace empty state button (lines 78-83) with dynamic Link:
              <Link
                href={lastVisitedPage || '/lookbook'}
                onClick={() => setIsCartOpen(false)}
                className="btn-outline text-[10px] px-8 py-3 tracking-[0.2em] inline-block text-center"
              >
                Continue Shopping
              </Link>
```

```typescript
// Optionally add a continue shopping option to the footer when cart has items (lines 159-167):
            <div className="px-10 pt-4 pb-8 flex flex-col gap-3">
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="btn-primary w-full py-4 text-[11px] tracking-[0.2em] block text-center"
              >
                Secure Checkout
              </Link>
              <Link
                href={lastVisitedPage || '/lookbook'}
                onClick={() => setIsCartOpen(false)}
                className="text-[10px] uppercase tracking-[0.2em] text-center text-[var(--text-muted)] hover:text-[var(--text-dark)] transition-colors duration-300 block py-1"
              >
                Continue Shopping
              </Link>
            </div>
```

---

### File 5: `src/app/checkout/page.tsx`
Retrieve history origin from context and bind Continue Shopping/Explore links dynamically:

```typescript
// Replace lines 7-8 with:
export default function CheckoutPage() {
  const { cart, removeFromCart, cartSubtotal, lastVisitedPage } = useCart();
```

```typescript
// Replace lines 16-17 with:
          <Link
            href={lastVisitedPage || '/lookbook'}
```

```typescript
// Replace lines 91-92 with:
            <Link
              href={lastVisitedPage || '/lookbook'}
```

---

## 4. Verification Plan

The implementer can verify the correctness of these fixes by executing the project's E2E test harness.

1. **Verify State Persistence**:
   - Add items to the cart.
   - Refresh the page and verify that the items in the cart are preserved.
   - Run the E2E test specifically checking for state persistence (`T2.F1.1` and `T4.5`).
2. **Verify Navigation Origin Tracking**:
   - Navigate to `/bride` and add an item.
   - Go to checkout and verify that the "Continue Shopping" button returns you back to `/bride`.
   - Go to `/collections/eves-garden-2024` and verify that navigation from checkout returns you back to `/collections/eves-garden-2024`.
   - Open checkout directly and verify that clicking the back button routes you to `/lookbook` (the default fallback).
3. **Execute Test Commands**:
   - Start the Next.js dev server: `npm run dev`
   - Run all E2E tests: `npm run test:e2e`
   - Ensure all 82 E2E test cases pass, particularly:
     - `T1.F1.2`
     - `T1.F1.3`
     - `T1.F1.4`
     - `T1.F1.5`
     - `T2.F1.1`
     - `T2.F1.2`
     - `T2.F1.4`
     - `T4.5`
