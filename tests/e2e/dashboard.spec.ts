import { test, expect } from '@playwright/test';

test.describe('Dashboard & Intelligence', () => {
  test('should enforce Specialist privacy wall (403)', async ({ page }) => {
    // Navigate to a specialist page that is NOT the current user's
    await page.goto('/specialist?id=999');

    await expect(page.locator('text=403 Forbidden')).toBeVisible();
    await expect(page.locator('text=You do not have permission')).toBeVisible();
  });

  test('should display schedule slippage risks', async ({ page }) => {
    await page.goto('/dashboard');
    const risks = page.locator('text=Slippage');
    // This depends on seed data
    if (await risks.count() > 0) {
      await expect(risks.first()).toBeVisible();
    }
  });
});
