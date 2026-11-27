"use client";

import { useEffect, useState } from "react";

/**
 * Google Analytics + AdSense integration, activated only when env vars are set.
 * Without NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_ADSENSE_CLIENT nothing is loaded —
 * important so local/dev never fires real analytics.
 */
export default function Analytics() {
  const [gaId, setGaId] = useState(process.env.NEXT_PUBLIC_GA_ID);
  const [adsClient, setAdsClient] = useState(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  useEffect(() => {
    setGaId(process.env.NEXT_PUBLIC_GA_ID);
    setAdsClient(process.env.NEXT_PUBLIC_ADSENSE_CLIENT);
  }, []);
  return (
    <>
      {gaId ? (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${gaId}');`,
            }}
          />
        </>
      ) : null}
      {adsClient ? (
        <script
          async
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`}
        />
      ) : null}
    </>
  );
}

export function AdSlot({ slot, label }: { slot: string; label?: string }) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (client) {
    return (
      <ins
        className="adsbygoogle block my-6"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    );
  }
  return (
    <div className="ad-slot my-6" aria-hidden="true">
      {label ?? "Advertisement space (configure NEXT_PUBLIC_ADSENSE_CLIENT)"}
    </div>
  );
}
