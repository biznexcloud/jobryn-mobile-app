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

  postJob: async (data: any) => {
    try {
      const isLocalFile = data.image?.uri || (typeof data.image === 'string' && (data.image.startsWith('file://') || data.image.startsWith('content://')));
      
      if (isLocalFile) {
        const uri = data.image.uri || data.image;
        const filename = uri.split('/').pop() || 'job_poster.jpg';
        const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
        const mimeMap: Record<string, string> = {
          'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png',
          'gif': 'image/gif', 'webp': 'image/webp'
        };
        const type = mimeMap[extension] || 'image/jpeg';

        console.log('--- [DEBUG] Uploading Job Image via XHR:', { uri, type, filename });

        const formData = new FormData();
        // Append all fields except image first
        Object.keys(data).forEach(key => {
          if (key !== 'image' && data[key] !== undefined && data[key] !== null) {
            formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]));
          }
        });
        
        // Append image last
        formData.append('image', { uri, name: filename, type } as any);

        const { useAuthStore } = require('../../store/authStore');
        const token = useAuthStore.getState().token;
        const BASE_URL = 'https://backend.jobryn.com';

        const responseData = await new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', `${BASE_URL}/api/v1/jobs/recruiter/`);
          xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          xhr.setRequestHeader('Accept', 'application/json');

          xhr.onload = () => {
            console.log('--- [DEBUG] XHR Job Post Status:', xhr.status);
            if (xhr.status >= 200 && xhr.status < 300) {
              try { resolve(JSON.parse(xhr.responseText)); }
              catch { resolve(xhr.responseText); }
            } else {
              try {
                const errData = JSON.parse(xhr.responseText);
                const errMsg = errData.detail || JSON.stringify(errData);
                reject(new Error(errMsg || `Job upload failed (${xhr.status})`));
              } catch {
                reject(new Error(`Job upload failed (${xhr.status})`));
              }
            }
          };
          xhr.onerror = () => reject(new Error('Network error during job upload'));
          xhr.timeout = 60000; // Jobs might have large posters
          xhr.send(formData);
        });

        return responseData;
      } else {
        const response = await apiClient.post('/jobs/recruiter/', data);
        return response.data;
      }
    } catch (e: any) {
      console.error('[JobService] postJob failed:', e.message);
      throw e;
    }
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





