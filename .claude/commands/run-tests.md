Run the full test suite and summarise the results.

Execute the following steps in order:

1. **Unit tests** — run `npm test` (Vitest) and capture the output.
2. **E2E tests** — run `npm run test:e2e` (Playwright) and capture the output.

After both complete, report a summary in this format:

---

## Test Results

### Unit Tests (Vitest)
- Status: PASSED / FAILED
- Tests: X passed, Y failed, Z skipped
- Duration: Xs
- Failures (if any): list each failing test with file and error message

### E2E Tests (Playwright)
- Status: PASSED / FAILED
- Tests: X passed, Y failed, Z skipped
- Duration: Xs
- Failures (if any): list each failing test with file and error message

### Overall
- **All tests passed** ✓  _or_  **X test(s) failed — see details above**

---

If any tests fail, suggest likely causes and next steps to fix them.
