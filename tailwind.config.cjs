/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [],

  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {},
    },
  },

  plugins: [require("daisyui")],
  daisyui: ["cupcake"],
};
