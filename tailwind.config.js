/** @type {import('tailwindcss').Config} */
/** Outamate Brand Color Palette */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Outamate brand font
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        // ── Primary Colors ────────────────────────────────────────────
        tangerine: {
          DEFAULT: '#E52D1D', // Vibrant, energetic — primary brand color
          light: '#FDECEA',   // Soft tint for hover/surface states
          hover:   '#C4220F',  // Slightly darker for pressed states
        },
        brand: {
          black: '#000000',   // Professionalism, authority, clarity
          white: '#FFFFFF',   // Clarity, openness, simplicity
        },
        // ── Secondary Colors ──────────────────────────────────────────
        orange: {
          brand: '#E67E4E',   // Warm, creative, approachable
          light: '#FDF0E8',
          hover: '#D06B38',
        },
        crimson: {
          DEFAULT: '#B4142D', // Deep, reliable, strong confidence
          light: '#F9E0E4',
          hover:   '#8E0D22',
        },
        // ── Semantic aliases for easy usage ───────────────────────────
        primary: {
          DEFAULT: '#E52D1D',
          hover:   '#B4142D',
          light:   '#FDECEA',
        },
      },
    },
  },
  plugins: [],
}
