"use client";

import { useEffect, useMemo, useState } from "react";
import NepaliDate from "nepali-date-converter";
import { Bell, CalendarHeart, Mail, Pencil, Plus, Trash2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import { BS_MONTHS, BS_MONTHS_NP, toNpDigits } from "@/lib/nepali";

async function token() {
  const { data } = (await supabase()?.auth.getSession()) ?? { data: { session: null } };
  return data.session?.access_token ?? "";
}
async function api(path: string, init?: RequestInit) {
  const t = await token();
  const res = await fetch(path, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}`, ...(init?.headers || {}) } });
  return res.json().catch(() => ({}));
}
const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------- one-time welcome email ---------- */
export function useWelcomeEmail(user: User | null) {
  useEffect(() => {
    if (!user || user.user_metadata?.welcomed_at) return;
    const k = `anl-welcomed-${user.id}`;
    try { if (localStorage.getItem(k)) return; localStorage.setItem(k, "1"); } catch {}
    api("/api/account/welcome", { method: "POST" }).catch(() => null);
  }, [user]);
}

/* ---------- profile name ---------- */
export function ProfileName({ user }: { user: User }) {
  const initial = (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || "";
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(initial);
  const [saved, setSaved] = useState(initial);
  async function save() {
    await supabase()?.auth.updateUser({ data: { full_name: name.trim() } });
    setSaved(name.trim());
    setEditing(false);
  }
  if (!editing) {
    return (
      <button onClick={() => setEditing(true)} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
        <Pencil className="h-3 w-3" aria-hidden /> {saved ? "Edit name" : "Add your name"}
      </button>
    );
  }
  return (
    <div className="mt-2 flex gap-2">
      <input className="input !h-9 !py-1 text-sm" value={name} onChange={(e) => setName(e.target.value)} aria-label="Your name" maxLength={60} />
      <button className="btn-primary !h-9 !px-3 !py-1 text-xs" onClick={save}>Save</button>
    </div>
  );
}

/* ---------- daily email toggle ---------- */
export function DailyEmailToggle() {
  const [state, setState] = useState<{ loading: boolean; on: boolean; email: string; err?: string }>({ loading: true, on: false, email: "" });
  useEffect(() => {
    api("/api/account/newsletter").then((j) => setState({ loading: false, on: !!j.subscribed, email: j.email || "" })).catch(() => setState((s) => ({ ...s, loading: false })));
  }, []);
  async function flip() {
    const next = !state.on;
    setState((s) => ({ ...s, loading: true }));
    const j = await api("/api/account/newsletter", { method: "POST", body: JSON.stringify({ subscribe: next }) });
    setState((s) => ({ ...s, loading: false, on: j.ok ? next : s.on, err: j.ok ? undefined : "Couldn't save. Try again." }));
  }
  return (
    <section className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Mail className="h-5 w-5 text-brand-600" aria-hidden /> Daily rates email</h2>
          <p className="mt-1 text-sm text-ink-500">Each morning about 8:30 AM Nepal time: today&apos;s Nepali date, gold and silver price, and NRB exchange rates{state.email ? `, sent to ${state.email}` : ""}.</p>
        </div>
        <button
          role="switch"
          aria-checked={state.on}
          aria-label="Daily rates email"
          disabled={state.loading}
          onClick={flip}
          className={`relative h-7 w-12 shrink-0 rounded-full transition ${state.on ? "bg-brand-600" : "bg-ink-300 dark:bg-ink-700"} ${state.loading ? "opacity-60" : ""}`}
        >
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${state.on ? "left-[22px]" : "left-0.5"}`} />
        </button>
      </div>
      {state.err && <p className="mt-2 text-sm text-brand-700">{state.err}</p>}
    </section>
  );
}

