import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, BadgeCheck, BookOpen, CalendarDays, Gem, Landmark, MousePointerClick, Search, Smartphone, Sparkles, Wallet, Zap } from "lucide-react";
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
  title: { absolute: "All Nepali Tools — Free Online Tools for Nepal | सबै नेपाली टुल्स" },
  description: SITE.description,
  alternates: { canonical: absoluteUrl("/") },
};

export default function HomePage() {
  const tools = allTools();
  const cats = allCategories();
  const popular = tools.filter((t) => t.popular);
  const rates = getRates();
  const quick = KEYWORD_IDEAS.filter((k) => k.estMonthlyVolume >= 4 && k.status === "covered" && k.toolSlug).slice(0, 5);
  const goldDate = fmtDate(rates.gold.updated);
  const fxDate = fmtDate(rates.forex.updated);
  const [big1, big2, ...rest] = cats;

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
          <ul className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13.5px] text-white/60">
            <li className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-saffron-300" aria-hidden />{tools.length} free tools</li>
            <li className="flex items-center gap-1.5"><BadgeCheck className="h-4 w-4 text-saffron-300" aria-hidden />Official sources</li>
            <li className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-saffron-300" aria-hidden />No sign-up</li>
          </ul>
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

      <div className="container-np py-16 sm:py-20">
        <RecentlyOrFavorites className="mb-12" />

        {/* ───────── Topics (bento) ───────── */}
        <section aria-labelledby="cat-h">
          <SectionHead id="cat-h" eyebrow="Explore" title="What do you need today?" titleNp="आज के चाहियो?" href="/tools" hrefLabel="See all tools" />
          <div className="grid gap-4 md:grid-cols-4">
            {[big1, big2].map((c) => {
              const m = categoryMeta(c.slug);
              const Icon = m.icon;
              const list = toolsInCategory(c.slug);
              return (
                <div key={c.slug} className="card group relative overflow-hidden p-6 md:col-span-2">
                  <div className="dhaka-light absolute inset-0 opacity-60" aria-hidden />
                  <div className="relative flex items-start gap-4">
                    <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-sm ${m.solid}`}><Icon className="h-7 w-7" aria-hidden /></span>
                    <div>
                      <h3 className="text-xl font-bold"><Link href={`/category/${c.slug}`} className="hover:text-brand-700">{c.name}</Link></h3>
                      <p className="devanagari text-sm text-ink-500" lang="ne">{c.nameNp}</p>
                    </div>
                  </div>
                  <ul className="relative mt-5 flex flex-wrap gap-2">
                    {list.map((t) => (
                      <li key={t.slug}><Link href={`/${t.slug}`} className="chip">{t.shortTitle}</Link></li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {rest.map((c) => {
              const m = categoryMeta(c.slug);
              const Icon = m.icon;
              const n = toolsInCategory(c.slug).length;
              return (
                <Link key={c.slug} href={`/category/${c.slug}`} className="card group flex items-center gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl shadow-sm ${m.solid}`}><Icon className="h-6 w-6" aria-hidden /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15.5px] font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">{c.name}</span>
                    <span className="devanagari block text-[13px] text-ink-500" lang="ne">{c.nameNp} · {n} {n === 1 ? "tool" : "tools"}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden />
                </Link>
              );
            })}
            <Link href="/guides" className="group flex items-center gap-4 rounded-3xl bg-navy-950 p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/15"><BookOpen className="h-6 w-6 text-saffron-300" aria-hidden /></span>
              <span className="flex-1">
                <span className="block text-[15.5px] font-bold">Guides</span>
                <span className="devanagari block text-[13px] text-white/60" lang="ne">सजिलो भाषामा · {GUIDES_LIST.length} guides</span>
              </span>
              <ArrowRight className="h-4 w-4 text-white/50" aria-hidden />
            </Link>
          </div>
        </section>

        {/* ───────── Popular ───────── */}
        <section aria-labelledby="pop-h" className="mt-20">
          <SectionHead id="pop-h" eyebrow="Most used" title="Popular right now" titleNp="धेरै प्रयोग हुने" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(0, 6).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {popular.slice(6, 12).map((t) => <ToolCard key={t.slug} tool={t} compact />)}
          </div>
        </section>

        <AdSlot slot="home" />

        {/* ───────── How it works ───────── */}
        <section aria-labelledby="how-h" className="mt-20">
          <SectionHead id="how-h" eyebrow="Simple" title="Answers in three taps" titleNp="तीन चरणमा उत्तर" />
          <ol className="grid gap-4 md:grid-cols-3">
            {[
              { icon: Search, t: "Find your tool", d: "Search in English or Nepali, or pick a topic." },
              { icon: MousePointerClick, t: "Enter your numbers", d: "Simple boxes with examples. No sign-up, no forms." },
              { icon: Sparkles, t: "Get the answer", d: "Results update instantly, in रुपैयाँ and नेपाली अंक where useful." },
            ].map((s, i) => (
              <li key={s.t} className="card relative p-6">
                <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-ink-100 dark:text-ink-800" aria-hidden>{i + 1}</span>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><s.icon className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-4 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-[15px] leading-6 text-ink-500 dark:text-ink-400">{s.d}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ───────── Trust ───────── */}
        <section aria-labelledby="trust-h" className="relative mt-20 overflow-hidden rounded-4xl bg-navy-950 p-7 text-white sm:p-12">
          <div className="dhaka absolute inset-0" aria-hidden />
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
          <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1.4fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-saffron-300">Why trust us</p>
              <h2 id="trust-h" className="mt-3 text-3xl font-extrabold sm:text-4xl">Real numbers. Real sources. <span className="text-gradient">No guessing.</span></h2>
              <p className="devanagari mt-3 text-white/60" lang="ne">किन विश्वास गर्ने?</p>
              <Link href="/how-we-verify" className="btn mt-6 bg-white text-navy-950 hover:bg-ink-100">How we check our data <ArrowRight className="h-4 w-4" aria-hidden /></Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-3">
              <Trust icon={<Landmark className="h-5 w-5" />} t="Official sources" d="FENEGOSIDA for gold, Nepal Rastra Bank for dollars, the Finance Act for tax." />
              <Trust icon={<BadgeCheck className="h-5 w-5" />} t="Dated & honest" d="Every rate shows its date. If we can't verify it, we say so." />
              <Trust icon={<Smartphone className="h-5 w-5" />} t="Private" d="Tools run in your browser. What you type stays on your phone." />
            </ul>
          </div>
        </section>

        {/* ───────── Guides ───────── */}
        <section aria-labelledby="guide-h" className="mt-20">
          <SectionHead id="guide-h" eyebrow="Learn" title="Guides in plain language" titleNp="सजिलो भाषामा गाइड" href="/guides" hrefLabel="All guides" />
          <div className="grid gap-4 md:grid-cols-3">
            {GUIDES_LIST.slice(0, 3).map((g, i) => (
              <Link key={g.slug} href={`/guides/${g.slug}`} className="group card flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lift">
                <div className={`relative h-28 overflow-hidden ${["bg-gradient-to-br from-brand-500 to-saffron-400", "bg-gradient-to-br from-navy-600 to-brand-500", "bg-gradient-to-br from-saffron-300 to-brand-600"][i % 3]}`}>
                  <div className="dhaka absolute inset-0" aria-hidden />
                  <BookOpen className="absolute bottom-4 left-5 h-8 w-8 text-white/90" aria-hidden />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[16.5px] font-bold leading-snug group-hover:text-brand-700 dark:group-hover:text-brand-300">{g.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-500 dark:text-ink-400">{g.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700 dark:text-brand-300">Read guide <ArrowRight className="h-4 w-4" aria-hidden /></span>
                </div>
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

function SectionHead({ id, eyebrow, title, titleNp, href, hrefLabel }: { id: string; eyebrow: string; title: string; titleNp?: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="mt-2 text-[28px] font-extrabold leading-tight sm:text-4xl">
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

function Trust({ icon, t, d }: { icon: React.ReactNode; t: string; d: string }) {
  return (
    <li className="rounded-3xl bg-white/5 p-5 ring-1 ring-white/10">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-gradient text-white" aria-hidden>{icon}</span>
      <h3 className="mt-3 font-bold">{t}</h3>
      <p className="mt-1 text-sm leading-6 text-white/60">{d}</p>
    </li>
  );
}
