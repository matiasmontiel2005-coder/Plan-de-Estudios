import Icon from '../Icon.jsx';
import { Bar, Card, CardTitle, PageHeader } from '../ui.jsx';

const fmt = (n, d = 2) => (n == null ? '—' : n.toFixed(d).replace('.', ','));

/** Indicador principal (número grande + contexto). */
function Kpi({ titulo, valor, sufijo, detalle, children }) {
  return (
    <Card className="flex flex-col">
      <CardTitle>{titulo}</CardTitle>
      <p className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
        {valor}{sufijo && <span className="ml-0.5 text-lg font-semibold text-muted">{sufijo}</span>}
      </p>
      {detalle && <p className="mt-1 text-xs text-muted">{detalle}</p>}
      {children && <div className="mt-auto pt-3">{children}</div>}
    </Card>
  );
}

/** Lista de materias con ícono, para el bloque "Ahora podés". */
function Grupo({ titulo, icono, tono, items, vacio }) {
  return (
    <div>
      <p className={`mb-2 flex items-center gap-1.5 text-sm font-semibold ${tono}`}><Icon name={icono} className="h-4 w-4" />{titulo}<span className="text-muted">· {items.length}</span></p>
      {items.length ? (
        <ul className="space-y-1.5">{items.map((m) => <li key={m.id} className="rounded-lg bg-tint px-3 py-2 text-sm">{m.nombre}</li>)}</ul>
      ) : <p className="rounded-lg border border-dashed border-line2 px-3 py-2 text-sm text-muted">{vacio}</p>}
    </div>
  );
}

function Requisito({ ok, icono, titulo, children }) {
  return (
    <li className="flex gap-3">
      <span className={`mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ok ? 'bg-primary text-onprimary' : 'bg-tint text-muted'}`}>
        <Icon name={ok ? 'check' : icono} className="h-4 w-4" />
      </span>
      <div className="text-sm">
        <p className="font-semibold">{titulo} <span className={`ml-1 text-xs font-medium ${ok ? 'text-primary' : 'text-amber-700 dark:text-amber-300'}`}>{ok ? 'Cumplido' : 'Pendiente'}</span></p>
        <div className="text-muted">{children}</div>
      </div>
    </li>
  );
}

