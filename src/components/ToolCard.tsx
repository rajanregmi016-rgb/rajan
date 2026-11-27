import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/tools";
import { categoryMeta } from "@/lib/categoryMeta";

export function ToolCard({ tool, compact }: { tool: Tool; compact?: boolean }) {
  const meta = categoryMeta(tool.category);
  const Icon = meta.icon;
  return (
    <Link
      href={`/${tool.slug}`}
      className="group card relative flex gap-3.5 p-4 transition hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-lift dark:hover:border-ink-700"
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.tile}`}>
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="text-[15px] font-semibold leading-snug text-ink-900 group-hover:text-brand-700 dark:text-ink-50 dark:group-hover:text-brand-300">
            {tool.shortTitle}
          </span>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-ink-300 transition group-hover:text-brand-600" aria-hidden />
        </span>
        <span className="devanagari block text-[13px] text-ink-500 dark:text-ink-400" lang="ne">
          {tool.h1Np.split("—")[0].trim()}
        </span>
        {!compact && (
          <span className="mt-1.5 line-clamp-2 block text-[13px] leading-5 text-ink-500 dark:text-ink-400">
            {tool.description}
          </span>
        )}
      </span>
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
