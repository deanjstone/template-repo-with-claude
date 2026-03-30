import supabase from "../../services/supabase.js";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../../services/todos.js";

class PageTodos extends HTMLElement {
  #todos = [];

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { display: block; }
        h1 { margin-top: 0; }
        .add-form {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .add-form input {
          flex: 1;
          padding: 0.375rem 0.625rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 0.9375rem;
        }
        .add-form button {
          padding: 0.375rem 0.875rem;
          background: #4338ca;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.9375rem;
        }
        .add-form button:hover { background: #3730a3; }
        ul {
          list-style: none;
          margin: 0;
          padding: 0;
        }
        li {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.625rem 0;
          border-bottom: 1px solid #f3f4f6;
        }
        li:last-child { border-bottom: none; }
        li input[type="checkbox"] { cursor: pointer; }
        .todo-title {
          flex: 1;
          font-size: 0.9375rem;
        }
        .todo-title.done {
          text-decoration: line-through;
          color: #9ca3af;
        }
        .delete-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          font-size: 1rem;
          padding: 0 0.25rem;
        }
        .delete-btn:hover { color: #b91c1c; }
        .empty {
          color: #9ca3af;
          font-style: italic;
        }
        #error-msg {
          color: #dc2626;
          margin-bottom: 0.75rem;
          display: none;
        }
        #error-msg.visible { display: block; }
        .edge-section {
          margin-top: 2rem;
          padding-top: 1.25rem;
          border-top: 1px solid #e5e7eb;
        }
        .edge-section h2 { margin-top: 0; font-size: 1rem; }
        #call-fn-btn {
          padding: 0.375rem 0.875rem;
          background: #0891b2;
          color: #fff;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.9375rem;
        }
        #call-fn-btn:hover { background: #0e7490; }
        #fn-response {
          margin-top: 0.625rem;
          padding: 0.625rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.375rem;
          font-family: monospace;
          font-size: 0.875rem;
          display: none;
        }
        #fn-response.visible { display: block; }
      </style>
      <h1>Todos</h1>
      <div id="error-msg"></div>
      <form class="add-form" id="add-form">
        <input id="new-title" type="text" placeholder="New todo…" required />
        <button type="submit">Add</button>
      </form>
      <ul id="todo-list"></ul>
      <div class="edge-section">
        <h2>Edge Function</h2>
        <button id="call-fn-btn">Call hello function</button>
        <div id="fn-response"></div>
      </div>
    `;

    this._shadow = shadow;
    shadow.querySelector("#add-form").addEventListener("submit", (e) => this._handleAdd(e));
    shadow.querySelector("#call-fn-btn").addEventListener("click", () => this._callEdgeFn());

    this._loadTodos();
  }

  async _loadTodos() {
    try {
      this.#todos = await getTodos();
      this._render();
    } catch (err) {
      this._showError(err.message);
    }
  }

  _render() {
    const list = this._shadow.querySelector("#todo-list");
    if (this.#todos.length === 0) {
      list.innerHTML = `<li class="empty">No todos yet. Add one above!</li>`;
      return;
    }
    list.innerHTML = this.#todos
      .map(
        (todo) => `
      <li data-id="${todo.id}">
        <input type="checkbox" ${todo.is_complete ? "checked" : ""} data-action="toggle" />
        <span class="todo-title ${todo.is_complete ? "done" : ""}">${this._escape(todo.title)}</span>
        <button class="delete-btn" data-action="delete" aria-label="Delete">✕</button>
      </li>
    `
      )
      .join("");

    list.querySelectorAll("[data-action='toggle']").forEach((cb) => {
      cb.addEventListener("change", () => this._handleToggle(cb.closest("li").dataset.id));
    });
    list.querySelectorAll("[data-action='delete']").forEach((btn) => {
      btn.addEventListener("click", () => this._handleDelete(btn.closest("li").dataset.id));
    });
  }

  async _handleAdd(e) {
    e.preventDefault();
    const input = this._shadow.querySelector("#new-title");
    const title = input.value.trim();
    if (!title) return;

    // Optimistic: add placeholder immediately
    const optimistic = { id: `opt-${Date.now()}`, title, is_complete: false };
    this.#todos = [optimistic, ...this.#todos];
    this._render();
    input.value = "";

    try {
      const created = await createTodo(title);
      this.#todos = this.#todos.map((t) => (t.id === optimistic.id ? created : t));
      this._render();
    } catch (err) {
      // Revert optimistic update
      this.#todos = this.#todos.filter((t) => t.id !== optimistic.id);
      this._render();
      this._showError(err.message);
    }
  }

  async _handleToggle(id) {
    const todo = this.#todos.find((t) => t.id === id);
    if (!todo) return;
    const next = !todo.is_complete;

    // Optimistic update
    this.#todos = this.#todos.map((t) => (t.id === id ? { ...t, is_complete: next } : t));
    this._render();

    try {
      const updated = await updateTodo(id, { is_complete: next });
      this.#todos = this.#todos.map((t) => (t.id === id ? updated : t));
    } catch (err) {
      // Revert
      this.#todos = this.#todos.map((t) => (t.id === id ? { ...t, is_complete: !next } : t));
      this._render();
      this._showError(err.message);
    }
  }

  async _handleDelete(id) {
    const prev = [...this.#todos];

    // Optimistic removal
    this.#todos = this.#todos.filter((t) => t.id !== id);
    this._render();

    try {
      await deleteTodo(id);
    } catch (err) {
      // Revert
      this.#todos = prev;
      this._render();
      this._showError(err.message);
    }
  }

  async _callEdgeFn() {
    const btn = this._shadow.querySelector("#call-fn-btn");
    const responseEl = this._shadow.querySelector("#fn-response");
    btn.disabled = true;
    btn.textContent = "Calling…";
    try {
      const { data, error } = await supabase.functions.invoke("hello");
      if (error) throw error;
      responseEl.textContent = JSON.stringify(data, null, 2);
      responseEl.classList.add("visible");
    } catch (err) {
      responseEl.textContent = `Error: ${err.message}`;
      responseEl.classList.add("visible");
    } finally {
      btn.disabled = false;
      btn.textContent = "Call hello function";
    }
  }

  _showError(msg) {
    const el = this._shadow.querySelector("#error-msg");
    el.textContent = msg;
    el.classList.add("visible");
    setTimeout(() => el.classList.remove("visible"), 4000);
  }

  _escape(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
}

customElements.define("page-todos", PageTodos);
