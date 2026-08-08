import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0b0e14',
        surface: {
          DEFAULT: '#121722',
          light: '#1a202c',
          dark: '#080c14',
          glass: 'rgba(18, 23, 34, 0.75)',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#e2c887',
          400: '#dfb76c',
          500: '#d4af37',
          600: '#b89543',
          700: '#8c6d2c',
          800: '#6b5123',
          900: '#4d3919',
        },
        slate: {
          850: '#111827',
          900: '#0f172a',
          950: '#080c14',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(223, 183, 108, 0.25)',
        'gold-glow-lg': '0 0 35px -5px rgba(223, 183, 108, 0.4)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      borderColor: {
        'gold-glass': 'rgba(223, 183, 108, 0.2)',
      },
      backdropBlur: {
        glass: '16px',
      },
    },
  },
  plugins: [],
};

export default config;
