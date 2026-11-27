import { absoluteUrl, SITE } from "@/config/site";
import type { Tool } from "@/lib/tools";

/** Organization + WebSite schema for the homepage. */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": absoluteUrl("/#organization"),
        name: SITE.name,
        alternateName: SITE.nameNp,
        url: absoluteUrl("/"),
        logo: absoluteUrl("/logo.png"),
      },
      {
        "@type": "WebSite",
        "@id": absoluteUrl("/#website"),
        name: SITE.name,
        alternateName: SITE.nameNp,
        url: absoluteUrl("/"),
        description: SITE.description,
        inLanguage: ["ne-NP", "en"],
        publisher: { "@id": absoluteUrl("/#organization") },
        potentialAction: {
          "@type": "SearchAction",
          target: { "@type": "EntryPoint", urlTemplate: absoluteUrl("/tools?q={search_term_string}") },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

/** WebApplication/SoftwareApplication for a tool page — only where accurate. */
export function toolJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.title,
    alternateName: tool.h1Np,
    description: tool.description,
    url: absoluteUrl(`/${tool.slug}`),
    applicationCategory: tool.renderAs === "info" ? "Reference" : "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: ["ne-NP", "en"],
    offers: { "@type": "Offer", price: "0", priceCurrency: "NPR" },
    publisher: { "@id": absoluteUrl("/#organization") },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}

/** FAQPage — only for genuine FAQs listed on the page (never fabricated). */
export function faqJsonLd(tool: Tool) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: tool.content.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
    })),
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
