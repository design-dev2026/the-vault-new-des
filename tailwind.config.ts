import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        surface: "#131313",
        "surface-dim": "#131313",
        "surface-bright": "#393939",
        "surface-container-lowest": "#0e0e0e",
        "surface-container-low": "#1b1b1b",
        "surface-container": "#1f1f1f",
        "surface-container-high": "#2a2a2a",
        "surface-container-highest": "#353535",
        "on-surface": "#e2e2e2",
        "on-surface-variant": "#c4c7c8",
        "outline": "#8e9192",
        "outline-variant": "#444748",
        primary: "#ffffff",
        "on-primary": "#000000",
        secondary: "#c8c6c5",
        "on-secondary": "#313030",
        tertiary: "#ffffff",
        "on-tertiary": "#2f3131",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "ui-sans-serif", "system-ui"],
        heading: ["var(--font-plus-jakarta-sans)"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        full: "9999px",
      },
      spacing: {
        "container-max": "1440px",
        gutter: "24px",
        unit: "4px",
        "section-gap": "80px",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [animate],
};
export default config;
