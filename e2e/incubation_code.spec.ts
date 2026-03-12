import { expect, test } from "@playwright/test";

test.describe("Startup Incubation Code Journey", () => {
  test("Startup can submit profile with incubation code", async ({ page }) => {
    // Auth bootstrap
    await page.addInitScript(() => {
      localStorage.setItem("auth_token", "mock-startup-token");
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: "startup-user-1",
          role: "startup",
          email: "founder@acme.com",
          username: "Acme Founder",
          profileCompleted: false,
        })
      );
    });

    // Existing profile -> 404 means create flow
    await page.route("**/api/startupProfile/me", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ success: false, error: "Profile not found" }),
        });
        return;
      }

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            _id: "startup-profile-1",
            startupName: "Acme AI",
            approval_status: "Approved",
            eligibility_status: "Eligible Startup",
            subscriptionPlan: "FREE",
            incubator_claimed: true,
            incubator_verified: true,
            incubatorId: { _id: "inc-1", name: "Growth Lab" },
          },
        }),
      });
    });

    // Create profile endpoint capture
    let postedBody: any = null;
    await page.route("**/api/startupProfile", async (route) => {
      if (route.request().method() !== "POST") {
        await route.fallback();
        return;
      }

      postedBody = route.request().postDataJSON();
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            _id: "startup-profile-1",
            startupName: postedBody.startupName,
            approval_status: "Approved",
            eligibility_status: "Eligible Startup",
            subscriptionPlan: "FREE",
            incubator_claimed: true,
            incubator_verified: true,
            incubatorId: { _id: "inc-1", name: "Growth Lab" },
          },
        }),
      });
    });

    // Refresh user call
    await page.route("**/api/users/me", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          data: {
            _id: "startup-user-1",
            role: "startup",
            email: "founder@acme.com",
            username: "Acme Founder",
            profileCompleted: true,
          },
        }),
      });
    });

    await page.goto("/startup/create-profile");

    await page.fill('input[name="startupName"]', "Acme AI");
    await page.fill('input[name="tagline"]', "Hiring with confidence");

    const incubatorToggle = page.locator("#incubator_claimed");
    await incubatorToggle.check();

    const codeInput = page.locator("#incubationCode");
    await expect(codeInput).toBeVisible();
    await codeInput.fill("WOS-AB12CD34");

    await page.click('button[type="submit"]');

    await expect.poll(() => postedBody !== null).toBeTruthy();
    expect(postedBody.incubator_claimed).toBeTruthy();
    expect(postedBody.incubationCode).toBe("WOS-AB12CD34");
  });
});
