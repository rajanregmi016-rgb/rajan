# PROJECT HANDOFF — Nepali Tools (allnepalitools.com)

Write this file so any future AI session (or a fresh human collaborator) can resume
without the original chat. Update it after major milestones. **No secrets here —
secret values live in `.env.local` (git-ignored) and the Vercel/Supabase dashboards.**

*Last updated: 2026-11-12*

---

## What this project is
Production SEO-first utility platform "Nepali Tools — सबै नेपाली टुल्स एकै ठाउँमा 🇳🇵".
Next.js 14 App Router + Tailwind 3 + Supabase + Resend + Vercel. 109 tools across
8 category hubs (Waves 4–10, 2026-11-10/11: +10/+5/+10/+12/+10/+10/+10 tools, commits
c952774/694e7b7/83ac491/eca8cc3/6992b90/3dab04a/ffd2fcb) + homepage redesign matching the
user's mockup (`834e54a`) + 15 guides (batches 1–2). Every published number carries its official source + publication
date; never invents or estimates data. See `README.md` for architecture.

## Live infrastructure
| What | Value |
|---|---|
| Production site | **https://allnepalitools.com** (also www) — apex is canonical |
| Registrar/DNS | Spaceship → nameservers switched to `ns1/ns2.vercel-dns.com` (Vercel hosts DNS) |
| Vercel | team `nepalitools`, project `nepali-tools`, login CLI via `cmd /c vercel.cmd ...` (PowerShell blocks .ps1 shims) |
| Supabase | project ref `fjiahqkylovzegcpikpo` (URL + keys in `.env.local`) |
| Resend | API key is **send-only** — domain management must be done in the resend.com dashboard (account: rajanregmi16@gmail.com) |
| Newsletter | daily at 08:30 NPT (cron 02:45 UTC) via `/api/newsletter/send` (Bearer CRON_SECRET); route self-syncs sources pre-send |
| Data sync | cron 02:00 UTC — FENEGOSIDA gold/silver, NRB forex, Kalimati vegetables. **Hobby plan = max 2 crons** (04:55 sync was dropped, vercel.json has exactly 2 entries) |
| Admin panel | `/admin` (noindex; sign in required) — TODO: wire admin allowlist for production |

## Where things stand (2026-11-11)
- **Deployed & verified:** allnepalitools.com returns 200, canonical = apex, sitemap = 60 URLs
  (incl. `/en`), **Full premium UI/UX redesign (waves 1–4) live** — design tokens in
  `globals.css` (paper bg / charcoal / Nepal-red, .section, .eyebrow, .tnum, .skeleton),
  Header (active-route, real `/` search shortcut — added to SearchPalette alongside Ctrl+K),
  compact hero, TodaysNepal premium cards (accent icon chips, dotted leaders, bilingual `lang="en"`,
  source+date footers), ToolLauncher directory, ToolCard icon chips, tool-page headers (category pill),
  Footer "आधिकारिक स्रोतहरू" trust row. **Wave-4 tools live** (10 more: gold value/unit, gratuity,
  hourly, RD, goal, appliance, temp, speed, tables — `c952774`); **Wave-5 tools live** (5 more:
  Nepali weight converter with the Weights & Measures Act 1968/1976 customary values — pau 199.4508 g,
  dharni 2.3934 kg, seer 933.10 g — plus fuel mileage log, printable rent receipt, arithmetic practice
  quiz, water-tank capacity; `694e7b7`). Same commit fixed 4 old bugs: TypingTestTool & Ad2BsTool
  hydration mismatches (random/date useState initializers), EmergencyNumbers dynamic date, AmortTool
  junk fields + rows logic. Sitemap = 75 URLs. **Wave-6 tools live** (10 more: SIP vs lumpsum,
  SSF contribution 11+20%, loan eligibility, profit margin, break-even, price-per-unit compare,
  cash denomination, land price converter (Act-standard unit tables), pregnancy due date
  (Naegele +280d), word/character counter (Devanagari-aware); `83ac491`) — **67 tools,
  sitemap = 90 URLs**. **Wave-7 tools live** (12 more: fraction calculator, average/mean-median-mode,
  right triangle (3-4-5), circle, binary/hex/octal converter, retirement corpus, inflation impact,
  BMR/calories (Mifflin-St Jeor), sleep cycles (90-min), concrete mix (nominal grades M20/M15/M10/M7.5,
  1.54 dry factor, 50-kg bags @1440 kg/m³), paint coverage (editable per-can coverage), trekking time
  (Naismith 5 km/h + 1 h/600 m up, +1 h/1000 m down); `eca8cc3`) — **79 tools,
  sitemap = 103 URLs**. **Homepage redesign live** (Nov 10; `88a6418`): spec-order sections —
  hero with dynamic tool-count trust line + 6 popular-search chips, ItemList JSON-LD for curated
  popular tools, new PopularTools asymmetric grid (server-rendered), real 9-guide editorial section
  (GuidesSection), TrustSection (factual sources only), learn anchor id="learn", TodaysNepal
  "view all updates" link; TILE_META moved to server-safe `lib/toolIcons.ts`. All real
  integrations preserved (SearchPalette smart search + recents, verified snapshot panels,
  localStorage favorites/recents, DailyQuiz streak, newsletter endpoint). Lighthouse: homepage + tool pages 100/100/100 after accessibility
  fixes (muted-text contrast AA in light mode, aria-label cleanup; `d11b6f0`).
