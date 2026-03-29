Scaffold a new Vanilla JS Web Component.

Ask the user for:
1. **Component name** in PascalCase (e.g. `MyButton`) — you will derive the kebab-case element name from it (e.g. `my-button`)
2. **Brief description** of what the component does

Then create the following two files:

---

**`src/components/<kebab-name>/<kebab-name>.js`**

```js
class <PascalName> extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.render();
	}

	render() {
		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: block;
				}
			</style>
			<slot></slot>
		`;
	}
}

customElements.define("<kebab-name>", <PascalName>);

export default <PascalName>;
```

---

**`src/components/<kebab-name>/<kebab-name>.test.js`**

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
});
```

---

After creating both files, run `npm run lint:fix` to ensure formatting matches project conventions (tabs, double quotes, 100-char line width).
