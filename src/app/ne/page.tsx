import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { absoluteUrl } from "@/config/site";
import { NE_PAGES } from "@/data/ne";

export const metadata: Metadata = {
  title: "नेपाली उपकरणहरू — मिति, सुनको भाउ, डलर, कर र अरू",
  description: "सबै नेपाली टुल्स नेपाली भाषामा: आजको मिति, मिति परिवर्तन, सुनको भाउ, डलरको भाउ, आयकर, ईएमआई, प्रीति युनिकोड र जग्गा नाप।",
  alternates: { canonical: absoluteUrl("/ne"), languages: { en: absoluteUrl("/tools"), ne: absoluteUrl("/ne") } },
};

export default function NeIndex() {
  return (
    <div lang="ne" className="devanagari">
      <PageHero compact crumbs={[{ name: "गृहपृष्ठ", path: "/" }, { name: "नेपालीमा", path: "/ne" }]} title="नेपालीमा उपकरणहरू" titleNp="All Nepali Tools in Nepali"
        description={<p>सबैभन्दा धेरै प्रयोग हुने उपकरणहरू, नेपाली भाषामा व्याख्या सहित।</p>} />
      <div className="container-np py-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {NE_PAGES.map((p) => (
            <li key={p.slug}>
              <Link href={`/ne/${p.slug}`} className="card block h-full p-5 hover:border-brand-400">
                <span className="text-lg font-bold">{p.h1}</span>
                <span className="mt-1 block text-sm text-ink-500">{p.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
