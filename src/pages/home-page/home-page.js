class PageHome extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <h1>Home</h1>
      <p>Welcome to the app.</p>
    `;
  }
}

customElements.define("page-home", PageHome);
