import { STATUS_META, ORDEN_CATEGORIAS } from './statusStyles.js';

export default function Leyenda() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
      {ORDEN_CATEGORIAS.map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className={`inline-block h-3 w-3 rounded-sm ${STATUS_META[c].dot}`} />
          {STATUS_META[c].label}
        </li>
      ))}
    </ul>
  );
}
