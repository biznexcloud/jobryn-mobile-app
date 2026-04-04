import apiClient from '../../../axios';

// ─── Job Service ───────────────────────────────────────────────────────────────
// Covers /api/v1/jobs/seeker/ (read-only) and /api/v1/jobs/recruiter/ (full CRUD)
// plus /api/v1/applications/seeker/ and /api/v1/applications/recruiter/.
// Aligns with Jobryn API.yaml specification.
export const JobService = {

  /** Generic fetcher for paginated results when the API provides a full URL cursor. */
  getRecruiterApplicationsFromUrl: async (url: string) => {
    const response = await apiClient.get(url);
    return response.data;
  },

  // ── Seeker — browse and view jobs ─────────────────────────────────────────
  getJobs: async (params: {
    search?: string;
    job_type?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
    experience_level?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    is_remote?: boolean;
    is_onsite?: boolean;
    payment_type?: 'fixed' | 'payroll';
    ordering?: string;
    page?: number;
  } = {}) => {
    const response = await apiClient.get('/jobs/seeker/', { params });
    return response.data;
  },

  getJobById: async (id: string | number) => {
    const response = await apiClient.get(`/jobs/seeker/${id}/`);
    return response.data;
  },

  // ── Recruiter — manage own job postings ────────────────────────────────────
  getRecruiterJobs: async (params: {
    ordering?: string;
    page?: number;
  } = {}) => {
    const response = await apiClient.get('/jobs/recruiter/', { params });
    return response.data;
  },

  getRecruiterJobById: async (id: string | number) => {
    const response = await apiClient.get(`/jobs/recruiter/${id}/`);
    return response.data;
  },

  postJob: async (data: {
    title: string;
    description: string;
    location: string;
    job_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
    experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
    payment_type?: 'fixed' | 'payroll';
    is_onsite?: boolean;
    is_remote?: boolean;
    salary_min?: string | null;
    salary_max?: string | null;
    currency?: string;
    requirements?: string;
    benefits?: string;
    application_deadline?: string | null;
  }) => {
    const response = await apiClient.post('/jobs/recruiter/', data);
    return response.data;
  },

  updateJob: async (id: string | number, data: any) => {
    const response = await apiClient.patch(`/jobs/recruiter/${id}/`, data);
    return response.data;
  },

  replaceJob: async (id: string | number, data: any) => {
    const response = await apiClient.put(`/jobs/recruiter/${id}/`, data);
    return response.data;
  },

  deleteJob: async (id: string | number) => {
    await apiClient.delete(`/jobs/recruiter/${id}/`);
  },

  /** Toggle a job posting active/inactive (Recruiter only). */
  toggleJobStatus: async (id: number | string) => {
    const response = await apiClient.post(`/jobs/recruiter/${id}/toggle_active/`, {});
    return response.data;
  },

  // ── Applications — Seeker ──────────────────────────────────────────────────
  applyForJob: async (data: {
    job: number | string;
    cover_letter?: string;
    expected_salary?: string;
  }) => {
    const response = await apiClient.post('/applications/seeker/', data);
    return response.data;
  },

  getSeekerApplications: async (params = {}) => {
    const response = await apiClient.get('/applications/seeker/', { params });
    return response.data;
  },

  getSeekerApplicationById: async (id: number | string) => {
    const response = await apiClient.get(`/applications/seeker/${id}/`);
    return response.data;
  },

  /** Withdraw an application (Seeker only). */
  withdrawApplication: async (id: number | string) => {
    const response = await apiClient.patch(`/applications/seeker/${id}/`, { status: 'withdrawn' });
    return response.data;
  },

  // ── Applications — Recruiter ───────────────────────────────────────────────
  getRecruiterApplications: async (params: {
    job?: number;
    status?: string;
    page?: number;
  } = {}) => {
    const response = await apiClient.get('/applications/recruiter/', { params });
    return response.data;
  },

  getRecruiterApplicationById: async (id: number | string) => {
    const response = await apiClient.get(`/applications/recruiter/${id}/`);
    return response.data;
  },

  /** Update the status of an application (Recruiter only). */
  updateApplicationStatus: async (id: number | string, status: 
    'applied' | 'screening' | 'online_meeting' | 'onsite_meeting' | 'hired' | 'rejected',
    extra?: { rejection_reason?: string; feedback_for_seeker?: string }
  ) => {
    const response = await apiClient.patch(`/applications/recruiter/${id}/update_status/`, { 
      status,
      ...extra
    });
    return response.data;
  },

  // ── Saved Jobs ─────────────────────────────────────────────────────────────
  getSavedJobs: async () => {
    // Placeholder to prevent crash; aligns with earlier dashboard logic
    const response = await apiClient.get('/jobs/seeker/saved/');
    return response.data;
  },

  /** Alias for backward compatibility with restored seeker screens */
  getAppliedJobs: async (params = {}) => {
    return JobService.getSeekerApplications(params);
  },
};





