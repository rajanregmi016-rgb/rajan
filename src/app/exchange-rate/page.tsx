import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import FxTable from "@/components/FxTable";
import RateChart from "@/components/charts/RateChart";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { bsDate, getNrbRange, longDate, nepalToday, shiftDate, shortDate } from "@/lib/server/history";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nepal Rastra Bank Exchange Rate Today and History",
  description: "Today's NRB exchange rates for the US dollar and every other currency, a one-year US dollar chart, and the official rate for any past date.",
  alternates: { canonical: absoluteUrl("/exchange-rate") },
};

export default async function FxIndexPage() {
  const today = nepalToday();
  const days = await getNrbRange(shiftDate(today, -370), today, 3600);
  const latest = days[days.length - 1];
  const prev = days[days.length - 2];
  const series = days.map((d) => ({ d: shortDate(d.date), label: longDate(d.date), v: d.rates.find((r) => r.iso3 === "USD")?.sell ?? 0 })).filter((p) => p.v > 0);
  const recent = [...days].reverse().slice(0, 90);
  const crumbs = [{ name: "Home", path: "/" }, { name: "Exchange rates", path: "/exchange-rate" }];
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="Nepal Rastra Bank rates"
        title={<>Exchange rate <span className="text-gradient">today and history</span></>}
        titleNp="आजको विनिमय दर"
        description={<p>Official buying and selling rates from Nepal Rastra Bank, updated every hour. Pick any date below to see the rates for that day.</p>}
      />
      <div className="container-np space-y-8 py-10">
        {latest ? (
          <>
            <div>
              <h2 className="text-2xl font-bold">Rates for {longDate(latest.date)}</h2>
              <p className="mt-1 text-sm text-ink-500">{bsDate(latest.date)} · published by NRB on {latest.publishedOn}</p>
            </div>
            <FxTable rates={latest.rates} prev={prev?.rates} />
            {series.length > 5 && <RateChart points={series} title="US dollar selling rate (NRB)" />}
            <section>
              <h2 className="text-2xl font-bold">Rates by date</h2>
              <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {recent.map((d) => {
                  const u = d.rates.find((r) => r.iso3 === "USD");
                  return (
                    <li key={d.date}>
                      <Link href={`/exchange-rate/${d.date}`} className="block rounded-2xl border border-ink-200 px-3 py-2 text-sm hover:border-brand-400 dark:border-ink-800">
                        <span className="block font-semibold">{shortDate(d.date)} {d.date.slice(0, 4)}</span>
                        <span className="text-ink-500 tnum">{u ? `USD ${u.sell.toFixed(2)}` : ""}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        ) : (
          <p className="card p-6">The Nepal Rastra Bank rate service isn&apos;t responding right now. Please try again in a few minutes, or use the <Link className="underline" href="/usd-to-npr">USD to NPR calculator</Link>.</p>
        )}
      </div>
    </div>
  );
}
