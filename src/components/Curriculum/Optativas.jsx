import { useState } from 'react';
import Icon from '../Icon.jsx';
import { Bar } from '../ui.jsx';

// Optativas: se marcan como aprobadas para sumar puntos (25 c/u).
export default function Optativas({ catalogo, optativas, reglas, setOptativa }) {
  const [verTodas, setVerTodas] = useState(false);
  const cantidad = Object.keys(optativas).length;
  const puntos = cantidad * reglas.puntos_por_optativa;
  // Primero las aprobadas; el resto se despliega a pedido.
  const ordenadas = [...catalogo].sort((a, b) => Number(!!optativas[b.id]) - Number(!!optativas[a.id]));
  const lista = verTodas ? ordenadas : ordenadas.filter((o) => optativas[o.id]);

  return (
    <section className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-bold"><Icon name="star" className="h-4 w-4 text-primary" />Optativas</h2>
          <p className="mt-0.5 text-xs text-muted">
            {reglas.cantidad} de {reglas.puntos_por_optativa} puntos · desde el {reglas.desde_semestre}.º semestre. El plan no informa sus correlativas.
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums">{puntos}<span className="text-muted">/{reglas.puntos_requeridos} pts</span></p>
      </div>
      <div className="mt-3"><Bar valor={(puntos / reglas.puntos_requeridos) * 100} className="bg-brand-500" /></div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((o) => {
          const d = optativas[o.id];
          return (
            <li key={o.id} className={`rounded-xl border p-3 text-sm transition ${d ? 'border-primary bg-surface' : 'border-line'}`}>
              <label className="flex cursor-pointer items-start gap-2.5 font-medium">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#166534]" checked={!!d}
                  onChange={(e) => setOptativa(o.id, e.target.checked ? { origen: 'examen' } : null)} />
                <span>{o.nombre} <span className="text-xs font-normal text-muted">({o.id})</span></span>
              </label>
              {d && (
                <div className="mt-2 flex gap-2 pl-6">
                  <input type="number" min="0" max="10" step="any" placeholder="Nota" aria-label={`Nota de ${o.nombre}`} value={d.nota ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      const { nota, ...resto } = d; // eslint-disable-line no-unused-vars
                      setOptativa(o.id, v === '' ? resto : { ...resto, nota: Math.min(10, Math.max(0, Number(v))) });
                    }}
                    className="w-20 rounded-lg border border-line2 bg-surface px-2 py-1 tabular-nums" />
                  <select value={d.origen ?? 'examen'} aria-label={`Origen de ${o.nombre}`} onChange={(e) => setOptativa(o.id, { ...d, origen: e.target.value })}
                    className="rounded-lg border border-line2 bg-surface px-2 py-1">
                    <option value="examen">Examen</option>
                    <option value="promocion">Promoción</option>
                  </select>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <button onClick={() => setVerTodas(!verTodas)} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary">
        {verTodas ? 'Mostrar solo aprobadas' : `Ver las ${catalogo.length} optativas`}
        <Icon name="chevron" className={`h-4 w-4 transition-transform ${verTodas ? 'rotate-180' : ''}`} />
      </button>
    </section>
  );
}
