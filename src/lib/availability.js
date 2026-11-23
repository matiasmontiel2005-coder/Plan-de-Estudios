// Lógica de disponibilidad de materias. Sin React: recibe datos y devuelve datos.
//
// `estados` es un objeto { [idMateria]: { estado, nota?, origen? } }.
// Estados posibles: aprobada | regularizada | en_curso | sin_cursar.

export const ID_INGLES = '00807';
export const SEMESTRE_CON_INGLES = 10; // desde acá se exige el B2 aprobado para inscribirse

export const esAprobada = (estado) => estado === 'aprobada';
// "Cursada" = regularizada o aprobada (en_curso todavía NO cuenta).
export const esCursada = (estado) => estado === 'regularizada' || estado === 'aprobada';

export const estadoDe = (estados, id) => estados[id]?.estado ?? 'sin_cursar';

/**
 * Evalúa una materia según los estados actuales.
 * Devuelve:
 *  - faltaAprobar:       previas de `cursar.aprobadas` que no están aprobadas
 *  - faltaRegularizar:   previas de `cursar.regularizadas` que no están ni regularizadas ni aprobadas
 *  - puedeCursar:        cumple las correlativas para cursar (sin mirar inglés)
 *  - faltaIngles:        es del 10.º semestre y el B2 no está aprobado
 *  - inscribible:        puedeCursar && !faltaIngles (lo que realmente permite inscribirse)
 *  - faltaAprobarParaRendir: previas de `rendir.aprobadas` no aprobadas
 *  - puedeRendir:        estaba regularizada o en curso y no falta ninguna previa para rendir
 *  - categoria:          aprobada | regularizada | en_curso | puede_cursar | bloqueada
 */
export function evaluarMateria(materia, estados) {
  const de = (id) => estadoDe(estados, id);
  const estado = de(materia.id);

  const faltaAprobar = materia.cursar.aprobadas.filter((id) => !esAprobada(de(id)));
  const faltaRegularizar = materia.cursar.regularizadas.filter((id) => !esCursada(de(id)));
  const puedeCursar = faltaAprobar.length === 0 && faltaRegularizar.length === 0;

  const faltaIngles =
    materia.semestre === SEMESTRE_CON_INGLES && !esAprobada(de(ID_INGLES));

  const faltaAprobarParaRendir = materia.rendir.aprobadas.filter((id) => !esAprobada(de(id)));
  const puedeRendir =
    (estado === 'regularizada' || estado === 'en_curso') && faltaAprobarParaRendir.length === 0;

  let categoria;
  if (estado !== 'sin_cursar') categoria = estado;
  else categoria = puedeCursar ? 'puede_cursar' : 'bloqueada';

  return {
    id: materia.id,
    estado,
    categoria,
    faltaAprobar,
    faltaRegularizar,
    puedeCursar,
    faltaIngles,
    inscribible: puedeCursar && !faltaIngles,
    faltaAprobarParaRendir,
    puedeRendir,
  };
}

/** Evalúa todas las materias. Devuelve { [id]: evaluacion }. */
export function evaluarPlan(materias, estados) {
  return Object.fromEntries(materias.map((m) => [m.id, evaluarMateria(m, estados)]));
}
