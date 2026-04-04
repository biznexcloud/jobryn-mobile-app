/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        linkedin: {
          blue: '#0077B5',
          dark: '#004182',
          light: '#E1E9EE',
          bg: '#F3F2EF',
          gray: '#666666',
          text: '#000000',
        }
      }
    },
  },
  plugins: [],
}
