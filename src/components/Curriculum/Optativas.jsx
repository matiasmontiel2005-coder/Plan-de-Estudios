// Lista de optativas: se marcan como aprobadas para sumar puntos (25 c/u).
export default function Optativas({ catalogo, optativas, reglas, setOptativa }) {
  const cantidad = Object.keys(optativas).length;
  const puntos = cantidad * reglas.puntos_por_optativa;
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold">Optativas</h2>
      <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
        {puntos}/{reglas.puntos_requeridos} puntos · se cursan desde el {reglas.desde_semestre}.º semestre ·
        {' '}{reglas.puntos_por_optativa} puntos cada una ({reglas.cantidad} en total). El plan no informa sus correlativas,
        así que solo se registran como aprobadas.
      </p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {catalogo.map((o) => {
          const d = optativas[o.id];
          return (
            <li key={o.id} className={`rounded-lg border-2 p-2.5 text-sm ${d ? 'border-green-500 bg-green-100 dark:bg-green-900/40' : 'border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900'}`}>
              <label className="flex items-start gap-2 font-medium">
                <input type="checkbox" className="mt-1 h-4 w-4" checked={!!d}
                  onChange={(e) => setOptativa(o.id, e.target.checked ? { origen: 'examen' } : null)} />
                <span>{o.nombre} <span className="text-xs font-normal text-slate-500">({o.id})</span></span>
              </label>
              {d && (
                <div className="mt-2 flex gap-2">
                  <input type="number" min="0" max="10" step="any" placeholder="Nota" value={d.nota ?? ''}
                    onChange={(e) => {
                      const v = e.target.value;
                      const { nota, ...resto } = d;
                      setOptativa(o.id, v === '' ? resto : { ...resto, nota: Math.min(10, Math.max(0, Number(v))) });
                    }}
                    className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800" />
                  <select value={d.origen ?? 'examen'} onChange={(e) => setOptativa(o.id, { ...d, origen: e.target.value })}
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-800">
                    <option value="examen">Examen</option>
                    <option value="promocion">Promoción</option>
                  </select>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
