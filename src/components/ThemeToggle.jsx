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
      className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm dark:border-slate-600">
      {oscuro ? '☀️' : '🌙'}
    </button>
  );
}
