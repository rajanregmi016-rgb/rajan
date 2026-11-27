import { SITE } from "@/config/site";

export interface StaticPage {
  slug: string;
  title: string;
  eyebrow?: string;
  description: string;
  html: string;
}

export const STATIC_PAGES: StaticPage[] = [
  {
    slug: "contact",
    title: "Contact Us",
    description:
      "Report an error, suggest a tool, or reach the All Nepali Tools editorial team.",
    html: `
<p>We are a small team and genuinely read every message. Three common reasons to write:</p>
<h2>Report a data or content error</h2>
<p>A wrong rate, a conversion that looks off, an outdated slab — email us the page URL and what you expected. We verify against official sources before fixing and update the tool's last-updated date.</p>
<h2>Suggest a tool or guide</h2>
<p>Tell us which Nepal-specific task still has no good tool. Keyword research drives the roadmap, and requests with real demand get prioritised.</p>
<h2>Business &amp; advertising</h2>
<p>Contact us regarding advertising placements (once AdSense is live) or partnership queries through the form on this page.</p>
`,
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    eyebrow: "Legal",
    description:
      "All Nepali Tools privacy policy: what we collect (almost nothing), how Google Analytics and Google AdSense cookies work, and how to opt out.",
    html: `
<p>Last updated: 27 November 2026. This policy explains what data All Nepali Tools collects and why. In one sentence: <strong>our tools run in your browser and we collect almost nothing.</strong></p>
<h2>What we collect</h2>
<p>Tool inputs (dates, amounts, text you convert) are processed in your browser and are not sent to or stored on our servers. Favourite and recently used tools are saved in your browser's localStorage only. Like any website, our hosting provider (Vercel) may briefly log IP address and browser type for security and debugging.</p>
<h2>Accounts and emails (optional)</h2>
<p>You never need an account to use a tool. If you create one, we store your email address, your name if you add it, your saved tools, price alerts, saved Nepali dates, bill reminders, savings goals, the gold and cash amounts you choose to track, and notifications, using Supabase as our database provider. When you sign in we record the time, browser type and approximate city/country (from your IP address) so we can send you a sign-in alert; you can turn these emails off. If you sign up for the daily rates email we store your email address and send it through Resend. Every email has an unsubscribe link, and you can delete your account and its data at any time from your account page.</p>
<h2>Messages you send us</h2>
<p>When you use the contact form we receive your message, your name and email if you give them, the page link, and your approximate country. We use them only to reply and fix problems, keep them privately, and never share them.</p>
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
<p>We fetch official rates from Nepal Rastra Bank and FENEGOSIDA on our server; your browser does not contact them. As a backup, exchange rates may load from a public currency API (open.er-api.com), which sees only standard web-request information. Google Sign-In is provided by Google if you choose it. Fonts are served by Google Fonts through our own domain.</p>
<h2>Children</h2>
<p>The site is suitable for students, but we do not knowingly collect personal information from children under 13.</p>
<h2>Your choices</h2>
<p>Clear your browser's localStorage to erase favourites and recent tools. Block or delete cookies in your browser to disable analytics and ad cookies. Send any privacy question through our <a href="/contact">contact page</a>.</p>
`,
  },
  {
    slug: "disclaimer",
    title: "Disclaimer",
    eyebrow: "Legal",
    description:
      "Information accuracy, financial data and no-advice disclaimer for All Nepali Tools.",
    html: `
<p>Content on All Nepali Tools is provided for information and convenience. While we work with verified data and review every update, we do not guarantee absolute accuracy; always confirm critical figures with official sources (Nepal Rastra Bank, Inland Revenue Department, FENEGOSIDA jewellers, NEB results, government offices).</p>
<h2>Rates &amp; financial figures</h2>
<p>Gold/silver and exchange rates are reference values with their source and date displayed on the page. Markets move; use live quotes before acting. Nothing on this site is financial, tax or legal advice — consult a licensed professional (banker, chartered accountant, lawyer) for your situation.</p>
<h2>Editorial standards</h2>
<p>Content is human-reviewed before publishing; the internal SEO engine only drafts suggestions, which sit in a review queue. We do not publish scraped, spun or auto-generated thin pages.</p>
<h2>Liability</h2>
<p>To the extent permitted by law, All Nepali Tools is not liable for decisions made solely on the basis of content on this site.</p>
`,
  },
  {
    slug: "terms",
    title: "Terms of Use",
    eyebrow: "Legal",
    description:
      "The terms for using All Nepali Tools: free personal use, accuracy, acceptable use, advertising and changes.",
    html: `
<p>Last updated: 27 November 2026. By using All Nepali Tools (the "site") you agree to these terms. If you don't agree, please don't use the site.</p>
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
<p>Questions about these terms: our <a href="/contact">contact page</a>.</p>
`,
  },
];

export function getStaticPage(slug: string) {
  return STATIC_PAGES.find((p) => p.slug === slug);
}
