// Estadísticas del panel de avance. Funciones puras.
import { catalogoOptativas } from './plan.js';

const promedio = (notas) =>
  notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null;

/**
 * @param plan      contenido de plan.json
 * @param progress  { estados, optativas }
 * @param evals     resultado de evaluarPlan (para PPS)
 */
export function calcularStats(plan, progress, evals) {
  const { materias, reglas } = plan;
  const reglasOpt = reglas.optativas;

  const aprobadas = materias.filter((m) => progress.estados[m.id]?.estado === 'aprobada');
  const optAprobadas = Object.entries(progress.optativas);

  // Avance por cantidad de materias: las del plan + los "cupos" de optativas.
  const optContadas = Math.min(optAprobadas.length, reglasOpt.cantidad);
  const total = materias.length + reglasOpt.cantidad;
  const hechas = aprobadas.length + optContadas;

  // Promedios: materias + optativas con nota cargada.
  const conNota = [
    ...aprobadas.map((m) => progress.estados[m.id]),
    ...optAprobadas.map(([, d]) => d),
  ].filter((d) => typeof d.nota === 'number');
  const notas = (lista) => lista.map((d) => d.nota);

  // Restantes por año (las optativas no tienen año asignado: se informan aparte).
  const anios = [...new Set(materias.map((m) => m.anio))].sort((a, b) => a - b);
  const porAnio = anios.map((anio) => {
    const delAnio = materias.filter((m) => m.anio === anio);
    const ok = delAnio.filter((m) => progress.estados[m.id]?.estado === 'aprobada').length;
    return { anio, total: delAnio.length, aprobadas: ok, restantes: delAnio.length - ok };
  });

  // Horas: solo si TODAS las materias traen `horas` en el JSON. Si no, no se inventan.
  const hayHoras = materias.every((m) => typeof m.horas === 'number');
  const horas = hayHoras
    ? {
        total: materias.reduce((s, m) => s + m.horas, 0),
        aprobadas: aprobadas.reduce((s, m) => s + m.horas, 0),
      }
    : null;

  const pps = evals['00164'];
  return {
    total,
    hechas,
    aprobadas: aprobadas.length,
    porcentaje: (hechas / total) * 100,
    promedioConPromocion: promedio(notas(conNota)),
    promedioSinPromocion: promedio(notas(conNota.filter((d) => d.origen !== 'promocion'))),
    porAnio,
    optativas: {
      cantidad: optAprobadas.length,
      cantidadRequerida: reglasOpt.cantidad,
      puntos: optAprobadas.length * reglasOpt.puntos_por_optativa,
      puntosRequeridos: reglasOpt.puntos_requeridos,
      restantes: Math.max(0, reglasOpt.cantidad - optAprobadas.length),
      completo: optAprobadas.length * reglasOpt.puntos_por_optativa >= reglasOpt.puntos_requeridos,
      catalogo: catalogoOptativas(plan),
    },
    ingles: { aprobado: progress.estados['00807']?.estado === 'aprobada' },
    pps: pps && {
      estado: pps.estado,
      categoria: pps.categoria,
      faltaAprobar: pps.faltaAprobar,
      faltaRegularizar: pps.faltaRegularizar,
    },
    horas,
  };
}
