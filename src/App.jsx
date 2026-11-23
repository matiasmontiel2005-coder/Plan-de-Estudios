import { useMemo, useState } from 'react';
import planData from '../data/plan.json';
import { indexarPorId } from './lib/plan.js';
import { evaluarPlan } from './lib/availability.js';
import { calcularStats } from './lib/stats.js';
import { useProgress } from './state/useProgress.js';
import Curriculum from './components/Curriculum/Curriculum.jsx';
import GraphView from './components/GraphView/GraphView.jsx';
import Dashboard from './components/Dashboard/Dashboard.jsx';
import Simulator from './components/Simulator/Simulator.jsx';
import Planner from './components/Planner/Planner.jsx';
import ImportExport from './components/ImportExport.jsx';
import StateDialog from './components/StateDialog.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ProgressRing from './components/ProgressRing.jsx';

// [id, etiqueta, etiqueta corta (celular), ícono]
const TABS = [
  ['malla', 'Malla', 'Malla', '📚'],
  ['grafo', 'Grafo', 'Grafo', '🕸️'],
  ['avance', 'Avance', 'Avance', '📊'],
  ['simulador', 'Simulador', 'Simular', '🔮'],
  ['planificador', 'Planificador', 'Planif.', '✅'],
  ['datos', 'Datos', 'Datos', '⚙️'],
];

export default function App() {
  const plan = planData;
  const { progress, setEstado, setOptativa, setPlanificador, reemplazar, reiniciar } = useProgress(plan);
  const [tab, setTab] = useState('malla');
  const [editId, setEditId] = useState(null);

  // Todo lo derivado se recalcula solo cuando cambia el progreso.
  const porId = useMemo(() => indexarPorId(plan.materias), [plan]);
  const evals = useMemo(() => evaluarPlan(plan.materias, progress.estados), [plan, progress.estados]);
  const stats = useMemo(() => calcularStats(plan, progress, evals), [plan, progress, evals]);

  return (
    <div className="min-h-screen pb-24 sm:pb-10">
      <header className="bg-gradient-to-br from-brand-950 to-brand-800 text-brand-50">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-5">
          <ProgressRing value={stats.porcentaje} size={68} stroke={7} track="stroke-white/20" bar="stroke-brand-300">
            <span className="text-sm">{stats.porcentaje.toFixed(0)}%</span>
          </ProgressRing>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold leading-tight sm:text-2xl">Ingeniería de Petróleos</h1>
            <p className="text-xs text-brand-300 sm:text-sm">FING UNCUYO · plan 02/16 · {stats.hechas} de {stats.total} materias aprobadas</p>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Navegación superior (pantallas medianas y grandes) */}
      <nav className="sticky top-0 z-40 hidden border-b border-line bg-surface sm:block" aria-label="Secciones">
        <div className="mx-auto flex max-w-7xl gap-1 px-4 py-2">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === id ? 'bg-primary text-onprimary' : 'hover:bg-tint'}`}>
              {label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 pt-5">
        {tab === 'malla' && <Curriculum plan={plan} evals={evals} progress={progress} porId={porId} onSelect={setEditId} setOptativa={setOptativa} />}
        {tab === 'grafo' && <GraphView plan={plan} evals={evals} porId={porId} onEdit={setEditId} />}
        {tab === 'avance' && <Dashboard plan={plan} stats={stats} evals={evals} porId={porId} />}
        {tab === 'simulador' && <Simulator plan={plan} progress={progress} evals={evals} />}
        {tab === 'planificador' && <Planner plan={plan} progress={progress} evals={evals} porId={porId} setPlanificador={setPlanificador} />}
        {tab === 'datos' && <ImportExport plan={plan} progress={progress} onImport={reemplazar} onReset={reiniciar} />}
      </main>

      {/* Barra inferior (celular) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface sm:hidden" aria-label="Secciones">
        <div className="grid grid-cols-6 pb-[env(safe-area-inset-bottom)]">
          {TABS.map(([id, , corta, icono]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${tab === id ? 'text-primary' : 'text-muted'}`}>
              <span className={`rounded-full px-3 py-0.5 text-base ${tab === id ? 'bg-tint' : ''}`}>{icono}</span>
              {corta}
            </button>
          ))}
        </div>
      </nav>

      {editId && (
        <StateDialog key={editId} materia={porId[editId]} ev={evals[editId]} datos={progress.estados[editId]} porId={porId}
          onSave={setEstado} onClose={() => setEditId(null)} />
      )}
    </div>
  );
}
