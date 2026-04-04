import apiClient from '../../../axios';

// ─── Meeting Service ───────────────────────────────────────────────────────────
// Covers /api/v1/meetings/seeker/ (read-only) and
//        /api/v1/meetings/recruiter/ (full CRUD).
// Aligns with Jobryn API.yaml specification.
export const MeetingService = {

  // ── Seeker — read only ─────────────────────────────────────────────────────
  getSeekerMeetings: async (params = {}) => {
    const response = await apiClient.get('/meetings/seeker/', { params });
    return response.data;
  },

  getSeekerMeetingById: async (id: number | string) => {
    const response = await apiClient.get(`/meetings/seeker/${id}/`);
    return response.data;
  },

  // ── Recruiter — full CRUD ──────────────────────────────────────────────────
  getRecruiterMeetings: async (params = {}) => {
    const response = await apiClient.get('/meetings/recruiter/', { params });
    return response.data;
  },

  getRecruiterMeetingById: async (id: number | string) => {
    const response = await apiClient.get(`/meetings/recruiter/${id}/`);
    return response.data;
  },

  /** 
   * Schedule a new meeting (Recruiter only).
   * Matches Recruiter_Meeting schema from the spec.
   */
  scheduleMeeting: async (data: {
    application: number | string;
    meeting_type: 'online' | 'in_person' | 'phone';
    scheduled_at: string;          // ISO 8601 datetime
    meeting_link?: string | null;
    location_address?: string | null;
    duration_minutes?: number;
    agenda?: string;
  }) => {
    const response = await apiClient.post('/meetings/recruiter/', data);
    return response.data;
  },

  /** Update a meeting (full replace). */
  updateMeeting: async (id: number | string, data: any) => {
    const response = await apiClient.put(`/meetings/recruiter/${id}/`, data);
    return response.data;
  },

  /** Partially update a meeting (e.g. changing status or rescheduling time). */
  patchMeeting: async (id: number | string, data: {
    scheduled_at?: string;
    meeting_link?: string | null;
    location_address?: string | null;
    duration_minutes?: number;
    agenda?: string;
    status?: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  }) => {
    const response = await apiClient.patch(`/meetings/recruiter/${id}/`, data);
    return response.data;
  },

  /** Cancel / delete a meeting (Recruiter only). */
  deleteMeeting: async (id: number | string) => {
    await apiClient.delete(`/meetings/recruiter/${id}/`);
  },

  // ── Convenience helper ─────────────────────────────────────────────────────
  /** Fetch meetings based on the current user's role. */
  getMeetings: async (role: 'seeker' | 'recruiter', params = {}) => {
    const endpoint = role === 'recruiter'
      ? '/meetings/recruiter/'
      : '/meetings/seeker/';
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  },
};





