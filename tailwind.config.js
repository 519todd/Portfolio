/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'text-secondary': '#666',
        'text-teritary': '#999',
        'secondary': '#E5E5E5',
        'primary': '#000',
      },
      transitionDuration: {
        '450': '450ms',
      },
    },
  },
  plugins: [],
}
