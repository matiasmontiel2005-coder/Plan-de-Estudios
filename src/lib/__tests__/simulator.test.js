import { describe, it, expect } from 'vitest';
import { simular } from '../simulator.js';
import { plan, inicial } from './helpers.js';

const run = (id, estado) => simular(plan.materias, inicial().estados, id, estado);
const ids = (l) => l.map((m) => m.id).sort();

describe('simulador', () => {
  it('regularizar Administración de Operaciones habilita Informática Aplicada', () => {
    expect(ids(run('00804', 'regularizada').nuevasCursables)).toEqual(['00113']);
  });
  it('Administración de Proyectos cumple correlativas pero sigue sin poder inscribirse sin inglés', () => {
    const e = simular(plan.materias, { ...inicial().estados, '00804': { estado: 'regularizada' } }, '00804', 'regularizada');
    expect(e.nuevasCursables.map((m) => m.id)).not.toContain('00806');
  });
  it('aprobar el examen de inglés habilita Instrumentación (10.º semestre)', () => {
    expect(ids(run('00807', 'aprobada').nuevasCursables)).toEqual(['00023']);
  });
  it('aprobar Perforación I permite rendir Perforación II y Aguas Subterráneas', () => {
    const r = run('00059', 'aprobada');
    expect(ids(r.nuevasRendibles)).toEqual(['00063', '00073']);
    // Producción I sigue bloqueada: también pide Reservorios II regularizada.
    expect(ids(r.nuevasCursables)).not.toContain('00120');
  });
  it('no modifica el estado original', () => {
    const estados = inicial().estados;
    const copia = JSON.stringify(estados);
    simular(plan.materias, estados, '00804', 'aprobada');
    expect(JSON.stringify(estados)).toBe(copia);
  });
});
