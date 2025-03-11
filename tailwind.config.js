/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00EEFF',
        secondary: '#FF3DFF',
        'neon-green': '#00FF66',
        'neon-purple': '#9D00FF',
        'neon-orange': '#FF5E00',
        dark: {
          DEFAULT: '#0A0A14',
          lighter: '#12121E',
          light: '#1A1A28',
        },
      },
    },
  },
  plugins: [],
};