import { test, expect } from '@playwright/test';

test.describe('Startup Job Management', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Login as Startup
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        json: {
          success: true,
          data: {
             token: 'mock-startup-token',
             user: { 
                 _id: 'startup-user-123',
                 name: 'Tech Inc', 
                 role: 'startup',
                 email: 'startup@example.com' 
             },
             onboardingStep: 'completed'
          }
        }
      });
    });

    // 2. Mock Startup Profile (Required for posting jobs)
    // Note: Service calls /startupProfile/me, but our previous mock might have used /api/startups/profile/my-profile
    // Let's check startupProfileService.ts: getMyProfile uses '/startupProfile/me'
    // So the mock URL should be '**/api/startupProfile/me'
    await page.route('**/api/startupProfile/me', async route => {
      await route.fulfill({
        json: {
          success: true,
          data: { 
            _id: 'startup-profile-123', 
            companyName: 'Tech Inc',
            subscriptionPlan: 'FREE' 
          }
        }
      });
    });
    
    // 3. Mock Existing Jobs List (Empty initially)
    await page.route('**/api/jobs', async route => {
      if (route.request().method() === 'GET') {
          await route.fulfill({ json: { success: true, data: [] } });
      } else {
          await route.continue();
      }
    });

    // 4. Mock Applications (for job counts)
    await page.route('**/api/applications', async route => {
       await route.fulfill({ json: { success: true, data: [] } });
    });

    // Login and Go to Jobs
    await page.goto('/login');
    await page.fill('input[type="email"]', 'startup@example.com');
    await page.fill('input[type="password"]', 'password');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/startup\/dashboard/);
    
    await page.goto('/startup/jobs');
  });

  test('Startup can post a new job', async ({ page }) => {
    // 1. Mock Job Creation API
    // Correct Endpoint from jobService.ts is /create-job NOT /jobs
    await page.route('**/api/create-job', async route => {
      if (route.request().method() === 'POST') {
          const payload = route.request().postDataJSON();
          // specific check or just return success
          await route.fulfill({
              json: { success: true, data: { ...payload, _id: 'new-job-1' } }
          });
      } else {
          await route.continue(); // GET requests
      }
    });

    // 2. Click "Post Job"
    // We already mocked the profile in beforeEach and set it up to return the correct plan.
    // However, if the page doesn't fetch it again or if the mock isn't hitting, we might have issues.
    // The previous timeout suggests the reload didn't trigger the fetch or it happened too fast.
    
    // Let's rely on the text content to verify state instead of waiting for network blindly if it's flaky.
    // Ensure we are on the page.
    await expect(page).toHaveURL(/\/startup\/jobs/);

    // Wait for the "Post Job" button to be potentially interactive.
    await page.waitForTimeout(1000);

    // Capture the profile fetch that happens when modal opens to ensure startupId is set
    // AND using the correct URL based on service definition
    const modalProfileFetch = page.waitForResponse(resp => 
        resp.url().includes('/api/startupProfile/me') && resp.status() === 200
    );

    await page.click('button:has-text("Post Job")');
    
    // Wait for modal to have fetched the profile
    await modalProfileFetch;

    // 4. Fill Modal Form
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    
    // Check for Upgrade Modal content
    const upgradeContent = dialog.getByText('GROWTH', { exact: false });
    if (await upgradeContent.count() > 0) {
         throw new Error('Upgrade plan modal appeared instead of Create Job modal. Limit check failed likely due to missing profile data.');
    }

    await page.fill('input[name="role"]', 'Frontend Engineer');
    await page.fill('textarea[name="aboutRole"]', 'We are looking for a rockstar React developer.');
    
    // Select Job Type (Select element)
    await page.selectOption('select[name="jobType"]', 'Full-Time');
    
    await page.fill('input[name="location"]', 'Remote');
    
    // Added fields that actually exist in the modal to prevent validation issues or timeouts checks
    await page.fill('input[name="openings"]', '2');
    await page.fill('input[name="experienceRequired"]', '3');
    
    // 4. Submit
    // Wait for the POST request to complete to ensure backend (mock) processed it
    const createJobPromise = page.waitForResponse(resp => 
        resp.url().includes('/api/create-job') && resp.request().method() === 'POST' && resp.status() === 200
    );
    await page.click('button[type="submit"]');
    await createJobPromise;

    // 5. Verify Success

    // 5. Verify Success
    // Check for Toast with exact match for title to avoid duplicates with the container
    await expect(page.getByText('Job Posted', { exact: true }).first()).toBeVisible();
    
    // Use a more inclusive locator for the description if exact text match is flaky
    // or if it's part of a larger text block.
    await expect(page.locator('text=has been published successfully').first()).toBeVisible();
  });

});
