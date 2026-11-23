// Planificador de cuatrimestre: valida que las materias elegidas estén habilitadas.
import { evaluarMateria, ID_INGLES } from './availability.js';

/**
 * Para cada id elegido devuelve { id, nivel, motivos }.
 *  nivel: 'ok' | 'aviso' | 'error'
 * Las correlativas se miran contra el estado ACTUAL: lo que se cursa en el mismo
 * cuatrimestre no alcanza para habilitar otra materia.
 */
export function validarPlanificacion(materias, estados, idsElegidos) {
  const porId = Object.fromEntries(materias.map((m) => [m.id, m]));
  const elegidos = new Set(idsElegidos);

  return idsElegidos.filter((id) => porId[id]).map((id) => {
    const m = porId[id];
    const ev = evaluarMateria(m, estados);
    const motivos = [];
    let nivel = 'ok';
    const marcar = (n) => { if (n === 'error' || nivel === 'ok') nivel = n; };
    const nombre = (i) => porId[i]?.nombre ?? i;
    const lista = (ids) => ids.map((i) => nombre(i) + (elegidos.has(i) ? ' (la planificás en este cuatrimestre)' : '')).join(', ');

    if (ev.estado === 'aprobada') { motivos.push('Ya está aprobada.'); marcar('error'); }
    else if (ev.estado === 'regularizada') { motivos.push('Ya está regularizada: te falta rendir el final.'); marcar('aviso'); }
    else if (ev.estado === 'en_curso') { motivos.push('Ya la estás cursando.'); marcar('aviso'); }

    if (ev.estado === 'sin_cursar') {
      if (ev.faltaAprobar.length) { motivos.push(`Falta aprobar: ${lista(ev.faltaAprobar)}.`); marcar('error'); }
      if (ev.faltaRegularizar.length) { motivos.push(`Falta regularizar: ${lista(ev.faltaRegularizar)}.`); marcar('error'); }
      if (ev.faltaIngles) {
        // Si el examen B2 está en el mismo plan, es un aviso: tiene que aprobarse antes de inscribirse.
        if (elegidos.has(ID_INGLES)) { motivos.push('Necesitás aprobar el examen de inglés B2 antes de inscribirte.'); marcar('aviso'); }
        else { motivos.push('Falta aprobar el examen de inglés B2 para inscribirte a materias del 10.º semestre.'); marcar('error'); }
      }
    }
    return { id, nivel, motivos };
  });
}
