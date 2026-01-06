/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        military: {
          50: '#f5f7f0',
          100: '#e8eddc',
          200: '#d1dbb9',
          300: '#b5c48f',
          400: '#9aad68',
          500: '#7cb342',
          600: '#689f38',
          700: '#4a5d23',
          800: '#3d4d1c',
          900: '#2d3a15',
          950: '#1a1f14',
        }
      },
      fontFamily: {
        military: ['"Black Ops One"', 'cursive'],
        mono: ['"Share Tech Mono"', 'monospace'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      animation: {
        'radar': 'radar 4s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        radar: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 179, 66, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 179, 66, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
