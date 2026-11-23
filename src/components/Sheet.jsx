import { useEffect, useRef } from 'react';
import Icon from './Icon.jsx';

/** Hoja inferior en celular / diálogo centrado en escritorio. Cierra con Escape o tocando afuera. */
export default function Sheet({ titulo, subtitulo, onClose, children, footer }) {
  const panel = useRef(null);
  useEffect(() => {
    panel.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={onClose}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="sheet-titulo"
        className="flex max-h-[92vh] w-full max-w-md animate-slide-up flex-col rounded-t-3xl border border-line bg-surface shadow-sheet outline-none sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="overflow-y-auto p-5">
          <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line2 sm:hidden" aria-hidden="true" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="sheet-titulo" className="text-lg font-bold leading-tight">{titulo}</h2>
              {subtitulo && <p className="mt-1 text-xs text-muted">{subtitulo}</p>}
            </div>
            <button onClick={onClose} aria-label="Cerrar" className="-mr-2 -mt-1 rounded-full p-2 text-muted hover:bg-tint"><Icon name="x" className="h-5 w-5" /></button>
          </div>
          {children}
        </div>
        {footer && <div className="border-t border-line p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>
  );
}
