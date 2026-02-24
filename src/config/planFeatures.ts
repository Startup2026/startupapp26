export const PLAN_FEATURES = {
  FREE: {
    maxActiveJobs: 2,
    maxInterviewsPerMonth: 5,
    analytics: "basic",
    bulkEmail: false,
    jobAnalysis: "basic",
    socialRecruiter: false,
    interviewCalendar: true,
  },
  GROWTH: {
    maxActiveJobs: 10,
    maxInterviewsPerMonth: 50,
    analytics: "advanced",
    bulkEmail: true,
    jobAnalysis: "basic",
    socialRecruiter: false,
    interviewCalendar: true,
  },
  PRO: {
    maxActiveJobs: 25,
    maxInterviewsPerMonth: 200,
    analytics: "full",
    bulkEmail: true,
    jobAnalysis: "advanced",
    socialRecruiter: true,
    interviewCalendar: true,
  },
  ENTERPRISE: {
    maxActiveJobs: Infinity,
    maxInterviewsPerMonth: Infinity,
    analytics: "custom",
    bulkEmail: true,
    jobAnalysis: "advanced",
    socialRecruiter: true,
    interviewCalendar: true,
    prioritySupport: true,
  }
} as const;

export type PlanName = keyof typeof PLAN_FEATURES;
export type FeatureKey = keyof typeof PLAN_FEATURES.FREE;
