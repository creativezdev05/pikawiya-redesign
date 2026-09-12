import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ochre: {
          DEFAULT: "#E85D26",
          dark: "#B83D0E",
          light: "#F08A62",
        },
        earth: {
          DEFAULT: "#1A1615",
          light: "#2B2625",
        },
        sand: {
          DEFAULT: "#F7F4EF",
          dark: "#E8E2D5",
        },
        mountain: "#2B3E4A",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;