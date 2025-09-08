const konstaConfig = require('konsta/config');

module.exports = konstaConfig({
  content: ['./src/**/*.vue', './src/*.vue'],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography')
    
  ],

})

