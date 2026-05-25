/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000000',
      white: '#FFFFFF',
      gray: {
        300: '#D1D5DB',
        400: '#9CA3AF',
        700: '#374151',
      },
      red: {
        500: '#EF4444',
      },
      yellow: {
        500: '#EAB308',
      },
      primary: '#1F2937',
      secondary: '#111827',
      accent: '#F59E0B',
    },
    extend: {},
  },
  plugins: [],
}

