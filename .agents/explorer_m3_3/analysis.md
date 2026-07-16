# Milestone 3 - Technical Analysis Report

This analysis documents the codebase structure, current implementation details, and proposals for implementing the size selector and checkout actions for Milestone 3.

---

## 1. Quick View Size Selector (`src/components/CategoryPage.tsx`)

### Current Structure
The `CategoryPage` is a client-side component (`'use client'`) that handles displaying products for individual categories. Key state variables and handlers include:
- `selectedProduct` (`Product | null`): Tracks the product currently viewed in the quick-view modal.
- `selectedSize` (`string`): Tracks the selected size for addition to the cart.
- `handleSelectProduct(product)`: Resets or sets the active product, defaulting the `selectedSize` to the first item in the product's sizes array (`product.sizes[0]`) if it exists.
- `handleAddToCart()`: Converts the product price string to a number (removing formatting characters) and adds it to the global cart context using `addToCart`.

Currently, the size selector rendering section is:
```typescript
{/* Size Selector */}
{selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
  <div className="flex gap-3 mb-8">
    {selectedProduct.sizes.map((size) => (
      <button
        key={size}
        onClick={() => setSelectedSize(size)}
        className={`w-10 h-10 border text-xs uppercase tracking-widest transition-all duration-300 ${
          selectedSize === size
            ? 'border-[var(--gold)] text-[var(--gold)] bg-white/5'
            : 'border-white/20 text-white/50 hover:border-white/50 hover:text-white/80'
        }`}
      >
        {size}
      </button>
    ))}
  </div>
)}
```

### Proposed Structure for "Free Size / One Size" and Premium Sizing
We propose updating the selector to check the `requiresSize` flag on the `Product` schema:
1. **Requires Size (`requiresSize === true`)**: Render an elegant, premium styled selector with hover animations, scale transitions, and active gold shadow styling. It should display a small "Select Size" label and the active selected size.
2. **Does Not Require Size (`requiresSize === false`)**: Show a premium, minimal, non-interactive badge styled with a low-opacity border indicating "Free Size / One Size".
3. **State Defaults**: In `handleSelectProduct`, if `product.requiresSize` is `false`, default the `selectedSize` to `"One Size"`.

#### Proposed Code Snippet
```tsx
{/* Size Selector */}
{selectedProduct.requiresSize ? (
  <div className="mb-8 w-full max-w-xs mx-auto">
    <div className="flex justify-between items-center mb-3">
      <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Select Size</span>
      {selectedSize && (
        <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)] font-medium">
          Active: {selectedSize}
        </span>
      )}
    </div>
    <div className="flex justify-center gap-3">
      {selectedProduct.sizes?.map((size) => (
        <button
          key={size}
          onClick={() => setSelectedSize(size)}
          className={`w-12 h-12 border text-xs uppercase tracking-widest transition-all duration-300 relative flex items-center justify-center font-medium ${
            selectedSize === size
              ? 'border-[var(--gold)] text-[var(--gold)] bg-white/10 scale-105 shadow-[0_0_15px_rgba(212,175,55,0.15)] font-bold'
              : 'border-white/10 text-white/60 hover:border-white/30 hover:text-white bg-white/0 hover:bg-white/5'
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  </div>
) : (
  <div className="mb-8 flex flex-col items-center">
    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-2">Size</span>
    <div className="text-white/80 text-xs uppercase tracking-[0.2em] px-5 py-2.5 border border-white/10 bg-white/5 rounded-none font-medium">
      Free Size / One Size
    </div>
  </div>
)}
```

---

## 2. Checkout Component Isolation (`src/components/CheckoutAction.tsx`)

### Checkout Page (`src/app/checkout/page.tsx`) Structure
The checkout page retrieves active items from `useCart()` and renders:
- An inline navigation header showing "Continue Shopping" and the brand logo.
- A split layout for larger screens (two-column layout: Cart items on the left, Order Summary box on the right).
- On mobile, it defaults to a vertical layout (items list followed by the Order Summary card).
- The payment trigger button is currently a static markup button inside the Order Summary box.

### Isolation Proposal
We propose extracting the checkout trigger button into a new component: `src/components/CheckoutAction.tsx`.

#### Component Contract (`CheckoutActionProps`):
```typescript
export interface CheckoutActionProps {
  cart: CartItem[];
  cartSubtotal: number;
}
```

#### Proposed `CheckoutAction.tsx` Implementation:
```tsx
'use client';

