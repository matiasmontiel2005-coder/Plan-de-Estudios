import { useMemo, useState } from 'react';
import MateriaCard from '../MateriaCard.jsx';
import Leyenda from '../Leyenda.jsx';
import Optativas from './Optativas.jsx';
import Icon from '../Icon.jsx';
import { Bar, PageHeader } from '../ui.jsx';
import { catalogoOptativas } from '../../lib/plan.js';

// Normaliza texto para buscar sin importar tildes ni mayúsculas.
const norm = (s) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

const FILTROS = [
  ['todas', 'Todas', () => true],
  ['accion', 'Para hacer', (ev) => ev.categoria === 'puede_cursar' || ev.puedeRendir],
  ['cursando', 'Cursando', (ev) => ev.categoria === 'en_curso' || ev.categoria === 'regularizada'],
  ['bloqueadas', 'Bloqueadas', (ev) => ev.categoria === 'bloqueada'],
  ['pendientes', 'Pendientes', (ev) => ev.categoria !== 'aprobada'],
];

/** Malla curricular: búsqueda, filtros y un bloque por año (los completos se pliegan). */
export default function Curriculum({ plan, evals, progress, porId, onSelect, setOptativa }) {
  const [filtro, setFiltro] = useState('todas');
  const [busqueda, setBusqueda] = useState('');
  const [abiertos, setAbiertos] = useState({}); // { [anio]: boolean } elegido por el usuario

  const pasaFiltro = FILTROS.find(([id]) => id === filtro)[2];
  const q = norm(busqueda.trim());
  const visible = (m) => pasaFiltro(evals[m.id]) && (!q || norm(m.nombre).includes(q) || m.id.includes(q));
  const filtrando = filtro !== 'todas' || q !== '';

  const conteo = useMemo(
    () => Object.fromEntries(FILTROS.map(([id, , f]) => [id, plan.materias.filter((m) => f(evals[m.id])).length])),
    [plan, evals],
  );
  const anios = [...new Set(plan.materias.map((m) => m.anio))].sort((a, b) => a - b);
  const hayResultados = plan.materias.some(visible);

  return (
    <div>
      <PageHeader titulo="Malla curricular" descripcion="Tocá una materia para cambiar su estado y cargar la nota." />

      {/* Barra de herramientas: búsqueda + filtros */}
      <div className="mb-4 space-y-3">
        <label className="relative block">
          <span className="sr-only">Buscar materia</span>
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input type="search" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar materia o código…"
            className="w-full rounded-xl border border-line2 bg-surface py-2.5 pl-9 pr-3 placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2" />
        </label>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1" role="tablist" aria-label="Filtrar materias">
          {FILTROS.map(([id, label]) => (
            <button key={id} role="tab" aria-selected={filtro === id} onClick={() => setFiltro(id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${filtro === id ? 'border-primary bg-primary text-onprimary' : 'border-line2 bg-surface hover:bg-tint'}`}>
              {label}
              <span className={`rounded-full px-1.5 text-xs tabular-nums ${filtro === id ? 'bg-white/20' : 'bg-tint text-muted'}`}>{conteo[id]}</span>
            </button>
          ))}
        </div>
        <Leyenda />
      </div>

      {!hayResultados && (
        <div className="rounded-2xl border border-dashed border-line2 p-8 text-center text-sm text-muted">
          No hay materias que coincidan. <button className="font-semibold text-primary underline" onClick={() => { setFiltro('todas'); setBusqueda(''); }}>Limpiar filtros</button>
        </div>
      )}

      <div className="space-y-3">
        {anios.map((anio) => {
          const delAnio = plan.materias.filter((m) => m.anio === anio);
          const visibles = delAnio.filter(visible);
          if (!visibles.length) return null;
          const ok = delAnio.filter((m) => evals[m.id].estado === 'aprobada').length;
          const completo = ok === delAnio.length;
          const abierto = filtrando || (abiertos[anio] ?? !completo);
          const semestres = [...new Set(visibles.map((m) => m.semestre))].sort((a, b) => a - b);
          return (
            <section key={anio} className="overflow-hidden rounded-2xl border border-line bg-surface shadow-soft">
              <button type="button" onClick={() => setAbiertos({ ...abiertos, [anio]: !abierto })} aria-expanded={abierto}
                className="flex w-full items-center gap-4 px-4 py-3.5 text-left hover:bg-tint disabled:cursor-default" disabled={filtrando}>
                <h2 className="w-16 shrink-0 text-base font-bold">{anio}.º año</h2>
                <div className="flex-1"><Bar valor={(ok / delAnio.length) * 100} className="bg-brand-500" /></div>
                <span className={`flex shrink-0 items-center gap-1 text-sm tabular-nums ${completo ? 'font-semibold text-primary' : 'text-muted'}`}>
                  {completo && <Icon name="check" className="h-4 w-4" />}{ok}/{delAnio.length}
                </span>
                {!filtrando && <Icon name="chevron" className={`h-4 w-4 shrink-0 text-muted transition-transform ${abierto ? 'rotate-180' : ''}`} />}
              </button>
              {abierto && (
                <div className="grid gap-4 border-t border-line p-3 sm:p-4 md:grid-cols-2">
                  {semestres.map((sem) => (
                    <div key={sem}>
                      <h3 className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted">Semestre {sem}</h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                        {visibles.filter((m) => m.semestre === sem).map((m) => (
                          <MateriaCard key={m.id} materia={m} ev={evals[m.id]} datos={progress.estados[m.id]} porId={porId} onClick={() => onSelect(m.id)} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {!filtrando && (
        <Optativas catalogo={catalogoOptativas(plan)} optativas={progress.optativas} reglas={plan.reglas.optativas} setOptativa={setOptativa} />
      )}
    </div>
  );
}
