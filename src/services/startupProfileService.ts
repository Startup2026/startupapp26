import { apiFetch } from '@/lib/api';
import type { AnyPlanName, PlanName } from '@/config/planFeatures';

export interface StartupProfile {
  _id: string;
  userId: string;
  startupName: string;
  tagline?: string;
  aboutus?: string;
  industry?: string;
  stage?: string;
  foundedYear?: number;
  teamSize?: number;
  website?: string;
  profilepic?: string;
  numberOfEmployees?: number;
  productOrService?: string;
  cultureAndValues?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  location?: {
    city?: string;
    country?: string;
  };
  leadershipTeam?: Array<{
    user?: string;
    role?: string;
  }>;
  hiring?: boolean;
  verified?: boolean;
  views?: number;
  subscriptionPlan: AnyPlanName;
  subscriptionStatus: "ACTIVE" | "TRIAL" | "EXPIRED";
  subscriptionEndDate?: string;
  eligibility_status?: string;
  approval_status?: string;
  incubatorId?: string | { _id: string; name: string } | null;
  incubator?: string;
  incubator_claimed?: boolean;
  incubator_verified?: boolean;
}

export interface CreateStartupProfileData {
  userId: string;
  startupName: string;
  tagline?: string;
  aboutus?: string;
  industry?: string;
  stage?: string;
  profilepic?: string;
  numberOfEmployees?: number;
  productOrService?: string;
  cultureAndValues?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  foundedYear?: number;
  teamSize?: number;
  location?: {
    city?: string;
    country?: string;
  };
  leadershipTeam?: Array<{
    user?: string;
    role?: string;
  }>;
  hiring?: boolean;
  // Verification fields
  brandName?: string;
  companyType?: string;
  registeredCity?: string;
  registeredState?: string;
  cin?: string;
  gstNumber?: string;
  startupIndiaId?: string;
  founderPhone?: string;
  founderEmail?: string;
  // Incubation
  incubator_claimed?: boolean;
  incubatorId?: string;
  incubator?: string;
  incubationCode?: string;
}

export const startupProfileService = {
  async createProfile(data: CreateStartupProfileData): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>('/startupProfile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfiles(): Promise<{ success: boolean; data?: StartupProfile[]; error?: string }> {
    return apiFetch<StartupProfile[]>('/startupProfiles');
  },

  async getProfileById(id: string): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startupProfile/${id}`);
  },

  async getMyProfile(): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>('/startupProfile/me');
  },

  async updateProfile(id: string, data: Partial<any>): Promise<{ success: boolean; data?: any; error?: string }> {
    return apiFetch<any>(`/startupProfile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProfile(id: string): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startupProfile/${id}`, {
      method: 'DELETE',
    });
  },

  async selectPlan(plan: PlanName): Promise<{ success: boolean; data?: any; error?: string }> {
    return apiFetch('/startupProfile/select-plan', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    });
  },
};
