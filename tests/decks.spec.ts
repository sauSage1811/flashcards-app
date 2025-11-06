import { test, expect } from '@playwright/test';

test.describe('Deck Management', () => {
  test.beforeEach(async ({ page }) => {
    // This assumes you have a way to programmatically log in.
    // E.g., by setting the auth cookie directly after a mock API call.
    await page.goto('/auth/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });

  test('user can create a new deck and see it on the dashboard', async ({ page }) => {
    await page.click('a[href="/decks/new"]');
    await expect(page).toHaveURL('/decks/new');

    const deckTitle = `My Test Deck ${Date.now()}`;
    await page.fill('input[name="title"]', deckTitle);
    await page.fill('textarea[name="description"]', 'A deck for E2E testing.');
    await page.click('button[type="submit"]');

    // Should be redirected to the new deck's page or dashboard
    await page.waitForURL(/\/decks\//);

    // Verify the deck now appears on the main decks list/dashboard
    await page.goto('/decks');
    await expect(page.locator(`text=${deckTitle}`)).toBeVisible();
  });
});



