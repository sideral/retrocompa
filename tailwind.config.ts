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
        retro: {
          gold: "#FFD700",
          orange: "#FF6B35",
          teal: "#4ECDC4",
          pink: "#FF69B4",
          brown: "#8B4513",
        },
      },
      fontFamily: {
        groovy: ["Fredoka One", "cursive"],
      },
    },
  },
  plugins: [],
};
export default config;

