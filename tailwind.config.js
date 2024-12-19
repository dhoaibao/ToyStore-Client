/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: { colors: { primary: '#0046FE', 'hover-primary': '#122da6' } },
  },
  plugins: [],
}

