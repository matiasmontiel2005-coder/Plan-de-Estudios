// "Materias clave": las que más destraban si las aprobás.
import { simular } from './simulator.js';

/**
 * Para cada materia no aprobada simula aprobarla y cuenta cuántas materias
 * nuevas se pueden cursar o rendir. Devuelve las `n` con mayor impacto (>0).
 * @returns [{ id, total, cursables: [ids], rendibles: [ids] }]
 */
export function materiasClave(materias, estados, n = 3) {
  return materias
    .filter((m) => (estados[m.id]?.estado ?? 'sin_cursar') !== 'aprobada')
    .map((m) => {
      const r = simular(materias, estados, m.id, 'aprobada');
      const cursables = r.nuevasCursables.map((x) => x.id);
      const rendibles = r.nuevasRendibles.map((x) => x.id);
      return { id: m.id, semestre: m.semestre, total: cursables.length + rendibles.length, cursables, rendibles };
    })
    .filter((x) => x.total > 0)
    // Más impacto primero; a igualdad, la del semestre más temprano.
    .sort((a, b) => b.total - a.total || a.semestre - b.semestre)
    .slice(0, n);
}
