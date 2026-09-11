/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: '#006a68',
          hover: '#005452',
          light: '#e6f4f3',
          accent: '#0d9488',
          dark: '#0d3838',
          bg: '#f7f9fc',
        },
        slateText: {
          dark: '#0f172a',
          muted: '#64748b',
          light: '#94a3b8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'btn': '0 6px 20px rgba(0, 106, 104, 0.3)',
        'device': '0 25px 60px rgba(0, 0, 0, 0.45), 0 0 0 10px #1e293b',
      },
      borderRadius: {
        '3xl': '28px',
        '4xl': '40px',
      }
    },
  },
  plugins: [],
}
