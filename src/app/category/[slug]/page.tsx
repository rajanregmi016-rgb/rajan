import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
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
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: cat.name, path: `/category/${cat.slug}` }]}
        eyebrow={`${tools.length} ${tools.length === 1 ? "tool" : "tools"}`}
        title={cat.name}
        titleNp={cat.nameNp}
        description={<p>{cat.description}</p>}
        icon={<span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl shadow-glow sm:h-16 sm:w-16 ${meta.solid}`}><Icon className="h-7 w-7 sm:h-8 sm:w-8" aria-hidden /></span>}
      />
      <div className="container-np py-10">
        <ToolGrid tools={tools} className="lg:grid-cols-3" />
        <div className="mt-12">
          <h2 className="text-xl font-bold">Other topics</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {allCategories().filter((c) => c.slug !== cat.slug).map((c) => (
              <li key={c.slug}><Link href={`/category/${c.slug}`} className="chip">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <AdSlot slot="content" />
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
