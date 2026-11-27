import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageHero from "@/components/PageHero";
import { AdSlot } from "@/components/Analytics";
import ShareTool from "@/components/ShareTool";
import { getTool } from "@/lib/tools";
import { getForex } from "@/lib/rates";
import { getLiveRates } from "@/lib/server/marketData";
import { getToolComponent } from "@/components/tools/toolComponents";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/config/site";
import { NE_PAGES, getNePage } from "@/data/ne";

type P = { params: { slug: string } };

export function generateStaticParams() {
  return NE_PAGES.map((p) => ({ slug: p.slug }));
}
export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const ne = getNePage(params.slug);
  if (!ne) return {};
  return {
    title: ne.title,
    description: ne.description,
    alternates: {
      canonical: absoluteUrl(`/ne/${ne.slug}`),
      languages: { en: absoluteUrl(`/${ne.slug}`), ne: absoluteUrl(`/ne/${ne.slug}`) },
    },
    openGraph: { title: ne.title, description: ne.description, url: absoluteUrl(`/ne/${ne.slug}`), locale: "ne_NP", type: "website" },
  };
}

export default async function NePageView({ params }: P) {
  const ne = getNePage(params.slug);
  const tool = getTool(params.slug);
  if (!ne || !tool) notFound();
  const rates = await getLiveRates();
  const forex = rates.live.forex ? null : await getForex();
  const r = forex ? { ...rates, forex: { ...rates.forex, fallbackUsdNpr: forex.usdNpr } } : rates;
  const Comp = getToolComponent(tool.componentKey);
  const crumbs = [{ name: "गृहपृष्ठ", path: "/" }, { name: "नेपालीमा", path: "/ne" }, { name: ne.h1, path: `/ne/${ne.slug}` }];
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ne",
    mainEntity: ne.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <article lang="ne" className="devanagari">
      <JsonLd data={[faq, breadcrumbJsonLd(crumbs)]} />
      <PageHero compact crumbs={crumbs} title={ne.h1} titleNp={tool.shortTitle} description={<p className="hidden sm:block">{ne.description}</p>}>
        <p className="mt-4 text-sm text-white/70"><Link className="underline" href={`/${tool.slug}`} hrefLang="en">Read this page in English</Link></p>
      </PageHero>
      <div className="container-np max-w-4xl py-8 sm:py-10">
        <section id="tool" lang="en">
          <Comp rates={r} />
          <ShareTool title={ne.h1} path={`/ne/${ne.slug}`} />
        </section>
        <AdSlot slot="tool" />
        <section className="prose-np mt-10 space-y-4 text-[17px] leading-8 text-ink-700 dark:text-ink-200">
          {ne.intro.map((p, i) => <p key={i}>{p}</p>)}
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-bold">कसरी प्रयोग गर्ने</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-6 text-[17px] leading-8">
            {ne.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </section>
        <section className="mt-10">
          <h2 className="text-2xl font-bold">धेरै सोधिने प्रश्न</h2>
          <div className="mt-4 space-y-3">
            {ne.faqs.map((f, i) => (
              <details key={i} className="card p-5" open={i === 0}>
                <summary className="cursor-pointer text-lg font-semibold">{f.q}</summary>
                <p className="mt-2 leading-8 text-ink-700 dark:text-ink-200">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="mt-10">
          <h2 className="text-xl font-bold">अरू उपकरण नेपालीमा</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {NE_PAGES.filter((p) => p.slug !== ne.slug).map((p) => (
              <li key={p.slug}><Link className="chip" href={`/ne/${p.slug}`}>{p.h1}</Link></li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
