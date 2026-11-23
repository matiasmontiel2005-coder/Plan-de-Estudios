// Selector de materia agrupado por año (reutilizado por simulador y planificador).
export default function SelectMateria({ materias, value, onChange, filtro = () => true, placeholder = 'Elegí una materia…', label }) {
  const anios = [...new Set(materias.map((m) => m.anio))].sort((a, b) => a - b);
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label ?? placeholder}
      className="min-h-[44px] w-full rounded-xl border border-line2 bg-surface px-3 py-2 focus:border-primary focus:outline-none">
      <option value="">{placeholder}</option>
      {anios.map((a) => (
        <optgroup key={a} label={`${a}.º año`}>
          {materias.filter((m) => m.anio === a && filtro(m)).map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </optgroup>
      ))}
    </select>
  );
}
