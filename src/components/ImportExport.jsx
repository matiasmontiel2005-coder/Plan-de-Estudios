import { useRef, useState } from 'react';
import { exportarProgreso, importarProgreso } from '../lib/progress.js';

/** Botones para exportar/importar el progreso en JSON y para reiniciarlo. */
export default function ImportExport({ plan, progress, onImport, onReset }) {
  const inputRef = useRef(null);
  const [mensaje, setMensaje] = useState(null); // { tipo: 'ok' | 'error', texto }

  const exportar = () => {
    const blob = new Blob([JSON.stringify(exportarProgreso(plan, progress), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `progreso-petroleos-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMensaje({ tipo: 'ok', texto: 'Progreso exportado.' });
  };

  const importar = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = ''; // permite volver a elegir el mismo archivo
    if (!archivo) return;
    try {
      const nuevo = importarProgreso(plan, await archivo.text());
      if (!window.confirm('Esto reemplaza tu progreso actual. ¿Continuar?')) return;
      onImport(nuevo);
      setMensaje({ tipo: 'ok', texto: 'Progreso importado.' });
    } catch (err) {
      setMensaje({ tipo: 'error', texto: err.message });
    }
  };

  const boton = 'rounded-lg border border-line2 px-3 py-1.5 text-sm font-medium hover:bg-tint';
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-muted">
        Tu progreso se guarda solo en este navegador. Exportalo para tener una copia o para pasarlo a otro dispositivo.
      </p>
      <div className="flex flex-wrap gap-2">
        <button className={boton} onClick={exportar}>⬇ Exportar JSON</button>
        <button className={boton} onClick={() => inputRef.current.click()}>⬆ Importar JSON</button>
        <button className={`${boton} text-red-600`} onClick={() => window.confirm('Se descartan tus cambios y se vuelve a los datos de plan.json. ¿Continuar?') && (onReset(), setMensaje({ tipo: 'ok', texto: 'Progreso reiniciado.' }))}>↺ Reiniciar</button>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={importar} />
      </div>
      {mensaje && <p role="status" className={`whitespace-pre-line text-sm ${mensaje.tipo === 'error' ? 'text-red-600' : 'text-primary'}`}>{mensaje.texto}</p>}
    </div>
  );
}
