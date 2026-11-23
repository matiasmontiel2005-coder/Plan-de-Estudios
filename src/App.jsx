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

const TABS = [
  ['malla', 'Malla'], ['grafo', 'Grafo'], ['avance', 'Avance'],
  ['simulador', 'Simulador'], ['planificador', 'Planificador'], ['datos', 'Datos'],
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
    <div className="mx-auto max-w-7xl px-4 pb-16">
      <header className="sticky top-0 z-40 -mx-4 border-b border-slate-200 bg-slate-50/95 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-base font-bold leading-tight sm:text-xl">Ingeniería de Petróleos</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">FING UNCUYO · plan 02/16 · {stats.porcentaje.toFixed(0)}% completado</p>
          </div>
          <ThemeToggle />
        </div>
        <nav className="-mx-1 mt-3 flex gap-1 overflow-x-auto" aria-label="Secciones">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? 'page' : undefined}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium ${tab === id ? 'bg-indigo-600 text-white' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      <main className="pt-5">
        {tab === 'malla' && <Curriculum plan={plan} evals={evals} progress={progress} porId={porId} onSelect={setEditId} setOptativa={setOptativa} />}
        {tab === 'grafo' && <GraphView plan={plan} evals={evals} porId={porId} onEdit={setEditId} />}
        {tab === 'avance' && <Dashboard stats={stats} porId={porId} />}
        {tab === 'simulador' && <Simulator plan={plan} progress={progress} evals={evals} />}
        {tab === 'planificador' && <Planner plan={plan} progress={progress} evals={evals} porId={porId} setPlanificador={setPlanificador} />}
        {tab === 'datos' && <ImportExport plan={plan} progress={progress} onImport={reemplazar} onReset={reiniciar} />}
      </main>

      {editId && (
        <StateDialog key={editId} materia={porId[editId]} ev={evals[editId]} datos={progress.estados[editId]} porId={porId}
          onSave={setEstado} onClose={() => setEditId(null)} />
      )}
    </div>
  );
}
