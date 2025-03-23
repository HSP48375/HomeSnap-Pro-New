/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A14',
        'background-secondary': '#131320',
        primary: '#00EEFF',
        secondary: '#FF00E5',
        'neon-purple': '#9C27B0',
        'neon-blue': '#2979FF',
        success: '#4CAF50',
        warning: '#FFC107',
        error: '#F44336'
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}