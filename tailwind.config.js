/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#E52D1D', // User Primary
          hover: '#B4142D',   // User Secondary Red (using as hover/dark variant)
          light: '#FFF1F1',   // Light tint for backgrounds
        },
        tangerine: '#E52D1D', // Explicit User Request
        secondary: '#E67E4E', // User Secondary Orange
        black: '#000000',     // User Black
        white: '#FFFFFF',     // User White
      }
    },
  },
  plugins: [],
}
