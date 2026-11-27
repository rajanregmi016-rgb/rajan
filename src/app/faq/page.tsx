import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers to common questions about All Nepali Tools: is it free, how accurate the gold and dollar rates are, whether your data is stored, how to report an error and more.",
  alternates: { canonical: absoluteUrl("/faq") },
};

const GROUPS: Array<{ title: string; items: Array<{ q: string; a: string; link?: { href: string; label: string } }> }> = [
  {
    title: "Using the site",
    items: [
      { q: "Is All Nepali Tools really free?", a: "Yes. Every tool and guide is free, with no sign-up. A small number of clearly labelled ads pay for hosting." },
      { q: "Do I need to create an account?", a: "No. Just open a tool and use it. You can star tools to save them as favourites on your device." },
      { q: "Does it work on my phone?", a: "Yes. The whole site is designed for phones first and works on slow connections. You can also add it to your home screen from your browser menu." },
      { q: "Can I search in Nepali?", a: "Yes. The search understands both English and Nepali words, for example 'मिति' or 'date converter'.", link: { href: "/tools", label: "Browse all tools" } },
    ],
  },
  {
    title: "Accuracy & data",
    items: [
      { q: "Where do the gold and silver rates come from?", a: "From the daily rate fixed by FENEGOSIDA (the Federation of Nepal Gold & Silver Dealers' Associations). Each rate is shown with the date it was published. Always confirm with your jeweller before buying or selling.", link: { href: "/gold-price-in-nepal", label: "Today's gold price" } },
      { q: "Where does the dollar rate come from?", a: "From Nepal Rastra Bank's published exchange rate, shown with its date. Banks and money changers may charge a slightly different rate.", link: { href: "/usd-to-npr", label: "USD to NPR" } },
      { q: "How accurate is the BS to AD date converter?", a: "It uses the published Bikram Sambat month-length tables for 2000 to 2090 BS, and every date is tested in both directions.", link: { href: "/bs-to-ad-converter", label: "BS to AD converter" } },
      { q: "Is the income tax calculator official?", a: "It follows the slabs in the current Finance Act, but it is a helper, not an official assessment. Confirm with the Inland Revenue Department or a tax adviser before filing.", link: { href: "/how-we-verify", label: "How we check our data" } },
    ],
  },
  {
    title: "Privacy",
    items: [
      { q: "Do you store what I type into the tools?", a: "No. The tools run inside your browser, so your dates, amounts and text are not sent to or stored on our servers." },
      { q: "Do you use cookies?", a: "We use Google Analytics to count visits and Google AdSense to show ads. Both use cookies. You can opt out of personalised ads in Google Ads Settings.", link: { href: "/privacy", label: "Privacy Policy" } },
    ],
  },
  {
    title: "Contact",
    items: [
      { q: "I found a wrong number. What should I do?", a: "Please tell us with the page link and the value you expected. We check the official source, fix the page and update its date.", link: { href: "/contact", label: "Report an error" } },
      { q: "Can you build a tool I need?", a: "Probably! Send us your idea. Tools that many people ask for are built first.", link: { href: "/contact", label: "Suggest a tool" } },
    ],
  },
];

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) => g.items).map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div>
      <JsonLd data={[faqLd, breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }])]} />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]}
        eyebrow="Help"
        title="Frequently asked questions"
        titleNp="धेरै सोधिने प्रश्नहरू"
        description={<p>Quick answers about the site, our data and your privacy. Can&apos;t find yours? <Link href="/contact" className="font-semibold text-white underline">Ask us</Link>.</p>}
      />
      <div className="container-np grid gap-10 py-14 lg:grid-cols-[220px_1fr]">
        <nav aria-label="FAQ sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col">
            {GROUPS.map((g) => (
              <li key={g.title}><a href={`#${slug(g.title)}`} className="chip shrink-0 lg:w-full lg:!justify-start">{g.title}</a></li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12">
          {GROUPS.map((g) => (
            <section key={g.title} id={slug(g.title)} className="scroll-mt-24">
              <h2 className="text-2xl font-bold">{g.title}</h2>
              <div className="card mt-4 divide-y divide-ink-200 overflow-hidden !rounded-2xl dark:divide-ink-800">
                {g.items.map((i) => (
                  <details key={i.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15.5px] font-semibold hover:bg-ink-50 group-open:text-brand-700 dark:hover:bg-ink-800/50 dark:group-open:text-brand-300 [&::-webkit-details-marker]:hidden">
                      {i.q}
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500 transition group-open:rotate-45 group-open:bg-brand-600 group-open:text-white dark:bg-ink-800" aria-hidden>+</span>
                    </summary>
                    <div className="px-5 pb-5 text-[15.5px] leading-7 text-ink-600 dark:text-ink-400">
                      <p>{i.a}</p>
                      {i.link && <Link href={i.link.href} className="mt-2 inline-block font-semibold text-brand-700 underline dark:text-brand-300">{i.link.label} →</Link>}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
