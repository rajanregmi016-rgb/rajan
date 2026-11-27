import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AccountView from "./AccountView";
import { getLiveRates } from "@/lib/server/marketData";
import { getGoldHistory, getNrbRange, nepalToday, shiftDate } from "@/lib/server/history";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const today = nepalToday();
  const [rates, goldHist, fxDays] = await Promise.all([getLiveRates(), getGoldHistory().catch(() => []), getNrbRange(shiftDate(today, -7), today, 3600).catch(() => [])]);
  const usdOf = (d?: { rates: { iso3: string; sell: number }[] }) => d?.rates.find((r) => r.iso3 === "USD")?.sell ?? null;
  const lastFx = fxDays[fxDays.length - 1];
  const prevFx = fxDays[fxDays.length - 2];
  const prevGold = goldHist.filter((g) => g.date < today).pop();
  const dash = {
    gold: rates.gold.fineTola,
    goldPrev: prevGold?.fineTola ?? null,
    silver: rates.gold.silverTola,
    usd: usdOf(lastFx) ?? rates.forex.fallbackUsdNpr,
    usdPrev: usdOf(prevFx),
    fxDate: lastFx?.date ?? rates.fx?.date ?? null,
    fx: lastFx?.rates ?? rates.fx?.rates ?? [],
  };
  return (
    <div>
      <PageHero compact eyebrow="Your account" title="Your account" titleNp="तपाईंको खाता" />
      <div className="container-np py-10">
        <AccountView rates={dash} />
      </div>
    </div>
  );
}
