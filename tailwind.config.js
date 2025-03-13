
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00EEFF',
        secondary: '#9D00FF',
        accent: '#FF00C1',
        'neon-blue': '#00C8FF',
        'neon-purple': '#9D00FF',
        'neon-pink': '#FF00C1',
        'cyber-blue': '#0A1A2F',
        dark: {
          DEFAULT: '#0A0A14',
          lighter: '#12121E',
          light: '#1A1A28',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-fast': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 3s infinite',
        ripple: 'ripple 2s linear infinite',
      },
      keyframes: {
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(0, 200, 255, 0.7)' },
          '50%': { boxShadow: '0 0 30px rgba(157, 0, 255, 0.9)' },
        },
        ripple: {
          '0%': { boxShadow: '0 0 0 0 rgba(157, 0, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 20px rgba(157, 0, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(157, 0, 255, 0)' },
        },
      },
    },
  },
  plugins: [],
};
