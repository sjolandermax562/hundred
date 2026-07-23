/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F4F4F0",
        ink: "#111111",
        hazard: "#E61919",
        ash: "#6B6B66",
        dim: "#A9A9A2",
      },
      fontFamily: {
        display: ["Archivo Black", "Arial Black", "sans-serif"],
        mono: ["JetBrains Mono", "SF Mono", "monospace"],
        sans: ["Archivo", "Helvetica Neue", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.05em",
        widest2: "0.35em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
