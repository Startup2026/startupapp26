export const PLAN_FEATURES = {
  FREE: {
    amount: 0,
    paymentTemporarilyDisabled: false,
    durationMonths: null,
    displayName: "Community Free",
    maxActiveJobs: 2,
    analytics: "basic",
    bulkEmail: true,
    jobAnalysis: "basic",
    socialRecruiter: false,
    interviewCalendar: true,
  },
  SPRINT_3MO: {
    amount: 999,
    originalAmount: 1999,
    discountLabel: "Launching Discount",
    paymentTemporarilyDisabled: false,
    durationMonths: 3,
    displayName: "Sprint · 3 Months",
    maxActiveJobs: 9999,
    analytics: "full",
    bulkEmail: true,
    jobAnalysis: "advanced",
    socialRecruiter: true,
    interviewCalendar: true,
    prioritySupport: true,
  },
  BUILDER_6MO: {
    amount: 1999,
    originalAmount: 2999,
    discountLabel: "Launching Discount",
    paymentTemporarilyDisabled: false,
    durationMonths: 6,
    displayName: "Builder · 6 Months",
    maxActiveJobs: 9999,
    analytics: "full",
    bulkEmail: true,
    jobAnalysis: "advanced",
    socialRecruiter: true,
    interviewCalendar: true,
    prioritySupport: true,
  },
  PARTNER_12MO: {
    amount: 3999,
    originalAmount: 4999,
    discountLabel: "Launching Discount",
    paymentTemporarilyDisabled: false,
    durationMonths: 12,
    displayName: "Partner · 12 Months",
    maxActiveJobs: 9999,
    analytics: "full",
    bulkEmail: true,
    jobAnalysis: "advanced",
    socialRecruiter: true,
    interviewCalendar: true,
    prioritySupport: true,
  }
} as const;

export const LEGACY_PLAN_ALIASES = {
  GROWTH: "SPRINT_3MO",
  PRO: "BUILDER_6MO",
  ENTERPRISE: "PARTNER_12MO",
} as const;

export type PlanName = keyof typeof PLAN_FEATURES;
export type LegacyPlanName = keyof typeof LEGACY_PLAN_ALIASES;
export type AnyPlanName = PlanName | LegacyPlanName;
export type FeatureKey = keyof typeof PLAN_FEATURES.FREE;

export const normalizePlanName = (plan?: string | null): PlanName => {
  if (!plan) return "FREE";
  const upper = plan.toString().toUpperCase();
  if (upper in PLAN_FEATURES) {
    return upper as PlanName;
  }
  if (upper in LEGACY_PLAN_ALIASES) {
    return LEGACY_PLAN_ALIASES[upper as LegacyPlanName];
  }
  return "FREE";
};
