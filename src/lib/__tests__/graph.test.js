import { describe, it, expect } from 'vitest';
import { construirGrafo } from '../graph.js';
import { plan } from './helpers.js';

const g = construirGrafo(plan.materias);

describe('grafo de correlatividades', () => {
  it('quita las previas redundantes (reducción transitiva)', () => {
    // Producción I lista 8 previas en el SIU; solo 4 son directas.
    expect(g.previas['00120']).toEqual(['00346', '00803', '00059', '00075'].sort((a, b) => plan.materias.findIndex((m) => m.id === a) - plan.materias.findIndex((m) => m.id === b)));
  });
  it('desbloquea es la inversa de previas', () => {
    for (const [id, previas] of Object.entries(g.previas))
      for (const p of previas) expect(g.desbloquea[p]).toContain(id);
  });
  it('Administración de Operaciones desbloquea Informática y Administración de Proyectos', () => {
    expect(g.desbloquea['00804']).toEqual(expect.arrayContaining(['00113', '00806']));
  });
});
