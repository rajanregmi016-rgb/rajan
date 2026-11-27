import {
  CalendarDays, Wallet, Gem, Calculator, GraduationCap, Languages, Home, Wrench,
  type LucideIcon,
} from "lucide-react";

export interface CategoryMeta {
  icon: LucideIcon;
  /** icon tile: background + text colour */
  tile: string;
  /** soft band behind page headers */
  band: string;
}

const META: Record<string, CategoryMeta> = {
  "nepali-date-calendar": {
    icon: CalendarDays,
    tile: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
    band: "from-brand-50",
  },
  "finance-tax-currency": {
    icon: Wallet,
    tile: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    band: "from-emerald-50",
  },
  "gold-silver-price": {
    icon: Gem,
    tile: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    band: "from-amber-50",
  },
  "math-education": {
    icon: Calculator,
    tile: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    band: "from-sky-50",
  },
  "see-exam": {
    icon: GraduationCap,
    tile: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    band: "from-violet-50",
  },
  "nepali-language-unicode": {
    icon: Languages,
    tile: "bg-navy-50 text-navy-700 dark:bg-navy-900/50 dark:text-navy-200",
    band: "from-navy-50",
  },
  "land-everyday": {
    icon: Home,
    tile: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    band: "from-orange-50",
  },
};

const FALLBACK: CategoryMeta = {
  icon: Wrench,
  tile: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
  band: "from-ink-100",
};

export function categoryMeta(slug: string): CategoryMeta {
  return META[slug] ?? FALLBACK;
}
