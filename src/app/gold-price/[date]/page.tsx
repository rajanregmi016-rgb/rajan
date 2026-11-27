import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { DATE_RE, bsDate, getGoldHistory, longDate } from "@/lib/server/history";

export const revalidate = 3600;
export const dynamicParams = true;
export function generateStaticParams() {
  return [];
}

type P = { params: { date: string } };
const rs = (v: number) => `Rs ${Math.round(v).toLocaleString("en-IN")}`;

async function load(date: string) {
  if (!DATE_RE.test(date)) return null;
  const hist = await getGoldHistory();
  const i = hist.findIndex((d) => d.date === date);
  return i < 0 ? null : { day: hist[i], prev: i > 0 ? hist[i - 1] : null, next: hist[i + 1] ?? null };
}

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const data = await load(params.date);
  if (!data) return {};
  const d = longDate(params.date).replace(/^\w+, /, "");
  return {
    title: `Gold Price in Nepal on ${d} (${bsDate(params.date)})`,
    description: `Fine gold was ${rs(data.day.fineTola)} per tola in Nepal on ${longDate(params.date)}${data.day.silverTola ? `, silver ${rs(data.day.silverTola)} per tola` : ""}. FENEGOSIDA daily rate with change from the day before.`,
    alternates: { canonical: absoluteUrl(`/gold-price/${params.date}`) },
  };
}

export default async function GoldDayPage({ params }: P) {
  const data = await load(params.date);
  if (!data) notFound();
  const { day, prev, next } = data;
  const short = longDate(day.date).replace(/^\w+, /, "");
  const diff = prev ? day.fineTola - prev.fineTola : null;
  const crumbs = [{ name: "Home", path: "/" }, { name: "Gold price history", path: "/gold-price" }, { name: short, path: `/gold-price/${day.date}` }];
  const cells = [
    { k: "Fine gold (24 carat), per tola", v: rs(day.fineTola) },
    { k: "Fine gold, per 10 grams", v: day.fineTenGram ? rs(day.fineTenGram) : "—" },
    { k: "Silver, per tola", v: day.silverTola ? rs(day.silverTola) : "—" },
  ];
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="FENEGOSIDA daily rate"
        title={<>Gold price on <span className="text-gradient">{short}</span></>}
        titleNp={`${bsDate(day.date)} को सुनको भाउ`}
        description={<p>On {longDate(day.date)} ({bsDate(day.date)}), fine gold in Nepal was <strong>{rs(day.fineTola)}</strong> per tola{diff != null && <>, {diff === 0 ? "the same as" : `${diff > 0 ? "up" : "down"} ${rs(Math.abs(diff))} from`} the day before</>}.</p>}
      />
      <div className="container-np space-y-8 py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          {cells.map((c) => <div key={c.k} className="card p-5"><p className="text-sm text-ink-500">{c.k}</p><p className="mt-1 text-2xl font-extrabold tnum">{c.v}</p></div>)}
        </div>
        <p className="text-sm text-ink-500">Source: FENEGOSIDA daily fixing. Jewellers add making charges and 13% VAT on top of this rate, so the price of a finished piece is higher.</p>
        <nav className="flex flex-wrap items-center justify-between gap-3 text-sm font-semibold">
          {prev ? <Link className="btn-ghost" href={`/gold-price/${prev.date}`}>← {longDate(prev.date).replace(/^\w+, /, "")}</Link> : <span />}
          <Link className="btn-ghost" href="/gold-price">All dates</Link>
          {next ? <Link className="btn-ghost" href={`/gold-price/${next.date}`}>{longDate(next.date).replace(/^\w+, /, "")} →</Link> : <span />}
        </nav>
        <section className="card p-6">
          <h2 className="text-xl font-bold">Work out a price</h2>
          <p className="mt-2 text-ink-600 dark:text-ink-300">Use the <Link className="underline" href="/gold-price-in-nepal">gold price calculator</Link> to price any weight with making charges and VAT, or convert with the <Link className="underline" href="/tola-to-gram-converter">tola to gram converter</Link>.</p>
        </section>
      </div>
    </div>
  );
}
