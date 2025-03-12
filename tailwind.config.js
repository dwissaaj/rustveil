/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
const typography = require('@tailwindcss/typography')
export default {
  content: ["./src/**/*.{html,svelte,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mplus: ['M1Plus', 'sans-serif'],
        comm: ['Commissioner', 'sans-serif'],
      }
    },
  },
  plugins: [daisyui, typography],
};

