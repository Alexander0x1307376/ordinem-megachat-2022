/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    colors: {
      fillmain: '#292F3F',
      glassy: '#00000040',
      glassydarken: '#0000009a',
      bgdarken: '#272A35',
      bglighten: '#373E4E',
      bglighten2: '#7A8194',
      accented: '#B347EA',
      accented2: '#03A9F1',
      accented3: '#F18303',
      textPrimary: '#FFFFFF',
      textSecondary: '#C5C5C5',

      info: '#03A9F1',
      warning: '#F18303',
      accent: '#B347EA',
      danger: '#EF4444',
      lighten: '#7A8194',

      infoDarken: '#006c9b',
      warningDarken: '#a85a00',
      accentDarken: '#8133a8',
      dangerDarken: '#a32f2f',
      lightenDarken: '#4b4f5b',

      infoBrighten: '#a1d7ee',
      warningBrighten: '#eac8a2',
      accentBrighten: '#dcc8e6',
      dangerBrighten: '#ecb4b4',
      lightenBrighten: '#abb0bd',

      dangerBrighten: '#e8b4b4'
    },
    extend: {},
  },
  plugins: [],
}