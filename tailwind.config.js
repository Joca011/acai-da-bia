/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        vinho: { DEFAULT: '#6B0F32', escuro: '#4A0A22', profundo: '#2E0616' },
        ameixa: '#8E3B7A',
        coral: '#E1786E',
        pessego: '#F7DEB6',
        creme: '#FBF6EA',
        oliva: '#7A7646',
        // texto sobre creme em tom oliva escurecido (contraste AA)
        'oliva-escuro': '#4F4C2C',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        sans: ['"DM Sans Variable"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      maxWidth: {
        site: '76rem',
      },
    },
  },
  plugins: [],
};
