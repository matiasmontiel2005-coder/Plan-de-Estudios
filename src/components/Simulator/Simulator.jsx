import { useMemo, useState } from 'react';
import { simular } from '../../lib/simulator.js';
import SelectMateria from '../SelectMateria.jsx';
import Icon from '../Icon.jsx';
import { Card, CardTitle, PageHeader } from '../ui.jsx';

/** "¿Y si apruebo X?": muestra qué se habilita sin guardar nada. */
export default function Simulator({ plan, progress, evals }) {
  const [id, setId] = useState('');
  const [accion, setAccion] = useState('aprobada');

  const resultado = useMemo(
    () => (id ? simular(plan.materias, progress.estados, id, accion) : null),
    [plan, progress.estados, id, accion],
  );
  const mat = plan.materias.find((m) => m.id === id);

  const Lista = ({ titulo, icono, items, vacio }) => (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold"><Icon name={icono} className="h-4 w-4 text-primary" />{titulo}<span className="text-muted">· {items.length}</span></p>
      {items.length ? (
        <ul className="space-y-1.5">{items.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 rounded-lg bg-tint px-3 py-2 text-sm">
            <span>{m.nombre}</span><span className="shrink-0 text-xs text-muted">{m.anio}.º año · sem. {m.semestre}</span>
          </li>
        ))}</ul>
      ) : <p className="rounded-lg border border-dashed border-line2 px-3 py-2 text-sm text-muted">{vacio}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader titulo="Simulador" descripcion="¿Qué pasa si apruebo o regularizo una materia? Probá escenarios sin modificar tu progreso." />
      <Card>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <SelectMateria materias={plan.materias} value={id} onChange={setId} filtro={(m) => evals[m.id].estado !== 'aprobada'} label="Materia a simular" />
          <div className="inline-flex rounded-xl bg-tint p-1" role="radiogroup" aria-label="Acción a simular">
            {[['aprobada', 'Aprobar'], ['regularizada', 'Regularizar']].map(([v, l]) => (
              <button key={v} role="radio" aria-checked={accion === v} onClick={() => setAccion(v)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition ${accion === v ? 'bg-surface shadow-soft' : 'text-muted'}`}>{l}</button>
            ))}
          </div>
        </div>
      </Card>

      {resultado && mat ? (
        <Card className="mt-3 animate-slide-up">
          <CardTitle>Resultado</CardTitle>
          <p className="mb-4 text-lg font-bold leading-snug">
            Si {accion === 'aprobada' ? 'aprobás' : 'regularizás'} {mat.nombre}, se {resultado.nuevasCursables.length + resultado.nuevasRendibles.length === 1 ? 'destraba' : 'destraban'}{' '}
            <span className="text-primary">{resultado.nuevasCursables.length + resultado.nuevasRendibles.length}</span>.
          </p>
          {resultado.objetivo.estado === 'sin_cursar' && !resultado.objetivo.puedeCursar && (
            <p className="mb-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-400/10 dark:text-amber-200">
              <Icon name="alert" className="mt-0.5 h-4 w-4 shrink-0" />Escenario hipotético: hoy todavía no podés cursarla porque te faltan previas.
            </p>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <Lista titulo="Para cursar" icono="arrow" items={resultado.nuevasCursables} vacio="Ninguna materia nueva." />
            <Lista titulo="Para rendir" icono="pen" items={resultado.nuevasRendibles} vacio="Ningún final nuevo." />
          </div>
        </Card>
      ) : (
        <div className="mt-3 rounded-2xl border border-dashed border-line2 p-8 text-center text-sm text-muted">
          <Icon name="simulador" className="mx-auto mb-2 h-6 w-6" />Elegí una materia para ver el resultado.
        </div>
      )}
    </div>
  );
}
