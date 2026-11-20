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
        brand: {
          orange: "#F97316",
          "orange-hover": "#EA580C",
          "orange-light": "#FFEDD5",
          "orange-50": "#FFF7ED",
          navy: "#0F172A",
          "navy-light": "#1E293B",
          slate: "#334155",
          muted: "#64748B",
          border: "#E2E8F0",
          surface: "#F8FAFC",
        },
        category: {
          culture: "#7C3AED",
          lifestyle: "#EA580C",
          tech: "#2563EB",
          business: "#D97706",
          ideas: "#6366F1",
          design: "#E11D48",
          climate: "#059669",
          wellness: "#0D9488",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        "card-hover": "0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)",
        dropdown: "0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
