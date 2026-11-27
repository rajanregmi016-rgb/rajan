import type { Metadata } from "next";
import Link from "next/link";
import {
  getRates,
} from "@/lib/rates";
import { getAdminStateSafe } from "@/lib/adminStore";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { KEYWORD_IDEAS } from "@/lib/keywords";
import { getForex } from "@/lib/rates";
import { formatNpNumber } from "@/lib/nepali";
import {
  addQueueItemAction, reviewQueueAction, updateRatesAction,
} from "@/app/admin/actions";
import { markMessageReadAction } from "@/app/contact/actions";

// The admin dashboard reads/writes versioned JSON on disk and must never run
// during build. Re-rendered per request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — All Nepali Tools",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const rates = getRates();
  const admin = getAdminStateSafe();
  const contactMessages = admin.contactMessages ?? [];
  const forex = await getForex();
  const tools = allTools();

  const covered = KEYWORD_IDEAS.filter((k) => k.status === "covered");
  const backlog = KEYWORD_IDEAS.filter((k) => k.status !== "covered");
  const pending = admin.seoEngine.contentQueue.filter((q) => q.status === "pending");

  return (
    <div className="container-np py-8">
      <p className="mb-2 text-xs uppercase tracking-widest text-brand-600">Internal — not indexed</p>
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-ink-50">Admin dashboard</h1>
      <p className="mt-1 max-w-2xl text-sm text-ink-500 dark:text-ink-400">
        Tool inventory, live data updates, the SEO keyword pipeline and the AI content review queue.
        Everything here writes to versioned JSON, never straight to public pages.
      </p>

      {/* Overview */}
      <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Tools live" value={String(tools.length)} />
        <Kpi label="Categories" value={String(allCategories().length)} />
        <Kpi label="Keywords covered" value={`${covered.length}/${KEYWORD_IDEAS.length}`} />
        <Kpi label="Pending review" value={String(pending.length)} emphasize={pending.length > 0} />
        <Kpi
          label="Unread contact messages"
          value={String(contactMessages.filter((m) => m.status === "new").length)}
          emphasize={contactMessages.some((m) => m.status === "new")}
        />
      </section>

      {/* Rates update */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">Data updates — gold, silver &amp; forex</h2>
        <p className="mt-1 text-xs text-ink-500">
          Current: gold Rs {formatNpNumber(rates.gold.fineTola)} · tejhabi Rs {formatNpNumber(rates.gold.tejabiTola)} ·
          silver Rs {formatNpNumber(rates.gold.silverTola)} /tola · USD→NPR {forex.usdNpr.toFixed(2)} ({forex.live ? "live" : "fallback"}).
          Rate date: {new Date(rates.gold.updated).toLocaleDateString("en-GB")}.
        </p>
        <form action={updateRatesAction} className="mt-4 grid items-end gap-3 sm:grid-cols-6">
          <NumField name="fineTola" label="Fine /tola" initial={rates.gold.fineTola} />
          <NumField name="tejabiTola" label="Tejabi /tola" initial={rates.gold.tejabiTola} />
          <NumField name="silverTola" label="Silver /tola" initial={rates.gold.silverTola} />
          <NumField name="fallbackUsdNpr" label="USD fallback" initial={rates.forex.fallbackUsdNpr} step="0.01" />
          <div className="sm:col-span-2">
            <button className="btn-primary w-full" type="submit">Save rates &amp; stamp update log</button>
          </div>
        </form>
      </section>

      {/* Contact messages */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">Contact form messages</h2>
        <p className="mt-1 text-xs text-ink-500">
          Submissions from the /contact form. Nothing is published — messages stay internal until you
          reply to the sender by email.
        </p>
        <div className="mt-4 space-y-2">
          {contactMessages.length === 0 && (
            <p className="text-xs text-ink-400">No messages yet.</p>
          )}
          {contactMessages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-wrap items-start justify-between gap-3 rounded-lg border p-3 text-sm ${
                m.status === "new"
                  ? "border-brand-300 bg-brand-50/60 dark:border-brand-800 dark:bg-brand-900/20"
                  : "border-ink-200 dark:border-ink-800"
              }`}
            >
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-ink-900 dark:text-ink-100">
                  {m.name}
                  <span className="ml-2 font-normal text-ink-500">&lt;{m.email}&gt;</span>
                </p>
                <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-400">
                  {m.date} · {m.topic} · {m.status}
                  {m.url ? ` · ${m.url}` : ""}
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-ink-700 dark:text-ink-300">{m.message}</p>
                <a
                  href={`mailto:${m.email}?subject=Re: your All Nepali Tools message (${m.topic})`}
                  className="mt-2 inline-block text-xs text-brand-700 underline-offset-2 hover:underline dark:text-brand-300"
                >
                  Reply by email
                </a>
              </div>
              {m.status === "new" && (
                <form action={markMessageReadAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <button className="btn-ghost !py-1.5 !text-xs" type="submit">
                    Mark read
                  </button>
                </form>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* SEO keyword pipeline */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">SEO keyword pipeline (Nepal)</h2>
        <p className="mt-1 text-xs text-ink-500">
          Search-demand view based on Nepali search behaviour banded 1–5 (5 = highest). &quot;Covered&quot; keywords already have a dedicated tool page.
        </p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-green-700 dark:text-green-400">Covered ({covered.length})</h3>
            <ul className="mt-2 space-y-1.5">
              {covered.map((k) => (
                <li key={k.keyword} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate text-ink-700 dark:text-ink-300">
                    {k.toolSlug ? <Link href={`/${k.toolSlug}`} className="underline-offset-2 hover:underline">{k.keyword}</Link> : k.keyword}
                  </span>
                  <span className="shrink-0 text-xs text-ink-400">vol {"▮".repeat(k.estMonthlyVolume)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wide text-brand-700 dark:text-brand-400">Opportunities / backlog ({backlog.length})</h3>
            <ul className="mt-2 space-y-2">
              {backlog.map((k) => (
                <li key={k.keyword} className="rounded-lg border border-ink-200 p-2 text-xs dark:border-ink-800">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-ink-800 dark:text-ink-200">{k.keyword}</span>
                    <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-ink-500 dark:bg-ink-800 dark:text-ink-400">
                      {k.status}
                    </span>
                  </div>
                  {k.note && <p className="mt-1 text-ink-500">{k.note}</p>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AI content review queue */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">AI content review queue</h2>
        <p className="mt-1 text-xs text-ink-500">
          Drafts generated by the SEO engine land here at low/medium confidence. Nothing auto-publishes — approval is manual, dismissal keeps the audit trail.
        </p>
        <form action={addQueueItemAction} className="mt-4 grid items-end gap-3 sm:grid-cols-4">
          <div className="sm:col-span-3">
            <label className="label">Draft content (paste an AI suggestion to review)</label>
            <input name="text" className="input" placeholder="Draft FAQ / paragraph / meta description…" />
          </div>
          <div>
            <label className="label">Tool slug (optional)</label>
            <select name="toolSlug" className="input">
              <option value="">—</option>
              {tools.map((t) => <option key={t.slug} value={t.slug}>{t.slug}</option>)}
            </select>
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {admin.seoEngine.contentQueue.length === 0 && (
            <p className="text-xs text-ink-400">Queue is empty.</p>
          )}
          {admin.seoEngine.contentQueue.map((q) => (
            <div key={q.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-ink-200 p-3 text-sm dark:border-ink-800">
              <div className="min-w-0 flex-1">
                <p className="text-ink-800 dark:text-ink-200">{q.text}</p>
                <p className="mt-0.5 text-[11px] text-ink-400">
                  {q.createdAt} · {q.kind} · {q.toolSlug ?? "—"} · confidence: {q.confidence} · status: {q.status}
                </p>
              </div>
              {q.status === "pending" && (
                <div className="flex gap-2">
                  <form action={reviewQueueAction}>
                    <input type="hidden" name="id" value={q.id} />
                    <input type="hidden" name="decision" value="approve" />
                    <button className="btn-primary !py-1.5 !text-xs" type="submit">Approve</button>
                  </form>
                  <form action={reviewQueueAction}>
                    <input type="hidden" name="id" value={q.id} />
                    <input type="hidden" name="decision" value="reject" />
                    <button className="btn-ghost !py-1.5 !text-xs" type="submit">Reject</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tool inventory */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">Tool inventory &amp; content status</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-ink-400">
                <th className="py-1">Tool</th>
                <th className="py-1">Category</th>
                <th className="py-1">Last updated</th>
                <th className="py-1">Flags</th>
              </tr>
            </thead>
            <tbody>
              {allCategories().flatMap((c) =>
                toolsInCategory(c.slug).map((t) => (
                  <tr key={t.slug} className="border-t border-ink-100 dark:border-ink-800">
                    <td className="py-1.5"><Link className="text-brand-700 underline-offset-2 hover:underline dark:text-brand-300" href={`/${t.slug}`}>{t.shortTitle}</Link></td>
                    <td className="py-1.5 text-ink-500">{c.name}</td>
                    <td className="py-1.5 text-ink-500">{t.lastUpdated}</td>
                    <td className="py-1.5">
                      {t.popular ? <span className="mr-1 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-bold text-brand-700">popular</span> : null}
                      {t.trending ? <span className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] font-bold text-ink-600">trending</span> : null}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Update history */}
      <section className="card mt-8 p-5">
        <h2 className="text-base font-bold text-ink-900 dark:text-ink-50">Content update history</h2>
        <ul className="mt-3 space-y-1.5 text-sm">
          {admin.seoEngine.updateHistory.map((h, i) => (
            <li key={i} className="flex items-baseline gap-3">
              <span className="shrink-0 text-xs text-ink-400">{h.date}</span>
              <span className="text-ink-700 dark:text-ink-300">{h.action}</span>
              <span className="text-[10px] uppercase text-ink-400">{h.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Kpi({ label, value, emphasize }: { label: string; value: string; emphasize?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${emphasize ? "border-brand-300 bg-brand-50 dark:border-brand-800 dark:bg-brand-900/30" : "border-ink-200 dark:border-ink-800"}`}>
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-ink-900 dark:text-ink-50">{value}</div>
    </div>
  );
}

function NumField({ name, label, initial, step }: { name: string; label: string; initial: number; step?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        type="number"
        step={step ?? "1"}
        name={name}
        defaultValue={initial}
        required
      />
    </label>
  );
}
