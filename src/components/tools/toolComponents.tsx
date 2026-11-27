// Server-side component map. IMPORTANT: this file must NOT have "use client" —
// it runs in RSC and holds direct references to client components so the React
// client manifest can resolve them (dynamic lookup into a client module's
// export object is not supported).
import { Bs2AdTool, Ad2BsTool } from "@/components/tools/dateTools";
import { CalendarTool, AgeTool, DateDiffTool } from "@/components/tools/calendarTools";
import {
  EmiTool, IncomeTaxTool, VatTool, UsdNprTool, CompoundTool,
} from "@/components/tools/financeTools";
import { GoldTool, NumWordsTool, SeeGpaTool } from "@/components/tools/miscTools";
import {
  PreetiTool, TypingTool, PercentageTool, UnitTool, BmiTool, LandTool, NepalTimeTool,
} from "@/components/tools/moreTools";
import {
  SipTool, FdTool, SimpleInterestTool, DiscountTool, LakhCroreTool,
  TolaTool, WordCountTool, BillSplitTool, FuelCostTool, NebGpaTool, CurrencyTool,
} from "@/components/tools/extraTools";
import FormulaTool from "@/components/tools/formulaTools";
import type { RatesData } from "@/lib/rates";
import type { ToolComponentKey } from "@/lib/tools";

export type ToolProps = { rates: RatesData };

export const TOOL_COMPONENTS: Record<string, React.ComponentType<ToolProps>> = {
  bs2ad: Bs2AdTool,
  ad2bs: Ad2BsTool,
  calendar: CalendarTool,
  age: AgeTool,
  dateDiff: DateDiffTool,
  emi: EmiTool,
  incomeTax: IncomeTaxTool,
  vat: VatTool,
  usdNpr: UsdNprTool,
  compound: CompoundTool,
  gold: GoldTool,
  percentage: PercentageTool,
  unit: UnitTool,
  bmi: BmiTool,
  seeGpa: SeeGpaTool,
  preeti: PreetiTool,
  typing: TypingTool,
  numWords: NumWordsTool,
  land: LandTool,
  time: NepalTimeTool,
  sip: SipTool,
  fd: FdTool,
  simpleInterest: SimpleInterestTool,
  discount: DiscountTool,
  lakhCrore: LakhCroreTool,
  tola: TolaTool,
  wordCount: WordCountTool,
  billSplit: BillSplitTool,
  fuelCost: FuelCostTool,
  nebGpa: NebGpaTool,
  currency: CurrencyTool,
};

/** Resolve a tool's component; "f:<id>" keys render the shared calculator engine. */
export function getToolComponent(key: ToolComponentKey): React.ComponentType<ToolProps> {
  if (key.startsWith("f:")) {
    const id = key.slice(2);
    const Formula = ({ rates }: ToolProps) => <FormulaTool id={id} rates={rates} />;
    Formula.displayName = `Formula(${id})`;
    return Formula;
  }
  return TOOL_COMPONENTS[key];
}
