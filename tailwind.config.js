/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { colors: { primary: '#122da6', 'hover-primary': '#122da6' } },
  },
  plugins: [],
}

