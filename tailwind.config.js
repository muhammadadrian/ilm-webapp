/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: '#052e26',
        },
        sand: {
          50: '#faf8f3',
          100: '#f4efe4',
          200: '#e8dfca',
          300: '#d9cba8',
        },
        ink: '#1c2621',
      },
      fontFamily: {
        arabic: ['"Amiri"', '"Noto Naskh Arabic"', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
