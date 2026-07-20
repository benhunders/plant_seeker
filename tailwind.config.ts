import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        leaf: {
          50: '#f2f9f1',
          100: '#e0f0dd',
          200: '#c1e1bd',
          300: '#95cb8e',
          400: '#63ac5b',
          500: '#42903b',
          600: '#31732c',
          700: '#285c25',
          800: '#224a20',
          900: '#1d3e1c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
