# Milestone 4 Execution Plan: Navigation Bug Fix & Integration

We will follow the Project Pattern iteration loop. Since we are dispatcher-only, all code changes and build/test executions will be done by subagents.

## Phase 1: Exploration
1. Spawn 3 Explorers in parallel to analyze the navigation routing bugs, codebase architecture, and plan changes to `CartContext.tsx`, `CartDrawer.tsx`, and `checkout/page.tsx`.
2. Synthesize Explorer findings.

## Phase 2: Implementation
1. Spawn a Worker to apply the recommended code changes.
2. The Worker must:
   - Update `src/context/CartContext.tsx` to persist cart items and track `lastVisited` page.
   - Update `src/components/CategoryPage.tsx` to set `lastVisited` page when a category page is viewed.
   - Update `src/components/CartDrawer.tsx` to route "Continue Shopping" dynamically using `lastVisited`.
   - Update `src/app/checkout/page.tsx` to route back links/buttons dynamically using `lastVisited`.
   - Run the production build command (`npm run build`) to ensure Next.js compiles cleanly.
   - Run E2E tests (`npm run test:e2e`) to ensure all 82 test cases pass.
   - Attest code layout compliance and no cheating (verbatim integrity warning).

## Phase 3: Review & Verification
1. Spawn 2 Reviewers in parallel to review code changes.
2. Spawn 2 Challengers in parallel to run verification.
3. Spawn a Forensic Auditor to run integrity forensics.

## Phase 4: Final Synthesis & Handoff
1. Gather all verification artifacts.
2. Synthesize results and write the Milestone 4 Handoff Report.
