import { useRef, useState } from 'react';
import { exportarProgreso, importarProgreso } from '../lib/progress.js';
import Icon from './Icon.jsx';
import { Button, Card, PageHeader } from './ui.jsx';

/** Exportar/importar el progreso en JSON y reiniciarlo. */
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

  const reiniciar = () => {
    if (!window.confirm('Se descartan tus cambios y se vuelve a los datos del plan. ¿Continuar?')) return;
    onReset();
    setMensaje({ tipo: 'ok', texto: 'Progreso reiniciado.' });
  };

  const Fila = ({ icono, titulo, texto, children }) => (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-tint text-primary"><Icon name={icono} /></span>
      <div className="flex-1"><p className="font-semibold">{titulo}</p><p className="text-sm text-muted">{texto}</p></div>
      {children}
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader titulo="Respaldo" descripcion="Tu progreso se guarda solo en este navegador. Exportalo para tener una copia o pasarlo a otro dispositivo." />
      <Card className="divide-y divide-line">
        <Fila icono="datos" titulo="Exportar progreso" texto="Descarga un archivo .json con tus estados, notas, optativas y plan de cuatrimestre.">
          <Button variant="primary" onClick={exportar}>Exportar</Button>
        </Fila>
        <Fila icono="upload" titulo="Importar progreso" texto="Carga un archivo exportado. Se valida antes de reemplazar nada.">
          <Button onClick={() => inputRef.current.click()}>Importar</Button>
        </Fila>
        <Fila icono="reset" titulo="Reiniciar" texto="Vuelve a los datos originales del plan (SIU Guaraní).">
          <Button variant="danger" onClick={reiniciar}>Reiniciar</Button>
        </Fila>
        <input ref={inputRef} type="file" accept="application/json,.json" className="hidden" onChange={importar} />
      </Card>
      {mensaje && (
        <p role="status" className={`mt-3 whitespace-pre-line rounded-xl p-3 text-sm ${mensaje.tipo === 'error' ? 'bg-red-50 text-red-800 dark:bg-red-500/10 dark:text-red-200' : 'bg-tint text-primary'}`}>{mensaje.texto}</p>
      )}
    </div>
  );
}
