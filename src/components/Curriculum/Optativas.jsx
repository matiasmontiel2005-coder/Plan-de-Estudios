import { useState } from 'react';
import Icon from '../Icon.jsx';
import OptativaDialog from './OptativaDialog.jsx';

/**
 * Optativas: un "casillero" por cada optativa requerida (4 × 25 pts).
 * Las aprobadas se muestran como tarjetas; los casilleros vacíos permiten agregar.
 */
export default function Optativas({ catalogo, optativas, reglas, setOptativa, quitarOptativa }) {
  const [dialogo, setDialogo] = useState(undefined); // undefined = cerrado, null = agregar, id = editar
  const porId = Object.fromEntries(catalogo.map((o) => [o.id, o]));
  const aprobadas = Object.keys(optativas);
  const puntos = aprobadas.length * reglas.puntos_por_optativa;
  const vacios = Math.max(0, reglas.cantidad - aprobadas.length);
  const completo = puntos >= reglas.puntos_requeridos;

  return (
    <section className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold">Optativas</h2>
          <p className="mt-0.5 text-sm text-muted">
            {reglas.cantidad} optativas de {reglas.puntos_por_optativa} puntos · desde el {reglas.desde_semestre}.º semestre
          </p>
        </div>
        <p className="shrink-0 text-right">
          <span className="text-2xl font-bold tabular-nums">{puntos}</span>
          <span className="text-sm text-muted tabular-nums">/{reglas.puntos_requeridos} pts</span>
        </p>
      </div>

      {/* Progreso por segmentos: uno por optativa requerida */}
      <div className="mt-3 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${reglas.cantidad}, minmax(0, 1fr))` }}
        role="progressbar" aria-valuenow={puntos} aria-valuemin={0} aria-valuemax={reglas.puntos_requeridos} aria-label="Puntos de optativas">
        {Array.from({ length: reglas.cantidad }, (_, i) => (
          <span key={i} className={`h-1.5 rounded-full ${i < aprobadas.length ? 'bg-primary' : 'bg-tint'}`} />
        ))}
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {aprobadas.map((id) => {
          const d = optativas[id];
          return (
            <li key={id}>
              <button type="button" onClick={() => setDialogo(id)} aria-label={`${porId[id]?.nombre}: aprobada. Tocar para editar.`}
                className="relative flex h-full min-h-[76px] w-full flex-col sm:min-h-[92px] overflow-hidden rounded-xl border border-line bg-surface py-2.5 pl-4 pr-3 text-left transition hover:-translate-y-0.5 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <span className="absolute inset-y-0 left-0 w-1 bg-brand-500" aria-hidden="true" />
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[13px] font-semibold leading-snug">{porId[id]?.nombre ?? id}</span>
                  {d.nota != null && (
                    <span className="shrink-0 text-right">
                      <span className="block text-lg font-bold leading-none tabular-nums">{d.nota}</span>
                      {d.origen === 'promocion' && <span className="mt-0.5 block whitespace-nowrap text-[10px] font-medium leading-none text-muted">Promocionado</span>}
                    </span>
                  )}
                </div>
                <span className="mt-auto inline-flex items-center gap-1 pt-1.5 text-[11px] font-medium text-brand-800 dark:text-brand-300">
                  <Icon name="check" className="h-3.5 w-3.5" />Aprobada · +{reglas.puntos_por_optativa} pts
                </span>
              </button>
            </li>
          );
        })}
        {Array.from({ length: vacios }, (_, i) => (
          <li key={`vacio-${i}`}>
            <button type="button" onClick={() => setDialogo(null)}
              className="flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-dashed sm:min-h-[92px] sm:flex-col sm:gap-1 border-line2 text-sm text-muted transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-tint text-lg leading-none">+</span>
              Agregar optativa {aprobadas.length + i + 1}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>{completo ? 'Requisito de optativas cumplido.' : `Te faltan ${vacios} · El plan no informa sus correlativas.`}</span>
        {completo && <button onClick={() => setDialogo(null)} className="font-semibold text-primary">+ Agregar otra</button>}
      </div>

      {dialogo !== undefined && (
        <OptativaDialog key={dialogo ?? 'nueva'} id={dialogo} catalogo={catalogo} optativas={optativas}
          onSave={setOptativa} onRemove={quitarOptativa} onClose={() => setDialogo(undefined)} />
      )}
    </section>
  );
}
