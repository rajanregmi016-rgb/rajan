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
  /** bold gradient tile (icon on colour) */
  solid: string;
}

const META: Record<string, CategoryMeta> = {
  "nepali-date-calendar": {
    icon: CalendarDays,
    tile: "bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300",
    band: "from-brand-50",
    solid: "bg-gradient-to-br from-brand-500 to-brand-700 text-white",
  },
  "finance-tax-currency": {
    icon: Wallet,
    tile: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    band: "from-emerald-50",
    solid: "bg-gradient-to-br from-emerald-400 to-teal-600 text-white",
  },
  "gold-silver-price": {
    icon: Gem,
    tile: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    band: "from-amber-50",
    solid: "bg-gradient-to-br from-saffron-300 to-saffron-600 text-white",
  },
  "math-education": {
    icon: Calculator,
    tile: "bg-sky-50 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    band: "from-sky-50",
    solid: "bg-gradient-to-br from-sky-400 to-blue-600 text-white",
  },
  "see-exam": {
    icon: GraduationCap,
    tile: "bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
    band: "from-violet-50",
    solid: "bg-gradient-to-br from-violet-400 to-purple-700 text-white",
  },
  "nepali-language-unicode": {
    icon: Languages,
    tile: "bg-navy-50 text-navy-700 dark:bg-navy-900/50 dark:text-navy-200",
    band: "from-navy-50",
    solid: "bg-gradient-to-br from-navy-400 to-navy-700 text-white",
  },
  "land-everyday": {
    icon: Home,
    tile: "bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    band: "from-orange-50",
    solid: "bg-gradient-to-br from-orange-400 to-rose-600 text-white",
  },
};

const FALLBACK: CategoryMeta = {
  icon: Wrench,
  tile: "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200",
  band: "from-ink-100",
  solid: "bg-gradient-to-br from-ink-400 to-ink-700 text-white",
};

export function categoryMeta(slug: string): CategoryMeta {
  return META[slug] ?? FALLBACK;
}
