import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/Analytics";
import { GUIDES_LIST } from "@/data/guides";
import { absoluteUrl } from "@/config/site";

interface Params { params: { slug: string } }

export function generateStaticParams() {
  return GUIDES_LIST.map((g) => ({ slug: g.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const g = GUIDES_LIST.find((x) => x.slug === params.slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.description,
    alternates: { canonical: absoluteUrl(`/guides/${g.slug}`) },
    openGraph: { type: "article", title: g.title, description: g.description, url: absoluteUrl(`/guides/${g.slug}`), modifiedTime: g.updated, images: [absoluteUrl("/opengraph-image")] },
  };
}

const ARTICLE_SCHEMA = (slug: string, title: string, description: string, updated: string) => [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    dateModified: updated,
    datePublished: updated,
    image: absoluteUrl("/opengraph-image"),
    author: { "@type": "Organization", name: "Nepali Tools", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "Nepali Tools", logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
    mainEntityOfPage: absoluteUrl(`/guides/${slug}`),
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Guides", item: absoluteUrl("/guides") },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(`/guides/${slug}`) },
    ],
  },
];

export default function GuidePage({ params }: Params) {
  const g = GUIDES_LIST.find((x) => x.slug === params.slug);
  if (!g) notFound();
  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_SCHEMA(g.slug, g.title, g.description, g.updated)) }} />
      <header className="border-b border-ink-200/80 bg-gradient-to-b from-navy-50 to-paper dark:border-ink-800 dark:from-ink-900 dark:to-ink-950">
        <div className="container-np pb-10 pt-6">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]} />
          <p className="eyebrow">Guide</p>
          <h1 className="mt-2 max-w-3xl text-[26px] font-extrabold leading-tight tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">{g.title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-ink-600 dark:text-ink-400">{g.description}</p>
          <p className="mt-3 text-xs text-ink-500">Last updated {new Date(g.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </header>
      <div className="container-np py-10">
        <div className="prose-np max-w-3xl" dangerouslySetInnerHTML={{ __html: g.html }} />
        <div className="max-w-3xl"><AdSlot slot="content" /></div>
        {g.related && (
          <nav className="mt-10 max-w-3xl rounded-2xl border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900" aria-label="Related">
            <h2 className="text-sm font-bold uppercase tracking-wide text-ink-500">Tools for this guide</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {g.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="chip">{r.label} →</Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </article>
  );
}
