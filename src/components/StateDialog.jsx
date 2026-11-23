import { useEffect, useState } from 'react';
import { ESTADOS } from '../lib/progress.js';
import { STATUS_META, ORIGEN_LABEL } from './statusStyles.js';

const ETIQUETA_ESTADO = { sin_cursar: 'Sin cursar', en_curso: 'En curso', regularizada: 'Regularizada', aprobada: 'Aprobada' };

/** Ventana para cambiar el estado de una materia y cargar nota/origen. */
export default function StateDialog({ materia, ev, datos, porId, onSave, onClose }) {
  const [estado, setEstado] = useState(datos?.estado ?? 'sin_cursar');
  const [nota, setNota] = useState(datos?.nota ?? '');
  const [origen, setOrigen] = useState(datos?.origen ?? 'examen');
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const guardar = () => {
    let n = null;
    if (estado === 'aprobada' && nota !== '') {
      n = Number(nota);
      if (!Number.isFinite(n) || n < 0 || n > 10) return setError('La nota debe estar entre 0 y 10.');
    }
    onSave(materia.id, estado, n, estado === 'aprobada' ? origen : undefined);
    onClose();
  };
  const nombres = (ids) => ids.map((i) => porId[i]?.nombre ?? i).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={materia.nombre}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl dark:bg-slate-900 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-bold">{materia.nombre}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Código {materia.id} · {materia.anio}.º año · semestre {materia.semestre} · hoy: {STATUS_META[ev.categoria].label}
        </p>

        {/* Información de disponibilidad */}
        <div className="mt-3 space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
          {ev.faltaAprobar.length > 0 && <p><b>Para cursar falta aprobar:</b> {nombres(ev.faltaAprobar)}</p>}
          {ev.faltaRegularizar.length > 0 && <p><b>Para cursar falta regularizar:</b> {nombres(ev.faltaRegularizar)}</p>}
          {ev.puedeCursar && <p>Correlativas para cursar: ✔ cumplidas.</p>}
          {ev.faltaIngles && <p className="text-amber-700 dark:text-amber-300"><b>Para inscribirte falta aprobar Inglés (B2).</b></p>}
          {ev.faltaAprobarParaRendir.length > 0 && <p><b>Para rendir falta aprobar:</b> {nombres(ev.faltaAprobarParaRendir)}</p>}
          {ev.faltaAprobarParaRendir.length === 0 && <p>Previas para rendir: ✔ todas aprobadas.</p>}
        </div>

        <fieldset className="mt-4">
          <legend className="mb-1 text-sm font-medium">Estado</legend>
          <div className="grid grid-cols-2 gap-2">
            {ESTADOS.map((e) => (
              <button key={e} type="button" onClick={() => setEstado(e)}
                className={`rounded-lg border-2 px-3 py-2 text-sm font-medium ${estado === e ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950' : 'border-slate-300 dark:border-slate-600'}`}>
                {ETIQUETA_ESTADO[e]}
              </button>
            ))}
          </div>
        </fieldset>

        {estado === 'aprobada' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm font-medium">Nota
              <input type="number" min="0" max="10" step="any" value={nota} onChange={(e) => { setNota(e.target.value); setError(''); }}
                placeholder="Sin nota"
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800" />
            </label>
            <label className="text-sm font-medium">Origen
              <select value={origen} onChange={(e) => setOrigen(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
                {Object.entries(ORIGEN_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
          </div>
        )}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
          <button onClick={guardar} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Guardar</button>
        </div>
      </div>
    </div>
  );
}
