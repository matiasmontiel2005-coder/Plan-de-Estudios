// Grafo de correlatividades para resaltar previas y desbloqueos.
//
// El SIU lista como "previas" también las correlativas de las correlativas, lo que
// llenaría el grafo de flechas redundantes. Hacemos una reducción transitiva:
// si A -> B -> C, no dibujamos A -> C.

/** Devuelve { previas, desbloquea }: ids directos por materia, en el orden del plan. */
export function construirGrafo(materias) {
  const ids = new Set(materias.map((m) => m.id));
  const orden = Object.fromEntries(materias.map((m, i) => [m.id, i]));

  // Todas las previas listadas por el SIU (cursar + rendir), sin repetir.
  const listadas = {};
  for (const m of materias) {
    const set = new Set([...m.cursar.aprobadas, ...m.cursar.regularizadas, ...m.rendir.aprobadas]);
    listadas[m.id] = [...set].filter((id) => ids.has(id) && id !== m.id);
  }

  // Ancestros (previas directas e indirectas) con memoización y protección ante ciclos.
  const cache = {};
  const enCurso = new Set();
  const ancestros = (id) => {
    if (cache[id]) return cache[id];
    if (enCurso.has(id)) return new Set();
    enCurso.add(id);
    const res = new Set();
    for (const p of listadas[id]) {
      res.add(p);
      for (const a of ancestros(p)) res.add(a);
    }
    enCurso.delete(id);
    return (cache[id] = res);
  };

  const previas = {};
  const desbloquea = Object.fromEntries(materias.map((m) => [m.id, []]));
  for (const m of materias) {
    // p es redundante si es ancestro de otra previa q de la misma materia.
    previas[m.id] = listadas[m.id]
      .filter((p) => !listadas[m.id].some((q) => q !== p && ancestros(q).has(p)))
      .sort((a, b) => orden[a] - orden[b]);
    for (const p of previas[m.id]) desbloquea[p].push(m.id);
  }
  for (const id of Object.keys(desbloquea)) desbloquea[id].sort((a, b) => orden[a] - orden[b]);
  return { previas, desbloquea };
}
