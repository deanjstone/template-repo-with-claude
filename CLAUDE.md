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
- **Indentation:** 2 spaces
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
| `/new-page` | Scaffold a route-level page component and register the route |
| `/new-edge-function` | Scaffold a new Supabase Edge Function (Deno/TypeScript) |
| `/run-tests` | Run unit + E2E tests and summarise results |
| `/implement-phase` | Implement a ROADMAP phase end-to-end: issues → branch → code → close |

---

## Git Hooks (Claude Code)

Claude Code enforces quality gates via hooks in `.claude/settings.json`:

- **Session start:** Runs `npm install` if `node_modules` is missing; warns if `.env` is absent
- **Pre-commit:** `npx @biomejs/biome check --staged` — blocks commit if lint or format fails
- **Pre-push:** `npm test` — blocks push if any Vitest unit test fails

Run `npm run lint:fix` and `npm test` locally before committing to avoid hook failures.

---

## Extending This Template

To add a new feature end-to-end:

1. **Page** — Use `/new-page` to scaffold the component, test, and route
2. **Service** — Create `src/services/<name>.js` with Supabase CRUD operations + co-located `.test.js`
3. **Component** — Use `/new-component` for any reusable UI pieces
4. **E2E test** — Add `e2e/<feature>.spec.js` for the complete user flow
5. **Edge Function** — Use `/new-edge-function` if server-side logic is needed

---

## GitHub Issue Workflow

This is the standard for creating and managing GitHub issues for each ROADMAP phase.
Follow it exactly when implementing any phase — use `/implement-phase` to automate it.

### Labels

| Applied to | Labels |
|-----------|--------|
| Parent (phase) issue | `Roadmap` + `Phase N` |
| Sub-issues (tasks) | `Phase N` only |

### Issue Titles

- **Parent:** `Phase N: <Phase Name>` — matches the ROADMAP heading exactly
- **Sub-issues:** `Phase N: <Task Name>` — short, imperative

### Parent Issue Body

```
## Goal
<one-sentence objective from ROADMAP>

## Checklist
- [ ] Top-level task 1
  - sub-detail
- [ ] Top-level task 2

## Done when
- <acceptance criterion from ROADMAP "Done when" section>

## Depends on
Phase N-1 (#<parent-issue-number>)
```

### Sub-Issue Body

```
<brief description of the task>

- required deliverable 1
- required deliverable 2

Part of #<parent-issue-number>
```

### Branch Naming

```
claude/implement-phase-N-<kebab-goal>-<shortid>
```

Example: `claude/implement-phase-2-roadmap-pI1Y9`

### Workflow Steps

1. **Create issues** — parent + sub-issues if they don't already exist
2. **Announce branch** — comment on parent and each sub-issue:
   `Development branch: \`<branch-name>\``
3. **Implement** — work through sub-issues in order; verify each before closing
4. **Validate and close sub-issues** — comment `**Validation passed — closing.**` with
   ✅-prefixed list of verified deliverables, then close with `state_reason: completed`
5. **Close parent** — comment summarising all sub-issues with ✅, then close with
   `state_reason: completed`
6. **Update ROADMAP.md** — mark all phase checklist items as `[x]`
7. **Commit and push** — message format: `Implement Phase N: <Name> (#parent)`
