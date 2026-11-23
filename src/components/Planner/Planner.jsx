import { useMemo, useState } from 'react';
import { validarPlanificacion } from '../../lib/planner.js';
import SelectMateria from '../SelectMateria.jsx';

const ESTILO = {
  ok: ['✔', 'border-green-500 bg-green-50 dark:bg-green-950/40', 'Habilitada'],
  aviso: ['⚠', 'border-amber-500 bg-amber-50 dark:bg-amber-950/40', 'Revisá'],
  error: ['✕', 'border-red-500 bg-red-50 dark:bg-red-950/40', 'No habilitada'],
};

/** Planificador de cuatrimestre: arma una lista y avisa qué materias no están habilitadas. */
export default function Planner({ plan, progress, evals, porId, setPlanificador }) {
  const elegidas = progress.planificador;
  const [extra, setExtra] = useState('');
  const resultado = useMemo(
    () => validarPlanificacion(plan.materias, progress.estados, elegidas),
    [plan, progress.estados, elegidas],
  );
  const agregar = (id) => id && !elegidas.includes(id) && setPlanificador([...elegidas, id]);
  const quitar = (id) => setPlanificador(elegidas.filter((x) => x !== id));

  // Sugerencias: sin cursar y habilitadas por correlativas.
  const sugeridas = plan.materias.filter((m) => evals[m.id].estado === 'sin_cursar' && evals[m.id].puedeCursar && !elegidas.includes(m.id));

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Elegí las materias que querés cursar. Las correlativas se comparan con tu estado actual:
        lo que cursás en el mismo cuatrimestre no habilita a otra materia.
      </p>

      <div>
        <h3 className="mb-1 text-sm font-semibold">Habilitadas hoy por correlativas</h3>
        <div className="flex flex-wrap gap-2">
          {sugeridas.length ? sugeridas.map((m) => (
            <button key={m.id} onClick={() => agregar(m.id)} className="rounded-full border border-blue-600 bg-blue-100 px-3 py-1 text-sm font-medium text-blue-900 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-100">+ {m.nombre}</button>
          )) : <span className="text-sm text-slate-500">No hay materias nuevas para agregar.</span>}
        </div>
      </div>

      <div>
        <h3 className="mb-1 text-sm font-semibold">Agregar otra materia (para probar)</h3>
        <SelectMateria materias={plan.materias} value={extra} onChange={(id) => { agregar(id); setExtra(''); }} filtro={(m) => !elegidas.includes(m.id)} />
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Mi cuatrimestre ({elegidas.length})</h3>
          {elegidas.length > 0 && <button onClick={() => setPlanificador([])} className="text-xs text-slate-500 underline">Vaciar</button>}
        </div>
        {resultado.length === 0 && <p className="text-sm text-slate-500">Todavía no elegiste materias.</p>}
        <ul className="space-y-2">
          {resultado.map((r) => {
            const [icono, clases, etiqueta] = ESTILO[r.nivel];
            return (
              <li key={r.id} className={`flex items-start justify-between gap-3 rounded-lg border-2 p-3 ${clases}`}>
                <div className="text-sm">
                  <p className="font-semibold">{icono} {porId[r.id].nombre} <span className="text-xs font-normal">· {etiqueta}</span></p>
                  {r.motivos.map((t, i) => <p key={i} className="mt-0.5 text-xs">{t}</p>)}
                </div>
                <button onClick={() => quitar(r.id)} aria-label={`Quitar ${porId[r.id].nombre}`} className="shrink-0 rounded px-2 text-lg leading-none text-slate-500 hover:bg-black/10">×</button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
