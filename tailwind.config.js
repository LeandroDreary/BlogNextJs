module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      whitelist: {
        greedy: [
        /$bg-$/,
        /$text-$/,
        /$border-$/,
        /$from-$/,
        /$to-$/,
        /$placeholder-$/
        ]
      }
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
