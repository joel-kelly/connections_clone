/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'connections-yellow': '#F9DF6D',
        'connections-green': '#A0C35A',
        'connections-blue': '#B0C4EF',
        'connections-purple': '#BA81C5',
      },
      fontFamily: {
        'nyt': ['Franklin Gothic', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
