import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Heart, Lock, Smartphone, Sparkles, Target } from "lucide-react";
import PageHero from "@/components/PageHero";
import { absoluteUrl, SITE } from "@/config/site";
import { allCategories, allTools } from "@/lib/tools";
import { GUIDES_LIST } from "@/data/guides";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description: "All Nepali Tools is an independent, free tools website built for people in Nepal and Nepalis abroad. Our mission, values and how we keep the site free.",
  alternates: { canonical: absoluteUrl("/about") },
};

export default function AboutPage() {
  const stats = [
    { n: allTools().length, l: "free tools" },
    { n: allCategories().length, l: "topics" },
    { n: GUIDES_LIST.length, l: "guides" },
    { n: 0, l: "sign-ups needed" },
  ];
  return (
    <div>
      <JsonLd data={[
        breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About us", path: "/about" }]),
        { "@context": "https://schema.org", "@type": "AboutPage", name: "About All Nepali Tools", url: absoluteUrl("/about"), about: { "@id": absoluteUrl("/#organization") } },
      ]} />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "About us", path: "/about" }]}
        eyebrow="About us"
        title={<>Useful tools for Nepal, <span className="text-gradient">done properly.</span></>}
        titleNp="हाम्रो बारेमा"
        description={<p>All Nepali Tools is an independent, free website for the small everyday jobs of life in Nepal: dates, money, gold, exams and the Nepali language.</p>}
      />

      <div className="container-np py-14">
        {/* Stats */}
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <li key={s.l} className="card p-6 text-center">
              <p className="font-display text-4xl font-extrabold text-gradient">{s.n}</p>
              <p className="mt-1 text-sm font-medium text-ink-500">{s.l}</p>
            </li>
          ))}
        </ul>

        {/* Story */}
        <section className="mt-16 grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-2 text-3xl font-extrabold">Why we built this</h2>
          </div>
          <div className="prose-np -mt-4">
            <p>
              Simple Nepali questions often lead to slow websites full of pop-ups, old rates and wrong dates. What is today&apos;s
              date in Bikram Sambat? How much is my loan EMI? What does this Preeti document say in Unicode?
            </p>
            <p>
              We started All Nepali Tools in {SITE.founded} to answer those questions quickly and honestly, in one place, on any phone.
              Every tool is written for Nepal: Nepali rupees, Nepali numbers, the BS calendar, Nepali land units and Nepal&apos;s own tax rules.
            </p>
            <p>
              The site is independent. We are not a bank, a jeweller or a government office, and we don&apos;t sell anything.
              We simply make the numbers easy to work out and always point you to the official source.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="relative mt-16 overflow-hidden rounded-4xl bg-navy-950 p-8 text-white sm:p-12">
          <div className="dhaka absolute inset-0" aria-hidden />
          <div className="relative max-w-3xl">
            <Target className="h-8 w-8 text-saffron-300" aria-hidden />
            <p className="mt-4 font-display text-2xl font-bold leading-snug sm:text-3xl">
              Our mission is to make every everyday calculation in Nepal free, fast and correct, for everyone, in English and नेपाली.
            </p>
          </div>
        </section>

        {/* Values */}
        <section className="mt-16">
          <p className="eyebrow">What we believe</p>
          <h2 className="mt-2 text-3xl font-extrabold">Our promises to you</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: BadgeCheck, t: "Accurate, with sources", d: "Rates come from FENEGOSIDA, Nepal Rastra Bank and official notices, always shown with their date." },
              { icon: Lock, t: "Your data stays with you", d: "Tools run in your browser. We don't store what you type." },
              { icon: Smartphone, t: "Made for phones", d: "Fast pages, big buttons and clear results on any screen." },
              { icon: Sparkles, t: "Simple language", d: "Plain English and नेपाली. No jargon, no tricks." },
              { icon: Heart, t: "Free forever", d: "Every tool is free. Clearly labelled ads pay for hosting." },
              { icon: ArrowRight, t: "Quick to fix mistakes", d: "Report an error and we check the official source, correct it and update the page date." },
            ].map((v) => (
              <li key={v.t} className="card p-6">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><v.icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-bold">{v.t}</h3>
                <p className="mt-1 text-[15px] leading-6 text-ink-500 dark:text-ink-400">{v.d}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* How we're funded */}
        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="card p-7">
            <h2 className="text-xl font-bold">How the site stays free</h2>
            <p className="mt-2 leading-7 text-ink-600 dark:text-ink-400">
              We show a small number of ads from Google AdSense. Ads are always labelled and kept away from tool buttons so you never tap one by mistake.
              We never sell your data. Read more in our <Link href="/privacy" className="font-semibold text-brand-700 underline">Privacy Policy</Link>.
            </p>
          </div>
          <div className="card p-7">
            <h2 className="text-xl font-bold">Not financial or legal advice</h2>
            <p className="mt-2 leading-7 text-ink-600 dark:text-ink-400">
              Our tools help you work things out, but they don&apos;t replace a bank, accountant or lawyer. Always confirm important figures before you act.
              See our <Link href="/disclaimer" className="font-semibold text-brand-700 underline">Disclaimer</Link>.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-16 flex flex-col items-start justify-between gap-6 rounded-4xl bg-brand-gradient p-8 text-white sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl font-extrabold sm:text-3xl">Meet the people behind the tools</h2>
            <p className="mt-1 text-white/85">Who we are and how we check every number.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/team" className="btn bg-white text-navy-950 hover:bg-ink-100">Our team</Link>
            <Link href="/how-we-verify" className="btn border border-white/40 text-white hover:bg-white/10">How we check data</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
