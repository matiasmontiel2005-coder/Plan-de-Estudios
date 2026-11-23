// Selector de materia agrupado por año (reutilizado por simulador y planificador).
export default function SelectMateria({ materias, value, onChange, filtro = () => true, placeholder = 'Elegí una materia…' }) {
  const anios = [...new Set(materias.map((m) => m.anio))].sort((a, b) => a - b);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800">
      <option value="">{placeholder}</option>
      {anios.map((a) => (
        <optgroup key={a} label={`${a}.º año`}>
          {materias.filter((m) => m.anio === a && filtro(m)).map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </optgroup>
      ))}
    </select>
  );
}
