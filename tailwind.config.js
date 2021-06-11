module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      safelist: [
        /^bg-^/,
        /^text-^/,
        /^text-^/,
        /^border-^/,
        /^from-^/,
        /^to-^/,
        /^placeholder-^/,
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
