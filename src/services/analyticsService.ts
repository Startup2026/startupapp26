import { apiFetch } from "@/lib/api";

export const analyticsService = {
  getStartupSummary: async (startupId: string) => {
    return await apiFetch(`/analytics/startup/${startupId}/summary`);
  },
  
  getPostTimeline: async (postId: string) => {
    return await apiFetch(`/analytics/post/${postId}/timeline`);
  },
  
  getPostAnalytics: async (postId: string) => {
      return await apiFetch(`/analytics/post/${postId}`);
  }
};
