export interface Faq {
  q: string;
  a: string;
}

export interface ExampleTable {
  heading: string;
  rows: string[][];
}

export type ToolComponentKey =
  | "bs2ad" | "ad2bs" | "calendar" | "age" | "dateDiff"
  | "emi" | "incomeTax" | "vat" | "usdNpr" | "compound"
  | "gold" | "percentage" | "unit" | "bmi" | "seeGpa"
  | "preeti" | "typing" | "numWords" | "land" | "time"
  | "sip" | "fd" | "simpleInterest" | "discount" | "lakhCrore"
  | "tola" | "wordCount" | "billSplit" | "fuelCost" | "nebGpa"
  | "currency"
  | `f:${string}`;

export interface Tool {
  slug: string;
  title: string;             // <title> (meta)
  h1: string;                // English H1
  h1Np: string;              // Nepali name under H1
  shortTitle: string;        // cards & search
  description: string;       // meta description
  category: string;          // category slug
  keywords: string[];        // EN + NE target keywords
  popular?: boolean;         // shows in "Popular tools"
  trending?: boolean;        // shows in "Trending searches"
  componentKey: ToolComponentKey;
  renderAs: "tool" | "info";
  lastUpdated: string;       // ISO date shown as "Last updated"
  sourceNote?: string;       // data source / disclaimer line
  related: string[];         // related tool slugs
  content: {
    intro: string[];         // paragraphs, plain text w/ **bold**
    steps: string[];         // how-to steps
    examples?: ExampleTable[];
    faqs: Faq[];
  };
}

export interface Category {
  slug: string;
  name: string;
  nameNp: string;
  description: string;
  icon: string; // emoji fallback, replaced by lucide icon in UI
}

export function allCategories(): Category[] { return CATEGORIES; }
export function allTools(): Tool[] { return ALL_TOOLS; }
export function getTool(slug: string): Tool | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug);
}
export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
export function toolsInCategory(catSlug: string): Tool[] {
  return ALL_TOOLS.filter((t) => t.category === catSlug);
}
export function popularTools(): Tool[] {
  return ALL_TOOLS.filter((t) => t.popular).sort((a, b) => a.h1.length - b.h1.length).slice(0, 12);
}

import { CATEGORIES, ALL_TOOLS } from "@/data/tools";
