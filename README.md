# Plan de estudios · Ingeniería de Petróleos (FING UNCUYO, plan 02/16)

Web app para seguir el avance de la carrera y ver qué materias se pueden cursar o rendir.
React + Vite + Tailwind, sin backend: el progreso se guarda en el `localStorage` del navegador.

## Correrlo

Requiere Node 20 o superior.

```bash
npm install
npm run dev      # servidor local en http://localhost:5173
npm test         # tests de la lógica (src/lib)
npm run build    # genera dist/ para publicar
```

## Datos

Todo sale de `data/plan.json` (no se modifica desde la app). El progreso que cargás en la app
vive en tu navegador; usá la pestaña **Datos** para exportarlo/importarlo en JSON o reiniciarlo.

- Si más adelante agregás `"horas": <número>` a **todas** las materias del JSON, el panel de avance
  también muestra el avance por horas. Mientras no estén, el avance se mide por cantidad de materias.
- Para actualizar el plan, reemplazá `data/plan.json` y volvé a publicar.

## Reglas implementadas (`src/lib/`)

| Estado | Condición |
|---|---|
| **Puede cursar** | todas las de `cursar.aprobadas` aprobadas y todas las de `cursar.regularizadas` regularizadas o aprobadas |
| **Puede rendir** | estaba regularizada o en curso y todas las de `rendir.aprobadas` aprobadas |
| **Bloqueada** | no cumple; se informa "falta aprobar" y "falta regularizar" por separado |
| **Inglés B2** | sin él, ninguna materia del 10.º semestre es inscribible (la tarjeta avisa "Falta inglés B2") |
| **Optativas** | 25 puntos cada una, 100 requeridos. El plan no trae sus correlativas: solo se registran como aprobadas |

El grafo dibuja solo correlatividades directas (el SIU lista también las correlativas de las correlativas).

## Publicarlo gratis

### Opción A: GitHub Pages (ya configurado)

1. Subí el repo a GitHub (rama `main`).
2. En el repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Cada push a `main` ejecuta `.github/workflows/deploy.yml` (tests + build + deploy).
   La app queda en `https://<tu-usuario>.github.io/<nombre-del-repo>/`.

### Opción B: Vercel

1. Entrá a [vercel.com](https://vercel.com) con tu cuenta de GitHub → **Add New → Project** → elegí el repo.
2. Vercel detecta Vite solo (Build: `npm run build`, Output: `dist`). Click en **Deploy**.
3. Cada push a `main` se publica automáticamente.

El `base: './'` de `vite.config.js` hace que el mismo build funcione en ambos.
