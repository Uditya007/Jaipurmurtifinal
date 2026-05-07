import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D060",
          dark: "#B8941F",
          muted: "rgba(212, 175, 55, 0.3)",
        },
        bg: {
          DEFAULT: "#050505",
          2: "#0a0a0a",
          3: "#111111",
          4: "#1a1a1a",
        },
        divine: "#f5f0e8",
        muted: "#9a8f7a",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "serif"],
        display: ["var(--font-cinzel)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F0D060 40%, #D4AF37 60%, #B8941F 100%)",
        "gold-shimmer": "linear-gradient(90deg, #B8941F 0%, #F0D060 50%, #B8941F 100%)",
        "divine-radial": "radial-gradient(ellipse at center, rgba(212,175,55,0.15) 0%, transparent 70%)",
        "dark-radial": "radial-gradient(ellipse at top, #1a1008 0%, #050505 60%)",
      },
      boxShadow: {
        gold: "0 0 30px rgba(212, 175, 55, 0.25), 0 0 60px rgba(212, 175, 55, 0.1)",
        "gold-strong": "0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)",
        "card": "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,55,0.1)",
        "card-hover": "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(212,175,55,0.25), 0 0 40px rgba(212,175,55,0.1)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "fade-in": "fadeIn 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-15px) rotate(1deg)" },
          "66%": { transform: "translateY(-8px) rotate(-1deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.5), 0 0 80px rgba(212, 175, 55, 0.2)" },
        },
        fadeIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
