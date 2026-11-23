// Estado del usuario: valores iniciales (desde plan.json), exportar e importar.
import { parseOptativaAprobada, catalogoOptativas } from './plan.js';

export const STORAGE_KEY = 'plan-petroleos-02-16:progreso:v1';
export const ESTADOS = ['sin_cursar', 'en_curso', 'regularizada', 'aprobada'];
export const ORIGENES = ['examen', 'promocion'];

/** Estado inicial: lo que dice plan.json. */
export function progresoInicial(plan) {
  const estados = {};
  for (const m of plan.materias) {
    estados[m.id] = { estado: m.estado };
    if (m.estado === 'aprobada') {
      if (m.nota != null) estados[m.id].nota = m.nota;
      if (m.origen) estados[m.id].origen = m.origen;
    }
  }
  const optativas = {};
  for (const texto of plan.reglas.optativas.aprobadas ?? []) {
    const o = parseOptativaAprobada(texto);
    if (!o) continue;
    optativas[o.id] = {};
    if (o.nota != null) optativas[o.id].nota = o.nota;
    if (o.origen) optativas[o.id].origen = o.origen;
  }
  return { estados, optativas, planificador: [] };
}

/** Arma el JSON que se descarga. */
export function exportarProgreso(plan, progress) {
  return {
    version: 1,
    plan: plan.plan,
    carrera: plan.carrera,
    exportado: new Date().toISOString(),
    estados: progress.estados,
    optativas: progress.optativas,
    planificador: progress.planificador,
  };
}

/** Valida una nota (número de 0 a 10) o la deja sin cargar. */
const notaValida = (n) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 10;

/**
 * Valida y normaliza un progreso importado (objeto o texto JSON).
 * Lanza Error con todos los problemas encontrados si algo no cierra.
 */
export function importarProgreso(plan, entrada) {
  let data = entrada;
  if (typeof entrada === 'string') {
    try { data = JSON.parse(entrada); } catch { throw new Error('El archivo no es un JSON válido.'); }
  }
  const errores = [];
  if (!data || typeof data !== 'object') throw new Error('Formato de progreso inválido.');
  if (data.plan && data.plan !== plan.plan) errores.push(`El archivo es del plan ${data.plan}, no del ${plan.plan}.`);

  const ids = new Set(plan.materias.map((m) => m.id));
  const estados = {};
  for (const m of plan.materias) estados[m.id] = { estado: 'sin_cursar' };

  for (const [id, d] of Object.entries(data.estados ?? {})) {
    if (!ids.has(id)) { errores.push(`Materia desconocida: ${id}.`); continue; }
    if (!ESTADOS.includes(d?.estado)) { errores.push(`Estado inválido en ${id}.`); continue; }
    const item = { estado: d.estado };
    if (d.estado === 'aprobada') {
      if (d.nota != null) notaValida(d.nota) ? (item.nota = d.nota) : errores.push(`Nota inválida en ${id}.`);
      if (d.origen != null) ORIGENES.includes(d.origen) ? (item.origen = d.origen) : errores.push(`Origen inválido en ${id}.`);
    }
    estados[id] = item;
  }

  const catalogo = new Set(catalogoOptativas(plan).map((o) => o.id));
  const optativas = {};
  for (const [id, d] of Object.entries(data.optativas ?? {})) {
    if (!catalogo.has(id)) { errores.push(`Optativa desconocida: ${id}.`); continue; }
    const item = {};
    if (d?.nota != null) notaValida(d.nota) ? (item.nota = d.nota) : errores.push(`Nota inválida en optativa ${id}.`);
    if (d?.origen != null) ORIGENES.includes(d.origen) ? (item.origen = d.origen) : errores.push(`Origen inválido en optativa ${id}.`);
    optativas[id] = item;
  }

  const planificador = Array.isArray(data.planificador) ? data.planificador.filter((id) => ids.has(id)) : [];
  if (errores.length) throw new Error(errores.join('\n'));
  return { estados, optativas, planificador };
}
