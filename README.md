# Mesa Semanal

**Web:** https://mesa-semanal.vercel.app · **Código:** https://github.com/shlamydev/mesa-semanal

Planificador de comidas semanal con lista de la compra automática. Vite + React + TypeScript, sin backend (los datos se guardan en `localStorage`).

```bash
npm install
npm run dev     # desarrollo en http://localhost:5173
npm run test    # tests (Vitest + Testing Library)
npm run lint    # oxlint
npm run build   # build de producción en dist/
```

## Docker

La app es estática (no tiene servidor): el `Dockerfile` la construye con Node y la sirve con nginx.

```bash
docker build -t app-web .
docker run -p 8080:80 app-web
```

Después abre http://localhost:8080 en el navegador. Para pararla: `Ctrl+C` (o `docker ps` y `docker stop <id>`).

Comando de arranque en una sola línea: `docker build -t app-web . && docker run -p 8080:80 app-web`

## Despliegue (Vercel)

1. Sube el repositorio a GitHub.
2. En https://vercel.com/new importa el repositorio. Vercel detecta Vite solo (`npm run build`, carpeta `dist`).
3. Pulsa **Deploy**. Cada `git push` a `main` vuelve a desplegar.

Con la CLI: `npx vercel` (vista previa) y `npx vercel --prod` (producción).

Alternativa en Netlify: comando `npm run build`, carpeta de publicación `dist`.
