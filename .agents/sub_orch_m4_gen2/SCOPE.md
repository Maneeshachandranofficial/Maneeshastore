# Scope: Milestone 4 (Navigation Bug Fix & Integration)

## Architecture
- **Cart Context (`src/context/CartContext.tsx`)**: Tracks cart state and should track the last visited category/collection shopping page origin (using React context, session, or history state).
- **CartDrawer (`src/components/CartDrawer.tsx`)**: Slider showing active cart. The "Continue Shopping" button/link must dynamically route to the tracked shopping origin.
- **Checkout Page (`src/app/checkout/page.tsx`)**: Checkout flow page. Back buttons/links must route dynamically to the tracked shopping origin.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Navigation History Tracking | Update CartContext to track the last visited shopping page or use session/history state. | None | PLANNED |
| 2 | Route CartDrawer "Continue Shopping" | Update CartDrawer to route dynamically to the tracked shopping origin. | M1 | PLANNED |
| 3 | Route Checkout Back Links | Update Checkout Page to route dynamically to the tracked shopping origin. | M1 | PLANNED |
| 4 | Integration & E2E Validation | Run all 82 E2E test cases, compile Next.js production build, and pass all auditor checks. | M2, M3 | PLANNED |

## Interface Contracts
- CartContext must expose the tracked shopping origin or navigation history.
- The E2E tests must pass all 82 test cases (especially the 8 failing cases from Milestone 3).
