import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F2F1EA",
        ink: "#1B2430",
        seal: "#1F3A5F",
        "signal-green": "#2F7D5B",
        "signal-amber": "#C98A1C",
        "signal-red": "#B4432E",
        line: "#CDCABE",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      keyframes: {
        stamp: {
          "0%": { transform: "scale(2.2) rotate(-14deg)", opacity: "0" },
          "60%": { transform: "scale(0.94) rotate(-4deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(-4deg)", opacity: "1" },
        },
      },
      animation: {
        stamp: "stamp 420ms cubic-bezier(.2,.8,.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
