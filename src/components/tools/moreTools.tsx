"use client";

import { useEffect, useMemo, useState } from "react";
import { preetiToUnicode } from "@/lib/preeti";
import { transliterate } from "@/lib/translit";
import { ToolShell, CopyButton } from "@/components/tools/ui";

/* ---------- Preeti → Unicode ---------- */
export function PreetiTool() {
  const [input, setInput] = useState("g]kfn ;fan] dfG5' .");
  const output = preetiToUnicode(input);
  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500" htmlFor="preeti-in">
            Preeti font text (paste old letters/notices)
          </label>
          <textarea
            id="preeti-in"
            className="input h-60 resize-y font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="gd;\sf/ x]f"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500" htmlFor="preeti-out">
            Unicode Devanagari (live)
          </label>
          <textarea
            id="preeti-out"
            className="input h-60 resize-y font-ne text-base"
            value={output}
            readOnly
            aria-live="polite"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={output} label="Copy Unicode" />
        <button
          type="button"
          className="btn-ghost !py-2 !text-xs"
          onClick={() => setInput("gd;\x5Csf/ x]f g]kfnL clwsf/")}
        >
          Load sample
        </button>
        <button type="button" className="btn-ghost !py-2 !text-xs" onClick={() => { setInput(""); }}>
          Clear
        </button>
      </div>
      <p className="mt-2 text-xs text-ink-400">
        Runs entirely in your browser — nothing is uploaded. Conjuncts (क्ष त्र ज्ञ) and matra order are corrected automatically.
      </p>
    </ToolShell>
  );
}

/* ---------- Nepali typing (romanized) ---------- */
export function TypingTool() {
  const [input, setInput] = useState("namaste, nepaal maa tapaaiko swagat chha");
  const output = transliterate(input);
  return (
    <ToolShell>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-500" htmlFor="np-typing">
        Type in Roman/English letters
      </label>
      <textarea
        id="np-typing"
        className="input h-32 resize-y text-base"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="namaste"
      />
      <div className="mt-3 rounded-xl border border-brand-200 bg-brand-50/60 p-4 dark:border-brand-800 dark:bg-brand-900/20">
        <p className="text-2xl font-semibold leading-relaxed font-ne text-ink-900 dark:text-ink-50" aria-live="polite" lang="ne">
          {output || "नतिजा यहाँ देखिन्छ…"}
        </p>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <CopyButton text={output} label="Copy Nepali text" />
        <button type="button" className="btn-ghost !py-2 !text-xs" onClick={() => setInput("tapaaiko aamaa baabuko swaad mitho chha")}>
          Load sample
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-ink-500 dark:text-ink-400">
        Rules: <strong>aa</strong> → ा/आ, <strong>i</strong> → ि, <strong>ee/ii</strong> → ी, <strong>u</strong> → ु, <strong>oo/uu</strong> → ू, <strong>e</strong> → े, <strong>o</strong> → ो.
        Single <strong>a</strong> mid-word is silent (namaste → नमस्ते). Back-to-back consonants join with halant (sa+t → स्त). Capital T/D/N → ट/ड/ण.
      </p>
    </ToolShell>
  );
}

