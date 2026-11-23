import { STATUS_META } from '../statusStyles.js';

const fmt = (n) => (n == null ? '—' : n.toFixed(2).replace('.', ','));

function Barra({ valor, color = 'bg-indigo-600' }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, valor))}%` }} />
    </div>
  );
}

const Tarjeta = ({ titulo, children }) => (
  <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
    <h3 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{titulo}</h3>
    {children}
  </section>
);

/** Panel de avance. Recibe las estadísticas ya calculadas (lib/stats.js). */
export default function Dashboard({ stats, porId }) {
  const { optativas: o, pps, ingles, horas } = stats;
  const nombres = (ids) => ids.map((i) => porId[i]?.nombre ?? i).join(', ');
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Tarjeta titulo="Avance de la carrera">
          <p className="text-4xl font-extrabold">{stats.porcentaje.toFixed(1).replace('.', ',')}%</p>
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">
            {stats.hechas} de {stats.total} materias aprobadas (incluye {o.cantidadRequerida} optativas).
          </p>
          <Barra valor={stats.porcentaje} />
          {horas ? (
            <p className="mt-3 text-sm">Horas: {horas.aprobadas} / {horas.total} ({((horas.aprobadas / horas.total) * 100).toFixed(1)}%)</p>
          ) : (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              El plan no trae horas por materia, por eso el avance se mide por cantidad de materias.
              Si agregás un campo <code>horas</code> a cada materia en <code>data/plan.json</code>, se mostrará también el avance por horas.
            </p>
          )}
        </Tarjeta>
      </div>

      <Tarjeta titulo="Promedio">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div><p className="text-3xl font-bold">{fmt(stats.promedioConPromocion)}</p><p className="text-xs text-slate-500">con promociones</p></div>
          <div><p className="text-3xl font-bold">{fmt(stats.promedioSinPromocion)}</p><p className="text-xs text-slate-500">sin promociones</p></div>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Optativas">
        <p className="text-2xl font-bold">{o.puntos}/{o.puntosRequeridos} <span className="text-sm font-normal text-slate-500">puntos</span></p>
        <Barra valor={(o.puntos / o.puntosRequeridos) * 100} color="bg-emerald-600" />
        <p className="mt-2 text-sm">{o.cantidad} de {o.cantidadRequerida} aprobadas · {o.restantes > 0 ? `faltan ${o.restantes}` : 'completas ✔'}</p>
      </Tarjeta>

      <Tarjeta titulo="Inglés (examen B2)">
        <p className={`font-semibold ${ingles.aprobado ? 'text-green-600' : 'text-amber-600'}`}>{ingles.aprobado ? '✔ Aprobado' : 'Pendiente'}</p>
        {!ingles.aprobado && <p className="text-sm text-slate-600 dark:text-slate-300">Es obligatorio para inscribirte a las materias del 10.º semestre.</p>}
      </Tarjeta>

      <Tarjeta titulo="Práctica Profesional Supervisada (300 h)">
        {pps && (
          <div className="space-y-1 text-sm">
            <p className="font-semibold">{STATUS_META[pps.categoria].label}</p>
            {pps.categoria === 'bloqueada' && (
              <>
                {pps.faltaAprobar.length > 0 && <p><b>Falta aprobar:</b> {nombres(pps.faltaAprobar)}</p>}
                {pps.faltaRegularizar.length > 0 && <p><b>Falta regularizar:</b> {nombres(pps.faltaRegularizar)}</p>}
              </>
            )}
          </div>
        )}
      </Tarjeta>

      <div className="md:col-span-2">
        <Tarjeta titulo="Materias restantes por año">
          <ul className="space-y-2">
            {stats.porAnio.map((a) => (
              <li key={a.anio} className="text-sm">
                <div className="mb-0.5 flex justify-between"><span>{a.anio}.º año</span><span>{a.aprobadas}/{a.total} · restan {a.restantes}</span></div>
                <Barra valor={(a.aprobadas / a.total) * 100} color="bg-green-600" />
              </li>
            ))}
            <li className="text-sm text-slate-600 dark:text-slate-300">Optativas restantes: {o.restantes}</li>
          </ul>
        </Tarjeta>
      </div>
    </div>
  );
}
