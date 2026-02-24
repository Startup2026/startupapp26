import { test, expect } from '@playwright/test';

test.describe('Startup Applicant Management', () => {

  test.beforeEach(async ({ page }) => {
    // 1. Mock Login
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        json: {
          success: true,
          data: {
             token: 'mock-startup-token',
             user: { 
                 _id: 'startup-123',
                 name: 'Tech Startup',
                 role: 'startup',
                 email: 'startup@example.com' 
             },
             onboardingStep: 'completed'
          }
        }
      });
    });

    // 2. Mock Job Details
    await page.route('**/api/get-job/job-123', async route => {
        await route.fulfill({
            json: {
                success: true,
                data: {
                    _id: "job-123",
                    role: "Frontend Engineer",
                    startupId: "startup-123",
                    description: "Test Job"
                }
            }
        });
    });

    // 3. Mock Applications List
    // The page calls getAllApplications and filters client-side
    await page.route('**/api/applications', async route => {
        if (route.request().method() === 'GET') {
            await route.fulfill({
                json: {
                    success: true,
                    data: [
                        {
                            _id: "app-1",
                            jobId: "job-123",
                            studentId: {
                                _id: "student-1",
                                firstName: "John",
                                lastName: "Doe",
                                email: "john@example.com",
                                resumeUrl: "http://example.com/resume.pdf"
                            },
                            status: "APPLIED",
                            createdAt: new Date().toISOString(),
                            atsScore: 85
                        },
                        {
                            _id: "app-2",
                            jobId: "job-123",
                            studentId: {
                                _id: "student-2",
                                firstName: "Jane",
                                lastName: "Smith",
                                email: "jane@example.com"
                            },
                            status: "REJECTED",
                            createdAt: new Date().toISOString(),
                            atsScore: 40
                        }
                    ]
                }
            });
        } else {
            // Setup for update
            await route.continue();
        }
    });

    // 4. Mock Status Update
    await page.route('**/api/applications/app-1', async route => {
        if (route.request().method() === 'PUT' || route.request().method() === 'PATCH') {
            const body = route.request().postDataJSON();
            await route.fulfill({
                json: {
                    success: true,
                    data: {
                        _id: "app-1",
                        status: body.status
                    }
                }
            });
        } else {
            await route.continue();
        }
    });

    // 5. Navigate
    // Assuming we can go directly or via login
    await page.addInitScript(() => {
        window.localStorage.setItem('auth_token', 'mock-startup-token');
        window.localStorage.setItem('user', JSON.stringify({ 
            _id: 'startup-123', 
            role: 'startup', 
            name: 'Tech Startup'
        }));
    });
  });

  test('Startup can view and shortlist applicants', async ({ page }) => {
    // Go to specific job applications page
    await page.goto('/startup/jobs/job-123/applications');

    // Verify Page Title and Job Role
    await expect(page.locator('h1')).toContainText('Applications');
    // Use .first() to avoid strict mode violation if multiple elements (like breadcrumbs + table rows) match
    await expect(page.locator('text=Frontend Engineer').first()).toBeVisible();

    // Verify Applicant "John Doe" is present
    const johnRow = page.locator('tr').filter({ hasText: 'John Doe' });
    await expect(johnRow).toBeVisible();
    await expect(johnRow.locator('text=85%')).toBeVisible(); // Check ATS Score
    await expect(johnRow.locator('text=APPLIED')).toBeVisible(); // Check Status

    // Action: Shortlist John Doe
    // 1. Click the actions dropdown menu
    await johnRow.locator('button').last().click();

    // 2. Click "Shortlist" in the menu
    await page.click('div[role="menuitem"]:has-text("Shortlist")');

    // 3. Verify optimistic update or success toast
    // Use .first() or specific toast class to avoid hitting accessibility text duplicates
    await expect(page.locator('div:has-text("Status Updated")').first()).toBeVisible();
    
    // 4. Verify status badge changed
    // Use .first() because sometimes previous elements linger or animations
    await expect(johnRow.locator('text=SHORTLISTED')).toBeVisible();
  });

  test('Startup can reject an applicant', async ({ page }) => {
      await page.goto('/startup/jobs/job-123/applications');

      // Reject John Doe
      const johnRow = page.locator('tr').filter({ hasText: 'John Doe' });
      await johnRow.locator('button').last().click();
      await page.click('div[role="menuitem"]:has-text("Reject")');

      await expect(page.locator('div:has-text("Status Updated")').first()).toBeVisible();
      await expect(johnRow.locator('text=REJECTED')).toBeVisible();
  });

});
