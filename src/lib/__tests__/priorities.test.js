import { describe, it, expect } from 'vitest';
import { materiasClave } from '../priorities.js';
import { plan, inicial } from './helpers.js';

describe('materias clave', () => {
  it('Perforación I es la que más destraba hoy (permite rendir 2 finales)', () => {
    const [primera] = materiasClave(plan.materias, inicial().estados);
    expect(primera.id).toBe('00059');
    expect(primera.rendibles.sort()).toEqual(['00063', '00073']);
  });
  it('no incluye materias aprobadas ni sin impacto', () => {
    const r = materiasClave(plan.materias, inicial().estados, 50);
    expect(r.every((x) => x.total > 0)).toBe(true);
    expect(r.map((x) => x.id)).not.toContain('00001');
  });
});
