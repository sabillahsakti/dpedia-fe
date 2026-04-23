import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dpedia: {
          background: "#0a0a0a",
          surface: "#141414",
          elevated: "#1c1c1c",
          primary: "#e50914",
          secondary: "#c9a84c",
          text: "#ffffff",
          muted: "#a3a3a3",
          border: "#2a2a2a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(229, 9, 20, 0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
