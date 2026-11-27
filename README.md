# Nepali Tools (नेपाली टुल्स)

Nepal's all-in-one, SEO-first online tools platform. Next.js 14 (App Router) + Tailwind CSS 3.

## What's inside

- **42 working tools** across 8 SEO category hubs (`/category/<slug>`), every tool at its own clean URL:
  - **Date & calendar:** BS→AD, AD→BS, Nepali calendar (month navigation, 2000–2090 BS table via `nepali-date-converter`), age calculator (BS + AD), date difference, add/subtract days (BS-aware)
  - **Finance:** EMI, loan amortization schedule (month-wise principal/interest breakup + prepayment effect), CTC calculator (gross↔CTC with the 20% employer SSF share), CAGR calculator (annualized investment growth), income tax (FY 2083/84 slabs, unmarried/married, SSF/CIT), net salary calculator (SSF, CIT, TDS take-home), VAT (13%), USD↔NPR (NRB-official via the data engine, then indicative, then static fallback), NRB full forex board (22 currencies, engine-fed), simple interest, compound interest, fixed deposit (FD) maturity, IPO result check guide (official CDSC/MeroShare channels only)
  - **Gold & silver:** FENEGOSIDA official rate table + value calculator (fine 24K and silver; tejhabi/22K is not published at source and is therefore not shown as official), dedicated silver page with per-tola/gram/lal calculator
  - **Math/Education:** percentage, unit converter, BMI, discount calculator (incl. reverse %), credit-weighted CGPA
  - **SEE & exam:** SEE GPA calculator, GPA-to-percentage (official letter-grade bands), SEE result check guide (official NEB portals only)
  - **Language:** Preeti→Unicode (135-char map + reorder rules), Nepali Unicode typing, Nepali typing test (1-minute WPM + accuracy), number→Nepali words, Devanagari↔English digit converter
  - **Land & everyday:** ropani/aana/bigha/kattha/dhur converter, Nepal time, NEA electricity bill calculator (official ERC slabs), split-bill calculator, fuel cost calculator, emergency numbers (tap-to-call)
  - **Daily market prices:** Kalimati official wholesale vegetable & fruit price list (search + quick filters), petrol/diesel price explainer (official NOA links — no invented prices)
- **Supabase backend**: engine snapshots/history persisted server-side (RLS on, service-role only), user accounts (`/account`, email+password auth) with cross-device favourites, newsletter subscribers.
- **Daily newsletter**: rendered from the verified engine snapshot only — `/api/newsletter/send` at 08:30 NPT via Resend; footer subscribes directly to Supabase.
- **Automated data engine** (`src/lib/data/engine.ts`): daily sync from FENEGOSIDA (gold/silver), Nepal Rastra Bank (forex) and the Kalimati committee (wholesale prices). Runs on Vercel Cron twice a day NPT, on demand from `/admin`, or `POST /api/data/sync`. Every value keeps its source + publication date; abnormal values are held back; missing data shows "आजको आधिकारिक तथ्यांक उपलब्ध छैन।" — never estimates. Details: `docs/DATA-SOURCES.md`.
- **"आजको नेपाल" homepage information centre** (ISR every 30 min): gold/silver, forex, Kalimati and NEPSE cards, each labelled with its official source and publication date.
- **SEO architecture:** per-page metadata + canonicals, JSON-LD (`WebApplication`, `FAQPage`, `BreadcrumbList`, Organization+WebSite), XML sitemap, robots.txt (admin disallowed), breadcrumbs, SSR/SSG static HTML for every tool, mobile-first, dark mode, 404 page with suggestions.
- **Original content per tool:** intro paragraphs, step-by-step how-to, worked examples tables, genuine FAQs — all in `src/data/tools/*`.
- **Admin dashboard** (`/admin`, `noindex`, force-dynamic): update gold/forex rates (writes versioned JSON `src/data/rates.json`), SEO keyword pipeline (covered/backlog), AI-assisted content review queue (approve/reject before anything is published), update history log.
- **Integration readiness:** `NEXT_PUBLIC_GSC_TOKEN`, `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_SITE_URL` env hooks; AdSense-ready `<AdSlot>` placeholders that only render when `NEXT_PUBLIC_ADSENSE_CLIENT` is set.

## Commands

```bash
npm install
npm run dev     # dev server
npm run build   # production build (all 42 routes prerender)
npm start       # serve the production build
```

## Data updates (gold / silver / USD / vegetables)

Fully automated via the data engine (`src/lib/data/engine.ts` + `docs/DATA-SOURCES.md`): FENEGOSIDA
official gold/silver, NRB official forex, Kalimati committee official wholesale prices. Vercel Cron
runs the sync twice daily; `/admin` shows engine health and a "Run sync now" button; static fallback
values in `src/data/rates.json` keep pages rendering before the first sync after deploy. When a
source can't be verified for a date, pages show "आजको आधिकारिक तथ्यांक उपलब्ध छैन।" — never estimates.

## Content policy (AdSense-ready)

- All pages are hand-written or admin-reviewed before publication; the auto-suggestion queue (adminStore) cannot publish directly.
- Privacy (`/privacy`), About (`/about`), Contact (`/contact`), Disclaimer (`/disclaimer`) are live.
- Keyword targeting (`src/lib/keywords.ts`) is research metadata only — internal notes are never rendered publicly.

## Deploy notes

- Node 18.17+. Set `NEXT_PUBLIC_SITE_URL` to the production domain before `build` (canonicals/sitemap use it).
- Server routes (`/admin` writes, data engine) need a Node host (not a pure static export).
- Vercel Cron (`vercel.json`) triggers `POST /api/data/sync` twice daily (08:00 & 10:25 NPT). On Vercel, the engine's filesystem snapshots don't persist across invocations — the planned Supabase store (roadmap) replaces the JSON files; until then static pages serve the committed snapshot.
- Optional `SYNC_SECRET` env var protects `/api/data/sync` POST with an `x-nt-key` header.
