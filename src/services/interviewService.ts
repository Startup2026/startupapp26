import { apiFetch } from "@/lib/api";

export const interviewService = {
  scheduleInterview: async (applicationId: string, data: any) => {
    return await apiFetch(`/interviews/${applicationId}/schedule`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  getAllInterviews: async () => {
    return await apiFetch(`/interviews`, {
      method: "GET",
    });
  },

  rescheduleInterview: async (id: string, data: any) => {
    return await apiFetch(`/interviews/${id}/reschedule`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateInterviewStatus: async (id: string, status: string) => {
    return await apiFetch(`/interviews/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }
};
