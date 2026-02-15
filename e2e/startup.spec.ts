import { test, expect } from '@playwright/test';

test.describe('Startup Onboarding Flow', () => {

  test('Startup Login & Onboarding Redirection', async ({ page }) => {
    // 1. Mock Login Response
    await page.route('**/api/auth/login', async route => {
      const json = {
        success: true,
        data: {
             token: 'mock-startup-token',
             user: { 
                 _id: 'startup-123',
                 name: 'New Startup',
                 role: 'startup',
                 email: 'startup@example.com' 
             },
             onboardingStep: 'profile'
        }
      };
      await route.fulfill({ json });
    });

    // 2. Visit Login
    await page.goto('/login');

    // 3. Perform Login
    await page.fill('#email', 'startup@example.com');
    await page.fill('#password', 'securepassword');
    
    await page.click('button[type="submit"]');

    // 4. Verify Redirection based on Step (profile)
    await expect(page).toHaveURL(/\/startup\/create-profile/);
  });
});
