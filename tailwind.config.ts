import type { Config } from "tailwindcss";

/**
 * All Nepali Tools — brand palette
 *  brand  = Laligurans (rhododendron, Nepal's national flower) red
 *  navy   = Midnight — deep Himalayan night blue, used for dark surfaces
 *  saffron= warm marigold accent (festival garlands)
 *  ink    = cool neutrals
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f3",
          100: "#ffe0e6",
          200: "#ffc5d1",
          300: "#ff97ac",
          400: "#ff5a7d",
          500: "#f72b59",
          600: "#e0123f",
          700: "#bc0a34",
          800: "#9d0c32",
          900: "#860f31",
        },
        saffron: {
          50: "#fff8eb",
          100: "#ffedc6",
          200: "#ffd988",
          300: "#ffc04a",
          400: "#ffa920",
          500: "#f98707",
          600: "#dd6302",
          700: "#b74306",
        },
        navy: {
          50: "#eef0fb",
          100: "#dfe3f7",
          200: "#c3c9ef",
          300: "#9aa3e2",
          400: "#7279d2",
          500: "#5656c2",
          600: "#4740ab",
          700: "#3b348b",
          800: "#272263",
          900: "#18153f",
          950: "#0d0b26",
        },
        ink: {
          50: "#f7f7fa",
          100: "#efeff4",
          200: "#e2e2ea",
          300: "#c9c9d6",
          400: "#9d9db0",
          500: "#727287",
          600: "#55556a",
          700: "#414155",
          800: "#2a2a3b",
          900: "#18182a",
          950: "#0c0c18",
        },
        paper: "#f7f7fa",
      },
      fontFamily: {
        sans: ["var(--font-en)", "var(--font-ne)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-ne)", "system-ui", "sans-serif"],
        ne: ["var(--font-ne)", "var(--font-en)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(24 21 63 / 0.04), 0 2px 8px -2px rgb(24 21 63 / 0.06)",
        lift: "0 2px 4px 0 rgb(24 21 63 / 0.04), 0 18px 40px -16px rgb(24 21 63 / 0.22)",
        tool: "0 2px 4px 0 rgb(24 21 63 / 0.04), 0 30px 60px -28px rgb(24 21 63 / 0.35)",
        glow: "0 0 0 1px rgb(255 255 255 / 0.08), 0 20px 60px -20px rgb(224 18 63 / 0.55)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #e0123f 0%, #f72b59 45%, #ffa920 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
