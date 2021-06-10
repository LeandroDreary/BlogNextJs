module.exports = {
  purge: {
    content: ["./**/*.{ts,tsx}"],
    options: {
      whitelist: [
        /bg-red-50/,
        /bg-red-100/,
        /bg-red-200/,
        /bg-red-300/,
        /bg-red-400/,
        /bg-red-500/,
        /bg-red-600/,
        /bg-red-700/,
        /bg-red-800/,
        /bg-red-900/,
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
