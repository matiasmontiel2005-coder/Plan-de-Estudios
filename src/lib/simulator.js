// Simulador "¿y si apruebo X?": calcula el efecto sin tocar el estado guardado.
import { evaluarPlan } from './availability.js';

/**
 * @param nuevoEstado 'aprobada' | 'regularizada'
 * @returns {
 *   objetivo:        evaluación actual de la materia simulada,
 *   nuevasCursables: materias sin cursar que pasan a poder inscribirse,
 *   nuevasRendibles: materias que pasan a poder rendirse
 * }
 */
export function simular(materias, estados, id, nuevoEstado = 'aprobada') {
  const antes = evaluarPlan(materias, estados);
  // Copia: el objeto original no se modifica.
  const hipotetico = { ...estados, [id]: { estado: nuevoEstado } };
  const despues = evaluarPlan(materias, hipotetico);

  const nuevasCursables = materias.filter(
    (m) =>
      m.id !== id &&
      antes[m.id].estado === 'sin_cursar' &&
      !antes[m.id].inscribible &&
      despues[m.id].inscribible,
  );
  const nuevasRendibles = materias.filter(
    (m) => m.id !== id && !antes[m.id].puedeRendir && despues[m.id].puedeRendir,
  );
  return { objetivo: antes[id], nuevasCursables, nuevasRendibles };
}
