import { STATUS_META, ORIGEN_LABEL, nombresCortos } from './statusStyles.js';
import Icon from './Icon.jsx';

/** Tarjeta de una materia: acento lateral + estado con ícono + nota. */
export default function MateriaCard({ materia, ev, datos, porId, onClick }) {
  const meta = STATUS_META[ev.categoria];
  const nota = datos?.nota;
  const bloqueada = ev.categoria === 'bloqueada';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${materia.nombre}: ${meta.label}${nota != null ? `, nota ${nota}` : ''}. Tocar para editar.`}
      className={`group relative w-full overflow-hidden rounded-xl border py-2.5 pl-4 pr-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${meta.card}`}
    >
      <span className={`absolute inset-y-0 left-0 w-1 ${meta.accent}`} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <span className={`text-[13px] font-semibold leading-snug ${bloqueada ? 'text-muted' : ''}`}>{materia.nombre}</span>
        {nota != null && (
          <span className="shrink-0 text-right" title={datos.origen ? ORIGEN_LABEL[datos.origen] : ''}>
            <span className="block text-lg font-bold leading-none tabular-nums">{nota}</span>
            {datos.origen === 'promocion' && <span className="text-[9px] font-semibold uppercase tracking-wide text-muted">Promo</span>}
          </span>
        )}
      </div>

      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium">
        <span className={`inline-flex items-center gap-1 ${meta.pill}`}>
          <Icon name={meta.icon} className="h-3.5 w-3.5" />{meta.label}
        </span>
        {ev.puedeRendir && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-onprimary">
            <Icon name="pen" className="h-3 w-3" />Puede rendir
          </span>
        )}
        {ev.categoria === 'puede_cursar' && ev.faltaIngles && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-amber-900 dark:bg-amber-400/20 dark:text-amber-200">
            <Icon name="globe" className="h-3 w-3" />Falta inglés B2
          </span>
        )}
      </div>

      {/* Qué previas faltan, distinguiendo aprobar de regularizar */}
      {bloqueada && (
        <div className="mt-1.5 space-y-0.5 text-[11px] leading-snug text-muted">
          {ev.faltaAprobar.length > 0 && <p><span className="font-semibold">Falta aprobar:</span> {nombresCortos(ev.faltaAprobar, porId, 2)}</p>}
          {ev.faltaRegularizar.length > 0 && <p><span className="font-semibold">Falta regularizar:</span> {nombresCortos(ev.faltaRegularizar, porId, 2)}</p>}
        </div>
      )}
      {(ev.categoria === 'regularizada' || ev.categoria === 'en_curso') && !ev.puedeRendir && (
        <p className="mt-1.5 text-[11px] leading-snug text-muted"><span className="font-semibold">Para rendir falta aprobar:</span> {nombresCortos(ev.faltaAprobarParaRendir, porId, 2)}</p>
      )}
    </button>
  );
}
