# Roadmap

Personal starter template: **Vite + Vanilla JS Web Components + Open Props + Supabase**, optimized for Claude Code.

Each phase builds on the last and ends in a usable state. GitHub issues are created per-phase as each phase completes.

---

## Phase 1 — Project Skeleton & Tooling

**Goal:** Replace placeholder files, initialize the Vite project, and configure all dev tooling so every subsequent phase starts from a working `npm run dev`.

- [x] Replace `.gitignore` with a Node/Vite-appropriate version (remove Jekyll ignores)
- [x] Rename `.github/dependabot-pkg-vers.yml` → `.github/dependabot.yml`; set `package-ecosystem: "npm"` and add a GitHub Actions ecosystem entry
- [x] `npm init` / create `package.json` with project metadata
- [x] Install and configure **Vite** (vanilla JS template)
- [x] Install and configure **Biome** (`biome.json` — formatting + linting rules)
- [x] Install and configure **Vitest** (`vitest.config.js`)
- [x] Install and configure **Playwright** (`playwright.config.js`, install browsers)
- [x] Add npm scripts: `dev`, `build`, `preview`, `lint`, `lint:fix`, `test`, `test:e2e`
- [x] Create minimal `index.html` + `src/main.js` that renders "Hello World"
- [x] Update `README.md` with setup instructions (`git clone`, `npm i`, `npm run dev`)

**Done when:** `npm run dev` serves a page, `npm run lint` passes, `npm run test` exits cleanly, and `npm run build` produces `dist/`.

---

## Phase 2 — Claude Code Integration

**Goal:** Make the repo Claude Code-native so that Claude operates under project conventions from the first prompt.

- [ ] Author `CLAUDE.md` with:
  - Tech stack summary and architecture overview
  - File/folder conventions (naming, component structure)
  - Coding conventions (no frameworks, vanilla WC patterns, Open Props tokens)
  - Commands cheat-sheet (`npm run …`)
  - Testing expectations (unit for logic, E2E for flows)
- [ ] Create `.claude/settings.json` with allowed tools and approved shell commands
- [ ] Add Claude Code **hooks**:
  - Pre-commit: `npx @biomejs/biome check --staged` (lint + format)
  - Pre-push: `npm test` (Vitest)
- [ ] Add Claude Code **slash commands** (`.claude/commands/`):
  - `new-component.md` — scaffold a Web Component
  - `new-edge-function.md` — scaffold a Supabase Edge Function
  - `run-tests.md` — run unit + E2E and report results

**Done when:** Opening the repo in Claude Code shows conventions in context; hooks fire on commit and push; slash commands are available.

---

## Phase 3 — App Architecture & Routing

**Goal:** Establish the SPA shell, client-side routing, component base classes, and Open Props design tokens so feature work has a foundation.

- [x] Set up folder structure:
  ```
  src/
    components/    ← reusable Web Components
    pages/         ← routed page components
    services/      ← Supabase client, auth helpers
    styles/        ← global styles, Open Props imports
    utils/         ← shared helpers
  supabase/
    functions/     ← Edge Functions (Deno/TS)
  ```
- [x] Install **Open Props** and create `src/styles/global.css` (reset, tokens, base typography)
- [x] Install **@vaadin/router** and create `src/router.js` with route definitions
- [x] Create `<app-shell>` root component (nav bar, outlet for router)
- [x] Create placeholder page components: `<page-home>`, `<page-login>`, `<page-not-found>`
- [x] Establish Web Component conventions:
  - Base pattern: class extending `HTMLElement`, Shadow DOM, adopted stylesheets
  - One component per file, kebab-case naming, co-located styles
- [x] Write first unit tests for router config and a sample component

**Done when:** `npm run dev` renders the app shell, navigating between `/`, `/login`, and an unknown path shows the correct page, and `npm test` passes.

---

## Phase 4 — Supabase Integration & Auth Flow

**Goal:** Connect to a remote Supabase project and implement a working auth flow (sign up, log in, log out, protected routes).

- [x] Install `@supabase/supabase-js`
- [x] Create `src/services/supabase.js` — initialize client from env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [x] Add `.env.example` documenting required variables (actual `.env` stays gitignored)
- [x] Create `src/services/auth.js` — sign up, sign in (email/password), sign out, `onAuthStateChange` listener
- [x] Build `<page-login>` with sign-in / sign-up form
- [x] Implement auth-guarded routing (redirect unauthenticated users to `/login`)
- [x] Add auth state to `<app-shell>` (show/hide nav items, user menu)
- [x] Write unit tests for auth service (mock Supabase client)
- [x] Write Playwright E2E test for the login → redirect → dashboard flow

**Done when:** A user can sign up, log in, see a protected page, log out, and get redirected — tested end-to-end.

---

## Phase 5 — CRUD Example & Edge Function

**Goal:** Demonstrate the full data pattern: Supabase table, RLS policies, CRUD UI, and an Edge Function — giving future projects a copy-paste reference.

- [x] Document example table schema in `supabase/README.md` (e.g., `todos` table with RLS)
- [x] Create `src/services/todos.js` — CRUD operations via Supabase client (`select`, `insert`, `update`, `delete`)
- [x] Build `<page-todos>` — list, add, edit, delete todos (demonstrates data binding, optimistic UI)
- [x] Create a Supabase Edge Function (`supabase/functions/hello/index.ts`) as a reference example
- [x] Wire a button or action in the UI to invoke the Edge Function
- [x] Write unit tests for the CRUD service
- [x] Write Playwright E2E test for creating and deleting a todo

**Done when:** Authenticated user can perform full CRUD on todos; the Edge Function responds; unit and E2E tests pass.

---

## Phase 6 — CI/CD & Deployment

**Goal:** Automate quality gates and deployment so every PR is checked and merging to `main` ships to production.

- [ ] Create `.github/workflows/ci.yml`:
  - Trigger: pull request to `main`
  - Steps: install → lint (Biome) → unit test (Vitest) → build → E2E test (Playwright)
  - Upload Playwright report as artifact
- [ ] Create `.github/workflows/deploy.yml`:
  - Trigger: push to `main`
  - Deploy to **Vercel** (via Vercel CLI or GitHub integration)
- [ ] Configure Vercel project:
  - Build command: `npm run build`
  - Output directory: `dist`
  - SPA rewrite rule: all routes → `index.html`
  - Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- [ ] Enable Vercel preview deploys on PRs
- [ ] Add CI status badge to `README.md`
- [ ] Final `README.md` polish: project overview, quick start, architecture diagram (text), environment setup, available scripts, deployment notes

**Done when:** A PR triggers CI checks that must pass before merge; merging to `main` auto-deploys to Vercel; preview URLs generate on PRs.

---

## Phase Dependencies

```
Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5 → Phase 6
```

Phases are sequential — each requires the prior phase complete. Phase 6 (CI/CD) can be partially started earlier: the CI workflow is viable after Phase 3, but deploy workflows require Phase 5.
