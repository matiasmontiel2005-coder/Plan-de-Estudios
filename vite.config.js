import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base './' => funciona igual en GitHub Pages (subcarpeta) y en Vercel (raíz).
export default defineConfig({
  base: './',
  plugins: [react()],
  test: { environment: 'node', include: ['src/**/*.test.js'] },
});
