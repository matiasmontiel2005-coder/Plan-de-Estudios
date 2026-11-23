import { describe, it, expect } from 'vitest';
import { exportarProgreso, importarProgreso } from '../progress.js';
import { plan, inicial } from './helpers.js';

describe('progreso', () => {
  it('el estado inicial toma las optativas aprobadas de plan.json', () => {
    expect(inicial().optativas).toEqual({ '02089': { nota: 9, origen: 'promocion' } });
  });
  it('exportar e importar conserva todo', () => {
    const p = inicial();
    expect(importarProgreso(plan, JSON.stringify(exportarProgreso(plan, p)))).toEqual(p);
  });
  it('rechaza JSON roto, materias desconocidas, estados y notas inválidos', () => {
    expect(() => importarProgreso(plan, '{no es json')).toThrow(/JSON/);
    expect(() => importarProgreso(plan, { estados: { 99999: { estado: 'aprobada' } } })).toThrow(/desconocida/);
    expect(() => importarProgreso(plan, { estados: { '00001': { estado: 'xx' } } })).toThrow(/Estado inválido/);
    expect(() => importarProgreso(plan, { estados: { '00001': { estado: 'aprobada', nota: 11 } } })).toThrow(/Nota inválida/);
  });
});
