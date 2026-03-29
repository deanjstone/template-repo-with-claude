Implement a ROADMAP phase end-to-end, following the project's standard GitHub issue workflow.

---

## Step 1 — Identify the phase

Ask the user which phase number to implement. If not specified, read `ROADMAP.md` and infer
the next phase: the first phase where all checklist items are `[ ]` (unchecked).

Read `ROADMAP.md` and extract:
- **Phase name** (e.g. "App Architecture & Routing")
- **Goal** (the sentence after "**Goal:**")
- **Checklist** (all top-level `- [ ]` items, with their sub-bullets)
- **Done when** criteria

---

## Step 2 — Create GitHub issues (if they don't exist)

Search for an existing parent issue titled `Phase N: <Phase Name>` using
`mcp__github__search_issues`. If it exists, note its number and skip creation.

**If the parent issue is missing, create it:**

Title: `Phase N: <Phase Name>`
Labels: `Roadmap`, `Phase N`
Body:
```
## Goal
<goal from ROADMAP>

## Checklist
<checklist items from ROADMAP, formatted as `- [ ] item`>

## Done when
<"Done when" criteria from ROADMAP>

## Depends on
Phase N-1 (#<previous-phase-parent-issue-number>)
```

**For each top-level checklist item, create a sub-issue (if missing):**

Title: `Phase N: <Task Name>` (short, imperative form of the checklist item)
Labels: `Phase N`
Body:
```
<brief description of what this task involves>

- <required deliverable 1>
- <required deliverable 2>

Part of #<parent-issue-number>
```

Link each sub-issue to the parent using `mcp__github__sub_issue_write`.

---

## Step 3 — Create the implementation branch

Create branch: `claude/implement-phase-N-<kebab-goal>-<shortid>`
- `<kebab-goal>` = first 3–4 words of the phase goal in kebab-case
- `<shortid>` = 5-character alphanumeric random ID

Use `git checkout -b <branch>` locally, or `mcp__github__create_branch` via GitHub.

Post a comment on the parent issue **and** each sub-issue:
```
Development branch: `<branch-name>`

This branch implements all Phase N deliverables.
```

---

## Step 4 — Implement each sub-issue

Work through sub-issues in the order they appear. For each:

1. Implement all deliverables listed in the sub-issue body
2. Run relevant verification:
   - Code files: `npm run lint:fix` then `npm run lint`
   - Tests: `npm test`
   - File existence: confirm all created files exist

Do not move to the next sub-issue until the current one is verified.

---

## Step 5 — Validate and close each sub-issue

After verifying each sub-issue, post a closing comment:

```
**Validation passed — closing.**

<Brief summary of what was implemented>:
- ✅ <deliverable 1 verified>
- ✅ <deliverable 2 verified>
```

Then close the issue: `mcp__github__issue_write` with `state: closed`, `state_reason: completed`.

---

## Step 6 — Close the parent issue

Once all sub-issues are closed, post a summary comment on the parent:

```
**All sub-issues validated and closed — closing Phase N.**

- ✅ #<sub1> — <sub1 title>
- ✅ #<sub2> — <sub2 title>
...

Implementation branch: `<branch-name>`
```

Then close the parent: `mcp__github__issue_write` with `state: closed`, `state_reason: completed`.

---

## Step 7 — Update ROADMAP.md

In `ROADMAP.md`, mark all checklist items for this phase as `[x]`.

---

## Step 8 — Commit and push

```
git add -A
git commit -m "Implement Phase N: <Phase Name> (#<parent-issue-number>)

- <sub-issue summary 1> (#<n>)
- <sub-issue summary 2> (#<n>)
..."
git push -u origin <branch>
```
