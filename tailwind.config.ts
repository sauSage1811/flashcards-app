import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0D6EFD', // Main blue
          100: '#E7F0FF',     // Lightest blue
          700: '#024ac7',     // Darker blue for hover/active
        },
        neutral: {
          900: '#111827', // Darkest gray for text
          500: '#6B7280', // Medium gray for secondary text
          200: '#E5E7EB', // Light gray for borders
          50: '#F9FAFB',  // Off-white for backgrounds
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'flip-card': {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        'flip-card-back': {
          '0%': { transform: 'rotateY(180deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
      },
      animation: {
        'flip': 'flip-card 0.6s ease-in-out',
        'flip-back': 'flip-card-back 0.6s ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;



