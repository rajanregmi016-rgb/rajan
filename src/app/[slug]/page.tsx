import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { ToolCard } from "@/components/ToolCard";
import { AdSlot } from "@/components/Analytics";
import { getTool, getCategory, allTools, toolsInCategory } from "@/lib/tools";
import { categoryMeta } from "@/lib/categoryMeta";
import { ChevronRight } from "lucide-react";
import { getRates, getForex } from "@/lib/rates";
import { TOOL_COMPONENTS } from "@/components/tools/toolComponents";
import { faqJsonLd, JsonLd, breadcrumbJsonLd, toolJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";
import ToolStructuredPage from "@/components/ToolStructuredPage";
import { BsTodayChip } from "@/components/BsTodayChip";
import { FavoriteButton } from "@/components/ThemeToggle";

interface Params {
  params: { slug: string };
}

export function generateStaticParams() {
  return allTools().map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tool = getTool(params.slug);
  if (!tool) return {};
  return {
    title: tool.title,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: absoluteUrl(`/${tool.slug}`) },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: absoluteUrl(`/${tool.slug}`),
      type: "website",
    },
  };
}

export default async function ToolPage({ params }: Params) {
  const tool = getTool(params.slug);
  if (!tool) notFound();
  const category = getCategory(tool.category)!;

  // Data loads (server side, cached)
  const rates = getRates();
  const forex = await getForex();
  const ratesWithForex = {
    ...rates,
    forex: { ...rates.forex, fallbackUsdNpr: forex.usdNpr },
  };

  const Comp = TOOL_COMPONENTS[tool.componentKey];

  const crumbs = [
    { name: "Home", path: "/" },
    { name: category.name, path: `/category/${category.slug}` },
    { name: tool.shortTitle, path: `/${tool.slug}` },
  ];

  const meta = categoryMeta(category.slug);
  const Icon = meta.icon;
  const related = tool.related.map((s) => getTool(s)!).filter(Boolean);
  const more = toolsInCategory(category.slug).filter((t) => t.slug !== tool.slug && !tool.related.includes(t.slug)).slice(0, 4);

  return (
    <article>
      <JsonLd data={[toolJsonLd(tool), faqJsonLd(tool), breadcrumbJsonLd(crumbs)]} />

      <PageHero
        compact
        crumbs={crumbs}
        title={tool.h1}
        titleNp={tool.h1Np}
        description={<p className="hidden sm:block">{tool.description}</p>}
        icon={
          <span className={`hidden h-16 w-16 shrink-0 place-items-center rounded-2xl shadow-glow sm:grid ${meta.solid}`}>
            <Icon className="h-8 w-8" aria-hidden />
          </span>
        }
      >
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/70">
          <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15">Updated {formatDate(tool.lastUpdated)}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 ring-1 ring-white/15"><BsTodayChip className="devanagari" /></span>
          <FavoriteButton slug={tool.slug} onDark />
        </div>
      </PageHero>

      <div className="container-np grid gap-10 py-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {/* The tool itself — always first in content order */}
          <section id="tool" aria-label={`${tool.shortTitle} tool`} className="scroll-mt-24">
            <Comp rates={ratesWithForex} />
          </section>

          <nav aria-label="On this page" className="mt-6 flex flex-wrap gap-2">
            <span className="self-center text-[13px] font-medium text-ink-500">On this page:</span>
            <a href="#about-h" className="chip !py-1">About</a>
            <a href="#steps-h" className="chip !py-1">How to use</a>
            {tool.content.examples?.length ? <a href="#example-0" className="chip !py-1">Example</a> : null}
            <a href="#faq-h" className="chip !py-1">FAQ</a>
          </nav>

          <AdSlot slot="tool" />

          <ToolStructuredPage tool={tool} />

          {tool.sourceNote && (
            <p className="mt-8 rounded-2xl border border-amber-300/60 bg-amber-50/80 p-4 text-[13px] leading-6 text-amber-900 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200">
              <strong>Where this data comes from:</strong> {tool.sourceNote}
            </p>
          )}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Related tools">
          {related.length > 0 && (
            <section aria-labelledby="rel-h">
              <h2 id="rel-h" className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink-500">Related tools</h2>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
                {related.map((t) => <ToolCard key={t.slug} tool={t} compact />)}
              </div>
            </section>
          )}
          {more.length > 0 && (
            <section aria-labelledby="more-h">
              <h2 id="more-h" className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-ink-500">More in {category.name}</h2>
              <ul className="card divide-y divide-ink-200 overflow-hidden !rounded-2xl dark:divide-ink-800">
                {more.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}`} className="flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-ink-800 hover:bg-ink-50 hover:text-brand-700 dark:text-ink-200 dark:hover:bg-ink-800">
                      {t.shortTitle} <ChevronRight className="h-4 w-4 text-ink-300" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <Link href={`/category/${category.slug}`} className="btn-ghost w-full">
            All {category.name} tools
          </Link>
        </aside>
      </div>
    </article>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
