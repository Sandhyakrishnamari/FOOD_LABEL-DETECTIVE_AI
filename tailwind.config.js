/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        detective: {
          50: '#fbf7ee',
          100: '#f4ebd2',
          200: '#e8d4a3',
          300: '#d9b66f',
          400: '#ca9742',
          500: '#b67a28',
          600: '#9b5d1e',
          700: '#7c431b',
          800: '#67371d',
          900: '#552e1b',
          950: '#30160d',
        },
        slate: {
          850: '#152033',
          950: '#0b1120'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
