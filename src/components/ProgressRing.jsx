// Anillo de progreso en SVG. `value` va de 0 a 100.
export default function ProgressRing({ value, size = 72, stroke = 8, track = 'stroke-line', bar = 'stroke-primary', children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${value.toFixed(0)}% completado`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={track} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(100, Math.max(0, value)) / 100)} className={`${bar} transition-[stroke-dashoffset] duration-700`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold">{children}</div>
    </div>
  );
}
