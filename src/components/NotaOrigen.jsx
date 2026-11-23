import { ORIGEN_LABEL } from './statusStyles.js';

/** Selector de nota (botones 4–10 + campo libre) y de origen (examen/promoción). */
export default function NotaOrigen({ nota, setNota, origen, setOrigen }) {
  // El campo libre muestra la nota solo si no coincide con un botón (ej. 7,5).
  const enBoton = nota !== '' && nota != null && [4, 5, 6, 7, 8, 9, 10].includes(Number(nota));
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="nota" className="mb-2 block text-sm font-semibold">Nota <span className="font-normal text-muted">(opcional)</span></label>
        <div className="flex flex-wrap gap-1.5">
          {[4, 5, 6, 7, 8, 9, 10].map((n) => {
            const activa = nota !== '' && nota != null && Number(nota) === n;
            return (
              <button key={n} type="button" onClick={() => setNota(activa ? '' : n)} aria-pressed={activa}
                className={`h-10 w-10 rounded-xl text-sm font-semibold tabular-nums transition ${activa ? 'bg-primary text-onprimary' : 'bg-tint hover:brightness-110'}`}>{n}</button>
            );
          })}
          <input id="nota" type="number" min="0" max="10" step="any" inputMode="decimal" value={enBoton ? '' : nota ?? ''} onChange={(e) => setNota(e.target.value)}
            placeholder="Otra" className="h-10 w-20 rounded-xl border border-line2 bg-surface px-3 tabular-nums placeholder:text-muted" />
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
  );
}

/** Valida la nota: '' = sin nota (null); número 0–10; si no, devuelve undefined (error). */
export function parsearNota(nota) {
  if (nota === '' || nota == null) return null;
  const n = Number(nota);
  return Number.isFinite(n) && n >= 0 && n <= 10 ? n : undefined;
}