- **Guides batch 1 live** (Nov 10; `dd90f85`): 3 → 9 guides. New: reading-your-payslip-nepal,
  ssf-vs-provident-fund-gratuity, nea-bill-slabs-explained, buying-land-nepal-checklist,
  prepay-loan-or-invest, budget-rule-nepal-50-30-20 — each internal-links to 2–3 tools.
  Also fixed laal fact in buy-gold-nepal-checklist (1 tola = 100 laal, 1 laal = 0.116638 g,
  was wrongly 1/1000 tola). Guides auto-enter sitemap (`src/app/sitemap.ts` imports
  GUIDES_LIST) — **sitemap = 91 URLs**; all guide URLs verified 200 in prod.
- **Wave-9 + guides batch 2 live** (Nov 11; `3dab04a`): 10 more tools — real return (Fisher
  equation), salary hike + FY arrears, debt payoff (avalanche month-sim, 720-mo runaway guard),
  nPr/nCr (iterative product, exact C(52,5)), roman numerals 1–3999 two-way, pomodoro study timer
  (25/5, in-tab), plaster (dry 1.33, 1 bag = 1.226 cft), brickwork (230×110×55 mm + 10 mm joint,
  5% wastage), tiles (mm sizes + wastage), time duration (overnight-safe). Plus 6 more guides:
  vat-nepal-explained, emi-interest-early-explained, fd-vs-rd-nepal, remittance-usd-to-npr-guide,
  hill-terai-land-units-explained, bs-ad-date-on-documents — **99 tools, 15 guides,
  sitemap = 129 URLs**; all 16 new URLs verified 200 in prod.
- **GA4 real measurement ID live**: `NEXT_PUBLIC_GA_ID=G-SNHMR6XBXF` (found via GA4 property
  415501761 page; swapped in prod/preview/dev). AdSense wired: `NEXT_PUBLIC_ADSENSE_CLIENT=
  ca-pub-1472441785224994` + `public/ads.txt` live (commit `31a08ef` + GA swap). GSC sitemap
  `sitemap.xml` already Submitted — Status Success (59 pages read Nov 8; re-read picks up 139).
- **Wave-10 + mockup homepage redesign live** (Nov 11; `ffd2fcb` + `834e54a`): 10 more tools —
  Heron triangle area, nth root, ratio/proportion, standard deviation, solid volumes (cube/cyl/cone/sphere),
  rebar weight (D²/162, density 7850), working days (Saturday-only weekend, start excluded/end included),
  Nepali fiscal-year finder (Shrawan 1 – Ashadh end via `nepali-date-converter`), Devanagari text cleaner,
  Loksewa age eligibility (BS DOB vs cutoff range). **109 tools, 15 guides, sitemap = 139 URLs**;
  all 10 tool URLs verified 200 in prod. Homepage restyled to the user's mockup (light theme,
  Nepal-red accent): Header (red active pill + chevrons, real 🌐 NE⇄/en switch, red Login → /account),
  SearchPalette inline variant (red खोज्नुहोस् button, clear-X right-32, "लोकप्रिय खोजहरू:" chip prefix),
  TodaysNepal as single bordered card with internal red-calendar header (title/subline labels),
  new `home/CategoryTiles.tsx` (8 pastel emoji tiles with honest counts, anchor `#explore`),
  PopularTools compact uniform 8-up, ForYou pink card (checklist + login CTA for guests; real
  favs/recents chips when present; GuestPopular kept for /en), new `home/TodaysUpdates.tsx`
  (server component: only real dated engine events — gold publishedOn, forex rateDate,
  Kalimati priceDate, sync time; skips failed panels; HONEST: no fake notices/notifications),
  NewsletterSection full-width red gradient band (same subscribe endpoint + nt-nlhp2 honeypot),
  GuidesSection 2 compact cards, TrustSection "किन विश्वास गर्ने?" checklist + "सम्पूर्ण नेपाल,
  डिजिटल नेपाल ❤", navy `#0e1a34` Footer (brand | टुल श्रेणीहरू | महत्वपूर्ण लिंकहरू |
  NewsletterSignup form; NO social icons — none exist; © २०८३ = AD+57 via toNpDigits).
  `page.tsx` section order: hero (2-line headline, red 2nd line, pink gradient + SVG hills,
  search + chips + trust checks; no GuestPopular/BsToday chips) → TodaysNepal (`#today`) →
  CategoryTiles (`#explore`) → PopularTools → AdSlot → 3-col row ForYou|DailyQuiz|TodaysUpdates
  (`#learn`) → Newsletter → Guides+Trust row → ToolLauncher (`#all-tools`, renamed from
  explore — ids stay unique) → Trending → FAQ. org/ItemList/FAQPage JSON-LD + dynamic counts
  kept; all real integrations preserved; `/en` still works (200, verified).
