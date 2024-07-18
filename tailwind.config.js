/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: [
    './templates/**/*.html.twig',
    './src/**/*.js',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        siamese: ['siamese', 'sans-serif'],
        snowstorm: ['Snowstorm', 'serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}