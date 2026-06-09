/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./assets/js/**/*.js"
  ],
  theme: {
    extend: {
      borderRadius: {
        '4xl': '2rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,.08)'
      }
    },
  },
  plugins: [],
}
