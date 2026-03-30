Scaffold a new route-level page component and register it with the router.

Ask the user for:
1. **Page name** in PascalCase (e.g. `SettingsPage`) — you will derive the kebab-case element name (e.g. `page-settings`) and URL path (e.g. `/settings`)
2. **Brief description** of what the page shows
3. **Auth-guarded?** (yes/no) — whether unauthenticated users should be redirected to `/login`

Then create the following file and update the router:

---

**`src/pages/<kebab-name>/<kebab-name>.js`**

```js
class <PascalName> extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <h1><Title></h1>
      <p><Description placeholder></p>
    `;
  }
}

customElements.define("<kebab-name>", <PascalName>);
```

---

**`src/pages/<kebab-name>/<kebab-name>.test.js`**

```js
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import "./<kebab-name>.js";

describe("<PascalName>", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("<kebab-name>");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
  });

  it("renders without error", () => {
    expect(element).toBeDefined();
    expect(element.shadowRoot).not.toBeNull();
  });

  it("displays the page heading", () => {
    const h1 = element.shadowRoot.querySelector("h1");
    expect(h1).not.toBeNull();
    expect(h1.textContent).toBe("<Title>");
  });
});
```

---

**Update `src/router.js`:**
- Import the new page component at the top of the file
- Add a route entry **before** the catch-all `(.*)` route:
  - If auth-guarded: use the same `redirectIfNotAuthenticated` action pattern as `/` and `/todos`
  - If not guarded: no action needed

**Update `src/components/app-shell/app-shell.js`:**
- Add a nav link for the new page in the `<nav>` section

After creating the files and updating the router, run `npm run lint:fix` to ensure formatting matches project conventions.
