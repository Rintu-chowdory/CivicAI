import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F5F4EF",
        surface: "#FFFFFF",
        sidebar: "#12182A",
        "sidebar-hover": "#1C2440",
        ink: "#1B2430",
        seal: "#1F3A5F",
        "seal-light": "#EEF2F7",
        "signal-green": "#2F7D5B",
        "signal-green-light": "#E9F3EE",
        "signal-amber": "#B9791E",
        "signal-amber-light": "#FBF1DE",
        "signal-red": "#B4432E",
        "signal-red-light": "#FBEAE6",
        border: "#E6E3D8",
      },
      fontFamily: {
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,24,42,0.05), 0 8px 24px -8px rgba(18,24,42,0.10)",
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
