import { beforeAll, describe, expect, it } from "vitest";
import { routes } from "../../router.js";

describe("routes", () => {
  it("defines a route for /", () => {
    const home = routes.find((r) => r.path === "/");
    expect(home).toBeDefined();
    expect(home.component).toBe("page-home");
  });

  it("defines a route for /login", () => {
    const login = routes.find((r) => r.path === "/login");
    expect(login).toBeDefined();
    expect(login.component).toBe("page-login");
  });

  it("defines a catch-all route for unknown paths", () => {
    const notFound = routes.find((r) => r.path === "(.*)");
    expect(notFound).toBeDefined();
    expect(notFound.component).toBe("page-not-found");
  });
});

describe("app-shell custom element", () => {
  beforeAll(async () => {
    await import("./app-shell.js");
  });

  it("is registered in the custom elements registry", () => {
    expect(customElements.get("app-shell")).toBeDefined();
  });
});
