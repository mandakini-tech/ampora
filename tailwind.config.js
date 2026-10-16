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
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        utility: {
          navy: '#0f172a',
          dark: '#1e293b',
          light: '#f8fafc',
          accent: '#2563eb',
          success: '#16a34a',
          warning: '#eab308',
          danger: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
