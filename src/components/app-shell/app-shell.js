import { initRouter } from "../../router.js";
import { onAuthStateChange, signOut } from "../../services/auth.js";
import "../../pages/home-page/home-page.js";
import "../../pages/login-page/login-page.js";
import "../../pages/not-found-page/not-found-page.js";

class AppShell extends HTMLElement {
  #subscription = null;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        nav {
          display: flex;
          align-items: center;
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
        .spacer { flex: 1; }
        #user-info {
          display: none;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }
        #user-info.visible { display: flex; }
        #user-email { color: #374151; }
        #logout-btn {
          background: none;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          padding: 0.25rem 0.75rem;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
        }
        #logout-btn:hover { background: #e5e7eb; }
        main {
          padding: 1.25rem;
        }
      </style>
      <nav>
        <a href="/">Home</a>
        <div class="spacer"></div>
        <div id="user-info">
          <span id="user-email"></span>
          <button id="logout-btn">Log out</button>
        </div>
      </nav>
      <main>
        <div id="outlet"></div>
      </main>
    `;

    this._shadow = shadow;
    shadow.querySelector("#logout-btn").addEventListener("click", () => this._handleLogout());

    this.#subscription = onAuthStateChange((session) => this._updateAuthUI(session));
    initRouter(shadow.querySelector("#outlet"));
  }

  disconnectedCallback() {
    this.#subscription?.unsubscribe();
  }

  _updateAuthUI(session) {
    const userInfo = this._shadow.querySelector("#user-info");
    const userEmail = this._shadow.querySelector("#user-email");
    if (session?.user) {
      userEmail.textContent = session.user.email;
      userInfo.classList.add("visible");
    } else {
      userInfo.classList.remove("visible");
    }
  }

  async _handleLogout() {
    try {
      await signOut();
    } catch {
      // ignore sign-out errors
    }
    window.location.href = "/login";
  }
}

customElements.define("app-shell", AppShell);
