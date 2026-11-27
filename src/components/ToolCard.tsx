import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { categoryMeta } from "@/lib/categoryMeta";

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const meta = categoryMeta(tool.category);
  const Icon = meta.icon;
  if (compact) {
    return (
      <Link
        href={`/${tool.slug}`}
        className="group flex items-center gap-3 rounded-2xl border border-ink-200/80 bg-white p-3 pr-4 transition hover:border-ink-300 hover:shadow-lift dark:border-ink-800 dark:bg-ink-900"
      >
        <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.solid}`}>
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[14.5px] font-semibold text-ink-900 group-hover:text-brand-700 dark:text-ink-50 dark:group-hover:text-brand-300">{tool.shortTitle}</span>
          <span className="devanagari block truncate text-[12.5px] text-ink-500" lang="ne">{tool.h1Np.split("—")[0].trim()}</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" aria-hidden />
      </Link>
    );
  }
  return (
    <Link
      href={`/${tool.slug}`}
      className="group card flex flex-col p-5 transition duration-200 hover:-translate-y-1 hover:border-ink-300 hover:shadow-lift dark:hover:border-ink-700"
    >
      <div className="flex items-start justify-between">
        <span className={`grid h-12 w-12 place-items-center rounded-2xl shadow-sm ${meta.solid}`}>
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-100 text-ink-500 transition group-hover:bg-brand-600 group-hover:text-white dark:bg-ink-800">
          <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </div>
      <span className="mt-4 text-[16.5px] font-bold leading-snug text-ink-900 dark:text-ink-50">{tool.shortTitle}</span>
      <span className="devanagari text-[13.5px] text-ink-500" lang="ne">{tool.h1Np.split("—")[0].trim()}</span>
      <span className="mt-2 line-clamp-2 text-[13.5px] leading-5 text-ink-500 dark:text-ink-400">{tool.description}</span>
    </Link>
  );
}

export function ToolGrid({ tools, className, compact }: { tools: Tool[]; className?: string; compact?: boolean }) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className ?? ""}`}>
      {tools.map((t) => (
        <ToolCard key={t.slug} tool={t} compact={compact} />
      ))}
    </div>
  );
}
