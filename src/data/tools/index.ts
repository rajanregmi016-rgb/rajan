import type { Tool } from "@/lib/tools";
import { CATEGORIES } from "@/data/tools/categories";
import { DATE_TOOLS } from "@/data/tools/date";
import { FINANCE_TOOLS } from "@/data/tools/finance";
import {
  GOLD_TOOLS, MATH_EDU_TOOLS, SEE_TOOLS, LANGUAGE_TOOLS, EVERYDAY_TOOLS,
} from "@/data/tools/content-b";
import { EXTRA_TOOLS } from "@/data/tools/extra";
import { BATCH_DATE_TOOLS } from "@/data/tools/batch-dates";
import { BATCH_MONEY_TOOLS } from "@/data/tools/batch-money";
import { BATCH_HOME_TOOLS } from "@/data/tools/batch-home";

export { CATEGORIES };

export const ALL_TOOLS: Tool[] = buildTools();

function buildTools(): Tool[] {
  const groups = [
    ...DATE_TOOLS,
    ...FINANCE_TOOLS,
    ...GOLD_TOOLS,
    ...MATH_EDU_TOOLS,
    ...SEE_TOOLS,
    ...LANGUAGE_TOOLS,
    ...EVERYDAY_TOOLS,
    ...EXTRA_TOOLS,
    ...BATCH_DATE_TOOLS,
    ...BATCH_MONEY_TOOLS,
    ...BATCH_HOME_TOOLS,
  ];
  const seen = new Set<string>();
  return groups.filter((t) => {
    if (seen.has(t.slug)) {
      throw new Error(`Duplicate tool slug: ${t.slug}`);
    }
    seen.add(t.slug);
    return true;
  });
}
