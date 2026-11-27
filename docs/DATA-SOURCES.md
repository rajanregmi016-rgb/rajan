# Data sources — how the automated engine works

Every live number on Nepali Tools comes from an **official Nepali source**, fetched by the
data engine, validated, and stored with its source and publication date. The engine never
publishes a number it cannot verify, and never fills a gap with an estimate.

> The one line that governs all data work:
> **Missing data is shown as "आजको आधिकारिक तथ्यांक उपलब्ध छैन।" — never invented.**

## The engine

`src/lib/data/engine.ts` — run by:

1. **Vercel Cron** (see `vercel.json`): `0 2 * * *` and `55 4 * * *` UTC → 08:00 and 10:25 NPT daily.
2. **API**: `POST /api/data/sync` (optionally protected with `SYNC_SECRET` via `x-nt-key` header).
3. **Admin dashboard** → "⟳ Run sync now" (server action).

Pipeline per source: **fetch → validate → abnormal-move check → snapshot → history → audit log.**

Files written under `src/data/market/`:

| File | Purpose |
|---|---|
| `snapshot.json` | The latest verified snapshot read by all pages |
| `gold-silver-history.json` / `forex-history.json` / `vegetables-history.json` | Last 90 daily snapshots (capped) |
| `sync-log.json` | Latest 500 audit events (outcome, detail, timestamp) |

## Sources

### 1. Gold & silver — FENEGOSIDA (official)

- **Source:** Nepal Gold & Silver Dealers' Association — `https://api.fenegosida.org/api/website/v1/Dashboard/today`
- **Access:** The same public endpoint the association's own homepage calls for every visitor
  (`Origin: https://fenegosida.org`, `Referer: https://fenegosida.org/`). No authentication involved.
- **Published:** Each working day after the fixing (today + yesterday values, with association timestamps).
- **Units:** `छापावाल सुन (१ तोला)`, `छापावाल सुन (१० ग्राम)`, `असली चाँदी (१ तोला/१० ग्राम)`.
- **Validator:** Every value > 0; daily move against the previous verified snapshot capped at ±35 % —
  a bigger move is treated as an error and the previous verified snapshot is kept (outcome `abnormal-held`).

> **22K tejhabi gold is NOT published by FENEGOSIDA.** We do not display a tejhabi
> "estimate" as if it were an official rate. The calculator derives 18K from the fine
> rate and labels it as an estimate.

### 2. Foreign exchange — Nepal Rastra Bank (official)

- **Source:** `https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=1&from=<YYYY-MM-DD>&to=<YYYY-MM-DD>`
- **Access:** Public documented NRB API, no authentication.
- **Published:** NRB's own `date`/`published_on` for **22 currencies** with buy & sell rates.
- **Fallback logic:** If NRB has not published for today yet, the engine asks for yesterday
  **and labels the page with the real rate date** — yesterday is never passed off as today.
- **Validator:** USD must be present; every rate > 0.

The USD→NPR display rate on tool pages uses, in order: NRB official → `open.er-api.com`
(indicative, labelled as such) → static fallback in `src/data/rates.json`.

### 3. Fruits & vegetables — Kalimati committee (official)

- **Source:** `https://kalimatimarket.gov.np/price` — the committee's own public daily price form.
- **Access:** Exactly the request the site's own page issues to every visitor:
  GET the page for a session cookie + CSRF `_token`, then a form POST
  (`_token`, `datePricing=YYYY-MM-DD`) with `X-Requested-With: XMLHttpRequest`. No auth bypass.
- **Published:** Committee's daily **wholesale** list — 100+ commodities with
  min / max / average in NPR (Nepali digits parsed to numbers), plus the BS date label.
- **Validator:** Rows with all-zero prices are dropped; average must sit within
  0.5×–2× of the min/max band, otherwise the whole batch is refused (`abnormal-held`).
- **Important:** These are **wholesale** prices. Every UI says so — never presented as retail.

### 4. NEPSE — deliberately not shown

No authorized access has been verified, so the homepage NEPSE card shows the honest
unavailability message. We do not scrape or substitute third-party data.

## Static fallbacks

`src/data/rates.json` stores the **last verified official values** (correct as of its
`updated` field) so pages never render blanks before the first sync after a fresh deploy.
The admin dashboard can edit these, but they are secondary to the engine snapshot.
They are never labelled "today" — the tool UI shows the rate's own date.

## Known limitation (before Supabase)

On Vercel's serverless filesystem, `src/data/market/*` writes do **not** persist across
invocations. Until the planned Supabase store lands, the committed snapshot is what
static pages serve between builds, and cron runs mainly validate sources and update the
audit log. This is scheduled to move to Supabase; nothing about the page presentation
depends on the storage backend.

## Adding a new source (checklist)

1. Verify the exact request a real browser makes (no auth, no bypassing restrictions).
2. Validate hard: shape, positive values, cross-checks, move caps.
3. Store `source` + publication date with every record.
4. Log every run to `sync-log.json`; add the source to the sync health cards.
5. Show "आजको आधिकारिक तथ्यांक उपलब्ध छैन।" whenever data could not be verified.
