"use client";

import { useMemo, useState } from "react";
import NepaliDate from "nepali-date-converter";
import { ToolShell, ResultCard, CopyButton } from "@/components/tools/ui";
import { BS_MONTHS, BS_MONTHS_NP } from "@/lib/nepali";
import type { RatesData } from "@/lib/rates";

/**
 * A small engine for form-style calculators: declare fields + a compute
 * function and get a consistent, accessible tool UI.
 */
export type FieldDef =
  | { k: string; type: "num"; label: string; def: string; hint?: string; min?: number; max?: number; step?: number; suffix?: string }
  | { k: string; type: "select"; label: string; def: string; options: Array<[string, string]>; hint?: string }
  | { k: string; type: "text"; label: string; def: string; hint?: string; rows?: number; placeholder?: string }
  | { k: string; type: "bsdate"; label: string; def?: "today" | string; hint?: string }
  | { k: string; type: "addate"; label: string; def?: "today" | string; hint?: string }
  | { k: string; type: "time"; label: string; def: string; hint?: string };

export type Result =
  | {
      items: Array<{ label: string; value: string; sub?: string; emphasize?: boolean }>;
      table?: { head: string[]; rows: string[][]; caption?: string };
      note?: string;
      copy?: string;
    }
  | { error: string }
  | null;

export type FormulaConfig = {
  fields: FieldDef[];
  compute: (v: Record<string, string>, rates?: RatesData) => Result;
  /** Lay fields out in 1, 2 or 3 columns on wide screens. */
  cols?: 1 | 2 | 3;
};

export function bsTodayParts() {
  const n = new NepaliDate(new Date());
  return { y: n.getYear(), m: n.getMonth(), d: n.getDate() };
}
export const parseBs = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m, d };
};
export function bsToAd(s: string): Date | null {
  const { y, m, d } = parseBs(s);
  try {
    const nd = new NepaliDate(y, m, d);
    if (nd.getMonth() !== m || nd.getDate() !== d) return null;
    const js = nd.toJsDate();
    js.setHours(0, 0, 0, 0);
    return js;
  } catch {
    return null;
  }
}
export function adToBsLabel(dt: Date) {
  const n = new NepaliDate(dt);
  return `${n.getDate()} ${BS_MONTHS[n.getMonth()]} ${n.getYear()}`;
}
export function adToBsNp(dt: Date) {
  const n = new NepaliDate(dt);
  const np = (x: number) => String(x).replace(/\d/g, (c) => "०१२३४५६७८९"[Number(c)]);
  return `${np(n.getYear())} ${BS_MONTHS_NP[n.getMonth()]} ${np(n.getDate())}`;
}
export const adLabel = (dt: Date) => dt.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
export const todayAd = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
export const isoDate = (dt: Date) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;

function initial(f: FieldDef): string {
  if (f.type === "bsdate") {
    if (f.def && f.def !== "today") return f.def;
    const t = bsTodayParts();
    return `${t.y}-${t.m}-${t.d}`;
  }
  if (f.type === "addate") return !f.def || f.def === "today" ? isoDate(new Date()) : f.def;
  return f.def;
}

const YEARS = Array.from({ length: 91 }, (_, i) => 2000 + i);

function BsDateInput({ value, onChange, id }: { value: string; onChange: (v: string) => void; id: string }) {
  const { y, m, d } = parseBs(value);
  const set = (ny: number, nm: number, nd: number) => onChange(`${ny}-${nm}-${nd}`);
  return (
    <div className="grid grid-cols-[1fr_1.4fr_0.9fr] gap-2">
      <select id={id} className="input" aria-label="Year (BS)" value={y} onChange={(e) => set(Number(e.target.value), m, d)}>
        {YEARS.map((yy) => <option key={yy} value={yy}>{yy}</option>)}
      </select>
      <select className="input" aria-label="Month (BS)" value={m} onChange={(e) => set(y, Number(e.target.value), d)}>
        {BS_MONTHS.map((name, i) => <option key={name} value={i}>{name}</option>)}
      </select>
      <select className="input" aria-label="Day (BS)" value={d} onChange={(e) => set(y, m, Number(e.target.value))}>
        {Array.from({ length: 32 }, (_, i) => i + 1).map((dd) => <option key={dd} value={dd}>{dd}</option>)}
      </select>
    </div>
  );
}

export function FormulaView({ config, rates }: { config: FormulaConfig; rates?: RatesData }) {
  const [v, setV] = useState<Record<string, string>>(() => Object.fromEntries(config.fields.map((f) => [f.k, initial(f)])));
  const set = (k: string, val: string) => setV((o) => ({ ...o, [k]: val }));
  const res = useMemo(() => {
    try { return config.compute(v, rates); } catch { return { error: "Please check your inputs." } as Result; }
  }, [v, config, rates]);
  const cols = config.cols ?? 2;
  const grid = cols === 1 ? "" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";

  return (
    <ToolShell>
      <div className={`grid gap-3 ${grid}`}>
        {config.fields.map((f) => {
          const id = `f-${f.k}`;
          const wide = f.type === "text" || f.type === "bsdate";
          return (
            <div key={f.k} className={wide && cols !== 1 ? "sm:col-span-2 lg:col-span-full" : ""}>
              <label htmlFor={id} className="label">{f.label}</label>
              {f.type === "num" && (
                <div className="relative">
                  <input id={id} type="number" inputMode="decimal" className={`input ${f.suffix ? "pr-14" : ""}`} value={v[f.k]} min={f.min} max={f.max} step={f.step ?? "any"} onChange={(e) => set(f.k, e.target.value)} />
                  {f.suffix && <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-ink-400">{f.suffix}</span>}
                </div>
              )}
              {f.type === "select" && (
                <select id={id} className="input" value={v[f.k]} onChange={(e) => set(f.k, e.target.value)}>
                  {f.options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
                </select>
              )}
              {f.type === "text" && (
                <textarea id={id} className="input min-h-[110px] leading-7" rows={f.rows ?? 4} placeholder={f.placeholder} value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />
              )}
              {f.type === "bsdate" && <BsDateInput id={id} value={v[f.k]} onChange={(val) => set(f.k, val)} />}
              {f.type === "addate" && <input id={id} type="date" className="input" value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />}
              {f.type === "time" && <input id={id} type="time" className="input" value={v[f.k]} onChange={(e) => set(f.k, e.target.value)} />}
              {f.hint && <span className="mt-1 block text-xs text-ink-500">{f.hint}</span>}
            </div>
          );
        })}
      </div>
      {res && "error" in res && <p className="mt-4 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200" role="alert">{res.error}</p>}
      {res && "items" in res && (
        <>
          <ResultCard items={res.items} />
          {res.copy && <div className="mt-2 flex justify-end"><CopyButton text={res.copy} label="Copy result" /></div>}
          {res.table && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-ink-200 dark:border-ink-800">
              <table className="w-full min-w-[360px] text-sm">
                {res.table.caption && <caption className="px-4 pt-3 text-left text-xs font-semibold uppercase tracking-wide text-ink-500">{res.table.caption}</caption>}
                <thead><tr className="text-left text-xs uppercase tracking-wide text-ink-500">{res.table.head.map((h) => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead>
                <tbody>
                  {res.table.rows.map((r, i) => (
                    <tr key={i} className="border-t border-ink-100 dark:border-ink-800">{r.map((c, j) => <td key={j} className={`tnum px-4 py-2 ${j === 0 ? "font-medium" : ""}`}>{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {res.note && <p className="mt-3 text-xs leading-5 text-ink-500">{res.note}</p>}
        </>
      )}
    </ToolShell>
  );
}
