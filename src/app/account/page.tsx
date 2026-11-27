import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AccountView from "./AccountView";
import { getLiveRates } from "@/lib/server/marketData";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const rates = await getLiveRates();
  return (
    <div>
      <PageHero compact eyebrow="Your account" title="Your account" titleNp="तपाईंको खाता" />
      <div className="container-np py-10">
        <AccountView gold={rates.gold.fineTola} usd={rates.forex.fallbackUsdNpr} />
      </div>
    </div>
  );
}
