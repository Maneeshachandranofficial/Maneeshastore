## 2026-07-10T12:03:43Z

Implement components and layouts for size selection, checkout isolation, and WhatsApp flow, then run/verify E2E tests.

### Tasks
1. **Size Selector in `src/components/CategoryPage.tsx`**:
   - Check the `requiresSize` flag on the `Product` schema.
   - If `requiresSize` is `true`: Render a premium-styled selector with hover animations, scale transitions, active gold shadow styling (e.g. shadow-[0_0_15px_rgba(212,175,55,0.15)]), displaying a "Select Size" label and the active selected size. Ensure typography styles match Cinzel/Jost and are responsive.
   - If `requiresSize` is `false`: Show a premium, minimal, non-interactive badge styled with low-opacity border indicating "Free Size / One Size".
   - In `handleSelectProduct`, if `product.requiresSize` is `false`, default the `selectedSize` state to `"One Size"`. If `product` is null, default it to `''`.

2. **Isolate CheckoutAction into `src/components/CheckoutAction.tsx`**:
   - Create `src/components/CheckoutAction.tsx`.
   - Implement `CheckoutActionProps` interface conforming to:
     ```typescript
     interface CheckoutActionProps {
       cart: CartItem[];
       cartSubtotal: number;
     }
     ```
   - In `CheckoutAction.tsx`, implement the checkout action buttons. When clicked:
     - Generate a WhatsApp checkout URL targeting `+918072071420` (encoded as `918072071420` in the wa.me link).
     - The pre-filled message MUST be properly URI-encoded and format the cart items like this:
       ```
       Hello Maneesha Chandran team, I would like to place an order for the following items:

       *1. [Item Title]*
       - Category: [Category]
       - Size: [Size]
       - Price: ₹ [Formatted Price]

       [Repeat for each item]

       *Total Value:* ₹ [Formatted Subtotal]

       Please let me know the availability and share payment/delivery details. Thank you!
       ```
     - Use `toLocaleString('en-IN')` for numbers in prices and subtotal.
     - The WhatsApp checkout flow must work for single and multiple items in the cart.
     - The WhatsApp link must open in a new tab/window (e.g., using `target="_blank"` or `window.open`).
     - Provide a secondary tap-to-call link for customer care with a valid `tel:+918072071420` href.
     - Include the `RAZORPAY_INTEGRATION_POINT` comment block in the checkout handler method with comments detailing Razorpay script loading and checkout config.

3. **Update `src/app/checkout/page.tsx`**:
   - Import and render `<CheckoutAction cart={cart} cartSubtotal={cartSubtotal} />`.
   - Replace the static Proceed to Payment button with `<CheckoutAction />`.
   - Fix the mobile header overlap. Change the header grid from `grid-cols-3` to `grid-cols-[1fr_auto_1fr]` to ensure that the center logo column gets its natural width and does not overlap with the back link on mobile widths (320px to 768px). Adjust paddings responsively.

4. **Fix Test Runner Regex Bug in `tests/run-e2e.js`**:
   - Look at test `T2.F4.1`. The regex used to find product IDs, `/(?:id|id":|id':)\s*["']?(\d+)["']?/g`, fails because of the colon (`:`) in `id: 1,`.
   - Modify the regex to correctly support colons and spaces so it successfully parses IDs in `src/lib/products.ts` (e.g., use `/(?:id|id"|id'|id":|id':)\s*[:=]?\s*["']?(\d+)["']?/g` or similar).

5. **Verify**:
   - Run `npm run build` to verify there are no compilation errors.
   - Run `npm run test:e2e` to verify the tests pass.
   - Write a detailed handoff report (`handoff.md`) in your working directory summarizing:
     1. Code changes made.
     2. Build output.
     3. Test execution results (specifically mention any failing/passing tests).
