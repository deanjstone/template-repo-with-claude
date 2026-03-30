class PageLogin extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
      </style>
      <h1>Login</h1>
      <p>Sign in to your account.</p>
    `;
  }
}

customElements.define("page-login", PageLogin);
