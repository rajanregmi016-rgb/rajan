import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ToolsDirectory, { type DirGroup } from "./ToolsDirectory";

export const metadata: Metadata = {
  title: "All Nepali Tools — Complete List (सबै टुल्स)",
  description:
    "Every free tool on All Nepali Tools in one list: BS/AD date converters, Nepali calendar, gold price, USD to NPR, EMI, income tax, VAT, SEE GPA, Preeti to Unicode, land units and more.",
  alternates: { canonical: absoluteUrl("/tools") },
};

export default function ToolsPage() {
  const tools = allTools();
  const groups: DirGroup[] = allCategories()
    .map((c) => ({
      slug: c.slug,
      name: c.name,
      nameNp: c.nameNp,
      tools: toolsInCategory(c.slug).map((t) => ({
        slug: t.slug,
        title: t.shortTitle,
        np: t.h1Np.split("—")[0].trim(),
        desc: t.description,
        keys: t.keywords.join(" "),
      })),
    }))
    .filter((g) => g.tools.length > 0);

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "All Nepali Tools",
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.shortTitle,
      url: absoluteUrl(`/${t.slug}`),
    })),
  };

  return (
    <div>
      <JsonLd data={[itemList, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "All tools", path: "/tools" }])]} />
      <PageHero
        compact
        crumbs={[{ name: "Home", path: "/" }, { name: "All tools", path: "/tools" }]}
        eyebrow={`${tools.length} free tools`}
        title="All tools"
        titleNp="सबै टुल्स"
        description={<p>Every tool on the site, grouped by topic. Type to filter, or tap a topic to jump to it.</p>}
      />
      <div className="container-np pb-10">
        <ToolsDirectory groups={groups} />
      </div>
    </div>
  );
}
