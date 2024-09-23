/** @type {import('tailwindcss').Config} */

module.exports = {
  content:['./src/app/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  purge: [],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    fontFamily: {
      display: ['Gilroy', 'sans-serif'],
      body: ['Graphik', 'sans-serif'],
    },
    borderWidth: {
      default: '1px',
      '0': '0',
      '2': '2px',
      '4': '4px',
    },
    extend: {
      backgroundImage: {
                 'hero-pattern': "url('./hexagonPattern.png')",
                 'footer-texture': "background-image: linear-gradient(to right, #2d3748, #1a202c)",
      },
                 
      spacing: {
        '96': '24rem',
        '128': '32rem',
      }
    }
  },

  variants: {},
  
  plugins: [
    // ...
    require('tailwindcss'),
    require('autoprefixer'),
    // ...
  ],
}
