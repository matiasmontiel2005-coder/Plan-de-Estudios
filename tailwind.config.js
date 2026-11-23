/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // el modo oscuro se activa con la clase "dark" en <html>
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Paleta base (verdes)
        brand: { 950: '#0F3D2E', 800: '#166534', 500: '#4C956C', 300: '#A8D5BA', 100: '#E6F2EA', 50: '#F9FCF8' },
        // Colores semánticos: cambian solos entre claro y oscuro (ver index.css)
        surface: 'var(--c-surface)',
        tint: 'var(--c-tint)',
        line: 'var(--c-line)',
        line2: 'var(--c-line2)',
        muted: 'var(--c-muted)',
        primary: 'var(--c-primary)',
        onprimary: 'var(--c-onprimary)',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 61, 46, 0.05), 0 1px 3px rgba(15, 61, 46, 0.04)',
        lift: '0 6px 20px -6px rgba(15, 61, 46, 0.25)',
        sheet: '0 -10px 40px -10px rgba(0, 0, 0, 0.35)',
      },
      keyframes: {
        'slide-up': { from: { transform: 'translateY(16px)', opacity: '0' }, to: { transform: 'none', opacity: '1' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        'slide-up': 'slide-up .22s cubic-bezier(.2,.8,.2,1)',
        'fade-in': 'fade-in .18s ease-out',
      },
    },
  },
  plugins: [],
};
