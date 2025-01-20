import { heroui } from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5C33F6", // Purple CTA button color
        secondary: "#999999", // Light grey text
        background: "#FFFFFF", // Page background
        foreground: "#222222", // Dark text
        cardBackground: "#F5F5F5", // Light grey cards
        headerBackground: "#1A1A1A", // Black/dark header background
        accentBrown: "#C8A37E", // Accent brown for elements
        textMuted: "#666666", // Muted grey text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "10px",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "2rem",
        lg: "3rem",
      },
      boxShadow: {
        small: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
