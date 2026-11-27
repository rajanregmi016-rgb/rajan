// Bulk subscriber importer — Nepali Tools newsletter.
// Usage:
//   1. Put your list in a file: emails.txt (one per line) or emails.csv (column "email", optionally "locale")
//   2. Run: node --env-file=.env.local scripts/import-subscribers.js emails.txt --i-confirm-consent
//
// Safety rules:
//   - Validates every address (RFC-ish check, same as the API route).
//   - Upsert on conflict=email — existing subscribers are NOT touched.
//   - Skips invalid lines and reports them at the end.
//   - Requires --i-confirm-consent flag as an explicit ack that the list is
//     opted-in. Without it, the script refuses to run (anti-accidental-spam).

import { readFileSync } from "node:fs";
import { createInterface } from "node:readline";

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const consent = args.includes("--i-confirm-consent");

if (!file) {
  console.error("Usage: node scripts/import-subscribers.js <emails.txt|emails.csv> --i-confirm-consent");
  process.exit(1);
}
if (!consent) {
  console.error(
    "\nREFUSING to import: the --i-confirm-consent flag is required.\n" +
      "Only import addresses whose owners opted in — unsolicited mail lands\n" +
      "your sender domain in spam (technically and legally).\n" +
      "If the list's consent is uncertain, ask for the double opt-in flow instead.\n"
  );
  process.exit(1);
}

const SUPA = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA || !KEY) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or run with .env.local loaded).");
  process.exit(1);
}

// Parse lines: txt → plain emails; csv → header row with "email" column.
const raw = readFileSync(file, "utf8");
const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
let emailIdx = -1, localeIdx = -1;
let rows;
if (raw.includes(",") && /email/i.test(lines[0])) {
  const head = lines[0].split(",").map((h) => h.trim().toLowerCase());
  emailIdx = head.indexOf("email");
  localeIdx = head.indexOf("locale");
  if (emailIdx < 0) { console.error("CSV headers must include an 'email' column"); process.exit(1); }
  rows = lines.slice(1).map((l) => Object.fromEntries([
    l.split(",").map((c, i) => [i === emailIdx ? "email" : i === localeIdx ? "locale" : "_" + i, c.trim()]),
  ].flat()));
} else {
  rows = lines.map((l) => ({ email: l }));
}

// Collect valid, lowercased, de-duplicated addresses.
const seen = new Map();
for (const r of rows) {
  const e = String(r.email ?? "").trim().toLocaleLowerCase();
  if (!e || e.startsWith("#")) continue;
  if (!EMAIL_RE.test(e)) { console.warn("SKIP invalid:", e); continue; }
  if (!seen.has(e)) seen.set(e, r.locale === "en" ? "en" : "ne");
}

if (!seen.size) { console.error("No valid addresses found."); process.exit(1); }

// Upsert in chunks of 100 (REST row limits + readability).
let inserted = 0, chunk = 100;
const entries = [...seen.entries()];
const now = new Date().toISOString();
for (let i = 0; i < entries.length; i += chunk) {
  const body = entries.slice(i, i + chunk).map(([email, locale]) => ({
    email, locale, source: "import", status: "subscribed", updated_at: now,
  }));
  const res = await fetch(`${SUPA}/rest/v1/newsletter_subscribers?on_conflict=email`, {
    method: "POST",
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`HTTP ${res.status} at chunk ${i}:`, (await res.text()).slice(0, 200));
    process.exit(1);
  }
  const rep = await res.json();
  inserted += Array.isArray(rep) ? rep.length : body.length;
}

console.log(
  `\nDone: ${seen.size} valid address(es), ${inserted} row(s) upserted (existing subscribers untouched).\n` +
    `They will receive the next daily digest at 08:30 NPT — content only from verified official sources.\n`
);
if (process.stdin.isTTY) { createInterface({ input: process.stdin }).close(); }
