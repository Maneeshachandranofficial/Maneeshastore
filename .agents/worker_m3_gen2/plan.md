# Implementation Plan - Milestone 3

## Steps

1. **Modify `CategoryPage.tsx` Size Selector**:
   - Check `requiresSize` flag on `Product` schema.
   - If `requiresSize` is `true`:
     - Render a premium-styled selector with hover animations, scale transitions, active gold shadow styling (`shadow-[0_0_15px_rgba(212,175,55,0.15)]`).
     - Display a "Select Size" label and the active selected size.
     - Ensure typography styles match Cinzel/Jost and are responsive.
   - If `requiresSize` is `false`:
     - Show a premium, minimal, non-interactive badge styled with low-opacity border indicating "Free Size / One Size".
   - In `handleSelectProduct`, if `product.requiresSize` is `false`, default the `selectedSize` state to `"One Size"`. If `product` is null, default it to `''`.
   - **Verification**: Run `npm run build` or inspect compiled output.

2. **Implement `CheckoutAction.tsx`**:
   - Create `src/components/CheckoutAction.tsx`.
   - Implement `CheckoutActionProps` interface:
     ```typescript
     interface CheckoutActionProps {
       cart: CartItem[];
       cartSubtotal: number;
     }
     ```
   - Build a WhatsApp checkout link targetting `+918072071420` (using `918072071420` in the wa.me link).
   - Format the pre-filled message correctly with URI-encoding, supporting single/multiple items:
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
   - Target `_blank` for the WhatsApp link.
   - Add a secondary tap-to-call link for customer care with `tel:+918072071420` href.
   - Place a `RAZORPAY_INTEGRATION_POINT` comment block in the checkout handler containing detailed comments about loading the Razorpay script and config.
   - **Verification**: Run build and verify the file exists and passes types.

3. **Update `src/app/checkout/page.tsx`**:
   - Import and render `<CheckoutAction cart={cart} cartSubtotal={cartSubtotal} />` instead of the static payment button.
   - Fix the mobile header overlap. Update the header grid from `grid-cols-3` to `grid-cols-[1fr_auto_1fr]` to ensure that the center logo column gets its natural width and does not overlap with the back link on mobile widths (320px to 768px). Adjust paddings responsively.
   - **Verification**: Check layout compilation.

4. **Fix Test Runner Regex Bug**:
   - In `tests/run-e2e.js` at line 554 (or the regex matching product IDs in T2.F4.1), modify the regex to support colons and spaces (e.g. `/(?:id|id"|id'|id":|id':)\s*[:=]?\s*["']?(\d+)["']?/g`).
   - **Verification**: Run `npm run test:e2e` to verify if all tests pass.

5. **Run and Verify E2E tests**:
   - Run `npm run build`.
   - Run `npm run test:e2e` (all 82 tests should pass).
   - Compile handoff report (`handoff.md`).
