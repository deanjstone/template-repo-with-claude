# template-repo-with-claude

Opinionated starter template with a preferred tech stack:

- **Claude** — AI-assisted development
- **Vite** — fast dev server and bundler
- **Web Components** — vanilla JS custom elements
- **Vanilla JS** — no framework overhead
- **Open Props CSS** — design token system
- **Supabase** — backend, auth, and edge function provider

## Setup

```bash
git clone https://github.com/deanjstone/template-repo-with-claude.git
cd template-repo-with-claude
npm i
npm run dev
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:5173` |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Biome linter and formatter checks |
| `npm run lint:fix` | Auto-fix lint and formatting issues |
| `npm run test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |
