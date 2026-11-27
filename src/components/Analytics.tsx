"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const ADS_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

/**
 * Google Analytics (gtag) — loads only when NEXT_PUBLIC_GA_ID is set, so local
 * and preview builds never send real analytics.
 */
export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}

/**
 * The AdSense loader. Rendered in <head> by the root layout so Google's site
 * verification and Auto ads both work. With Auto ads switched on in the
 * AdSense dashboard, Google places ads automatically; no slot IDs needed.
 */
export function AdSenseHead() {
  if (!ADS_CLIENT) return null;
  return (
    // eslint-disable-next-line @next/next/no-sync-scripts
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}

/**
 * Optional manual ad unit. Renders only when the AdSense client AND a numeric
 * ad-unit ID for this position exist (NEXT_PUBLIC_ADSENSE_SLOT_<NAME>, e.g.
 * NEXT_PUBLIC_ADSENSE_SLOT_TOOL=1234567890). Otherwise renders nothing, so
 * visitors never see an empty box and Auto ads fill the page instead.
 * Space is reserved while the ad loads so the page doesn't jump (no CLS).
 */
const SLOT_IDS: Record<string, string | undefined> = {
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME,
  tool: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOOL,
  content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT,
  sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR,
};

export function AdSlot({ slot, className = "" }: { slot: keyof typeof SLOT_IDS | string; label?: string; className?: string }) {
  const id = SLOT_IDS[slot];
  const pushed = useRef(false);
  useEffect(() => {
    if (!ADS_CLIENT || !id || pushed.current) return;
    pushed.current = true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {}
  }, [id]);
  if (!ADS_CLIENT || !id || !/^\d+$/.test(id)) return null;
  return (
    <div className={`my-8 ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-widest text-ink-400">Advertisement</p>
      <div className="min-h-[100px] sm:min-h-[120px]">
        <ins
          className="adsbygoogle block"
          style={{ display: "block" }}
          data-ad-client={ADS_CLIENT}
          data-ad-slot={id}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
