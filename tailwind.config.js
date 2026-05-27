/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- THIS IS CRUCIAL
    "./src/**/**/*.{js,ts,jsx,tsx}", // <--- THIS IS CRUCIAL
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
