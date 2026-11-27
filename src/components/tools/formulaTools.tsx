"use client";

import NepaliDate from "nepali-date-converter";
import { FormulaView, type FormulaConfig, bsToAd, adToBsLabel, adToBsNp, adLabel, todayAd, parseBs } from "@/components/tools/formulaEngine";
import { BS_MONTHS, BS_MONTHS_NP, WEEKDAYS_FULL_NP, groupAsian } from "@/lib/nepali";
import type { RatesData } from "@/lib/rates";

/* ---------- shared helpers ---------- */
const DAY = 864e5;
const WEEK_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const YEAR_OPTS: Array<[string, string]> = Array.from({ length: 91 }, (_, i) => [String(2000 + i), String(2000 + i)]);
const MONTH_OPTS: Array<[string, string]> = BS_MONTHS.map((m, i) => [String(i), `${m} (${BS_MONTHS_NP[i]})`]);
const n = (s: string) => Number(s);
const rs = (x: number) => `Rs ${groupAsian(x)}`;
const days = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / DAY);
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const plural = (x: number, w: string) => `${x} ${w}${x === 1 ? "" : "s"}`;

export function daysInBsMonth(y: number, m: number): number {
  for (let d = 32; d >= 29; d--) {
    try {
      const nd = new NepaliDate(y, m, d);
      if (nd.getMonth() === m && nd.getDate() === d) return d;
    } catch { /* try shorter */ }
  }
  return 30;
}
function bsParts(dt: Date) {
  const nd = new NepaliDate(dt);
  return { y: nd.getYear(), m: nd.getMonth(), d: nd.getDate() };
}
/** Completed years/months/days between two BS dates (b after a). */
function bsDiff(a: { y: number; m: number; d: number }, b: { y: number; m: number; d: number }) {
  let y = b.y - a.y, m = b.m - a.m, d = b.d - a.d;
  if (d < 0) {
    m -= 1;
    const pm = b.m === 0 ? 11 : b.m - 1, py = b.m === 0 ? b.y - 1 : b.y;
    d += daysInBsMonth(py, pm);
  }
  if (m < 0) { y -= 1; m += 12; }
  return { y, m, d };
}
const ymd = (x: { y: number; m: number; d: number }) => `${plural(x.y, "year")}, ${plural(x.m, "month")}, ${plural(x.d, "day")}`;
const bad = { error: "That date doesn't exist in the Nepali calendar. Check the day: some months have 29 or 30 days, others 31 or 32." };
const both = (dt: Date) => ({ value: adToBsLabel(dt), sub: adToBsNp(dt) });
function turnsOn(p: { y: number; m: number; d: number }, years: number) {
  const y = p.y + years;
  const dt = y <= 2090 ? bsToAd(`${y}-${p.m}-${Math.min(p.d, daysInBsMonth(y, p.m))}`) : null;
  return dt ? both(dt) : { value: "—", sub: "Outside 2000–2090 BS" };
}
function saturdaysBetween(a: Date, b: Date) {
  let c = 0;
  for (let t = new Date(a.getTime() + DAY); t <= b; t = new Date(t.getTime() + DAY)) if (t.getDay() === 6) c++;
  return c;
}
function fiscalYearOf(p: { y: number; m: number }) {
  const start = p.m >= 3 ? p.y : p.y - 1;
  return { start, label: `${start}/${String(start + 1).slice(-2)}` };
}

