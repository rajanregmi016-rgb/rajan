import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
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
    author: { "@type": "Organization", name: "All Nepali Tools", url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: "All Nepali Tools", logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") } },
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
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }, { name: g.title, path: `/guides/${g.slug}` }]}
        eyebrow="Guide"
        title={g.title}
        description={<><p>{g.description}</p><p className="mt-3 text-xs text-white/50">Last updated {new Date(g.updated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })} · By the All Nepali Tools team</p></>}
      />
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
