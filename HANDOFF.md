# Maneesha Chandran — Project Handoff

Read this first when picking up the project in a new session. It captures the full
current state so you can continue without re-explaining.

## What this is
Luxury couture e-commerce site for designer **Maneesha Chandran** (Kochi, India) —
bridal / groom / ethnic wear. Built by the team, being handed to the client to run herself.

## Stack & infra
- **Next.js 16** (App Router, Turbopack) · **React 19** · **Tailwind CSS v4** · **motion/react** (Framer Motion) · **lucide-react** icons
- **Sanity CMS** — project `sx7pny5k`, dataset `production`, embedded Studio at `/studio`. Env in `.env.local` (NEXT_PUBLIC_SANITY_*). Server-side fetches via `src/sanity/client.ts`.
- **Resend** — newsletter (`/api/subscribe`) + custom-piece inquiry (`/api/custom-inquiry`). Key in `.env.local`.
- **Calendly** — consultation booking: `https://calendly.com/maneeshachandranweb/30min`
- Repo: `github.com/Maneeshachandranofficial/Maneeshastore`, branch **main**. Deploy: **Vercel** → `maneeshastore.vercel.app` (auto-deploys on push to main).
- Working dir: `C:\Users\anxdh\OneDrive\Desktop\maneesha\webapp` (Windows).
- Dev: `npm run dev`. Build gate before commit: `npm run build` (clear `.next` first if the dev server was running, to avoid a stale generated-types error). Don't run build while dev server is live.

## Current design system (IMPORTANT — this has changed a lot)
- **Black & white theme.** White backgrounds, black text. A few solid **black blocks** with white text for rhythm: brand-story section, consultation banner, footer, and the 3-dot menu overlay. The **nav bar itself is white** (black logo/text). Hero keeps white text over its (colour) photo. **Photos stay in full colour** — never grayscale.
- Palette lives entirely in `src/app/globals.css` `@theme` tokens (names kept from the old maroon/gold build so components cascade): `--color-cream=#fff` (bg), `--color-ivory=#f4f4f4` (card frames), `--color-maroon=#0a0a0a`/`maroon-dark=#000` (the "black block" family), `--color-gold=#111`/`gold-light=#fff` (accents → black on white / white on black), `--color-charcoal=#111` (text).
- **Fonts = Josefin Sans** everywhere (matching manishmalhotra.in), non-italic. Set via `--font-sans` + `--font-display` tokens in globals.css. Headings: uppercase, tracked ~0.1–0.15em, weight 500 (forced with `!important` on h1–h6 + `.display-*` classes so they win over any `font-sans` utility). Body/UI: Josefin Sans 400.
- **Logo** = inline vector `src/components/LogoLockup.tsx` (icon + "MANEESHA CHANDRAN" wordmark as SVG outlines — unaffected by font changes; **never** convert to live text). Colour via `currentColor` (`text-black` in nav, `text-white` on black blocks). Do not alter the logo design/wordmark.

## Pages / key components
- `src/app/page.tsx` → `HomeClient.tsx`: full-bleed rectangular hero carousel (directional slide, arrow buttons + keyboard ←/→, dots, auto-advance) → Collections → Signature Masterpieces → Explore Our Ateliers (Bride/Groom/Ethnic cards) → Brand story (black) → Atelier stats → Testimonials → Consultation CTA (black).
- `src/app/category/[id]/page.tsx` → `CategoryClient.tsx`: derives a readable title from the slug (so e.g. `/category/ethnic` shows "Ethnic" even without a Sanity doc); sub-category **filter tabs** are auto-built from the distinct `subCategory` values of the shown products.
- `src/app/product/[id]/page.tsx` → `ProductClient.tsx`: 2-col PDP; supports **"Contact for Pricing"** (price-on-request) products → shows "Price on Request" + enquiry CTA (opens `CustomiseModal`). Size Guide button was removed.
- `src/app/lookbook/page.tsx` → `LookbookClient.tsx`, `src/app/about/page.tsx` → `AboutClient.tsx` (editorial timeline), `src/app/cart/page.tsx`, `src/app/checkout/page.tsx`.
- `Navigation.tsx`: white bar — left `⋯` 3-dot + (desktop) Collections dropdown + Bride + Groom + Ethnic; **logo absolutely centred** (so it stays dead-centre on mobile); right search/saved/cart (32px on mobile, 44px desktop). The 3-dot opens a full-screen **black** menu with everything incl. About Us + Book Consultation. Search pulls the **real catalogue** from `/api/search-index` (same-origin, avoids CORS).
- Shared: `ProductCard`, `CategoryCard`, `CollectionBanner`, `Testimonials`, `StatsRow`, `ConsultationCTA`, `SectionHeading`, `Reveal`, `BackButton` (interior pages, hidden on home/studio), `Footer` (black).

