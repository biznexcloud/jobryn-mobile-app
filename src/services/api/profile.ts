import apiClient from '../../../axios';

// ─── Types ────────────────────────────────────────────────────────────────────
export type VisibilitySettings = 'public' | 'private' | 'connections';
export type ProficiencyLevel = 'beginner' | 'intermediate' | 'expert' | 'master';

// ─── Profile Service ──────────────────────────────────────────────────────────
// Wraps /api/v1/profiles/ endpoints.
// The API has separate seeker/recruiter profile endpoints.
export const ProfileService = {

  // ── Seeker Profile ─────────────────────────────────────────────────────────
  getSeekerProfiles: async (params = {}) => {
    const response = await apiClient.get('/profiles/seeker/', { params });
    return response.data;
  },

  getSeekerProfile: async (id: number | string) => {
    const response = await apiClient.get(`/profiles/seeker/${id}/`);
    return response.data;
  },

  createSeekerProfile: async (data: any) => {
    const response = await apiClient.post('/profiles/seeker/', data);
    return response.data;
  },

  updateSeekerProfile: async (id: number | string, data: any) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.patch(`/profiles/seeker/${id}/`, data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  replaceSeekerProfile: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/profiles/seeker/${id}/`, data);
    return response.data;
  },

  deleteSeekerProfile: async (id: number | string) => {
    await apiClient.delete(`/profiles/seeker/${id}/`);
  },

  // ── Recruiter Profile ──────────────────────────────────────────────────────
  getRecruiterProfiles: async (params = {}) => {
    const response = await apiClient.get('/profiles/recruiter/', { params });
    return response.data;
  },

  getRecruiterProfile: async (id: number | string) => {
    const response = await apiClient.get(`/profiles/recruiter/${id}/`);
    return response.data;
  },

  createRecruiterProfile: async (data: any) => {
    const response = await apiClient.post('/profiles/recruiter/', data);
    return response.data;
  },

  updateRecruiterProfile: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/profiles/recruiter/${id}/`, data);
    return response.data;
  },

  replaceRecruiterProfile: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/profiles/recruiter/${id}/`, data);
    return response.data;
  },

  deleteRecruiterProfile: async (id: number | string) => {
    await apiClient.delete(`/profiles/recruiter/${id}/`);
  },

  // ── Account (basic user identity) ─────────────────────────────────────────
  getAccountProfile: async () => {
    const response = await apiClient.get('/account/profile/');
    return response.data;
  },

  updateAccountProfile: async (data: any) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.put('/account/profile/', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },
};





