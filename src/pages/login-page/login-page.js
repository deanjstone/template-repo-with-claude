import { Router } from "@vaadin/router";
import { signIn, signUp } from "../../services/auth.js";

class PageLogin extends HTMLElement {
  #mode = "signin";

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        .container {
          max-width: 400px;
          margin: 4rem auto;
          padding: 2rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: #fff;
        }
        h1 { margin: 0 0 1.5rem; font-size: 1.5rem; }
        label { display: block; margin-bottom: 0.25rem; font-size: 0.875rem; font-weight: 500; }
        input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
          box-sizing: border-box;
          margin-bottom: 1rem;
        }
        input:focus { outline: 2px solid #4338ca; outline-offset: 1px; }
        button[type="submit"] {
          width: 100%;
          padding: 0.625rem;
          background: #4338ca;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }
        button[type="submit"]:hover { background: #3730a3; }
        .toggle {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.875rem;
        }
        .toggle button {
          background: none;
          border: none;
          color: #4338ca;
          cursor: pointer;
          font-size: 0.875rem;
          padding: 0;
          text-decoration: underline;
        }
        .error {
          color: #dc2626;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          display: none;
        }
        .error.visible { display: block; }
        .success {
          color: #16a34a;
          font-size: 0.875rem;
          margin-bottom: 1rem;
          display: none;
        }
        .success.visible { display: block; }
      </style>
      <div class="container">
        <h1 id="title">Sign in</h1>
        <form id="auth-form" novalidate>
          <label for="email">Email</label>
          <input id="email" type="email" autocomplete="email" required />
          <label for="password">Password</label>
          <input id="password" type="password" autocomplete="current-password" required />
          <p class="error" id="error-msg"></p>
          <p class="success" id="success-msg"></p>
          <button type="submit" id="submit-btn">Sign in</button>
        </form>
        <div class="toggle">
          <span id="toggle-label">Don't have an account?</span>
          <button id="toggle-btn">Sign up</button>
        </div>
      </div>
    `;

    this._shadow = shadow;
    shadow.querySelector("#toggle-btn").addEventListener("click", () => this._toggleMode());
    shadow.querySelector("#auth-form").addEventListener("submit", (e) => this._handleSubmit(e));
  }

  _toggleMode() {
    this.#mode = this.#mode === "signin" ? "signup" : "signin";
    const isSignIn = this.#mode === "signin";
    this._shadow.querySelector("#title").textContent = isSignIn ? "Sign in" : "Sign up";
    this._shadow.querySelector("#submit-btn").textContent = isSignIn ? "Sign in" : "Sign up";
    this._shadow.querySelector("#toggle-label").textContent = isSignIn
      ? "Don't have an account?"
      : "Already have an account?";
    this._shadow.querySelector("#toggle-btn").textContent = isSignIn ? "Sign up" : "Sign in";
    this._clearMessages();
  }

  async _handleSubmit(e) {
    e.preventDefault();
    const email = this._shadow.querySelector("#email").value.trim();
    const password = this._shadow.querySelector("#password").value;
    this._clearMessages();

    try {
      if (this.#mode === "signin") {
        await signIn(email, password);
        Router.go("/");
      } else {
        await signUp(email, password);
        this._showSuccess("Account created! Check your email to confirm your account.");
      }
    } catch (err) {
      this._showError(err.message || "An error occurred. Please try again.");
    }
  }

  _showError(msg) {
    const el = this._shadow.querySelector("#error-msg");
    el.textContent = msg;
    el.classList.add("visible");
  }

  _showSuccess(msg) {
    const el = this._shadow.querySelector("#success-msg");
    el.textContent = msg;
    el.classList.add("visible");
  }

  _clearMessages() {
    this._shadow.querySelector("#error-msg").classList.remove("visible");
    this._shadow.querySelector("#success-msg").classList.remove("visible");
  }
}

customElements.define("page-login", PageLogin);
