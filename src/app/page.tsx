import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, CalendarDays, Gem, Search, Wallet } from "lucide-react";
import { absoluteUrl, SITE } from "@/config/site";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { ToolCard } from "@/components/ToolCard";
import { GlobalSearch } from "@/components/Header";
import { RecentlyOrFavorites } from "@/components/ThemeToggle";
import { AdSlot } from "@/components/Analytics";
import { getLiveRates } from "@/lib/server/marketData";
import { KEYWORD_IDEAS } from "@/lib/keywords";
import { orgJsonLd, JsonLd } from "@/lib/seo";
import { formatNpNumber } from "@/lib/nepali";
import { BsTodayChip } from "@/components/BsTodayChip";
import { categoryMeta } from "@/lib/categoryMeta";

export const metadata: Metadata = {
  title: { absolute: "All Nepali Tools — Free Online Tools for Nepal | सबै नेपाली टुल्स" },
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

export const revalidate = 3600;

export default async function HomePage() {
  const tools = allTools();
  const cats = allCategories();
  const popular = tools.filter((t) => t.popular);
  const rates = await getLiveRates();
  const quick = KEYWORD_IDEAS.filter((k) => k.estMonthlyVolume >= 4 && k.status === "covered" && k.toolSlug).slice(0, 4);
  const goldDate = fmtDate(rates.gold.updated);
  const fxDate = fmtDate(rates.forex.updated);
  
  return (
    <div>
      <JsonLd data={orgJsonLd()} />

      {/* ───────── Hero ───────── */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        <div className="dhaka absolute inset-0" aria-hidden />
        <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-brand-600/35 blur-[120px]" aria-hidden />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-saffron-500/20 blur-3xl" aria-hidden />
        <div className="container-np relative pb-28 pt-12 text-center sm:pb-32 sm:pt-20">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[13px] font-medium text-white/85 ring-1 ring-white/15">
            <CalendarDays className="h-4 w-4 text-saffron-300" aria-hidden />
            <BsTodayChip className="devanagari" />
          </p>
          <h1 className="mx-auto mt-6 max-w-4xl text-[40px] font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl">
            Every Nepali tool.
            <br />
            <span className="text-gradient">One simple place.</span>
          </h1>
          <p className="devanagari mx-auto mt-4 text-xl font-semibold text-white/85 sm:text-2xl" lang="ne">सबै नेपाली टुल्स, एकै ठाउँमा।</p>
          <p className="mx-auto mt-4 max-w-2xl text-[16.5px] leading-7 text-white/65 sm:text-lg">
            Convert dates, check today&apos;s gold rate, work out your EMI, tax or SEE GPA, and type in Nepali. Free, fast and made for your phone.
          </p>
          <div className="mx-auto mt-8 max-w-2xl">
            <GlobalSearch variant="hero" />
          </div>
          <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
            {quick.map((k) => (
              <Link key={k.keyword} href={`/${k.toolSlug}`} className="chip-dark">{k.keyword}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Today strip (overlaps hero) ───────── */}
      <section aria-labelledby="today-h" className="container-np relative z-10 -mt-16">
        <div className="card overflow-hidden shadow-tool">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-200/80 px-5 py-3.5 dark:border-ink-800">
            <h2 id="today-h" className="text-[15px] font-bold">Today in Nepal <span className="devanagari ml-1 font-semibold text-ink-400" lang="ne">आजको नेपाल</span></h2>
            <p className="text-xs text-ink-500">Gold: FENEGOSIDA, {goldDate} · Dollar: NRB, {fxDate}</p>
          </div>
          <div className="grid grid-cols-2 divide-ink-200/80 md:grid-cols-4 md:divide-x dark:divide-ink-800">
            <Stat href="/gold-price-in-nepal" icon={<Gem className="h-5 w-5" />} tone="bg-gradient-to-br from-saffron-300 to-saffron-600" label="Fine gold / tola" value={`रु ${formatNpNumber(rates.gold.fineTola)}`} />
            <Stat href="/gold-price-in-nepal" icon={<Gem className="h-5 w-5" />} tone="bg-gradient-to-br from-ink-300 to-ink-600" label="Silver / tola" value={`रु ${formatNpNumber(rates.gold.silverTola)}`} />
            <Stat href="/usd-to-npr" icon={<Wallet className="h-5 w-5" />} tone="bg-gradient-to-br from-emerald-400 to-teal-600" label="1 US dollar" value={`रु ${rates.forex.fallbackUsdNpr.toFixed(2)}`} />
            <Stat href="/nepali-calendar" icon={<CalendarDays className="h-5 w-5" />} tone="bg-gradient-to-br from-brand-500 to-brand-700" label="Nepali calendar" value="Open patro" />
          </div>
        </div>
      </section>

      <div className="container-np py-14 sm:py-16">
        <RecentlyOrFavorites className="mb-12" />

        {/* ───────── Topics ───────── */}
        <section aria-labelledby="cat-h">
          <SectionHead id="cat-h" title="Choose a topic" titleNp="विषय छान्नुहोस्" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {cats.map((c) => {
              const m = categoryMeta(c.slug);
              const Icon = m.icon;
              const n = toolsInCategory(c.slug).length;
              return (
                <Link key={c.slug} href={`/category/${c.slug}`} className="card group flex flex-col p-4 transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5">
                  <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${m.solid}`}><Icon className="h-6 w-6" aria-hidden /></span>
                  <span className="mt-4 text-[15px] font-bold leading-snug group-hover:text-brand-700 sm:text-base dark:group-hover:text-brand-300">{c.name}</span>
                  <span className="devanagari mt-0.5 text-[13px] text-ink-500" lang="ne">{c.nameNp}</span>
                  <span className="mt-3 text-xs font-semibold text-ink-400">{n} {n === 1 ? "tool" : "tools"}</span>
                </Link>
              );
            })}
            <Link href="/tools" className="group flex flex-col justify-between rounded-3xl bg-navy-950 p-4 text-white transition hover:-translate-y-0.5 hover:shadow-lift sm:p-5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15"><Search className="h-6 w-6 text-saffron-300" aria-hidden /></span>
              <span className="mt-4 block">
                <span className="block text-[15px] font-bold sm:text-base">All {tools.length} tools</span>
                <span className="mt-1 inline-flex items-center gap-1 text-[13px] text-white/60">Browse everything <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden /></span>
              </span>
            </Link>
          </div>
        </section>

        {/* ───────── Popular ───────── */}
        <section aria-labelledby="pop-h" className="mt-16">
          <SectionHead id="pop-h" title="Most popular" titleNp="धेरै प्रयोग हुने" href="/tools" hrefLabel="See all" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((t) => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        </section>

        <AdSlot slot="home" />

        {/* ───────── Trust line ───────── */}
        <section aria-label="Why trust us" className="mt-16 flex flex-col items-start gap-5 rounded-3xl border border-ink-200/80 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8 dark:border-ink-800 dark:bg-ink-900">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-gradient text-white"><BadgeCheck className="h-6 w-6" aria-hidden /></span>
            <div>
              <h2 className="text-xl font-bold">Numbers you can trust</h2>
              <p className="mt-1 max-w-xl text-[15px] leading-6 text-ink-500 dark:text-ink-400">Rates come from FENEGOSIDA and Nepal Rastra Bank, always with their date. Tools run on your phone, and nothing you type is stored.</p>
            </div>
          </div>
          <Link href="/how-we-verify" className="btn-dark shrink-0">How we check <ArrowRight className="h-4 w-4" aria-hidden /></Link>
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

function SectionHead({ id, eyebrow, title, titleNp, href, hrefLabel }: { id: string; eyebrow?: string; title: string; titleNp?: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2 id={id} className="mt-1 text-2xl font-extrabold leading-tight sm:text-3xl">
          {title}
          {titleNp && <span className="devanagari mt-1 block text-lg font-semibold text-ink-400 sm:ml-3 sm:inline" lang="ne">{titleNp}</span>}
        </h2>
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline sm:inline-flex dark:text-brand-300">
          {hrefLabel} <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  );
}

function Stat({ href, icon, tone, label, value }: { href: string; icon: React.ReactNode; tone: string; label: string; value: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 border-b border-ink-200/80 p-4 transition hover:bg-ink-50 sm:p-5 md:border-b-0 dark:border-ink-800 dark:hover:bg-ink-800/40 [&:nth-child(odd)]:border-r md:[&:nth-child(odd)]:border-r-0">
      <span className={`hidden h-11 w-11 shrink-0 place-items-center rounded-2xl text-white sm:grid ${tone}`} aria-hidden>{icon}</span>
      <span className="min-w-0">
        <span className="block text-xs font-medium text-ink-500">{label}</span>
        <span className="tnum block truncate font-display text-lg font-bold text-ink-900 group-hover:text-brand-700 sm:text-xl dark:text-white">{value}</span>
      </span>
    </Link>
  );
}
