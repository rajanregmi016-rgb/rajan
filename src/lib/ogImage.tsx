import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared social-share card: crimson mark, title, subtitle, mountain ridge. */
export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#fbf9f5", position: "relative", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "56px 72px 0" }}>
          <svg width="64" height="64" viewBox="0 0 40 40">
            <rect width="40" height="40" rx="11" fill="#bd1e3b" />
            <circle cx="28" cy="13" r="4" fill="#fff" />
            <path d="M5 31 L15 17 L20 23 L25 16 L35 31 Z" fill="#fff" />
          </svg>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#1d1b18" }}>Nepali Tools</div>
          <div style={{ marginLeft: "auto", fontSize: 26, color: "#7a7366" }}>allnepalitools.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "64px 72px 0", maxWidth: 1100 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#bd1e3b" }}>{eyebrow}</div>
          <div style={{ marginTop: 18, fontSize: title.length > 48 ? 56 : 68, fontWeight: 800, lineHeight: 1.08, color: "#1d1b18" }}>{title}</div>
          {subtitle && <div style={{ marginTop: 22, fontSize: 30, color: "#5c564b", lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
        <svg style={{ position: "absolute", bottom: 0, left: 0 }} width="1200" height="150" viewBox="0 0 1200 150">
          <path d="M0 150 L0 100 L90 62 L150 86 L260 26 L340 74 L420 50 L520 96 L610 36 L700 78 L790 18 L880 70 L960 46 L1050 88 L1130 56 L1200 80 L1200 150 Z" fill="#dde6f5" />
          <path d="M0 150 L0 122 L140 98 L260 124 L380 92 L520 118 L660 86 L800 114 L940 94 L1080 120 L1200 102 L1200 150 Z" fill="#0f1f42" />
        </svg>
      </div>
    ),
    OG_SIZE
  );
}
