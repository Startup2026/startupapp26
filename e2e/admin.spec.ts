import { test, expect } from '@playwright/test';

test.describe('Admin Flow', () => {
    
  // Setup: Mock Admin Login
  test.beforeEach(async ({ page }) => {
    // 1. Mock Login API Response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        json: {
          success: true,
          data: {
             token: 'mock-admin-token',
             user: { 
                 _id: 'admin-123',
                 name: 'Super Admin', 
                 role: 'admin',
                 email: 'admin@example.com',
                 profileCompleted: true
             },
             onboardingStep: 'completed'
          }
        }
      });
    });

    // 2. Mock Admin Dashboard Stats (Hardcoded in UI, but just in case)
    // await page.route('**/api/admin/stats', async route => {});

    // 3. Navigate to Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
    
    // 4. Verify Admin Dashboard and wait for load
    await expect(page).toHaveURL(/\/admin\/dashboard/);
  });

  test('Admin can view dashboard stats', async ({ page }) => {
    // The dashboard has hardcoded stats in this version, so we check for their presence.
    // "Total Startups"
    await expect(page.locator('text=Total Startups')).toBeVisible();
    await expect(page.locator('text=Total Students')).toBeVisible();
    
    // Check for specific value "524" from hardcoded stats
    await expect(page.locator('text=524')).toBeVisible();
  });

  test('Admin can view and manage startups', async ({ page }) => {
      // 1. Mock Startups List API
      await page.route('**/api/startupProfiles', async route => {
          await route.fulfill({
              json: {
                  success: true,
                  data: [
                      { 
                          _id: 's1', 
                          startupName: 'TechFlow AI', 
                          industry: 'AI', 
                          teamSize: '10-50', 
                          verified: false 
                      },
                      { 
                          _id: 's2', 
                          startupName: 'GreenGrow', 
                          industry: 'AgriTech', 
                          teamSize: '1-10', 
                          verified: true 
                      }
                  ]
              }
          });
      });

      // 2. Navigate to Startups page via Sidebar
      // The Sidebar link has href="/admin/startups" directly in Link component
      await page.click('a[href="/admin/startups"]'); 
      
      // 3. Verify URL
      await expect(page).toHaveURL(/\/admin\/startups/);
      
      // 4. Verify Content
      await expect(page.locator('text=Startups Management')).toBeVisible();
      
      // Check for Startup Names in the table
      await expect(page.locator('text=TechFlow AI')).toBeVisible();
      await expect(page.locator('text=GreenGrow')).toBeVisible();
      
      // Check Status Badges
      await expect(page.locator('text=Pending')).toBeVisible();
      await expect(page.locator('text=Verified')).toBeVisible();
  });

});
