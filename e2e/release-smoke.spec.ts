import { expect, test, type Page } from '@playwright/test';

type RoleConfig = {
  label: string;
  email: string | undefined;
  password: string | undefined;
  expectedPath: string;
  dashboardHeading: RegExp;
  coreRoutes: Array<{
    path: string;
    heading: RegExp;
  }>;
};

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return value;
  const trimmed = value.trim();
  // CMD set commands often include wrapping quotes as part of the value.
  return trimmed.replace(/^['\"](.*)['\"]$/, '$1');
}

const roleConfigs: RoleConfig[] = [
  {
    label: 'student',
    email: normalizeEnvValue(process.env.E2E_STUDENT_EMAIL),
    password: normalizeEnvValue(process.env.E2E_STUDENT_PASSWORD),
    expectedPath: '/student/dashboard',
    dashboardHeading: /Welcome back/i,
    coreRoutes: [
      { path: '/student/jobs', heading: /Job Listings/i },
      { path: '/student/feed', heading: /Startup Feed/i },
      { path: '/student/TrendingJobs', heading: /Trending Opportunities/i },
    ],
  },
  {
    label: 'startup',
    email: normalizeEnvValue(process.env.E2E_STARTUP_EMAIL),
    password: normalizeEnvValue(process.env.E2E_STARTUP_PASSWORD),
    expectedPath: '/startup/dashboard',
    dashboardHeading: /Trending Jobs/i,
    coreRoutes: [
      { path: '/startup/jobs', heading: /Job Posts/i },
      { path: '/startup/feed', heading: /Startup Feed/i },
      { path: '/startup/trending', heading: /Trending Opportunities/i },
    ],
  },
  {
    label: 'incubator',
    email: normalizeEnvValue(process.env.E2E_INCUBATOR_EMAIL),
    password: normalizeEnvValue(process.env.E2E_INCUBATOR_PASSWORD),
    expectedPath: '/incubator/dashboard',
    dashboardHeading: /Incubator Dashboard/i,
    coreRoutes: [
      { path: '/incubator/feed', heading: /Startup Feed/i },
      { path: '/incubator/trending', heading: /Trending Opportunities/i },
    ],
  },
];

async function loginViaUi(page: Page, email: string, password: string, expectedPath: string) {
  await page.goto('/login');
  await page.locator('#email').fill(email);
  await page.locator('#password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();

  try {
    await expect(page).toHaveURL(new RegExp(`${expectedPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), {
      timeout: 30000,
    });
  } catch (error) {
    const loginFailedMessage = await page.getByText(/Login failed|Invalid credentials|verify email|Please verify/i).first().textContent().catch(() => null);
    const currentUrl = page.url();
    throw new Error(
      `Login did not reach ${expectedPath}. Current URL: ${currentUrl}.` +
      (loginFailedMessage ? ` UI message: ${loginFailedMessage}` : ' No visible login error message found.'),
      { cause: error as Error }
    );
  }
}

test.describe('Release Smoke', () => {
  for (const roleConfig of roleConfigs) {
    test(`${roleConfig.label} can log in and complete final route checks`, async ({ page }) => {
      test.skip(!roleConfig.email || !roleConfig.password, `Missing ${roleConfig.label} release test credentials.`);

      await loginViaUi(page, roleConfig.email as string, roleConfig.password as string, roleConfig.expectedPath);
      await expect(page.getByRole('heading', { name: roleConfig.dashboardHeading }).first()).toBeVisible({ timeout: 30000 });

      for (const routeCheck of roleConfig.coreRoutes) {
        await page.goto(routeCheck.path);
        await expect(page).toHaveURL(new RegExp(`${routeCheck.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`), {
          timeout: 30000,
        });
        await expect(page.getByRole('heading', { name: routeCheck.heading }).first()).toBeVisible({ timeout: 30000 });
      }
    });
  }
});