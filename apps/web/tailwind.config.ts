import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171717',
        paper: '#F8F6F1',
        // Accessible on paper/light surfaces. Dark surfaces switch to the
        // brighter gold-light treatment in globals.css.
        gold: '#8A6A2F',
        'gold-light': '#DFBA67',
        silver: '#C5C7C7',
        line: '#DEDAD2',
        success: '#246A4F',
        wine: '#251C1B',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
