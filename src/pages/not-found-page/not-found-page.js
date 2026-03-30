class PageNotFound extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <h1>404 — Not Found</h1>
      <p>The page you requested does not exist.</p>
    `;
  }
}

customElements.define("page-not-found", PageNotFound);
