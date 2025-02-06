import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      spacing: {
        '0': '0px',
        '1': '5px',
        '2': '10px',
        '3': '15px',
        '4': '20px',
        '5': '25px',
        '6': '30px',
        '7': '35px',
        '8': '40px',
        '9': '45px',
        '10': '50px',
      },
      keyframes: {
        'zoom-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'zoom-in': 'zoom-in 0.5s ease-out',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.text-shadow-white': {
          textShadow: '0 0 1px #fff, 0 0 2px #fff, 0 0 3px #fff',
        },
        '.text-shadow-yellow': {
          textShadow: '0 0 1px #FFC300, 0 0 2px #FFC300, 0 0 3px #FFC300',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
