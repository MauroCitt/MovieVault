/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', 
    './public/index.html', 
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'saira': ['Saira-Condensed', 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
};


