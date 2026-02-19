import { test, expect } from '@playwright/test';

test('dev server is reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Linglix/);
});