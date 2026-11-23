import { useMemo, useState } from 'react';
import { construirGrafo } from '../../lib/graph.js';
import { STATUS_META } from '../statusStyles.js';
import Leyenda from '../Leyenda.jsx';

// Medidas del dibujo (px)
const W = 168, H = 54, GX = 72, GY = 16, PAD = 16, HEAD = 26;

/** Grafo de correlatividades: una columna por semestre. Hover/tap resalta previas y desbloqueos. */
export default function GraphView({ plan, evals, porId, onEdit }) {
  const { previas, desbloquea } = useMemo(() => construirGrafo(plan.materias), [plan]);
  const [hover, setHover] = useState(null);
  const [fijada, setFijada] = useState(null); // tap/click: deja la selección fija (útil en celular)
  const activa = hover ?? fijada;

  // Posición de cada nodo según semestre y orden dentro del semestre.
  const { pos, ancho, alto, semestres } = useMemo(() => {
    const sems = [...new Set(plan.materias.map((m) => m.semestre))].sort((a, b) => a - b);
    const filas = {};
    const pos = {};
    for (const m of plan.materias) {
      filas[m.semestre] = (filas[m.semestre] ?? -1) + 1;
      pos[m.id] = { x: PAD + (m.semestre - 1) * (W + GX), y: PAD + HEAD + filas[m.semestre] * (H + GY) };
    }
    const maxFilas = Math.max(...Object.values(filas)) + 1;
    return { pos, semestres: sems, ancho: PAD * 2 + sems.length * W + (sems.length - 1) * GX, alto: PAD * 2 + HEAD + maxFilas * (H + GY) };
  }, [plan]);

  const aristas = useMemo(
    () => Object.entries(previas).flatMap(([hasta, desde]) => desde.map((d) => ({ desde: d, hasta }))),
    [previas],
  );

  const esPrevia = (id) => activa && previas[activa].includes(id);
  const esSiguiente = (id) => activa && desbloquea[activa].includes(id);

  const m = activa ? porId[activa] : null;
  const lista = (ids) => (ids.length ? ids.map((i) => porId[i].nombre).join(', ') : '—');

  return (
    <div>
      <div className="mb-3 space-y-1">
        <Leyenda />
        <p className="flex flex-wrap gap-x-4 text-xs text-slate-500 dark:text-slate-400">
          <span>Pasá el mouse o tocá una materia.</span>
          <span><b className="text-amber-600">Naranja</b> = sus previas</span>
          <span><b className="text-emerald-600">Verde</b> = lo que desbloquea</span>
          <span>Solo se dibujan correlatividades directas.</span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="relative" style={{ width: ancho, height: alto }}>
          {semestres.map((s) => (
            <div key={s} className="absolute text-xs font-semibold uppercase text-slate-400" style={{ left: PAD + (s - 1) * (W + GX), top: PAD - 4 }}>
              Semestre {s}
            </div>
          ))}
          <svg width={ancho} height={alto} className="absolute inset-0 pointer-events-none">
            {aristas.map(({ desde, hasta }) => {
              const a = pos[desde], b = pos[hasta];
              const x1 = a.x + W, y1 = a.y + H / 2, x2 = b.x, y2 = b.y + H / 2;
              const dx = Math.max(20, (x2 - x1) / 2);
              let cls = 'stroke-slate-300 dark:stroke-slate-600', op = 0.7, sw = 1.2;
              if (activa) {
                if (hasta === activa) { cls = 'stroke-amber-500'; op = 1; sw = 2.5; }
                else if (desde === activa) { cls = 'stroke-emerald-500'; op = 1; sw = 2.5; }
                else op = 0.07;
              }
              return <path key={desde + hasta} d={`M${x1} ${y1} C${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`} fill="none" className={cls} strokeWidth={sw} opacity={op} />;
            })}
          </svg>

          {plan.materias.map((mat) => {
            const meta = STATUS_META[evals[mat.id].categoria];
            const relacionada = !activa || mat.id === activa || esPrevia(mat.id) || esSiguiente(mat.id);
            const anillo = mat.id === activa ? 'ring-2 ring-indigo-500' : esPrevia(mat.id) ? 'ring-2 ring-amber-500' : esSiguiente(mat.id) ? 'ring-2 ring-emerald-500' : '';
            return (
              <button key={mat.id} type="button"
                onMouseEnter={() => setHover(mat.id)} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(mat.id)} onBlur={() => setHover(null)}
                onClick={() => setFijada(fijada === mat.id ? null : mat.id)}
                className={`absolute overflow-hidden rounded-md border-2 px-2 py-1 text-left text-[11px] font-semibold leading-tight transition-opacity ${meta.card} ${anillo} ${relacionada ? 'opacity-100' : 'opacity-25'}`}
                style={{ left: pos[mat.id].x, top: pos[mat.id].y, width: W, height: H }}
                title={`${mat.nombre} — ${meta.label}`}>
                <span className="line-clamp-3">{mat.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detalle de la selección (tap en celular) */}
      <div className="mt-3 min-h-[5rem] rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
        {m ? (
          <div className="space-y-1">
            <p className="font-semibold">{m.nombre} <span className="text-xs font-normal text-slate-500">· {STATUS_META[evals[m.id].categoria].label}</span></p>
            <p><b className="text-amber-600">Previas directas:</b> {lista(previas[m.id])}</p>
            <p><b className="text-emerald-600">Desbloquea:</b> {lista(desbloquea[m.id])}</p>
            <button onClick={() => onEdit(m.id)} className="mt-1 rounded-md bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">Cambiar estado</button>
          </div>
        ) : <p className="text-slate-500">Seleccioná una materia para ver sus previas y lo que desbloquea.</p>}
      </div>
    </div>
  );
}
