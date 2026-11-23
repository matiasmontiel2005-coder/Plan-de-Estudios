// Estilo por categoría. El color identifica el estado; además cada uno tiene
// ícono y texto, para no depender solo del color (accesibilidad).
export const STATUS_META = {
  aprobada: {
    label: 'Aprobada', icon: 'check',
    card: 'bg-surface border-line',
    accent: 'bg-brand-500',
    pill: 'text-brand-800 dark:text-brand-300',
    dot: 'bg-brand-500',
  },
  regularizada: {
    label: 'Regularizada', icon: 'bookmark',
    card: 'bg-amber-50 border-amber-300 dark:bg-amber-400/10 dark:border-amber-500/40',
    accent: 'bg-amber-400',
    pill: 'text-amber-800 dark:text-amber-300',
    dot: 'bg-amber-400',
  },
  en_curso: {
    label: 'En curso', icon: 'play',
    card: 'bg-sky-50 border-sky-300 dark:bg-sky-400/10 dark:border-sky-500/40',
    accent: 'bg-sky-400',
    pill: 'text-sky-800 dark:text-sky-300',
    dot: 'bg-sky-400',
  },
  puede_cursar: {
    label: 'Puede cursar', icon: 'arrow',
    card: 'bg-blue-50 border-blue-400 ring-1 ring-blue-400/40 dark:bg-blue-500/15 dark:border-blue-400/70',
    accent: 'bg-blue-600 dark:bg-blue-400',
    pill: 'text-blue-800 dark:text-blue-300',
    dot: 'bg-blue-600',
  },
  bloqueada: {
    label: 'Bloqueada', icon: 'lock',
    card: 'bg-surface border-line',
    accent: 'bg-slate-300 dark:bg-slate-600',
    pill: 'text-slate-600 dark:text-slate-400',
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
