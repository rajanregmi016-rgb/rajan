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
<h2>What we promise</h2>
<ul>
<li>Every tool runs in your browser — we don't store your inputs.</li>
<li>Conversions use verified calendar data (BS 2000–2090) and documented formulas.</li>
<li>Rate pages show their source and last-updated date, and clearly flag reference values.</li>
<li>Content is written for Nepal, reviewed before publishing, and updated when rules change.</li>
</ul>
<h2>How we sustain the site</h2>
<p>Non-intrusive advertising from Google AdSense covers hosting costs. Ads are always labelled and kept away from tool buttons, so you never click one by mistake. We never sell data or show fake traffic. If you find an error, please <a href="/contact">tell us</a> — corrections are our best SEO and our duty.</p>
`,
  },
  {
    slug: "contact",
    title: "Contact Us",
    description:
      "Report an error, suggest a tool, or reach the Nepali Tools editorial team.",
    html: `
<p>We are a small team and genuinely read every message. Three common reasons to write:</p>
<h2>Report a data or content error</h2>
<p>A wrong rate, a conversion that looks off, an outdated slab — email us the page URL and what you expected. We verify against official sources before fixing and update the tool's last-updated date.</p>
<h2>Suggest a tool or guide</h2>
<p>Tell us which Nepal-specific task still has no good tool. Keyword research drives the roadmap, and requests with real demand get prioritised.</p>
<h2>Business &amp; advertising</h2>
<p>Contact us regarding advertising placements (once AdSense is live) or partnership queries at <strong>${SITE.email}</strong>.</p>
`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    description:
      "Nepali Tools privacy policy: what we collect (almost nothing), how Google Analytics and Google AdSense cookies work, and how to opt out.",
    html: `
<p>Last updated: 27 November 2026. This policy explains what data Nepali Tools collects and why. In one sentence: <strong>our tools run in your browser and we collect almost nothing.</strong></p>
<h2>What we collect</h2>
<p>Tool inputs (dates, amounts, text you convert) are processed in your browser and are not sent to or stored on our servers. Favourite and recently used tools are saved in your browser's localStorage only. Like any website, our hosting provider (Vercel) may briefly log IP address and browser type for security and debugging.</p>
<h2>Analytics</h2>
<p>We use <strong>Google Analytics</strong> to count visits and see which tools are useful. It uses cookies and collects aggregate information such as pages viewed, device type and approximate country. We do not use it to identify you.</p>
<h2>Advertising and cookies</h2>
<p>We show ads through <strong>Google AdSense</strong>. Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to this site and/or other sites on the Internet.</p>
<ul>
<li>You can opt out of personalised advertising by visiting <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google Ads Settings</a>.</li>
<li>You can also opt out of some third-party vendors' use of cookies for personalised advertising at <a href="https://www.aboutads.info/choices/" rel="nofollow noopener" target="_blank">www.aboutads.info</a>.</li>
<li>Learn more in <a href="https://policies.google.com/technologies/partner-sites" rel="nofollow noopener" target="_blank">How Google uses information from sites that use its services</a>.</li>
</ul>
<h2>Third-party services</h2>
<p>Exchange rates may load from a public currency API (open.er-api.com), which sees only standard web-request information. Fonts are served by Google Fonts through our own domain.</p>
<h2>Children</h2>
<p>The site is suitable for students, but we do not knowingly collect personal information from children under 13.</p>
<h2>Your choices</h2>
<p>Clear your browser's localStorage to erase favourites and recent tools. Block or delete cookies in your browser to disable analytics and ad cookies. Contact <strong>${SITE.email}</strong> with any privacy question.</p>
`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    description:
      "Information accuracy, financial data and no-advice disclaimer for Nepali Tools.",
    html: `
<p>Content on Nepali Tools is provided for information and convenience. While we work with verified data and review every update, we do not guarantee absolute accuracy; always confirm critical figures with official sources (Nepal Rastra Bank, Inland Revenue Department, FENEGOSIDA jewellers, NEB results, government offices).</p>
<h2>Rates &amp; financial figures</h2>
<p>Gold/silver and exchange rates are reference values with their source and date displayed on the page. Markets move; use live quotes before acting. Nothing on this site is financial, tax or legal advice — consult a licensed professional (banker, chartered accountant, lawyer) for your situation.</p>
<h2>Editorial standards</h2>
<p>Content is human-reviewed before publishing; the internal SEO engine only drafts suggestions, which sit in a review queue. We do not publish scraped, spun or auto-generated thin pages.</p>
<h2>Liability</h2>
<p>To the extent permitted by law, Nepali Tools is not liable for decisions made solely on the basis of content on this site.</p>
`,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description:
      "The terms for using Nepali Tools: free personal use, accuracy, acceptable use, advertising and changes.",
    html: `
<p>Last updated: 27 November 2026. By using Nepali Tools (the "site") you agree to these terms. If you don't agree, please don't use the site.</p>
<h2>Free to use</h2>
<p>All tools and guides are free for personal, educational and business use. You don't need an account. You may link to any page and share results you calculate.</p>
<h2>Accuracy</h2>
<p>We work hard to keep calculations and rates correct and show the source and date of every published rate. Still, results are for information only and are not financial, tax or legal advice. Please confirm important figures with the official source before you act. See our <a href="/disclaimer">Disclaimer</a>.</p>
<h2>Acceptable use</h2>
<ul>
<li>Don't try to break, overload or scrape the site in a way that harms other visitors.</li>
<li>Don't copy our written content (guides, explanations, FAQs) and publish it as your own.</li>
<li>Don't click ads on purpose or ask others to; this breaks Google's rules.</li>
</ul>
<h2>Advertising</h2>
<p>The site is supported by ads from Google AdSense. Ads are clearly labelled. We are not responsible for the products or services advertised. How ads use cookies is explained in our <a href="/privacy">Privacy Policy</a>.</p>
<h2>Links to other sites</h2>
<p>We link to official sources such as Nepal Rastra Bank, FENEGOSIDA and NEB. We don't control those sites and aren't responsible for their content.</p>
<h2>Changes</h2>
<p>We may update tools, content and these terms at any time. The date at the top shows the latest version.</p>
<h2>Contact</h2>
<p>Questions about these terms: <strong>${SITE.email}</strong> or our <a href="/contact">contact page</a>.</p>
`,
  },
];

export function getStaticPage(slug: string) {
  return STATIC_PAGES.find((p) => p.slug === slug);
}