/* ---------- Percentage ---------- */
export function PercentageTool() {
  const [mode, setMode] = useState<"of" | "isWhat" | "change">("of");
  const [a, setA] = useState("15");
  const [b, setB] = useState("250000");
  const out = (() => {
    const x = Number(a), y = Number(b);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    if (mode === "of") return { value: (x / 100) * y, formula: `${x}% × ${y} = ${(x / 100) * y}` };
    if (mode === "isWhat") return y === 0 ? null : { value: (x / y) * 100, formula: `(${x} ÷ ${y}) × 100` };
    return x > 0 && Number.isFinite(y) ? { value: ((y - x) / x) * 100, formula: `(( ${y} − ${x}) ÷ ${x}) × 100` } : null;
  })();
  return (
    <ToolShell>
      <div className="flex gap-2">
        {[["of", "X% of Y"], ["isWhat", "X is what % of Y"], ["change", "% change"]].map(([k, label]) => (
          <button key={k} onClick={() => setMode(k as typeof mode)}
            className={`btn !px-4 !py-2 text-xs ${mode === k ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}
            aria-pressed={mode === k}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">{mode === "of" ? "X (%)" : mode === "isWhat" ? "X (part)" : "From (old value)"}</span>
          <input className="input" inputMode="decimal" value={a} onChange={(e) => setA(e.target.value)} />
        </label>
        <label className="block">
          <span className="label">{mode === "of" ? "Y (number)" : mode === "isWhat" ? "Y (whole)" : "To (new value)"}</span>
          <input className="input" inputMode="decimal" value={b} onChange={(e) => setB(e.target.value)} />
        </label>
      </div>
      {out !== null && (
        <div className="mt-4 rounded-xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/30">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/70 dark:text-brand-300/70">Result</div>
          <div className="mt-1 text-2xl font-bold text-brand-700 dark:text-brand-200">
            {Number.isFinite(out.value) ? out.value.toFixed(4).replace(/\.?0+$/, "") || "0" : "—"}
            <span className="ml-1 text-sm">{mode === "of" ? "" : "%"}</span>
          </div>
          <p className="mt-1 text-xs text-ink-500">Formula: {out.formula}</p>
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- Unit converter ---------- */
const UNITS: Record<string, Array<{ name: string; factor: number }>> = {
  length: [
    { name: "kilometre", factor: 1000 }, { name: "metre", factor: 1 }, { name: "centimetre", factor: 0.01 },
    { name: "mile", factor: 1609.344 }, { name: "foot", factor: 0.3048 }, { name: "inch", factor: 0.0254 },
  ],
  weight: [
    { name: "kilogram", factor: 1 }, { name: "gram", factor: 0.001 }, { name: "quintal", factor: 100 },
    { name: "pound", factor: 0.45359237 }, { name: "ounce", factor: 0.028349523 },
  ],
  volume: [
    { name: "litre", factor: 1 }, { name: "millilitre", factor: 0.001 },
    { name: "gallon (US)", factor: 3.785411784 }, { name: "cup (metric)", factor: 0.25 },
  ],
  area: [
    { name: "square metre", factor: 1 }, { name: "square foot", factor: 0.09290304 },
    { name: "hectare", factor: 10000 }, { name: "bigha (NP)", factor: 6772.63 }, { name: "ropani (NP)", factor: 508.737047 },
  ],
  data: [
    { name: "megabyte", factor: 1 }, { name: "gigabyte", factor: 1024 }, { name: "kilobyte", factor: 1 / 1024 },
  ],
};

export function UnitTool() {
  const [cat, setCat] = useState<keyof typeof UNITS>("length");
  const [from, setFrom] = useState("kilometre");
  const [to, setTo] = useState("mile");
  const [val, setVal] = useState("5");
  const list = UNITS[cat];
  const pick = (which: "from" | "to", name: string) => {
    if (which === "from") setFrom(name); else setTo(name);
  };
  const out = (() => {
    const f = list.find((u) => u.name === from), t = list.find((u) => u.name === to);
    const v = Number(val);
    if (!f || !t || !Number.isFinite(v)) return null;
    return (v * f.factor) / t.factor;
  })();
  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="block">
          <span className="label">Category</span>
          <select
            className="input"
            value={cat}
            onChange={(e) => {
              const c = e.target.value as keyof typeof UNITS;
              setCat(c);
              setFrom(UNITS[c][0].name);
              setTo(UNITS[c][1].name);
            }}
          >
            {Object.keys(UNITS).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">From</span>
          <select className="input" value={from} onChange={(e) => pick("from", e.target.value)}>
            {list.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">To</span>
          <select className="input" value={to} onChange={(e) => pick("to", e.target.value)}>
            {list.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">Value</span>
          <input className="input" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
      </div>
      {out !== null && (
        <div className="mt-4 rounded-xl border border-brand-300 bg-brand-50 p-4 text-lg font-bold text-brand-700 dark:border-brand-800 dark:bg-brand-900/30 dark:text-brand-200">
          {Number(val || 0)} {from} = {out.toPrecision(8).replace(/(\.\d*?)0+($|e)/, "$1$2").replace(/\.$/, "")} {to}
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- BMI ---------- */
export function BmiTool() {
  const [metric, setMetric] = useState(true);
  const [kg, setKg] = useState("65");
  const [cm, setCm] = useState("170");
  const [lb, setLb] = useState("145");
  const [ft, setFt] = useState("5");
  const [inch, setInch] = useState("7");

  const bmi = (() => {
    if (metric) {
      const w = Number(kg), h = Number(cm) / 100;
      if (!w || !h || h <= 0) return null;
      return w / (h * h);
    }
    const w = Number(lb) * 0.45359237;
    const h = (Number(ft) * 12 + Number(inch)) * 0.0254;
    if (!w || !h || h <= 0) return null;
    return w / (h * h);
  })();

  const cat = (v: number) => v < 18.5 ? "Underweight" : v < 25 ? "Normal weight" : v < 30 ? "Overweight" : "Obese";
  const colorClass = (v: number) =>
    v < 18.5 ? "text-sky-600 dark:text-sky-400" : v < 25 ? "text-green-600 dark:text-green-400" : v < 30 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400";

  const healthy = bmi ? [18.5 * Math.pow(Number(metric ? Number(cm) : 0) / 100, 2), 24.9 * Math.pow(Number(metric ? Number(cm) : 0) / 100, 2)] : null;
  void healthy;

  return (
    <ToolShell>
      <div className="flex gap-2">
        <button onClick={() => setMetric(true)} className={`btn !px-4 !py-2 text-xs ${metric ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}>Metric (kg/cm)</button>
        <button onClick={() => setMetric(false)} className={`btn !px-4 !py-2 text-xs ${!metric ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:border-ink-700 dark:text-ink-300"}`}>Imperial (ft/lb)</button>
      </div>
      {metric ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="label">Weight (kg)</span><input className="input" inputMode="decimal" value={kg} onChange={(e) => setKg(e.target.value)} /></label>
          <label className="block"><span className="label">Height (cm)</span><input className="input" inputMode="decimal" value={cm} onChange={(e) => setCm(e.target.value)} /></label>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="block"><span className="label">Weight (lb)</span><input className="input" inputMode="decimal" value={lb} onChange={(e) => setLb(e.target.value)} /></label>
          <label className="block"><span className="label">Height (ft)</span><input className="input" inputMode="decimal" value={ft} onChange={(e) => setFt(e.target.value)} /></label>
          <label className="block"><span className="label">Height (in)</span><input className="input" inputMode="decimal" value={inch} onChange={(e) => setInch(e.target.value)} /></label>
        </div>
      )}
      {bmi !== null && (
        <div className="mt-4 rounded-xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-800 dark:bg-brand-900/30">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-brand-700/70 dark:text-brand-300/70">Your BMI</div>
          <div className="mt-1 text-3xl font-bold text-brand-700 dark:text-brand-200">{bmi.toFixed(1)}</div>
          <div className={`mt-1 font-semibold ${colorClass(bmi)}`}>{cat(bmi)} (WHO scale)</div>
        </div>
      )}
      <p className="mt-3 text-xs text-ink-400">BMI is a screening number, not medical advice.</p>
    </ToolShell>
  );
}

/* ---------- Land area ---------- */
const LAND: Array<{ name: string; sqft: number }> = [
  { name: "sq ft", sqft: 1 },
  { name: "dhur", sqft: 182.25 },
  { name: "aana", sqft: 342.25 },
  { name: "kattha", sqft: 3645 },
  { name: "paisa", sqft: 85.5625 },
  { name: "dam", sqft: 21.390625 },
  { name: "ropani", sqft: 5476 },
  { name: "bigha", sqft: 72900 },
  { name: "sq metre", sqft: 10.7639 },
  { name: "hectare", sqft: 107639.104 },
];

export function LandTool() {
  const [unit, setUnit] = useState("ropani");
  const [val, setVal] = useState("1");
  const v = Number(val);
  const base = LAND.find((u) => u.name === unit)?.sqft ?? 0;
  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="label">Unit</span>
          <select className="input" value={unit} onChange={(e) => setUnit(e.target.value)}>
            {LAND.map((u) => <option key={u.name} value={u.name}>{u.name}</option>)}
          </select>
        </label>
        <label className="block">
          <span className="label">Value</span>
          <input className="input" inputMode="decimal" value={val} onChange={(e) => setVal(e.target.value)} />
        </label>
      </div>
      {Number.isFinite(v) && v > 0 && (
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {LAND.filter((u) => u.name !== unit).map((u) => (
            <div key={u.name} className="rounded-xl border border-ink-200 bg-ink-50/70 p-3 dark:border-ink-800 dark:bg-ink-800/40">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{u.name}</div>
              <div className="mt-0.5 truncate text-base font-bold text-ink-900 dark:text-ink-100" title={String((v * base) / u.sqft)}>
                {((v * base) / u.sqft).toLocaleString("en-IN", { maximumFractionDigits: 4 })}
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-ink-400">
        Hill units: 1 ropani = 16 aana = 64 paisa = 256 dam. Tarai units: 1 bigha = 20 kattha = 400 dhur. Standard government values used.
      </p>
    </ToolShell>
  );
}

/* ---------- Nepal time ---------- */
import NepaliDate from "nepali-date-converter";
import { BS_MONTHS_NP, WEEKDAYS_FULL_NP, toNpDigits } from "@/lib/nepali";

export function NepalTimeTool() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kathmandu", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
      }).format(now)
    : "…";
  const adStr = now
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Kathmandu", weekday: "long", day: "numeric", month: "long", year: "numeric",
      }).format(now)
    : "…";

  // BS date: build the NPT wall-clock date string and parse it
  const bsInfo = useMemo(() => {
    if (!now) return null;
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kathmandu", year: "numeric", month: "2-digit", day: "2-digit",
    }).formatToParts(now);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const Y = get("year"), M = get("month"), D = get("day");
    const wall = new Date(Date.UTC(Y, M - 1, D, 12));
    const weekday = wall.getUTCDay();
    try {
      const nd = NepaliDate.fromAD(new Date(Date.UTC(Y, M - 1, D, 6)));
      return {
        bsNp: `${toNpDigits(nd.getYear())} ${BS_MONTHS_NP[nd.getMonth()]} ${toNpDigits(nd.getDate())}`,
        weekdayNp: WEEKDAYS_FULL_NP[weekday],
      };
    } catch {
      return null;
    }
  }, [now?.getSeconds()]);

  return (
    <ToolShell>
      <div className="text-center">
        <div className="text-5xl font-bold tabular-nums text-ink-900 dark:text-ink-50 sm:text-6xl">
          {timeStr.slice(0, 8)}
          <span className="ml-2 text-lg font-semibold text-brand-600 dark:text-brand-300">NPT</span>
        </div>
        <p className="mt-2 text-lg text-ink-600 dark:text-ink-300">{adStr}</p>
        {bsInfo && (
          <p className="mt-1 text-xl font-semibold font-ne text-brand-700 dark:text-brand-300 lang-np" lang="ne">
            {bsInfo.weekdayNp}बार, {bsInfo.bsNp} गते
          </p>
        )}
        <p className="mt-3 text-xs text-ink-400">
          Nepal Standard Time = UTC+05:45 (Gaurishankar meridian, no daylight saving).
        </p>
      </div>
    </ToolShell>
  );
}
