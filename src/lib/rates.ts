import fs from "node:fs";
import path from "node:path";

export type Slab = { upto: number; rate: number };

export type RatesData = {
  live?: { gold: boolean; forex: boolean };
  /** Full NRB table from the latest hourly snapshot (when available). */
  fx?: { date: string; rates: { iso3: string; name: string; unit: number; buy: number; sell: number }[] };
  gold: {
    fineTola: number;
    tejabiTola: number;
    silverTola: number;
    tenGram: number;
    updated: string;
    source: string;
  };
  forex: {
    fallbackUsdNpr: number;
    updated: string;
    source: string;
  };
  tax: {
    fiscalYear: string;
    lastReviewed: string;
    note: string;
    slabs: { unmarried: Slab[]; married: Slab[] };
    ssfPercent: number;
    ssfMonthlyCap: number;
    citMonthlyCap: number;
  };
};

const FILE = path.join(process.cwd(), "src", "data", "rates.json");

export function getRates(): RatesData {
  const raw = fs.readFileSync(FILE, "utf-8");
  const data = JSON.parse(raw) as RatesData;
  return data;
}

export function writeRates(updater: (data: RatesData) => RatesData): RatesData {
  const current = getRates();
  const next = updater(current);
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

const ER_API = "https://open.er-api.com/v6/latest/USD";

export type ForexBundle = {
  usdNpr: number;
  rates: Record<string, number>;
  live: boolean;
  fetchedAt: string;
  provider: string;
};

/** Fetch USD→NPR (plus a USD-based table) with a static fallback. */
export async function getForex(): Promise<ForexBundle> {
  const fallback = getRates().forex;
  try {
    const res = await fetch(ER_API, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = (await res.json()) as {
        rates: Record<string, number>;
        time_last_update_iso?: string;
      };
      if (json?.rates?.NPR) {
        return {
          usdNpr: json.rates.NPR,
          rates: json.rates,
          live: true,
          fetchedAt: json.time_last_update_iso || new Date().toISOString(),
          provider: "open.er-api.com (indicative, not NRB official)",
        };
      }
    }
  } catch {
    // fall through to static values
  }
  return {
    usdNpr: fallback.fallbackUsdNpr,
    rates: { USD: 1, NPR: fallback.fallbackUsdNpr, INR: fallback.fallbackUsdNpr / 83.4, EUR: 1.08, GBP: 1.26 },
    live: false,
    fetchedAt: fallback.updated,
    provider: "built-in reference (static fallback)",
  };
}
