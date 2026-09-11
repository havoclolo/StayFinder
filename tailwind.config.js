/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ff385c', // Airbnb iconic brand rose
          600: '#e00b41',
          700: '#be0937',
          800: '#9f0c32',
          900: '#881030',
        },
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'elevated': '0 10px 30px -10px rgba(0,0,0,0.12)',
        'floating': '0 20px 40px -15px rgba(0,0,0,0.15)',
      },
    },
  },
  plugins: [],
}
