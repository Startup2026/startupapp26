import { apiFetch } from "@/lib/api";

export interface Job {
  _id: string;
  startupId: {
    _id: string;
    startupName: string;
    industry: string;
    location: any;
  } | string;
  role: string;
  aboutRole: string;
  keyResponsibilities?: string;
  requirements?: string;
  perksAndBenifits?: string;
  stipend: boolean;
  salary?: string;
  openings: number;
  deadline: string;
  jobType: string;
  location?: string;
  Tag: string[];
  createdAt: string;
}

export const jobService = {
  // Add ?random=true to the endpoints
  getColdStartJobs(page = 1, limit = 10) {
    return apiFetch(`/recommendations/cold-start/jobs?limit=${limit}&page=${page}&random=true`);
  },

  getRecommendedJobs(studentId: string, page = 1, limit = 10) {
    return apiFetch(`/recommendations/jobs/${studentId}?limit=${limit}&page=${page}&random=true`);
  },

  getAllJobs(): Promise<{ success: boolean; data?: Job[]; error?: string }> {
    return apiFetch<Job[]>('/get-all-jobs');
  },

  getJobById(id: string): Promise<{ success: boolean; data?: Job; error?: string }> {
    return apiFetch<Job>(`/get-job/${id}`);
  },

  createJob(data: any): Promise<{ success: boolean; data?: Job; error?: string }> {
    return apiFetch<Job>('/create-job', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateJob(id: string, data: any): Promise<{ success: boolean; data?: Job; error?: string }> {
    return apiFetch<Job>(`/update-job/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteJob(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    return apiFetch(`/delete-job/${id}`, {
      method: 'DELETE',
    });
  },
};
