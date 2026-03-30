import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../services/supabase.js", () => ({
  default: {
    functions: {
      invoke: vi.fn().mockResolvedValue({ data: { message: "Hello!" }, error: null }),
    },
  },
}));

vi.mock("../../services/todos.js", () => ({
  getTodos: vi.fn().mockResolvedValue([]),
  createTodo: vi.fn(),
  updateTodo: vi.fn(),
  deleteTodo: vi.fn(),
}));

import { createTodo, getTodos } from "../../services/todos.js";
import "./todos-page.js";

describe("PageTodos", () => {
  let element;

  beforeEach(async () => {
    getTodos.mockResolvedValue([]);
    element = document.createElement("page-todos");
    document.body.appendChild(element);
    await vi.waitFor(() => {
      expect(element.shadowRoot.querySelector("#todo-list")).not.toBeNull();
    });
  });

  afterEach(() => {
    element.remove();
    vi.clearAllMocks();
  });

  it("is registered in the custom elements registry", () => {
    expect(customElements.get("page-todos")).toBeDefined();
  });

  it("renders the add form", () => {
    const form = element.shadowRoot.querySelector("#add-form");
    expect(form).not.toBeNull();
    const input = element.shadowRoot.querySelector("#new-title");
    expect(input).not.toBeNull();
  });

  it("shows empty state when no todos", () => {
    const list = element.shadowRoot.querySelector("#todo-list");
    expect(list.textContent).toContain("No todos yet");
  });

  it("renders todos when loaded", async () => {
    element.remove();
    getTodos.mockResolvedValue([
      { id: "1", title: "Test todo", is_complete: false },
      { id: "2", title: "Done todo", is_complete: true },
    ]);

    element = document.createElement("page-todos");
    document.body.appendChild(element);

    await vi.waitFor(() => {
      const items = element.shadowRoot.querySelectorAll("li[data-id]");
      expect(items.length).toBe(2);
    });

    const firstItem = element.shadowRoot.querySelector("li[data-id='1'] .todo-title");
    expect(firstItem.textContent).toBe("Test todo");
    expect(firstItem.classList.contains("done")).toBe(false);

    const secondItem = element.shadowRoot.querySelector("li[data-id='2'] .todo-title");
    expect(secondItem.classList.contains("done")).toBe(true);
  });

  it("adds a todo optimistically", async () => {
    createTodo.mockResolvedValue({ id: "new-1", title: "New todo", is_complete: false });

    const input = element.shadowRoot.querySelector("#new-title");
    input.value = "New todo";
    const form = element.shadowRoot.querySelector("#add-form");
    form.dispatchEvent(new Event("submit", { cancelable: true }));

    await vi.waitFor(() => {
      const items = element.shadowRoot.querySelectorAll("li[data-id]");
      expect(items.length).toBe(1);
    });

    expect(createTodo).toHaveBeenCalledWith("New todo");
  });

  it("has an edge function call button", () => {
    const btn = element.shadowRoot.querySelector("#call-fn-btn");
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe("Call hello function");
  });

  it("escapes HTML in todo titles to prevent XSS", async () => {
    element.remove();
    getTodos.mockResolvedValue([
      { id: "xss", title: "<script>alert('xss')</script>", is_complete: false },
    ]);

    element = document.createElement("page-todos");
    document.body.appendChild(element);

    await vi.waitFor(() => {
      const item = element.shadowRoot.querySelector("li[data-id='xss'] .todo-title");
      expect(item).not.toBeNull();
      expect(item.textContent).toBe("<script>alert('xss')</script>");
      expect(item.innerHTML).not.toContain("<script>");
    });
  });
});
