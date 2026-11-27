"use client";

import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * "Sign in with Google" rendered by Google Identity Services on our own page.
 * The Google popup then names allnepalitools.com / the app, instead of the
 * Supabase project address that the redirect flow shows.
 * Falls back to `onFallback` (Supabase redirect flow) if GIS can't load.
 */
const CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "662421941401-n7194dmqfplmpo0m7fs78o9b036pqrhc.apps.googleusercontent.com";

type GIS = {
  accounts: { id: {
    initialize: (o: Record<string, unknown>) => void;
    renderButton: (el: HTMLElement, o: Record<string, unknown>) => void;
  } };
};

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function loadGis(): Promise<GIS> {
  const w = window as unknown as { google?: GIS };
  if (w.google?.accounts?.id) return Promise.resolve(w.google);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = () => (w.google?.accounts?.id ? resolve(w.google) : reject(new Error("gis missing")));
    s.onerror = () => reject(new Error("gis failed"));
    document.head.appendChild(s);
    setTimeout(() => reject(new Error("gis timeout")), 8000);
  });
}

export default function GoogleButton({ onDone, onError, onFallback, label = "signin_with" }: {
  onDone: () => void;
  onError: (m: string) => void;
  onFallback: () => void;
  label?: "signin_with" | "signup_with" | "continue_with";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const g = await loadGis();
        const raw = crypto.randomUUID() + crypto.randomUUID();
        const hashed = await sha256Hex(raw);
        if (cancelled || !ref.current) return;
        g.accounts.id.initialize({
          client_id: CLIENT_ID,
          nonce: hashed,
          ux_mode: "popup",
          use_fedcm_for_prompt: true,
          callback: async (resp: { credential?: string }) => {
            const sb = supabase();
            if (!sb || !resp.credential) return onError("Google sign-in was cancelled.");
            const { error } = await sb.auth.signInWithIdToken({ provider: "google", token: resp.credential, nonce: raw });
            if (error) onError(error.message);
            else onDone();
          },
        });
        const width = Math.min(400, ref.current.parentElement?.clientWidth || 320);
        g.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", shape: "pill", text: label, width, logo_alignment: "center" });
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => { cancelled = true; };
  }, [label, onDone, onError]);

  if (failed) {
    return (
      <button type="button" onClick={onFallback} className="btn-ghost w-full !py-3">
        Continue with Google
      </button>
    );
  }
  return <div ref={ref} className="flex min-h-[44px] w-full justify-center" />;
}
