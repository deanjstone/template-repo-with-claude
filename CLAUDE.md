# CLAUDE.md

Project conventions, tech stack, and tooling for Claude Code.

---

## Tech Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Build | **Vite 6** | Vanilla JS template, dev server on `localhost:5173` |
| Unit Tests | **Vitest 2** | jsdom environment, co-located `*.test.js` files |
| E2E Tests | **Playwright 1** | Tests in `e2e/`, auto-starts dev server |
| Lint + Format | **Biome 1** | Replaces ESLint + Prettier — one config in `biome.json` |
| UI Components | **Vanilla JS Web Components** | No frameworks — native `HTMLElement` + Shadow DOM |
| Design Tokens | **Open Props** | CSS custom properties for spacing, color, type |
| Backend | **Supabase** | Postgres, Auth, Edge Functions, Realtime |

---

## Project Structure

```
src/
  components/    ← reusable Web Components (one per folder)
  pages/         ← route-level page components
  services/      ← Supabase client, auth helpers, CRUD services
  styles/        ← global CSS, Open Props imports
  utils/         ← pure helper functions (no side effects)
e2e/             ← Playwright end-to-end tests
supabase/
  functions/     ← Supabase Edge Functions (Deno / TypeScript)
```

---

## Code Conventions

- **Language:** Vanilla JavaScript — no TypeScript, no frameworks (React, Vue, etc.)
- **Components:** Native Web Components only
  - Class extends `HTMLElement`
  - Shadow DOM (`this.attachShadow({ mode: "open" })`)
  - `connectedCallback` for initial render
  - `customElements.define("kebab-name", ClassName)`
  - One component per directory, filename matches element name
- **Indentation:** Tabs
- **Line width:** 100 characters
- **Quotes:** Double quotes
- **Trailing commas:** ES5 style (objects and arrays, not function params)
- **Formatting:** Enforced by Biome — run `npm run lint:fix` to auto-fix

---

## NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check code with Biome (no changes) |
| `npm run lint:fix` | Auto-fix lint and formatting issues |
| `npm test` | Run Vitest unit tests |
| `npm run test:e2e` | Run Playwright E2E tests |

---

## Testing

- **Unit tests (Vitest):** Test pure logic, services, and component behaviour
  - Co-locate with source: `src/components/my-button/my-button.test.js`
  - Use jsdom to create and query elements
- **E2E tests (Playwright):** Test complete user flows in a real browser
  - Place in `e2e/` — one file per flow (e.g. `e2e/auth.spec.js`)
  - Playwright auto-starts the Vite dev server

---

## Slash Commands

| Command | Description |
|---------|-------------|
| `/new-component` | Scaffold a new Vanilla JS Web Component with co-located test |
| `/new-edge-function` | Scaffold a new Supabase Edge Function (Deno/TypeScript) |
| `/run-tests` | Run unit + E2E tests and summarise results |

---

## Git Hooks (Claude Code)

Claude Code enforces quality gates via `PreToolUse` hooks in `.claude/settings.json`:

- **Pre-commit:** `npx @biomejs/biome check --staged` — blocks commit if lint or format fails
- **Pre-push:** `npm test` — blocks push if any Vitest unit test fails

Run `npm run lint:fix` and `npm test` locally before committing to avoid hook failures.
