"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { ToolShell, ResultCard, Field, Num, Row, CopyButton } from "@/components/tools/ui";
import { groupAsian, moneyInNepaliWords } from "@/lib/nepali";
import type { RatesData } from "@/lib/rates";

const rs = (n: number) => `Rs ${groupAsian(n)}`;
const toggle = (on: boolean) =>
  `btn !px-4 !py-2 text-xs ${on ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`;

/* ---------- SIP / monthly investment ---------- */
export function SipTool() {
  const [monthly, setMonthly] = useState("5000");
  const [rate, setRate] = useState("10");
  const [years, setYears] = useState("10");
  const [stepUp, setStepUp] = useState("0");
  const r = useMemo(() => {
    const m = Number(monthly), y = Number(years), i = Number(rate) / 100 / 12, s = Number(stepUp) / 100;
    if (!(m > 0) || !(y > 0) || y > 60 || !(i >= 0)) return null;
    let value = 0, invested = 0, pay = m;
    for (let month = 1; month <= Math.round(y * 12); month++) {
      if (month > 1 && (month - 1) % 12 === 0) pay *= 1 + s;
      value = (value + pay) * (1 + i);
      invested += pay;
    }
    return { value, invested, gain: value - invested };
  }, [monthly, rate, years, stepUp]);
  return (
    <ToolShell>
      <Row>
        <Field label="Monthly investment (Rs)"><Num value={monthly} onChange={setMonthly} min={0} /></Field>
        <Field label="Expected yearly return (%)" hint="Past returns don't guarantee future returns."><Num value={rate} onChange={setRate} min={0} step={0.1} /></Field>
        <Field label="Time (years)"><Num value={years} onChange={setYears} min={1} max={60} /></Field>
        <Field label="Increase each year (%)" hint="Optional step-up, e.g. 10% when your salary grows."><Num value={stepUp} onChange={setStepUp} min={0} /></Field>
      </Row>
      {r && (
        <ResultCard items={[
          { label: "Estimated value", value: rs(r.value), sub: moneyInNepaliWords(Math.round(r.value)), emphasize: true },
          { label: "You invest", value: rs(r.invested) },
          { label: "Estimated gain", value: rs(r.gain) },
          { label: "Money multiplied", value: `${(r.value / r.invested).toFixed(2)}×` },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- Fixed deposit ---------- */
export function FdTool() {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("7");
  const [months, setMonths] = useState("12");
  const [freq, setFreq] = useState<"4" | "12" | "1">("4");
  const [tds, setTds] = useState("6");
  const r = useMemo(() => {
    const p = Number(amount), a = Number(rate) / 100, t = Number(months) / 12, n = Number(freq), tax = Number(tds) / 100;
    if (!(p > 0) || !(a >= 0) || !(t > 0) || !(tax >= 0) || tax > 1) return null;
    const gross = p * Math.pow(1 + a / n, n * t) - p;
    const taxAmt = gross * tax;
    return { gross, taxAmt, net: gross - taxAmt, maturity: p + gross - taxAmt };
  }, [amount, rate, months, freq, tds]);
  return (
    <ToolShell>
      <Row>
        <Field label="Deposit amount (Rs)"><Num value={amount} onChange={setAmount} min={0} /></Field>
        <Field label="Interest rate (% per year)" hint="Use the rate your bank offers you."><Num value={rate} onChange={setRate} min={0} step={0.01} /></Field>
        <Field label="Period (months)"><Num value={months} onChange={setMonths} min={1} /></Field>
        <Field label="Interest added">
          <select className="input" value={freq} onChange={(e) => setFreq(e.target.value as "4" | "12" | "1")}>
            <option value="4">Every 3 months (quarterly)</option>
            <option value="12">Every month</option>
            <option value="1">Once a year</option>
          </select>
        </Field>
        <Field label="Tax on interest, TDS (%)" hint="Banks deduct tax from interest. Check the current rate with your bank."><Num value={tds} onChange={setTds} min={0} max={100} step={0.5} /></Field>
      </Row>
      {r && (
        <ResultCard items={[
          { label: "Money at maturity", value: rs(r.maturity), sub: moneyInNepaliWords(Math.round(r.maturity)), emphasize: true },
          { label: "Interest earned (before tax)", value: rs(r.gross) },
          { label: "Tax deducted", value: rs(r.taxAmt) },
          { label: "Interest you keep", value: rs(r.net) },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- Simple interest ---------- */
export function SimpleInterestTool() {
  const [p, setP] = useState("50000");
  const [rate, setRate] = useState("12");
  const [time, setTime] = useState("2");
  const [unit, setUnit] = useState<"y" | "m" | "d">("y");
  const r = useMemo(() => {
    const P = Number(p), R = Number(rate);
    const T = unit === "y" ? Number(time) : unit === "m" ? Number(time) / 12 : Number(time) / 365;
    if (!(P > 0) || !(R >= 0) || !(T > 0)) return null;
    const I = (P * R * T) / 100;
    return { I, total: P + I, perMonth: I / (T * 12) };
  }, [p, rate, time, unit]);
  return (
    <ToolShell>
      <Row>
        <Field label="Principal (Rs)"><Num value={p} onChange={setP} min={0} /></Field>
        <Field label="Rate (% per year)"><Num value={rate} onChange={setRate} min={0} step={0.1} /></Field>
        <Field label="Time"><Num value={time} onChange={setTime} min={0} /></Field>
        <Field label="Time is in">
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value as "y" | "m" | "d")}>
            <option value="y">Years</option><option value="m">Months</option><option value="d">Days</option>
          </select>
        </Field>
      </Row>
      {r && (
        <ResultCard items={[
          { label: "Total to pay back", value: rs(r.total), emphasize: true },
          { label: "Interest (ब्याज)", value: rs(r.I) },
          { label: "Interest per month", value: rs(r.perMonth) },
          { label: "Formula", value: "I = P × R × T ÷ 100" },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- Discount ---------- */
export function DiscountTool() {
  const [price, setPrice] = useState("2500");
  const [off, setOff] = useState("20");
  const [extra, setExtra] = useState("0");
  const [vat, setVat] = useState(false);
  const r = useMemo(() => {
    const P = Number(price), d1 = Number(off) / 100, d2 = Number(extra) / 100;
    if (!(P > 0) || d1 < 0 || d1 > 1 || d2 < 0 || d2 > 1) return null;
    const after = P * (1 - d1) * (1 - d2);
    const final = vat ? after * 1.13 : after;
    return { after, final, saved: P - after, effective: (1 - after / P) * 100 };
  }, [price, off, extra, vat]);
  return (
    <ToolShell>
      <Row>
        <Field label="Original price (Rs)"><Num value={price} onChange={setPrice} min={0} /></Field>
        <Field label="Discount (%)"><Num value={off} onChange={setOff} min={0} max={100} /></Field>
        <Field label="Extra discount (%)" hint="For 'extra 10% off' offers on top of a sale."><Num value={extra} onChange={setExtra} min={0} max={100} /></Field>
        <label className="mt-7 flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Add 13% VAT after discount
        </label>
      </Row>
      {r && (
        <ResultCard items={[
          { label: "You pay", value: rs(r.final), emphasize: true },
          { label: "You save", value: rs(r.saved) },
          { label: "Price after discount", value: rs(r.after) },
          { label: "Real discount", value: `${r.effective.toFixed(1)}%` },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- Lakh / crore ↔ million / billion ---------- */
const UNITS = [
  { k: "unit", label: "Rupees (plain number)", v: 1 },
  { k: "thousand", label: "Thousand (हजार)", v: 1e3 },
  { k: "lakh", label: "Lakh (लाख)", v: 1e5 },
  { k: "million", label: "Million", v: 1e6 },
  { k: "crore", label: "Crore (करोड)", v: 1e7 },
  { k: "arab", label: "Arab (अर्ब)", v: 1e9 },
  { k: "billion", label: "Billion", v: 1e9 },
  { k: "kharab", label: "Kharab (खर्ब)", v: 1e11 },
  { k: "trillion", label: "Trillion", v: 1e12 },
];
function fmt(n: number) {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1e6 || Math.abs(n) < 0.01) return Number(n.toPrecision(8)).toLocaleString("en-US", { maximumFractionDigits: 6 });
  return Number(n.toFixed(4)).toLocaleString("en-US", { maximumFractionDigits: 4 });
}
export function LakhCroreTool() {
  const [val, setVal] = useState("5");
  const [from, setFrom] = useState("crore");
  const base = Number(val) * (UNITS.find((u) => u.k === from)?.v ?? 1);
  return (
    <ToolShell>
      <Row>
        <Field label="Amount"><Num value={val} onChange={setVal} min={0} step={0.01} /></Field>
        <Field label="Unit">
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {UNITS.map((u) => <option key={u.k} value={u.k}>{u.label}</option>)}
          </select>
        </Field>
      </Row>
      {Number.isFinite(base) && base >= 0 && (
        <>
          <ResultCard items={[
            { label: "In Nepali style", value: groupAsian(base), sub: base <= 999999999999 ? moneyInNepaliWords(Math.round(base)) : undefined, emphasize: true },
            { label: "In international style", value: Math.round(base).toLocaleString("en-US") },
          ]} />
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-200 dark:border-ink-800">
            <table className="w-full text-sm">
              <tbody>
                {UNITS.filter((u) => u.k !== "unit").map((u) => (
                  <tr key={u.k} className="border-b border-ink-100 last:border-0 dark:border-ink-800">
                    <td className="px-4 py-2.5 text-ink-500">{u.label}</td>
                    <td className="tnum px-4 py-2.5 text-right font-semibold">{fmt(base / u.v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Tola / lal / gram ---------- */
const TOLA_G = 11.6638;
const WEIGHTS = [
  { k: "tola", label: "Tola (तोला)", g: TOLA_G },
  { k: "lal", label: "Lal (लाल) — 100 lal = 1 tola", g: TOLA_G / 100 },
  { k: "gram", label: "Gram", g: 1 },
  { k: "kg", label: "Kilogram", g: 1000 },
  { k: "ozt", label: "Troy ounce (international gold)", g: 31.1034768 },
];
export function TolaTool({ rates }: { rates: RatesData }) {
  const [val, setVal] = useState("1");
  const [from, setFrom] = useState("tola");
  const grams = Number(val) * (WEIGHTS.find((w) => w.k === from)?.g ?? 1);
  const tola = grams / TOLA_G;
  const ok = Number.isFinite(grams) && grams >= 0;
  return (
    <ToolShell>
      <Row>
        <Field label="Weight"><Num value={val} onChange={setVal} min={0} step={0.01} /></Field>
        <Field label="Unit">
          <select className="input" value={from} onChange={(e) => setFrom(e.target.value)}>
            {WEIGHTS.map((w) => <option key={w.k} value={w.k}>{w.label}</option>)}
          </select>
        </Field>
      </Row>
      {ok && (
        <>
          <ResultCard items={[
            { label: "Grams", value: `${fmt(grams)} g`, emphasize: true },
            { label: "Tola + lal", value: `${Math.floor(tola)} tola ${fmt((tola - Math.floor(tola)) * 100)} lal` },
            { label: "Fine gold value", value: rs(tola * rates.gold.fineTola), sub: `at Rs ${groupAsian(rates.gold.fineTola)} per tola` },
            { label: "Silver value", value: rs(tola * rates.gold.silverTola), sub: `at Rs ${groupAsian(rates.gold.silverTola)} per tola` },
          ]} />
          <p className="mt-3 text-xs text-ink-400">
            Values use the FENEGOSIDA rate updated {new Date(rates.gold.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}. Shops add making charges.
          </p>
        </>
      )}
    </ToolShell>
  );
}

/* ---------- Word & character counter (Nepali aware) ---------- */
export function WordCountTool() {
  const [text, setText] = useState("नेपाल एक सुन्दर देश हो। Nepal is a beautiful country.");
  const s = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const chars = Array.from(text).length;
    // grapheme clusters, so "क्षे" counts as one visible letter
    let letters = chars;
    try {
      const Seg = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => { segment: (t: string) => Iterable<unknown> } }).Segmenter;
      if (Seg) letters = Array.from(new Seg("ne", { granularity: "grapheme" }).segment(text)).length;
    } catch {}
    const sentences = trimmed ? (trimmed.match(/[^।.!?]+[।.!?]+|[^।.!?]+$/g) || []).length : 0;
    const devanagari = (text.match(/[ऀ-ॿ]/g) || []).length;
    return { words, chars, letters, noSpace: text.replace(/\s/g, "").length, sentences, devanagari, read: Math.max(1, Math.round(words / 200)) };
  }, [text]);
  return (
    <ToolShell>
      <label className="label" htmlFor="wc">Type or paste your text</label>
      <textarea id="wc" className="input min-h-[180px] font-ne text-base leading-7" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="mt-2 flex justify-end gap-2">
        <button className="btn-ghost !py-2 !text-xs" onClick={() => setText("")}>Clear</button>
        <CopyButton text={text} />
      </div>
      <ResultCard items={[
        { label: "Words", value: String(s.words), emphasize: true },
        { label: "Characters", value: String(s.chars), sub: `${s.noSpace} without spaces` },
        { label: "Visible letters", value: String(s.letters), sub: "joined letters like क्ष count as one" },
        { label: "Sentences", value: String(s.sentences), sub: `About ${s.read} min to read` },
      ]} />
    </ToolShell>
  );
}

/* ---------- Bill splitter ---------- */
export function BillSplitTool() {
  const [total, setTotal] = useState("4800");
  const [people, setPeople] = useState("4");
  const [service, setService] = useState("10");
  const [vat, setVat] = useState(true);
  const [tip, setTip] = useState("0");
  const r = useMemo(() => {
    const T = Number(total), n = Math.floor(Number(people)), sc = Number(service) / 100, tp = Number(tip) / 100;
    if (!(T > 0) || !(n >= 1) || sc < 0 || tp < 0) return null;
    const withSc = T * (1 + sc);
    const withVat = vat ? withSc * 1.13 : withSc;
    const grand = withVat * (1 + tp);
    return { grand, each: grand / n, sc: T * sc, vat: withVat - withSc };
  }, [total, people, service, vat, tip]);
  return (
    <ToolShell>
      <Row>
        <Field label="Bill amount before charges (Rs)"><Num value={total} onChange={setTotal} min={0} /></Field>
        <Field label="Number of people"><Num value={people} onChange={setPeople} min={1} /></Field>
        <Field label="Service charge (%)" hint="Most Nepali restaurants add 10%."><Num value={service} onChange={setService} min={0} /></Field>
        <Field label="Tip (%)"><Num value={tip} onChange={setTip} min={0} /></Field>
      </Row>
      <label className="mt-3 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={vat} onChange={(e) => setVat(e.target.checked)} className="h-4 w-4 accent-brand-600" />
        Add 13% VAT (on bill + service charge)
      </label>
      {r && (
        <ResultCard items={[
          { label: "Each person pays", value: rs(Math.ceil(r.each)), emphasize: true },
          { label: "Grand total", value: rs(r.grand) },
          { label: "Service charge", value: rs(r.sc) },
          { label: "VAT", value: rs(r.vat) },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- Fuel / trip cost ---------- */
export function FuelCostTool() {
  const [km, setKm] = useState("200");
  const [mileage, setMileage] = useState("40");
  const [price, setPrice] = useState("");
  const [riders, setRiders] = useState("1");
  const [round, setRound] = useState(true);
  const r = useMemo(() => {
    const d = Number(km) * (round ? 2 : 1), m = Number(mileage), p = Number(price), n = Math.max(1, Math.floor(Number(riders)));
    if (!(d > 0) || !(m > 0)) return null;
    const litres = d / m;
    return { d, litres, cost: p > 0 ? litres * p : null, each: p > 0 ? (litres * p) / n : null };
  }, [km, mileage, price, riders, round]);
  return (
    <ToolShell>
      <Row>
        <Field label="Distance one way (km)"><Num value={km} onChange={setKm} min={0} /></Field>
        <Field label="Mileage (km per litre)" hint="Bike ~40–55, car ~12–18. Check your own vehicle."><Num value={mileage} onChange={setMileage} min={0} step={0.1} /></Field>
        <Field label="Petrol / diesel price (Rs per litre)" hint="Enter today's Nepal Oil Corporation price for your area."><Num value={price} onChange={setPrice} min={0} step={0.5} placeholder="e.g. today's NOC price" /></Field>
        <Field label="People sharing the cost"><Num value={riders} onChange={setRiders} min={1} /></Field>
      </Row>
      <label className="mt-3 flex items-center gap-2 text-sm font-medium">
        <input type="checkbox" checked={round} onChange={(e) => setRound(e.target.checked)} className="h-4 w-4 accent-brand-600" />
        Round trip (there and back)
      </label>
      {r && (
        <ResultCard items={[
          { label: "Fuel cost", value: r.cost !== null ? rs(r.cost) : "Enter fuel price", emphasize: true },
          { label: "Fuel needed", value: `${r.litres.toFixed(1)} litres` },
          { label: "Total distance", value: `${groupAsian(r.d)} km` },
          { label: "Cost per person", value: r.each !== null ? rs(r.each) : "—" },
        ]} />
      )}
    </ToolShell>
  );
}

/* ---------- NEB (Class 11/12) GPA with credit hours ---------- */
const NEB_GRADES = [
  { g: "A+", p: 4.0, range: "90–100" },
  { g: "A", p: 3.6, range: "80–89" },
  { g: "B+", p: 3.2, range: "70–79" },
  { g: "B", p: 2.8, range: "60–69" },
  { g: "C+", p: 2.4, range: "50–59" },
  { g: "C", p: 2.0, range: "40–49" },
  { g: "D", p: 1.6, range: "35–39" },
  { g: "NG", p: 0, range: "below 35" },
];
type Subj = { name: string; credit: string; grade: string };
export function NebGpaTool() {
  const [rows, setRows] = useState<Subj[]>([
    { name: "English", credit: "4", grade: "A" },
    { name: "Nepali", credit: "3", grade: "B+" },
    { name: "Social / Life skills", credit: "5", grade: "A" },
    { name: "Physics", credit: "5", grade: "B+" },
    { name: "Chemistry", credit: "5", grade: "A" },
    { name: "Mathematics", credit: "5", grade: "A+" },
  ]);
  const set = (i: number, k: keyof Subj, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const res = useMemo(() => {
    let cr = 0, pts = 0, ng = false;
    for (const r of rows) {
      const c = Number(r.credit), p = NEB_GRADES.find((g) => g.g === r.grade)?.p ?? 0;
      if (!(c > 0)) continue;
      if (r.grade === "NG") ng = true;
      cr += c; pts += c * p;
    }
    return cr ? { gpa: pts / cr, cr, ng } : null;
  }, [rows]);
  return (
    <ToolShell>
      <div className="space-y-2">
        <div className="hidden grid-cols-[1fr_90px_110px_40px] gap-2 text-xs font-semibold uppercase tracking-wide text-ink-500 sm:grid">
          <span>Subject</span><span>Credit hours</span><span>Grade</span><span />
        </div>
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_90px_36px] gap-2 sm:grid-cols-[1fr_90px_110px_40px]">
            <input className="input" aria-label={`Subject ${i + 1}`} value={r.name} onChange={(e) => set(i, "name", e.target.value)} />
            <input className="input" aria-label="Credit hours" inputMode="decimal" value={r.credit} onChange={(e) => set(i, "credit", e.target.value)} />
            <select className="input" aria-label="Grade" value={r.grade} onChange={(e) => set(i, "grade", e.target.value)}>
              {NEB_GRADES.map((g) => <option key={g.g} value={g.g}>{g.g}</option>)}
            </select>
            <button className="grid place-items-center rounded-xl text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" aria-label="Remove subject" onClick={() => setRows((x) => x.filter((_, j) => j !== i))}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button className="btn-ghost !py-2 !text-xs" onClick={() => setRows((x) => [...x, { name: "", credit: "4", grade: "A" }])}>
          <Plus className="h-3.5 w-3.5" /> Add subject
        </button>
      </div>
      {res && (
        <ResultCard items={[
          { label: "Your GPA", value: res.gpa.toFixed(2), emphasize: true, sub: res.ng ? "One subject is NG, so the final grade sheet will show NG for it." : undefined },
          { label: "Total credit hours", value: String(res.cr) },
        ]} />
      )}
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-semibold">Grade scale used</summary>
        <table className="mt-2 w-full text-left">
          <tbody>
            {NEB_GRADES.map((g) => (
              <tr key={g.g} className="border-b border-ink-100 dark:border-ink-800"><td className="py-1.5 font-semibold">{g.g}</td><td>{g.range}%</td><td className="text-right">{g.p.toFixed(1)}</td></tr>
            ))}
          </tbody>
        </table>
      </details>
    </ToolShell>
  );
}

/* ---------- All-currency converter (NRB) ---------- */
const POPULAR_FX = ["USD", "QAR", "AED", "SAR", "MYR", "KRW", "JPY", "AUD", "GBP", "EUR", "KWD", "INR", "CAD", "BHD", "OMR"];
export function CurrencyTool({ rates }: { rates: RatesData }) {
  const list = useMemo(() => {
    const all = rates.fx?.rates ?? [{ iso3: "USD", name: "U.S. Dollar", unit: 1, buy: rates.forex.fallbackUsdNpr, sell: rates.forex.fallbackUsdNpr }];
    const rank = (c: string) => { const i = POPULAR_FX.indexOf(c); return i < 0 ? 99 : i; };
    return [...all].sort((a, b) => rank(a.iso3) - rank(b.iso3) || a.iso3.localeCompare(b.iso3));
  }, [rates]);
  const [code, setCode] = useState("QAR");
  const [amount, setAmount] = useState("1000");
  const [dir, setDir] = useState<"in" | "out">("in");
  const cur = list.find((c) => c.iso3 === code) ?? list[0];
  const n = Number(amount);
  const perUnitBuy = cur.buy / cur.unit, perUnitSell = cur.sell / cur.unit;
  const result = Number.isFinite(n) && n >= 0 ? (dir === "in" ? n * perUnitBuy : n / perUnitSell) : null;
  return (
    <ToolShell>
      <div className="flex gap-2">
        <button className={toggle(dir === "in")} onClick={() => setDir("in")} aria-pressed={dir === "in"}>Foreign → रु NPR</button>
        <button className={toggle(dir === "out")} onClick={() => setDir("out")} aria-pressed={dir === "out"}>रु NPR → Foreign</button>
      </div>
      <div className="mt-3"><Row>
        <Field label={dir === "in" ? `Amount in ${cur.iso3}` : "Amount in Nepali rupees"}><Num value={amount} onChange={setAmount} min={0} /></Field>
        <Field label="Currency">
          <select className="input" value={cur.iso3} onChange={(e) => setCode(e.target.value)}>
            {list.map((c) => <option key={c.iso3} value={c.iso3}>{c.iso3} — {c.name}</option>)}
          </select>
        </Field>
      </Row></div>
      {result !== null && (
        <ResultCard items={[
          { label: dir === "in" ? "You get about" : `You get about (${cur.iso3})`, value: dir === "in" ? rs(result) : `${result.toLocaleString("en-US", { maximumFractionDigits: 2 })} ${cur.iso3}`, sub: dir === "in" ? moneyInNepaliWords(Math.round(result)) : undefined, emphasize: true },
          { label: `NRB rate for ${cur.unit} ${cur.iso3}`, value: `Buy ${cur.buy.toFixed(2)} · Sell ${cur.sell.toFixed(2)}` },
        ]} />
      )}
      <p className="mt-3 text-xs text-ink-400">
        {rates.fx ? `Nepal Rastra Bank rates for ${rates.fx.date}, updated automatically every hour.` : "Showing the reference US dollar rate only; the full NRB table is loading on our side."} Foreign → NPR uses the NRB buying rate; NPR → foreign uses the selling rate. Banks and remittance companies add their own margin and fees.
      </p>
      {rates.fx && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-semibold">See all {list.length} NRB rates</summary>
          <div className="mt-2 overflow-x-auto rounded-2xl border border-ink-200 dark:border-ink-800">
            <table className="w-full min-w-[420px] text-sm">
              <thead><tr className="bg-ink-50 text-left text-xs uppercase tracking-wide text-ink-500 dark:bg-ink-800/40"><th className="px-4 py-2">Currency</th><th className="px-4 py-2 text-right">Unit</th><th className="px-4 py-2 text-right">Buy (रु)</th><th className="px-4 py-2 text-right">Sell (रु)</th></tr></thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.iso3} className="border-t border-ink-100 dark:border-ink-800">
                    <td className="px-4 py-2"><b>{c.iso3}</b> <span className="text-ink-500">{c.name}</span></td>
                    <td className="tnum px-4 py-2 text-right">{c.unit}</td>
                    <td className="tnum px-4 py-2 text-right">{c.buy.toFixed(2)}</td>
                    <td className="tnum px-4 py-2 text-right">{c.sell.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </ToolShell>
  );
}
