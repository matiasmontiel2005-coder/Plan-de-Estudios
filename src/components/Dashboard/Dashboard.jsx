import { STATUS_META } from '../statusStyles.js';
import ProgressRing from '../ProgressRing.jsx';

const fmt = (n) => (n == null ? '—' : n.toFixed(2).replace('.', ','));

function Barra({ valor, color = 'bg-primary' }) {
  return (
    <div className="h-2.5 w-full overflow-hidden rounded-full bg-line">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, Math.max(0, valor))}%` }} />
    </div>
  );
}

const Tarjeta = ({ titulo, children }) => (
  <section className="rounded-xl border border-line bg-surface p-4">
    <h3 className="mb-2 text-sm font-semibold text-muted">{titulo}</h3>
    {children}
  </section>
);

const Grupo = ({ titulo, items, vacio }) => (
  <div>
    <p className="mb-1 font-semibold">{titulo}</p>
    {items.length ? <ul className="list-disc pl-5">{items.map((m) => <li key={m.id}>{m.nombre}</li>)}</ul> : <p className="text-muted">{vacio}</p>}
  </div>
);

/** Panel de avance. Recibe las estadísticas ya calculadas (lib/stats.js). */
export default function Dashboard({ plan, stats, evals, porId }) {
  const { optativas: o, pps, ingles, horas } = stats;
  const nombres = (ids) => ids.map((i) => porId[i]?.nombre ?? i).join(', ');
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <Tarjeta titulo="Avance de la carrera">
          <div className="flex items-center gap-4">
            <ProgressRing value={stats.porcentaje} size={96} stroke={10}>
              <span className="text-lg">{stats.porcentaje.toFixed(0)}%</span>
            </ProgressRing>
            <div>
              <p className="text-3xl font-extrabold">{stats.porcentaje.toFixed(1).replace('.', ',')}%</p>
              <p className="text-sm text-muted">
                {stats.hechas} de {stats.total} materias aprobadas (incluye {o.cantidadRequerida} optativas).
              </p>
            </div>
          </div>
          {horas ? (
            <p className="mt-3 text-sm">Horas: {horas.aprobadas} / {horas.total} ({((horas.aprobadas / horas.total) * 100).toFixed(1)}%)</p>
          ) : (
            <p className="mt-3 text-xs text-muted">
              El plan no trae horas por materia, por eso el avance se mide por cantidad de materias.
              Si agregás un campo <code>horas</code> a cada materia en <code>data/plan.json</code>, se mostrará también el avance por horas.
            </p>
          )}
        </Tarjeta>
      </div>

      <div className="md:col-span-2">
        <Tarjeta titulo="Ahora podés">
          <div className="grid gap-4 text-sm sm:grid-cols-3">
            <Grupo titulo="Cursar" items={plan.materias.filter((m) => evals[m.id].estado === 'sin_cursar' && evals[m.id].inscribible)} vacio="Nada nuevo por ahora." />
            <Grupo titulo="Cumplen correlativas, falta inglés B2" items={plan.materias.filter((m) => evals[m.id].estado === 'sin_cursar' && evals[m.id].puedeCursar && evals[m.id].faltaIngles)} vacio="—" />
            <Grupo titulo="Rendir el final" items={plan.materias.filter((m) => evals[m.id].puedeRendir)} vacio="Ninguna por ahora." />
          </div>
        </Tarjeta>
      </div>

      <Tarjeta titulo="Promedio">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div><p className="text-3xl font-bold">{fmt(stats.promedioConPromocion)}</p><p className="text-xs text-muted">con promociones</p></div>
          <div><p className="text-3xl font-bold">{fmt(stats.promedioSinPromocion)}</p><p className="text-xs text-muted">sin promociones</p></div>
        </div>
      </Tarjeta>

      <Tarjeta titulo="Optativas">
        <p className="text-2xl font-bold">{o.puntos}/{o.puntosRequeridos} <span className="text-sm font-normal text-muted">puntos</span></p>
        <Barra valor={(o.puntos / o.puntosRequeridos) * 100} color="bg-brand-500" />
        <p className="mt-2 text-sm">{o.cantidad} de {o.cantidadRequerida} aprobadas · {o.restantes > 0 ? `faltan ${o.restantes}` : 'completas ✔'}</p>
      </Tarjeta>

      <Tarjeta titulo="Inglés (examen B2)">
        <p className={`font-semibold ${ingles.aprobado ? 'text-primary' : 'text-amber-600'}`}>{ingles.aprobado ? '✔ Aprobado' : 'Pendiente'}</p>
        {!ingles.aprobado && <p className="text-sm text-muted">Es obligatorio para inscribirte a las materias del 10.º semestre.</p>}
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
                <Barra valor={(a.aprobadas / a.total) * 100} color="bg-brand-500" />
              </li>
            ))}
            <li className="text-sm text-muted">Optativas restantes: {o.restantes}</li>
          </ul>
        </Tarjeta>
      </div>
    </div>
  );
}
