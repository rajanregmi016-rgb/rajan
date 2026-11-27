import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import Breadcrumbs from "@/components/Breadcrumbs";
import { GUIDES_LIST } from "@/data/guides";
import { absoluteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Guides & Tutorials for Nepal",
  description:
    "Original, plain-language guides for Nepal: SEE GPA system, BS to AD conversion, buying gold in Nepal, and more — written and updated by the Nepali Tools team.",
  alternates: { canonical: absoluteUrl("/guides") },
};

export default function GuidesIndex() {
  return (
    <div>
      <header className="border-b border-ink-200/80 bg-gradient-to-b from-navy-50 to-paper dark:border-ink-800 dark:from-ink-900 dark:to-ink-950">
        <div className="container-np pb-10 pt-6">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }]} />
          <h1 className="text-[26px] font-extrabold tracking-tight text-ink-900 dark:text-ink-50 sm:text-4xl">Guides &amp; tutorials</h1>
          <p className="devanagari mt-1 text-lg font-semibold text-brand-700 dark:text-brand-300" lang="ne">सजिलो भाषामा गाइड</p>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-ink-600 dark:text-ink-400">
            Short, original explainers for the questions Nepalis actually ask, each paired with the tool you need.
          </p>
        </div>
      </header>
      <div className="container-np grid gap-3 py-10 sm:grid-cols-2 lg:grid-cols-3">
        {GUIDES_LIST.map((g) => (
          <Link key={g.slug} href={`/guides/${g.slug}`} className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
            <BookOpen className="h-5 w-5 text-navy-600 dark:text-navy-300" aria-hidden />
            <h2 className="mt-3 text-[16px] font-bold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50">{g.title}</h2>
            <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-ink-400">{g.description}</p>
            <span className="mt-auto pt-4 text-xs font-semibold text-brand-700 dark:text-brand-300">Read guide →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
