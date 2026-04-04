import apiClient from '../../../axios';

// ─── Portfolio Service ────────────────────────────────────────────────────────
// Covers Education, Experience, Certifications, Projects, Skills, Endorsements.
// All endpoints align with Jobryn API.yaml specification.
export const PortfolioService = {

  // ── Education (/api/v1/educations/) ───────────────────────────────────────
  getEducation: async (params = {}) => {
    const response = await apiClient.get('/educations/', { params });
    return response.data;
  },

  addEducation: async (data: any) => {
    const response = await apiClient.post('/educations/', data);
    return response.data;
  },

  updateEducation: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/educations/${id}/`, data);
    return response.data;
  },

  replaceEducation: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/educations/${id}/`, data);
    return response.data;
  },

  deleteEducation: async (id: number | string) => {
    await apiClient.delete(`/educations/${id}/`);
  },

  // ── Experience (/api/v1/experiences/) ─────────────────────────────────────
  getExperience: async (params = {}) => {
    const response = await apiClient.get('/experiences/', { params });
    return response.data;
  },

  addExperience: async (data: any) => {
    const response = await apiClient.post('/experiences/', data);
    return response.data;
  },

  updateExperience: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/experiences/${id}/`, data);
    return response.data;
  },

  replaceExperience: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/experiences/${id}/`, data);
    return response.data;
  },

  deleteExperience: async (id: number | string) => {
    await apiClient.delete(`/experiences/${id}/`);
  },

  // ── Certifications (/api/v1/certifications/certifications/) ───────────────
  getCertifications: async (params = {}) => {
    const response = await apiClient.get('/certifications/certifications/', { params });
    return response.data;
  },

  addCertification: async (data: any) => {
    const response = await apiClient.post('/certifications/certifications/', data);
    return response.data;
  },

  updateCertification: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/certifications/certifications/${id}/`, data);
    return response.data;
  },

  replaceCertification: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/certifications/certifications/${id}/`, data);
    return response.data;
  },

  deleteCertification: async (id: number | string) => {
    await apiClient.delete(`/certifications/certifications/${id}/`);
  },

  // ── Projects (/api/v1/projects/projects/) ─────────────────────────────────
  getProjects: async (params = {}) => {
    const response = await apiClient.get('/projects/projects/', { params });
    return response.data;
  },

  addProject: async (data: any) => {
    const response = await apiClient.post('/projects/projects/', data);
    return response.data;
  },

  updateProject: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/projects/projects/${id}/`, data);
    return response.data;
  },

  replaceProject: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/projects/projects/${id}/`, data);
    return response.data;
  },

  deleteProject: async (id: number | string) => {
    await apiClient.delete(`/projects/projects/${id}/`);
  },

  // ── Global Skills (/api/v1/skills/global/) ────────────────────────────────
  // Previously used /skills/ which was INCORRECT. The API spec defines /skills/global/
  getGlobalSkills: async (params = {}) => {
    const response = await apiClient.get('/skills/global/', { params });
    return response.data;
  },

  // ── User Skills (/api/v1/skills/user-skills/) ─────────────────────────────
  getUserSkills: async (params = {}) => {
    const response = await apiClient.get('/skills/user-skills/', { params });
    return response.data;
  },

  addUserSkill: async (data: {
    skill: number;
    proficiency_level?: 'beginner' | 'intermediate' | 'expert' | 'master';
    years_of_experience?: number;
    is_featured?: boolean;
  }) => {
    const response = await apiClient.post('/skills/user-skills/', data);
    return response.data;
  },

  updateUserSkill: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/skills/user-skills/${id}/`, data);
    return response.data;
  },

  deleteUserSkill: async (id: number | string) => {
    await apiClient.delete(`/skills/user-skills/${id}/`);
  },

  // ── Skill Endorsements (/api/v1/skills/endorsements/) ─────────────────────
  getEndorsements: async (params = {}) => {
    const response = await apiClient.get('/skills/endorsements/', { params });
    return response.data;
  },

  addEndorsement: async (data: { user_skill: number }) => {
    const response = await apiClient.post('/skills/endorsements/', data);
    return response.data;
  },

  deleteEndorsement: async (id: number | string) => {
    await apiClient.delete(`/skills/endorsements/${id}/`);
  },
};





