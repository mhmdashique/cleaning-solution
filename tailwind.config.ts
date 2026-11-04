import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        hub: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          raised: "var(--raised)",
          border: "var(--border)",
          ink: "var(--ink)",
          muted: "var(--muted)",
          accent: "var(--accent)",
          "accent-soft": "var(--accent-soft)",
          sidebar: "var(--sidebar)",
          "sidebar-text": "var(--sidebar-text)",
          "sidebar-hover": "var(--sidebar-hover)",
          "sidebar-active": "var(--sidebar-active)",
        },
        navy: {
          950: "#0B1220",
        },
        slate: {
          body: "#475569",
        },
        brand: {
          50: "#ECFDF3",
          100: "#DCFCE7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803D",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        accent: {
          yellow: "#FACC15",
          yellowHover: "#EAB308",
        },
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
        control: "10px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        "soft-lg": "0 10px 25px -3px rgba(0, 0, 0, 0.07)",
        card: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
      },
    },
  },
  plugins: [],
} satisfies Config;
