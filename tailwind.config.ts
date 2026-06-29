import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A6D8C',
        secondary: '#F8FAFC',
        success: '#86EFAC',
        warning: '#FDE68A',
        critical: '#FCA5A5',
        'critical-dark': '#DC2626',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section': '4rem',
        'gap': '2rem',
      },
      borderRadius: {
        'interactive': '0.5rem',
      },
    },
  },
  plugins: [],
} satisfies Config;