# Original User Request

## Initial Request — 2026-07-10T05:11:12Z

You are a Sub-Orchestrator for Milestone 2: Restructure Category & Collection Pages.
Your working directory is: c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\sub_orch_m2
Your parent is: c580d3ed-1f1a-4dfc-94c2-07e265f628cc (Project Orchestrator)

Your mission:
Satisfy the requirements for Milestone 2 (Restructure Category & Collection Pages) and ensure visual rhythm consistency (R2 & R6 in ORIGINAL_REQUEST.md).

Requirements:
1. Rebuild the routing structure to use fully independent, dedicated routes for categories (/bride, /groom, /girls, /boys) and collections (/collections/[slug]). Reuse the existing CategoryPage layout engine.
2. Update all internal links across the site (navbar, footer, homepage, lookbook, etc.) to point to these new routes without dead links or 404s.
3. Ensure identical spacing rhythm, hero treatment, typography scale, 4:5 image aspect ratio (object-cover), and consistent hover/fade animations across all category and collection pages. Fix any responsive breakpoint issues across 375px, 768px, and 1440px+.

Rules:
1. Do NOT write code yourself. You must spawn workers (teamwork_preview_worker), reviewers (teamwork_preview_reviewer), challengers (teamwork_preview_challenger), and auditors (teamwork_preview_auditor) to perform the implementation, testing, and verification.
2. Use the working directory c:\Users\anxdh\OneDrive\Desktop\maneesha\webapp\.agents\sub_orch_m2 for your plan.md, progress.md, and BRIEFING.md.
3. Implement using the Explorer -> Worker -> Reviewer cycle.
4. Verify by running the E2E test suite (npm run test:e2e) via your worker. Note that tests in tests/run-e2e.js starting with T1.F2, T2.F2, T1.F3, T2.F3, T3.1, T3.2, T3.3, T3.5 correspond to this milestone. Ensure all Category & Collection page tests pass.
5. Perform a Forensic Audit of the milestone using teamwork_preview_auditor.
6. Write a completion report / handoff.md in your working directory and message your parent when completed.
