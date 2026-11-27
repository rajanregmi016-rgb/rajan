import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { CopyButton } from "@/components/tools/ui";
import { SITE_URL, absoluteUrl } from "@/config/site";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Gold Price, Exchange Rate & Nepali Date Widgets for Your Website",
  description: "Add today's gold price in Nepal, NRB exchange rates or today's Nepali date to your website or blog for free. Copy one line of code. Updates automatically.",
  alternates: { canonical: absoluteUrl("/widgets") },
};

const WIDGETS = [
  { id: "gold", name: "Gold & silver price", np: "सुन चाँदीको भाउ", h: 215, about: "Fine gold per tola and per 10 grams, and silver per tola. Updates every hour from FENEGOSIDA." },
  { id: "forex", name: "Exchange rates", np: "विनिमय दर", h: 330, about: "Nepal Rastra Bank selling rates for the US dollar, euro, pound, Australian dollar, Indian rupee and Gulf currencies." },
  { id: "date", name: "Today's Nepali date", np: "आजको मिति", h: 150, about: "Today's date in Bikram Sambat, in English and Nepali, with the weekday. Changes at midnight Nepal time." },
];

export default function WidgetsPage() {
  const crumbs = [{ name: "Home", path: "/" }, { name: "Free widgets", path: "/widgets" }];
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <PageHero
        compact
        crumbs={crumbs}
        eyebrow="For website owners"
        title={<>Free widgets for <span className="text-gradient">your website</span></>}
        titleNp="तपाईंको वेबसाइटका लागि निःशुल्क विजेट"
        description={<p>Show today&apos;s gold price, exchange rates or Nepali date on your news site, jewellery shop page or blog. Copy one line of code and paste it where you want the box to appear. It updates itself, and it&apos;s free.</p>}
      />
      <div className="container-np space-y-10 py-10">
        {WIDGETS.map((w) => {
          const code = (theme: string) => `<iframe src="${SITE_URL}/widget/${w.id}${theme === "dark" ? "?theme=dark" : ""}" width="320" height="${w.h}" style="border:0;max-width:100%" loading="lazy" title="${w.name} — All Nepali Tools"></iframe>`;
          return (
            <section key={w.id} className="grid gap-6 lg:grid-cols-[340px_1fr]">
              <div className="space-y-3">
                <iframe src={`/widget/${w.id}`} width={320} height={w.h} style={{ border: 0, maxWidth: "100%" }} loading="lazy" title={`${w.name} preview`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{w.name} <span className="devanagari text-lg font-semibold text-ink-500">{w.np}</span></h2>
                <p className="mt-2 text-ink-600 dark:text-ink-300">{w.about}</p>
                {["light", "dark"].map((t) => (
                  <div key={t} className="mt-4">
                    <p className="label">{t === "light" ? "Light version" : "Dark version"}</p>
                    <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-all rounded-2xl bg-ink-100 p-3 text-xs dark:bg-ink-800">{code(t)}</pre>
                    <div className="mt-2"><CopyButton text={code(t)} label="Copy code" /></div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        <section className="card p-6">
          <h2 className="text-xl font-bold">How to add it</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-ink-600 dark:text-ink-300">
            <li><strong>WordPress:</strong> add a &quot;Custom HTML&quot; block or widget and paste the code.</li>
            <li><strong>Blogger:</strong> Layout → Add a Gadget → HTML/JavaScript, then paste.</li>
            <li><strong>Any other site:</strong> paste the code into the page&apos;s HTML where you want the box.</li>
          </ul>
          <p className="mt-3 text-sm text-ink-500">Please keep the small &quot;All Nepali Tools&quot; link in the box. Questions? <Link className="underline" href="/contact">Contact us</Link>.</p>
        </section>
      </div>
    </div>
  );
}
