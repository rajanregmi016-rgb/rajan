import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  path: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-[13px]">
      <ol className="flex flex-wrap items-center gap-1 text-ink-500">
        {items.map((c, i) => (
          <li key={c.path} className="flex items-center gap-1">
            {i > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-ink-300" />}
            {i === items.length - 1 ? (
              <span aria-current="page" className="font-medium text-ink-800 dark:text-ink-200">{c.name}</span>
            ) : (
              <Link href={c.path} className="hover:text-brand-700 hover:underline dark:hover:text-brand-300">{c.name}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
