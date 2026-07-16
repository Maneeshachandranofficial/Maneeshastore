# Scope: Milestone 3 — Size Selector & Checkout Components

## Architecture
- **Quick View Modal**: Renders product details, images, price, and size selector. Located in `src/components/CategoryPage.tsx`.
- **Checkout Page**: Displays items in the cart, total, and checkout action trigger. Located in `src/app/checkout/page.tsx`.
- **Checkout Action Component**: Handles the redirection / checkout flow. Needs to be isolated into `src/components/CheckoutAction.tsx` with defined properties and a `RAZORPAY_INTEGRATION_POINT` comment.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M3.1 | Update CategoryPage Quick View Size Selector | Check `requiresSize` flag: show "Free Size / One Size" if false, and a premium styled selector if true. | None | IN_PROGRESS |
| M3.2 | Isolate CheckoutAction Component | Create `src/components/CheckoutAction.tsx` with `RAZORPAY_INTEGRATION_POINT` comment, importing/using it in `src/app/checkout/page.tsx`. | None | IN_PROGRESS |
| M3.3 | Implement WhatsApp Flow & Secondary Tap-to-Call | WhatsApp link to +918072071420 with pre-filled cart summary message. Secondary phone call link to same number. | M3.2 | IN_PROGRESS |
| M3.4 | Preserved Layout & Mobile Header Fix | Fix mobile order summary header overlap, ensuring visual design robustness. | None | IN_PROGRESS |
| M3.5 | Verification & E2E Testing | Verify all test cases pass. | M3.1, M3.3, M3.4 | PLANNED |

## Interface Contracts
### CheckoutActionProps
```typescript
interface CheckoutActionProps {
  cart: CartItem[];
  cartSubtotal: number;
}
```

## Code Layout
- `src/components/CategoryPage.tsx` - Modify quick-view size selector logic.
- `src/components/CheckoutAction.tsx` - Create new component for checkout logic.
- `src/app/checkout/page.tsx` - Isolate checkout summary trigger and import CheckoutAction.
