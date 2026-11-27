import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Bug, Lightbulb, Mail } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/app/contact/ContactForm";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl, SITE } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Report an error, suggest a tool, or reach the All Nepali Tools team about advertising and partnerships.",
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }])} />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }]}
        eyebrow="Contact"
        title="We'd love to hear from you"
        titleNp="हामीलाई लेख्नुहोस्"
        description={<p>Spotted a wrong number? Want a new tool? We read every message and fix errors after checking the official source.</p>}
      />
      <div className="container-np grid gap-8 py-12 lg:grid-cols-[1.6fr_1fr]">
        <ContactForm />
        <aside className="space-y-4">
          <div className="card p-6">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white"><Mail className="h-5 w-5" aria-hidden /></span>
            <h2 className="mt-4 text-lg font-bold">Email us directly</h2>
            <a href={`mailto:${SITE.email}`} className="mt-1 block font-semibold text-brand-700 hover:underline dark:text-brand-300">{SITE.email}</a>
            <p className="mt-2 text-sm leading-6 text-ink-500">For corrections, ideas, advertising and partnerships.</p>
          </div>
          <ul className="card divide-y divide-ink-200 overflow-hidden dark:divide-ink-800">
            {[
              { icon: Bug, t: "Report an error", d: "Send the page link and the number you expected. We check the official source, fix it, and update the page date." },
              { icon: Lightbulb, t: "Suggest a tool", d: "Tell us which Nepali task still has no good tool. Popular requests are built first." },
              { icon: BookOpen, t: "Before you write", d: "Many questions are answered in our FAQ." },
            ].map((x) => (
              <li key={x.t} className="flex gap-3 p-5">
                <x.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden />
                <div>
                  <h3 className="font-semibold">{x.t}</h3>
                  <p className="mt-1 text-sm leading-6 text-ink-500">{x.d}{x.t === "Before you write" && <> <Link href="/faq" className="font-semibold text-brand-700 underline">Read the FAQ</Link>.</>}</p>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
