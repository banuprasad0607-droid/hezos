import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test('unauthorized users are redirected to login', async ({ page }) => {
    // Attempt to access a protected route
    await page.goto('/dashboard');
    // Verify redirect to login page
    await expect(page).toHaveURL(/.*login.*/);
  });

  test('UI elements should render on login page', async ({ page }) => {
    await page.goto('/login');
    // Basic structural checks
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
