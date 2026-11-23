import { describe, it, expect } from 'vitest';
import { calcularStats } from '../stats.js';
import { evaluarPlan } from '../availability.js';
import { plan, inicial } from './helpers.js';

const stats = (progress) => calcularStats(plan, progress, evaluarPlan(plan.materias, progress.estados));

describe('estadísticas', () => {
  it('optativas: 25 puntos por optativa contra 100 requeridos', () => {
    const o = stats(inicial()).optativas;
    expect(o.puntos).toBe(25);
    expect(o.puntosRequeridos).toBe(100);
    expect(o.restantes).toBe(3);
    expect(o.completo).toBe(false);
  });
  it('4 optativas completan los 100 puntos', () => {
    const p = inicial();
    for (const id of ['00034', '00088', '00107']) p.optativas[id] = {};
    expect(stats(p).optativas).toMatchObject({ puntos: 100, completo: true, restantes: 0 });
  });
  it('promedios con y sin promociones (con datos mínimos)', () => {
    const p = inicial();
    for (const k of Object.keys(p.estados)) p.estados[k] = { estado: 'sin_cursar' };
    p.optativas = {};
    p.estados['00001'] = { estado: 'aprobada', nota: 6, origen: 'examen' };
    p.estados['00002'] = { estado: 'aprobada', nota: 10, origen: 'promocion' };
    const s = stats(p);
    expect(s.promedioConPromocion).toBe(8);
    expect(s.promedioSinPromocion).toBe(6);
  });
  it('sin notas, el promedio es null', () => {
    const p = inicial();
    for (const k of Object.keys(p.estados)) p.estados[k] = { estado: 'sin_cursar' };
    p.optativas = {};
    expect(stats(p).promedioConPromocion).toBeNull();
  });
  it('avance por cantidad de materias; sin horas en el JSON no se inventan', () => {
    const s = stats(inicial());
    expect(s.horas).toBeNull();
    expect(s.total).toBe(plan.materias.length + 4);
    expect(s.porAnio.reduce((a, y) => a + y.total, 0)).toBe(plan.materias.length);
  });
  it('si todas las materias traen `horas`, la app las usa', () => {
    const conHoras = { ...plan, materias: plan.materias.map((m) => ({ ...m, horas: 100 })) };
    const p = inicial();
    const s = calcularStats(conHoras, p, evaluarPlan(conHoras.materias, p.estados));
    expect(s.horas.total).toBe(100 * plan.materias.length);
  });
});
