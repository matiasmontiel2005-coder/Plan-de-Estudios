import { describe, it, expect } from 'vitest';
import { evaluarPlan } from '../availability.js';
import { plan, evalInicial, conEstados } from './helpers.js';

const ids = (lista) => lista.map((m) => m.id).sort();

describe('disponibilidad con los datos actuales', () => {
  it('hoy solo se puede cursar Legislación, Instrumentación y el examen de inglés', () => {
    const ev = evalInicial();
    const cursables = plan.materias.filter((m) => ev[m.id].estado === 'sin_cursar' && ev[m.id].puedeCursar);
    expect(ids(cursables)).toEqual(['00023', '00805', '00807']); // Instrumentación, Legislación, Inglés
  });

  it('Informática Aplicada está bloqueada: falta REGULARIZAR Administración de Operaciones', () => {
    const e = evalInicial()['00113'];
    expect(e.categoria).toBe('bloqueada');
    expect(e.faltaRegularizar).toEqual(['00804']);
    expect(e.faltaAprobar).toEqual([]);
  });

  it('Informática Aplicada se habilita al regularizar (en curso no alcanza)', () => {
    const regularizada = evaluarPlan(plan.materias, conEstados({ '00804': 'regularizada' }));
    expect(regularizada['00113'].puedeCursar).toBe(true);
    const aprobada = evaluarPlan(plan.materias, conEstados({ '00804': 'aprobada' }));
    expect(aprobada['00113'].puedeCursar).toBe(true);
  });

  it('distingue "falta aprobar" de "falta regularizar"', () => {
    // Producción I necesita Perforación I APROBADA (hoy solo regularizada)
    // y Reservorios II al menos REGULARIZADA (hoy en curso).
    const prod1 = evalInicial()['00120'];
    expect(prod1.faltaAprobar).toEqual(['00059']);
    expect(prod1.faltaRegularizar).toEqual(['00075']);
  });
});

describe('puede rendir', () => {
  it('Perforación I (regularizada, previas aprobadas) puede rendir', () => {
    expect(evalInicial()['00059'].puedeRendir).toBe(true);
  });
  it('Reservorios II (en curso, previas aprobadas) puede rendir', () => {
    expect(evalInicial()['00075'].puedeRendir).toBe(true);
  });
  it('Aguas Subterráneas (en curso) no puede rendir hasta aprobar Perforación I', () => {
    const e = evalInicial()['00063'];
    expect(e.puedeRendir).toBe(false);
    expect(e.faltaAprobarParaRendir).toEqual(['00059']);
  });
  it('una materia sin cursar nunca "puede rendir"', () => {
    expect(evalInicial()['00805'].puedeRendir).toBe(false);
  });
});

describe('regla de inglés (10.º semestre)', () => {
  it('Instrumentación cumple correlativas pero no es inscribible sin B2', () => {
    const e = evalInicial()['00023'];
    expect(e.puedeCursar).toBe(true);
    expect(e.faltaIngles).toBe(true);
    expect(e.inscribible).toBe(false);
  });
  it('sin B2 ninguna materia del 10.º semestre es inscribible; con B2 se habilita Instrumentación', () => {
    const sin = evalInicial();
    expect(plan.materias.filter((m) => m.semestre === 10).every((m) => !sin[m.id].inscribible)).toBe(true);
    const con = evaluarPlan(plan.materias, conEstados({ '00807': 'aprobada' }));
    expect(con['00023'].inscribible).toBe(true);
  });
});
