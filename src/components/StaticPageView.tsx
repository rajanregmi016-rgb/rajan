import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
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
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: page.title, path: `/${page.slug}` }]}
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description ? <p>{page.description}</p> : undefined}
      />
      <div className="container-np py-10">
        <div className="mx-auto max-w-3xl">
          <div className="card px-6 py-4 sm:px-10 sm:py-8">
            <div className="prose-np" dangerouslySetInnerHTML={{ __html: page.html }} />
          </div>
        </div>
      </div>
    </div>
  );
}
