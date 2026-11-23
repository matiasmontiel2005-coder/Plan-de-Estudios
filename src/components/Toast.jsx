import { useEffect } from 'react';
import Icon from './Icon.jsx';

/** Aviso temporal con acción opcional (por ejemplo, "Deshacer"). */
export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 5000);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-50 flex justify-center px-4 sm:bottom-6" role="status" aria-live="polite">
      <div className="pointer-events-auto flex max-w-md animate-slide-up items-center gap-3 rounded-2xl bg-brand-950 py-2.5 pl-4 pr-2 text-sm text-brand-50 shadow-lift dark:bg-brand-100 dark:text-brand-950">
        <Icon name="check" className="h-4 w-4 shrink-0 text-brand-300 dark:text-brand-800" />
        <span className="min-w-0 flex-1">{toast.texto}</span>
        {toast.deshacer && (
          <button onClick={() => { toast.deshacer(); onClose(); }} className="inline-flex shrink-0 items-center gap-1 rounded-xl px-3 py-1.5 font-semibold text-brand-300 hover:bg-white/10 dark:text-brand-800 dark:hover:bg-black/5">
            <Icon name="undo" className="h-4 w-4" />Deshacer
          </button>
        )}
      </div>
    </div>
  );
}
