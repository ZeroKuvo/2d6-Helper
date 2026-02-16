/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dungeon': {
          'dark': '#1a1a1a',
          'darker': '#0f0f0f',
          'light': '#e2e8f0',
          'accent': '#9f7aea',
          'danger': '#f56565',
          'success': '#48bb78',
          'warning': '#ed8936',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
