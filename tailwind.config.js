module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      safelist: [
        /^bg-/,
        "bg-black",
        "bg-white",
      ]
    }
  }
  ,
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
