import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import FxTable from "@/components/FxTable";
import RateChart from "@/components/charts/RateChart";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { DATE_RE, bsDate, getFxDay, getNrbRange, longDate, nepalToday, shiftDate, shortDate } from "@/lib/server/history";

export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type P = { params: { date: string } };

function valid(date: string) {
  return DATE_RE.test(date) && date >= "2010-01-01" && date <= nepalToday() && !isNaN(Date.parse(date));
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { date } = params;
  if (!valid(date)) return {};
  const data = await getFxDay(date);
  if (!data) return { robots: { index: false } };
  const usd = data.day.rates.find((r) => r.iso3 === "USD");
  const title = `Exchange Rate in Nepal on ${longDate(date).replace(/^\w+, /, "")} (${bsDate(date)})`;
  return {
    title,
    description: `Nepal Rastra Bank exchange rates for ${longDate(date)}${usd ? `: 1 US dollar = Rs ${usd.buy.toFixed(2)} buying, Rs ${usd.sell.toFixed(2)} selling` : ""}. All ${data.day.rates.length} currencies with change from the previous day.`,
    alternates: { canonical: absoluteUrl(`/exchange-rate/${date}`) },
  };
}

export default async function FxDayPage({ params }: P) {
  const { date } = params;
  if (!valid(date)) notFound();
  const data = await getFxDay(date);
  if (!data) notFound();
  const { day, prev } = data;
  const usd = day.rates.find((r) => r.iso3 === "USD");
  const pusd = prev?.rates.find((r) => r.iso3 === "USD");
  const inr = day.rates.find((r) => r.iso3 === "INR");
  const series = (await getNrbRange(shiftDate(date, -95), date, date < nepalToday() ? 2592000 : 3600))
    .map((d) => ({ d: shortDate(d.date), label: longDate(d.date), v: d.rates.find((r) => r.iso3 === "USD")?.sell ?? 0 }))
    .filter((p) => p.v > 0);
  const diff = usd && pusd ? usd.sell - pusd.sell : null;
  const prevDate = prev?.date;
  const nextDate = shiftDate(date, 1) <= nepalToday() ? shiftDate(date, 1) : null;
  const path = `/exchange-rate/${date}`;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Exchange rates", path: "/exchange-rate" }, { name: longDate(date).replace(/^\w+, /, ""), path }];

  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="Nepal Rastra Bank rates"
        title={<>Exchange rate on <span className="text-gradient">{longDate(date).replace(/^\w+, /, "")}</span></>}
        titleNp={`${bsDate(date)} को विनिमय दर`}
        description={
          <p>
            {usd ? (
              <>On {longDate(date)} ({bsDate(date)}), Nepal Rastra Bank set the US dollar at <strong>Rs {usd.buy.toFixed(2)}</strong> buying and <strong>Rs {usd.sell.toFixed(2)}</strong> selling
                {diff != null && <>, {diff === 0 ? "unchanged from" : `${diff > 0 ? "up" : "down"} ${Math.abs(diff * 100).toFixed(0)} paisa from`} the previous published rate</>}.
                {inr && <> The Indian rupee stayed at Rs {(inr.sell / inr.unit * 100).toFixed(2)} for 100 INR, as it is pegged.</>}</>
            ) : <>Official buying and selling rates published by Nepal Rastra Bank for this date.</>}
          </p>
        }
      />
      <div className="container-np space-y-8 py-10">
        <FxTable rates={day.rates} prev={prev?.rates} />
        <p className="text-sm text-ink-500">Source: Nepal Rastra Bank, published {day.publishedOn}. Banks and money changers set their own rates within NRB guidance, so the rate at your bank can be a little different.</p>
        {series.length > 5 && <RateChart points={series} title="US dollar selling rate (NRB)" ranges={[30, 90]} />}
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          {prevDate ? <Link className="btn-ghost" href={`/exchange-rate/${prevDate}`}>← {longDate(prevDate).replace(/^\w+, /, "")}</Link> : <span />}
          <Link className="btn-ghost" href="/exchange-rate">All dates</Link>
          {nextDate ? <Link className="btn-ghost" href={`/exchange-rate/${nextDate}`}>{longDate(nextDate).replace(/^\w+, /, "")} →</Link> : <span />}
        </nav>
        <section className="card p-6">
          <h2 className="text-xl font-bold">Convert an amount</h2>
          <p className="mt-2 text-ink-600 dark:text-ink-300">Use our <Link className="underline" href="/currency-converter-nepal">currency converter</Link> or the <Link className="underline" href="/usd-to-npr">USD to NPR calculator</Link> with today&apos;s NRB rates.</p>
        </section>
      </div>
    </div>
  );
}
