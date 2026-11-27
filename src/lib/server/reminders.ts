import "server-only";
import NepaliDate from "nepali-date-converter";
import { BS_MONTHS } from "@/lib/nepali";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { billEmail, resendReady, sendOne, type Bill } from "@/lib/server/newsletter";
import { addNotice, prefsOf } from "@/lib/server/notifications";

/** Today's date in Nepal as a local Date at midnight (the server runs in UTC). */
function nepalTodayDate() {
  const n = new Date(Date.now() + 345 * 60000);
  return { date: new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()), hour: n.getUTCHours() };
}

function monthDays(y: number, m: number) {
  for (let d = 32; d >= 29; d--) {
    try {
      const nd = new NepaliDate(y, m, d);
      if (nd.getMonth() === m && nd.getDate() === d) return d;
    } catch { /* shorter */ }
  }
  return 30;
}

/** Next due date for a bill paid on BS day `d` every month (today counts). */
export function nextDue(d: number, today: Date) {
  const t = new NepaliDate(today);
  let y = t.getYear(), m = t.getMonth();
  for (let i = 0; i < 2; i++) {
    const day = Math.min(d, monthDays(y, m));
    const js = new NepaliDate(y, m, day).toJsDate();
    js.setHours(0, 0, 0, 0);
    if (js >= today) {
      return { key: `${y}-${m}-${day}`, label: `${day} ${BS_MONTHS[m]} ${y}`, days: Math.round((js.getTime() - today.getTime()) / 864e5) };
    }
    m++;
    if (m > 11) { m = 0; y++; }
  }
  return null;
}

/** From 7 AM Nepal time: remind users 3 days before a bill is due, and again the day before. */
export async function runBillReminders() {
  const db = supabaseAdmin();
  const { date: today, hour } = nepalTodayDate();
  if (!db || hour < 7) return { checked: 0, sent: 0 };
  let checked = 0, sent = 0;
  for (let page = 1; page < 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      const meta = (u.user_metadata || {}) as Record<string, unknown>;
      const bills = Array.isArray(meta.bills) ? (meta.bills as Bill[]) : [];
      if (!bills.length) continue;
      let changed = false;
      const next: Bill[] = [];
      for (const b of bills) {
        checked++;
        const due = nextDue(b.d, today);
        // First reminder 3 days before, a last one the day before.
        const first = due && due.days <= 3 && b.lastFor3 !== due.key;
        const last = due && due.days <= 1 && b.lastFor !== due.key && !first;
        if (due && (first || last)) {
          try {
            const when = due.days === 0 ? "today" : due.days === 1 ? "tomorrow" : `in ${due.days} days`;
            await addNotice(u.id, { kind: "reminder", title: "Payment reminder", body: `${b.label}${b.amount ? ` (Rs ${b.amount.toLocaleString("en-IN")})` : ""} is due ${when}, ${due.label}.`, href: "/account#bills" }).catch(() => null);
            if (u.email && resendReady() && prefsOf(meta).alertEmail) await sendOne(billEmail(u.email, b, due.label, due.days));
            next.push({ ...b, lastFor3: due.key, ...(due.days <= 1 ? { lastFor: due.key } : {}) });
            changed = true;
            sent++;
            continue;
          } catch { /* try again next hour */ }
        }
        next.push(b);
      }
      if (changed) await db.auth.admin.updateUserById(u.id, { user_metadata: { ...meta, bills: next } });
    }
    if (data.users.length < 1000) break;
  }
  return { checked, sent };
}