import React from 'react';
import { CartItem } from '@/context/CartContext';

interface CheckoutActionProps {
  cart: CartItem[];
  cartSubtotal: number;
}

export default function CheckoutAction({ cart, cartSubtotal }: CheckoutActionProps) {
  // Generates formatted WhatsApp checkout message
  const generateWhatsAppMessage = () => {
    let message = "Hello Maneesha Chandran team, I would like to place an order for the following items:\n\n";
    
    cart.forEach((item, index) => {
      message += `*${index + 1}. ${item.title}*\n`;
      message += `- Category: ${item.category}\n`;
      message += `- Size: ${item.size}\n`;
      message += `- Price: ₹ ${item.price.toLocaleString('en-IN')}\n\n`;
    });
    
    message += `*Total Value:* ₹ ${cartSubtotal.toLocaleString('en-IN')}\n\n`;
    message += "Please let me know the availability and share payment/delivery details. Thank you!";
    
    return encodeURIComponent(message);
  };

  const whatsappUrl = `https://wa.me/918072071420?text=${generateWhatsAppMessage()}`;

  const handleCheckout = () => {
    /* 
     * ==========================================
     * RAZORPAY_INTEGRATION_POINT
     * ------------------------------------------
     * To integrate Razorpay online payment:
     * 1. Load Razorpay script (https://checkout.razorpay.com/v1/checkout.js)
     * 2. Call API to create a Razorpay order on server-side using order amount
     * 3. Instantiate Razorpay checkout modal with options:
     *    const options = {
     *      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
     *      amount: cartSubtotal * 100, // in paise
     *      currency: 'INR',
     *      name: 'Maneesha Chandran',
     *      description: 'Order Payment',
     *      order_id: created_order_id,
     *      handler: function(response) {
     *         // Verify payment and redirect to success page
     *      }
     *    };
     *    const rzp = new window.Razorpay(options);
     *    rzp.open();
     * ==========================================
     */
    // Fallback/Direct WhatsApp Checkout Flow
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      <button 
        onClick={handleCheckout}
        className="btn-primary w-full py-4 text-[11px] tracking-[0.2em] flex items-center justify-center gap-2 bg-[var(--maroon)] text-white hover:bg-[var(--maroon-deep)] transition-all duration-300"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="inline-block">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.188-1.358a9.937 9.937 0 0 0 4.82 1.239h.005c5.507 0 9.99-4.478 9.99-9.985a9.983 9.983 0 0 0-9.991-9.996zM17.47 16.36c-.297.838-1.42 1.547-2.316 1.73-.61.127-1.41.226-4.088-.885-3.42-1.418-5.62-4.9-5.79-5.127-.17-.226-1.378-1.83-1.378-3.491 0-1.662.87-2.48 1.18-2.82.31-.34.68-.425.9-.425h.647c.207 0 .487-.078.758.577.27.653.93 2.27 1.01 2.433.08.163.13.353.02.576-.11.222-.17.362-.338.56-.168.196-.353.438-.504.587-.168.167-.344.35-.147.684.197.333.874 1.442 1.874 2.33 1.288 1.144 2.373 1.5 2.709 1.667.336.167.534.138.733-.092.2-.23.854-1.004 1.084-1.35.23-.346.46-.288.777-.172.317.115 2.016.953 2.36 1.127.345.172.577.257.662.404.085.146.085.845-.21 1.683z"/>
        </svg>
        Checkout via WhatsApp
      </button>
      
      <a 
        href="tel:+918072071420"
        className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)] hover:text-[var(--maroon)] hover:border-[var(--maroon)] transition-colors duration-300 text-center py-3 border border-black/10 font-medium"
      >
        Call to Order: +91 80720 71420
      </a>
    </div>
  );
}
```

---

## 3. WhatsApp Checkout Message Formatting & Secondary Tap-to-Call

- **Target Phone Number**: `+918072071420` (encoded as `918072071420` in the WhatsApp link).
- **Secondary Tap-to-Call**: Uses `tel:+918072071420`.
- **Pre-filled Message Content**: A clean, luxury-oriented structure using markdown bold (`*`) and bullet points (`-`). 

### Message Template:
```
Hello Maneesha Chandran team, I would like to place an order for the following items:

