"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import NepaliDate from "nepali-date-converter";
import type { User } from "@supabase/supabase-js";
import { Award, CalendarClock, Flame, Plus, PiggyBank, Trash2, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { BS_MONTHS, BS_MONTHS_NP, WEEKDAYS_FULL_NP, toNpDigits } from "@/lib/nepali";
import { RecentTools } from "@/lib/userTools";

export type DashRates = {
  gold: number; goldPrev: number | null; silver: number;
  usd: number; usdPrev: number | null; fxDate: string | null;
  fx: { iso3: string; name: string; unit: number; buy: number; sell: number }[];
};

const uid = () => Math.random().toString(36).slice(2, 10);
const rs = (v: number) => `Rs ${Math.round(v).toLocaleString("en-IN")}`;
async function saveMeta(data: Record<string, unknown>) {
  const { error } = (await supabase()?.auth.updateUser({ data })) ?? {};
  return !error;
}
function nepalToday() {
  const n = new Date(Date.now() + 345 * 60000);
  return new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
}
const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/* ---------- streak ---------- */
type Streak = { last: string; count: number; best: number; visits: number };
function useStreak(user: User) {
  const [s, setS] = useState<Streak | null>((user.user_metadata?.streak as Streak) || null);
  useEffect(() => {
    const today = isoOf(nepalToday());
    const cur = (user.user_metadata?.streak as Streak) || null;
    if (cur?.last === today) return;
    const y = new Date(nepalToday()); y.setDate(y.getDate() - 1);
    const count = cur?.last === isoOf(y) ? cur.count + 1 : 1;
    const next = { last: today, count, best: Math.max(count, cur?.best || 0), visits: (cur?.visits || 0) + 1 };
    setS(next);
    saveMeta({ streak: next });
  }, [user]);
  return s;
}

function Change({ now, prev, money }: { now: number; prev: number | null; money: (v: number) => string }) {
  if (prev == null || prev === now) return <span className="text-xs text-ink-500">{prev == null ? "" : "no change since yesterday"}</span>;
  const up = now > prev;
  const I = up ? TrendingUp : TrendingDown;
  return <span className="inline-flex items-center gap-1 text-xs text-ink-600 dark:text-ink-300"><I className="h-3.5 w-3.5" aria-hidden /> {up ? "up" : "down"} {money(Math.abs(now - prev))} since yesterday</span>;
}

/* ---------- today panel ---------- */
export function TodayPanel({ user, rates }: { user: User; rates: DashRates }) {
  const streak = useStreak(user);
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);
  const name = ((user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "").split(" ")[0];
  const t = nepalToday();
  const bs = new NepaliDate(t);
  const hour = now ? new Date(now.getTime() + now.getTimezoneOffset() * 60000 + 345 * 60000).getHours() : 9;
  const greet = hour < 12 ? "शुभ प्रभात" : hour < 17 ? "नमस्ते" : "शुभ सन्ध्या";
  const favs = RecentTools.favorites().length;
  const alerts = Array.isArray(user.user_metadata?.alerts) ? user.user_metadata.alerts.length : 0;
  const badges = [
    { on: (streak?.best || 0) >= 3, t: "3-day streak" },
    { on: (streak?.best || 0) >= 7, t: "7-day streak" },
    { on: (streak?.best || 0) >= 30, t: "30-day streak" },
    { on: favs >= 3, t: "Saved 3 tools" },
    { on: alerts >= 1, t: "First price alert" },
    { on: (streak?.visits || 0) >= 10, t: "10 visits" },
  ];
  return (
    <section className="card overflow-hidden">
      <div className="dhaka bg-navy-950 p-6 text-white">
        <p className="devanagari text-saffron-300">{greet}{name ? `, ${name}` : ""}</p>
        <p className="mt-1 text-2xl font-extrabold devanagari">{toNpDigits(bs.getYear())} {BS_MONTHS_NP[bs.getMonth()]} {toNpDigits(bs.getDate())}, {WEEKDAYS_FULL_NP[t.getDay()]}</p>
        <p className="text-sm text-white/70">{bs.getDate()} {BS_MONTHS[bs.getMonth()]} {bs.getYear()} · {t.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-3">
        <Link href="/gold-price-in-nepal" className="rounded-2xl border border-ink-200 p-4 hover:border-brand-300 dark:border-ink-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Fine gold / tola</p>
          <p className="mt-1 text-xl font-extrabold tnum">{rs(rates.gold)}</p>
          <Change now={rates.gold} prev={rates.goldPrev} money={rs} />
        </Link>
        <Link href="/usd-to-npr" className="rounded-2xl border border-ink-200 p-4 hover:border-brand-300 dark:border-ink-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">1 US dollar (NRB sell)</p>
          <p className="mt-1 text-xl font-extrabold tnum">Rs {rates.usd.toFixed(2)}</p>
          <Change now={rates.usd} prev={rates.usdPrev} money={(v) => `Rs ${v.toFixed(2)}`} />
        </Link>
        <div className="rounded-2xl border border-ink-200 p-4 dark:border-ink-800">
          <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-500"><Flame className="h-3.5 w-3.5 text-saffron-500" aria-hidden /> Visit streak</p>
          <p className="mt-1 text-xl font-extrabold tnum">{streak ? `${streak.count} day${streak.count === 1 ? "" : "s"}` : "—"}</p>
          <span className="text-xs text-ink-500">Best: {streak?.best || 0} days. Come back tomorrow!</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-ink-100 px-6 py-4 dark:border-ink-800">
        <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-ink-500"><Award className="h-4 w-4" aria-hidden /> Badges</span>
        {badges.map((b) => (
          <span key={b.t} className={`rounded-full px-3 py-1 text-xs font-semibold ${b.on ? "bg-saffron-100 text-saffron-900 dark:bg-saffron-900/40 dark:text-saffron-200" : "bg-ink-100 text-ink-400 dark:bg-ink-800 dark:text-ink-500"}`} title={b.on ? "Earned" : "Not yet"}>
            {b.on ? "★ " : ""}{b.t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------- wallet ---------- */
type Holding = { id: string; kind: string; qty: number; cost?: number };
export function MyWallet({ user, rates }: { user: User; rates: DashRates }) {
  const [items, setItems] = useState<Holding[]>(Array.isArray(user.user_metadata?.holdings) ? user.user_metadata.holdings : []);
  const [kind, setKind] = useState("gold");
  const [qty, setQty] = useState("");
  const [cost, setCost] = useState("");
  const options = useMemo(() => [
    ["gold", "Fine gold (tola)"], ["silver", "Silver (tola)"],
    ...rates.fx.map((f) => [f.iso3, `${f.iso3}: ${f.name}`]),
  ] as [string, string][], [rates.fx]);
  const valueOf = (h: Holding) => {
    if (h.kind === "gold") return h.qty * rates.gold;
    if (h.kind === "silver") return h.qty * rates.silver;
    const f = rates.fx.find((x) => x.iso3 === h.kind);
    return f ? (h.qty * f.buy) / f.unit : 0;
  };
  const unitOf = (k: string) => (k === "gold" || k === "silver" ? "tola" : k);
  const total = items.reduce((a, h) => a + valueOf(h), 0);
  const costed = items.filter((h) => h.cost);
  const gain = costed.reduce((a, h) => a + valueOf(h) - (h.cost || 0), 0);
  async function persist(next: Holding[]) { setItems(next); await saveMeta({ holdings: next }); }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const q = Number(qty);
    if (!(q > 0) || items.length >= 20) return;
    const c = Number(cost);
    persist([...items, { id: uid(), kind, qty: q, ...(c > 0 ? { cost: c } : {}) }]);
    setQty(""); setCost("");
  }
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold"><Wallet className="h-5 w-5 text-brand-600" aria-hidden /> My gold, silver and foreign cash</h2>
      <p className="mt-1 text-sm text-ink-500">Add what you own and see what it&apos;s worth today. Values update every hour with FENEGOSIDA and Nepal Rastra Bank rates. Foreign cash uses the bank buying rate.</p>
      {items.length > 0 && (
        <>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-2 rounded-2xl bg-ink-50 p-4 dark:bg-ink-800/50">
            <div><p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Worth today</p><p className="text-2xl font-extrabold tnum">{rs(total)}</p></div>
            {costed.length > 0 && <p className="text-sm font-semibold tnum">{gain >= 0 ? "▲ Gain" : "▼ Loss"} {rs(Math.abs(gain))}<span className="block text-xs font-normal text-ink-500">on items with a purchase price</span></p>}
          </div>
          <ul className="mt-3 space-y-2">
            {items.map((h) => {
              const v = valueOf(h);
              return (
                <li key={h.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 px-4 py-3 text-sm dark:border-ink-800">
                  <span><b>{h.qty} {unitOf(h.kind)}</b> {h.kind === "gold" ? "fine gold" : h.kind === "silver" ? "silver" : ""}
                    {h.cost ? <span className="block text-xs text-ink-500">Bought for {rs(h.cost)} · {v >= h.cost ? "up" : "down"} {rs(Math.abs(v - h.cost))}</span> : null}</span>
                  <span className="flex items-center gap-2"><b className="tnum">{rs(v)}</b>
                    <button aria-label="Remove" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" onClick={() => persist(items.filter((x) => x.id !== h.id))}><Trash2 className="h-4 w-4" /></button></span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1.3fr_1fr_1fr_auto]">
        <select className="input" aria-label="What you own" value={kind} onChange={(e) => setKind(e.target.value)}>
          {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <input className="input" inputMode="decimal" aria-label="Amount" placeholder={`Amount (${unitOf(kind)})`} value={qty} onChange={(e) => setQty(e.target.value)} />
        <input className="input" inputMode="decimal" aria-label="What you paid (optional)" placeholder="Paid Rs (optional)" value={cost} onChange={(e) => setCost(e.target.value)} />
        <button className="btn-primary justify-center"><Plus className="h-4 w-4" aria-hidden /> Add</button>
      </form>
      <p className="mt-2 text-xs text-ink-400">Only you can see this. Shops pay less than the fixing rate when buying back gold.</p>
    </section>
  );
}

/* ---------- bills ---------- */
type Bill = { id: string; label: string; d: number; amount?: number; lastFor?: string };
function monthDays(y: number, m: number) {
  for (let d = 32; d >= 29; d--) { try { const nd = new NepaliDate(y, m, d); if (nd.getMonth() === m && nd.getDate() === d) return d; } catch {} }
  return 30;
}
function nextDue(d: number) {
  const today = nepalToday();
  const t = new NepaliDate(today);
  let y = t.getYear(), m = t.getMonth();
  for (let i = 0; i < 2; i++) {
    const day = Math.min(d, monthDays(y, m));
    const js = new NepaliDate(y, m, day).toJsDate(); js.setHours(0, 0, 0, 0);
    if (js >= today) return { days: Math.round((js.getTime() - today.getTime()) / 864e5), label: `${day} ${BS_MONTHS[m]}` };
    m++; if (m > 11) { m = 0; y++; }
  }
  return null;
}
const BILL_IDEAS = ["House rent (घर भाडा)", "Electricity (NEA)", "Internet / WiFi", "Loan EMI", "Khanepani water", "School fees", "Dhukuti", "Insurance premium"];
export function BillReminders({ user }: { user: User }) {
  const [bills, setBills] = useState<Bill[]>(Array.isArray(user.user_metadata?.bills) ? user.user_metadata.bills : []);
  const [label, setLabel] = useState("");
  const [d, setD] = useState("1");
  const [amount, setAmount] = useState("");
  const sorted = useMemo(() => bills.map((b) => ({ b, n: nextDue(b.d) })).sort((a, c) => (a.n?.days ?? 99) - (c.n?.days ?? 99)), [bills]);
  const monthly = bills.reduce((a, b) => a + (b.amount || 0), 0);
  async function persist(next: Bill[]) { setBills(next); await saveMeta({ bills: next }); }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const day = Math.floor(Number(d));
    if (!label.trim() || !(day >= 1 && day <= 32) || bills.length >= 20) return;
    const a = Number(amount);
    persist([...bills, { id: uid(), label: label.trim().slice(0, 40), d: day, ...(a > 0 ? { amount: a } : {}) }]);
    setLabel(""); setAmount("");
  }
  return (
    <section id="bills" className="card scroll-mt-24 p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold"><CalendarClock className="h-5 w-5 text-saffron-500" aria-hidden /> Bill and payment reminders</h2>
      <p className="mt-1 text-sm text-ink-500">Rent, electricity, EMI, dhukuti: pick the Nepali date (gate) you pay each month. We&apos;ll email you and ring your bell the day before.</p>
      {sorted.length > 0 && (
        <>
          <ul className="mt-4 space-y-2">
            {sorted.map(({ b, n }) => (
              <li key={b.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{b.label}{b.amount ? <span className="font-normal text-ink-500"> · {rs(b.amount)}</span> : null}</p>
                  <p className="text-xs text-ink-500">Every month on <span className="devanagari">{toNpDigits(b.d)} गते</span>{n ? ` · next ${n.label}` : ""}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {n && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${n.days <= 1 ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200"}`}>{n.days === 0 ? "Due today" : n.days === 1 ? "Tomorrow" : `${n.days} days`}</span>}
                  <button aria-label="Delete reminder" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" onClick={() => persist(bills.filter((x) => x.id !== b.id))}><Trash2 className="h-4 w-4" /></button>
                </div>
              </li>
            ))}
          </ul>
          {monthly > 0 && <p className="mt-3 text-sm text-ink-600 dark:text-ink-300">Fixed payments each month: <b className="tnum">{rs(monthly)}</b></p>}
        </>
      )}
      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1.5fr_90px_1fr_auto]">
        <input className="input" list="bill-ideas" placeholder="e.g. House rent" aria-label="What to pay" value={label} onChange={(e) => setLabel(e.target.value)} />
        <datalist id="bill-ideas">{BILL_IDEAS.map((x) => <option key={x} value={x} />)}</datalist>
        <input className="input" inputMode="numeric" aria-label="Nepali date (gate)" placeholder="Gate" value={d} onChange={(e) => setD(e.target.value)} />
        <input className="input" inputMode="decimal" aria-label="Amount (optional)" placeholder="Amount (optional)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className="btn-primary justify-center"><Plus className="h-4 w-4" aria-hidden /> Add</button>
      </form>
    </section>
  );
}

/* ---------- savings goals ---------- */
type Goal = { id: string; label: string; target: number; saved: number };
export function SavingsGoals({ user }: { user: User }) {
  const [goals, setGoals] = useState<Goal[]>(Array.isArray(user.user_metadata?.goals) ? user.user_metadata.goals : []);
  const [label, setLabel] = useState("");
  const [target, setTarget] = useState("");
  const [adding, setAdding] = useState<Record<string, string>>({});
  async function persist(next: Goal[]) { setGoals(next); await saveMeta({ goals: next }); }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const t = Number(target);
    if (!label.trim() || !(t > 0) || goals.length >= 10) return;
    persist([...goals, { id: uid(), label: label.trim().slice(0, 40), target: t, saved: 0 }]);
    setLabel(""); setTarget("");
  }
  function deposit(g: Goal) {
    const v = Number(adding[g.id]);
    if (!v) return;
    persist(goals.map((x) => (x.id === g.id ? { ...x, saved: Math.max(0, x.saved + v) } : x)));
    setAdding({ ...adding, [g.id]: "" });
  }
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold"><PiggyBank className="h-5 w-5 text-brand-600" aria-hidden /> Savings goals</h2>
      <p className="mt-1 text-sm text-ink-500">A new phone, a bike, Dashain shopping, a trip home. Set a target and add money as you save it.</p>
      {goals.length > 0 && (
        <ul className="mt-4 space-y-3">
          {goals.map((g) => {
            const pct = Math.min(100, (g.saved / g.target) * 100);
            return (
              <li key={g.id} className="rounded-2xl border border-ink-200 p-4 dark:border-ink-800">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{g.label} {pct >= 100 && <span className="ml-1 rounded-full bg-saffron-100 px-2 py-0.5 text-xs font-bold text-saffron-900">Reached!</span>}</p>
                    <p className="text-xs text-ink-500 tnum">{rs(g.saved)} of {rs(g.target)} · {pct.toFixed(0)}%{pct < 100 ? ` · ${rs(g.target - g.saved)} to go` : ""}</p>
                  </div>
                  <button aria-label="Delete goal" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" onClick={() => persist(goals.filter((x) => x.id !== g.id))}><Trash2 className="h-4 w-4" /></button>
                </div>
                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${g.label} progress`}>
                  <div className="h-full rounded-full bg-brand-gradient" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-3 flex gap-2">
                  <input className="input !h-9 !py-1 text-sm" inputMode="decimal" placeholder="Add amount (use - to take out)" aria-label={`Add money to ${g.label}`} value={adding[g.id] || ""} onChange={(e) => setAdding({ ...adding, [g.id]: e.target.value })} />
                  <button type="button" className="btn-primary !h-9 !px-3 !py-1 text-xs" onClick={() => deposit(g)}>Add</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1.5fr_1fr_auto]">
        <input className="input" placeholder="e.g. New bike" aria-label="Goal name" value={label} onChange={(e) => setLabel(e.target.value)} />
        <input className="input" inputMode="decimal" placeholder="Target Rs" aria-label="Target amount" value={target} onChange={(e) => setTarget(e.target.value)} />
        <button className="btn-primary justify-center"><Plus className="h-4 w-4" aria-hidden /> Create</button>
      </form>
      <p className="mt-2 text-xs text-ink-400">Need a plan? Try the <Link href="/savings-goal-calculator" className="underline">savings goal calculator</Link>.</p>
    </section>
  );
}
