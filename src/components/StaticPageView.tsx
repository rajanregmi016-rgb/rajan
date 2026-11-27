import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getStaticPage } from "@/data/staticPages";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";

export function staticPageMeta(page: { title: string; description: string; slug: string }): Metadata {
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: absoluteUrl(`/${page.slug}`) },
  };
}

export default function StaticPageView({ slug }: { slug: string }) {
  const page = getStaticPage(slug);
  if (!page) notFound();
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: page.title, path: `/${page.slug}` },
      ])} />
      <header className="border-b border-ink-200/80 bg-gradient-to-b from-ink-100 to-paper dark:border-ink-800 dark:from-ink-900 dark:to-ink-950">
        <div className="container-np pb-10 pt-6">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: page.title, path: `/${page.slug}` }]} />
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">{page.title}</h1>
        </div>
      </header>
      <div className="container-np py-10">
        <div className="prose-np max-w-3xl" dangerouslySetInnerHTML={{ __html: page.html }} />
      </div>
    </div>
  );
}