## Sanity schemas & Studio (`src/sanity/`)
- `product` — grouped tabs (Content / Pricing / Categorisation / Display). Fields: name, image (required upload w/ hotspot), description, id (slug), **priceOnRequest** (Contact for Pricing toggle → hides price fields), price, numericPrice, category (bride/groom/**ethnic**/kids), subCategory (**bride/groom**/men/women/kids/adult — drives collection filter tabs), collection, sizingType, isHero.
- `category` — id, name, description, isCollection.
- `siteSettings` (singleton) — homepage slogan lines, about heading/body, **stats[]**, **testimonials[]**, contact fields, calendlyUrl.
- `aboutPage` (singleton) — eyebrow, heading, intro, portrait, timelineHeading, **timeline[]** (year/title/description/image) — editable milestone timeline.
- Desk `structure.ts`: Products · Homepage Hero Carousel · Categories & Collections · Pages (Site Settings, About Page).

## OUTSTANDING / TODO
1. **Razorpay payments** — checkout currently uses a MOCK pay step. Look for `RAZORPAY_INTEGRATION_POINT` in `src/components/CheckoutAction.tsx`. Need from client: **Razorpay Key ID + Key Secret**. Then wire: an order-creation API route (server, uses secret), the Razorpay checkout script/popup (uses key id), and signature verification. Custom/price-on-request items already route to WhatsApp/consultation instead of pay.
2. **Custom domain** — client bought `maneeshachandranofficial.in` (⚠ CONFIRM exact spelling with client — earlier written "maneeshachannofficial.in" may be a typo) from GoDaddy. Connect: Vercel project → Settings → Domains → add domain → set the DNS records Vercel shows at GoDaddy (**DNS** area is free, no hosting plan needed): A `@` → `76.76.21.21`, CNAME `www` → `cname.vercel-dns.com`. Vercel auto-issues SSL.
3. **Sanity CORS** — add the production domain(s) (Vercel URL + custom domain) to the Sanity project's **API → CORS origins** so the embedded `/studio` connects there. (Storefront + search work regardless — they're server-side.)
4. **Client Sanity tagging** (her homework, so sections fill in): create an **Ethnic** category doc; tag Ethnic products' subCategory Men/Women/Kids; tag Eves Garden products Bride/Groom; add hero images / products.

## Reference & tooling
- Design reference the client asked to match: **Manish Malhotra** (`manishmalhotra.in`) → Josefin Sans font.
- Skills installed globally: **graphify** (codebase knowledge graph; run `/graphify .` — a graph of `src/` exists under `graphify-out/`, gitignored), **ui-ux-pro-max** (design intelligence). A **Magic MCP** entry exists in `.mcp.json` (21st-dev) but wasn't connected in prior sessions.
- Contact facts: email `maneeshachandranofficial@gmail.com`, phone `+91 9526266369`, Instagram `@maneesha_chandran_official`.

## Working agreement with the client (anush)
- Big/visual changes: build locally, verify (browser + `npm run build`), **show for review, and push to origin/main only on explicit "push/deploy" confirmation** — that triggers the live Vercel deploy the client sees.
- The screenshot tool in the local Browser pane times out in this environment; verify via `read_page` / `javascript_tool` / computed-style checks instead, and have the client eyeball the live dev server.
