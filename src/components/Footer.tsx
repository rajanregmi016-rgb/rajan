import Link from "next/link";
import { SITE, SITE_URL } from "@/config/site";
import { Logo } from "@/components/Logo";

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "Popular tools",
    links: [
      { href: "/bs-to-ad-converter", label: "BS to AD Converter" },
      { href: "/gold-price-in-nepal", label: "Gold Price Nepal" },
      { href: "/usd-to-npr", label: "USD to NPR" },
      { href: "/emi-calculator-nepal", label: "EMI Calculator" },
      { href: "/preeti-to-unicode", label: "Preeti to Unicode" },
      { href: "/see-gpa-calculator", label: "SEE GPA Calculator" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { href: "/category/nepali-date-calendar", label: "Nepali Date & Calendar" },
      { href: "/category/finance-tax-currency", label: "Finance, Tax & Currency" },
      { href: "/category/gold-silver-price", label: "Gold & Silver Prices" },
      { href: "/category/nepali-language-unicode", label: "Nepali Language & Unicode" },
      { href: "/category/land-everyday", label: "Land & Everyday Tools" },
      { href: "/category/math-education", label: "Math & Education" },
      { href: "/category/see-exam", label: "SEE & Exam" },
    ],
  },
  {
    heading: "Site",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/about", label: "About Us" },
      { href: "/guides", label: "Guides & Tutorials" },
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  const host = SITE_URL.replace(/^https?:\/\//, "").replace(/^www\./, "");
  return (
    <footer className="relative mt-20 overflow-hidden bg-navy-950 text-navy-100">
      <svg className="absolute inset-x-0 top-0 h-16 w-full text-navy-900/70" viewBox="0 0 1200 64" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 64 L120 30 L190 48 L310 8 L420 40 L520 18 L640 50 L760 14 L860 38 L980 6 L1090 36 L1200 20 L1200 64 Z" fill="currentColor" />
      </svg>
      <div className="container-np relative grid gap-10 pb-12 pt-20 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-6 text-navy-200">
            Free online tools for Nepal: dates, money, gold rates, exams and the Nepali language. Fast, accurate and made for your phone.
          </p>
          <p className="devanagari mt-3 text-sm text-navy-300" lang="ne">सबै नेपाली टुल्स, एकै ठाउँमा।</p>
          <a href={`mailto:${SITE.email}`} className="mt-4 inline-block text-sm text-navy-200 underline decoration-navy-500 underline-offset-4 hover:text-white">
            {SITE.email}
          </a>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} aria-label={col.heading}>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.14em] text-navy-300">{col.heading}</h2>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-navy-100 transition hover:text-white hover:underline hover:underline-offset-4">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="relative border-t border-navy-800">
        <div className="container-np flex flex-col gap-2 py-6 text-xs text-navy-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nepali Tools ({host}). For information only; check important figures with official sources.</p>
          <p className="devanagari" lang="ne">देश र देशवासीका लागि बनाइएको ❤️</p>
        </div>
      </div>
    </footer>
  );
}
