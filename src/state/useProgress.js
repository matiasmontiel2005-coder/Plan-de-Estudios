// Estado del usuario en React: se guarda en localStorage y arranca con plan.json.
import { useEffect, useReducer } from 'react';
import { STORAGE_KEY, progresoInicial, exportarProgreso, importarProgreso } from '../lib/progress.js';

function reducer(state, accion) {
  switch (accion.tipo) {
    case 'setEstado': {
      // La nota y el origen solo tienen sentido en materias aprobadas.
      const { id, estado, nota, origen } = accion;
      const item = { estado };
      if (estado === 'aprobada') {
        if (nota != null) item.nota = nota;
        if (origen) item.origen = origen;
      }
      return { ...state, estados: { ...state.estados, [id]: item } };
    }
    case 'setOptativa': {
      const optativas = { ...state.optativas };
      if (accion.datos) optativas[accion.id] = accion.datos;
      else delete optativas[accion.id];
      return { ...state, optativas };
    }
    case 'setPlanificador':
      return { ...state, planificador: accion.ids };
    case 'reemplazar':
      return accion.progreso;
    default:
      return state;
  }
}

function cargar(plan) {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY);
    if (guardado) return importarProgreso(plan, guardado);
  } catch { /* datos corruptos o sin acceso a localStorage: se usa el inicial */ }
  return progresoInicial(plan);
}

export function useProgress(plan) {
  const [progress, dispatch] = useReducer(reducer, plan, cargar);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(exportarProgreso(plan, progress))); } catch { /* ignorar */ }
  }, [plan, progress]);

  return {
    progress,
    setEstado: (id, estado, nota, origen) => dispatch({ tipo: 'setEstado', id, estado, nota, origen }),
    setOptativa: (id, datos) => dispatch({ tipo: 'setOptativa', id, datos }),
    setPlanificador: (ids) => dispatch({ tipo: 'setPlanificador', ids }),
    reemplazar: (p) => dispatch({ tipo: 'reemplazar', progreso: p }),
    reiniciar: () => dispatch({ tipo: 'reemplazar', progreso: progresoInicial(plan) }),
  };
}
