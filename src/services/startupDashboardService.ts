import { apiFetch } from "@/lib/api";

export const startupDashboardService = {
  async setRecruiterPlan(data: { wantsRecruiterPlan: boolean }): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await apiFetch("/startup/recruiter-plan", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return res;
    } catch (error) {
      return { success: false, error: "An unexpected error occurred." };
    }
  },
};
