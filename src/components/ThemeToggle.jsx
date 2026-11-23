import { useEffect, useState } from 'react';

/** Alterna modo claro/oscuro (clase "dark" en <html>) y recuerda la elección. */
export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
    try { localStorage.setItem('tema', oscuro ? 'dark' : 'light'); } catch { /* ignorar */ }
  }, [oscuro]);
  return (
    <button onClick={() => setOscuro(!oscuro)} aria-label="Cambiar entre modo claro y oscuro"
      className="rounded-full border border-white/30 bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/20">
      {oscuro ? '☀️' : '🌙'}
    </button>
  );
}
