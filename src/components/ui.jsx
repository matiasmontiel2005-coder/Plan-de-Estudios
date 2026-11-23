// Piezas visuales reutilizables.
export function Card({ className = '', children, ...props }) {
  return (
    <section className={`rounded-2xl border border-line bg-surface p-4 shadow-soft sm:p-5 ${className}`} {...props}>
      {children}
    </section>
  );
}

export function CardTitle({ children, aside }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{children}</h3>
      {aside && <span className="text-xs text-muted">{aside}</span>}
    </div>
  );
}

export function PageHeader({ titulo, descripcion, children }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{titulo}</h2>
        {descripcion && <p className="mt-1 max-w-2xl text-sm text-muted">{descripcion}</p>}
      </div>
      {children}
    </div>
  );
}

/** Barra de progreso horizontal (0–100). */
export function Bar({ valor, className = 'bg-primary', alto = 'h-2', track = 'bg-tint' }) {
  return (
    <div className={`${alto} w-full overflow-hidden rounded-full ${track}`}>
      <div className={`h-full rounded-full ${className} transition-[width] duration-700`} style={{ width: `${Math.min(100, Math.max(0, valor))}%` }} />
    </div>
  );
}

export function Button({ variant = 'secondary', className = '', children, ...props }) {
  const estilos = {
    primary: 'bg-primary text-onprimary hover:brightness-110 shadow-soft',
    secondary: 'border border-line2 bg-surface hover:bg-tint',
    ghost: 'hover:bg-tint',
    danger: 'border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40',
  };
  return (
    <button type="button" className={`inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${estilos[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
