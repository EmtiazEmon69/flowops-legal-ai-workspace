import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        mist: "#f6f7f9",
        line: "#d9dee5",
        teal: "#127c7a",
        coral: "#d96b55",
        gold: "#b88929"
      }
    }
  },
  plugins: []
};

export default config;

