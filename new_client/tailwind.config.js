/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        extraLight: 200,
        mediumBold: 500,
        ultraBold: 700,
      }
    },
  },
  plugins: [],
  variants : {
    extend : {
      display : ["focus-group"]
    }
  }
}