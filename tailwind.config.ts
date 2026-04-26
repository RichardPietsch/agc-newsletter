import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        agc: {
          navy: "#0D1B2A",
          burgundy: "#6D1F2F",
          cream: "#F5F1E8",
        },
      },
    },
  },
  plugins: [],
};

export default config;
