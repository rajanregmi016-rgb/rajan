import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ResetForm from "./ResetForm";

export const metadata: Metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <div>
      <PageHero compact eyebrow="Your account" title="Set a new password" titleNp="नयाँ पासवर्ड" />
      <div className="container-np py-10"><ResetForm /></div>
    </div>
  );
}
