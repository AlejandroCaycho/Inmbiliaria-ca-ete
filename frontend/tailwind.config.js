/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        stone: {
          950: '#141413',
          900: '#1c1b1a',
          850: '#232220',
          800: '#2c2b28',
          700: '#464440',
          500: '#7a7670',
          400: '#9e9a91',
          300: '#b8b4ab',
          200: '#dcd8ce',
          100: '#eeece6',
          50: '#f7f6f2',
        },
        terracotta: {
          DEFAULT: '#b85d38',
          hover: '#9e4c2b',
          subtle: '#2c1e18',
        },
        corten: '#a65632',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tightest: '-0.06em',
        architectural: '0.12em',
      },
    },
  },
  plugins: [],
}
