// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fef2f2',
          100: '#fee2e2',
          500: '#e63946',
          600: '#c1121f',
          700: '#9b1515',
          900: '#1a1a2e',
        },
      },
    },
  },
  plugins: [],
}