// Utilidades para leer data/plan.json (no modifican los datos).

/** Devuelve un objeto { id: materia } para buscar rápido por id. */
export const indexarPorId = (materias) =>
  Object.fromEntries(materias.map((m) => [m.id, m]));

/** "Gestión Ambiental (00088)" -> { id: "00088", nombre: "Gestión Ambiental" } */
export function parseOptativaDisponible(texto) {
  const m = texto.match(/^(.*?)\s*\((\d+)\)\s*$/);
  return m ? { id: m[2], nombre: m[1].trim() } : null;
}

/** "Operaciones Mineras (02089) - nota 9, promoción" -> { id, nota, origen } */
export function parseOptativaAprobada(texto) {
  const id = texto.match(/\((\d+)\)/)?.[1];
  if (!id) return null;
  const nota = texto.match(/nota\s+(\d+(?:[.,]\d+)?)/i)?.[1];
  const origen = /promoci/i.test(texto) ? 'promocion' : /examen/i.test(texto) ? 'examen' : undefined;
  return { id, nota: nota ? Number(nota.replace(',', '.')) : undefined, origen };
}

/** Catálogo de optativas: [{ id, nombre }]. */
export const catalogoOptativas = (plan) =>
  plan.optativas_disponibles.map(parseOptativaDisponible).filter(Boolean);