/** Panel de avance. Recibe datos ya calculados (lib/stats.js y lib/priorities.js). */
export default function Dashboard({ plan, stats, evals, porId, clave }) {
  const { optativas: o, pps, ingles, horas } = stats;
  const nombres = (ids) => ids.map((i) => porId[i]?.nombre ?? i).join(', ');
  const restan = stats.total - stats.hechas;
  const sinCursar = (m) => evals[m.id].estado === 'sin_cursar';
  const cursar = plan.materias.filter((m) => sinCursar(m) && evals[m.id].inscribible);
  const porIngles = plan.materias.filter((m) => sinCursar(m) && evals[m.id].puedeCursar && evals[m.id].faltaIngles);
  const rendir = plan.materias.filter((m) => evals[m.id].puedeRendir);
  const top = clave[0];

  return (
    <div>
      {/* Titular con la conclusión, no solo el tema */}
      <PageHeader
        titulo={`Llevás el ${stats.porcentaje.toFixed(0)}% de la carrera`}
        descripcion={top
          ? `Te faltan ${restan} materias. Tu materia clave es ${porId[top.id].nombre}: aprobarla destraba ${top.total} ${top.total === 1 ? 'materia' : 'materias'}.`
          : `Te faltan ${restan} materias.`} />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi titulo="Avance" valor={fmt(stats.porcentaje, 1)} sufijo="%" detalle={`${stats.hechas} de ${stats.total} materias`}>
          <Bar valor={stats.porcentaje} />
        </Kpi>
        <Kpi titulo="Promedio" valor={fmt(stats.promedioConPromocion)} detalle={`Sin promociones: ${fmt(stats.promedioSinPromocion)}`} />
        <Kpi titulo="Restan" valor={restan} detalle={`${o.restantes} son optativas`} />
        <Kpi titulo="Optativas" valor={o.puntos} sufijo={`/${o.puntosRequeridos}`} detalle={`${o.cantidad} de ${o.cantidadRequerida} aprobadas`}>
          <Bar valor={(o.puntos / o.puntosRequeridos) * 100} className="bg-brand-500" />
        </Kpi>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle>Ahora podés</CardTitle>
          <div className="grid gap-5 sm:grid-cols-3">
            <Grupo titulo="Cursar" icono="arrow" tono="text-blue-700 dark:text-blue-300" items={cursar} vacio="Nada nuevo por ahora." />
            <Grupo titulo="Rendir" icono="pen" tono="text-primary" items={rendir} vacio="Ningún final por ahora." />
            <Grupo titulo="Falta inglés" icono="globe" tono="text-amber-700 dark:text-amber-300" items={porIngles} vacio="Nada espera el B2." />
          </div>
        </Card>

        <Card>
          <CardTitle>Materias clave</CardTitle>
          {clave.length ? (
            <ol className="space-y-3">
              {clave.map((c, i) => (
                <li key={c.id} className="flex gap-3">
                  <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-tint text-sm font-bold tabular-nums">{i + 1}</span>
                  <div className="text-sm">
                    <p className="font-semibold">{porId[c.id].nombre}</p>
                    <p className="text-muted">
                      Destraba {c.total}: {nombres([...c.cursables, ...c.rendibles])}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          ) : <p className="text-sm text-muted">No hay materias que destraben otras.</p>}
        </Card>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardTitle aside="aprobadas / total">Avance por año</CardTitle>
          <ul className="space-y-3">
            {stats.porAnio.map((a) => (
              <li key={a.anio} className="grid grid-cols-[4.5rem_1fr_3.5rem] items-center gap-3 text-sm">
                <span className="font-medium">{a.anio}.º año</span>
                <Bar valor={(a.aprobadas / a.total) * 100} className={a.restantes === 0 ? 'bg-brand-500' : 'bg-primary'} alto="h-2.5" />
                <span className="text-right tabular-nums text-muted">{a.aprobadas}/{a.total}</span>
              </li>
            ))}
          </ul>
          {horas ? (
            <p className="mt-4 text-sm">Horas: {horas.aprobadas} / {horas.total} ({((horas.aprobadas / horas.total) * 100).toFixed(1)}%)</p>
          ) : (
            <p className="mt-4 text-xs text-muted">Avance por cantidad de materias: el plan no trae horas. Si agregás <code>horas</code> a cada materia en <code>data/plan.json</code>, se suma el avance por horas.</p>
          )}
        </Card>

        <Card>
          <CardTitle>Requisitos de egreso</CardTitle>
          <ul className="space-y-4">
            <Requisito ok={ingles.aprobado} icono="globe" titulo="Inglés B2">
              {ingles.aprobado ? 'Aprobado.' : 'Necesario para inscribirte al 10.º semestre.'}
            </Requisito>
            <Requisito ok={o.completo} icono="star" titulo="Optativas">
              {o.puntos}/{o.puntosRequeridos} puntos.
            </Requisito>
            <Requisito ok={pps?.estado === 'aprobada'} icono="briefcase" titulo="PPS (300 h)">
              {pps?.categoria === 'bloqueada' ? (
                <>
                  {pps.faltaAprobar.length > 0 && <span className="block">Falta aprobar: {nombres(pps.faltaAprobar)}.</span>}
                  {pps.faltaRegularizar.length > 0 && <span className="block">Falta regularizar: {nombres(pps.faltaRegularizar)}.</span>}
                </>
              ) : pps?.estado === 'aprobada' ? 'Aprobada.' : 'Habilitada.'}
            </Requisito>
          </ul>
        </Card>
      </div>
    </div>
  );
}
