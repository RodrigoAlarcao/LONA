import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg:      "var(--color-bg)",
        surface: "var(--color-surface)",
        accent:  "var(--color-accent)",
        text:    "var(--color-text)",
        dim:     "var(--color-dim)",
        border:  "var(--color-border)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "serif"],
        body:    ["DM Sans", "sans-serif"],
        mono:    ["IBM Plex Mono", "monospace"],
      },
      fontSize: {
        hero:    ["clamp(4rem, 9vw, 8rem)", { lineHeight: "0.95" }],
        h2:      ["clamp(2.5rem, 5vw, 4.5rem)", { lineHeight: "1.05" }],
        project: ["clamp(1.5rem, 3vw, 2.5rem)", { lineHeight: "1.1" }],
        label:   ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.14em" }],
      },
      maxWidth: {
        container: "1200px",
        prose:     "560px",
      },
      spacing: {
        section: "6rem",
        "section-lg": "8rem",
      },
    },
  },
  plugins: [],
};

export default config;
