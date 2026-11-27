import type { Metadata } from "next";
import Breadcrumbs from "@/components/Breadcrumbs";
import ContactForm from "@/app/contact/ContactForm";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { absoluteUrl, SITE } from "@/config/site";
import { getStaticPage } from "@/data/staticPages";

export const metadata: Metadata = {
  title: "Contact Us",
  description: getStaticPage("contact")?.description,
  alternates: { canonical: absoluteUrl("/contact") },
};

export default function ContactPage() {
  return (
    <div className="container-np py-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact Us", path: "/contact" },
        ])}
      />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }]} />

      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-ink-50 sm:text-3xl">Contact Us</h1>
        <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-400">
          We are a small team and genuinely read every message. Use the form below to report a data
          error, suggest a tool, or reach us about advertising — we reply to the email you provide.
        </p>
      </header>

      <div className="max-w-2xl">
        <ContactForm />
      </div>

      <section className="prose-np mt-10 max-w-2xl">
        <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">What happens next</h2>
        <p>
          Error reports are verified against official sources before we fix anything, and the fixed
          tool page gets a new last-updated date. Tool suggestions are matched against our keyword
          research — ideas with real search demand get prioritised on the roadmap.
        </p>
        <p>
          For advertising and business enquiries (available once Google AdSense is live), you can
          also write directly to <strong>{SITE.email}</strong>.
        </p>
      </section>
    </div>
  );
}
