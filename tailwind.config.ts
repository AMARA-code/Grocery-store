import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange:      "#F97316",
          "orange-lt": "#FED7AA",
          "orange-dk": "#C2410C",
          green:       "#22C55E",
          "green-lt":  "#DCFCE7",
          "green-dk":  "#15803D",
          white:       "#FFFFFF",
          cream:       "#FFFBF5",
          "cream-2":   "#FFF7ED",
          charcoal:    "#1C1917",
          "gray-soft": "#F5F5F4",
          "gray-mid":  "#A8A29E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body:    ["var(--font-body)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "float-a": {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":     { transform: "translateY(-22px) rotate(3deg)" },
          "66%":     { transform: "translateY(-10px) rotate(-2deg)" },
        },
        "float-b": {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":     { transform: "translateY(-18px) rotate(-3deg)" },
        },
        "float-c": {
          "0%,100%": { transform: "translateY(0px) rotate(0deg)" },
          "40%":     { transform: "translateY(-14px) rotate(2deg)" },
          "80%":     { transform: "translateY(-6px) rotate(-1deg)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "marquee": {
          "0%":   { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.90)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pill-bob": {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-8px)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(1)",   opacity: "0.5" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        "spin-slow": {
          "0%":   { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "float-a":    "float-a 7s ease-in-out infinite",
        "float-b":    "float-b 5.5s ease-in-out infinite",
        "float-c":    "float-c 8s ease-in-out infinite",
        "shimmer":    "shimmer 3s linear infinite",
        "marquee":    "marquee 26s linear infinite",
        "fade-up":    "fade-up 0.7s ease both",
        "scale-in":   "scale-in 0.6s ease both",
        "pill-bob":   "pill-bob 3s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
        "spin-slow":  "spin-slow 20s linear infinite",
      },
      boxShadow: {
        "card":       "0 2px 16px -2px rgba(249,115,22,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 40px -6px rgba(249,115,22,0.18), 0 4px 12px rgba(0,0,0,0.08)",
        "orange":     "0 4px 24px -2px rgba(249,115,22,0.40)",
        "green":      "0 4px 24px -2px rgba(34,197,94,0.35)",
        "pill":       "0 4px 20px rgba(249,115,22,0.15), 0 1px 4px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;