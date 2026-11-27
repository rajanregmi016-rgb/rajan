import type { Metadata } from "next";
import { BadgeCheck, Cloud, Star } from "lucide-react";
import PageHero from "@/components/PageHero";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in or create an account",
  description: "Sign in to All Nepali Tools to save your favourite tools on every device.",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <div>
      <PageHero compact eyebrow="Your account" title="Sign in to All Nepali Tools" titleNp="साइन इन गर्नुहोस्" description={<p>Free account. Save your favourite tools and find them on any phone or computer.</p>} />
      <div className="container-np grid gap-10 py-12 lg:grid-cols-[1fr_440px] lg:items-start">
        <div className="order-2 lg:order-1">
          <h2 className="text-2xl font-extrabold">Why create an account?</h2>
          <ul className="mt-6 space-y-5">
            {[
              { icon: Star, t: "Save your favourite tools", d: "Tap the star on any tool and it's saved to your account." },
              { icon: Cloud, t: "Same tools on every device", d: "Sign in on your phone and computer to see the same favourites." },
              { icon: BadgeCheck, t: "Still free, still private", d: "We only store your email and saved tools. What you type into tools never leaves your device." },
            ].map((x) => (
              <li key={x.t} className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300"><x.icon className="h-5 w-5" aria-hidden /></span>
                <span>
                  <span className="block font-bold">{x.t}</span>
                  <span className="block text-[15px] leading-6 text-ink-500">{x.d}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-ink-500">You don&apos;t need an account to use any tool.</p>
        </div>
        <div className="order-1 lg:order-2"><LoginForm /></div>
      </div>
    </div>
  );
}
