import MateriaCard from '../MateriaCard.jsx';
import Leyenda from '../Leyenda.jsx';
import Optativas from './Optativas.jsx';
import { catalogoOptativas } from '../../lib/plan.js';

/** Malla curricular: un bloque por año, con sus dos semestres. */
export default function Curriculum({ plan, evals, progress, porId, onSelect, setOptativa }) {
  const anios = [...new Set(plan.materias.map((m) => m.anio))].sort((a, b) => a - b);
  return (
    <div>
      <div className="mb-4 space-y-1">
        <Leyenda />
        <p className="text-xs text-slate-500 dark:text-slate-400">Tocá una materia para cambiar su estado y cargar la nota. «P» = promoción.</p>
      </div>
      {anios.map((anio) => {
        const delAnio = plan.materias.filter((m) => m.anio === anio);
        const semestres = [...new Set(delAnio.map((m) => m.semestre))].sort((a, b) => a - b);
        return (
          <section key={anio} className="mb-6">
            <h2 className="mb-2 text-lg font-bold">{anio}.º año</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {semestres.map((sem) => (
                <div key={sem} className="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Semestre {sem}</h3>
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1 xl:grid-cols-2">
                    {delAnio.filter((m) => m.semestre === sem).map((m) => (
                      <MateriaCard key={m.id} materia={m} ev={evals[m.id]} datos={progress.estados[m.id]} porId={porId} onClick={() => onSelect(m.id)} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}
      <Optativas catalogo={catalogoOptativas(plan)} optativas={progress.optativas} reglas={plan.reglas.optativas} setOptativa={setOptativa} />
    </div>
  );
}
