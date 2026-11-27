import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import ToolsDirectory, { type DirGroup } from "./ToolsDirectory";

export const metadata: Metadata = {
  title: "All Nepali Tools — Complete List (सबै टुल्स)",
  description:
    "Every free tool on Nepali Tools in one list: BS/AD date converters, Nepali calendar, gold price, USD to NPR, EMI, income tax, VAT, SEE GPA, Preeti to Unicode, land units and more.",
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
      <header className="border-b border-ink-200/80 bg-gradient-to-b from-brand-50 to-paper dark:border-ink-800 dark:from-ink-900 dark:to-ink-950">
        <div className="container-np pb-8 pt-6">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "All tools", path: "/tools" }]} />
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">All tools</h1>
          <p className="devanagari mt-1 text-lg font-semibold text-brand-700 dark:text-brand-300" lang="ne">सबै टुल्स</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-ink-600 dark:text-ink-400">
            Every free tool on the site, grouped by topic. Type to filter, or tap a topic to jump to it.
          </p>
        </div>
      </header>
      <div className="container-np pb-10">
        <ToolsDirectory groups={groups} />
      </div>
    </div>
  );
}
