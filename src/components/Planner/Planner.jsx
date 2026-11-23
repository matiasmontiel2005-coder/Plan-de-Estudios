import { useMemo, useState } from 'react';
import { validarPlanificacion } from '../../lib/planner.js';
import SelectMateria from '../SelectMateria.jsx';
import Icon from '../Icon.jsx';
import { Card, CardTitle, PageHeader } from '../ui.jsx';

const ESTILO = {
  ok: { icono: 'check', clases: 'border-brand-500/50 bg-brand-100/60 dark:bg-brand-800/25', badge: 'bg-primary text-onprimary', etiqueta: 'Habilitada' },
  aviso: { icono: 'alert', clases: 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-400/10', badge: 'bg-amber-400 text-amber-950', etiqueta: 'Revisá' },
  error: { icono: 'lock', clases: 'border-red-300 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10', badge: 'bg-red-600 text-white', etiqueta: 'No habilitada' },
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
  const errores = resultado.filter((r) => r.nivel === 'error').length;

  // Sugerencias: sin cursar y habilitadas por correlativas.
  const sugeridas = plan.materias.filter((m) => evals[m.id].estado === 'sin_cursar' && evals[m.id].puedeCursar && !elegidas.includes(m.id));

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader titulo="Planificador" descripcion="Armá tu próximo cuatrimestre. Las correlativas se comparan con tu estado actual: lo que cursás en paralelo no habilita otra materia." />

      <Card>
        <CardTitle>Sugeridas</CardTitle>
        <div className="flex flex-wrap gap-2">
          {sugeridas.length ? sugeridas.map((m) => (
            <button key={m.id} onClick={() => agregar(m.id)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-blue-300 bg-blue-50 px-3.5 text-sm font-medium text-blue-900 transition hover:bg-blue-100 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-100">
              <span className="text-base leading-none">+</span>{m.nombre}
            </button>
          )) : <span className="text-sm text-muted">No hay materias nuevas para agregar.</span>}
        </div>
        <div className="mt-4">
          <SelectMateria materias={plan.materias} value={extra} onChange={(id) => { agregar(id); setExtra(''); }} filtro={(m) => !elegidas.includes(m.id)} placeholder="Agregar otra materia…" />
        </div>
      </Card>

      <Card className="mt-3">
        <CardTitle aside={elegidas.length > 0 && <button onClick={() => setPlanificador([])} className="font-semibold text-primary">Vaciar</button>}>
          Mi cuatrimestre · {elegidas.length}
        </CardTitle>
        {resultado.length > 0 && (
          <p className={`mb-3 text-sm font-semibold ${errores ? 'text-red-700 dark:text-red-300' : 'text-primary'}`}>
            {errores ? `${errores} ${errores === 1 ? 'materia no está habilitada' : 'materias no están habilitadas'}.` : 'Todo en orden para inscribirte.'}
          </p>
        )}
        {resultado.length === 0 && (
          <div className="rounded-xl border border-dashed border-line2 p-6 text-center text-sm text-muted">
            <Icon name="planificador" className="mx-auto mb-2 h-6 w-6" />Agregá materias desde las sugeridas.
          </div>
        )}
        <ul className="space-y-2">
          {resultado.map((r) => {
            const e = ESTILO[r.nivel];
            return (
              <li key={r.id} className={`flex items-start gap-3 rounded-xl border p-3 ${e.clases}`}>
                <span className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${e.badge}`}><Icon name={e.icono} className="h-3.5 w-3.5" /></span>
                <div className="min-w-0 flex-1 text-sm">
                  <p className="font-semibold">{porId[r.id].nombre} <span className="font-normal text-muted">· {e.etiqueta}</span></p>
                  {r.motivos.map((t, i) => <p key={i} className="mt-0.5 text-xs text-muted">{t}</p>)}
                </div>
                <button onClick={() => quitar(r.id)} aria-label={`Quitar ${porId[r.id].nombre}`} className="-m-1 rounded-full p-2 text-muted hover:bg-black/5 dark:hover:bg-white/10">
                  <Icon name="x" className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
