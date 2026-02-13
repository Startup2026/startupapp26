import { apiFetch } from '@/lib/api';

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

  async updateProfile(id: string, data: Partial<StartupProfile>): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startupProfile/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProfile(id: string): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startupProfile/${id}`, {
      method: 'DELETE',
    });
  },
};
