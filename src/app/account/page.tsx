import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import AccountView from "./AccountView";

export const metadata: Metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <div>
      <PageHero compact eyebrow="Your account" title="Your account" titleNp="तपाईंको खाता" />
      <div className="container-np py-10">
        <AccountView />
      </div>
    </div>
  );
}
