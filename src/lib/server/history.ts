import "server-only";
import NepaliDate from "nepali-date-converter";
import { BS_MONTHS } from "@/lib/nepali";
import type { FxRate, MarketSnapshot } from "@/lib/server/marketData";

export type FxDay = { date: string; publishedOn: string; rates: FxRate[] };
export type GoldDay = { date: string; fineTola: number; fineTenGram: number | null; silverTola: number | null };

const UA = "Mozilla/5.0 (compatible; AllNepaliToolsBot/1.0; +https://allnepalitools.com/how-we-verify)";
export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date in Nepal (UTC+5:45) as YYYY-MM-DD. */
export function nepalToday() {
  return new Date(Date.now() + 345 * 60000).toISOString().slice(0, 10);
}
export function shiftDate(iso: string, days: number) {
  const d = new Date(iso + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
export function longDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
export function shortDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
}
export function bsDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  try {
    const n = new NepaliDate(new Date(y, m - 1, d));
    return `${n.getDate()} ${BS_MONTHS[n.getMonth()]} ${n.getYear()}`;
  } catch {
    return "";
  }
}

function mapRates(list: any[]): FxRate[] {
  return (list || [])
    .map((r: any) => ({
      iso3: String(r?.currency?.iso3 || "").toUpperCase(),
      name: String(r?.currency?.name || ""),
      unit: Number(r?.currency?.unit) || 1,
      buy: Number(r?.buy),
      sell: Number(r?.sell),
    }))
    .filter((r: FxRate) => r.iso3 && r.buy > 0 && r.sell > 0);
}

/** NRB daily rates between two dates (inclusive), oldest first. Cached by Next. */
export async function getNrbRange(from: string, to: string, revalidate = 21600): Promise<FxDay[]> {
  // NRB answers long ranges poorly, so ask for at most ~60 days at a time.
  const span = (Date.parse(to) - Date.parse(from)) / 864e5;
  if (span > 60) {
    const parts: Promise<FxDay[]>[] = [];
    for (let end = to; end >= from; end = shiftDate(end, -60)) {
      const start = shiftDate(end, -59) < from ? from : shiftDate(end, -59);
      parts.push(getNrbChunk(start, end, end === to ? Math.min(revalidate, 3600) : revalidate));
    }
    const all = (await Promise.all(parts)).flat();
    const seen = new Set<string>();
    return all.filter((d) => (seen.has(d.date) ? false : (seen.add(d.date), true))).sort((a, b) => a.date.localeCompare(b.date));
  }
  return getNrbChunk(from, to, revalidate);
}

async function getNrbChunk(from: string, to: string, revalidate: number): Promise<FxDay[]> {
  const out: FxDay[] = [];
  for (let page = 1; page <= 6; page++) {
    const url = `${process.env.NRB_BASE || "https://www.nrb.org.np"}/api/forex/v1/rates?page=${page}&per_page=100&from=${from}&to=${to}`;
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "application/json" }, next: { revalidate }, signal: AbortSignal.timeout(20000) });
      if (!res.ok) break;
      const json = await res.json();
      const payload: any[] = json?.data?.payload || [];
      for (const p of payload) {
        const rates = mapRates(p.rates);
        if (rates.length) out.push({ date: String(p.date), publishedOn: String(p.published_on || p.date), rates });
      }
      if (payload.length < 100) break;
    } catch {
      break;
    }
  }
  const seen = new Set<string>();
  return out.filter((d) => (seen.has(d.date) ? false : (seen.add(d.date), true))).sort((a, b) => a.date.localeCompare(b.date));
}

/** Rates for one day, plus the previous published day for comparison. */
export async function getFxDay(date: string) {
  const past = date < nepalToday();
  const days = await getNrbRange(shiftDate(date, -10), date, past ? 2592000 : 3600);
  const i = days.findIndex((d) => d.date === date);
  if (i < 0) return null;
  return { day: days[i], prev: i > 0 ? days[i - 1] : null };
}

/** Daily gold rates we have recorded (latest reading per Nepal date), oldest first. */
export async function getGoldHistory(): Promise<GoldDay[]> {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/rest/v1/market_history?select=captured_at,payload&category=eq.gold&order=captured_at.asc&limit=5000`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      next: { revalidate: 1800, tags: ["market"] },
    });
    if (!res.ok) return [];
    const rows: { captured_at: string; payload: NonNullable<MarketSnapshot["gold"]> }[] = await res.json();
    const byDay = new Map<string, GoldDay>();
    for (const r of rows) {
      if (!r.payload?.fineTola) continue;
      const date = new Date(new Date(r.captured_at).getTime() + 345 * 60000).toISOString().slice(0, 10);
      byDay.set(date, { date, fineTola: r.payload.fineTola, fineTenGram: r.payload.fineTenGram, silverTola: r.payload.silverTola });
    }
    return Array.from(byDay.values());
  } catch {
    return [];
  }
}
