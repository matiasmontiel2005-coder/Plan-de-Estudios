import { describe, it, expect } from 'vitest';
import { validarPlanificacion } from '../planner.js';
import { plan, inicial } from './helpers.js';

const validar = (ids) => validarPlanificacion(plan.materias, inicial().estados, ids);
const nivel = (res, id) => res.find((r) => r.id === id).nivel;

describe('planificador', () => {
  it('Legislación está habilitada', () => {
    expect(nivel(validar(['00805']), '00805')).toBe('ok');
  });
  it('Instrumentación sin inglés en el plan: error', () => {
    expect(nivel(validar(['00023']), '00023')).toBe('error');
  });
  it('Instrumentación con el examen de inglés en el plan: aviso', () => {
    expect(nivel(validar(['00023', '00807']), '00023')).toBe('aviso');
  });
  it('Informática Aplicada: error por falta regularizar Administración de Operaciones', () => {
    const [r] = validar(['00113']);
    expect(r.nivel).toBe('error');
    expect(r.motivos.join(' ')).toMatch(/regularizar.*Administración de Operaciones/);
  });
  it('una materia ya aprobada es un error', () => {
    expect(nivel(validar(['00001']), '00001')).toBe('error');
  });
});
