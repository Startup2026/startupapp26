import { apiFetch } from '@/lib/api';

export interface StartupProfile {
  _id: string;
  userId: string;
  startupName: string;
  tagline?: string;
  description?: string;
  industry?: string;
  stage?: string;
  foundedYear?: string;
  teamSize?: string;
  website?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  logoUrl?: string;
  location?: string;
  techStack?: string[];
  openPositions?: number;
}

export interface CreateStartupProfileData {
  userId: string;
  startupName: string;
  tagline?: string;
  description?: string;
  industry?: string;
  stage?: string;
}

export const startupProfileService = {
  async createProfile(data: CreateStartupProfileData): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>('/startup-profiles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getProfiles(): Promise<{ success: boolean; data?: StartupProfile[]; error?: string }> {
    return apiFetch<StartupProfile[]>('/startup-profiles');
  },

  async getProfileById(id: string): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startup-profiles/${id}`);
  },

  async getMyProfile(): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>('/startup-profiles/me');
  },

  async updateProfile(id: string, data: Partial<StartupProfile>): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startup-profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteProfile(id: string): Promise<{ success: boolean; data?: StartupProfile; error?: string }> {
    return apiFetch<StartupProfile>(`/startup-profiles/${id}`, {
      method: 'DELETE',
    });
  },
};
