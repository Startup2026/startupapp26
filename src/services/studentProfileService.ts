import { apiFetch } from '@/lib/api';

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
}

export interface StudentProfile {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  education: Education[];
  skills?: string[];
  interests?: string[];
  experience?: any[];
  resumeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  profilepic?: string;
}

export interface CreateStudentProfileData {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  education?: Education[];
}

export const studentProfileService = {
  async createProfile(data: CreateStudentProfileData | FormData): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>('/student-profiles', {
      method: 'POST',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  async getProfiles(): Promise<{ success: boolean; data?: StudentProfile[]; error?: string }> {
    return apiFetch<StudentProfile[]>('/student-profiles');
  },

  async getProfileById(id: string): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>(`/student-profiles/${id}`);
  },

  async getMyProfile(): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>('/student-profiles/me');
  },

  async updateProfile(id: string, data: Partial<StudentProfile>): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>(`/student-profiles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateMyProfile(data: Partial<StudentProfile> | FormData): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>('/student-profiles/me', {
      method: 'PUT',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });
  },

  async deleteProfile(id: string): Promise<{ success: boolean; data?: StudentProfile; error?: string }> {
    return apiFetch<StudentProfile>(`/student-profiles/${id}`, {
      method: 'DELETE',
    });
  },
};
