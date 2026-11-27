import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import RateChart from "@/components/charts/RateChart";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getLiveRates } from "@/lib/server/marketData";
import { bsDate, getGoldHistory, longDate, shortDate } from "@/lib/server/history";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gold Price History in Nepal — Daily FENEGOSIDA Rates",
  description: "Gold and silver price in Nepal for every day we have recorded, with a chart of fine gold per tola. Daily rates from FENEGOSIDA.",
  alternates: { canonical: absoluteUrl("/gold-price") },
};

const rs = (v: number) => `Rs ${Math.round(v).toLocaleString("en-IN")}`;

export default async function GoldHistoryPage() {
  const [hist, rates] = await Promise.all([getGoldHistory(), getLiveRates()]);
  const series = hist.map((d) => ({ d: shortDate(d.date), label: longDate(d.date), v: d.fineTola }));
  const crumbs = [{ name: "Home", path: "/" }, { name: "Gold price history", path: "/gold-price" }];
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="FENEGOSIDA daily rates"
        title={<>Gold price <span className="text-gradient">history in Nepal</span></>}
        titleNp="सुनको भाउ: दैनिक इतिहास"
        description={<p>The fine gold and silver rate for each day, as fixed by the Federation of Nepal Gold and Silver Dealers&apos; Associations. Today&apos;s rate and the gold calculator are on the <Link className="underline" href="/gold-price-in-nepal">gold price page</Link>.</p>}
      />
      <div className="container-np space-y-8 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5"><p className="text-sm text-ink-500">Fine gold, per tola</p><p className="mt-1 text-2xl font-extrabold tnum">{rs(rates.gold.fineTola)}</p></div>
          <div className="card p-5"><p className="text-sm text-ink-500">Fine gold, per 10 grams</p><p className="mt-1 text-2xl font-extrabold tnum">{rs(rates.gold.tenGram)}</p></div>
          <div className="card p-5"><p className="text-sm text-ink-500">Silver, per tola</p><p className="mt-1 text-2xl font-extrabold tnum">{rs(rates.gold.silverTola)}</p></div>
        </div>
        <p className="text-sm text-ink-500">Latest rate: {isNaN(Date.parse(rates.gold.updated)) ? rates.gold.updated : new Date(rates.gold.updated).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kathmandu" })} (Nepal time). Reference only; confirm with a licensed dealer before buying or selling.</p>
        {series.length >= 5 && <RateChart points={series} title="Fine gold per tola" decimals={0} />}
        <section>
          <h2 className="text-2xl font-bold">Gold price by date</h2>
          {hist.length ? (
            <div className="card mt-4 overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead><tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800"><th className="px-4 py-3">Date</th><th className="px-4 py-3 text-right">Fine gold / tola</th><th className="px-4 py-3 text-right">Per 10 g</th><th className="px-4 py-3 text-right">Silver / tola</th></tr></thead>
                <tbody>
                  {[...hist].reverse().map((d) => (
                    <tr key={d.date} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                      <td className="px-4 py-2.5"><Link className="font-semibold underline-offset-2 hover:underline" href={`/gold-price/${d.date}`}>{longDate(d.date).replace(/^\w+, /, "")}</Link> <span className="text-ink-500">{bsDate(d.date)}</span></td>
                      <td className="px-4 py-2.5 text-right tnum font-semibold">{rs(d.fineTola)}</td>
                      <td className="px-4 py-2.5 text-right tnum">{d.fineTenGram ? rs(d.fineTenGram) : "—"}</td>
                      <td className="px-4 py-2.5 text-right tnum">{d.silverTola ? rs(d.silverTola) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-3 text-ink-600 dark:text-ink-300">We started recording the daily rate automatically in November 2026. Each day&apos;s rate will be listed here as it is published.</p>
          )}
        </section>
      </div>
    </div>
  );
}
