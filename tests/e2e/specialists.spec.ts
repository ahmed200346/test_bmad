import { test, expect } from '@playwright/test';

test.describe('Specialist Management', () => {
  test('should create a new specialist and see them in the list', async ({ page }) => {
    await page.goto('/specialists');
    await page.click('text=Add Specialist');
    await page.fill('input[name="name"]', 'Test Engineer');
    await page.fill('input[name="skills"]', 'TypeScript, Next.js');
    await page.selectOption('select[name="seniority"]', 'Senior');
    await page.fill('input[name="hours"]', '40');
    await page.click('button:has-text("Create Specialist")');

    await expect(page.locator('text=Test Engineer')).toBeVisible();
  });

  test('should filter specialists by seniority', async ({ page }) => {
    await page.goto('/specialists');
    await page.selectOption('select[name="seniority"]', 'Senior');
    // Assume we have some senior specialists
    const specialists = page.locator('text=Senior');
    await expect(specialists).toBeVisible();
  });

  test('should deactivate a specialist', async ({ page }) => {
    await page.goto('/specialists');
    const firstSpecialist = page.locator('button:has-text("Deactivate")').first();
    await firstSpecialist.click();
    await expect(page.locator('text=Inactive')).toBeVisible();
  });
});
