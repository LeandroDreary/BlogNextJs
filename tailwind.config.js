module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      whitelist: [
        /^text-/
      ]
    }
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}