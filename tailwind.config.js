/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#050505",
        "bg-raised": "#0d0d0d",
        panel: "#141414",
        "panel-hi": "#1c1c1c",
        border: "#222",
        "border-hi": "#2e2e2e",
        muted: "#8a8a8a",
      },
      fontFamily: {
        display: ["Anton", "Impact", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      animation: {
        "muscle-pulse": "musclePulse 2.4s ease-in-out infinite",
        "slow-float": "slowFloat 8s ease-in-out infinite",
      },
      keyframes: {
        musclePulse: {
          "0%, 100%": { filter: "brightness(1)" },
          "50%": { filter: "brightness(1.35)" },
        },
        slowFloat: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(4%, -3%)" },
        },
      },
    },
  },
  plugins: [],
};
