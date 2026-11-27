import { SITE } from "@/config/site";

export interface StaticPage {
  slug: string;
  title: string;
  description: string;
  html: string;
}

export const STATIC_PAGES: StaticPage[] = [
  {
    slug: "about",
    title: "About Nepali Tools",
    description:
      "Who builds Nepali Tools and why — an independent, free utilities platform built for Nepal.",
    html: `
<p><strong>Nepali Tools (नेपाली टुल्स)</strong> is an independent, free online tools platform built for people in Nepal and the Nepali diaspora. We started with a simple observation: Nepal-specific questions — date conversion, gold rates, loan EMIs, SEE results, Preeti documents — deserve honest, fast tools instead of pop-up ad farms.</p>
<h2 class="mt-6 text-lg font-bold">What we promise</h2>
<ul class="ml-5 mt-2 list-disc space-y-2 text-[15px] leading-7 text-ink-700 dark:text-ink-300">
<li>Every tool runs in your browser — we don't store your inputs.</li>
<li>Conversions use verified calendar data (BS 2000–2090) and documented formulas.</li>
<li>Rate pages show their source and last-updated date, and clearly flag reference values.</li>
<li>Content is written for Nepal, reviewed before publishing, and updated when rules change.</li>
</ul>
<h2 class="mt-6 text-lg font-bold">How we sustain the site</h2>
<p>Non-intrusive advertising (Google AdSense once approved) covers hosting costs. We never sell data or show fake traffic. If you find an error, please <a class="text-brand-700 underline dark:text-brand-300" href="/contact">tell us</a> — corrections are our best SEO and our duty.</p>
`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    description:
      "Report an error, suggest a tool, or reach the Nepali Tools editorial team.",
    html: `
<p>We are a small team and genuinely read every message. Three common reasons to write:</p>
<h2 class="mt-6 text-lg font-bold">Report a data or content error</h2>
<p>A wrong rate, a conversion that looks off, an outdated slab — email us the page URL and what you expected. We verify against official sources before fixing and update the tool's last-updated date.</p>
<h2 class="mt-6 text-lg font-bold">Suggest a tool or guide</h2>
<p>Tell us which Nepal-specific task still has no good tool. Keyword research drives the roadmap, and requests with real demand get prioritised.</p>
<h2 class="mt-6 text-lg font-bold">Business &amp; advertising</h2>
<p>Contact us regarding advertising placements (once AdSense is live) or partnership queries at <strong>${SITE.email}</strong>.</p>
`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "Nepali Tools privacy policy: what we collect (almost nothing), how analytics and cookies work, AdSense disclosures and your choices.",
    html: `
<p>Last updated: 8 November 2026. This policy explains what data Nepali Tools collects and why. In one sentence: <strong>our tools run in your browser and we collect almost nothing.</strong></p>
<h2 class="mt-6 text-lg font-bold">What we collect</h2>
<p>Tool inputs (dates, amounts, text you convert) are processed locally in your browser and never sent to, or stored on, our servers. Favorites and recently used tools are saved in your browser's localStorage only. Server logs (like any website) may briefly record IP address and browser type for security and debugging.</p>
<h2 class="mt-6 text-lg font-bold">Analytics &amp; advertising</h2>
<p>Anonymised aggregate analytics (Google Analytics, once configured) help us see which tools are useful. When ads are enabled, <strong>Google AdSense</strong> may use cookies to show contextual ads; you can opt out of personalised advertising via Google Ads Settings (adssettings.google.com). We do not build profiles or sell data — we don't have it.</p>
<h2 class="mt-6 text-lg font-bold">Third-party services</h2>
<p>Exchange rates load from a public currency API (open.er-api.com), which sees only standard web-request metadata. Google Fonts may be used for typography. No accounts, newsletters or marketing emails exist today.</p>
<h2 class="mt-6 text-lg font-bold">Your choices</h2>
<p>Clear your browser's localStorage to erase favorites/recent tools. Block or delete cookies to disable analytics/ads cookies. Contact <strong>${SITE.email}</strong> for any privacy question.</p>
`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Information accuracy, financial data and no-advice disclaimer for Nepali Tools.",
    html: `
<p>Content on Nepali Tools is provided for information and convenience. While we work with verified data and review every update, we do not guarantee absolute accuracy; always confirm critical figures with official sources (Nepal Rastra Bank, Inland Revenue Department, FENEGOSIDA jewellers, NEB results, government offices).</p>
<h2 class="mt-6 text-lg font-bold">Rates &amp; financial figures</h2>
<p>Gold/silver and exchange rates are reference values with their source and date displayed on the page. Markets move; use live quotes before acting. Nothing on this site is financial, tax or legal advice — consult a licensed professional (banker, chartered accountant, lawyer) for your situation.</p>
<h2 class="mt-6 text-lg font-bold">Editorial standards</h2>
<p>Content is human-reviewed before publishing; the internal SEO engine only drafts suggestions, which sit in a review queue. We do not publish scraped, spun or auto-generated thin pages.</p>
<h2 class="mt-6 text-lg font-bold">Liability</h2>
<p>To the extent permitted by law, Nepali Tools is not liable for decisions made solely on the basis of content on this site.</p>
`,
  },
];

export function getStaticPage(slug: string) {
  return STATIC_PAGES.find((p) => p.slug === slug);
}
