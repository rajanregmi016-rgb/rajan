"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

/** "Install app" button: native prompt on Android/Chrome, short how-to on iPhone. Hidden once installed. */
export default function InstallApp() {
  const [evt, setEvt] = useState<BIP | null>(null);
  const [ios, setIos] = useState(false);
  const [help, setHelp] = useState(false);
  const [installed, setInstalled] = useState(true);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as unknown as { standalone?: boolean }).standalone;
    setInstalled(!!standalone);
    setIos(/iPhone|iPad|iPod/.test(navigator.userAgent));
    const on = (e: Event) => { e.preventDefault(); setEvt(e as BIP); };
    window.addEventListener("beforeinstallprompt", on);
    window.addEventListener("appinstalled", () => setInstalled(true));
    return () => window.removeEventListener("beforeinstallprompt", on);
  }, []);

  if (installed || (!evt && !ios)) return null;
  return (
    <div className="relative">
      <button
        onClick={async () => {
          if (evt) { await evt.prompt(); const r = await evt.userChoice; if (r.outcome === "accepted") setInstalled(true); setEvt(null); }
          else setHelp(true);
        }}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
      >
        <Download className="h-4 w-4" aria-hidden /> Install the app
      </button>
      {help && (
        <div className="mt-3 max-w-xs rounded-2xl bg-white p-4 text-sm text-ink-800 shadow-lift" role="dialog" aria-label="Install on iPhone">
          <button className="float-right text-ink-400" aria-label="Close" onClick={() => setHelp(false)}><X className="h-4 w-4" /></button>
          <p className="font-bold">Add to your iPhone</p>
          <p className="mt-1">Tap <Share className="inline h-4 w-4" aria-label="Share" /> at the bottom of Safari, then choose <b>Add to Home Screen</b>.</p>
        </div>
      )}
    </div>
  );
}
