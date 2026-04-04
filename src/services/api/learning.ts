import apiClient from '../../../axios';

// ─── Learning Service ─────────────────────────────────────────────────────────
// Covers /api/v1/learning/courses/ and /api/v1/learning/enrollments/.
// Aligns with Jobryn API.yaml specification.
export const LearningService = {

  // ── Courses (/api/v1/learning/courses/) ───────────────────────────────────
  // Read-only. Admin creates/manages; both roles can view.
  getCourses: async (params = {}) => {
    const response = await apiClient.get('/learning/courses/', { params });
    return response.data;
  },

  getCourseById: async (id: number | string) => {
    const response = await apiClient.get(`/learning/courses/${id}/`);
    return response.data;
  },

  // ── Enrollments (/api/v1/learning/enrollments/) ───────────────────────────
  // Job Seekers: enroll and manage their own enrollments.
  // Recruiters: view enrollments in courses they instruct.
  getEnrollments: async (params = {}) => {
    const response = await apiClient.get('/learning/enrollments/', { params });
    return response.data;
  },

  getEnrollmentById: async (id: number | string) => {
    const response = await apiClient.get(`/learning/enrollments/${id}/`);
    return response.data;
  },

  enroll: async (courseId: number | string) => {
    const response = await apiClient.post('/learning/enrollments/', { course: courseId });
    return response.data;
  },

  updateEnrollment: async (id: number | string, data: any) => {
    const response = await apiClient.patch(`/learning/enrollments/${id}/`, data);
    return response.data;
  },

  updateProgress: async (enrollmentId: number | string, data: {
    progress_percentage?: number;
    completed?: boolean;
  }) => {
    const response = await apiClient.patch(`/learning/enrollments/${enrollmentId}/update_progress/`, data);
    return response.data;
  },

  unenroll: async (enrollmentId: number | string) => {
    await apiClient.delete(`/learning/enrollments/${enrollmentId}/`);
  },
};





