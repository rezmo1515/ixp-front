/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bgPrimary: '#0d0d0d', bgSecondary: '#141414', bgTertiary: '#1c1c1c',
        accentRed: '#e53935', accentRedLight: '#ff6b6b', textPrimary: '#f5f5f5', textMuted: '#9e9e9e', border: '#2a2a2a'
      }
    }
  },
  plugins: []
}
