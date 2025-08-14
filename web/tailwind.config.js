/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'dark-slate': '#2f4f4f',
        'ivory': '#fffff0',
      },
    },
  },
  plugins: [],
}