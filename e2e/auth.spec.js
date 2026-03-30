import { expect, test } from "@playwright/test";

test.describe("Auth flow", () => {
  test("unauthenticated user visiting / is redirected to /login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page shows sign-in form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("page-login")).toBeVisible();
    const shadow = page.locator("page-login");
    await expect(shadow.locator("#auth-form")).toBeVisible();
    await expect(shadow.locator("#email")).toBeVisible();
    await expect(shadow.locator("#password")).toBeVisible();
    await expect(shadow.locator("#submit-btn")).toHaveText("Sign in");
  });

  test("login page can toggle to sign-up mode", async ({ page }) => {
    await page.goto("/login");
    const shadow = page.locator("page-login");
    await shadow.locator("#toggle-btn").click();
    await expect(shadow.locator("#title")).toHaveText("Sign up");
    await expect(shadow.locator("#submit-btn")).toHaveText("Sign up");
  });

  test("login form shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    const shadow = page.locator("page-login");
    await shadow.locator("#email").fill("invalid@example.com");
    await shadow.locator("#password").fill("wrongpassword");
    await shadow.locator("#submit-btn").click();
    await expect(shadow.locator("#error-msg")).toBeVisible({ timeout: 5000 });
  });
});
