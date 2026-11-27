import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nepal flag crimson
        brand: {
          50: "#fdf2f3",
          100: "#fbe4e7",
          200: "#f6c6cd",
          300: "#ee97a4",
          400: "#e25d72",
          500: "#d4314c",
          600: "#bd1e3b",
          700: "#9f1832",
          800: "#83162d",
          900: "#5e1020",
        },
        // Nepal flag blue (borders of the flag)
        navy: {
          50: "#f0f4fb",
          100: "#dde6f5",
          200: "#bccdeb",
          300: "#8eaadb",
          400: "#5b7fc5",
          500: "#3a5fae",
          600: "#244791",
          700: "#1c3874",
          800: "#152b59",
          900: "#0f1f42",
          950: "#0a1530",
        },
        // Warm neutrals (paper / ink)
        ink: {
          50: "#f9f7f4",
          100: "#f1eee8",
          200: "#e4dfd6",
          300: "#cdc6ba",
          400: "#a39b8e",
          500: "#7a7366",
          600: "#5c564b",
          700: "#45403a",
          800: "#2e2b27",
          900: "#1d1b18",
          950: "#12110f",
        },
        paper: "#fbf9f5",
      },
      fontFamily: {
        sans: ["var(--font-en)", "var(--font-ne)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-ne)", "system-ui", "sans-serif"],
        ne: ["var(--font-ne)", "var(--font-en)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgb(29 27 24 / 0.04), 0 1px 3px 0 rgb(29 27 24 / 0.06)",
        lift: "0 1px 0 0 rgb(29 27 24 / 0.04), 0 12px 32px -12px rgb(29 27 24 / 0.18)",
        tool: "0 1px 0 0 rgb(29 27 24 / 0.04), 0 24px 48px -24px rgb(15 31 66 / 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
