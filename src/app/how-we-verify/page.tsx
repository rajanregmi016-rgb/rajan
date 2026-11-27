import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardCheck, Eye, FileSearch, RefreshCw } from "lucide-react";
import PageHero from "@/components/PageHero";
import { absoluteUrl } from "@/config/site";
import { getRates } from "@/lib/rates";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "How We Check Our Data",
  description: "Where every number on All Nepali Tools comes from: FENEGOSIDA gold rates, Nepal Rastra Bank exchange rates, Finance Act tax slabs and the BS calendar. Our review and corrections process.",
  alternates: { canonical: absoluteUrl("/how-we-verify") },
};

export default function VerifyPage() {
  const rates = getRates();
  const SOURCES = [
    { what: "Gold & silver rates", src: "FENEGOSIDA (Federation of Nepal Gold & Silver Dealers' Associations) daily fixing", how: "Stored with the date it was published. Shown as a reference; confirm with your dealer before buying or selling.", link: "/gold-price-in-nepal" },
    { what: "US dollar & foreign exchange", src: "Nepal Rastra Bank (NRB) daily rates", how: "Shown with the NRB rate date. Live market rates may differ slightly.", link: "/usd-to-npr" },
    { what: "Income tax slabs", src: `Finance Act and Inland Revenue Department, ${rates.tax.fiscalYear}`, how: "Reviewed each fiscal year when the budget is passed. Check with IRD or a tax adviser before filing.", link: "/income-tax-calculator-nepal" },
    { what: "VAT", src: "Value Added Tax Act, standard rate 13%", how: "Fixed rate, reviewed if the law changes.", link: "/vat-calculator-nepal" },
    { what: "Nepali calendar (BS ↔ AD)", src: "Published BS month-length tables, years 2000 to 2090 BS", how: "Every converted date is tested in both directions.", link: "/bs-to-ad-converter" },
    { what: "SEE grades & GPA", src: "National Examinations Board (NEB) letter-grade system", how: "Grade bands follow the NEB scale shown on each page.", link: "/see-gpa-calculator" },
    { what: "Land units", src: "Standard Nepali area units (ropani, aana, paisa, daam; bigha, kattha, dhur)", how: "Converted through square feet and square metres using the standard values.", link: "/land-area-converter" },
  ];
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "How we check our data", path: "/how-we-verify" }])} />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "How we check our data", path: "/how-we-verify" }]}
        eyebrow="Trust & accuracy"
        title={<>Where our numbers <span className="text-gradient">come from.</span></>}
        titleNp="हामी तथ्यांक कसरी जाँच्छौं"
        description={<p>Money and dates matter. Here is exactly where every figure on the site comes from, how we check it, and what we do when something is wrong.</p>}
      />

      <div className="container-np py-14">
        <section>
          <p className="eyebrow">Our process</p>
          <h2 className="mt-2 text-3xl font-extrabold">Four checks before anything goes live</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { icon: FileSearch, t: "Official source first", d: "We only use the body that publishes the number: FENEGOSIDA, NRB, IRD, NEB." },
              { icon: ClipboardCheck, t: "Tested", d: "Formulas are checked against worked examples, which you can see on each tool page." },
              { icon: Eye, t: "Human review", d: "A person reads every page before it's published. Nothing is auto-published." },
              { icon: RefreshCw, t: "Dated & updated", d: "Every page shows when it was last updated. Rates show their publication date." },
            ].map((s, i) => (
              <li key={s.t} className="card relative p-6">
                <span className="absolute right-5 top-4 font-display text-4xl font-extrabold text-ink-100 dark:text-ink-800" aria-hidden>{i + 1}</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white"><s.icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-[15px] leading-6 text-ink-500 dark:text-ink-400">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <p className="eyebrow">Sources</p>
          <h2 className="mt-2 text-3xl font-extrabold">What comes from where</h2>
          <div className="card mt-8 overflow-hidden">
            <ul className="divide-y divide-ink-200 dark:divide-ink-800">
              {SOURCES.map((s) => (
                <li key={s.what} className="grid gap-2 p-5 md:grid-cols-[1fr_1.4fr_1.6fr] md:gap-6">
                  <Link href={s.link} className="font-bold text-ink-900 hover:text-brand-700 dark:text-white">{s.what}</Link>
                  <p className="text-[15px] text-ink-700 dark:text-ink-300"><CheckCircle2 className="mr-1.5 inline h-4 w-4 text-emerald-600" aria-hidden />{s.src}</p>
                  <p className="text-[15px] text-ink-500 dark:text-ink-400">{s.how}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-2">
          <div className="card p-7">
            <h2 className="text-2xl font-bold">When we can&apos;t verify something</h2>
            <p className="mt-3 leading-7 text-ink-600 dark:text-ink-400">
              We say so. If an official figure isn&apos;t available for a day, we show the last confirmed value with its date. We never estimate or invent a rate.
            </p>
          </div>
          <div className="card p-7">
            <h2 className="text-2xl font-bold">Found a mistake?</h2>
            <p className="mt-3 leading-7 text-ink-600 dark:text-ink-400">
              Please <Link href="/contact" className="font-semibold text-brand-700 underline">tell us</Link>. Send the page link and what you expected. We check the official source, fix the page and update its date.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
