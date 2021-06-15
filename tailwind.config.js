module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      safelist: [
        /^bg-/,
        /^hover:bg-/,
        /^text-/,
        /^hover:text-/,
        /^border-/,
        /^hover:border-/,
        /^from-/,
        /^hover:from-/,
        /^to-/,
        /^hover:to-/,
        /^placeholder-/,
        /^hover:placeholder-/
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
