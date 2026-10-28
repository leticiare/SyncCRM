/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#dce6ff',
          200: '#c1d0ff',
          300: '#a3bcff',
          400: '#87a7ff',
          500: '#6f8fff',
          600: '#4221ff',
          700: '#351bd6',
          800: '#2916a8',
          900: '#21127f',
          950: '#160c52',
        }
      }
    },
  },
  plugins: [],
}
