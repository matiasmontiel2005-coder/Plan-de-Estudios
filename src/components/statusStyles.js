// Colores y etiquetas por categoría (clases de Tailwind, con variante oscura).
export const STATUS_META = {
  aprobada: {
    label: 'Aprobada',
    card: 'bg-brand-300/50 border-brand-500 text-brand-950 dark:bg-brand-800/60 dark:border-brand-500 dark:text-brand-100',
    dot: 'bg-brand-500',
  },
  regularizada: {
    label: 'Regularizada',
    card: 'bg-yellow-100 border-yellow-500 text-yellow-950 dark:bg-yellow-900/40 dark:border-yellow-500 dark:text-yellow-50',
    dot: 'bg-yellow-400',
  },
  en_curso: {
    label: 'En curso',
    card: 'bg-sky-100 border-sky-400 text-sky-950 dark:bg-sky-900/40 dark:border-sky-400 dark:text-sky-50',
    dot: 'bg-sky-400',
  },
  puede_cursar: {
    label: 'Puede cursar',
    card: 'bg-blue-200 border-blue-600 text-blue-950 dark:bg-blue-800/60 dark:border-blue-400 dark:text-blue-50',
    dot: 'bg-blue-600',
  },
  bloqueada: {
    label: 'Bloqueada',
    card: 'bg-slate-100 border-slate-300 text-slate-600 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

export const ORDEN_CATEGORIAS = ['aprobada', 'regularizada', 'en_curso', 'puede_cursar', 'bloqueada'];

export const ORIGEN_LABEL = { examen: 'Examen', promocion: 'Promoción' };

/** "A, B, C +2 más" a partir de ids. */
export function nombresCortos(ids, porId, max = 3) {
  const n = ids.map((i) => porId[i]?.nombre ?? i);
  return n.length <= max ? n.join(', ') : `${n.slice(0, max).join(', ')} +${n.length - max} más`;
}
