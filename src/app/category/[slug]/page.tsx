import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ToolGrid } from "@/components/ToolCard";
import { AdSlot } from "@/components/Analytics";
import { allCategories, getCategory, toolsInCategory } from "@/lib/tools";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";
import { categoryMeta } from "@/lib/categoryMeta";

interface Params { params: { slug: string } }

export function generateStaticParams() {
  return allCategories().map((c) => ({ slug: c.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const cat = getCategory(params.slug);
  if (!cat) return {};
  return {
    title: `${cat.name} — ${cat.nameNp}`,
    description: cat.description,
    alternates: { canonical: absoluteUrl(`/category/${cat.slug}`) },
  };
}

export default function CategoryPage({ params }: Params) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();
  const tools = toolsInCategory(cat.slug);
  const meta = categoryMeta(cat.slug);
  const Icon = meta.icon;
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: cat.name, path: `/category/${cat.slug}` },
      ])} />
      <header className={`border-b border-ink-200/80 bg-gradient-to-b ${meta.band} to-paper dark:border-ink-800 dark:from-ink-900 dark:to-ink-950`}>
        <div className="container-np pb-10 pt-6">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: cat.name, path: `/category/${cat.slug}` }]} />
          <div className="flex items-start gap-4">
            <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ring-1 ring-black/5 ${meta.tile}`}>
              <Icon className="h-7 w-7" aria-hidden />
            </span>
            <div className="max-w-2xl">
              <h1 className="text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">{cat.name}</h1>
              <p className="devanagari mt-1 text-lg font-semibold text-brand-700 dark:text-brand-300" lang="ne">{cat.nameNp}</p>
              <p className="mt-3 text-[15px] leading-6 text-ink-600 dark:text-ink-400">{cat.description}</p>
              <p className="mt-3 text-sm font-semibold text-ink-500">{tools.length} {tools.length === 1 ? "tool" : "tools"}</p>
            </div>
          </div>
        </div>
      </header>
      <div className="container-np py-10">
        <ToolGrid tools={tools} className="lg:grid-cols-3" />
        <AdSlot slot="category-bottom" />
        <div className="prose-np mt-8 max-w-2xl">
          <p>
            All {tools.length} {cat.name.toLowerCase()} tools run in your browser, work in English and नेपाली, and are updated
            when Nepali rules and rates change. Each tool page shows the date it was last updated.
          </p>
        </div>
      </div>
    </div>
  );
}
