export default {
  content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: 'rgba(15, 23, 42, 0.92)',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
