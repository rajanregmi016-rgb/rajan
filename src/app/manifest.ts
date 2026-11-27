import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "All Nepali Tools",
    short_name: "AllNepali",
    description: "Nepali date converter, gold price, NRB exchange rates, EMI, tax and more. सबै नेपाली टुल्स, एकै ठाउँमा।",
    start_url: "/?source=app",
    scope: "/",
    display: "standalone",
    background_color: "#0d0b26",
    theme_color: "#0d0b26",
    lang: "en",
    categories: ["utilities", "finance", "education"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Nepali calendar", url: "/nepali-calendar" },
      { name: "Gold price today", url: "/gold-price-in-nepal" },
      { name: "Currency converter", url: "/currency-converter-nepal" },
      { name: "BS to AD converter", url: "/bs-to-ad-converter" },
    ],
  };
}
