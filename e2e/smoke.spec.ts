import { test, expect } from "@playwright/test";

test("home page loads", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "AniTrack" })).toBeVisible();
});

test("explore page loads", async ({ page }) => {
  await page.goto("/explore");
  await expect(page.getByRole("heading", { name: "Explore" })).toBeVisible();
});

test("login page loads", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
});

test("protected routes redirect to login", async ({ page }) => {
  await page.goto("/watchlist");
  await expect(page).toHaveURL(/\/login/);
});