- **Bing Webmaster Tools fully set up** (Nov 10): site imported via GSC OAuth ("Import your sites
  from GSC" flow — no meta verification needed), `sitemap.xml` submitted and confirmed
  "successfully submitted for processing". Data/reports take up to 48h to reflect.
- **GSC + Bing sitemap resubmit: DONE (user confirmed, 2026-11-12).** GSC shows
  `sitemap.xml` = Submitted Nov 8, Last read Nov 10, Status **Success**, 85 pages
  discovered (full sitemap is 139 URLs — discovery grows as Google re-crawls; no action
  needed). AdSense "Request review" also clicked by the user.
- **Real `/en` English homepage live:** `src/app/en/page.tsx` — English hero + search,
  `<TodaysNepal lang="en" />` (English UI labels, same verified data), English directory by
  category, cross-link to `/`; canonical `/en` + hreflang (ne:/ en:/en) on both homepages;
  `/en` in sitemap (priority 0.9, daily).
- **Newsletter cron fixed** (b3854a9): Hobby 2-cron limit was silently dropping the 3rd job —
  2 crons total now; `/api/newsletter/send` calls `runSync()` before sending. Manually re-sent OK.
- **GSC:** domain property `sc-domain:allnepalitools.com` **verified** (apex TXT
  `google-site-verification=pzLsRQIccYkqlmM4QK-XS3cYXk6liy6XEzX54MOv1u0`, rec_375537ddcb33f3b333da6d12).
  Sitemap auto-discovered via robots.txt; manual SUBMIT of `sitemap.xml` in GSC still pending (user —
  the form's framework rejects automation).
- **Resend:** domain verified, branded sender live `Nepali Tools <newsletter@allnepalitools.com>`
  (RESEND_FROM prod env, verified via real send detail).
- **GA4:** env `NEXT_PUBLIC_GA_ID=GTM-MP6QH7VV` deployed (tag verified in live HTML), but GA's
  checker may want the stream's real `G-…` Measurement ID — **waiting on the user to paste it**;
  then swap env → deploy → user clicks "Try again".
- **Supabase Auth URLs:** Site URL = `https://allnepalitools.com`, redirects include
  `https://allnepalitools.com/**` (+ old vercel.app as fallback).
- **Full account system live (2026-11-12):** `/account` (`AccountPanel.tsx`) — Google OAuth +
  magic link + email/password, forgot-password, password change, cloud favorites with
  merge-from-device, device recents, quiz streak, JWT-verified newsletter card
  (`/api/account/newsletter-status`, 401 without token). Google sign-in **verified live
  end-to-end** (real JWT, `provider: google`, "GOOGLE खाता" badge on dashboard).
- **Google OAuth client (GCP):** project **`bright-karma-514501-n9`** on
  rajanregmi016@gmail.com (account "rajan regmi"). Web client "Nepali Tools Web 2",
  Client ID `662421941401-n7194dmqfplmpo0m7fs78o9b036pqrhc.apps.googleusercontent.com`
  (secret lives only in Supabase's Google provider config; also shown once in the GCP
  creation dialog). Redirect URI =
  `https://fjiahqkylovzegcpikpo.supabase.co/auth/v1/callback`. Consent screen: External,
  app "Nepali Tools", support email rajanregmi016@gmail.com. ⚠️ GOTCHA: the earlier
  attempt created project `nepali-tools-514500` without accepting the GCP ToS →
  "Project cannot be created as Terms of Service have not been accepted" and the account
  had zero permissions on it (unusable, left in place; ~quota still fine). A second
  web client "Nepali Tools Web" (`…1477khus0s0fcr7b8rt6m9k24hs8d96o…`) exists with an
  unrecorded secret — unused; delete if it bothers anyone.
- **Custom SMTP (auth emails) ON:** Resend `smtp.resend.com:465`, user `resend`, password =
  the send-only `re_` key; sender `newsletter@allnepalitools.com` / "Nepali Tools"; rate
  limit 30/h. All 3 auth templates rebranded in Nepali (confirm signup / magic link /
  reset) — HTML sources in `supabase/email-templates/`, pushed live via dashboard and
  **persistence verified** by reloading each template page (bodies are the branded HTML;
  a first attempt saved subjects but not bodies — the Save click must come in a separate
  step after the Monaco edit, not in the same script). **Real delivery tested twice**:
  magic-link emails arrived at rajanregmi16@gmail.com from `Nepali Tools
  <newsletter@allnepalitools.com>` with subject "साइन इन लिंक — Nepali Tools".
- **HOURLY data sync live:** Supabase `pg_cron` job `nepalitools-hourly-sync` (`0 * * * *`)
  → pg_net POST `/api/data/sync` (Bearer CRON_SECRET) — verified end-to-end (HTTP 200,
  real FENEGOSIDA data in `net._http_response`). pg_net API gotcha in this project:
  `headers` is a jsonb OBJECT and the arg is `timeout_milliseconds` (NOT `timeout_msec`);
  response table `net._http_response(id, status_code, content)` has NO `error` column.
  Vercel crons remain as fallback (02:00 UTC sync; newsletter 02:45 UTC self-syncs).
- **`NEXT_PUBLIC_SITE_URL`** production env = `https://allnepalitools.com` (verify with
  `vercel env pull` after any env change — a failed pipe once left the stale value in place).

## In progress / next queue
1. **Verify hourly cron at top of hour:** in Supabase SQL editor
   `select status_code, left(content,200) from net._http_response order by id desc limit 1;`
   (200 = working; manual run already proved 200).
2. **Watch GSC discovery grow:** sitemap status Success (85/139 discovered as of Nov 10 read).
3. **`/en` next steps (started):** English homepage is live; wave 5+ = English tool-page shells,
   English hub pages under `/en/...` + hreflang pairs per tool, possibly a locale-aware Header.
4. Admin allowlist wiring (user deferred).

## Critical operational notes
- **Windows:** use `npm.cmd` / `call` .cmd shims through `cmd /c "..."`. Devanagari renders
  as `?????` in PowerShell output — cosmetic, files are fine.
- **Local prod-like server:** needs env inline:
  `$env:SUPABASE_URL=...; $env:SUPABASE_SERVICE_ROLE_KEY=...` BEFORE
  `Start-Process node -ArgumentList "node_modules\next\dist\bin\next","start","-p","3118"`.
- **Flaky first build:** `next/font` webpack error sometimes on first build → re-run of
  `npm.cmd run build` fixes it.
- **CRON_SECRET / SYNC_SECRET:** same value, already set in Vercel + `.env.local`
  (used to authorize cron + manual API triggers).
- **Search token:** Nepali/romanized queries work only because the alias-phrase boost is
  (12 exact / 7 fuzzy) in `src/lib/search.ts` and that whole file is untracked-new unless
  committed — check `git status` before assuming.
- **2026-11-09 incident worth knowing:** several tracked files were silently reverted to a
  pre-Wave-2 state mid-session (looked like stale editor buffers overwriting files). Was
  recovered from git HEAD; pre-recovery backup kept at `.backup-wt-2026-11-08.zip` (untracked).
  If odd reverts happen again: `git diff` first, never hand-edit blindly.
- **Chat-loss protection:** sessions DB backup zipped at
  `%USERPROFILE%\Documents\opencode-sessions-backup-2026-11-09.zip` (34 MB).
  Make a fresh one with:
  `robocopy "%USERPROFILE%\.local\share\opencode" "%TEMP%\oc-stage" /E /XD log /XF opencode.db opencode.db-shm opencode.db-wal`
  then copy the 3 db files over (they're readable despite locks) and Compress-Archive.

## Key source-map (the 45-second crash tour)
- `src/config/site.ts` — singular source of domain/canonical truth
- `src/lib/tools.ts` + `src/data/tools/*.ts` — tool registry & content (Wave files: content-b..l)
- `src/components/home/*` — homepage sections (ToolLauncher, ForYou, DailyQuiz, Newsletter)
- `src/components/SearchPalette.tsx` + `src/lib/search.ts` — universal search
- `src/lib/data/engine.ts` — the 3-source daily snapshot engine (honesty rules live here)
- `scripts/dump-slugs.js`, `scripts/test-search.js` — dev harnesses (not shipped)
