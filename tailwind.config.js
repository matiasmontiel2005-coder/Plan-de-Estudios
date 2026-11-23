/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class', // el modo oscuro se activa con la clase "dark" en <html>
  theme: {
    extend: {
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
    },
  },
  plugins: [],
};
