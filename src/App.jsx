import { useCallback, useMemo, useState } from 'react';
import planData from '../data/plan.json';
import { indexarPorId } from './lib/plan.js';
import { evaluarPlan } from './lib/availability.js';
import { calcularStats } from './lib/stats.js';
import { materiasClave } from './lib/priorities.js';
import { useProgress } from './state/useProgress.js';
import Curriculum from './components/Curriculum/Curriculum.jsx';
import GraphView from './components/GraphView/GraphView.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Simulator from './components/Simulator/Simulator.jsx';
import Planner from './components/Planner/Planner.jsx';
import ImportExport from './components/ImportExport.jsx';
import StateDialog from './components/StateDialog.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import Toast from './components/Toast.jsx';
import Icon, { Logo } from './components/Icon.jsx';
import { STATUS_META } from './components/statusStyles.js';

// [id, etiqueta, etiqueta corta (celular)] — el id también es el nombre del ícono.
const TABS = [
  ['avance', 'Resumen', 'Resumen'],
  ['malla', 'Malla', 'Malla'],
  ['grafo', 'Correlativas', 'Grafo'],
  ['simulador', 'Simulador', 'Simular'],
  ['planificador', 'Planificador', 'Planificar'],
  ['datos', 'Respaldo', 'Respaldo'],
];

export default function App() {
  const plan = planData;
  const { progress, setEstado, setOptativa, setPlanificador, reemplazar, reiniciar } = useProgress(plan);
  const [tab, setTab] = useState('avance');
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState(null);

  // Todo lo derivado se recalcula solo cuando cambia el progreso.
  const porId = useMemo(() => indexarPorId(plan.materias), [plan]);
  const evals = useMemo(() => evaluarPlan(plan.materias, progress.estados), [plan, progress.estados]);
  const stats = useMemo(() => calcularStats(plan, progress, evals), [plan, progress, evals]);
  const clave = useMemo(() => materiasClave(plan.materias, progress.estados), [plan, progress.estados]);

  // Guardar con posibilidad de deshacer.
  const guardarEstado = (id, estado, nota, origen) => {
    const previo = progress.estados[id] ?? { estado: 'sin_cursar' };
    setEstado(id, estado, nota, origen);
    const label = estado === 'sin_cursar' ? 'Sin cursar' : STATUS_META[estado].label;
    setToast({
      texto: `${porId[id].nombre}: ${label}${nota != null ? ` (${nota})` : ''}`,
      deshacer: () => setEstado(id, previo.estado, previo.nota, previo.origen),
    });
  };
  const cerrarToast = useCallback(() => setToast(null), []);
  const irA = (id) => { setTab(id); window.scrollTo({ top: 0 }); };

  return (
    <div className="min-h-screen pb-24 sm:pb-0">
      {/* Encabezado de marca con el avance general */}
      <header className="relative border-b border-line bg-surface">
        <div className="relative mx-auto max-w-6xl px-4 pb-5 pt-4 sm:pb-7">
          <div className="flex items-center gap-3">
            <Logo className="h-9 w-9" />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-base font-bold tracking-tight">Trayecto</p>
              <p className="truncate text-xs text-muted">Ingeniería de Petróleos · FING UNCUYO<span className="hidden sm:inline"> · Plan 02/16</span></p>
            </div>
            <ThemeToggle />
          </div>
          <div className="mt-5 flex items-end justify-between gap-4">
            <p className="text-4xl font-bold tracking-tight tabular-nums sm:text-5xl">
              {stats.porcentaje.toFixed(0)}<span className="text-2xl text-muted sm:text-3xl">%</span>
              <span className="ml-2 align-middle text-sm font-medium text-muted">de la carrera</span>
            </p>
            <p className="pb-1 text-right text-sm text-muted tabular-nums">
              <span className="font-semibold text-current">{stats.hechas}</span>/{stats.total} materias
            </p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-tint" role="progressbar" aria-valuenow={Math.round(stats.porcentaje)} aria-valuemin={0} aria-valuemax={100} aria-label="Avance de la carrera">
            <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${stats.porcentaje}%` }} />
          </div>
        </div>
      </header>

      {/* Navegación superior (tablet y escritorio) */}
      <nav className="sticky top-0 z-40 hidden border-b border-line bg-surface sm:block" aria-label="Secciones">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => irA(id)} aria-current={tab === id ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition ${tab === id ? 'bg-tint text-primary' : 'text-muted hover:bg-tint hover:text-current'}`}>
              <Icon name={id} className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {tab === 'avance' && <Dashboard plan={plan} stats={stats} evals={evals} porId={porId} clave={clave} />}
        {tab === 'malla' && <Curriculum plan={plan} evals={evals} progress={progress} porId={porId} onSelect={setEditId} setOptativa={setOptativa} />}
        {tab === 'grafo' && <GraphView plan={plan} evals={evals} porId={porId} onEdit={setEditId} />}
        {tab === 'simulador' && <Simulator plan={plan} progress={progress} evals={evals} />}
        {tab === 'planificador' && <Planner plan={plan} progress={progress} evals={evals} porId={porId} setPlanificador={setPlanificador} />}
        {tab === 'datos' && <ImportExport plan={plan} progress={progress} onImport={reemplazar} onReset={reiniciar} />}
      </main>

      <footer className="mx-auto hidden max-w-6xl px-4 pb-8 text-xs text-muted sm:block">
        Datos del plan: {plan.fuente}. Tu progreso se guarda solo en este dispositivo.
      </footer>

      {/* Barra inferior (celular) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface sm:hidden" aria-label="Secciones">
        <div className="grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
          {TABS.map(([id, , corta]) => (
            <button key={id} onClick={() => irA(id)} aria-current={tab === id ? 'page' : undefined}
              className={`flex min-h-[56px] flex-col items-center justify-center gap-1 text-[10px] font-medium transition ${tab === id ? 'text-primary' : 'text-muted'}`}>
              <span className={`flex h-7 w-12 items-center justify-center rounded-full transition ${tab === id ? 'bg-tint' : ''}`}>
                <Icon name={id} className="h-[18px] w-[18px]" />
              </span>
              {corta}
            </button>
          ))}
        </div>
      </nav>

      {editId && (
        <StateDialog key={editId} materia={porId[editId]} ev={evals[editId]} datos={progress.estados[editId]} porId={porId}
          onSave={guardarEstado} onClose={() => setEditId(null)} />
      )}
      <Toast toast={toast} onClose={cerrarToast} />
    </div>
  );
}
