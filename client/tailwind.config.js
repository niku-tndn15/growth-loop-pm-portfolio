/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1A56DB',
        success: '#0E9F6E',
        warning: '#E3A008',
        danger: '#C81E1E',
        dark: '#111928',
        gray: '#6B7280',
        'light-bg': '#F9FAFB',
        'card-bg': '#FFFFFF',
        border: '#E5E7EB',
      },
      fontFamily: {
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
