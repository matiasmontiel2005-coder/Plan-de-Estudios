import { useMemo, useState } from 'react';
import { simular } from '../../lib/simulator.js';
import SelectMateria from '../SelectMateria.jsx';

/** "¿Y si apruebo X?": muestra qué se habilita sin guardar nada. */
export default function Simulator({ plan, progress, evals }) {
  const [id, setId] = useState('');
  const [accion, setAccion] = useState('aprobada');

  const resultado = useMemo(
    () => (id ? simular(plan.materias, progress.estados, id, accion) : null),
    [plan, progress.estados, id, accion],
  );
  const mat = plan.materias.find((m) => m.id === id);

  const Lista = ({ titulo, items, vacio }) => (
    <div>
      <h3 className="font-semibold">{titulo}</h3>
      {items.length ? (
        <ul className="mt-1 list-disc pl-5 text-sm">{items.map((m) => <li key={m.id}>{m.nombre} <span className="text-muted">({m.anio}.º año, sem. {m.semestre})</span></li>)}</ul>
      ) : <p className="mt-1 text-sm text-muted">{vacio}</p>}
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-muted">Elegí una materia y mirá qué se habilitaría. No se guarda nada: es solo una simulación.</p>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <SelectMateria materias={plan.materias} value={id} onChange={setId} filtro={(m) => evals[m.id].estado !== 'aprobada'} />
        <div className="flex overflow-hidden rounded-lg border border-line2">
          {[['aprobada', 'Aprobar'], ['regularizada', 'Regularizar']].map(([v, l]) => (
            <button key={v} onClick={() => setAccion(v)} className={`px-4 py-2 text-sm font-medium ${accion === v ? 'bg-primary text-onprimary' : 'bg-surface'}`}>{l}</button>
          ))}
        </div>
      </div>

      {resultado && mat && (
        <div className="space-y-4 rounded-xl border border-line bg-surface p-4">
          <p className="font-semibold">Si {accion === 'aprobada' ? 'aprobás' : 'regularizás'} «{mat.nombre}»:</p>
          {resultado.objetivo.estado === 'sin_cursar' && !resultado.objetivo.puedeCursar && (
            <p className="rounded-md bg-amber-100 p-2 text-sm text-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
              Ojo: hoy ni siquiera podés cursarla (te faltan previas), así que es un escenario hipotético.
            </p>
          )}
          <Lista titulo="Se habilitan para cursar" items={resultado.nuevasCursables} vacio="Ninguna materia nueva." />
          <Lista titulo="Quedan habilitadas para rendir el final" items={resultado.nuevasRendibles} vacio="Ninguna materia nueva." />
        </div>
      )}
    </div>
  );
}
