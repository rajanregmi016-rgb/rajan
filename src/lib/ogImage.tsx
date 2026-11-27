import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/** Shared social-share card in the All Nepali Tools brand. */
export function ogImage({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#0d0b26", position: "relative", fontFamily: "sans-serif", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -260, right: -160, width: 640, height: 640, borderRadius: 9999, background: "radial-gradient(circle, rgba(224,18,63,0.55) 0%, rgba(224,18,63,0) 70%)" }} />
        <div style={{ position: "absolute", bottom: -260, left: 120, width: 560, height: 560, borderRadius: 9999, background: "radial-gradient(circle, rgba(255,169,32,0.28) 0%, rgba(255,169,32,0) 70%)" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "56px 72px 0" }}>
          <svg width="68" height="68" viewBox="0 0 40 40">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#e0123f" />
                <stop offset="0.55" stopColor="#f72b59" />
                <stop offset="1" stopColor="#ffa920" />
              </linearGradient>
            </defs>
            <rect width="40" height="40" rx="12" fill="#1f1b4a" />
            <path d="M11 6 L31 19 L19.5 19 L31 33 L11 33 Z" fill="url(#g)" />
            <circle cx="17.2" cy="26.4" r="3.1" fill="#fff" />
          </svg>
          <div style={{ display: "flex", fontSize: 36, fontWeight: 800, color: "#fff" }}>
            AllNepali<span style={{ color: "#ff7a6b" }}>Tools</span>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 26, color: "rgba(255,255,255,0.55)" }}>allnepalitools.com</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", padding: "70px 72px 0", maxWidth: 1100 }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#ffc04a" }}>{eyebrow}</div>
          <div style={{ marginTop: 18, fontSize: title.length > 40 ? 60 : 76, fontWeight: 800, lineHeight: 1.05, color: "#fff" }}>{title}</div>
          {subtitle && <div style={{ marginTop: 24, fontSize: 30, color: "rgba(255,255,255,0.68)", lineHeight: 1.35 }}>{subtitle}</div>}
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 12, display: "flex", background: "linear-gradient(90deg, #e0123f, #f72b59, #ffa920)" }} />
      </div>
    ),
    OG_SIZE
  );
}
