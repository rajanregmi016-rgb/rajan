import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BookOpen, Gem, Landmark, Smartphone, Sparkles, Wallet } from "lucide-react";
import { absoluteUrl, SITE } from "@/config/site";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { GlobalSearch } from "@/components/Header";
import { RecentlyOrFavorites } from "@/components/ThemeToggle";
import { AdSlot } from "@/components/Analytics";
import { getRates } from "@/lib/rates";
import { KEYWORD_IDEAS } from "@/lib/keywords";
import { orgJsonLd, JsonLd } from "@/lib/seo";
import { formatNpNumber } from "@/lib/nepali";
import { BsTodayChip } from "@/components/BsTodayChip";
import { categoryMeta } from "@/lib/categoryMeta";
import { GUIDES_LIST } from "@/data/guides";

export const metadata: Metadata = {
  title: "Nepali Tools — Free Online Tools for Nepal (नेपाली टुल्स)",
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  const tools = allTools();
  const popular = tools.filter((t) => t.popular);
  const isNew = [...tools].reverse().filter((t) => !t.popular).slice(0, 6);
  const rates = getRates();
  const trendingSearches = KEYWORD_IDEAS.filter((k) => k.estMonthlyVolume >= 4 && k.status === "covered" && k.toolSlug).slice(0, 6);
  const goldDate = fmtDate(rates.gold.updated);
  const fxDate = fmtDate(rates.forex.updated);

  return (
    <div>
      <JsonLd data={orgJsonLd()} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-200/80 dark:border-ink-800">
        <HeroBackdrop />
        <div className="container-np relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" aria-hidden /> Free tools for Nepal
            </p>
            <h1 className="mt-4 text-[34px] font-extrabold leading-[1.08] tracking-tight text-ink-900 dark:text-white sm:text-5xl lg:text-[56px]">
              Every Nepali tool you need,{" "}
              <span className="text-brand-600 dark:text-brand-400">in one place.</span>
            </h1>
            <p className="devanagari mt-3 text-xl font-semibold text-navy-700 dark:text-navy-200" lang="ne">
              सबै नेपाली टुल्स, एकै ठाउँमा।
            </p>
            <p className="mt-4 max-w-xl text-[17px] leading-7 text-ink-600 dark:text-ink-300">
              Convert BS and AD dates, check today&apos;s gold price, work out your EMI, tax or SEE GPA, and type in Nepali.
              {" "}{tools.length} free tools. No sign-up needed.
            </p>
            <div className="mt-7 max-w-xl">
              <GlobalSearch />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-medium text-ink-500">Popular:</span>
              {trendingSearches.map((k) => (
                <Link key={k.keyword} href={`/${k.toolSlug}`} className="chip !py-1">
                  {k.keyword}
                </Link>
              ))}
            </div>
          </div>

          {/* Today in Nepal */}
          <aside aria-labelledby="today-h" className="card overflow-hidden shadow-tool">
            <div className="flex items-center justify-between gap-3 bg-navy-900 px-5 py-4 text-white">
              <div>
                <h2 id="today-h" className="text-base font-bold">Today in Nepal</h2>
                <p className="devanagari text-[13px] text-navy-200" lang="ne">आजको नेपाल</p>
              </div>
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-navy-100">NPT · UTC+5:45</span>
            </div>
            <div className="border-b border-ink-200 px-5 py-4 dark:border-ink-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Date</p>
              <p className="mt-1 text-[15px] font-semibold text-ink-900 dark:text-ink-50">
                <BsTodayChip className="devanagari" />
              </p>
            </div>
            <dl className="divide-y divide-ink-200 dark:divide-ink-800">
              <RateRow icon={<Gem className="h-4 w-4" />} tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                label="Fine gold" sub="per tola" value={`Rs ${formatNpNumber(rates.gold.fineTola)}`} href="/gold-price-in-nepal" />
              <RateRow icon={<Gem className="h-4 w-4" />} tone="bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"
                label="Silver" sub="per tola" value={`Rs ${formatNpNumber(rates.gold.silverTola)}`} href="/gold-price-in-nepal" />
              <RateRow icon={<Wallet className="h-4 w-4" />} tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                label="US dollar" sub="1 USD in NPR" value={`Rs ${rates.forex.fallbackUsdNpr.toFixed(2)}`} href="/usd-to-npr" />
            </dl>
            <p className="bg-ink-50 px-5 py-3 text-[12px] leading-5 text-ink-500 dark:bg-ink-950 dark:text-ink-400">
              Gold: FENEGOSIDA, {goldDate}. Dollar: Nepal Rastra Bank, {fxDate}. Always confirm with the official source before you buy or sell.
            </p>
          </aside>
        </div>
      </section>

      <div className="container-np py-12 sm:py-16">
        <RecentlyOrFavorites className="mb-10" />

        {/* Categories */}
        <section aria-labelledby="cat-h">
          <SectionHeader id="cat-h" eyebrow="Browse" title="Find a tool by topic" titleNp="विषय अनुसार टुल्स" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {allCategories().map((c) => {
              const m = categoryMeta(c.slug);
              const Icon = m.icon;
              const count = toolsInCategory(c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="group card flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5"
                >
                  <span className={`grid h-11 w-11 place-items-center rounded-xl ${m.tile}`}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="mt-4 text-[15px] font-bold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50 dark:group-hover:text-brand-300">
                    {c.name}
                  </span>
                  <span className="devanagari mt-0.5 text-[13px] text-ink-500" lang="ne">{c.nameNp}</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-500 group-hover:text-brand-700">
                    {count} {count === 1 ? "tool" : "tools"} <ArrowRight className="h-3 w-3" aria-hidden />
                  </span>
                </Link>
              );
            })}
            <Link
              href="/guides"
              className="group flex flex-col rounded-2xl border border-dashed border-ink-300 p-4 transition hover:border-brand-400 hover:bg-white sm:p-5 dark:border-ink-700 dark:hover:bg-ink-900"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                <BookOpen className="h-5 w-5" aria-hidden />
              </span>
              <span className="mt-4 text-[15px] font-bold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50">Guides</span>
              <span className="devanagari mt-0.5 text-[13px] text-ink-500" lang="ne">गाइडहरू</span>
              <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-ink-500 group-hover:text-brand-700">
                {GUIDES_LIST.length} guides <ArrowRight className="h-3 w-3" aria-hidden />
              </span>
            </Link>
          </div>
        </section>

        {/* Popular */}
        <section aria-labelledby="popular-h" className="mt-16">
          <SectionHeader id="popular-h" eyebrow="Most used" title="Popular tools" titleNp="धेरै प्रयोग हुने टुल्स" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 9).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
        </section>

        <AdSlot slot="top-mid" />

        {/* Trust band */}
        <section aria-labelledby="trust-h" className="mt-12 overflow-hidden rounded-3xl bg-navy-900 text-white">
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_2fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-300">Why people trust us</p>
              <h2 id="trust-h" className="mt-2 text-2xl font-extrabold sm:text-3xl">Accurate numbers, shown with their source.</h2>
              <p className="devanagari mt-2 text-navy-200" lang="ne">किन विश्वास गर्ने?</p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-3">
              <TrustItem icon={<Landmark className="h-5 w-5" />} title="Official sources"
                text="Gold from FENEGOSIDA, dollar rates from Nepal Rastra Bank, tax slabs from the Finance Act." />
              <TrustItem icon={<BadgeCheck className="h-5 w-5" />} title="Nothing made up"
                text="Every rate shows the date it was published. If we can't verify it, we say so." />
              <TrustItem icon={<Smartphone className="h-5 w-5" />} title="Fast on any phone"
                text="Tools run in your browser. No sign-up, no app to install." />
            </ul>
          </div>
        </section>

        {/* New tools */}
        <section aria-labelledby="new-h" className="mt-16">
          <SectionHeader id="new-h" eyebrow={<span className="inline-flex items-center gap-1"><Sparkles className="h-3.5 w-3.5" /> Just added</span>} title="More everyday tools" titleNp="थप दैनिक टुल्स" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {isNew.map((t) => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        </section>

        {/* Guides */}
        <section aria-labelledby="guide-h" className="mt-16">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader id="guide-h" eyebrow="Learn" title="Guides in plain language" titleNp="सजिलो भाषामा गाइड" />
            <Link href="/guides" className="mb-6 hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:inline-flex dark:text-brand-300">
              All guides <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {GUIDES_LIST.slice(0, 3).map((g) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                <BookOpen className="h-5 w-5 text-navy-600 dark:text-navy-300" aria-hidden />
                <h3 className="mt-3 text-[16px] font-bold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50">{g.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-500 dark:text-ink-400">{g.description}</p>
                <span className="mt-auto pt-4 text-xs font-semibold text-brand-700 dark:text-brand-300">Read guide →</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kathmandu" });
}

function SectionHeader({ id, eyebrow, title, titleNp }: { id: string; eyebrow?: React.ReactNode; title: string; titleNp?: string }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink-900 dark:text-ink-50 sm:text-[28px]">
        {title}
        {titleNp && <span className="devanagari ml-3 text-lg font-semibold text-ink-400" lang="ne">{titleNp}</span>}
      </h2>
    </div>
  );
}

function RateRow({ icon, tone, label, sub, value, href }: { icon: React.ReactNode; tone: string; label: string; sub: string; value: string; href: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 px-5 py-3.5 transition hover:bg-ink-50 dark:hover:bg-ink-800/50">
      <span className={`grid h-9 w-9 place-items-center rounded-lg ${tone}`} aria-hidden>{icon}</span>
      <span className="flex-1">
        <dt className="text-sm font-semibold text-ink-800 dark:text-ink-100">{label}</dt>
        <span className="text-xs text-ink-500">{sub}</span>
      </span>
      <dd className="tnum text-lg font-bold text-ink-900 group-hover:text-brand-700 dark:text-white">{value}</dd>
    </Link>
  );
}

function TrustItem({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <li className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white" aria-hidden>{icon}</span>
      <h3 className="mt-3 font-bold">{title}</h3>
      <p className="mt-1 text-sm leading-6 text-navy-200">{text}</p>
    </li>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-paper to-paper dark:from-navy-950 dark:via-ink-950 dark:to-ink-950" />
      <svg className="absolute bottom-0 left-0 h-40 w-full text-navy-100/70 dark:text-navy-900/40" viewBox="0 0 1200 160" preserveAspectRatio="none">
        <path d="M0 160 L0 110 L90 70 L150 95 L260 30 L340 80 L420 55 L520 105 L610 40 L700 85 L790 20 L880 75 L960 50 L1050 95 L1130 60 L1200 85 L1200 160 Z" fill="currentColor" />
      </svg>
      <svg className="absolute bottom-0 left-0 h-24 w-full text-ink-100 dark:text-ink-900/60" viewBox="0 0 1200 100" preserveAspectRatio="none">
        <path d="M0 100 L0 70 L140 45 L260 72 L380 38 L520 66 L660 30 L800 60 L940 40 L1080 68 L1200 48 L1200 100 Z" fill="currentColor" />
      </svg>
    </div>
  );
}