*1. Pearl Encrusted*
- Category: Groom
- Size: One Size
- Price: ₹ 1,15,000

*2. Ivory Lehenga*
- Category: Bride
- Size: M
- Price: ₹ 95,000

*Total Value:* ₹ 2,10,000

Please let me know the availability and share payment/delivery details. Thank you!
```

---

## 4. Mobile Layout & Header Overlap Fix

### Current Problem
In `src/app/checkout/page.tsx`, the header layout is:
```tsx
<header className="py-8 grid grid-cols-3 items-center border-b border-black/[0.06]">
```
Since `grid-cols-3` splits layout space into 3 equal cells (each exactly 33% of the viewport width minus padding):
- On mobile screen widths (320px to 480px), the center brand column gets squashed to roughly `90px` to `120px` width.
- The brand text `"Maneesha Chandran"` with `tracking-[0.3em]` requires roughly `150px` to render without wrapping or overflowing.
- This causes the text to wrap awkwardly or overlap with the "Continue Shopping" back arrow.

### Proposed Solution
1. **Flexible Columns**: Change the grid definition from `grid-cols-3` to `grid-cols-[1fr_auto_1fr]` (or `grid-cols-[auto_1fr_auto]`). This allocates only the necessary width for the back button and forces the center brand element to take up its natural width, preventing text-wrapping and overlap.
2. **Padding Optimization**: Reduce padding on mobile viewports to `py-4 px-4` and scale to `py-8 px-16` on tablet/desktop viewports.
3. **Preserving Order Summary**: Keep the Order Summary card styled with `w-full lg:w-[360px]` inside the `flex flex-col lg:flex-row` parent, ensuring it stacks beautifully under the cart items on mobile.

---

## 5. Test Infrastructure Analysis

### Test Architecture
- The project implements a custom Node.js-based E2E test runner (`tests/run-e2e.js`) containing exactly 82 test cases across 4 tiers of complexity.
- **Two Modes of Operation**:
  1. **Live HTTP Assertion Mode**: Runs against a local server at `http://localhost:3000` to fetch and assert responses.
  2. **Static Fallback Mode**: Parses files statically (AST, substring matching) if no server is running.

### Key Commands
- To run E2E tests: `npm run test:e2e` or `npm test`
- Results are printed as clean, colorized text to the console, and saved as a JSON report to `tests/e2e-report.json`.

### Critical Bug Discovered in `tests/run-e2e.js`
In the centralized dataset uniqueness test `T2.F4.1`, the script attempts to extract product IDs using the regex:
```javascript
const idRegex = /(?:id|id":|id':)\s*["']?(\d+)["']?/g;
```
For items defined as `id: 1,` in `products.ts`:
- The non-capturing group `(?:id|id":|id':)` matches `id`.
- The regex then expects a space (`\s*`) and optional quote (`["']?`) followed by digits.
- Because there is a colon (`:`) immediately following `id` in the file (`id: 1`), the regex fails to match!
This explains why the test suite reports `[FAIL] T2.F4.1: Product IDs are unique across the centralized dataset. - No product IDs found.` despite the IDs being correctly and uniquely defined. A patch to the regex to include the optional colon (e.g. `/(?:id|id"|id')\s*:\s*["']?(\d+)["']?/g` or similar) is required in the test runner.
