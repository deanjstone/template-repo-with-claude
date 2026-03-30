# template-repo-with-claude

[![CI](https://github.com/deanjstone/template-repo-with-claude/actions/workflows/ci.yml/badge.svg)](https://github.com/deanjstone/template-repo-with-claude/actions/workflows/ci.yml)

Opinionated starter template for AI-assisted full-stack web development. Ships with a curated stack, enforced conventions, and Claude Code integration out of the box.

## Stack

| Layer | Tool |
|---|---|
| Build | Vite 6 |
| UI | Vanilla JS Web Components + Shadow DOM |
| Styles | Open Props (CSS design tokens) |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Router | @vaadin/router |
| Unit tests | Vitest 2 + jsdom |
| E2E tests | Playwright 1 |
| Lint + Format | Biome 1 |
| Deploy | Vercel |

## Architecture

```
template-repo-with-claude/
├── src/
│   ├── components/      ← reusable Web Components (one per folder)
│   ├── pages/           ← route-level page components
│   ├── services/        ← Supabase client, auth helpers, CRUD services
│   ├── styles/          ← global CSS, Open Props imports
│   ├── utils/           ← pure helper functions
│   ├── router.js        ← Vaadin Router config + auth guards
│   └── main.js          ← entry point
├── e2e/                 ← Playwright end-to-end tests
├── supabase/
│   └── functions/       ← Supabase Edge Functions (Deno / TypeScript)
├── .github/
│   └── workflows/       ← CI (PRs) + Deploy (main → Vercel)
└── .claude/             ← Claude Code hooks and slash commands
```

## Quick Start

```bash
git clone https://github.com/deanjstone/template-repo-with-claude.git
cd template-repo-with-claude
npm i
cp .env.example .env   # fill in Supabase credentials
npm run dev
```

## Environment Setup

Copy `.env.example` to `.env` and fill in your Supabase project credentials:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Get these values from your [Supabase project settings](https://supabase.com/dashboard) → API.

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server at `http://localhost:5173` |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Biome linter and formatter checks |
| `npm run lint:fix` | Auto-fix lint and formatting issues |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Deployment

This project deploys to **Vercel** automatically:

- **Preview**: every pull request gets a unique preview URL
- **Production**: merging to `main` triggers a production deploy

### First-time Vercel setup

1. Install the [Vercel GitHub integration](https://vercel.com/docs/deployments/git/vercel-for-github) or connect via `npx vercel link`
2. Set the following **GitHub repository secrets** (Settings → Secrets → Actions):

| Secret | Description |
|---|---|
| `VERCEL_TOKEN` | Vercel personal access token |
| `VERCEL_ORG_ID` | Your Vercel team/org ID (from `vercel env ls`) |
| `VERCEL_PROJECT_ID` | Your Vercel project ID (from `vercel env ls`) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/public key |

3. Vercel build config is in `vercel.json` — SPA rewrites are already configured.
