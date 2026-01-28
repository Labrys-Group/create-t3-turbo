import { expect, test } from "@playwright/test";

test.describe("example contact form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/example");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: /Contact Example/i }),
    ).toBeVisible();
  });

  test("shows validation errors on empty submission", async ({ page }) => {
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Name is required")).toBeVisible();
    await expect(page.getByText("Invalid email address")).toBeVisible();
    await expect(
      page.getByText("Message must be at least 10 characters"),
    ).toBeVisible();
  });

  test("shows email validation error for invalid email", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("not-an-email");
    await page.getByLabel("Message").fill("This is a valid message");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Invalid email address")).toBeVisible();
  });

  test("shows message validation error for short message", async ({
    page,
  }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("short");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Message must be at least 10 characters"),
    ).toBeVisible();
  });

  test("submits successfully with valid data", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("This is a valid test message");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(
      page.getByText("Thanks for your message!"),
    ).toBeVisible();
    await expect(
      page.getByText("We'll get back to you soon."),
    ).toBeVisible();
  });

  test("resets form after clicking send another", async ({ page }) => {
    await page.getByLabel("Name").fill("Jane Doe");
    await page.getByLabel("Email").fill("jane@example.com");
    await page.getByLabel("Message").fill("This is a valid test message");
    await page.getByRole("button", { name: "Submit" }).click();

    await expect(page.getByText("Thanks for your message!")).toBeVisible();

    await page.getByRole("button", { name: "Send another" }).click();

    await expect(page.getByLabel("Name")).toBeVisible();
    await expect(page.getByLabel("Name")).toHaveValue("");
    await expect(page.getByLabel("Email")).toHaveValue("");
    await expect(page.getByLabel("Message")).toHaveValue("");
  });
});
