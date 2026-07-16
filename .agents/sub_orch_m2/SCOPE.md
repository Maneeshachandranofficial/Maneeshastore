# Scope: Milestone 2 — Restructure Category & Collection Pages

## Architecture
- **Routing Structure**: Independent Next.js App Router routes for category pages (`/bride`, `/groom`, `/girls`, `/boys`) and collection pages (`/collections/[slug]`).
- **Layout Reuse**: Standardize these pages using the `CategoryPage` layout component.
- **Visual Rhythm**: Strict compliance with visual guidelines: spacing rhythm, hero treatment, typography, image aspect ratio, animations, and responsive breakpoints.

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Explore & Plan | Run exploration to analyze existing routing, pages, CSS, layout issues, and design a concrete implementation plan. | None | DONE |
| 2 | Implementation | Rebuild routes (/bride, /groom, /girls, /boys, /collections/[slug]). Update all links (nav, footer, homepage, lookbook). Ensure visual rhythm, animations, and responsive design. | 1 | IN_PROGRESS (Conv: ba925dbc-c0b9-4913-a43b-078127a4253c) |
| 3 | Verification | Run unit tests, E2E tests, and check responsive styles. Resolve all F2, F3, T3, T4 tests. | 2 | PLANNED |
| 4 | Challenger Verification | Run challenger to stress-test responsiveness, layout shifts, animations, and navigation edge cases. | 3 | PLANNED |
| 5 | Forensic Audit | Run Forensic Auditor to audit the codebase for integrity and compliance. | 4 | PLANNED |

## Interface Contracts
- `/bride`, `/groom`, `/girls`, `/boys` pages import and render `<CategoryPage />` with appropriate attributes from `products.ts`.
- `/collections/[slug]` dynamically resolves `slug` using products with corresponding collection ID and renders `<CategoryPage />`.
