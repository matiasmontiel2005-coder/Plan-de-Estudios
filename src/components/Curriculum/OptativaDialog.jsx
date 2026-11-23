import { useMemo, useState } from 'react';
import Icon from '../Icon.jsx';
import Sheet from '../Sheet.jsx';
import NotaOrigen, { parsearNota } from '../NotaOrigen.jsx';
import { Button } from '../ui.jsx';

const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

/**
 * Agregar una optativa aprobada (elegir de la lista + nota) o editar/quitar una existente.
 * `id` null = agregar.
 */
export default function OptativaDialog({ id, catalogo, optativas, onSave, onRemove, onClose }) {
  const editando = id != null;
  const [elegida, setElegida] = useState(id ?? '');
  const [busqueda, setBusqueda] = useState('');
  const [nota, setNota] = useState(editando ? optativas[id]?.nota ?? '' : '');
  const [origen, setOrigen] = useState(editando ? optativas[id]?.origen ?? 'examen' : 'examen');
  const [error, setError] = useState('');

  const disponibles = useMemo(() => {
    const q = norm(busqueda.trim());
    return catalogo.filter((o) => !optativas[o.id] && (!q || norm(o.nombre).includes(q) || o.id.includes(q)));
  }, [catalogo, optativas, busqueda]);
  const nombre = catalogo.find((o) => o.id === elegida)?.nombre;

  const guardar = () => {
    if (!elegida) return setError('Elegí una optativa de la lista.');
    const n = parsearNota(nota);
    if (n === undefined) return setError('La nota debe estar entre 0 y 10.');
    onSave(elegida, { ...(n != null && { nota: n }), origen });
    onClose();
  };

  return (
    <Sheet titulo={editando ? nombre : 'Agregar optativa aprobada'} subtitulo={editando ? `Código ${id} · optativa` : 'Elegí la optativa y cargá la nota.'} onClose={onClose}
      footer={
        <div className={`grid gap-2 ${editando ? 'grid-cols-[auto_1fr_1fr]' : 'grid-cols-2'}`}>
          {editando && (
            <Button variant="danger" onClick={() => { onRemove(id); onClose(); }} aria-label="Quitar optativa"><Icon name="x" className="h-4 w-4" /></Button>
          )}
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={guardar}>Guardar</Button>
        </div>
      }>
      {!editando && (
        <div className="mt-4">
          <label className="relative block">
            <span className="sr-only">Buscar optativa</span>
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar optativa…"
              className="w-full rounded-xl border border-line2 bg-surface py-2.5 pl-9 pr-3 placeholder:text-muted focus:border-primary focus:outline-none" />
          </label>
          <ul className="mt-2 max-h-56 space-y-1 overflow-y-auto rounded-xl border border-line p-1" role="listbox" aria-label="Optativas disponibles">
            {disponibles.map((o) => (
              <li key={o.id}>
                <button type="button" role="option" aria-selected={elegida === o.id} onClick={() => { setElegida(o.id); setError(''); }}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${elegida === o.id ? 'bg-tint font-semibold' : 'hover:bg-tint'}`}>
                  <span className="flex-1">{o.nombre}</span>
                  {elegida === o.id ? <Icon name="check" className="h-4 w-4 text-primary" /> : <span className="text-xs text-muted">{o.id}</span>}
                </button>
              </li>
            ))}
            {disponibles.length === 0 && <li className="px-3 py-4 text-center text-sm text-muted">Sin resultados.</li>}
          </ul>
        </div>
      )}
      <div className="mt-5"><NotaOrigen nota={nota} setNota={(v) => { setNota(v); setError(''); }} origen={origen} setOrigen={setOrigen} /></div>
      {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
    </Sheet>
  );
}
