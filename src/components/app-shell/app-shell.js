import { initRouter } from "../../router.js";
import "../../pages/home-page/home-page.js";
import "../../pages/login-page/login-page.js";
import "../../pages/not-found-page/not-found-page.js";

class AppShell extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        nav {
          display: flex;
          gap: 1rem;
          padding: 0.75rem 1.25rem;
          background: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }
        nav a {
          color: #4338ca;
          text-decoration: none;
          font-weight: 500;
        }
        nav a:hover {
          text-decoration: underline;
        }
        main {
          padding: 1.25rem;
        }
      </style>
      <nav>
        <a href="/">Home</a>
        <a href="/login">Login</a>
      </nav>
      <main>
        <div id="outlet"></div>
      </main>
    `;
    initRouter(shadow.querySelector("#outlet"));
  }
}

customElements.define("app-shell", AppShell);
