import "server-only";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { alertEmail, resendReady, sendOne, type PriceAlert } from "@/lib/server/newsletter";
import { usdMid, type MarketSnapshot } from "@/lib/server/marketData";

/** Emails users whose gold / USD price alerts were crossed. Each alert fires at most once per 20 hours. */
export async function runPriceAlerts(snap: MarketSnapshot) {
  const db = supabaseAdmin();
  if (!db || !resendReady()) return { checked: 0, sent: 0 };
  const goldFresh = snap.gold && Date.now() - new Date(snap.gold.fetchedAt).getTime() < 3 * 3600e3 ? snap.gold.fineTola : null;
  const usd = usdMid(snap);
  let checked = 0, sent = 0;
  for (let page = 1; page < 50; page++) {
    const { data, error } = await db.auth.admin.listUsers({ page, perPage: 1000 });
    if (error || !data?.users?.length) break;
    for (const u of data.users) {
      const meta = (u.user_metadata || {}) as Record<string, unknown>;
      const alerts = Array.isArray(meta.alerts) ? (meta.alerts as PriceAlert[]) : [];
      if (!alerts.length || !u.email) continue;
      let changed = false;
      const next = [] as PriceAlert[];
      for (const a of alerts) {
        checked++;
        const current = a.metric === "gold" ? goldFresh : usd;
        const hit = current !== null && (a.dir === "above" ? current >= a.value : current <= a.value);
        const recent = a.lastSent && Date.now() - new Date(a.lastSent).getTime() < 20 * 3600e3;
        if (hit && !recent && current !== null) {
          const src = a.metric === "gold" ? "FENEGOSIDA" : `Nepal Rastra Bank, ${snap.forex?.date}`;
          try {
            await sendOne(alertEmail(u.email, a, current, src));
            next.push({ ...a, lastSent: new Date().toISOString() });
            changed = true;
            sent++;
            continue;
          } catch { /* keep alert unchanged */ }
        }
        next.push(a);
      }
      if (changed) await db.auth.admin.updateUserById(u.id, { user_metadata: { ...meta, alerts: next } });
    }
    if (data.users.length < 1000) break;
  }
  return { checked, sent };
}