/* ---------- price alerts ---------- */
type Alert = { id: string; metric: "gold" | "usd"; dir: "above" | "below"; value: number; lastSent?: string };
export function PriceAlerts({ user, gold, usd }: { user: User; gold: number; usd: number }) {
  const [alerts, setAlerts] = useState<Alert[]>(Array.isArray(user.user_metadata?.alerts) ? user.user_metadata.alerts : []);
  const [metric, setMetric] = useState<"gold" | "usd">("gold");
  const [dir, setDir] = useState<"above" | "below">("above");
  const [value, setValue] = useState("");
  const [msg, setMsg] = useState("");
  async function persist(next: Alert[]) {
    setAlerts(next);
    const { error } = (await supabase()?.auth.updateUser({ data: { alerts: next } })) ?? {};
    setMsg(error ? "Couldn't save. Try again." : "Saved.");
    setTimeout(() => setMsg(""), 1500);
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(value);
    if (!(v > 0)) return setMsg("Enter a price.");
    if (alerts.length >= 10) return setMsg("You can have up to 10 alerts.");
    persist([...alerts, { id: uid(), metric, dir, value: v }]);
    setValue("");
  }
  const fmt = (a: Alert) => (a.metric === "gold" ? `Rs ${a.value.toLocaleString("en-IN")} per tola` : `Rs ${a.value.toFixed(2)}`);
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold"><Bell className="h-5 w-5 text-saffron-500" aria-hidden /> Price alerts</h2>
      <p className="mt-1 text-sm text-ink-500">We check every hour and email you when the price crosses your number. Now: fine gold Rs {gold.toLocaleString("en-IN")} per tola, 1 USD = Rs {usd.toFixed(2)}.</p>
      {alerts.length > 0 && (
        <ul className="mt-4 space-y-2">
          {alerts.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 px-4 py-3 text-sm dark:border-ink-800">
              <span><b>{a.metric === "gold" ? "Gold" : "US dollar"}</b> goes {a.dir} <b>{fmt(a)}</b>{a.lastSent ? <span className="block text-xs text-ink-400">Last sent {new Date(a.lastSent).toLocaleString()}</span> : null}</span>
              <button aria-label="Delete alert" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" onClick={() => persist(alerts.filter((x) => x.id !== a.id))}><Trash2 className="h-4 w-4" /></button>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
        <select className="input" aria-label="What to watch" value={metric} onChange={(e) => { setMetric(e.target.value as "gold" | "usd"); setValue(""); }}>
          <option value="gold">Fine gold (per tola)</option>
          <option value="usd">US dollar (NRB)</option>
        </select>
        <select className="input" aria-label="Direction" value={dir} onChange={(e) => setDir(e.target.value as "above" | "below")}>
          <option value="above">goes above</option>
          <option value="below">goes below</option>
        </select>
        <input className="input" inputMode="decimal" aria-label="Price in rupees" placeholder={metric === "gold" ? String(Math.round(gold / 1000) * 1000) : usd.toFixed(0)} value={value} onChange={(e) => setValue(e.target.value)} />
        <button className="btn-primary justify-center"><Plus className="h-4 w-4" aria-hidden /> Add</button>
      </form>
      {msg && <p className="mt-2 text-sm text-ink-500" role="status">{msg}</p>}
    </section>
  );
}

/* ---------- my Nepali dates ---------- */
type MyDate = { id: string; label: string; m: number; d: number; y?: number };
function nextOccurrence(md: MyDate) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const nowBs = new NepaliDate(today);
  for (const y of [nowBs.getYear(), nowBs.getYear() + 1]) {
    let day = md.d;
    while (day > 28) {
      try { const nd = new NepaliDate(y, md.m, day); if (nd.getMonth() === md.m) break; } catch {}
      day--;
    }
    try {
      const js = new NepaliDate(y, md.m, day).toJsDate(); js.setHours(0, 0, 0, 0);
      if (js >= today) return { days: Math.round((js.getTime() - today.getTime()) / 864e5), y, js };
    } catch {}
  }
  return null;
}
export function MyDates({ user }: { user: User }) {
  const [dates, setDates] = useState<MyDate[]>(Array.isArray(user.user_metadata?.dates) ? user.user_metadata.dates : []);
  const [label, setLabel] = useState("");
  const [m, setM] = useState(0);
  const [d, setD] = useState("1");
  const [y, setY] = useState("");
  const sorted = useMemo(() => dates.map((x) => ({ x, n: nextOccurrence(x) })).sort((a, b) => (a.n?.days ?? 999) - (b.n?.days ?? 999)), [dates]);
  async function persist(next: MyDate[]) {
    setDates(next);
    await supabase()?.auth.updateUser({ data: { dates: next } });
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    const day = Math.floor(Number(d));
    if (!label.trim() || !(day >= 1 && day <= 32) || dates.length >= 30) return;
    const yr = Math.floor(Number(y));
    persist([...dates, { id: uid(), label: label.trim().slice(0, 40), m, d: day, ...(yr >= 1970 && yr <= 2100 ? { y: yr } : {}) }]);
    setLabel(""); setY("");
  }
  return (
    <section className="card p-6">
      <h2 className="flex items-center gap-2 text-lg font-extrabold"><CalendarHeart className="h-5 w-5 text-brand-600" aria-hidden /> My Nepali dates</h2>
      <p className="mt-1 text-sm text-ink-500">Save birthdays, anniversaries and पुण्यतिथि by their Bikram Sambat date. We show when each one falls next in the English calendar.</p>
      {sorted.length > 0 && (
        <ul className="mt-4 space-y-2">
          {sorted.map(({ x, n }) => (
            <li key={x.id} className="flex items-center justify-between gap-3 rounded-2xl border border-ink-200 px-4 py-3 dark:border-ink-800">
              <div className="min-w-0">
                <p className="truncate font-semibold">{x.label}</p>
                <p className="text-xs text-ink-500">
                  <span className="devanagari">{toNpDigits(x.d)} {BS_MONTHS_NP[x.m]}</span>
                  {n ? ` · next on ${n.js.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}` : ""}
                  {n && x.y ? ` · turns ${n.y - x.y}` : ""}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {n && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${n.days === 0 ? "bg-brand-600 text-white" : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200"}`}>{n.days === 0 ? "Today!" : `${n.days} days`}</span>}
                <button aria-label="Delete date" className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-brand-600 dark:hover:bg-ink-800" onClick={() => persist(dates.filter((z) => z.id !== x.id))}><Trash2 className="h-4 w-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={add} className="mt-4 grid gap-2 sm:grid-cols-[1.4fr_1fr_80px_100px_auto]">
        <input className="input" placeholder="e.g. Aama's birthday" aria-label="Name of the date" value={label} onChange={(e) => setLabel(e.target.value)} />
        <select className="input" aria-label="BS month" value={m} onChange={(e) => setM(Number(e.target.value))}>
          {BS_MONTHS.map((name, i) => <option key={name} value={i}>{name} ({BS_MONTHS_NP[i]})</option>)}
        </select>
        <input className="input" inputMode="numeric" aria-label="BS day" placeholder="Day" value={d} onChange={(e) => setD(e.target.value)} />
        <input className="input" inputMode="numeric" aria-label="BS year (optional)" placeholder="Year (opt.)" value={y} onChange={(e) => setY(e.target.value)} />
        <button className="btn-primary justify-center"><Plus className="h-4 w-4" aria-hidden /> Save</button>
      </form>
    </section>
  );
}
