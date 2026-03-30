import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../../services/auth.js", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
}));

vi.mock("@vaadin/router", () => ({
  Router: { go: vi.fn() },
}));

import { signIn, signUp } from "../../services/auth.js";
import "./login-page.js";

describe("PageLogin", () => {
  let element;

  beforeEach(() => {
    element = document.createElement("page-login");
    document.body.appendChild(element);
  });

  afterEach(() => {
    element.remove();
    vi.clearAllMocks();
  });

  it("is registered in the custom elements registry", () => {
    expect(customElements.get("page-login")).toBeDefined();
  });

  it("renders sign-in form by default", () => {
    const title = element.shadowRoot.querySelector("#title");
    expect(title.textContent).toBe("Sign in");
    const submitBtn = element.shadowRoot.querySelector("#submit-btn");
    expect(submitBtn.textContent).toBe("Sign in");
  });

  it("toggles to sign-up mode when toggle button is clicked", () => {
    const toggleBtn = element.shadowRoot.querySelector("#toggle-btn");
    toggleBtn.click();

    const title = element.shadowRoot.querySelector("#title");
    expect(title.textContent).toBe("Sign up");
    const submitBtn = element.shadowRoot.querySelector("#submit-btn");
    expect(submitBtn.textContent).toBe("Sign up");
  });

  it("toggles back to sign-in mode on second click", () => {
    const toggleBtn = element.shadowRoot.querySelector("#toggle-btn");
    toggleBtn.click();
    toggleBtn.click();

    const title = element.shadowRoot.querySelector("#title");
    expect(title.textContent).toBe("Sign in");
  });

  it("shows error message on sign-in failure", async () => {
    signIn.mockRejectedValue(new Error("Invalid credentials"));

    const email = element.shadowRoot.querySelector("#email");
    const password = element.shadowRoot.querySelector("#password");
    email.value = "test@example.com";
    password.value = "password123";

    const form = element.shadowRoot.querySelector("#auth-form");
    form.dispatchEvent(new Event("submit", { cancelable: true }));

    await vi.waitFor(() => {
      const errorMsg = element.shadowRoot.querySelector("#error-msg");
      expect(errorMsg.classList.contains("visible")).toBe(true);
      expect(errorMsg.textContent).toBe("Invalid credentials");
    });
  });

  it("shows success message on sign-up", async () => {
    signUp.mockResolvedValue({});

    const toggleBtn = element.shadowRoot.querySelector("#toggle-btn");
    toggleBtn.click();

    const email = element.shadowRoot.querySelector("#email");
    const password = element.shadowRoot.querySelector("#password");
    email.value = "test@example.com";
    password.value = "password123";

    const form = element.shadowRoot.querySelector("#auth-form");
    form.dispatchEvent(new Event("submit", { cancelable: true }));

    await vi.waitFor(() => {
      const successMsg = element.shadowRoot.querySelector("#success-msg");
      expect(successMsg.classList.contains("visible")).toBe(true);
      expect(successMsg.textContent).toContain("Account created");
    });
  });

  it("has email and password inputs", () => {
    const email = element.shadowRoot.querySelector("#email");
    const password = element.shadowRoot.querySelector("#password");
    expect(email).not.toBeNull();
    expect(email.type).toBe("email");
    expect(password).not.toBeNull();
    expect(password.type).toBe("password");
  });
});
