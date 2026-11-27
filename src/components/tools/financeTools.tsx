"use client";

import { useEffect, useMemo, useState } from "react";
import { formatNpNumber, groupAsian, nepaliWords, toNpDigits } from "@/lib/nepali";
import { Field, Num, ResultCard, ToolShell } from "@/components/tools/ui";
import type { RatesData } from "@/lib/rates";

/* ---------- EMI ---------- */
export function EmiTool() {
  const [amount, setAmount] = useState("5000000");
  const [rate, setRate] = useState("9.5");
  const [years, setYears] = useState("20");
  const r = useMemo(() => {
    const P = Number(amount), annual = Number(rate), n = Math.max(1, Math.round(Number(years) * 12));
    if (!P || P <= 0 || !annual || annual <= 0 || !Number.isFinite(n)) return null;
    const mr = annual / 12 / 100;
    const factor = Math.pow(1 + mr, n);
    const emi = (P * mr * factor) / (factor - 1);
    const total = emi * n;
    const schedule = [
      { i: 1, interest: P * mr, principal: emi - P * mr },
      { i: 2, interest: (P - (emi - P * mr)) * mr, principal: emi - (P - (emi - P * mr)) * mr },
    ];
    return { emi, total, interest: total - P, n, P, schedule };
  }, [amount, rate, years]);

  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="Loan amount (रु)" hint="Loan amount in rupees">
          <Num value={amount} onChange={setAmount} min={1000} placeholder="5000000" />
        </Field>
        <Field label="Annual interest rate (%)" hint="e.g. 9.5%">
          <Num value={rate} onChange={setRate} min={1} step={0.01} max={30} />
        </Field>
        <Field label="Tenure (years)" hint="Loan term in years">
          <Num value={years} onChange={setYears} min={1} max={30} placeholder="20" />
        </Field>
      </div>
      {r && (
        <>
          <ResultCard items={[
            { label: "Monthly EMI", value: fmt(r.emi), sub: "रु- मासिक किस्ता", emphasize: true },
            { label: "Total interest", value: fmt(r.interest), sub: "कुल ब्याज" },
            { label: "Total repayment", value: fmt(r.total), sub: "कुल तिर्नुपर्ने रकम" },
            { label: "Months", value: toNpDigits(r.n), sub: `${r.n} EMIs` },
          ]} />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[360px] text-sm">
              <caption className="sr-only">First EMI breakdown</caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-1">EMI #</th>
                  <th className="py-1">Interest part</th>
                  <th className="py-1">Principal part</th>
                </tr>
              </thead>
              <tbody>
                {r.schedule.map((s) => (
                  <tr key={s.i} className="border-t border-ink-100 dark:border-ink-800">
                    <td className="py-1.5">{s.i}</td>
                    <td className="py-1.5">{fmt(s.interest)}</td>
                    <td className="py-1.5">{fmt(s.principal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-ink-400">First two months of the reducing-balance schedule.</p>
          </div>
          <p className="mt-3 text-xs text-ink-500 dark:text-ink-400 devanagari">
            {nepaliWords(Math.round(r.emi))} रुपैंया मासिक किस्ता — {nepaliWords(Math.round(r.total))} रुपैंया जम्मा ।
          </p>
        </>
      )}
    </ToolShell>
  );
}
const fmt = (n: number) => `Rs ${groupAsian(Math.round(n))}`;

/* ---------- Income tax ---------- */
export function IncomeTaxTool({ rates: config }: { rates: RatesData }) {
  const [married, setMarried] = useState<"unmarried" | "married">("unmarried");
  const [monthly, setMonthly] = useState("80000");
  const [basic, setBasic] = useState("45000");
  const [cit, setCit] = useState("5000");
  const [ssfUse, setSsfUse] = useState(true);

  const out = useMemo(() => {
    const salary = Number(monthly) * 12;
    const basicAnnual = (Number(basic) || 0) * 12;
    const slabs = config.tax.slabs[married] ?? config.tax.slabs.unmarried;
    const ssf = ssfUse ? Math.min(basicAnnual * (config.tax.ssfPercent / 100), config.tax.ssfMonthlyCap * 12 * (config.tax.ssfPercent / 100)) : 0;
    const citUsed = Math.min(Number(cit) * 12, config.tax.citMonthlyCap * 12);
    const taxable = Math.max(0, salary - ssf - citUsed);
    let remaining = taxable;
    let prev = 0;
    const rows: Array<{ upto: string; rate: number; amount: number }> = [];
    for (const slab of slabs) {
      const span = slab.upto - prev;
      const within = Math.max(0, Math.min(span, remaining));
      rows.push({
        upto: slab.upto >= 999999999 ? "∞ (above last slab)" : fmt(slab.upto),
        rate: slab.rate,
        amount: within * slab.rate,
      });
      remaining -= within;
      prev = slab.upto;
      if (remaining <= 0) break;
    }
    const tax = rows.reduce((a, b) => a + b.amount, 0);
    return { salary, ssf, citUsed, taxable, rows, tax, monthly: tax / 12 };
  }, [married, monthly, basic, cit, ssfUse, config]);

  return (
    <ToolShell>
      <div className="flex gap-2">
        {(Object.keys(config.tax.slabs) as Array<"unmarried" | "married">).map((k) => (
          <button key={k} onClick={() => setMarried(k)}
            className={`btn !px-4 !py-2 text-xs ${married === k ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}
            aria-pressed={married === k}>
            {k === "married" ? "विवाहित (Married)" : "अविवाहित (Unmarried)"}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label="Monthly salary (gross, रु)">
          <Num value={monthly} onChange={setMonthly} min={0} />
        </Field>
        <Field label="Monthly basic salary (रु)" hint="Used for the 11% SSF share">
          <Num value={basic} onChange={setBasic} min={0} />
        </Field>
        <Field label="Monthly CIT contribution (रु)">
          <Num value={cit} onChange={setCit} min={0} />
        </Field>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input type="checkbox" checked={ssfUse} onChange={(e) => setSsfUse(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          <span className="text-ink-600 dark:text-ink-300">SSF 11% of basic (employee share)</span>
        </label>
      </div>
      {out && (
        <>
          <ResultCard items={[
            { label: "Estimated annual tax", value: fmt(out.tax), sub: "वार्षिक अनुमानित कर", emphasize: true },
            { label: "Monthly TDS estimate", value: fmt(out.monthly), sub: "मासिक (टिडिएस अनुमान)" },
            { label: "Taxable income", value: fmt(out.taxable), sub: "करयोग्य आम्दानी" },
            { label: "SSF / CIT used", value: fmt(out.ssf + out.citUsed), sub: "tax-relief routes" },
          ]} />
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[380px] text-sm">
              <caption className="sr-only">Slab breakdown</caption>
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-ink-400">
                  <th className="py-1">Slab upto</th>
                  <th className="py-1">Rate</th>
                  <th className="py-1">Tax in slab</th>
                </tr>
              </thead>
              <tbody>
                {out.rows.filter((r2) => r2.amount > 0 || r2.rate > 0).map((r2, idx) => (
                  <tr key={idx} className="border-t border-ink-100 dark:border-ink-800">
                    <td className="py-1.5">{r2.upto}</td>
                    <td className="py-1.5">{(r2.rate * 100).toFixed(1)}%</td>
                    <td className="py-1.5">{fmt(r2.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-ink-400">
              FY configured: {config.tax.fiscalYear}. Verify with the latest Finance Act / IRD before filing.
            </p>
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- VAT ---------- */
export function VatTool() {
  const [mode, setMode] = useState<"add" | "remove">("add");
  const [amount, setAmount] = useState("10000");
  const [rate, setRate] = useState("13");
  const out = useMemo(() => {
    const amt = Number(amount), v = Number(rate);
    if (!Number.isFinite(amt) || !Number.isFinite(v) || v <= 0) return null;
    if (mode === "add") {
      const net = amt, vat = amt * (v / 100), gross = amt + vat;
      return { net, vat, gross };
    }
    const net = amt / (1 + v / 100), vat = amt - net, gross = amt;
    return { net, vat, gross };
  }, [mode, amount, rate]);

  return (
    <ToolShell>
      <div className="flex gap-2">
        {[["add", "Add VAT"], ["remove", "Remove VAT"]].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k as "add" | "remove")}
            className={`btn !px-4 !py-2 text-xs ${mode === k ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}
            aria-pressed={mode === k}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field label={mode === "add" ? "Net amount (without VAT, रु)" : "Gross amount (VAT included, रु)"}>
          <Num value={amount} onChange={setAmount} min={0} />
        </Field>
        <Field label="VAT rate (%)" hint="Nepal standard rate: 13%">
          <Num value={rate} onChange={setRate} min={0} step={0.5} max={50} />
        </Field>
      </div>
      {out && (
        <ResultCard items={[
          { label: "Net amount", value: fmt(out.net), sub: "भ्याट बाहेक रकम" },
          { label: "VAT", value: fmt(out.vat), sub: "भ्याट रकम", emphasize: true },
          { label: "Gross total", value: fmt(out.gross), sub: "कुल रकम" },
          { label: "Rate", value: `${rate}%`, sub: "भ्याट दर" },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- USD ↔ NPR ---------- */
const POPULAR = [1, 10, 100, 1000];

export function UsdNprTool({ rates }: { rates: RatesData }) {
  const fallback = rates.forex.fallbackUsdNpr;
  const liveRates = { USD: 1, NPR: fallback };
  const [dir, setDir] = useState<"usd2npr" | "npr2usd">("usd2npr");
  const [amount, setAmount] = useState("1");
  const [live, setLive] = useState<number>(fallback);
  const [err, setErr] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { rates?: Record<string, number> }) => {
        if (!cancelled && j.rates && j.rates.NPR) setLive(j.rates.NPR);
      })
      .catch(() => { if (!cancelled) setErr(true); });
    return () => { cancelled = true; };
  }, []);
  void liveRates;

  const n = Number(amount);
  const out = (() => {
    if (!Number.isFinite(n)) return null;
    return dir === "usd2npr" ? n * live : n / live;
  })();

  return (
    <ToolShell>
      <div className="flex gap-2">
        <button onClick={() => setDir("usd2npr")} className={`btn !px-4 !py-2 text-xs ${dir === "usd2npr" ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`} aria-pressed={dir === "usd2npr"}>
          $ → रु
        </button>
        <button onClick={() => setDir("npr2usd")} className={`btn !px-4 !py-2 text-xs ${dir === "npr2usd" ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`} aria-pressed={dir === "npr2usd"}>
          रु → $
        </button>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <div className="flex-1">
          <Field label={dir === "usd2npr" ? "US Dollar amount" : "Nepali Rupee amount"}>
            <Num value={amount} onChange={setAmount} min={0} />
          </Field>
        </div>
        <div className="rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-bold text-brand-700 dark:border-ink-800 dark:text-brand-300">
          {out !== null ? (dir === "usd2npr" ? `Rs ${groupAsian(out)}` : `$ ${out.toFixed(2)}`) : "—"}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {POPULAR.map((p) => (
          <button key={p} onClick={() => setAmount(String(p))} className="chip">{dir === "usd2npr" ? `$${p}` : `Rs ${formatNpNumber(p)}`}</button>
        ))}
      </div>
      <p className="mt-3 text-xs text-ink-400">
        {err || !live ? `Reference rate Rs ${groupAsian(fallback)} per USD.` : `Live indicative rate RS ${groupAsian(live)} per USD. Official transactions use NRB's daily rate.`}
      </p>
    </ToolShell>
  );
}

/* ---------- Compound interest ---------- */
export function CompoundTool() {
  const [mode, setMode] = useState<"lumpsum" | "monthly">("lumpsum");
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("9");
  const [years, setYears] = useState("5");
  const [freq, setFreq] = useState(4);

  const out = useMemo(() => {
    const P = Number(principal), r = Number(rate), t = Number(years);
    if (!P || !r || !t || r <= 0 || t <= 0 || Number.isNaN(P)) return null;
    if (mode === "lumpsum") {
      const per = [{ label: "Yearly", n: 1 }, { label: "Half-yearly", n: 2 }, { label: "Quarterly", n: 4 }, { label: "Monthly", n: 12 }].find((x) => x.n === freq)!;
      void per;
      const fv = P * Math.pow(1 + r / 100 / freq, freq * t);
      return { fv: [fv], interest: [fv - P], total: P, years: Math.round(t) };
    }
    const monthlyRate = r / 100;
    const months = t * 12;
    const series: number[] = [];
    const bal: number[] = [];
    let v = 0;
    const nComp = 12;
    for (let m = 1; m <= months; m++) {
      v = (v) * (1 + monthlyRate / nComp) + P;
      const yearsNow = Math.floor(m / 12);
      if (m % 12 === 0) { bal.push(v); series.push(v - P * (m / 12)); }
    }
    return { bal, interest: series, total: P * months, years: Math.round(t), fv: bal };
  }, [mode, principal, rate, years, freq]);

  return (
    <ToolShell>
      <div className="flex gap-2">
        {[["lumpsum", "Lump sum / Fixed deposit"], ["monthly", "Monthly saving (SIP)"]].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k as "lumpsum" | "monthly")}
            className={`btn !px-4 !py-2 text-xs ${mode === k ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}
            aria-pressed={mode === k}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label={mode === "lumpsum" ? "Lump sum (रु)" : "Monthly deposit (रु)"}>
          <Num value={principal} onChange={setPrincipal} min={100} />
        </Field>
        <Field label="Annual rate (%)">
          <Num value={rate} onChange={setRate} min={1} step={0.25} />
        </Field>
        <Field label="Years">
          <Num value={years} onChange={setYears} min={1} max={40} />
        </Field>
      </div>
      {mode === "lumpsum" && (
        <div className="mt-3 max-w-xs">
          <Field label="Compounding frequency">
            <select className="input" value={freq} onChange={(e) => setFreq(Number(e.target.value))}>
              <option value={1}>Yearly</option>
              <option value={2}>Half-yearly</option>
              <option value={4}>Quarterly (typical for Nepali FDs)</option>
              <option value={12}>Monthly</option>
            </select>
          </Field>
        </div>
      )}
      {out && (
        <ResultCard items={[
          { label: "Final value", value: fmt(out.fv[out.fv.length - 1]), sub: "कुल वैल्यु (अनुमानित)", emphasize: true },
          { label: "Interest earned", value: fmt(out.fv[out.fv.length - 1] - out.total), sub: "कमाइको ब्याज" },
          { label: mode === "lumpsum" ? "Principal" : "Total deposited", value: fmt(out.total), sub: "मूलधन" },
          { label: "Growth", value: `${((out.fv[out.fv.length - 1] / out.total - 1) * 100).toFixed(1)}%`, sub: "overall growth" },
        ]} />
      )}
      <p className="mt-3 text-xs text-ink-400">
        Interest is compounded per your selection; Nepali banks compound FDs quarterly by default. TDS on interest applies.
      </p>
    </ToolShell>
  );
}