/* ---------- Batch 1: Nepali date tools ---------- */
const CONFIGS: Record<string, FormulaConfig> = {
  today: {
    fields: [],
    compute: () => {
      const t = todayAd();
      const p = bsParts(t);
      const dim = daysInBsMonth(p.y, p.m);
      const yearStart = bsToAd(`${p.y}-0-1`)!;
      const nextYearStart = bsToAd(`${p.y + 1}-0-1`)!;
      const fy = fiscalYearOf(p);
      return {
        items: [
          { label: "आजको मिति (BS)", value: adToBsLabel(t), sub: `${adToBsNp(t)}, ${WEEKDAYS_FULL_NP[t.getDay()]}`, emphasize: true },
          { label: "Today in English (AD)", value: t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), sub: WEEK_EN[t.getDay()] },
          { label: `${BS_MONTHS[p.m]} has`, value: `${dim} days`, sub: `${dim - p.d} days left this month` },
          { label: "Day of the year", value: `${days(yearStart, t) + 1} of ${days(yearStart, nextYearStart)}`, sub: `${days(t, nextYearStart)} days until नयाँ वर्ष ${p.y + 1}` },
          { label: "Fiscal year", value: `FY ${fy.label}`, sub: "आर्थिक वर्ष (Shrawan 1 – Ashadh end)" },
        ],
        copy: `${adToBsLabel(t)} BS (${adToBsNp(t)}) = ${t.toDateString()}`,
      };
    },
  },

  lokSewaAge: {
    fields: [
      { k: "dob", type: "bsdate", label: "Date of birth (BS)", def: "2058-0-1" },
      { k: "cut", type: "bsdate", label: "Age is counted on (BS)", def: "today", hint: "Use the date given in the vacancy notice (often the last day to apply)." },
      { k: "min", type: "num", label: "Minimum age", def: "18", suffix: "years" },
      { k: "max", type: "num", label: "Maximum age", def: "35", suffix: "years", hint: "Upper limits differ by post and group. Check your notice." },
    ],
    compute: (v) => {
      const a = bsToAd(v.dob), b = bsToAd(v.cut);
      if (!a || !b) return bad;
      if (b < a) return { error: "The counting date is before the date of birth." };
      const age = bsDiff(parseBs(v.dob), parseBs(v.cut));
      const min = n(v.min), max = n(v.max);
      const overMin = age.y >= min;
      const underMax = age.y < max || (age.y === max && age.m === 0 && age.d === 0);
      const ok = overMin && underMax;
      return {
        items: [
          { label: "Age on that date", value: ymd(age), emphasize: true },
          { label: "Age limit check", value: ok ? "Within the limit ✓" : !overMin ? `Under ${min}` : `Over ${max}`, sub: `Limit: ${min} to ${max} years` },
          { label: `Turns ${min} on`, ...turnsOn(parseBs(v.dob), min) },
          { label: `Turns ${max} on`, ...turnsOn(parseBs(v.dob), max) },
        ],
        note: "Age is counted in completed Bikram Sambat years, months and days, the way government forms ask for it. The notice published by the Public Service Commission or the hiring body always has the final say.",
      };
    },
  },

  fiscalYear: {
    fields: [{ k: "d", type: "bsdate", label: "Date (BS)", def: "today" }],
    compute: (v) => {
      const dt = bsToAd(v.d);
      if (!dt) return bad;
      const p = parseBs(v.d);
      const fy = fiscalYearOf(p);
      const start = bsToAd(`${fy.start}-3-1`)!;
      const endNext = bsToAd(`${fy.start + 1}-3-1`)!;
      const end = new Date(endNext.getTime() - DAY);
      const q = Math.floor(((p.m - 3 + 12) % 12) / 3) + 1;
      const qNames = ["Shrawan – Ashwin", "Kartik – Poush", "Magh – Chaitra", "Baisakh – Ashadh"];
      return {
        items: [
          { label: "Fiscal year (आर्थिक वर्ष)", value: `FY ${fy.label}`, emphasize: true, sub: `${fy.start}/${fy.start + 1} BS` },
          { label: "Quarter (त्रैमासिक)", value: `Q${q}`, sub: qNames[q - 1] },
          { label: "Starts", value: adToBsLabel(start), sub: start.toDateString() },
          { label: "Ends", value: adToBsLabel(end), sub: end.toDateString() },
        ],
        table: {
          caption: `Quarters of FY ${fy.label}`,
          head: ["Quarter", "Months", "Starts (AD)"],
          rows: [0, 1, 2, 3].map((i) => {
            const m = (3 + i * 3) % 12, y = m >= 3 ? fy.start : fy.start + 1;
            return [`Q${i + 1}`, qNames[i], bsToAd(`${y}-${m}-1`)!.toDateString()];
          }),
        },
        note: `${days(dt, endNext)} days left in this fiscal year. Nepal's government fiscal year runs from Shrawan 1 to the last day of Ashadh.`,
      };
    },
  },

  monthDays: {
    fields: [
      { k: "y", type: "select", label: "Year (BS)", def: String(new NepaliDate(new Date()).getYear()), options: YEAR_OPTS },
      { k: "m", type: "select", label: "Month", def: String(new NepaliDate(new Date()).getMonth()), options: MONTH_OPTS },
    ],
    compute: (v) => {
      const y = n(v.y), m = n(v.m);
      const dim = daysInBsMonth(y, m);
      const first = bsToAd(`${y}-${m}-1`)!, last = bsToAd(`${y}-${m}-${dim}`)!;
      const total = Array.from({ length: 12 }, (_, i) => daysInBsMonth(y, i)).reduce((a, b) => a + b, 0);
      return {
        items: [
          { label: `${BS_MONTHS[m]} ${y}`, value: `${dim} days`, sub: `${BS_MONTHS_NP[m]} ${y}`, emphasize: true },
          { label: "Year total", value: `${total} days`, sub: `in ${y} BS` },
          { label: "1st falls on", value: WEEK_EN[first.getDay()], sub: first.toDateString() },
          { label: `Last day (${dim}) falls on`, value: WEEK_EN[last.getDay()], sub: last.toDateString() },
        ],
        table: {
          caption: `All months of ${y} BS`,
          head: ["Month", "Days", "Starts (AD)"],
          rows: BS_MONTHS.map((name, i) => [`${name} (${BS_MONTHS_NP[i]})`, String(daysInBsMonth(y, i)), bsToAd(`${y}-${i}-1`)!.toDateString()]),
        },
      };
    },
  },

  addDays: {
    fields: [
      { k: "d", type: "bsdate", label: "Start date (BS)", def: "today" },
      { k: "n", type: "num", label: "Days to add", def: "45", hint: "Use a minus sign to go back, e.g. -30." },
    ],
    compute: (v) => {
      const dt = bsToAd(v.d);
      if (!dt) return bad;
      const k = Math.round(n(v.n));
      if (!Number.isFinite(k) || Math.abs(k) > 36500) return { error: "Enter a number of days up to 36,500." };
      const r = new Date(dt.getTime() + k * DAY);
      r.setHours(0, 0, 0, 0);
      return {
        items: [
          { label: k >= 0 ? `${k} days after` : `${-k} days before`, ...both(r), emphasize: true },
          { label: "In English (AD)", value: r.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), sub: WEEK_EN[r.getDay()] },
          { label: "That is", value: `${plural(Math.floor(Math.abs(k) / 7), "week")} + ${plural(Math.abs(k) % 7, "day")}` },
        ],
        copy: `${adToBsLabel(r)} BS (${r.toDateString()})`,
      };
    },
  },

  dayFinder: {
    fields: [{ k: "d", type: "bsdate", label: "Nepali date (BS)", def: "2083-0-1" }],
    compute: (v) => {
      const dt = bsToAd(v.d);
      if (!dt) return bad;
      const diff = days(todayAd(), dt);
      return {
        items: [
          { label: "Day of the week", value: WEEK_EN[dt.getDay()], sub: WEEKDAYS_FULL_NP[dt.getDay()], emphasize: true },
          { label: "Same date in AD", value: dt.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
          { label: diff >= 0 ? "From today" : "Before today", value: diff === 0 ? "Today" : `${groupAsian(Math.abs(diff))} days ${diff > 0 ? "away" : "ago"}` },
        ],
      };
    },
  },

  countdown: {
    fields: [
      { k: "d", type: "bsdate", label: "Event date (BS)", def: `${new NepaliDate(new Date()).getYear() + 1}-0-1`, hint: "Wedding, exam, flight, festival or anything else." },
      { k: "name", type: "text", label: "Event name (optional)", def: "नयाँ वर्ष", rows: 1 },
    ],
    compute: (v) => {
      const dt = bsToAd(v.d);
      if (!dt) return bad;
      const t = todayAd();
      const d = days(t, dt);
      const label = v.name.trim() || "Your event";
      if (d < 0) return { items: [{ label, value: `${groupAsian(-d)} days ago`, sub: adLabel(dt), emphasize: true }] };
      const span = bsDiff(bsParts(t), parseBs(v.d));
      return {
        items: [
          { label: `Days until ${label}`, value: d === 0 ? "Today!" : `${groupAsian(d)} days`, sub: adLabel(dt), emphasize: true },
          { label: "Weeks", value: `${Math.floor(d / 7)} weeks ${d % 7} days` },
          { label: "In Nepali months", value: `${plural(span.y * 12 + span.m, "month")}, ${plural(span.d, "day")}` },
          { label: "Saturdays on the way", value: d <= 3700 ? `${saturdaysBetween(t, dt)} Saturdays` : "—", sub: "Public holiday count not included" },
        ],
        copy: `${groupAsian(d)} days until ${label} (${adToBsLabel(dt)} BS)`,
      };
    },
  },

  retirement: {
    fields: [
      { k: "dob", type: "bsdate", label: "Date of birth (BS)", def: "2030-0-1" },
      { k: "age", type: "num", label: "Retirement age", def: "58", suffix: "years", hint: "Civil service is usually 58. Teachers, security forces and private jobs can differ." },
    ],
    compute: (v) => {
      const p = parseBs(v.dob);
      if (!bsToAd(v.dob)) return bad;
      const age = Math.floor(n(v.age));
      if (!(age > 0 && age < 100)) return { error: "Enter a retirement age between 1 and 99." };
      const ry = p.y + age;
      const rd = Math.min(p.d, daysInBsMonth(ry, p.m));
      const ret = bsToAd(`${ry}-${p.m}-${rd}`);
      if (!ret) return { error: "That retirement date is outside the supported calendar range (2000–2090 BS)." };
      const t = todayAd();
      const left = days(t, ret);
      const span = left > 0 ? bsDiff(bsParts(t), { y: ry, m: p.m, d: rd }) : null;
      return {
        items: [
          { label: `Turns ${age} on`, ...both(ret), emphasize: true },
          { label: "In English (AD)", value: ret.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) },
          { label: left > 0 ? "Service left" : "Retired", value: span ? ymd(span) : `${groupAsian(-left)} days ago` },
          { label: "Working days left (approx.)", value: left > 0 ? groupAsian(Math.round((left * 6) / 7)) : "—", sub: "Counting a six-day week" },
        ],
        note: "Your office may count retirement from the day you complete the age or from the end of that month. Confirm with your employer or the pension office.",
      };
    },
  },

  dueDate: {
    fields: [
      { k: "lmp", type: "bsdate", label: "First day of last period (BS)", def: "today" },
      { k: "cycle", type: "num", label: "Usual cycle length", def: "28", suffix: "days", hint: "Most cycles are 21–35 days." },
    ],
    compute: (v) => {
      const lmp = bsToAd(v.lmp);
      if (!lmp) return bad;
      const c = n(v.cycle);
      if (!(c >= 20 && c <= 45)) return { error: "Enter a cycle length between 20 and 45 days." };
      const due = new Date(lmp.getTime() + (280 + (c - 28)) * DAY);
      due.setHours(0, 0, 0, 0);
      const gest = days(lmp, todayAd()) - (c - 28);
      const wk = Math.floor(gest / 7), dd = gest % 7;
      const tri = gest < 0 ? "—" : wk < 13 ? "First trimester" : wk < 27 ? "Second trimester" : "Third trimester";
      return {
        items: [
          { label: "Estimated due date", ...both(due), emphasize: true },
          { label: "In English (AD)", value: due.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }), sub: WEEK_EN[due.getDay()] },
          { label: "Pregnancy today", value: gest >= 0 && gest < 300 ? `${wk} weeks ${dd} days` : "—", sub: tri },
          { label: "Days to go", value: gest >= 0 ? `${Math.max(0, days(todayAd(), due))} days` : "—" },
        ],
        note: "This uses Naegele's rule (280 days from the last period, adjusted for cycle length). Only about 1 in 20 babies arrive on the exact date. Your doctor or health post will confirm the date with an ultrasound.",
      };
    },
  },
  /* ---------- Batch 2: money and salary ---------- */
  gratuity: {
    fields: [
      { k: "basic", type: "num", label: "Monthly basic salary", def: "30000", suffix: "Rs" },
      { k: "years", type: "num", label: "Years of service", def: "5", suffix: "years" },
      { k: "months", type: "num", label: "Extra months", def: "0", suffix: "months" },
      { k: "rate", type: "num", label: "Gratuity rate", def: "8.33", suffix: "%", hint: "Nepal's Labour Act 2074 sets gratuity at 8.33% of basic salary each month." },
    ],
    compute: (v) => {
      const basic = n(v.basic), months = Math.floor(n(v.years)) * 12 + Math.floor(n(v.months)), r = n(v.rate) / 100;
      if (!(basic > 0) || !(months > 0) || !(r > 0)) return { error: "Enter your basic salary and service period." };
      const monthly = basic * r;
      return {
        items: [
          { label: "Total gratuity", value: rs(monthly * months), emphasize: true, sub: `${months} months of service` },
          { label: "Set aside each month", value: rs(monthly) },
          { label: "Per year of service", value: rs(monthly * 12), sub: `about ${Number((r * 12).toFixed(2)) === 1 ? "one month" : `${Number((r * 12).toFixed(2))} months`} of basic salary` },
        ],
        note: "Since the Labour Act 2074, employers deposit gratuity monthly (often into the Social Security Fund) rather than paying a lump sum at the end. Interest earned on the deposit is not included here.",
      };
    },
  },
  providentFund: {
    fields: [
      { k: "basic", type: "num", label: "Monthly basic salary", def: "40000", suffix: "Rs" },
      { k: "you", type: "num", label: "Your contribution", def: "10", suffix: "%" },
      { k: "emp", type: "num", label: "Employer contribution", def: "10", suffix: "%" },
      { k: "rate", type: "num", label: "Interest the fund pays", def: "6", suffix: "% / yr", hint: "Use the rate your fund (EPF, CIT, SSF) announced." },
      { k: "years", type: "num", label: "Years", def: "20", suffix: "years" },
      { k: "raise", type: "num", label: "Yearly salary increase", def: "5", suffix: "%" },
    ],
    compute: (v) => {
      let basic = n(v.basic);
      const you = n(v.you) / 100, emp = n(v.emp) / 100, r = n(v.rate) / 100 / 12, yrs = Math.floor(n(v.years)), g = n(v.raise) / 100;
      if (!(basic > 0) || !(yrs > 0) || yrs > 50) return { error: "Enter a salary and 1–50 years." };
      let bal = 0, mine = 0, theirs = 0;
      const rows: string[][] = [];
      for (let y = 1; y <= yrs; y++) {
        for (let m = 0; m < 12; m++) { bal = bal * (1 + r) + basic * (you + emp); mine += basic * you; theirs += basic * emp; }
        if (y <= 5 || y % 5 === 0 || y === yrs) rows.push([`Year ${y}`, rs(basic), rs(bal)]);
        basic *= 1 + g;
      }
      return {
        items: [
          { label: "Fund balance", value: rs(bal), emphasize: true, sub: `after ${yrs} years` },
          { label: "You put in", value: rs(mine) },
          { label: "Employer put in", value: rs(theirs) },
          { label: "Interest earned", value: rs(bal - mine - theirs) },
        ],
        table: { head: ["Year", "Basic salary", "Balance"], rows },
        note: "An estimate. Actual balances depend on your fund's declared interest each year, any loans you take against it, and tax rules on withdrawal.",
      };
    },
  },
  overtime: {
    fields: [
      { k: "salary", type: "num", label: "Monthly salary (basic)", def: "25000", suffix: "Rs" },
      { k: "days", type: "num", label: "Days counted in a month", def: "30", hint: "Many employers divide by 30. Some use 26 working days." },
      { k: "hours", type: "num", label: "Normal hours per day", def: "8" },
      { k: "ot", type: "num", label: "Overtime hours worked", def: "20" },
      { k: "mult", type: "num", label: "Overtime rate", def: "1.5", suffix: "×", hint: "Nepal's Labour Act sets overtime at 1.5 times the normal hourly wage." },
    ],
    compute: (v) => {
      const hourly = n(v.salary) / n(v.days) / n(v.hours);
      if (!(hourly > 0) || !(n(v.ot) >= 0)) return { error: "Check the salary, days and hours." };
      const pay = hourly * n(v.mult) * n(v.ot);
      return {
        items: [
          { label: "Overtime pay", value: rs(pay), emphasize: true },
          { label: "Normal hourly wage", value: `Rs ${hourly.toFixed(2)}` },
          { label: "Overtime hourly wage", value: `Rs ${(hourly * n(v.mult)).toFixed(2)}` },
          { label: "Salary + overtime", value: rs(n(v.salary) + pay) },
        ],
        note: "Under the Labour Act 2074, normal work is 8 hours a day and 48 hours a week, and overtime is generally limited to 4 hours a day and 24 hours a week.",
      };
    },
  },
  recurringDeposit: {
    fields: [
      { k: "dep", type: "num", label: "Monthly deposit", def: "5000", suffix: "Rs" },
      { k: "rate", type: "num", label: "Interest rate", def: "7", suffix: "% / yr" },
      { k: "months", type: "num", label: "Period", def: "36", suffix: "months" },
      { k: "tds", type: "num", label: "Tax on interest (TDS)", def: "6", suffix: "%", hint: "Confirm the rate with your bank." },
    ],
    compute: (v) => {
      const dep = n(v.dep), r = n(v.rate) / 100 / 12, months = Math.floor(n(v.months)), tds = n(v.tds) / 100;
      if (!(dep > 0) || !(months > 0) || months > 600) return { error: "Enter a deposit and a period up to 600 months." };
      let bal = 0, acc = 0;
      for (let m = 1; m <= months; m++) { bal += dep; acc += bal * r; if (m % 3 === 0) { bal += acc; acc = 0; } }
      bal += acc;
      const paid = dep * months, interest = bal - paid, tax = interest * tds;
      return {
        items: [
          { label: "Maturity amount", value: rs(bal - tax), emphasize: true, sub: "after tax" },
          { label: "You deposit", value: rs(paid) },
          { label: "Interest (before tax)", value: rs(interest) },
          { label: "Tax deducted", value: rs(tax) },
        ],
        note: "Interest is worked out monthly and added every quarter, which is how most Nepali banks run recurring (aawadhik bachat) accounts. Your bank's exact method may differ slightly.",
      };
    },
  },
  loanPrepay: {
    fields: [
      { k: "p", type: "num", label: "Loan amount left", def: "2000000", suffix: "Rs" },
      { k: "rate", type: "num", label: "Interest rate", def: "11", suffix: "% / yr" },
      { k: "years", type: "num", label: "Years left", def: "15" },
      { k: "extra", type: "num", label: "Extra payment every month", def: "5000", suffix: "Rs" },
      { k: "lump", type: "num", label: "One-time extra payment now", def: "0", suffix: "Rs" },
    ],
    compute: (v) => {
      const P = n(v.p), r = n(v.rate) / 100 / 12, N = Math.round(n(v.years) * 12);
      if (!(P > 0) || !(r > 0) || !(N > 0)) return { error: "Enter the loan, rate and years." };
      const emi = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      const base = emi * N - P;
      let bal = P - Math.max(0, n(v.lump)), months = 0, interest = 0;
      while (bal > 0.5 && months < 1200) { const i = bal * r; interest += i; bal = bal + i - emi - Math.max(0, n(v.extra)); months++; }
      const saved = base - interest;
      return {
        items: [
          { label: "Interest you save", value: rs(Math.max(0, saved)), emphasize: true },
          { label: "Loan finishes", value: `${Math.floor(months / 12)} yr ${months % 12} mo`, sub: `instead of ${Math.floor(N / 12)} yr ${N % 12} mo` },
          { label: "Current EMI", value: rs(emi) },
          { label: "Time saved", value: plural(Math.max(0, N - months), "month") },
        ],
        note: "Ask your bank about prepayment charges before paying extra. Many banks in Nepal allow partial prepayment of floating-rate loans with little or no fee.",
      };
    },
  },
  affordability: {
    fields: [
      { k: "income", type: "num", label: "Monthly take-home income", def: "120000", suffix: "Rs" },
      { k: "other", type: "num", label: "Existing EMIs per month", def: "0", suffix: "Rs" },
      { k: "share", type: "num", label: "Share of income for EMIs", def: "40", suffix: "%", hint: "Banks check your total EMIs against income. 40–50% is a common ceiling." },
      { k: "rate", type: "num", label: "Interest rate", def: "11", suffix: "% / yr" },
      { k: "years", type: "num", label: "Loan period", def: "20", suffix: "years" },
    ],
    compute: (v) => {
      const emi = n(v.income) * (n(v.share) / 100) - n(v.other);
      const r = n(v.rate) / 100 / 12, N = Math.round(n(v.years) * 12);
      if (!(emi > 0)) return { error: "Your existing EMIs already use up that share of income." };
      if (!(r > 0) || !(N > 0)) return { error: "Enter a rate and period." };
      const loan = (emi * (Math.pow(1 + r, N) - 1)) / (r * Math.pow(1 + r, N));
      return {
        items: [
          { label: "You could borrow about", value: rs(loan), emphasize: true },
          { label: "Monthly EMI", value: rs(emi) },
          { label: "Total interest", value: rs(emi * N - loan) },
          { label: "Total repaid", value: rs(emi * N) },
        ],
        note: "Banks also look at the property's value (loan-to-value limits), your credit history and documents, so the amount they approve can be lower.",
      };
    },
  },
  loanCompare: {
    cols: 2,
    fields: [
      { k: "p", type: "num", label: "Loan amount", def: "1000000", suffix: "Rs" },
      { k: "ra", type: "num", label: "Bank A interest rate", def: "10.5", suffix: "%" },
      { k: "rb", type: "num", label: "Bank B interest rate", def: "11.25", suffix: "%" },
      { k: "ya", type: "num", label: "Bank A period", def: "10", suffix: "years" },
      { k: "yb", type: "num", label: "Bank B period", def: "10", suffix: "years" },
      { k: "fa", type: "num", label: "Bank A service fee", def: "0.75", suffix: "%" },
      { k: "fb", type: "num", label: "Bank B service fee", def: "0.5", suffix: "%" },
    ],
    compute: (v) => {
      const P = n(v.p);
      const one = (rate: number, yrs: number, fee: number) => {
        const r = rate / 100 / 12, N = Math.round(yrs * 12);
        const emi = r > 0 ? (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1) : P / N;
        return { emi, interest: emi * N - P, total: emi * N + (P * fee) / 100 };
      };
      if (!(P > 0)) return { error: "Enter the loan amount." };
      const a = one(n(v.ra), n(v.ya), n(v.fa)), b = one(n(v.rb), n(v.yb), n(v.fb));
      const better = a.total <= b.total ? "Bank A" : "Bank B";
      return {
        items: [
          { label: "Cheaper overall", value: better, emphasize: true, sub: `saves ${rs(Math.abs(a.total - b.total))}` },
          { label: "EMI: A vs B", value: `${rs(a.emi)} vs ${rs(b.emi)}` },
        ],
        table: { head: ["", "Bank A", "Bank B"], rows: [["Monthly EMI", rs(a.emi), rs(b.emi)], ["Total interest", rs(a.interest), rs(b.interest)], ["Total cost incl. fee", rs(a.total), rs(b.total)]] },
        note: "Most Nepali bank loans have floating rates linked to the base rate, so the rate can change during the loan. Compare the premium over base rate too.",
      };
    },
  },
  savingsGoal: {
    fields: [
      { k: "goal", type: "num", label: "Target amount", def: "1000000", suffix: "Rs" },
      { k: "have", type: "num", label: "Saved already", def: "100000", suffix: "Rs" },
      { k: "years", type: "num", label: "In how many years", def: "5" },
      { k: "rate", type: "num", label: "Expected return", def: "7", suffix: "% / yr", hint: "For a bank saving or FD, use its interest rate." },
    ],
    compute: (v) => {
      const G = n(v.goal), H = n(v.have), N = Math.round(n(v.years) * 12), r = n(v.rate) / 100 / 12;
      if (!(G > 0) || !(N > 0)) return { error: "Enter a target and time." };
      const fvHave = H * Math.pow(1 + r, N);
      const need = Math.max(0, G - fvHave);
      const monthly = r > 0 ? (need * r) / (Math.pow(1 + r, N) - 1) : need / N;
      return {
        items: [
          { label: "Save each month", value: rs(monthly), emphasize: true },
          { label: "Per day", value: rs(monthly / 30) },
          { label: "Your current savings grow to", value: rs(fvHave) },
          { label: "Total you put in", value: rs(H + monthly * N) },
        ],
      };
    },
  },
  inflation: {
    fields: [
      { k: "amt", type: "num", label: "Amount today", def: "100000", suffix: "Rs" },
      { k: "rate", type: "num", label: "Inflation rate", def: "5", suffix: "% / yr", hint: "Nepal Rastra Bank publishes the latest consumer inflation rate monthly." },
      { k: "years", type: "num", label: "Years", def: "10" },
    ],
    compute: (v) => {
      const A = n(v.amt), i = n(v.rate) / 100, Y = n(v.years);
      if (!(A > 0) || !(Y > 0)) return { error: "Enter an amount and years." };
      const f = Math.pow(1 + i, Y);
      return {
        items: [
          { label: `Same things will cost`, value: rs(A * f), emphasize: true, sub: `in ${Y} years` },
          { label: "Today's money will be worth", value: rs(A / f), sub: "in today's buying power" },
          { label: "Prices rise by", value: `${((f - 1) * 100).toFixed(1)}%` },
        ],
        table: { head: ["Year", "Cost", "Value of today's money"], rows: Array.from({ length: Math.min(Math.floor(Y), 30) }, (_, k) => [`${k + 1}`, rs(A * Math.pow(1 + i, k + 1)), rs(A / Math.pow(1 + i, k + 1))]) },
      };
    },
  },
  cagr: {
    fields: [
      { k: "a", type: "num", label: "Starting value", def: "100000", suffix: "Rs" },
      { k: "b", type: "num", label: "Ending value", def: "180000", suffix: "Rs" },
      { k: "y", type: "num", label: "Years", def: "5" },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b), y = n(v.y);
      if (!(a > 0) || !(b > 0) || !(y > 0)) return { error: "Enter positive values." };
      const c = Math.pow(b / a, 1 / y) - 1;
      return {
        items: [
          { label: "CAGR (yearly growth)", value: `${(c * 100).toFixed(2)}%`, emphasize: true },
          { label: "Total growth", value: `${((b / a - 1) * 100).toFixed(1)}%` },
          { label: "Gain", value: rs(b - a) },
        ],
        note: "CAGR smooths growth into one steady yearly rate. Use it to compare shares, mutual funds, land or a business over different periods.",
      };
    },
  },
  doubleMoney: {
    fields: [{ k: "r", type: "num", label: "Yearly return or interest", def: "8", suffix: "%" }],
    compute: (v) => {
      const r = n(v.r) / 100;
      if (!(r > 0)) return { error: "Enter a rate above 0." };
      const t = (k: number) => Math.log(k) / Math.log(1 + r);
      const yrs = (x: number) => `${Math.floor(x)} yr ${Math.round((x % 1) * 12)} mo`;
      return {
        items: [
          { label: "Money doubles in", value: yrs(t(2)), emphasize: true },
          { label: "Rule of 72 estimate", value: `${(72 / (r * 100)).toFixed(1)} years` },
          { label: "Triples in", value: yrs(t(3)) },
          { label: "Grows 10× in", value: yrs(t(10)) },
        ],
      };
    },
  },
  salaryHourly: {
    fields: [
      { k: "amt", type: "num", label: "Amount", def: "50000", suffix: "Rs" },
      { k: "per", type: "select", label: "Paid per", def: "month", options: [["hour", "Hour"], ["day", "Day"], ["month", "Month"], ["year", "Year"]] },
      { k: "h", type: "num", label: "Hours per day", def: "8" },
      { k: "d", type: "num", label: "Working days per week", def: "6" },
    ],
    compute: (v) => {
      const hpd = n(v.h), dpw = n(v.d);
      if (!(hpd > 0) || !(dpw > 0)) return { error: "Enter hours and days." };
      const daysYear = dpw * 52, hoursYear = daysYear * hpd;
      const toYear: Record<string, number> = { hour: hoursYear, day: daysYear, month: 12, year: 1 };
      const yearly = n(v.amt) * toYear[v.per];
      return {
        items: [
          { label: "Per month", value: rs(yearly / 12), emphasize: v.per !== "month" },
          { label: "Per day", value: rs(yearly / daysYear), emphasize: v.per === "month" },
          { label: "Per hour", value: `Rs ${(yearly / hoursYear).toFixed(2)}` },
          { label: "Per year", value: rs(yearly) },
        ],
        note: `Based on ${daysYear} working days and ${groupAsian(hoursYear)} hours a year.`,
      };
    },
  },

  /* ---------- Batch 3: shares and small business ---------- */
  shareAdjust: {
    fields: [
      { k: "p", type: "num", label: "Market price before book close", def: "600", suffix: "Rs" },
      { k: "bonus", type: "num", label: "Bonus share", def: "10", suffix: "%" },
      { k: "right", type: "num", label: "Right share", def: "0", suffix: "%" },
      { k: "rp", type: "num", label: "Right share price", def: "100", suffix: "Rs", hint: "Usually Rs 100 (face value) in Nepal." },
    ],
    compute: (v) => {
      const P = n(v.p), b = n(v.bonus) / 100, r = n(v.right) / 100, rp = n(v.rp);
      if (!(P > 0) || b < 0 || r < 0) return { error: "Enter the price and percentages." };
      const adj = (P + r * rp) / (1 + b + r);
      return {
        items: [
          { label: "Adjusted price", value: `Rs ${adj.toFixed(2)}`, emphasize: true },
          { label: "Price drop", value: `Rs ${(P - adj).toFixed(2)}`, sub: `${(((P - adj) / P) * 100).toFixed(1)}%` },
          { label: "100 shares become", value: `${(100 * (1 + b + r)).toFixed(0)} shares` },
        ],
        note: "Formula: (price before book close + right % × right price) ÷ (1 + bonus % + right %). This is how the market price is adjusted after book closure on NEPSE.",
      };
    },
  },
  shareAverage: {
    cols: 1,
    fields: [
      { k: "buys", type: "text", label: "Your buys: quantity and price on each line", def: "100 520\n50 480\n30 610", placeholder: "100 520", rows: 5, hint: "Example: \"100 520\" means 100 shares at Rs 520." },
      { k: "ltp", type: "num", label: "Current market price (optional)", def: "", suffix: "Rs" },
    ],
    compute: (v) => {
      const rows = v.buys.split(/\n+/).map((l) => l.replace(/,/g, "").trim().split(/[\s@x×]+/).map(Number)).filter((a) => a.length >= 2 && a[0] > 0 && a[1] > 0);
      if (!rows.length) return { error: "Enter at least one line like \"100 520\"." };
      const qty = rows.reduce((s, r) => s + r[0], 0), cost = rows.reduce((s, r) => s + r[0] * r[1], 0), avg = cost / qty;
      const ltp = n(v.ltp);
      const items = [
        { label: "Average price", value: `Rs ${avg.toFixed(2)}`, emphasize: true },
        { label: "Total shares", value: groupAsian(qty) },
        { label: "Total invested", value: rs(cost) },
      ];
      if (ltp > 0) items.push({ label: "Profit / loss now", value: `${ltp * qty - cost >= 0 ? "+" : "−"}${rs(Math.abs(ltp * qty - cost))}`, sub: `${(((ltp - avg) / avg) * 100).toFixed(2)}%` } as never);
      return { items, note: "Broker commission, SEBON fee and DP charges are not included. Add them to the price on each line for an exact cost." };
    },
  },
  dividend: {
    fields: [
      { k: "q", type: "num", label: "Shares you hold", def: "500" },
      { k: "fv", type: "num", label: "Face value per share", def: "100", suffix: "Rs" },
      { k: "cash", type: "num", label: "Cash dividend", def: "5.26", suffix: "%" },
      { k: "bonus", type: "num", label: "Bonus share", def: "10", suffix: "%" },
      { k: "tax", type: "num", label: "Dividend tax", def: "5", suffix: "%", hint: "Tax on dividends from listed companies is 5%, applied to cash and to the face value of bonus shares." },
    ],
    compute: (v) => {
      const Q = n(v.q), FV = n(v.fv), c = n(v.cash) / 100, b = n(v.bonus) / 100, t = n(v.tax) / 100;
      if (!(Q > 0) || !(FV > 0)) return { error: "Enter shares and face value." };
      const cash = Q * FV * c, bonusVal = Q * FV * b, tax = (cash + bonusVal) * t;
      return {
        items: [
          { label: "Cash in your bank", value: rs(Math.max(0, cash - tax)), emphasize: true, sub: cash - tax < 0 ? "Tax is more than the cash; the company may ask you to pay the rest" : undefined },
          { label: "Bonus shares", value: `${Math.floor(Q * b)} shares`, sub: Q * b % 1 ? `+ ${(Q * b % 1).toFixed(2)} fraction` : undefined },
          { label: "Gross cash dividend", value: rs(cash) },
          { label: "Total tax", value: rs(tax) },
        ],
        note: "Companies in Nepal often declare a small cash dividend (like 0.526% for each 10% bonus) just to cover the tax on bonus shares.",
      };
    },
  },
  profitMargin: {
    fields: [
      { k: "mode", type: "select", label: "I know", def: "both", options: [["both", "Cost and selling price"], ["margin", "Cost and the margin I want"], ["markup", "Cost and the markup I want"]] },
      { k: "cost", type: "num", label: "Cost price", def: "800", suffix: "Rs" },
      { k: "x", type: "num", label: "Selling price / margin % / markup %", def: "1000" },
    ],
    compute: (v) => {
      const C = n(v.cost), x = n(v.x);
      if (!(C > 0) || !(x > 0)) return { error: "Enter positive numbers." };
      const S = v.mode === "both" ? x : v.mode === "margin" ? (x >= 100 ? NaN : C / (1 - x / 100)) : C * (1 + x / 100);
      if (!Number.isFinite(S)) return { error: "A margin must be below 100%." };
      const p = S - C;
      return {
        items: [
          { label: v.mode === "both" ? "Profit" : "Selling price", value: v.mode === "both" ? rs(p) : `Rs ${S.toFixed(2)}`, emphasize: true },
          { label: "Margin (on selling price)", value: `${((p / S) * 100).toFixed(2)}%` },
          { label: "Markup (on cost)", value: `${((p / C) * 100).toFixed(2)}%` },
          { label: "Price with 13% VAT", value: `Rs ${(S * 1.13).toFixed(2)}` },
        ],
        note: "Margin is profit as a share of the selling price. Markup is profit as a share of the cost. A 25% markup is only a 20% margin.",
      };
    },
  },
  breakEven: {
    fields: [
      { k: "fixed", type: "num", label: "Fixed costs per month", def: "80000", suffix: "Rs", hint: "Rent, salaries, electricity, loan EMI…" },
      { k: "price", type: "num", label: "Selling price per item", def: "250", suffix: "Rs" },
      { k: "var", type: "num", label: "Cost per item", def: "150", suffix: "Rs", hint: "Ingredients, stock, packaging per item." },
    ],
    compute: (v) => {
      const F = n(v.fixed), P = n(v.price), V = n(v.var);
      if (!(P > V)) return { error: "Selling price must be higher than the cost per item." };
      const units = F / (P - V);
      return {
        items: [
          { label: "Break-even sales", value: `${groupAsian(Math.ceil(units))} items / month`, emphasize: true, sub: `about ${Math.ceil(units / 30)} a day` },
          { label: "Break-even revenue", value: rs(Math.ceil(units) * P) },
          { label: "Profit per item", value: rs(P - V) },
        ],
      };
    },
  },
  rentIncrease: {
    fields: [
      { k: "rent", type: "num", label: "Rent now (per month)", def: "15000", suffix: "Rs" },
      { k: "inc", type: "num", label: "Increase", def: "10", suffix: "%" },
      { k: "every", type: "num", label: "Every", def: "1", suffix: "years", hint: "Many rental agreements in Kathmandu raise rent 10% every 1–2 years." },
      { k: "years", type: "num", label: "Show for", def: "5", suffix: "years" },
    ],
    compute: (v) => {
      let rent = n(v.rent);
      const inc = n(v.inc) / 100, every = Math.max(1, Math.floor(n(v.every))), Y = Math.min(30, Math.floor(n(v.years)));
      if (!(rent > 0) || !(Y > 0)) return { error: "Enter rent and years." };
      let total = 0;
      const rows: string[][] = [];
      for (let y = 1; y <= Y; y++) {
        if (y > 1 && (y - 1) % every === 0) rent *= 1 + inc;
        total += rent * 12;
        rows.push([`Year ${y}`, rs(rent), rs(rent * 12)]);
      }
      return {
        items: [
          { label: `Rent in year ${Y}`, value: rs(rent), emphasize: true },
          { label: `Total paid over ${Y} years`, value: rs(total) },
        ],
        table: { head: ["Year", "Monthly rent", "Yearly"], rows },
      };
    },
  },

  /* ---------- batch 4: home, building & everyday ---------- */
  bricks: {
    fields: [
      { k: "len", type: "num", label: "Wall length", def: "20", suffix: "ft" },
      { k: "ht", type: "num", label: "Wall height", def: "10", suffix: "ft" },
      { k: "thk", type: "select", label: "Wall thickness", def: "9", options: [["9", "9 inch (full brick)"], ["4.5", "4.5 inch (half brick, partition)"], ["14", "14 inch (one and a half brick)"]] },
      { k: "open", type: "num", label: "Doors and windows to subtract", def: "0", suffix: "sq ft" },
      { k: "ratio", type: "select", label: "Mortar mix (cement : sand)", def: "6", options: [["4", "1:4"], ["5", "1:5"], ["6", "1:6 (most walls)"]] },
      { k: "waste", type: "num", label: "Extra for breakage", def: "5", suffix: "%" },
    ],
    compute: (v) => {
      const area = n(v.len) * n(v.ht) - n(v.open);
      if (!(area > 0)) return { error: "Enter the wall length and height." };
      const volM3 = area * (n(v.thk) / 12) / 35.3147;
      const withMortar = 0.24 * 0.12 * 0.065; // 230×110×55 mm brick + 10 mm joint
      const bricks = Math.ceil((volM3 / withMortar) * (1 + n(v.waste) / 100));
      const wet = volM3 - (volM3 / withMortar) * (0.23 * 0.11 * 0.055);
      const dry = wet * 1.33, r = n(v.ratio);
      const cementM3 = dry / (1 + r);
      return {
        items: [
          { label: "Bricks needed", value: groupAsian(bricks), emphasize: true, sub: `includes ${n(v.waste)}% extra` },
          { label: "Cement", value: `${Math.ceil(cementM3 / 0.0347)} bags`, sub: "50 kg bags" },
          { label: "Sand", value: `${(cementM3 * r * 35.3147).toFixed(1)} cft` },
          { label: "Wall volume", value: `${(volM3 * 35.3147).toFixed(1)} cft`, sub: `${volM3.toFixed(2)} m³` },
        ],
        note: "Based on a standard Nepali brick of 230 × 110 × 55 mm with a 10 mm mortar joint. Machine-made bricks are a little bigger, so you'll need slightly fewer.",
      };
    },
  },
  paint: {
    fields: [
      { k: "area", type: "num", label: "Wall area to paint", def: "600", suffix: "sq ft", hint: "Room tip: (length + width) × 2 × height." },
      { k: "open", type: "num", label: "Doors and windows to subtract", def: "60", suffix: "sq ft" },
      { k: "coats", type: "num", label: "Number of coats", def: "2" },
      { k: "cov", type: "num", label: "Coverage per litre per coat", def: "100", suffix: "sq ft", hint: "Printed on the bucket. Emulsions usually cover 90–140 sq ft per litre." },
      { k: "price", type: "num", label: "Price per litre (optional)", def: "", suffix: "Rs" },
    ],
    compute: (v) => {
      const a = n(v.area) - n(v.open), c = Math.max(1, n(v.coats)), cov = n(v.cov);
      if (!(a > 0) || !(cov > 0)) return { error: "Enter the area and the coverage." };
      const L = (a * c) / cov;
      const b20 = Math.floor(L / 20), rem = L - b20 * 20, b10 = rem > 10 ? 1 : 0, rem2 = rem - b10 * 10;
      const b4 = Math.ceil(Math.max(0, rem2) / 4);
      const packs = [b20 && `${b20} × 20 L`, b10 && `${b10} × 10 L`, b4 && `${b4} × 4 L`].filter(Boolean).join(" + ") || "—";
      const items = [
        { label: "Paint needed", value: `${L.toFixed(1)} litres`, emphasize: true, sub: `${c} coat${c > 1 ? "s" : ""} on ${groupAsian(a)} sq ft` },
        { label: "Buy about", value: packs },
      ];
      if (n(v.price) > 0) items.push({ label: "Estimated cost", value: rs(Math.ceil(L) * n(v.price)) } as never);
      return { items, note: "New plaster usually needs a coat of primer and putty first. Buy a little extra for touch-ups." };
    },
  },
  tiles: {
    fields: [
      { k: "l", type: "num", label: "Room length", def: "12", suffix: "ft" },
      { k: "w", type: "num", label: "Room width", def: "10", suffix: "ft" },
      { k: "size", type: "select", label: "Tile size", def: "24x24", options: [["12x12", "1 × 1 ft (300 × 300 mm)"], ["16x16", "16 × 16 in (400 × 400 mm)"], ["24x24", "2 × 2 ft (600 × 600 mm)"], ["12x18", "12 × 18 in (300 × 450 mm, wall)"], ["12x24", "1 × 2 ft (300 × 600 mm)"], ["24x48", "2 × 4 ft (600 × 1200 mm)"]] },
      { k: "box", type: "num", label: "Tiles per box", def: "4", hint: "Printed on the box. 2 × 2 ft tiles usually come 4 to a box." },
      { k: "waste", type: "num", label: "Extra for cutting", def: "10", suffix: "%" },
      { k: "price", type: "num", label: "Price per sq ft (optional)", def: "", suffix: "Rs" },
    ],
    compute: (v) => {
      const area = n(v.l) * n(v.w);
      const [a, b] = v.size.split("x").map(Number);
      const tile = (a * b) / 144;
      if (!(area > 0)) return { error: "Enter the room size." };
      const tiles = Math.ceil((area / tile) * (1 + n(v.waste) / 100));
      const boxes = Math.ceil(tiles / Math.max(1, n(v.box)));
      const items = [
        { label: "Tiles needed", value: groupAsian(tiles), emphasize: true, sub: `includes ${n(v.waste)}% extra` },
        { label: "Boxes", value: groupAsian(boxes) },
        { label: "Floor area", value: `${groupAsian(area)} sq ft`, sub: `${(area / 10.7639).toFixed(2)} m²` },
      ];
      if (n(v.price) > 0) items.push({ label: "Tile cost", value: rs(boxes * n(v.box) * tile * n(v.price)) } as never);
      return { items, note: "Diagonal or herringbone layouts waste more. Use 15% extra for those." };
    },
  },
  concrete: {
    fields: [
      { k: "l", type: "num", label: "Length", def: "20", suffix: "ft" },
      { k: "w", type: "num", label: "Width", def: "15", suffix: "ft" },
      { k: "t", type: "num", label: "Thickness", def: "5", suffix: "inch", hint: "A house roof slab in Nepal is usually 4–5 inches." },
      { k: "mix", type: "select", label: "Concrete grade", def: "1,1.5,3", options: [["1,3,6", "M10 (1:3:6), floors, PCC"], ["1,2,4", "M15 (1:2:4)"], ["1,1.5,3", "M20 (1:1.5:3), slabs, beams, columns"], ["1,1,2", "M25 (1:1:2)"]] },
    ],
    compute: (v) => {
      const cft = n(v.l) * n(v.w) * (n(v.t) / 12);
      if (!(cft > 0)) return { error: "Enter length, width and thickness." };
      const m3 = cft / 35.3147, dry = m3 * 1.54;
      const [c, s, g] = v.mix.split(",").map(Number), sum = c + s + g;
      const cem = (dry * c) / sum;
      return {
        items: [
          { label: "Cement", value: `${Math.ceil(cem / 0.0347)} bags`, emphasize: true, sub: "50 kg bags" },
          { label: "Sand", value: `${((dry * s) / sum * 35.3147).toFixed(1)} cft` },
          { label: "Aggregate (gitti)", value: `${((dry * g) / sum * 35.3147).toFixed(1)} cft` },
          { label: "Concrete volume", value: `${cft.toFixed(1)} cft`, sub: `${m3.toFixed(2)} m³` },
        ],
        note: "Uses the standard dry-volume factor of 1.54. This is an estimate for ordering material; structural work should follow your engineer's design.",
      };
    },
  },
  waterTank: {
    fields: [
      { k: "shape", type: "select", label: "Tank shape", def: "rect", options: [["rect", "Box / rectangular"], ["cyl", "Round (cylinder)"]] },
      { k: "a", type: "num", label: "Length, or diameter for a round tank", def: "6", suffix: "ft" },
      { k: "b", type: "num", label: "Width (box tanks only)", def: "5", suffix: "ft" },
      { k: "h", type: "num", label: "Water depth", def: "5", suffix: "ft" },
      { k: "use", type: "num", label: "Water your home uses per day (optional)", def: "", suffix: "litres", hint: "A family of four uses roughly 300–500 litres a day." },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b), h = n(v.h);
      const cft = v.shape === "cyl" ? Math.PI * (a / 2) ** 2 * h : a * b * h;
      if (!(cft > 0)) return { error: "Enter the tank's measurements." };
      const L = cft * 28.3168;
      const items = [
        { label: "Capacity", value: `${groupAsian(L)} litres`, emphasize: true },
        { label: "Volume", value: `${cft.toFixed(1)} cft`, sub: `${(L / 1000).toFixed(2)} m³` },
        { label: "Water tankers to fill", value: `${(L / 6000).toFixed(1)}`, sub: "at 6,000 L per tanker" },
      ];
      if (n(v.use) > 0) items.push({ label: "Lasts about", value: `${(L / n(v.use)).toFixed(1)} days` } as never);
      return { items };
    },
  },
  electricity: {
    fields: [
      { k: "list", type: "text", label: "Appliances: name, watts, hours per day (one per line)", def: "Fridge 150 24\nTV 100 4\nRice cooker 700 1\nLED bulbs 50 6\nWater pump 750 0.5", rows: 6, hint: "The watt rating is on the label or in the manual." },
      { k: "days", type: "num", label: "Days in the month", def: "30" },
      { k: "rate", type: "num", label: "Rate per unit (kWh)", def: "", suffix: "Rs", hint: "Look at your NEA bill: rate per unit depends on how many units you use." },
    ],
    compute: (v) => {
      const rows: string[][] = [];
      let total = 0;
      for (const line of v.list.split("\n")) {
        const m = line.trim().match(/^(.*?)\s+([\d.]+)\s+([\d.]+)$/);
        if (!m) continue;
        const kwh = (Number(m[2]) * Number(m[3]) * n(v.days)) / 1000;
        total += kwh;
        rows.push([m[1] || "Appliance", `${m[2]} W × ${m[3]} h`, `${kwh.toFixed(1)} units`]);
      }
      if (!rows.length) return { error: "Add appliances like: Fridge 150 24" };
      const rate = n(v.rate);
      const items = [{ label: "Units per month", value: `${total.toFixed(1)} kWh`, emphasize: rate <= 0 }];
      if (rate > 0) items.unshift({ label: "Estimated bill", value: rs(total * rate), emphasize: true, sub: "before service charge" } as never);
      return { items, table: { head: ["Appliance", "Use", "Units / month"], rows }, note: "A fridge runs its compressor only part of the time, so its real use is usually lower than watts × 24 hours." };
    },
  },
  dharni: {
    fields: [
      { k: "q", type: "num", label: "Amount", def: "1" },
      { k: "u", type: "select", label: "Unit", def: "dharni", options: [["dharni", "Dharni (धार्नी)"], ["ser", "Ser (सेर)"], ["pau", "Pau (पाउ)"], ["chatak", "Chatak (छटाक)"], ["kg", "Kilogram"], ["g", "Gram"]] },
      { k: "pau", type: "num", label: "1 pau in grams", def: "200", hint: "Traditionally about 199.6 g. Most shops round to 200 g; change it if yours uses another value." },
    ],
    compute: (v) => {
      const p = n(v.pau);
      const g: Record<string, number> = { dharni: p * 12, ser: p * 4, pau: p, chatak: p / 4, kg: 1000, g: 1 };
      const grams = n(v.q) * g[v.u];
      if (!(grams > 0) || !(p > 0)) return { error: "Enter an amount." };
      const f = (x: number) => (x >= 100 ? x.toFixed(0) : x >= 1 ? x.toFixed(2) : x.toFixed(3));
      return {
        items: [
          { label: "Kilograms", value: `${f(grams / 1000)} kg`, emphasize: v.u !== "kg" },
          { label: "Dharni", value: f(grams / g.dharni), emphasize: v.u === "kg" },
          { label: "Ser", value: f(grams / g.ser) },
          { label: "Pau", value: f(grams / g.pau) },
          { label: "Chatak", value: f(grams / g.chatak) },
        ],
        note: "1 dharni = 3 ser = 12 pau, and 1 pau = 4 chatak.",
      };
    },
  },
  muriPathi: {
    fields: [
      { k: "q", type: "num", label: "Amount", def: "1" },
      { k: "u", type: "select", label: "Unit", def: "pathi", options: [["muri", "Muri (मुरी)"], ["pathi", "Pathi (पाथी)"], ["mana", "Mana (माना)"], ["muthi", "Muthi (मुठी)"], ["l", "Litre"]] },
      { k: "mana", type: "num", label: "1 mana in litres", def: "0.568", hint: "The standard mana is 0.568 L. Village measures can differ a little." },
    ],
    compute: (v) => {
      const m = n(v.mana);
      const L: Record<string, number> = { muri: m * 160, pathi: m * 8, mana: m, muthi: m / 10, l: 1 };
      const litres = n(v.q) * L[v.u];
      if (!(litres > 0) || !(m > 0)) return { error: "Enter an amount." };
      const f = (x: number) => (x >= 100 ? x.toFixed(0) : x >= 1 ? x.toFixed(2) : x.toFixed(3));
      return {
        items: [
          { label: "Litres", value: `${f(litres)} L`, emphasize: v.u !== "l" },
          { label: "Muri", value: f(litres / L.muri) },
          { label: "Pathi", value: f(litres / L.pathi), emphasize: v.u === "l" },
          { label: "Mana", value: f(litres / L.mana) },
          { label: "Muthi", value: f(litres / L.muthi) },
        ],
        note: "1 muri = 20 pathi, 1 pathi = 8 mana, 1 mana = 10 muthi. These measure volume, so the weight depends on the grain: a pathi of rice weighs more than a pathi of paddy (dhaan).",
      };
    },
  },
  mileage: {
    fields: [
      { k: "km", type: "num", label: "Distance since last full tank", def: "220", suffix: "km", hint: "Fill the tank full, reset the trip meter, and fill full again next time." },
      { k: "l", type: "num", label: "Fuel needed to fill up again", def: "5", suffix: "litres" },
      { k: "price", type: "num", label: "Fuel price (optional)", def: "", suffix: "Rs / L", hint: "Today's Nepal Oil Corporation price for your area." },
      { k: "month", type: "num", label: "Km you ride per month (optional)", def: "", suffix: "km" },
    ],
    compute: (v) => {
      const km = n(v.km), l = n(v.l), p = n(v.price), mo = n(v.month);
      if (!(km > 0) || !(l > 0)) return { error: "Enter the distance and the litres." };
      const kpl = km / l;
      const items = [
        { label: "Mileage", value: `${kpl.toFixed(1)} km/L`, emphasize: true },
        { label: "Litres per 100 km", value: `${(100 / kpl).toFixed(2)} L` },
      ];
      if (p > 0) items.push({ label: "Cost per km", value: `Rs ${(p / kpl).toFixed(2)}` } as never);
      if (p > 0 && mo > 0) items.push({ label: "Fuel cost per month", value: rs((mo / kpl) * p) } as never);
      return { items };
    },
  },
  travelTime: {
    fields: [
      { k: "d", type: "num", label: "Distance", def: "200", suffix: "km" },
      { k: "s", type: "num", label: "Average speed", def: "35", suffix: "km/h", hint: "On Nepal's highways, 30–40 km/h is a realistic average for a bus or car." },
      { k: "stop", type: "num", label: "Stops (tea, lunch)", def: "45", suffix: "minutes" },
      { k: "dep", type: "time", label: "Leaving at", def: "07:00" },
    ],
    compute: (v) => {
      const d = n(v.d), s = n(v.s);
      if (!(d > 0) || !(s > 0)) return { error: "Enter distance and speed." };
      const mins = Math.round((d / s) * 60 + n(v.stop));
      const [hh, mm] = (v.dep || "00:00").split(":").map(Number);
      const arr = hh * 60 + mm + mins, dayAdd = Math.floor(arr / 1440), am = arr % 1440;
      const clock = new Date(2000, 0, 1, Math.floor(am / 60), am % 60).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      return {
        items: [
          { label: "You arrive around", value: clock, emphasize: true, sub: dayAdd ? `${dayAdd === 1 ? "next day" : `${dayAdd} days later`}` : "same day" },
          { label: "Total travel time", value: `${Math.floor(mins / 60)} h ${mins % 60} min` },
          { label: "Driving time", value: `${Math.floor((d / s))} h ${Math.round(((d / s) % 1) * 60)} min` },
        ],
      };
    },
  },
  unitPrice: {
    fields: [
      { k: "pa", type: "num", label: "Pack A price", def: "175", suffix: "Rs" },
      { k: "qa", type: "num", label: "Pack A size", def: "500" },
      { k: "pb", type: "num", label: "Pack B price", def: "320", suffix: "Rs" },
      { k: "qb", type: "num", label: "Pack B size", def: "1000" },
      { k: "u", type: "select", label: "Size is in", def: "g", options: [["g", "grams"], ["kg", "kg"], ["ml", "ml"], ["l", "litres"], ["pc", "pieces"]] },
    ],
    cols: 2,
    compute: (v) => {
      const a = n(v.pa) / n(v.qa), b = n(v.pb) / n(v.qb);
      if (!(a > 0) || !(b > 0)) return { error: "Enter both prices and sizes." };
      const per = v.u === "g" || v.u === "ml" ? 100 : 1, lbl = v.u === "g" ? "100 g" : v.u === "ml" ? "100 ml" : v.u === "pc" ? "piece" : v.u;
      const cheap = a === b ? "Same price" : a < b ? "Pack A" : "Pack B";
      const save = (Math.abs(a - b) / Math.max(a, b)) * 100;
      return {
        items: [
          { label: "Better value", value: cheap, emphasize: true, sub: a === b ? undefined : `${save.toFixed(1)}% cheaper per ${lbl}` },
          { label: `Pack A per ${lbl}`, value: `Rs ${(a * per).toFixed(2)}` },
          { label: `Pack B per ${lbl}`, value: `Rs ${(b * per).toFixed(2)}` },
        ],
      };
    },
  },
  luckyDraw: {
    fields: [
      { k: "names", type: "text", label: "Names or ticket numbers (one per line)", def: "Sita\nRam\nHari\nGita\nBikash\nAnita\nSuman", rows: 7 },
      { k: "w", type: "num", label: "How many winners", def: "1" },
      { k: "draw", type: "num", label: "Draw number", def: "1", hint: "Change this number to draw again. The same list and number always give the same result, so others can check it." },
    ],
    compute: (v) => {
      const list = Array.from(new Set(v.names.split("\n").map((s) => s.trim()).filter(Boolean)));
      const w = Math.floor(n(v.w));
      if (list.length < 2) return { error: "Add at least two names." };
      if (!(w >= 1) || w > list.length) return { error: `Choose between 1 and ${list.length} winners.` };
      let seed = 2166136261;
      for (const ch of list.join("|") + "#" + v.draw) seed = Math.imul(seed ^ ch.charCodeAt(0), 16777619) >>> 0;
      const rnd = () => { seed = (seed + 0x6d2b79f5) >>> 0; let x = seed; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
      const pool = [...list];
      for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
      const win = pool.slice(0, w);
      return {
        items: win.map((name, i) => ({ label: w === 1 ? "Winner" : `Winner ${i + 1}`, value: name, emphasize: i === 0 })),
        note: `Picked from ${list.length} entries. Duplicate names are counted once.`,
        copy: win.map((x, i) => `${i + 1}. ${x}`).join("\n"),
      };
    },
  },
  workHours: {
    fields: [
      { k: "in", type: "time", label: "Start time", def: "09:30" },
      { k: "out", type: "time", label: "Finish time", def: "17:30" },
      { k: "brk", type: "num", label: "Break", def: "30", suffix: "minutes" },
      { k: "days", type: "num", label: "Days worked like this", def: "6" },
      { k: "rate", type: "num", label: "Pay per hour (optional)", def: "", suffix: "Rs" },
    ],
    compute: (v) => {
      const t = (s: string) => { const [h, m] = (s || "0:0").split(":").map(Number); return h * 60 + m; };
      let mins = t(v.out) - t(v.in);
      if (mins <= 0) mins += 1440;
      mins -= n(v.brk);
      if (!(mins > 0)) return { error: "The break is longer than the shift." };
      const d = Math.max(1, Math.floor(n(v.days))), tot = mins * d;
      const fmt = (x: number) => `${Math.floor(x / 60)} h ${x % 60} min`;
      const items = [
        { label: "Hours per day", value: fmt(mins), emphasize: true, sub: `${(mins / 60).toFixed(2)} hours` },
        { label: `Total for ${d} day${d > 1 ? "s" : ""}`, value: fmt(tot), sub: `${(tot / 60).toFixed(2)} hours` },
      ];
      if (n(v.rate) > 0) items.push({ label: "Pay", value: rs((tot / 60) * n(v.rate)) } as never);
      if (tot / 60 > 48) items.push({ label: "Over 48 hours a week", value: fmt(tot - 2880), sub: "counts as overtime under the Labour Act" } as never);
      return { items };
    },
  },
  nepaliDigits: {
    fields: [
      { k: "dir", type: "select", label: "Convert", def: "toNp", options: [["toNp", "English digits → Nepali (123 → १२३)"], ["toEn", "Nepali digits → English (१२३ → 123)"]] },
      { k: "text", type: "text", label: "Text or numbers", def: "Phone: 9841234567, Date: 2082-08-11, Amount: Rs 25,000", rows: 4 },
    ],
    cols: 1,
    compute: (v) => {
      const NP = "०१२३४५६७८९";
      const out = v.dir === "toNp" ? v.text.replace(/\d/g, (c) => NP[Number(c)]) : v.text.replace(/[०-९]/g, (c) => String(NP.indexOf(c)));
      if (!v.text.trim()) return { error: "Type or paste some text." };
      return { items: [{ label: "Result", value: out, emphasize: true }], copy: out };
    },
  },
  lpg: {
    fields: [
      { k: "start", type: "addate", label: "Day you started this cylinder", def: "today" },
      { k: "last", type: "num", label: "How many days your last cylinder lasted", def: "35", suffix: "days" },
      { k: "price", type: "num", label: "Refill price (optional)", def: "", suffix: "Rs", hint: "Enter what you paid for your last refill." },
    ],
    compute: (v) => {
      const s = new Date(v.start + "T00:00:00"), L = n(v.last);
      if (isNaN(s.getTime()) || !(L > 0)) return { error: "Enter a start date and how long a cylinder lasts." };
      const end = new Date(s.getTime() + L * DAY), left = days(todayAd(), end);
      const items = [
        { label: "Likely to run out", value: adToBsLabel(end), emphasize: true, sub: adLabel(end) },
        { label: "Days left", value: left >= 0 ? plural(left, "day") : "Should be empty by now" },
        { label: "Refills per year", value: (365 / L).toFixed(1) },
      ];
      if (n(v.price) > 0) items.push({ label: "Gas cost per month", value: rs((n(v.price) * 30) / L), sub: `${rs((n(v.price) * 365) / L)} a year` } as never);
      return { items, note: "Book your refill 3–4 days before the date above, especially around Dashain and Tihar when supply gets tight." };
    },
  },

  /* ---------- batch 5: students & health ---------- */
  marksPercent: {
    fields: [
      { k: "marks", type: "text", label: "Marks per subject: obtained and full marks (one per line)", def: "English 78 100\nNepali 65 100\nMath 88 100\nScience 72 100\nSocial 69 100", rows: 7, hint: "Subject name is optional. \"78 100\" works too." },
    ],
    cols: 1,
    compute: (v) => {
      const grade = (p: number) => p >= 90 ? ["A+", "4.0"] : p >= 80 ? ["A", "3.6"] : p >= 70 ? ["B+", "3.2"] : p >= 60 ? ["B", "2.8"] : p >= 50 ? ["C+", "2.4"] : p >= 40 ? ["C", "2.0"] : p >= 35 ? ["D", "1.6"] : ["NG", "0"];
      const rows: string[][] = [];
      let got = 0, full = 0;
      v.marks.split("\n").forEach((line, i) => {
        const m = line.trim().match(/^(.*?)\s*([\d.]+)\s+([\d.]+)$/);
        if (!m || !(Number(m[3]) > 0)) return;
        const p = (Number(m[2]) / Number(m[3])) * 100;
        got += Number(m[2]); full += Number(m[3]);
        rows.push([m[1] || `Subject ${i + 1}`, `${m[2]} / ${m[3]}`, `${p.toFixed(1)}%`, grade(p)[0]]);
      });
      if (!rows.length) return { error: "Enter marks like: Math 88 100" };
      const pct = (got / full) * 100, [g, gpa] = grade(pct);
      return {
        items: [
          { label: "Percentage", value: `${pct.toFixed(2)}%`, emphasize: true },
          { label: "Total marks", value: `${got} / ${full}` },
          { label: "Grade (NEB scale)", value: g, sub: `grade point ${gpa}` },
        ],
        table: { head: ["Subject", "Marks", "%", "Grade"], rows },
        note: "Grades use the NEB letter-grade bands (A+ 90 and above … D 35–40, NG below 35). Your official GPA is worked out from each subject's credit hours; use the SEE or NEB GPA calculator for that.",
      };
    },
  },
  attendance: {
    fields: [
      { k: "a", type: "num", label: "Classes attended", def: "52" },
      { k: "t", type: "num", label: "Classes held so far", def: "75" },
      { k: "p", type: "num", label: "Required attendance", def: "75", suffix: "%", hint: "Check your college rules. TU and many boards require 75–80%." },
    ],
    compute: (v) => {
      const a = n(v.a), t = n(v.t), p = n(v.p) / 100;
      if (!(t > 0) || a < 0 || a > t || !(p > 0 && p < 1)) return { error: "Attended must be between 0 and the classes held." };
      const now = a / t;
      const items: Array<{ label: string; value: string; sub?: string; emphasize?: boolean }> = [{ label: "Your attendance", value: `${(now * 100).toFixed(1)}%`, emphasize: true, sub: now >= p ? "above the requirement" : "below the requirement" }];
      if (now >= p) items.push({ label: "Classes you can still miss", value: String(Math.floor(a / p - t)), sub: "and stay at the required %" });
      else items.push({ label: "Attend in a row to recover", value: `${Math.ceil((p * t - a) / (1 - p))} classes`, sub: `to reach ${n(v.p)}%` });
      return { items };
    },
  },
  ratio: {
    fields: [
      { k: "a", type: "num", label: "First number", def: "450" },
      { k: "b", type: "num", label: "Second number", def: "750" },
      { k: "amt", type: "num", label: "Amount to divide in this ratio (optional)", def: "", hint: "For example, profit to split between partners." },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b);
      if (!(a > 0) || !(b > 0)) return { error: "Enter two positive numbers." };
      const dec = Math.max(...[v.a, v.b].map((s) => (s.split(".")[1] || "").length));
      const A = Math.round(a * 10 ** dec), B = Math.round(b * 10 ** dec);
      const g = gcd(A, B);
      const items = [
        { label: "Simplest ratio", value: `${A / g} : ${B / g}`, emphasize: true },
        { label: "As 1 : x", value: `1 : ${(b / a).toFixed(3).replace(/\.?0+$/, "")}` },
        { label: "Shares", value: `${((a / (a + b)) * 100).toFixed(1)}% : ${((b / (a + b)) * 100).toFixed(1)}%` },
      ];
      const amt = n(v.amt);
      if (amt > 0) items.push({ label: "Split of the amount", value: `${groupAsian((amt * a) / (a + b))} and ${groupAsian((amt * b) / (a + b))}` });
      return { items };
    },
  },
  average: {
    fields: [{ k: "nums", type: "text", label: "Numbers (separated by commas, spaces or new lines)", def: "72, 85, 64, 90, 85, 78, 69", rows: 4 }],
    cols: 1,
    compute: (v) => {
      const xs = (v.nums.match(/-?\d+(\.\d+)?/g) || []).map(Number);
      if (xs.length < 1) return { error: "Enter some numbers." };
      const s = [...xs].sort((a, b) => a - b), N = xs.length, sum = xs.reduce((a, b) => a + b, 0), mean = sum / N;
      const med = N % 2 ? s[(N - 1) / 2] : (s[N / 2 - 1] + s[N / 2]) / 2;
      const freq = new Map<number, number>();
      xs.forEach((x) => freq.set(x, (freq.get(x) || 0) + 1));
      const top = Math.max(...Array.from(freq.values()));
      const modes = top > 1 ? Array.from(freq.entries()).filter(([, c]) => c === top).map(([x]) => x) : [];
      const sd = Math.sqrt(xs.reduce((a, x) => a + (x - mean) ** 2, 0) / N);
      const f = (x: number) => String(Number(x.toFixed(4)));
      return {
        items: [
          { label: "Average (mean)", value: f(mean), emphasize: true },
          { label: "Median", value: f(med) },
          { label: "Mode", value: modes.length ? modes.map(f).join(", ") : "No repeated value" },
          { label: "Range", value: `${f(s[N - 1] - s[0])}`, sub: `${f(s[0])} to ${f(s[N - 1])}` },
          { label: "Sum", value: f(sum), sub: `${N} numbers` },
          { label: "Standard deviation", value: f(sd), sub: "population" },
        ],
      };
    },
  },
  lcmHcf: {
    fields: [{ k: "nums", type: "text", label: "Whole numbers (two or more)", def: "12, 18, 30", rows: 2 }],
    cols: 1,
    compute: (v) => {
      const xs = (v.nums.match(/\d+/g) || []).map(Number).filter((x) => x > 0);
      if (xs.length < 2) return { error: "Enter at least two whole numbers." };
      if (xs.some((x) => x > 1e9)) return { error: "Use numbers below 1,000,000,000." };
      const h = xs.reduce(gcd);
      const l = xs.reduce((a, b) => (a / gcd(a, b)) * b);
      const fac = (x: number) => { const out: number[] = []; for (let p = 2; p * p <= x; p++) while (x % p === 0) { out.push(p); x /= p; } if (x > 1) out.push(x); return out.join(" × ") || "1"; };
      return {
        items: [
          { label: "HCF (GCD)", value: String(h), emphasize: true },
          { label: "LCM", value: Number.isSafeInteger(l) ? String(l) : l.toExponential(4), emphasize: true },
        ],
        table: { head: ["Number", "Prime factors"], rows: xs.map((x) => [String(x), fac(x)]) },
      };
    },
  },
  area: {
    fields: [
      { k: "shape", type: "select", label: "Shape", def: "rect", options: [["rect", "Rectangle"], ["square", "Square"], ["circle", "Circle"], ["tri", "Triangle (base and height)"], ["tri3", "Triangle (three sides)"], ["trap", "Trapezium"], ["para", "Parallelogram"]] },
      { k: "a", type: "num", label: "a: length, side, radius or base", def: "12" },
      { k: "b", type: "num", label: "b: width or height", def: "8", hint: "Not needed for a square or circle." },
      { k: "c", type: "num", label: "c: third side, or second parallel side", def: "10", hint: "Only for a three-sided triangle or a trapezium." },
      { k: "u", type: "select", label: "Units", def: "ft", options: [["m", "metres"], ["ft", "feet"], ["cm", "cm"], ["in", "inches"]] },
    ],
    compute: (v) => {
      const a = n(v.a), b = n(v.b), c = n(v.c), u = v.u;
      let A = NaN, P = NaN;
      switch (v.shape) {
        case "rect": A = a * b; P = 2 * (a + b); break;
        case "square": A = a * a; P = 4 * a; break;
        case "circle": A = Math.PI * a * a; P = 2 * Math.PI * a; break;
        case "tri": A = 0.5 * a * b; break;
        case "tri3": { const s = (a + b + c) / 2; const q = s * (s - a) * (s - b) * (s - c); if (q > 0) { A = Math.sqrt(q); P = a + b + c; } break; }
        case "trap": A = ((a + c) / 2) * b; break;
        case "para": A = a * b; break;
      }
      if (!(A > 0)) return { error: v.shape === "tri3" ? "Those three sides can't make a triangle." : "Enter the measurements." };
      const items: Array<{ label: string; value: string; sub?: string; emphasize?: boolean }> = [{ label: "Area", value: `${Number(A.toFixed(3))} sq ${u}`, emphasize: true }];
      if (P > 0) items.push({ label: v.shape === "circle" ? "Circumference" : "Perimeter", value: `${Number(P.toFixed(3))} ${u}` });
      if (u === "ft") items.push({ label: "In square metres", value: `${(A / 10.7639).toFixed(3)} m²` });
      if (u === "m") items.push({ label: "In square feet", value: `${(A * 10.7639).toFixed(2)} sq ft` });
      return { items };
    },
  },
  bmr: {
    fields: [
      { k: "sex", type: "select", label: "Sex", def: "m", options: [["m", "Male"], ["f", "Female"]] },
      { k: "age", type: "num", label: "Age", def: "28", suffix: "years" },
      { k: "kg", type: "num", label: "Weight", def: "65", suffix: "kg" },
      { k: "cm", type: "num", label: "Height", def: "168", suffix: "cm", hint: "5 ft 6 in ≈ 168 cm." },
      { k: "act", type: "select", label: "Daily activity", def: "1.375", options: [["1.2", "Mostly sitting"], ["1.375", "Light (walking, light exercise 1–3 days)"], ["1.55", "Moderate (exercise 3–5 days)"], ["1.725", "Very active (hard exercise or physical work)"]] },
    ],
    compute: (v) => {
      const kg = n(v.kg), cm = n(v.cm), age = n(v.age);
      if (!(kg > 0) || !(cm > 0) || !(age > 0)) return { error: "Enter age, weight and height." };
      const bmr = 10 * kg + 6.25 * cm - 5 * age + (v.sex === "m" ? 5 : -161), tdee = bmr * n(v.act);
      return {
        items: [
          { label: "Calories to stay the same weight", value: `${groupAsian(tdee)} kcal/day`, emphasize: true },
          { label: "BMR (at complete rest)", value: `${groupAsian(bmr)} kcal/day` },
          { label: "To lose about 0.5 kg a week", value: `${groupAsian(tdee - 500)} kcal/day` },
          { label: "To gain about 0.5 kg a week", value: `${groupAsian(tdee + 500)} kcal/day` },
        ],
        note: "Uses the Mifflin-St Jeor formula. For reference, a plate of dal bhat with tarkari is roughly 600–800 kcal. This is general guidance, not medical advice.",
      };
    },
  },
  water: {
    fields: [
      { k: "kg", type: "num", label: "Body weight", def: "60", suffix: "kg" },
      { k: "ex", type: "num", label: "Exercise or hard physical work", def: "30", suffix: "minutes / day" },
      { k: "hot", type: "select", label: "Weather", def: "mild", options: [["mild", "Mild (hills, winter)"], ["hot", "Hot (Terai summer)"]] },
    ],
    compute: (v) => {
      const kg = n(v.kg);
      if (!(kg > 0)) return { error: "Enter your weight." };
      const L = kg * 0.033 + (n(v.ex) / 30) * 0.35 + (v.hot === "hot" ? 0.5 : 0);
      return {
        items: [
          { label: "Water to drink per day", value: `${L.toFixed(1)} litres`, emphasize: true },
          { label: "Glasses (250 ml)", value: String(Math.round(L / 0.25)) },
          { label: "1-litre bottles", value: (L).toFixed(1) },
        ],
        note: "A general guide for healthy adults. Tea, soups and fruit count too. People with kidney or heart conditions should follow their doctor's advice.",
      };
    },
  },

};

export default function FormulaTool({ id, rates }: { id: string; rates?: RatesData }) {
  const cfg = CONFIGS[id];
  if (!cfg) return null;
  return <FormulaView config={cfg} rates={rates} />;
}

export const _rs = rs;
