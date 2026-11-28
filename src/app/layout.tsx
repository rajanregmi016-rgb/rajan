import { ADS_CLIENT, GSC_TOKEN } from "@/lib/publicIds";
import type { Metadata, Viewport } from "next";
import { Inter, Mukta, Sora } from "next/font/google";
import { SITE, SITE_URL } from "@/config/site";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics, { AdSenseHead } from "@/components/Analytics";
import SearchShortcut from "@/components/SearchShortcut";
import BackToTop from "@/components/BackToTop";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-en",
  display: "swap",
});

const display = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ne",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  appleWebApp: { capable: true, title: "AllNepali", statusBarStyle: "black-translucent" },
  title: {
    default: `${SITE.name} — ${SITE.tagline} | ${SITE.nameNp}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "nepali tools", "nepali date converter", "gold price in nepal", "usd to npr",
    "emi calculator nepal", "preeti to unicode", "nepali calendar", "see gpa calculator",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
  verification: GSC_TOKEN
    ? { google: GSC_TOKEN }
    : undefined,
  other: ADS_CLIENT
    ? { "google-adsense-account": ADS_CLIENT }
    : undefined,
  formatDetection: { telephone: false },
  applicationName: SITE.name,
  category: "utilities",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0b26",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const themeScript = `(function(){try{var t=localStorage.getItem('nt-theme');if(t==='dark'||(window.matchMedia('(prefers-color-scheme: dark)').matches&&t!=='light'))document.documentElement.classList.add('dark');}catch(e){}})();`;
  return (
    <html lang="en" dir="ltr" className="scroll-pt-20" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AdSenseHead />
      </head>
      <body className={`${inter.variable} ${display.variable} ${mukta.variable} font-sans`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </AuthProvider>
        <BackToTop />
          <SearchShortcut />
        <Analytics />
      </body>
    </html>
  );
}
