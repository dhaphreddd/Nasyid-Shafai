/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffdf0',
          100: '#fffab8',
          200: '#fff485',
          300: '#ffe947',
          400: '#ffd700', // gold_accent in colors.xml
          500: '#e6be00',
          600: '#b89200',
          700: '#8a6800',
          800: '#5c4300',
          900: '#302100',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#F5F5F5',
          card: '#FFFFFF',
        },
        primary: {
          dark: '#212121',
          gray: '#757575',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 4px 20px -2px rgba(255, 215, 0, 0.25)',
        'card-subtle': '0 2px 8px -1px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
