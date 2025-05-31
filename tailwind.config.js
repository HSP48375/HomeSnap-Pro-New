/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-gray': '#1A1A1A',
        'neon-magenta': '#FF00FF',
        'electric-blue': '#00FFFF',
        'vibrant-orange': '#FF7700',
        success: '#4CAF50',
        warning: '#FFC107', 
        error: '#F44336'
      },
      fontFamily: {
        'outfit': ['Outfit', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
    boxShadow: {
      'neon-magenta': '0 0 10px #FF00FF, 0 0 20px #FF00FF, 0 0 30px #FF00FF',
      'electric-blue': '0 0 10px #00FFFF, 0 0 20px #00FFFF, 0 0 30px #00FFFF',
      'vibrant-orange': '0 0 10px #FF7700, 0 0 20px #FF7700, 0 0 30px #FF7700',
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.glassmorphism': {
          'background': 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
      })
    },
  ],
}