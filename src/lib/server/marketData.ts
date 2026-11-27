import "server-only";
import { getRates, type RatesData } from "@/lib/rates";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

/**
 * Live market data engine.
 * Sources (official only — nothing is ever invented):
 *  - Nepal Rastra Bank public forex API (exchange rates)
 *  - FENEGOSIDA home page (daily gold / silver fixing)
 * A snapshot is stored in Supabase `market_snapshots` every hour; pages read the
 * latest snapshot and fall back to the hand-checked values in src/data/rates.json.
 */

export type FxRate = { iso3: string; name: string; unit: number; buy: number; sell: number };
export type MarketSnapshot = {
  syncedAt: string;
  gold: null | {
    fineTola: number;
    tejabiTola: number | null;
    silverTola: number | null;
    fineTenGram: number | null;
    fetchedAt: string;
  };
  forex: null | { date: string; publishedOn: string; rates: FxRate[] };
};

const UA = "Mozilla/5.0 (compatible; AllNepaliToolsBot/1.0; +https://allnepalitools.com/how-we-verify)";

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

export async function fetchNrbForex(): Promise<MarketSnapshot["forex"]> {
  const to = new Date();
  const from = new Date(Date.now() - 7 * 864e5);
  const url = `https://www.nrb.org.np/api/forex/v1/rates?page=1&per_page=100&from=${ymd(from)}&to=${ymd(to)}`;
  const res = await fetch(url, { cache: "no-store", headers: { "User-Agent": UA, Accept: "application/json" }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`NRB HTTP ${res.status}`);
  const json = await res.json();
  const payload: any[] = json?.data?.payload || [];
  if (!payload.length) throw new Error("NRB returned no rates");
  payload.sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const latest = payload[0];
  const rates: FxRate[] = (latest.rates || [])
    .map((r: any) => ({
      iso3: String(r?.currency?.iso3 || "").toUpperCase(),
      name: String(r?.currency?.name || ""),
      unit: Number(r?.currency?.unit) || 1,
      buy: Number(r?.buy),
      sell: Number(r?.sell),
    }))
    .filter((r: FxRate) => r.iso3 && r.buy > 0 && r.sell > 0);
  if (!rates.find((r) => r.iso3 === "USD")) throw new Error("NRB payload has no USD");
  return { date: String(latest.date), publishedOn: String(latest.published_on || latest.date), rates };
}

function num(s: string | undefined) {
  if (!s) return null;
  const n = Number(s.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Parses the FENEGOSIDA fixing table. Values outside sane ranges are rejected. */
export function parseFenegosida(html: string): MarketSnapshot["gold"] {
  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ");
  const grab = (label: string, unit: "tola" | "grm") => {
    const re = new RegExp(`${label}[^0-9]{0,80}?(?:\\(\\d+\\))?[^0-9]{0,40}?per\\s*(?:1\\s*tola|10\\s*gr?a?m)[^0-9]{0,20}?Nrs\\.?\\s*([\\d,]+(?:\\.\\d+)?)`, "gi");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) {
      const isTola = /tola/i.test(m[0]);
      if ((unit === "tola") === isTola) return num(m[1]);
    }
    return null;
  };
  const fineTola = grab("FINE\\s*GOLD", "tola");
  const tejabiTola = grab("TEJABI\\s*GOLD", "tola");
  const silverTola = grab("SILVER", "tola");
  const fineTenGram = grab("FINE\\s*GOLD", "grm");
  if (!fineTola || fineTola < 30000 || fineTola > 2000000) return null;
  return {
    fineTola,
    tejabiTola: tejabiTola && tejabiTola < fineTola ? tejabiTola : null,
    silverTola: silverTola && silverTola > 200 && silverTola < 100000 ? silverTola : null,
    fineTenGram: fineTenGram && fineTenGram < fineTola ? fineTenGram : null,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchFenegosida(): Promise<MarketSnapshot["gold"]> {
  const res = await fetch("https://www.fenegosida.org/", { cache: "no-store", headers: { "User-Agent": UA }, signal: AbortSignal.timeout(20000) });
  if (!res.ok) throw new Error(`FENEGOSIDA HTTP ${res.status}`);
  const html = await res.text();
  const gold = parseFenegosida(html);
  if (!gold) {
    const i = html.search(/gold/i);
    const text = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/\s+/g, " ");
    const j = text.search(/fine\s*gold/i);
    console.log("[fenegosida-diag]", JSON.stringify({
      len: html.length,
      head: html.slice(0, 300),
      rawAroundGold: i >= 0 ? html.slice(Math.max(0, i - 300), i + 1500) : null,
      textAroundFine: j >= 0 ? text.slice(Math.max(0, j - 200), j + 1500) : null,
      scripts: Array.from(html.matchAll(/<script[^>]+src="([^"]+)"/gi)).map((m) => m[1]).slice(0, 15),
    }));
    throw new Error("FENEGOSIDA page could not be parsed");
  }
  return gold;
}

async function latestStoredSnapshot(): Promise<MarketSnapshot | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data } = await db.from("market_snapshots").select("payload").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  const p = data?.payload as MarketSnapshot | undefined;
  return p && typeof p === "object" && "syncedAt" in p ? p : null;
}

/** Fetch every source, merge with the last good snapshot, store it. */
export async function runSync() {
  const events: { source: string; ok: boolean; detail: string }[] = [];
  const prev = await latestStoredSnapshot().catch(() => null);
  const [fx, gold] = await Promise.allSettled([fetchNrbForex(), fetchFenegosida()]);

  const forex = fx.status === "fulfilled" ? fx.value : prev?.forex ?? null;
  events.push(fx.status === "fulfilled"
    ? { source: "nrb", ok: true, detail: `rates for ${fx.value?.date}` }
    : { source: "nrb", ok: false, detail: String(fx.reason?.message || fx.reason) });

  const g = gold.status === "fulfilled" ? gold.value : prev?.gold ?? null;
  events.push(gold.status === "fulfilled"
    ? { source: "fenegosida", ok: true, detail: `fine gold Rs ${gold.value?.fineTola}/tola` }
    : { source: "fenegosida", ok: false, detail: String(gold.reason?.message || gold.reason) });

  const snapshot: MarketSnapshot = { syncedAt: new Date().toISOString(), gold: g, forex };
  const ok = events.some((e) => e.ok);
  const db = supabaseAdmin();
  let stored = false;
  if (db && ok) {
    const ins = await db.from("market_snapshots").insert({ payload: snapshot });
    stored = !ins.error;
    if (ins.error) events.push({ source: "supabase", ok: false, detail: ins.error.message });
    const hist: { category: string; captured_at: string; payload: unknown }[] = [];
    if (fx.status === "fulfilled" && fx.value) hist.push({ category: "forex", captured_at: snapshot.syncedAt, payload: fx.value });
    if (gold.status === "fulfilled" && gold.value) hist.push({ category: "gold", captured_at: snapshot.syncedAt, payload: gold.value });
    if (hist.length) await db.from("market_history").insert(hist);
  }
  if (db) await db.from("sync_runs").insert({ ok, events });
  return { ok, stored, events, snapshot };
}

/** Latest snapshot for pages: cached for 30 min via the Supabase REST endpoint. */
export async function getLatestSnapshot(): Promise<MarketSnapshot | null> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  try {
    const res = await fetch(`${url}/rest/v1/market_snapshots?select=payload&order=updated_at.desc&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 1800, tags: ["market"] },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { payload: MarketSnapshot }[];
    return rows?.[0]?.payload ?? null;
  } catch {
    return null;
  }
}

export function usdMid(s: MarketSnapshot | null): number | null {
  const usd = s?.forex?.rates.find((r) => r.iso3 === "USD");
  return usd ? Math.round(((usd.buy + usd.sell) / 2 / usd.unit) * 100) / 100 : null;
}

const TOLA_GRAMS = 11.6638;

/** The hand-checked rates.json, with gold/forex replaced by the latest official snapshot when one exists. */
export async function getLiveRates(): Promise<RatesData & { live: { gold: boolean; forex: boolean } }> {
  const base = getRates();
  const snap = await getLatestSnapshot();
  const out = { ...base, gold: { ...base.gold }, forex: { ...base.forex }, live: { gold: false, forex: false } };
  if (snap?.gold?.fineTola) {
    const g = snap.gold;
    out.gold = {
      fineTola: g.fineTola,
      tejabiTola: g.tejabiTola ?? base.gold.tejabiTola,
      silverTola: g.silverTola ?? base.gold.silverTola,
      tenGram: g.fineTenGram ?? Math.round((g.fineTola / TOLA_GRAMS) * 10),
      updated: g.fetchedAt,
      source: "FENEGOSIDA daily fixing, fetched automatically every hour (reference — confirm with a licensed dealer before any transaction)",
    };
    out.live.gold = true;
  }
  const mid = usdMid(snap);
  if (mid && snap?.forex) {
    const usd = snap.forex.rates.find((r) => r.iso3 === "USD")!;
    out.forex = {
      fallbackUsdNpr: mid,
      updated: snap.forex.date,
      source: `Nepal Rastra Bank official rate ${snap.forex.date} (buy Rs ${usd.buy} / sell Rs ${usd.sell}, midpoint shown)`,
    };
    out.live.forex = true;
    (out as RatesData).fx = { date: snap.forex.date, rates: snap.forex.rates };
  }
  return out;
}
