import { test, expect } from '@playwright/test';

test.describe('Allocation Engine', () => {
  test('should block allocation exceeding 100% capacity', async ({ page }) => {
    await page.goto('/allocate');

    // 1. Select a specialist and a large task
    await page.selectOption('select:has-text("Task Selection")', { index: 1 });
    await page.selectOption('select:has-text("Specialist Selection")', { index: 1 });

    // 2. Verify the validation message appears (assuming the task is large enough)
    await expect(page.locator('text=Capacity Exceeded')).toBeVisible();
    await expect(page.locator('button:has-text("Save Allocation")')).toBeDisabled();
  });

  test('should allow override for over-capacity allocation', async ({ page }) => {
    await page.goto('/allocate');
    await page.selectOption('select:has-text("Task Selection")', { index: 1 });
    await page.selectOption('select:has-text("Specialist Selection")', { index: 1 });

    await page.click('button:has-text("Request Override")');
    await page.fill('textarea', 'Critical business need for emergency fix');
    await page.selectOption('select', 'Critical');
    await page.click('button:has-text("Confirm Override")');

    await expect(page.locator('text=Allocation saved successfully')).toBeVisible();
  });
});
