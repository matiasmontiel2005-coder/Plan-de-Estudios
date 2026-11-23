import { STATUS_META, ORIGEN_LABEL, nombresCortos } from './statusStyles.js';

/** Tarjeta de una materia, coloreada según su categoría. */
export default function MateriaCard({ materia, ev, datos, porId, onClick }) {
  const meta = STATUS_META[ev.categoria];
  const nota = datos?.nota;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-lg border-2 p-2.5 text-left shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${meta.card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-tight">{materia.nombre}</span>
        {nota != null && (
          <span className="shrink-0 rounded-md bg-white/70 px-1.5 text-sm font-bold dark:bg-black/30" title={datos.origen ? ORIGEN_LABEL[datos.origen] : ''}>
            {nota}{datos.origen === 'promocion' && <span className="ml-0.5 text-[10px] font-semibold align-top">P</span>}
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-1 text-[11px]">
        <span className="font-medium">{meta.label}</span>
        {ev.puedeRendir && (
          <span className="rounded bg-indigo-600 px-1.5 py-0.5 font-semibold text-white">Puede rendir</span>
        )}
        {ev.categoria === 'puede_cursar' && ev.faltaIngles && (
          <span className="rounded bg-amber-500 px-1.5 py-0.5 font-semibold text-black">Falta inglés B2</span>
        )}
      </div>

      {/* Qué previas faltan, distinguiendo aprobar de regularizar */}
      {ev.categoria === 'bloqueada' && (
        <div className="mt-1 space-y-0.5 text-[11px] leading-snug">
          {ev.faltaAprobar.length > 0 && <p><b>Falta aprobar:</b> {nombresCortos(ev.faltaAprobar, porId)}</p>}
          {ev.faltaRegularizar.length > 0 && <p><b>Falta regularizar:</b> {nombresCortos(ev.faltaRegularizar, porId)}</p>}
        </div>
      )}
      {(ev.categoria === 'regularizada' || ev.categoria === 'en_curso') && !ev.puedeRendir && (
        <p className="mt-1 text-[11px] leading-snug"><b>Para rendir falta aprobar:</b> {nombresCortos(ev.faltaAprobarParaRendir, porId)}</p>
      )}
    </button>
  );
}
