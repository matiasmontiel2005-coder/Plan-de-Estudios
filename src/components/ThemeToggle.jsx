import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';

/** Alterna modo claro/oscuro (clase "dark" en <html>) y recuerda la elección. */
export default function ThemeToggle() {
  const [oscuro, setOscuro] = useState(() => document.documentElement.classList.contains('dark'));
  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro);
    try { localStorage.setItem('tema', oscuro ? 'dark' : 'light'); } catch { /* ignorar */ }
  }, [oscuro]);
  return (
    <button onClick={() => setOscuro(!oscuro)} aria-label={oscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line2 bg-surface transition hover:bg-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
      <Icon name={oscuro ? 'sun' : 'moon'} className="h-5 w-5" />
    </button>
  );
}
