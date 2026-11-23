import { useEffect, useRef, useState } from 'react';
import { ESTADOS } from '../lib/progress.js';
import { STATUS_META, ORIGEN_LABEL } from './statusStyles.js';
import Icon from './Icon.jsx';
import { Button } from './ui.jsx';

const OPCIONES = {
  sin_cursar: { label: 'Sin cursar', dot: 'bg-slate-400' },
  en_curso: { label: 'En curso', dot: STATUS_META.en_curso.dot },
  regularizada: { label: 'Regularizada', dot: STATUS_META.regularizada.dot },
  aprobada: { label: 'Aprobada', dot: STATUS_META.aprobada.dot },
};

/** Hoja inferior (celular) / diálogo (escritorio) para editar estado, nota y origen. */
export default function StateDialog({ materia, ev, datos, porId, onSave, onClose }) {
  const [estado, setEstado] = useState(datos?.estado ?? 'sin_cursar');
  const [nota, setNota] = useState(datos?.nota ?? '');
  const [origen, setOrigen] = useState(datos?.origen ?? 'examen');
  const [error, setError] = useState('');
  const panel = useRef(null);

  useEffect(() => {
    panel.current?.focus();
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
  const Linea = ({ ok, children }) => (
    <li className="flex gap-2"><Icon name={ok ? 'check' : 'lock'} className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'text-primary' : 'text-muted'}`} /><span>{children}</span></li>
  );

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in items-end justify-center bg-black/50 backdrop-blur-[2px] sm:items-center sm:p-4" onClick={onClose}>
      <div ref={panel} tabIndex={-1} role="dialog" aria-modal="true" aria-labelledby="dlg-titulo"
        className="max-h-[92vh] w-full max-w-md animate-slide-up overflow-y-auto rounded-t-3xl bg-surface p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-sheet outline-none sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-line2 sm:hidden" aria-hidden="true" />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="dlg-titulo" className="text-lg font-bold leading-tight">{materia.nombre}</h2>
            <p className="mt-1 text-xs text-muted">Código {materia.id} · {materia.anio}.º año · semestre {materia.semestre}</p>
          </div>
          <button onClick={onClose} aria-label="Cerrar" className="-mr-2 -mt-1 rounded-full p-2 text-muted hover:bg-tint"><Icon name="x" className="h-5 w-5" /></button>
        </div>

        {/* Disponibilidad */}
        <ul className="mt-4 space-y-1.5 rounded-2xl bg-tint p-3.5 text-xs leading-relaxed">
          {ev.puedeCursar ? <Linea ok>Correlativas para cursar cumplidas.</Linea> : (
            <>
              {ev.faltaAprobar.length > 0 && <Linea>Para cursar falta <b>aprobar</b>: {nombres(ev.faltaAprobar)}</Linea>}
              {ev.faltaRegularizar.length > 0 && <Linea>Para cursar falta <b>regularizar</b>: {nombres(ev.faltaRegularizar)}</Linea>}
            </>
          )}
          {ev.faltaIngles && <Linea>Para inscribirte falta aprobar <b>Inglés B2</b>.</Linea>}
          {ev.faltaAprobarParaRendir.length === 0
            ? <Linea ok>Previas para rendir aprobadas.</Linea>
            : <Linea>Para rendir falta aprobar: {nombres(ev.faltaAprobarParaRendir)}</Linea>}
        </ul>

        <fieldset className="mt-5">
          <legend className="mb-2 text-sm font-semibold">Estado</legend>
          <div className="grid grid-cols-2 gap-2">
            {ESTADOS.map((e) => (
              <button key={e} type="button" onClick={() => setEstado(e)} aria-pressed={estado === e}
                className={`flex min-h-[48px] items-center gap-2 rounded-xl border-2 px-3 text-sm font-medium transition ${estado === e ? 'border-primary bg-tint' : 'border-line hover:border-line2'}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${OPCIONES[e].dot}`} />{OPCIONES[e].label}
                {estado === e && <Icon name="check" className="ml-auto h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </fieldset>

        {estado === 'aprobada' && (
          <div className="mt-5 space-y-4">
            <div>
              <label htmlFor="nota" className="mb-2 block text-sm font-semibold">Nota</label>
              <div className="flex flex-wrap gap-1.5">
                {[4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <button key={n} type="button" onClick={() => { setNota(n); setError(''); }} aria-pressed={Number(nota) === n}
                    className={`h-10 w-10 rounded-xl text-sm font-semibold tabular-nums transition ${Number(nota) === n && nota !== '' ? 'bg-primary text-onprimary' : 'bg-tint hover:brightness-95'}`}>{n}</button>
                ))}
                <input id="nota" type="number" min="0" max="10" step="any" inputMode="decimal" value={nota} onChange={(e) => { setNota(e.target.value); setError(''); }}
                  placeholder="Otra" className="h-10 w-20 rounded-xl border border-line2 bg-surface px-3 tabular-nums" />
              </div>
            </div>
            <div>
              <span className="mb-2 block text-sm font-semibold">Origen</span>
              <div className="inline-flex rounded-xl bg-tint p-1" role="radiogroup" aria-label="Origen de la nota">
                {Object.entries(ORIGEN_LABEL).map(([v, l]) => (
                  <button key={v} type="button" role="radio" aria-checked={origen === v} onClick={() => setOrigen(v)}
                    className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${origen === v ? 'bg-surface shadow-soft' : 'text-muted'}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}
        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={guardar}>Guardar</Button>
        </div>
      </div>
    </div>
  );
}
