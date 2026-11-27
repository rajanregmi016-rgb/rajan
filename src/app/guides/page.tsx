import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import PageHero from "@/components/PageHero";
import { GUIDES_LIST } from "@/data/guides";
import { absoluteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Guides & Tutorials for Nepal",
  description:
    "Original, plain-language guides for Nepal: SEE GPA system, BS to AD conversion, buying gold in Nepal, and more — written and updated by the All Nepali Tools team.",
  alternates: { canonical: absoluteUrl("/guides") },
};

export default function GuidesIndex() {
  return (
    <div>
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]}
        eyebrow="Learn"
        title="Guides & tutorials"
        titleNp="सजिलो भाषामा गाइड"
        description={<p>Short, original explainers for the questions Nepalis actually ask, each paired with the tool you need.</p>}
      />
      <div className="container-np grid gap-3 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES_LIST.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white"><BookOpen className="h-5 w-5" aria-hidden /></span>
            <h2 className="mt-4 text-[17px] font-bold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50">{g.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-400">{g.description}</p>
            <span className="mt-auto pt-4 text-xs font-semibold text-brand-700 dark:text-brand-300">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
