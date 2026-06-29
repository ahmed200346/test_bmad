import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test('should reject task duration less than 0.25h', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('button:has-text("Add Task")');
    await page.fill('input[name="name"]', 'Short Task');
    await page.fill('input[name="duration"]', '0.1');
    await page.click('button:has-text("Create Task")');

    await expect(page.locator('text=Task duration must be at least 0.25 hours')).toBeVisible();
  });

  test('should block circular dependencies', async ({ page }) => {
    await page.goto('/tasks');
    await page.click('button:has-text("Link Dependency")');

    // This requires existing tasks, usually seeded in a real test env
    // Mocking the flow: Select Task A as parent, Task A as child
    const selects = page.locator('select');
    await selects.nth(0).selectOption({ index: 1 }); // Parent
    await selects.nth(1).selectOption({ index: 1 }); // Child
    await page.click('button:has-text("Create Dependency")');

    await expect(page.locator('text=Circular dependencies are not permitted')).toBeVisible();
  });
});
