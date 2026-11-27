import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE, SITE_URL } from "@/config/site";
import { Logo } from "@/components/Logo";
import NewsletterSignup from "@/components/NewsletterSignup";

const COLUMNS: Array<{ heading: string; links: Array<{ href: string; label: string }> }> = [
  {
    heading: "Popular tools",
    links: [
      { href: "/bs-to-ad-converter", label: "BS to AD Converter" },
      { href: "/nepali-calendar", label: "Nepali Calendar" },
      { href: "/gold-price-in-nepal", label: "Gold Price Today" },
      { href: "/usd-to-npr", label: "USD to NPR" },
      { href: "/emi-calculator-nepal", label: "EMI Calculator" },
      { href: "/preeti-to-unicode", label: "Preeti to Unicode" },
    ],
  },
  {
    heading: "Topics",
    links: [
      { href: "/category/nepali-date-calendar", label: "Date & Calendar" },
      { href: "/category/finance-tax-currency", label: "Finance & Tax" },
      { href: "/category/gold-silver-price", label: "Gold & Silver" },
      { href: "/category/math-education", label: "Math & Education" },
      { href: "/category/see-exam", label: "SEE & Exam" },
      { href: "/category/nepali-language-unicode", label: "Nepali Language" },
      { href: "/category/land-everyday", label: "Land & Everyday" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About us" },
      { href: "/team", label: "Our team" },
      { href: "/how-we-verify", label: "How we check our data" },
      { href: "/faq", label: "FAQ" },
      { href: "/guides", label: "Guides" },
      { href: "/contact", label: "Contact us" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export default function Footer() {
  const host = SITE_URL.replace(/^https?:\/\//, "").replace(/^www\./, "");
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-950 text-white">
      <div className="dhaka absolute inset-0" aria-hidden />
      <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-brand-600/20 blur-3xl" aria-hidden />
      <div className="container-np relative">
        {/* CTA strip */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-white/10 py-12 md:flex-row md:items-center">
          <div>
            <p className="font-display text-2xl font-extrabold sm:text-3xl">
              Today&apos;s gold &amp; dollar rate, every morning
            </p>
            <p className="devanagari mt-1 text-white/60" lang="ne">हरेक बिहान आजको सुन र विदेशी मुद्रा दर, तपाईंको इमेलमा।</p>
            <Link href="/contact" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-saffron-300 hover:text-saffron-200">
              Need a tool we don&apos;t have? Suggest it <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          <NewsletterSignup source="footer" />
        </div>

        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
              Free, accurate tools for everyday life in Nepal. Dates, money, gold, exams and the Nepali language, made simple for your phone.
            </p>
            <p className="mt-5 text-sm text-white/50">Questions or corrections?</p>
            <a href={`mailto:${SITE.email}`} className="text-sm font-semibold text-saffron-300 hover:text-saffron-200">{SITE.email}</a>
          </div>
          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-white/45">{col.heading}</h2>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/75 transition hover:text-white">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>
      <div className="relative border-t border-white/10">
        <div className="container-np flex flex-col gap-2 py-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} All Nepali Tools ({host}). For information only; confirm important figures with official sources.</p>
          <p className="devanagari" lang="ne">नेपाल र नेपालीका लागि, माया सहित ❤️</p>
        </div>
      </div>
    </footer>
  );
}
