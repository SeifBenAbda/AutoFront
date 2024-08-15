// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bluePrimary: '#171543', // Define your custom color here
        veryGrey:'#f8f8f8',
        whiteSecond:"#fbfbfb"
        // Add more custom colors if needed
      },
      fontFamily: {
        oswald: ['Fjalla One','sans-serif'],
      },
    },
  },
  plugins: [],
}
