"use client";

import NepaliDate from "nepali-date-converter";
import { useMemo, useState } from "react";
import {
  AD_MONTHS,
  BS_MONTHS,
  BS_MONTHS_NP,
  WEEKDAYS_EN,
  WEEKDAYS_FULL_NP,
  toNpDigits,
} from "@/lib/nepali";
import { ToolShell, ResultCard } from "@/components/tools/ui";

const YEARS = Array.from({ length: 91 }, (_, i) => 2000 + i);

/** weekday index of BS (y, m0-based, d=1) */
function firstWeekdayDay(y: number, m0: number): number {
  const nd = new NepaliDate(y, m0, 1);
  return nd.toJsDate().getUTCDay();
}
function daysInBsMonth(y: number, m0: number): number {
  const start = new NepaliDate(y, m0, 1);
  const next = m0 === 11 ? new NepaliDate(y + 1, 0, 1) : new NepaliDate(y, m0 + 1, 1);
  return Math.round((next.toJsDate().getTime() - start.toJsDate().getTime()) / 86400000);
}

export function CalendarTool() {
  const today = useMemo(() => {
    try {
      const nd = new NepaliDate(new Date());
      return { y: nd.getYear(), m: nd.getMonth(), d: nd.getDate() };
    } catch { return null; }
  }, []);
  const [y, setY] = useState(today?.y ?? 2083);
  const [m, setM] = useState(today?.m ?? 6);

  const nDays = daysInBsMonth(y, m);
  const first = firstWeekdayDay(y, m);
  const cells: Array<{ bsDay: number; adDate: string | null } | null> = [];
  for (let i = 0; i < first; i++) cells.push(null);
  const base = new NepaliDate(y, m, 1).toJsDate().getTime();
  for (let d = 1; d <= nDays; d++) {
    const ad = new Date(base + (d - 1) * 86400000);
    cells.push({
      bsDay: d,
      adDate: `${ad.getUTCDate()} ${AD_MONTHS[ad.getUTCMonth()].slice(0, 3)}`,
    });
  }

  return (
    <ToolShell>
      <div className="flex flex-wrap items-end justify gap-3">
        <label className="navbar-label">
          <span className="label">वर्ष (year)</span>
          <select className="input" value={y} onChange={(e) => setY(Number(e.target.value))}>
            {YEARS.map((v) => (
              <option key={v} value={v}>BS {v} ({toNpDigits(v)})</option>
            ))}
          </select>
        </label>
        <label>
          <span className="label">महिना (month)</span>
          <select className="input" value={m} onChange={(e) => setM(Number(e.target.value))}>
            {BS_MONTHS.map((v, i) => (
              <option key={v} value={i}>{i + 1}. {v} — {BS_MONTHS_NP[i]}</option>
            ))}
          </select>
        </label>
        <div className="ml-auto text-sm text-ink-500 dark:text-ink-300">
          {BS_MONTHS_NP[m]} {toNpDigits(y)}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <div className="min-w-[520px]">
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-ink-400">
            {WEEKDAYS_EN.map((w) => <div key={w} className="py-1">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((c, idx) => {
              const dayIdx = idx % 7;
              const sat = dayIdx === 6;
              if (!c) return <div key={idx} className="h-16 rounded-lg" />;
              const isToday = !!today && today.y === y && today.m === m && today.d === c.bsDay;
              return (
                <div
                  key={idx}
                  className={`h-16 rounded-lg border p-1.5 ${isToday
                    ? "border-brand-500 bg-brand-50 dark:bg-brand-900/40"
                    : sat ? "border-ink-100 bg-red-50/40 dark:border-ink-800 dark:bg-ink-850 dark:bg-red-950/10"
                    : "border-ink-200/70 dark:border-ink-800"}`}
                >
                  <div className={`text-sm font-bold leading-5 ${sat ? "text-brand-700 dark:text-brand-300" : "text-ink-700 dark:text-ink-200"}`}>
                    {toNpDigits(c.bsDay)}
                  </div>
                  <div className="text-[10px] leading-4 text-ink-400">{c.adDate}</div>
                  {isToday && <div className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-600">Today</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <p className="mt-3 text-xs text-ink-400">
        Grid shows BS day (Devanagari) with the matching AD date. {BS_MONTHS[m]} {y} has {nDays} days.
      </p>
    </ToolShell>
  );
}

/* ---------- Age calculator ---------- */
export function AgeTool() {
  const [cal, setCal] = useState<"BS" | "AD">("BS");
  const [y, setY] = useState(2052);
  const [mo, setMo] = useState(3);
  const [d, setD] = useState(15);
  const [adDate, setAdDate] = useState("1995-07-31");

  const dob = useMemo<BisDate | null>(() => {
    if (cal === "BS") {
      try {
        const nd = new NepaliDate(y, mo, d);
        if (nd.getYear() !== y || nd.getMonth() !== mo || nd.getDate() !== d) return null;
        return { ad: normalize(nd.toJsDate()) };
      } catch { return null; }
    }
    const parts = adDate.split("-").map(Number);
    if (!parts[0] || !parts[1] || !parts[2]) return null;
    return { ad: new Date(Date.UTC(parts[0], parts[1] - 1, parts[2])) };
  }, [cal, y, mo, d, adDate]);

  const diff = useMemo(() => {
    if (!dob) return null;
    const now = new Date();
    const start = normalize(dob.ad);
    const end = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    let totalDays = Math.round((end.getTime() - start.getTime()) / 86400000);
    if (totalDays < 0) return null;
    // completed years/months/days using calendar months
    let years = end.getUTCFullYear() - start.getUTCFullYear();
    let months = end.getUTCMonth() - start.getUTCMonth();
    let days = end.getUTCDate() - start.getUTCDate();
    if (days < 0) {
      months -= 1;
      const prevMonthDays = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0)).getUTCDate();
      days += prevMonthDays;
    }
    if (months < 0) { months += 12; years -= 1; }
    // next birthday (AD) by month/day matching start
    let next = new Date(Date.UTC(end.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
    if (next.getTime() < end.getTime()) next = new Date(Date.UTC(end.getUTCFullYear() + 1, start.getUTCMonth(), start.getUTCDate()));
    return {
      years, months, days, totalDays,
      weeks: Math.floor(totalDays / 7),
      nextBirthday: normalize(next),
      bsAgeAssume: years,
    };
  }, [dob]);

  const YEARS = Array.from({ length: 121 }, (_, i) => 1970 + i);

  return (
    <ToolShell>
      <div className="flex gap-2">
        {(["BS", "AD"] as const).map((c) => (
          <button key={c} onClick={() => setCal(c)}
            className={`btn !px-4 !py-2 text-xs ${cal === c ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-600 dark:text-ink-300 dark:border-ink-700"}`}
            aria-pressed={cal === c}
          >
            {c === "BS" ? "बि.सं. (Nepali)" : "AD (English)"}
          </button>
        ))}
      </div>
      {cal === "BS" ? (
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label>
            <span className="label">जन्म वर्ष</span>
            <select className="input" value={y} onChange={(e) => { setY(Number(e.target.value)); setD(1); }}>
              {YEARS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
          <label>
            <span className="label">महिना</span>
            <select className="input" value={mo} onChange={(e) => { setMo(Number(e.target.value)); setD(1); }}>
              {BS_MONTHS.map((v, i) => <option key={v} value={i}>{v} — {BS_MONTHS_NP[i]}</option>)}
            </select>
          </label>
          <label>
            <span className="label">गते</span>
            <select className="input" value={d} onChange={(e) => setD(Number(e.target.value))}>
              {Array.from({ length: 32 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </label>
        </div>
      ) : (
        <div className="mt-3 max-w-xs">
          <label>
            <span className="label">Date of birth (AD)</span>
            <input type="date" className="input" min="1920-01-01" value={adDate} onChange={(e) => setAdDate(e.target.value)} />
          </label>
        </div>
      )}
      {diff ? (
        <ResultCard items={[
          { label: "Your age", value: `${diff.years} years ${diff.months} months ${diff.days} days`, emphasize: true },
          { label: "Total days lived", value: toNpDigits(diff.totalDays), sub: `${diff.weeks} weeks` },
          { label: "Next birthday (AD)", value: diff.nextBirthday.toISOString().slice(0, 10) },
          { label: "Next birthday in", value: `${Math.max(0, Math.round((normalize(diff.nextBirthday).getTime() - Date.now()) / 86400000))} days` },
        ]} />
      ) : cal === "AD" ? (
        <p className="mt-4 text-sm text-red-600">Enter a valid past date of birth.</p>
      ) : null}
    </ToolShell>
  );
}

function normalize(x: Date): Date {
  return new Date(Date.UTC(x.getFullYear(), x.getMonth(), x.getDate()));
}
interface BisDate { ad: Date }

/* ---------- Date difference ---------- */
export function DateDiffTool() {
  const [aCal, setACal] = useState<"AD" | "BS">("BS");
  const [bCal, setBCal] = useState<"AD" | "BS">("AD");
  const [bBS, setBBS] = useState({ y: 2077, m: 0, d: 1 });
  const [aBS, setABS] = useState({ y: 2083, m: 6, d: 21 });
  const [aAD, setAAD] = useState("2026-11-08");
  const [bAD, setBAD] = useState("2026-10-01");
  const YEARS = Array.from({ length: 121 }, (_, i) => 1970 + i);

  const a = useMemo<BisDate | null>(() => {
    if (aCal === "BS") {
      try {
        const nd = new NepaliDate(aBS.y, aBS.m, aBS.d);
        if (nd.getYear() !== aBS.y || nd.getMonth() !== aBS.m || nd.getDate() !== aBS.d) return null;
        return { ad: normalize(nd.toJsDate()) };
      } catch { return null; }
    }
    const [Y, M, D] = aAD.split("-").map(Number);
    if (!Y || !M || !D) return null;
    return { ad: new Date(Date.UTC(Y, M - 1, D)) };
  }, [aCal, aBS, aAD]);

  const b = useMemo<BisDate | null>(() => {
    if (bCal === "BS") {
      try {
        const nd = new NepaliDate(bBS.y, bBS.m, bBS.d);
        if (nd.getYear() !== bBS.y || nd.getMonth() !== bBS.m || nd.getDate() !== bBS.d) return null;
        return { ad: normalize(nd.toJsDate()) };
      } catch { return null; }
    }
    const [Y, M, D] = bAD.split("-").map(Number);
    if (!Y || !M || !D) return null;
    return { ad: new Date(Date.UTC(Y, M - 1, D)) };
  }, [bCal, bBS, bAD]);

  const out = useMemo(() => {
    if (!a || !b) return null;
    const x = normalize(a.ad), y2 = normalize(b.ad);
    if (x.getTime() === y2.getTime()) return { sign: 0, days: 0 };
    const later = x.getTime() > y2.getTime() ? x : y2;
    const earlier = x.getTime() > y2.getTime() ? y2 : x;
    const sign = x.getTime() > y2.getTime() ? 1 : -1;
    const days = Math.round((later.getTime() - earlier.getTime()) / 86400000);
    return { sign, days, later, earlier };
  }, [a, b]);

  return (
    <ToolShell>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-ink-200 p-3 dark:border-ink-800">
          <div className="mb-2 flex gap-1">
            {(["BS", "AD"] as const).map((c) => (
              <button key={c} onClick={() => setACal(c)} className={`btn !px-3 !py-1.5 !text-xs ${aCal === c ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-500 dark:border-ink-700"}`}>
                First: {c}
              </button>
            ))}
          </div>
          {aCal === "BS" ? (
            <div className="grid grid-cols-3 gap-2">
              <select className="input" aria-label="First BS year" value={aBS.y} onChange={(e) => setABS({ ...aBS, y: Number(e.target.value), d: 1 })}>
                {YEARS.filter((v) => v >= 2000 && v <= 2090).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select className="input" aria-label="First BS month" value={aBS.m} onChange={(e) => setABS({ ...aBS, m: Number(e.target.value), d: 1 })}>
                {BS_MONTHS.map((v, i) => <option key={v} value={i}>{BS_MONTHS_NP[i]}</option>)}
              </select>
              <select className="input" aria-label="First BS day" value={aBS.d} onChange={(e) => setABS({ ...aBS, d: Number(e.target.value) })}>
                {Array.from({ length: 32 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ) : (
            <input type="date" className="input" value={aAD} onChange={(e) => setAAD(e.target.value)} aria-label="First AD date" />
          )}
        </div>
        <div className="rounded-xl border border-ink-200 p-3 dark:border-ink-800">
          <div className="mb-2 flex gap-1">
            {(["AD", "BS"] as const).map((c) => (
              <button key={c} onClick={() => setBCal(c)} className={`btn !px-3 !py-1.5 !text-xs ${bCal === c ? "bg-brand-600 text-white" : "border border-ink-300 text-ink-500 dark:border-ink-700"}`}>
                Second: {c}
              </button>
            ))}
          </div>
          {bCal === "BS" ? (
            <div className="grid grid-cols-3 gap-2">
              <select className="input" aria-label="Second BS year" value={bBS.y} onChange={(e) => setBBS({ ...bBS, y: Number(e.target.value), d: 1 })}>
                {Array.from({ length: 91 }, (_, i) => 2000 + i).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
              <select className="input" aria-label="Second BS month" value={bBS.m} onChange={(e) => setBBS({ ...bBS, m: Number(e.target.value), d: 1 })}>
                {BS_MONTHS.map((v, i) => <option key={v} value={i}>{BS_MONTHS_NP[i]}</option>)}
              </select>
              <select className="input" aria-label="Second BS day" value={bBS.d} onChange={(e) => setBBS({ ...bBS, d: Number(e.target.value) })}>
                {Array.from({ length: 32 }, (_, i) => i + 1).map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          ) : (
            <input type="date" className="input" value={bAD} onChange={(e) => setBAD(e.target.value)} aria-label="Second AD date" />
          )}
        </div>
      </div>
      {out ? (
        <ResultCard items={[
          { label: out.sign === 0 ? "Same day" : "Difference", value: `${out.sign * out.days > 0 ? "+" : out.sign < 0 ? "-" : ""}${toNpDigits(out.days)} days`, emphasize: true, sub: `from ${out ? out.earlier?.toISOString().slice(0, 10) : ""} to ${out ? out.later?.toISOString().slice(0, 10) : ""}` },
          { label: "Equivalent", value: `${toNpDigits(Math.floor(out.days / 365.25))} yr ${toNpDigits(Math.round((out.days % 365.25) / 30.44))} mo`, sub: "approx months model" },
        ]} />
      ) : aCal === "BS" ? null : (
        <p className="mt-4 text-sm text-red-600">Enter both dates.</p>
      )}
    </ToolShell>
  );
}
