import { STATUS_META, ORDEN_CATEGORIAS } from './statusStyles.js';
import Icon from './Icon.jsx';

export default function Leyenda() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted" aria-label="Referencias de color">
      {ORDEN_CATEGORIAS.map((c) => (
        <li key={c} className="flex items-center gap-1.5">
          <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${STATUS_META[c].dot} text-white`}>
            <Icon name={STATUS_META[c].icon} className="h-2.5 w-2.5" strokeWidth="3" />
          </span>
          {STATUS_META[c].label}
        </li>
      ))}
    </ul>
  );
}
