import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { STATIC_PAGES, getStaticPage } from "@/data/staticPages";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

interface Params { params: { slug: string } }

export function generateStaticParams() {
  return STATIC_PAGES.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = getStaticPage(params.slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(`/${page.slug}`) },
  };
}

export default function StaticPage({ params }: Params) {
  const page = getStaticPage(params.slug);
  if (!page) notFound();
  return (
    <div className="container-np py-8">
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: page.title, path: `/${page.slug}` },
      ])} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title, path: `/${page.slug}` }]} />
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-ink-50 sm:text-3xl">{page.title}</h1>
      <div
        className="prose-np mt-4 max-w-3xl"
        dangerouslySetInnerHTML={{ __html: page.html }}
      />
    </div>
  );
}
