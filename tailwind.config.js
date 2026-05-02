/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0d0d0d',
        secondary: '#141414',
        tertiary: '#1c1c1c',
        accent: '#c62828',
        accentLight: '#e53935',
        muted: '#9e9e9e',
        border: '#2a2a2a'
      },
      fontFamily: { sans: ['Inter', 'sans-serif'] }
    }
  },
  plugins: []
}
