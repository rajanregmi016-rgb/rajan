"use client";

import NepaliDate from "nepali-date-converter";
import { useMemo, useState } from "react";
import { Copy, RefreshCcw } from "lucide-react";
import {
  AD_MONTHS, BS_MONTHS, BS_MONTHS_NP, WEEKDAYS_EN, WEEKDAYS_FULL_NP,
  formatNpNumber, toNpDigits,
} from "@/lib/nepali";
import { Field, Num, ResultCard, ToolShell } from "@/components/tools/ui";
import { CopyButton } from "@/components/tools/ui";

const YEARS = (() => {
  const out: number[] = [];
  for (let y = 2000; y <= 2090; y++) out.push(y);
  return out;
})();

function bsDaysInMonth(year: number, monthIdx: number): number {
  // monthIdx 0-based; use anchor arithmetic from api
  const start = new NepaliDate(year, monthIdx, 1);
  const nextMonth = monthIdx === 11 ? new NepaliDate(year + 1, 0, 1) : new NepaliDate(year, monthIdx + 1, 1);
  const day = Math.round((nextMonth.toJsDate().getTime() - start.toJsDate().getTime()) / 86400000);
  return day;
}

function dateOptionsBs(year: number, monthIdx: number) {
  const n = bsDaysInMonth(year, monthIdx);
  return Array.from({ length: n }, (_, i) => i + 1);
}

/* ---------- BS → AD ---------- */
export function Bs2AdTool() {
  const todayBs = (() => {
    try {
      const nd = new NepaliDate(new Date());
      return { y: nd.getYear(), m: nd.getMonth(), d: nd.getDate() };
    } catch {
      return { y: 2083, m: 6, d: 21 };
    }
  })();
  const [y, setY] = useState(todayBs.y);
  const [m, setM] = useState(todayBs.m);
  const [d, setD] = useState(todayBs.d);
  const days = dateOptionsBs(y, m);
  const result = useMemo(() => {
    try {
      const nd = new NepaliDate(y, m, d);
      if (nd.getYear() !== y || nd.getMonth() !== m || nd.getDate() !== d) return null;
      const ad = nd.toJsDate();
      const wk = WEEKDAYS_FULL_NP[ad.getDay()];
      return {
        ad: `${ad.getFullYear()}-${String(ad.getMonth() + 1).padStart(2, "0")}-${String(ad.getDate()).padStart(2, "0")}`,
        adLong: `${WEEKDAYS_EN[ad.getDay()]}, ${AD_MONTHS[ad.getMonth()]} ${ad.getDate()}, ${ad.getFullYear()}`,
        weekday: WEEKDAYS_EN[ad.getDay()],
        weekdayNp: wk,
        bsNepali: `${toNpDigits(y)} ${BS_MONTHS_NP[m]} ${toNpDigits(d)}`,
      };
    } catch {
      return null;
    }
  }, [y, m, d]);

  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-3">
        <Field label="बि.सं. वर्ष (BS year)">
          <select className="input" value={y} onChange={(e) => { setY(Number(e.target.value)); setD(1); }} aria-label="BS year">
            {YEARS.map((v) => <option key={v} value={v}>{v} ({toNpDigits(v)})</option>)}
          </select>
        </Field>
        <Field label="महिना (month)">
          <select className="input" value={m} onChange={(e) => { setM(Number(e.target.value)); setD(1); }} aria-label="BS month">
            {BS_MONTHS.map((v, i) => <option key={v} value={i}>{i + 1}. {v} — {BS_MONTHS_NP[i]}</option>)}
          </select>
        </Field>
        <Field label="गते (day)">
          <select className="input" value={d} onChange={(e) => setD(Number(e.target.value))} aria-label="BS day">
            {days.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </Field>
      </div>
      {result ? (
        <ResultCard
          items={[
            { label: "English date (AD)", value: result.adLong, sub: `${result.ad} — ${result.weekdayNp}`, emphasize: true },
            { label: "Nepali date entered", value: result.bsNepali, sub: "Bikram Sambat input" },
          ]}
        />
      ) : (
        <p className="mt-4 text-sm text-red-600">Invalid — this BS month has {days[days.length - 1]} days.</p>
      )}
      <div className="mt-3 flex gap-2">
        {result && <CopyButton text={result.ad} label="Copy AD date" />}
      </div>
    </ToolShell>
  );
}

/* ---------- AD → BS ---------- */
export function Ad2BsTool() {
  const [dateStr, setDateStr] = useState(() => new Date().toISOString().slice(0, 10));
  const result = useMemo(() => {
    try {
      const [Y, M, D] = dateStr.split("-").map(Number);
      if (!Y || !M || !D) return null;
      const nd = NepaliDate.fromAD(new Date(Date.UTC(Y, M - 1, D, 6)));
      const yr = nd.getYear(), mo = nd.getMonth(), da = nd.getDate();
      const ad = nd.toJsDate();
      return {
        bs: `${yr} ${BS_MONTHS[mo]} ${da}`,
        bsNepali: `${toNpDigits(yr)} ${BS_MONTHS_NP[mo]} ${toNpDigits(da)}`,
        weekdayNp: WEEKDAYS_FULL_NP[ad.getUTCDay()],
      };
    } catch {
      return null;
    }
  }, [dateStr]);

  return (
    <ToolShell>
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <Field label="English (AD) date">
            <input type="date" className="input" value={dateStr} min="1943-04-14" max="2033-07-15"
              onChange={(e) => setDateStr(e.target.value)} aria-label="AD date" />
          </Field>
        </div>
        {result && <CopyButton text={result.bsNepali} label="Copy BS" />}
      </div>
      {result ? (
        <ResultCard items={[
          { label: "Nepali date (BS)", value: result.bsNepali, sub: result.bs, emphasize: true },
          { label: "बार", value: result.weekdayNp, sub: "Nepali weekday" },
        ]} />
      ) : (
        <p className="mt-4 text-sm text-red-600">Unsupported AD date (range 1943-04-14 to 2033-07-15).</p>
      )}
      <div className="mt-3 flex gap-2">
        <button className="btn-ghost !py-2 !text-xs" onClick={() => setDateStr(new Date().toISOString().slice(0, 10))}>
          <RefreshCcw className="h-3.5 w-3.5" /> Today
        </button>
      </div>
    </ToolShell>
  );
}
