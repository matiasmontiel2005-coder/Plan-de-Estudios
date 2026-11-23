import plan from '../../../data/plan.json';
import { progresoInicial } from '../progress.js';
import { evaluarPlan } from '../availability.js';

export { plan };
export const inicial = () => progresoInicial(plan);
export const evalInicial = () => evaluarPlan(plan.materias, inicial().estados);
/** Copia del estado inicial con cambios puntuales. */
export const conEstados = (cambios) => {
  const p = inicial();
  for (const [id, estado] of Object.entries(cambios)) p.estados[id] = { estado };
  return p.estados;
};
