import { apiFetch } from '@/lib/api';
import { Job } from './jobService';

export interface Application {
  _id: string;
  atsScore: number;
  status: 'APPLIED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED'; // Add other statuses as needed
  jobId: Job; // Populated
  studentId: {
    _id: string;
    firstname: string;
    lastname: string;
  }; // Populated
  resumeUrl?: string;
  createdAt: string;
}

export const applicationService = {
  async getAllApplications(): Promise<{ success: boolean; data?: Application[]; error?: string }> {
    return apiFetch<Application[]>('/applications');
  },

  async updateApplication(id: string, data: any): Promise<{ success: boolean; data?: Application; error?: string }> {
    return apiFetch<Application>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async getJobApplicants(jobId: string): Promise<{ success: boolean; count?: number; data?: Application[]; error?: string }> {
    const res = await apiFetch<Application[]>(`/applications/job/${jobId}`);
    return res as any;
  },

  async getHiringAnalytics(jobId?: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const query = jobId && jobId !== 'all' ? `?jobId=${jobId}` : '';
    return apiFetch<any>(`/analytics/hiring/summary${query}`);
  },
};
