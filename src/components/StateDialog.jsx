import { useState } from 'react';
import { ESTADOS } from '../lib/progress.js';
import { STATUS_META } from './statusStyles.js';
import Icon from './Icon.jsx';
import Sheet from './Sheet.jsx';
import NotaOrigen, { parsearNota } from './NotaOrigen.jsx';
import { Button } from './ui.jsx';

const OPCIONES = {
  sin_cursar: { label: 'Sin cursar', dot: 'bg-slate-400' },
  en_curso: { label: 'En curso', dot: STATUS_META.en_curso.dot },
  regularizada: { label: 'Regularizada', dot: STATUS_META.regularizada.dot },
  aprobada: { label: 'Aprobada', dot: STATUS_META.aprobada.dot },
};

/** Editar estado, nota y origen de una materia. */
export default function StateDialog({ materia, ev, datos, porId, onSave, onClose }) {
  const [estado, setEstado] = useState(datos?.estado ?? 'sin_cursar');
  const [nota, setNota] = useState(datos?.nota ?? '');
  const [origen, setOrigen] = useState(datos?.origen ?? 'examen');
  const [error, setError] = useState('');

  const guardar = () => {
    const n = estado === 'aprobada' ? parsearNota(nota) : null;
    if (n === undefined) return setError('La nota debe estar entre 0 y 10.');
    onSave(materia.id, estado, n, estado === 'aprobada' ? origen : undefined);
    onClose();
  };
  const nombres = (ids) => ids.map((i) => porId[i]?.nombre ?? i).join(', ');
  const Linea = ({ ok, children }) => (
    <li className="flex gap-2"><Icon name={ok ? 'check' : 'lock'} className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? 'text-primary' : 'text-muted'}`} /><span>{children}</span></li>
  );

  return (
    <Sheet titulo={materia.nombre} subtitulo={`Código ${materia.id} · ${materia.anio}.º año · semestre ${materia.semestre}`} onClose={onClose}
      footer={<div className="grid grid-cols-2 gap-2"><Button onClick={onClose}>Cancelar</Button><Button variant="primary" onClick={guardar}>Guardar</Button></div>}>
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
        <div className="mt-5"><NotaOrigen nota={nota} setNota={(v) => { setNota(v); setError(''); }} origen={origen} setOrigen={setOrigen} /></div>
      )}
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    </Sheet>
  );
}
